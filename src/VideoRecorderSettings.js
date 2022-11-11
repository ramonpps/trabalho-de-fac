import React from 'react';
import VideoRecorder from './VideoRecorder';
import TsEBMLEngine from 'videojs-record/dist/plugins/videojs.record.ts-ebml.js'; //this was supposed to be used to retrieve metadata, but couldnt find out how

const VideoRecorderSettings = () => {
    const videoJsOptions = {
        controls: true,
        bigPlayButton: false,
        width: 400,
        height: 300,
        fluid: false,
        plugins: {
            record: {
                audio: true,
                video: true,
                maxLength: 3600, //if i remove this, default duration will trigger, and it is only 10 seconds.
                debug: true,
                convertAuto: true,
                convertEngine: 'ts-ebml' //tried to use this to retrieve metadata, but failed :(
            }
        }
    };
  return (
    <div className='videorecorder'>
        <center>
            <VideoRecorder { ...videoJsOptions } />
        </center>
    </div>
  )
}

export default VideoRecorderSettings
