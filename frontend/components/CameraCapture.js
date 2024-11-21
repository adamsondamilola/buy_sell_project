import { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    // Load face-api models
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models/face-api');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models/face-api');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models/face-api');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models/face-api');
        await faceapi.nets.ageGenderNet.loadFromUri('/models/face-api');
      } catch (err) {
        console.log('Error loading models:', err);
      }
    };

    loadModels();
  }, []);


  const startCamera = async () => {
    if(videoRef.current){
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      } catch (err) {
        alert(err)
        console.log('Error accessing camera:', err);
      }
    }
  };

  const captureImage = async () => {
    const canvas = faceapi.createCanvasFromMedia(videoRef.current);
    canvasRef.current.appendChild(canvas);
    const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.height };
    faceapi.matchDimensions(canvas, displaySize);

    try {
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

      resizedDetections.forEach(detections => {
        const {age, gender, genderProbability} = detections;
        const text = `${Math.round(age)} years, ${gender} (${Math.round(genderProbability * 100)}%)`;
        const box = detections.detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {label: text});
        drawBox.draw(canvas);
      });

      const imageData = canvas.toDataURL('image/png');
      onCapture(imageData, detections);
    } catch (err) {
      console.error('Error detecting faces:', err);
    }
  };

  return (
    <div>
      <video ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          width={cameraActive?"640" : "0"} 
          height={cameraActive?"480" : "0"}></video>
      {!cameraActive && <button onClick={startCamera}>Start Camera</button>}
      {cameraActive?
      <div>  
        <div ref={canvasRef}></div>
          <button onClick={captureImage}>Capture Image</button>
          </div>
       : ''}
    </div>
  );
};

export default CameraCapture;
