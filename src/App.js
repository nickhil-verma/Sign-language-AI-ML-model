import React from 'react';
import "./App.css"
import SignDetectionApp from './SignDetectionApp';
import { HiMiniSpeakerWave } from "react-icons/hi2";
import Navbar from './Navbar';
function App() {
    return (<> <Navbar/>
     <div className="App">
       
       <SignDetectionApp/>
        
     </div></>
       
    );
}

export default App;
