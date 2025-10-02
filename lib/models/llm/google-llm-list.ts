import { LLM } from "@/types"

const GOOGLE_PLATORM_LINK = "https://ai.google.dev/"

// Google Models (UPDATED 10/02/25) -----------------------------

// Gemini 2.5 Pro - State-of-the-art thinking model with 1M+ token context
const GEMINI_2_5_PRO: LLM = {
  modelId: "gemini-2.5-pro",
  modelName: "Gemini 2.5 Pro",
  provider: "google",
  hostedId: "gemini-2.5-pro",
  platformLink: GOOGLE_PLATORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 1.25,
    outputCost: 5
  }
}

// Gemini 2.5 Flash - Best price-performance with thinking capabilities
const GEMINI_2_5_FLASH: LLM = {
  modelId: "gemini-2.5-flash",
  modelName: "Gemini 2.5 Flash",
  provider: "google",
  hostedId: "gemini-2.5-flash",
  platformLink: GOOGLE_PLATORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0.075,
    outputCost: 0.3
  }
}

// Gemini 2.0 Flash (Experimental) - Second generation workhorse model
const GEMINI_2_0_FLASH: LLM = {
  modelId: "gemini-2.0-flash-exp",
  modelName: "Gemini 2.0 Flash (Experimental)",
  provider: "google",
  hostedId: "gemini-2.0-flash-exp",
  platformLink: GOOGLE_PLATORM_LINK,
  imageInput: true
}

// Gemini 1.5 Pro - Long-context understanding with multimodal support
const GEMINI_1_5_PRO: LLM = {
  modelId: "gemini-1.5-pro-latest",
  modelName: "Gemini 1.5 Pro",
  provider: "google",
  hostedId: "gemini-1.5-pro-latest",
  platformLink: GOOGLE_PLATORM_LINK,
  imageInput: true
}

// Gemini 1.5 Flash - Fast, cost-effective multimodal model
const GEMINI_1_5_FLASH: LLM = {
  modelId: "gemini-1.5-flash",
  modelName: "Gemini 1.5 Flash",
  provider: "google",
  hostedId: "gemini-1.5-flash",
  platformLink: GOOGLE_PLATORM_LINK,
  imageInput: true
}

// Gemini 1.0 Pro - Best for text-only tasks
const GEMINI_PRO: LLM = {
  modelId: "gemini-pro",
  modelName: "Gemini 1.0 Pro",
  provider: "google",
  hostedId: "gemini-pro",
  platformLink: GOOGLE_PLATORM_LINK,
  imageInput: false
}

// Gemini 1.0 Pro Vision - Image and video understanding
const GEMINI_PRO_VISION: LLM = {
  modelId: "gemini-pro-vision",
  modelName: "Gemini 1.0 Pro Vision",
  provider: "google",
  hostedId: "gemini-pro-vision",
  platformLink: GOOGLE_PLATORM_LINK,
  imageInput: true
}

export const GOOGLE_LLM_LIST: LLM[] = [
  GEMINI_2_5_PRO,
  GEMINI_2_5_FLASH,
  GEMINI_2_0_FLASH,
  GEMINI_1_5_PRO,
  GEMINI_1_5_FLASH,
  GEMINI_PRO,
  GEMINI_PRO_VISION
]
