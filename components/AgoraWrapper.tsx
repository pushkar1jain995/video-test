'use client'
import { ReactNode } from 'react'
import AgoraRTC, { AgoraRTCProvider } from 'agora-rtc-react'

// Initialize client
const rtcClient = AgoraRTC.createClient({ codec: 'vp8', mode: 'rtc' })

const AgoraWrapper = ({ children }: { children: ReactNode }) => {
  if (typeof window === 'undefined') return null

  return (
    <AgoraRTCProvider client={rtcClient}>
      {children}
    </AgoraRTCProvider>
  )
}

export default AgoraWrapper
