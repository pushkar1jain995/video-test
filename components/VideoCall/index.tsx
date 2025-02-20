'use client'
import { useState, useEffect } from 'react'
import {
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteAudioTracks,
  useRemoteUsers,
  RemoteUser,
  LocalVideoTrack,
} from 'agora-rtc-react'

const VideoCall = ({ setVideoCall }: { setVideoCall: (value: boolean) => void }) => {
  // Add check for window object
  if (typeof window === 'undefined') {
    return null
  }

  const [username, setUsername] = useState('')
  const [channelName, setChannelName] = useState('test')

  // Join the channel
  useJoin({
    appid: process.env.NEXT_PUBLIC_AGORA_APP_ID!,
    channel: channelName,
    token: null, // Add your token here if required
  })

  // Local media tracks
  const { localCameraTrack } = useLocalCameraTrack()
  const { localMicrophoneTrack } = useLocalMicrophoneTrack()

  // Publish local tracks
  usePublish([localCameraTrack, localMicrophoneTrack])

  // Remote users
  const remoteUsers = useRemoteUsers()
  const { audioTracks } = useRemoteAudioTracks(remoteUsers)

  // Play remote audio tracks
  audioTracks.forEach((track) => track.play())

  // Set username on component mount
  useEffect(() => {
    setUsername(prompt('Enter your name') || 'User')
  }, [])

  // End call handler
  const endCall = () => {
    setVideoCall(false)
    localCameraTrack?.close()
    localMicrophoneTrack?.close()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap' }}>
        {/* Local video */}
        {localCameraTrack && (
          <div style={{ width: '300px', height: '200px', margin: '10px' }}>
            <LocalVideoTrack track={localCameraTrack} play={true} />
            <p>You ({username})</p>
          </div>
        )}

        {/* Remote videos */}
        {remoteUsers.map((user) => (
          <div key={user.uid} style={{ width: '300px', height: '200px', margin: '10px' }}>
            <RemoteUser user={user} />
            <p>{user.uid}</p>
          </div>
        ))}
      </div>

      {/* End call button */}
      <button onClick={endCall} style={{ padding: '10px', margin: '10px' }}>
        End Call
      </button>
    </div>
  )
}

export default VideoCall