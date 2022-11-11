import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Dashboard from './Dashboard';
import VideoRecorderSettings from './VideoRecorderSettings';
import { useState } from 'react';
import './App.css';

function App() {
  const [dashboard,setDashboard] = useState(true)
  let ButtonName;
  dashboard ? ButtonName = 'Recordings' : ButtonName = 'Dashboard'
  return (
    <div>
      <AppBar position="static" className='App' style={{backgroundColor: "#282c34"}}>
        <Toolbar className='toolbar'>
            <h3>Drone Command Center</h3>
              <button onClick={() => setDashboard(!dashboard)}>Switch to {ButtonName}</button>
        </Toolbar>
      </AppBar>
        {dashboard ? <Dashboard /> : <VideoRecorderSettings />}
    </div>
  );
}

export default App;
