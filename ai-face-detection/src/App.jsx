import React, { useRef } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from "./utility";

function App() {
  // setup reference 
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // load facemesh model

  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution: { width: 640, height: 480 }, scale:0.8
    });
    setInterval(() => {
      detect(net);
    }
    , 100);
  }

  // detect face
  const detect = async (net) => {
    if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {

      // get video property 
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // set video width and height
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // make detection
      const face = await net.estimateFaces(video);
      console.log(face);
      // get  canvas context for drawing

      const ctx = canvasRef.current.getContext("2d");
      drawMesh(face, ctx);
    }
  }
  runFacemesh();
  return (
    <div className="App">
      <header className="app-header">
        <h1>Face Mesh App</h1>
      </header>
      <div className="body-container">
      <Webcam
          ref={webcamRef}
          style={{
            position: "relative",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
      </div>
      <div className="footer"></div>
    </div>
  );
}

export default App;
