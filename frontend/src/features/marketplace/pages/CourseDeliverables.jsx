import React, { useState, useEffect, useMemo } from "react";
import {
  Package,
  Download,
  ExternalLink,
  FileText,
  Star,
  ChevronUp,
  ChevronDown,
  Play,
  Check,
  DollarSign,
} from "lucide-react";
import { useParams } from "react-router-dom";
import "./CourseDeliverables.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import DetailedTeamCard from "../components/DetailedTeamCard";
import OrderDetailsSection from "../components/OrderDetailsSection";
import NotesModal from "../components/NotesModal";
import { getListingByUsername } from "../api/listingApi";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const formatFileSize = (bytes) => {
  const size = Number(bytes);
  if (!size || Number.isNaN(size)) return "—";

  if (size >= 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
  if (size >= 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  }

  return `${size} B`;
};

const getFileNameFromPath = (path = "") => {
  if (!path) return "Resource File";
  const parts = path.split("/");
  return parts[parts.length - 1] || "Resource File";
};

const getTagFromFile = (item) => {
  const mime = String(item?.file_mime || "").toLowerCase();
  const fileName = String(item?.file_name || "").toLowerCase();

  if (mime.includes("pdf") || fileName.endsWith(".pdf")) return "PDF";
  if (mime.includes("zip") || fileName.endsWith(".zip")) return "ZIP";
  if (mime.includes("image")) return "Image";
  if (mime.includes("video")) return "Video";
  if (mime.includes("json")) return "JSON";
  if (mime.includes("text")) return "Text";
  if (fileName.includes(".")) return fileName.split(".").pop().toUpperCase();

  return "File";
};

const splitIntoTwoColumns = (items = []) => {
  const middle = Math.ceil(items.length / 2);
  return [items.slice(0, middle), items.slice(middle)];
};

const CourseDeliverables = ({ theme, setTheme }) => {
  const { username } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : false;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    const loadListing = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getListingByUsername(username);
        const item = res?.listing || null;

        if (!item) {
          setListing(null);
          setError("Listing not found.");
          return;
        }

        if (item.listing_type !== "course") {
          setListing(null);
          setError("This listing is not a course.");
          return;
        }

        setListing(item);

        if (Array.isArray(item.faqs) && item.faqs.length > 0) {
          setActiveFaq(item.faqs[0].id || 1);
        } else {
          setActiveFaq(null);
        }
      } catch (e) {
        setListing(null);
        setError(e?.message || "Failed to load course.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      loadListing();
    }
  }, [username]);

  const toggleFaq = (id) => {
    setActiveFaq((prev) => (prev === id ? null : id));
  };

  const deliverables = useMemo(() => {
    const raw = Array.isArray(listing?.deliverables) ? listing.deliverables : [];

    return raw.map((item, index) => {
      const title =
        item.file_name ||
        getFileNameFromPath(item.file_path) ||
        `Resource ${index + 1}`;

      return {
        id: item.id || index + 1,
        title,
        updated: formatDate(item.updated_at || item.created_at || listing?.updated_at),
        size: formatFileSize(item.file_size),
        tags: [getTagFromFile(item), item.notes ? "Note" : "Final"],
        type: item.file_url ? "download" : "link",
        buttonText: item.file_url ? "Download" : "Open link",
        fileUrl: item.file_url || "",
        note: item.notes || "No note available for this resource.",
      };
    });
  }, [listing]);

  const faqData = useMemo(() => {
    const raw = Array.isArray(listing?.faqs) ? listing.faqs : [];

    return raw.map((faq, index) => ({
      id: faq.id || index + 1,
      question: faq.q || "Question",
      answer: faq.a || "Answer not available.",
    }));
  }, [listing]);

  const lessonsData = useMemo(() => {
    const raw = Array.isArray(listing?.details?.lessons) ? listing.details.lessons : [];

    return raw.map((lesson, index) => ({
      id: index + 1,
      number: `Lesson ${index + 1}`,
      title: lesson.title || `Lesson ${index + 1}`,
      description: lesson.description || "No lesson description available.",
      mediaUrl: lesson.media_url || "",
    }));
  }, [listing]);

  const tools = Array.isArray(listing?.details?.tools) ? listing.details.tools : [];
  const learningPoints = Array.isArray(listing?.details?.learning_points)
    ? listing.details.learning_points
    : [];
  const languages = Array.isArray(listing?.details?.languages)
    ? listing.details.languages
    : [];

  const [leftLearning, rightLearning] = splitIntoTwoColumns(learningPoints);

  const handleOpenFile = (fileUrl) => {
    if (!fileUrl) return;
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleWatchPreview = () => {
    const previewUrl = listing?.details?.preview_video_url;
    if (!previewUrl) return;
    window.open(previewUrl, "_blank", "noopener,noreferrer");
  };

  const handleWatchLesson = (lesson) => {
    if (!lesson?.mediaUrl) return;
    window.open(lesson.mediaUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className={`user-page course-deliverables-page ${theme} min-h-screen relative overflow-hidden`}>
        <UserNavbar
          toggleSidebar={() => setSidebarOpen((p) => !p)}
          theme={theme}
        />

        <div className="pt-[85px] flex relative z-10">
          <Sidebar
            expanded={sidebarOpen}
            setExpanded={setSidebarOpen}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            theme={theme}
            setTheme={setTheme}
          />

          <div className="relative flex-1 min-w-5 overflow-hidden">
            <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]">
              <div className="cd-container">
                <div className="cd-header-card">
                  <div className="cd-header-content">
                    <h1>Loading course...</h1>
                    <p>Please wait while course details are being loaded.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className={`user-page course-deliverables-page ${theme} min-h-screen relative overflow-hidden`}>
        <UserNavbar
          toggleSidebar={() => setSidebarOpen((p) => !p)}
          theme={theme}
        />

        <div className="pt-[85px] flex relative z-10">
          <Sidebar
            expanded={sidebarOpen}
            setExpanded={setSidebarOpen}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            theme={theme}
            setTheme={setTheme}
          />

          <div className="relative flex-1 min-w-5 overflow-hidden">
            <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]">
              <div className="cd-container">
                <div className="cd-header-card">
                  <div className="cd-header-content">
                    <h1>Unable to load course</h1>
                    <p>{error || "Course not found."}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`user-page course-deliverables-page ${theme} min-h-screen relative overflow-hidden`}
    >
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((p) => !p)}
        theme={theme}
      />

      <div className="pt-[85px] flex relative z-10">
        <Sidebar
          expanded={sidebarOpen}
          setExpanded={setSidebarOpen}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          theme={theme}
          setTheme={setTheme}
        />

        <div className="relative flex-1 min-w-5 overflow-hidden">
          <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]">
            <div className="cd-container">
              <div className="cd-header-card">
                <div className="cd-header-content">
                  <h1>{listing.title || "Course"}</h1>
                  <p>
                    {listing.short_description ||
                      "Access your delivered files, notes, and project chat."}
                  </p>
                </div>
              </div>

              <div className="cd-info-grid">
                <div className="cd-info-card">
                  <div className="cd-info-icon">
                    <Package size={24} />
                  </div>
                  <div className="cd-info-card-text">
                    <span className="cd-info-label">Username</span>
                    <span className="cd-info-value">{listing.username || "—"}</span>
                  </div>
                </div>

                <div className="cd-info-card">
                  <div className="cd-info-icon">
                    <Package size={24} />
                  </div>
                  <div className="cd-info-card-text">
                    <span className="cd-info-label">Purchased</span>
                    <span className="cd-info-value">
                      {formatDate(listing.created_at)}
                    </span>
                  </div>
                </div>

                <div className="cd-info-card">
                  <div className="cd-info-icon lime">
                    <DollarSign size={32} />
                  </div>
                  <div className="cd-info-card-text">
                    <span className="cd-info-label">Level</span>
                    <span className="cd-info-value">
                      {listing?.details?.course_level || "—"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="cd-info-section">
                <div className="cd-info-block">
                  <h2 className="cd-info-title">Description</h2>
                  <p className="cd-info-text">
                    {listing.short_description || "No description available."}
                  </p>
                </div>

                <div className="cd-info-block">
                  <h2 className="cd-info-title">Tools needed</h2>
                  <div className="cd-tools-list">
                    {tools.length > 0 ? (
                      tools.map((tool) => (
                        <span key={tool} className="cd-tool-tag">
                          {tool}
                        </span>
                      ))
                    ) : (
                      <p className="cd-info-text">No tools listed.</p>
                    )}
                  </div>
                </div>

                <div className="cd-info-block">
                  <h2 className="cd-info-title">Prerequisites</h2>
                  <p className="cd-info-text">
                    {listing.about || "No prerequisites added yet."}
                  </p>
                </div>

                <div className="cd-info-block">
                  <h2 className="cd-info-title">What you will learn</h2>
                  {learningPoints.length > 0 ? (
                    <div className="cd-info-grid-2">
                      <ul className="cd-learn-list">
                        {leftLearning.map((point, index) => (
                          <li key={`left-${index}`}>{point}</li>
                        ))}
                      </ul>
                      <ul className="cd-learn-list">
                        {rightLearning.map((point, index) => (
                          <li key={`right-${index}`}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="cd-info-text">No learning points added yet.</p>
                  )}
                </div>

                <div className="cd-info-block">
                  <h2 className="cd-info-title">Course includes</h2>
                  {learningPoints.length > 0 ? (
                    <div className="cd-info-grid-2">
                      {learningPoints.map((point, index) => (
                        <div className="cd-include-item" key={index}>
                          <Check size={18} />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="cd-info-text">No course includes added yet.</p>
                  )}
                </div>

                <div className="cd-info-block">
                  <h2 className="cd-info-title">Languages</h2>
                  <p className="cd-languages-text">
                    {languages.length > 0 ? (
                      languages.map((language) => (
                        <span key={language} className="cd-language-item">
                          {language}
                        </span>
                      ))
                    ) : (
                      <span className="cd-language-item">No languages listed</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="cd-video-section">
                <h2 className="cd-section-title">Course</h2>
                <div className="cd-video-container">
                  <div
                    className="cd-video-placeholder"
                    onClick={handleWatchPreview}
                    style={{ cursor: listing?.details?.preview_video_url ? "pointer" : "default" }}
                  >
                    <div className="cd-play-button">
                      <Play size={32} fill="#000" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="cd-lessons-section">
                {lessonsData.length > 0 ? (
                  lessonsData.map((lesson) => (
                    <div key={lesson.id} className="cd-lesson-card">
                      <div className="cd-lesson-content">
                        <div className="cd-lesson-badge">{lesson.number}</div>
                        <h3 className="cd-lesson-title">{lesson.title}</h3>
                        <p className="cd-lesson-description">{lesson.description}</p>
                      </div>
                      <button
                        className="cd-watch-btn"
                        onClick={() => handleWatchLesson(lesson)}
                        disabled={!lesson.mediaUrl}
                      >
                        Watch
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="cd-lesson-card">
                    <div className="cd-lesson-content">
                      <div className="cd-lesson-badge">Lesson</div>
                      <h3 className="cd-lesson-title">No lessons added yet</h3>
                      <p className="cd-lesson-description">
                        Lessons will appear here once they are added.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="cd-deliverables-section">
                <h2 className="cd-section-title">Resources</h2>

                <div className="cd-files-list-container">
                  <div className="cd-files-list">
                    {deliverables.length > 0 ? (
                      deliverables.map((item) => (
                        <div key={item.id} className="cd-file-item">
                          <div className="cd-file-info">
                            <h3>{item.title}</h3>
                            <div className="cd-file-meta">
                              <span>Updated {item.updated}</span>
                              <span className="cd-meta-dot">•</span>
                              <span>{item.size}</span>
                            </div>
                            <div className="cd-file-tags">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className={`cd-tag ${tag.toLowerCase()}`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="cd-file-actions">
                            <button
                              className="cd-action-btn primary"
                              onClick={() => handleOpenFile(item.fileUrl)}
                              disabled={!item.fileUrl}
                            >
                              {item.type === "download" ? (
                                <Download size={18} />
                              ) : (
                                <ExternalLink size={18} />
                              )}
                              {item.buttonText}
                            </button>
                            <button
                              className="cd-action-btn secondary"
                              onClick={() =>
                                setSelectedNote({
                                  title: item.title,
                                  content: item.note,
                                })
                              }
                            >
                              <FileText size={18} />
                              View note
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="cd-file-item">
                        <div className="cd-file-info">
                          <h3>No resources uploaded yet</h3>
                          <div className="cd-file-meta">
                            <span>Files will appear here when added.</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "40px" }}>
                <DetailedTeamCard />
              </div>

              <div className="cd-faq-section">
                <div className="cd-review-header">
                  <h2>Frequently Asked Questions</h2>
                  <div className="cd-header-line"></div>
                </div>

                <div className="cd-faq-list">
                  {faqData.length > 0 ? (
                    faqData.map((faq) => (
                      <div
                        key={faq.id}
                        className={`cd-faq-item ${activeFaq === faq.id ? "active" : ""}`}
                      >
                        <div
                          className="cd-faq-question"
                          onClick={() => toggleFaq(faq.id)}
                        >
                          <span>{faq.question}</span>
                          {activeFaq === faq.id ? (
                            <ChevronUp size={24} />
                          ) : (
                            <ChevronDown size={24} />
                          )}
                        </div>
                        {activeFaq === faq.id && (
                          <div className="cd-faq-answer">
                            <p>{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="cd-faq-item active">
                      <div className="cd-faq-question">
                        <span>No FAQs added yet</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="cd-review-section">
                <div className="cd-review-header">
                  <h2>Review</h2>
                  <div className="cd-header-line"></div>
                </div>

                <div className="cd-review-card">
                  <div className="cd-review-content">
                    <p className="cd-review-text">
                      {listing.about || "No review content available yet."}
                    </p>
                    <div className="cd-review-footer">
                      <div className="cd-stars">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={20}
                            fill={theme === "dark" ? "#CEFF1B" : "#FFE100"}
                            stroke={theme === "dark" ? "#CEFF1B" : "#FFE100"}
                          />
                        ))}
                      </div>
                      <button className="cd-post-btn">Post</button>
                    </div>
                  </div>
                </div>
              </div>

              <OrderDetailsSection prefix="cd" />
            </div>
          </div>
        </div>
      </div>

      <NotesModal
        isOpen={!!selectedNote}
        onClose={() => setSelectedNote(null)}
        title={selectedNote?.title}
        content={selectedNote?.content}
        theme={theme}
      />
    </div>
  );
};

export default CourseDeliverables;