import React, { useEffect, useRef } from "react";

const VideoTile = (props) => {
  const { peer, index } = props;
  const ref = useRef();
  useEffect(() => {
    peer.on("stream", (stream) => {
      if (ref.current) ref.current.srcObject = stream;
    });
  }, [peer]);
  return (
    <video
      id={`peer-${index}`}
      className="video-stream-2"
      autoPlay
      playsInline
      ref={ref}
    />
  );
};

export default VideoTile;
