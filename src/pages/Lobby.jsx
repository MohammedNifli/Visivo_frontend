/* eslint-disable no-unused-vars */
import  { useCallback, useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/socketProvider';

const Lobby = () => {
    const navigate=useNavigate()


    const [email,setEmail]=useState('');
    const [room,setRoom]=useState('')
    const socket=useSocket();
    console.log("socket",socket)
    const submitForm=(e)=>{
        e.preventDefault()
        console.log('data',email,room)
        socket.emit('room:join',{email,room})
        navigate(`/room/${room}`)
    }
    const handleRoomJoin=useCallback((data)=>{
      
    },[]);

    useEffect(()=>{
      socket.on("room:join",handleRoomJoin)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[socket])

  return (
    <div>
        <form action="" onSubmit={submitForm}>
            <h1 className='text-white bg-black items-center justify-center'>Lobby</h1>
        <label htmlFor="">Email</label>
        <input type="email" className='border border-black' value={email} onChange={e=>setEmail(e.target.value)} />
        <br />
        <br />
        <label htmlFor="">Room</label>
        <input className='border border-black' type="text" value={room} onChange={e=>setRoom(e.target.value)} />
        <button className='bg-blue-600 w-20 rounded-md border border-black' type='submit'>Join</button>

        </form>
        
        
    </div>
  )
}

export default Lobby