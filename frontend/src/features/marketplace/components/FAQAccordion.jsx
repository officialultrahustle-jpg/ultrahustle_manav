import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './FAQAccordion.css';

const FAQAccordion = ({ faqData, theme }) => {
    const [activeFaq, setActiveFaq] = useState(null);

    return (
        <section className={`faq-section ${theme}`}>
            <div className="faq-header">
                <h3 className="faq-title">Frequently Asked Questions</h3>
                <div className="faq-header-line"></div>
            </div>

            <div className="faq-container">
                {faqData.map((faq, index) => (
                    <div
                        key={index}
                        className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                    >
                        <button
                            className="faq-question"
                            onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                        >
                            <span>{faq.question}</span>
                            <ChevronDown
                                size={20}
                                style={{ transform: activeFaq === index ? 'rotate(180deg)' : 'rotate(0)' }}
                            />
                        </button>
                        {activeFaq === index && (
                            <div className="faq-answer">
                                <p>{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQAccordion;
