import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Dashboard from './Dashboard';
import Statistics_component from './Statistics_component';
import AboutUs_component from './AboutUs_component';
import ufflogo from './ufflogo.png';
import { useState } from 'react';
import './App.css';

function App() {
  let [NewRecording,setNewRecording] = useState(false);
  let [Statistics, setStatistics] = useState(false);
  let [AboutUs, setAboutUs] = useState(false);

  if (NewRecording){Statistics = false; AboutUs = false};
  if (Statistics){NewRecording = false; AboutUs = false};
  if (AboutUs){Statistics = false; NewRecording = false};


  return (
    <div>
      <AppBar position="static" className='App' style={{backgroundColor: "#282c34"}}>
        <Toolbar className='toolbar'>
            <h4>Street Quality Detect</h4>
            <div className="ToolbarFlexBox">
              <div className="CameraButtonsBox">
                <button className="CameraButton" onClick={() => setNewRecording(!NewRecording)}>New Recording</button>
                <button className="CameraButton" onClick={() => setStatistics(!Statistics)}>Statistics</button>
                <button className="CameraButton" onClick={() => setAboutUs(!AboutUs)}>About Us</button>
              </div>
            </div>
            <div>
              <img src={ufflogo}></img>
            </div>
        </Toolbar>
      </AppBar>
      <div>
        {NewRecording && (<Dashboard />)}
        {Statistics && (<Statistics_component />)}
        {AboutUs && (<AboutUs_component />)}
        </div>
    </div>
  );
}

export default App;
