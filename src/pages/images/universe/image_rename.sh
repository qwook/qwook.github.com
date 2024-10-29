#!/bin/bash

# Loop through each directory in the current location
for dir in */; do
    # Change to each directory
    cd "$dir" || continue

    # Counter for renaming files
    count=1

    # Find and convert each .png file
    for img in *.png; do
        # Only process if the file exists
        if [ -f "$img" ]; then
            # Rename and convert to JPG with reduced quality and half size
            new_img="${count}.jpg"
            convert "$img" -resize 50% -quality 50 "$new_img"
            
            # Remove the original PNG file if conversion was successful
            if [ -f "$new_img" ]; then
                rm "$img"
            fi
            
            ((count++))
        fi
    done

    # Go back to the parent directory
    cd ..
done

echo "Conversion and renaming complete!"
