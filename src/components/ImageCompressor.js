import React, { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import Card from 'react-bootstrap/Card';
import './ImageCompressorStyle.css';

const ImageCompressor = () => {
  const [compressedLink, setCompressedLink] = useState('http://navparivartan.in/wp-content/uploads/2018/11/placeholder.png');
  const [originalLink, setOriginalLink] = useState('');
  const [outputFileName, setOutputFileName] = useState('');
  const [clicked, setClicked] = useState(false);
  const [uploadImage, setUploadImage] = useState(false);
  const fileInputRef = useRef(null); 

  const handleUpload = (e) => {
    e.preventDefault();
    const imageFile = e.target.files[0];
    handleImage(imageFile);
  };

  const handleImage = (imageFile) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 500,
      useWebWorker: true,
    };

    if (!imageFile) return;

    setOriginalLink(URL.createObjectURL(imageFile));
    setOutputFileName(imageFile.name);
    setUploadImage(true);

    imageCompression(imageFile, options).then((compressedImage) => {
      const downloadLink = URL.createObjectURL(compressedImage);
      setCompressedLink(downloadLink);
      setClicked(true);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const imageFile = e.dataTransfer.files[0];
    handleImage(imageFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container">
      <h1 className="text-center mt-5">Image Compressor</h1>
      <div className="mt-5">
        <div className="row">
          <div className="col-md-6">
            <div className="drop-area" onDrop={handleDrop} onDragOver={handleDragOver}>
              <h3 className="text-center">Upload Image</h3>
              {uploadImage ? (
                <Card className="image-card">
                  <img src={originalLink} alt="Uploaded" className="image-preview" />
                  <Card.Body className="d-flex justify-content-center">
                    <button className="change-image-button" onClick={() => setUploadImage(false)}>Change Image</button>
                  </Card.Body>
                </Card>
              ) : (
                <div className="upload-text">
                  <p>Drag and drop your image here, or</p>
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    className="input-file"
                    onChange={handleUpload}
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                  />
                  <label htmlFor="fileInput" className="input-label">Upload Image</label>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="compressed-image">
              <h3 className="text-center">Compressed Image</h3>
              {clicked && (
                <Card className="image-card">
                  <img src={compressedLink} alt="Compressed" className="image-preview" />
                  <Card.Body className="d-flex justify-content-center">
                    <a href={compressedLink} download={outputFileName} className="download-button">Download Compressed Image</a>
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

export default ImageCompressor;
