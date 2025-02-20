'use client'
import { useState } from 'react'
import VideoCall from '../components/VideoCall'
import AgoraRTC, { AgoraRTCProvider } from 'agora-rtc-react'

// Initialize client
const rtcClient = AgoraRTC.createClient({ codec: 'vp8', mode: 'rtc' })

export default function Home() {
  const [videoCall, setVideoCall] = useState(true)

  return (
    <AgoraRTCProvider client={rtcClient}>
      <div>
        {videoCall ? (
          <VideoCall setVideoCall={setVideoCall} />
        ) : (
          <button onClick={() => setVideoCall(true)}>Join Call</button>
        )}
      </div>
    </AgoraRTCProvider>
  )
}