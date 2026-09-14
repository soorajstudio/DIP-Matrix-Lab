# 🔬 DIP-Matrix-Lab

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white" alt="OpenCV" />
  <img src="https://img.shields.io/badge/NumPy-013243?style=for-the-badge&logo=numpy&logoColor=white" alt="NumPy" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <strong>An advanced Full-Stack Digital Image Processing (DIP) & Steganalysis Research Suite.</strong><br>
  Analyze carrier structures, model stochastic degradation, and execute restoration pipelines in real-time.
</p>

---

## 📑 Table of Contents
- [🌟 Key Highlights](#-key-highlights)
- [🔬 Core Algorithms & Research Pipeline](#-core-algorithms--research-pipeline)
  - [1. Standard DIP Analysis Tools](#1-standard-dip-analysis-tools)
  - [2. Phase 1: Degradation Modeling](#2-phase-1-degradation-modeling)
  - [3. Phase 2: Restoration & Forensics](#3-phase-2-restoration--forensics)
- [🏗️ System Architecture](#️-system-architecture)
- [📂 Project Directory Structure](#-project-directory-structure)
- [🚀 Quick Start Guide](#-quick-start-guide)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup (FastAPI + OpenCV)](#1-backend-setup-fastapi--opencv)
  - [2. Frontend Setup (React + Vite)](#2-frontend-setup-react--vite)
- [📡 API Documentation](#-api-documentation)
- [🗺️ Future Roadmap](#️-future-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🌟 Key Highlights

- **⚡ Fast Asynchronous Processing**: Powered by FastAPI and native C++ OpenCV bindings for sub-second image manipulation.
- **🔄 Two-Phase Research Workflow**:
  - *Phase 1 (Degradation)*: Inject controlled synthetic noise and distortions to stress-test stego-carriers.
  - *Phase 2 (Restoration)*: Unlock adaptive restoration filters to recover degraded inputs.
- **🖥️ Cyberpunk Matrix UI**: Dark neon interface with active laser-scan matrix overlay and side-by-side comparison viewers.
- **📊 Real-Time Algorithm Insights**: Dynamic mathematical descriptions and steganalysis explanations rendered alongside outputs.

---

## 🔬 Core Algorithms & Research Pipeline

`mermaid
flowchart LR
    subgraph Client [Frontend UI]
        Upload[Upload Image] --> SelectMode[Select Mode]
        SelectMode --> Viewer[Visual Comparison]
    end

    subgraph Backend [FastAPI Processing Engine]
        SelectMode -->|POST /process| Router{Mode Router}
        Router -->|Analysis| Standard[Canny / Otsu / Region / Boundary]
        Router -->|Phase 1| Degrade[Gaussian / Motion Blur / Salt & Pepper]
        Router -->|Phase 2| Restore[Median / Gaussian Smoothing / LMS Bilateral]
        Standard --> Result[Save & Return Image UUID]
        Degrade --> Result
        Restore --> Result
    end

    Result -->|Render Output| Viewer
`

### 1. Standard DIP Analysis Tools
| Tool | Algorithm | Steganalysis & Research Purpose |
| :--- | :--- | :--- |
| **Edge Detection** | cv2.Canny | Identifies high-gradient boundary patterns to locate pixel perturbations caused by LSB embedding. |
| **Thresholding** | cv2.threshold (Otsu) | Computes optimal binarization thresholds to isolate segmented payload regions. |
| **Region Segmentation** | cv2.connectedComponents | Clusters pixels by similarity in HSV space to reveal unnatural texture clusters. |
| **Boundary Representation** | cv2.findContours | Extracts mathematical contours to inspect changes in geometric shape complexity. |

### 2. Phase 1: Degradation Modeling
- **Gaussian Noise (AWGN)**: Adds normally distributed random values ($\mu=0, \sigma=25$) to simulate sensor electronic interference.
- **Motion Blur**: Convolves a  \times 15$ linear directional averaging kernel:
  H(u, v) = \frac{1}{L} \sum_{k=0}^{L-1} e^{-j 2\pi (u x_k + v y_k)}
- **Salt & Pepper Noise**: Injects impulsive random black ($) and white ($) pixel corruptions to test bit-level resilience.

### 3. Phase 2: Restoration & Forensics
- **Median Filter**: Replaces corrupted pixels with median neighborhood values ( \times 5$ window) to eliminate impulse noise without blurring edges.
- **Inverse Filter Simulation**: Uses adaptive Gaussian smoothing kernels to reverse high-frequency blur artifacts.
- **LMS / Bilateral Filter**: Minimizes mean square error using intensity and spatial weight matrices to smooth noise while preserving critical boundary gradients.

---

## 🏗️ System Architecture

- **Client Layer**: React 18 SPA bundled with Vite, styled with custom CSS animations, managing multi-phase state machine transitions.
- **API / Compute Layer**: FastAPI asynchronous microservice wrapping NumPy vector arrays and OpenCV image manipulation routines.
- **Communication**: Multipart form data transfers with unique UUID-based image caching and zero-collision storage.

---

## 📂 Project Directory Structure

`	ext
DIP-Matrix-Lab/
├── backend/
│   ├── main.py                  # FastAPI server, endpoints & OpenCV pipelines
│   ├── static/
│   │   └── uploads/             # Ephemeral processed output storage (.gitkeep)
│   └── requirements.txt         # Python dependencies
├── frontend/
│   ├── public/                  # Static assets & favicon
│   ├── src/
│   │   ├── assets/              # Component icons and SVGs
│   │   ├── App.jsx              # Main UI controller & pipeline state manager
│   │   ├── App.css              # Cyberpunk styling & scanning laser animations
│   │   ├── index.css            # Base stylesheet
│   │   └── main.jsx             # React DOM root entry
│   ├── package.json             # Node scripts & dependencies
│   ├── vite.config.js           # Vite development and bundle config
│   └── eslint.config.js         # Linting rules
├── .gitignore                   # Ignores venv, node_modules, and cache files
└── README.md                    # Project documentation
`

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have installed:
- [Python 3.10+](https://www.python.org/)
- [Node.js 18+](https://nodejs.org/) and 
pm
- [Git](https://git-scm.com/)

---

### 1. Backend Setup (FastAPI + OpenCV)

1. Open your terminal and navigate to ackend:
   `ash
   cd backend
   `

2. Create and activate a virtual environment:
   - **Windows (PowerShell):**
     `powershell
     python -m venv venv
     .\venv\Scripts\activate
     `
   - **macOS / Linux:**
     `ash
     python3 -m venv venv
     source venv/bin/activate
     `

3. Install dependencies:
   `ash
   pip install -r requirements.txt
   `

4. Launch the FastAPI server:
   `ash
   uvicorn main:app --reload --port 8000
   `
   > 🟢 Backend API running at http://127.0.0.1:8000 (Swagger Docs available at http://127.0.0.1:8000/docs).

---

### 2. Frontend Setup (React + Vite)

1. Open a second terminal window and navigate to rontend:
   `ash
   cd frontend
   `

2. Install JavaScript packages:
   `ash
   npm install
   `

3. Start the Vite development server:
   `ash
   npm run dev
   `
   > 🌐 Open http://localhost:5173 in your browser to access the application.

---

## 📡 API Documentation

### POST /process
Accepts an image upload and applies the selected DIP operation.

#### Parameters (Multipart Form Data):
| Parameter | Type | Required | Values / Description |
| :--- | :--- | :--- | :--- |
| ile | UploadFile | **Yes** | Input image file (PNG, JPG, etc.) |
| mode | string | **Yes** | edge, 	hreshold, egion, oundary, degrade, estore |
| sub_method | string | *Optional* | gaussian_noise, motion_blur, salt_pepper, median_filter, inverse_filter, lms_filter |

#### Example Response:
`json
{
  "result": "res_a1b2c3d4e5f67890.png"
}
`

---

## 🗺️ Future Roadmap

- [ ] Add interactive parameter sliders (Kernel size, Canny hysteresis, Noise variance).
- [ ] Export forensic analysis reports (Histogram, PSNR, SSIM metrics).
- [ ] Client-side WebAssembly mode via opencv.js for optional offline analysis.
- [ ] Batch processing and multi-image dataset comparison.

---

## 🤝 Contributing

Contributions, issues, and feature suggestions are welcome!
1. Fork the repository
2. Create your branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See LICENSE for more information.

<p align="center">
  Made with 🔬 for Digital Image Processing & Forensics Research.
</p>
