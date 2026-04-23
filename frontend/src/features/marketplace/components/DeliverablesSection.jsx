import React, { useMemo, useRef, useState } from "react";
import "./DeliverablesSection.css";

const isImageFileName = (value = "") =>
  /\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i.test(String(value || ""));

const getDeliverablePreviewUrl = (item) => {
  if (item?.file instanceof File) {
    return URL.createObjectURL(item.file);
  }
  return item?.existing_file_url || item?.file_url || "";
};

const DeliverablesSection = ({
  deliverables = [],
  onAddDeliverable,
  onRemoveDeliverable,
  onUpdateDeliverableNotes,
  onUpdateDeliverableFile,
  links = [],
  onAddLink,
  onRemoveLink,
  onUpdateLink,
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const previewItems = useMemo(() => {
    return deliverables.map((item) => {
      const previewUrl = getDeliverablePreviewUrl(item);
      const fileName =
        item?.file?.name ||
        item?.existing_file_name ||
        item?.file_name ||
        item?.name ||
        "";
      const isImage =
        !!previewUrl &&
        (item?.file?.type?.startsWith("image/") || isImageFileName(fileName) || isImageFileName(previewUrl));

      return {
        ...item,
        previewUrl,
        fileName,
        isImage,
      };
    });
  }, [deliverables]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFilesAdd = (files) => {
    const selectedFiles = Array.from(files || []);
    if (!selectedFiles.length) return;

    selectedFiles.forEach((file) => {
      onAddDeliverable?.(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesAdd(e.dataTransfer.files);
  };

  const handleFileChange = (e) => {
    handleFilesAdd(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="am-deliverables-card border !border-[#CEFF1B] rounded-xl p-4 bg-white dark:bg-[#141414]">
      <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-white">
        Upload main deliverables
      </h3>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.webp,.psd,.zip,.gif,.bmp,.svg"
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        className={`deliverable-dropzone ${isDragging ? "drag-over" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#CEFF1B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>

        <span className="deliverable-dropzone-label">
          <span style={{ color: "#CEFF1B", fontWeight: 600 }}>Click to upload</span> or drag & drop
        </span>
        <span className="deliverable-dropzone-hint">
          PDF, JPG, JPEG, PNG, WEBP, PSD, ZIP
        </span>
      </div>

      {previewItems.length > 0 && (
        <div className="deliverable-file-list mt-4">
          {previewItems.map((item, idx) => (
            <div
              key={idx}
              className="deliverable-file-card mb-4 border border-gray-200 dark:border-gray-800 rounded-lg p-3"
            >
              <div className="deliverable-file-header flex items-center justify-between gap-3">
                <div className="deliverable-file-info flex items-center gap-2 min-w-0">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>

                  <span className="deliverable-file-name text-sm font-medium truncate max-w-[220px]">
                    {item.fileName || "Unnamed file"}
                  </span>
                </div>

                <button
                  type="button"
                  className="deliverable-file-remove text-gray-400 hover:text-red-500 text-xl leading-none"
                  onClick={() => onRemoveDeliverable?.(idx)}
                  aria-label="Remove file"
                >
                  ×
                </button>
              </div>

              {item.isImage && item.previewUrl ? (
                <div className="mt-3">
                  <img
                    src={item.previewUrl}
                    alt={item.fileName || `deliverable-${idx + 1}`}
                    className="w-full max-h-[220px] object-contain rounded-lg border border-gray-200 dark:border-gray-800 bg-white"
                  />
                </div>
              ) : item.previewUrl ? (
                <div className="mt-3">
                  <a
                    href={item.previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[#84cc16] underline"
                  >
                    Preview file
                  </a>
                </div>
              ) : null}

              <div className="deliverable-notes-wrap mt-3">
                <label className="deliverable-notes-label text-xs text-gray-500 block mb-1">
                  Notes for this file
                </label>
                <textarea
                  placeholder="Add notes for this file (optional)"
                  value={item.notes || ""}
                  onChange={(e) => onUpdateDeliverableNotes?.(idx, e.target.value)}
                  className="deliverable-notes-textarea w-full text-sm bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded p-2 focus:outline-none focus:border-[#CEFF1B]"
                  rows={2}
                />
              </div>

              <div className="mt-3">
                <button
                  type="button"
                  className="text-sm text-[#CEFF1B]"
                  onClick={() => {
                    const input = document.getElementById(`deliverable-replace-${idx}`);
                    input?.click();
                  }}
                >
                  Replace file
                </button>

                <input
                  id={`deliverable-replace-${idx}`}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.psd,.zip,.gif,.bmp,.svg"
                  className="hidden"
                  onChange={(e) => onUpdateDeliverableFile?.(idx, e.target.files?.[0] || null)}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="deliverable-add-more w-full py-2 border border-dashed border-[#CEFF1B] text-[#CEFF1B] rounded-lg text-sm font-medium hover:bg-[#CEFF1B]/5 transition-colors"
          >
            + Add more files
          </button>
        </div>
      )}

      <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-4">
        <label className="text-sm font-medium text-black dark:text-gray-200 block mb-2">
          Link (Figma, Notion, GitHub, etc.)
        </label>

        <div className="space-y-2">
          {links.map((link, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                placeholder="Paste link here"
                value={link}
                onChange={(e) => onUpdateLink?.(idx, e.target.value)}
                className="flex-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:border-[#CEFF1B]"
              />
              {links.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveLink?.(idx)}
                  className="px-2 text-gray-400 hover:text-red-500"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={onAddLink}
            className="bg-[#CEFF1B] text-black text-sm font-semibold px-3 py-1.5 rounded-md hover:opacity-90"
          >
            + Add link
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliverablesSection;