# n8n Workflow - Quick Start Guide

## 5-Minute Setup

### Prerequisites
- n8n account (self-hosted or n8n.cloud)
- Google Gemini API key (free at https://ai.google.dev/)
- Gmail account with app password
- Supabase project credentials

---

## Step 1: Get Your API Keys (5 mins)

### Google Gemini API Key
1. Go to https://ai.google.dev/
2. Click "Get API Key"
3. Create new project in Google Cloud
4. Generate API key
5. Copy key (keep it safe)

### Gmail App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select Mail → Windows Computer
3. Generate & copy 16-char password

### Supabase Credentials
1. Go to https://supabase.com/dashboard
2. Select your project `jzggpdgvkhdescikbogq`
3. Settings → API → Copy API Key and Project URL

---

## Step 2: Create n8n Workflow (15 mins)

### In n8n Dashboard

1. **Create New Workflow**
   - Name: "Student Profile to Counselor Email"

2. **Add Webhook Trigger**
   - Node → Webhook
   - Method: POST
   - Path: `student-profile-submitted`
   - Copy full webhook URL

3. **Add Supabase Node** (Fetch Profile)
   - Node → Supabase
   - Select Table: `student_profiles`
   - Where: user_id = {{ $json.body.user_id }}

4. **Add Function Node** (Parse Data)
   ```javascript
   const profile = $json.body;
   return {
     studentData: {
       personalInfo: {
         name: profile.name,
         email: profile.email,
         phone: profile.phone,
         address: profile.address
       },
       academics: {
         score: profile.academic_score,
         test: profile.standardized_test,
         testScore: profile.test_score
       },
       preferences: {
         countries: profile.target_countries,
         subjects: profile.subjects,
         budget: [profile.budget_min, profile.budget_max]
       }
     }
   };
   ```

5. **Add Function Node** (Create Gemini Prompt)
   - Copy code from `src/api/workflow.ts` → `generateGeminiPrompt()` function

6. **Add HTTP Request Node** (Call Gemini)
   - Method: POST
   - URL: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
   - Headers: `Content-Type: application/json`
   - Query: `key={{ $env.GEMINI_API_KEY }}`
   - Body:
     ```json
     {
       "contents": [{
         "parts": [{"text": "{{ $json.prompt }}"}]
       }],
       "generationConfig": {
         "temperature": 0.7,
         "maxOutputTokens": 800
       }
     }
     ```

7. **Add Function Node** (Parse Gemini Response)
   ```javascript
   const response = $json.body;
   const message = response.candidates[0].content.parts[0].text;
   return { counselorMessage: message };
   ```

8. **Add Function Node** (Get Matched Universities)
   - For now, return mock data or call your backend API
   ```javascript
   return {
     matchedUniversities: {
       safe: [],
       target: [],
       dream: []
     }
   };
   ```

9. **Add Function Node** (Format Email)
   - Copy `createEmailBody()` function from `src/api/workflow.ts`

10. **Add Email Node** (Send)
    - Use Gmail credentials
    - To: {{ $json.studentData.personalInfo.email }}
    - Subject: "Your Personalized University Counselor Report"
    - Body HTML: {{ $json.emailBody }}

---

## Step 3: Configure Credentials in n8n

1. **Credentials → New**
   - Type: "Environment Variables"
   - Add:
     ```
     GEMINI_API_KEY = your-gemini-key
     SUPABASE_URL = https://jzggpdgvkhdescikbogq.supabase.co
     SUPABASE_KEY = your-api-key
     GMAIL_USER = your-email@gmail.com
     GMAIL_PASSWORD = 16-char-app-password
     ```

2. **Credentials → Gmail**
   - Host: smtp.gmail.com
   - Port: 587
   - User: your-email@gmail.com
   - Password: app-password

3. **Credentials → Supabase**
   - URL: https://jzggpdgvkhdescikbogq.supabase.co
   - API Key: your-api-key

---

## Step 4: Deploy & Activate

1. Click "Save" workflow
2. Toggle "Active" to enable
3. Copy webhook URL from webhook node
4. Add to your frontend `.env`:
   ```
   VITE_N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/student-profile-submitted
   ```

---

## Step 5: Test It!

### Option A: Test in Browser
```javascript
const webhookUrl = 'https://your-n8n.com/webhook/student-profile-submitted';

fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    studentEmail: 'your-email@gmail.com',
    profileData: {
      name: 'Test Student',
      email: 'your-email@gmail.com',
      academic_score: 3.8,
      target_countries: ['USA'],
      subjects: ['Engineering'],
      // ... other fields
    }
  })
}).then(r => console.log('Triggered!'));
```

### Option B: Test from n8n
- Click "Test" in workflow
- Manual JSON input with sample data
- Click "Execute Workflow"
- Check execution logs

### Option C: Real Test
- Fill out onboarding form in your app
- Click "Submit Profile"
- Check email inbox in 30 seconds

---

## Troubleshooting Quick Fixes

| Issue | Fix |
|-------|-----|
| Webhook URL not accessible | Check n8n is running, webhook is active |
| Email not sending | Check Gmail app password, SMTP settings |
| No Gemini response | Verify API key, check quota at ai.google.dev |
| Can't find student profile | Check Supabase connection, verify table name |
| Workflow keeps failing | Check n8n execution logs for errors |

---

## Next: Add Matched Universities

Currently, matched universities return empty. To populate:

**Option 1: Backend API Endpoint**
Create endpoint: `POST /api/workflow/get-matches`
- Input: student profile
- Output: { safe: [], target: [], dream: [] }
- Call from n8n HTTP Request node

**Option 2: Direct Integration**
Import your matching algorithm directly in n8n function node

**Option 3: Database Query**
Query a `universities` table filtered by student preferences

---

## Complete Example Workflow JSON

Export this workflow template (available in documentation):
- See `N8N_WORKFLOW_SETUP.md` for complete node configurations

---

## Production Tips

✅ **Do:**
- Use environment variables for all secrets
- Test with sample data before live
- Monitor n8n execution logs
- Set up error notifications
- Rate limit webhook to prevent abuse
- Verify email signatures

❌ **Don't:**
- Store API keys in workflow
- Use personal email for sender
- Send unlimited emails
- Skip testing
- Hardcode webhook URLs

---

## Support Resources

- **n8n Docs**: https://docs.n8n.io/
- **Gemini API**: https://ai.google.dev/tutorials/
- **Supabase Docs**: https://supabase.com/docs
- **Gmail SMTP**: https://support.google.com/mail/answer/185833

---

**Estimated Time to Full Setup: 30-45 minutes**

Get your API keys → Build n8n workflow → Configure credentials → Test → Deploy

Good luck! 🚀
