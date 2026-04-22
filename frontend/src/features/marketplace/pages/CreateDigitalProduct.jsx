import React, { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateDigitalProduct.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import MyPortfolio from "../../dashboard/components/UserProfile/MyPortfolio";
import "../../../Darkuser.css";
import "../../onboarding/components/OnboardingSelect.css";
import {
  createListing,
  updateListing,
  getListingByUsername,
  getListingDropdowns,
} from "../api/listingApi";
import DeliverablesSection from "../components/DeliverablesSection";
import Swal from "sweetalert2";

const LISTING_TYPE = "digital_product";
const LISTING_TYPE_SLUG = "digital-product";
const STANDARD_FORMATS = [
  "PDF",
  "JPG",
  "JPEG",
  "PSD",
  "ZIP",
  "MP4",
  "MOV",
  "PNG",
  "SVG",
  "FIG",
  "NOTION",
  "DOCX",
  "XLSX",
];

export default function CreateDigitalProduct({
  mode = "create",
  theme,
  setTheme,
}) {
  const navigate = useNavigate();
  const { listingusername } = useParams();
  const isEditMode = mode === "edit";

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [isMetaLoading, setIsMetaLoading] = useState(false);
  const [isLoadingListing, setIsLoadingListing] = useState(false);
  const [editingListingId, setEditingListingId] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");
  const [uploadStep, setUploadStep] = useState(null);
  const isModalOpen = uploadStep === "grid" || uploadStep === "success";

  const [savingStatus, setSavingStatus] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [aiPowered, setAiPowered] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [deliveryFormatInput, setDeliveryFormatInput] = useState("");
  const [includedInput, setIncludedInput] = useState("");
  const [toolsInput, setToolsInput] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "",
    subCategory: "",
    shortDescription: "",
    // about: "",
    productType: "",
    price: "",
  });

  const [digitalDetails, setDigitalDetails] = useState({
    included: [],
    deliveryFormat: [],
    toolsUsed: [],
  });

  const [coverImages, setCoverImages] = useState([]);
  const [coverFiles, setCoverFiles] = useState([]);
  const [coverSlideIdx, setCoverSlideIdx] = useState(0);

  const [mainDeliverables, setMainDeliverables] = useState([]);
  const [notes, setNotes] = useState([]);
  const [links, setLinks] = useState([""]);
  const [faqs, setFaqs] = useState([{ q: "", a: "" }]);

  const [portfolioProjects, setPortfolioProjects] = useState([]);

  const deliverableFileRef = useRef(null);
  const coverFileRef = useRef(null);

  React.useEffect(() => {
    setSidebarOpen(true);
    setShowSettings(false);
  }, []);

  const handleSectionChange = (id) => {
    setActiveSetting(id);
  };

  const setFormField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const normalizeTextArray = (value) => {
    if (!Array.isArray(value)) return [];
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  };

  const normalizeDeliveryFormat = (value) => {
    if (Array.isArray(value)) {
      return value.map((item) => String(item || "").trim()).filter(Boolean);
    }

    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    return [];
  };

  const loadCategories = async () => {
    try {
      setIsMetaLoading(true);
      const res = await getListingDropdowns(LISTING_TYPE_SLUG, {
        type: "categories",
      });
      setCategories(Array.isArray(res?.categories) ? res.categories : []);
    } catch (error) {
      console.error("Failed to load categories", error);
      setCategories([]);
    } finally {
      setIsMetaLoading(false);
    }
  };

  const loadSubCategories = async (categoryName) => {
    if (!categoryName) {
      setSubCategories([]);
      return;
    }

    try {
      const res = await getListingDropdowns(LISTING_TYPE_SLUG, {
        type: "sub_categories",
        category: categoryName,
      });
      setSubCategories(Array.isArray(res?.sub_categories) ? res.sub_categories : []);
    } catch (error) {
      console.error("Failed to load sub categories", error);
      setSubCategories([]);
    }
  };

  const loadProductTypes = async (categoryName, subCategoryName) => {
    if (!categoryName || !subCategoryName) {
      setProductTypes([]);
      return;
    }

    try {
      const res = await getListingDropdowns(LISTING_TYPE_SLUG, {
        type: "product_types",
        category: categoryName,
        sub_category: subCategoryName,
      });
      setProductTypes(Array.isArray(res?.product_types) ? res.product_types : []);
    } catch (error) {
      console.error("Failed to load product types", error);
      setProductTypes([]);
    }
  };

  React.useEffect(() => {
    loadCategories();
  }, []);

  React.useEffect(() => {
    loadSubCategories(form.category);
  }, [form.category]);

  React.useEffect(() => {
    loadProductTypes(form.category, form.subCategory);
  }, [form.category, form.subCategory]);

  const addTag = () => {
    const clean = tagInput.trim();
    if (!clean) return;
    if (tags.some((t) => t.toLowerCase() === clean.toLowerCase())) {
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, clean]);
    setTagInput("");
  };

  const removeTag = (idx) =>
    setTags((prev) => prev.filter((_, i) => i !== idx));

  const onTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const addIncluded = () => {
    const value = includedInput.trim();
    if (!value) return;

    setDigitalDetails((prev) => {
      if (prev.included.some((x) => x.toLowerCase() === value.toLowerCase())) {
        return prev;
      }
      return {
        ...prev,
        included: [...prev.included, value],
      };
    });

    setIncludedInput("");
  };

  const removeIncluded = (idx) => {
    setDigitalDetails((prev) => ({
      ...prev,
      included: prev.included.filter((_, i) => i !== idx),
    }));
  };

  const addTool = () => {
    const value = toolsInput.trim();
    if (!value) return;

    setDigitalDetails((prev) => {
      if (prev.toolsUsed.some((x) => x.toLowerCase() === value.toLowerCase())) {
        return prev;
      }
      if (prev.toolsUsed.length >= 10) return prev;

      return {
        ...prev,
        toolsUsed: [...prev.toolsUsed, value],
      };
    });

    setToolsInput("");
  };

  const removeTool = (idx) => {
    setDigitalDetails((prev) => ({
      ...prev,
      toolsUsed: prev.toolsUsed.filter((_, i) => i !== idx),
    }));
  };

  const addDeliveryFormat = (forcedValue = null) => {
    const value = String(forcedValue ?? deliveryFormatInput).trim();
    if (!value) return;

    setDigitalDetails((prev) => {
      if (
        prev.deliveryFormat.some((x) => x.toLowerCase() === value.toLowerCase())
      ) {
        return prev;
      }

      return {
        ...prev,
        deliveryFormat: [...prev.deliveryFormat, value],
      };
    });

    if (!forcedValue) setDeliveryFormatInput("");
  };

  const removeDeliveryFormat = (idx) => {
    setDigitalDetails((prev) => ({
      ...prev,
      deliveryFormat: prev.deliveryFormat.filter((_, i) => i !== idx),
    }));
  };

  const handleMainDeliverablesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setMainDeliverables((prev) => [...prev, ...files]);
    setNotes((prev) => [...prev, ...Array(files.length).fill("")]);

    if (e.target) e.target.value = "";
  };

  const removeDeliverable = (idx) => {
    setMainDeliverables((prev) => prev.filter((_, i) => i !== idx));
    setNotes((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateNoteField = (idx, value) => {
    setNotes((prev) => prev.map((item, i) => (i === idx ? value : item)));
  };

  const addLinkField = () => setLinks((prev) => [...prev, ""]);
  const updateLinkField = (idx, value) =>
    setLinks((prev) => prev.map((item, i) => (i === idx ? value : item)));
  const removeLinkField = (idx) =>
    setLinks((prev) => prev.filter((_, i) => i !== idx));

  const addFaq = () => setFaqs((prev) => [...prev, { q: "", a: "" }]);

  const updateFaq = (idx, key, value) => {
    setFaqs((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [key]: value } : item))
    );
  };

  const removeFaq = (idx) => {
    if (faqs.length === 1) return;
    setFaqs((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files || []);
    if (!files.length) return;

    setMainDeliverables((prev) => [...prev, ...files]);
    setNotes((prev) => [...prev, ...Array(files.length).fill("")]);
  };

  const applyCoverFiles = async (files, append = false) => {
    const fileList = Array.from(files || []);
    if (!fileList.length) return;

    const mergedFiles = append ? [...coverFiles, ...fileList] : fileList;
    const limitedFiles = mergedFiles.slice(0, 9);

    const previews = await Promise.all(
      limitedFiles.map(
        (file) =>
          new Promise((resolve) => {
            if (!(file instanceof File)) {
              resolve(file);
              return;
            }
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      )
    );

    setCoverFiles(limitedFiles);
    setCoverImages(previews);
    setCoverSlideIdx(0);
  };

  const removeCoverImage = (idx) => {
    setCoverImages((prev) => prev.filter((_, i) => i !== idx));
    setCoverFiles((prev) => prev.filter((_, i) => i !== idx));
    setCoverSlideIdx((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const loadListingForEdit = async () => {
    if (!isEditMode || !listingusername) return;

    try {
      setIsLoadingListing(true);

      const res = await getListingByUsername(listingusername);
      const listing = res?.listing || res?.data?.listing || res?.data || res;

      if (!listing) return;

      setEditingListingId(listing.id || null);

      setForm({
        title: listing.title || "",
        category: listing.category || "",
        subCategory: listing.sub_category || "",
        shortDescription: listing.short_description || "",
        // about: listing.about || "",
        productType:
          listing?.details?.product_type || listing?.product_type || "",
        price:
          listing?.details?.price !== undefined &&
            listing?.details?.price !== null
            ? String(listing.details.price)
            : listing?.price !== undefined && listing?.price !== null
              ? String(listing.price)
              : "",
      });

      setAiPowered(!!listing.ai_powered);
      setTags(Array.isArray(listing.tags) ? listing.tags : []);

      setFaqs(
        Array.isArray(listing.faqs) && listing.faqs.length
          ? listing.faqs.map((item) => ({
            q: item.q || item.question || "",
            a: item.a || item.answer || "",
          }))
          : [{ q: "", a: "" }]
      );

      setLinks(
        Array.isArray(listing.links) && listing.links.length
          ? listing.links
          : [""]
      );

      if (Array.isArray(listing.deliverables) && listing.deliverables.length) {
        setMainDeliverables(
          listing.deliverables.map((d) => ({
            file: null,
            notes: d.notes || "",
            existing_file_name: d.file_name || d.name || "",
            existing_file_url: d.file_url || d.url || "",
            name: d.file_name || d.name,
            size: d.file_size || d.size,
          }))
        );
        setNotes(listing.deliverables.map((item) => item.notes || ""));
      } else {
        setMainDeliverables([]);
        setNotes([]);
      }

      if (Array.isArray(listing.gallery) && listing.gallery.length > 0) {
        setCoverImages(listing.gallery);
        setCoverFiles([]);
      } else if (listing.cover_media_url || listing.cover_media_path) {
        setCoverImages([listing.cover_media_url || listing.cover_media_path]);
        setCoverFiles([]);
      } else {
        setCoverImages([]);
        setCoverFiles([]);
      }

      const tools = Array.isArray(listing?.tools)
        ? listing.tools
        : Array.isArray(listing?.details?.tools)
          ? listing.details.tools
          : [];

      const included = Array.isArray(listing?.details?.included)
        ? listing.details.included
        : [];

      const deliveryFormat = normalizeDeliveryFormat(
        listing?.details?.delivery_format
      );

      setDigitalDetails({
        included: normalizeTextArray(included),
        deliveryFormat,
        toolsUsed: normalizeTextArray(tools),
      });

      setPortfolioProjects(
        Array.isArray(listing.portfolio_projects)
          ? listing.portfolio_projects
          : []
      );
    } catch (error) {
      console.error("Failed to load listing", error);
      Swal.fire({
        icon: "error",
        title: "Load failed",
        text: error?.message || "Failed to load listing details.",
      });
    } finally {
      setIsLoadingListing(false);
    }
  };

  React.useEffect(() => {
    loadListingForEdit();
  }, [isEditMode, listingusername]);

  const buildPayload = (status = "published") => {
    return {
      listing_type: LISTING_TYPE,
      status,
      title: form.title.trim(),
      category: form.category || "",
      sub_category: form.subCategory || "",
      short_description: form.shortDescription || "",
      // about: form.about || "",
      ai_powered: aiPowered,
      cover_files: coverFiles.length ? coverFiles : null,
      existing_cover_urls: coverImages.filter(
        (img) => typeof img === "string" && !img.startsWith("data:")
      ),
      tags: tags.filter(Boolean),
      faqs: faqs
        .map((item) => ({
          q: item.q?.trim() || "",
          a: item.a?.trim() || "",
        }))
        .filter((item) => item.q || item.a),
      links: links.map((item) => item.trim()).filter(Boolean),
      deliverables: mainDeliverables.map((d, index) => ({
        file: d instanceof File ? d : d?.file instanceof File ? d.file : null,
        notes:
          notes[index] || (typeof d === "object" ? d.notes : "") || "",
        existing_file_url: d.existing_file_url || d.file_url || "",
      })),
      details: {
        product_type: form.productType || "",
        price: form.price || "",
        included: digitalDetails.included.filter(Boolean),
        delivery_format: digitalDetails.deliveryFormat.join(", "),
        tools: digitalDetails.toolsUsed.filter(Boolean),
      },
      portfolio_projects: portfolioProjects,
    };
  };

  const handleSubmit = async (status = "published") => {
    if (!form.title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Title is required",
        text: "Please enter the product title.",
        background: "#0b0b0b",
        color: "#ffffff",
        iconColor: "#CEFF1B",
        confirmButtonColor: "#CEFF1B",
        confirmButtonText:
          "<span style='color:#000;font-weight:700'>OK</span>",
      });
      return;
    }

    try {
      setSavingStatus(status);

      const payload = buildPayload(status);

      const res = isEditMode
        ? await updateListing(listingusername, payload)
        : await createListing(payload);

      Swal.fire({
        icon: "success",
        title:
          status === "draft"
            ? "Draft Saved"
            : isEditMode
              ? "Digital Product Updated"
              : "Digital Product Created",
        text:
          status === "draft"
            ? "Your listing has been saved as a draft."
            : res?.message ||
            (isEditMode
              ? "Listing updated successfully."
              : "Your product is now live."),
        background: "#0b0b0b",
        color: "#ffffff",
        iconColor: "#CEFF1B",
        confirmButtonColor: "#CEFF1B",
        confirmButtonText: `<span style="color:#000;font-weight:700">${status === "draft" ? "OK" : "Go to My Listings"
          }</span>`,
      }).then((result) => {
        if (result.isConfirmed && status !== "draft") {
          navigate("/my-listings");
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: isEditMode ? "Update failed" : "Save failed",
        text: error?.message || "Something went wrong.",
        background: "#0b0b0b",
        color: "#ffffff",
        iconColor: "#ff4444",
        confirmButtonColor: "#CEFF1B",
        confirmButtonText:
          "<span style='color:#000;font-weight:700'>Try Again</span>",
      });
    } finally {
      setSavingStatus(null);
    }
  };

  return (
    <div
      className={`create-service-page user-page ${theme} min-h-screen relative overflow-hidden`}
    >
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((p) => !p)}
        isSidebarOpen={sidebarOpen}
        theme={theme}
      />

      <div
        className={`pt-[85px] flex relative z-10 transition-all duration-300 ${isModalOpen ? "blur-sm pointer-events-none select-none" : ""
          }`}
      >
        <Sidebar
          expanded={sidebarOpen}
          setExpanded={setSidebarOpen}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          activeSetting={activeSetting}
          onSectionChange={handleSectionChange}
          theme={theme}
          setTheme={setTheme}
        />

        <div className="relative flex-1 min-w-5 overflow-hidden">
          <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]">
            <div className="create-service-container">
              <div className="csl-stack">
                <div className="csl-card">
                  <div className="csl-header">
                    <div>
                      <h1 className="csl-title">
                        {isEditMode
                          ? "Edit Digital Product Listing"
                          : "Create Digital Products Listing"}
                      </h1>
                      <p className="csl-subtitle">
                        {isEditMode
                          ? "Update your listing details"
                          : "Fill out each section"}
                      </p>
                    </div>

                    <div className="csl-ai">
                      <span className={`csl-ai-pill ${aiPowered ? "active" : ""}`}>
                        Ai Powered
                      </span>
                      <label className="csl-switch">
                        <input
                          type="checkbox"
                          checked={aiPowered}
                          onChange={(e) => setAiPowered(e.target.checked)}
                        />
                        <span className="csl-slider" />
                      </label>
                    </div>
                  </div>

                  {isLoadingListing ? (
                    <div className="mb-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
                      Loading listing details...
                    </div>
                  ) : null}

                  <h2 className="csl-section">Basic Details</h2>

                  <div className="form-group full-width">
                    <div className="csl-field">
                      <label className="csl-label csl-titleLabel">
                        Product Title
                      </label>
                      <input
                        className="csl-input"
                        placeholder="eg., Professional Logo Design"
                        value={form.title}
                        onChange={(e) => setFormField("title", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="csl-field mt-2">
                    <label className="csl-label">Product Description</label>
                    <textarea
                      className="csl-textarea"
                      placeholder="Product Description"
                      value={form.shortDescription}
                      onChange={(e) =>
                        setFormField("shortDescription", e.target.value)
                      }
                    />
                  </div>

                  <div className="csl-grid2">
                    <div className="csl-field">
                      <label className="csl-label csl-titleLabel">Category</label>
                      <div className="csl-selectWrap">
                        <CustomSelect
                          value={form.category}
                          onChange={(val) =>
                            setForm((p) => ({
                              ...p,
                              category: val,
                              subCategory: "",
                              productType: "",
                            }))
                          }
                          options={categories}
                          placeholder={
                            isMetaLoading ? "Loading categories..." : "Select category"
                          }
                        />
                      </div>
                    </div>

                    <div className="csl-field">
                      <label className="csl-label csl-titleLabel">
                        Sub Category
                      </label>
                      <div className="csl-selectWrap">
                        <CustomSelect
                          value={form.subCategory}
                          onChange={(val) =>
                            setForm((p) => ({
                              ...p,
                              subCategory: val,
                              productType: "",
                            }))
                          }
                          options={subCategories}
                          placeholder={
                            !form.category
                              ? "Select category first"
                              : "Select sub category"
                          }
                          disabled={!form.category}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="csl-grid2">
                    <div className="csl-field">
                      <label className="csl-label csl-titleLabel">
                        Product Type
                      </label>
                      <div className="csl-selectWrap">
                        <CustomSelect
                          value={form.productType}
                          onChange={(val) => setFormField("productType", val)}
                          options={productTypes}
                          placeholder={
                            !form.subCategory
                              ? "Select sub category first"
                              : "Select product type"
                          }
                          disabled={!form.subCategory}
                        />
                      </div>
                    </div>

                    <div className="csl-field">
                      <label className="csl-label csl-titleLabel">Price</label>
                      <input
                        className="csl-input"
                        placeholder="Price"
                        value={form.price}
                        onChange={(e) => setFormField("price", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="csl-field">
                    <label className="csl-label mt-4">Tags</label>
                    <div className="csl-tagsRow">
                      <input
                        className="csl-input csl-tagInput"
                        placeholder="type a tag and press Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={onTagKeyDown}
                      />
                      <button type="button" className="csl-addBtn" onClick={addTag}>
                        + Add
                      </button>
                    </div>

                    {tags.length > 0 ? (
                      <div className="csl-chips">
                        {tags.map((t, idx) => (
                          <div className="csl-chip" key={`${t}-${idx}`}>
                            <span className="csl-chipText">{t}</span>
                            <button
                              type="button"
                              className="csl-chipX"
                              onClick={() => removeTag(idx)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="sp-field mt-4">
                    <label className="sp-label">Tools used</label>
                    <div className="sp-toolsRow">
                      <input
                        className="sp-input"
                        value={toolsInput}
                        onChange={(e) => setToolsInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTool();
                          }
                        }}
                        placeholder="eg., Figma, Notion"
                      />
                      <button type="button" className="sp-addBtnRight" onClick={addTool}>
                        + Add
                      </button>
                    </div>
                    {digitalDetails.toolsUsed.length > 0 ? (
                      <div className="sp-chipRow">
                        {digitalDetails.toolsUsed.map((x, idx) => (
                          <div className="sp-chip" key={`${x}-${idx}`}>
                            {x}
                            <button
                              className="sp-chipX"
                              type="button"
                              onClick={() => removeTool(idx)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="sp-field mt-4">
                    <label className="sp-label">What's included</label>
                    <div className="sp-toolsRow">
                      <input
                        className="sp-input"
                        value={includedInput}
                        onChange={(e) => setIncludedInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addIncluded();
                          }
                        }}
                        placeholder="eg., Source file, Commercial License"
                      />
                      <button
                        type="button"
                        className="sp-addBtnRight"
                        onClick={addIncluded}
                      >
                        + Add
                      </button>
                    </div>

                    {digitalDetails.included.length > 0 ? (
                      <ul className="included-bullet-list">
                        {digitalDetails.included.map((x, idx) => (
                          <li key={`${x}-${idx}`} className="included-bullet-item">
                            <span className="included-bullet-dot">•</span>
                            <span className="included-bullet-text">{x}</span>
                            <button
                              type="button"
                              className="included-bullet-del"
                              onClick={() => removeIncluded(idx)}
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>

                  <div className="sp-field mt-4">
                    <label className="sp-label">Delivery format</label>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {STANDARD_FORMATS.map((item) => (
                        <button
                          key={item}
                          type="button"
                          className="px-3 py-2 rounded-lg border border-[#CEFF1B] text-sm"
                          onClick={() => addDeliveryFormat(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>

                    <div className="sp-toolsRow">
                      <input
                        className="sp-input"
                        value={deliveryFormatInput}
                        onChange={(e) => setDeliveryFormatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addDeliveryFormat();
                          }
                        }}
                        placeholder="Add custom format"
                      />
                      <button
                        type="button"
                        className="sp-addBtnRight"
                        onClick={() => addDeliveryFormat()}
                      >
                        + Add
                      </button>
                    </div>

                    {digitalDetails.deliveryFormat.length > 0 ? (
                      <div className="sp-chipRow">
                        {digitalDetails.deliveryFormat.map((x, idx) => (
                          <div className="sp-chip" key={`${x}-${idx}`}>
                            {x}
                            <button
                              className="sp-chipX"
                              type="button"
                              onClick={() => removeDeliveryFormat(idx)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="am-card">
                  <h3 className="am-title" style={{ marginTop: 0 }}>Cover Pages</h3>
                  <p className="csl-label" style={{ marginBottom: "8px", opacity: 0.7 }}>
                    Upload multiple cover images. Existing images stay unless you remove them.
                  </p>

                  <div className="am-uploadBox">
                    {coverImages.length > 0 ? (
                      <>
                        <div
                          className="am-cover-slider"
                          style={{ position: "relative", width: "100%" }}
                        >
                          <img
                            src={coverImages[coverSlideIdx]}
                            alt={`cover ${coverSlideIdx + 1}`}
                            className="am-preview"
                            style={{ display: "block" }}
                          />

                          {coverImages.length > 1 ? (
                            <>
                              <button
                                type="button"
                                className="am-slide-btn left"
                                onClick={() =>
                                  setCoverSlideIdx(
                                    (p) => (p - 1 + coverImages.length) % coverImages.length
                                  )
                                }
                              >
                                &#8249;
                              </button>
                              <button
                                type="button"
                                className="am-slide-btn right"
                                onClick={() =>
                                  setCoverSlideIdx((p) => (p + 1) % coverImages.length)
                                }
                              >
                                &#8250;
                              </button>
                            </>
                          ) : null}
                        </div>

                        <div className="am-thumb-strip">
                          {coverImages.map((img, i) => (
                            <div key={i} className="relative">
                              <img
                                src={img}
                                alt={`thumb ${i + 1}`}
                                className={`am-thumb ${i === coverSlideIdx ? "active" : ""}`}
                                onClick={() => setCoverSlideIdx(i)}
                              />
                              <button
                                type="button"
                                className="am-remove-slot"
                                onClick={() => removeCoverImage(i)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2 mt-3">
                          <button
                            type="button"
                            className="am-changeBtn"
                            onClick={() => coverFileRef.current?.click()}
                          >
                            Change / Add More
                          </button>
                          <input
                            ref={coverFileRef}
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => applyCoverFiles(e.target.files, true)}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="am-placeholder">
                        <button
                          className="am-uploadBtn"
                          onClick={() => setUploadStep("grid")}
                        >
                          Upload Photo
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="csl-portfolio-wrap">
                  <MyPortfolio
                    mode="listing"
                    listingType="digital_product"
                    listingId={isEditMode ? editingListingId : null}
                    onChange={setPortfolioProjects}
                  />
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={isDragging ? "ring-2 ring-[#CEFF1B] rounded-2xl" : ""}
                >
                  <DeliverablesSection
                    deliverables={mainDeliverables.map((d, idx) => ({
                      file: d instanceof File ? d : d?.file instanceof File ? d.file : null,
                      name: d?.file_name || d?.name || "",
                      size: d?.file_size || d?.size || "",
                      notes: notes[idx] || (typeof d === "object" ? d?.notes : "") || "",
                    }))}
                    onAddDeliverable={(file) => {
                      setMainDeliverables((prev) => [...prev, file]);
                      setNotes((prev) => [...prev, ""]);
                    }}
                    onRemoveDeliverable={removeDeliverable}
                    onUpdateDeliverableNotes={updateNoteField}
                    onUpdateDeliverableFile={(idx, file) => {
                      setMainDeliverables((prev) =>
                        prev.map((item, i) => (i === idx ? file : item))
                      );
                    }}
                    links={links}
                    onAddLink={addLinkField}
                    onRemoveLink={removeLinkField}
                    onUpdateLink={updateLinkField}
                  />
                </div>

                <input
                  ref={deliverableFileRef}
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleMainDeliverablesChange}
                />

                <div className="faq-wrap">
                  <h3 className="faq-title">FAQs</h3>

                  {faqs.map((item, idx) => (
                    <div className="faq-card" key={idx}>
                      <div className="faq-card-top">
                        <div className="faq-number">FAQ #{idx + 1}</div>

                        <button
                          type="button"
                          className="faq-trash"
                          onClick={() => removeFaq(idx)}
                        >
                          ×
                        </button>
                      </div>

                      <div className="faq-field">
                        <label className="faq-label">Question</label>
                        <input
                          className="faq-input"
                          placeholder="Type your question"
                          value={item.q}
                          onChange={(e) => updateFaq(idx, "q", e.target.value)}
                        />
                      </div>

                      <div className="faq-field">
                        <label className="faq-label">Answer</label>
                        <input
                          className="faq-input"
                          placeholder="Type the answer"
                          value={item.a}
                          onChange={(e) => updateFaq(idx, "a", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}

                  <button type="button" className="faq-add" onClick={addFaq}>
                    + Add FAQ
                  </button>
                </div>

                <div className="faq-actions">
                  <button
                    type="button"
                    className={`faq-draft${savingStatus === "draft" ? " saving" : ""}`}
                    onClick={() => handleSubmit("draft")}
                    disabled={savingStatus !== null}
                  >
                    {savingStatus === "draft" ? "Saving draft..." : "Save as Draft"}
                  </button>

                  <button
                    type="button"
                    className={`faq-save${savingStatus === "published" ? " saving" : ""}`}
                    onClick={() => handleSubmit("published")}
                    disabled={savingStatus !== null}
                  >
                    {savingStatus === "published"
                      ? isEditMode
                        ? "Updating..."
                        : "Publishing..."
                      : isEditMode
                        ? "Update"
                        : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen ? (
        <>
          <div
            className="fixed inset-0 z-[900] bg-black/30 backdrop-blur-sm"
            onClick={() => setUploadStep(null)}
          />
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Upload cover images</h3>
                <button type="button" onClick={() => setUploadStep(null)}>
                  ×
                </button>
              </div>

              <div
                className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer"
                onClick={() => coverFileRef.current?.click()}
              >
                <p className="text-gray-600">Click here to select multiple images</p>
                <input
                  ref={coverFileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    applyCoverFiles(e.target.files, false);
                    setUploadStep("success");
                  }}
                />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function CustomSelect({ value, onChange, options, placeholder, disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`onboarding-custom-select size-phone ${open ? "active" : ""} ${disabled ? "opacity-50 pointer-events-none" : ""
        }`}
      ref={ref}
    >
      <div
        className={`onboarding-selected-option ${open ? "open" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) setOpen(!open);
        }}
      >
        <span className={!value ? "opacity-70" : ""}>{value || placeholder}</span>
        <span className="onboarding-arrow">▼</span>
      </div>
      {open ? (
        <ul className="onboarding-options-list dark:bg-[#1E1E1E]">
          {options.map((opt, index) => {
            const label = opt?.name || opt;
            return (
              <li
                key={`${label}-${index}`}
                className={value === label ? "active" : ""}
                onClick={() => {
                  onChange(label);
                  setOpen(false);
                }}
              >
                {label}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}