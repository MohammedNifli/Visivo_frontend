import React, { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../context/socketProvider';
import peer from '../services/peer';
const Room = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocktId] = useState(null);
  const [myStream, setMyStream] = useState(null);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`User joined: ${email},${id}`);
    setRemoteSocktId(id);
  }, []);

  const handleUserCall = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log(stream);
      const offer=await peer.getOffer();
      console.log("made offer",remoteSocketId)
      socket.emit("user:call",{to:remoteSocketId,offer})
      setMyStream(stream);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  }, []);

  const handleIncomingCall=useCallback((from ,offer)=>{
    console.log(`incoming call ${from } an offer ${offer} `)


  },[])

  useEffect(() => {
    socket.on('user:joined', handleUserJoined);
    socket.on("incoming:call",handleIncomingCall)
    return () => {
      socket.off('user:joined', handleUserJoined);
      socket.off('incoming:call', handleIncomingCall);

    };
  }, [socket, handleUserJoined,handleIncomingCall]);

  return (
    <div className="flex justify-center">
      <div>
        <h1 className="font-semibold text-3xl">Room</h1>
        <h4 className="font-semibold text-3xl">{remoteSocketId ? 'Connected' : 'No one in room'}</h4>
        <div>
          <button
            className="font-semibold text-3xl bg-green-500 w-20 h-10"
            onClick={handleUserCall}
          >
            Call
          </button>

          {myStream && (
            <video
              height="300px"
              width="500px"
              autoPlay
              muted
              playsInline
              ref={(video) => {
                if (video) video.srcObject = myStream;
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Room;
