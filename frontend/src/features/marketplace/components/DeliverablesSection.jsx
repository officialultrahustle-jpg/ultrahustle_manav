import React from "react";
import "./DeliverablesSection.css";

const DeliverablesSection = ({ 
  deliverables, 
  onAddDeliverable, 
  onUpdateDeliverableNotes, 
  links, 
  onAddLink, 
  onUpdateLink 
}) => {
  return (
    <div className="deliverables-section-container">
      {/* DELIVERABLES */}
      <div className="deliverables-card">
        <h3 className="deliverables-title">Upload main deliverables</h3>
        
        {deliverables.map((item, idx) => (
          <div key={idx} className="deliverable-item mb-6">
            {/* Upload Area */}
            <div className="deliverable-upload-box">
              <div className="deliverable-upload-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="deliverable-upload-text">
                <span className="text-blue-500">Click to upload</span> or Drag or drop file
              </p>
              <p className="deliverable-upload-hint">PDF, JPG, JPEG, PNG less than 10MB.</p>
              <p className="deliverable-upload-hint">Ensure your document are in good condition and readable</p>
            </div>

            {/* Notes Area */}
            <div className="deliverable-notes-area mt-4">
              <div className="deliverable-notes-header">Add Notes</div>
              <textarea
                placeholder="Type here"
                value={item.notes}
                onChange={(e) => onUpdateDeliverableNotes(idx, e.target.value)}
                className="deliverable-notes-textarea"
              />
            </div>
          </div>
        ))}
        
        <div className="flex justify-end mb-8">
          <button type="button" className="deliverables-add-btn" onClick={onAddDeliverable}>
            + Add more
          </button>
        </div>

        {/* LINKS */}
        <div className="deliverables-links-divider"></div>
        <h3 className="deliverables-title">Link</h3>
        
        {links.map((link, idx) => (
          <div key={idx} className="link-item mb-4">
            <input
              className="deliverable-input"
              placeholder="Paste here"
              value={link}
              onChange={(e) => onUpdateLink(idx, e.target.value)}
            />
          </div>
        ))}
        
        <div className="flex justify-end mt-4">
          <button type="button" className="deliverables-add-btn" onClick={onAddLink}>
            + Add more
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliverablesSection;
