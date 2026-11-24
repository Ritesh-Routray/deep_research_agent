// Config file for the project
import { config as dotenvConfig } from "dotenv";
import { tavily } from "@tavily/core";

// Load environment variables from .env file
dotenvConfig();

/**
 * Read a positive integer from the environment, falling back to a default
 * when the variable is unset, empty, or not a valid positive integer.
 */
function intFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    console.warn(
      `Invalid value for ${name}="${raw}"; using default ${fallback}.`,
    );
    return fallback;
  }
  return parsed;
}

// Initialize the Tavily client
export const tavilyClient = tavily({
  apiKey: process.env.TAVILY_API_KEY || "",
});

export const maxConcurrentResearchUnits = intFromEnv(
  "MAX_CONCURRENT_RESEARCH_UNITS",
  3,
);
export const maxResearcherIterations = intFromEnv(
  "MAX_RESEARCHER_ITERATIONS",
  6,
);
export const tavilyMaxResults = intFromEnv("TAVILY_MAX_RESULTS", 3);

export const modelSecrets = {
  gpt41: {
    apiKey: process.env.AZURE_OPENAI_API_KEY!,
    apiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME_4_1!,
    apiVersion: process.env.AZURE_OPENAI_API_VERSION_4_1!,
    apiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME!,
  },
  gpt41Mini: {
    apiKey: process.env.AZURE_OPENAI_API_KEY!,
    apiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME_4_1_MINI!,
    apiVersion: process.env.AZURE_OPENAI_API_VERSION_4_1_MINI!,
    apiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME!,
  },
};

const REQUIRED_ENV = [
  "TAVILY_API_KEY",
  "AZURE_OPENAI_API_KEY",
  "AZURE_OPENAI_API_INSTANCE_NAME",
  "AZURE_OPENAI_API_DEPLOYMENT_NAME_4_1",
  "AZURE_OPENAI_API_VERSION_4_1",
  "AZURE_OPENAI_API_DEPLOYMENT_NAME_4_1_MINI",
  "AZURE_OPENAI_API_VERSION_4_1_MINI",
];

/**
 * Warn (without throwing, so graph introspection still works) about any
 * required environment variables that are missing.
 */
export function checkRequiredEnv(): string[] {
  const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    console.warn(
      `Missing required environment variables: ${missing.join(", ")}. ` +
        "Copy .env.example to .env and fill them in.",
    );
  }
  return missing;
}

checkRequiredEnv();
