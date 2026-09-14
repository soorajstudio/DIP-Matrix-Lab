import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [resultImg, setResultImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  // Track the research phase: 'standard', 'degraded', or 'restored'
  const [researchPhase, setResearchPhase] = useState("standard");
  // Store the path of the degraded image to use as input for restoration
  const [degradedPath, setDegradedPath] = useState(null);

  const explanations = {
    edge: "Edge Detection (Canny): Identifies sharp intensity changes. Useful in steganalysis to find distortions in natural edge patterns caused by hidden data embedding.",
    threshold: "Thresholding (Otsu): Converts grayscale to binary. It highlights structural differences by finding the optimal global threshold automatically, useful for segmenting payload regions.",
    region: "Region Segmentation: Clusters pixels by similarity. Helps detect unnatural texture clusters where malware code might be hiding within the image data.",
    boundary: "Boundary Representation: Extracts the outer mathematical shell. Analyzes shape complexity which can be subtly altered by noise-based steganography techniques.",
    
    // Phase 1 Explanations
    gaussian_noise: "Degradation (Gaussian Noise): Adds Additive White Gaussian Noise (AWGN) to simulate sensor electronic noise. Testing carrier robustness.",
    motion_blur: "Degradation (Motion Blur): Simulates linear camera movement during exposure using a 15x15 averaging kernel.",
    salt_pepper: "Degradation (Salt & Pepper): Adds impulsive noise. Useful for testing the resilience of bit-level steganographic encoding.",
    
    // Phase 2 Explanations
    median_filter: "Restoration (Median Filter): A non-linear filter effective at removing salt-and-pepper noise while preserving edge gradients.",
    inverse_filter: "Restoration (Inverse Simulation): Uses adaptive Gaussian smoothing to estimate and reverse blur functions.",
    lms_filter: "Restoration (LMS/Bilateral): Minimizes mean square error by smoothing while preserving structural boundaries via intensity weights."
  };

  const uploadAndProcess = async (mode, subMethod = null) => {
    if (!file) return alert("Please upload an image first!");
    setLoading(true);
    setResultImg(null);
    
    const currentExp = subMethod ? explanations[subMethod] : explanations[mode];
    setExplanation(currentExp);

    const formData = new FormData();
    
    // If we are in the restoration phase, we send the degraded result back as the new file
    if (mode === 'restore' && degradedPath) {
        // Fetch the degraded image blob to send back to server
        const response = await fetch(`http://127.0.0.1:8000/static/uploads/${degradedPath}`);
        const blob = await response.blob();
        formData.append('file', blob, 'degraded_input.png');
    } else {
        formData.append('file', file);
    }
    
    formData.append('mode', mode);
    if (subMethod) formData.append('sub_method', subMethod);

    try {
      const response = await axios.post('http://127.0.0.1:8000/process', formData);
      const resultFile = response.data.result;
      setResultImg(`http://127.0.0.1:8000/static/uploads/${resultFile}?t=${new Date().getTime()}`);
      
      // Manage Phase transitions
      if (mode === 'degrade') {
          setDegradedPath(resultFile);
          setResearchPhase("degraded");
      } else if (mode === 'restore') {
          setResearchPhase("restored");
      } else {
          setResearchPhase("standard");
      }

    } catch (error) {
      console.error("Analysis Error:", error);
      alert("Backend connection failed.");
    }
    setLoading(false);
  };

  return (
    <div className="dashboard">
      <div className="side-panel">
        <h1 className="title">PhD DIP <span className="accent">Analyzer</span></h1>
        <p className="subtitle">Steganalysis Research Suite</p>
        
        <div className="upload-section">
          <label className="drop-zone">
            <input type="file" onChange={(e) => {
                setFile(e.target.files[0]); 
                setResultImg(null); 
                setResearchPhase("standard");
                setExplanation("");
            }} hidden />
            <div className={`upload-icon ${file ? 'success' : ''}`}>{file ? '✓' : '↑'}</div>
            <div className="upload-text">
              <strong>{file ? "Image Uploaded" : "Upload Sample"}</strong>
              <span>{file ? file.name : "Select stego-carrier"}</span>
            </div>
          </label>
        </div>

        <div className="button-grid">
          {/* STANDARD TOOLS */}
          {researchPhase === "standard" && (
            <>
              <h3 className="group-label">Analysis Tools</h3>
              <button onClick={() => uploadAndProcess('edge')} className="glow-btn">Edge Detection</button>
              <button onClick={() => uploadAndProcess('threshold')} className="glow-btn">Thresholding</button>
              <button onClick={() => uploadAndProcess('region')} className="glow-btn">Region Segmentation</button>
              <button onClick={() => uploadAndProcess('boundary')} className="glow-btn">Boundary Rep.</button>
              
              <h3 className="group-label">Phase 1: Degradation</h3>
              <button onClick={() => uploadAndProcess('degrade', 'gaussian_noise')} className="glow-btn">Gaussian Noise</button>
              <button onClick={() => uploadAndProcess('degrade', 'motion_blur')} className="glow-btn">Motion Blur</button>
              <button onClick={() => uploadAndProcess('degrade', 'salt_pepper')} className="glow-btn">Salt & Pepper</button>
            </>
          )}

          {/* RESTORATION TOOLS - Unlocked after degradation */}
          {researchPhase === "degraded" && (
            <div className="phase-unlocked">
              <h3 className="group-label accent">Phase 2: Restoration</h3>
              <button onClick={() => uploadAndProcess('restore', 'median_filter')} className="glow-btn">Median Filter</button>
              <button onClick={() => uploadAndProcess('restore', 'inverse_filter')} className="glow-btn">Inverse Filter</button>
              <button onClick={() => uploadAndProcess('restore', 'lms_filter')} className="glow-btn">LMS Filter</button>
              <button onClick={() => setResearchPhase("standard")} className="clear-btn">Cancel Phase</button>
            </div>
          )}

          {researchPhase === "restored" && (
              <button onClick={() => setResearchPhase("standard")} className="glow-btn accent">Start New Research Cycle</button>
          )}
        </div>
      </div>

      <div className="main-viewer">
        {explanation && (
          <div className="definition-container animate-slide-down">
            <div className="definition-header">
              <span className="badge">{researchPhase.toUpperCase()} PHASE</span>
              <span className="timestamp">DIP-Module v2.0</span>
            </div>
            <div className="text-content">
              <h3>{explanation.split(':')[0]}</h3>
              <p>{explanation.split(':')[1] || explanation}</p>
            </div>
          </div>
        )}

        <div className="image-comparison">
          {file && (
            <div className="image-box animate-fade-in">
              <h4>{researchPhase === "restored" ? "DEGRADED INPUT" : "ORIGINAL SOURCE"}</h4>
              <img src={URL.createObjectURL(file)} alt="Original" />
            </div>
          )}
          
          <div className="image-box animate-fade-in">
            <h4>PROCESSED OUTPUT</h4>
            <div className="unified-canvas">
              {loading ? (
                <div className="scan-layer">
                  <div className="scan-wrapper">
                    {file && <img src={URL.createObjectURL(file)} className="scan-underlay" alt="Scanning" />}
                    <div className="scanner-line"></div>
                  </div>
                  <div className="matrix-overlay">
                    <div className="matrix-text">ANALYZING PIXEL MATRIX...</div>
                  </div>
                </div>
              ) : resultImg ? (
                <img src={resultImg} className="result-img" alt="Processed" />
              ) : (
                <div className="output-placeholder">SYSTEM READY</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;