# test.py

import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model

# Load the trained model
model = load_model('model.h5')

# Image Parameters
img_height, img_width = 150, 150

# Load and preprocess image for testing
def preprocess_image(image_path):
    img = cv2.imread(image_path)
    img = cv2.resize(img, (img_height, img_width))
    img = img.astype('float32') / 255.0
    img = np.expand_dims(img, axis=0)  # Expand dims to match model's input shape
    return img

# Test on new image
image_path = 'data/test/test_image.jpg'  # Specify the path to your test image
image = preprocess_image(image_path)

# Make a prediction
prediction = model.predict(image)
print(f"Prediction: {'Class 1' if prediction[0][0] > 0.5 else 'Class 0'}")
