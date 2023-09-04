from PIL import Image, ImageDraw, ImageFont
import matplotlib.pyplot as plt
import os
from tqdm import tqdm

# Load the map image
image_path = "../images/map.png"
image = Image.open(image_path)

# Path to save the tiles
tiles_path = "../tiles/"
os.makedirs(tiles_path, exist_ok=True)

# Tile size
tile_size = 256

# Function to generate tiles for a given zoom level
def generate_tiles(image, zoom_level):
    # Determine scaling factor and grid size based on zoom level
    scale_factor = 2 ** (2 - zoom_level)
    grid_size = 2 ** zoom_level
    
    # Resizing the image
    resized_image = image.resize((int(image.width // scale_factor), int(image.height // scale_factor)), Image.BILINEAR)

    # Number of tiles in each direction
    num_tiles_x = num_tiles_y = grid_size

    # Create tiles
    for x in tqdm(range(num_tiles_x), desc=f"Generating tiles for zoom level {zoom_level}"):
        for y in tqdm(range(num_tiles_y), desc="Generating tiles"):
            left = x * tile_size
            upper = y * tile_size
            right = left + tile_size
            lower = upper + tile_size
            
            tile = resized_image.crop((left, upper, right, lower))
            
            # Save tile
            tile_path = os.path.join(tiles_path, str(zoom_level))
            os.makedirs(tile_path, exist_ok=True)
            tile.save(os.path.join(tile_path, f"{x}_{y}.png"))

# Clear previous tiles directory and create a new one
import shutil
shutil.rmtree(tiles_path)
os.makedirs(tiles_path, exist_ok=True)

# Generate tiles for zoom levels 0 to 9
for zoom_level in range(5):
    generate_tiles(image, zoom_level)

tiles_path