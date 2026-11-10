# n8n Workflow Setup Guide - Student Profile to Email Counselor

## Overview
This workflow automates the process of:
1. Capturing submitted student profiles from Supabase
2. Gathering all user information
3. Processing with Gemini AI to analyze profile
4. Generating personalized counselor message
5. Fetching matched universities
6. Sending comprehensive email to student

---

## Prerequisites

### 1. n8n Setup
- n8n instance running (self-hosted or n8n.cloud)
- Credentials configured for:
  - Supabase
  - Google Gemini API
  - Email service (Gmail/SMTP)

### 2. API Keys Required
- **Google Gemini API Key**: https://ai.google.dev/
- **Supabase Project**: jzggpdgvkhdescikbogq
- **SMTP/Email Service**: Gmail App Password or SMTP credentials

### 3. Database
- Supabase table: `student_profiles` (already created)
- Universities data in your `colleges.ts` (1,861 universities)

---

## Step-by-Step Workflow Setup

### Step 1: Create New Workflow in n8n

1. Go to **n8n Dashboard** → **Create New Workflow**
2. Name it: `"Student Profile to Counselor Email"`
3. Save the workflow

---

### Step 2: Add Supabase Trigger

**Node Type**: Trigger (Webhook or Polling)

Since we want to trigger on profile submission, use **Webhook**:

1. Add node → **Webhook**
2. Configure:
   - **HTTP Method**: POST
   - **Path**: `/student-profile-submitted`
   - Get the webhook URL (e.g., `https://your-n8n.com/webhook/...`)

**Alternative: Use Supabase Realtime Trigger**
- Add node → **Supabase**
- Select: **Realtime Database Events**
- Watch for INSERT on `student_profiles` table
- (Requires n8n Premium)

---

### Step 3: Fetch Complete Student Profile

**Node Type**: Supabase

After the webhook/trigger node:

1. Add node → **Supabase**
2. **Operation**: Select Rows
3. Configure:
   ```
   Table: student_profiles
   Where: user_id equals {{ $json.body.user_id }}
   ```
4. Output: Complete student profile data

**Node Name**: `Fetch Student Profile`

---

### Step 4: Parse Student Data

**Node Type**: Function (JavaScript)

This node extracts and formats all student information:

```javascript
const profile = $json.body;

const studentData = {
  personalInfo: {
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
    linkedin: profile.linkedin
  },
  academics: {
    age: profile.age,
    educationLevel: profile.education_level,
    gradingSystem: profile.grading_system,
    academicScore: profile.academic_score,
    standardizedTest: profile.standardized_test,
    testScore: profile.test_score
  },
  preferences: {
    targetCountries: profile.target_countries,
    studyLevel: profile.study_level,
    budgetMin: profile.budget_min,
    budgetMax: profile.budget_max,
    scholarshipInterest: profile.scholarship_interest,
    subjects: profile.subjects,
    extracurriculars: profile.extracurriculars,
    careerGoals: profile.career_goals
  },
  experience: {
    organization: profile.organization,
    designation: profile.designation,
    bio: profile.bio,
    skills: profile.skills
  }
};

return { studentData };
```

**Node Name**: `Parse Student Data`

---

### Step 5: Create Prompt for Gemini

**Node Type**: Function (JavaScript)

Create a detailed prompt that will be sent to Gemini:

```javascript
const data = $json.studentData;

const prompt = `You are an expert student counselor. Based on the following student profile, write a personalized, encouraging, and professional message. The message should be 3-4 paragraphs, addressing the student's academic profile, career goals, and university search strategy. Use a warm and supportive tone.

STUDENT PROFILE:
=================
Name: ${data.personalInfo.name}
Age: ${data.academics.age}
Email: ${data.personalInfo.email}

ACADEMIC BACKGROUND:
- Current Education Level: ${data.academics.educationLevel}
- Grading System: ${data.academics.gradingSystem}
- Academic Score: ${data.academics.academicScore}
- Standardized Test: ${data.academics.standardizedTest} (Score: ${data.academics.testScore})

CAREER & INTERESTS:
- Preferred Subjects: ${data.preferences.subjects.join(', ')}
- Career Goals: ${data.preferences.careerGoals || 'Not specified'}
- Extracurricular Activities: ${data.preferences.extracurriculars.join(', ') || 'Not specified'}
- Professional Experience: ${data.experience.designation || 'None specified'} at ${data.experience.organization || 'N/A'}

UNIVERSITY PREFERENCES:
- Target Countries: ${data.preferences.targetCountries.join(', ')}
- Study Level: ${data.preferences.studyLevel}
- Budget Range: $${data.preferences.budgetMin} - $${data.preferences.budgetMax}
- Scholarship Interest: ${data.preferences.scholarshipInterest ? 'Yes' : 'No'}

Please write a personalized counselor message that:
1. Acknowledges the student's achievements and interests
2. Offers specific guidance on their university search based on their profile
3. Provides encouragement and next steps
4. Mentions how the matched universities align with their goals

Make it warm, personal, and professional.`;

return { prompt };
```

**Node Name**: `Create Gemini Prompt`

---

### Step 6: Call Gemini API

**Node Type**: HTTP Request

1. Add node → **HTTP Request**
2. Configure:
   ```
   Method: POST
   URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={{ $env.GEMINI_API_KEY }}
   
   Headers:
   Content-Type: application/json
   
   Body:
   {
     "contents": [{
       "parts": [{
         "text": "{{ $json.prompt }}"
       }]
     }],
     "generationConfig": {
       "temperature": 0.7,
       "maxOutputTokens": 800
     }
   }
   ```

3. Set environment variable `GEMINI_API_KEY` in n8n

**Node Name**: `Call Gemini AI`

---

### Step 7: Parse Gemini Response

**Node Type**: Function (JavaScript)

Extract the counselor message from Gemini response:

```javascript
const response = $json.body;

if (!response.candidates || response.candidates.length === 0) {
  throw new Error('No response from Gemini API');
}

const counselorMessage = response.candidates[0].content.parts[0].text;

return { counselorMessage };
```

**Node Name**: `Parse Gemini Response`

---

### Step 8: Get Matched Universities

**Node Type**: Function (JavaScript)

This node calculates matched universities for the student:

```javascript
const data = $json.studentData;

// Import your colleges data (or fetch from database)
// This is a simplified version - you may need to load your actual data
const matchedUniversities = getMatchedUniversities(data);

function getMatchedUniversities(studentProfile) {
  // Since we can't directly import your colleges.ts in n8n,
  // either:
  // A) Store as a JSON file and load via HTTP
  // B) Query a database table with universities
  // C) Call your React app's matching algorithm via API
  
  // For now, return top 15 matched universities
  // You'll need to implement the actual matching logic
  
  return {
    safe: [], // 5 Safe matches
    target: [], // 5 Target matches
    dream: []  // 5 Dream matches
  };
}

return { matchedUniversities };
```

**Alternative: Create HTTP Endpoint in Your App**

Create an API endpoint in your React app that returns matched universities:

```javascript
// src/pages/api/get-matches.ts (or similar)
// This endpoint takes student profile data and returns matched universities
```

---

### Step 9: Format Email Body

**Node Type**: Function (JavaScript)

Create a comprehensive HTML email:

```javascript
const data = $json.studentData;
const message = $json.counselorMessage;
const matches = $json.matchedUniversities;

const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }
    .section { margin: 20px 0; padding: 15px; border-left: 4px solid #667eea; background-color: #f9f9f9; }
    .section h3 { margin-top: 0; }
    .university-list { list-style: none; padding: 0; }
    .university-item { padding: 10px; margin: 5px 0; background: white; border-radius: 4px; border-left: 4px solid #667eea; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Match Maker Path, ${data.personalInfo.name}!</h1>
      <p>Your Personalized University Counselor Message</p>
    </div>

    <div class="section">
      <h3>📚 Counselor's Message</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    </div>

    <div class="section">
      <h3>🎯 Your Matched Universities</h3>
      
      <h4>Safe Universities (Score ≥ 70)</h4>
      <ul class="university-list">
        ${matches.safe.map(u => `<li class="university-item"><strong>${u.name}</strong> - ${u.country}</li>`).join('')}
      </ul>

      <h4>Target Universities (Score ≥ 60)</h4>
      <ul class="university-list">
        ${matches.target.map(u => `<li class="university-item"><strong>${u.name}</strong> - ${u.country}</li>`).join('')}
      </ul>

      <h4>Dream Universities</h4>
      <ul class="university-list">
        ${matches.dream.map(u => `<li class="university-item"><strong>${u.name}</strong> - ${u.country}</li>`).join('')}
      </ul>
    </div>

    <div class="section">
      <h3>📊 Your Profile Summary</h3>
      <p><strong>Academic Score:</strong> ${data.academics.academicScore} (${data.academics.gradingSystem})</p>
      <p><strong>Study Level:</strong> ${data.preferences.studyLevel}</p>
      <p><strong>Target Countries:</strong> ${data.preferences.targetCountries.join(', ')}</p>
      <p><strong>Budget Range:</strong> $${data.preferences.budgetMin} - $${data.preferences.budgetMax}</p>
    </div>

    <div class="section">
      <h3>📝 Next Steps</h3>
      <ol>
        <li>Review your matched universities</li>
        <li>Visit our dashboard to explore more details: https://matchmakerpath.com/dashboard</li>
        <li>Compare universities side-by-side</li>
        <li>Track your application timeline</li>
        <li>Schedule a session with our advisors (if applicable)</li>
      </ol>
    </div>

    <div class="footer">
      <p>This is an automated message from Match Maker Path Student Counselor.</p>
      <p>For questions, reply to this email or visit our platform.</p>
      <p>&copy; 2025 Match Maker Path. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

return { emailBody };
```

**Node Name**: `Format Email Body`

---

### Step 10: Send Email

**Node Type**: Gmail or SMTP

**Option A: Using Gmail**
1. Add node → **Gmail**
2. Configure:
   - **From Email**: your-counselor@matchmakerpath.com
   - **To**: `{{ $json.studentData.personalInfo.email }}`
   - **Subject**: `Your Personalized University Counselor Report - ${studentName}`
   - **Body**: `{{ $json.emailBody }}`
   - **HTML Mode**: Toggle ON

**Option B: Using SMTP**
1. Add node → **Send Email (SMTP)**
2. Configure:
   - **Host**: smtp.gmail.com (or your SMTP server)
   - **Port**: 587 (TLS)
   - **User**: your-email@gmail.com
   - **Password**: App-specific password (not regular password)
   - **From Email**: your-counselor@matchmakerpath.com
   - **To**: `{{ $json.studentData.personalInfo.email }}`
   - **Subject**: `Your Personalized University Counselor Report`
   - **Body HTML**: `{{ $json.emailBody }}`

**Node Name**: `Send Counselor Email`

---

### Step 11: Log Success/Errors

**Node Type**: Function (JavaScript)

```javascript
return {
  timestamp: new Date().toISOString(),
  studentEmail: $json.studentData.personalInfo.email,
  status: 'success',
  message: 'Counselor email sent successfully'
};
```

**Node Name**: `Log Success`

---

## Complete Workflow Structure

```
┌─────────────────────────────────┐
│   Webhook: Profile Submitted    │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  Fetch Student Profile (Supabase)│
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│    Parse Student Data           │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  Create Gemini Prompt           │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│    Call Gemini API              │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  Parse Gemini Response          │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  Get Matched Universities       │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  Format Email Body (HTML)       │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   Send Counselor Email (SMTP)   │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│      Log Success                │
└─────────────────────────────────┘
```

---

## Triggering the Workflow

### Method 1: Webhook from Your React App

In your `OnboardingWizard.tsx`, after successful profile save:

```typescript
// After successful Supabase upsert
const webhookUrl = 'https://your-n8n-instance.com/webhook/student-profile-submitted';

await fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: userId,
    studentProfile: submissionData
  })
});
```

### Method 2: Supabase Realtime (Premium n8n)

Use Supabase's realtime feature to trigger on INSERT.

### Method 3: Database Polling

Use n8n's schedule trigger to check for new profiles every minute.

---

## Environment Variables to Set in n8n

```
GEMINI_API_KEY=sk-proj-xxxxxxxxxxxxx
SUPABASE_URL=https://jzggpdgvkhdescikbogq.supabase.co
SUPABASE_API_KEY=your-supabase-api-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
```

---

## Testing the Workflow

1. **Manual Trigger**: Use the "Test" button in n8n
2. **Sample Data**: Use your student profile as test data
3. **Check Email**: Verify email arrives correctly
4. **Debug**: Check n8n execution logs for any errors

---

## Troubleshooting

### Email Not Sending
- Check SMTP credentials
- Verify "Less secure apps" enabled (Gmail)
- Check spam folder
- Review error logs in n8n

### Gemini API Errors
- Verify API key is valid
- Check rate limits
- Ensure proper JSON formatting in request

### No Universities Matched
- Implement the actual matching algorithm
- Store universities in Supabase table or external API
- Call your React app's matching endpoint

---

## Advanced: Create Backend API Endpoint

Consider creating a dedicated API endpoint in your backend to handle:
1. University matching calculation
2. Data transformation
3. Workflow orchestration

This separates concerns and makes the workflow cleaner.

Example endpoint:
```
POST /api/workflow/generate-counselor-email
Body: { user_id, student_profile }
Response: { success, message, matched_universities }
```

---

## Security Considerations

1. **API Keys**: Store in n8n's secure environment variables
2. **Student Data**: Use HTTPS for webhook
3. **Email**: Verify sender domain
4. **Rate Limiting**: Implement to prevent abuse
5. **Authentication**: Add API key to webhook endpoint

---

## Next Steps

1. Set up n8n instance
2. Configure Gemini API key
3. Set up SMTP/Gmail credentials
4. Create workflow following steps above
5. Test with sample student data
6. Add webhook trigger in React app
7. Monitor and iterate based on results

