# shaadi.com — University Matchmaker

An independently maintained student-to-university matching and application-planning frontend, adapted from [ishaands12/match-maker-path](https://github.com/ishaands12/match-maker-path). The repository name is playful; this project is **not affiliated with any matrimonial platform**.

## What it offers
- University discovery and profile-based matching.
- Multi-step profile onboarding, college comparisons and task tracking.
- React + TypeScript + Vite + Tailwind / shadcn UI.
- Optional Supabase persistence and counselor notification workflow.

## Improvements in this edition
- No committed \`.env\` file or private credentials; use the included \`.env.example\`.
- Guest onboarding now requires a **real Supabase anonymous Auth session**, not a generated/forged user ID.
- Counselor webhook is configurable and requires an explicit opt-in checkbox.
- Clear startup and privacy warnings, CI builds, and project-specific setup notes.

## Run locally
1. Install Node.js 20+.
2. \`npm ci\`
3. Copy \`.env.example\` to \`.env\` and set your own **public** Supabase URL and publishable key.
4. In the Supabase project, enable Anonymous Sign-Ins if you want guest onboarding.
5. \`npm run dev\` (Vite is configured on port 8080).
6. \`npm run build\` for production asset compilation.

## Data, permissions and production risks
- The university data is imported from the source project. **Do not treat the admissions statistics, tuition or rankings as verified/current**. Match percentages are heuristic, not admission probabilities.
- Inspect and enable **Row Level Security (RLS)** on every Supabase table, restricting each user's profiles and related rows to their own authenticated \`auth.uid()\`. The frontend does not replace RLS.
- Never store a Supabase service-role key in a Vite environment variable.
- By default, counselor webhook sharing is **off**. Browser-exposed webhook URLs can be abused, so route notification requests via an authenticated backend before production.
- The original backend workflow files under \`N8N_*\` / \`n8n_workflow*.json\` are reference materials and may require manual server-side configuration. The file \`src/api/workflow.ts\` is a helper, **not** a deployed Vite API route.
- This source has not been tested with live student records, Supabase configuration or n8n. Do not collect real personal information until authentication, consent and data-protection controls have been verified.

Original documentation remains available under \`N8N_*\` and \`DOCUMENTATION.md\`.
