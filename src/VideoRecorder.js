import React, { Component } from 'react';

import 'video.js/dist/video-js.css';
import videojs from 'video.js';

import 'webrtc-adapter';
import RecordRTC from 'recordrtc';

// register videojs-record plugin with this import
import 'videojs-record/dist/css/videojs.record.css';
import Record from 'videojs-record/dist/videojs.record.js';
import TsEBMLEngine from 'videojs-record/dist/plugins/videojs.record.ts-ebml.js';

class VideoRecorder extends Component {
    componentDidMount() {
        // instantiate Video.js
        this.player = videojs(this.videoNode, this.props, () => {
            // print version information at startup
            const version_info = 'Using video.js ' + videojs.VERSION +
                ' with videojs-record ' + videojs.getPluginVersion('record') +
                ' and recordrtc ' + RecordRTC.version;
            videojs.log(version_info);
        });

        // device is ready
        this.player.on('deviceReady', () => {
            console.log('device is ready!');
        });

        // user clicked the record button and started recording
        this.player.on('startRecord', () => {
            console.log('started recording!');
        });

        // user completed recording and stream is available
        this.player.on('finishRecord', () => {
            // recordedData is a blob object containing the recorded data that
            // can be downloaded by the user, stored on server etc.
            // show save as dialog
            this.player.on('finishConvert', function() {
                console.log('finished converting: ', this.player.convertedData);
            });
            this.player.record().saveAs({'video': 'my-video-file-name.webm'});
            console.log('finished recording: ', this.player.recordedData);

            //this part is to update it somewhere else, not locally. Just keep it saved here for later use.

            // var data = this.player.recordedData;
            // var serverUrl = 'https://drive.google.com/drive/folders/0BwbRLkYRHvtVfnJjUWU5dndGME5hQVB1ekRiYVBaMmhrM2lfR1J0SklZUEZJeXlkaG5iNEU?resourcekey=0-n4ssuI4PNnlxMGToX5-bEQ&usp=share_link';
            // var formData = new FormData();
            // formData.append('file', data, data.name);

            // console.log('uploading recording:', data.name);

            // fetch(serverUrl, {
            //     method: 'POST',
            //     body: formData
            // }).then(
            //     success => console.log('recording upload complete.')
            // ).catch(
            //     error => console.error('an upload error occurred!')
            // );
        });

        // error handling
        this.player.on('error', (element, error) => {
            console.warn(error);
        });

        this.player.on('deviceError', () => {
            console.error('device error:', this.player.deviceErrorCode);
        });
    }

    // destroy player on unmount
    componentWillUnmount() {
        if (this.player) {
            this.player.dispose();
        }
    }
    render() {
        return (
        <div data-vjs-player>
            <video id="myVideo" ref={node => this.videoNode = node} className="video-js vjs-default-skin" playsInline></video>
        </div>
        );
    }
}

export default VideoRecorder;
