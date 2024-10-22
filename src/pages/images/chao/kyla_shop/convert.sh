#!/bin/bash

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null; then
    echo "ImageMagick is not installed. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install imagemagick
    elif command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y imagemagick
    elif command -v yum &> /dev/null; then
        sudo yum install -y imagemagick
    else
        echo "Please install ImageMagick manually"
        exit 1
    fi
fi

# Find all HEIC files (case insensitive) and convert them
for file in *.[Hh][Ee][Ii][Cc]; do
    # Skip if no HEIC files are found
    [[ -e "$file" ]] || continue
    
    # Get filename without extension
    filename="${file%.*}"
    
    echo "Converting $file to ${filename}.jpg"
    magick "$file" "${filename}.jpg"
    
    # Check if conversion was successful
    if [ $? -eq 0 ]; then
        echo "Successfully converted $file"
    else
        echo "Failed to convert $file"
    fi
done

echo "All conversions completed!"