import './App.css';

// // get DOM elements
// var dataChannelLog = document.getElementById('data-channel'),
//     iceConnectionLog = document.getElementById('ice-connection-state'),
//     iceGatheringLog = document.getElementById('ice-gathering-state'),
//     signalingLog = document.getElementById('signaling-state');


import React, { Component } from "react";

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
			useAudio: false,
			useVideo: false,
			videoResolution: "1280x720",			//	"320x240"			//	"640x480"			//	"960x540"
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
				return fetch('http://192.168.56.1:8080/offer', {
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
			alert(e);
		});
	}

	async start() {
		console.log('Start')
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
					<div>
						<audio id="audio" autoPlay></audio>
						<video id="video" autoPlay playsInline muted={true}
								style={{ width: '80%', objectFit: 'contain', borderRadius: '4px', transform: 'scaleX(-1)', backgroundColor: '#00000094', 
								boxShadow: '0 0 0 1px rgba(63,63,68,0.05), 0 1px 3px 0 rgba(63,63,68,0.15)', margin: 20}}>
						</video>
					</div>
				)}
			</div>
		);
  }
}

export default Video;