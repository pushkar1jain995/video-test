'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the AgoraRTCProvider wrapper
const AgoraWrapper = dynamic(
  () => import('../components/AgoraWrapper'),
  { ssr: false }
)

// Dynamically import VideoCall component with SSR disabled
const VideoCall = dynamic(
  () => import('../components/VideoCall'),
  { ssr: false }
)

export default function Home() {
  const [videoCall, setVideoCall] = useState(true)

  return (
    <AgoraWrapper>
      <div>
        {videoCall ? (
          <VideoCall setVideoCall={setVideoCall} />
        ) : (
          <button onClick={() => setVideoCall(true)}>Join Call</button>
        )}
      </div>
    </AgoraWrapper>
  )
}