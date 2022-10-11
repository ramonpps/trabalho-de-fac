// import logo from './logo.svg';
import './App.css';
import AppBar from "@mui/material/AppBar";
// import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";

function Video() {
  return (
    <div id="media" >

			<audio id="audio" autoPlay></audio>
			{/* <video width="100%" height="100%" autoPlay src='./sampleBoat2.mp4'></video> */}
			<video autoPlay playsInline muted={true}
					style={{ width: '95%', objectFit: 'contain', borderRadius: '4px', transform: 'scaleX(-1)', backgroundColor: '#00000094', 
					boxShadow: '0 0 0 1px rgba(63,63,68,0.05), 0 1px 3px 0 rgba(63,63,68,0.15)', margin: 20}}>
			</video>
			{/* <video id="video" autoplay="true" playsinline="true"></video> */}
		</div>
  );
}

export default Video;