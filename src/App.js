// import logo from './logo.svg';
import './App.css';
import Video from './Video';
import JoyStick from './JoyStick';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Grid from '@mui/material/Unstable_Grid2';
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";

function App() {
  return (
    <div>
      <AppBar position="static" className='App' style={{backgroundColor: "#282c34"}}>
        <Toolbar >
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}

            Drone Command Center
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>
      <Grid
        container
        direction="row"
        justify="flex-end"
        alignItems="center"
      >
        <Grid xs={10}>
          <Video></Video>
        </Grid>
        <Grid xs={2}>
          {/* <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{
              backgroundColor:"rgb(234, 237, 242)"
            }}
          > */}
          <div style={{width:"200px"}}><JoyStick></JoyStick></div>
            
          {/* </Box> */}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
