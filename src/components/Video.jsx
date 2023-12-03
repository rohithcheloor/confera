import React, { useEffect, useRef } from "react";
import { createPosterImage } from "../utilities/imageMaker";

const VideoTile = (props) => {
  const { peer, index, peerName, videoPoster } = props;
  const ref = useRef();
  useEffect(() => {
    const handlePause = () => {
      const posterImage = createPosterImage(String(peerName).slice(0, 2));
      if (ref.current) ref.current.poster = posterImage;
    };

    const posterImage = createPosterImage(String(peerName).slice(0, 2));
    if (ref.current) {
      ref.current.poster = posterImage;
      ref.current.addEventListener("pause", handlePause);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("pause", handlePause);
      }
    };
  }, [peerName]);

  useEffect(() => {
    peer.on("stream", (stream) => {
      if (ref.current) ref.current.srcObject = stream ?? "";
      ref.current.play();
    });
    peer.on("close", (err) => {
      ref.current.pause();
      if (ref.current) ref.current.srcObject = null;
      console.log(err);
    });
    peer.on("error", (err) => {
      ref.current.pause();
      if (ref.current) ref.current.srcObject = null;
      console.log(err);
    });
    return () => {
      peer.off("stream", () => {
        if (ref.current) ref.current.srcObject = null;
      });
      peer.off("close", () => {
        if (ref.current) ref.current.srcObject = null;
      });
      peer.off("error", () => {
        if (ref.current) ref.current.srcObject = null;
      });
    };
  }, [peer]);

  return (
    <div className="video-tile-container">
      <video
        ref={ref}
        id={`peer-${index}`}
        className="video-stream-2"
      />
      <p className="peer-name">{peerName}</p>
    </div>
  );
};

export default VideoTile;
