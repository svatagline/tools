import os
import re

FOLDER_PATH = "./images"  # change this to your folder path
START_NUMBER = 187

files = os.listdir(FOLDER_PATH)

# Match ezgif-frame-<number>.jpg
pattern = re.compile(r"ezgif-frame-(\d+)\.jpg")

# Extract and sort by original number
matched_files = []
for f in files:
    match = pattern.match(f)
    if match:
        matched_files.append((int(match.group(1)), f))

matched_files.sort()

# Rename files
for index, (_, filename) in enumerate(matched_files):
    new_number = START_NUMBER + index
    old_path = os.path.join(FOLDER_PATH, filename)
    new_name = f"ezgif-frame-{new_number}.jpg"
    new_path = os.path.join(FOLDER_PATH, new_name)

    os.rename(old_path, new_path)
    print(f"{filename} → {new_name}")
