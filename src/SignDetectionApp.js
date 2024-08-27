import React, { useState, useRef, useEffect } from 'react';
import * as tmImage from '@teachablemachine/image';

const SignDetectionApp = () => {
  const URL = "https://teachablemachine.withgoogle.com/models/LkgNnEZoQ/";
  const [predictions, setPredictions] = useState([]);
  const webcamRef = useRef(null);
  const labelContainerRef = useRef(null);
  const [model, setModel] = useState(null);
  const [maxPredictions, setMaxPredictions] = useState(0);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    const initModel = async () => {
      try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);
        setMaxPredictions(loadedModel.getTotalClasses());
      } catch (error) {
        console.error("Error loading the model:", error);
      }
    };

    initModel();
  }, [URL]);

  const startCamera = async () => {
    try {
      const flip = true;
      const webcam = new tmImage.Webcam(200, 200, flip);
      await webcam.setup();
      await webcam.play();
      webcamRef.current = webcam;

      document.getElementById("webcam-container").appendChild(webcam.canvas);
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error starting the webcam:", error);
    }
  };

  const stopCamera = () => {
    if (webcamRef.current) {
      webcamRef.current.stop();
      webcamRef.current = null;
      setIsCameraOn(false);
      setIsDetecting(false);
    }
  };

  const loop = async () => {
    if (webcamRef.current && webcamRef.current.canvas) {
      webcamRef.current.update();
      await predict();
      window.requestAnimationFrame(loop);
    }
  };

  const startDetecting = () => {
    if (isCameraOn) {
      setIsDetecting(true);
      window.requestAnimationFrame(loop);
    }
  };

  const predict = async () => {
    if (model && webcamRef.current && webcamRef.current.canvas) {
      const prediction = await model.predict(webcamRef.current.canvas);
      const newPredictions = prediction.map(
        (p) => `${p.className}: ${p.probability.toFixed(2)}`
      );
      setPredictions(newPredictions);
    }
  };

  return (
    <div>
      <h1>Teachable Machine Image Model</h1>
      {!isCameraOn && (
        <button onClick={startCamera}>Start Camera</button>
      )}
      {isCameraOn && (
        <button onClick={stopCamera}>Turn Off Camera</button>
      )}
      {isCameraOn && !isDetecting && (
        <button onClick={startDetecting}>Start Detecting</button>
      )}
      <div id="webcam-container"></div>
      <div id="label-container" ref={labelContainerRef}></div>

      <div>
        <h3>Detected Signs:</h3>
        <p>{predictions.join(', ')}</p>
      </div>
    </div>
  );
};

export default SignDetectionApp;
