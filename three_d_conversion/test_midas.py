import torch
import cv2
import numpy as np
import matplotlib.pyplot as plt

# Load model
model_type = "DPT_Large"  # or DPT_Hybrid for faster
midas = torch.hub.load("isl-org/MiDaS", model_type, trust_repo=True)
midas.eval()

# Load transforms
midas_transforms = torch.hub.load("isl-org/MiDaS", "transforms", trust_repo=True)

if model_type in ["DPT_Large", "DPT_Hybrid"]:
    transform = midas_transforms.dpt_transform
else:
    transform = midas_transforms.small_transform

# Load image (MAKE SURE PATH IS CORRECT)
img = cv2.imread("test.png")
img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

# Apply transform (IMPORTANT)
input_batch = transform(img)

# Add batch dimension ONLY ONCE
input_batch = input_batch.unsqueeze(0)

# Inference
with torch.no_grad():
    prediction = midas(input_batch)

# Convert to numpy
depth = prediction.squeeze().cpu().numpy()

# Show result
plt.imshow(depth, cmap="inferno")
plt.axis("off")
plt.show()
