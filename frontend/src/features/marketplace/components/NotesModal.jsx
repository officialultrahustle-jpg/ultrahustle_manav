import React from 'react';
import { X } from 'lucide-react';
import './NotesModal.css';

const NotesModal = ({ isOpen, onClose, title, content, theme = 'dark' }) => {
    if (!isOpen) return null;

    return (
        <div className={`nm-overlay ${theme}`} onClick={onClose}>
            <div className="nm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="nm-header">
                    <h2 className="nm-header-title">Notes</h2>
                    <button className="nm-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="nm-content-outer">
                    <div className="nm-content-inner">
                        <h3 className="nm-content-title">{title}</h3>
                        <div className="nm-content-body">
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotesModal;
