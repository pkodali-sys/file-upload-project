import React, { useState, useRef } from "react";

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const dropRef = useRef(null);
  const fileInputRef = useRef(null);

  const SERVER = "http://localhost:5000"; // backend URL

  const handleFiles = (selectedFiles) => {
    setFiles([...selectedFiles]);
    setError("");
    setProgress(0);
    setResult(null);
  };

  const onSelect = (e) => handleFiles(e.target.files);

  const onDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
    dropRef.current.classList.remove("border-blue-500");
  };

  const onDragOver = (e) => {
    e.preventDefault();
    dropRef.current.classList.add("border-blue-500");
  };

  const onDragLeave = () => {
    dropRef.current.classList.remove("border-blue-500");
  };

  const upload = async () => {
    if (!files.length) {
      setError("Please choose at least one file.");
      return;
    }

    setError("");
    setProgress(0);
    setResult(null);

    const form = new FormData();
    files.forEach((f) => form.append("files", f));

    try {
      const response = await fetch(`${SERVER}/upload`, { method: "POST", body: form });
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      setResult(data);
      setProgress(100);
    } catch (err) {
      console.error(err);
      setError(err.message || "Upload error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Upload Files</h2>

        {/* Drag and Drop Zone */}
        <div
          ref={dropRef}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current.click()} // Trigger file input on click
          className="w-full mb-4 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 cursor-pointer hover:border-blue-500"
        >
          <p>Drag & drop files here or click to select</p>
          <input
            type="file"
            multiple
            onChange={onSelect}
            accept="image/png,image/jpeg,application/pdf"
            ref={fileInputRef}
            className="hidden"
          />
        </div>

        {/* Preview Selected Files */}
        {files.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">Selected Files:</h4>
            <ul className="space-y-2">
              {files.map((file) => (
                <li key={file.name} className="flex items-center space-x-2 border rounded p-2">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-200 text-gray-700 rounded">
                      PDF
                    </div>
                  )}
                  <span className="text-gray-700">{file.name}</span>
                  <span className="text-gray-500 text-sm ml-auto">{(file.size / 1024).toFixed(1)} KB</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={upload}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors mb-4"
        >
          Upload
        </button>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="mb-4">
            <div className="text-sm mb-1 text-gray-700">Progress: {progress}%</div>
            <div className="w-full h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-green-500 rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Uploaded Files */}
        {result?.ok && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Uploaded:</h4>
            <ul className="space-y-2">
              {result.files.map((f) => (
                <li
                  key={f.filename}
                  className="flex justify-between items-center p-2 border rounded hover:bg-gray-50"
                >
                  <a
                    href={`${SERVER}${f.localPath}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {f.originalName}
                  </a>
                  <span className="text-gray-500 text-sm">{f.sizeKB} KB</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
