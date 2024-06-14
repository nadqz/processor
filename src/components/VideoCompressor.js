import React, { useState, useRef } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import Card from 'react-bootstrap/Card';
import './VideoCompressorStyle.css';

const ffmpeg = createFFmpeg({ log: true });

const VideoCompressor = () => {
  const [originalVideo, setOriginalVideo] = useState('');
  const [compressedVideo, setCompressedVideo] = useState('');
  const [outputFileName, setOutputFileName] = useState('');
  const [uploadVideo, setUploadVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const loadFFmpeg = async () => {
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const videoFile = e.target.files[0];
    await handleVideo(videoFile);
  };

  const handleVideo = async (videoFile) => {
    setLoading(true);
    setOriginalVideo(URL.createObjectURL(videoFile));
    setOutputFileName(videoFile.name);
    setUploadVideo(true);

    await loadFFmpeg();
    
    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));

    await ffmpeg.run('-i', 'input.mp4', '-vcodec', 'libx264', '-crf', '28', 'output.mp4');

    const data = ffmpeg.FS('readFile', 'output.mp4');
    const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
    const videoUrl = URL.createObjectURL(videoBlob);
    setCompressedVideo(videoUrl);
    setLoading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const videoFile = e.dataTransfer.files[0];
    handleVideo(videoFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container">
      <h1 className="text-center mt-5">Video Compressor</h1>
      <div className="mt-5">
        <div className="row">
          <div className="col-md-6">
            <div className="drop-area" onDrop={handleDrop} onDragOver={handleDragOver}>
              <h3 className="text-center">Upload Video</h3>
              {uploadVideo ? (
                <Card className="video-card">
                  <video src={originalVideo} controls className="video-preview" />
                  <Card.Body className="d-flex justify-content-center">
                    <button className="change-video-button" onClick={() => setUploadVideo(false)}>Change Video</button>
                  </Card.Body>
                </Card>
              ) : (
                <div className="upload-text">
                  <p>Drag and drop your video here, or</p>
                  <input
                    type="file"
                    accept="video/*"
                    className="input-file"
                    onChange={handleUpload}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="fileInput" className="input-label">Upload Video</label>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="compressed-video">
              <h3 className="text-center">Compressed Video</h3>
              {loading && <p className="text-center">Compressing...</p>}
              {compressedVideo && (
                <Card className="video-card">
                  <video src={compressedVideo} controls className="video-preview" />
                  <Card.Body className="d-flex justify-content-center">
                    <a href={compressedVideo} download={outputFileName} className="download-button">Download Compressed Video</a>
                  </Card.Body>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCompressor;
