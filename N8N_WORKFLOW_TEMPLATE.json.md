# n8n Workflow JSON Template

This file contains the complete workflow JSON that you can import directly into n8n.

## How to Import

1. In n8n, click **"Import"** in your workflow list
2. Copy the entire JSON below
3. Paste into the import dialog
4. Click "Import"
5. Add your credentials (API keys) to each node
6. Save and activate

---

## Workflow JSON

```json
{
  "name": "Student Profile to Counselor Email",
  "nodes": [
    {
      "parameters": {
        "path": "student-profile-submitted",
        "httpMethod": "POST",
        "responseMode": "onReceived"
      },
      "id": "webhook_trigger",
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "operation": "select",
        "table": "student_profiles",
        "where": {
          "parameterCount": 1,
          "parameters": [
            {
              "keyName": "user_id",
              "keyType": "name",
              "value": "={{ $json.body.user_id }}",
              "condition": "is"
            }
          ]
        }
      },
      "id": "fetch_profile",
      "name": "Fetch Student Profile",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [450, 300],
      "credentials": {
        "supabaseApi": "supabase_credentials"
      }
    },
    {
      "parameters": {
        "jsCode": "const profile = $json.body[0];\n\nconst studentData = {\n  personalInfo: {\n    name: profile.name,\n    email: profile.email,\n    phone: profile.phone,\n    address: profile.address,\n    linkedin: profile.linkedin\n  },\n  academics: {\n    age: profile.age,\n    educationLevel: profile.education_level,\n    gradingSystem: profile.grading_system,\n    academicScore: profile.academic_score,\n    standardizedTest: profile.standardized_test,\n    testScore: profile.test_score\n  },\n  preferences: {\n    targetCountries: profile.target_countries || [],\n    studyLevel: profile.study_level,\n    budgetMin: profile.budget_min,\n    budgetMax: profile.budget_max,\n    scholarshipInterest: profile.scholarship_interest,\n    subjects: profile.subjects || [],\n    extracurriculars: profile.extracurriculars || [],\n    careerGoals: profile.career_goals\n  },\n  experience: {\n    organization: profile.organization,\n    designation: profile.designation,\n    bio: profile.bio,\n    skills: profile.skills || []\n  }\n};\n\nreturn { studentData };"
      },
      "id": "parse_student_data",
      "name": "Parse Student Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [650, 300]
    },
    {
      "parameters": {
        "jsCode": "const data = $json.studentData;\n\nconst prompt = `You are an expert student counselor with 20 years of experience. Based on this student profile, write a personalized, encouraging message (3-4 paragraphs). Address their academics, goals, and university search strategy with warmth and professionalism.\n\nSTUDENT: ${data.personalInfo.name}\nAGE: ${data.academics.age}\nACADEMIC SCORE: ${data.academics.academicScore} (${data.academics.gradingSystem})\nTEST: ${data.academics.standardizedTest} (${data.academics.testScore})\nGOALS: ${data.preferences.careerGoals || 'Not specified'}\nSUBJECTS: ${data.preferences.subjects.join(', ')}\nTARGET COUNTRIES: ${data.preferences.targetCountries.join(', ')}\nBUDGET: $${data.preferences.budgetMin}-$${data.preferences.budgetMax}\n\nWrite an encouraging, personalized counselor message.`;\n\nreturn { prompt };"
      },
      "id": "create_gemini_prompt",
      "name": "Create Gemini Prompt",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [850, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
        "queryParameters": "key={{ $env.GEMINI_API_KEY }}",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": "{\n  \"contents\": [{\n    \"parts\": [{\n      \"text\": \"{{ $json.prompt }}\"\n    }]\n  }],\n  \"generationConfig\": {\n    \"temperature\": 0.7,\n    \"maxOutputTokens\": 800\n  }\n}",
        "bodyContentType": "json"
      },
      "id": "call_gemini",
      "name": "Call Gemini API",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [1050, 300]
    },
    {
      "parameters": {
        "jsCode": "const response = $json.body;\n\nif (!response.candidates || response.candidates.length === 0) {\n  throw new Error('No response from Gemini API');\n}\n\nconst counselorMessage = response.candidates[0].content.parts[0].text;\n\nreturn { counselorMessage };"
      },
      "id": "parse_gemini_response",
      "name": "Parse Gemini Response",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1250, 300]
    },
    {
      "parameters": {
        "jsCode": "// Mock matched universities\n// In production, fetch from your backend API or database\n\nconst matchedUniversities = {\n  safe: [\n    { name: \"University of California, Berkeley\", country: \"USA\", city: \"Berkeley\", score: 85, acceptance_rate: 15 },\n    { name: \"Stanford University\", country: \"USA\", city: \"Stanford\", score: 82, acceptance_rate: 3 },\n    { name: \"MIT\", country: \"USA\", city: \"Cambridge\", score: 88, acceptance_rate: 4 },\n    { name: \"Harvard University\", country: \"USA\", city: \"Cambridge\", score: 86, acceptance_rate: 3 },\n    { name: \"Yale University\", country: \"USA\", city: \"New Haven\", score: 84, acceptance_rate: 4 }\n  ],\n  target: [\n    { name: \"University of Toronto\", country: \"Canada\", city: \"Toronto\", score: 72, acceptance_rate: 20 },\n    { name: \"University of British Columbia\", country: \"Canada\", city: \"Vancouver\", score: 70, acceptance_rate: 23 },\n    { name: \"McGill University\", country: \"Canada\", city: \"Montreal\", score: 71, acceptance_rate: 24 },\n    { name: \"University of Waterloo\", country: \"Canada\", city: \"Waterloo\", score: 68, acceptance_rate: 30 },\n    { name: \"University of Alberta\", country: \"Canada\", city: \"Edmonton\", score: 65, acceptance_rate: 32 }\n  ],\n  dream: [\n    { name: \"Oxford University\", country: \"UK\", city: \"Oxford\", score: 55, acceptance_rate: 2 },\n    { name: \"Cambridge University\", country: \"UK\", city: \"Cambridge\", score: 54, acceptance_rate: 2 },\n    { name: \"Imperial College London\", country: \"UK\", city: \"London\", score: 58, acceptance_rate: 8 },\n    { name: \"ETH Zurich\", country: \"Switzerland\", city: \"Zurich\", score: 52, acceptance_rate: 5 },\n    { name: \"National University of Singapore\", country: \"Singapore\", city: \"Singapore\", score: 60, acceptance_rate: 25 }\n  ]\n};\n\nreturn { matchedUniversities };"
      },
      "id": "get_matched_unis",
      "name": "Get Matched Universities",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1450, 300]
    },
    {
      "parameters": {
        "jsCode": "const data = $json.studentData;\nconst message = $json.counselorMessage;\nconst matches = $json.matchedUniversities;\n\nconst formatUni = (u) => `\n  <li style=\"padding: 15px; margin: 10px 0; background: white; border-left: 4px solid #667eea; border-radius: 4px;\">\n    <strong>${u.name}</strong><br>\n    📍 ${u.city}, ${u.country}<br>\n    ✨ Match Score: ${u.score}/100 | Acceptance: ${u.acceptance_rate}%\n  </li>\n`;\n\nconst emailBody = `\n<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"UTF-8\">\n  <style>\n    body { font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; color: #333; }\n    .container { max-width: 700px; margin: 0 auto; background: white; }\n    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }\n    .content { padding: 30px 20px; }\n    .section { margin-bottom: 30px; }\n    .message-box { background: #f9f9f9; border-left: 4px solid #667eea; padding: 15px; margin-bottom: 15px; line-height: 1.6; }\n    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; }\n  </style>\n</head>\n<body>\n  <div class=\"container\">\n    <div class=\"header\">\n      <h1>🎓 Your University Counselor Report</h1>\n      <p>Welcome, ${data.personalInfo.name}! Here's your personalized guidance.</p>\n    </div>\n    \n    <div class=\"content\">\n      <div class=\"section\">\n        <h2>📚 Counselor's Message</h2>\n        <div class=\"message-box\">\n          ${message.replace(/\\n/g, '<br>')}\n        </div>\n      </div>\n      \n      <div class=\"section\">\n        <h2>🎯 Your Matched Universities</h2>\n        \n        <h3>Safe Universities</h3>\n        <ul style=\"list-style: none; padding: 0;\">\n          ${matches.safe.map(formatUni).join('')}\n        </ul>\n        \n        <h3>Target Universities</h3>\n        <ul style=\"list-style: none; padding: 0;\">\n          ${matches.target.map(formatUni).join('')}\n        </ul>\n        \n        <h3>Dream Universities</h3>\n        <ul style=\"list-style: none; padding: 0;\">\n          ${matches.dream.map(formatUni).join('')}\n        </ul>\n      </div>\n      \n      <div class=\"section\">\n        <h2>📊 Your Profile</h2>\n        <p><strong>Academic Score:</strong> ${data.academics.academicScore} (${data.academics.gradingSystem})</p>\n        <p><strong>Study Level:</strong> ${data.preferences.studyLevel}</p>\n        <p><strong>Target Countries:</strong> ${data.preferences.targetCountries.join(', ')}</p>\n        <p><strong>Budget:</strong> $${data.preferences.budgetMin} - $${data.preferences.budgetMax}</p>\n      </div>\n    </div>\n    \n    <div class=\"footer\">\n      <p>Match Maker Path Student Counselor</p>\n    </div>\n  </div>\n</body>\n</html>\n`;\n\nreturn { emailBody };"
      },
      "id": "format_email",
      "name": "Format Email Body",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1650, 300]
    },
    {
      "parameters": {
        "fromEmail": "={{ $env.GMAIL_EMAIL }}",
        "toEmail": "={{ $json.studentData.personalInfo.email }}",
        "subject": "Your Personalized University Counselor Report",
        "emailFormat": "html",
        "htmlBody": "={{ $json.emailBody }}"
      },
      "id": "send_email",
      "name": "Send Email",
      "type": "n8n-nodes-base.sendGrid",
      "typeVersion": 1,
      "position": [1850, 300],
      "credentials": {
        "sendGridApi": "sendgrid_credentials"
      }
    },
    {
      "parameters": {
        "jsCode": "return {\n  timestamp: new Date().toISOString(),\n  studentEmail: $json.studentData.personalInfo.email,\n  status: 'success',\n  counselorMessageLength: $json.counselorMessage.length,\n  matchCount: $json.matchedUniversities.safe.length + $json.matchedUniversities.target.length + $json.matchedUniversities.dream.length,\n  message: 'Counselor email sent successfully'\n};"
      },
      "id": "log_success",\n      "name": "Log Success",\n      "type": "n8n-nodes-base.code",\n      "typeVersion": 1,\n      "position": [2050, 300]\n    }\n  ],\n  "connections": {\n    \"webhook_trigger\": {\n      \"main\": [[{ \"node\": \"fetch_profile\", \"type\": \"main\", \"index\": 0 }]]\n    },\n    \"fetch_profile\": {\n      \"main\": [[{ \"node\": \"parse_student_data\", \"type\": \"main\", \"index\": 0 }]]\n    },\n    \"parse_student_data\": {\n      \"main\": [[{ \"node\": \"create_gemini_prompt\", \"type\": \"main\", \"index\": 0 }]]\n    },\n    \"create_gemini_prompt\": {\n      \"main\": [[{ \"node\": \"call_gemini\", \"type\": \"main\", \"index\": 0 }]]\n    },\n    \"call_gemini\": {\n      \"main\": [[{ \"node\": \"parse_gemini_response\", \"type\": \"main\", \"index\": 0 }]]\n    },\n    \"parse_gemini_response\": {\n      \"main\": [[{ \"node\": \"get_matched_unis\", \"type\": \"main\", \"index\": 0 }]]\n    },\n    \"get_matched_unis\": {\n      \"main\": [[{ \"node\": \"format_email\", \"type\": \"main\", \"index\": 0 }]]\n    },\n    \"format_email\": {\n      \"main\": [[{ \"node\": \"send_email\", \"type\": \"main\", \"index\": 0 }]]\n    },\n    \"send_email\": {\n      \"main\": [[{ \"node\": \"log_success\", \"type\": \"main\", \"index\": 0 }]]\n    }\n  }\n}\n```\n\n---\n\n## Setup Instructions for this Template\n\n### 1. Import the Workflow\n1. Copy the JSON above\n2. In n8n: Workflows → Import\n3. Paste JSON and confirm\n\n### 2. Add Credentials\nFor each node with red warning:\n\n**Supabase Node:**\n- Click \"Supabase\" credential dropdown\n- Add new: Project URL, API Key\n- Test connection\n\n**Gemini HTTP Request:**\n- Add environment variable: `GEMINI_API_KEY`\n- Set to your Google Gemini API key\n\n**Email Node:**\n- Option A: Use SendGrid (recommended)\n- Option B: Replace with SMTP node if using Gmail\n\n### 3. Configure Environment Variables\nAdd to n8n environment:\n```\nGEMINI_API_KEY=sk-proj-xxxxx\nGMAIL_EMAIL=your-email@gmail.com\n```\n\n### 4. Test\n1. Click \"Test\" workflow\n2. Provide test data\n3. Check execution\n4. Verify email received\n\n### 5. Deploy\n1. Save workflow\n2. Click toggle to activate\n3. Copy webhook URL\n4. Add to frontend `.env`\n\n---\n\n## Manual Node Setup (if import fails)\n\nIf importing the JSON doesn't work, manually create 10 nodes following the connections:\n\n```\nWebhook → Supabase → Parse → CreatePrompt → Gemini → Parse → Universities → Format → Send → Log\n```\n\nDetailed configuration in `N8N_WORKFLOW_SETUP.md`\n\n---\n\n**Note:** This template uses SendGrid for email. To use Gmail SMTP instead, replace the \"Send Email\" node with \"n8n-nodes-base.sendgmailn8n\" and update credentials.\n"
