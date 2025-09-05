// // import React, { useState, useRef, useEffect } from "react";

// // export default function Upload() {
// //   const [files, setFiles] = useState([]);
// //   const [progress, setProgress] = useState(0);
// //   const [error, setError] = useState("");
// //   const [search, setSearch] = useState("");
// //   const [page, setPage] = useState(1);
// //   const [total, setTotal] = useState(0);
// //   const [limit] = useState(10); // items per page
// //   const dropRef = useRef(null);
// //   const fileInputRef = useRef(null);

// //   const SERVER = "http://localhost:5000";

// //   const fetchFiles = async () => {
// //     const response = await fetch(
// //       `${SERVER}/files?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
// //     );
// //     const data = await response.json();
// //     if (data.ok) {
// //       setFiles(data.files);
// //       setTotal(data.total);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchFiles();
// //   }, [page, search]);

// //   const handleFiles = (selectedFiles) => {
// //     setError("");
// //     setProgress(0);

// //     const form = new FormData();
// //     Array.from(selectedFiles).forEach((f) => form.append("files", f));

// //     upload(form);
// //   };

// //   const upload = async (form) => {
// //     try {
// //       const response = await fetch(`${SERVER}/upload`, {
// //         method: "POST",
// //         body: form,
// //       });
// //       if (!response.ok) throw new Error("Upload failed");
// //       await response.json();
// //       setProgress(100);
// //       fetchFiles();
// //     } catch (err) {
// //       setError(err.message || "Upload error");
// //     }
// //   };

// //   const onDrop = (e) => {
// //     e.preventDefault();
// //     handleFiles(e.dataTransfer.files);
// //     dropRef.current.classList.remove("border-blue-500");
// //   };

// //   const onDragOver = (e) => {
// //     e.preventDefault();
// //     dropRef.current.classList.add("border-blue-500");
// //   };

// //   const onDragLeave = () => {
// //     dropRef.current.classList.remove("border-blue-500");
// //   };

// //   const copyToClipboard = (url) => {
// //     navigator.clipboard.writeText(url).then(() => {
// //       alert("Copied: " + url);
// //     });
// //   };

// //   const totalPages = Math.ceil(total / limit);

// //   return (
// //     <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
// //       <div className="w-full max-w-4xl bg-white border border-gray-300 rounded-lg shadow-md p-6">
// //         <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
// //           Upload & Manage PDFs
// //         </h2>

// //         {/* Drag and Drop */}
// //         <div
// //           ref={dropRef}
// //           onDrop={onDrop}
// //           onDragOver={onDragOver}
// //           onDragLeave={onDragLeave}
// //           onClick={() => fileInputRef.current.click()}
// //           className="w-full mb-4 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 cursor-pointer hover:border-blue-500"
// //         >
// //           Drag & drop files or click to select
// //           <input
// //             type="file"
// //             multiple
// //             onChange={(e) => handleFiles(e.target.files)}
// //             accept="application/pdf"
// //             ref={fileInputRef}
// //             className="hidden"
// //           />
// //         </div>

// //         {progress > 0 && (
// //           <div className="mb-4">
// //             <div className="text-sm mb-1 text-gray-700">Progress: {progress}%</div>
// //             <div className="w-full h-2 bg-gray-200 rounded">
// //               <div
// //                 className="h-2 bg-green-500 rounded"
// //                 style={{ width: `${progress}%` }}
// //               />
// //             </div>
// //           </div>
// //         )}

// //         {error && <p className="text-red-500 text-center mb-4">{error}</p>}

// //         {/* Search */}
// //         <div className="flex mb-4">
// //           <input
// //             type="text"
// //             value={search}
// //             onChange={(e) => {
// //               setPage(1);
// //               setSearch(e.target.value);
// //             }}
// //             placeholder="Search PDF..."
// //             className="flex-1 border rounded p-2  border-gray-200"
// //           />
// //         </div>

// //         {/* Files Table */}
// //         <table className="w-full border-collapse border border-gray-300 text-sm mb-4">
// //         <thead>
// //         <tr className="bg-white">
// //             <th className="border border-gray-300 p-2 text-left text-black font-semibold">File Name</th>
// //             <th className="border border-gray-300 p-2 text-black font-semibold text-center">Size (KB)</th>
// //             <th className="border border-gray-300 p-2 text-black font-semibold text-center">Actions</th>
// //         </tr>
// //         </thead>
// //           <tbody>
// //             {files.map((f) => {
// //               const fileUrl = `${SERVER}${f.localPath}`;
// //               return (
// //                 <tr key={f.filename}>
// //                   <td className="border border-gray-300 p-2">
// //                     <a
// //                       href={fileUrl}
// //                       target="_blank"
// //                       rel="noreferrer"
// //                       className="text-blue-600 hover:underline"
// //                     >
// //                       {f.originalName}
// //                     </a>
// //                   </td>
// //                   <td className="border border-gray-300 p-2 text-center text-black">
// //                     {f.sizeKB}
// //                   </td>
// //                   <td className="border border-gray-300 p-2 text-center">
// //                     <button
// //                       onClick={() => copyToClipboard(fileUrl)}
// //                       className="text-sm bg-blue-800 px-3 py-1 rounded hover:bg-gray-300"
// //                     >
// //                       Copy URL
// //                     </button>
// //                   </td>
// //                 </tr>
// //               );
// //             })}
// //           </tbody>
// //         </table>

// //         {/* Pagination */}
// //         <div className="flex justify-center items-center space-x-2">
// //           <button
// //             disabled={page === 1}
// //             onClick={() => setPage(page - 1)}
// //             className="px-3 py-1 border rounded disabled:opacity-50"
// //           >
// //             Prev
// //           </button>
// //           <span>
// //             Page {page} of {totalPages}
// //           </span>
// //           <button
// //             disabled={page === totalPages}
// //             onClick={() => setPage(page + 1)}
// //             className="px-3 py-1 border rounded disabled:opacity-50"
// //           >
// //             Next
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// import React, { useState, useRef, useEffect } from "react";

// export default function Upload() {
//   const [files, setFiles] = useState([]);
//   const [progress, setProgress] = useState(0);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [limit] = useState(10); // items per page
//   const dropRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const SERVER = "http://localhost:5000";

//   // Fetch files with pagination and search
//   const fetchFiles = async () => {
//     const response = await fetch(
//       `${SERVER}/files?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
//     );
//     const data = await response.json();
//     if (data.ok) {
//       setFiles(data.files);
//       setTotal(data.files.length); // use total if backend returns total count
//     }
//   };

//   useEffect(() => {
//     fetchFiles();
//   }, [page, search]);

//   const handleFiles = (selectedFiles) => {
//     setError("");
//     setProgress(0);

//     const form = new FormData();
//     Array.from(selectedFiles).forEach((f) => form.append("files", f));

//     upload(form);
//   };

//   const upload = async (form) => {
//     try {
//       const response = await fetch(`${SERVER}/upload`, {
//         method: "POST",
//         body: form,
//       });
//       if (!response.ok) throw new Error("Upload failed");
//       await response.json();
//       setProgress(100);
//       fetchFiles(); // refresh table after upload
//     } catch (err) {
//       setError(err.message || "Upload error");
//     }
//   };

//   const onDrop = (e) => {
//     e.preventDefault();
//     handleFiles(e.dataTransfer.files);
//     dropRef.current.classList.remove("border-blue-500");
//   };

//   const onDragOver = (e) => {
//     e.preventDefault();
//     dropRef.current.classList.add("border-blue-500");
//   };

//   const onDragLeave = () => {
//     dropRef.current.classList.remove("border-blue-500");
//   };

//   const copyToClipboard = (url) => {
//     navigator.clipboard.writeText(url).then(() => {
//       alert("Copied: " + url);
//     });
//   };

//   const totalPages = Math.ceil(total / limit);

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
//       <div className="w-full max-w-5xl bg-white border border-gray-300 rounded-lg shadow-md p-6">
//         <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
//           Upload & Manage PDFs
//         </h2>

//         {/* Drag & Drop */}
//         <div
//           ref={dropRef}
//           onDrop={onDrop}
//           onDragOver={onDragOver}
//           onDragLeave={onDragLeave}
//           onClick={() => fileInputRef.current.click()}
//           className="w-full mb-4 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 cursor-pointer hover:border-blue-500"
//         >
//           Drag & drop files or click to select
//           <input
//             type="file"
//             multiple
//             onChange={(e) => handleFiles(e.target.files)}
//             accept="application/pdf"
//             ref={fileInputRef}
//             className="hidden"
//           />
//         </div>

//         {progress > 0 && (
//           <div className="mb-4">
//             <div className="text-sm mb-1 text-gray-700">Progress: {progress}%</div>
//             <div className="w-full h-2 bg-gray-200 rounded">
//               <div className="h-2 bg-green-500 rounded" style={{ width: `${progress}%` }} />
//             </div>
//           </div>
//         )}

//         {error && <p className="text-red-500 text-center mb-4">{error}</p>}

//         {/* Search */}
//         <div className="flex mb-4">
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => {
//               setPage(1);
//               setSearch(e.target.value);
//             }}
//             placeholder="Search PDF..."
//             className="flex-1 border rounded p-2"
//           />
//         </div>

//         {/* Table */}
//         <table className="w-full border-collapse border border-gray-300 text-sm mb-4">
//           <thead>
//             <tr className="bg-white">
//               <th className="border border-gray-300 p-2 text-left text-black font-semibold">File Name</th>
//               <th className="border border-gray-300 p-2 text-center text-black font-semibold">Size (KB)</th>
//               <th className="border border-gray-300 p-2 text-center text-black font-semibold">Uploaded At</th>
//               <th className="border border-gray-300 p-2 text-center text-black font-semibold">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {files.map((f) => {
//               const fileUrl = `${SERVER}${f.localPath}`;
//               const uploadedTime = new Date(f.uploadTime).toLocaleString(); // format nicely
//               return (
//                 <tr key={f.filename}>
//                   <td className="border border-gray-300 p-2">
//                     <a href={fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
//                       {f.originalName}
//                     </a>
//                   </td>
//                   <td className="border border-gray-300 p-2 text-center">{f.sizeKB}</td>
//                   <td className="border border-gray-300 p-2 text-center">{uploadedTime}</td>
//                   <td className="border border-gray-300 p-2 text-center">
//                     <button
//                       onClick={() => copyToClipboard(fileUrl)}
//                       className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
//                     >
//                       Copy URL
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         <div className="flex justify-center items-center space-x-2">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage(page - 1)}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span>
//             Page {page} of {totalPages}
//           </span>
//           <button
//             disabled={page === totalPages}
//             onClick={() => setPage(page + 1)}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useRef, useEffect } from "react";

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10); // items per page
  const dropRef = useRef(null);
  const fileInputRef = useRef(null);

  const SERVER = "http://localhost:5000";

  // Fetch files with pagination and search
  const fetchFiles = async () => {
    const response = await fetch(
      `${SERVER}/files?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    );
    const data = await response.json();
    if (data.ok) {
      setFiles(data.files);
      setTotal(data.files.length); // use total if backend returns total count
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [page, search]);

  const handleFiles = (selectedFiles) => {
    setError("");
    setProgress(0);

    const form = new FormData();
    Array.from(selectedFiles).forEach((f) => form.append("files", f));

    upload(form);
  };

  const upload = async (form) => {
    try {
      const response = await fetch(`${SERVER}/upload`, {
        method: "POST",
        body: form,
      });
      if (!response.ok) throw new Error("Upload failed");
      await response.json();
      setProgress(100);
      fetchFiles(); // refresh table after upload
    } catch (err) {
      setError(err.message || "Upload error");
    }
  };

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

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      alert("Copied: " + url);
    });
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl bg-white border border-gray-300 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Upload & Manage PDFs
        </h2>

        {/* Drag & Drop */}
        <div
          ref={dropRef}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current.click()}
          className="w-full mb-4 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 cursor-pointer hover:border-blue-500"
        >
          Drag & drop files or click to select
          <input
            type="file"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            accept="application/pdf"
            ref={fileInputRef}
            className="hidden"
          />
        </div>

        {progress > 0 && (
          <div className="mb-4">
            <div className="text-sm mb-1 text-gray-700">Progress: {progress}%</div>
            <div className="w-full h-2 bg-gray-200 rounded">
              <div className="h-2 bg-green-500 rounded" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Search */}
        <div className="flex mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search PDF..."
            className="flex-1 border rounded p-2"
          />
        </div>

        {/* Table */}
        <table className="w-full border-collapse border border-gray-300 text-sm mb-4">
          <thead>
            <tr className="bg-white">
              <th className="border border-gray-300 p-2 text-left text-black font-semibold">File Name</th>
              <th className="border border-gray-300 p-2 text-center text-black font-semibold">Size (KB)</th>
              <th className="border border-gray-300 p-2 text-center text-black font-semibold">Uploaded At</th>
              <th className="border border-gray-300 p-2 text-center text-black font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => {
              const fileUrl = `${SERVER}${f.localPath}`;
              const uploadedTime = f.uploadTime ? new Date(f.uploadTime).toLocaleString() : "Unknown";
              return (
                <tr key={f.filename}>
                  <td className="border border-gray-300 p-2">
                    <a href={fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      {f.originalName}
                    </a>
                  </td>
                  <td className="border border-gray-300 p-2 text-center text-black">{f.sizeKB}</td>
                  <td className="border border-gray-300 p-2 text-center text-black">{uploadedTime}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => copyToClipboard(fileUrl)}
                      className="text-sm bg-blue-800 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      Copy URL
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
