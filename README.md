# ContextBridge - Chrome Extension

A minimalist Chrome extension for extracting ChatGPT conversations into clean Markdown files for context management and long-term memory building.

## Features

✨ **Simple & Focused**: One-click extraction of ChatGPT conversations  
📝 **Markdown Export**: Preserves formatting, code blocks, lists, and links  
🎯 **Faithful Extraction**: No summarization or noise removal - just raw transcripts  
💾 **Automatic Download**: Saves conversations with timestamps and metadata  

## Installation

### Development Mode

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the `ContextBridge` folder
6. The extension icon should appear in your toolbar

### Creating Icons (Optional)

The extension requires PNG icons. You can convert the SVG to PNG using any tool:

```bash
# Using ImageMagick (if installed)
convert -background none -density 300 icons/icon.svg -resize 16x16 icons/icon16.png
convert -background none -density 300 icons/icon.svg -resize 48x48 icons/icon48.png
convert -background none -density 300 icons/icon.svg -resize 128x128 icons/icon128.png
```

Or use an online converter: https://cloudconvert.com/svg-to-png

For now, the extension will work without icons (Chrome will show a default placeholder).

## Usage

1. Open a ChatGPT conversation at https://chatgpt.com
2. Click the ContextBridge extension icon in your toolbar
3. Click "提取对话" (Extract Conversation)
4. The conversation will be downloaded as a Markdown file

### File Format

Downloaded files follow this naming pattern:
```
contextbridge_chatgpt_20260117_103000_raw.md
```

The file contains:
- YAML frontmatter with metadata (platform, URL, timestamp, conversation ID)
- Clean Markdown with User/Assistant turns
- Preserved formatting (code blocks, lists, links, tables)

Example:
```markdown
---
platform: chatgpt
url: https://chatgpt.com/c/abc123
timestamp: 2026-01-17T10:30:00Z
conversation_id: abc123
extractor_version: 0.1.0
---

## User
How do I implement a binary search tree?

## Assistant
Here's a simple implementation...
```

## Supported Platforms

**Current Version**: ChatGPT only
- ✅ https://chatgpt.com
- ✅ https://chat.openai.com

**Future**: Claude, Gemini support coming in later versions

## Troubleshooting

### "此页面不支持提取"
- Make sure you're on a ChatGPT conversation page
- The extension only works on chatgpt.com or chat.openai.com

### "未检测到对话内容"
- Ensure the conversation has fully loaded
- Try scrolling through the conversation first
- Refresh the page and try again

### "提取失败"
- Check the browser console for detailed errors (F12 → Console)
- ChatGPT may have changed their HTML structure
- Report the issue with console logs

## Privacy

ContextBridge:
- ✅ Runs entirely locally in your browser
- ✅ No data sent to external servers
- ✅ No analytics or tracking
- ✅ Only accesses ChatGPT pages when you click the extract button
- ✅ Open source - review the code yourself

## Development

### Project Structure
```
ContextBridge/
├── manifest.json       # Extension configuration
├── popup.html         # Extension popup UI
├── popup.css          # Popup styles
├── popup.js           # Popup logic
├── content.js         # ChatGPT page content extraction
├── icons/             # Extension icons
└── design_doc/        # Project documentation
```

### Key Files
- **content.js**: DOM extraction logic for ChatGPT
- **popup.js**: UI logic and Markdown generation
- **manifest.json**: Chrome extension configuration

## Roadmap

### v0.1.0 (Current)
- ✅ ChatGPT conversation extraction
- ✅ Markdown export with metadata
- ✅ Basic error handling

### Future Versions
- [ ] Claude support
- [ ] Gemini support
- [ ] Export format options (JSON, plain text)
- [ ] Conversation diff detection
- [ ] Auto-save to local folders

## Contributing

Issues and pull requests welcome! Please check the design document in `design_doc/plan.md` for the project vision.

## License

MIT License - feel free to use and modify as needed.

---

**Note**: This is an independent tool and is not affiliated with OpenAI, Anthropic, or Google.

