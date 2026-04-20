import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./CreateServiceListing.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import MyPortfolio from "../../dashboard/components/UserProfile/MyPortfolio";
import {
  createListing,
  getListingByUsername,
  updateListing,
  getListingDropdowns,
  getMyTeams,
} from "../api/listingApi";
import "../../../Darkuser.css";
import "../../onboarding/components/OnboardingSelect.css";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const LISTING_TYPE = "service";
const LISTING_TYPE_SLUG = "service";
const TABS = ["Basic", "Standard", "Premium"];

const EMPTY_PACKAGE = {
  packageName: "",
  price: "",
  deliveryDays: "",
  revisions: "",
  scope: "",
  included: [],
  howItWorks: [],
  notIncluded: [],
  toolsUsed: [],
  deliveryFormat: "",
};

const EMPTY_FAQ = { q: "", a: "" };
const EMPTY_ADDON = { name: "", price: "", days: "" };

export default function CreateServiceListing({
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
  const [teamOptions, setTeamOptions] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");

  const [uploadStep, setUploadStep] = useState(null);
  const isModalOpen = uploadStep === "grid" || uploadStep === "success";

  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [isMetaLoading, setIsMetaLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [listingId, setListingId] = useState(null);
  const [saveError, setSaveError] = useState("");

  const [cover, setCover] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState("");

  const [portfolioProjects, setPortfolioProjects] = useState([]);

  const [aiPowered, setAiPowered] = useState(false);
  const [sellerMode, setSellerMode] = useState("Solo");
  const [teamName, setTeamName] = useState("");
  const [activeTab, setActiveTab] = useState("Basic");

  const [form, setForm] = useState({
    title: "",
    category: "",
    subCategory: "",
    productType: "",
    shortDescription: "",
    about: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const [pkg, setPkg] = useState({
    Basic: { ...EMPTY_PACKAGE },
    Standard: { ...EMPTY_PACKAGE },
    Premium: { ...EMPTY_PACKAGE },
  });

  const [includedInput, setIncludedInput] = useState("");
  const [howInput, setHowInput] = useState("");
  const [notInput, setNotInput] = useState("");
  const [toolsInput, setToolsInput] = useState("");

  const [addOn, setAddOn] = useState({ ...EMPTY_ADDON });
  const [addOns, setAddOns] = useState([]);

  const [faqs, setFaqs] = useState([{ ...EMPTY_FAQ }]);

  const current = pkg[activeTab];

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

  const loadTeams = async () => {
    try {
      const res = await getMyTeams();
      const rows = Array.isArray(res?.teams) ? res.teams : [];
      setTeamOptions(
        rows
          .map((item) => String(item?.team_name || item?.name || "").trim())
          .filter(Boolean)
      );
    } catch (e) {
      setTeamOptions([]);
    }
  };

  React.useEffect(() => {
    loadCategories();
    loadTeams();
  }, []);

  React.useEffect(() => {
    loadSubCategories(form.category);
  }, [form.category]);

  React.useEffect(() => {
    loadProductTypes(form.category, form.subCategory);
  }, [form.category, form.subCategory]);

  React.useEffect(() => {
    const loadListing = async () => {
      if (!isEditMode || !username) {
        setInitialLoading(false);
        return;
      }

      try {
        setInitialLoading(true);
        setSaveError("");

        const res = await getListingByUsername(username);
        const item = res?.listing || null;

        if (!item) {
          Swal.fire({
            icon: "error",
            title: "Not found",
            text: "Listing not found.",
          });
          return;
        }

        if (item.listing_type !== LISTING_TYPE) {
          Swal.fire({
            icon: "error",
            title: "Invalid listing",
            text: "This listing is not a service listing.",
          });
          return;
        }

        const details = item?.details || {};
        const packages = Array.isArray(details?.packages) ? details.packages : [];
        const mappedPackages = {
          Basic: { ...EMPTY_PACKAGE, packageName: "Basic" },
          Standard: { ...EMPTY_PACKAGE, packageName: "Standard" },
          Premium: { ...EMPTY_PACKAGE, packageName: "Premium" },
        };

        packages.forEach((packageItem, index) => {
          const tab = packageItem?.package_name || TABS[index] || "Basic";
          if (!mappedPackages[tab]) return;

          mappedPackages[tab] = {
            packageName: packageItem?.package_name || tab,
            price:
              packageItem?.price !== undefined && packageItem?.price !== null
                ? String(packageItem.price)
                : "",
            deliveryDays:
              packageItem?.delivery_days !== undefined &&
              packageItem?.delivery_days !== null
                ? String(packageItem.delivery_days)
                : "",
            revisions:
              packageItem?.revisions !== undefined && packageItem?.revisions !== null
                ? String(packageItem.revisions)
                : "",
            scope: packageItem?.scope || "",
            included: Array.isArray(packageItem?.included) ? packageItem.included : [],
            howItWorks: Array.isArray(packageItem?.how_it_works)
              ? packageItem.how_it_works
              : [],
            notIncluded: Array.isArray(packageItem?.not_included)
              ? packageItem.not_included
              : [],
            toolsUsed: Array.isArray(packageItem?.tools_used) ? packageItem.tools_used : [],
            deliveryFormat: packageItem?.delivery_format || "",
          };
        });

        setListingId(item.id || null);
        setForm({
          title: item.title || "",
          category: item.category || "",
          subCategory: item.sub_category || "",
          productType: item?.details?.product_type || "",
          shortDescription: item.short_description || "",
          about: item.about || "",
        });

        setAiPowered(Boolean(item.ai_powered));
        setSellerMode(item?.seller_mode || "Solo");
        setTeamName(item?.team_name || "");
        setTags(Array.isArray(item?.tags) ? item.tags : []);
        setPkg(mappedPackages);
        const normalizedAddOns = Array.isArray(details?.add_ons)
  ? details.add_ons.map((item) => ({
      name: item.name || "",
      price:
        item.price !== undefined && item.price !== null
          ? String(item.price)
          : "",
      days:
        item.days !== undefined && item.days !== null
          ? String(item.days)
          : "",
    }))
  : [];

if (normalizedAddOns.length > 0) {
  setAddOn(normalizedAddOns[0]);
  setAddOns(normalizedAddOns.slice(1));
} else {
  setAddOn({ ...EMPTY_ADDON });
  setAddOns([]);
}
        setFaqs(
          Array.isArray(item.faqs) && item.faqs.length
            ? item.faqs.map((faq) => ({
                q: faq.q || faq.question || "",
                a: faq.a || faq.answer || "",
              }))
            : [{ q: "", a: "" }]
        );

        if (item.cover_media_url || item.cover_media_path) {
          const coverUrl = item.cover_media_url || item.cover_media_path;
          setCover(coverUrl);
          setExistingCoverUrl(coverUrl);
        }
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "Load failed",
          text: e?.message || "Failed to load service listing.",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    loadListing();
  }, [isEditMode, username]);

  const addSimpleItem = (input, setInput, list, setList) => {
    const value = String(input || "").trim();
    if (!value) return;

    if (list.some((x) => String(x).toLowerCase() === value.toLowerCase())) {
      setInput("");
      return;
    }

    setList([...list, value]);
    setInput("");
  };

  const removeSimpleItem = (idx, list, setList) => {
    setList(list.filter((_, i) => i !== idx));
  };

  const onEnterAdd = (e, fn) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fn();
    }
  };

  const setPkgField = (key, value) => {
    setPkg((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [key]: value },
    }));
  };

  const addToList = (key, value, setValue) => {
    const clean = String(value || "").trim();
    if (!clean) return;

    setPkg((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [key]: [...(Array.isArray(prev[activeTab][key]) ? prev[activeTab][key] : []), clean],
      },
    }));

    setValue("");
  };

  const removeFromList = (key, idx) => {
    setPkg((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [key]: (Array.isArray(prev[activeTab][key]) ? prev[activeTab][key] : []).filter(
          (_, i) => i !== idx
        ),
      },
    }));
  };

  const addFaq = () => setFaqs([...faqs, { q: "", a: "" }]);

  const updateFaq = (idx, key, value) => {
    setFaqs(faqs.map((item, i) => (i === idx ? { ...item, [key]: value } : item)));
  };

  const removeFaq = (idx) => {
    if (faqs.length === 1) return;
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const addAddOn = () => {
    const name = String(addOn.name || "").trim();
    if (!name) return;

    setAddOns((prev) => [
      ...prev,
      {
        name,
        price: addOn.price || "",
        days: addOn.days || "",
      },
    ]);

    setAddOn({ ...EMPTY_ADDON });
  };

  const removeAddOn = (idx) => {
    setAddOns(addOns.filter((_, i) => i !== idx));
  };

  const applyCoverFile = (file) => {
    if (!file) return;
    setCoverFile(file);

    const reader = new FileReader();
    reader.onload = () => setCover(reader.result);
    reader.readAsDataURL(file);
  };

  const buildPayload = (status) => {
    const packages = TABS.map((tab) => ({
      package_name: pkg[tab]?.packageName || tab,
      price: pkg[tab]?.price || "",
      delivery_days: pkg[tab]?.deliveryDays || "",
      revisions: pkg[tab]?.revisions || "",
      scope: pkg[tab]?.scope || "",
      included: Array.isArray(pkg[tab]?.included) ? pkg[tab].included : [],
      how_it_works: Array.isArray(pkg[tab]?.howItWorks) ? pkg[tab].howItWorks : [],
      not_included: Array.isArray(pkg[tab]?.notIncluded) ? pkg[tab].notIncluded : [],
      tools_used: Array.isArray(pkg[tab]?.toolsUsed) ? pkg[tab].toolsUsed : [],
      delivery_format: pkg[tab]?.deliveryFormat || "",
    })).filter((pkg) =>
      pkg.price ||
      pkg.delivery_days ||
      pkg.revisions ||
      pkg.scope ||
      pkg.included.length ||
      pkg.how_it_works.length ||
      pkg.not_included.length ||
      pkg.tools_used.length ||
      pkg.delivery_format
    );

    const priceCandidates = packages
      .map((item) => Number(item.price || 0))
      .filter((price) => Number.isFinite(price) && price > 0);

    const mergedAddOns = [
      ...addOns,
      {
        name: String(addOn.name || "").trim(),
        price: addOn.price || "",
        days: addOn.days || "",
      },
    ].filter((item) => item.name || item.price || item.days);

    return {
      listing_type: LISTING_TYPE,
      status,
      title: form.title,
      category: form.category,
      sub_category: form.subCategory,
      short_description: form.shortDescription,
      about: form.about || form.shortDescription,
      ai_powered: aiPowered,
      seller_mode: sellerMode,
      team_name: sellerMode === "Team" ? teamName : "",

      cover_file: coverFile || null,
      existing_cover_url: !coverFile ? existingCoverUrl || "" : "",

      tags,
      faqs: faqs.filter((f) => String(f.q || "").trim() || String(f.a || "").trim()),
      portfolio_projects: Array.isArray(portfolioProjects) ? portfolioProjects : [],

      details: {
        product_type: form.productType,
        price: priceCandidates.length ? String(Math.min(...priceCandidates)) : "",
        packages,
        add_ons: mergedAddOns.map((item) => ({
          name: item.name || "",
          price: item.price || "",
          days: item.days || "",
        })),
      },
    };
  };

  const validateBeforeSave = () => {
    if (!String(form.title || "").trim()) return "Service title is required.";
    if (!String(form.category || "").trim()) return "Category is required.";
    if (!String(form.subCategory || "").trim()) return "Sub category is required.";
    if (!String(form.productType || "").trim()) return "Product type is required.";

    const hasPackagePrice = TABS.some((tab) => Number(pkg[tab]?.price || 0) > 0);
    if (!hasPackagePrice) return "At least one package price is required.";

    if (sellerMode === "Team" && !String(teamName || "").trim()) {
      return "Team name is required when Team mode is selected.";
    }

    return "";
  };

  const handleSaveListing = async (status = "published") => {
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
      setSaveError("");

      const res = isEditMode
        ? await updateListing(username, buildPayload(status))
        : await createListing(buildPayload(status));

      Swal.fire({
        icon: "success",
        title: isEditMode ? "Service Updated" : "Service Created",
        text:
          res?.message ||
          (isEditMode
            ? "Your service has been updated successfully."
            : "Your service has been created successfully."),
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/my-listings");
        }
      });
    } catch (e) {
      setSaveError(e?.message || "Failed to save service listing.");
      Swal.fire({
        icon: "error",
        title: isEditMode ? "Update failed" : "Save failed",
        text: e?.message || `Failed to ${isEditMode ? "update" : "save"} service listing.`,
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
            Loading service listing...
          </div>
        </div>
      </div>
    );
  }

  return (
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
                        {isEditMode ? "Edit Service Listing" : "Create Service Listing"}
                      </h1>
                      <p className="csl-subtitle">
                        {isEditMode ? "Update each section" : "Fill out each section"}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <h2 className="csl-section m-0">Service Details</h2>
                    <div className="csl-ai">
                      <span className={`csl-ai-pill ${aiPowered ? "active" : ""}`}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7 2L9 6.81l4.89 2L9 10.81 7 15.62l-2-4.81-4.81-2 4.81-2L7 2zM17.5 15l1.25 3.01 3 1.25-3 1.25-1.25 3-1.25-3-3-1.25 3-1.25L17.5 15z" />
                        </svg>
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

                  <div className="csl-group-box">
                    <div className="csl-field">
                      <label className="csl-label">Service title</label>
                      <input
                        className="csl-input"
                        placeholder="Enter service title"
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
                        <label className="csl-label">Provider Mode</label>
                        <CustomSelect
                          value={sellerMode}
                          onChange={(val) => setSellerMode(val || "Solo")}
                          options={["Solo", "Team"]}
                          placeholder="Select mode"
                        />
                      </div>
                    </div>
                  </div>

                  {sellerMode === "Team" && (
                    <div className="csl-group-box">
                      <div className="csl-field">
                        <label className="csl-label">Team name</label>
                        <CustomSelect
                          value={teamName}
                          onChange={setTeamName}
                          options={teamOptions}
                          placeholder="Select team name"
                        />
                      </div>
                    </div>
                  )}

                  <div className="csl-group-box">
                    <div className="csl-field">
                      <label className="csl-label">Short description</label>
                      <textarea
                        className="csl-textarea h-28"
                        placeholder="Short description"
                        value={form.shortDescription}
                        onChange={(e) => setFormField("shortDescription", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="csl-group-box">
                    <div className="csl-field">
                      <label className="csl-label">About this service</label>
                      <textarea
                        className="csl-textarea h-28"
                        placeholder="About this service"
                        value={form.about}
                        onChange={(e) => setFormField("about", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="csl-group-box">
                    <div className="csl-field">
                      <label className="csl-label">Tags</label>
                      <input
                        className="csl-input"
                        placeholder="Add tag and press Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) =>
                          onEnterAdd(e, () => addSimpleItem(tagInput, setTagInput, tags, setTags))
                        }
                      />

                      {tags.length > 0 && (
                        <div className="csl-chips-container mt-4">
                          {tags.map((tag, i) => (
                            <div className="csl-tag-chip" key={i}>
                              {tag}
                              <button type="button" onClick={() => removeSimpleItem(i, tags, setTags)}>
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="csl-clear-all"
                            onClick={() => setTags([])}
                            title="Clear all"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="csl-card">
                  <h2 className="csl-section">Packages</h2>

                  <div className="sp-tabs">
                    {TABS.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        className={`sp-tab ${activeTab === tab ? "active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="csl-grid2">
                    <div className="csl-field">
                      <label className="csl-label">Package name</label>
                      <input
                        className="csl-input"
                        value={current.packageName}
                        onChange={(e) => setPkgField("packageName", e.target.value)}
                        placeholder="Package name"
                      />
                    </div>

                    <div className="csl-field">
                      <label className="csl-label">Price</label>
                      <input
                        className="csl-input"
                        type="number"
                        value={current.price}
                        onChange={(e) => setPkgField("price", e.target.value)}
                        placeholder="Price"
                      />
                    </div>
                  </div>

                  <div className="csl-grid2 mt-4">
                    <div className="csl-field">
                      <label className="csl-label">Delivery days</label>
                      <input
                        className="csl-input"
                        type="number"
                        value={current.deliveryDays}
                        onChange={(e) => setPkgField("deliveryDays", e.target.value)}
                        placeholder="Delivery days"
                      />
                    </div>

                    <div className="csl-field">
                      <label className="csl-label">Revisions</label>
                      <input
                        className="csl-input"
                        type="number"
                        value={current.revisions}
                        onChange={(e) => setPkgField("revisions", e.target.value)}
                        placeholder="Revisions"
                      />
                    </div>
                  </div>

                  <div className="csl-field mt-4">
                    <label className="csl-label">Scope</label>
                    <textarea
                      className="csl-textarea h-28"
                      placeholder="Describe package scope"
                      value={current.scope}
                      onChange={(e) => setPkgField("scope", e.target.value)}
                    />
                  </div>

                  <div className="csl-group-box">
                    <div className="csl-field">
                      <label className="csl-label">What's included</label>
                      <input
                        className="csl-input"
                        placeholder="Add item and press Enter"
                        value={includedInput}
                        onChange={(e) => setIncludedInput(e.target.value)}
                        onKeyDown={(e) =>
                          onEnterAdd(e, () => addToList("included", includedInput, setIncludedInput))
                        }
                      />
                      {Array.isArray(current.included) && current.included.length > 0 && (
                        <div className="csl-chips-container mt-4">
                          {current.included.map((item, i) => (
                            <div className="csl-tag-chip" key={i}>
                              {item}
                              <button type="button" onClick={() => removeFromList("included", i)}>
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="csl-group-box">
                    <div className="csl-field">
                      <label className="csl-label">How it works</label>
                      <input
                        className="csl-input"
                        placeholder="Add step and press Enter"
                        value={howInput}
                        onChange={(e) => setHowInput(e.target.value)}
                        onKeyDown={(e) =>
                          onEnterAdd(e, () => addToList("howItWorks", howInput, setHowInput))
                        }
                      />
                      {Array.isArray(current.howItWorks) && current.howItWorks.length > 0 && (
                        <div className="csl-chips-container mt-4">
                          {current.howItWorks.map((item, i) => (
                            <div className="csl-tag-chip" key={i}>
                              {item}
                              <button type="button" onClick={() => removeFromList("howItWorks", i)}>
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="csl-group-box">
                    <div className="csl-field">
                      <label className="csl-label">Not included</label>
                      <input
                        className="csl-input"
                        placeholder="Add item and press Enter"
                        value={notInput}
                        onChange={(e) => setNotInput(e.target.value)}
                        onKeyDown={(e) =>
                          onEnterAdd(e, () => addToList("notIncluded", notInput, setNotInput))
                        }
                      />
                      {Array.isArray(current.notIncluded) && current.notIncluded.length > 0 && (
                        <div className="csl-chips-container mt-4">
                          {current.notIncluded.map((item, i) => (
                            <div className="csl-tag-chip" key={i}>
                              {item}
                              <button type="button" onClick={() => removeFromList("notIncluded", i)}>
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="csl-group-box">
                    <div className="csl-field">
                      <label className="csl-label">Tools used</label>
                      <input
                        className="csl-input"
                        placeholder="Add tool and press Enter"
                        value={toolsInput}
                        onChange={(e) => setToolsInput(e.target.value)}
                        onKeyDown={(e) =>
                          onEnterAdd(e, () => addToList("toolsUsed", toolsInput, setToolsInput))
                        }
                      />
                      {Array.isArray(current.toolsUsed) && current.toolsUsed.length > 0 && (
                        <div className="csl-chips-container mt-4">
                          {current.toolsUsed.map((item, i) => (
                            <div className="csl-tag-chip" key={i}>
                              {item}
                              <button type="button" onClick={() => removeFromList("toolsUsed", i)}>
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="csl-field mt-4">
                    <label className="csl-label">Delivery format</label>
                    <input
                      className="csl-input"
                      value={current.deliveryFormat}
                      onChange={(e) => setPkgField("deliveryFormat", e.target.value)}
                      placeholder="Delivery format"
                    />
                  </div>
                </div>

                <div className="csl-card">
                  <h2 className="csl-section">Add-ons</h2>

                  <div className="csl-grid2">
                    <div className="csl-field">
                      <label className="csl-label">Add-on name</label>
                      <input
                        className="csl-input"
                        value={addOn.name}
                        onChange={(e) => setAddOn((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Add-on name"
                      />
                    </div>
                    <div className="csl-field">
                      <label className="csl-label">Price</label>
                      <input
                        className="csl-input"
                        type="number"
                        value={addOn.price}
                        onChange={(e) => setAddOn((prev) => ({ ...prev, price: e.target.value }))}
                        placeholder="Price"
                      />
                    </div>
                  </div>

                  <div className="csl-field mt-4">
                    <label className="csl-label">Days</label>
                    <input
                      className="csl-input"
                      type="number"
                      value={addOn.days}
                      onChange={(e) => setAddOn((prev) => ({ ...prev, days: e.target.value }))}
                      placeholder="Days"
                    />
                  </div>

                  <button
                    type="button"
                    className="csl-add-btn-lime-below"
                    onClick={addAddOn}
                  >
                    + Add
                  </button>

                  {addOns.length > 0 && (
                    <div className="csl-chips-container mt-4">
                      {addOns.map((item, i) => (
                        <div className="csl-tag-chip" key={i}>
                          {item.name} | ₹{item.price || 0} | {item.days || 0} day(s)
                          <button type="button" onClick={() => removeAddOn(i)}>
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="csl-card">
                  <h2 className="csl-section">Cover</h2>
                  <div className="am-uploadBox">
                    {cover ? (
                      <img src={cover} alt="cover" className="am-preview" />
                    ) : (
                      <div className="am-placeholder">
                        <button
                          type="button"
                          className="am-uploadBtn"
                          onClick={() => setUploadStep("grid")}
                        >
                          Upload Cover
                        </button>
                      </div>
                    )}

                    {cover && (
                      <button
                        type="button"
                        className="am-removeImg"
                        onClick={() => {
                          setCover(null);
                          setCoverFile(null);
                          setExistingCoverUrl("");
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                <div className="csl-card">
                  <MyPortfolio
                    mode="listing"
                    listingType={LISTING_TYPE}
                    listingId={isEditMode ? listingId : null}
                    onChange={setPortfolioProjects}
                  />
                </div>

                <div className="csl-card">
                  <h2 className="csl-section">FAQs</h2>
                  {faqs.map((item, idx) => (
                    <div key={idx} className="csl-group-box">
                      <div className="csl-field">
                        <label className="csl-label">Question</label>
                        <input
                          className="csl-input"
                          value={item.q}
                          onChange={(e) => updateFaq(idx, "q", e.target.value)}
                          placeholder="Question"
                        />
                      </div>

                      <div className="csl-field mt-4">
                        <label className="csl-label">Answer</label>
                        <textarea
                          className="csl-textarea h-28"
                          value={item.a}
                          onChange={(e) => updateFaq(idx, "a", e.target.value)}
                          placeholder="Answer"
                        />
                      </div>

                      {faqs.length > 1 && (
                        <button
                          type="button"
                          className="csl-add-btn-lime-below"
                          onClick={() => removeFaq(idx)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}

                  <button type="button" className="csl-add-btn-lime-below" onClick={addFaq}>
                    + Add
                  </button>
                </div>

                {saveError ? <p className="text-red-600 text-sm">{saveError}</p> : null}

                <div className="flex justify-end gap-4 pb-12">
                  <button
                    type="button"
                    className="px-6 py-3 rounded-xl border border-black"
                    onClick={() => handleSaveListing("draft")}
                    disabled={isSubmitting}
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 rounded-xl bg-[#CEFF1B] border border-black font-semibold"
                    onClick={() => handleSaveListing("published")}
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : isEditMode
                        ? "Update Service"
                        : "Create Service"}
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
                  if (files?.[0]) applyCoverFile(files[0]);
                  setUploadStep("success");
                }}
              />
            )}

            {uploadStep === "success" && <UploadSuccess onBack={() => setUploadStep(null)} />}
          </div>,
          document.body
        )}
    </div>
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
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
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
