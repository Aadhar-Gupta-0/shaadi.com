# Match Maker Path - Documentation

## Quick Links
- [Setup & Database](#setup--database)
- [Personalized Matching System](#personalized-matching-system)
- [Dashboard Features](#dashboard-features)
- [n8n Workflow Integration](#n8n-workflow-integration)
- [Bug Fixes & Improvements](#bug-fixes--improvements)

---

## Setup & Database

### Initial Setup
1. Run `setup-database.sql` in Supabase SQL editor
2. Apply migration: `supabase/migrations/remove_user_id_fkey.sql`
3. See `DATABASE_MIGRATION_GUIDE.md` for detailed instructions

### Database Schema
- `student_profiles` - Stores student information and preferences
- Includes: personal info, academic profile, preferences, experience, timestamps
- RLS (Row Level Security) policies enabled

---

## Personalized Matching System

### How It Works

The matching algorithm evaluates 1,861 universities against each student's profile:

**Scoring Factors (out of 100):**
| Factor | Weight | Description |
|--------|--------|-------------|
| Country Match | 30 pts | Student's target countries |
| Subject Match | 25 pts | Preferred programs/courses |
| Budget Match | 20 pts | Tuition cost alignment |
| Academic Fit | 15 pts | Student score vs. college selectivity |
| Study Level | 10 pts | Appropriate program level |

**Matching Categories:**
- **Safe**: Score ≥70 AND Acceptance ≥50%
- **Target**: Score ≥60 OR Acceptance ≥40%
- **Dream**: Everything else (ambitious goals)

### Results
- **Top 15 universities** shown (5 Safe + 5 Target + 5 Dream)
- Sorted by personalized match score
- Updated based on user preferences

---

## Dashboard Features

### College Recommendations
- Personalized matching based on student profile
- Dynamic country filtering
- Search by college name or location
- Three match categories for risk assessment

### College Details
- View full college profile
- Programs offered
- Tuition and acceptance rates
- Scholarships available
- Housing information
- Campus vibe description

### Comparison Tool
- Compare up to 3 universities side-by-side
- Statistical analysis
- Feature comparison
- Decision support

### Tracking
- Application status tracking
- Timeline management
- Task/reminder system

---

## n8n Workflow Integration

### Automated Counselor Email System

The application integrates with n8n to automatically send personalized counselor messages to students upon profile submission.

**Workflow Steps:**
1. Student submits profile through onboarding wizard
2. n8n webhook receives submission event
3. Fetches complete student profile from Supabase
4. Processes profile with Google Gemini AI
5. AI generates personalized counselor message
6. Fetches top 15 matched universities (5 Safe + 5 Target + 5 Dream)
7. Creates professional HTML email with:
   - Personalized counselor guidance
   - Matched university recommendations
   - Profile summary
   - Next steps and actionable recommendations
8. Sends email via SMTP/Gmail

**Key Features:**
- **Personalization**: Each message is AI-generated based on individual profile
- **Smart Matching**: Universities ranked by personalized fit score
- **Professional Design**: HTML email with branding and formatting
- **Rich Content**: Includes acceptance rates, tuition, programs, world rankings
- **Action Items**: Guides students on next steps in their journey

**Setup Requirements:**
- n8n instance (self-hosted or n8n.cloud)
- Google Gemini API key (https://ai.google.dev/)
- Gmail account with app password
- Webhook trigger configuration

**For Detailed Setup:**
- See `N8N_QUICK_START.md` for 5-minute quick start
- See `N8N_WORKFLOW_SETUP.md` for comprehensive setup guide
- See `N8N_ENV_CONFIG.md` for environment configuration

**API Integration:**
- Frontend triggers webhook in `OnboardingWizard.tsx`
- `src/api/workflow.ts` exports helper functions:
  - `getMatchedUniversities()` - Get personalized university matches
  - `generateGeminiPrompt()` - Create AI prompt
  - `generateProfileSummary()` - Format student data
  - `createEmailBody()` - Generate HTML email
  - `formatMatchesForEmail()` - Format university data for display

---

## Bug Fixes & Improvements

### Issue: Matching Not Showing All Categories
**Fixed**: Updated thresholds and scoring to properly distribute Safe/Target/Dream

### Issue: Standardized Test Slider
**Fixed**: Dynamic slider ranges based on selected test type
- SAT: 400-1600
- ACT: 1-36
- GRE: 260-340
- GMAT: 200-800
- TOEFL: 0-120
- IELTS: 0-9

### Issue: College Detail & Compare Buttons
**Fixed**: 
- "View Details" → Navigates to college profile page
- "Compare" → Adds to comparison list

---

## Features

### Onboarding
- Multi-step wizard (Personal → Academic → Preferences → Review)
- Interactive form validation
- Support for multiple test types
- Budget range slider
- Subject and country selection

### Dashboard
- Personalized college recommendations
- Country filtering
- Search functionality
- Match score visualization
- College grouping by match type

### College Selection
- 1,861 universities from enriched dataset
- Dynamic categorization
- Detailed college profiles
- Comprehensive university information

### User Profiles
- Temporary (guest) and authenticated users supported
- UUID generation for temporary sessions
- Profile persistence in database
- Academic and preference tracking

---

## Technical Stack

### Frontend
- React 18.3.1
- TypeScript
- Vite 5.4.19
- React Router 6.30.1
- TanStack Query 5.83.0

### UI Components
- shadcn/ui
- Radix UI
- Tailwind CSS 3.4.17
- Lucide Icons

### Backend
- Supabase (PostgreSQL)
- Supabase Auth
- Row Level Security (RLS)

### Data
- 1,861 enriched universities
- Comprehensive data points per university
- Dynamic matching algorithm

---

## File Structure

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── Dashboard.tsx (Main dashboard)
│   │   ├── MatchCard.tsx (College card component)
│   │   ├── StatsCard.tsx (Statistics display)
│   ├── Onboarding/
│   │   ├── OnboardingWizard.tsx (Multi-step form)
│   │   ├── steps/ (Individual steps)
│   ├── ui/ (Reusable UI components)
├── pages/
│   ├── Dashboard.tsx (Dashboard page)
│   ├── Onboarding.tsx (Onboarding page)
│   ├── CollegeDetail.tsx (College profile page)
│   ├── Comparison.tsx (Comparison page)
│   ├── Home.tsx (Landing page)
├── data/
│   ├── colleges.ts (University data + matching algorithm)
│   ├── enriched_universities_data.json (1,861 universities)
├── types/
│   ├── index.ts (TypeScript interfaces)
├── integrations/
│   ├── supabase/ (Database client)
```

---

## Environment Setup

### Required Environment Variables
```env
VITE_SUPABASE_PROJECT_ID=jzggpdgvkhdescikbogq
VITE_SUPABASE_URL=https://jzggpdgvkhdescikbogq.supabase.co
```

### Local Development
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

---

## Database Migrations

### Applied Migrations
1. `20251016122207_18d9bb82-21ad-49f8-bd9d-c233d7c8b371.sql` - Initial schema
2. `remove_user_id_fkey.sql` - Allow temporary users

### To Apply New Migrations
1. Create new file: `supabase/migrations/{timestamp}_description.sql`
2. Execute in Supabase SQL editor
3. Test with both authenticated and temporary users

---

## Troubleshooting

### Only Target Matches Showing
1. Check browser console for profile loading logs
2. Verify user profile exists in `student_profiles` table
3. Ensure `target_countries` and `subjects` are populated

### Standardized Test Slider Not Updating
1. Hard refresh browser (Cmd+Shift+R)
2. Clear browser cache
3. Verify AcademicProfile component is imported correctly

### College Details Page Not Loading
1. Check URL format: `/college/{college_id}`
2. Verify college exists in dataset
3. Check for browser console errors

---

## Future Enhancements

- [ ] Machine learning for better recommendations
- [ ] Student reviews and ratings
- [ ] Virtual campus tours
- [ ] Direct college inquiries
- [ ] Application deadline tracking
- [ ] Scholarship eligibility calculator
- [ ] Alumni network data
- [ ] Career placement statistics
- [ ] Feedback-based recommendation improvement
- [ ] Multi-language support

---

## Support & Contributing

For issues or questions:
1. Check existing documentation
2. Review browser console for errors
3. Check Supabase dashboard for data issues
4. Verify environment variables are set correctly

---

**Last Updated**: October 16, 2025
