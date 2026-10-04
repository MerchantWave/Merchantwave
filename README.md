#MerchantWave_OSC_MerchantWave_Team Project. Repo

---

# MerchantWave: AI-Powered Merchant Intelligence Platform

Developed for the **Orange Summer Challenge 2026** (Orange Digital Center Liberia).

---

## Overview & Vision

Over 40% of registered Orange Money merchants in Liberia experience dormancy or inactivity within 90 days of onboarding. This occurs because micro-merchants lack simple, real-time financial bookkeeping tools, leading to unpredicted cash shortages and record loss. Simultaneously, telecomm field agents lack geographic visibility into merchant status, causing interventions to happen too late.

**MerchantWave** bridges this technical divide by delivering an edge-hosted, mobile-first Progressive Web Application (PWA) that combines a simplified daily ledger, an AI-powered voice assistant, and an interactive satellite map routing field agents directly to at-risk merchants.

---

## Key Features

* **Interactive Merchant Network Map:** High-resolution Google Hybrid/Satellite view tracking over 160 geolocated merchants across Liberian commercial hubs (such as Red Light, Duala, and Waterside), complete with color-coded status pins and turn-by-turn routing.


* **Simplified Financial Ledger:** Rapid logging of daily sales, business expenses, and Orange Money cash-in/cash-out transactions with live balance recalculations.


* **AI Intelligence & Voice Assistant:** Gemini-powered root-cause dormancy analysis, churn prediction, and Next-Best-Action recommendations, paired with browser WAV audio recording and transcription.


* **Admin Database Hub:** Real-time nationwide merchant fleet monitoring, coordinates inspection tables, and activity audits.


* **Accessible & Adaptive Design:** Dual Dark/Light theme switching, clean typography optimized for low-end mobile viewports, and multi-language support.



---

## Tech Stack

* **Frontend:** TanStack Start v1 (Full-stack React 19, TypeScript), Tailwind CSS v4, Lucide React icons.


* **Backend & Server Logic:** Edge server functions (`createServerFn`) via TanStack React Start, server API routes, and secure RPC layers.


* **Database & Security:** Lovable Cloud (PostgreSQL 15) featuring strict Row-Level Security (RLS) tenant isolation and Role-Based Access Control (`admin`, `field_agent`, `merchant`).


* **Mapping:** Google Maps JavaScript SDK (Hybrid Satellite view), Geocoding, and Directions API.


* **AI Engine:** Lovable AI Gateway connected to the Google Gemini model for multimodal voice-to-text pipelines and reasoning.



---

## System Architecture

``text
[Client Browser: PWA Mobile / Field Tablet / Desktop Console]
                         │
                         ▼ (HTTPS / TLS 1.3)
         [TanStack Start Serverless Backend]
            ├── Server Functions & RPC Layer
            └── API Routes (/api/transcribe)
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
[Lovable Cloud]  [Lovable AI Gateway]  [Google Maps API]
(PostgreSQL 15)   (Google Gemini)      (Satellite / Routing)
+ RLS Security    + Voice Transcription + Geocoding SDK

``


## Commit History Milestones

* `feat(init):` Initial TanStack Start v1 scaffold, Tailwind v4 design system, and custom color palette.


* `feat(auth):` Username/password authentication, privacy consent agreement (`share_with_orange_money`), and profile generation.


* `feat(ledger):` Real-time transaction schema, CRUD operations, and cash-flow recalculation.


* `feat(maps):` Integrated Google Maps JavaScript API, satellite imagery, and geocoding proxy functions.


* `feat(seed):` Seeded 160+ realistic merchant locations across Liberian commercial districts.


* `feat(ai):` Integrated Lovable AI Gateway for merchant intelligence reasoning and Next-Best-Action logic.


* `feat(voice):` Added browser WAV audio recording and `/api/transcribe` endpoint.


* `feat(security):` Implemented RBAC `user_roles` table, `has_role()` security definer, and hardened RLS policies.


* `feat(ux):` Reordered navigation to put the Merchant Network first, added Admin Database view, Dark/Light theme toggle, and multilingual dictionary.



---

## Agile Project Board Status

* **Done / Validated:**
* Fast transaction logging with live balance display.


* Interactive satellite map with color-coded pins and distance sorting.


* Voice recording and transcription for AI assistant inquiries.


* Admin database screen with coordinate inspection table.


* Role-Based Access Control protecting merchant customer data.


* Dark and Light theme switcher with local preference storage.


* **In Progress:**
* Field agent route optimization for multi-stop merchant visits.


* **Backlog:**
* USSD fallback bridge for non-smartphone merchants.


* Automated weekly SMS revenue summary.


---

## License & Team

Developed with ❤️ for the Orange Digital Center Liberia Developer Track.MerchantWave/Merchantwave** is a ✨ _special_ ✨ repository because its `README.md` (this file) appears on your GitHub profile.

Here are some ideas to get you started:

- 🔭 I’m currently working on ..MerchantWave
- 👯 I’m looking to collaborate on ...MerchantWave
-->
