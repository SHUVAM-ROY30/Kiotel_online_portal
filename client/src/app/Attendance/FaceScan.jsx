"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import * as faceapi from "face-api.js";
import { FaCamera, FaSpinner, FaUserCheck, FaUserTimes, FaIdCard, FaRedo } from "react-icons/fa";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";

// Matching threshold - lower = stricter matching
const MATCH_THRESHOLD = 0.55;

export default function FaceScan({ onEmployeeMatched, onNoMatch, onError }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState("loading"); // loading | ready | scanning | matched | no_match | error
  const [statusMessage, setStatusMessage] = useState("Loading face recognition models...");
  const [storedDescriptors, setStoredDescriptors] = useState([]);
  const [matchAttempts, setMatchAttempts] = useState(0);
  const MAX_SCAN_ATTEMPTS = 30; // ~10 seconds at 3 scans/sec

  // ─── Load face-api.js models ───
  useEffect(() => {
    const loadModels = async () => {
      try {
        setStatusMessage("Loading face recognition models...");
        const MODEL_URL = "/models";

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);

        setModelsLoaded(true);
        setStatusMessage("Models loaded. Starting camera...");
        console.log("✅ Face-api.js models loaded");
      } catch (err) {
        console.error("Failed to load face models:", err);
        setStatus("error");
        setStatusMessage("Failed to load face recognition. Please refresh.");
        onError?.("Failed to load face recognition models");
      }
    };

    loadModels();

    // Cleanup on unmount
    return () => {
      stopCamera();
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

  // ─── Fetch stored face descriptors ───
  useEffect(() => {
    const fetchDescriptors = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/clockin/face-descriptors`);
        const data = await res.json();

        if (res.ok && data.success) {
          setStoredDescriptors(data.data || []);
          console.log(`✅ Loaded ${data.data?.length || 0} face descriptors`);
        } else {
          console.warn("No face descriptors found");
          setStoredDescriptors([]);
        }
      } catch (err) {
        console.error("Failed to fetch face descriptors:", err);
        setStoredDescriptors([]);
      }
    };

    fetchDescriptors();
  }, []);

  // ─── Start camera when models are loaded ───
  useEffect(() => {
    if (modelsLoaded) {
      startCamera();
    }
  }, [modelsLoaded]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user", // Front camera
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
          setStatus("ready");
          setStatusMessage("Camera ready. Position your face in the frame.");
        };
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      setStatus("error");
      setStatusMessage("Camera access denied. Please allow camera permissions.");
      onError?.("Camera access denied");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
  };

  // ─── Face matching logic ───
  const findMatch = useCallback(
    (queryDescriptor) => {
      if (!storedDescriptors || storedDescriptors.length === 0) return null;

      let bestMatch = null;
      let bestDistance = Infinity;

      for (const stored of storedDescriptors) {
        // Convert stored descriptor array to Float32Array for face-api.js
        const storedFloat32 = new Float32Array(stored.descriptor);
        const distance = faceapi.euclideanDistance(queryDescriptor, storedFloat32);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestMatch = stored;
        }
      }

      if (bestDistance < MATCH_THRESHOLD) {
        console.log(`✅ Face matched: ${bestMatch.employee_id} (distance: ${bestDistance.toFixed(4)})`);
        return {
          employee_id: bestMatch.employee_id,
          distance: bestDistance,
        };
      }

      console.log(`❌ No match found. Best distance: ${bestDistance.toFixed(4)} (threshold: ${MATCH_THRESHOLD})`);
      return null;
    },
    [storedDescriptors]
  );

  // ─── Start scanning ───
  const startScanning = useCallback(async () => {
    if (!cameraReady || !modelsLoaded || scanning) return;

    setScanning(true);
    setStatus("scanning");
    setStatusMessage("Scanning your face...");
    setMatchAttempts(0);

    let attempts = 0;

    scanIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || attempts >= MAX_SCAN_ATTEMPTS) {
        // Max attempts reached - no match
        clearInterval(scanIntervalRef.current);
        setScanning(false);
        setStatus("no_match");
        setStatusMessage("Face not recognized. Please enter your Employee ID.");
        onNoMatch?.();
        return;
      }

      attempts++;
      setMatchAttempts(attempts);

      try {
        // Detect face and get descriptor
        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({
            inputSize: 416,
            scoreThreshold: 0.5,
          }))
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          // Draw detection on canvas (visual feedback)
          if (canvasRef.current && videoRef.current) {
            const dims = faceapi.matchDimensions(canvasRef.current, videoRef.current, true);
            const resized = faceapi.resizeResults(detection, dims);
            faceapi.draw.drawDetections(canvasRef.current, resized);
          }

          // Try to find a match
          const match = findMatch(detection.descriptor);

          if (match) {
            clearInterval(scanIntervalRef.current);
            setScanning(false);
            setStatus("matched");
            setStatusMessage("Face recognized!");
            stopCamera();
            onEmployeeMatched?.(match.employee_id);
            return;
          }
        } else {
          // Clear canvas if no face detected
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        }
      } catch (err) {
        console.warn("Scan frame error:", err);
      }
    }, 350); // Scan every 350ms (~3 times per second)
  }, [cameraReady, modelsLoaded, scanning, findMatch, onEmployeeMatched, onNoMatch]);

  // Auto-start scanning when camera is ready
  useEffect(() => {
    if (cameraReady && modelsLoaded && !scanning && status === "ready") {
      // Small delay to let the camera warm up
      const timer = setTimeout(() => {
        startScanning();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cameraReady, modelsLoaded, status]);

  // ─── Retry scanning ───
  const handleRetry = () => {
    setStatus("ready");
    setStatusMessage("Repositioning... Starting scan again.");
    setMatchAttempts(0);
    if (!cameraReady) {
      startCamera();
    }
    setTimeout(() => startScanning(), 500);
  };

  // ─── Manual ID entry fallback ───
  const handleManualEntry = () => {
    stopCamera();
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    setScanning(false);
    onNoMatch?.();
  };

  return (
    <div className="w-full">
      {/* Camera View */}
      <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-2xl overflow-hidden mb-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }} // Mirror the camera
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          style={{ transform: "scaleX(-1)" }}
        />

        {/* Scanning overlay */}
        {status === "scanning" && (
          <div className="absolute inset-0 border-4 border-blue-500 rounded-2xl animate-pulse pointer-events-none">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
              <FaSpinner className="animate-spin" />
              Scanning... ({matchAttempts}/{MAX_SCAN_ATTEMPTS})
            </div>
          </div>
        )}

        {/* Matched overlay */}
        {status === "matched" && (
          <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center rounded-2xl">
            <div className="bg-white/90 px-6 py-4 rounded-xl flex items-center gap-3 shadow-xl">
              <FaUserCheck className="text-green-600 text-3xl" />
              <span className="text-green-800 font-bold text-lg">Face Recognized!</span>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {status === "loading" && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center rounded-2xl">
            <div className="text-center text-white">
              <FaSpinner className="text-4xl animate-spin mx-auto mb-3" />
              <p className="font-medium">Loading models...</p>
            </div>
          </div>
        )}

        {/* Error overlay */}
        {status === "error" && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center rounded-2xl">
            <div className="text-center text-white">
              <FaCamera className="text-4xl mx-auto mb-3 text-red-400" />
              <p className="font-medium text-red-300">Camera Error</p>
            </div>
          </div>
        )}
      </div>

      {/* Status Message */}
      <div
        className={`text-center p-4 rounded-xl mb-4 font-medium ${
          status === "matched"
            ? "bg-green-50 text-green-800 border border-green-200"
            : status === "no_match"
              ? "bg-amber-50 text-amber-800 border border-amber-200"
              : status === "error"
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-blue-50 text-blue-800 border border-blue-200"
        }`}
      >
        {statusMessage}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {(status === "no_match" || status === "error") && (
          <>
            <button
              onClick={handleRetry}
              className="flex-1 px-4 py-3 border-2 border-blue-500 text-blue-600 rounded-xl hover:bg-blue-50 font-semibold transition-all flex items-center justify-center gap-2"
            >
              <FaRedo />
              Try Again
            </button>
            <button
              onClick={handleManualEntry}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <FaIdCard />
              Enter ID Manually
            </button>
          </>
        )}

        {status === "scanning" && (
          <button
            onClick={handleManualEntry}
            className="w-full px-4 py-3 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 font-semibold transition-all flex items-center justify-center gap-2"
          >
            <FaIdCard />
            Skip — Enter ID Manually
          </button>
        )}
      </div>
    </div>
  );
}