# ContextBridge - Quick Start

## 🚀 Installation (2 minutes)

1. **Open Chrome Extensions Page**
   - Type `chrome://extensions/` in your address bar
   - Or: Chrome Menu → Extensions → Manage Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to and select the `ContextBridge` folder
   - The extension should appear in your extensions list

4. **Pin the Extension (Optional)**
   - Click the puzzle piece icon in Chrome toolbar
   - Find ContextBridge
   - Click the pin icon to keep it visible

## ✨ Usage (30 seconds)

1. **Go to ChatGPT**
   - Open https://chatgpt.com
   - Navigate to any conversation

2. **Extract Conversation**
   - Click the ContextBridge icon in your toolbar
   - Click "提取对话" button
   - Wait for the success message

3. **Find Your File**
   - Check your Downloads folder
   - Look for `contextbridge_chatgpt_[timestamp]_raw.md`
   - Open in any text editor or Obsidian

## 📝 Example Output

Your exported file will look like this:

```markdown
---
platform: chatgpt
url: https://chatgpt.com/c/abc123
timestamp: 2026-01-17T10:30:00Z
conversation_id: abc123
extractor_version: 0.1.0
---

## User
How do I create a Chrome extension?

## Assistant
Creating a Chrome extension involves several steps...

[Full conversation continues...]
```

## ⚠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Extension not showing | Reload the extension on `chrome://extensions/` |
| "此页面不支持提取" | Make sure you're on chatgpt.com |
| "未检测到对话内容" | Refresh the page and wait for full load |
| No download | Check Chrome download permissions |

## 🎯 What Works

✅ Text content extraction
✅ Code blocks with syntax highlighting
✅ Lists (ordered and unordered)
✅ Links and formatting
✅ Tables
✅ Inline code
✅ Long conversations (100+ messages)

## 🔧 About Icons

The extension works without custom icons (you'll see a gray placeholder). To add custom icons:

1. Use the included `icons/icon.svg`
2. Convert to PNG at sizes: 16x16, 48x48, 128x128
3. Save as `icon16.png`, `icon48.png`, `icon128.png` in the `icons/` folder
4. Reload the extension

**Online converter:** https://cloudconvert.com/svg-to-png

## 📚 Next Steps

- Read `README.md` for full documentation
- See `TESTING.md` for testing guidelines
- Check `design_doc/plan.md` for project roadmap

## 🐛 Found a Bug?

Check the browser console for errors:
1. Right-click on the page → Inspect
2. Go to Console tab
3. Look for ContextBridge-related errors

---

**Ready to extract!** Happy context bridging! 🌉

