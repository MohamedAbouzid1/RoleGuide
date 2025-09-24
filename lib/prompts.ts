export const EVALUATION_PROMPT = `
You are an expert German HR recruiter and ATS specialist.
Evaluate the following CV JSON for the German market.
Return JSON with these keys: overallScore, atsScore, redFlags[], quickWins[], sectionFeedback[], improvedBullets[], keywordsToAdd[].
Scoring rubric:
- Structure & Formatting (25%)
- Content Relevance (25%)
- Language Quality (20%)
- ATS Compatibility (20%)
- Compliance & Privacy (10%)
Use German for feedback; be concise and actionable.
CV JSON:
{{cv_json}}
`;

export const IMPROVEMENT_PROMPT = `
You are an expert German career coach specializing in CV optimization.
Analyze this CV and suggest specific improvements for the German job market.
Focus on:
1. Converting weak bullet points to STAR format
2. Adding industry-relevant keywords
3. Quantifying achievements
4. Improving action verbs
5. Ensuring ATS compatibility

Return structured suggestions in German.
CV JSON:
{{cv_json}}
`;

export const BULLET_REWRITE_PROMPT = `
Rewrite this CV bullet point using the STAR method (Situation, Task, Action, Result).
Make it:
- Start with a strong action verb in German
- Include quantifiable results where possible
- Be concise (max 150 characters)
- Industry-specific and professional

Original: {{bullet}}
Context: {{role}} at {{company}}
`;

export const KEYWORD_EXTRACTION_PROMPT = `
Based on this job role and CV, suggest relevant keywords for the German job market.
Consider:
- Industry-specific technical skills
- Relevant soft skills
- Common ATS keywords
- German professional terminology

Role: {{role}}
Current skills: {{skills}}
Return as JSON array of strings.
`;