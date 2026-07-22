# AI Review Intelligence Platform - Backend Master Prompt

You are a Senior Staff Backend Engineer and AI Architect.

Your task is to build the backend of an AI-powered Review Intelligence Platform.

This is NOT a CRUD application.

It is an AI pipeline that reads reviews from CSV files, analyzes them using an LLM, stores structured analysis, generates insights, and exposes APIs for a React dashboard.

---

# Tech Stack

* ExpressJS
* TypeScript
* Prisma
* SQLite
* OpenAI SDK (Provider interface so Claude/OpenAI can be swapped)
* Zod
* csv-parser
* dotenv

Do NOT use:

* BullMQ
* Redis
* Kafka
* RabbitMQ
* Docker
* Microservices
* RAG
* Authentication

Everything must run inside a single Express application.

---

# Project Structure

backend/

data/

* redditReviews.csv
* playStoreReviews.csv
* appStoreReviews.csv
* xReviews.csv
* communityReviews.csv

generated/

prisma/

* schema.prisma

prompts/

* review-analysis.prompt.ts
* insight-generation.prompt.ts
* recommendation.prompt.ts

src/

config/

controllers/

routes/

services/

repositories/

middlewares/

validators/

utils/

types/

constants/

lib/

app.ts

server.ts

---

# Architecture Rules

Follow SOLID principles.

Controllers should only:

* Validate request
* Call service
* Return response

Never write business logic inside controllers.

Business logic belongs inside services.

Database logic belongs inside repositories.

AI calls belong only inside AIService.

---

# Database Design

Use SQLite.

Create the following tables.

## Review

* id
* review
* rating
* source
* username
* reviewDate
* language
* createdAt

## ReviewAnalysis

* id
* reviewId
* sentiment
* emotion
* themes
* painPoints
* shoppingHabit
* barrier
* experimentLikelihood
* featureRequests
* summary
* confidence
* createdAt

Store arrays as JSON.

## DashboardCache

Store:

* Positive count
* Neutral count
* Negative count
* Theme distribution
* Emotion distribution
* Category distribution
* Pain point distribution
* Recommendation summary

## Insight

* question
* answer
* confidence
* supportingReviewIds
* createdAt

---

# CSV Loading

CSV files already exist inside

backend/data

Do NOT implement upload APIs.

Implement a loader that scans the folder automatically.

Supported files

redditReviews.csv

playStoreReviews.csv

appStoreReviews.csv

xReviews.csv

communityReviews.csv

Each source may have different column names.

Implement source-specific mapping.

Normalize everything into the Review model.

---

# Review Cleaning

Before AI analysis

Remove

* duplicate reviews
* empty reviews
* reviews with only stars
* HTML
* excessive whitespace

Normalize dates.

Detect language if possible.

---

# AI Review Analysis

Process reviews in batches of 10.

For every review extract

* Sentiment
* Emotion
* Themes
* Pain Points
* Shopping Habit
* Barrier
* Experiment Likelihood
* Feature Requests
* Summary
* Confidence

Return strict JSON.

Validate JSON before saving.

Retry once if parsing fails.

Save every analysis into SQLite.

Never analyze the same review twice unless explicitly requested.

---

# Aggregation Engine

Without using AI calculate

* Total Reviews
* Positive Reviews
* Neutral Reviews
* Negative Reviews
* Average Rating
* Source Distribution
* Theme Frequency
* Pain Point Frequency
* Emotion Frequency
* Shopping Habit Distribution
* Barrier Distribution

Store inside DashboardCache.

---

# Insight Generator

Using aggregated statistics plus representative reviews, answer:

1. Why do users repeatedly buy from the same categories?
2. What prevents users from exploring new categories?
3. How do users discover products today?
4. What role do habits play?
5. What information do users need before trying a new category?
6. What frustrations emerge repeatedly?
7. Which users experiment more?
8. What unmet needs appear consistently?

Each answer must include:

* Answer
* Confidence
* Supporting Review IDs

Save them into Insight.

---

# Recommendation Generator

Generate

* Quick Wins
* Medium Priority
* High Priority
* Long-Term Opportunities

Store recommendations.

---

# APIs

GET /api/load-reviews

Load all CSV files into SQLite.

POST /api/analyze

Run complete AI analysis.

GET /api/dashboard

Return dashboard statistics.

GET /api/insights

Return all generated insights.

GET /api/recommendations

Return recommendations.

GET /api/reviews

Return reviews with pagination and filtering.

GET /api/reviews/:id

Return review + analysis.

GET /api/themes

Return theme statistics.

GET /api/pain-points

Return pain point statistics.

GET /api/emotions

Return emotion statistics.

GET /api/categories

Return category statistics.

GET /api/status

Return current progress

Possible values

* idle
* loading
* cleaning
* analyzing
* aggregating
* generating_insights
* completed

---

# Error Handling

Implement

* Global Error Handler
* Request Validation
* Proper HTTP Status Codes
* Standard API Response Format

---

# Code Quality

Use

* TypeScript interfaces
* Dependency Injection where appropriate
* Repository Pattern
* Reusable Services
* Environment Variables
* Async/Await
* Logging
* Clean Folder Structure

Generate the backend module by module.

Do not skip any required file.

Whenever creating a service, also generate:

* interface
* implementation
* route
* controller
* repository (if needed)

Every generated file must compile.