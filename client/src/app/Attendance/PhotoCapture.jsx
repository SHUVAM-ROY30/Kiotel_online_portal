// Attendance/PhotoCapture.jsx

'use client';

import { useState, useRef, useEffect } from 'react';

const PhotoCapture = ({ 
  onCapture, 
  onRetake, 
  isCaptured, 
  isLoading,
  photoType // 'clock_in' or 'clock_out'
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  useEffect(() => {
    if (!isCaptured) {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCaptured]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Please allow camera access to continue');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedPhoto(dataUrl);
    onCapture(dataUrl);
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    onRetake();
    startCamera();
  };

  return (
    <div className="w-full max-w-md">
      {!isCaptured && !capturedPhoto ? (
        // Camera view
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto rounded-lg bg-black"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 border-2 border-blue-500 border-dashed rounded-lg opacity-50"></div>
          </div>
        </div>
      ) : capturedPhoto ? (
        // Preview captured photo
        <div className="relative">
          <img 
            src={capturedPhoto} 
            alt="Captured" 
            className="w-full h-auto rounded-lg"
          />
          <button
            onClick={retakePhoto}
            disabled={isLoading}
            className="absolute bottom-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm font-medium disabled:opacity-50"
          >
            Retake
          </button>
        </div>
      ) : null}

      {!capturedPhoto && !isCaptured && (
        <button
          onClick={capturePhoto}
          disabled={isLoading}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            `Capture ${photoType === 'clock_in' ? 'Clock-in' : 'Clock-out'} Photo`
          )}
        </button>
      )}

      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PhotoCapture;