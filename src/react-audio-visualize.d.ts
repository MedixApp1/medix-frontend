declare module 'react-audio-visualize' {
   import React from 'react';
 
   export const AudioVisualizer: React.FC<AudioVisualizerProps>;
   export const LiveAudioVisualizer: React.FC<LiveAudioVisualizerProps>;
 
   interface AudioVisualizerProps {
     audioData: Float32Array;
     // Add other props for AudioVisualizer component
   }
 
   interface LiveAudioVisualizerProps {
     // Define props for LiveAudioVisualizer component
   }
 }