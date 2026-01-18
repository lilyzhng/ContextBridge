# ContextBridge - Installation Guide

## Quick Start (Without Icons)

The extension works fine without custom icons - Chrome will show a default placeholder icon.

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `ContextBridge` folder
6. Done! Look for the extension in your toolbar

## Adding Custom Icons (Optional)

If you want custom icons, you need to create PNG files from the SVG:

### Option 1: Online Converter (Easiest)
1. Go to https://cloudconvert.com/svg-to-png
2. Upload `icons/icon.svg`
3. Convert to 16x16, 48x48, and 128x128 sizes
4. Save as `icon16.png`, `icon48.png`, `icon128.png` in the `icons/` folder

### Option 2: Command Line (Mac/Linux)
If you have ImageMagick installed:

```bash
cd ContextBridge/icons
convert -background none -density 300 icon.svg -resize 16x16 icon16.png
convert -background none -density 300 icon.svg -resize 48x48 icon48.png
convert -background none -density 300 icon.svg -resize 128x128 icon128.png
```

### Option 3: Use Any Image Editor
Open `icons/icon.svg` in any image editor and export as PNG at the required sizes.

## Testing

1. Go to https://chatgpt.com
2. Open any conversation
3. Click the ContextBridge extension icon
4. Click "提取对话"
5. Check your Downloads folder for the Markdown file

## Troubleshooting

**Extension not showing up?**
- Make sure Developer mode is enabled
- Try reloading the extension
- Check for errors in `chrome://extensions/`

**Click doesn't do anything?**
- Open browser console (F12) and check for errors
- Make sure you're on a ChatGPT page
- Try refreshing the page

**Icons showing as gray puzzle pieces?**
- This is normal if you haven't created the PNG icons yet
- The extension still works perfectly!

