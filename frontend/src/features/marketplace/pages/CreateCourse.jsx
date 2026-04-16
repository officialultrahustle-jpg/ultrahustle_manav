import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./CreateCourse.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "../../../Darkuser.css";
import "../../onboarding/components/OnboardingSelect.css";
// import FAQSection from "../components/FAQSection";
import PreviewVideo from "../components/PreviewVideo";
import CoverSection from "../components/CoverSection";
import DeliverablesSection from "../components/DeliverablesSection";
import LessonSection from "../components/LessonSection";
import {
  createListing,
  getListingByUsername,
  updateListing,
  getListingDropdowns,
  getLanguages,
} from "../api/listingApi";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const LISTING_TYPE = "course";
const LISTING_TYPE_SLUG = "course";

export default function CreateCourse({
  theme,
  setTheme,
  mode = "create",
}) {
  const navigate = useNavigate();
  const { username } = useParams();
  const isEditMode = mode === "edit";

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");

  const [uploadStep, setUploadStep] = useState(null);
  const isModalOpen = uploadStep === "grid" || uploadStep === "success";

  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [isMetaLoading, setIsMetaLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    subCategory: "",
    productType: "",
    price: "",
    shortDescription: "",
    prerequisites: "",
  });

  const [toolsInput, setToolsInput] = useState("");
  const [tools, setTools] = useState([]);

  const [includedInput, setIncludedInput] = useState("");
  const [courseIncluded, setCourseIncluded] = useState([]);

  const [learningInput, setLearningInput] = useState("");
  const [learningPoints, setLearningPoints] = useState([]);

  const [languages, setLanguages] = useState([]);

  const [previewVideo, setPreviewVideo] = useState(null);
  const [previewVideoFile, setPreviewVideoFile] = useState(null);

  const [lessons, setLessons] = useState([
    { title: "", description: "", media: null },
    { title: "", description: "", media: null },
    { title: "", description: "", media: null },
  ]);

  const [cover, setCover] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const [faqs, setFaqs] = useState([{ q: "", a: "" }]);

  const [resources, setResources] = useState([{ file: null, notes: "" }]);
  const [links, setLinks] = useState([""]);

  React.useEffect(() => {
    if (isModalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    const onKey = (e) => {
      if (e.key === "Escape") setUploadStep(null);
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  React.useEffect(() => {
    setSidebarOpen(true);
    setShowSettings(false);
  }, []);

  const handleSectionChange = (id) => {
    setActiveSetting(id);
  };

  const setFormField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const loadCategories = async () => {
    try {
      setIsMetaLoading(true);
      const res = await getListingDropdowns(LISTING_TYPE_SLUG, {
        type: "categories",
      });
      setCategories(Array.isArray(res?.categories) ? res.categories : []);
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
      setProductTypes([]);
    }
  };

  const loadLanguages = async () => {
    try {
      const res = await getLanguages();
      const items = Array.isArray(res?.languages) ? res.languages : [];
      setLanguageOptions(items.map((item) => item.value).filter(Boolean));
    } catch (e) {
      setLanguageOptions([]);
    }
  };

  React.useEffect(() => {
    loadCategories();
    loadLanguages();
  }, []);

  React.useEffect(() => {
    loadSubCategories(form.category);
  }, [form.category]);

  React.useEffect(() => {
    loadProductTypes(form.category, form.subCategory);
  }, [form.category, form.subCategory]);

  const addSimpleItem = (input, setInput, list, setList) => {
    const v = String(input || "").trim();
    if (!v) return;
    if (list.some((x) => String(x).toLowerCase() === v.toLowerCase())) {
      setInput("");
      return;
    }
    setList([...list, v]);
    setInput("");
  };

  const removeSimpleItem = (idx, list, setList) => {
    setList(list.filter((_, i) => i !== idx));
  };

  const addLesson = () =>
    setLessons([...lessons, { title: "", description: "", media: null }]);

  const removeLesson = (idx) =>
    setLessons(lessons.filter((_, i) => i !== idx));

  const updateLesson = (idx, key, value) => {
    setLessons(lessons.map((l, i) => (i === idx ? { ...l, [key]: value } : l)));
  };

  const uploadLessonMedia = (idx) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";

    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        updateLesson(idx, "media", {
          preview: reader.result,
          file,
          type: file.type?.startsWith("video/") ? "video" : "image",
        });
      };
      reader.readAsDataURL(file);
    };

    input.click();
  };

  const handleCoverFileSelect = (file) => {
    if (!file) return;
    setCoverFile(file);

    const reader = new FileReader();
    reader.onload = () => setCover(reader.result);
    reader.readAsDataURL(file);
  };

  const addFaq = () => setFaqs([...faqs, { q: "", a: "" }]);

  const updateFaq = (idx, key, value) => {
    setFaqs(faqs.map((item, i) => (i === idx ? { ...item, [key]: value } : item)));
  };

  const removeFaq = (idx) => {
    if (faqs.length === 1) return;
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const addResource = () => setResources([...resources, { file: null, notes: "" }]);

  const updateResourceNotes = (idx, notes) =>
    setResources(resources.map((d, i) => (i === idx ? { ...d, notes } : d)));

  const updateResourceFile = (idx, file) =>
    setResources(resources.map((d, i) => (i === idx ? { ...d, file } : d)));

  const removeResource = (idx) =>
    setResources(resources.filter((_, i) => i !== idx));

  const addLink = () => setLinks([...links, ""]);
  const updateLink = (idx, value) => setLinks(links.map((l, i) => (i === idx ? value : l)));
  const removeLink = (idx) => setLinks(links.filter((_, i) => i !== idx));

  React.useEffect(() => {
    const loadListing = async () => {
      if (!isEditMode || !username) {
        setInitialLoading(false);
        return;
      }

      try {
        setInitialLoading(true);

        const res = await getListingByUsername(username);
        const item = res?.listing || null;

        if (!item) {
          Swal.fire({ icon: "error", title: "Not found", text: "Listing not found." });
          return;
        }

        if (item.listing_type !== LISTING_TYPE) {
          Swal.fire({ icon: "error", title: "Invalid listing", text: "This listing is not a course." });
          return;
        }

        setForm({
          title: item.title || "",
          category: item.category || "",
          subCategory: item.sub_category || "",
          productType: item?.details?.product_type || "",
          price:
            item?.price !== undefined && item?.price !== null
              ? String(item.price)
              : item?.details?.price !== undefined && item?.details?.price !== null
                ? String(item.details.price)
                : "",
          shortDescription: item.short_description || "",
          prerequisites: item.about || item?.details?.prerequisites || "",
        });

        setTools(Array.isArray(item?.tools) ? item.tools : []);
        setCourseIncluded(
          Array.isArray(item?.details?.included) ? item.details.included : []
        );
        setLearningPoints(
          Array.isArray(item?.details?.learning_points) ? item.details.learning_points : []
        );
        setLanguages(
          Array.isArray(item?.details?.languages) ? item.details.languages : []
        );

        setFaqs(
          Array.isArray(item.faqs) && item.faqs.length
            ? item.faqs.map((faq) => ({
                q: faq.q || faq.question || "",
                a: faq.a || faq.answer || "",
              }))
            : [{ q: "", a: "" }]
        );

        setLinks(
          Array.isArray(item.links) && item.links.length ? item.links : [""]
        );

        setResources(
          Array.isArray(item.deliverables) && item.deliverables.length
            ? item.deliverables.map((d) => ({
                file: null,
                notes: d.notes || "",
                existing_file_name: d.file_name || "",
                existing_file_url: d.file_url || "",
              }))
            : [{ file: null, notes: "" }]
        );

        setLessons(
          Array.isArray(item?.details?.lessons) && item.details.lessons.length
            ? item.details.lessons.map((lesson) => ({
                title: lesson.title || "",
                description: lesson.description || "",
                media: lesson.media_url
                  ? {
                      preview: lesson.media_url,
                      file: null,
                      type: lesson.media_type || null,
                    }
                  : null,
              }))
            : [
                { title: "", description: "", media: null },
                { title: "", description: "", media: null },
                { title: "", description: "", media: null },
              ]
        );

        if (item.cover_media_url || item.cover_media_path) {
          setCover(item.cover_media_url || item.cover_media_path);
        }

        if (item?.details?.preview_video_url) {
          setPreviewVideo(item.details.preview_video_url);
        }
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "Load failed",
          text: e?.message || "Failed to load course.",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    loadListing();
  }, [isEditMode, username]);

  const validateBeforeSave = () => {
    if (!String(form.title || "").trim()) return "Course title is required.";
    if (!String(form.category || "").trim()) return "Category is required.";
    if (!String(form.subCategory || "").trim()) return "Sub category is required.";
    if (!String(form.productType || "").trim()) return "Product type is required.";
    if (!String(form.price || "").trim()) return "Price is required.";
    if (!String(form.shortDescription || "").trim()) return "Short description is required.";
    return "";
  };

  const buildPayload = () => ({
    listing_type: LISTING_TYPE,
    status: "published",
    title: form.title,
    category: form.category,
    sub_category: form.subCategory,
    short_description: form.shortDescription,
    about: form.prerequisites,
    cover_file: coverFile,
    links: links.map((l) => String(l || "").trim()).filter(Boolean),
    faqs: faqs.filter((f) => String(f.q || "").trim() || String(f.a || "").trim()),
    deliverables: resources.filter(
      (d) =>
        d.file ||
        String(d.notes || "").trim() ||
        String(d.existing_file_url || "").trim()
    ),
    details: {
      product_type: form.productType,
      price: form.price,
      tools,
      included: courseIncluded,
      learning_points: learningPoints,
      languages,
      preview_video_file: previewVideoFile,
      lessons: lessons
        .filter(
          (lesson) =>
            String(lesson.title || "").trim() ||
            String(lesson.description || "").trim() ||
            lesson.media?.file ||
            lesson.media?.preview
        )
        .map((lesson) => ({
          title: lesson.title,
          description: lesson.description,
          media_file: lesson.media?.file || null,
          media_type: lesson.media?.type || null,
        })),
    },
  });

  const handleSaveListing = async () => {
    const validationError = validateBeforeSave();
    if (validationError) {
      Swal.fire({
        icon: "warning",
        title: "Validation error",
        text: validationError,
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const res = isEditMode
        ? await updateListing(username, buildPayload())
        : await createListing(buildPayload());

      Swal.fire({
        icon: "success",
        title: isEditMode ? "Course Updated" : "Course Created",
        text:
          res?.message ||
          (isEditMode
            ? "Your course has been updated successfully."
            : "Your course has been created successfully."),
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/my-listings");
        }
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: isEditMode ? "Update failed" : "Save failed",
        text: e?.message || `Failed to ${isEditMode ? "update" : "save"} course.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className={`create-service-page user-page ${theme} min-h-screen relative overflow-hidden`}>
        <UserNavbar
          toggleSidebar={() => setSidebarOpen((p) => !p)}
          isSidebarOpen={sidebarOpen}
          theme={theme}
        />
        <div className="pt-[85px] flex relative z-10">
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
          <div className="relative flex-1 min-w-5 overflow-hidden p-6">
            Loading course...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`create-service-page user-page ${theme} min-h-screen relative overflow-hidden`}>
        <UserNavbar
          toggleSidebar={() => setSidebarOpen((p) => !p)}
          isSidebarOpen={sidebarOpen}
          theme={theme}
        />

        <div
          className={`pt-[85px] flex relative z-10 transition-all duration-300 ${
            isModalOpen ? "blur-sm pointer-events-none select-none" : ""
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
                          {isEditMode ? "Edit Course Listing" : "Create Course Listing"}
                        </h1>
                        <p className="csl-subtitle">
                          {isEditMode ? "Update course details" : "Fill out each section"}
                        </p>
                      </div>
                    </div>

                    <h2 className="csl-section m-0">Course Details</h2>

                    <div className="csl-group-box">
                      <div className="csl-field">
                        <label className="csl-label">Course title</label>
                        <input
                          className="csl-input"
                          placeholder="Course title"
                          value={form.title}
                          onChange={(e) => setFormField("title", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="csl-group-box">
                      <div className="csl-grid2">
                        <div className="csl-field">
                          <label className="csl-label">Category</label>
                          <CustomSelect
                            value={form.category}
                            onChange={(val) =>
                              setForm((prev) => ({
                                ...prev,
                                category: val,
                                subCategory: "",
                                productType: "",
                              }))
                            }
                            options={categories}
                            placeholder={isMetaLoading ? "Loading categories..." : "Select category"}
                          />
                        </div>

                        <div className="csl-field">
                          <label className="csl-label">Sub category</label>
                          <CustomSelect
                            value={form.subCategory}
                            onChange={(val) =>
                              setForm((prev) => ({
                                ...prev,
                                subCategory: val,
                                productType: "",
                              }))
                            }
                            options={subCategories}
                            placeholder="Select sub category"
                            disabled={!form.category}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="csl-group-box">
                      <div className="csl-grid2">
                        <div className="csl-field">
                          <label className="csl-label">Product type</label>
                          <CustomSelect
                            value={form.productType}
                            onChange={(val) => setFormField("productType", val)}
                            options={productTypes}
                            placeholder="Select product type"
                            disabled={!form.subCategory}
                          />
                        </div>

                        <div className="csl-field">
                          <label className="csl-label">Price</label>
                          <input
                            className="csl-input"
                            placeholder="Price"
                            value={form.price}
                            onChange={(e) => setFormField("price", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="csl-group-box">
                      <div className="csl-field">
                        <label className="csl-label">Short description</label>
                        <textarea
                          className="csl-textarea"
                          placeholder="Short description"
                          value={form.shortDescription}
                          onChange={(e) => setFormField("shortDescription", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="csl-group-box">
                      <div className="csl-field">
                        <label className="csl-label">Tools needed</label>
                        <div className="csl-input-group">
                          <input
                            className="csl-input"
                            placeholder="Tools needed"
                            value={toolsInput}
                            onChange={(e) => setToolsInput(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              (e.preventDefault(),
                              addSimpleItem(toolsInput, setToolsInput, tools, setTools))
                            }
                          />
                          <button
                            type="button"
                            className="csl-add-btn-lime"
                            onClick={() => addSimpleItem(toolsInput, setToolsInput, tools, setTools)}
                          >
                            Add
                          </button>
                        </div>

                        {tools.length > 0 && (
                          <div className="csl-chips-container mt-4">
                            {tools.map((t, i) => (
                              <div className="csl-tag-chip" key={i}>
                                {t}
                                <button
                                  type="button"
                                  onClick={() => removeSimpleItem(i, tools, setTools)}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              className="csl-clear-all"
                              onClick={() => setTools([])}
                              title="Clear all"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="csl-group-box">
                      <div className="csl-field">
                        <label className="csl-label">Prerequisites</label>
                        <textarea
                          className="csl-textarea h-28"
                          placeholder="Prerequisites"
                          value={form.prerequisites}
                          onChange={(e) => setFormField("prerequisites", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="csl-group-box">
                      <div className="csl-field">
                        <label className="csl-label">Course included</label>
                        <div className="csl-input-group">
                          <input
                            className="csl-input"
                            placeholder="Course included"
                            value={includedInput}
                            onChange={(e) => setIncludedInput(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              (e.preventDefault(),
                              addSimpleItem(
                                includedInput,
                                setIncludedInput,
                                courseIncluded,
                                setCourseIncluded,
                              ))
                            }
                          />
                          <button
                            type="button"
                            className="csl-add-btn-lime"
                            onClick={() =>
                              addSimpleItem(
                                includedInput,
                                setIncludedInput,
                                courseIncluded,
                                setCourseIncluded,
                              )
                            }
                          >
                            Add
                          </button>
                        </div>

                        {courseIncluded.length > 0 && (
                          <div className="csl-chips-container mt-4">
                            {courseIncluded.map((item, i) => (
                              <div className="csl-tag-chip" key={i}>
                                {item}
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeSimpleItem(i, courseIncluded, setCourseIncluded)
                                  }
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              className="csl-clear-all"
                              onClick={() => setCourseIncluded([])}
                              title="Clear all"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="csl-group-box">
                      <div className="csl-field">
                        <label className="csl-label">What you will learn</label>
                        <div className="csl-input-group">
                          <input
                            className="csl-input"
                            placeholder="What you will learn"
                            value={learningInput}
                            onChange={(e) => setLearningInput(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              (e.preventDefault(),
                              addSimpleItem(
                                learningInput,
                                setLearningInput,
                                learningPoints,
                                setLearningPoints,
                              ))
                            }
                          />
                          <button
                            type="button"
                            className="csl-add-btn-lime"
                            onClick={() =>
                              addSimpleItem(
                                learningInput,
                                setLearningInput,
                                learningPoints,
                                setLearningPoints,
                              )
                            }
                          >
                            Add
                          </button>
                        </div>

                        {learningPoints.length > 0 && (
                          <div className="csl-chips-container mt-4">
                            {learningPoints.map((p, i) => (
                              <div className="csl-tag-chip" key={i}>
                                {p}
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeSimpleItem(i, learningPoints, setLearningPoints)
                                  }
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              className="csl-clear-all"
                              onClick={() => setLearningPoints([])}
                              title="Clear all"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="csl-group-box">
                      <div className="csl-field">
                        <label className="csl-label">Languages</label>
                        <CustomSelect
                          value=""
                          onChange={(val) => {
                            if (!val) return;
                            if (languages.some((x) => x.toLowerCase() === val.toLowerCase())) {
                              return;
                            }
                            setLanguages([...languages, val]);
                          }}
                          options={languageOptions}
                          placeholder="Select language"
                        />

                        {languages.length > 0 && (
                          <div className="csl-chips-container mt-4">
                            {languages.map((l, i) => (
                              <div className="csl-tag-chip" key={i}>
                                {l}
                                <button
                                  type="button"
                                  onClick={() => removeSimpleItem(i, languages, setLanguages)}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              className="csl-clear-all"
                              onClick={() => setLanguages([])}
                              title="Clear all"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <CoverSection
                    mode="listing"
                    listingType={LISTING_TYPE}
                    cover={cover}
                    coverFileName={coverFile?.name || ""}
                    onUploadClick={() => setUploadStep("grid")}
                    onRemoveCover={() => {
                      setCover(null);
                      setCoverFile(null);
                    }}
                  />

                  <LessonSection
                    lessons={lessons}
                    onAddLesson={addLesson}
                    onRemoveLesson={removeLesson}
                    onUpdateLesson={updateLesson}
                    onUploadMedia={uploadLessonMedia}
                  />

                  <DeliverablesSection
                    mode="listing"
                    listingType={LISTING_TYPE}
                    deliverables={resources}
                    onAddDeliverable={addResource}
                    onRemoveDeliverable={removeResource}
                    onUpdateDeliverableNotes={updateResourceNotes}
                    onUpdateDeliverableFile={updateResourceFile}
                    links={links}
                    onAddLink={addLink}
                    onRemoveLink={removeLink}
                    onUpdateLink={updateLink}
                  />

                  <div className="csl-group-box">
                    <PreviewVideo
                      previewImage={previewVideo || undefined}
                      onUpload={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "video/*";
                        input.onchange = (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setPreviewVideoFile(file);
                            const url = URL.createObjectURL(file);
                            setPreviewVideo(url);
                          }
                        };
                        input.click();
                      }}
                      onClose={() => {
                        setPreviewVideo(null);
                        setPreviewVideoFile(null);
                      }}
                    />
                  </div>

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
                            aria-label="Delete FAQ"
                            title="Delete"
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

                        <button
                          type="button"
                          className="faq-add"
                          onClick={addFaq}
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="faq-actions">
                    <button
                      type="button"
                      className="faq-save"
                      onClick={handleSaveListing}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isModalOpen &&
          createPortal(
            <div className={`user-page ${theme || "light"}`}>
              <div
                className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm"
                onClick={() => setUploadStep(null)}
              />

              {(uploadStep === "grid" || uploadStep === "success") && (
                <UploadGrid
                  blurred={uploadStep === "success"}
                  onBack={() => setUploadStep(null)}
                  onSelect={(files) => {
                    if (files?.[0]) {
                      handleCoverFileSelect(files[0]);
                    }
                    setUploadStep("success");
                  }}
                />
              )}

              {uploadStep === "success" && <UploadSuccess onBack={() => setUploadStep(null)} />}
            </div>,
            document.body,
          )}
      </div>
    </>
  );
}

function CustomSelect({ value, onChange, options, placeholder, disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  React.useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div
      className={`onboarding-custom-select ${open ? "active" : ""} ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
      ref={ref}
    >
      <div className="onboarding-selected-option" onClick={() => !disabled && setOpen(!open)}>
        <span className={!value ? "opacity-70" : ""}>{value || placeholder}</span>
        <span className="onboarding-arrow">▼</span>
      </div>

      {open && (
        <ul className="onboarding-options-list dark:bg-[#1E1E1E]">
          {options.map((opt, index) => (
            <li
              key={`${opt}-${index}`}
              className={value === opt ? "active" : ""}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function UploadGrid({ onSelect, onBack, blurred }) {
  const fileRef = useRef(null);
  const [files, setFiles] = useState([]);
  const activeIndexRef = useRef(null);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    if (activeIndexRef.current === null || selected.length === 0) return;

    setFiles((prev) => {
      const updated = [...prev];
      updated[activeIndexRef.current] = selected[0];
      return updated;
    });

    activeIndexRef.current = null;
    e.target.value = "";
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto">
      <div
        className={`upload-card rounded-2xl p-4 w-[95%] max-w-[820px] h-auto max-h-[90vh] flex flex-col bg-white dark:bg-[#1A1A1A] shadow-[0_0_20px_#CEFF1B] transition-all duration-200 ${
          blurred ? "blur-sm scale-[0.98] pointer-events-none select-none opacity-95" : ""
        }`}
      >
        <div className="upload-header flex items-center gap-3 mb-3 shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 shrink-0"
            title="Back"
          >
            <img src="/backarrow.svg" alt="back" />
          </button>

          <h4 className="text-sm font-medium text-black dark:text-black">
            Select and upload your file
          </h4>

          <button
            type="button"
            onClick={onBack}
            className="ml-auto w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#CEFF1B]"
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 flex-1 overflow-y-auto pr-2 custom-scroll">
          {Array.from({ length: 9 }).map((_, i) => {
            const file = files[i];
            return (
              <div
                key={i}
                onClick={() => {
                  activeIndexRef.current = i;
                  fileRef.current?.click();
                }}
                className="upload-slot relative h-[110px] rounded-xl flex items-center justify-center cursor-pointer overflow-hidden bg-gray-100 dark:bg-gray-800"
              >
                {i === 0 && (
                  <span className="absolute inset-0 z-10 flex items-center justify-center px-2 pointer-events-none">
                    <span className="bg-[#CEFF1B] text-black font-medium text-[10px] sm:text-xs px-2 py-[3px] rounded max-w-[90%] text-center whitespace-normal leading-tight">
                      Upload Cover Image
                    </span>
                  </span>
                )}

                {file ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  i !== 0 && (
                    <div className="relative pointer-events-none">
                      <img src="/video2.svg" className="w-10 mr-8 mt-2 opacity-60" alt="" />
                      <img src="/video1.svg" className="w-12 absolute -right-2 -top-3 opacity-60" alt="" />
                      <div className="absolute bottom-4 right-6 w-6 h-6 rounded-full bg-[#CEFF1B] flex items-center justify-center text-black font-bold">
                        +
                      </div>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end items-center mt-3 shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="upload-btn-cancel px-4 py-2 rounded-lg text-sm border border-black dark:border-white/20 dark:text-white"
            >
              Cancel
            </button>
            {files.filter(Boolean).length > 0 && (
              <button
                type="button"
                onClick={() => onSelect(files.filter(Boolean))}
                className="upload-btn-confirm px-5 py-2 rounded-lg text-sm font-medium bg-[#CEFF1B] border border-black"
              >
                Upload
              </button>
            )}
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFiles}
          className="hidden"
        />
      </div>
    </div>
  );
}

function UploadSuccess({ onBack }) {
  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center pointer-events-auto p-4">
      <div className="upload-success-card rounded-2xl w-[90%] max-w-[600px] h-auto min-h-[300px] md:h-[400px] py-10 flex flex-col items-center justify-center shadow-[0_0_20px_#CEFF1B] bg-white dark:bg-[#2B2B2B]">
        <div className="w-24 h-24 bg-[#CEFF1B] rounded-full flex items-center justify-center mb-6">
          <img src="/right.svg" alt="success" />
        </div>

        <h3 className="text-2xl font-semibold mb-8 text-black dark:text-white text-center px-4">
          You have successfully uploaded!
        </h3>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="upload-btn-confirm px-12 py-3 rounded-lg bg-[#CEFF1B] border border-black font-semibold text-black transition-transform hover:scale-105"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}