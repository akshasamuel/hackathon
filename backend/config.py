import os
import torch

# Flask App Configuration
DEBUG = True  # Set to False in production
HOST = "0.0.0.0"  # Change to 127.0.0.1 for local testing
PORT = 5000

# Model Configuration
MODEL_NAME = "facebook/mms-tts-eng"  # Update if using another model
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Directory Paths
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "generated_audio")

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)
