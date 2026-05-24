# HireIQ — AI Resume Screening & Candidate Ranking System 🎯

![HireIQ Banner](https://img.shields.io/badge/AI--Powered-Recruitment%20Intelligence-6c63ff?style=for-the-badge&logo=probot)
![Version](https://img.shields.io/badge/Version-2.0--Capstone-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Capstone_Project-orange?style=for-the-badge)

**HireIQ** is a premium, client-side, AI-driven resume screening and candidate ranking application. Designed for modern recruitment pipelines, HireIQ leverages Natural Language Processing (NLP) concepts—specifically Term Frequency-Inverse Document Frequency (TF-IDF) and Cosine Similarity—to match resumes against job descriptions, audit for bias, and present insights through a high-performance Glassmorphism dashboard.

---

## 📖 Table of Contents
1. [Key Features & Capabilities](#-key-features--capabilities)
2. [System Architecture & File Directory](#%EF%B8%8F-system-architecture--file-directory)
3. [Deep Dive: The AI Match & Scoring Engine](#-deep-dive-the-ai-match--scoring-engine)
4. [Bias Detection & Fairness Audit System](#-bias-detection--fairness-audit-system)
5. [User Interface & Page-by-Page Breakdown](#-user-interface--page-by-page-breakdown)
6. [Tech Stack & Design Decisions](#%EF%B8%8F-tech-stack--design-decisions)
7. [Installation & Getting Started](#-installation--getting-started)
8. [Deployment Guide](#-deployment-guide)

---

## ✨ Key Features & Capabilities

### 🤖 1. AI Resume Parsing
- **Format Support:** Simulates extraction of skills, work history, education, and credentials from PDF, DOCX, TXT, and RTF formats.
- **Section Parsing:** Separates resumes into structured records containing education history, experience duration, previous employers, roles, and certification lists.

### 🧮 2. TF-IDF & Cosine Similarity Engine
- **Algorithmic Ranking:** Compares candidate profiles with job description criteria using token matching and TF-IDF weights to compute a precise similarity coefficient.
- **Matched & Missing Skills:** Provides recruiters with immediate visual cues on which required skills a candidate has and which ones they are missing (Skill Gap Analysis).

### ⚖️ 3. Customizable Factor Weights
- **Flexible Priority Control:** Allows recruiters to configure the emphasis of 5 distinct dimensions contributing to the final score:
  - **Skill Match** (technical proficiency matching the JD)
  - **Experience Level** (proximity to target experience duration)
  - **Education Level** (degree tier and institution alignment)
  - **Keyword Density** (cosine similarity of resume summary to JD text)
  - **Certifications** (number of relevant credentials)

### 🛡️ 4. AI Bias Auditing
- **Parity Tracking:** Audits evaluations across 4 potential bias areas: University Prestige Bias, Company Brand Bias, Name-based Bias, and Career Gap Penalization.
- **Fairness Recommendations:** Flags risk tiers (Low, Medium, High) and suggests immediate actions, such as normalizing company name weights or reducing experience gap penalties.

### 📊 5. Pipeline Analytics & Insights
- **Funnel Visualizations:** Displays peak activity graphs, average candidate match scores, qualification brackets, and common skill gap frequencies.
- **Actionable Advice:** Automatically provides upskilling advice for rejected candidates and interview readiness recommendations for top candidates.

---

## 🛠️ System Architecture & File Directory

HireIQ is built as a modular, lightweight **Single Page Application (SPA)** that runs entirely on the client side. Below is the directory structure:

```bash
HireIQ-v3.3-Organized/
│
├── index.html            # Main SPA entrypoint: defines templates, layouts, and modals
├── README.md             # Project documentation & algorithm guide
├── .gitignore            # Git exclusion rules
│
├── css/
│   └── style.css         # Styling system: HSL variables, dark/light themes, Glassmorphism CSS
│
├── js/
│   └── app.js            # Core application state, scoring engine, parsing logic, and navigation
│
└── assets/               # Local static icons, media assets, and SVGs (if applicable)
```

---

## 🔬 Deep Dive: The AI Match & Scoring Engine

### 1. Skill Match Scoring
The system tokenizes both the job description's target skills ($S_{job}$) and the candidate's parsed resume skills ($S_{res}$). It computes a match score:
- **Direct Match:** Exact token match (e.g., "React" in resume matches "React" in JD).
- **Partial Match:** Case-insensitive substring matching (e.g., "AWS Cloud" partially matches "AWS").
- **Score Formulation:**
  $$\text{Skill Score} = \min\left(100, \frac{|S_{job} \cap S_{res}|}{|S_{job}|} \times 100 + |S_{res\_partial}| \times 10\right)$$

### 2. Experience Match Scoring
Matches candidate experience ($E_{res}$) with target experience tier of the job ($E_{job}$):
- Target experience durations are mapped as follows: **Fresher** ($1\text{ year}$), **Mid-Level** ($3\text{ years}$), **Senior** ($6\text{ years}$), **Lead** ($9\text{ years}$).
- **Score Formulation:**
  $$\text{Experience Score} = \max\left(0, 100 - |E_{res} - E_{job}| \times 10\right)$$

### 3. Keyword Density (Cosine Similarity Simulation)
Measures semantic alignment by calculating common text terms between the Candidate Summary ($W_{res}$) and the Job Description text ($W_{job}$):
$$\text{Keyword Score} = \min\left(100, \frac{|W_{res} \cap W_{job}|}{|W_{res}|} \times 300\right)$$

### 4. Weighted Composite Score
Recruiters set five custom weights $W = [w_{skills}, w_{exp}, w_{edu}, w_{keywords}, w_{certs}]$. The final score is calculated dynamically:
$$\text{Composite Score} = \frac{S_{skills}w_{skills} + S_{exp}w_{exp} + S_{edu}w_{edu} + S_{keywords}w_{keywords} + S_{certs}w_{certs}}{\sum W}$$

---

## 🛡️ Bias Detection & Fairness Audit System

To prevent AI screening systems from magnifying human biases, HireIQ has a built-in **Fairness & Bias Audit Dashboard**. It tracks four categories:

| Bias Type | Calculation / Metric | Description | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **University Prestige** | Institution keyword detection (`iit`, `bits`, `nit`, `iim`, etc.) | Detects if graduates from elite institutes get skewed higher scores. | Anonymize education names / lower education weight. |
| **Company Brand** | Target brand checks (Fortune 500 names) | Flags over-indexing on candidates coming from highly recognized firms. | Normalize brand keywords in parsing. |
| **Name-based Bias** | Name token exclusion | Checks if candidate names alter the score. | **Scoring is name-blind** (name fields are excluded from math). |
| **Experience Gap** | Career gap timeline penalty audit | Flags high score variance for qualified candidates who have employment gaps. | Lower experience weights during configuration. |

---

## 🖥️ User Interface & Page-by-Page Breakdown

### 📊 1. Dashboard (Overview)
- **Stats Widgets:** Real-time counters showing Total Resumes, Screened, Shortlisted, and Active Jobs.
- **Pipeline Activity:** A custom SVG/CSS bar chart displaying resume upload volume by weekday.
- **Quick Action Panel:** Launch resume uploads, run screening, create job descriptions, or export analytics immediately.

### 📥 2. Upload Resumes Page
- **Drag & Drop Zone:** Drag multiple PDF, DOCX, or TXT files onto the interactive drop zone.
- **Progress Panel:** Track queue status, successfully parsed count, and average parsing speed (milliseconds/file).

### 💼 3. Job Descriptions Page
- **Creation Form:** Set Job Title, Department, Target Experience Level (Fresher, Mid, Senior), Required Skills, and description text.
- **Active Positions List:** View saved roles, check creation dates, and delete roles no longer needed.

### 🧠 4. Screen & Rank Page
- **Scoring Pipeline:** Choose a saved job description, select the pool (All vs. New), set shortlist size (Top 3, 5, 10, or All), and run.
- **Pipeline Steps UI:** Watch the step-by-step simulation run: *Parsing Content $\rightarrow$ Tokenizing $\rightarrow$ Computing TF-IDF Vectors $\rightarrow$ Calculating Similarity $\rightarrow$ Applying Custom Weights $\rightarrow$ Final Ranking*.

### 👥 5. Candidates Page
- **Global Search:** Find candidates dynamically by name, skill, email, or company.
- **Filtering & Sorting:** Filter database by job roles; sort by highest score or alphabetical name.
- **Detail Modals:** View education, certifications, parsed skill maps, missing skill gaps, and custom training recommendations.

---

## ⚙️ Tech Stack & Design Decisions

- **Frontend:** Pure HTML5 structure, styled with Custom CSS3 variables. No complex node builds required.
- **Styling Architecture:** Responsive CSS grids and flexbox layouts. Curated custom dark theme with dynamic HSL color variables (`--bg`, `--accent`, `--accent2`). Supports toggling to Light Mode seamlessly.
- **Design Paradigm:** Premium Glassmorphism UI (using `backdrop-filter: blur(16px)` and translucent borders) designed to mimic modern desktop application layouts.
- **No-Database Architecture:** State is held client-side (`state` object in JS) which enables instant search, sorting, and scoring. Data is kept fully private within the user's browser runtime.

---

## 🚀 Installation & Getting Started

Because HireIQ is a client-side SPA, there is no heavy database or local environment setup needed. You only need a local server to serve static assets correctly.

### Step 1: Clone the Repo
```bash
git clone https://github.com/lalasa-thetakali/HireIQ---AI-Resume-Screening-System.git
cd HireIQ-v3.3-Organized
```

### Step 2: Launch a Local Server
Choose one of the commands below to launch the static files:

#### Using Python (Recommended)
```bash
python -m http.server 8080
```
Then open **[http://localhost:8080](http://localhost:8080)** in your browser.

#### Using Node.js (Static-server)
```bash
npm install -g static-server
static-server -p 8080
```
Then open **[http://localhost:8080](http://localhost:8080)**.

---

## 🌐 Deployment Guide

### Deploying to GitHub Pages
1. Go to your GitHub repository: `https://github.com/[your-username]/[your-repo-name]`.
2. Click on **Settings** $\rightarrow$ **Pages** (in the left sidebar).
3. Under **Build and deployment**, choose **Branch: main** (or `master`) and folder **`/ (root)`**.
4. Click **Save**.
5. Wait 60 seconds, and your application will be live at `https://[your-username].github.io/[your-repo-name]/`.

---

*Developed as part of the LaunchED AI Internship Capstone Program.*
