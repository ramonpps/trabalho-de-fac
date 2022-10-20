import React, { useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Box, Grid } from "@material-ui/core";
import Video from './Video';

const useStyles = makeStyles({
  grid: {
    height: "90vh"
  }
});

export default function Dashboard() {
  const classes = useStyles();
  const [show, setShow] = useState(false);

  return (
    <Box height="100vh" mr={4}>
      <Grid
        container
        direction="column"
        justifyContent="space-evenly"
        alignItems="stretch"
      >
        <Grid item xs="auto">
          <center>
            <Button variant="contained" color="default" onClick={() => setShow(!show)}>
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