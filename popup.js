document.addEventListener('DOMContentLoaded', function() {
  const extractBtn = document.getElementById('extract-btn');
  const statusDiv = document.getElementById('status');
  const statusText = document.getElementById('status-text');
  const messageDiv = document.getElementById('message');
  const contentDiv = document.getElementById('content');

  extractBtn.addEventListener('click', async function() {
    try {
      // Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Check if it's a ChatGPT page
      if (!tab.url || (!tab.url.includes('chatgpt.com') && !tab.url.includes('chat.openai.com'))) {
        showMessage('error', '此页面不支持提取。请在 ChatGPT 对话页面使用此插件。');
        return;
      }

      // Show loading state
      showStatus('提取中...');
      extractBtn.disabled = true;

      // Ensure content script is injected
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
      } catch (e) {
        // Content script might already be injected, that's fine
        console.log('Content script injection attempt:', e.message);
      }

      // Wait a bit for script to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      // Send message to content script to extract conversation
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'extract' });

      if (response && response.success) {
        // Generate markdown file
        const markdown = generateMarkdown(response.data, tab.url);
        const filename = generateFilename();
        
        // Download the file
        await downloadFile(markdown, filename);
        
        hideStatus();
        showMessage('success', `成功提取 ${response.data.messages.length} 条消息！文件已下载。`);
      } else {
        hideStatus();
        showMessage('error', response?.error || '提取失败，请刷新页面重试。');
      }
    } catch (error) {
      hideStatus();
      console.error('Extract error:', error);
      if (error.message.includes('Could not establish connection')) {
        showMessage('error', '无法连接到页面。请刷新 ChatGPT 页面后重试。');
      } else {
        showMessage('error', '提取失败：' + error.message);
      }
    } finally {
      extractBtn.disabled = false;
    }
  });

  function showStatus(text) {
    statusText.textContent = text;
    statusDiv.classList.remove('hidden');
    contentDiv.style.display = 'none';
  }

  function hideStatus() {
    statusDiv.classList.add('hidden');
    contentDiv.style.display = 'block';
  }

  function showMessage(type, text) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.classList.remove('hidden');
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
      setTimeout(() => {
        messageDiv.classList.add('hidden');
      }, 3000);
    }
  }

  function generateMarkdown(data, url) {
    const now = new Date().toISOString();
    const conversationId = extractConversationId(url);
    
    let markdown = '---\n';
    markdown += 'platform: chatgpt\n';
    markdown += `url: ${url}\n`;
    markdown += `timestamp: ${now}\n`;
    if (conversationId) {
      markdown += `conversation_id: ${conversationId}\n`;
    }
    markdown += 'extractor_version: 0.1.0\n';
    markdown += '---\n\n';

    // Add messages
    for (const message of data.messages) {
      const role = message.role === 'user' ? 'User' : 'Assistant';
      markdown += `## ${role}\n\n`;
      markdown += message.content + '\n\n';
    }

    return markdown;
  }

  function extractConversationId(url) {
    const match = url.match(/\/c\/([a-zA-Z0-9-]+)/);
    return match ? match[1] : null;
  }

  function generateFilename() {
    const now = new Date();
    const timestamp = now.toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '')
      .replace('T', '_');
    return `contextbridge_chatgpt_${timestamp}_raw.md`;
  }

  async function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    await chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: false
    });
    
    // Clean up the blob URL after a short delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
});

