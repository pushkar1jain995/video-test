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
import JoinForm from '../JoinForm'

const VideoCall = ({ setVideoCall }: { setVideoCall: (value: boolean) => void }) => {
  if (typeof window === 'undefined') return null

  const [username, setUsername] = useState('')
  const [channelName, setChannelName] = useState('test')
  const [hasPermissions, setHasPermissions] = useState(false)
  const [isJoined, setIsJoined] = useState(false)

  // Request permissions first
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        setHasPermissions(true)
      } catch (err) {
        console.error('Error getting permissions:', err)
        alert('Please allow camera and microphone access to use this app')
      }
    }
    requestPermissions()
  }, [])

  // Only proceed with join and tracks if we have permissions and username
  const { isConnected } = useJoin({
    appid: process.env.NEXT_PUBLIC_AGORA_APP_ID!,
    channel: channelName,
    token: null,
    uid: Math.floor(Math.random() * 1000000),
  }, isJoined)

  const { localCameraTrack, error: cameraError } = useLocalCameraTrack(hasPermissions)
  const { localMicrophoneTrack, error: micError } = useLocalMicrophoneTrack(hasPermissions)

  // Only publish tracks if we're connected and have tracks
  usePublish(
    [localCameraTrack, localMicrophoneTrack].filter(Boolean)
  )

  const remoteUsers = useRemoteUsers()
  const { audioTracks } = useRemoteAudioTracks(remoteUsers)

  useEffect(() => {
    if (audioTracks.length > 0) {
      audioTracks.forEach((track) => track.play())
    }
  }, [audioTracks])

  if (!isJoined) {
    return <JoinForm onJoin={(name) => {
      setUsername(name)
      setIsJoined(true)
    }} />
  }

  const endCall = () => {
    localCameraTrack?.close()
    localMicrophoneTrack?.close()
    setVideoCall(false)
  }

  if (cameraError || micError) {
    return (
      <div>
        <p>Error accessing media devices. Please check permissions.</p>
        <button onClick={endCall}>Leave</button>
      </div>
    )
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