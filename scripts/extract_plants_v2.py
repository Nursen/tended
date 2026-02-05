"""
Extract plants from reference image v2.
Smarter face removal: analyzes pot region for dark/anomalous pixels
(eyes, mouth, blush) and replaces them with surrounding pot color.
"""

from PIL import Image, ImageDraw, ImageFilter, ImageStat
import os
import math

INPUT = "/Users/nursen/Development/friendship_retention/kawaii plant icons.jpg"
OUTPUT_DIR = "/Users/nursen/Development/friendship_retention/assets/plants/placeholders"
os.makedirs(OUTPUT_DIR, exist_ok=True)

img = Image.open(INPUT)
W, H = img.size

# ── Crop regions ──
# Refined based on visual inspection of 7973x7973 image
# Layout: 3 top (evenly spaced), 2 bottom (centered with more spacing)
plants = [
    {
        "name": "01_yellow_flowers",
        "crop": (150, 250, 2750, 3900),
        # Pot region relative to crop (where face lives)
        # (x1, y1, x2, y2) - the pot body excluding the plant/foliage above
        "pot_region": (300, 1800, 2200, 3400),
    },
    {
        "name": "02_monstera",
        "crop": (2750, 150, 5250, 3900),
        "pot_region": (400, 1700, 2200, 3500),
    },
    {
        "name": "03_anthurium",
        "crop": (5150, 250, 7800, 3900),
        "pot_region": (350, 1900, 2300, 3400),
    },
    {
        "name": "04_aloe",
        "crop": (350, 3800, 3850, 7700),
        "pot_region": (400, 2000, 3100, 3600),
    },
    {
        "name": "05_trailing_vine",
        "crop": (3750, 3800, 7700, 7700),
        "pot_region": (700, 1800, 3200, 3500),
    },
]


def get_average_color(img, region):
    """Get average RGB color of a region, excluding very dark pixels."""
    x1, y1, x2, y2 = region
    pixels = []
    px = img.load()
    for y in range(y1, min(y2, img.height)):
        for x in range(x1, min(x2, img.width)):
            r, g, b = px[x, y][:3]
            brightness = (r + g + b) / 3
            # Only include mid-to-bright pixels (skip eyes/mouth/outlines)
            if brightness > 150:
                pixels.append((r, g, b))
    if not pixels:
        return (200, 180, 160)
    avg_r = sum(p[0] for p in pixels) // len(pixels)
    avg_g = sum(p[1] for p in pixels) // len(pixels)
    avg_b = sum(p[2] for p in pixels) // len(pixels)
    return (avg_r, avg_g, avg_b)


def get_local_color(img, x, y, radius=30):
    """Get average color of bright pixels in a small neighborhood."""
    pixels = []
    px = img.load()
    for dy in range(-radius, radius+1):
        for dx in range(-radius, radius+1):
            nx, ny = x + dx, y + dy
            if 0 <= nx < img.width and 0 <= ny < img.height:
                r, g, b = px[nx, ny][:3]
                brightness = (r + g + b) / 3
                if brightness > 160:
                    pixels.append((r, g, b))
    if not pixels:
        return None
    avg_r = sum(p[0] for p in pixels) // len(pixels)
    avg_g = sum(p[1] for p in pixels) // len(pixels)
    avg_b = sum(p[2] for p in pixels) // len(pixels)
    return (avg_r, avg_g, avg_b)


def remove_face_features(img_rgb, pot_region):
    """
    Within the pot region, find and replace pixels that are anomalous
    (dark eyes, dark mouth, pink blush marks) with the local pot color.
    """
    x1, y1, x2, y2 = pot_region
    x1 = max(0, x1)
    y1 = max(0, y1)
    x2 = min(img_rgb.width, x2)
    y2 = min(img_rgb.height, y2)

    # Get the average pot color for reference
    avg_color = get_average_color(img_rgb, pot_region)
    avg_brightness = sum(avg_color) / 3
    avg_r, avg_g, avg_b = avg_color

    print(f"    Pot avg color: rgb({avg_r},{avg_g},{avg_b}), brightness={avg_brightness:.0f}")

    px = img_rgb.load()
    replaced = 0

    # Pass 1: Replace dark features (eyes, mouth outlines)
    # These are significantly darker than the pot surface
    for y in range(y1, y2):
        for x in range(x1, x2):
            r, g, b = px[x, y][:3]
            brightness = (r + g + b) / 3

            # Dark features: eyes, mouth, outlines
            # Threshold: much darker than the average pot color
            if brightness < avg_brightness * 0.55:
                local = get_local_color(img_rgb, x, y, radius=40)
                if local:
                    px[x, y] = local + (255,) if len(px[x,y]) == 4 else local
                else:
                    px[x, y] = avg_color + (255,) if len(px[x,y]) == 4 else avg_color
                replaced += 1

    print(f"    Pass 1 (dark features): replaced {replaced} pixels")

    # Pass 2: Replace blush marks (pinkish/reddish spots on non-pink pots)
    # Blush has higher red relative to green/blue vs the pot color
    blush_replaced = 0
    red_ratio_avg = avg_r / max(avg_g, 1)

    for y in range(y1, y2):
        for x in range(x1, x2):
            r, g, b = px[x, y][:3]
            brightness = (r + g + b) / 3

            if brightness < 80:  # already handled or too dark
                continue

            red_ratio = r / max(g, 1)

            # If this pixel is significantly more red-shifted than the pot average
            # AND it's in a plausible blush location (middle area of pot)
            # This catches the rosy cheek marks
            rel_x = (x - x1) / max(x2 - x1, 1)
            rel_y = (y - y1) / max(y2 - y1, 1)
            in_face_zone = 0.15 < rel_x < 0.85 and 0.15 < rel_y < 0.75

            if in_face_zone and red_ratio > red_ratio_avg * 1.25 and r > avg_r * 1.1:
                # Check if this cluster of pixels is blush-like
                # (small isolated patch, not a large area)
                local = get_local_color(img_rgb, x, y, radius=40)
                if local:
                    px[x, y] = local + (255,) if len(px[x,y]) == 4 else local
                else:
                    px[x, y] = avg_color + (255,) if len(px[x,y]) == 4 else avg_color
                blush_replaced += 1

    print(f"    Pass 2 (blush marks): replaced {blush_replaced} pixels")

    # Pass 3: Gentle blur over the pot region to smooth out any artifacts
    # We only blur the pot region, not the whole image
    pot_crop = img_rgb.crop((x1, y1, x2, y2))
    pot_blurred = pot_crop.filter(ImageFilter.GaussianBlur(radius=3))
    img_rgb.paste(pot_blurred, (x1, y1))

    return img_rgb


def remove_background(img_rgba, threshold=32):
    """Replace near-background-color pixels with transparency."""
    # Sample background from corners
    corners = [(2,2), (img_rgba.width-3, 2), (2, img_rgba.height-3), (img_rgba.width-3, img_rgba.height-3)]
    bg_colors = []
    px = img_rgba.load()
    for cx, cy in corners:
        bg_colors.append(px[cx, cy][:3])

    # Average corner colors for background reference
    bg_r = sum(c[0] for c in bg_colors) // len(bg_colors)
    bg_g = sum(c[1] for c in bg_colors) // len(bg_colors)
    bg_b = sum(c[2] for c in bg_colors) // len(bg_colors)

    print(f"    Background color: rgb({bg_r},{bg_g},{bg_b})")

    w, h = img_rgba.size
    removed = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if (abs(r - bg_r) < threshold and
                abs(g - bg_g) < threshold and
                abs(b - bg_b) < threshold):
                px[x, y] = (0, 0, 0, 0)
                removed += 1

    print(f"    Background removal: {removed} pixels made transparent")
    return img_rgba


def process_plant(plant_info):
    name = plant_info["name"]
    print(f"\nProcessing {name}...")

    # Crop
    cropped = img.crop(plant_info["crop"])
    crop_w, crop_h = cropped.size
    print(f"  Cropped size: {crop_w}x{crop_h}")

    # Work in RGB for face removal
    rgb = cropped.convert("RGB")

    # Remove face features
    print("  Removing face features...")
    rgb = remove_face_features(rgb, plant_info["pot_region"])

    # Convert to RGBA for background removal
    rgba = rgb.convert("RGBA")

    # Remove background
    print("  Removing background...")
    rgba = remove_background(rgba)

    # Resize to 512px max dimension
    max_dim = 512
    w, h = rgba.size
    scale = max_dim / max(w, h)
    new_size = (int(w * scale), int(h * scale))
    rgba = rgba.resize(new_size, Image.LANCZOS)

    # Save
    output_path = os.path.join(OUTPUT_DIR, f"{name}.png")
    rgba.save(output_path, "PNG")
    print(f"  Saved: {output_path} ({new_size[0]}x{new_size[1]})")
    return output_path


print(f"Source: {W}x{H}")
print(f"Output: {OUTPUT_DIR}")

for plant in plants:
    process_plant(plant)

print("\nDone! All plants extracted with faces removed.")
