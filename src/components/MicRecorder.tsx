import React, { useRef, useState } from 'react';
import { Buffer } from 'buffer'; 

interface MicRecorderProps {
  onTranscription: (text: string) => void;
}

const MicRecorder: React.FC<MicRecorderProps> = ({ onTranscription }) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    chunks.current = [];

    mediaRecorder.current.ondataavailable = e => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = async () => {
      const blob = new Blob(chunks.current, { type: 'audio/webm' });

      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Use Electron's Node.js modules via 'window.require'
      const os = window.require('os');
      const fs = window.require('fs');
      const path = window.require('path');

      const tempDir = os.tmpdir();
      const filePath = path.join(tempDir, `recording-${Date.now()}.wav`);

      // Write the audio buffer to file
      fs.writeFileSync(filePath, buffer);

      // Call IPC exposed API to transcribe
      const transcription = await window.electronAPI.transcribeAudio(filePath);

      onTranscription(transcription);

      // Optional: cleanup temp file
      fs.unlinkSync(filePath);
    };

    mediaRecorder.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>
        Start Mic
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop Mic
      </button>
    </div>
  );
};

export default MicRecorder;
