"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the AgoraRTCProvider wrapper
const AgoraWrapper = dynamic(() => import("../components/AgoraWrapper"), {
  ssr: false,
});

// Dynamically import VideoCall component with SSR disabled
const VideoCall = dynamic(() => import("../components/VideoCall"), {
  ssr: false,
});

export default function Home() {
  const [videoCall, setVideoCall] = useState(true);

  return (
    <AgoraWrapper>
      <div>
        {videoCall ? (
          <VideoCall setVideoCall={setVideoCall} />
        ) : (
          <button
            onClick={() => setVideoCall(true)}
            className="w-full px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ease-in-out"
          >
            Join Call
          </button>
        )}
      </div>
    </AgoraWrapper>
  );
}
