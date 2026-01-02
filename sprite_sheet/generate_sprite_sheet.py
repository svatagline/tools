import os
import math
from PIL import Image

# ===== CONFIG =====
INPUT_DIR = "frames"
OUTPUT_FILE = "sprite_sheet.png"
IMAGE_EXT = ".png"      # change to .png if needed
COLUMNS = None          # None = auto (recommended)
PADDING = 0             # pixels between frames
# ==================

# Load images
images = sorted([
    img for img in os.listdir(INPUT_DIR)
    if img.lower().endswith(IMAGE_EXT)
])

if not images:
    raise Exception("❌ No images found!")

# Open first image to get size
first_image = Image.open(os.path.join(INPUT_DIR, images[0]))
frame_width, frame_height = first_image.size 
# frame_width = 970,  
# frame_height = 500
print(f"✅ Frame size detected: {frame_width}x{frame_height} {first_image.size}")
total_frames = len(images)

# Auto grid calculation
if COLUMNS is None:
    COLUMNS = math.ceil(math.sqrt(total_frames))

ROWS = math.ceil(total_frames / COLUMNS)

sheet_width = COLUMNS * (frame_width + PADDING)
sheet_height = ROWS * (frame_height + PADDING)

sprite_sheet = Image.new("RGBA", (sheet_width, sheet_height), (0, 0, 0, 0))

for index, image_name in enumerate(images):
    img_path = os.path.join(INPUT_DIR, image_name)
    img = Image.open(img_path).convert("RGBA")

    col = index % COLUMNS
    row = index // COLUMNS

    x = col * (frame_width + PADDING)
    y = row * (frame_height + PADDING)

    sprite_sheet.paste(img, (x, y))

sprite_sheet.save(OUTPUT_FILE)
print(f"✅ Sprite sheet created: {OUTPUT_FILE}")
print(f"Frames: {total_frames}")
print(f"Grid: {COLUMNS} x {ROWS}")
print(f"Frame size: {frame_width}x{frame_height}")
