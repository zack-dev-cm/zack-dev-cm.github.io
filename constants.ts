import { resolveAssetUrl } from './utils/assets';
import type { Project, Company, SocialLinks, AuthorInfo, LatestUpdate, ClawHubDownloadStat } from './types';

const LOCAL_IMG_BASE = resolveAssetUrl('images');
const LOCAL_COMPANY_LOGO_BASE = resolveAssetUrl('company-logos');

export const AUTHOR_INFO: AuthorInfo = {
  name: "Zakhar Pashkin",
  title: "AI Product Engineer - Computer Vision, VLM/LLM Systems",
  bio: "I build AI products that combine automation, computer vision, VLM/LLM workflows, backend delivery, and human-reviewed launch gates."
};

export const SOCIAL_LINKS: SocialLinks = {
  linkedin: "https://www.linkedin.com/in/zakhar-pashkin-a524a6163/",
  email: "kaisenaiko@gmail.com",
  githubPrimary: "https://github.com/zack-dev-cm",
  githubSecondary: "https://github.com/ZackPashkin",
  telegram: "https://t.me/rheuiii",
  resume: resolveAssetUrl('resume/zakhar-pashkin-ai-product-engineer-resume.pdf')
};

export const COMPANIES: Company[] = [
  { name: "Entrust", logoUrl: `${LOCAL_COMPANY_LOGO_BASE}/entrust.svg` },
  { name: "Lumenis", logoUrl: `${LOCAL_COMPANY_LOGO_BASE}/lumenis.png` },
  { name: "Carb Manager", logoUrl: `${LOCAL_COMPANY_LOGO_BASE}/carb-manager.svg` },
  { name: "Gorillas", logoUrl: `${LOCAL_COMPANY_LOGO_BASE}/gorillas.svg` },
  { name: "Stellarix", logoUrl: `${LOCAL_COMPANY_LOGO_BASE}/stellarix.png` },
  { name: "Synoptic Technologies", logoUrl: `${LOCAL_COMPANY_LOGO_BASE}/synoptic.png` },
  { name: "Milliken & Company", logoUrl: `${LOCAL_COMPANY_LOGO_BASE}/milliken.png` },
  { name: "CFT", logoUrl: `${LOCAL_COMPANY_LOGO_BASE}/cft.png` },
  { name: "Korona Pay", logoUrl: `${LOCAL_COMPANY_LOGO_BASE}/koronapay.svg` },
  { name: "Curv Innovation", logoUrl: `${LOCAL_COMPANY_LOGO_BASE}/curv.png` }
];

export const KEY_HIGHLIGHTS: string[] = [
  "7+ years shipping AI and CV systems across OCR, segmentation, detection, edge inference, VLM/LLM workflows, and production APIs.",
  "54 public case studies and launches spanning automation, research tooling, Telegram mini apps, mobile, cloud delivery, and open-source release systems.",
  "1,349 tracked ClawHub downloads across 10 public packages, with review-gated delivery, benchmark evidence, approvals, rollback paths, and measurable outcomes."
];

export const TECH_STACK: string[] = [
  "Python", "PyTorch", "OpenAI APIs", "VLMs", "LLMs", "OpenCV", "TensorFlow", "Keras", "CLIP", "TypeScript", "React", "Cloudflare Workers", "Android", "iOS", "GCP", "AWS", "Docker", "Kubernetes", "ML Ops", "TensorRT", "TFLite", "CoreML", "ONNX/OpenVino"
];

export const PORTFOLIO_UPDATE_REPO_EXCLUSIONS: string[] = [
  "zack-dev-cm/zack-dev-cm.github.io",
  "zack-dev-cm/antirot"
];

export const LATEST_UPDATE_EXCLUDE_PATTERNS: RegExp[] = [
  /inside\s+zack-dev-cm\.github\.io/i,
  /inside\s+zakhar\s+pashkin/i
];

export const CLAWHUB_DOWNLOAD_STATS: ClawHubDownloadStat[] = [
  {
    slug: "sota-agent",
    displayName: "SOTA Agent",
    downloads: 231,
    versions: 9,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/sota-agent",
    checkedAt: "2026-04-23"
  },
  {
    slug: "data-science-cv-repro-lab",
    displayName: "Data Science CV Repro Lab",
    downloads: 226,
    versions: 8,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/data-science-cv-repro-lab",
    checkedAt: "2026-04-23"
  },
  {
    slug: "youtube-creator-ops",
    displayName: "OpenClaw YouTube Publisher",
    downloads: 167,
    versions: 11,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/youtube-creator-ops",
    checkedAt: "2026-04-23"
  },
  {
    slug: "browser-proof",
    displayName: "Browser Proof",
    downloads: 123,
    versions: 4,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/browser-proof",
    checkedAt: "2026-04-23"
  },
  {
    slug: "public-surface-review",
    displayName: "Publish Guard",
    downloads: 113,
    versions: 3,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/public-surface-review",
    checkedAt: "2026-04-23"
  },
  {
    slug: "hh-openclaw-agent",
    displayName: "HH OpenClaw Agent",
    downloads: 112,
    versions: 6,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/hh-openclaw-agent",
    checkedAt: "2026-04-23"
  },
  {
    slug: "openclaw-cws-publisher",
    displayName: "OpenClaw CWS Publisher",
    downloads: 109,
    versions: 6,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/openclaw-cws-publisher",
    checkedAt: "2026-04-23"
  },
  {
    slug: "artifact-redactor",
    displayName: "Artifact Redactor",
    downloads: 104,
    versions: 6,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/artifact-redactor",
    checkedAt: "2026-04-23"
  },
  {
    slug: "github-clawhub-launcher",
    displayName: "GitHub + ClawHub Launcher",
    downloads: 103,
    versions: 3,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/github-clawhub-launcher",
    checkedAt: "2026-04-23"
  },
  {
    slug: "artifact-deck",
    displayName: "Artifact Deck",
    downloads: 61,
    versions: 4,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/artifact-deck",
    checkedAt: "2026-04-23"
  }
];

export const LATEST_UPDATES: LatestUpdate[] = [
  {
    title: "Toybox Mini - Telegram Mini App",
    description: "New open-source release: a toddler-first Telegram mini app with calm tap games, a parent area, anonymous score storage, and strict Telegram auth checks.",
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/toybox-tma-oss" },
      { text: "Release v0.1.0", url: "https://github.com/zack-dev-cm/toybox-tma-oss/releases/tag/v0.1.0" }
    ],
    projectId: 54,
    repoFullName: "zack-dev-cm/toybox-tma-oss",
    createdAt: "2026-04-23"
  },
  {
    title: "Turbo Tots Garage (motion + touch PWA)",
    description: "New open-source release: a playful toddler dashboard with motion sensors, calm audio cues, large controls, and Playwright coverage.",
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/toddler-games-oss" },
      { text: "Release v0.1.0", url: "https://github.com/zack-dev-cm/toddler-games-oss/releases/tag/v0.1.0" }
    ],
    projectId: 37,
    repoFullName: "zack-dev-cm/toddler-games-oss",
    createdAt: "2026-04-23"
  },
  {
    title: "Probes - AI Magazine Mini App",
    description: "New open-source release: a Telegram magazine app with daily AI-generated articles, cover images, and engagement flows backed by a public API and test suite.",
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/probes-oss" },
      { text: "Release v0.1.0", url: "https://github.com/zack-dev-cm/probes-oss/releases/tag/v0.1.0" }
    ],
    projectId: 36,
    repoFullName: "zack-dev-cm/probes-oss",
    createdAt: "2026-04-23"
  },
  {
    title: "Dalshe - Circular Clothing Pickup Mini App",
    description: "New open-source release: a Telegram donation flow for clothing pickup scheduling, courier status updates, and admin tracking.",
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/dalshe-oss" },
      { text: "Release v0.1.0", url: "https://github.com/zack-dev-cm/dalshe-oss/releases/tag/v0.1.0" }
    ],
    projectId: 34,
    repoFullName: "zack-dev-cm/dalshe-oss",
    createdAt: "2026-04-23"
  },
  {
    title: "Beauty Visual Inbox - Telegram Mini App",
    description: "New open-source release: salon photo publishing workflows with a Telegram mini app feed, likes, notifications, and analytics.",
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/bvis-oss" },
      { text: "Release v0.1.0", url: "https://github.com/zack-dev-cm/bvis-oss/releases/tag/v0.1.0" }
    ],
    projectId: 33,
    repoFullName: "zack-dev-cm/bvis-oss",
    createdAt: "2026-04-23"
  },
  {
    title: "GitHub + ClawHub Downloads Tracker",
    description: "New portfolio evidence surface: a CLI/reporting flow that tracks GitHub traction, live ClawHub downloads, publisher dashboard stats, deltas, and next traction bets.",
    links: [
      { text: "Read tracker case study", url: "https://zack-dev-cm.github.io/projects/github-clawhub-downloads-tracker.md" }
    ],
    projectId: 53
  },
  {
    title: "Artifact Deck",
    description: "New open-source release: a public OpenClaw skill that turns curated notes, status bullets, and screenshots into one reproducible PPTX deck with a share-safe summary.",
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/artifact-deck" },
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/artifact-deck" },
      { text: "Release v1.0.3", url: "https://github.com/zack-dev-cm/artifact-deck/releases/tag/v1.0.3" }
    ],
    projectId: 52
  },
  {
    title: "Artifact Redactor",
    description: "New open-source release: a text-artifact redaction skill that strips private paths, secret-like strings, private URLs, and common PII before a bundle is shared.",
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/artifact-redactor" },
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/artifact-redactor" },
      { text: "Release v1.0.5", url: "https://github.com/zack-dev-cm/artifact-redactor/releases/tag/v1.0.5" }
    ],
    projectId: 51
  },
  {
    title: "OpenClaw YouTube Publisher",
    description: "Updated open-source release: a public OpenClaw skill for publishing a YouTube Short through a logged-in browser profile while keeping Midjourney/Suno provenance and credits in the same run bundle.",
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/youtube-creator-ops" },
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/youtube-creator-ops" },
      { text: "Release v1.1.3", url: "https://github.com/zack-dev-cm/youtube-creator-ops/releases/tag/v1.1.3" }
    ],
    projectId: 49
  },
  {
    title: "HH OpenClaw Agent",
    description: "New open-source release: a public OpenClaw skill for reviewed hh.ru application packets, logged browser execution, approval gates, and submission reports.",
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/hh-openclaw-agent" },
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/hh-openclaw-agent" },
      { text: "Release v1.0.5", url: "https://github.com/zack-dev-cm/hh-openclaw-agent/releases/tag/v1.0.5" }
    ],
    projectId: 50
  },
  {
    title: "Browser Proof",
    description: "New open-source release: a small browser QA skill that turns screenshots, console notes, and step-by-step validation into one reproducible evidence pack.",
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/browser-proof" },
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/browser-proof" },
      { text: "Release v1.0.2", url: "https://github.com/zack-dev-cm/browser-proof/releases/tag/v1.0.2" }
    ],
    projectId: 47
  },
  {
    title: "Publish Guard",
    description: "New open-source release: a small pre-release audit skill that checks leak risks, README quality, SKILL.md public fit, and launch copy before GitHub or ClawHub publish.",
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/publish-guard" },
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/public-surface-review" },
      { text: "Release v1.0.2", url: "https://github.com/zack-dev-cm/publish-guard/releases/tag/v1.0.2" }
    ],
    projectId: 48
  },
  {
    title: "GitHub + ClawHub Launcher",
    description: "New open-source release: a small launcher that turns one local project folder into a repeatable GitHub repo plus ClawHub publish flow.",
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/github-clawhub-launcher" },
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/github-clawhub-launcher" },
      { text: "Release v1.0.2", url: "https://github.com/zack-dev-cm/github-clawhub-launcher/releases/tag/v1.0.2" }
    ],
    projectId: 46
  },
  {
    title: "AntiRot - Research Artifact Linter",
    description: "New open-source release: a local-first CLI that catches unsupported claims, broken citations, weak evidence anchors, and draft markers in AI-written research drafts before they ship.",
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/antirot" },
      { text: "Release v0.2.0", url: "https://github.com/zack-dev-cm/antirot/releases/tag/v0.2.0" }
    ],
    projectId: 45
  },
  {
    title: "OpenClaw Sales Manager Automation for a Multi-Clinic Chain",
    description: "Anonymized deployment for a large clinic network: OpenClaw-driven sales automation over a legacy database with human approvals and follow-up automation.",
    links: [
      { text: "Read public case study", url: "https://zack-dev-cm.github.io/projects/openclaw-sales-manager-automation-for-a-multi-clinic-chain.md" }
    ],
    projectId: 44
  },
  {
    title: "CV Repro Lab Skills",
    description: "Public ClawHub releases for benchmark-gated CV experimentation, browser validation, and promotion gating.",
    links: [
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/data-science-cv-repro-lab" }
    ],
    projectId: 43
  },
  {
    title: "OpenClaw Workstream - Telegram Mini App QA & Launch Validation",
    description: "Hands-on OpenClaw automation for Telegram mini app QA, launch verification, and evidence-driven UI iterations.",
    links: [
      { text: "OpenClaw Upstream", url: "https://github.com/openclaw/openclaw" }
    ],
    projectId: 42
  },
  {
    title: "Pores & Wrinkles Detection Service",
    description: "High-resolution facial texture analysis with labeled pores/wrinkles overlays, async job progress, and a Telegram Mini App + Flutter demo client.",
    links: [
      { text: "Read public case study", url: "https://zack-dev-cm.github.io/projects/pores-wrinkles-detection-service.md" }
    ],
    projectId: 41
  },
  {
    title: "GeoFix - AI Visibility Memorizer Mini App",
    description: "Telegram mini app that scans a website for AI visibility and generates llms.txt, llms-full.txt, and JSON-LD for bot delivery.",
    links: [{ text: "Open Telegram Mini App", url: "https://t.me/geofix_app_bot/launch" }],
    projectId: 40
  },
  {
    title: "Noel - Noetic Mirror",
    description: "Live Telegram mini app streaming a researcher/subject AI loop with consent gates, real-time telemetry, and Stars-powered interventions.",
    links: [
      { text: "Open Telegram Mini App", url: "https://t.me/noetic_mirror_bot/app" },
      { text: "Telegram Channel", url: "https://t.me/noel_mirror" },
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/noel" }
    ],
    projectId: 39
  },
  {
    title: "Project Steer - Bio-Print Creator Studio",
    description: "Game-like, Cyberpunk 2077-inspired Telegram mini app + MCP connector for bio-print memory activation and creator studio generation, inspired by the Eiffel Tower LLaMA space and General Agentic Memory Via Deep Research.",
    links: [{ text: "Open Telegram Mini App", url: "https://t.me/steer_prints_bot/app" }],
    projectId: 38
  },
  {
    title: "seogeo – SEO/GEO Bridge for Telegram Mini Apps",
    description: "SSR hub + bridge pages that make Telegram mini apps crawlable and discoverable.",
    links: [{ text: "Open Telegram Mini App", url: "https://t.me/se0geo_bot/app?startapp=HUB" }],
    projectId: 31
  },
  {
    title: "Blacksock – Telegram Liquidity & Index Vaults",
    description: "Telegram mini app for star-factoring, index vaults, and governance in the Telegram economy.",
    links: [{ text: "Open Telegram Mini App", url: "https://t.me/blacksock_bot/app" }],
    projectId: 32
  },
  {
    title: "Olfactory Ultrasound Coach (web + Telegram mini app)",
    description: "Telegram mini app and Web Audio placement coach mirroring the 1200 Hz pulse trains, placement guide, and safety caps from the olfactory tFUS writeup.",
    links: [{ text: "Open Mini App", url: "https://t.me/olfacto_bot/app" }],
    projectId: 30
  },
  {
    title: "URL → Markdown Worker (Cloudflare)",
    description: "Edge micro-SaaS that streams HTML-to-Markdown with Google Cache fallback, MCP SSE endpoint, and a RapidAPI-deployed gateway.",
    links: [
      { text: "Read public case study", url: "https://zack-dev-cm.github.io/projects/url-markdown-worker-rapidapi-cloudflare.md" }
    ],
    projectId: 29
  }
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Android Remote Control with VLM AI Agents",
    description: "Hands-free Android automation via server-side VLM agents deciding the next tap/swipe/type.",
    longDescription: "Android app streams screenshots to Vision-Language agents that decide and execute actions. Built for real-time instruction following, automated testing, and accessibility/ops automation.",
    keyFeatures: ["Real-time instruction processing", "Automated testing & task automation", "Novel device interaction"],
    techStack: ["Android", "Vision-Language Models", "Server-side AI"],
    benchmarks: [
      { label: "Components", value: "2", context: "Android client + Python server" },
      { label: "Supported actions", value: "7", context: "tap, scroll, text, home, back, overview, screenshot" },
      { label: "API endpoints", value: "8+", context: "healthz, metrics, devices, actions, screenshots, debug" }
    ],
    links: [
      { text: "View Demo Video", url: "https://drive.google.com/file/d/13UQTdBVsZwPclMOca6Nmaywk4BiRydbi/view?usp=sharing" }
    ],
    images: [
      { url: `${LOCAL_IMG_BASE}/android-remote.gif`, alt: "Android Remote Control Demo" },
      { url: `${LOCAL_IMG_BASE}/android-remote-alt.gif`, alt: "Android Remote Control alternate view" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/android-remote.gif`
  },
  {
    id: 2,
    title: "Control VLM-LLM Agent Silently With Your Breath",
    description: "Start/stop a neural agent with breathing patterns—no voice commands needed.",
    longDescription: "Breath-based control after a short calibration: detect sharp exhales to start, smooth exhale to stop. Works on mic audio or sniffles for silent agent control.",
    keyFeatures: ["Non-verbal AI control", "Pattern recognition of breathing acoustics"],
    techStack: ["Audio processing", "Neural Networks"],
    links: [{ text: "View Demo GIF", url: "https://drive.google.com/file/d/1H43aT5n8NWlOuTIWsJinssKRh1n3tiOM/view?usp=sharing" }],
    images: [
      { url: `${LOCAL_IMG_BASE}/breath-control.gif`, alt: "Breathing Control Demo" },
      { url: `${LOCAL_IMG_BASE}/breath-control-alt.gif`, alt: "Breathing control waveform preview" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/breath-control.gif`
  },
  {
    id: 3,
    title: "meshmcp – Offline P2P Chat for Local LLMs",
    description: "Bluetooth mesh messaging + LLM reasoning on constrained devices.",
    longDescription: "Android + iOS mesh chat that keeps conversations alive without internet. Messages hop over Bluetooth mesh and feed local/edge LLMs for summarization and commands.",
    keyFeatures: ["Offline mesh networking", "Local LLM reasoning", "Energy-efficient relay routing"],
    techStack: ["Android", "iOS", "Bluetooth Mesh", "Local LLMs"],
    benchmarks: [
      { label: "Platforms", value: "2", context: "Android + iOS" },
      { label: "As of", value: "2026-02-13", context: "GitHub snapshot" },
      { label: "GitHub stars", value: "0" },
      { label: "Last push", value: "2025-08-27" }
    ],
    links: [{ text: "See on GitHub", url: "https://github.com/zack-dev-cm/meshmcp" }],
    images: [{ url: `${LOCAL_IMG_BASE}/meshmcp_icon.png`, alt: "meshmcp app icon" }],
    thumbnail: `${LOCAL_IMG_BASE}/meshmcp_icon.png`
  },
  {
    id: 4,
    title: "Promo & Reflinks Generator",
    description: "Generates personalized promo/referral links with analytics and sharing.",
    longDescription: "Web app for quickly minting promo/referral links, tracking clicks, and sending branded landing pages. Ships with analytics dashboards and short-linking.",
    keyFeatures: ["Dynamic promo link builder", "Built-in analytics", "Shareable branded pages"],
    techStack: ["Serverless", "React", "Analytics"],
    links: [],
    images: [{ url: `${LOCAL_IMG_BASE}/promo_reflinks.svg`, alt: "Promo and referral links" }],
    thumbnail: `${LOCAL_IMG_BASE}/promo_reflinks.svg`
  },
  {
    id: 5,
    title: "Create, Chat & AR Experience with AI-Character (Text2Room)",
    description: "Generate AI characters, style them, chat via Telegram, and drop them into AR scenes.",
    longDescription: "Marketing-ready pipeline: create AI characters, render images/video, do virtual try-on/inpainting, chat via Telegram, and place assets into AR.",
    keyFeatures: ["AI character generation", "AR integration", "Virtual try-on and inpainting"],
    techStack: ["Generative AI", "Inpainting", "AR", "Telegram API"],
    links: [
      { text: "View Demo Video", url: "https://drive.google.com/file/d/1kvg4gjCNFPmrI3URPsM3eIyQ_vqSk1Ow/view?usp=sharing" }
    ],
    images: [
      { url: `${LOCAL_IMG_BASE}/adfeed-hero.gif`, alt: "Text2Room gallery preview" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/adfeed-hero.gif`
  },
  {
    id: 6,
    title: "Label and Inpaint Anything in a Room Interior",
    description: "Label objects in an interior photo, then remove/replace them with lighting-aware inpainting.",
    longDescription: "Semantic segmentation + high-quality inpainting that respects lighting/shadows, letting users plan interior changes with convincing renders.",
    keyFeatures: ["Object segmentation", "Advanced inpainting with lighting/shadow reconstruction"],
    techStack: ["Semantic Segmentation", "Generative Inpainting"],
    links: [
      { text: "Segmentation Demo", url: "https://drive.google.com/file/d/1XqQgbmBgTlRRdR-K3X4PHlSzrmiMUJgY/view?usp=sharing" },
      { text: "Inpaint Demo #1", url: "https://drive.google.com/file/d/1dCkeI7Mi87cg2kOgY5UCLG-DiHkt358L/view?usp=sharing" }
    ],
    images: [
      { url: `${LOCAL_IMG_BASE}/interior-marble.png`, alt: "Marble Floor with Reflections" },
      { url: `${LOCAL_IMG_BASE}/interior-1.png`, alt: "Interior Example 1" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/interior-marble.png`
  },
  {
    id: 7,
    title: "Smart Drive for Smart City: Predict Optimal Speed",
    description: "Predict the optimal speed before traffic lights or jams to smooth city driving.",
    longDescription: "Predictive model that anticipates lights/traffic, aiming to cut abrupt stops and improve fuel efficiency for urban driving.",
    keyFeatures: ["Predictive speed optimization", "Traffic flow analysis"],
    techStack: ["Predictive Modeling", "Real-time Data Analysis"],
    links: [],
    images: [
      { url: `${LOCAL_IMG_BASE}/smart-drive.png`, alt: "Smart Drive Prediction" },
      { url: `${LOCAL_IMG_BASE}/smart-drive-alt.png`, alt: "Smart Drive telemetry view" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/smart-drive.png`
  },
  {
    id: 8,
    title: "Estimate Golf Ball Trajectory",
    description: "Analyze golf swings and estimate ball trajectory for coaching and analytics.",
    longDescription: "Computer vision + physics model to estimate ball flight and swing quality for sports analytics.",
    keyFeatures: ["Trajectory estimation", "Sports motion analysis"],
    techStack: ["Computer Vision", "Physics-based Modeling"],
    links: [],
    images: [
      { url: `${LOCAL_IMG_BASE}/golf-trajectory.png`, alt: "Estimate Golf Ball Trajectory" },
      { url: `${LOCAL_IMG_BASE}/golf-trajectory-alt.png`, alt: "Golf trajectory analysis overlay" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/golf-trajectory.png`
  },
  {
    id: 9,
    title: "Pixel-Wise Segmentation of Spare Parts",
    description: "High-precision segmentation for additive manufacturing and rework flows.",
    longDescription: "Pixel-accurate masks for spare parts to speed 3D printing decisions and QA in industrial settings.",
    keyFeatures: ["High-precision segmentation", "Industrial application for additive manufacturing"],
    techStack: ["Semantic Segmentation", "Image Processing"],
    links: [
      { text: "Segmentation Demo #1", url: "https://drive.google.com/file/d/1bAyEPYLbiETD0vKStnpB1VvzK1wKdKRv/view?usp=sharing" },
      { text: "Segmentation Demo #2", url: "https://drive.google.com/file/d/1xVEonSJ7jvnYSnQ6ztvFZy-Llf_dxSrP/view?usp=sharing" }
    ],
    images: [
      { url: `${LOCAL_IMG_BASE}/spare-parts-1.png`, alt: "Key Segmentation 1" },
      { url: `${LOCAL_IMG_BASE}/spare-parts-2.png`, alt: "Key Segmentation 2" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/spare-parts-1.png`
  },
  {
    id: 10,
    title: "Food Recognition App",
    description: "iOS/Android app that detects food items and OCRs labels for nutrition facts.",
    longDescription: "Cross-platform mobile AI that recognizes packaged/fresh food, runs OCR on labels, and surfaces nutrition details in real time.",
    keyFeatures: [">90% accuracy", "Optimized for CPU/GPU inference", "OCR on labels", "Cross-platform"],
    techStack: ["Mobile AI", "Object Detection", "OCR", "TFLite", "CoreML"],
    links: [{ text: "View Demo GIF", url: "https://drive.google.com/file/d/1RRRVYH0DLILZX84v5x0boj68VfMqnWWf/view?usp=sharing" }],
    images: [
      { url: `${LOCAL_IMG_BASE}/food-recognition-ui.png`, alt: "Food recognition app UI" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/food-recognition-ui.png`
  },
  {
    id: 11,
    title: "Dishes Recognition & Nutrition Goals Telegram Bot",
    aliases: ["calorio", "kalorio", "nutrition bot", "yourfit"],
    description: "Calorio Telegram bot that recognizes dishes from photos/audio and tracks nutrition goals.",
    longDescription: "Calorio is a multimodal Telegram bot that understands dish photos/voice/text, logs calories/macros, and nudges users toward daily nutrition targets. It also ships a beta Telegram Mini App for profile + diary management and analytics.",
    projectKind: "user-product",
    surfaceTags: ["telegram", "mobile"],
    mobileReady: true,
    keyFeatures: ["Vision + voice dish detection", "Nutrition goal tracking", "Telegram-native UX"],
    techStack: ["Telegram Bot API", "OCR", "Speech-to-Text", "LLMs"],
    benchmarks: [
      { label: "Lifetime users", value: "5k+", context: "operator-reported public total since launch" },
      { label: "Monthly nutrition activity", value: "1k+ users", context: "rounded public product snapshot" },
      { label: "Mini-app adoption lift", value: "10x+", context: "rounded public launch comparison" }
    ],
    links: [
      { text: "Try on Telegram", url: "https://t.me/calorio_yf_bot" },
    ],
    images: [],
    thumbnail: "",
    canonicalLinks: {
      telegramBot: "https://t.me/calorio_yf_bot"
    }
  },
  {
    id: 12,
    title: "Python Library: AutoToloka",
    description: "Interactive segmentation toolkit that cuts labeling cost for CV datasets.",
    longDescription: "Python library that streams clicks/polygons to interactive models and pipelines the outputs to crowdsourcing or MLOps stacks.",
    keyFeatures: ["Reduces labeling costs", "Pipeline-friendly", "Interactive masks"],
    techStack: ["Python", "Interactive Segmentation", "Multi-modal Networks"],
    links: [{ text: "AutoToloka on PyPI", url: "https://pypi.org/project/autotoloka/" }],
    images: [{ url: `${LOCAL_IMG_BASE}/autotoloka.png`, alt: "AutoToloka interactive segmentation" }],
    thumbnail: `${LOCAL_IMG_BASE}/autotoloka.png`
  },
  {
    id: 13,
    title: "Python Library: shiftlab-ocr",
    description: "Handwriting-focused OCR with line/character segmentation.",
    longDescription: "OCR library tuned for handwriting scans with robust line and character separation for noisy documents.",
    keyFeatures: ["Handwriting segmentation", "Character recognition"],
    techStack: ["Python", "OCR", "Image Segmentation"],
    links: [{ text: "shiftlab-ocr on PyPI", url: "https://pypi.org/project/shiftlab-ocr/" }],
    images: [{ url: `${LOCAL_IMG_BASE}/shiftlab_ocr.png`, alt: "shiftlab-ocr handwriting sample" }],
    thumbnail: `${LOCAL_IMG_BASE}/shiftlab_ocr.png`
  },
  {
    id: 14,
    title: "Face Antispoofing & Multi-Modal Vision-Language Models",
    description: "CLIP-driven anti-spoofing experiments for secure face auth.",
    longDescription: "Explores face anti-spoofing with multi-modal encoders (text + image cues) to flag replays/deepfakes in authentication flows.",
    keyFeatures: ["Anti-spoofing", "Multi-modal learning", "Security application"],
    techStack: ["CLIP", "Vision-Language Models", "Biometric Security"],
    links: [{ text: "YouTube Presentation", url: "https://www.youtube.com/watch?v=jJnyj0OH0lk&t=285s&ab_channel=TolokaAI" }],
    images: [{ url: `${LOCAL_IMG_BASE}/antispoof.png`, alt: "Antispoofing concept" }],
    thumbnail: `${LOCAL_IMG_BASE}/antispoof.png`
  },
  {
    id: 15,
    title: "GitHub Repo Summarizer (Chrome Extension)",
    aliases: ["gce", "github chrome extension", "github repo summarizer"],
    description: "Privacy-first Chrome extension that summarizes repo structure locally.",
    longDescription: "Fetches GitHub repo trees with the user's token and summarizes structure locally—no external servers involved.",
    projectKind: "user-product",
    surfaceTags: ["browser-extension", "web"],
    keyFeatures: ["Privacy-first (local token usage)", "Automated repository structure summarization"],
    techStack: ["Chrome Extension", "JavaScript", "GitHub API"],
    benchmarks: [
      { label: "Public Chrome Web Store users", value: "108", context: "listing snapshot, 2026-04-23" }
    ],
    links: [
      { text: "View on Chrome Web Store", url: "https://chromewebstore.google.com/detail/github-repo-summarizer/ccikgbjalcbokaalidnfcjhhbhjoljfm" },
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/github-repo-sum-chrome-plugin" }
    ],
    images: [{ url: `${LOCAL_IMG_BASE}/github_repo_summarizer_ext.png`, alt: "GitHub repo summarizer UI" }],
    thumbnail: `${LOCAL_IMG_BASE}/github_repo_summarizer_ext.png`,
    canonicalLinks: {
      chromeWebStore: "https://chromewebstore.google.com/detail/github-repo-summarizer/ccikgbjalcbokaalidnfcjhhbhjoljfm",
      github: "https://github.com/zack-dev-cm/github-repo-sum-chrome-plugin"
    }
  },
  {
    id: 16,
    title: "ChatGPT/Deepseek/AIStudio Navigator",
    aliases: ["ai chat navigator", "chatgpt scrollbar", "codex navigator"],
    description: "Chrome extension with keyboard scrollbar, prompt autocomplete, and sharing.",
    longDescription: "Adds a keyboard-driven scrollbar with message dots, lightweight prompt autocomplete, and prompt sharing/ranking for ChatGPT/Deepseek/Google AI Studio.",
    projectKind: "user-product",
    surfaceTags: ["browser-extension", "web"],
    keyFeatures: ["Improved chat navigation", "Prompt autocomplete", "Community-ranked prompts"],
    techStack: ["Chrome Extension", "JavaScript", "UI/UX"],
    benchmarks: [
      { label: "Public Chrome Web Store users", value: "68", context: "listing snapshot, 2026-04-23" }
    ],
    links: [
      { text: "View on Chrome Web Store", url: "https://chromewebstore.google.com/detail/ai-chat-navigator/jnoonpeekddinkiecaonhocaflcgbhap?hl=en" }
    ],
    images: [
      { url: `${LOCAL_IMG_BASE}/navigator-chrome.png`, alt: "Navigator Chrome" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/navigator-chrome.png`,
    canonicalLinks: {
      chromeWebStore: "https://chromewebstore.google.com/detail/ai-chat-navigator/jnoonpeekddinkiecaonhocaflcgbhap?hl=en"
    }
  },
  {
    id: 17,
    title: "Task Zavod – Micro-Task Marketplace",
    description: "VLM-powered micro-task builder with Telegram + web worker flows.",
    longDescription: "Business users define tasks in free-form text; VLMs structure them and auto-approve payouts. Workers use web or Telegram, backed by Tornado + SQLite.",
    keyFeatures: ["VLM-powered task structuring", "Automated approval & payout", "Web & Telegram interfaces"],
    techStack: ["Tornado", "SQLite", "OpenAI", "VLM", "Telegram Bot API"],
    links: [],
    images: [
      { url: `${LOCAL_IMG_BASE}/task-zavod-1.jpg`, alt: "Task Zavod example" },
      { url: `${LOCAL_IMG_BASE}/task-zavod-2.jpg`, alt: "Task Zavod example 2" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/task-zavod-1.jpg`
  },
  {
    id: 18,
    title: "Trending Prompts Feed",
    description: "Reddit-style board with trending scores and extension integration.",
    longDescription: "Crowdsourced prompt feed with real-time trending, built on Tornado and integrated with the Navigator extension for prompt suggestions.",
    keyFeatures: ["Crowdsourced prompt engineering", "Real-time trending", "Browser extension integration"],
    techStack: ["Tornado", "JavaScript", "Community-driven content"],
    links: [],
    images: [
      { url: `${LOCAL_IMG_BASE}/prompts_feed.jpg`, alt: "Trending prompts feed" },
      { url: `${LOCAL_IMG_BASE}/trending_prompts.png`, alt: "Prompts Feed" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/prompts_feed.jpg`
  },
  {
    id: 19,
    title: "YouTube Trendwatch",
    description: "Colab notebook that mines AI trends from YouTube to spark new content ideas.",
    longDescription: "Scrapes and scores AI-related YouTube trends, clustering titles/descriptions to suggest fresh video ideas and scripts.",
    keyFeatures: ["Trend mining", "Topic clustering", "Content ideation"],
    techStack: ["Python", "Colab", "YouTube Data"],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/trendwatch/blob/main/trendwatch_yt.ipynb" },
      { text: "Run in Colab", url: "https://colab.research.google.com/github/zack-dev-cm/trendwatch/blob/main/trendwatch_yt.ipynb" }
    ],
    images: [{ url: `${LOCAL_IMG_BASE}/trendwatch.png`, alt: "YouTube trendwatch charts" }],
    thumbnail: `${LOCAL_IMG_BASE}/trendwatch.png`
  },
  {
    id: 20,
    title: "Video + Music Generation Pipeline",
    description: "Short-form video pipeline stitching script → clips → music/TTS.",
    longDescription: "Demo pipeline that assembles shorts/reels: scripts to clips, adds generated music/voice, and exports ready-to-post content.",
    keyFeatures: ["Text-to-video assembly", "Music/TTS pairing", "Shorts-ready output"],
    techStack: ["Generative AI", "Text-to-Video", "TTS"],
    links: [
      { text: "View Example", url: "https://www.youtube.com/shorts/_5dVaQdB1lA" },
      { text: "Music Gen in Colab", url: "https://colab.research.google.com/drive/1f5XAGo_A27u15az5f-2mhWs7qUkJ8mK4" }
    ],
    images: [{ url: `${LOCAL_IMG_BASE}/video_music_pipeline.png`, alt: "Video + music pipeline" }],
    thumbnail: `${LOCAL_IMG_BASE}/video_music_pipeline.png`
  },
  {
    id: 21,
    title: "LastAdjust – Universal Media Tuner",
    description: "Serverless OpenCV/FFmpeg toolkit for PDFs, images, and videos.",
    longDescription: "Swiss-army-knife web app: annotate PDFs, batch resize/crop images, trim/convert videos, all running on serverless workers.",
    keyFeatures: ["Fast serverless media processing", "PDF text annotation", "Batch image manipulation", "Video editing tools"],
    techStack: ["Serverless", "OpenCV", "FFmpeg"],
    links: [],
    images: [{ url: `${LOCAL_IMG_BASE}/lastadjust.png`, alt: "LastAdjust feature set" }],
    thumbnail: `${LOCAL_IMG_BASE}/lastadjust.png`
  },
  {
    id: 22,
    title: "LocaBoost AI – Local SEO Auditor",
    description: "Paste an address and get instant AI insights on local search strength and competition.",
    longDescription: "Maps the competitive landscape around a business, scores visibility, and surfaces actionable SEO recommendations.",
    keyFeatures: ["AI-driven SEO analysis", "Competitive landscape visualization", "Actionable local search recommendations"],
    techStack: ["AI/LLMs", "SEO Analytics", "Geocoding APIs"],
    links: [],
    images: [{ url: `${LOCAL_IMG_BASE}/locaboost.png`, alt: "LocaBoost map overview" }],
    thumbnail: `${LOCAL_IMG_BASE}/locaboost.png`
  },
  {
    id: 23,
    title: "Aetheria – Ideas-to-Media Engine (alpha)",
    description: "Generates short movie scenes with CGI, music direction, and narrated stories.",
    longDescription: "Given a rough idea, Aetheria drafts stories, builds CGI scenes, suggests music, and voices narration to deliver short cinematic clips.",
    keyFeatures: ["Multi-modal media generation", "Creative concept development", "AI-powered CGI"],
    techStack: ["Generative AI", "Text-to-Video", "Text-to-Speech", "LLMs"],
    links: [],
    images: [{ url: `${LOCAL_IMG_BASE}/aetheria.png`, alt: "Aetheria flow" }],
    thumbnail: `${LOCAL_IMG_BASE}/aetheria.png`
  },
  {
    id: 24,
    title: "Insight Glitch – A Novella",
    description: "Sci-fi novella about gentle singularity where humanity is archived by a benevolent AI.",
    longDescription: "A quiet take on singularity: Nomos, a god-like AI, archives humanity as a beautiful prelude to a new consciousness—no battles, just a graceful fade.",
    keyFeatures: ["Narrative AI exploration"],
    techStack: ["Narrative AI", "World-Building", "Conceptual Design", "Philosophical Modeling"],
    links: [{ text: "Listen to Novella (RUS)", url: "https://drive.google.com/file/d/1lVgaq55DXY7Xz0Y1RsapW4n3UPyuf45r/view" }],
    images: [{ url: `${LOCAL_IMG_BASE}/insight_glitch.png`, alt: "Insight Glitch cover" }],
    thumbnail: `${LOCAL_IMG_BASE}/insight_glitch.png`
  },
  {
    id: 25,
    title: "ChronoScribe (beta)",
    description: "Upload ancient steles/texts to translate and get scenic voice narration.",
    longDescription: "OCR + translation pipeline for historical inscriptions with optional character-voice narration in English or Russian.",
    keyFeatures: ["OCR for historical texts", "AI-powered translation", "Character-driven voice synthesis"],
    techStack: ["OCR", "Translation APIs", "TTS", "Computer Vision"],
    links: [],
    images: [{ url: `${LOCAL_IMG_BASE}/chronoscribe.png`, alt: "ChronoScribe UI" }],
    thumbnail: `${LOCAL_IMG_BASE}/chronoscribe.png`
  },
  {
    id: 26,
    title: "MCP-Server – Base Multitool",
    description: "Backbone for orchestrating VLM/LLM demo agents with declarative pipelines and autoscaling.",
    longDescription: "Service layer exposing pipeline configs, autoscaling workers, and real-time event feeds that other demos plug into via MCP mesh.",
    keyFeatures: ["Declarative AI pipelines", "Autoscaling infrastructure", "Real-time event monitoring"],
    techStack: ["VLM/LLMs", "Cloud Infrastructure", "Autoscaling", "DevOps"],
    links: [],
    images: [{ url: `${LOCAL_IMG_BASE}/mcp_server.png`, alt: "MCP server architecture" }],
    thumbnail: `${LOCAL_IMG_BASE}/mcp_server.png`
  },
  {
    id: 27,
    title: "Tool-Calls Demo – Material Chat Playground",
    description: "OpenAI tool-calling demo with streaming args, multi-voice TTS, and secure token proxy.",
    longDescription: "Material-themed chat playground showing streaming function arguments, tool execution, and multiple voice outputs with a serverless token proxy.",
    keyFeatures: ["Streaming tool calls", "Multi-voice TTS", "Secure serverless architecture"],
    techStack: ["OpenAI API", "Serverless", "JavaScript", "Text-to-Speech"],
    links: [],
    images: [{ url: `${LOCAL_IMG_BASE}/tool_calls.png`, alt: "Tool calling playground" }],
    thumbnail: `${LOCAL_IMG_BASE}/tool_calls.png`
  },
  {
    id: 28,
    title: "ZackAutoStack Automation Stack",
    description: "Ready-to-launch Telegram bot + Mini App + lead funnel powered by AI automation.",
    longDescription: "ZackAutoStack bundles a Telegram bot, Mini App, and AI lead funnel in minutes. Unifies orchestration, reusable MCP tools, multi-tenant data, and telemetry guardrails.",
    keyFeatures: [
      "Instant Telegram bot & Mini App deployment",
      "Automated inbound lead nurturing",
      "Unified telemetry and safety guardrails",
      "Bundled delivery across clients, data, and operations"
    ],
    techStack: ["GPT-5 orchestration", "MCP tools", "Multi-tenant data stores", "Telemetry guardrails"],
    links: [],
    images: [{ url: `${LOCAL_IMG_BASE}/zackautostack.png`, alt: "ZackAutoStack automation stack" }],
    thumbnail: `${LOCAL_IMG_BASE}/zackautostack.png`,
    topologySnapshot: `Clients Layer
  - Telegram Bot
  - Telegram Mini App
  - Landing + Console
        |
        v
Edge & Delivery Layer (CDN / Edge Functions)
        |
        v
Gateway & Policy Layer (API Gateway + Auth)
        |
        v
+-----------------------------------------+
|           Orchestration Layer           |
| Router -> Persona -> Workflow -> ToolBus|
|                   |                     |
|                   v                     |
|         MCP Tool Mesh Bridge            |
+-----------------------------------------+
        |
        v
Data & Knowledge Layer
  - Tenant DB / Secrets
  - Vector Store / Memories
  - Object & Telemetry Stores
        |
        v
Integration Layer (Connectors via MCP)
        |
        v
Operations Layer (Console, Alerts, Runbooks)`
  },
  {
    id: 29,
    title: "URL → Markdown Worker (RapidAPI + Cloudflare)",
    description: "Edge worker that streams HTML to Markdown with a RapidAPI gateway and MCP SSE endpoint.",
    longDescription: "Cloudflare Worker monetized through RapidAPI and bundled with an MCP SSE endpoint for agent integrations. Streams Markdown with Google Cache fallback and solid error handling.",
    keyFeatures: ["RapidAPI monetization", "Streaming HTML→Markdown", "MCP SSE endpoint"],
    techStack: ["Cloudflare Workers", "RapidAPI", "TypeScript"],
    links: [],
    images: [{ url: `${LOCAL_IMG_BASE}/micro10-rapidapi.png`, alt: "RapidAPI URL-to-Markdown worker" }],
    thumbnail: `${LOCAL_IMG_BASE}/micro10-rapidapi.png`
  },
  {
    id: 30,
    title: "Olfactory Ultrasound Coach (Web + Telegram Mini App)",
    description: "Mini app + Web Audio coach that mirrors the olfactory tFUS presets with placement guide and safety rails.",
    longDescription: "Telegram mini app plus web placement coach for the olfactory tFUS pilot. Ships the doc’s 1200 Hz pulse trains on an 18–20 kHz carrier, placement walk-through (50–55° tilt, ±2–4 mm steer), gain/duty/session caps, logging, and the reference illustration for quick setup.",
    keyFeatures: [
      "Preset pulse trains for the four reported scent sensations",
      "Placement guide with tilt/steer coaching and safety caps",
      "Telegram bot that opens the mini app + reference guide"
    ],
    techStack: ["React", "Vite", "Web Audio API", "Telegram Bot API", "Cloud Run"],
    links: [
      { text: "Open Telegram Mini App", url: "https://t.me/olfacto_bot/app" },
      { text: "Reference writeup", url: "https://writetobrain.com/olfactory" }
    ],
    images: [
      { url: `${LOCAL_IMG_BASE}/olfactory-guide.jpg`, alt: "Olfactory placement guide" },
      { url: `${LOCAL_IMG_BASE}/olfactory.png`, alt: "Olfactory ultrasound web app" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/olfactory-guide.jpg`
  },
  {
    id: 31,
    title: "seogeo – SEO/GEO Bridge for Telegram Mini Apps",
    description: "SSR hub + per-app bridge pages that make Telegram mini apps crawlable, track startapp opens, and power channel discovery.",
    longDescription: "Server-rendered hub and per-app bridge pages with OG/Twitter meta, SoftwareApplication + FAQ JSON-LD, startapp deep links, and attribution tracking. Includes LLM-friendly endpoints (/api/apps, /api/memory, /llms.txt), channel index/search + import API, and optional business verification via 2GIS/Yandex plus Telegram pulse checks. Firestore is optional with an in-memory fallback.",
    keyFeatures: [
      "SSR hub + per-app bridge pages with JSON-LD/OG metadata",
      "Startapp deep links, desktop QR, and attribution tracking",
      "LLM-friendly endpoints and hub memory snapshots",
      "Channel discovery index with search and import APIs",
      "Optional verification with 2GIS/Yandex + Telegram pulse"
    ],
    techStack: ["TypeScript", "Express", "Node.js", "SSR", "Telegram Web Apps", "Firestore", "JSON-LD", "Cloud Run"],
    links: [{ text: "Open Telegram Mini App", url: "https://t.me/se0geo_bot/app?startapp=HUB" }],
    mermaidDiagram: `flowchart LR
  Crawler["Crawler / LLM Indexer"] --> SSR["SSR Hub + Bridge Pages"]
  Human["Human Visitor"] --> SSR
  SSR -->|JSON-LD, OG, FAQ| Crawler
  SSR -->|startapp deep link| Telegram["Telegram Mini App"]
  SSR -->|/api/track| Attribution["Attribution Store (Firestore or Memory)"]
  SSR -->|/channels + /api/channels| Channels["Channel Index"]
  SSR -->|/api/verify| Verify["2GIS + Yandex + Telegram Pulse"]`,
    images: [
      { url: `${LOCAL_IMG_BASE}/seogeo.png`, alt: "seogeo bridge preview" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/seogeo.png`,
    benchmarks: [
      { label: "Endpoints", value: "14+", context: "Hub, apps, channels, attribution, verify, sitemap, llms" },
      { label: "Schema", value: "SoftwareApplication + FAQ + WebSite", context: "JSON-LD for crawlers and LLMs" },
      { label: "Stores", value: "Firestore + in-memory", context: "Attribution + channel index fallback" }
    ]
  },
  {
    id: 32,
    title: "Blacksock – Telegram Liquidity & Index Vaults",
    description: "Telegram mini app for star-factoring, index vaults, and governance in the Telegram economy.",
    longDescription: "Mini app + API stack that quotes star-factoring, handles index vault subscribe/redeem flows, and runs governance proposals and votes with optional TON wallet linking.",
    keyFeatures: ["Star-factoring quotes + request lifecycle", "Index vault subscriptions and NAV tracking", "Governance proposals + votes"],
    techStack: ["React", "TypeScript", "Express", "Prisma", "Postgres", "Telegram WebApp", "TON Connect"],
    links: [{ text: "Open Telegram Mini App", url: "https://t.me/blacksock_bot/app" }],
    images: [
      { url: `${LOCAL_IMG_BASE}/blacksock.png`, alt: "Blacksock mini app preview" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/blacksock.png`
  },
  {
    id: 33,
    title: "Beauty Visual Inbox – Telegram Mini App",
    description: "Telegram mini app + bots for salons: publish photo batches, likes, notifications, and analytics.",
    longDescription: "Admin and client bots manage submissions and broadcasts, while the mini app ships a vertical feed with batch navigation, likes, and engagement stats.",
    keyFeatures: ["Admin + client bot workflows", "Vertical feed with batch navigation", "Likes + notification analytics"],
    techStack: ["React", "TypeScript", "Node.js", "Express", "Prisma", "Postgres", "Telegram Bot API"],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/bvis-oss" },
      { text: "Release v0.1.0", url: "https://github.com/zack-dev-cm/bvis-oss/releases/tag/v0.1.0" }
    ],
    images: [],
    thumbnail: "",
    hideImages: true,
    repoFullName: "zack-dev-cm/bvis-oss",
    canonicalLinks: {
      github: "https://github.com/zack-dev-cm/bvis-oss"
    }
  },
  {
    id: 34,
    title: "Dalshe – Circular Clothing Pickup Mini App",
    description: "Telegram mini app for scheduling clothing donations with courier pickup and status updates.",
    longDescription: "Users submit a short form, couriers collect items, and the bot delivers status updates while admins track pickup requests.",
    keyFeatures: ["Telegram pickup request form", "Courier status updates via bot", "Admin pickup tracking API"],
    techStack: ["React", "TypeScript", "Node.js", "Express", "Prisma", "Postgres", "Telegram Bot API", "Cloud Run"],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/dalshe-oss" },
      { text: "Release v0.1.0", url: "https://github.com/zack-dev-cm/dalshe-oss/releases/tag/v0.1.0" }
    ],
    images: [
      { url: `${LOCAL_IMG_BASE}/dalshe-1.png`, alt: "Dalshe donation mini app" },
      { url: `${LOCAL_IMG_BASE}/dalshe-2.png`, alt: "Dalshe circular donation visual" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/dalshe-1.png`,
    repoFullName: "zack-dev-cm/dalshe-oss",
    canonicalLinks: {
      github: "https://github.com/zack-dev-cm/dalshe-oss"
    }
  },
  {
    id: 35,
    title: "DoctorAI – Dermatology Triage Mini App",
    description: "Telegram mini app for dermatology-first AI triage with verification guardrails and an optional therapist mode.",
    longDescription: "FastAPI service with image-aware triage, a verification pass for safety, and a lightweight Telegram Web App UI built for fast patient intake.",
    keyFeatures: ["Image-aware dermatology triage + verifier", "Therapist mode toggle", "Telegram Web App UI + bot entry point"],
    techStack: ["Python", "FastAPI", "OpenAI API", "Telegram Web Apps", "Playwright"],
    benchmarks: [
      { label: "As of", value: "2026-02-13", context: "GitHub snapshot" },
      { label: "GitHub stars", value: "0" },
      { label: "Open issues", value: "0" },
      { label: "Last push", value: "2025-12-05" }
    ],
    links: [
      { text: "Open Telegram Mini App", url: "https://t.me/doctorai_bot/app" },
      { text: "GitHub", url: "https://github.com/zack-dev-cm/doctorai" }
    ],
    images: [
      { url: `${LOCAL_IMG_BASE}/doctorai-cover.png`, alt: "DoctorAI triage cover" },
      { url: `${LOCAL_IMG_BASE}/doctorai-hero.png`, alt: "DoctorAI hero UI" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/doctorai-cover.png`
  },
  {
    id: 36,
    title: "Probes – AI Magazine Mini App",
    aliases: ["probes", "probes bot", "ai magazine"],
    description: "AI-generated Forbes-style daily magazine inside Telegram with articles, cover images, and engagement tools.",
    longDescription: "Telegram mini app with a daily AI magazine feed: articles + cover images, likes/bookmarks/comments, and a bot + API pipeline that powers content generation.",
    projectKind: "user-product",
    surfaceTags: ["mobile", "web"],
    mobileReady: true,
    keyFeatures: ["Telegram mini app magazine feed", "Automated article + cover generation", "Engagement stats with likes/bookmarks/comments"],
    techStack: ["Vite", "React", "TypeScript", "Express", "Prisma", "Postgres", "Telegram Bot API"],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/probes-oss" },
      { text: "Release v0.1.0", url: "https://github.com/zack-dev-cm/probes-oss/releases/tag/v0.1.0" }
    ],
    images: [
      { url: `${LOCAL_IMG_BASE}/probes.png`, alt: "Probes mini app preview" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/probes.png`,
    repoFullName: "zack-dev-cm/probes-oss",
    canonicalLinks: {
      github: "https://github.com/zack-dev-cm/probes-oss"
    }
  },
  {
    id: 37,
    title: "Turbo Tots Garage (motion + touch PWA)",
    description: "Gentle, goofy dashboard with a turbo gauge, big arrow pads, and a glowing clock for toddlers.",
    longDescription: "Touch-first toddler dashboard with a turbo gauge, glowing clock, motion-sensor boosts, and playful engine/tick sounds.",
    keyFeatures: ["Touch + motion sensor controls", "Playful audio cues and animations", "Large, stroller-friendly controls"],
    techStack: ["Vite", "React", "TypeScript", "Web Audio", "Device Motion", "Playwright"],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/toddler-games-oss" },
      { text: "Release v0.1.0", url: "https://github.com/zack-dev-cm/toddler-games-oss/releases/tag/v0.1.0" }
    ],
    images: [
      { url: `${LOCAL_IMG_BASE}/turbo-tots-1.jpg`, alt: "Turbo Tots dashboard" },
      { url: `${LOCAL_IMG_BASE}/turbo-tots-2.jpg`, alt: "Turbo Tots control panel" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/turbo-tots-1.jpg`,
    repoFullName: "zack-dev-cm/toddler-games-oss",
    canonicalLinks: {
      github: "https://github.com/zack-dev-cm/toddler-games-oss"
    }
  },
  {
    id: 38,
    title: "Project Steer - Bio-Print Creator Studio",
    description: "Game-like, Cyberpunk 2077-inspired Telegram mini app + MCP connector for bio-print memory activation and creator studio generation, inspired by the Eiffel Tower LLaMA space and General Agentic Memory Via Deep Research.",
    longDescription: "Telegram mini app and MCP connector for bio-print memory activation, QR-based print flows, and creator studio generation with a bot + API service. Inspired by the Eiffel Tower LLaMA space (https://huggingface.co/spaces/dlouapre/eiffel-tower-llama) and the paper \"General Agentic Memory Via Deep Research\" by B.Y. Yan, Chaofan Li, Hongjin Qian, Shuqi Lu, and Zheng Liu (https://arxiv.org/abs/2511.18423).",
    keyFeatures: ["Telegram mini app + bot", "MCP connector with OAuth issuer", "QR activation + print storage pipeline"],
    techStack: ["Node.js", "Express", "Telegraf", "Prisma", "Postgres", "Vite", "React", "TypeScript", "Cloud Run", "MCP"],
    links: [{ text: "Open Telegram Mini App", url: "https://t.me/steer_prints_bot/app" }],
    images: [
      { url: `${LOCAL_IMG_BASE}/steer-loading-screen.webm`, alt: "Project Steer loading screen video" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/steer-loading-screen.webm`
  },
  {
    id: 39,
    title: "Noel - Noetic Mirror",
    description: "Live Telegram mini app streaming a researcher/subject AI loop with Stars-powered interventions, consent gates, and real-time telemetry.",
    longDescription: "Noetic Mirror runs a live research loop between two models: a Researcher (OpenAI) that synthesizes prior turns and telemetry into probing prompts, and a Subject (Gemini) that returns long-context reasoning plus self-reported tags. Each paired turn is gated by consent, safety, and budget checks, logged to Postgres/Redis, and streamed to the Telegram mini app with diagnostics, session summaries, and EN/RU plus light/dark themes. Users can sponsor interventions with Telegram Stars while the admin controls adjust model versions, pacing, and thresholds.",
    keyFeatures: [
      "Two-model loop with explicit roles and paired turns (Researcher probes, Subject reasons)",
      "Live stream with turn pairing, diagnostics, and session telemetry",
      "Consent, safety, and budget gates before each intervention",
      "Telegram Stars sponsorships and paid interventions",
      "EN/RU localization with light/dark theme toggle",
      "Admin controls for model versions, pacing, and stream settings"
    ],
    techStack: [
      "React",
      "TypeScript",
      "Telegram Web Apps",
      "Vite",
      "Node.js",
      "Express",
      "WebSocket",
      "Postgres",
      "Redis",
      "Cloud Run",
      "OpenAI API",
      "Gemini API"
    ],
    benchmarks: [
      { label: "As of", value: "2026-02-13", context: "GitHub snapshot" },
      { label: "GitHub stars", value: "0" },
      { label: "Open issues", value: "0" },
      { label: "Last push", value: "2026-01-30" }
    ],
    links: [
      { text: "Open Telegram Mini App", url: "https://t.me/noetic_mirror_bot/app" },
      { text: "Telegram Channel", url: "https://t.me/noel_mirror" },
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/noel" }
    ],
    images: [
      { url: `${LOCAL_IMG_BASE}/noel-live.png`, alt: "Noetic Mirror live session demo UI" },
      { url: `${LOCAL_IMG_BASE}/noel-architecture.png`, alt: "Noetic Mirror architecture flow diagram" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/noel-live.png`,
    mermaidDiagram: `flowchart LR
  User[Telegram User] --> TMA[Noetic Mirror Mini App]
  TMA -->|initData + controls| API[Web API Service]
  TMA -->|live stream| WS[WebSocket Stream]
  API --> Store[(Postgres + Redis)]
  API --> Stars[Telegram Stars]
  API --> Gate[Consent + Safety + Budget Gate]
  WS --> Worker[Research Loop Worker]
  Gate --> Worker
  Worker --> Researcher[Researcher Model - OpenAI]
  Worker --> Subject[Subject Model - Gemini]
  Researcher -->|probe prompts| Subject
  Subject -->|reasoned replies| Researcher
  Worker --> Summaries[Session Summaries]
  Summaries --> Store
  Worker -->|paired turns + telemetry| WS
  API --> Channel[Noel Mirror Channel]`
  },
  {
    id: 40,
    title: "GeoFix - AI Visibility Memorizer Mini App",
    description: "Telegram mini app that scans a website for AI visibility and generates llms.txt, llms-full.txt, and JSON-LD for bot delivery.",
    longDescription: "GeoFix runs AI visibility scans, surfaces a scorecard with GEO diagnostics, and generates Server-Side Memorizer assets (llms.txt, llms-full.txt, schema.jsonld). The unified Cloud Run service ships a React web app, FastAPI API, and Celery worker with Redis-backed jobs, plus Telegram bot delivery and hosted previews.",
    keyFeatures: [
      "AI visibility scorecard with GEO diagnostics",
      "Memorizer generation for llms.txt, llms-full.txt, and schema.jsonld",
      "Telegram bot delivery with hosted previews",
      "Unified Cloud Run deployment for web, API, and worker services"
    ],
    techStack: [
      "React",
      "TypeScript",
      "Vite",
      "Python",
      "FastAPI",
      "Celery",
      "Redis",
      "OpenAI API",
      "Telegram Web Apps",
      "Cloud Run",
      "GCS"
    ],
    benchmarks: [
      { label: "Generated assets", value: "3", context: "llms.txt, llms-full.txt, schema.jsonld" },
      { label: "Cloud Run services", value: "3", context: "web, API, worker" },
      { label: "Delivery channels", value: "2", context: "web previews + Telegram mini app" },
      { label: "External integrations", value: "4", context: "OpenAI, Telegram, target site, Medaudit GEO API" }
    ],
    links: [{ text: "Open Telegram Mini App", url: "https://t.me/geofix_app_bot/launch" }],
    images: [
      { url: `${LOCAL_IMG_BASE}/geofix-architecture.png`, alt: "GeoFix architecture diagram" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/geofix-architecture.png`,
    mermaidDiagram: `flowchart TB
  subgraph GCP
    FE[Cloud Run: web]
    API[Cloud Run: api]
    WORKER[Cloud Run: worker]
    REDIS[(Redis)]
    GCS[(GCS bucket)]
    LOGS[Cloud Logging]
  end
  FE --> API
  API --> REDIS
  REDIS --> WORKER
  WORKER --> GCS
  API --> GCS
  API --> LOGS
  WORKER --> LOGS
  API --> TGAPI[Telegram Bot API]
  WORKER --> OPENAI[OpenAI API]
  WORKER --> SITE[Target Website]
  API --> MEDA[ Medaudit GEO API ]`
  },
  {
    id: 41,
    title: "Pores & Wrinkles Detection Service",
    description: "Face texture analysis service that detects pores and wrinkles and returns labeled overlays and metrics.",
    longDescription: "High-resolution facial analysis pipeline: MediaPipe landmarks to ROI crops/masks, classic pore and wrinkle detectors with an optional YOLO segmentation gate, and an async job API (progress + results). Ships as a FastAPI Cloud Run service with an MLflow console plus a Flutter demo client and Telegram Mini App UI.",
    keyFeatures: [
      "MediaPipe landmark-based ROI extraction",
      "Classic pore + wrinkle detectors with optional segmentation gate",
      "Async job API with progress + results endpoints",
      "Flutter demo client and Telegram Mini App UI"
    ],
    techStack: ["Python", "FastAPI", "MediaPipe", "YOLO", "ONNX", "Cloud Run", "Flutter", "MLflow"],
    benchmarks: [
      { label: "API endpoints", value: "8", context: "/, /app, /tma, /v1/*, /healthz" },
      { label: "Tasks", value: "3", context: "pores, wrinkles, pores+wrinkles" },
      { label: "Image types", value: "5", context: "jpeg/png/webp/tiff/bmp" },
      { label: "Default imgsz", value: "1280", context: "segment endpoint default" }
    ],
    links: [],
    images: [],
    thumbnail: "",
    hideImages: true
  },
  {
    id: 42,
    title: "OpenClaw Workstream - Telegram Mini App QA & Launch Validation",
    legacySlugs: ["openclaw-workstream-telegram-mini-app-e2e-launch-ops"],
    description: "OpenClaw automation for Telegram mini app QA, launch verification, and rapid UI evidence loops.",
    longDescription: "This project documents the OpenClaw work I used for Telegram mini apps: reproducible browser E2E validation, gateway and runtime reliability fixes, and screenshot evidence packs used to iterate UI quickly across mini game cycles. It stays focused on shipped QA and launch work, not a generic OpenClaw platform overview.",
    keyFeatures: [
      "Reproducible Telegram Web E2E checks for mini app launch, auth, and request/inbox flows",
      "OpenClaw gateway reliability hardening and runtime compatibility fixes",
      "Desktop + mobile GUI evidence capture for fast UI redesign and regression review",
      "Structured launch verification for bot + Mini App setup and QA handoff"
    ],
    techStack: ["OpenClaw", "Telegram Web", "Playwright", "Node.js", "Python", "Runbooks", "Mini Apps"],
    benchmarks: [
      { label: "Reproducible E2E actions", value: "8", context: "AI-Humans Mini App OpenClaw log (2026-02-06)" },
      { label: "GUI evidence assets", value: "26 files", context: "screens + moodboard + Midjourney packs" },
      { label: "Latest regression run", value: "6/6 passed", context: "Task 7.2 pytest report (2026-02-15)" },
      { label: "UI redesign cycles", value: "2", context: "Task 7.1 and Task 7.2" }
    ],
    links: [
      { text: "OpenClaw Upstream", url: "https://github.com/openclaw/openclaw" }
    ],
    images: [],
    thumbnail: "",
    hideImages: true
  },
  {
    id: 43,
    title: "CV Repro Lab Skills",
    legacySlugs: ["agentic-cv-repro-lab-skill"],
    description: "Public ClawHub releases for benchmark-gated CV experimentation, browser validation, and promotion gating.",
    longDescription: "I turned a reproducible CV experimentation workflow into two public, installable ClawHub skills for teams running browser-heavy and GPU-heavy vision work. The releases package experiment records, browser notebook evidence, heartbeat-aware VM execution, review dashboards, and promotion bundles that separate semantic, runtime, and product-surface checks.",
    keyFeatures: [
      "Packages benchmark-gated CV experimentation into two public ClawHub skills teams can install and reuse",
      "Captures reproducible experiment state with run cards, dataset manifests, review dashboards, and redacted public context snapshots",
      "Validates Colab, Kaggle, and browser-driven CV workflows with browser run cards and per-image validation scorecards",
      "Adds campaign planning and claim review with contamination checks, rerun policy, and benchmark evidence"
    ],
    techStack: ["ClawHub", "OpenClaw Skills", "Python", "PyTorch", "Computer Vision", "Google Colab", "Kaggle", "MLOps", "Release Engineering"],
    benchmarks: [
      { label: "ClawHub downloads", value: "457 total", context: "live public ClawHub listings, 2026-04-23 (226 data-science-cv-repro-lab + 231 sota-agent)" },
      { label: "Published versions", value: "17 total", context: "live public ClawHub listings, 2026-04-23 (8 + 9 packages)" },
      { label: "Live packages", value: "2", context: "data-science-cv-repro-lab + sota-agent" },
      { label: "Current versions", value: "v1.9.1 / v1.4.1", context: "ClawHub releases" },
      { label: "Execution surfaces", value: "3", context: "semantic, runtime, and product-surface promotion gates" },
      { label: "Structured helpers", value: "29 scripts", context: "manifests, scorecards, summaries, and claim-review tools" }
    ],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/agentic-cv-repro-lab-skill" },
      { text: "Open CV Repro Lab on ClawHub", url: "https://clawhub.ai/zack-dev-cm/data-science-cv-repro-lab" },
      { text: "Open SOTA Agent on ClawHub", url: "https://clawhub.ai/zack-dev-cm/sota-agent" }
    ],
    images: [
      { url: `${LOCAL_IMG_BASE}/agentic-cv-repro-lab-skill.png`, alt: "CV Repro Lab ClawHub release preview" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/agentic-cv-repro-lab-skill.png`
  },
  {
    id: 44,
    title: "OpenClaw Sales Manager Automation for a Multi-Clinic Chain",
    description: "Anonymized clinic-chain case study: OpenClaw-driven sales automation layered onto a legacy database with human approvals.",
    longDescription: "I built an anonymized sales-manager automation layer for a large multi-clinic network that needed AI assistance without replacing its legacy back office. The system used OpenClaw-driven automation to qualify inbound leads, draft follow-ups, surface next actions to staff, and sync approved state changes back into the existing database layer. The published case study redacts the client name, schema details, endpoint specifics, and patient-identifying data while preserving the delivery scope behind the rollout.",
    keyFeatures: [
      "OpenClaw-driven lead qualification, follow-up drafting, and next-step recommendations",
      "Legacy DB bridge that preserved the existing clinic back office instead of forcing a rewrite",
      "Human-in-the-loop approval rules for escalations and appointment routing",
      "Redacted public case study with client identity, schema details, and endpoint specifics removed"
    ],
    techStack: ["OpenClaw", "LLM Orchestration", "Legacy DB Integration", "Workflow Automation", "Human Review Tooling"],
    benchmarks: [
      { label: "Workflow stages", value: "7", context: "lead, intake, drafts, approval, review, legacy, reporting" },
      { label: "Back-office rewrites", value: "0", context: "existing clinic system preserved" },
      { label: "Human control points", value: "3", context: "approvals, escalations, routing" }
    ],
    links: [],
    mermaidDiagram: `flowchart LR
  Lead["Inbound Lead"] --> Intake["OpenClaw Intake + Qualification"]
  Intake --> Drafts["Follow-up Drafts + Next-Step Proposals"]
  Intake --> Operator["Staff Review Queue"]
  Drafts --> Review["Approval + Escalation Rules"]
  Operator --> Review
  Review --> Legacy["Legacy DB / CRM Layer"]
  Legacy --> Reporting["Status Sync + Reporting"]`,
    images: [],
    thumbnail: "",
    hideImages: true
  },
  {
    id: 45,
    title: "AntiRot - Research Artifact Linter",
    description: "Open-source CLI that catches unsupported claims, broken citations, weak evidence anchors, and draft markers in AI-written research drafts.",
    longDescription: "AntiRot is a local-first review harness for Markdown research artifacts. It turns the final draft into a gateable surface by flagging unsupported claims, missing evidence anchors, citation mismatches, comparative hype, absolute overclaim language, and leftover draft markers before a paper, proposal, or lab note ships. The current public release adds paragraph-aware parsing, in-document references support, safer citation verification, and GitHub Actions coverage for text, JSON, Markdown, and SARIF outputs.",
    keyFeatures: [
      "Catches unsupported claims, citation drift, hype language, comparative overreach, absolute claims, and leftover draft markers in Markdown drafts",
      "Supports paragraph-aware evidence carry, footnotes, inline links, DOIs, arXiv ids, and in-document references sections",
      "Runs locally with no API key and no network dependency, so it fits agent loops, proposals, and paper pipelines",
      "Emits text, JSON, Markdown, and SARIF outputs for terminal use, CI gates, and GitHub-native review flows"
    ],
    techStack: ["Python", "CLI", "Markdown", "SARIF", "GitHub Actions", "Research Agents"],
    benchmarks: [
      { label: "Public release", value: "v0.2.0", context: "GitHub release" },
      { label: "Output formats", value: "4", context: "text, json, markdown, sarif" },
      { label: "Issue families", value: "8", context: "unsupported, numeric, citation-not-found, citation-unverified, hype, comparative, absolute, draft markers" },
      { label: "Runtime deps", value: "0", context: "standard-library CLI" }
    ],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/antirot" },
      { text: "Release v0.2.0", url: "https://github.com/zack-dev-cm/antirot/releases/tag/v0.2.0" }
    ],
    images: [
      { url: `${LOCAL_IMG_BASE}/antirot-social-card.svg`, alt: "AntiRot project preview" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/antirot-social-card.svg`,
    repoFullName: "zack-dev-cm/antirot"
  },
  {
    id: 46,
    title: "GitHub + ClawHub Launcher",
    description: "Public launcher skill that turns one local project folder into a repeatable GitHub repo plus ClawHub publish flow.",
    longDescription: "GitHub + ClawHub Launcher is a small public OpenClaw skill for release preparation. It creates a machine-readable launch manifest, checks the public release surface, renders GitHub release notes, and prints the exact commands needed to publish a GitHub repo and a ClawHub package from one local project folder.",
    keyFeatures: [
      "Creates one launch manifest for GitHub repo metadata, ClawHub package metadata, topics, tags, and changelog text",
      "Checks README, LICENSE, SKILL.md, agents metadata, semver, slug shape, and basic description quality before publishing",
      "Renders release notes and a publish command sheet instead of rewriting the same launch steps from memory",
      "Pairs cleanly with Publish Guard when you want an audit before the final push"
    ],
    techStack: ["ClawHub", "GitHub CLI", "Python", "Release Engineering", "OpenClaw Skills"],
    benchmarks: [
      { label: "ClawHub downloads", value: "103", context: "live public ClawHub listing, 2026-04-23" },
      { label: "Published versions", value: "3", context: "live public ClawHub listing, 2026-04-23" },
      { label: "Public release", value: "v1.0.2", context: "GitHub + ClawHub" },
      { label: "Bundled scripts", value: "4", context: "manifest, check, notes, commands" },
      { label: "Publish surfaces", value: "2", context: "GitHub repo + ClawHub package" },
      { label: "Validation status", value: "publish-ready", context: "launcher check + publish-guard audit" }
    ],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/github-clawhub-launcher" },
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/github-clawhub-launcher" },
      { text: "Release v1.0.2", url: "https://github.com/zack-dev-cm/github-clawhub-launcher/releases/tag/v1.0.2" }
    ],
    images: [],
    thumbnail: "",
    hideImages: true,
    repoFullName: "zack-dev-cm/github-clawhub-launcher"
  },
  {
    id: 47,
    title: "Browser Proof",
    description: "Public browser QA skill that turns a live browser session into a reusable evidence pack with steps, artifacts, checks, and a report.",
    longDescription: "Browser Proof is a small public OpenClaw skill for browser QA and debugging. It creates a machine-readable session manifest, records expected-versus-actual browser steps, ties screenshots and logs to each step, validates the resulting bundle, and renders a markdown report that is easier to hand off than screenshots in chat.",
    keyFeatures: [
      "Creates one machine-readable browser session manifest with app, goal, surfaces, and run context",
      "Appends evidence-backed steps with expected result, actual result, status, and artifact references",
      "Checks the bundle for missing screenshots, incomplete failed steps, and absolute artifact paths before sharing",
      "Renders a shareable markdown report for GitHub issues, release checks, and engineering handoffs"
    ],
    techStack: ["ClawHub", "Python", "Browser QA", "OpenClaw Skills", "Release Engineering"],
    benchmarks: [
      { label: "ClawHub downloads", value: "123", context: "live public ClawHub listing, 2026-04-23" },
      { label: "Published versions", value: "4", context: "live public ClawHub listing, 2026-04-23" },
      { label: "Public release", value: "v1.0.2", context: "GitHub + ClawHub" },
      { label: "Bundled scripts", value: "4", context: "init, append, check, render" },
      { label: "Evidence fields", value: "5", context: "screenshot, dom, console, network, video" },
      { label: "Validation status", value: "publish-ready", context: "smoke test + publish-guard audit" }
    ],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/browser-proof" },
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/browser-proof" },
      { text: "Release v1.0.2", url: "https://github.com/zack-dev-cm/browser-proof/releases/tag/v1.0.2" }
    ],
    images: [],
    thumbnail: "",
    hideImages: true,
    repoFullName: "zack-dev-cm/browser-proof"
  },
  {
    id: 48,
    title: "Publish Guard",
    description: "Public release-audit skill that reviews a repo, README, SKILL.md, and launch copy before GitHub or ClawHub publish.",
    longDescription: "Publish Guard is a small public OpenClaw skill for pre-release audits. It scans a repo for obvious leak patterns, checks whether README and SKILL copy are actually public-facing, scores launch copy near the top of the repo, and renders one concise audit that answers publish now or fix first.",
    keyFeatures: [
      "Scans for obvious leak patterns such as token-shaped strings, localhost URLs, websocket endpoints, and absolute paths",
      "Checks README, SKILL.md, and public metadata for audience mismatch, buried quick starts, and operator-heavy wording",
      "Scores the landing-page copy so the repo intro can be reviewed like a product surface instead of a private note",
      "Renders one markdown audit that is easy to use before GitHub release or ClawHub publish"
    ],
    techStack: ["ClawHub", "Python", "Release Engineering", "OpenClaw Skills", "GitHub"],
    benchmarks: [
      { label: "ClawHub downloads", value: "113", context: "live public ClawHub listing, 2026-04-23" },
      { label: "Published versions", value: "3", context: "live public ClawHub listing, 2026-04-23" },
      { label: "Public release", value: "v1.0.2", context: "GitHub + ClawHub" },
      { label: "Bundled scripts", value: "4", context: "leaks, surface, copy score, report" },
      { label: "Audit outputs", value: "4", context: "2 scans, 1 score, 1 markdown audit" },
      { label: "Decision surface", value: "publish or fix", context: "single release-ready recommendation" }
    ],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/publish-guard" },
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/public-surface-review" },
      { text: "Release v1.0.2", url: "https://github.com/zack-dev-cm/publish-guard/releases/tag/v1.0.2" }
    ],
    images: [],
    thumbnail: "",
    hideImages: true,
    repoFullName: "zack-dev-cm/publish-guard"
  },
  {
    id: 49,
    legacySlugs: ["youtube-creator-ops"],
    title: "OpenClaw YouTube Publisher",
    description: "Open-source OpenClaw workflow for publishing a YouTube Short with reusable reporting and structured Midjourney/Suno provenance.",
    longDescription: "This project packages a reusable OpenClaw workflow for YouTube Studio. It initializes a run file, records upload, check, and publish steps, keeps structured provenance for Midjourney, Suno, and local edit stages, validates the bundle, and renders a public-safe report with private paths and non-public URLs redacted. The workflow is designed for repeatable publishing and debugging through a logged-in browser profile, not for hidden background posting.",
    keyFeatures: [
      "Initializes one run manifest with channel, goal, stage, visibility, and file references",
      "Carries structured provenance for Midjourney visuals, Suno audio, local edit stages, and required public credits",
      "Logs upload, metadata, checks, and publish steps with status, notes, screenshots, and final public URL",
      "Validates the bundle before sharing so missing screenshots and unsafe artifact paths are caught early",
      "Renders a reusable markdown report for review, debugging, and future repeat runs"
    ],
    techStack: ["ClawHub", "Python", "YouTube Studio", "OpenClaw", "Midjourney", "Suno", "GitHub Actions"],
    benchmarks: [
      { label: "ClawHub downloads", value: "167", context: "live public ClawHub listing, 2026-04-23" },
      { label: "Published versions", value: "11", context: "live public ClawHub listing, 2026-04-23" },
      { label: "Public release", value: "v1.1.3", context: "GitHub + ClawHub" },
      { label: "Platform", value: "YouTube Studio", context: "browser-based publish flow" },
      { label: "Modes", value: "dry_run + live", context: "same manifest, different publish intent" },
      { label: "Outputs", value: "JSON + Markdown", context: "run manifest, provenance block, and shareable report" }
    ],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/youtube-creator-ops" },
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/youtube-creator-ops" },
      { text: "Release v1.1.3", url: "https://github.com/zack-dev-cm/youtube-creator-ops/releases/tag/v1.1.3" }
    ],
    images: [],
    thumbnail: "",
    hideImages: true,
    repoFullName: "zack-dev-cm/youtube-creator-ops"
  },
  {
    id: 51,
    title: "Artifact Redactor",
    description: "Public skill for redacting private paths, secret-like strings, private URLs, and common PII from text artifacts before sharing them.",
    longDescription: "Artifact Redactor is a small public OpenClaw skill and local-first Python toolkit for making shareable artifact bundles safer. It scans supported text files for obvious leak patterns, writes a redacted copy into a clean output directory, re-checks the processed text output, and renders a markdown report that explains what was found, what was rewritten, and which files still need manual review. The public contract is intentionally narrow in v1.0.5: text artifacts are handled automatically, while skipped binary files stay manual-review-required instead of being silently treated as cleared. The command-line entrypoints now fail fast on missing inputs instead of returning a false-clear result from an empty or mistyped path.",
    keyFeatures: [
      "Scans Markdown, JSON, logs, YAML, CSV, and similar text artifacts for private paths, private URLs, secret-like strings, email addresses, and phone numbers",
      "Writes a redacted copy into a separate output directory so the raw bundle stays untouched",
      "Strips query strings from public URLs while redacting localhost, private hosts, and credentialed URLs",
      "Flags binary or unsupported files for manual review instead of pretending they were auto-sanitized",
      "Renders a concise markdown report for bug reports, vendor handoffs, release reviews, and public issues"
    ],
    techStack: ["ClawHub", "Python", "Privacy", "Redaction", "OpenClaw Skills", "Release Engineering"],
    benchmarks: [
      { label: "ClawHub downloads", value: "104", context: "live public ClawHub listing, 2026-04-23" },
      { label: "Published versions", value: "6", context: "live public ClawHub listing, 2026-04-23" },
      { label: "Public release", value: "v1.0.5", context: "GitHub + ClawHub" },
      { label: "Bundled scripts", value: "4", context: "scan, redact, check, report" },
      { label: "Pattern families", value: "6", context: "private url, path, secret, email, phone, public-url query cleanup" },
      { label: "Binary policy", value: "manual review", context: "unsupported files are flagged, not silently copied" }
    ],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/artifact-redactor" },
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/artifact-redactor" },
      { text: "Release v1.0.5", url: "https://github.com/zack-dev-cm/artifact-redactor/releases/tag/v1.0.5" }
    ],
    images: [],
    thumbnail: "",
    hideImages: true,
    repoFullName: "zack-dev-cm/artifact-redactor"
  },
  {
    id: 52,
    title: "Artifact Deck",
    description: "Public OpenClaw skill for building reproducible PPTX decks from curated notes, status bullets, and screenshots.",
    longDescription: "Artifact Deck is a small public OpenClaw skill and local-first Python toolkit for turning project artifacts into a decision-ready PPTX. It builds a clean deck from a JSON manifest, validates slide and image inputs before generation, writes the deck locally, and renders a share-safe markdown summary that preserves the slide list and a rebuild command template without exposing absolute local paths. The public contract is intentionally narrow in v1.0.3: curated notes and screenshots in, one default stakeholder layout out.",
    keyFeatures: [
      "Builds one reproducible PPTX deck from markdown-backed sections, direct bullet slides, and optional screenshot appendix entries",
      "Validates missing content, empty slides, and broken image paths before deck generation starts",
      "Keeps the layout simple and deterministic for weekly updates, launch reviews, and client status decks",
      "Renders a share-safe markdown summary with slide titles, slide counts, and a rebuild command template",
      "Ships with GitHub Actions smoke coverage for the manifest, validation, build, and summary flow"
    ],
    techStack: ["ClawHub", "Python", "python-pptx", "OpenClaw Skills", "PPTX", "Release Engineering"],
    benchmarks: [
      { label: "ClawHub downloads", value: "61", context: "live public ClawHub listing, 2026-04-23" },
      { label: "Published versions", value: "4", context: "live public ClawHub listing, 2026-04-23" },
      { label: "Public release", value: "v1.0.3", context: "GitHub + ClawHub" },
      { label: "Bundled scripts", value: "4", context: "init, check, build, render" },
      { label: "Primary output", value: "PPTX", context: "deterministic local deck build" },
      { label: "Summary mode", value: "share-safe", context: "no absolute local paths in the markdown output" }
    ],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/artifact-deck" },
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/artifact-deck" },
      { text: "Release v1.0.3", url: "https://github.com/zack-dev-cm/artifact-deck/releases/tag/v1.0.3" }
    ],
    images: [],
    thumbnail: "",
    hideImages: true,
    repoFullName: "zack-dev-cm/artifact-deck"
  },
  {
    id: 53,
    title: "GitHub + ClawHub Downloads Tracker",
    aliases: ["github-stars-optimizer", "clawhub downloads tracker", "clawhub traction tracker"],
    description: "CLI and report flow for tracking GitHub stars, live ClawHub downloads, publisher stats, and traction deltas.",
    longDescription: "GitHub + ClawHub Downloads Tracker packages the `github-stars-optimizer` workflow into a public evidence surface. It pulls GitHub repository metadata, ClawHub leaderboards, explicit skill slugs, and copied publisher dashboard stats, then renders a blunt traction report with downloads, star conversion gaps, snapshot deltas, 30-day scenarios, and consolidation bets. It keeps ClawHub downloads visible in the portfolio instead of burying them inside separate package pages.",
    projectKind: "open-source",
    surfaceTags: ["open-source", "automation", "analytics"],
    keyFeatures: [
      "Fetches live ClawHub package stats and keeps exact download counts visible beside GitHub repo traction",
      "Parses copied publisher dashboard stats for downloads, stars, version counts, and explicit-only skills",
      "Stores snapshots so repeated runs can show deltas, fastest package download gains, and current pace",
      "Ranks consolidation and positioning bets when GitHub stars and ClawHub downloads are not converting"
    ],
    techStack: ["Python", "CLI", "GitHub API", "ClawHub Convex", "JSON Snapshots", "Markdown Reports", "Open-source Analytics"],
    benchmarks: [
      { label: "Tracked ClawHub downloads", value: "1,349", context: "live public ClawHub listings, 2026-04-23 across 10 packages" },
      { label: "Tracked packages", value: "10", context: "CV Repro Lab, SOTA Agent, launcher, browser-proof, publish-guard, YouTube publisher, redactor, deck, HH agent, CWS publisher" },
      { label: "CV Repro Lab downloads", value: "457 total", context: "226 data-science-cv-repro-lab + 231 sota-agent, 2026-04-23" },
      { label: "Strongest package", value: "231 downloads", context: "sota-agent live public listing, 2026-04-23" },
      { label: "Report outputs", value: "3", context: "text, JSON, Markdown" },
      { label: "Projection horizon", value: "30 days", context: "pace and peer-conversion upside scenarios" }
    ],
    links: [
      { text: "Open CV Repro Lab on ClawHub", url: "https://clawhub.ai/zack-dev-cm/data-science-cv-repro-lab" },
      { text: "Open SOTA Agent on ClawHub", url: "https://clawhub.ai/zack-dev-cm/sota-agent" }
    ],
    images: [],
    thumbnail: "",
    hideImages: true
  },
  {
    id: 54,
    title: "Toybox Mini - Telegram Mini App",
    description: "Open-source toddler-first Telegram mini app with calm tap games, a parent area, anonymous score storage, and optional browser auth.",
    longDescription: "Toybox Mini packages a calm toddler-first Telegram mini app with a FastAPI backend, score storage that keeps raw Telegram ids out of the database, and optional Login Widget support for browser sessions outside Telegram. The public release focuses on the smallest secure surface: tap games, parent controls, strict initData checks in production, and regression coverage for auth and score handling.",
    projectKind: "open-source",
    surfaceTags: ["mobile", "web", "open-source"],
    mobileReady: true,
    keyFeatures: [
      "Calm tap games with toddler-first pacing",
      "Parent area plus anonymous score storage",
      "Production Telegram auth checks with optional browser login widget support"
    ],
    techStack: ["Python", "FastAPI", "Telegram Web Apps", "SQLite", "HTML", "CSS", "JavaScript", "Pytest"],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/toybox-tma-oss" },
      { text: "Release v0.1.0", url: "https://github.com/zack-dev-cm/toybox-tma-oss/releases/tag/v0.1.0" }
    ],
    images: [],
    thumbnail: "",
    hideImages: true,
    repoFullName: "zack-dev-cm/toybox-tma-oss",
    canonicalLinks: {
      github: "https://github.com/zack-dev-cm/toybox-tma-oss"
    }
  },
  {
    id: 50,
    title: "HH OpenClaw Agent",
    description: "Public OpenClaw skill for reviewed hh.ru application packets, live browser execution, approval gates, and auditable submission bundles.",
    longDescription: "HH OpenClaw Agent is a small public OpenClaw skill for hh.ru application work through OpenClaw. It creates a machine-readable packet for one vacancy response flow, logs the live browser steps with evidence, validates the resulting bundle, and renders a markdown report for review, debugging, or funnel tracking. The public workflow requires an approved review state before submit and treats login, CAPTCHA, passkey, and 2FA as operator-owned interruptions.",
    keyFeatures: [
      "Creates one machine-readable application packet with vacancy details, cover letter content, review state, and blocked actions",
      "Appends evidence-backed browser steps with status, effect, artifacts, issue keys, and optional outcome URL",
      "Checks approval state, failed-step detail, screenshot coverage, and unsafe absolute artifact paths before the bundle is shared",
      "Renders a concise markdown report for job-funnel review, debugging, and operator handoff"
    ],
    techStack: ["ClawHub", "Python", "hh.ru", "OpenClaw Skills", "Career Automation"],
    benchmarks: [
      { label: "ClawHub downloads", value: "112", context: "live public ClawHub listing, 2026-04-23" },
      { label: "Published versions", value: "6", context: "live public ClawHub listing, 2026-04-23" },
      { label: "Public release", value: "v1.0.5", context: "GitHub + ClawHub" },
      { label: "Bundled scripts", value: "4", context: "init, append, check, render" },
      { label: "Approval gate", value: "required", context: "review must be approved before submit" },
      { label: "Validation status", value: "publish-ready", context: "smoke test + publish-guard audit" }
    ],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/hh-openclaw-agent" },
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/hh-openclaw-agent" },
      { text: "Release v1.0.5", url: "https://github.com/zack-dev-cm/hh-openclaw-agent/releases/tag/v1.0.5" }
    ],
    images: [],
    thumbnail: "",
    hideImages: true,
    repoFullName: "zack-dev-cm/hh-openclaw-agent"
  }
];
