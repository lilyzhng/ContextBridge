# Troubleshooting Guide

## Common Issues and Solutions

### Installation Issues

#### ❌ Extension won't load
**Error**: "Manifest file is missing or unreadable"

**Solutions**:
1. Make sure you selected the correct folder (the one containing `manifest.json`)
2. Check that all files are present (manifest.json, popup.html, content.js, etc.)
3. Verify JSON syntax in manifest.json is valid

#### ❌ Extension loads but shows errors
**Solutions**:
1. Check the Errors tab on `chrome://extensions/`
2. Click "Details" → "Errors" to see specific issues
3. Most common: missing icon files (this is OK - extension still works)

---

### Usage Issues

#### ❌ "此页面不支持提取" (Page not supported)
**Reason**: You're not on a ChatGPT page

**Solutions**:
1. Make sure URL is `chatgpt.com/*` or `chat.openai.com/*`
2. Make sure you're on a conversation page, not the home page
3. Try refreshing the page

#### ❌ "未检测到对话内容" (No conversation detected)
**Reason**: Page not fully loaded or empty conversation

**Solutions**:
1. Wait for the page to fully load
2. Scroll through the conversation to ensure all messages are loaded
3. If it's a new conversation with no messages, send a message first
4. Refresh the page and try again

#### ❌ Extension icon doesn't do anything when clicked
**Solutions**:
1. Check if popup is blocked - look for a small icon in the address bar
2. Try closing and reopening the browser
3. Reload the extension on `chrome://extensions/`
4. Check browser console (F12) for JavaScript errors

#### ❌ "提取失败" (Extraction failed)
**Solutions**:
1. Open browser DevTools (F12) → Console tab
2. Look for red error messages
3. Common causes:
   - ChatGPT changed their HTML structure
   - Content script didn't inject properly
   - Page permissions issue
4. Try:
   - Refreshing the page
   - Reloading the extension
   - Opening the conversation in a new tab

---

### Output Issues

#### ❌ File downloads but is empty or corrupted
**Solutions**:
1. Check if file size is > 0 bytes
2. Open in a plain text editor first (not Word or rich text editor)
3. Try extracting again
4. Check Downloads folder permissions

#### ❌ File has wrong content or missing messages
**Solutions**:
1. Scroll through entire conversation before extracting
2. ChatGPT lazy-loads messages - make sure all are visible
3. Check if conversation has branches - only current branch is extracted
4. For very long conversations, wait a bit longer for extraction to complete

#### ❌ Code blocks not formatted correctly
**Solutions**:
1. This is expected if ChatGPT didn't specify the language
2. You can manually add language tags: ` ```python ` instead of ` ``` `
3. If completely missing, ChatGPT may have changed code block structure

#### ❌ Special characters look wrong (�, ?, etc.)
**Solutions**:
1. Make sure you're opening the file in UTF-8 encoding
2. Use a proper markdown editor (VS Code, Obsidian, etc.)
3. Don't open in Notepad on Windows (use Notepad++ or VS Code)

---

### Performance Issues

#### ❌ Extraction takes a very long time
**Expected**: 
- 10-50 messages: <2 seconds
- 100 messages: <5 seconds
- 200+ messages: may take 10+ seconds

**Solutions if too slow**:
1. Close other tabs to free up memory
2. Disable other extensions temporarily
3. Check CPU usage - maybe other apps are running
4. Try extracting in smaller chunks (not ideal but works)

#### ❌ Browser freezes or becomes unresponsive
**Solutions**:
1. Wait it out - may just be processing a very long conversation
2. If truly frozen (>30 seconds), close the tab
3. Try reducing conversation length by starting a new conversation
4. Check browser console for infinite loops or errors

---

### Browser Compatibility

#### ✅ Confirmed Working
- Chrome 100+
- Microsoft Edge (Chromium-based)
- Brave Browser
- Vivaldi

#### ❌ Not Supported
- Firefox (different extension format)
- Safari (different extension format)
- Internet Explorer (please don't)
- Old Chrome versions (<90)

---

## Debug Mode

### Enable Detailed Logging

1. **Open DevTools Console**:
   - Right-click on page → Inspect
   - Or press F12
   - Click "Console" tab

2. **Look for ContextBridge Messages**:
   ```
   ContextBridge content script loaded
   ```
   This should appear when you load a ChatGPT page

3. **During Extraction**:
   - Watch for errors (red text)
   - Check message counts
   - Look for extraction progress

### Common Console Errors

**"Cannot read property of undefined"**
- ChatGPT changed their HTML structure
- Extraction selectors need updating

**"chrome.tabs.sendMessage: Could not establish connection"**
- Content script not loaded
- Try refreshing the page
- Reload the extension

**"Receiving end does not exist"**
- Tab closed before extraction completed
- Try again

---

## Getting Help

### Before Reporting an Issue

1. Check this troubleshooting guide
2. Try the solutions listed above
3. Test with a different conversation
4. Try reloading the extension
5. Check if ChatGPT itself is working properly

### When Reporting an Issue

Please include:
1. **Browser version**: Chrome version number
2. **ChatGPT URL**: The conversation URL
3. **Error message**: Exact text or screenshot
4. **Console logs**: Copy from DevTools Console (F12)
5. **Steps to reproduce**: What you did before the error
6. **Conversation length**: Approximate number of messages

### Debug Checklist

- [ ] Tried on chatgpt.com URL
- [ ] Page fully loaded
- [ ] Extension appears in toolbar
- [ ] Developer mode enabled
- [ ] No errors on chrome://extensions/
- [ ] Console shows "content script loaded"
- [ ] Tried refreshing the page
- [ ] Tried reloading extension
- [ ] Tried in incognito mode
- [ ] Tried with a simple 2-message conversation

---

## Known Limitations

### By Design (MVP Scope)
- ✋ Only ChatGPT supported (Claude/Gemini coming later)
- ✋ Only current conversation branch extracted
- ✋ Streaming responses captured as-is (partial if still typing)
- ✋ Images saved as placeholders, not downloaded
- ✋ No automatic re-extraction or versioning

### Technical Limitations
- ⚠️ Depends on ChatGPT's HTML structure (may break if they update)
- ⚠️ Very long conversations (500+ messages) may be slow
- ⚠️ Custom ChatGPT features may not extract perfectly
- ⚠️ Requires conversation to be visible/scrolled to extract

---

## Tips for Best Results

### ✨ Do This:
- ✅ Wait for full page load
- ✅ Scroll through long conversations first
- ✅ Extract one conversation at a time
- ✅ Keep extension updated
- ✅ Use latest Chrome version

### ⚠️ Avoid This:
- ❌ Extracting while assistant is still typing
- ❌ Switching tabs during extraction
- ❌ Extracting from search results or home page
- ❌ Using very old ChatGPT conversations (pre-2023)

---

## Still Having Issues?

1. **Try the nuclear option**:
   - Remove the extension completely
   - Close and reopen Chrome
   - Re-install the extension fresh
   - Test with a brand new ChatGPT conversation

2. **Check ChatGPT Status**:
   - Make sure ChatGPT itself is working
   - Try without the extension
   - Check if OpenAI has announced changes

3. **Browser Issues**:
   - Clear cache and cookies
   - Disable other extensions temporarily
   - Try in incognito mode
   - Update Chrome to latest version

---

**Most issues are resolved by refreshing the page or reloading the extension!** 🔄

