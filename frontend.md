# AI Review Intelligence Platform - Frontend Master Prompt

You are a Senior React Architect and Product UI Engineer.

Build a modern analytics dashboard for an AI Review Intelligence Platform.

The frontend consumes the Express backend APIs.

Do NOT generate mock data.

Everything should be API-driven.

---

# Tech Stack

* React
* Vite
* TypeScript
* TailwindCSS
* React Router
* TanStack Query
* Axios
* Recharts
* shadcn/ui

---

# Folder Structure

src/

components/

pages/

layouts/

hooks/

services/

types/

utils/

constants/

contexts/

assets/

App.tsx

main.tsx

---

# Application Flow

User opens application

↓

Dashboard Home

↓

Load Reviews

↓

Analyze Reviews

↓

Progress Screen

↓

Dashboard

---

# Routing

/

Dashboard

/reviews

/insights

/recommendations

/settings

---

# Layout

Top Navigation

Sidebar

Main Content

Responsive Design

Dark Mode Ready

---

# Dashboard

Show KPI Cards

* Total Reviews
* Positive
* Neutral
* Negative
* Average Rating

---

# Charts

Sentiment Pie Chart

Theme Bar Chart

Pain Point Bar Chart

Emotion Distribution

Source Distribution

Category Distribution

Trend Chart

---

# Filters

Review Source

* Reddit
* Play Store
* App Store
* X
* Community

Date Range

Rating

Keyword Search

Sentiment

Theme

Emotion

---

# Progress Screen

Display backend progress.

Stages

Loading Reviews

Cleaning Reviews

Analyzing Reviews

Generating Statistics

Generating Insights

Completed

Poll

GET /api/status

every few seconds.

---

# Review Explorer

Table

Columns

* Source
* Rating
* Review
* Sentiment
* Theme
* Date

Click review

Open Side Panel

Show

Original Review

Summary

Themes

Pain Points

Emotion

Feature Requests

Shopping Habit

Barrier

Confidence

---

# Insights Page

Display the 8 generated business answers.

Each card should contain

Question

Answer

Confidence

Supporting Review IDs

---

# Recommendations Page

Sections

Quick Wins

Medium Priority

High Priority

Long-Term Opportunities

---

# API Layer

Create a dedicated API service.

Never call Axios directly inside components.

Use React Query for all requests.

Implement

* loading states
* retry
* error handling

---

# Reusable Components

Button

Card

Loader

Progress Indicator

Metric Card

Chart Wrapper

Filter Panel

Table

Modal

Drawer

Badge

Empty State

Error State

---

# State Management

Use React Query.

Avoid unnecessary global state.

---

# Code Quality

Use

* TypeScript
* Reusable Components
* Custom Hooks
* Clean Folder Structure
* Responsive Layout
* Proper Error Handling
* Accessible UI

Generate the frontend module by module.

Do not skip pages, components, hooks, services, or types.

Every component should be production-ready and compile successfully.