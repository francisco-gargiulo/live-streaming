import React, { useEffect } from "react";
import Hls from "hls.js";

function Video({ src}) {
  const playerRef = React.createRef();

  const toggleFullscreen = () => {
    if (!playerRef.current) {
      return;
    }

    playerRef.current.webkitRequestFullscreen();
  };

  useEffect(() => {
    let hls;

    function _initPlayer() {
      if (hls != null) {
        hls.destroy();
      }

      const newHls = new Hls({
        enableWorker: false,
      });

      if (playerRef.current != null) {
        newHls.attachMedia(playerRef.current);
      }

      newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
        newHls.loadSource(src);
      });

      newHls.on(Hls.Events.ERROR, function (_event, data) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              newHls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              newHls.recoverMediaError();
              break;
            default:
              _initPlayer();
              break;
          }
        }
      });

      hls = newHls;
    }

    if (Hls.isSupported()) {
      _initPlayer();
    }

    return () => {
      if (hls != null) {
        hls.destroy();
      }
    };
  }, []);

  return (
    <>
      {Hls.isSupported() ? (
        <video
          onDoubleClick={toggleFullscreen}
          ref={playerRef}
          src={src}
          controls
        />
      ) : (
        <video ref={playerRef} controls />
      )}
      <h2>Lorem Ipsum</h2>
      <p>
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat."
      </p>
    </>
  );
}

export default Video;
