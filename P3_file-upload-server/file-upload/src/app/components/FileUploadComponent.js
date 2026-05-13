"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useDropzone } from "react-dropzone";

export default function FileUploadForm() {
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];
  
  // Backend URL - change this to your Express server URL
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  // ---------------- SUBMIT ----------------
  const onSubmit = async (data) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", data.file[0]);
      formData.append("name", data.name);

      // Send to Express backend instead of Next.js API route
     // TO:
         const res = await axios.post("http://localhost:8000/api/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentage);
        },
       
      });

      if (res.data.success) {
        setUploadResult({
          success: true,
          message: `${res.data.message}! File saved as: ${res.data.filename}`,
          fileData: res.data
        });
        reset(); // Reset form on success
        setFilePreview(null); // Clear preview
      } else {
        throw new Error(res.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      
      let errorMessage = "Upload failed";
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || error.response.data?.error || "Server error";
      } else if (error.request) {
        // Request made but no response
        errorMessage = "Cannot connect to server. Make sure the backend is running on port 8000";
      } else {
        // Something else
        errorMessage = error.message || "Upload failed";
      }
      
      setUploadResult({
        success: false,
        message: errorMessage,
      });
    } finally {
      setIsUploading(false);
      // Reset progress after a delay
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  // ---------------- DROPZONE ----------------
  const Dropzone = ({ onDrop, maxSize, accept }) => {
    const { getRootProps, getInputProps, isDragActive, fileRejections } =
      useDropzone({
        onDrop: (acceptedFiles) => {
          onDrop(acceptedFiles);

          if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            if (file.type.startsWith("image/")) {
              const previewUrl = URL.createObjectURL(file);
              setFilePreview({
                url: previewUrl,
                name: file.name,
                type: file.type,
              });
            } else if (file.type === "application/pdf") {
              setFilePreview({
                name: file.name,
                type: file.type,
              });
            } else {
              setFilePreview({
                name: file.name,
                type: file.type,
              });
            }
          }
        },
        maxSize,
        accept,
        multiple: false,
      });

    return (
      <div className="mt-1">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 cursor-pointer text-center transition-all duration-200 ${
            isDragActive
              ? "border-blue-500 bg-blue-50 text-black"
              : "border-gray-600 bg-gray-800 hover:border-blue-400 hover:bg-gray-700"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-600">Drop the file here...</p>
          ) : (
            <div>
              <svg 
                className="mx-auto h-12 w-12 text-gray-400 mb-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p>Drag & drop or click to upload</p>
              <p className="text-sm text-gray-400 mt-1">
                JPEG, PNG, PDF (max 5MB)
              </p>
            </div>
          )}
        </div>

        {fileRejections.length > 0 && (
          <div className="mt-2 p-2 bg-red-900/50 border border-red-500 rounded">
            <p className="text-red-400 text-sm">
              {fileRejections[0].errors[0].message === "File too large" 
                ? "File is too large. Maximum size is 5MB" 
                : "Invalid file type. Please upload JPEG, PNG, or PDF files only"}
            </p>
          </div>
        )}
      </div>
    );
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="w-full max-w-md bg-gray-900/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700 text-white">
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            File Upload
          </h1>
          <p className="text-gray-400 text-sm mt-1">Upload your files securely</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* NAME INPUT */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Your Name:
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-blue-500
               focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* FILE UPLOAD */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Upload File:
            </label>

            <Controller
              name="file"
              control={control}
              rules={{
                required: "File is required",
                validate: {
                  fileSize: (files) =>
                    !files?.[0] ||
                    files[0].size <= MAX_FILE_SIZE ||
                    "File must be 5MB or less",
                  fileType: (files) =>
                    !files?.[0] ||
                    ACCEPTED_FILE_TYPES.includes(files[0].type) ||
                    "Only JPEG, PNG, or PDF files are allowed",
                },
              }}
              render={({ field: { onChange } }) => (
                <Dropzone
                  onDrop={(files) => onChange(files)}
                  maxSize={MAX_FILE_SIZE}
                  accept={{
                    "image/jpeg": [".jpg", ".jpeg"],
                    "image/png": [".png"],
                    "application/pdf": [".pdf"],
                  }}
                />
              )}
            />

            {errors.file && (
              <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
            )}
          </div>

          {/* FILE PREVIEW */}
          {filePreview && (
            <div className="mb-4 animate-fadeIn">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Preview:
              </label>
              <div className="border border-gray-700 rounded-lg p-3 bg-gray-800/50">
                {filePreview.type?.startsWith("image/") ? (
                  <div className="relative">
                    <img
                      src={filePreview.url}
                      alt={filePreview.name}
                      className="max-h-40 mx-auto rounded-lg object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setFilePreview(null)}
                      className="absolute top-1 right-1 bg-red-600 rounded-full p-1 hover:bg-red-700 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : filePreview.type === "application/pdf" ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-10 h-10 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 
                        7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        <path d="M10 9a1 1 0 011 1v2a1 1 0 01-2 0v-2a1 1 0 011-1z" />
                        <circle cx="10" cy="13" r="1" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium">{filePreview.name}</p>
                        <p className="text-xs text-gray-400">PDF Document</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFilePreview(null)}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{filePreview.name}</p>
                      <p className="text-xs text-gray-400">File ready to upload</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFilePreview(null)}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isUploading}
            className={`w-full p-3 rounded-lg font-medium transition-all duration-200 ${
              isUploading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg"
            } text-white`}
          >
            {isUploading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 
                  014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              "Upload File"
            )}
          </button>

          {/* UPLOAD PROGRESS BAR */}
          {isUploading && uploadProgress > 0 && (
            <div className="mt-4 animate-fadeIn">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Upload progress</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* RESULT MESSAGE */}
          {uploadResult && (
            <div
              className={`mt-4 p-3 rounded-lg animate-slideUp ${
                uploadResult.success
                  ? "bg-green-900/50 border border-green-500 text-green-400"
                  : "bg-red-900/50 border border-red-500 text-red-400"
              }`}
            >
              <div className="flex items-center">
                {uploadResult.success ? (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 
                    
                    00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 
                    1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 
                    10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-sm">{uploadResult.message}</span>
              </div>
            </div>
          )}
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}