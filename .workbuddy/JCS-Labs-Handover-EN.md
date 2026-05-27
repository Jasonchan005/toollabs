# JCS Labs Tool Sites Matrix - Complete Handover Document

> **Last Updated**: 2026-05-27
> **Owner**: Jason Chan (陈哲舜)
> **Brand**: JCS Labs (Tech/Tools) | JCS Studio (Design)
> **GitHub**: https://github.com/Jasonchan005
> **Core Strategy**: Zero-cost, pure frontend, no paid APIs, no legal risk, English UI for global audience

---

## 1. Project Overview

### Business Model
- Build 20+ tool sites, each covering a long-tail keyword niche
- Pure frontend - all processing happens in the user's browser
- Vercel free deployment, Google AdSense monetization
- All-English interface for international users

### Four Evaluation Criteria (ALL new projects must pass)
1. **Zero Cost** — Not a single cent
2. **Fast Revenue** — High search volume, easy to SEO
3. **No Legal Risk** — No celebrities, copyright, health advice, legal advice
4. **Pure Frontend** — No paid APIs, no servers needed

### Existing Site Portfolio

| # | Site | Brand | Domain | GitHub Repo | Status |
|---|------|-------|--------|-------------|--------|
| 1 | PDF Tools | **ToolLabs** | toollabs-phi.vercel.app | Jasonchan005/toollabs | ✅ Live, 6 tools |
| 2 | AI Software Directory | **AIToolBox** | ai-toolbox-rouge.vercel.app | Jasonchan005/ai-toolbox | ✅ Live, 42 software + prompts |
| 3 | Free Translator | **FreeTranslator** | free-translator-liart.vercel.app | Jasonchan005/free-translator | ✅ Live, 20 languages |
| 4 | Image Tools | **ImageToolLab** | Pending deploy | Jasonchan005/image-toollab | 🔄 Code done, needs push+deploy |
| 5 | Chrome Translation Extension | **Hover Translate** | — | Jasonchan005/free-translator-extension | 🔄 Code done, needs Chrome Store ($5) |

---

## 2. Site Details

### Site 1: ToolLabs (PDF Tools)

**Local Path**: `C:\Users\JCS\WorkBuddy\2026-05-16-task-2\`

**Live Tools (6)**:
1. **PDF to Word** — Upload PDF → extract text → .docx (pdf.js + docx)
2. **Compress PDF** — 3 quality levels, 1GB max, auto-split 500MB+ (pdf-lib)
3. **Word to PDF** — .docx → PDF, Chinese support (jsPDF + Noto Sans SC)
4. **Image to PDF** — Images to PDF (jsPDF)
5. **Add Watermark** — Text watermark on PDF/images, 6 positions (pdf-lib + Canvas)
6. **Image to Text (OCR)** — Coming Soon, Chinese recognition not mature enough

**Tech Stack**: Pure HTML/CSS/JS, pdf.js + docx + jsPDF + pdf-lib + mammoth.js + Tesseract.js, all local (lib/ folder)

**SEO**: Google Search Console ✅ | sitemap.xml ✅ | GA: G-503ZSLGF0W

**File Structure**:
```
toollabs/
├── index.html              # Homepage
├── pdf-to-word.html        # PDF to Word
├── compress-pdf.html       # Compress PDF
├── word-to-pdf.html        # Word to PDF
├── image-to-pdf.html       # Image to PDF
├── add-watermark.html      # Add Watermark
├── image-to-text.html      # OCR (Coming Soon)
├── css/style.css           # Global styles
├── js/                     # Tool-specific JS logic
├── lib/                    # All local dependencies (offline)
├── favicon.svg
├── sitemap.xml
├── robots.txt
└── vercel.json
```

---

### Site 2: AIToolBox (AI Software Directory)

**Local Path**: `C:\Users\JCS\WorkBuddy\2026-05-16-task-2\ai-toolbox\`

**Content**:
- 42 free downloadable AI software, 8 categories
- Categories: AI Painting, Local LLMs, Voice & Audio, Video Generation, Coding Assistants, Photo Processing, OCR & Translation, All-in-One Bundles
- AI Prompt Library: 44 ChatGPT/Claude/Gemini prompts, 8 categories (/prompts)

**Tech**: Pure frontend, Tailwind CSS CDN + Lucide Icons

**SEO**: robots.txt + sitemap.xml + GA: G-503ZSLGF0W

**TODO**: Google Search Console verification, AdSense application

**File Structure**:
```
ai-toolbox/
├── index.html          # Main page (42 AI software)
├── data.js             # Software data
├── prompts.html        # Prompt library
├── prompts-data.js     # Prompt data (44 prompts)
├── favicon.svg
├── sitemap.xml
├── robots.txt
└── vercel.json
```

---

### Site 3: FreeTranslator

**Local Path**: `C:\Users\JCS\WorkBuddy\2026-05-16-task-2\free-translator\`

**Features**: 20 languages, translation
**API**: MyMemory (50K chars/day free, no credit card, no auto-detect)
**Note**: LibreTranslate now requires API key, only MyMemory is usable

**File Structure**:
```
free-translator/
├── index.html
├── favicon.svg
├── sitemap.xml
├── robots.txt
└── vercel.json
```

---

### Site 4: ImageToolLab (Image Tools) 🆕

**Local Path**: `C:\Users\JCS\WorkBuddy\2026-05-16-task-2\image-toollab\`

**Completed Tools (2)**:
1. **Image Converter** — WebP/PNG/JPG/AVIF/GIF/BMP conversion, batch 50, quality control, background color
2. **Image Resizer** — By percentage/exact/max dimensions/fixed, lock aspect ratio, batch 50, preset buttons

**Tech**: Pure frontend Canvas API

**TODO**:
- [ ] Create GitHub repo `image-toollab`
- [ ] Push code
- [ ] Deploy to Vercel
- [ ] Submit to Google Search Console

**File Structure**:
```
image-toollab/
├── index.html              # Homepage
├── image-converter.html    # Image format converter
├── image-resizer.html      # Image resizer
├── css/style.css
├── favicon.svg
├── sitemap.xml
├── robots.txt
└── vercel.json
```

---

### Site 5: Hover Translate (Chrome Extension)

**Local Path**: `C:\Users\JCS\WorkBuddy\2026-05-16-task-2\free-translator-extension\`

**Features**:
- Hover 1 second for instant translation
- Right-click context menu translation
- Notes: save/browse/export CSV
- Funnel traffic to FreeTranslator website

**Note**: MyMemory API requires VPN in China

**TODO**:
- [ ] Publish to Chrome Web Store (needs $5 registration fee)
- [ ] Create promo image 440x280
- [ ] Create screenshot 1280x800
- [ ] Write English store description
- [ ] Privacy policy page

**File Structure**:
```
free-translator-extension/
├── manifest.json    # Manifest V3
├── background.js    # Background service (translation API + notes CRUD)
├── content.js       # Content script (hover detection + tooltip)
├── content.css      # Tooltip styling
├── popup.html       # Popup (Translate + Notes tabs)
└── icons/           # Icons 16/48/128px
```

---

## 3. Standard New Site Workflow

### Step-by-step for each new site:

#### Step 1: Create local project
```bash
mkdir new-site-name && cd new-site-name
```

#### Step 2: Required files
Every site must include:
- `index.html` — Homepage (tool card list)
- `[tool-name].html` — Tool page(s)
- `css/style.css` — Styles
- `favicon.svg` — Icon
- `robots.txt` — SEO
- `sitemap.xml` — SEO
- `vercel.json` — Deploy config

#### Step 3: Brand guidelines
- All pages footer: `by JCS Labs`
- Homepage title: `[BrandName]` (e.g., `ImageToolLab`)
- All-English interface
- Google Analytics: `G-503ZSLGF0W` (same across all sites)
- Color scheme: blue/white (reference ToolLabs)

#### Step 4: Google Analytics snippet (all sites)
```html
<!-- Before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-503ZSLGF0W"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-503ZSLGF0W');
</script>
```

#### Step 5: vercel.json template
```json
{
  "cleanUrls": true
}
```

#### Step 6: robots.txt template
```
User-agent: *
Allow: /
Sitemap: https://your-domain.vercel.app/sitemap.xml
```

#### Step 7: sitemap.xml template
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/sitemaps/0.9">
  <url>
    <loc>https://your-domain.vercel.app/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://your-domain.vercel.app/tool-page.html</loc>
    <priority>0.8</priority>
  </url>
</urlset>
```

#### Step 8: Git push
```bash
git init
git config user.email "153247181@qq.com"
git config user.name "Jasonchan005"
git add -A
git commit -m "Initial commit"
# Create repo on GitHub first, then:
git remote add origin https://github.com/Jasonchan005/repo-name.git
git branch -M main
git push -u origin main
```

#### Step 9: Vercel deploy
1. Open https://vercel.com/new
2. Import GitHub repo
3. Click Deploy
4. Get .vercel.app domain

#### Step 10: SEO submission
1. Open https://search.google.com/search-console
2. Add new site (.vercel.app domain)
3. Verify via HTML tag or DNS
4. Submit sitemap.xml

---

## 4. Next Batch of Tools (Priority Order)

### 🔥 Tier 1 (1M+ monthly searches, build first)

| Tool | Search Volume | Suggested Site | Tech | Est. Effort |
|------|--------------|----------------|------|-------------|
| **QR Code Generator** | 5M+ | QRToolLab | qrcode.js | Small (1 day) |
| **Image Converter** | 2M+ | ✅ ImageToolLab | Canvas API | Done |
| **Image Resizer** | 1.5M+ | ✅ ImageToolLab | Canvas API | Done |
| **Word Counter** | 1M+ | WordToolLab | Pure JS | Tiny (half day) |

### 🔵 Tier 2 (300K-1M monthly searches)

| Tool | Search Volume | Suggested Site | Tech |
|------|--------------|----------------|------|
| **Color Picker** (from image) | 800K+ | ImageToolLab | Canvas getImageData |
| **Password Generator** | 800K+ | SecurityToolLab | Pure JS crypto |
| **JSON Formatter** | 600K+ | DevToolLab | Pure JS |
| **Base64 Encoder/Decoder** | 500K+ | DevToolLab | Pure JS btoa/atob |
| **Image Cropper** | 400K+ | ImageToolLab | Cropper.js |
| **CSV to JSON Converter** | 300K+ | DevToolLab | Pure JS |

### 🟢 Tier 3 (100K-300K monthly searches)

| Tool | Search Volume | Tech |
|------|--------------|------|
| **Unit Converter** | 250K+ | Pure JS |
| **SVG Optimizer** | 200K+ | SVGO |
| **Diff Checker** (text compare) | 200K+ | diff library |
| **Age Calculator** | 150K+ | Pure JS |
| **Case Converter** | 150K+ | Pure JS |
| **HTML to Markdown** | 100K+ | Turndown.js |
| **Lorem Ipsum Generator** | 300K+ | Pure JS |

### Suggested Site Grouping

| Site | Tools | Priority |
|------|-------|----------|
| **ImageToolLab** | Converter ✅, Resizer ✅, Color Picker, Cropper | ⭐ Continue |
| **QRToolLab** | QR Code Generator | ⭐ First |
| **WordToolLab** | Word Counter, Case Converter | ⭐ High |
| **DevToolLab** | JSON Formatter, Base64, CSV to JSON, HTML to Markdown | 🔵 High |
| **SecurityToolLab** | Password Generator, Lorem Ipsum | 🔵 Medium |

---

## 5. Cross-Site Linking Strategy

### Footer navigation (add to ALL sites)
```html
<footer>
  <div class="tools-by-jcs">
    <span>More free tools by JCS Labs:</span>
    <a href="https://toollabs-phi.vercel.app">PDF Tools</a>
    <a href="https://ai-toolbox-rouge.vercel.app">AI Software</a>
    <a href="https://free-translator-liart.vercel.app">Translator</a>
    <!-- Add new sites as they go live -->
  </div>
</footer>
```

### Purpose
- Boost overall site cluster SEO authority
- Cross-traffic between sites
- Brand consistency and trust

---

## 6. Important Notes & Pitfalls

### Development Rules
1. **Pure frontend only** — No paid APIs (MyMemory is the only exception: free, no credit card)
2. **All English** — All UI, descriptions, SEO metadata in English
3. **Responsive** — Must work on mobile
4. **Local libraries** — No CDN dependencies, put all JS libs in lib/ folder
5. **No frameworks** — Pure HTML/CSS/JS, better for SEO
6. **Unified GA** — All sites use G-503ZSLGF0W

### Content Red Lines
- ❌ No celebrity/brand names (copyright risk)
- ❌ No health/medical/fitness advice (legal risk)
- ❌ No legal/tax/investment advice
- ❌ No politically sensitive content
- ❌ No user-generated content (UGC legal risk)
- ✅ Tools only, no content generation
- ✅ AI prompts: style/technical/scenario only, no people

### Technical Pitfalls
- **MyMemory API** blocked in China (needs VPN); doesn't support auto-detect
- **LibreTranslate** now requires API key, no longer free
- **Chrome extension** content scripts can't inject into Chrome's built-in PDF viewer
- **jsPDF Chinese** needs embedded Noto Sans SC font (16MB) to avoid garbled text
- **Large PDFs** over 500MB need chunked processing to avoid browser memory overflow
- **OCR Chinese** Tesseract.js accuracy insufficient, not ready for production
- **Vercel free** 50MB file size limit (including deploy artifacts)

### Git Config
```bash
git config user.email "153247181@qq.com"
git config user.name "Jasonchan005"
```

---

## 7. AdSense Monetization Path

### Current Status
- All sites at 0 traffic (just launched, waiting for SEO indexing)
- Need 500+ daily visitors per site to apply for AdSense
- Goal: 20 tool sites, 50-100 visitors per site per day

### Requirements
- Useful and original content
- Privacy policy page
- About us / contact page
- Comply with AdSense policies

### Revenue Estimates (Reference)
- RPM (revenue per 1000 views): $1-5 for tool sites
- 1000 daily visitors → $1-5/day → $30-150/month
- 20 sites × 100 visitors/day → $600-3000/month

### Payout
- Minimum withdrawal: $100
- Wire transfer to Chinese bank account (supported)
- Need to submit tax info (W-8BEN form)

---

## 8. Action Checklist

### Immediate
- [ ] Push ImageToolLab to GitHub + Deploy to Vercel
- [ ] Publish Hover Translate to Chrome Web Store (waiting for bank card)
- [ ] Add footer cross-site navigation to all sites

### This Week
- [ ] Build QRToolLab (QR Code Generator)
- [ ] Build WordToolLab (Word Counter)
- [ ] Add Color Picker to ImageToolLab
- [ ] Submit all sites to Google Search Console

### This Month
- [ ] Build DevToolLab (JSON Formatter, Base64, CSV to JSON)
- [ ] Build SecurityToolLab (Password Generator)
- [ ] Get 10+ sites live
- [ ] Start monitoring for AdSense eligibility

---

## 9. Key Accounts

| Service | Account | Notes |
|---------|---------|-------|
| GitHub | Jasonchan005 | Email: 153247181@qq.com |
| Vercel | Same Gmail | Free plan |
| Google Analytics | G-503ZSLGF0W | All sites unified |
| Google Search Console | Same Gmail | Need to add each site separately |
| Gmail | For international business | — |
| QQ Email | 153247181@qq.com | For China/GitHub |

---

*This document is maintained by JCS Labs. Update after each new site launch.*
