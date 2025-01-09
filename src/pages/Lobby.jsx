import React, { useState } from 'react'

const Lobby = () => {

    const [email,setEmail]=useState('');
    const [room,setRoom]=useState('')
    const submitForm=(e)=>{
        e.preventDefault()
        console.log('data',email,room)
    }

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