'use client';

import { CV } from './types';

// Persistent cache using localStorage
const CACHE_KEY = 'cv_thumbnails_cache';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CachedThumbnail {
  url: string;
  timestamp: number;
}

function getCachedThumbnail(draftId: string): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return null;

    const parsed: Record<string, CachedThumbnail> = JSON.parse(cache);
    const cached = parsed[draftId];

    if (!cached) return null;

    // Check if cache is expired
    if (Date.now() - cached.timestamp > CACHE_EXPIRY) {
      delete parsed[draftId];
      localStorage.setItem(CACHE_KEY, JSON.stringify(parsed));
      return null;
    }

    return cached.url;
  } catch (error) {
    console.error('Error reading thumbnail cache:', error);
    return null;
  }
}

function setCachedThumbnail(draftId: string, url: string): void {
  if (typeof window === 'undefined') return;

  try {
    const cache = localStorage.getItem(CACHE_KEY);
    const parsed: Record<string, CachedThumbnail> = cache ? JSON.parse(cache) : {};

    parsed[draftId] = {
      url,
      timestamp: Date.now(),
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.error('Error writing thumbnail cache:', error);
  }
}

/**
 * Generate a thumbnail URL by calling the backend API
 * Now uses draftId for efficient caching
 */
export async function generateCVThumbnail(draft: any): Promise<string> {
  if (!draft || !draft.id || !draft.data) {
    return '/assets/cv_example/full_page.png';
  }

  const cvData = draft.data as CV;

  // Check if cvData has the expected structure
  if (!cvData || typeof cvData !== 'object') {
    return '/assets/cv_example/full_page.png';
  }

  // Check localStorage cache first
  const cachedUrl = getCachedThumbnail(draft.id);
  if (cachedUrl) {
    return cachedUrl;
  }

  try {
    // Call backend API with draftId
    const response = await fetch('http://localhost:4000/api/pdf/thumbnail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({
        draftId: draft.id,  // Pass draft ID
        cvData: cvData,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate thumbnail');
    }

    const result = await response.json();
    const thumbnailUrl = `http://localhost:4000${result.thumbnail}`;

    // Cache the result
    setCachedThumbnail(draft.id, thumbnailUrl);

    return thumbnailUrl;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return '/assets/cv_example/full_page.png';
  }
}

/**
 * Generate a thumbnail URL based on CV data
 * This creates pixel-perfect thumbnails matching the builder preview
 */
export function getCVThumbnailUrl(draft: any): string {
  if (!draft || !draft.data) {
    return '/assets/cv_example/full_page.png';
  }

  const cvData = draft.data as CV;

  // Check if cvData has the expected structure
  if (!cvData || typeof cvData !== 'object') {
    return '/assets/cv_example/full_page.png';
  }

  // For now, return a placeholder that will be replaced by the async generator
  // The CV card component should handle the async loading
  return '/assets/cv_example/full_page.png';
}

/**
 * Preload thumbnail for a draft
 */
export async function preloadThumbnail(draft: any): Promise<string> {
  return await generateCVThumbnail(draft);
}

/**
 * Clear thumbnail cache for a specific draft
 * Call this when a draft is deleted or significantly updated
 */
export function clearThumbnailCache(draftId?: string): void {
  if (typeof window === 'undefined') return;

  try {
    if (draftId) {
      // Clear specific draft
      const cache = localStorage.getItem(CACHE_KEY);
      if (!cache) return;

      const parsed: Record<string, CachedThumbnail> = JSON.parse(cache);
      delete parsed[draftId];
      localStorage.setItem(CACHE_KEY, JSON.stringify(parsed));
    } else {
      // Clear all thumbnails
      localStorage.removeItem(CACHE_KEY);
    }
  } catch (error) {
    console.error('Error clearing thumbnail cache:', error);
  }
}
