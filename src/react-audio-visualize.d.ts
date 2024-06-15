declare module "react-audio-visualize" {
  import React from "react";

  export const AudioVisualizer: React.FC<AudioVisualizerProps>;
  export const LiveAudioVisualizer: React.FC<LiveAudioVisualizerProps>;

  interface AudioVisualizerProps {
    blob: Blob;
    width: number;
    height: number;
    barWidth: number;
    gap: number;
    barColor: string;
    // Add other props for AudioVisualizer component
  }

  interface LiveAudioVisualizerProps {
    mediaRecorder: MediaRecorder;
    width: number;
    height: number;
    // Define props for LiveAudioVisualizer component
  }
}
