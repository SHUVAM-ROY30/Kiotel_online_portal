"use client";
import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { FaCamera, FaSpinner, FaCheckCircle, FaRedo } from "react-icons/fa";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";
const REQUIRED_CAPTURES = 3; // Capture 3 descriptors for accuracy

export default function FaceRegister({ employeeId, employeeName, onRegistered, onSkip }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [descriptors, setDescriptors] = useState([]);
  const [capturing, setCapturing] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState("");
  const [captureCount, setCaptureCount] = useState(0);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        setMessage("Failed to load face models. Registration skipped.");
        console.error(err);
      }
    };
    loadModels();

    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (modelsLoaded) startCamera();
  }, [modelsLoaded]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setCameraReady(true);
      }
    } catch (err) {
      setMessage("Camera access denied. Face registration skipped.");
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const captureDescriptor = async () => {
    if (!videoRef.current || capturing) return;

    setCapturing(true);
    setMessage("Hold still... capturing face data...");

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.5,
        }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        const newDescriptors = [...descriptors, Array.from(detection.descriptor)];
        setDescriptors(newDescriptors);
        setCaptureCount(newDescriptors.length);
        setMessage(`Captured ${newDescriptors.length}/${REQUIRED_CAPTURES}. ${
          newDescriptors.length < REQUIRED_CAPTURES 
            ? "Move your head slightly and capture again." 
            : "All captures done! Click Register."
        }`);
      } else {
        setMessage("No face detected. Make sure your face is clearly visible and try again.");
      }
    } catch (err) {
      setMessage("Capture failed. Please try again.");
      console.error(err);
    } finally {
      setCapturing(false);
    }
  };

  const handleRegister = async () => {
    if (descriptors.length < REQUIRED_CAPTURES) {
      setMessage(`Please capture ${REQUIRED_CAPTURES} face scans first.`);
      return;
    }

    setRegistering(true);
    setMessage("Registering your face...");

    try {
      const res = await fetch(`${API_BASE_URL}/clockin/register-face`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: employeeId,
          descriptors: descriptors,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        stopCamera();
        setMessage("✅ Face registered successfully!");
        setTimeout(() => onRegistered?.(), 1500);
      } else {
        setMessage(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
      console.error(err);
    } finally {
      setRegistering(false);
    }
  };

  const handleReset = () => {
    setDescriptors([]);
    setCaptureCount(0);
    setMessage("Captures reset. Start again.");
  };

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Register Your Face</h3>
        <p className="text-sm text-gray-600">
          Hi <span className="font-semibold">{employeeName}</span>, register your face for faster clock-ins next time.
        </p>
      </div>

      {/* Camera */}
      <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-2xl overflow-hidden mb-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />

        {/* Capture progress indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {Array.from({ length: REQUIRED_CAPTURES }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                i < captureCount
                  ? "bg-green-500 border-green-500 scale-110"
                  : "bg-transparent border-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Status */}
      {message && (
        <div
          className={`text-center p-3 rounded-xl mb-4 text-sm font-medium ${
            message.includes("✅")
              ? "bg-green-50 text-green-800 border border-green-200"
              : message.includes("failed") || message.includes("denied")
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-blue-50 text-blue-800 border border-blue-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        {captureCount < REQUIRED_CAPTURES ? (
          <>
            <button
              onClick={captureDescriptor}
              disabled={capturing || !cameraReady}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {capturing ? (
                <><FaSpinner className="animate-spin" /> Capturing...</>
              ) : (
                <><FaCamera /> Capture Face ({captureCount}/{REQUIRED_CAPTURES})</>
              )}
            </button>
            {captureCount > 0 && (
              <button
                onClick={handleReset}
                className="px-4 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-gray-50"
              >
                <FaRedo />
              </button>
            )}
          </>
        ) : (
          <button
            onClick={handleRegister}
            disabled={registering}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
          >
            {registering ? (
              <><FaSpinner className="animate-spin" /> Registering...</>
            ) : (
              <><FaCheckCircle /> Register Face</>
            )}
          </button>
        )}
      </div>

      {/* Skip option */}
      <button
        onClick={() => {
          stopCamera();
          onSkip?.();
        }}
        className="w-full mt-3 px-4 py-2 text-gray-500 text-sm hover:text-gray-700 font-medium transition-colors"
      >
        Skip face registration →
      </button>
    </div>
  );
}


// "use client";
// import { useState, useRef, useEffect } from "react";
// import { FaCamera, FaSpinner, FaCheckCircle } from "react-icons/fa";

// const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";

// export default function FaceRegister({ employeeId, employeeName, onRegistered, onSkip }) {
//   const videoRef  = useRef(null);
//   const streamRef = useRef(null);
//   const [cameraReady, setCameraReady] = useState(false);
//   const [capturing, setCapturing]     = useState(false);
//   const [message, setMessage]         = useState("");

//   useEffect(() => {
//     startCamera();
//     return () => stopCamera();
//   }, []);

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { width: 640, height: 480, facingMode: "user" },
//       });
//       streamRef.current = stream;
//       videoRef.current.srcObject = stream;
//       videoRef.current.onloadedmetadata = () => setCameraReady(true);
//     } catch {
//       setMessage("Camera access denied.");
//     }
//   };

//   const stopCamera = () => {
//     streamRef.current?.getTracks().forEach((t) => t.stop());
//   };

//   const captureAndRegister = async () => {
//     if (!cameraReady || capturing) return;
//     setCapturing(true);
//     setMessage("Hold still...");

//     const canvas  = document.createElement("canvas");
//     canvas.width  = videoRef.current.videoWidth;
//     canvas.height = videoRef.current.videoHeight;
//     canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

//     canvas.toBlob(async (blob) => {
//       const form = new FormData();
//       form.append("photo", blob, "face.jpg");
//       form.append("employee_id", employeeId);

//       try {
//         const res  = await fetch(`${API_BASE_URL}/clockin/register-face`, {
//           method: "POST",
//           body  : form,
//         });
//         const data = await res.json();

//         if (data.success) {
//           stopCamera();
//           setMessage("✅ Face registered successfully!");
//           setTimeout(() => onRegistered?.(), 1500);
//         } else {
//           setMessage(data.message || "Registration failed. Try again.");
//         }
//       } catch {
//         setMessage("Network error. Please try again.");
//       } finally {
//         setCapturing(false);
//       }
//     }, "image/jpeg", 0.92);
//   };

//   return (
//     <div className="w-full">
//       <div className="text-center mb-4">
//         <h3 className="text-lg font-bold text-gray-900 mb-1">Register Your Face</h3>
//         <p className="text-sm text-gray-600">
//           Hi <span className="font-semibold">{employeeName}</span>, look straight
//           at the camera and click the button below.
//         </p>
//       </div>

//       <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-2xl overflow-hidden mb-4">
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           className="w-full h-full object-cover"
//           style={{ transform: "scaleX(-1)" }}
//         />
//       </div>

//       {message && (
//         <div className={`text-center p-3 rounded-xl mb-4 text-sm font-medium ${
//           message.includes("✅")
//             ? "bg-green-50 text-green-800 border border-green-200"
//             : message.includes("failed") || message.includes("denied")
//               ? "bg-red-50 text-red-800 border border-red-200"
//               : "bg-blue-50 text-blue-800 border border-blue-200"
//         }`}>
//           {message}
//         </div>
//       )}

//       <button
//         onClick={captureAndRegister}
//         disabled={!cameraReady || capturing}
//         className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
//       >
//         {capturing
//           ? <><FaSpinner className="animate-spin" /> Registering...</>
//           : <><FaCamera /> Register My Face</>
//         }
//       </button>

//       <button
//         onClick={() => { stopCamera(); onSkip?.(); }}
//         className="w-full mt-3 px-4 py-2 text-gray-500 text-sm hover:text-gray-700 font-medium"
//       >
//         Skip face registration →
//       </button>
//     </div>
//   );
// }