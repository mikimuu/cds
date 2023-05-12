import { useEffect, useRef } from "react";
import videojs from "video.js";

const VideoPlayer = ({ options }) => {
  const videoRef = useRef();

  useEffect(() => {
    const player = videojs(videoRef.current, options);
    return () => {
      player.dispose();
    };
  }, [options]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js" />
    </div>
  );
};

export default VideoPlayer;
