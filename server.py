import argparse
import asyncio
import json
import logging
import os
import ssl
import uuid
import aiohttp_cors

import cv2
from aiohttp import web
from av import VideoFrame
from aiohttp_middlewares import (
    cors_middleware,
    error_middleware,
)


from aiortc import MediaStreamTrack, RTCPeerConnection, RTCSessionDescription
from aiortc.contrib.media import MediaBlackhole, MediaPlayer, MediaRecorder, MediaRelay
import numpy as np

from utils import detect_horizon_line

ROOT = os.path.dirname(__file__)

logger = logging.getLogger("pc")
pcs = set()
relay = MediaRelay()
from aiortc import (
    RTCIceCandidate,
    RTCPeerConnection,
    RTCSessionDescription,
    VideoStreamTrack,
)
class VideoImageTrack(VideoStreamTrack):
    """
    A video stream track that returns a rotating image.
    """

    def __init__(self):
        super().__init__()  # don't forget this!

        # self.video = cv2.VideoCapture('sampleBoat2.mp4')
        self.video = cv2.VideoCapture(0)

    async def recv(self):
        pts, time_base = await self.next_timestamp()

        retval, image = self.video.read()
        if(image is not None):
            lo=np.array([50,50,50])
            hi=np.array([100,75,85])

            # Mask image to only select browns
            mask=cv2.inRange(image,lo,hi)

            # Change image to red where we found brown
            image[mask>0]=(0,0,255)

            image_grayscale = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            horizon_x1, horizon_x2, horizon_y1, horizon_y2 = detect_horizon_line(
                image_grayscale
            )
            line_thickness = 2
            cv2.line(image, (horizon_x1, horizon_y1), (horizon_x2, horizon_y2), (0, 255, 0), thickness=line_thickness)
            # cv2.imshow('frame',image)
            frame = VideoFrame.from_ndarray(image, format="bgr24")
            frame.pts = pts
            frame.time_base = time_base
            return frame


# class VideoTransformTrack(MediaStreamTrack):
#     """
#     A video stream track that transforms frames from an another track.
#     """

#     kind = "video"

#     def __init__(self, track, transform):
#         super().__init__()  # don't forget this!
#         self.track = track
#         self.transform = transform

#     async def recv(self):
#         frame = await self.track.recv()

#         if self.transform == "cartoon":
#             img = frame.to_ndarray(format="bgr24")

#             # prepare color
#             img_color = cv2.pyrDown(cv2.pyrDown(img))
#             for _ in range(6):
#                 img_color = cv2.bilateralFilter(img_color, 9, 9, 7)
#             img_color = cv2.pyrUp(cv2.pyrUp(img_color))

#             # prepare edges
#             img_edges = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
#             img_edges = cv2.adaptiveThreshold(
#                 cv2.medianBlur(img_edges, 7),
#                 255,
#                 cv2.ADAPTIVE_THRESH_MEAN_C,
#                 cv2.THRESH_BINARY,
#                 9,
#                 2,
#             )
#             img_edges = cv2.cvtColor(img_edges, cv2.COLOR_GRAY2RGB)

#             # combine color and edges
#             img = cv2.bitwise_and(img_color, img_edges)

#             # rebuild a VideoFrame, preserving timing information
#             new_frame = VideoFrame.from_ndarray(img, format="bgr24")
#             new_frame.pts = frame.pts
#             new_frame.time_base = frame.time_base
#             return new_frame
#         elif self.transform == "edges":
#             # perform edge detection
#             img = frame.to_ndarray(format="bgr24")
#             img = cv2.cvtColor(cv2.Canny(img, 100, 200), cv2.COLOR_GRAY2BGR)

#             # rebuild a VideoFrame, preserving timing information
#             new_frame = VideoFrame.from_ndarray(img, format="bgr24")
#             new_frame.pts = frame.pts
#             new_frame.time_base = frame.time_base
#             return new_frame
#         elif self.transform == "rotate":
#             # rotate image
#             img = frame.to_ndarray(format="bgr24")
#             rows, cols, _ = img.shape
#             M = cv2.getRotationMatrix2D((cols / 2, rows / 2), frame.time * 45, 1)
#             img = cv2.warpAffine(img, M, (cols, rows))

#             # rebuild a VideoFrame, preserving timing information
#             new_frame = VideoFrame.from_ndarray(img, format="bgr24")
#             new_frame.pts = frame.pts
#             new_frame.time_base = frame.time_base
#             return new_frame
#         else:
#             return frame


async def index(request):
    content = open(os.path.join(ROOT, "index.html"), "r").read()
    return web.Response(content_type="text/html", text=content)


async def javascript(request):
    content = open(os.path.join(ROOT, "client.js"), "r").read()
    return web.Response(content_type="application/javascript", text=content)


# async def offer(request):
#     params = await request.json()
#     print(params)
#     offer = RTCSessionDescription(sdp=params["sdp"], type=params["type"])
#     # print(params["client"])
#     pc = RTCPeerConnection()
#     pc_id = "PeerConnection(%s)" % uuid.uuid4()
#     pcs.add(pc)
#     print(pc)

#     def log_info(msg, *args):
#         logger.info(pc_id + " " + msg, *args)

#     log_info("Created for %s", request.remote)

#     # prepare local media
#     # player = MediaPlayer(os.path.join(ROOT, "demo-instruct.wav"))
#     # if args.record_to:
#     #     recorder = MediaRecorder(args.record_to)
#     # else:
#     recorder = MediaBlackhole()

#     @pc.on("datachannel")
#     def on_datachannel(channel):
#         @channel.on("message")
#         def on_message(message):
#             print(message)
#             # if isinstance(message, str) and message.startswith("ping"):
#             #     channel.send("pong" + message[4:])

#     @pc.on("connectionstatechange")
#     async def on_connectionstatechange():
#         log_info("Connection state is %s", pc.connectionState)
#         if pc.connectionState == "failed":
#             await pc.close()
#             pcs.discard(pc)

#     @pc.on("track")
#     def on_track(track):
#         log_info("Track %s received", track.kind)
#         print(pcs)

#         if track.kind == "audio":
#             pc.addTrack(player.audio)
#             recorder.addTrack(track)
#         elif track.kind == "video":
#             # player = MediaPlayer('sampleBoat2.mp4')
#             pc.addTrack(
#                 VideoImageTrack()
#                 # VideoTransformTrack(player.video, transform='edges')
#                 # VideoTransformTrack(
#                 #     relay.subscribe(track), transform=params["video_transform"]
#                 # )
#             )
#             if args.record_to:
#                 recorder.addTrack(relay.subscribe(track))

#         @track.on("ended")
#         async def on_ended():
#             log_info("Track %s ended", track.kind)
#             await recorder.stop()

#     # handle offer
#     await pc.setRemoteDescription(offer)
#     await recorder.start()

#     # send answer
#     answer = await pc.createAnswer()
#     await pc.setLocalDescription(answer)

#     return web.Response(
#         content_type="application/json",
#         text=json.dumps(
#             {"sdp": pc.localDescription.sdp, "type": pc.localDescription.type}
#         ),
#     )



async def offer(request):
    params = await request.json()
    offer = RTCSessionDescription(sdp=params["sdp"], type=params["type"])

    pc = RTCPeerConnection()
    pcs.add(pc)

    @pc.on("datachannel")
    def on_datachannel(channel):
        @channel.on("message")
        def on_message(message):
            print(message)

    @pc.on("connectionstatechange")
    async def on_connectionstatechange():
        print("Connection state is %s" % pc.connectionState)
        if pc.connectionState == "failed":
            await pc.close()
            pcs.discard(pc)

    # open media source
    # audio, video = create_local_tracks(args.play_from)

    await pc.setRemoteDescription(offer)
    for t in pc.getTransceivers():
        print("")
        print("")
        print("")
        print(t)
        print("")
        print("")
        print("")
        if t.kind == "video":
            # pc.addTrack(audio)
        # elif t.kind == "video":
            pc.addTrack(VideoImageTrack())

    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    return web.Response(
        content_type="application/json",
        text=json.dumps(
            {"sdp": pc.localDescription.sdp, "type": pc.localDescription.type}
        ),
    )


async def on_shutdown(app):
    # close peer connections
    coros = [pc.close() for pc in pcs]
    await asyncio.gather(*coros)
    pcs.clear()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="WebRTC audio / video / data-channels demo"
    )
    parser.add_argument("--cert-file", help="SSL certificate file (for HTTPS)")
    parser.add_argument("--key-file", help="SSL key file (for HTTPS)")
    parser.add_argument(
        "--host", default="0.0.0.0", help="Host for HTTP server (default: 0.0.0.0)"
    )
    parser.add_argument(
        "--port", type=int, default=8080, help="Port for HTTP server (default: 8080)"
    )
    parser.add_argument("--record-to", help="Write received media to a file."),
    parser.add_argument("--verbose", "-v", action="count")
    args = parser.parse_args()

    if args.verbose:
        logging.basicConfig(level=logging.DEBUG)
    else:
        logging.basicConfig(level=logging.INFO)

    if args.cert_file:
        ssl_context = ssl.SSLContext()
        ssl_context.load_cert_chain(args.cert_file, args.key_file)
    else:
        ssl_context = None

    app = web.Application()
    # cors = aiohttp_cors.setup(app)
    cors = aiohttp_cors.setup(app, defaults={
        "*": aiohttp_cors.ResourceOptions(
            allow_credentials=True,
            expose_headers="*",
            allow_headers="*",
        )
    })

    app.on_shutdown.append(on_shutdown)
    cors.add(app.router.add_get("/", index))
    cors.add(app.router.add_get("/client.js", javascript),)
    cors.add(app.router.add_post("/offer", offer))
    web.run_app(
        app, access_log=None, host=args.host, port=args.port, ssl_context=ssl_context
    )
