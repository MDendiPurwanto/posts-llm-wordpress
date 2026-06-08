const DEFAULT_OPENROUTER_MODEL = 'google/gemini-2.0-flash-exp:free';
const DEFAULT_OPENROUTER_SITE_URL = 'http://localhost:3000';
const DEFAULT_OPENROUTER_APP_TITLE = 'WP Content Architect';

type RawConfigInput = Record<string, unknown>;

export interface OpenRouterConfig {
  apiKey: string;
  model: string;
  siteUrl: string;
  appTitle: string;
}

export interface WordPressConfig {
  baseUrl: string;
  username: string;
  appPassword: string;
}

export interface ImageProviderConfig {
  pexelsApiKey: string;
}

function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function readEnv(name: string) {
  return readString(process.env[name]);
}

export function normalizeWordPressBaseUrl(value: unknown) {
  let url = readString(value).replace(/\/+$/, '');

  if (url.endsWith('/wp-json/wp/v2')) {
    url = url.slice(0, -'/wp-json/wp/v2'.length);
  } else if (url.endsWith('/wp-json')) {
    url = url.slice(0, -'/wp-json'.length);
  }

  return url.replace(/\/+$/, '');
}

export function getOpenRouterConfig(input: RawConfigInput = {}): OpenRouterConfig {
  return {
    apiKey: readString(input.openrouterApiKey) || readEnv('OPENROUTER_API_KEY'),
    model: readString(input.openrouterModel) || readEnv('OPENROUTER_MODEL') || DEFAULT_OPENROUTER_MODEL,
    siteUrl: readEnv('OPENROUTER_SITE_URL') || readEnv('NEXT_PUBLIC_APP_URL') || DEFAULT_OPENROUTER_SITE_URL,
    appTitle: readEnv('OPENROUTER_APP_TITLE') || DEFAULT_OPENROUTER_APP_TITLE,
  };
}

export function getWordPressConfig(input: RawConfigInput = {}): WordPressConfig {
  return {
    baseUrl: normalizeWordPressBaseUrl(input.wpApiUrl) || normalizeWordPressBaseUrl(readEnv('WORDPRESS_BASE_URL')),
    username: readString(input.wpUsername) || readEnv('WORDPRESS_USERNAME'),
    appPassword: readString(input.wpAppPassword) || readEnv('WORDPRESS_APP_PASSWORD'),
  };
}

export function getImageProviderConfig(input: RawConfigInput = {}): ImageProviderConfig {
  return {
    pexelsApiKey: readString(input.pexelsApiKey) || readEnv('PEXELS_API_KEY'),
  };
}

export function getServerConfigStatus() {
  const openRouter = getOpenRouterConfig();
  const wordpress = getWordPressConfig();
  const imageProvider = getImageProviderConfig();
  const hasOpenRouterConfig = Boolean(openRouter.apiKey && openRouter.model);
  const hasWordPressConfig = Boolean(wordpress.baseUrl && wordpress.username && wordpress.appPassword);
  const hasImageProviderConfig = Boolean(imageProvider.pexelsApiKey);

  return {
    hasOpenRouterConfig,
    hasWordPressConfig,
    hasImageProviderConfig,
    ready: hasOpenRouterConfig && hasWordPressConfig && hasImageProviderConfig,
    openrouterModel: openRouter.model,
    wpBaseUrl: wordpress.baseUrl,
  };
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}
