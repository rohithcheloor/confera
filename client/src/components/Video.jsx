import React, { useEffect, useRef } from "react";
import { createPosterImage } from "../utilities/imageMaker";

const VideoTile = (props) => {
  const { peer, index, peerName, videoPoster } = props;
  const ref = useRef();
  useEffect(() => {
    const posterImage = createPosterImage(
      String(peerName).slice(0, 2)
    );
    if (ref.current) ref.current.poster = posterImage;
  }, [peerName]);

  useEffect(() => {
    peer.on("stream", (stream) => {
      if (ref.current) ref.current.srcObject = stream;
    });
  }, [peer]);

  return (
    <div className="video-tile-container">
      <video
        poster={videoPoster}
        ref={ref}
        id={`peer-${index}`}
        className="video-stream-2"
        // autoPlay
        playsInline
      />
      <p className="peer-name">{peerName}</p>
    </div>
  );
};

export default VideoTile;
