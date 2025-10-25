const crypto = require('crypto');

/**
 * Generate content hash for CV data
 * Only hashes fields that affect thumbnail appearance
 * This ensures thumbnails are regenerated only when visible content changes
 */
function generateContentHash(cvData) {
  if (!cvData || typeof cvData !== 'object') {
    return null;
  }

  // Only include fields that appear in thumbnails
  const relevantData = {
    personal: {
      fullName: cvData.personal?.fullName,
      role: cvData.personal?.role,
      email: cvData.personal?.email,
      phone: cvData.personal?.phone,
      location: cvData.personal?.location,
    },
    profile: typeof cvData.profile === 'string' ? cvData.profile.slice(0, 200) : cvData.profile, // First 200 chars only if string
    experience: Array.isArray(cvData.experience) ? cvData.experience.slice(0, 2).map(exp => ({
      jobTitle: exp.jobTitle,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate,
    })) : [],
    education: Array.isArray(cvData.education) ? cvData.education.slice(0, 1).map(edu => ({
      degree: edu.degree,
      institution: edu.institution,
      startDate: edu.startDate,
      endDate: edu.endDate,
    })) : [],
  };

  // Generate MD5 hash
  return crypto
    .createHash('md5')
    .update(JSON.stringify(relevantData))
    .digest('hex');
}

/**
 * Sanitize filename to prevent path traversal and special characters
 */
function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9_\-\.]/gi, '_');
}

module.exports = {
  generateContentHash,
  sanitizeFilename,
};
