import cv2
import mediapipe as mp
import numpy as np
import math
import time

# Initialize Mediapipe Pose and Hand Detection
mp_pose = mp.solutions.pose
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils  # For drawing the landmarks on the image
pose = mp_pose.Pose()
hands = mp_hands.Hands()

cap = cv2.VideoCapture(0)
offset = 20
imgSize = 300
counter = 0
folder = "Data/Body"

while True:
    success, img = cap.read()
    if not success:
        break

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Detect pose landmarks
    results_pose = pose.process(img_rgb)

    # Detect hand landmarks
    results_hands = hands.process(img_rgb)

    # Draw pose landmarks on the image
    if results_pose.pose_landmarks:
        mp_drawing.draw_landmarks(img, results_pose.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        # Get height and width of the image
        h, w, _ = img.shape

        # Get bounding box for the whole body
        landmarks = results_pose.pose_landmarks.landmark
        x_min = min([lm.x for lm in landmarks]) * w
        x_max = max([lm.x for lm in landmarks]) * w
        y_min = min([lm.y for lm in landmarks]) * h
        y_max = max([lm.y for lm in landmarks]) * h

        # Add an offset to the bounding box
        x_min = int(max(0, x_min - offset))
        x_max = int(min(w, x_max + offset))
        y_min = int(max(0, y_min - offset))
        y_max = int(min(h, y_max + offset))

        # Crop the image around the body
        imgCrop = img[y_min:y_max, x_min:x_max]
        imgWhite = np.ones((imgSize, imgSize, 3), np.uint8) * 255

        # Resize the cropped image to fit into the 300x300 imgWhite canvas
        crop_h, crop_w, _ = imgCrop.shape
        aspect_ratio = crop_h / crop_w

        if aspect_ratio > 1:  # Height > Width
            k = imgSize / crop_h
            wCal = math.ceil(k * crop_w)
            imgResize = cv2.resize(imgCrop, (wCal, imgSize))
            wGap = math.ceil((imgSize - wCal) / 2)
            imgWhite[:, wGap:wCal + wGap] = imgResize
        else:  # Width > Height
            k = imgSize / crop_w
            hCal = math.ceil(k * crop_h)
            imgResize = cv2.resize(imgCrop, (imgSize, hCal))
            hGap = math.ceil((imgSize - hCal) / 2)
            imgWhite[hGap:hCal + hGap, :] = imgResize

        # Display images
        cv2.imshow('ImageCrop', imgCrop)
        cv2.imshow('ImageWhite', imgWhite)

        # Print detected nodes (landmarks) and their coordinates for the body
        for i, landmark in enumerate(landmarks):
            x, y, z = int(landmark.x * w), int(landmark.y * h), landmark.z
            print(f"Body Node {i}: x={x}, y={y}, z={z}")

    # Draw hand landmarks on the image
    if results_hands.multi_hand_landmarks:
        for hand_landmarks in results_hands.multi_hand_landmarks:
            mp_drawing.draw_landmarks(img, hand_landmarks, mp_hands.HAND_CONNECTIONS)
            
            # Print detected nodes (landmarks) and their coordinates for the hands
            for i, landmark in enumerate(hand_landmarks.landmark):
                x, y, z = int(landmark.x * w), int(landmark.y * h), landmark.z
                print(f"Hand Node {i}: x={x}, y={y}, z={z}")

    # Display the camera feed
    cv2.imshow('Image', img)

    key = cv2.waitKey(1)
    if key == ord("s"):
        # Save the current image when 's' is pressed
        counter += 1
        cv2.imwrite(f'{folder}/Image_{time.time()}.jpg', imgWhite)
        print(f"Saved Image {counter}")

    # Press 'q' to exit
    if key == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
