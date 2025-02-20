'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import AgoraRTC, { AgoraRTCProvider } from 'agora-rtc-react'

// Dynamically import VideoCall component with SSR disabled
const VideoCall = dynamic(
  () => import('../components/VideoCall'),
  { ssr: false }
)

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