import React, { useState, useRef } from 'react';
import './AudioCompressorStyle.css';
import lamejs from 'lamejs';

const AudioCompressor = () => {
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [compressedAudio, setCompressedAudio] = useState(null);
  const [uploadAudio, setUploadAudio] = useState(false);
  const audioInputRef = useRef(null);

  const handleUpload = (e) => {
    e.preventDefault();
    const audioFile = e.target.files[0];
    setSelectedAudio(audioFile);
    setCompressedAudio(null);
    setUploadAudio(true);
  };

  const handleAudio = async () => {
    if (selectedAudio) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const encoder = new lamejs.Mp3Encoder(2, 128); // 2 channels, 128 kbps

        const interleaved = interleave(audioBuffer);
        const mp3Data = [];
        const samplesPerPage = 1152;

        for (let i = 0; i < interleaved.length; i += samplesPerPage) {
          const left = interleaved.subarray(i, i + samplesPerPage);
          const mp3buf = encoder.encodeBuffer(left);

          if (mp3buf.length > 0) {
            mp3Data.push(mp3buf);
          }
        }

        const mp3buf = encoder.flush();
        if (mp3buf.length > 0) {
          mp3Data.push(mp3buf);
        }

        const mergedMp3Data = new Uint8Array(mp3Data.reduce((acc, val) => acc + val.length, 0));
        let offset = 0;
        for (let i = 0; i < mp3Data.length; i++) {
          mergedMp3Data.set(mp3Data[i], offset);
          offset += mp3Data[i].length;
        }

        const blob = new Blob([mergedMp3Data], { type: 'audio/mp3' });
        setCompressedAudio(blob);
      };
      reader.readAsArrayBuffer(selectedAudio);
    }
  };

  function interleave(audioBuffer) {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const interleaved = new Float32Array(audioBuffer.length * numberOfChannels);
    const channels = [];

    for (let i = 0; i < numberOfChannels; i++) {
      channels.push(audioBuffer.getChannelData(i));
    }

    for (let sample = 0; sample < audioBuffer.length; sample++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        interleaved[sample * numberOfChannels + channel] = channels[channel][sample];
      }
    }

    return interleaved;
  }

  const handleDownloadAudio = () => {
    if (compressedAudio) {
      const url = URL.createObjectURL(compressedAudio);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'compressed_audio.mp3';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleChangeAudio = () => {
    setSelectedAudio(null);
    setCompressedAudio(null);
    setUploadAudio(false);
  };

  const handleUploadAgain = () => {
    audioInputRef.current.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const audioFile = e.dataTransfer.files[0];
    setSelectedAudio(audioFile);
    setCompressedAudio(null);
    setUploadAudio(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container">
      <h1 className="text-center mt-5">Audio Compressor</h1>
      <div className="mt-5">
        <div className="row">
          <div className="col-md-6">
            <div className="drop-area" onDrop={handleDrop} onDragOver={handleDragOver}>
              <h3 className="text-center">Upload Audio</h3>
              {uploadAudio ? (
                <div className="audio-preview">
                  <audio controls>
                    <source src={URL.createObjectURL(selectedAudio)} type="audio/mp3" />
                  </audio>
                  <button className="change-audio-button" onClick={handleChangeAudio}>Change Audio</button>
                </div>
              ) : (
                <div className="upload-text">
                  <p>Drag and drop your audio file here, or</p>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleUpload}
                    ref={audioInputRef}
                    style={{ display: 'none' }}
                  />
                  <label className="input-label" onClick={handleUploadAgain}>Upload Audio</label>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="compressed-audio">
              <h3 className="text-center">Compressed Audio</h3>
              {compressedAudio && (
                <div className="audio-preview">
                  <audio controls>
                    <source src={URL.createObjectURL(compressedAudio)} type="audio/mp3" />
                  </audio>
                  <button className="download-button" onClick={handleDownloadAudio}>Download Compressed Audio</button>
                </div>
              )}
              {!compressedAudio && uploadAudio && (
                <button className="input-label" onClick={handleAudio}>Compress Audio</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioCompressor;
