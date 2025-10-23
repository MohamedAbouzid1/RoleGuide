'use client';

import { CV } from './types';

// Cache for thumbnails to avoid repeated API calls
const thumbnailCache = new Map<string, string>();

/**
 * Generate a thumbnail URL by calling the backend API
 * This creates pixel-perfect thumbnails using the same PDF rendering engine
 */
export async function generateCVThumbnail(draft: any): Promise<string> {
  if (!draft || !draft.data) {
    return '/assets/cv_example/full_page.png';
  }

  const cvData = draft.data as CV;
  
  // Check if cvData has the expected structure
  if (!cvData || typeof cvData !== 'object') {
    return '/assets/cv_example/full_page.png';
  }

  // Create cache key based on CV data
  const cacheKey = `${draft.id}_${JSON.stringify(cvData)}`;
  
  // Check cache first
  if (thumbnailCache.has(cacheKey)) {
    return thumbnailCache.get(cacheKey)!;
  }

  try {
    // Call backend API to generate thumbnail
    const response = await fetch('http://localhost:4000/api/pdf/thumbnail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify(cvData),
    });

    if (!response.ok) {
      throw new Error('Failed to generate thumbnail');
    }

    const result = await response.json();
    const thumbnailUrl = `http://localhost:4000${result.thumbnail}`;
    
    // Cache the result
    thumbnailCache.set(cacheKey, thumbnailUrl);
    
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
 * This should be called when the draft is first loaded
 */
export async function preloadThumbnail(draft: any): Promise<string> {
  return await generateCVThumbnail(draft);
}
