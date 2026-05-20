import { resolveAssetUrl } from './utils/assets';
import type { Project, Company, SocialLinks, AuthorInfo, LatestUpdate, ClawHubDownloadStat, ChromeExtensionStatsSnapshot } from './types';

const LOCAL_IMG_BASE = resolveAssetUrl('images');
const LOCAL_COMPANY_LOGO_BASE = resolveAssetUrl('company-logos');

export const AUTHOR_INFO: AuthorInfo = {
  name: "Zakhar Pashkin",
  title: "Senior Computer Vision Engineer - AI Product Engineer",
  bio: "I build production OCR, segmentation, detection, multimodal search, VLM/LLM workflows, backend delivery, and human-reviewed launch gates."
};

export const SOCIAL_LINKS: SocialLinks = {
  linkedin: "https://de.linkedin.com/in/zakhar-pashkin-a524a6163",
  x: "https://x.com/Zackdevcv",
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
  "74 public case studies and launches spanning public-safe CV systems, automation, research tooling, Telegram mini apps, browser extensions, mobile, cloud delivery, and open-source release systems.",
  "9,587 tracked ClawHub downloads across 40 public skills as of 2026-05-20, with review-gated delivery, benchmark evidence, approvals, rollback paths, and measurable outcomes."
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
    slug: "data-science-cv-repro-lab",
    displayName: "Data Science CV Repro Reviewer",
    downloads: 612,
    versions: 12,
    stars: 1,
    url: "https://clawhub.ai/zack-dev-cm/data-science-cv-repro-lab",
    checkedAt: "2026-05-20"
  },
  {
    slug: "openclaw-cws-publisher",
    displayName: "OpenClaw CWS Publisher",
    downloads: 523,
    versions: 14,
    stars: 2,
    url: "https://clawhub.ai/zack-dev-cm/openclaw-cws-publisher",
    checkedAt: "2026-05-20"
  },
  {
    slug: "sota-agent",
    displayName: "SOTA Agent",
    downloads: 523,
    versions: 12,
    stars: 2,
    url: "https://clawhub.ai/zack-dev-cm/sota-agent",
    checkedAt: "2026-05-20"
  },
  {
    slug: "agentic-codex-dev",
    displayName: "Agentic Codex Dev Reviewer",
    downloads: 509,
    versions: 13,
    stars: 1,
    url: "https://clawhub.ai/zack-dev-cm/agentic-codex-dev",
    checkedAt: "2026-05-20"
  },
  {
    slug: "github-clawhub-launcher",
    displayName: "GitHub ClawHub Release Reviewer",
    downloads: 496,
    versions: 9,
    stars: 1,
    url: "https://clawhub.ai/zack-dev-cm/github-clawhub-launcher",
    checkedAt: "2026-05-20"
  },
  {
    slug: "youtube-creator-ops",
    displayName: "OpenClaw YouTube Publisher",
    downloads: 403,
    versions: 13,
    stars: 1,
    url: "https://clawhub.ai/zack-dev-cm/youtube-creator-ops",
    checkedAt: "2026-05-20"
  },
  {
    slug: "artifact-deck",
    displayName: "Artifact Deck",
    downloads: 357,
    versions: 7,
    stars: 1,
    url: "https://clawhub.ai/zack-dev-cm/artifact-deck",
    checkedAt: "2026-05-20"
  },
  {
    slug: "public-surface-review",
    displayName: "Publish Guard",
    downloads: 352,
    versions: 6,
    stars: 1,
    url: "https://clawhub.ai/zack-dev-cm/public-surface-review",
    checkedAt: "2026-05-20"
  },
  {
    slug: "browser-proof",
    displayName: "Browser Proof",
    downloads: 347,
    versions: 6,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/browser-proof",
    checkedAt: "2026-05-20"
  },
  {
    slug: "openclaw-agent-chinese-laoshi",
    displayName: "OpenClaw Chinese Laoshi Ops",
    downloads: 346,
    versions: 7,
    stars: 1,
    url: "https://clawhub.ai/zack-dev-cm/openclaw-agent-chinese-laoshi",
    checkedAt: "2026-05-20"
  },
  {
    slug: "hh-openclaw-agent",
    displayName: "HH OpenClaw Agent",
    downloads: 331,
    versions: 8,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/hh-openclaw-agent",
    checkedAt: "2026-05-20"
  },
  {
    slug: "artifact-redactor",
    displayName: "Artifact Redactor",
    downloads: 322,
    versions: 8,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/artifact-redactor",
    checkedAt: "2026-05-20"
  },
  {
    slug: "telegram-miniapp-security-auditor",
    displayName: "Telegram Mini App Security Auditor",
    downloads: 308,
    versions: 4,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/telegram-miniapp-security-auditor",
    checkedAt: "2026-05-20"
  },
  {
    slug: "random-coffee-best-fit-outreach",
    displayName: "Random Coffee Best Fit Outreach",
    downloads: 252,
    versions: 5,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/random-coffee-best-fit-outreach",
    checkedAt: "2026-05-20"
  },
  {
    slug: "hh-openclaw-proposal-submitter",
    displayName: "HH Application Packet Reviewer",
    downloads: 240,
    versions: 4,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/hh-openclaw-proposal-submitter",
    checkedAt: "2026-05-20"
  },
  {
    slug: "affiliate-video-campaign-operator",
    displayName: "Affiliate Video Campaign Reviewer",
    downloads: 220,
    versions: 9,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/affiliate-video-campaign-operator",
    checkedAt: "2026-05-20"
  },
  {
    slug: "youtube-openclaw-creator",
    displayName: "YouTube Publish Reviewer",
    downloads: 218,
    versions: 4,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/youtube-openclaw-creator",
    checkedAt: "2026-05-20"
  },
  {
    slug: "agentic-video-production-publisher",
    displayName: "Agentic Video Production Reviewer",
    downloads: 215,
    versions: 4,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/agentic-video-production-publisher",
    checkedAt: "2026-05-20"
  },
  {
    slug: "meshmcp-remotescreen",
    displayName: "Screen Support Review Planner",
    downloads: 211,
    versions: 6,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/meshmcp-remotescreen",
    checkedAt: "2026-05-20"
  },
  {
    slug: "avito-outreach-manager",
    displayName: "Avito Message QA Reviewer",
    downloads: 195,
    versions: 4,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/avito-outreach-manager",
    checkedAt: "2026-05-20"
  },
  {
    slug: "skool-growth-teardown-poster",
    displayName: "Skool Growth Teardown Poster",
    downloads: 195,
    versions: 2,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/skool-growth-teardown-poster",
    checkedAt: "2026-05-20"
  },
  {
    slug: "skill-sprint-pack-builder",
    displayName: "Skill Sprint Pack Builder",
    downloads: 191,
    versions: 2,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/skill-sprint-pack-builder",
    checkedAt: "2026-05-20"
  },
  {
    slug: "skool-member-activation-concierge",
    displayName: "Skool Member Activation Concierge",
    downloads: 178,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/skool-member-activation-concierge",
    checkedAt: "2026-05-20"
  },
  {
    slug: "meshmcp-offline-chat",
    displayName: "Offline Message Test Planner",
    downloads: 170,
    versions: 2,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/meshmcp-offline-chat",
    checkedAt: "2026-05-20"
  },
  {
    slug: "x-algo-claim-auditor",
    displayName: "X Algo Claim Reviewer",
    downloads: 160,
    versions: 3,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/x-algo-claim-auditor",
    checkedAt: "2026-05-20"
  },
  {
    slug: "community-topic-scout",
    displayName: "Community Topic Scout",
    downloads: 150,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/community-topic-scout",
    checkedAt: "2026-05-20"
  },
  {
    slug: "open-feed-recsys-lab",
    displayName: "Open Feed Recsys Reviewer",
    downloads: 149,
    versions: 5,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/open-feed-recsys-lab",
    checkedAt: "2026-05-20"
  },
  {
    slug: "trusted-clawhub-install-gate",
    displayName: "Trusted ClawHub Install Gate",
    downloads: 145,
    versions: 3,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/trusted-clawhub-install-gate",
    checkedAt: "2026-05-20"
  },
  {
    slug: "skool-trust-ladder-builder",
    displayName: "Skool Trust Ladder Builder",
    downloads: 143,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/skool-trust-ladder-builder",
    checkedAt: "2026-05-20"
  },
  {
    slug: "skool-challenge-launcher",
    displayName: "Skool Challenge Launcher",
    downloads: 141,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/skool-challenge-launcher",
    checkedAt: "2026-05-20"
  },
  {
    slug: "skool-discovery-page-optimizer",
    displayName: "Skool Discovery Page Optimizer",
    downloads: 139,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/skool-discovery-page-optimizer",
    checkedAt: "2026-05-20"
  },
  {
    slug: "chrome-extension-studio",
    displayName: "Chrome Extension Studio",
    downloads: 121,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/chrome-extension-studio",
    checkedAt: "2026-05-20"
  },
  {
    slug: "spec-plan-build-review",
    displayName: "Spec Plan Build Review",
    downloads: 114,
    versions: 2,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/spec-plan-build-review",
    checkedAt: "2026-05-20"
  },
  {
    slug: "tinytroupe-feed-research-lab",
    displayName: "TinyTroupe Feed Research Lab",
    downloads: 111,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/tinytroupe-feed-research-lab",
    checkedAt: "2026-05-20"
  },
  {
    slug: "interactive-doc-mapper",
    displayName: "Interactive Doc Mapper",
    downloads: 107,
    versions: 2,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/interactive-doc-mapper",
    checkedAt: "2026-05-20"
  },
  {
    slug: "codex-claude-clawhub-skill-bridge",
    displayName: "Codex Claude ClawHub Skill Bridge",
    downloads: 105,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/codex-claude-clawhub-skill-bridge",
    checkedAt: "2026-05-20"
  },
  {
    slug: "product-share-trigger-reviewer",
    displayName: "Product Share Trigger Reviewer",
    downloads: 105,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/product-share-trigger-reviewer",
    checkedAt: "2026-05-20"
  },
  {
    slug: "agent-skills-portability-auditor",
    displayName: "Agent Skills Portability Auditor",
    downloads: 66,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/agent-skills-portability-auditor",
    checkedAt: "2026-05-20"
  },
  {
    slug: "doubt-driven-development",
    displayName: "Doubt Driven Development",
    downloads: 62,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/doubt-driven-development",
    checkedAt: "2026-05-20"
  },
  {
    slug: "using-agent-skills-router",
    displayName: "Using Agent Skills Router",
    downloads: 55,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/using-agent-skills-router",
    checkedAt: "2026-05-20"
  }
];

export const CHROME_EXTENSION_STATS: ChromeExtensionStatsSnapshot = {
  publisherName: "kaisenaiko",
  publisherUrl: "https://chromewebstore.google.com/search/kaisenaiko",
  checkedAt: "2026-05-18",
  sourceName: "Chrome Web Store detail pages",
  sourceUrl: "https://chromewebstore.google.com/search/kaisenaiko",
  totalPublished: 16,
  totalUsers: 208,
  averageUsersPerExtension: 13,
  averageRating: 5,
  ratingCount: 4,
  notes: [
    "Chrome Web Store detail pages showed 16 published extensions, 208 explicitly reported users, 13 average users per extension, and 5.00 average rating from 4 reported ratings on 2026-05-18.",
    "Chrome-Stats returned a Cloudflare challenge during the 2026-05-18 refresh, so refreshed user counts, ratings, versions, update dates, categories, and sizes come from Chrome Web Store detail pages.",
    "Rows without a visible Chrome Web Store user count are treated as not reported rather than inferred into user totals. Chrome-Stats links remain as secondary/risk metadata."
  ],
  extensions: [
    {
      id: "ccikgbjalcbokaalidnfcjhhbhjoljfm",
      name: "GitHub Repo Summarizer",
      description: "Summarizes GitHub repository structure and README context for faster code review.",
      users: 135,
      usersSource: "Chrome Web Store detail page",
      rating: 5,
      ratingCount: 3,
      version: "1.4.2",
      lastUpdated: "2025-07-03",
      createdAt: "2025-06-21",
      category: "Developer Tools",
      overallRank: 84982,
      categoryRank: 4898,
      riskImpact: "Moderate",
      riskLikelihood: "Moderate",
      permissions: ["storage", "activeTab", "scripting", "downloads"],
      sizeKb: 63.09,
      chromeStatsUrl: "https://chrome-stats.com/d/ccikgbjalcbokaalidnfcjhhbhjoljfm",
      chromeWebStoreUrl: "https://chromewebstore.google.com/detail/github-repo-summarizer/ccikgbjalcbokaalidnfcjhhbhjoljfm",
      dataIngestedAt: "2026-05-18"
    },
    {
      id: "jnoonpeekddinkiecaonhocaflcgbhap",
      name: "AI Chat Navigator",
      description: "Adds keyboard navigation and prompt controls for ChatGPT, Deepseek, and AI Studio chats.",
      users: 66,
      usersSource: "Chrome Web Store detail page",
      rating: 5,
      ratingCount: 1,
      version: "4.1.0",
      lastUpdated: "2025-07-26",
      createdAt: "2025-07-20",
      category: "Workflow & Planning",
      overallRank: 92005,
      categoryRank: 10692,
      riskImpact: "Low",
      riskLikelihood: "Low",
      permissions: ["storage"],
      sizeKb: 126,
      chromeStatsUrl: "https://chrome-stats.com/d/jnoonpeekddinkiecaonhocaflcgbhap",
      chromeWebStoreUrl: "https://chromewebstore.google.com/detail/ai-chat-navigator/jnoonpeekddinkiecaonhocaflcgbhap",
      dataIngestedAt: "2026-05-18"
    },
    {
      id: "egjcdmlfdnkpgkmffkhfdooacmglnjbc",
      name: "Web2CSV - Table & List Extractor",
      description: "Extracts visible tables, lists, and repeated cards into CSV, JSON, Markdown, and SourcePack files.",
      users: null,
      usersSource: "Not reported by Chrome Web Store detail page",
      rating: 0,
      ratingCount: 0,
      version: "0.1.0",
      lastUpdated: "2026-05-03",
      createdAt: "2026-05-03",
      category: "Tools",
      overallRank: 330108,
      categoryRank: 29262,
      riskImpact: "Low",
      riskLikelihood: "High",
      permissions: ["activeTab", "storage", "contextMenus", "downloads", "scripting"],
      sizeKb: 65.47,
      chromeStatsUrl: "https://chrome-stats.com/d/egjcdmlfdnkpgkmffkhfdooacmglnjbc",
      chromeWebStoreUrl: "https://chromewebstore.google.com/detail/web2csv-table-list-extractor/egjcdmlfdnkpgkmffkhfdooacmglnjbc",
      productUrl: "https://sourcepack-tools.pages.dev/web2csv/",
      dataIngestedAt: "2026-05-18"
    },
    {
      id: "hjfdpklldhofiehpcfcfdonjppdkmgoh",
      name: "Video2Source - YouTube Transcript Exporter",
      description: "Saves visible YouTube transcripts, timestamps, and notes as local source-pack exports.",
      users: 2,
      usersSource: "Chrome Web Store detail page",
      rating: 0,
      ratingCount: 0,
      version: "0.1.0",
      lastUpdated: "2026-05-03",
      createdAt: "2026-05-03",
      category: "Workflow & Planning",
      overallRank: 312049,
      categoryRank: 16767,
      riskImpact: "Low",
      riskLikelihood: "High",
      permissions: ["activeTab", "storage", "contextMenus", "downloads", "scripting"],
      sizeKb: 65.08,
      chromeStatsUrl: "https://chrome-stats.com/d/hjfdpklldhofiehpcfcfdonjppdkmgoh",
      chromeWebStoreUrl: "https://chromewebstore.google.com/detail/video2source-youtube-trans/hjfdpklldhofiehpcfcfdonjppdkmgoh",
      productUrl: "https://sourcepack-tools.pages.dev/video2source/",
      dataIngestedAt: "2026-05-18"
    },
    {
      id: "pmofpiclpglbdnjgkgijlolefiojjomn",
      name: "ChatArchive - ChatGPT Exporter",
      description: "Exports visible ChatGPT conversations to local Markdown, JSON, CSV, and SourcePack files.",
      users: 1,
      usersSource: "Chrome Web Store detail page",
      rating: 0,
      ratingCount: 0,
      version: "0.1.0",
      lastUpdated: "2026-05-05",
      createdAt: "2026-04-30",
      category: "Workflow & Planning",
      overallRank: null,
      categoryRank: null,
      riskImpact: "Not reported",
      riskLikelihood: "Not reported",
      permissions: ["activeTab", "storage", "contextMenus", "downloads", "scripting"],
      sizeKb: 65.36,
      chromeStatsUrl: "https://chrome-stats.com/d/pmofpiclpglbdnjgkgijlolefiojjomn",
      chromeWebStoreUrl: "https://chromewebstore.google.com/detail/chatarchive-chatgpt-exporter/pmofpiclpglbdnjgkgijlolefiojjomn",
      productUrl: "https://sourcepack-tools.pages.dev/chatarchive/",
      dataIngestedAt: "2026-05-18"
    },
    {
      id: "glcecbjpdknkmlpcbnbpikjjclboeglo",
      name: "LocalArchive",
      description: "Local-first reader archive for pages, selections, Pocket imports, and portable Markdown/HTML/JSON exports.",
      users: 1,
      usersSource: "Chrome Web Store detail page",
      rating: 0,
      ratingCount: 0,
      version: "0.1.1",
      lastUpdated: "2026-04-23",
      createdAt: "2026-04-23",
      category: "Tools",
      overallRank: 283912,
      categoryRank: 27059,
      riskImpact: "Low",
      riskLikelihood: "Moderate",
      permissions: ["storage", "activeTab", "scripting", "downloads"],
      sizeKb: 18.41,
      chromeStatsUrl: "https://chrome-stats.com/d/glcecbjpdknkmlpcbnbpikjjclboeglo",
      chromeWebStoreUrl: "https://chromewebstore.google.com/detail/localarchive/glcecbjpdknkmlpcbnbpikjjclboeglo",
      dataIngestedAt: "2026-05-18"
    },
    {
      id: "hoklaadapaobdbkeiacebnnciponcmnf",
      name: "Session Rescue",
      description: "Local-first session backup and restore extension with JSON import/export and no backend.",
      users: 1,
      usersSource: "Chrome Web Store detail page",
      rating: 0,
      ratingCount: 0,
      version: "0.1.4",
      lastUpdated: "2026-04-29",
      createdAt: "2026-04-23",
      category: "Workflow & Planning",
      overallRank: 225206,
      categoryRank: 15257,
      riskImpact: "Moderate",
      riskLikelihood: "Moderate",
      permissions: ["tabs", "storage", "alarms", "downloads"],
      sizeKb: 16.61,
      chromeStatsUrl: "https://chrome-stats.com/d/hoklaadapaobdbkeiacebnnciponcmnf",
      chromeWebStoreUrl: "https://chromewebstore.google.com/detail/session-rescue/hoklaadapaobdbkeiacebnnciponcmnf",
      productUrl: "https://session-rescue.pages.dev/",
      dataIngestedAt: "2026-05-18"
    },
    {
      id: "hkfeiaapcdjlccinbcbibnlaapcliobd",
      name: "Repo2Agent - GitHub to AI Context",
      description: "Turns a visible GitHub repository page into a local coding-agent context pack.",
      users: null,
      usersSource: "Not reported by Chrome Web Store detail page",
      rating: 0,
      ratingCount: 0,
      version: "0.1.0",
      lastUpdated: "2026-05-03",
      createdAt: "2026-05-03",
      category: "Developer Tools",
      overallRank: null,
      categoryRank: null,
      riskImpact: "Not reported",
      riskLikelihood: "Not reported",
      permissions: ["activeTab", "storage", "contextMenus", "downloads", "scripting"],
      sizeKb: 64.92,
      chromeStatsUrl: "https://chrome-stats.com/d/hkfeiaapcdjlccinbcbibnlaapcliobd",
      chromeWebStoreUrl: "https://chromewebstore.google.com/detail/repo2agent-github-to-ai-co/hkfeiaapcdjlccinbcbibnlaapcliobd",
      productUrl: "https://sourcepack-tools.pages.dev/repo2agent/",
      dataIngestedAt: "2026-05-18"
    },
    {
      id: "hlbflaklicefinhckdkbamhhkfklmgao",
      name: "SourcePack Hub - Local AI Research Library",
      description: "Saves current pages into a local SourcePack library and exports Markdown, JSON, and CSV indexes.",
      users: 2,
      usersSource: "Chrome Web Store detail page",
      rating: 0,
      ratingCount: 0,
      version: "0.1.0",
      lastUpdated: "2026-05-03",
      createdAt: "2026-05-03",
      category: "Workflow & Planning",
      overallRank: 252059,
      categoryRank: 15697,
      riskImpact: "Low",
      riskLikelihood: "High",
      permissions: ["activeTab", "storage", "contextMenus", "downloads", "scripting"],
      sizeKb: 65.36,
      chromeStatsUrl: "https://chrome-stats.com/d/hlbflaklicefinhckdkbamhhkfklmgao",
      chromeWebStoreUrl: "https://chromewebstore.google.com/detail/sourcepack-hub-local-ai-re/hlbflaklicefinhckdkbamhhkfklmgao",
      productUrl: "https://sourcepack-tools.pages.dev/hub/",
      dataIngestedAt: "2026-05-18"
    },
    {
      id: "ahalbgecklcboflgkloaceogjmfjckji",
      name: "CWS Scout - Extension Competitor Analyzer",
      description: "Captures visible Chrome-Stats pages into local competitor research reports after a user action.",
      users: null,
      usersSource: "Not reported by Chrome Web Store detail page",
      rating: 0,
      ratingCount: 0,
      version: "0.1.0",
      lastUpdated: "2026-05-03",
      createdAt: "2026-05-03",
      category: "Tools",
      overallRank: null,
      categoryRank: null,
      riskImpact: "Not reported",
      riskLikelihood: "Not reported",
      permissions: ["activeTab", "storage", "contextMenus", "downloads", "scripting"],
      sizeKb: 65.73,
      chromeStatsUrl: "https://chrome-stats.com/d/ahalbgecklcboflgkloaceogjmfjckji",
      chromeWebStoreUrl: "https://chromewebstore.google.com/detail/cws-scout-extension-compet/ahalbgecklcboflgkloaceogjmfjckji",
      productUrl: "https://sourcepack-tools.pages.dev/cws-scout/",
      dataIngestedAt: "2026-05-18"
    },
    {
      id: "bgmdmikdapojncddhpabnofcioffnhbg",
      name: "LocalLens: Private AI Summaries",
      description: "Summarizes, simplifies, and safe-share cleans active-tab text with Chrome built-in AI surfaces.",
      users: null,
      usersSource: "Not reported by Chrome Web Store detail page",
      rating: 0,
      ratingCount: 0,
      version: "0.1.8",
      lastUpdated: "2026-05-05",
      createdAt: "2026-04-15",
      category: "Tools",
      overallRank: null,
      categoryRank: null,
      riskImpact: "Not reported",
      riskLikelihood: "Not reported",
      permissions: ["activeTab", "scripting"],
      sizeKb: 26.45,
      chromeStatsUrl: "https://chrome-stats.com/d/bgmdmikdapojncddhpabnofcioffnhbg",
      chromeWebStoreUrl: "https://chromewebstore.google.com/detail/locallens-private-ai-summaries/bgmdmikdapojncddhpabnofcioffnhbg",
      productUrl: "https://zack-dev-cm.github.io/docs/locallens/",
      dataIngestedAt: "2026-05-18"
    },
    {
      id: "kpjokdophleoefolidphajjllaaddnpj",
      name: "Evidence Pack Capture",
      description: "Captures a visible tab, redacts sensitive details locally, and exports a support-ready evidence packet.",
      users: null,
      usersSource: "Not reported by Chrome Web Store detail page",
      rating: 0,
      ratingCount: 0,
      version: "0.1.0",
      lastUpdated: "2026-05-14",
      createdAt: "2026-05-14",
      category: "Workflow & Planning",
      overallRank: null,
      categoryRank: null,
      riskImpact: "Not reported",
      riskLikelihood: "Not reported",
      permissions: ["Not reported"],
      sizeKb: 40.67,
      chromeStatsUrl: "https://chrome-stats.com/d/kpjokdophleoefolidphajjllaaddnpj",
      chromeWebStoreUrl: "https://chromewebstore.google.com/detail/evidence-pack-capture/kpjokdophleoefolidphajjllaaddnpj",
      dataIngestedAt: "2026-05-18"
    },
    {
      id: "dmjbkldbikpahgglacbkaeccfapakilm",
      name: "Proof Card Redactor",
      description: "Redacts proof screenshots locally into privacy-safe share cards.",
      users: null,
      usersSource: "Not reported by Chrome Web Store detail page",
      rating: 0,
      ratingCount: 0,
      version: "0.1.0",
      lastUpdated: "2026-05-14",
      createdAt: "2026-05-14",
      category: "Workflow & Planning",
      overallRank: null,
      categoryRank: null,
      riskImpact: "Not reported",
      riskLikelihood: "Not reported",
      permissions: ["Not reported"],
      sizeKb: 11.13,
      chromeStatsUrl: "https://chrome-stats.com/d/dmjbkldbikpahgglacbkaeccfapakilm",
      chromeWebStoreUrl: "https://chromewebstore.google.com/detail/proof-card-redactor/dmjbkldbikpahgglacbkaeccfapakilm",
      dataIngestedAt: "2026-05-18"
    },
    {
      id: "mdhgpledennecooaiplcogckkgkmilba",
      name: "Skill Sprint Clipper",
      description: "Turns selected lesson text into a local 20-minute proof pack.",
      users: null,
      usersSource: "Not reported by Chrome Web Store detail page",
      rating: 0,
      ratingCount: 0,
      version: "0.1.0",
      lastUpdated: "2026-05-07",
      createdAt: "2026-05-07",
      category: "Workflow & Planning",
      overallRank: null,
      categoryRank: null,
      riskImpact: "Not reported",
      riskLikelihood: "Not reported",
      permissions: ["Not reported"],
      sizeKb: 13.19,
      chromeStatsUrl: "https://chrome-stats.com/d/mdhgpledennecooaiplcogckkgkmilba",
      chromeWebStoreUrl: "https://chromewebstore.google.com/detail/skill-sprint-clipper/mdhgpledennecooaiplcogckkgkmilba",
      productUrl: "https://zack-dev-cm.github.io/docs/skill-sprint-clipper/",
      dataIngestedAt: "2026-05-18"
    },
    {
      id: "dlhhfacpkohmojegdpmmnmoapcpphfbh",
      name: "Browser Run Receipt",
      description: "Captures manual browser-work steps, redacts details, and exports a local run receipt.",
      users: null,
      usersSource: "Not reported by Chrome Web Store detail page",
      rating: 0,
      ratingCount: 0,
      version: "0.1.0",
      lastUpdated: "2026-05-14",
      createdAt: "2026-05-14",
      category: "Workflow & Planning",
      overallRank: null,
      categoryRank: null,
      riskImpact: "Not reported",
      riskLikelihood: "Not reported",
      permissions: ["Not reported"],
      sizeKb: 39.71,
      chromeStatsUrl: "https://chrome-stats.com/d/dlhhfacpkohmojegdpmmnmoapcpphfbh",
      chromeWebStoreUrl: "https://chromewebstore.google.com/detail/browser-run-receipt/dlhhfacpkohmojegdpmmnmoapcpphfbh",
      dataIngestedAt: "2026-05-18"
    },
    {
      id: "dphlhifhafonbolljmdlpecpcicnpjen",
      name: "Skool Discovery Positioning Lens",
      description: "Audits public Skool positioning with local benchmarks and optional Chrome built-in AI critique.",
      users: null,
      usersSource: "Not reported by Chrome Web Store detail page",
      rating: 0,
      ratingCount: 0,
      version: "0.1.1",
      lastUpdated: "2026-05-15",
      createdAt: "2026-05-15",
      category: "Workflow & Planning",
      overallRank: null,
      categoryRank: null,
      riskImpact: "Not reported",
      riskLikelihood: "Not reported",
      permissions: ["Not reported"],
      sizeKb: 21.96,
      chromeStatsUrl: "https://chrome-stats.com/d/dphlhifhafonbolljmdlpecpcicnpjen",
      chromeWebStoreUrl: "https://chromewebstore.google.com/detail/skool-discovery-positioning-lens/dphlhifhafonbolljmdlpecpcicnpjen",
      dataIngestedAt: "2026-05-18"
    }
  ]
};

export const LATEST_UPDATES: LatestUpdate[] = [
  {
    title: "Public CV/DL Archive Added",
    description: "Added GitHub API-backed CV/DL archive cards for YOLO/EfficientNet, Cyrillic OCR, ML Kit face contours, TFLite glasses, vision-transformer notebooks, and Colab-style prototypes, with evidence limited to authored GitHub repos and generated case studies.",
    links: [
      { text: "Open public CV/DL archive", url: "https://zack-dev-cm.github.io/?project=public-cv-and-deep-learning-github-archive" },
      { text: "Open notebook prototype archive", url: "https://zack-dev-cm.github.io/?project=colab-cv-dl-prototype-archive" },
      { text: "Open video search case study", url: "https://zack-dev-cm.github.io/?project=multimodal-video-search-platform" }
    ],
    projectId: 73,
    createdAt: "2026-05-14"
  },
  {
    title: "Computer Vision and AI Systems Refresh",
    description: "Added public-safe case studies for OCR serving, multimodal video search, and skin-texture segmentation, with Mermaid diagrams and architecture-first evidence.",
    links: [
      { text: "Open OCR case study", url: "https://zack-dev-cm.github.io/?project=fast-ocr-onnx-inference-server" },
      { text: "Open video search case study", url: "https://zack-dev-cm.github.io/?project=multimodal-video-search-platform" },
      { text: "Open segmentation case study", url: "https://zack-dev-cm.github.io/?project=full-face-wrinkle-and-skin-texture-segmentation-lab" }
    ],
    projectId: 72,
    createdAt: "2026-05-14"
  },
  {
    title: "Marketplace Stats Refresh",
    description: "Updated the public ClawHub tracker to 9,587 downloads across 40 public skills on 2026-05-20 and kept the Chrome Web Store detail-page snapshot at 208 explicitly reported users from 2026-05-18.",
    links: [
      { text: "Open ClawHub tracker", url: "https://zack-dev-cm.github.io/#clawhub" },
      { text: "Open Chrome Web Store tracker", url: "https://zack-dev-cm.github.io/#chrome-stats" }
    ],
    projectId: 53,
    createdAt: "2026-05-20"
  },
  {
    title: "SourcePack Chrome Extension Wave",
    description: "New extension wave added from the CWS release work: Web2CSV, Video2Source, Repo2Agent, SourcePack Hub, CWS Scout, and ChatArchive with public pages and Chrome Web Store tracking.",
    links: [
      { text: "Open SourcePack pages", url: "https://sourcepack-tools.pages.dev/" },
      { text: "Open Chrome Web Store publisher", url: "https://chromewebstore.google.com/search/kaisenaiko" }
    ],
    projectId: 68,
    createdAt: "2026-05-07"
  },
  {
    title: "Trusted ClawHub Install Gate",
    description: "New skill-build case study: a local-first ClawHub/OpenClaw skill install wrapper that classifies artifacts, blocks unsafe installs, and writes verification receipts.",
    links: [
      { text: "Open case study", url: "https://zack-dev-cm.github.io/?project=trusted-clawhub-install-gate" }
    ],
    projectId: 69,
    createdAt: "2026-05-07"
  },
  {
    title: "Dermaself Flutter Skin Analysis App",
    description: "Updated mobile CV case study: Flutter/Firebase skin-analysis flow with guided capture, offline model runtime, ROI gates, and deployment-blocked fine-line QA evidence.",
    links: [
      { text: "Open case study", url: "https://zack-dev-cm.github.io/?project=dermaself-flutter-skin-analysis-app" }
    ],
    projectId: 63,
    createdAt: "2026-05-05"
  },
  {
    title: "Chrome Extension Studio Plugin",
    description: "New local developer-platform case study: a Codex plugin and script set for planning, designing, packaging, QA, and Chrome Web Store release cycles.",
    links: [
      { text: "Open case study", url: "https://zack-dev-cm.github.io/?project=chrome-extension-studio-plugin" }
    ],
    projectId: 64,
    createdAt: "2026-04-18"
  },
  {
    title: "Google Drive File Provider Repair Toolkit",
    description: "New macOS operations case study: a conservative Drive File Provider diagnostic and repair toolkit with dry-run repair, sync inspection, and no data-deletion path.",
    links: [
      { text: "Open case study", url: "https://zack-dev-cm.github.io/?project=google-drive-file-provider-repair-toolkit" }
    ],
    projectId: 65,
    createdAt: "2026-04-17"
  },
  {
    title: "CollectionsAI ChatGPT App",
    description: "New ChatGPT app case study: MCP tools and widgets for senior conservation workflows, portfolio planning, materials estimates, staffing, and voice-note structuring.",
    links: [
      { text: "Open case study", url: "https://zack-dev-cm.github.io/?project=collectionsai-chatgpt-app" }
    ],
    projectId: 66,
    createdAt: "2026-03-04"
  },
  {
    title: "Senior Conservator OpenClaw Agent",
    description: "New autonomous-workflow case study: OpenClaw-driven conservation review with staged evidence gates, segmentation overlays, reports, voice output, and reproducibility manifests.",
    links: [
      { text: "Open case study", url: "https://zack-dev-cm.github.io/?project=senior-conservator-openclaw-agent" }
    ],
    projectId: 67,
    createdAt: "2026-03-01"
  },
  {
    title: "Telegram Mini App Security Auditor",
    description: "New public launch gate: a static auditor for Telegram Mini Apps that flags initData, bot-token, admin, CORS, PII, and Bot API dry-run risks before release.",
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/telegram-miniapp-security-auditor" }
    ],
    projectId: 60,
    repoFullName: "zack-dev-cm/telegram-miniapp-security-auditor",
    createdAt: "2026-04-30"
  },
  {
    title: "Agentic Codex Dev Skill",
    description: "New public Codex/OpenClaw skill: a scoped development loop with repo inspection, role assignment, verification, leak review, durable memory, and publish gates.",
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/agentic-codex-dev-skill" }
    ],
    projectId: 61,
    repoFullName: "zack-dev-cm/agentic-codex-dev-skill",
    createdAt: "2026-04-30"
  },
  {
    title: "Session Rescue - Chrome Web Store extension",
    description: "New user product: a local-first Chrome extension for saving browser session snapshots, restoring tabs, and exporting/importing portable backups.",
    links: [
      { text: "View on Chrome Web Store", url: "https://chromewebstore.google.com/detail/session-rescue/hoklaadapaobdbkeiacebnnciponcmnf" },
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/session-rescue" },
      { text: "Product site", url: "https://session-rescue.pages.dev/" }
    ],
    projectId: 59,
    repoFullName: "zack-dev-cm/session-rescue",
    createdAt: "2026-04-29"
  },
  {
    title: "LocalArchive - Chrome Web Store extension",
    description: "New user product: a local-first Chrome extension for saving readable pages, selected text, Pocket imports, and portable Markdown/HTML/JSON exports.",
    links: [
      { text: "View on Chrome Web Store", url: "https://chromewebstore.google.com/detail/localarchive/glcecbjpdknkmlpcbnbpikjjclboeglo" },
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/localarchive" },
      { text: "Release v0.1.0", url: "https://github.com/zack-dev-cm/localarchive/releases/tag/v0.1.0" }
    ],
    projectId: 55,
    repoFullName: "zack-dev-cm/localarchive",
    createdAt: "2026-04-24"
  },
  {
    title: "OpenClaw Chinese Laoshi Ops",
    description: "New public OpenClaw release: a sanitized Chinese lesson-ops skill for generating checked lesson packets from Drive-backed source material.",
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/openclaw-agent-chinese-laoshi" },
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/openclaw-agent-chinese-laoshi" }
    ],
    projectId: 57,
    repoFullName: "zack-dev-cm/openclaw-agent-chinese-laoshi",
    createdAt: "2026-04-24"
  },
  {
    title: "Random Coffee Best Fit Outreach",
    description: "New open-source release: a consent-first matcher that ranks best-fit coffee chats and prepares reviewed LinkedIn or Discord outreach packets.",
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/random-coffee-best-fit-outreach" }
    ],
    projectId: 58,
    repoFullName: "zack-dev-cm/random-coffee-best-fit-outreach",
    createdAt: "2026-04-24"
  },
  {
    title: "LocalLens Private AI Summaries",
    description: "Published extension release: local summaries, simplification, translation, and safe-share cleanup using Chrome built-in AI with Chrome Web Store and GitHub evidence.",
    links: [
      { text: "View on Chrome Web Store", url: "https://chromewebstore.google.com/detail/locallens-private-ai-summaries/bgmdmikdapojncddhpabnofcioffnhbg" },
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/locallens-private-ai-summaries" },
      { text: "Release v0.1.2", url: "https://github.com/zack-dev-cm/locallens-private-ai-summaries/releases/tag/v0.1.2" },
      { text: "Product page", url: "https://zack-dev-cm.github.io/docs/locallens/" }
    ],
    projectId: 56,
    repoFullName: "zack-dev-cm/locallens-private-ai-summaries",
    createdAt: "2026-04-24"
  },
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
    description: "New portfolio evidence surface: a CLI/reporting flow that tracks GitHub traction, dated ClawHub snapshots, Chrome Web Store detail-page stats, deltas, and next traction bets.",
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
    description: "New open-source release: a text-artifact redaction skill that strips sensitive paths, secret-like strings, restricted URLs, and common PII before a bundle is shared.",
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
      { text: "Release v1.0.7", url: "https://github.com/zack-dev-cm/github-clawhub-launcher/releases/tag/v1.0.7" }
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
    links: [],
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
    links: [],
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
    links: [],
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
    links: [],
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
    links: [],
    images: [
      { url: `${LOCAL_IMG_BASE}/spare-parts-1.png`, alt: "Key Segmentation 1" },
      { url: `${LOCAL_IMG_BASE}/spare-parts-2.png`, alt: "Key Segmentation 2" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/spare-parts-1.png`
  },
  {
    id: 10,
    title: "Food Recognition App",
    aliases: ["nutrition label OCR", "food recognition mobile lab", "ML Kit nutrition scanner"],
    description: "iOS SwiftUI prototype for food detection and nutrition-label OCR with crop-assisted text extraction and structured results.",
    longDescription: "Mobile CV prototype for food recognition and nutrition-label scanning. The public case study focuses on camera/image-picker flows, ML Kit text recognition, crop-assisted OCR toggles, nutrition-label detection calls, table extraction, and optional LLM structuring into user-readable JSON.",
    keyFeatures: ["Camera and gallery capture flows", "Crop-assisted nutrition label OCR", "Optional LLM result structuring", "Table-aware extraction path"],
    techStack: ["SwiftUI", "AVFoundation", "ML Kit", "OCR", "Nutrition Label Parsing", "LLM Structuring"],
    links: [],
    mermaidDiagram: `flowchart LR
  Capture["Camera or Image Picker"] --> Crop["Crop-Assisted OCR"]
  Capture --> Detect["Food / Label Detection"]
  Crop --> MLKit["ML Kit Text Recognition"]
  MLKit --> Tables["Table-Aware Parsing"]
  Tables --> Struct["Optional LLM JSON Structuring"]
  Struct --> Results["Nutrition Result UI"]`,
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
      { label: "Input modes", value: "3", context: "photo, voice, and text flows in public product case study" },
      { label: "Nutrition surfaces", value: "2", context: "2 public product surfaces: Telegram bot plus beta Mini App diary/profile flow" },
      { label: "Public route", value: "Telegram", context: "bot link reviewed 2026-05-15" }
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
      { label: "Public Chrome Web Store users", value: "135", context: "Chrome Web Store detail page, 2026-05-18" }
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
      { label: "Public Chrome Web Store users", value: "66", context: "Chrome Web Store detail page, 2026-05-18" }
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
      { text: "View Example", url: "https://www.youtube.com/shorts/_5dVaQdB1lA" }
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
    links: [],
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
    longDescription: "Cosmetic face-texture pipeline using face landmarks, region masks, segmentation-based wrinkle and fine-line detection, skeletonized line traces, overlays, per-line CSV outputs, timing events, and visual quality gates. The public case study avoids diagnostic claims and focuses on the engineering path from image capture to reviewable overlays.",
    keyFeatures: [
      "MediaPipe landmark-based ROI extraction and face-region masks",
      "Segmentation-based wrinkle and fine-line tracing with skeleton overlays",
      "Async job API with progress + results endpoints",
      "Flutter demo client and Telegram Mini App UI for cosmetic analysis review"
    ],
    techStack: ["Python", "FastAPI", "MediaPipe", "YOLO", "ONNX", "Cloud Run", "Flutter", "MLflow"],
    benchmarks: [
      { label: "API endpoints", value: "8", context: "/, /app, /tma, /v1/*, /healthz" },
      { label: "Tasks", value: "3", context: "pores, wrinkles, pores+wrinkles" },
      { label: "Image types", value: "5", context: "jpeg/png/webp/tiff/bmp" },
      { label: "Default imgsz", value: "1280", context: "segment endpoint default" }
    ],
    links: [],
    mermaidDiagram: `flowchart LR
  Capture["Face Image"] --> Landmarks["Landmarks + ROI Masks"]
  Landmarks --> Segment["Wrinkle / Texture Segmentation"]
  Segment --> Lines["Skeletonized Line Traces"]
  Lines --> Overlays["Labeled Overlays + CSV"]
  Overlays --> Gate["Visual Quality Gate"]
  Gate --> Results["Async Result API"]`,
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
      { label: "ClawHub downloads", value: "1,135 total", context: "public ClawHub listings, 2026-05-20 (612 data-science-cv-repro-lab + 523 sota-agent)" },
      { label: "Published versions", value: "24 total", context: "public ClawHub listings, 2026-05-20 (12 + 12 packages)" },
      { label: "Live packages", value: "2", context: "data-science-cv-repro-lab + sota-agent" },
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
    longDescription: "I built a sales-manager automation layer for a large clinic network that needed AI assistance without replacing its legacy back office. The system used OpenClaw-driven automation to qualify inbound leads, draft follow-ups, surface next actions to staff, and sync approved state changes back into the existing database layer. The public case study focuses on the delivery pattern, approval controls, and legacy-system fit.",
    keyFeatures: [
      "OpenClaw-driven lead qualification, follow-up drafting, and next-step recommendations",
      "Legacy DB bridge that preserved the existing clinic back office instead of forcing a rewrite",
      "Human-in-the-loop approval rules for escalations and appointment routing",
      "Public case study framed around the reusable delivery pattern, approval controls, and legacy-system fit"
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
      { label: "ClawHub downloads", value: "496", context: "public ClawHub listing, 2026-05-20" },
      { label: "Published versions", value: "9", context: "public ClawHub listing, 2026-05-20" },
      { label: "Public release", value: "v1.0.7", context: "GitHub release, 2026-05-14" },
      { label: "Bundled scripts", value: "4", context: "manifest, check, notes, commands" },
      { label: "Publish surfaces", value: "2", context: "GitHub repo + ClawHub package" },
      { label: "Validation posture", value: "release-checked", context: "launcher check + publish-guard audit" }
    ],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/github-clawhub-launcher" },
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/github-clawhub-launcher" },
      { text: "Release v1.0.7", url: "https://github.com/zack-dev-cm/github-clawhub-launcher/releases/tag/v1.0.7" }
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
      { label: "ClawHub downloads", value: "347", context: "public ClawHub listing, 2026-05-20" },
      { label: "Published versions", value: "6", context: "public ClawHub listing, 2026-05-20" },
      { label: "Public release", value: "v1.0.2", context: "GitHub + ClawHub" },
      { label: "Bundled scripts", value: "4", context: "init, append, check, render" },
      { label: "Evidence fields", value: "5", context: "screenshot, dom, console, network, video" },
      { label: "Validation posture", value: "release-checked", context: "smoke test + publish-guard audit" }
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
      { label: "ClawHub downloads", value: "352", context: "public ClawHub listing, 2026-05-20" },
      { label: "Published versions", value: "6", context: "public ClawHub listing, 2026-05-20" },
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
    longDescription: "This project packages a reusable OpenClaw workflow for YouTube Studio. It initializes a run file, records upload, check, and publish steps, keeps structured provenance for Midjourney, Suno, and local edit stages, validates the bundle, and renders a public-safe report with sensitive paths and unpublished URLs removed. The workflow is designed for repeatable publishing and debugging through a logged-in browser profile, not for hidden background posting.",
    keyFeatures: [
      "Initializes one run manifest with channel, goal, stage, visibility, and file references",
      "Carries structured provenance for Midjourney visuals, Suno audio, local edit stages, and required public credits",
      "Logs upload, metadata, checks, and publish steps with status, notes, screenshots, and final public URL",
      "Validates the bundle before sharing so missing screenshots and unsafe artifact paths are caught early",
      "Renders a reusable markdown report for review, debugging, and future repeat runs"
    ],
    techStack: ["ClawHub", "Python", "YouTube Studio", "OpenClaw", "Midjourney", "Suno", "GitHub Actions"],
    benchmarks: [
      { label: "ClawHub downloads", value: "403", context: "public ClawHub listing, 2026-05-20" },
      { label: "Published versions", value: "13", context: "public ClawHub listing, 2026-05-20" },
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
    description: "Public skill for redacting sensitive paths, secret-like strings, restricted URLs, and common PII from text artifacts before sharing them.",
    longDescription: "Artifact Redactor is a small public OpenClaw skill and local-first Python toolkit for making shareable artifact bundles safer. It scans supported text files for obvious leak patterns, writes a redacted copy into a clean output directory, re-checks the processed text output, and renders a markdown report that explains what was found, what was rewritten, and which files still need manual review. The public contract is intentionally narrow in v1.0.5: text artifacts are handled automatically, while skipped binary files stay manual-review-required instead of being silently treated as cleared. The command-line entrypoints now fail fast on missing inputs instead of returning a false-clear result from an empty or mistyped path.",
    keyFeatures: [
      "Scans Markdown, JSON, logs, YAML, CSV, and similar text artifacts for sensitive paths, restricted URLs, secret-like strings, email addresses, and phone numbers",
      "Writes a redacted copy into a separate output directory so the raw bundle stays untouched",
      "Strips query strings from public URLs while redacting localhost, private hosts, and credentialed URLs",
      "Flags binary or unsupported files for manual review instead of pretending they were auto-sanitized",
      "Renders a concise markdown report for bug reports, vendor handoffs, release reviews, and public issues"
    ],
    techStack: ["ClawHub", "Python", "Privacy", "Redaction", "OpenClaw Skills", "Release Engineering"],
    benchmarks: [
      { label: "ClawHub downloads", value: "322", context: "public ClawHub listing, 2026-05-20" },
      { label: "Published versions", value: "8", context: "public ClawHub listing, 2026-05-20" },
      { label: "Public release", value: "v1.0.5", context: "GitHub + ClawHub" },
      { label: "Bundled scripts", value: "4", context: "scan, redact, check, report" },
      { label: "Pattern families", value: "6", context: "restricted URL, path, secret, email, phone, public-url query cleanup" },
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
      { label: "ClawHub downloads", value: "357", context: "public ClawHub listing, 2026-05-20" },
      { label: "Published versions", value: "7", context: "public ClawHub listing, 2026-05-20" },
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
    description: "CLI and report flow for tracking GitHub stars, dated ClawHub snapshots, publisher stats, and traction deltas.",
    longDescription: "GitHub + ClawHub Downloads Tracker packages the `github-stars-optimizer` workflow into a public evidence surface. It pulls GitHub repository metadata, ClawHub leaderboards, explicit skill slugs, and Chrome Web Store detail-page stats, then renders a blunt traction report with downloads, star conversion gaps, snapshot deltas, 30-day scenarios, and consolidation bets. It keeps ClawHub snapshots visible in the portfolio instead of burying them inside separate package pages.",
    projectKind: "open-source",
    surfaceTags: ["open-source", "automation", "analytics"],
    keyFeatures: [
      "Fetches live ClawHub package stats and keeps exact download counts visible beside GitHub repo traction",
      "Records Chrome Web Store detail-page stats for explicit user counts, ratings, versions, and not-reported rows",
      "Stores snapshots so repeated runs can show deltas, fastest package download gains, and current pace",
      "Ranks consolidation and positioning bets when GitHub stars and ClawHub downloads are not converting"
    ],
    techStack: ["Python", "CLI", "GitHub API", "ClawHub Convex", "JSON Snapshots", "Markdown Reports", "Open-source Analytics"],
    benchmarks: [
      { label: "Tracked ClawHub downloads", value: "9,587", context: "public ClawHub owner profile, 2026-05-20 across 40 skills" },
      { label: "Tracked public skills", value: "40", context: "40 rows from live ClawHub publisher profile and paginated published-skill query, 2026-05-20" },
      { label: "CV Repro Lab downloads", value: "1,135 total", context: "612 data-science-cv-repro-lab + 523 sota-agent, 2026-05-20" },
      { label: "Strongest skill", value: "612 downloads", context: "data-science-cv-repro-lab public listing, 2026-05-20" },
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
    id: 55,
    title: "LocalArchive",
    aliases: ["local archive", "pocket alternative", "read it later extension"],
    description: "Local-first Chrome extension for saving readable pages, selections, Pocket imports, and portable exports.",
    longDescription: "LocalArchive is a published Chrome Web Store product for people who want a read-it-later archive without sending page content to a hosted service. It saves readable article captures, selected text, source metadata, and Pocket imports locally, then exports a portable Markdown, HTML, or JSON bundle when the user wants to move or audit the archive.",
    projectKind: "user-product",
    surfaceTags: ["browser-extension", "web", "open-source"],
    keyFeatures: [
      "Saves readable page snapshots and selected text into a local-first archive",
      "Imports Pocket data and keeps the archive portable through Markdown, HTML, and JSON exports",
      "Keeps the product surface narrow: extension storage, export controls, and a public Chrome Web Store listing",
      "Ships as a reproducible public release with Chrome Web Store metadata and repo evidence"
    ],
    techStack: ["Chrome Extension", "JavaScript", "Local-first Storage", "Readability", "Markdown Export", "Chrome Web Store"],
    benchmarks: [
      { label: "Public Chrome Web Store users", value: "1", context: "Chrome Web Store detail page, 2026-05-18" },
      { label: "Chrome Web Store version", value: "0.1.1", context: "public listing updated 2026-04-23" },
      { label: "Export formats", value: "3", context: "Markdown, HTML, JSON" },
      { label: "Import path", value: "Pocket", context: "local migration workflow" },
      { label: "Privacy posture", value: "local-first", context: "page content stays in the extension archive" }
    ],
    links: [
      { text: "View on Chrome Web Store", url: "https://chromewebstore.google.com/detail/localarchive/glcecbjpdknkmlpcbnbpikjjclboeglo" },
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/localarchive" },
      { text: "Release v0.1.0", url: "https://github.com/zack-dev-cm/localarchive/releases/tag/v0.1.0" }
    ],
    images: [],
    thumbnail: "",
    hideImages: true,
    repoFullName: "zack-dev-cm/localarchive",
    createdAt: "2026-04-22",
    canonicalLinks: {
      chromeWebStore: "https://chromewebstore.google.com/detail/localarchive/glcecbjpdknkmlpcbnbpikjjclboeglo",
      github: "https://github.com/zack-dev-cm/localarchive"
    }
  },
  {
    id: 56,
    title: "LocalLens Private AI Summaries",
    aliases: ["local lens", "private ai summaries", "built-in ai extension"],
    description: "Published Chrome extension for private summaries, simplification, translation, and safe-share cleanup with built-in AI.",
    longDescription: "LocalLens packages Chrome built-in AI into a privacy-first extension workflow: summarize a page, simplify dense text, translate selected content, and clean sensitive snippets before sharing. The public release emphasizes local browser execution, a live Chrome Web Store listing, clear support pages, and reproducible GitHub evidence.",
    projectKind: "user-product",
    surfaceTags: ["browser-extension", "web", "open-source"],
    keyFeatures: [
      "Summarizes, simplifies, translates, and rewrites selected page content through Chrome built-in AI",
      "Keeps the primary workflow local to the browser instead of routing page text through a custom backend",
      "Includes support, privacy, and uninstall pages for Chrome Web Store operations",
      "Ships a public release bundle with reproducible extension source"
    ],
    techStack: ["Chrome Extension", "Built-in AI", "JavaScript", "Privacy", "Summarization", "Translation"],
    benchmarks: [
      { label: "Public release", value: "v0.1.8", context: "Chrome Web Store listing updated 2026-05-05" },
      { label: "Chrome Web Store listing", value: "live", context: "Chrome Web Store detail page, 2026-05-18; user count not reported" },
      { label: "AI workflows", value: "4", context: "summarize, simplify, translate, safe-share cleanup" },
      { label: "Runtime posture", value: "local browser", context: "Chrome built-in AI surface" },
      { label: "Support pages", value: "4", context: "home, privacy, support, uninstall" }
    ],
    links: [
      { text: "View on Chrome Web Store", url: "https://chromewebstore.google.com/detail/locallens-private-ai-summaries/bgmdmikdapojncddhpabnofcioffnhbg" },
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/locallens-private-ai-summaries" },
      { text: "Release v0.1.2", url: "https://github.com/zack-dev-cm/locallens-private-ai-summaries/releases/tag/v0.1.2" },
      { text: "Product page", url: "https://zack-dev-cm.github.io/docs/locallens/" }
    ],
    images: [],
    thumbnail: "",
    hideImages: true,
    repoFullName: "zack-dev-cm/locallens-private-ai-summaries",
    createdAt: "2026-04-15",
    canonicalLinks: {
      chromeWebStore: "https://chromewebstore.google.com/detail/locallens-private-ai-summaries/bgmdmikdapojncddhpabnofcioffnhbg",
      github: "https://github.com/zack-dev-cm/locallens-private-ai-summaries",
      website: "https://zack-dev-cm.github.io/docs/locallens/"
    }
  },
  {
    id: 57,
    title: "OpenClaw Chinese Laoshi Ops",
    aliases: ["chinese laoshi", "openclaw chinese tutor", "lesson ops skill"],
    description: "Public OpenClaw skill for sanitized Chinese lesson operations and checked lesson-packet generation.",
    longDescription: "OpenClaw Chinese Laoshi Ops turns a private tutoring workflow into a sanitized public skill. It structures lesson source material, generates reviewable lesson packets, keeps Drive-backed references explicit, and publishes the reusable operations pattern without leaking private student material.",
    projectKind: "open-source",
    surfaceTags: ["open-source", "automation", "education"],
    keyFeatures: [
      "Structures lesson source material into reusable Chinese learning packets",
      "Keeps Drive references and review state explicit for repeatable lesson preparation",
      "Publishes the workflow as a sanitized OpenClaw skill instead of exposing private tutoring artifacts",
      "Adds the package to the public ClawHub tracker with dated download, version, and star evidence"
    ],
    techStack: ["OpenClaw", "ClawHub", "Google Drive", "Language Learning", "Markdown", "Release Engineering"],
    benchmarks: [
      { label: "ClawHub downloads", value: "346", context: "public ClawHub listing, 2026-05-20" },
      { label: "Published versions", value: "7", context: "public ClawHub listing, 2026-05-20" },
      { label: "ClawHub stars", value: "1", context: "public ClawHub listing, 2026-05-20" },
      { label: "Clean release", value: "1.0.9", context: "public README release marker" },
      { label: "Public posture", value: "sanitized", context: "lesson operations without private student data" }
    ],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/openclaw-agent-chinese-laoshi" },
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/openclaw-agent-chinese-laoshi" }
    ],
    images: [],
    thumbnail: "",
    hideImages: true,
    repoFullName: "zack-dev-cm/openclaw-agent-chinese-laoshi",
    createdAt: "2026-04-23",
    canonicalLinks: {
      github: "https://github.com/zack-dev-cm/openclaw-agent-chinese-laoshi",
      website: "https://clawhub.ai/zack-dev-cm/openclaw-agent-chinese-laoshi"
    }
  },
  {
    id: 58,
    title: "Random Coffee Best Fit Outreach",
    aliases: ["random coffee matcher", "best fit outreach", "coffee chat matching"],
    description: "Consent-first matcher for ranking best-fit coffee chats and preparing reviewed LinkedIn or Discord outreach packets.",
    longDescription: "Random Coffee Best Fit Outreach is a public-safe workflow for matching people into useful coffee chats without scraping or auto-sending messages. It scores fit from provided profiles, drafts double opt-in outreach for LinkedIn or Discord, and logs review state so each introduction stays operator-approved.",
    projectKind: "open-source",
    surfaceTags: ["open-source", "automation", "social"],
    keyFeatures: [
      "Ranks best-fit people from provided profiles and project context",
      "Drafts consent-first LinkedIn or Discord outreach packets for review",
      "Avoids scraping, selfbots, and automated sending in the public workflow",
      "Keeps decision logs reproducible for future community or team-matching rounds"
    ],
    techStack: ["OpenClaw", "Codex Skills", "Matching", "LinkedIn", "Discord", "Markdown Reports"],
    benchmarks: [
      { label: "Outreach channels", value: "2", context: "LinkedIn or Discord draft packets" },
      { label: "Consent model", value: "double opt-in", context: "reviewed introductions only" },
      { label: "Automation boundary", value: "no auto-send", context: "public safety contract" },
      { label: "Public release", value: "repo live", context: "GitHub public repo, 2026-04-24" },
      { label: "Review artifacts", value: "rank + draft + log", context: "matching decision packet" }
    ],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/random-coffee-best-fit-outreach" }
    ],
    images: [],
    thumbnail: "",
    hideImages: true,
    repoFullName: "zack-dev-cm/random-coffee-best-fit-outreach",
    createdAt: "2026-04-24",
    canonicalLinks: {
      github: "https://github.com/zack-dev-cm/random-coffee-best-fit-outreach"
    }
  },
  {
    id: 59,
    title: "Session Rescue",
    aliases: ["session rescue extension", "tab restore", "browser session backup"],
    description: "Local-first Chrome extension for saving browser session snapshots, restoring tabs, and exporting/importing portable backups.",
    longDescription: "Session Rescue is a published Chrome Web Store extension for people who want a simple local backup of browser sessions. It captures normal windows and restorable tabs, supports manual and user-enabled automatic snapshots, restores sessions into a new window or the current context, and exports/imports JSON backups without a backend, account, analytics, ads, or remote code.",
    projectKind: "user-product",
    surfaceTags: ["browser-extension", "web", "open-source"],
    keyFeatures: [
      "Captures local session snapshots with tabs, window grouping, titles, URLs, pinned state, and timestamps",
      "Restores saved sessions into a focused new window or the current browser context",
      "Exports and imports portable JSON backups so the archive is not trapped in the extension",
      "Ships with CWS readiness checks, real-browser E2E coverage, and sanitized store screenshots"
    ],
    techStack: ["Chrome Extension", "JavaScript", "IndexedDB", "Playwright", "Chrome Web Store", "Local-first UX"],
    benchmarks: [
      { label: "Chrome Web Store version", value: "0.1.4", context: "public listing updated 2026-04-29" },
      { label: "Storage model", value: "local-only", context: "no backend, account, analytics, ads, or remote code" },
      { label: "Verification stack", value: "unit + manifest + CWS + E2E", context: "repo-local verification command" }
    ],
    links: [
      { text: "View on Chrome Web Store", url: "https://chromewebstore.google.com/detail/session-rescue/hoklaadapaobdbkeiacebnnciponcmnf" },
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/session-rescue" },
      { text: "Product site", url: "https://session-rescue.pages.dev/" }
    ],
    images: [
      { url: `${LOCAL_IMG_BASE}/session-rescue-hero.png`, alt: "Session Rescue public product page with session library preview" },
      { url: `${LOCAL_IMG_BASE}/session-rescue-popup.png`, alt: "Session Rescue extension popup" },
      { url: `${LOCAL_IMG_BASE}/session-rescue-library.png`, alt: "Session Rescue session library" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/session-rescue-hero.png`,
    repoFullName: "zack-dev-cm/session-rescue",
    createdAt: "2026-04-29",
    canonicalLinks: {
      chromeWebStore: "https://chromewebstore.google.com/detail/session-rescue/hoklaadapaobdbkeiacebnnciponcmnf",
      github: "https://github.com/zack-dev-cm/session-rescue",
      website: "https://session-rescue.pages.dev/"
    }
  },
  {
    id: 60,
    title: "Telegram Mini App Security Auditor",
    aliases: ["tma security auditor", "telegram launch gate", "telegram mini app audit"],
    description: "Static launch gate for Telegram Mini Apps that flags initData, token, admin, CORS, PII, and Bot API dry-run risks before release.",
    longDescription: "Telegram Mini App Security Auditor packages a deterministic static audit for TMA projects before bot tokens, BotFather settings, or public channels are connected. It scans the project root for server-side initData validation signals, token-shaped literals, admin routes without obvious guards, wildcard CORS, unsafe HTML usage, frame-header risks, contact/PII/token request-form leaks, and live Bot API actions without dry-run or review gates. The public contract is intentionally conservative: it returns PASS, REVIEW, or BLOCK, and it does not claim runtime security proof.",
    projectKind: "open-source",
    surfaceTags: ["open-source", "automation", "security", "mini-app-security"],
    keyFeatures: [
      "Audits Telegram initData validation, committed token patterns, admin route guards, CORS, frame headers, and unsafe HTML signals",
      "Flags PII/token collection risks in request forms before a public Telegram Mini App launch",
      "Returns PASS, REVIEW, or BLOCK with JSON and Markdown reports for release review",
      "Keeps the guarantee narrow: a static heuristic launch gate, not proof of runtime security"
    ],
    techStack: ["Python", "Static Analysis", "Telegram Mini Apps", "Security Review", "Markdown Reports", "Codex Skills"],
    benchmarks: [
      { label: "Decision states", value: "3", context: "PASS, REVIEW, BLOCK" },
      { label: "Report formats", value: "2", context: "JSON + Markdown" },
      { label: "Audit families", value: "9", context: "initData, tokens, admin, CORS, HTML, frames, PII, health, Bot API dry-run" }
    ],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/telegram-miniapp-security-auditor" }
    ],
    images: [],
    thumbnail: "",
    hideImages: true,
    repoFullName: "zack-dev-cm/telegram-miniapp-security-auditor",
    createdAt: "2026-04-30",
    canonicalLinks: {
      github: "https://github.com/zack-dev-cm/telegram-miniapp-security-auditor"
    }
  },
  {
    id: 61,
    title: "Agentic Codex Dev Skill",
    aliases: ["agentic codex skill", "codex development skill", "openclaw development loop"],
    description: "Instruction-only Codex/OpenClaw skill for scoped development loops, verification, leak review, durable memory, and publish gates.",
    longDescription: "Agentic Codex Dev Skill is a public instruction-only skill for turning broad software tasks into a disciplined agentic development loop. It tells Codex to state the goal, inspect the repo, assign explicit roles when delegation is needed, make scoped edits, run verification, review for leaks and regressions, update durable memory, and publish only when the public surface is clean. The package avoids scripts, installers, credential readers, and background daemons so the reusable surface stays auditable.",
    projectKind: "open-source",
    surfaceTags: ["open-source", "automation", "codex", "release-engineering"],
    keyFeatures: [
      "Defines a repo-first development loop: inspect, plan, edit, verify, review, remember, publish",
      "Documents role and isolation templates for multi-agent work without hiding ownership boundaries",
      "Includes release bleed and public-surface checklists for GitHub and ClawHub publishing",
      "Ships as an instruction-only skill with no scripts, daemons, credential readers, or installers"
    ],
    techStack: ["Codex Skills", "OpenClaw", "Release Engineering", "GitHub", "Markdown", "Agent Workflows"],
    benchmarks: [
      { label: "Runtime scripts", value: "0", context: "instruction-only public skill" },
      { label: "Reference docs", value: "5", context: "source review, comparison, system design, eval run, publish checklist" },
      { label: "Release gates", value: "2", context: "leak review and publish checklist" }
    ],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/agentic-codex-dev-skill" }
    ],
    images: [],
    thumbnail: "",
    hideImages: true,
    repoFullName: "zack-dev-cm/agentic-codex-dev-skill",
    createdAt: "2026-04-30",
    canonicalLinks: {
      github: "https://github.com/zack-dev-cm/agentic-codex-dev-skill"
    }
  },
  {
    id: 62,
    title: "OpenClaw CWS Publisher",
    aliases: ["chrome web store publisher", "cws publisher", "openclaw extension release kit"],
    description: "Public release kit for Chrome extension packaging, CWS listing validation, leak scanning, design gates, and publish-command generation.",
    longDescription: "OpenClaw CWS Publisher is a public release kit for Chrome extension projects. It packages the exact extension ZIP intended for upload, validates the manifest and CWS listing contract, scans tracked and untracked public-surface files for leak patterns, runs discovered local E2E/reviewer gates, enforces design score reports, checks Chrome Stable freshness, and renders reproducible GitHub and ClawHub publish commands. It is a release helper, not a bundled extension product.",
    projectKind: "open-source",
    surfaceTags: ["open-source", "automation", "browser-extension", "release-engineering"],
    keyFeatures: [
      "Builds and validates the exact Chrome Web Store ZIP against source manifest and listing JSON",
      "Scans tracked and untracked non-ignored files for local paths, localhost URLs, websockets, and token-shaped strings",
      "Runs local E2E, reviewer, design, Chrome Stable, and competitor checks when a target extension exposes them",
      "Renders reproducible GitHub release and ClawHub publish commands from a launch manifest"
    ],
    techStack: ["ClawHub", "Python", "Chrome Web Store", "Playwright", "Release Engineering", "Security Review"],
    benchmarks: [
      { label: "ClawHub downloads", value: "523", context: "public ClawHub listing, 2026-05-20" },
      { label: "Published versions", value: "14", context: "public ClawHub listing, 2026-05-20" },
      { label: "Release checks", value: "7", context: "ZIP, listing, leaks, E2E, design, Chrome Stable, competitors" }
    ],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/openclaw-cws-publisher" },
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/openclaw-cws-publisher" }
    ],
    images: [],
    thumbnail: "",
    hideImages: true,
    repoFullName: "zack-dev-cm/openclaw-cws-publisher",
    createdAt: "2026-04-15",
    canonicalLinks: {
      github: "https://github.com/zack-dev-cm/openclaw-cws-publisher",
      website: "https://clawhub.ai/zack-dev-cm/openclaw-cws-publisher"
    }
  },
  {
    id: 63,
    title: "Dermaself Flutter Skin Analysis App",
    aliases: ["dermaself mobile app", "flutter skin analysis", "mobile skin analysis app"],
    description: "Flutter mobile app case study for a guided cosmetic skin-analysis flow with Firebase-backed account, intake, photo capture, and results screens.",
    longDescription: "Dermaself is a mobile CV case study organized as a native Flutter experience for Android and iOS, with a guided path from account setup through onboarding, questionnaire intake, selfie/device photo capture, analysis results, and home navigation. The engineering signal is the mobile architecture, Firebase integration, offline model runtime, ROI gating, tile-bounded wrinkle and fine-line processing, pore detection, and promotion decisions for a camera-heavy cosmetic analysis workflow.",
    projectKind: "case-study",
    surfaceTags: ["mobile", "computer-vision", "health-ai", "case-study"],
    mobileReady: true,
    keyFeatures: [
      "Structures the app into clean feature modules for auth, onboarding, questionnaire, photo capture, device capture, analysis, and home",
      "Uses Firebase services for account state, database records, image storage, analytics, messaging, and serverless extension points",
      "Builds a guided capture-to-results UX for camera-heavy cosmetic analysis without presenting the portfolio entry as a medical diagnostic claim",
      "Includes offline model runtime, ROI gating, and tile-bounded wrinkle/fine-line processing in the mobile delivery path",
      "Keeps debug-only segmentation evidence separate from launch claims when a model should not be promoted"
    ],
    techStack: ["Flutter", "Dart", "Firebase", "Riverpod", "GoRouter", "ONNX", "TFLite", "Mobile CV", "iOS", "Android"],
    benchmarks: [
      { label: "Native targets", value: "2", context: "Android and iOS app structure" },
      { label: "Feature modules", value: "7", context: "auth, onboarding, questionnaire, photo capture, device capture, analysis, home" },
      { label: "Debug Dice ceiling", value: "0.975 mean", context: "12-image overfit diagnostic, not holdout evidence, 2026-05-12" },
      { label: "Promotion decision", value: "blocked", context: "fine-line model not promoted to server or Flutter after QA review" }
    ],
    links: [],
    mermaidDiagram: `flowchart LR
  Onboarding["Onboarding + Questionnaire"] --> Capture["Selfie / Device Capture"]
  Capture --> ROI["Face ROI + Capture Gates"]
  ROI --> Runtime["ONNX / TFLite Runtime"]
  Runtime --> Texture["Wrinkle, Pore, Acne Signals"]
  Texture --> QA["QA Review + Promotion Decision"]
  QA --> Results["Results + Recommendations"]`,
    images: [],
    thumbnail: "",
    hideImages: true,
    createdAt: "2026-05-05"
  },
  {
    id: 64,
    title: "Chrome Extension Studio Plugin",
    aliases: ["extension studio plugin", "chrome extension release studio", "cws product repo generator"],
    description: "Codex plugin case study for planning, designing, generating, packaging, QA, and release preparation across Chrome extension product repos.",
    longDescription: "Chrome Extension Studio Plugin is a local developer-platform project for keeping extension plugin logic, reusable templates, and shipped product repositories separate. It defines release profiles for prototype, private beta, public Chrome Web Store, and source-release paths, then generates design briefs, store listing drafts, release plans, product repos, and release-cycle checklists from a single extension contract. The public case study focuses on the reusable release system rather than any one extension product.",
    projectKind: "case-study",
    surfaceTags: ["automation", "browser-extension", "release-engineering", "codex"],
    keyFeatures: [
      "Separates Codex plugin code, reusable extension templates, and product-specific extension repositories",
      "Defines publish types for local prototypes, private beta, public Chrome Web Store releases, and source-first releases",
      "Generates design briefs, store listings, release plans, product repos, and release-cycle outputs from a release profile",
      "Keeps Chrome extension delivery repeatable without mixing product code and automation scaffolding"
    ],
    techStack: ["Codex Plugin", "Python", "Chrome Extensions", "Manifest V3", "Chrome Web Store", "Release Engineering"],
    benchmarks: [
      { label: "Publish types", value: "4", context: "prototype-local, beta-private, cws-public, source-release" },
      { label: "Release scripts", value: "6", context: "create, design brief, store listing, release plan, release cycle, profile validation" },
      { label: "Source review date", value: "2026-04-18", context: "project evidence review" }
    ],
    links: [],
    images: [],
    thumbnail: "",
    hideImages: true,
    createdAt: "2026-04-18"
  },
  {
    id: 65,
    title: "Google Drive File Provider Repair Toolkit",
    aliases: ["google drive repair", "mac file provider repair", "drive file provider diagnostics"],
    description: "macOS repair toolkit case study for diagnosing and conservatively restoring Google Drive File Provider state without deleting Drive data.",
    longDescription: "Google Drive File Provider Repair Toolkit is a standalone macOS operations project built around a real Drive for desktop failure mode: a valid app and extension existed locally, but the File Provider extension and domain disappeared from macOS registration surfaces. The toolkit diagnoses the current state, offers dry-run repair, re-registers the app and extension, restarts the per-user file provider path, clears only matching stale IPC sockets after process cycling, and inspects sync state for explicit files or folders. The public case study is framed around conservative recovery: no Drive cache deletion, no CloudStorage deletion, no account disconnect, and no mirrored/streamed data removal.",
    projectKind: "case-study",
    surfaceTags: ["automation", "macos", "ops-tooling", "local-first"],
    keyFeatures: [
      "Diagnoses Google Drive app, File Provider extension, domain registration, endpoint reachability, stale roots, and per-path sync state",
      "Runs safe repair with dry-run support before changing local Launch Services, pluginkit, Drive, or fileproviderd state",
      "Collects shareable diagnostic bundles and unified-log excerpts for manual escalation without deleting user data",
      "Includes explicit guardrails against deleting Drive caches, CloudStorage content, accounts, or mirrored/streamed files"
    ],
    techStack: ["macOS", "Shell", "File Provider", "Google Drive", "Diagnostics", "Local-first Tooling"],
    benchmarks: [
      { label: "Command families", value: "6", context: "diagnose, repair, collect logs, inspect recovery, inspect sync, wait sync" },
      { label: "Destructive data actions", value: "0", context: "0 cache, CloudStorage, account, or user-data deletion paths in reviewed repair flow, 2026-04-17" },
      { label: "Source review date", value: "2026-04-17", context: "project evidence review" }
    ],
    links: [],
    images: [],
    thumbnail: "",
    hideImages: true,
    createdAt: "2026-04-17"
  },
  {
    id: 66,
    title: "CollectionsAI ChatGPT App",
    aliases: ["collectionsai chatgpt app", "conservation mcp app", "senior conservation widgets"],
    description: "ChatGPT app case study with MCP tools and widgets for conservation report Q&A, portfolio planning, materials estimates, staffing, and voice-note structuring.",
    longDescription: "CollectionsAI ChatGPT App packages a senior-conservation workflow as an MCP server plus ChatGPT widget layer. It exposes tools for report dashboards, factual Q&A, safe artifact listing, urgency rollups, capacity planning, material estimates, staffing assignments, dictated voice-note structuring, condition-report drafting, and end-to-end conservation cycles. The public case study focuses on the app architecture, widget metadata, release gates, and production posture.",
    projectKind: "case-study",
    surfaceTags: ["automation", "mcp", "chatgpt-app", "operations"],
    keyFeatures: [
      "Maps conservation report Q&A, dashboards, artifacts, planning, intake, and report drafting into explicit MCP tools",
      "Provides ChatGPT widget metadata for dashboard, QA, artifact, operations, and voice-review surfaces",
      "Includes production controls for auth, artifact protection, CORS allowlists, request limits, cache TTLs, timeouts, and security headers",
      "Ships release checks for Node syntax, preflight, publish posture, App Info audit, E2E, load, alpha scenarios, and showcase runs"
    ],
    techStack: ["Node.js", "MCP", "ChatGPT Apps", "Zod", "Python", "Widget Metadata", "Release Gates"],
    benchmarks: [
      { label: "MCP tools", value: "10", context: "documented app tool surface" },
      { label: "Load harness", value: "10-user", context: "explicit concurrency test described in release checks" },
      { label: "Source review date", value: "2026-03-04", context: "project evidence review" }
    ],
    links: [],
    images: [],
    thumbnail: "",
    hideImages: true,
    createdAt: "2026-03-04"
  },
  {
    id: 67,
    title: "Senior Conservator OpenClaw Agent",
    aliases: ["senior conservator agent", "conservation openclaw workflow", "autonomous conservation report"],
    description: "Autonomous OpenClaw workflow case study for conservation-style photo review, segmentation overlays, staged evidence gates, reports, audio, and manifests.",
    longDescription: "Senior Conservator OpenClaw Agent is an evidence-heavy conservation review case study. It combines a FastAPI dashboard, OpenClaw browser control, deep-research MCP tools, first-party image segmentation, ROI inspection, model-assisted comparison, report generation, voice output, video artifacts, and reproducibility manifests. The public case study summarizes the architecture and review-gated artifact flow as a reusable pattern for expert inspection work.",
    projectKind: "case-study",
    surfaceTags: ["automation", "computer-vision", "openclaw", "operations"],
    keyFeatures: [
      "Combines image segmentation, regional scoring, ROI crop inspection, and browser-driven visual-labeler review",
      "Runs staged review gates before final report, presentation, voice, video, and Telegram delivery artifacts are accepted",
      "Produces JSON, Markdown, PDF, HTML, audio, overlay, video, and reproducibility-manifest outputs for audit-heavy workflows",
      "Frames expert workflow orchestration as a reusable review-gated artifact pattern"
    ],
    techStack: ["FastAPI", "OpenClaw", "Python", "MCP", "Pillow", "ReportLab", "Computer Vision", "Review Gates"],
    benchmarks: [
      { label: "Artifact families", value: "8+", context: "reports, overlays, manifests, audio, video, dashboard, inspection logs, delivery status" },
      { label: "Review posture", value: "strict", context: "stage-by-stage gates documented in project evidence" },
      { label: "Source review date", value: "2026-03-01", context: "project evidence review" }
    ],
    links: [],
    images: [],
    thumbnail: "",
    hideImages: true,
    createdAt: "2026-03-01"
  },
  {
    id: 68,
    title: "SourcePack Chrome Extension Wave",
    aliases: ["sourcepack suite", "web2csv", "video2source", "repo2agent", "sourcepack hub", "cws scout", "chatarchive"],
    description: "Six-extension Chrome Web Store wave for local research exports, repo context packs, table extraction, YouTube transcript capture, AI chat export, and CWS competitor notes.",
    longDescription: "SourcePack Chrome Extension Wave packages a reusable Manifest V3 runtime plus six focused Chrome extensions: Web2CSV for visible table/list/card extraction, Video2Source for YouTube transcript exports, Repo2Agent for visible GitHub repository context packs, SourcePack Hub for a local research library, CWS Scout for Chrome-Stats competitor notes, and ChatArchive for visible ChatGPT conversation exports. The delivery work included CWS listing contracts, public product pages, privacy/support/reviewer pages, real-browser E2E evidence, media gates, package ZIPs, and Chrome Web Store tracking.",
    projectKind: "user-product",
    surfaceTags: ["browser-extension", "web", "automation", "release-engineering"],
    keyFeatures: [
      "Ships six narrow Manifest V3 extensions from one shared SourcePack runtime without broad host permissions",
      "Exports local Markdown, JSON, CSV, NotebookLM-style Markdown, and SourcePack bundles after explicit user actions",
      "Includes public CWS reviewer pages, privacy/support pages, listing contracts, media manifests, and real-browser E2E evidence",
      "Embeds Chrome Web Store detail-page tracking in this portfolio so extension adoption and risk metadata stay visible"
    ],
    techStack: ["Chrome Extension", "Manifest V3", "React", "TypeScript", "SourcePack", "Playwright", "Chrome Web Store"],
    benchmarks: [
      { label: "Published extensions", value: "16", context: "Chrome Web Store publisher search and detail pages, 2026-05-18" },
      { label: "Publisher users", value: "208", context: "sum of explicitly reported Chrome Web Store detail-page users, 2026-05-18" },
      { label: "Average rating", value: "5.00", context: "4 reported Chrome Web Store ratings, 2026-05-18" },
      { label: "New SourcePack products", value: "6", context: "Web2CSV, Video2Source, Repo2Agent, SourcePack Hub, CWS Scout, ChatArchive" }
    ],
    links: [
      { text: "SourcePack product pages", url: "https://sourcepack-tools.pages.dev/" },
      { text: "Chrome Web Store publisher", url: "https://chromewebstore.google.com/search/kaisenaiko" },
      { text: "Web2CSV CWS", url: "https://chromewebstore.google.com/detail/web2csv-table-list-extractor/egjcdmlfdnkpgkmffkhfdooacmglnjbc" },
      { text: "Video2Source CWS", url: "https://chromewebstore.google.com/detail/video2source-youtube-trans/hjfdpklldhofiehpcfcfdonjppdkmgoh" },
      { text: "Repo2Agent CWS", url: "https://chromewebstore.google.com/detail/repo2agent-github-to-ai-co/hkfeiaapcdjlccinbcbibnlaapcliobd" },
      { text: "SourcePack Hub CWS", url: "https://chromewebstore.google.com/detail/sourcepack-hub-local-ai-re/hlbflaklicefinhckdkbamhhkfklmgao" },
      { text: "CWS Scout CWS", url: "https://chromewebstore.google.com/detail/cws-scout-extension-compet/ahalbgecklcboflgkloaceogjmfjckji" },
      { text: "ChatArchive CWS", url: "https://chromewebstore.google.com/detail/chatarchive-chatgpt-exporter/pmofpiclpglbdnjgkgijlolefiojjomn" }
    ],
    images: [],
    thumbnail: "",
    hideImages: true,
    createdAt: "2026-05-07",
    canonicalLinks: {
      website: "https://sourcepack-tools.pages.dev/"
    }
  },
  {
    id: 69,
    title: "Trusted ClawHub Install Gate",
    aliases: ["trusted clawhub gate", "clawhub install gate", "openclaw skill installer review"],
    description: "Skill-build case study for a local-first ClawHub/OpenClaw install wrapper that inspects skill artifacts before install and writes receipts.",
    longDescription: "Trusted ClawHub Install Gate is a local-first skill-build project for reducing blind trust in ClawHub/OpenClaw skill installation. It inspects an unpacked local skill directory, classifies the artifact as PASS, REVIEW, or BLOCK, refuses install by default unless the artifact is clean or explicitly approved for review-level risk, writes a receipt for what was inspected and installed, and later verifies installed content against that receipt. The public case study keeps the scope narrow: local directories only, no claim of complete runtime security, and no silent workspace inference.",
    projectKind: "case-study",
    surfaceTags: ["security", "automation", "release-engineering"],
    keyFeatures: [
      "Classifies local skill artifacts as PASS, REVIEW, or BLOCK before installation",
      "Denies REVIEW installs unless the operator explicitly allows review-level risk",
      "Writes install receipts under a local data directory and verifies installed content against those receipts",
      "Keeps v0.1 scope narrow: local unpacked skill directories only, no arbitrary remote slug resolution claim"
    ],
    techStack: ["Python", "CLI", "OpenClaw", "ClawHub", "Security Review", "Receipt Verification"],
    benchmarks: [
      { label: "Verdict states", value: "3", context: "PASS, REVIEW, BLOCK in project contract" },
      { label: "Default unsafe install policy", value: "deny", context: "REVIEW and BLOCK require explicit handling or are refused in the 2026-05-07 evidence review" },
      { label: "Verification model", value: "receipt-aware", context: "installed hash and approved verdict must match receipt" }
    ],
    links: [],
    images: [],
    thumbnail: "",
    hideImages: true,
    createdAt: "2026-05-07"
  },
  {
    id: 70,
    title: "Fast OCR ONNX Inference Server",
    aliases: ["fast ocr", "onnx ocr api", "three-stage ocr"],
    description: "Containerized OCR API that stages line segmentation, word segmentation, and CRNN text recognition behind a FastAPI endpoint.",
    longDescription: "Fast OCR ONNX Inference Server is a public-safe computer vision case study for turning OCR models into a deployable inference service. The pipeline accepts an uploaded image, runs line segmentation, word segmentation, and CRNN recognition, then returns recognized text with line and word boxes as JSON. The public entry focuses on architecture, serving contracts, CPU ONNX runtime, Docker packaging, and response shape.",
    projectKind: "case-study",
    surfaceTags: ["computer-vision", "ocr", "api", "mlops"],
    keyFeatures: [
      "Stages OCR as line segmentation, word segmentation, and CRNN text recognition",
      "Serves inference through a FastAPI upload endpoint with JSON boxes and recognized text",
      "Packages the model stack for Docker-based CPU deployment",
      "Documents deployment shape and response contracts with sanitized architecture evidence"
    ],
    techStack: ["Python", "FastAPI", "ONNX Runtime", "CRNN", "OCR", "Docker", "Cloud Run"],
    benchmarks: [
      { label: "OCR stages", value: "3", context: "line segmentation, word segmentation, CRNN recognition" },
      { label: "Model artifacts", value: "3", context: "line, word, and text-recognition ONNX models" },
      { label: "API endpoints", value: "2", context: "health check and image inference contract" },
      { label: "Serving target", value: "CPU ONNX", context: "containerized FastAPI inference path" }
    ],
    links: [],
    mermaidDiagram: `flowchart LR
  Upload["Upload Image"] --> Line["Line Segmentation ONNX"]
  Line --> Word["Word Segmentation ONNX"]
  Word --> CRNN["CRNN Text Recognition"]
  CRNN --> Response["JSON Text + Boxes"]
  Response --> Review["Timing + Debug Metadata"]`,
    images: [],
    thumbnail: "",
    hideImages: true,
    createdAt: "2026-05-14"
  },
  {
    id: 71,
    title: "Full-Face Wrinkle and Skin Texture Segmentation Lab",
    aliases: ["wrinkle segmentation lab", "skin texture segmentation", "cosmetic face analysis"],
    description: "Cosmetic face-texture pipeline with region masks, YOLO segmentation, skeletonized wrinkle traces, overlays, and visual quality gates.",
    longDescription: "Full-Face Wrinkle and Skin Texture Segmentation Lab is a deep learning case study for cosmetic face analysis. It segments face and neck regions, runs YOLO segmentation for wrinkle and fine-line masks, remaps detections from face ROI crops back to full-resolution coordinates, skeletonizes individual line traces, and writes overlays, region masks, CSV records, timing events, and QA panels. The public entry avoids medical claims and treats quality gates as review signals rather than deployment proof.",
    projectKind: "case-study",
    surfaceTags: ["computer-vision", "segmentation", "deep-learning", "health-ai"],
    keyFeatures: [
      "Segments cosmetic face and neck regions before wrinkle/fine-line analysis",
      "Uses YOLO segmentation masks and skeletonized line traces instead of generic image filters",
      "Writes reviewable overlays, region masks, per-line CSV records, timing events, and QA panels",
      "Keeps quality gates advisory so weak detections are reviewed instead of silently shipped"
    ],
    techStack: ["Python", "YOLO", "MediaPipe", "OpenCV", "ONNX", "Segmentation", "Visual QA"],
    benchmarks: [
      { label: "Face regions", value: "9", context: "forehead, t-area, nose, eyes, nasolabial, cheeks, mouth, mental, neck" },
      { label: "Artifact families", value: "6", context: "overlays, masks, skeletons, CSV, events, QA panels" },
      { label: "Gate posture", value: "advisory", context: "review signal, not automatic deployment proof" }
    ],
    links: [],
    mermaidDiagram: `flowchart LR
  Image["Face Image"] --> ROI["Face ROI + Landmarks"]
  ROI --> Regions["Region Masks"]
  ROI --> YOLO["YOLO Segmentation"]
  YOLO --> Skeleton["Skeletonized Line Traces"]
  Regions --> QA["QA Panel + Coverage Checks"]
  Skeleton --> QA
  QA --> Artifacts["Overlays + CSV + Events"]`,
    images: [],
    thumbnail: "",
    hideImages: true,
    createdAt: "2026-05-14"
  },
  {
    id: 72,
    title: "Multimodal Video Search Platform",
    aliases: ["SVS4 search", "video neural search", "hybrid media search"],
    description: "Video search case study combining keyframes, ASR/OCR, object and face signals, visual embeddings, transcript embeddings, and hybrid retrieval.",
    longDescription: "Multimodal Video Search Platform is a case study for search across video and rich media. The system normalizes uploads, extracts keyframes, runs transcript and OCR processing, maintains visual and text embeddings, writes dense and sparse indexes, and serves ranked results through calibrated hybrid retrieval. The public entry focuses on architecture, agent responsibilities, benchmark posture, and recovery paths using sanitized architecture evidence.",
    projectKind: "case-study",
    surfaceTags: ["computer-vision", "ai", "search", "video", "mlops"],
    keyFeatures: [
      "Combines keyframe extraction, ASR/OCR, visual embeddings, transcript embeddings, object signals, and face signals",
      "Uses dense vector retrieval and sparse search together instead of relying on a single modality",
      "Adds quality-agent style regression checks for hybrid retrieval, ASR/OCR coverage, and recovery workflows",
      "Uses sanitized architecture diagrams, metrics posture, and recovery notes for public review"
    ],
    techStack: ["Python", "FastAPI", "Qdrant", "Postgres", "CLIP", "OCR", "ASR", "Hybrid Search", "Celery"],
    benchmarks: [
      { label: "Signal lanes", value: "5", context: "keyframes, ASR, OCR, objects, faces" },
      { label: "Index types", value: "2", context: "dense vector and sparse retrieval" },
      { label: "Agent roles", value: "5", context: "ingestion, embedding, retrieval, quality, recovery" },
      { label: "Metric posture", value: "sample benchmark", context: "regression evidence, not production accuracy claim" }
    ],
    links: [],
    mermaidDiagram: `flowchart LR
  Upload["Video Upload"] --> Frames["Scenes + Keyframes"]
  Upload --> ASR["ASR Transcript"]
  Frames --> OCR["OCR + Captions"]
  Frames --> Visual["Visual / Face / Object Signals"]
  ASR --> Index["Dense + Sparse Indexes"]
  OCR --> Index
  Visual --> Index
  Index --> Rank["Hybrid Scorer"]
  Rank --> Results["Ranked Results + Review Metrics"]`,
    images: [
      { url: `${LOCAL_IMG_BASE}/cv-ai-systems-map.png`, alt: "Conceptual computer vision systems map for OCR, face analysis, and video neural search" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/cv-ai-systems-map.png`,
    createdAt: "2026-05-14"
  },
  {
    id: 73,
    title: "Public CV and Deep Learning GitHub Archive",
    aliases: ["public cv dl archive", "github computer vision archive", "older cv research repos"],
    description: "GitHub API-backed archive of public authored CV/DL repos across YOLO/EfficientNet detection, Cyrillic OCR, mobile ML Kit, TFLite, and vision-transformer prototypes.",
    longDescription: "Public CV and Deep Learning GitHub Archive consolidates earlier public authored computer-vision repositories into one discovery surface. A 2026-05-14 GitHub API review across zack-dev-cm and ZackPashkin surfaced relevant repositories for YOLO/EfficientNet object detection, Cyrillic handwriting OCR, OCR datasets, ML Kit face contours, TFLite glasses classification, DeIT/Swin/CvT transformer prototypes, document capture, energy-meter recognition, video search, and CLIP-assisted media tools. Forked upstream reference repos are treated as research context, not as authored portfolio proof.",
    projectKind: "research",
    surfaceTags: ["computer-vision", "deep-learning", "ocr", "mobile", "github"],
    keyFeatures: [
      "Separates authored public repos from forks and reference clones before using GitHub evidence",
      "Surfaces OCR, object detection, face landmarks, mobile inference, and vision-transformer work as one searchable archive",
      "Uses public repo metadata and generated case studies instead of unpublished notebook or service links",
      "Frames older prototypes as research and engineering breadth without claiming production deployment"
    ],
    techStack: ["Python", "PyTorch", "TensorFlow", "YOLO", "EfficientNet", "OCR", "ML Kit", "TFLite", "OpenCV", "Android", "Flutter"],
    benchmarks: [
      { label: "GitHub accounts reviewed", value: "2", context: "zack-dev-cm and ZackPashkin public API snapshot, 2026-05-14" },
      { label: "Public CV/DL repos sampled", value: "18+", context: "authored or project-specific public repositories, forks excluded from proof" },
      { label: "Top public repo", value: "14 stars / 6 forks", context: "YOLOv3-EfficientNet-EffYolo API snapshot" },
      { label: "Evidence posture", value: "public-only", context: "public GitHub repos and generated case studies only" }
    ],
    links: [
      { text: "YOLOv3 EfficientNet EffYolo", url: "https://github.com/ZackPashkin/YOLOv3-EfficientNet-EffYolo" },
      { text: "shiftlab OCR", url: "https://github.com/ZackPashkin/shiftlab_ocr" },
      { text: "Cyrillic handwriting dataset", url: "https://github.com/ZackPashkin/Cyrillic-Handwriting-Dataset" },
      { text: "ML Kit face contours Android", url: "https://github.com/ZackPashkin/Snapchat-Filter-MLkit-Face-Countours-Firebase-Android" },
      { text: "TFLite glasses classifier", url: "https://github.com/ZackPashkin/tensorflow_glasses_classifier_plus_tflite" },
      { text: "Flutter OpenCV image processing", url: "https://github.com/zack-dev-cm/cm_cpp_flutter_opencv" },
      { text: "CV Repro Lab skill", url: "https://github.com/zack-dev-cm/agentic-cv-repro-lab-skill" }
    ],
    mermaidDiagram: `flowchart LR
  API["GitHub API Review"] --> Filter["Authored Repo Filter"]
  Filter --> OCR["OCR + Handwriting"]
  Filter --> Detect["YOLO / Detection"]
  Filter --> Mobile["Mobile Inference"]
  Filter --> VIT["Vision Transformers"]
  OCR --> Portfolio["Public Case Study Archive"]
  Detect --> Portfolio
  Mobile --> Portfolio
  VIT --> Portfolio
  Portfolio --> Guard["Public Evidence Only"]`,
    images: [
      { url: `${LOCAL_IMG_BASE}/cv-ai-systems-map.png`, alt: "Computer vision systems map used for public CV and deep learning archive" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/cv-ai-systems-map.png`,
    createdAt: "2026-05-14"
  },
  {
    id: 74,
    title: "Colab CV/DL Prototype Archive",
    aliases: ["colab notebooks archive", "cv dl prototype archive", "vision notebook prototypes"],
    description: "Public notebook-style CV/DL prototype archive for Swin/CvT starters, OCR finetuning, Android document capture, video search, lip sync, and CLIP media experiments.",
    longDescription: "Colab CV/DL Prototype Archive groups public notebook-style repositories and Colab-ready code that show research range across image classification, OCR finetuning, mobile document capture, video retrieval, lip-sync media generation, and CLIP-based creative tooling. The archive is intentionally scoped as prototype and research evidence: it links only public GitHub repositories and avoids unpublished notebooks, service endpoints, or restricted datasets.",
    projectKind: "research",
    surfaceTags: ["computer-vision", "deep-learning", "colab", "notebooks", "generative-ai"],
    keyFeatures: [
      "Groups older public notebooks into a coherent CV/DL research surface for agents and recruiters",
      "Covers image classification, OCR finetuning, document capture, multimodal video search, and generative media",
      "Keeps notebook evidence tied to public GitHub repos and generated case studies",
      "Labels the work as prototypes so agents do not confuse notebooks with maintained production services"
    ],
    techStack: ["Jupyter Notebook", "Google Colab", "PyTorch", "TensorFlow", "Swin Transformer", "CvT", "CLIP", "MMOCR", "OpenCV", "CameraX"],
    benchmarks: [
      { label: "Public prototype links", value: "8", context: "GitHub API and repo URL review, 2026-05-14" },
      { label: "Research families", value: "5", context: "classification, OCR, mobile capture, video retrieval, generative media" },
      { label: "Notebook posture", value: "prototype", context: "not presented as live service or production accuracy proof" },
      { label: "Evidence links", value: "public-only", context: "GitHub repos and generated case studies only" }
    ],
    links: [
      { text: "Swin transformer starter", url: "https://github.com/ZackPashkin/swin-transformer-pytorch-starter" },
      { text: "CvT convolutional transformer starter", url: "https://github.com/ZackPashkin/CvT-convolutional-transformer-pytorch" },
      { text: "Digits recognition MMOCR", url: "https://github.com/ZackPashkin/digits-recognition-mm-ocr" },
      { text: "Android document scan", url: "https://github.com/ZackPashkin/DocumentsScan" },
      { text: "Search through videos", url: "https://github.com/ZackPashkin/search-through-videos" },
      { text: "Voice and lip sync Colab app", url: "https://github.com/ZackPashkin/voice-and-lip-sync-in-pytorch-web-app-colab" },
      { text: "Text to cartoon CLIP", url: "https://github.com/ZackPashkin/text2cartoon-pytorch-CLIP" },
      { text: "Sticker maker with CLIP", url: "https://github.com/ZackPashkin/sticker-maker-flutter-app-with-OpenAI-CLIP" }
    ],
    mermaidDiagram: `flowchart LR
  Notebooks["Public Notebooks"] --> Classify["Image Classification"]
  Notebooks --> OCR["OCR Finetuning"]
  Notebooks --> Mobile["Mobile Capture"]
  Notebooks --> Video["Video / Lip Sync"]
  Notebooks --> CLIP["CLIP Media Tools"]
  Classify --> Archive["Prototype Archive"]
  OCR --> Archive
  Mobile --> Archive
  Video --> Archive
  CLIP --> Archive
  Archive --> Agents["LLM + Recruiter Discovery"]`,
    images: [],
    thumbnail: "",
    hideImages: true,
    createdAt: "2026-05-14"
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
      { label: "ClawHub downloads", value: "331", context: "public ClawHub listing, 2026-05-20" },
      { label: "Published versions", value: "8", context: "public ClawHub listing, 2026-05-20" },
      { label: "Public release", value: "v1.0.5", context: "GitHub + ClawHub" },
      { label: "Bundled scripts", value: "4", context: "init, append, check, render" },
      { label: "Approval gate", value: "required", context: "review must be approved before submit" },
      { label: "Validation posture", value: "release-checked", context: "smoke test + publish-guard audit" }
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
