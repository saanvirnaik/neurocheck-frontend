import axios from "axios";

const BASE_URL = "http://localhost:8080/api/neurohearts/neurocheck/dyslexia";

const dyslexiaApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * STEP 1: Save parent/guardian consent and generate a new screeningId
 * Returns: { screeningId }
 */
export const submitDyslexiaConsent = async (consentData) => {
  const response = await dyslexiaApi.post("/consent", consentData);
  const { screeningId } = response.data;

  // store screeningId locally for next steps
  if (screeningId) {
    localStorage.setItem("screeningId", screeningId);
  }

  return screeningId;
};

/**
 * STEP 2: Save Dyslexia Checklist data
 * Requires: screeningId in localStorage
 */
export const saveDyslexiaChecklist = async (formData) => {
  const screeningId = localStorage.getItem("screeningId");
  if (!screeningId) throw new Error("Missing screeningId. Please start with consent.");

  const payload = { screeningId, ...formData };
  const response = await dyslexiaApi.post("/saveCheckList", payload);
  return response.data;
};

/**
 * STEP 3: Save Word Match Game results
 */
export const saveWordMatch = async (data) => {
  const screeningId = localStorage.getItem("screeningId");
  if (!screeningId) throw new Error("Missing screeningId. Please start with consent.");

  const payload = { screeningId, ...data };
  const response = await dyslexiaApi.post("/saveWordMatch", payload);
  return response.data;
};

/**
 * STEP 4: Save Pattern Recognition results
 */
export const savePatternRecognition = async (data) => {
  const screeningId = localStorage.getItem("screeningId");
  if (!screeningId) throw new Error("Missing screeningId. Please start with consent.");

  const payload = { screeningId, ...data };
  const response = await dyslexiaApi.post("/savePattern", payload);
  return response.data;
};

/**
 * STEP 5: Get combined results for the given screeningId
 */
export const getDyslexiaResults = async (screeningId) => {
  const id = screeningId || localStorage.getItem("screeningId");
  if (!id) throw new Error("Missing screeningId. Cannot fetch results.");

  const response = await dyslexiaApi.get(`/results/${id}`);
  return response.data;
};

/**
 * (Optional) Clear local data when workflow finishes
 */
export const clearScreeningSession = () => {
  localStorage.removeItem("screeningId");
};
