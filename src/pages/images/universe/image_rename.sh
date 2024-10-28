#!/bin/bash

# Loop through each directory in the current location
for dir in */; do
    # Change to each directory
    cd "$dir" || continue

    # Counter for renaming files
    count=1

    # Find and rename each .png file
    for img in *.png; do
        # Only rename if the file exists
        if [ -f "$img" ]; then
            mv "$img" "${count}.png"
            ((count++))
        fi
    done

    # Go back to the parent directory
    cd ..
done

echo "Renaming complete!"
