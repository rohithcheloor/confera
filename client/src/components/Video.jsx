import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { createPosterImage } from "../utilities/imageMaker";

const VideoTile = (props) => {
  const { peer, index, peerName, videoPoster } = props;
  const ref = useRef();
  useEffect(() => {
    const posterImage = createPosterImage(
      String(peerName).slice(0, 2),
      200,
      140
    );
    if (ref.current) ref.current.poster = posterImage;
  }, [peerName]);

  useEffect(() => {
    peer.on("stream", (stream) => {
      toast.success("Stream Started");
      if (ref.current) ref.current.srcObject = stream;
    });
  }, [peer]);
  useEffect(() => {
    peer.on("close", () => {
      toast.error("Stream Closed");
    });
  });
  return (
    <div className="video-tile-container">
      <video
        ref={ref}
        id={`peer-${index}`}
        className="video-stream-2"
        autoPlay
        playsInline
        poster={videoPoster}
      />
      <p className="peer-name">{peerName}</p>
    </div>
  );
};

export default VideoTile;
