import React from "react";
import { Trash2, Plus } from "lucide-react";
import "./FAQSection.css";

const FAQSection = ({ 
  faqs, 
  onAddFaq, 
  onUpdateFaq, 
  onRemoveFaq, 
  showFooter = false, 
  onSave, 
  onSaveDraft 
}) => {
  return (
    <div className="faq-section-container">
      <h2 className="faq-heading">FAQs</h2>

      {faqs.map((faq, index) => (
        <div key={index} className="faq-card">
          <div className="faq-header">
            <h3>FAQ #{index + 1}</h3>

            <button
              type="button"
              className="delete-btn"
              onClick={() => onRemoveFaq(index)}
              disabled={faqs.length === 1}
            >
              <Trash2 size={20} />
            </button>
          </div>

          <div className="faq-field">
            <label>Question</label>
            <input
              type="text"
              value={faq.q}
              onChange={(e) =>
                onUpdateFaq(index, "q", e.target.value)
              }
              placeholder="What do you need to start?"
            />
          </div>

          <div className="faq-field">
            <label>Answer</label>
            <input
              type="text"
              value={faq.a}
              onChange={(e) =>
                onUpdateFaq(index, "a", e.target.value)
              }
              placeholder="A brief and brand assets."
            />
          </div>

          {index === faqs.length - 1 && (
            <button type="button" className="add-btn" onClick={onAddFaq}>
              <Plus size={18} /> Add
            </button>
          )}
        </div>
      ))}

      {showFooter && (
        <div className="faq-footer">
          <button type="button" className="draft-btn" onClick={onSaveDraft}>
            Save as Draft
          </button>

          <button type="button" className="save-btn" onClick={onSave}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default FAQSection;