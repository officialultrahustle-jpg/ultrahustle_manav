import axios from "axios";
import { getAuthToken } from "../../auth/api/authApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const unwrap = (res) => res?.data;

const extractErrorMessage = (error) => {
  const data = error?.response?.data;

  if (!data) return error?.message || "Request failed";
  if (typeof data === "string") return data;

  if (data.errors && typeof data.errors === "object") {
    const firstKey = Object.keys(data.errors)[0];
    const firstValue = data.errors[firstKey];

    if (Array.isArray(firstValue) && firstValue[0]) return firstValue[0];
    if (typeof firstValue === "string") return firstValue;
  }

  if (data.message) return data.message;
  return "Request failed";
};

export const createListing = async (payload) => {
  try {
    const formData = new FormData();

    formData.append("listing_type", payload.listing_type || "");
    formData.append("status", payload.status || "published");
    formData.append("title", payload.title || "");
    formData.append("category", payload.category || "");
    formData.append("sub_category", payload.sub_category || "");
    formData.append("short_description", payload.short_description || "");
    formData.append("about", payload.about || "");
    formData.append("ai_powered", payload.ai_powered ? "1" : "0");
    formData.append("seller_mode", payload.seller_mode || "Solo");
    formData.append("team_name", payload.team_name || "");

    if (payload.cover_file) {
      formData.append("cover_file", payload.cover_file);
    }

    (payload.tags || []).forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    (payload.faqs || []).forEach((faq, index) => {
      formData.append(`faqs[${index}][q]`, faq.q || "");
      formData.append(`faqs[${index}][a]`, faq.a || "");
    });

    (payload.links || []).forEach((link, index) => {
      formData.append(`links[${index}]`, link);
    });

    (payload.deliverables || []).forEach((item, index) => {
      if (item.file) {
        formData.append(`deliverables[${index}][file]`, item.file);
      }
      formData.append(`deliverables[${index}][notes]`, item.notes || "");
    });

    const details = payload.details || {};

    Object.keys(details).forEach((key) => {
      if (key === "packages") return;

      const value = details[key];

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`details[${key}][${index}]`, item);
        });
      } else if (value !== undefined && value !== null) {
        formData.append(`details[${key}]`, value);
      }
    });

    Object.entries(details.packages || {}).forEach(([packageName, pkg], index) => {
      formData.append(`details[packages][${index}][package_name]`, packageName);
      formData.append(`details[packages][${index}][price]`, pkg.price || "");

      (pkg.included || []).forEach((item, itemIndex) => {
        formData.append(`details[packages][${index}][included][${itemIndex}]`, item);
      });

      (pkg.toolsUsed || []).forEach((item, itemIndex) => {
        formData.append(`details[packages][${index}][toolsUsed][${itemIndex}]`, item);
      });

      (pkg.deliveryFormats || []).forEach((item, itemIndex) => {
        formData.append(`details[packages][${index}][deliveryFormats][${itemIndex}]`, item);
      });
    });

    const res = await api.post("/api/v1/listings", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};