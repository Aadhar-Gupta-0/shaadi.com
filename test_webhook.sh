#!/bin/bash

# Test n8n Workflow Webhook

WEBHOOK_URL="https://ishaandsai.app.n8n.cloud/webhook-test/student-profile-submitted"

curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user-123",
    "name": "Ishaan Test",
    "email": "test@example.com",
    "phone": "+1-555-0123",
    "address": "123 Test St, Test City",
    "linkedin": "https://linkedin.com/in/test",
    "age": 20,
    "education_level": "High School",
    "grading_system": "GPA",
    "academic_score": 3.8,
    "standardized_test": "SAT",
    "test_score": 1520,
    "target_countries": ["USA", "Canada"],
    "study_level": "Undergraduate",
    "budget_min": 20000,
    "budget_max": 80000,
    "scholarship_interest": true,
    "subjects": ["Computer Science", "Engineering"],
    "extracurriculars": ["Debate Club", "Coding Competition"],
    "career_goals": "Software Engineer at a top tech company",
    "organization": "Tech Club",
    "designation": "President",
    "bio": "Passionate about technology and innovation",
    "skills": ["Python", "JavaScript", "React"]
  }'

echo ""
echo "✅ Test webhook sent!"
