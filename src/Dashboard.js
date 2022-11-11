import React, { useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Button } from "@material-ui/core";
import Video from './Video';

import VideoRecorder from './VideoRecorder';

const useStyles = makeStyles({
  grid: {
    height: "90vh"
  }
});

export default function Dashboard() {
  const classes = useStyles();
  const [show, setShow] = useState(false);
  

  return (
    <Box height="100vh">
      <Grid
        container
        direction="column"
        justifyContent="space-evenly"
        alignItems="stretch"
      >
        <Grid item xs="auto">
          <center>
            <Button id='buttonjs' variant="contained" onClick={() => setShow(!show)}>
              Start
            </Button>
            { show && (
              <Video show={show}></Video>
            )}
          </center>
        </Grid>
      </Grid>
    </Box>
  );
}