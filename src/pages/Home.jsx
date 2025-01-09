
    import  { useEffect, useState, useRef } from 'react';
    import { io } from 'socket.io-client';
    import Peer from 'simple-peer';  

    const Home = () => {
        const [me, setMe] = useState('');
        const [stream, setStream] = useState(null); 
        const [receivingCall, setReceivingCall] = useState(false);
        const [caller, setCaller] = useState('');
        const [callerSignal, setCallerSignal] = useState(null);  
        const [callAccepted, setCallAccepted] = useState(false);
        const [idToCall, setIdToCall] = useState('');
        const [callEnded, setCallEnded] = useState(false);
        const [name, setName] = useState('');

        const myVideo = useRef();    
        const userVideo = useRef();
        const connectionRef = useRef();
        const socketRef = useRef();

        useEffect(() => {
            socketRef.current = io('http://localhost:3000');

       
            const getMediaStream = async () => {
                try {
                    const currentStream = await navigator.mediaDevices.getUserMedia({ 
                        video: true, 
                        audio: true 
                    });
                    setStream(currentStream);
                    if (myVideo.current) {
                        myVideo.current.srcObject = currentStream;
                    }
                } catch (err) {
                    console.error("Failed to get media stream:", err);
                }
            };

            getMediaStream();

            socketRef.current.on('me', (id) => {
                setMe(id);
            });

            socketRef.current.on('callUser', (data) => {
                setReceivingCall(true);
                setCaller(data.from);
                setName(data.name);
                setCallerSignal(data.signal);
            });

            return () => {
                if (socketRef.current) {
                    socketRef.current.disconnect();
                }
               
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            };
        }, []);

        const callUser = (id) => {
         
            
            if (!stream) {
                console.error("No media stream available");
                return;
            }

            try {
                const peer = new Peer({
                    initiator: true,
                    trickle: false,
                    stream: stream
                });

                peer.on('signal', (data) => {
                    socketRef.current.emit('callUser', {
                        userToCall: id,
                        signalData: data,
                        from: me,
                        name: name
                    });
                });

                peer.on('stream', (remoteStream) => {
                    if (userVideo.current) {
                        userVideo.current.srcObject = remoteStream;
                    }
                });

                socketRef.current.on('callAccepted', (signal) => {
                    setCallAccepted(true);
                    peer.signal(signal);
                });

                connectionRef.current = peer;
            } catch (err) {
                console.error("Error creating peer connection:", err);
            }
        };

        const answerCall = () => {
            if (!stream) {
                console.error("No media stream available");
                return;
            }

            try {
                setCallAccepted(true);
                const peer = new Peer({
                    initiator: false,
                    trickle: false,
                    stream: stream
                });
 
                peer.on('signal', (data) => {
                    socketRef.current.emit('answerCall', {
                        signal: data,
                        to: caller
                    });
                });

                peer.on('stream', (remoteStream) => {
                    userVideo.current.srcObject = remoteStream;
                });

                peer.signal(callerSignal);
                connectionRef.current = peer;
            } catch (err) {
                console.error("Error answering call:", err);
            }
        };

        const leaveCall = () => {
            setCallEnded(true);
            if (connectionRef.current) {
                connectionRef.current.destroy();
            }
           
            setTimeout(() => window.location.reload(), 100);
        };

        return (
            <div className="flex flex-col items-center p-4">
                <h1 className="text-3xl font-bold mb-6">Video Call</h1>
                
                <div className="mb-4">
                    {me && <p className="text-gray-600 mb-2">Your ID: {me}</p>}
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        className="px-4 py-2 border rounded mr-2"
                    />
                    <input
                        type="text"
                        value={idToCall}
                        onChange={(e) => setIdToCall(e.target.value)}
                        placeholder="ID to Call"
                        className="px-4 py-2 border rounded mr-2"
                    />
                    {callAccepted && !callEnded ? (
                        <button
                            onClick={leaveCall}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            End Call
                        </button>
                    ) : (
                        <button
                            onClick={() => callUser(idToCall)}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                            disabled={!stream}
                        >
                            Call
                        </button>
                    )}
                </div>

                {receivingCall && !callAccepted && (
                    <div className="bg-yellow-100 p-4 rounded mb-4">
                        <h3>{name} is calling...</h3>
                        <button
                            onClick={answerCall}
                            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                            disabled={!stream}
                        >
                            Answer Call
                        </button>
                    </div>
                )}

                <div className="flex flex-wrap gap-4">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Your Video</h2>
                        <video
                            playsInline
                            muted
                            ref={myVideo}
                            autoPlay
                            className="w-[400px] h-[300px] bg-gray-200 rounded"
                        />
                    </div>
                    {callAccepted && !callEnded && (
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Remote Video</h2>
                            <video
                                playsInline
                                ref={userVideo}
                                autoPlay
                                className="w-[400px] h-[300px] bg-gray-200 rounded"
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    export default Home;