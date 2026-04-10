import React, { useState, useEffect, useMemo } from "react";
import {
  Package,
  Download,
  ExternalLink,
  FileText,
  ChevronUp,
  ChevronDown,
  DollarSign,
  Star,
} from "lucide-react";
import { useParams } from "react-router-dom";
import "./ProductDeliverables.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import DetailedTeamCard from "../components/DetailedTeamCard";
import OrderDetailsSection from "../components/OrderDetailsSection";
import NotesModal from "../components/NotesModal";
import { getListingByUsername } from "../api/listingApi";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return `$${num}`;
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
  if (!path) return "Deliverable File";
  const parts = path.split("/");
  return parts[parts.length - 1] || "Deliverable File";
};

const getPrimaryPriceInfo = (listing) => {
  const packages = listing?.details?.packages || {};
  const entries = Object.entries(packages);

  for (const [packageName, pkg] of entries) {
    if (pkg?.price !== null && pkg?.price !== undefined && pkg?.price !== "") {
      return {
        label: `${packageName} Price`,
        value: pkg.price,
      };
    }
  }

  return {
    label: "Price",
    value: "—",
  };
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
  if (fileName.includes(".")) {
    return fileName.split(".").pop().toUpperCase();
  }

  return "File";
};

const ProductDeliverables = ({ theme, setTheme }) => {
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

        if (item.listing_type !== "digital_product") {
          setListing(null);
          setError("This listing is not a digital product.");
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
        setError(e?.message || "Failed to load listing.");
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
        `Deliverable ${index + 1}`;

      return {
        id: item.id || index + 1,
        title,
        updated: formatDate(item.updated_at || item.created_at || listing?.updated_at),
        size: formatFileSize(item.file_size),
        tags: [getTagFromFile(item), item.notes ? "Note" : "Final"],
        type: item.file_url ? "download" : "link",
        buttonText: item.file_url ? "Download" : "Open link",
        fileUrl: item.file_url || "",
        note: item.notes || "No note available for this deliverable.",
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

  const priceInfo = useMemo(() => getPrimaryPriceInfo(listing), [listing]);

  const handleOpenFile = (fileUrl) => {
    if (!fileUrl) return;
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownloadAll = () => {
    deliverables.forEach((item) => {
      if (item.fileUrl) {
        window.open(item.fileUrl, "_blank", "noopener,noreferrer");
      }
    });
  };

  if (loading) {
    return (
      <div className={`user-page order-deliverables-page ${theme} min-h-screen relative overflow-hidden`}>
        <UserNavbar toggleSidebar={() => setSidebarOpen((p) => !p)} theme={theme} />
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
              <div className="od-container">
                <div className="od-header-card">
                  <div className="od-header-content">
                    <h1>Loading digital product...</h1>
                    <p>Please wait while product details are being loaded.</p>
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
      <div className={`user-page order-deliverables-page ${theme} min-h-screen relative overflow-hidden`}>
        <UserNavbar toggleSidebar={() => setSidebarOpen((p) => !p)} theme={theme} />
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
              <div className="od-container">
                <div className="od-header-card">
                  <div className="od-header-content">
                    <h1>Unable to load product</h1>
                    <p>{error || "Product not found."}</p>
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
    <div className={`user-page order-deliverables-page ${theme} min-h-screen relative overflow-hidden`}>
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
            <div className="od-container">
              <div className="od-header-card">
                <div className="od-header-content">
                  <h1>{listing.title || "Digital Product"}</h1>
                  <p>
                    {listing.short_description ||
                      "Access your delivered files, notes, and listing details."}
                  </p>
                </div>

                <button
                  className="od-download-all-btn"
                  onClick={handleDownloadAll}
                  disabled={deliverables.length === 0}
                >
                  Download all
                </button>
              </div>

              <div className="od-info-grid">
                <div className="od-info-card">
                  <div className="od-info-icon">
                    <Package size={32} />
                  </div>
                  <div className="od-info-text">
                    <span className="od-info-label">Username</span>
                    <span className="od-info-value">{listing.username || "—"}</span>
                  </div>
                </div>

                <div className="od-info-card">
                  <div className="od-info-icon">
                    <Package size={32} />
                  </div>
                  <div className="od-info-text">
                    <span className="od-info-label">Published</span>
                    <span className="od-info-value">
                      {formatDate(listing.created_at)}
                    </span>
                  </div>
                </div>

                <div className="od-info-card">
                  <div className="od-info-icon lime">
                    <DollarSign size={32} />
                  </div>
                  <div className="od-info-text">
                    <span className="od-info-label">{priceInfo.label}</span>
                    <span className="od-info-value">
                      {formatPrice(priceInfo.value)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="od-deliverables-section">
                <h2 className="od-section-title">Delivered Files</h2>

                <div className="od-files-list-container">
                  <div className="od-files-list">
                    {deliverables.length === 0 ? (
                      <div className="od-file-item">
                        <div className="od-file-info">
                          <h3>No deliverables uploaded yet</h3>
                          <div className="od-file-meta">
                            <span>Files will appear here when they are added.</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      deliverables.map((item) => (
                        <div key={item.id} className="od-file-item">
                          <div className="od-file-info">
                            <h3>{item.title}</h3>
                            <div className="od-file-meta">
                              <span>Updated {item.updated}</span>
                              <span className="od-meta-dot">•</span>
                              <span>{item.size}</span>
                            </div>
                            <div className="od-file-tags">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className={`od-tag ${String(tag).toLowerCase()}`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="od-file-actions">
                            <button
                              className="od-action-btn primary"
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
                              className="od-action-btn secondary"
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
                    )}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "40px" }}>
                <DetailedTeamCard />
              </div>

              <div className="od-faq-section">
                <div className="od-review-header">
                  <h2>Frequently Asked Questions</h2>
                  <div className="od-header-line"></div>
                </div>

                <div className="od-faq-list">
                  {faqData.length === 0 ? (
                    <div className="od-faq-item active">
                      <div className="od-faq-question">
                        <span>No FAQs added yet</span>
                      </div>
                    </div>
                  ) : (
                    faqData.map((faq) => (
                      <div
                        key={faq.id}
                        className={`od-faq-item ${activeFaq === faq.id ? "active" : ""}`}
                      >
                        <div
                          className="od-faq-question"
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
                          <div className="od-faq-answer">
                            <p>{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="od-review-section">
                <div className="od-review-header">
                  <h2>Review</h2>
                  <div className="od-header-line"></div>
                </div>

                <div className="od-review-card">
                  <div className="od-review-content">
                    <p className="od-review-text">
                      {listing.about ||
                        "No detailed product description available yet."}
                    </p>
                    <div className="od-review-footer">
                      <div className="od-stars">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={20}
                            fill={theme === "dark" ? "#CEFF1B" : "#FFE100"}
                            stroke={theme === "dark" ? "#CEFF1B" : "#FFE100"}
                          />
                        ))}
                      </div>
                      <button className="od-post-btn">Post</button>
                    </div>
                  </div>
                </div>
              </div>

              <OrderDetailsSection prefix="od" />
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

export default ProductDeliverables;