import React, { useState, useRef, useEffect } from 'react';
import * as tmImage from '@teachablemachine/image';

const SignDetectionApp = () => {
  const URL = "https://teachablemachine.withgoogle.com/models/LkgNnEZoQ/";
  const [predictions, setPredictions] = useState([]);
  const webcamRef = useRef(null);
  const labelContainerRef = useRef(null);
  const [model, setModel] = useState(null);
  const [maxPredictions, setMaxPredictions] = useState(0);

   
  useEffect(() => {
    const init = async () => {
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

     
      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);
      setMaxPredictions(loadedModel.getTotalClasses());

     
      const flip = true;
      const webcam = new tmImage.Webcam(200, 200, flip);
      await webcam.setup();
      await webcam.play();
      webcamRef.current = webcam;

      window.requestAnimationFrame(loop);

       
      document.getElementById("webcam-container").appendChild(webcam.canvas);
    };

    init();
  }, []);

  const loop = async () => {
    webcamRef.current.update();  
    await predict();
    window.requestAnimationFrame(loop);
  };

  const predict = async () => {
    if (model && webcamRef.current) {
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
      <button onClick={() => window.requestAnimationFrame(loop)}>Start</button>
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
