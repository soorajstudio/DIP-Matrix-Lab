# PhD DIP Analyzer — Steganalysis Research Suite

A full-stack Digital Image Processing (DIP) and Steganalysis research platform designed for analyzing, degrading, and restoring digital images. Built with a modern **React (Vite)** interface and a high-performance **FastAPI (Python + OpenCV)** backend.

---

## 📌 Features & Algorithms

### 1. Standard DIP Analysis Tools
- **Canny Edge Detection**: Identifies sharp intensity transitions and distortions in natural edge patterns.
- **Otsu Thresholding**: Performs automatic optimal global threshold binarization to highlight structural clusters.
- **Region Segmentation**: Employs connected components labeling to reveal texture irregularities.
- **Boundary Representation**: Extracts outer mathematical contours and shape complexity.

### 2. Phase 1: Degradation Models
Simulates image corruption and carrier degradation:
- **Gaussian Noise**: Injects Additive White Gaussian Noise (AWGN) to model electronic sensor noise.
- **Motion Blur**: Applies a directional kernel to simulate linear camera movement.
- **Salt & Pepper Noise**: Adds impulsive binary noise to test carrier resilience.

### 3. Phase 2: Restoration Models
Restores degraded carriers through filter pipelines:
- **Median Filter**: Non-linear filtering effective against impulse and salt-and-pepper noise.
- **Inverse Filter Simulation**: Adaptive Gaussian smoothing to reverse blur degradation.
- **LMS / Bilateral Filter**: Smooths noise while strictly preserving structural edge boundaries.

---

## 🏗️ Project Architecture

`
dip-project/
├── backend/
│   ├── main.py              # FastAPI server & OpenCV processing pipelines
│   ├── static/uploads/      # Temporary storage for processed output images
│   └── requirements.txt     # Python backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Interactive research dashboard & state machine
│   │   ├── App.css          # Cyberpunk research UI styling & scanner animations
│   │   ├── main.jsx         # React application entry point
│   │   └── index.css        # Global styles
│   ├── package.json         # Frontend dependencies & scripts
│   └── vite.config.js       # Vite build configuration
├── .gitignore               # Git ignore rules for node_modules, venv, and cache
└── README.md                # Project documentation
`

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

---

### 1. Backend Setup

1. Open a terminal and navigate to the ackend folder:
   `ash
   cd backend
   `

2. Create and activate a Python virtual environment:
   - **Windows:**
     `powershell
     python -m venv venv
     .\venv\Scripts\activate
     `
   - **macOS / Linux:**
     `ash
     python3 -m venv venv
     source venv/bin/activate
     `

3. Install the required dependencies:
   `ash
   pip install fastapi uvicorn opencv-python-headless numpy python-multipart
   `

4. Start the FastAPI backend server:
   `ash
   uvicorn main:app --reload --port 8000
   `
   *The backend will be live at http://127.0.0.1:8000.*

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the rontend folder:
   `ash
   cd frontend
   `

2. Install npm dependencies:
   `ash
   npm install
   `

3. Start the development server:
   `ash
   npm run dev
   `
   *Open the URL shown in your terminal (usually http://localhost:5173) in your browser.*

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Axios, Modern CSS Animations
- **Backend**: FastAPI, Uvicorn, Python Multipart
- **Image Processing**: OpenCV (cv2), NumPy

---

## 📄 License
This project is open source and available for academic and research purposes.
