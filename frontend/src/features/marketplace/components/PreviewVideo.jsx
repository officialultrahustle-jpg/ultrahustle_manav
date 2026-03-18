import React from "react";
import "./PreviewVideo.css";

const VideoPreviewUpload = ({
    previewImage = "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
    onUpload,
    onClose,
}) => {
    return (
        <div className="video-preview-section">
            <h3 className="video-preview-title">Preview video</h3>

            <div className="video-preview-card">
                <button
                    type="button"
                    className="video-close-btn"
                    onClick={onClose}
                    aria-label="Close preview"
                >
                    ×
                </button>

                <div className="video-preview-image-wrap">
                    <img
                        src={previewImage}
                        alt="Video preview"
                        className="video-preview-image"
                    />

                    <div className="video-preview-overlay">
                        <button
                            type="button"
                            className="video-upload-btn"
                            onClick={onUpload}
                        >
                            Upload Video
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPreviewUpload;