import React from 'react';
import { Star, Infinity, CheckCircle2, Clock, User } from 'lucide-react';
import './DetailedTeamCard.css';

const DetailedTeamCard = ({ 
    teamName = "Name of the team",
    location = "San Francisco, CA",
    rating = 4.9,
    reviewCount = 247,
    description = "Hi! I'm Sarah, a senior UI/UX designer with over 8 years of experience creating beautiful and functional mobile applications. I've worked with startups, agencies, and Fortune 500 companies to deliver exceptional user experiences.",
    languages = ["Spanish", "English"],
    karma = "1,284",
    projectsCompleted = "98%",
    responseSpeed = "1 hr",
    memberSince = "January 2018",
    skills = ['Agile/Scrum', 'Accessibility', 'Visual Design', 'Front-end Development', 'Product Design', 'UI/UX Design', 'Design Systems', 'Mobile App Design', 'User Research'],
    avatarUrl = "https://i.pravatar.cc/150?u=team"
}) => {
    return (
        <div className="cl-team-profile-card">
            <div className="cl-profile-left">
                <div className="cl-profile-header">
                    <div className="cl-avatar-container">
                        <img src={avatarUrl} alt={teamName} className="cl-profile-avatar" />
                        <div className="cl-online-indicator"></div>
                    </div>
                    <div className="cl-profile-title-box">
                        <h3>{teamName}</h3>
                        <p className="cl-location">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px', verticalAlign: 'middle', color: '#ccc' }}>
                                <circle cx="12" cy="12" r="10" />
                            </svg>
                            {location}
                        </p>
                        <div className="cl-rating-row">
                            <div className="cl-stars">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star 
                                        key={s} 
                                        size={16} 
                                        fill={s <= Math.floor(rating) ? "#CEFF1B" : "none"} 
                                        color="#CEFF1B" 
                                    />
                                ))}
                            </div>
                            <span className="cl-rating-text">{rating}({reviewCount} reviews)</span>
                        </div>
                    </div>
                </div>

                <div className="cl-profile-details">
                    <h4>About me</h4>
                    <p>{description}</p>

                    <div className="cl-languages-section">
                        <h5>Languages</h5>
                        <div className="cl-lang-tags">
                            {languages.map(lang => (
                                <span key={lang}>{lang}</span>
                            ))}
                        </div>
                    </div>

                    <button className="cl-full-profile-btn">View Profile</button>
                </div>
            </div>

            <div className="cl-profile-right">
                <div className="cl-stats-grid">
                    <div className="cl-stat-card">
                        <div className="stat-header">
                            <Infinity size={16} className="stat-icon-svg" />
                            <span className="stat-label">Karma</span>
                        </div>
                        <span className="stat-value">{karma}</span>
                    </div>
                    <div className="cl-stat-card">
                        <div className="stat-header">
                            <CheckCircle2 size={16} className="stat-icon-svg" />
                            <span className="stat-label">Projects Completed</span>
                        </div>
                        <span className="stat-value">{projectsCompleted}</span>
                    </div>
                    <div className="cl-stat-card">
                        <div className="stat-header">
                            <Clock size={16} className="stat-icon-svg" />
                            <span className="stat-label">Average Response Speed</span>
                        </div>
                        <span className="stat-value">{responseSpeed}</span>
                    </div>
                    <div className="cl-stat-card">
                        <div className="stat-header">
                            <User size={16} className="stat-icon-svg" />
                            <span className="stat-label">Member Since</span>
                        </div>
                        <span className="stat-value">{memberSince}</span>
                    </div>
                </div>

                <div className="cl-skills-panel">
                    <h4>Skills & Expertise</h4>
                    <div className="cl-skills-grid">
                        {skills.map(skill => (
                            <span key={skill} className="cl-skill-tag">{skill}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailedTeamCard;
