from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import cv2
import numpy as np
import os
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# --- Helper Functions for Degradation ---
def apply_motion_blur(img, size=15):
    kernel = np.zeros((size, size))
    kernel[int((size-1)/2), :] = np.ones(size)
    kernel = kernel / size
    return cv2.filter2D(img, -1, kernel)

def apply_salt_and_pepper(img, prob=0.05):
    output = np.copy(img)
    thres = 1 - prob
    for i in range(img.shape[0]):
        for j in range(img.shape[1]):
            rdn = np.random.random()
            if rdn < prob:
                output[i][j] = 0
            elif rdn > thres:
                output[i][j] = 255
    return output

@app.post("/process")
async def process_image(
    file: UploadFile = File(...), 
    mode: str = Form(...), 
    sub_method: str = Form(None)
):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    result = img # Default fallback

    # 1. STANDARD DIP MODES
    if mode == 'edge':
        result = cv2.Canny(gray, 100, 200)
    elif mode == 'threshold':
        _, result = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    elif mode == 'region':
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        ret, labels = cv2.connectedComponents(thresh)
        label_hue = np.uint8(179 * labels / np.max(labels))
        blank_ch = 255 * np.ones_like(label_hue)
        labeled_img = cv2.merge([label_hue, blank_ch, blank_ch])
        result = cv2.cvtColor(labeled_img, cv2.COLOR_HSV2BGR)
        result[labels == 0] = 0
    elif mode == 'boundary':
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        result = np.zeros_like(img)
        cv2.drawContours(result, contours, -1, (0, 212, 255), 2)

    # 2. DEGRADATION MODELS (Phase 1)
    elif mode == 'degrade':
        if sub_method == 'gaussian_noise':
            noise = np.random.normal(0, 25, img.shape).astype('uint8')
            result = cv2.add(img, noise)
        elif sub_method == 'motion_blur':
            result = apply_motion_blur(img)
        elif sub_method == 'salt_pepper':
            result = apply_salt_and_pepper(img)

    # 3. RESTORATION MODELS (Phase 2)
    # Note: 'img' passed here will be the degraded image sent back from the frontend
    elif mode == 'restore':
        if sub_method == 'median_filter':
            # Great for Salt & Pepper or Pulse noise
            result = cv2.medianBlur(img, 5)
        elif sub_method == 'inverse_filter':
            # Simulated Inverse/Wiener filtering using Gaussian smoothing
            result = cv2.GaussianBlur(img, (5, 5), 0)
        elif sub_method == 'lms_filter':
            # Simulated Least Mean Square approach using bilateral filtering 
            # to preserve edges while removing noise
            result = cv2.bilateralFilter(img, 9, 75, 75)

    out_name = f"res_{uuid.uuid4().hex}.png"
    cv2.imwrite(os.path.join(UPLOAD_DIR, out_name), result)
    return {"result": out_name}