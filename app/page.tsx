'use client'
import { useState } from 'react'
import VideoCall from '../components/VideoCall'

export default function Home() {
  const [videoCall, setVideoCall] = useState(true)

  return (
    <div>
      {videoCall ? (
        <VideoCall setVideoCall={setVideoCall} />
      ) : (
        <button onClick={() => setVideoCall(true)}>Join Call</button>
      )}
    </div>
  )
}