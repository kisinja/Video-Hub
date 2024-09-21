import { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { FaVolumeMute } from "react-icons/fa";
import { GoUnmute } from "react-icons/go";

const VideoPlayerWithCustomControls = ({ videoUrl }) => {
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [muted, setMuted] = useState(false);
    const playerRef = useRef(null); // Ref for the player

    const togglePlayPause = () => {
        setPlaying(!playing);
    };

    const handleVolumeChange = (e) => {
        setVolume(parseFloat(e.target.value));

        if (volume === 0) {
            setMuted(true);
        } else {
            setMuted(false);
        }
    };

    const toggleMute = () => {
        setMuted(!muted);
    };

    return (
        <div>
            <div className="player-wrapper">
                <ReactPlayer
                    ref={playerRef}
                    url={videoUrl}
                    className="react-player"
                    width="100%"
                    height="100%"
                    playing={playing}
                    volume={volume}
                    muted={muted}
                    controls={false} // Hide default controls
                />
            </div>

            {/* Custom Controls */}
            <div className="custom-controls justify-between items-center bg-black bg-opacity-90 py-3 px-6 absolute left-0 right-0 rounded-b-lg bottom-0">
                <button onClick={togglePlayPause}>
                    {playing ? <FaPause className='text-white' /> : <FaPlay className='text-white' />}
                </button>

                <div className='flex items-center gap-5'>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={handleVolumeChange}
                    />
                    <button onClick={toggleMute}>
                        {muted ? <FaVolumeMute className='text-white' /> : <GoUnmute className='text-white' />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayerWithCustomControls;
