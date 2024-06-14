import React from 'react'
import Navbar from '../components/Navbar'
import ImageCompressor from '../components/ImageCompressor'
import AudioCompressor from '../components/AudioCompressor'
import VideoCompressor from '../components/VideoCompressor'

const Compress = () => {
  return (
    <div>
        <Navbar/>
        <ImageCompressor />
        <AudioCompressor />
        <VideoCompressor />
    </div>
  )
}

export default Compress
