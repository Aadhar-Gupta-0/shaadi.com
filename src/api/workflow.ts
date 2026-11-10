/**
 * API Endpoint for n8n Workflow Integration
 * Purpose: Provide matched universities and profile analysis for email generation
 * 
 * This file should be placed in your backend or use Vite API routes
 * If using Vite, create as: src/api/workflow.ts
 */

import { colleges, calculatePersonalizedMatch } from '@/data/colleges';
import type { College, AcademicProfile, Preferences } from '@/types';

/**
 * Get matched universities for a student profile
 * Called by n8n workflow to fetch matched colleges
 */
export interface StudentProfile {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  age: number;
  education_level: string;
  grading_system: string;
  academic_score: number;
  standardized_test: string;
  test_score: number;
  target_countries: string[];
  study_level: string;
  budget_min: number;
  budget_max: number;
  scholarship_interest: boolean;
  subjects: string[];
  extracurriculars: string[];
  career_goals?: string;
  organization?: string;
  designation?: string;
  bio?: string;
  skills: string[];
}

export interface MatchedUniversity {
  id: string;
  name: string;
  country: string;
  city: string;
  score: number;
  acceptance_rate: number;
  tuition: number;
  programs: string[];
  world_rank?: number;
}

export interface MatchResults {
  safe: MatchedUniversity[];
  target: MatchedUniversity[];
  dream: MatchedUniversity[];
  totalMatches: number;
}

/**
 * Main function to get matched universities
 */
export async function getMatchedUniversities(profile: StudentProfile): Promise<MatchResults> {
  try {
    // Calculate scores for all universities
    const scoredUniversities = colleges.map(college => {
      // Convert StudentProfile to format expected by calculatePersonalizedMatch
      const userProfile = {
        targetCountries: profile.target_countries,
        academicScore: profile.academic_score,
        gradingSystem: profile.grading_system,
        studyLevel: profile.study_level,
        budgetRange: [profile.budget_min, profile.budget_max] as [number, number],
        subjects: profile.subjects,
      };
      
      return {
        ...college,
        score: calculatePersonalizedMatch(college, userProfile),
      };
    });

    // Sort by score descending
    const sorted = scoredUniversities.sort((a, b) => b.score - a.score);

    // Determine match categories based on thresholds
    const getMatchType = (score: number, acceptanceRate: number) => {
      if (score >= 70 && acceptanceRate >= 0.5) return 'safe';
      if (score >= 60 || acceptanceRate >= 0.4) return 'target';
      return 'dream';
    };

    // Separate into categories
    const categorized = {
      safe: sorted.filter(u => getMatchType(u.score, u.acceptanceRate / 100) === 'safe'),
      target: sorted.filter(u => getMatchType(u.score, u.acceptanceRate / 100) === 'target'),
      dream: sorted.filter(u => getMatchType(u.score, u.acceptanceRate / 100) === 'dream'),
    };

    // Get top 5 from each category
    const results: MatchResults = {
      safe: categorized.safe.slice(0, 5).map(formatUniversity),
      target: categorized.target.slice(0, 5).map(formatUniversity),
      dream: categorized.dream.slice(0, 5).map(formatUniversity),
      totalMatches: sorted.length,
    };

    return results;
  } catch (error) {
    console.error('Error getting matched universities:', error);
    return {
      safe: [],
      target: [],
      dream: [],
      totalMatches: 0,
    };
  }
}

/**
 * Format university data for email display
 */
function formatUniversity(college: College & { score: number }): MatchedUniversity {
  return {
    id: college.id,
    name: college.name,
    country: college.country,
    city: college.location,
    score: college.score || 0,
    acceptance_rate: college.acceptanceRate || 0,
    tuition: college.tuition || 0,
    programs: college.programs || [],
    world_rank: college.ranking || undefined,
  };
}

/**
 * API Route Handler (for Vite or Node backend)
 * Endpoint: POST /api/workflow/get-matches
 */
export async function handleGetMatches(request: Request): Promise<Response> {
  try {
    const profile = await request.json() as StudentProfile;

    // Validate required fields
    if (!profile.email || !profile.name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, name' }),
        { status: 400 }
      );
    }

    // Get matched universities
    const matches = await getMatchedUniversities(profile);

    return new Response(
      JSON.stringify({
        success: true,
        data: matches,
        message: `Found ${matches.safe.length} safe, ${matches.target.length} target, and ${matches.dream.length} dream universities`,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in handleGetMatches:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}

/**
 * Generate profile summary for email
 */
export function generateProfileSummary(profile: StudentProfile): string {
  const summary = `
STUDENT PROFILE SUMMARY
======================

Personal Information:
- Name: ${profile.name}
- Email: ${profile.email}
- Age: ${profile.age}
- Location: ${profile.address}

Academic Profile:
- Education Level: ${profile.education_level}
- Grading System: ${profile.grading_system}
- Academic Score: ${profile.academic_score}
- Test Type: ${profile.standardized_test}
- Test Score: ${profile.test_score}

Career & Interests:
- Subjects of Interest: ${profile.subjects.join(', ') || 'Not specified'}
- Career Goals: ${profile.career_goals || 'Not specified'}
- Extracurricular Activities: ${profile.extracurriculars.join(', ') || 'Not specified'}

University Preferences:
- Target Countries: ${profile.target_countries.join(', ') || 'Not specified'}
- Study Level: ${profile.study_level}
- Budget Range: $${profile.budget_min} - $${profile.budget_max}
- Scholarship Interest: ${profile.scholarship_interest ? 'Yes' : 'No'}

Professional Experience:
- Designation: ${profile.designation || 'Not specified'}
- Organization: ${profile.organization || 'Not specified'}
- Skills: ${profile.skills.join(', ') || 'Not specified'}
  `.trim();

  return summary;
}

/**
 * Generate AI prompt for Gemini
 */
export function generateGeminiPrompt(profile: StudentProfile): string {
  const summary = generateProfileSummary(profile);

  return `You are an expert student counselor with 20 years of experience in university admissions. Based on the following student profile, write a personalized, encouraging, and professional message. The message should be 3-4 paragraphs, addressing the student's academic profile, career goals, and university search strategy. Use a warm and supportive tone that acknowledges their unique strengths and provides practical guidance.

${summary}

Please write a personalized counselor message that:
1. Acknowledges the student's achievements and interests
2. Offers specific, actionable guidance on their university search based on their profile
3. Provides encouragement regarding their academic and career prospects
4. Mentions how different types of universities (Safe, Target, Dream) can help achieve their goals
5. Suggests next steps in their university selection journey

Make it warm, personal, professional, and inspiring. End with an encouraging note about their future.`;
}

/**
 * Format matched universities for email display
 */
export function formatMatchesForEmail(matches: MatchResults): string {
  let html = '<h2 style="color: #667eea;">Your Matched Universities</h2>';

  if (matches.safe.length > 0) {
    html += `<h3 style="color: #28a745;">🎯 Safe Universities (Your Target Schools)</h3>
    <ul style="list-style: none; padding: 0;">
      ${matches.safe
        .map(
          u => `
      <li style="padding: 10px; margin: 5px 0; background: #f0f8ff; border-left: 4px solid #28a745; border-radius: 4px;">
        <strong>${u.name}</strong><br>
        📍 ${u.city}, ${u.country}<br>
        ✨ Match Score: ${u.score}/100 | Acceptance Rate: ${u.acceptance_rate}%<br>
        💰 Tuition: $${u.tuition.toLocaleString()}/year
      </li>
    `
        )
        .join('')}
    </ul>`;
  }

  if (matches.target.length > 0) {
    html += `<h3 style="color: #ffc107;">🎲 Target Universities (Reach Schools)</h3>
    <ul style="list-style: none; padding: 0;">
      ${matches.target
        .map(
          u => `
      <li style="padding: 10px; margin: 5px 0; background: #fffacd; border-left: 4px solid #ffc107; border-radius: 4px;">
        <strong>${u.name}</strong><br>
        📍 ${u.city}, ${u.country}<br>
        ✨ Match Score: ${u.score}/100 | Acceptance Rate: ${u.acceptance_rate}%<br>
        💰 Tuition: $${u.tuition.toLocaleString()}/year
      </li>
    `
        )
        .join('')}
    </ul>`;
  }

  if (matches.dream.length > 0) {
    html += `<h3 style="color: #dc3545;">🌟 Dream Universities (Ambitious Goals)</h3>
    <ul style="list-style: none; padding: 0;">
      ${matches.dream
        .map(
          u => `
      <li style="padding: 10px; margin: 5px 0; background: #ffe4e1; border-left: 4px solid #dc3545; border-radius: 4px;">
        <strong>${u.name}</strong><br>
        📍 ${u.city}, ${u.country}<br>
        ✨ Match Score: ${u.score}/100 | Acceptance Rate: ${u.acceptance_rate}%<br>
        💰 Tuition: $${u.tuition.toLocaleString()}/year
      </li>
    `
        )
        .join('')}
    </ul>`;
  }

  return html;
}

/**
 * Create complete email body
 */
export function createEmailBody(
  counselorMessage: string,
  matches: MatchResults,
  profile: StudentProfile
): string {
  const matchesHtml = formatMatchesForEmail(matches);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f5f5f5; }
    .container { max-width: 700px; margin: 0 auto; background-color: white; }
    .header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      color: white; 
      padding: 40px 20px; 
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header h1 { font-size: 28px; margin-bottom: 10px; }
    .header p { font-size: 16px; opacity: 0.9; }
    .content { padding: 30px 20px; }
    .section { margin-bottom: 30px; }
    .section h2 { color: #667eea; font-size: 22px; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
    .section h3 { color: #333; font-size: 18px; margin-top: 20px; margin-bottom: 10px; }
    .message-box { 
      background-color: #f9f9f9; 
      border-left: 4px solid #667eea; 
      padding: 15px; 
      margin-bottom: 15px;
      line-height: 1.6;
      font-size: 15px;
    }
    .university-list { list-style: none; padding: 0; }
    .university-item { 
      padding: 15px; 
      margin: 10px 0; 
      background: white; 
      border-radius: 6px; 
      border-left: 4px solid #667eea;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      font-size: 14px;
      line-height: 1.6;
    }
    .university-item strong { color: #667eea; font-size: 16px; }
    .university-item p { margin: 5px 0; color: #666; }
    .profile-summary {
      background-color: #f0f0f0;
      padding: 15px;
      border-radius: 6px;
      font-size: 14px;
      line-height: 1.6;
    }
    .profile-summary p { margin: 5px 0; }
    .next-steps { 
      background-color: #e3f2fd; 
      border-left: 4px solid #2196F3; 
      padding: 15px; 
      margin-top: 20px;
      border-radius: 4px;
    }
    .next-steps ol { margin-left: 20px; }
    .next-steps li { margin: 8px 0; }
    .cta-button {
      display: inline-block;
      background-color: #667eea;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 6px;
      margin: 15px 0;
      font-weight: bold;
      text-align: center;
    }
    .footer { 
      background-color: #f5f5f5; 
      padding: 20px; 
      text-align: center; 
      font-size: 12px; 
      color: #666;
      border-top: 1px solid #ddd;
    }
    .footer p { margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 Your University Counselor Report</h1>
      <p>Welcome, ${profile.name}! Here's your personalized guidance.</p>
    </div>

    <div class="content">
      <div class="section">
        <h2>📚 Counselor's Message</h2>
        <div class="message-box">
          ${counselorMessage.replace(/\n/g, '<br>')}
        </div>
      </div>

      <div class="section">
        <h2>🎯 Your Matched Universities</h2>
        ${matchesHtml}
      </div>

      <div class="section">
        <h2>📊 Your Profile Summary</h2>
        <div class="profile-summary">
          <p><strong>Academic Score:</strong> ${profile.academic_score} (${profile.grading_system})</p>
          <p><strong>Study Level:</strong> ${profile.study_level}</p>
          <p><strong>Target Countries:</strong> ${profile.target_countries.join(', ')}</p>
          <p><strong>Budget Range:</strong> $${profile.budget_min.toLocaleString()} - $${profile.budget_max.toLocaleString()}</p>
          <p><strong>Interested Programs:</strong> ${profile.subjects.join(', ')}</p>
        </div>
      </div>

      <div class="section">
        <h2>🚀 Next Steps</h2>
        <div class="next-steps">
          <ol>
            <li><strong>Explore University Profiles:</strong> Visit each matched university's website to learn more about programs and culture</li>
            <li><strong>Review Application Requirements:</strong> Check test scores, documents, and deadlines needed</li>
            <li><strong>Prepare Your Applications:</strong> Start gathering documents and writing essays</li>
            <li><strong>Track Your Progress:</strong> Use our dashboard to track all your applications</li>
            <li><strong>Schedule a Session:</strong> Meet with our advisors for personalized guidance</li>
          </ol>
        </div>
        <center>
          <a href="https://matchmakerpath.com/dashboard" class="cta-button">View Your Dashboard</a>
        </center>
      </div>

      <div class="section">
        <h3>Understanding Your Match Types</h3>
        <p><strong>🎯 Safe Universities:</strong> Schools where your profile significantly exceeds typical admitted student profiles. High acceptance probability.</p>
        <p><strong>🎲 Target Universities:</strong> Schools that align well with your profile. Good balance of aspiration and realistic chances.</p>
        <p><strong>🌟 Dream Universities:</strong> Highly selective schools that would be excellent fits. Require strong execution in applications.</p>
      </div>
    </div>

    <div class="footer">
      <p>This is an automated message from <strong>Match Maker Path</strong> Student Counselor AI.</p>
      <p>For questions, reply to this email or visit our platform at https://matchmakerpath.com</p>
      <p>&copy; 2025 Match Maker Path. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
