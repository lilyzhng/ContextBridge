// Content script for extracting ChatGPT conversations

// Prevent multiple injections
if (window.contextBridgeInjected) {
  console.log('ContextBridge: Already injected, skipping');
} else {
  window.contextBridgeInjected = true;
  console.log('ContextBridge: Content script initialized');

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('ContextBridge: Received message:', request);
    
    if (request.action === 'extract') {
      try {
        const result = extractConversation();
        console.log('ContextBridge: Extraction result:', result);
        sendResponse(result);
      } catch (error) {
        console.error('ContextBridge: Extraction error:', error);
        sendResponse({
          success: false,
          error: error.message
        });
      }
    }
    return true; // Keep the message channel open for async response
  });
}

function extractConversation() {
  const messages = [];
  
  // ChatGPT uses different selectors depending on the version
  // Try multiple strategies to find conversation messages
  
  // Strategy 1: Look for data-message-id attributes (newer ChatGPT)
  let messageElements = document.querySelectorAll('[data-message-author-role]');
  
  // Strategy 2: Look for conversation turn structure (fallback)
  if (messageElements.length === 0) {
    messageElements = document.querySelectorAll('[class*="ConversationTurn"]');
  }
  
  // Strategy 3: Look for common message container patterns
  if (messageElements.length === 0) {
    messageElements = document.querySelectorAll('main [class*="group"]');
  }

  if (messageElements.length === 0) {
    return {
      success: false,
      error: '未检测到对话内容。请确保页面已完全加载。'
    };
  }

  // Extract messages
  messageElements.forEach((element) => {
    try {
      const message = extractMessage(element);
      if (message) {
        messages.push(message);
      }
    } catch (error) {
      console.warn('Failed to extract message:', error);
    }
  });

  if (messages.length === 0) {
    return {
      success: false,
      error: '未能提取到有效内容。对话可能为空或格式不支持。'
    };
  }

  return {
    success: true,
    data: {
      messages: messages,
      extractedAt: new Date().toISOString()
    }
  };
}

function extractMessage(element) {
  // Determine role
  let role = 'assistant';
  const roleAttr = element.getAttribute('data-message-author-role');
  
  if (roleAttr) {
    role = roleAttr === 'user' ? 'user' : 'assistant';
  } else {
    // Fallback: try to detect based on class names or position
    const classes = element.className || '';
    if (classes.includes('user') || element.querySelector('[class*="user"]')) {
      role = 'user';
    }
  }

  // Extract content
  let content = '';
  
  // Try to find the message content container
  let contentElement = element.querySelector('[data-message-id]') || 
                       element.querySelector('[class*="markdown"]') ||
                       element.querySelector('[class*="prose"]') ||
                       element;

  // If this is a wrapper, try to get the actual content div
  const possibleContent = contentElement.querySelector('.markdown, .prose, [class*="whitespace-pre-wrap"]');
  if (possibleContent) {
    contentElement = possibleContent;
  }

  content = extractContent(contentElement);

  // Skip if content is empty
  if (!content.trim()) {
    return null;
  }

  return {
    role: role,
    content: content.trim()
  };
}

function extractContent(element) {
  let markdown = '';
  
  // Process child nodes recursively
  for (const node of element.childNodes) {
    markdown += processNode(node);
  }
  
  return markdown.trim();
}

function processNode(node) {
  // Text node
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }
  
  // Element node
  if (node.nodeType === Node.ELEMENT_NODE) {
    const tag = node.tagName.toLowerCase();
    
    // Code blocks
    if (tag === 'pre') {
      const codeElement = node.querySelector('code');
      if (codeElement) {
        const language = extractLanguage(codeElement);
        const code = codeElement.textContent;
        return `\`\`\`${language}\n${code}\n\`\`\`\n\n`;
      }
      return `\`\`\`\n${node.textContent}\n\`\`\`\n\n`;
    }
    
    // Inline code
    if (tag === 'code') {
      return `\`${node.textContent}\``;
    }
    
    // Headings
    if (tag.match(/^h[1-6]$/)) {
      const level = tag.charAt(1);
      const hashes = '#'.repeat(parseInt(level));
      return `${hashes} ${node.textContent}\n\n`;
    }
    
    // Paragraphs
    if (tag === 'p') {
      let content = '';
      for (const child of node.childNodes) {
        content += processNode(child);
      }
      return content + '\n\n';
    }
    
    // Line breaks
    if (tag === 'br') {
      return '\n';
    }
    
    // Lists
    if (tag === 'ul' || tag === 'ol') {
      let list = '\n';
      const items = node.querySelectorAll(':scope > li');
      items.forEach((item, index) => {
        const prefix = tag === 'ul' ? '- ' : `${index + 1}. `;
        let itemContent = '';
        for (const child of item.childNodes) {
          itemContent += processNode(child);
        }
        list += prefix + itemContent.trim() + '\n';
      });
      return list + '\n';
    }
    
    // Links
    if (tag === 'a') {
      const href = node.getAttribute('href') || '';
      const text = node.textContent;
      return `[${text}](${href})`;
    }
    
    // Bold
    if (tag === 'strong' || tag === 'b') {
      return `**${node.textContent}**`;
    }
    
    // Italic
    if (tag === 'em' || tag === 'i') {
      return `*${node.textContent}*`;
    }
    
    // Images
    if (tag === 'img') {
      const alt = node.getAttribute('alt') || 'Image';
      const src = node.getAttribute('src') || '';
      return `![${alt}](${src})`;
    }
    
    // Tables
    if (tag === 'table') {
      return extractTable(node);
    }
    
    // Divs and other containers - process children
    if (tag === 'div' || tag === 'span' || tag === 'section') {
      let content = '';
      for (const child of node.childNodes) {
        content += processNode(child);
      }
      return content;
    }
    
    // Fallback: just get text content
    return node.textContent;
  }
  
  return '';
}

function extractLanguage(codeElement) {
  // Try to detect language from class names
  const classes = codeElement.className || '';
  const langMatch = classes.match(/language-(\w+)/);
  if (langMatch) {
    return langMatch[1];
  }
  
  // Check parent pre element
  const preElement = codeElement.closest('pre');
  if (preElement) {
    const preClasses = preElement.className || '';
    const preLangMatch = preClasses.match(/language-(\w+)/);
    if (preLangMatch) {
      return preLangMatch[1];
    }
  }
  
  return '';
}

function extractTable(tableElement) {
  let markdown = '\n';
  
  const rows = tableElement.querySelectorAll('tr');
  if (rows.length === 0) return '';
  
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    const cellContents = Array.from(cells).map(cell => cell.textContent.trim());
    
    markdown += '| ' + cellContents.join(' | ') + ' |\n';
    
    // Add header separator after first row
    if (rowIndex === 0) {
      markdown += '| ' + cellContents.map(() => '---').join(' | ') + ' |\n';
    }
  });
  
  return markdown + '\n';
}

