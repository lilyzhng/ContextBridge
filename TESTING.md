# Testing Guide

## Manual Testing Checklist

### 1. Load the Extension
- [ ] Open `chrome://extensions/`
- [ ] Enable Developer mode
- [ ] Load unpacked extension
- [ ] Extension appears in toolbar (may show default icon)
- [ ] No errors in extension error console

### 2. Test on ChatGPT Page
- [ ] Go to https://chatgpt.com
- [ ] Start or open a conversation
- [ ] Click ContextBridge icon
- [ ] Popup opens correctly
- [ ] UI displays properly

### 3. Test Extraction - Simple Conversation
Create a test conversation:
```
User: Hello
Assistant: Hi! How can I help you today?
User: What is 2+2?
Assistant: 2+2 equals 4.
```

- [ ] Click "提取对话" button
- [ ] Status shows "提取中..."
- [ ] Success message appears
- [ ] File downloads automatically
- [ ] File contains 4 messages (2 user, 2 assistant)
- [ ] Content matches conversation

### 4. Test Extraction - Complex Content

Test with conversation containing:

**Code Blocks:**
```
User: Write a hello world in Python
Assistant: [should extract code block with language tag]
```

**Lists:**
```
User: Give me 3 tips
Assistant: [should extract as markdown list]
```

**Links:**
```
User: Share a link
Assistant: Here's a link: [text](url)
```

- [ ] Code blocks preserved with language tags
- [ ] Lists formatted as markdown
- [ ] Links preserved as `[text](url)`
- [ ] Inline code formatted with backticks

### 5. Test Error Cases

**Wrong Page:**
- [ ] Open google.com
- [ ] Click extension
- [ ] Shows "此页面不支持提取" error

**Empty Conversation:**
- [ ] Open ChatGPT but no conversation
- [ ] Shows appropriate error message

**Page Not Loaded:**
- [ ] Click extension immediately after navigation
- [ ] Handles gracefully

### 6. Test File Output

Check downloaded file:
- [ ] Filename format: `contextbridge_chatgpt_YYYYMMDD_HHMMSS_raw.md`
- [ ] Contains YAML frontmatter
- [ ] Has platform: chatgpt
- [ ] Has valid URL
- [ ] Has ISO timestamp
- [ ] Has conversation_id (if available)
- [ ] Has extractor_version: 0.1.0
- [ ] Messages formatted as `## User` / `## Assistant`
- [ ] Content readable and properly formatted

### 7. Edge Cases

**Long Conversation:**
- [ ] Test with 20+ messages
- [ ] Extracts in reasonable time (<5 seconds)
- [ ] All messages captured

**Streaming Response:**
- [ ] Ask question and extract while assistant is typing
- [ ] Captures partial response

**Special Characters:**
- [ ] Test with emojis, unicode, special symbols
- [ ] Preserved correctly in output

**Multiple Tabs:**
- [ ] Open 2 ChatGPT conversations
- [ ] Extract from each tab
- [ ] Correct conversation extracted each time

## Console Testing

Open browser console (F12) and check:
- [ ] No JavaScript errors
- [ ] Content script loads: "ContextBridge content script loaded"
- [ ] Extension messages logged correctly

## Debugging Tips

If extraction fails:
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors
4. Check which selectors are being used
5. Inspect ChatGPT's HTML structure

Common issues:
- ChatGPT changed their HTML structure
- Content script not injected
- Permissions not granted
- Page not fully loaded

## Performance Testing

- [ ] Extract time for 10 messages: _____ seconds
- [ ] Extract time for 50 messages: _____ seconds
- [ ] Extract time for 100 messages: _____ seconds
- [ ] Memory usage acceptable
- [ ] No browser lag or freezing

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Chrome (one version back)
- [ ] Chromium-based Edge

## Success Criteria

✅ All basic tests pass
✅ Complex content preserved
✅ Error cases handled gracefully
✅ Performance acceptable (<5s for 100 messages)
✅ No console errors
✅ Files downloadable and readable

---

**Ready for real-world testing!** 🚀

