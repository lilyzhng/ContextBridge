#!/bin/bash
# Simple script to create placeholder PNG icons from SVG
# This creates basic colored squares if ImageMagick is not available

if command -v convert &> /dev/null; then
    echo "ImageMagick found, creating icons from SVG..."
    convert -background none -density 300 icon.svg -resize 16x16 icon16.png
    convert -background none -density 300 icon.svg -resize 48x48 icon48.png
    convert -background none -density 300 icon.svg -resize 128x128 icon128.png
    echo "Icons created successfully!"
else
    echo "ImageMagick not found."
    echo "Please create PNG icons manually or use an online converter."
    echo "Visit: https://cloudconvert.com/svg-to-png"
fi
