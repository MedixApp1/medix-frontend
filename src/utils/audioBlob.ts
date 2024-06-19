function getBlobFromAudio(audioSource: HTMLAudioElement | MediaStream, type:string): Promise<Blob> {
   return new Promise((resolve, reject) => {
     const reader = new FileReader();
 
     reader.onload = () => {
       resolve(new Blob([reader.result!], { type: type }));
     };
 
     reader.onerror = () => {
       reject(reader.error);
     };
 
     if (audioSource instanceof HTMLAudioElement) {
       const context = new AudioContext();
       const source = context.createMediaElementSource(audioSource);
       const dest = context.createMediaStreamDestination();
 
       source.connect(dest);
 
    
       const chunks: BlobPart[] = [];
 
       const mediaRecorder = new MediaRecorder(dest.stream);
 
       mediaRecorder.ondataavailable = (event) => {
         chunks.push(event.data);
       };
 
       mediaRecorder.onstop = () => {
         const blob = new Blob(chunks, { type: type });
         reader.readAsArrayBuffer(blob);
       };
 
       mediaRecorder.start();
       setTimeout(() => {
         mediaRecorder.stop();
       }, 1000);
     } else if (audioSource instanceof MediaStream) {
       const context = new AudioContext();
       const source = context.createMediaStreamSource(audioSource);
       const dest = context.createMediaStreamDestination();
 
       source.connect(dest);
 
      //  const track = dest.stream.getTracks()[0];
       const chunks: BlobPart[] = [];
 
       const mediaRecorder = new MediaRecorder(dest.stream);
 
       mediaRecorder.ondataavailable = (event) => {
         chunks.push(event.data);
       };
 
       mediaRecorder.onstop = () => {
         const blob = new Blob(chunks, { type: 'audio/wav' });
         reader.readAsArrayBuffer(blob);
       };
 
       mediaRecorder.start();
       setTimeout(() => {
         mediaRecorder.stop();
       }, 1000);
     } else {
       reject(new Error('Invalid audio source'));
     }
   });
 }

 export default getBlobFromAudio;