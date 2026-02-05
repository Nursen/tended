"""
Extract individual plants from kawaii plant icons reference image.
- Crops each of the 5 plants
- Removes cream background (makes transparent)
- Paints over face regions with pot base color
- Exports as transparent PNGs for use as dev placeholders
"""

from PIL import Image, ImageDraw, ImageFilter
import os

# Setup
INPUT = "/Users/nursen/Development/friendship_retention/kawaii plant icons.jpg"
OUTPUT_DIR = "/Users/nursen/Development/friendship_retention/assets/plants/placeholders"
os.makedirs(OUTPUT_DIR, exist_ok=True)

img = Image.open(INPUT)
W, H = img.size  # 7973 x 7973

# ── Crop regions for each plant (x1, y1, x2, y2) ──
# Layout: 3 on top row, 2 on bottom row
crops = {
    "yellow-flowers": {
        "crop": (200, 300, 2800, 3800),
        # Face region relative to crop (x, y, w, h)
        "face": (550, 1700, 1100, 900),
        "pot_sample": (700, 2200),  # point to sample pot color
        "name": "01_yellow_flowers"
    },
    "monstera": {
        "crop": (2800, 200, 5400, 3800),
        "face": (600, 1800, 1000, 800),
        "pot_sample": (750, 2300),
        "name": "02_monstera"
    },
    "anthurium": {
        "crop": (5200, 300, 7800, 3800),
        "face": (600, 1800, 1100, 900),
        "pot_sample": (750, 2300),
        "name": "03_anthurium"
    },
    "aloe": {
        "crop": (400, 3900, 3800, 7600),
        "face": (700, 2100, 1100, 900),
        "pot_sample": (850, 2600),
        "name": "04_aloe"
    },
    "trailing-vine": {
        "crop": (3800, 3900, 7600, 7600),
        "face": (900, 1900, 1100, 900),
        "pot_sample": (1050, 2500),
        "name": "05_trailing_vine"
    },
}

# Background color to make transparent (cream/off-white)
BG_THRESHOLD = 30  # tolerance for background removal


def remove_background(img_rgba, bg_color=(255, 251, 240), threshold=BG_THRESHOLD):
    """Replace near-background-color pixels with transparency."""
    pixels = img_rgba.load()
    w, h = img_rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            # Check if pixel is close to background color
            if (abs(r - bg_color[0]) < threshold and
                abs(g - bg_color[1]) < threshold and
                abs(b - bg_color[2]) < threshold):
                pixels[x, y] = (0, 0, 0, 0)
    return img_rgba


def erase_face(img_rgba, face_rect, pot_sample_point):
    """Paint over the face region with the pot's base color."""
    # Sample the pot color from a face-free area
    px = img_rgba.getpixel(pot_sample_point)
    pot_color = (px[0], px[1], px[2], px[3])

    draw = ImageDraw.Draw(img_rgba)
    fx, fy, fw, fh = face_rect

    # Draw filled ellipse over face region (ellipse looks more natural on rounded pots)
    draw.ellipse(
        [fx, fy, fx + fw, fy + fh],
        fill=pot_color
    )

    # Slight blur on the edges to blend (draw a slightly larger semi-transparent ellipse)
    # This helps it not look like a harsh patch
    return img_rgba


def process_plant(plant_key, plant_info):
    """Crop, clean, and export a single plant."""
    print(f"Processing {plant_key}...")

    # Crop from source
    cropped = img.crop(plant_info["crop"])

    # Convert to RGBA for transparency
    rgba = cropped.convert("RGBA")

    # Sample background color from corner of this specific crop
    corner_color = rgba.getpixel((5, 5))
    bg = (corner_color[0], corner_color[1], corner_color[2])

    # Erase face first (before background removal, so we sample colors correctly)
    rgba = erase_face(rgba, plant_info["face"], plant_info["pot_sample"])

    # Remove background
    rgba = remove_background(rgba, bg_color=bg, threshold=35)

    # Resize to consistent size (512x512-ish, maintaining aspect)
    max_dim = 512
    w, h = rgba.size
    scale = max_dim / max(w, h)
    new_size = (int(w * scale), int(h * scale))
    rgba = rgba.resize(new_size, Image.LANCZOS)

    # Save
    output_path = os.path.join(OUTPUT_DIR, f"{plant_info['name']}.png")
    rgba.save(output_path, "PNG")
    print(f"  Saved: {output_path} ({new_size[0]}x{new_size[1]})")

    return output_path


# Process all plants
print(f"Source image: {W}x{H}")
print(f"Output dir: {OUTPUT_DIR}\n")

results = []
for key, info in crops.items():
    path = process_plant(key, info)
    results.append(path)

print(f"\nDone! Extracted {len(results)} plants.")
print("These are faceless plant PNGs ready for SVG face overlay.")
