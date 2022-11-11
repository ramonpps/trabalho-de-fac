import React, { Component } from 'react';

import 'video.js/dist/video-js.css';
import videojs from 'video.js';

import 'webrtc-adapter';
import RecordRTC from 'recordrtc';

// register videojs-record plugin with this import
import 'videojs-record/dist/css/videojs.record.css';
import Record from 'videojs-record/dist/videojs.record.js';
import TsEBMLEngine from 'videojs-record/dist/plugins/videojs.record.ts-ebml.js';

// // get DOM elements
// var dataChannelLog = document.getElementById('data-channel'),
//     iceConnectionLog = document.getElementById('ice-connection-state'),
//     iceGatheringLog = document.getElementById('ice-gathering-state'),
//     signalingLog = document.getElementById('signaling-state');

class Video extends Component {
	// // get DOM elements
	// dataChannelLog = document.getElementById('data-channel'),
	// iceConnectionLog = document.getElementById('ice-connection-state'),
	// iceGatheringLog = document.getElementById('ice-gathering-state'),
	// signalingLog = document.getElementById('signaling-state');

  constructor(props) {
    super();
    this.state = {
      pc: null,							// peer connection
			dc: null, 						// data channel
			dcInterval: null,			// data channel
			show: props.show,
			useStun: false,
			useDataChannel: true,
      controls: true,
      bigPlayButton: false,
      fluid: false,
      width: 400,
      height: 500,
			useAudio: true,
			useVideo: true,
      autoPlay: true,
      plugins: {
        record: {
            audio: true,
            video: true,
            maxLength: 3600, //if i remove this, default duration will trigger, and it is only 10 seconds.

        }
      },
			videoResolution: "1280x720",			//	"320x240"			//	"640x480"			//	"960x540"			//	"1280x720"
			videoCodec: "default",						//	"VP8/90000" 	// 	"H264/90000"	//	"default"
			audioCodec: "default", 						//	"opus/48000/2"//	"PCMU/8000"		//	"PCMA/8000"
			dataChannelParameters: {"ordered": true}		//	{"ordered": false, "maxRetransmits": 0}	//	{"ordered": false, "maxPacketLifetime": 500}
		};
  }

	componentDidMount(){
		if(this.props.show) {
			this.start();
		} else {
			this.stop();
			document.removeEventListener('keydown', this.handleKeyDown);
		}
	}

	handleKeyDown(e) {
		console.log(e.keyCode);
		if(this.state.dc) {
			var message = 's';
			this.state.dc.send(message);
		}
	}

	createPeerConnection() {
    var config = {
        sdpSemantics: 'unified-plan'
    };

    if (this.state.useStun) {
        config.iceServers = [{urls: ['stun:stun.l.google.com:19302']}];
    }

    this.state.pc = new RTCPeerConnection(config);
    // connect audio / video
    this.state.pc.addEventListener('track', function(evt) {
			console.log('track listener')
			console.log(evt)
			console.log(document.getElementById('video'))
        if (evt.track.kind == 'video')
            document.getElementById('video').srcObject = evt.streams[0];
        else
            document.getElementById('audio').srcObject = evt.streams[0];
    });

	}

	negotiate() {
		this.state.pc.addTransceiver('video', {direction: 'recvonly'});
		// this.state.pc.addTransceiver('audio', {direction: 'recvonly'});
		return this.state.pc.createOffer().then(function(offer) {
			return this.state.pc.setLocalDescription(offer);
		}.bind(this)).then(function() {
			// wait for ICE gathering to complete
			return new Promise(function(resolve) {
				console.log(this.state.pc)
				if (this.state.pc.iceGatheringState === 'complete') {
					resolve();
				} else {
					function checkState() {
						if (this.state.pc.iceGatheringState === 'complete') {
							this.state.pc.removeEventListener('icegatheringstatechange', checkState);
							resolve();
						}
					}
					this.state.pc.addEventListener('icegatheringstatechange', checkState.bind(this));
				}
			}.bind(this));
		}.bind(this)).then(function() {
			console.log('test')
				var offer = this.state.pc.localDescription;
				return fetch('http://10.100.14.102:8080/offer', {
					body: JSON.stringify({
						sdp: offer.sdp,
						type: offer.type,
						video_transform: "none",
					}),
					headers: {
							'Content-Type': 'application/json',
					},
					method: 'POST'
			});
		}.bind(this)).then(function(response) {
			return response.json();
		}).then(function(answer) {
			return this.state.pc.setRemoteDescription(answer);
		}.bind(this)).catch(function(e) {
			//alert(e);
		});
	}

	async start() {
		  console.log('Start')
      // instantiate Video.js
      this.player = videojs(this.videoNode, this.state, () => {
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
          console.log('finished recording: ', this.player.recordedData);});

		this.createPeerConnection();

		if(this.state.useDataChannel){
			console.log('data channel parameters')
			var parameters = this.state.dataChannelParameters;
			this.state.dc = this.state.pc.createDataChannel('chat', parameters);
			this.state.dc.onclose = function() {
					console.log('data channel closed');
			};
			this.state.dc.onopen = function() {
				console.log('data channel open')
				console.log(document)
				// document.addEventListener('keydown', this.handleKeyDown);
				document.addEventListener('keydown', (event) => {
					console.log(event.key)
					// console.log(this.state.dc)
					this.state.dc.send(event.key)
				});

					// dataChannelLog.textContent += '- open\n';
					// dcInterval = setInterval(function() {
					// 		var message = 'ping ' + current_stamp();
					// 		dataChannelLog.textContent += '> ' + message + '\n';
					// 		dc.send(message);
					// }, 1000);
			}.bind(this);
			this.state.dc.onmessage = function(evt) {
				console.log('data received');
				console.log(evt.data);
			};
		}




		this.negotiate();


	}

	stop() {

		document.getElementById('stop').style.display = 'none';
		var dc = this.state.dc;
		var pc = this.state.pc;

		// close data channel
		if (dc) {
				dc.close();
		}

		// close transceivers
		if (pc.getTransceivers) {
				pc.getTransceivers().forEach(function(transceiver) {
						if (transceiver.stop) {
								transceiver.stop();
						}
				});
		}

		// close local audio / video
		pc.getSenders().forEach(function(sender) {
				sender.track.stop();
		});

		// close peer connection
		setTimeout(function() {
				pc.close();
		}, 500);
		this.state.dc = dc;
		this.state.pc = pc;

    if (this.player) {
      this.player.dispose();
  }
	}

	sdpFilterCodec(kind, codec, realSdp) {
			var allowed = []
			var rtxRegex = new RegExp('a=fmtp:(\\d+) apt=(\\d+)\r$');
			var codecRegex = new RegExp('a=rtpmap:([0-9]+) ' + this.escapeRegExp(codec))
			var videoRegex = new RegExp('(m=' + kind + ' .*?)( ([0-9]+))*\\s*$')

			var lines = realSdp.split('\n');

			var isKind = false;
			for (var i = 0; i < lines.length; i++) {
				if (lines[i].startsWith('m=' + kind + ' ')) {
					isKind = true;
				} else if (lines[i].startsWith('m=')) {
					isKind = false;
				}

				if (isKind) {
					var match = lines[i].match(codecRegex);
					if (match) {
						allowed.push(parseInt(match[1]));
					}

					match = lines[i].match(rtxRegex);
					if (match && allowed.includes(parseInt(match[2]))) {
						allowed.push(parseInt(match[1]));
					}
				}
			}

			var skipRegex = 'a=(fmtp|rtcp-fb|rtpmap):([0-9]+)';
			var sdp = '';

			isKind = false;
			for (var i = 0; i < lines.length; i++) {
					if (lines[i].startsWith('m=' + kind + ' ')) {
							isKind = true;
					} else if (lines[i].startsWith('m=')) {
							isKind = false;
					}

					if (isKind) {
							var skipMatch = lines[i].match(skipRegex);
							if (skipMatch && !allowed.includes(parseInt(skipMatch[2]))) {
									continue;
							} else if (lines[i].match(videoRegex)) {
									sdp += lines[i].replace(videoRegex, '$1 ' + allowed.join(' ')) + '\n';
							} else {
									sdp += lines[i] + '\n';
							}
					} else {
							sdp += lines[i] + '\n';
					}
			}

			return sdp;
	}

	escapeRegExp(string) {
			return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	}

  render() {
		const { show } = this.state;
    return (
			<div id="media">
				{show && (
					<center>
						<audio id="audio" autoPlay></audio>
						<video id="myVideo" ref={video => this.videoNode = video} playsInline
								style={{objectFit: 'contain', borderRadius: '30px', backgroundColor: '#00000094',
								boxShadow: '0 0 0 1px rgba(63,63,68,0.05), 0 1px 3px 0 rgba(63,63,68,0.15)', margin: 0}}>
						</video>
					</center>
				)}
			</div>
		);
  }
}

export default Video;
