import React, { useEffect, useRef } from "react";

const VideoTile = (props) => {
  const { peer, index, peerName, videoPoster } = props;
  const ref = useRef();
  useEffect(() => {
    console.log(peer);
    peer.on("stream", (stream) => {
        console.log(stream);
      if (ref.current) ref.current.srcObject = stream;
    });
  }, [peer]);
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
