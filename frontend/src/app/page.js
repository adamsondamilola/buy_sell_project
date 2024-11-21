"use client"
import { useState } from 'react';
import CameraCapture from '../../components/CameraCapture';

const Home = () => {
  const [imageData, setImageData] = useState(null);
  const [smileDetected, setSmileDetected] = useState(false);

  const handleCapture = (image, detections) => {
    setImageData(image);
    const smile = detections.some(det => det.expressions.happy > 0.5); // Adjust the threshold as needed
    setSmileDetected(smile);
  };

  return (
    <div>
      <h1>AI Face and Smile Detection</h1>
      <CameraCapture onCapture={handleCapture} />
      {imageData && <img src={imageData} alt="Captured face" />}
      {smileDetected !== null && (
        <p>{smileDetected ? 'Smile detected!' : 'No smile detected.'}</p>
      )}
    </div>
  );
};

export default Home;
