import React from 'react'
import Navbar from '../components/Navbar'
import ImageCompressor from '../components/ImageCompressor'
import AudioCompressor from '../components/AudioCompressor'

const Compress = () => {
  return (
    <div>
        <Navbar/>
        <ImageCompressor />
        <AudioCompressor />
    </div>
  )
}

export default Compress