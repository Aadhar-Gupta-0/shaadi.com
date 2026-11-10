# Environment Configuration for n8n Workflow Integration

## Frontend Environment Variables (.env.local or .env)

```env
# Existing Variables
VITE_SUPABASE_PROJECT_ID=jzggpdgvkhdescikbogq
VITE_SUPABASE_URL=https://jzggpdgvkhdescikbogq.supabase.co

# New n8n Webhook Configuration
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/student-profile-submitted
```

## n8n Environment Variables

Add these to your n8n instance's environment:

### n8n Credentials Setup

1. **Google Gemini API**
   - Go to: https://ai.google.dev/
   - Create API key
   - In n8n: Create credential → Google Gemini → Add API Key

2. **Supabase**
   - Project ID: `jzggpdgvkhdescikbogq`
   - API Key: Get from Supabase dashboard → Settings → API
   - URL: `https://jzggpdgvkhdescikbogq.supabase.co`
   - In n8n: Create credential → Supabase → Add details

3. **Gmail / SMTP**
   ```
   Host: smtp.gmail.com
   Port: 587
   Email: your-email@gmail.com
   Password: your-app-specific-password (NOT your regular password)
   ```
   
   **To get Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select: Mail and Windows Computer
   - Copy the generated 16-character password
   - Use this in n8n SMTP configuration

## Webhook URL Structure

After creating the Supabase trigger webhook in n8n, you'll get a URL like:

```
https://your-instance-id.n8n.cloud/webhook/student-profile-submitted
```

Or if self-hosted:

```
https://your-domain.com/webhook/student-profile-submitted
```

Update `VITE_N8N_WEBHOOK_URL` with this value.

## Testing the Webhook

### 1. Test from cURL

```bash
curl -X POST https://your-n8n-instance.com/webhook/student-profile-submitted \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "studentEmail": "student@example.com",
    "profileData": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": "123 Main St, City, State",
      "age": 18,
      "education_level": "High School",
      "grading_system": "GPA",
      "academic_score": 3.8,
      "standardized_test": "SAT",
      "test_score": 1450,
      "target_countries": ["USA", "Canada"],
      "study_level": "Undergraduate",
      "budget_min": 30000,
      "budget_max": 70000,
      "scholarship_interest": true,
      "subjects": ["Computer Science", "Engineering"],
      "extracurriculars": ["Robotics", "Debate"],
      "career_goals": "Software Engineer",
      "organization": null,
      "designation": null,
      "bio": null,
      "skills": ["Python", "JavaScript"]
    }
  }'
```

### 2. Test from Browser

Open browser console and run:

```javascript
const webhookUrl = 'https://your-n8n-instance.com/webhook/student-profile-submitted';

const testData = {
  user_id: '550e8400-e29b-41d4-a716-446655440000',
  studentEmail: 'test@example.com',
  profileData: {
    name: 'Test Student',
    email: 'test@example.com',
    phone: '+1234567890',
    address: '123 Test St',
    age: 18,
    education_level: 'High School',
    grading_system: 'GPA',
    academic_score: 3.5,
    standardized_test: 'SAT',
    test_score: 1300,
    target_countries: ['USA'],
    study_level: 'Undergraduate',
    budget_min: 20000,
    budget_max: 50000,
    scholarship_interest: true,
    subjects: ['Engineering'],
    extracurriculars: ['Sports'],
    career_goals: 'Engineer',
    skills: ['Mathematics']
  }
};

fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testData)
})
  .then(res => res.json())
  .then(data => console.log('Response:', data))
  .catch(err => console.error('Error:', err));
```

## Troubleshooting

### Issue: Webhook not triggering
1. Verify webhook URL is correct in `.env`
2. Check n8n instance is running
3. Look at n8n execution logs
4. Verify webhook is active (has blue dot in n8n)

### Issue: Gemini API errors
1. Verify API key is correct
2. Check rate limits: https://ai.google.dev/usage
3. Ensure request format is valid

### Issue: Email not sending
1. Check Gmail app password is correct
2. Enable "Less secure apps": https://myaccount.google.com/lesssecureapps
3. Verify SMTP settings in n8n
4. Check spam folder for test emails

### Issue: No matched universities returned
1. Verify colleges data is loaded
2. Check calculatePersonalizedMatch function
3. Test with sample student profile
4. Check console logs for errors

## Email Testing

To test the email generation without n8n:

```typescript
// Import the workflow functions
import { 
  generateGeminiPrompt, 
  formatMatchesForEmail,
  createEmailBody 
} from '@/api/workflow';

// Create a test student profile
const testProfile = {
  user_id: 'test-123',
  name: 'Test Student',
  email: 'test@example.com',
  // ... rest of profile
};

// Generate prompt
const prompt = generateGeminiPrompt(testProfile);

// Get matches (using your matching algorithm)
const matches = await getMatchedUniversities(testProfile);

// Format for email
const emailHtml = formatMatchesForEmail(matches);

// Create complete email
const emailBody = createEmailBody(
  'Your AI counselor message here',
  matches,
  testProfile
);

// Log to verify
console.log(emailBody);
```

## Production Checklist

- [ ] n8n instance deployed and running
- [ ] All API keys configured in environment
- [ ] Webhook URL matches between .env and n8n
- [ ] Gmail/SMTP credentials verified
- [ ] Test email sent successfully
- [ ] Workflow tested with sample data
- [ ] Error handling implemented
- [ ] Rate limiting configured
- [ ] CORS headers set if needed
- [ ] Security: Verify origin in webhook (optional)
- [ ] Monitor n8n execution logs
- [ ] Set up alerts for failed workflows

## Sample Workflow Execution Log

```
Webhook triggered ✓
├── User ID: 550e8400-e29b-41d4-a716-446655440000
├── Email: john@example.com
│
├── Fetch Student Profile ✓
│   └── Found profile in Supabase
│
├── Parse Student Data ✓
│   └── Extracted 20+ fields
│
├── Create Gemini Prompt ✓
│   └── Generated detailed prompt
│
├── Call Gemini API ✓
│   └── Received counselor message (487 characters)
│
├── Parse Gemini Response ✓
│   └── Successfully extracted message
│
├── Get Matched Universities ✓
│   ├── Safe: 5 universities
│   ├── Target: 5 universities
│   └── Dream: 5 universities
│
├── Format Email Body ✓
│   └── Generated HTML email (12KB)
│
├── Send Email (SMTP) ✓
│   └── Email sent to john@example.com
│
└── Log Success ✓
    └── Workflow completed in 8.234 seconds
```
