import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3501'); // Update this with your backend URL

const LiveStream = () => {
    const [stream, setStream] = useState(null);
    const [peers, setPeers] = useState([]);
    const userVideoRef = useRef();
    const peerVideoRef = useRef();

    const roomId = window.location.pathname.split('/')[2];
    const userId = useSelector((state) => state.user.currentUser._id);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
            setStream(currentStream);
            if (userVideoRef.current) {
                userVideoRef.current.srcObject = currentStream;
            }

            socket.emit('join-room', roomId, userId);

            socket.on('user-connected', (userId) => {
                console.log(`User connected: ${userId}`);
                const peerConnection = createPeerConnection(userId, socket, currentStream);
                setPeers((peers) => [...peers, peerConnection]);
            });

            socket.on('offer', (offer) => {
                const peerConnection = createPeerConnection(null, socket, currentStream);
                peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                peerConnection.createAnswer().then((answer) => {
                    peerConnection.setLocalDescription(answer);
                    socket.emit('answer', roomId, answer);
                });
            });

            socket.on('answer', (answer) => {
                const peerConnection = createPeerConnection(null, socket, currentStream);
                peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            });

            socket.on('ice-candidate', (candidate) => {
                const peerConnection = createPeerConnection(null, socket, currentStream);
                peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            });
        });

        return () => {
            stream.getTracks().forEach((track) => track.stop());
            socket.disconnect();
        };
    }, []);

    const createPeerConnection = (userId, socket, stream) => {
        const peerConnection = new RTCPeerConnection();
        stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', roomId, event.candidate);
            }
        };

        peerConnection.ontrack = (event) => {
            if (peerVideoRef.current) {
                peerVideoRef.current.srcObject = event.streams[0];
            }
        };

        peerConnection.createOffer().then((offer) => {
            peerConnection.setLocalDescription(offer);
            socket.emit('offer', roomId, offer);
        });

        return peerConnection;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
            <div className="mb-4">
                <video
                    ref={userVideoRef}
                    autoPlay
                    muted
                    className="border-2 border-red-600 w-full max-w-md rounded-lg"
                />
                <p className="text-red-500 mt-2">You are live</p>
            </div>
            <div>
                <video
                    ref={peerVideoRef}
                    autoPlay
                    className="border-2 border-red-600 w-full max-w-md rounded-lg"
                />
                <p className="text-red-500 mt-2">Other user</p>
            </div>
        </div>
    );
};

export default LiveStream;