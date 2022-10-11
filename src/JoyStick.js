// import logo from './logo.svg';
import './App.css';
import { Joystick } from 'react-joystick-component';

function JoyStick() {
  return (
    <Joystick size={100} sticky={false} baseColor="rgb(0, 0, 51)" stickColor="rgb(61, 89, 171)" 
        // move={handleMove} stop={handleStop}
    ></Joystick>
  );
}

export default JoyStick;