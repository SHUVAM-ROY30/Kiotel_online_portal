// // Attendance/PhotoCapture.jsx

// 'use client';

// import { useState, useRef, useEffect } from 'react';

// const PhotoCapture = ({ 
//   onCapture, 
//   onRetake, 
//   isCaptured, 
//   isLoading,
//   photoType // 'clock_in' or 'clock_out'
// }) => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [stream, setStream] = useState(null);
//   const [capturedPhoto, setCapturedPhoto] = useState(null);

//   useEffect(() => {
//     if (!isCaptured) {
//       startCamera();
//     }
//     return () => {
//       if (stream) {
//         stream.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [isCaptured]);

//   const startCamera = async () => {
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({ 
//         video: { 
//           facingMode: 'user',
//           width: { ideal: 1280 },
//           height: { ideal: 720 }
//         } 
//       });
//       setStream(mediaStream);
//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//       }
//     } catch (err) {
//       console.error('Camera access error:', err);
//       alert('Please allow camera access to continue');
//     }
//   };

//   const capturePhoto = () => {
//     if (!videoRef.current || !canvasRef.current) return;
    
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
    
//     // Set canvas dimensions to match video
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
    
//     // Draw video frame to canvas
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
//     // Get data URL
//     const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
//     setCapturedPhoto(dataUrl);
//     onCapture(dataUrl);
//   };

//   const retakePhoto = () => {
//     setCapturedPhoto(null);
//     onRetake();
//     startCamera();
//   };

//   return (
//     <div className="w-full max-w-md">
//       {!isCaptured && !capturedPhoto ? (
//         // Camera view
//         <div className="relative">
//           <video
//             ref={videoRef}
//             autoPlay
//             playsInline
//             muted
//             className="w-full h-auto rounded-lg bg-black"
//           />
//           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//             <div className="w-64 h-64 border-2 border-blue-500 border-dashed rounded-lg opacity-50"></div>
//           </div>
//         </div>
//       ) : capturedPhoto ? (
//         // Preview captured photo
//         <div className="relative">
//           <img 
//             src={capturedPhoto} 
//             alt="Captured" 
//             className="w-full h-auto rounded-lg"
//           />
//           <button
//             onClick={retakePhoto}
//             disabled={isLoading}
//             className="absolute bottom-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm font-medium disabled:opacity-50"
//           >
//             Retake
//           </button>
//         </div>
//       ) : null}

//       {!capturedPhoto && !isCaptured && (
//         <button
//           onClick={capturePhoto}
//           disabled={isLoading}
//           className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
//         >
//           {isLoading ? (
//             <>
//               <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Processing...
//             </>
//           ) : (
//             `Capture ${photoType === 'clock_in' ? 'Clock-in' : 'Clock-out'} Photo`
//           )}
//         </button>
//       )}

//       {/* Hidden canvas for capturing */}
//       <canvas ref={canvasRef} className="hidden" />
//     </div>
//   );
// };

// export default PhotoCapture;


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
  const [facingMode, setFacingMode] = useState('user'); // 'user' (front) or 'environment' (back)
  const [cameraError, setCameraError] = useState('');

  // Clean up stream on unmount or when switching cameras
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Start or restart camera when facingMode or isCaptured changes
  useEffect(() => {
    if (!isCaptured) {
      startCamera();
    }
  }, [isCaptured, facingMode]);

  const startCamera = async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      setCameraError('');
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      let errorMsg = 'Unable to access camera.';
      if (err.name === 'NotAllowedError') {
        errorMsg = 'Camera access denied. Please allow camera permissions.';
      } else if (err.name === 'NotFoundError') {
        errorMsg = 'No camera found on this device.';
      }
      setCameraError(errorMsg);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    // Flip image horizontally if using front camera (mirror effect)
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedPhoto(dataUrl);
    onCapture(dataUrl);
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    onRetake();
    // Camera will restart via useEffect
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const actionLabel = photoType === 'clock_in' ? 'Clock-in' : 'Clock-out';

  if (isCaptured) return null;

  return (
    <div className="w-full max-w-md">
      {/* Camera View */}
      {!capturedPhoto ? (
        <div className="relative bg-black rounded-xl overflow-hidden shadow-lg">
          {cameraError ? (
            <div className="w-full h-64 flex items-center justify-center bg-gray-900 text-red-400 text-center p-4">
              <p>{cameraError}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                style={{ aspectRatio: '4/3' }}
              />
              
              {/* Overlay frame */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-4/5 h-4/5 border-2 border-blue-400 border-dashed rounded-lg opacity-60"></div>
              </div>

              {/* Camera flip button */}
              {/* <button
                onClick={toggleCamera}
                disabled={isLoading}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all disabled:opacity-50"
                aria-label="Switch camera"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </button> */}
            </>
          )}
        </div>
      ) : (
        // Preview captured photo
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <img 
            src={capturedPhoto} 
            alt="Captured" 
            className="w-full"
            style={{ aspectRatio: '4/3' }}
          />
          <button
            onClick={retakePhoto}
            disabled={isLoading}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-medium shadow-lg transition disabled:opacity-50"
          >
            Retake Photo
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-5 flex flex-col gap-3">
        {!capturedPhoto && !cameraError && (
          <button
            onClick={capturePhoto}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
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
              `Capture ${actionLabel} Photo`
            )}
          </button>
        )}

        {cameraError && (
          <button
            onClick={startCamera}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 rounded-xl transition"
          >
            Retry Camera
          </button>
        )}
      </div>

      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PhotoCapture;