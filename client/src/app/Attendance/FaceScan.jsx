
//Attendance/FaceScan 
"use client";
import { useState, useRef, useEffect } from "react";
import { FaCamera, FaSpinner, FaUserCheck, FaIdCard } from "react-icons/fa";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";

export default function FaceScan({ onEmployeeMatched, onNoMatch, onError }) {
  const videoRef  = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus]   = useState("starting");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => setStatus("ready");
    } catch (err) {
      setStatus("error");
      onError?.("Camera access denied");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const captureAndIdentify = async () => {
    if (status !== "ready" || scanning) return;
    setScanning(true);
    setStatus("scanning");

    const canvas  = document.createElement("canvas");
    canvas.width  = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      const form = new FormData();
      form.append("photo", blob, "face.jpg");

      try {
        const res  = await fetch(`${API_BASE_URL}/clockin/identify-face`, {
          method: "POST",
          body  : form,
        });
        const data = await res.json();

        if (data.success) {
          stopCamera();
          setStatus("matched");
          onEmployeeMatched(data.employee_id);
        } else {
          setStatus("no_match");
          onNoMatch?.();
        }
      } catch {
        setStatus("error");
        onError?.("Network error");
      } finally {
        setScanning(false);
      }
    }, "image/jpeg", 0.92);
  };

  return (
    <div className="w-full">
      <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-2xl overflow-hidden mb-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />

        {status === "matched" && (
          <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center rounded-2xl">
            <div className="bg-white/90 px-6 py-4 rounded-xl flex items-center gap-3 shadow-xl">
              <FaUserCheck className="text-green-600 text-3xl" />
              <span className="text-green-800 font-bold text-lg">Face Recognized!</span>
            </div>
          </div>
        )}

        {status === "starting" && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center rounded-2xl">
            <FaSpinner className="text-white text-4xl animate-spin" />
          </div>
        )}
      </div>

      {/* Status message */}
      <div className={`text-center p-3 rounded-xl mb-4 text-sm font-medium ${
        status === "matched"  ? "bg-green-50 text-green-800 border border-green-200" :
        status === "no_match" ? "bg-amber-50 text-amber-800 border border-amber-200" :
        status === "error"    ? "bg-red-50 text-red-800 border border-red-200"       :
                                "bg-blue-50 text-blue-800 border border-blue-200"
      }`}>
        {status === "starting"  && "Starting camera..."}
        {status === "ready"     && "Camera ready. Click Scan to identify."}
        {status === "scanning"  && "Scanning... please hold still."}
        {status === "matched"   && "Face recognized! Loading your profile..."}
        {status === "no_match"  && "Face not recognized. Please enter your ID."}
        {status === "error"     && "Camera error. Please enter your ID manually."}
      </div>

      <div className="flex gap-3">
        {(status === "ready" || status === "scanning") && (
          <button
            onClick={captureAndIdentify}
            disabled={scanning || status !== "ready"}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
          >
            {scanning
              ? <><FaSpinner className="animate-spin" /> Scanning...</>
              : <><FaCamera /> Scan My Face</>
            }
          </button>
        )}

        {(status === "no_match" || status === "error") && (
          <button
            onClick={() => { setStatus("ready"); }}
            className="flex-1 px-4 py-3 border-2 border-blue-500 text-blue-600 rounded-xl font-semibold hover:bg-blue-50"
          >
            Try Again
          </button>
        )}

        <button
          onClick={() => { stopCamera(); onNoMatch?.(); }}
          className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <FaIdCard /> Enter ID
        </button>
      </div>
    </div>
  );
}