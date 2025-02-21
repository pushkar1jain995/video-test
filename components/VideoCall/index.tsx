'use client'
import { useState, useEffect, useRef } from 'react'
import {
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteAudioTracks,
  useRemoteUsers,
  useRemoteVideoTracks,  // Changed from useRemoteVideoTrack
  LocalVideoTrack,
  IAgoraRTCRemoteUser,
} from 'agora-rtc-react'
import JoinForm from '../JoinForm'
import LoadingSpinner from '../ui/LoadingSpinner'
import Tooltip from '../ui/Tooltip'
import ConnectionStatus from '../ui/ConnectionStatus'

// Updated RemoteVideo component
const RemoteVideo = ({ user }: { user: IAgoraRTCRemoteUser }) => {
  const { videoTracks } = useRemoteVideoTracks([user])
  const videoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (videoRef.current && videoTracks[0]) {
      videoTracks[0].play(videoRef.current)
      return () => {
        videoTracks[0]?.stop()
      }
    }
  }, [videoTracks])

  return <div ref={videoRef} className="w-full h-full" />
}

const VideoCall = ({ setVideoCall }: { setVideoCall: (value: boolean) => void }) => {
  if (typeof window === 'undefined') return null

  const [username, setUsername] = useState('')
  const [channelName, setChannelName] = useState('test')
  const [hasPermissions, setHasPermissions] = useState(false)
  const [isJoined, setIsJoined] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [isInitializing, setIsInitializing] = useState(true)

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

  // Update audio level monitoring
  useEffect(() => {
    if (localMicrophoneTrack) {
      const interval = setInterval(() => {
        const level = localMicrophoneTrack.getVolumeLevel()
        setAudioLevel(level)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [localMicrophoneTrack])

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!isJoined) {
    return <JoinForm onJoin={(name) => {
      setUsername(name)
      setIsJoined(true)
    }} />
  }

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Initializing video call...</p>
        </div>
      </div>
    )
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
    <div className="flex flex-col h-screen bg-gray-100">
      <ConnectionStatus isConnected={isConnected} />
      
      <div className="flex-1 flex flex-wrap p-4 gap-4">
        {/* Local video */}
        {localCameraTrack && (
          <div className="relative w-80 h-60 rounded-lg overflow-hidden shadow-lg">
            <LocalVideoTrack track={localCameraTrack} play={true} />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
              <div className="flex items-center justify-between">
                <span>{username}</span>
                <div className="flex items-center space-x-2">
                  {/* Audio level indicator */}
                  <div className="w-16 h-1 bg-gray-700 rounded">
                    <div 
                      className="h-full bg-green-500 transition-all duration-100"
                      style={{ width: `${audioLevel * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Remote videos */}
        {remoteUsers.map((user) => (
          <div key={user.uid} className="relative w-80 h-60 rounded-lg overflow-hidden shadow-lg">
            <RemoteVideo user={user} />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
              <span>Participant {user.uid}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4 p-4 bg-white shadow-top">
        <Tooltip text="End Call">
          <button 
            onClick={endCall}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
          >
            End Call
          </button>
        </Tooltip>
      </div>
    </div>
  )
}

export default VideoCall