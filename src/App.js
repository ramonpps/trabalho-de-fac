import './App.css';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Grid from '@mui/material/Unstable_Grid2';
import Dashboard from './Dashboard';

function App() {
  return (
    <div>
      <AppBar position="static" className='App' style={{backgroundColor: "#282c34"}}>
        <Toolbar >
            Drone Command Center
        </Toolbar>
      </AppBar>
      <Dashboard></Dashboard>
    </div>
  );
}

export default App;
