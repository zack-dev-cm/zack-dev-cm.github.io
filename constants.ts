import { resolveAssetUrl } from './utils/assets';
import type {
  Project,
  Company,
  OpenSourceContribution,
  SocialLinks,
  AuthorInfo,
  LatestUpdate,
  ClawHubDownloadStat,
  ChromeExtensionStatsSnapshot
} from './types';

const LOCAL_IMG_BASE = resolveAssetUrl('images');
const LOCAL_COMPANY_LOGO_BASE = resolveAssetUrl('company-logos');
const SELECTED_AI_CV_EXCALIDRAW_IMAGE = {
  url: `${LOCAL_IMG_BASE}/selected-ai-cv-excalidraw-map.webp`,
  alt: "Excalidraw-style systems map for selected OCR, face analysis, architectural recognition, video search, and RAG automation projects"
};
const ARCHITECTURAL_CATALOG_RECEPTION_IMAGE = {
  url: `${LOCAL_IMG_BASE}/architectural-catalog-reception-preview.webp`,
  alt: "Generated commercial reception preview showing plan and elevation inputs mapped to anonymous catalog items and finished casework"
};
const DERMASELF_FLUTTER_SKIN_ANALYSIS_IMAGE = {
  url: `${LOCAL_IMG_BASE}/dermaself-verified-workflow.png`,
  alt: "Workflow diagram of guided capture, facial regions, selected model runtime and structured results, with separate model-release evaluation",
  caption: "Workflow diagram. Image analysis and model-release evaluation are separate."
};
const CLEARML_DERMASELF_EXPERIMENT_TRACKING_IMAGE = {
  url: `${LOCAL_IMG_BASE}/clearml-dermaself-experiment-tracking-card.png`,
  alt: "Public-safe MLOps card showing Dermaself ClearML experiment tracking with datasets, parameters, metrics, artifacts, QA gates, and promotion boundaries"
};
const AGNITRA_AI_INFERENCE_OPTIMIZER_IMAGE = {
  url: `${LOCAL_IMG_BASE}/agnitra-profiling-workflow-v7.webp`,
  alt: "Conceptual illustration of model runtime profiling, optimization and baseline comparison"
};
const FACE_TEXTURE_ANALYSIS_SERVICE_IMAGE = {
  url: `${LOCAL_IMG_BASE}/face-texture-analysis-service-card.webp`,
  alt: "Generated public-safe face texture analysis card with anonymized mesh, ROI masks, pore heatmap, and wrinkle trace overlays"
};
const SENIOR_CONSERVATOR_VISUAL_INSPECTION_IMAGE = {
  url: `${LOCAL_IMG_BASE}/senior-conservator-visual-inspection-agent-card.webp`,
  alt: "Generated public-safe conservation visual-inspection card with object segmentation overlays, ROI crops, review gates, and report artifacts"
};
const FAST_OCR_ONNX_INFERENCE_IMAGE = {
  url: `${LOCAL_IMG_BASE}/fast-ocr-onnx-inference-card.webp`,
  alt: "Generated OCR serving card showing anonymized document blocks, line and word segmentation, ONNX stages, and blank API response panels"
};
const FULL_FACE_WRINKLE_SEGMENTATION_LAB_IMAGE = {
  url: `${LOCAL_IMG_BASE}/full-face-wrinkle-segmentation-lab-card.webp`,
  alt: "Generated full-face wrinkle segmentation lab card with anonymized face mesh, region masks, skeletonized traces, and QA artifact panels"
};
const MULTIMODAL_VIDEO_SEARCH_PLATFORM_IMAGE = {
  url: `${LOCAL_IMG_BASE}/video-search-verified-workflow.png`,
  alt: "Workflow diagram of parallel video, speech and OCR signals feeding visual and text indexes, hybrid ranking and timestamped matches",
  caption: "Workflow diagram of parallel extraction, indexing and hybrid retrieval."
};
const COLAB_CVDL_PROTOTYPE_ARCHIVE_IMAGE = {
  url: `${LOCAL_IMG_BASE}/colab-cvdl-prototype-archive-card.webp`,
  alt: "Generated CV and deep-learning prototype archive card with notebook lanes for transformers, OCR, mobile capture, video retrieval, and CLIP media work"
};

export const AUTHOR_INFO: AuthorInfo = {
  name: "Zakhar Pashkin",
  title: "Senior ML Engineer",
  bio: "Computer vision, document AI and agentic systems — from R&D to maintained products."
};

export const SOCIAL_LINKS: SocialLinks = {
  linkedin: "https://de.linkedin.com/in/zakhar-pashkin-a524a6163",
  x: "https://x.com/Zackdevcv",
  email: "kaisenaiko@gmail.com",
  githubPrimary: "https://github.com/zack-dev-cm",
  githubSecondary: "https://github.com/ZackPashkin",
  telegram: "https://t.me/rheuiii",
  resume: resolveAssetUrl('resume/zakhar-pashkin-senior-ml-engineer.pdf')
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

export const OPEN_SOURCE_CONTRIBUTIONS: OpenSourceContribution[] = [
  {
    name: "OpenClaw",
    login: "openclaw",
    avatarUrl: "https://avatars.githubusercontent.com/u/252820863?s=96&v=4",
    repo: "openclaw/clawpatch",
    contribution: "Fixed site crawler checks in the ClawPatch code-review workflow.",
    evidenceLabel: "Merged PR",
    sourceUrl: "https://github.com/openclaw/clawpatch/pull/95",
    account: "zack-dev-cm"
  },
  {
    name: "OpenAI",
    login: "openai",
    avatarUrl: "https://avatars.githubusercontent.com/u/14957082?s=96&v=4",
    repo: "openai/codex",
    contribution: "Reported a Codex Desktop sidebar interaction issue.",
    evidenceLabel: "Issue",
    sourceUrl: "https://github.com/openai/codex/issues/22363",
    account: "zack-dev-cm"
  },
  {
    name: "Unitree Robotics",
    login: "unitreerobotics",
    avatarUrl: "https://avatars.githubusercontent.com/u/44998897?s=96&v=4",
    repo: "unitreerobotics/xr_teleoperate",
    contribution: "Opened a teleoperation documentation and runtime PR.",
    evidenceLabel: "Open PR",
    sourceUrl: "https://github.com/unitreerobotics/xr_teleoperate/pull/310",
    account: "zack-dev-cm"
  },
  {
    name: "Toloka",
    login: "Toloka",
    avatarUrl: "https://avatars.githubusercontent.com/u/76212487?s=96&v=4",
    repo: "Toloka/toloka-kit",
    contribution: "Reported an SDK regression around allowed_methods.",
    evidenceLabel: "Issue",
    sourceUrl: "https://github.com/Toloka/toloka-kit/issues/57",
    account: "ZackPashkin"
  },
  {
    name: "Xilinx",
    login: "Xilinx",
    avatarUrl: "https://avatars.githubusercontent.com/u/3189299?s=96&v=4",
    repo: "Xilinx/brevitas",
    contribution: "Reported a tutorial failure in Brevitas quantization examples.",
    evidenceLabel: "Issue",
    sourceUrl: "https://github.com/Xilinx/brevitas/issues/304",
    account: "ZackPashkin"
  },
  {
    name: "PyTorch",
    login: "pytorch",
    avatarUrl: "https://avatars.githubusercontent.com/u/21003710?s=96&v=4",
    repo: "pytorch/pytorch",
    contribution: "Participated in debugging a torch.load compatibility issue.",
    evidenceLabel: "Issue comment",
    sourceUrl: "https://github.com/pytorch/pytorch/issues/25214",
    account: "ZackPashkin"
  },
  {
    name: "Keras",
    login: "keras-team",
    avatarUrl: "https://avatars.githubusercontent.com/u/34455048?s=96&v=4",
    repo: "keras-team/keras-io",
    contribution: "Updated dependencies for a public Keras documentation example.",
    evidenceLabel: "Merged PR",
    sourceUrl: "https://github.com/keras-team/keras-io/pull/520",
    account: "ZackPashkin"
  },
  {
    name: "Flutter",
    login: "flutter",
    avatarUrl: "https://avatars.githubusercontent.com/u/14101776?s=96&v=4",
    repo: "flutter/flutter",
    contribution: "Reported Flutter Gallery and plugin build breakages.",
    evidenceLabel: "Issue",
    sourceUrl: "https://github.com/flutter/flutter/issues/25916",
    account: "ZackPashkin"
  },
  {
    name: "TensorFlow",
    login: "tensorflow",
    avatarUrl: "https://avatars.githubusercontent.com/u/15658638?s=96&v=4",
    repo: "tensorflow/tensorflow",
    contribution: "Reported TensorFlow Lite converter documentation/runtime issues.",
    evidenceLabel: "Issue",
    sourceUrl: "https://github.com/tensorflow/tensorflow/issues/33502",
    account: "ZackPashkin"
  },
  {
    name: "AppTree Software",
    login: "apptreesoftware",
    avatarUrl: "https://avatars.githubusercontent.com/u/22401895?s=96&v=4",
    repo: "apptreesoftware/flutter_google_map_view",
    contribution: "Reported a nullable map receiver crash in the Flutter map view plugin.",
    evidenceLabel: "Issue",
    sourceUrl: "https://github.com/apptreesoftware/flutter_google_map_view/issues/136",
    account: "ZackPashkin"
  },
  {
    name: "Google Colab",
    login: "googlecolab",
    avatarUrl: "https://avatars.githubusercontent.com/u/33467679?s=96&v=4",
    repo: "googlecolab/colabtools",
    contribution: "Reported a Colab browser failure case.",
    evidenceLabel: "Issue",
    sourceUrl: "https://github.com/googlecolab/colabtools/issues/528",
    account: "ZackPashkin"
  },
  {
    name: "Apple",
    login: "apple",
    avatarUrl: "https://avatars.githubusercontent.com/u/10639145?s=96&v=4",
    repo: "apple/coremltools",
    contribution: "Reported Core ML Tools operation support gaps.",
    evidenceLabel: "Issue",
    sourceUrl: "https://github.com/apple/coremltools/issues/2085",
    account: "zack-dev-cm"
  }
];

export const KEY_HIGHLIGHTS: string[] = [
  "Senior ML Engineer in Riverstart's R&D ML team, developing document AI and engineering-analysis systems.",
  "Shipped mobile and cloud computer vision at Carb Manager and built core document-recognition models at CFT.",
  "Build and maintain an AI nutrition service and publish model profiling and optimization tooling."
];

export const TECH_STACK: string[] = [
  "Python", "PyTorch", "OpenCV", "ONNX Runtime", "FastAPI", "OpenAI APIs", "VLMs", "LLMs", "AI Agents", "Multimodal Retrieval", "RAG", "Qdrant", "ComfyUI", "Google Colab", "Evals", "TensorFlow", "Keras", "CLIP", "TypeScript", "React", "Cloudflare Workers", "Android", "iOS", "GCP", "AWS", "Docker", "Kubernetes", "ML Ops", "TensorRT", "TFLite", "CoreML", "ONNX/OpenVino"
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
    slug: "gstack-review-stack",
    displayName: "GStack Review Stack",
    downloads: 2656,
    versions: 3,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/gstack-review-stack",
    checkedAt: "2026-08-06"
  },
  {
    slug: "data-science-cv-repro-lab",
    displayName: "Data Science CV Repro Reviewer",
    downloads: 1145,
    versions: 12,
    stars: 1,
    url: "https://clawhub.ai/zack-dev-cm/data-science-cv-repro-lab",
    checkedAt: "2026-08-06"
  },
  {
    slug: "agentic-codex-dev",
    displayName: "Agentic Codex Dev Reviewer",
    downloads: 1076,
    versions: 13,
    stars: 2,
    url: "https://clawhub.ai/zack-dev-cm/agentic-codex-dev",
    checkedAt: "2026-08-06"
  },
  {
    slug: "openclaw-cws-publisher",
    displayName: "OpenClaw CWS Publisher",
    downloads: 1016,
    versions: 14,
    stars: 3,
    url: "https://clawhub.ai/zack-dev-cm/openclaw-cws-publisher",
    checkedAt: "2026-08-06"
  },
  {
    slug: "github-clawhub-launcher",
    displayName: "GitHub ClawHub Release Reviewer",
    downloads: 964,
    versions: 9,
    stars: 2,
    url: "https://clawhub.ai/zack-dev-cm/github-clawhub-launcher",
    checkedAt: "2026-08-06"
  },
  {
    slug: "sota-agent",
    displayName: "SOTA Agent",
    downloads: 957,
    versions: 12,
    stars: 2,
    url: "https://clawhub.ai/zack-dev-cm/sota-agent",
    checkedAt: "2026-08-06"
  },
  {
    slug: "doubt-driven-development",
    displayName: "Doubt Driven Development",
    downloads: 915,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/doubt-driven-development",
    checkedAt: "2026-08-06"
  },
  {
    slug: "youtube-creator-ops",
    displayName: "OpenClaw YouTube Publisher",
    downloads: 850,
    versions: 13,
    stars: 2,
    url: "https://clawhub.ai/zack-dev-cm/youtube-creator-ops",
    checkedAt: "2026-08-06"
  },
  {
    slug: "artifact-deck",
    displayName: "Artifact Deck",
    downloads: 829,
    versions: 7,
    stars: 1,
    url: "https://clawhub.ai/zack-dev-cm/artifact-deck",
    checkedAt: "2026-08-06"
  },
  {
    slug: "openclaw-agent-chinese-laoshi",
    displayName: "OpenClaw Chinese Laoshi Ops",
    downloads: 805,
    versions: 7,
    stars: 1,
    url: "https://clawhub.ai/zack-dev-cm/openclaw-agent-chinese-laoshi",
    checkedAt: "2026-08-06"
  },
  {
    slug: "imagegen",
    displayName: "Image Gen",
    downloads: 786,
    versions: 2,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/imagegen",
    checkedAt: "2026-08-06"
  },
  {
    slug: "browser-proof",
    displayName: "Browser QA Report Pack",
    downloads: 784,
    versions: 6,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/browser-proof",
    checkedAt: "2026-08-06"
  },
  {
    slug: "hh-openclaw-agent",
    displayName: "HH OpenClaw Agent",
    downloads: 775,
    versions: 8,
    stars: 1,
    url: "https://clawhub.ai/zack-dev-cm/hh-openclaw-agent",
    checkedAt: "2026-08-06"
  },
  {
    slug: "artifact-redactor",
    displayName: "Artifact Redactor",
    downloads: 771,
    versions: 8,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/artifact-redactor",
    checkedAt: "2026-08-06"
  },
  {
    slug: "public-surface-review",
    displayName: "Publish Guard",
    downloads: 752,
    versions: 6,
    stars: 1,
    url: "https://clawhub.ai/zack-dev-cm/public-surface-review",
    checkedAt: "2026-08-06"
  },
  {
    slug: "telegram-miniapp-security-auditor",
    displayName: "Telegram Mini App Security Auditor",
    downloads: 743,
    versions: 4,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/telegram-miniapp-security-auditor",
    checkedAt: "2026-08-06"
  },
  {
    slug: "hh-openclaw-proposal-submitter",
    displayName: "HH Application Packet Reviewer",
    downloads: 688,
    versions: 4,
    stars: 1,
    url: "https://clawhub.ai/zack-dev-cm/hh-openclaw-proposal-submitter",
    checkedAt: "2026-08-06"
  },
  {
    slug: "agentic-video-production-publisher",
    displayName: "Agentic Video Production Reviewer",
    downloads: 665,
    versions: 4,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/agentic-video-production-publisher",
    checkedAt: "2026-08-06"
  },
  {
    slug: "affiliate-video-campaign-operator",
    displayName: "Affiliate Video Campaign Reviewer",
    downloads: 661,
    versions: 9,
    stars: 1,
    url: "https://clawhub.ai/zack-dev-cm/affiliate-video-campaign-operator",
    checkedAt: "2026-08-06"
  },
  {
    slug: "youtube-openclaw-creator",
    displayName: "YouTube Publish Reviewer",
    downloads: 657,
    versions: 4,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/youtube-openclaw-creator",
    checkedAt: "2026-08-06"
  },
  {
    slug: "avito-outreach-manager",
    displayName: "Avito Message QA Reviewer",
    downloads: 644,
    versions: 4,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/avito-outreach-manager",
    checkedAt: "2026-08-06"
  },
  {
    slug: "meshmcp-remotescreen",
    displayName: "Screen Support Review Planner",
    downloads: 635,
    versions: 6,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/meshmcp-remotescreen",
    checkedAt: "2026-08-06"
  },
  {
    slug: "random-coffee-best-fit-outreach",
    displayName: "Random Coffee Outreach",
    downloads: 626,
    versions: 5,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/random-coffee-best-fit-outreach",
    checkedAt: "2026-08-06"
  },
  {
    slug: "agentmemory-adapter",
    displayName: "AgentMemory Adapter",
    downloads: 602,
    versions: 4,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/agentmemory-adapter",
    checkedAt: "2026-08-06"
  },
  {
    slug: "skool-growth-teardown-poster",
    displayName: "Skool Growth Teardown Poster",
    downloads: 600,
    versions: 2,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/skool-growth-teardown-poster",
    checkedAt: "2026-08-06"
  },
  {
    slug: "meshmcp-offline-chat",
    displayName: "Offline Message Test Planner",
    downloads: 577,
    versions: 2,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/meshmcp-offline-chat",
    checkedAt: "2026-08-06"
  },
  {
    slug: "ai-video-scene-director",
    displayName: "AI Video Scene Director",
    downloads: 574,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/ai-video-scene-director",
    checkedAt: "2026-08-06"
  },
  {
    slug: "skill-sprint-pack-builder",
    displayName: "Skill Sprint Pack Builder",
    downloads: 574,
    versions: 2,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/skill-sprint-pack-builder",
    checkedAt: "2026-08-06"
  },
  {
    slug: "chrome-extension-studio",
    displayName: "Chrome Extension Studio",
    downloads: 572,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/chrome-extension-studio",
    checkedAt: "2026-08-06"
  },
  {
    slug: "x-algo-claim-auditor",
    displayName: "X Algo Claim Reviewer",
    downloads: 568,
    versions: 3,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/x-algo-claim-auditor",
    checkedAt: "2026-08-06"
  },
  {
    slug: "spec-plan-build-review",
    displayName: "Spec Plan Build Review",
    downloads: 566,
    versions: 2,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/spec-plan-build-review",
    checkedAt: "2026-08-06"
  },
  {
    slug: "community-topic-scout",
    displayName: "Community Topic Scout",
    downloads: 561,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/community-topic-scout",
    checkedAt: "2026-08-06"
  },
  {
    slug: "open-feed-recsys-lab",
    displayName: "Open Feed Recsys Reviewer",
    downloads: 558,
    versions: 5,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/open-feed-recsys-lab",
    checkedAt: "2026-08-06"
  },
  {
    slug: "trusted-clawhub-install-gate",
    displayName: "Trusted ClawHub Install Gate",
    downloads: 552,
    versions: 3,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/trusted-clawhub-install-gate",
    checkedAt: "2026-08-06"
  },
  {
    slug: "research-claim-ledger",
    displayName: "Research Claim Ledger",
    downloads: 550,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/research-claim-ledger",
    checkedAt: "2026-08-06"
  },
  {
    slug: "affiliate-ugc-test-planner",
    displayName: "Affiliate UGC Test Planner",
    downloads: 548,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/affiliate-ugc-test-planner",
    checkedAt: "2026-08-06"
  },
  {
    slug: "skool-member-activation-concierge",
    displayName: "Skool Member Activation Concierge",
    downloads: 535,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/skool-member-activation-concierge",
    checkedAt: "2026-08-06"
  },
  {
    slug: "skill-package-doctor",
    displayName: "Skill Package Doctor",
    downloads: 520,
    versions: 2,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/skill-package-doctor",
    checkedAt: "2026-08-06"
  },
  {
    slug: "proof-card-forge",
    displayName: "Signal Card Forge",
    downloads: 516,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/proof-card-forge",
    checkedAt: "2026-08-06"
  },
  {
    slug: "skill-install-bridge",
    displayName: "Skill Install Bridge",
    downloads: 511,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/skill-install-bridge",
    checkedAt: "2026-08-06"
  },
  {
    slug: "interactive-doc-mapper",
    displayName: "Interactive Doc Mapper",
    downloads: 506,
    versions: 2,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/interactive-doc-mapper",
    checkedAt: "2026-08-06"
  },
  {
    slug: "skool-discovery-page-optimizer",
    displayName: "Skool Discovery Page Optimizer",
    downloads: 504,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/skool-discovery-page-optimizer",
    checkedAt: "2026-08-06"
  },
  {
    slug: "codex-claude-clawhub-skill-bridge",
    displayName: "Codex Claude ClawHub Skill Bridge",
    downloads: 503,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/codex-claude-clawhub-skill-bridge",
    checkedAt: "2026-08-06"
  },
  {
    slug: "skool-trust-ladder-builder",
    displayName: "Skool Trust Ladder Builder",
    downloads: 501,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/skool-trust-ladder-builder",
    checkedAt: "2026-08-06"
  },
  {
    slug: "skool-challenge-launcher",
    displayName: "Skool Challenge Launcher",
    downloads: 498,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/skool-challenge-launcher",
    checkedAt: "2026-08-06"
  },
  {
    slug: "stowecraft-artisan-concierge",
    displayName: "StoweCraft Artisan Concierge",
    downloads: 495,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/stowecraft-artisan-concierge",
    checkedAt: "2026-08-06"
  },
  {
    slug: "tinytroupe-feed-research-lab",
    displayName: "TinyTroupe Feed Research Lab",
    downloads: 494,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/tinytroupe-feed-research-lab",
    checkedAt: "2026-08-06"
  },
  {
    slug: "product-share-trigger-reviewer",
    displayName: "Product Share Trigger Reviewer",
    downloads: 493,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/product-share-trigger-reviewer",
    checkedAt: "2026-08-06"
  },
  {
    slug: "using-agent-skills-router",
    displayName: "Using Agent Skills Router",
    downloads: 464,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/using-agent-skills-router",
    checkedAt: "2026-08-06"
  },
  {
    slug: "agent-skills-portability-auditor",
    displayName: "Agent Skills Portability Auditor",
    downloads: 453,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/agent-skills-portability-auditor",
    checkedAt: "2026-08-06"
  },
  {
    slug: "design-md-ui-designer",
    displayName: "DESIGN.md UI Designer",
    downloads: 420,
    versions: 2,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/design-md-ui-designer",
    checkedAt: "2026-08-06"
  },
  {
    slug: "unitree-hermes-colab",
    displayName: "Unitree Hermes Colab",
    downloads: 318,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/unitree-hermes-colab",
    checkedAt: "2026-08-06"
  },
  {
    slug: "chrome-extension-maintainer",
    displayName: "Chrome Extension Maintainer",
    downloads: 316,
    versions: 1,
    stars: 0,
    url: "https://clawhub.ai/zack-dev-cm/chrome-extension-maintainer",
    checkedAt: "2026-08-06"
  }
];

export const CHROME_EXTENSION_STATS: ChromeExtensionStatsSnapshot ={
  "publisherName": "kaisenaiko",
  "publisherUrl": "https://chromewebstore.google.com/search/kaisenaiko",
  "checkedAt": "2026-06-15",
  "sourceName": "Chrome Web Store detail pages and live developer dashboard",
  "sourceUrl": "https://chromewebstore.google.com/search/kaisenaiko?hl=en",
  "totalPublished": 18,
  "totalUsers": 253,
  "averageUsersPerExtension": 16.9,
  "averageRating": 5,
  "ratingCount": 4,
  "notes": [
    "Chrome Web Store publisher tracker kept 16 public listings for kaisenaiko on 2026-06-12; 13 known detail pages exposed visible user counts.",
    "Live Chrome Web Store Developer Dashboard proof on 2026-06-15 added Reforest Radar and Autograph Radar as published-public listings, bringing the tracked published count to 18.",
    "Chrome Web Store detail pages and dashboard proof showed 253 explicitly reported users across 15 displayed rows, 16.9 users per displayed row, and 5.00 average rating from 4 reported ratings on 2026-06-15.",
    "New listings without a visible public user count are listed as 0 with a dashboard-proof source instead of invented estimates. Chrome-Stats links remain secondary metadata and are not used for current counts."
  ],
  "extensions": [
    {
      "id": "ccikgbjalcbokaalidnfcjhhbhjoljfm",
      "name": "GitHub Repo Summarizer",
      "description": "Summarizes GitHub repository structure and README context for faster code review.",
      "users": 131,
      "usersSource": "Chrome Web Store detail page",
      "rating": 5,
      "ratingCount": 3,
      "version": "1.4.2",
      "lastUpdated": "2025-07-02",
      "createdAt": "2025-06-21",
      "category": "Developer Tools",
      "permissions": [
        "storage",
        "activeTab",
        "scripting",
        "downloads"
      ],
      "sizeKb": 63.09,
      "chromeStatsUrl": "https://chrome-stats.com/d/ccikgbjalcbokaalidnfcjhhbhjoljfm",
      "chromeWebStoreUrl": "https://chromewebstore.google.com/detail/github-repo-summarizer/ccikgbjalcbokaalidnfcjhhbhjoljfm?hl=en",
      "productUrl": "https://zack-dev-cm.github.io/github-repo-sum.github.io/",
      "dataIngestedAt": "2026-06-12"
    },
    {
      "id": "jnoonpeekddinkiecaonhocaflcgbhap",
      "name": "AI Chat Navigator",
      "description": "Seamlessly jump, refine, and sync prompts across AI chat tools.",
      "users": 78,
      "usersSource": "Chrome Web Store detail page",
      "rating": 5,
      "ratingCount": 1,
      "version": "4.1.0",
      "lastUpdated": "2025-07-25",
      "createdAt": "2025-07-20",
      "category": "Workflow & Planning",
      "permissions": [
        "storage"
      ],
      "sizeKb": 126,
      "chromeStatsUrl": "https://chrome-stats.com/d/jnoonpeekddinkiecaonhocaflcgbhap",
      "chromeWebStoreUrl": "https://chromewebstore.google.com/detail/ai-chat-navigator/jnoonpeekddinkiecaonhocaflcgbhap?hl=en",
      "dataIngestedAt": "2026-06-12"
    },
    {
      "id": "djpopfjjomcablecmpeebmbccidcipkb",
      "name": "Reforest Radar",
      "description": "Fill one green square on a real forest map in your new tab.",
      "users": 0,
      "usersSource": "Chrome Web Store Developer Dashboard live proof; no visible public user count yet",
      "version": "0.1.1",
      "lastUpdated": "2026-06-15",
      "createdAt": "2026-06-15",
      "category": "Education",
      "permissions": [
        "storage"
      ],
      "chromeWebStoreUrl": "https://chromewebstore.google.com/detail/reforest-radar/djpopfjjomcablecmpeebmbccidcipkb?hl=en",
      "productUrl": "https://getgeofix.xyz/",
      "dataIngestedAt": "2026-06-15",
      "rating": 0,
      "ratingCount": 0
    },
    {
      "id": "fcohhalbijjnondfpodngkdogmkijjfa",
      "name": "Autograph Radar",
      "description": "Check whether a verified autograph source exists for the star you are viewing.",
      "users": 0,
      "usersSource": "Chrome Web Store Developer Dashboard live proof; no visible public user count yet",
      "version": "0.1.0",
      "lastUpdated": "2026-06-15",
      "createdAt": "2026-06-15",
      "category": "Shopping",
      "permissions": [
        "activeTab",
        "contextMenus",
        "storage"
      ],
      "chromeWebStoreUrl": "https://chromewebstore.google.com/detail/autograph-radar/fcohhalbijjnondfpodngkdogmkijjfa?hl=en",
      "productUrl": "https://getgeofix.xyz/",
      "dataIngestedAt": "2026-06-15",
      "rating": 0,
      "ratingCount": 0
    },
    {
      "id": "dejokbjghdjlhhlddflgolheejdmbgea",
      "name": "Tab Time Machine",
      "description": "Applies reversible web-era visual filters and optional Internet Archive shortcuts to the current tab.",
      "users": 13,
      "usersSource": "Chrome Web Store detail page",
      "version": "0.1.7",
      "lastUpdated": "2026-06-09",
      "createdAt": "2026-05-30",
      "category": "Just for Fun",
      "sizeKb": 29.5,
      "chromeStatsUrl": "https://chrome-stats.com/d/dejokbjghdjlhhlddflgolheejdmbgea",
      "chromeWebStoreUrl": "https://chromewebstore.google.com/detail/tab-time-machine/dejokbjghdjlhhlddflgolheejdmbgea?hl=en",
      "productUrl": "https://getgeofix.xyz/",
      "dataIngestedAt": "2026-06-12",
      "rating": 0,
      "ratingCount": 0
    },
    {
      "id": "egjcdmlfdnkpgkmffkhfdooacmglnjbc",
      "name": "Web2CSV - Table & List Extractor",
      "description": "Extracts visible tables, lists, and repeated cards into CSV, JSON, Markdown, and SourcePack files.",
      "users": 3,
      "usersSource": "Chrome Web Store detail page",
      "version": "0.1.0",
      "lastUpdated": "2026-05-02",
      "category": "Tools",
      "sizeKb": 65.47,
      "chromeWebStoreUrl": "https://chromewebstore.google.com/detail/web2csv-table-list-extrac/egjcdmlfdnkpgkmffkhfdooacmglnjbc?hl=en",
      "dataIngestedAt": "2026-06-12",
      "rating": 0,
      "ratingCount": 0
    },
    {
      "id": "lacnenopgbimijabjaadkgeoldoogein",
      "name": "GTA 6 Countdown",
      "description": "Simple unofficial countdown to the announced GTA VI release date.",
      "users": 9,
      "usersSource": "Chrome Web Store detail page",
      "version": "0.1.1",
      "lastUpdated": "2026-05-28",
      "category": "Just for Fun",
      "sizeKb": 44.76,
      "chromeWebStoreUrl": "https://chromewebstore.google.com/detail/gta-6-countdown/lacnenopgbimijabjaadkgeoldoogein?hl=en",
      "dataIngestedAt": "2026-06-12",
      "rating": 0,
      "ratingCount": 0
    },
    {
      "id": "hlbflaklicefinhckdkbamhhkfklmgao",
      "name": "SourcePack Hub - Local AI Research Library",
      "description": "Saves and exports local AI research source packs from the current page.",
      "users": 3,
      "usersSource": "Chrome Web Store detail page",
      "version": "0.1.0",
      "lastUpdated": "2026-05-02",
      "category": "Workflow & Planning",
      "sizeKb": 65.36,
      "chromeWebStoreUrl": "https://chromewebstore.google.com/detail/sourcepack-hub-local-ai-r/hlbflaklicefinhckdkbamhhkfklmgao?hl=en",
      "dataIngestedAt": "2026-06-12",
      "rating": 0,
      "ratingCount": 0
    },
    {
      "id": "dlhhfacpkohmojegdpmmnmoapcpphfbh",
      "name": "Browser Run Receipt",
      "description": "Captures manual browser-work steps, redacts details, and exports a local run receipt.",
      "users": 3,
      "usersSource": "Chrome Web Store detail page",
      "version": "0.1.0",
      "lastUpdated": "2026-05-13",
      "category": "Workflow & Planning",
      "sizeKb": 39.71,
      "chromeWebStoreUrl": "https://chromewebstore.google.com/detail/browser-run-receipt/dlhhfacpkohmojegdpmmnmoapcpphfbh?hl=en",
      "dataIngestedAt": "2026-06-12",
      "rating": 0,
      "ratingCount": 0
    },
    {
      "id": "glcecbjpdknkmlpcbnbpikjjclboeglo",
      "name": "LocalArchive",
      "description": "Local-first reader archive for pages, selections, Pocket imports, and portable Markdown/HTML/JSON exports.",
      "users": 2,
      "usersSource": "Chrome Web Store detail page",
      "version": "0.1.1",
      "lastUpdated": "2026-04-22",
      "createdAt": "2026-04-23",
      "category": "Tools",
      "permissions": [
        "storage",
        "activeTab",
        "scripting",
        "downloads"
      ],
      "sizeKb": 18.41,
      "chromeStatsUrl": "https://chrome-stats.com/d/glcecbjpdknkmlpcbnbpikjjclboeglo",
      "chromeWebStoreUrl": "https://chromewebstore.google.com/detail/localarchive/glcecbjpdknkmlpcbnbpikjjclboeglo?hl=en",
      "productUrl": "https://localarchive.pages.dev/",
      "dataIngestedAt": "2026-06-12",
      "rating": 0,
      "ratingCount": 0
    },
    {
      "id": "pmofpiclpglbdnjgkgijlolefiojjomn",
      "name": "ChatArchive - ChatGPT Exporter",
      "description": "Exports ChatGPT conversations to local Markdown, JSON, CSV, and SourcePack files.",
      "users": 2,
      "usersSource": "Chrome Web Store detail page",
      "version": "0.1.0",
      "lastUpdated": "2026-05-04",
      "category": "Workflow & Planning",
      "sizeKb": 65.36,
      "chromeWebStoreUrl": "https://chromewebstore.google.com/detail/chatarchive-chatgpt-expor/pmofpiclpglbdnjgkgijlolefiojjomn?hl=en",
      "dataIngestedAt": "2026-06-12",
      "rating": 0,
      "ratingCount": 0
    },
    {
      "id": "kpjokdophleoefolidphajjllaaddnpj",
      "name": "Evidence Pack Capture",
      "description": "Captures a visible tab, redacts sensitive details locally, and exports a support-ready evidence packet.",
      "users": 2,
      "usersSource": "Chrome Web Store detail page",
      "version": "0.1.0",
      "lastUpdated": "2026-05-13",
      "category": "Workflow & Planning",
      "sizeKb": 40.67,
      "chromeWebStoreUrl": "https://chromewebstore.google.com/detail/evidence-pack-capture/kpjokdophleoefolidphajjllaaddnpj?hl=en",
      "dataIngestedAt": "2026-06-12",
      "rating": 0,
      "ratingCount": 0
    },
    {
      "id": "hoklaadapaobdbkeiacebnnciponcmnf",
      "name": "Session Rescue",
      "description": "Saves local browser session snapshots, restores tabs, and exports portable backups.",
      "users": 4,
      "usersSource": "Chrome Web Store detail page",
      "version": "0.1.5",
      "lastUpdated": "2026-06-11",
      "category": "Workflow & Planning",
      "sizeKb": 19.32,
      "chromeWebStoreUrl": "https://chromewebstore.google.com/detail/session-rescue/hoklaadapaobdbkeiacebnnciponcmnf?hl=en",
      "productUrl": "https://session-rescue.pages.dev/",
      "dataIngestedAt": "2026-06-12",
      "rating": 0,
      "ratingCount": 0
    },
    {
      "id": "dphlhifhafonbolljmdlpecpcicnpjen",
      "name": "Skool Discovery Positioning Lens",
      "description": "Audits public Skool positioning with local benchmarks and optional Chrome built-in AI critique.",
      "users": 2,
      "usersSource": "Chrome Web Store detail page",
      "version": "0.1.1",
      "lastUpdated": "2026-05-14",
      "category": "Workflow & Planning",
      "sizeKb": 21.96,
      "chromeWebStoreUrl": "https://chromewebstore.google.com/detail/skool-discovery-positioni/dphlhifhafonbolljmdlpecpcicnpjen?hl=en",
      "dataIngestedAt": "2026-06-12",
      "rating": 0,
      "ratingCount": 0
    },
    {
      "id": "hjfdpklldhofiehpcfcfdonjppdkmgoh",
      "name": "Video2Source - YouTube Transcript Exporter",
      "description": "Saves visible YouTube transcript text, timestamps, and notes as local source pack files.",
      "users": 1,
      "usersSource": "Chrome Web Store detail page",
      "version": "0.1.0",
      "lastUpdated": "2026-05-02",
      "category": "Workflow & Planning",
      "sizeKb": 65.08,
      "chromeWebStoreUrl": "https://chromewebstore.google.com/detail/video2source-youtube-tran/hjfdpklldhofiehpcfcfdonjppdkmgoh?hl=en",
      "dataIngestedAt": "2026-06-12",
      "rating": 0,
      "ratingCount": 0
    }
  ]
};

export const LATEST_UPDATES: LatestUpdate[] = [
  {
    title: "Document AI and engineering R&D",
    description: "Current work in Riverstart's R&D ML team: document assistants, engineering-drawing analysis and construction-document interpretation with source-linked specialist review.",
    links: [
      { text: "Document AI", url: "https://zack-dev-cm.github.io/projects/riverstart-document-ai/" },
      { text: "Engineering analysis", url: "https://zack-dev-cm.github.io/projects/engineering-drawing-cad-analysis/" },
      { text: "Construction documents", url: "https://zack-dev-cm.github.io/projects/construction-document-intelligence/" }
    ],
    projectId: 101,
    createdAt: "2026-09-05"
  },
  {
    title: "CV and AI Project Coverage Added",
    description: "Case studies in visual classification, architectural plan and catalog matching, InQuest document agents, and generative prototype work.",
    links: [
      { text: "Open jaw and face-type classifier", url: "https://zack-dev-cm.github.io/projects/jaw-and-face-type-classifier-for-aesthetic-review/" },
      { text: "Open architectural plan matcher", url: "https://zack-dev-cm.github.io/projects/architectural-drawing-and-interior-catalog-matching/" },
      { text: "Open InQuest binder QA", url: "https://zack-dev-cm.github.io/projects/inquest-project-binder-rag-qa/" },
      { text: "Open ComfyUI prototype lab", url: "https://zack-dev-cm.github.io/projects/comfyui-and-colab-generative-prototype-lab/" }
    ],
    projectId: 76,
    createdAt: "2026-06-04"
  },
  {
    title: "Agnitra - ML Profiling & Optimization",
    description: "A Python SDK and CLI published on PyPI for profiling model runtime, comparing baselines and evaluating inference optimizations.",
    links: [
      { text: "Open case study", url: "https://zack-dev-cm.github.io/projects/agnitra-ml-profiling-optimization/" },
      { text: "Open PyPI package", url: "https://pypi.org/project/agnitra/" }
    ],
    projectId: 81,
    createdAt: "2026-06-09"
  },
  {
    title: "ClearML Experiment Tracking for Dermaself",
    description: "Added Dermaself MLOps case study: ClearML experiment tracking for skin-analysis model runs, dataset hygiene, metric review, and promotion gates.",
    links: [
      { text: "Open case study", url: "https://zack-dev-cm.github.io/projects/clearml-experiment-tracking-for-dermaself/" }
    ],
    projectId: 80,
    createdAt: "2026-06-09"
  },
  {
    title: "Calorio - Maintained AI Nutrition Service",
    description: "Build and maintain Calorio for photo, voice and text meal logging, nutrition summaries and ongoing technical support.",
    links: [
      { text: "Open Calorio case study", url: "https://zack-dev-cm.github.io/projects/dishes-recognition-nutrition-goals-telegram-bot/" },
      { text: "Try Calorio on Telegram", url: "https://t.me/calorio_yf_bot" }
    ],
    projectId: 11,
    createdAt: "2026-06-03"
  },
  {
    title: "Research Claim Ledger Skill Added",
    description: "New ClawHub skill-build case study: a narrow research claim ledger that turns drafts, literature matrices, source packets, or reviewer notes into support-status receipts without pretending to be a full academic research suite.",
    links: [
      { text: "Open case study", url: "https://zack-dev-cm.github.io/projects/research-claim-ledger/" },
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/research-claim-ledger" }
    ],
    projectId: 75,
    createdAt: "2026-05-22"
  },
  {
    title: "Public CV/DL Archive Added",
    description: "Added GitHub API-backed CV/DL archive cards for YOLO/EfficientNet, Cyrillic OCR, ML Kit face contours, TFLite glasses, vision-transformer notebooks, and Colab-style prototypes, using only authored GitHub repos and generated case studies.",
    links: [
      { text: "Open public CV/DL archive", url: "https://zack-dev-cm.github.io/projects/public-cv-and-deep-learning-github-archive/" },
      { text: "Open notebook prototype archive", url: "https://zack-dev-cm.github.io/projects/colab-cv-dl-prototype-archive/" },
      { text: "Open video search case study", url: "https://zack-dev-cm.github.io/projects/multimodal-video-search-platform/" }
    ],
    projectId: 73,
    createdAt: "2026-05-14"
  },
  {
    title: "Computer Vision and AI Systems Refresh",
    description: "Added public-safe case studies for OCR serving, multimodal video search, and skin-texture segmentation, with Mermaid diagrams and architecture-first references.",
    links: [
      { text: "Open OCR case study", url: "https://zack-dev-cm.github.io/projects/fast-ocr-onnx-inference-server/" },
      { text: "Open video search case study", url: "https://zack-dev-cm.github.io/projects/multimodal-video-search-platform/" },
      { text: "Open segmentation case study", url: "https://zack-dev-cm.github.io/projects/full-face-wrinkle-and-skin-texture-segmentation-lab/" }
    ],
    projectId: 72,
    createdAt: "2026-05-14"
  },
  {
    title: "Marketplace Stats Refresh",
    description: "Updated the public ClawHub tracker to 35,849 downloads across 53 public skills on 2026-08-06 and refreshed the Chrome Web Store snapshot to 253 visible reported users across 18 current listings / 15 displayed rows from 2026-06-15.",
    links: [
      { text: "Open ClawHub tracker", url: "https://zack-dev-cm.github.io/#clawhub" },
      { text: "Open Chrome Web Store tracker", url: "https://zack-dev-cm.github.io/#chrome-stats" }
    ],
    projectId: 53,
    createdAt: "2026-05-28"
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
      { text: "Open case study", url: "https://zack-dev-cm.github.io/projects/trusted-clawhub-install-gate/" }
    ],
    projectId: 69,
    createdAt: "2026-05-07"
  },
  {
    title: "Dermaself Flutter Skin Analysis App",
    description: "Updated mobile CV case study: Flutter/Firebase skin-analysis flow with guided capture, offline model runtime, ROI gates, and deployment-blocked fine-line QA notes.",
    links: [
      { text: "Open case study", url: "https://zack-dev-cm.github.io/projects/dermaself-flutter-skin-analysis-app/" }
    ],
    projectId: 63,
    createdAt: "2026-05-05"
  },
  {
    title: "Chrome Extension Studio Plugin",
    description: "New local developer-platform case study: a Codex plugin and script set for planning, designing, packaging, QA, and Chrome Web Store release cycles.",
    links: [
      { text: "Open case study", url: "https://zack-dev-cm.github.io/projects/chrome-extension-studio-plugin/" }
    ],
    projectId: 64,
    createdAt: "2026-04-18"
  },
  {
    title: "Google Drive File Provider Repair Toolkit",
    description: "New macOS operations case study: a conservative Drive File Provider diagnostic and repair toolkit with dry-run repair, sync inspection, and no data-deletion path.",
    links: [
      { text: "Open case study", url: "https://zack-dev-cm.github.io/projects/google-drive-file-provider-repair-toolkit/" }
    ],
    projectId: 65,
    createdAt: "2026-04-17"
  },
  {
    title: "CollectionsAI ChatGPT App",
    description: "New ChatGPT app case study: MCP tools and widgets for senior conservation workflows, portfolio planning, materials estimates, staffing, and voice-note structuring.",
    links: [
      { text: "Open case study", url: "https://zack-dev-cm.github.io/projects/collectionsai-chatgpt-app/" }
    ],
    projectId: 66,
    createdAt: "2026-03-04"
  },
  {
    title: "Senior Conservator OpenClaw Agent",
    description: "New autonomous-workflow case study: OpenClaw-driven conservation review with staged review gates, segmentation overlays, reports, voice output, and reproducibility manifests.",
    links: [
      { text: "Open case study", url: "https://zack-dev-cm.github.io/projects/senior-conservator-openclaw-agent/" }
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
    description: "New public OpenClaw release: a sanitized Chinese lesson-ops skill for generating checked lesson packets from source material.",
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
    description: "Published extension release: local summaries, simplification, translation, and safe-share cleanup using Chrome built-in AI with Chrome Web Store and GitHub records.",
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
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/probes-oss" }
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
    description: "New portfolio metrics dashboard: a CLI/reporting flow that tracks GitHub metadata, dated ClawHub listing snapshots, Chrome Web Store detail-page stats, deltas, and next optimization bets.",
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
    description: "HH OpenClaw Agent skill entry retained by name only.",
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/hh-openclaw-agent" },
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/hh-openclaw-agent" },
      { text: "Release v1.0.5", url: "https://github.com/zack-dev-cm/hh-openclaw-agent/releases/tag/v1.0.5" }
    ],
    projectId: 50
  },
  {
    title: "Browser QA Report Pack",
    description: "New open-source release: a small browser QA skill that turns screenshots, console notes, and step-by-step validation into one reproducible validation pack.",
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
    description: "New open-source release: a local-first CLI that catches unsupported claims, broken citations, weak source anchors, and draft markers in AI-written research drafts before they ship.",
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
    description: "Hands-on OpenClaw automation for Telegram mini app QA, launch verification, and trace-driven UI iterations.",
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
    "id": 104,
    "title": "LigninQC - Reproducible Scientific Research Workflows",
    searchProfile: {
      capabilities: ["scientific research","reproducibility","data analysis","source verification","sensitivity analysis"],
      evidence: "implementation"
    },
    "aliases": [
      "ligninqc",
      "lignin research",
      "scientific evidence workflows"
    ],
    "description": "Check a BDE–antioxidant association and reconcile sulfated-lignin thermal claims with the published tables. Rerun both cases offline.",
    "longDescription": "LigninQC connects two scientific questions to inspectable calculations: how state and normalization choices affect an antioxidant association, and whether selected thermal claims agree with a sulfated-lignin table. Version 1.0.0 includes two CC BY article cases, source locations, CSV inputs, Python code, tests and reports in one offline archive.",
    "projectKind": "research",
    "surfaceTags": [
      "research",
      "scientific-data",
      "reproducibility",
      "lignin-chemistry"
    ],
    "keyFeatures": [
      "Recalculate two documented article cases with source locators, units and explicit assumptions",
      "Run locally with Python 3.10 or later and its standard library, without accounts or API keys",
      "Inspect the computed results, source comparisons and limitations in a static HTML report",
      "Reuse the included code and permitted data under the licenses supplied with the package"
    ],
    "reproducibleWorkflow": {
      "requirements": "Python 3.10 or later; no pip installation or account required. After downloading, the included cases run offline using only the standard library. On Windows, use py -3 instead of python3.",
      "steps": [
        "Download and extract the release archive.",
        "Open a terminal in the directory containing the extracted folder.",
        "Run the two commands below, then open results/report.html in your browser."
      ],
      "command": "cd ligninqc-reanalysis-2026-09-05\npython3 -m ligninqc reproduce --out results\npython3 -m ligninqc verify",
      "expectedOutput": "The run writes results/report.html and results/results.json. To replace a previous nonempty results directory, add --force to the reproduce command. The archive includes version 1.0.0, source locators and the reference output."
    },
    "caseStudySections": [
      {
        "title": "Antioxidant association: what changes with the assumptions?",
        "body": "The Lauberte et al. (2019) case reanalyses published O–H bond dissociation energies and radical-deactivation values. It varies the reported molecular-state mapping, the included compounds and normalization by phenolic OH count. Missing observations remain missing. The report shows how these declared choices change the association; a difference from a rounded published correlation is not by itself evidence of a calculation error."
      },
      {
        "title": "Sulfated lignin: do the words and tables agree?",
        "body": "The Kazachenko et al. (2022) case checks selected thermal statements against the reported cumulative mass-loss table and describes the molecular-weight ratios. It preserves the distinction between a table/prose mismatch and an experimentally established error. Changes in GPC eluent, calibration, sulfation and purification limit what an apparent molecular-weight decrease can establish about bond cleavage."
      },
      {
        "title": "Scope of the results",
        "body": "This release reanalyses a selected subset of published data. It does not perform new quantum-chemical calculations, independently validate the underlying experiments, estimate field-wide error rates, or measure researcher productivity. Numerical agreement and software checks are reported separately from scientific interpretation."
      },
      {
        "title": "Access and reuse",
        "body": "Code is licensed under MIT. Original documentation and analysis are CC BY 4.0. The bundled articles and selected data are CC BY 4.0 with their authors and source locations retained. LICENSE and DATA-LICENSE.md explain these boundaries. No private corpus or account access is needed to run the included cases."
      }
    ],
    "links": [
      {
        "text": "Read the scientific report",
        "url": "https://zack-dev-cm.github.io/docs/ligninqc/2026-09-05/report.html"
      },
      {
        "text": "Download the offline package",
        "url": "https://zack-dev-cm.github.io/docs/ligninqc/2026-09-05/ligninqc-reanalysis-2026-09-05.zip"
      },
      {
        "text": "Verify the download",
        "url": "https://zack-dev-cm.github.io/docs/ligninqc/2026-09-05/SHA256SUMS"
      },
      {
        "text": "Inspect the source tables",
        "url": "https://zack-dev-cm.github.io/docs/ligninqc/2026-09-05/data/sources/source-extracts.html"
      },
      {
        "text": "Data: antioxidant model compounds (CSV)",
        "url": "https://zack-dev-cm.github.io/docs/ligninqc/2026-09-05/data/lauberte2019/table1.csv"
      },
      {
        "text": "Data: cumulative mass loss (CSV)",
        "url": "https://zack-dev-cm.github.io/docs/ligninqc/2026-09-05/data/kazachenko2022/table2.csv"
      },
      {
        "text": "Data: molecular weights (CSV)",
        "url": "https://zack-dev-cm.github.io/docs/ligninqc/2026-09-05/data/kazachenko2022/table1-gpc.csv"
      },
      {
        "text": "Lauberte et al. (2019): original article",
        "url": "https://doi.org/10.3390/molecules24091794"
      },
      {
        "text": "Kazachenko et al. (2022): original article",
        "url": "https://doi.org/10.3390/polym14153000"
      }
    ],
    "images": [
      {
        "url": "/docs/images/ligninqc-reanalysis-workflow.svg",
        "alt": "Included publication data flows through local Python calculations into a report that separates computed results from interpretation and limits",
        "caption": "Workflow of the included reanalysis. The illustration shows the data path; numerical results are in the linked report."
      }
    ],
    "createdAt": "2026-08-26",
    "techStack": [
      "Python 3.10+",
      "Standard library",
      "CSV",
      "JSON",
      "HTML"
    ],
    "thumbnail": "/docs/images/ligninqc-reanalysis-workflow.svg",
    "benchmarks": [
      {
        "label": "How closely does the reconstructed neutral-state BDE association fit DPPH values?",
        "value": "R² = 0.637 across 18 compounds",
        "context": "Calculated from rounded Table 1 values in Lauberte et al. (2019). This is one declared reconstruction; state mapping, exclusions and OH normalization are sensitivity analyses. It is not external predictive validation."
      },
      {
        "label": "Do the reported 800 °C thermal values agree with the prose?",
        "value": "Table: 61.9% initial, 76.6% sulfated mass loss",
        "context": "Kazachenko et al. (2022), Table 2. The prose reverses these two values. This is a source-internal inconsistency; the available table does not establish which statement reflects the raw experiment."
      }
    ]
  },
  {
    "id": 101,
    "title": "Riverstart Document AI",
    searchProfile: {
      capabilities: ["document ai","research","evaluation","information extraction","document recognition","retrieval augmented generation","agent workflows","deterministic validation"],
      evidence: "implementation"
    },
    "description": "R&D for source-linked specialist review: document extraction, deterministic checks and retrieval over reference material.",
    "longDescription": "As Senior ML Engineer in Riverstart's R&D ML team, I develop a document assistant for specialist review workflows. The R&D work evaluates local language models, hybrid retrieval and agent orchestration for document collections. My scope includes extraction contracts, retrieval design, deterministic reconciliation, evaluation and deployment controls. Results retain source citations and pass through expert review; the work is an R&D system with staged validation.",
    "keyFeatures": [
      "Hybrid retrieval over document and relationship indexes",
      "Structured extraction and deterministic reconciliation",
      "Source citations and expert review of generated results",
      "Versioned evaluations, observability and rollback"
    ],
    "techStack": [
      "Python",
      "LangGraph",
      "LangChain",
      "Pydantic",
      "Qdrant",
      "Neo4j",
      "Local LLMs",
      "FastAPI"
    ],
    "surfaceTags": [
      "ai-systems",
      "document-ai",
      "rag",
      "research"
    ],
    "createdAt": "2026-09-05",
    "projectKind": "research",
    "links": [],
    "mermaidDiagram": `flowchart LR
  Case["Case documents"] --> Facts["Structured facts + source references"]
  Facts --> Checks["Deterministic reconciliation"]
  Checks --> Review["Specialist review packet"]
  References["Reference material"] --> Retrieve["Hybrid retrieval"]
  Retrieve --> Answer["Grounded answer + citations"]`,
    "images": [
      {
        "url": "/docs/images/document-ai-verified-workflow.png",
        "alt": "Workflow diagram separating document extraction and deterministic case checks from reference retrieval and grounded answers",
        "caption": "Workflow diagram. Case checking and reference retrieval are distinct R&D paths."
      }
    ],
    "thumbnail": "/docs/images/document-ai-verified-workflow.png",
    "caseStudySections": [
      {
        "title": "Engineering decisions",
        "body": "Document extraction produces structured facts and source references for deterministic reconciliation and a specialist review packet. A separate retrieval path supplies reference passages for grounded answers. These paths have different contracts and evaluations; the diagram keeps them separate."
      },
      {
        "title": "Evaluation and current stage",
        "body": "The work is in staged R&D validation. My scope includes extraction contracts, retrieval experiments and versioned evaluations, with observability and rollback around deployment candidates. Source traceability and specialist review are part of acceptance."
      }
    ]
  },
  {
    "id": 102,
    "title": "Engineering Drawing & CAD Analysis",
    searchProfile: {
      capabilities: ["research","CAD","geometric computing","point cloud processing","drawing analysis","evaluation","reproducibility"],
      evidence: "implementation"
    },
    "description": "Research on turning point clouds into room models and 2D plans, alongside mechanical CAD projection and drawing analysis.",
    "longDescription": "My engineering-geometry work at Riverstart covers two distinct problems. The building prototype infers a room model from a point cloud and exports floor plans. The mechanical-part research evaluates scans against reference CAD and projects supplied STEP models into engineering views. The examples below show the actual data and geometry behind each track.",
    "keyFeatures": [
      "Infer axis-aligned room boundaries, walls and rectangular openings from XYZ point clouds",
      "Represent inferred geometry as a semantic room model and export 2D DXF/SVG floor plans",
      "Evaluate mechanical scan registration against supplied CAD references",
      "Generate visible and hidden 2D edges from STEP models using Open Cascade",
      "Preserve source geometry and outputs for comparison and engineering review"
    ],
    "techStack": [
      "Python",
      "Open Cascade",
      "CadQuery",
      "build123d",
      "NumPy",
      "SciPy",
      "IfcOpenShell",
      "ezdxf",
      "Geometry Processing"
    ],
    "surfaceTags": [
      "computer-vision",
      "ai-systems",
      "engineering",
      "research"
    ],
    "createdAt": "2026-09-05",
    "projectKind": "research",
    "links": [
      {
        "text": "Inspect the generated room floor plan (SVG)",
        "url": "https://zack-dev-cm.github.io/docs/artifacts/point-cloud-room-demo/floor-plan.svg"
      },
      {
        "text": "Inspect the inferred room geometry (JSON)",
        "url": "https://zack-dev-cm.github.io/docs/artifacts/point-cloud-room-demo/semantic-model.json"
      },
      {
        "text": "Download the synthetic point-cloud input (XYZ)",
        "url": "https://zack-dev-cm.github.io/docs/artifacts/point-cloud-room-demo/synthetic-room.xyz"
      },
      {
        "text": "Inspect the mechanical fixture projections (SVG)",
        "url": "https://zack-dev-cm.github.io/docs/images/cad-analytic-fixture-hlr-source.svg"
      }
    ],
    "images": [
      {
        "url": "/docs/images/point-cloud-room-workflow-v1.webp",
        "alt": "The same synthetic room shown as an XYZ point cloud, inferred 3D wall and opening geometry, and the exported 2D floor plan",
        "caption": "Building prototype: saved point-cloud input, a 3D rendering of the inferred semantic room model, and its actual SVG floor plan. This is one synthetic room test; the 3D view renders semantic JSON, not the experimental IFC export."
      },
      {
        "url": "/docs/images/point-cloud-room-model-v1.webp",
        "alt": "Detailed comparison of the synthetic room point cloud and inferred walls with a door and window at matching positions",
        "caption": "Building prototype, enlarged: the input points and inferred room geometry share the same coordinates and viewpoint. Transparency reveals the interior and openings."
      },
      {
        "url": "/docs/images/cad-analytic-fixture-source.webp",
        "alt": "Actual STEP rendering of a synthetic through-bore block, shown in an orthographic 3D view with millimeter axes",
        "caption": "Separate mechanical CAD track: a synthetic through-bore STEP fixture for projection and hidden-line tests. This solid is a supplied test input."
      },
      {
        "url": "/docs/images/cad-analytic-fixture-projections.webp",
        "alt": "XY and XZ projections of the same synthetic block, with solid visible edges and dashed hidden bore edges",
        "caption": "Mechanical CAD output: generated XY and XZ views of the same through-bore fixture, with visible edges in solid lines and hidden edges dashed."
      }
    ],
    "thumbnail": "/docs/images/point-cloud-room-workflow-v1.webp",
    "hideImages": false,
    "caseStudySections": [
      {
        "title": "Building point cloud → room model → floor plan",
        "body": "The building prototype reads XYZ or NumPy point clouds with declared units, estimates rectangular room bounds and detects door/window openings from gaps in the wall points. These are geometric methods; wall thickness is a declared input. A semantic model records the room, walls and openings, supplying both the 3D visualization and 2D floor-plan exports. The figures use a saved synthetic fixture, with its original point cloud, geometry JSON and SVG plan available below."
      },
      {
        "title": "Mechanical scans, reference CAD and engineering views",
        "body": "The mechanical track evaluates scan-to-reference registration separately from STEP-to-drawing projection. It compares Open Cascade, CadQuery and build123d routes, checks visible and hidden edges, and compares generated views with supplied drawings. The through-bore example below isolates the projection stage with known analytic geometry. A reference STEP used for registration is an input, not a model reconstructed from the scan."
      },
      {
        "title": "Current stage",
        "body": "The room workflow has passed a synthetic software-path test; real-building reconstruction still needs reference data and engineering acceptance. It currently assumes a single axis-aligned room. IFC export is experimental, with cross-format opening placement under review. Mechanical results establish registration and projection baselines; arbitrary scan-to-parametric CAD and manufacturing-ready drawing generation remain separate research goals."
      }
    ]
  },
  {
    "id": 103,
    "title": "Construction Document Intelligence",
    searchProfile: {
      capabilities: ["document ai","research","evaluation","document recognition","quantity calculation","deterministic validation"],
      evidence: "implementation"
    },
    "description": "Multi-document plan analysis that links structured quantities to source pages and preserves results for specialist review.",
    "longDescription": "I develop construction-document analysis as part of Riverstart R&D. The workflow processes related plan documents, records structured observations and connects calculations to their source pages. Saved analysis results and source references support repeatable specialist review. My contribution spans document processing, model orchestration, output contracts and evaluation.",
    "keyFeatures": [
      "Analyze related drawings as a complete document set",
      "Validate observations and units before calculating quantities",
      "Link quantities to source pages for checking",
      "Preserve analysis results and source references for repeatable review"
    ],
    "techStack": [
      "Python",
      "Document AI",
      "OCR",
      "Vision-language models",
      "Structured Outputs",
      "Evaluation"
    ],
    "surfaceTags": [
      "computer-vision",
      "ai-systems",
      "document-ai",
      "research"
    ],
    "createdAt": "2026-09-05",
    "projectKind": "research",
    "links": [],
    "images": [
      {
        "url": "/docs/images/construction-documents-workflow-v3.webp",
        "alt": "Conceptual illustration of architectural plan sheets, a selected building region and quantity extraction",
        "caption": "Conceptual illustration of plan interpretation and source-linked quantities; the drawings are invented."
      }
    ],
    "thumbnail": "/docs/images/construction-documents-workflow-v3.webp",
    "caseStudySections": [
      {
        "title": "Engineering decisions",
        "body": "I separate document observations, quantity calculations and specialist acceptance. Extracted facts retain their source page and location, while schema and unit checks run before deterministic calculation. Missing or unconfirmed dimensions block a quantity from being accepted."
      },
      {
        "title": "Review across a document set",
        "body": "The R&D workflow keeps related drawings, saved observations, source pages and open questions together for specialist review. Generated quantities still require source checks and expert acceptance."
      }
    ]
  },
  {
    id: 1,
    title: "Android Remote Control with VLM AI Agents",
    searchProfile: {
      capabilities: ["agent workflows","computer vision","mobile automation"],
      evidence: "summary"
    },
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
    searchProfile: {
      capabilities: ["agent interaction","audio processing"],
      evidence: "summary"
    },
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
    searchProfile: {
      capabilities: ["image generation", "generative ai", "virtual try on", "AR"],
      evidence: "summary"
    },
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
    searchProfile: {
      capabilities: ["computer vision","trajectory estimation"],
      evidence: "summary"
    },
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
    searchProfile: {
      capabilities: ["computer vision","image segmentation"],
      evidence: "summary"
    },
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
    searchProfile: {
      capabilities: ["computer vision","mobile inference","text recognition","nutrition label OCR"],
      evidence: "summary"
    },
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
    "id": 11,
    "title": "Calorio - AI Nutrition Service",
    searchProfile: {
      capabilities: ["maintained service","multimodal applications","food recognition","speech recognition","service deployment","operations"],
      evidence: "implementation"
    },
    "legacySlugs": [
      "dishes-recognition-nutrition-goals-telegram-bot"
    ],
    "aliases": [
      "calorio",
      "kalorio",
      "nutrition bot",
      "yourfit"
    ],
    "description": "A maintained Telegram service that helps people keep a food diary with meal photos, voice messages and text.",
    "longDescription": "Calorio is an AI nutrition assistant associated with YourFit. I built and maintain its multimodal meal-logging workflows, nutrition summaries, diary and goal tracking. The engineering work spans image and speech interpretation, structured food records, Telegram delivery, deployment and ongoing technical support. A beta Mini App provides a companion diary and profile interface.",
    "projectKind": "user-product",
    "surfaceTags": [
      "telegram",
      "mobile",
      "multimodal",
      "maintained-service"
    ],
    "mobileReady": true,
    "keyFeatures": [
      "Log meals through photos, voice messages or text in Telegram",
      "Turn recognition results into food-diary entries and nutrition summaries",
      "Track nutrition goals through the bot and companion diary interface",
      "Maintain deployment, service reliability and technical support"
    ],
    "techStack": [
      "Python",
      "FastAPI",
      "Telegram Bot API",
      "Vision-language models",
      "Speech-to-text",
      "SQLite",
      "Telegram Mini Apps"
    ],
    "links": [
      {
        "text": "Try Calorio on Telegram",
        "url": "https://t.me/calorio_yf_bot"
      }
    ],
    "images": [
      {
        "url": "/docs/images/calorio-workflow-v3.webp",
        "alt": "Conceptual illustration of meal photos, voice and text feeding a personal food diary",
        "caption": "Conceptual illustration of multimodal meal logging; this is not a Calorio interface screenshot."
      }
    ],
    "thumbnail": "/docs/images/calorio-workflow-v3.webp",
    "canonicalLinks": {
      "telegramBot": "https://t.me/calorio_yf_bot"
    }
  },

  {
    id: 12,
    title: "Python Library: AutoToloka",
    searchProfile: {
      capabilities: ["machine learning","computer vision","interactive segmentation","dataset annotation"],
      evidence: "summary"
    },
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
    searchProfile: {
      capabilities: ["machine learning","computer vision","text recognition","handwriting recognition","OCR"],
      evidence: "summary"
    },
    description: "Handwriting-focused OCR with line/character segmentation.",
    longDescription: "OCR library tuned for handwriting scans with stable line and character separation for noisy documents.",
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
      { label: "Public Chrome Web Store users", value: "130", context: "Chrome Web Store detail page, 2026-06-05" }
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
      { label: "Public Chrome Web Store users", value: "73", context: "Chrome Web Store detail page, 2026-06-05" }
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
    searchProfile: {
      capabilities: ["image processing","media processing"],
      evidence: "summary"
    },
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
    longDescription: "Maps nearby competitors around a business, scores visibility, and surfaces actionable SEO recommendations.",
    keyFeatures: ["AI-driven SEO analysis", "Nearby competitor map", "Actionable local search recommendations"],
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
    searchProfile: {
      capabilities: ["image generation", "content generation", "web application"],
      evidence: "summary"
    },
    aliases: ["probes", "probes bot", "ai magazine"],
    description: "AI-generated Forbes-style daily magazine inside Telegram with articles, cover images, and engagement tools.",
    longDescription: "Telegram mini app with a daily AI magazine feed: articles + cover images, likes/bookmarks/comments, and a bot + API pipeline that powers content generation.",
    projectKind: "user-product",
    surfaceTags: ["mobile", "web"],
    mobileReady: true,
    keyFeatures: ["Telegram mini app magazine feed", "Automated article + cover generation", "Engagement stats with likes/bookmarks/comments"],
    techStack: ["Vite", "React", "TypeScript", "Express", "Prisma", "Postgres", "Telegram Bot API"],
    links: [
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/probes-oss" }
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
    searchProfile: {
      capabilities: ["machine learning","computer vision","image segmentation","model serving","model inference"],
      evidence: "implementation"
    },
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
    images: [FACE_TEXTURE_ANALYSIS_SERVICE_IMAGE],
    thumbnail: FACE_TEXTURE_ANALYSIS_SERVICE_IMAGE.url
  },
  {
    id: 42,
    title: "OpenClaw Workstream - Telegram Mini App QA & Launch Validation",
    searchProfile: {
      capabilities: ["browser automation","software testing","release testing","quality assurance"],
      evidence: "implementation"
    },
    legacySlugs: ["openclaw-workstream-telegram-mini-app-e2e-launch-ops"],
    description: "OpenClaw automation for Telegram mini app QA, launch verification, and rapid UI QA loops.",
    longDescription: "This project documents the OpenClaw work I used for Telegram mini apps: reproducible browser E2E validation, gateway and runtime reliability fixes, and screenshot QA packs used to iterate UI quickly across mini game cycles. It stays focused on shipped QA and launch work, not a generic OpenClaw platform overview.",
    keyFeatures: [
      "Reproducible Telegram Web E2E checks for mini app launch, auth, and request/inbox flows",
      "OpenClaw gateway reliability hardening and runtime compatibility fixes",
      "Desktop + mobile GUI artifact capture for fast UI redesign and regression review",
      "Structured launch verification for bot + Mini App setup and QA handoff"
    ],
    techStack: ["OpenClaw", "Telegram Web", "Playwright", "Node.js", "Python", "Runbooks", "Mini Apps"],
    benchmarks: [
      { label: "Reproducible E2E actions", value: "8", context: "AI-Humans Mini App OpenClaw log (2026-02-06)" },
      { label: "GUI artifacts", value: "26 files", context: "screens + moodboard + Midjourney packs" },
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
    searchProfile: {
      capabilities: ["machine learning","research","evaluation","evaluation harness","experiment tracking","benchmarking","agent workflows"],
      evidence: "implementation"
    },
    legacySlugs: ["agentic-cv-repro-lab-skill"],
    description: "Research and evaluation harness for reproducible CV experiments, benchmark campaigns, and reviewable promotion decisions.",
    longDescription: "I turned a reproducible CV experimentation workflow into two public, installable ClawHub skills for teams running browser-heavy and GPU-heavy vision work. The releases package experiment records, browser notebook run records, heartbeat-aware VM execution, review dashboards, and promotion bundles that separate semantic, runtime, and product-surface checks. The improvement-harness initializer writes a JSON contract for benchmark data and metrics, resource budgets, rerun policy, agent roles, and required evidence. It prepares the experiment record; execution and result review use separate workflows.",
    keyFeatures: [
      "Packages benchmark-gated CV experimentation into two public ClawHub skills teams can install and reuse",
      "Captures reproducible experiment state with run cards, dataset manifests, review dashboards, and redacted public context snapshots",
      "Validates Colab, Kaggle, and browser-driven CV workflows with browser run cards and per-image validation scorecards",
      "Adds campaign planning and claim review with contamination checks, rerun policy, and benchmark metrics"
    ],
    techStack: ["ClawHub", "OpenClaw Skills", "Python", "PyTorch", "Computer Vision", "Google Colab", "Kaggle", "MLOps", "Release Engineering"],
    benchmarks: [
      { label: "ClawHub downloads", value: "1,439 total", context: "public ClawHub listings, 2026-06-04 (783 data-science-cv-repro-lab + 656 sota-agent)" },
      { label: "Published versions", value: "24 total", context: "public ClawHub listings, 2026-06-04 (12 + 12 packages)" },
      { label: "Live packages", value: "2", context: "data-science-cv-repro-lab + sota-agent" },
      { label: "Execution surfaces", value: "3", context: "semantic, runtime, and product-surface promotion gates" },
      { label: "Structured helpers", value: "29 scripts", context: "manifests, scorecards, summaries, and claim-review tools" }
    ],
    links: [
      { text: "Inspect the improvement-harness initializer", url: "https://github.com/zack-dev-cm/agentic-cv-repro-lab-skill/blob/d9345fa95479e90d39f6fa1d2ea0a47bf40d0d66/skill/data-science-cv-repro-lab/scripts/init_cv_improvement_harness.py" },
      { text: "Read the harness architecture", url: "https://github.com/zack-dev-cm/agentic-cv-repro-lab-skill/blob/d9345fa95479e90d39f6fa1d2ea0a47bf40d0d66/docs/codex/architecture.md" },
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
    searchProfile: {
      capabilities: ["automation","agent workflows","service integration","human review","business process automation"],
      evidence: "implementation"
    },
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
    searchProfile: {
      capabilities: ["research review","review harness","claim verification","citation review"],
      evidence: "implementation"
    },
    description: "Open-source CLI that catches unsupported claims, broken citations, weak source anchors, and draft markers in AI-written research drafts.",
    longDescription: "AntiRot is a local-first review harness for Markdown research artifacts. It turns the final draft into a gateable surface by flagging unsupported claims, missing source anchors, citation mismatches, comparative hype, absolute overclaim language, and leftover draft markers before a paper, proposal, or lab note ships. The current public release adds paragraph-aware parsing, in-document references support, safer citation verification, and GitHub Actions coverage for text, JSON, Markdown, and SARIF outputs.",
    keyFeatures: [
      "Catches unsupported claims, citation drift, hype language, comparative overreach, absolute claims, and leftover draft markers in Markdown drafts",
      "Supports paragraph-aware source carry, footnotes, inline links, DOIs, arXiv ids, and in-document references sections",
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
      { label: "ClawHub downloads", value: "646", context: "public ClawHub listing, 2026-06-04" },
      { label: "Published versions", value: "9", context: "public ClawHub listing, 2026-06-04" },
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
    title: "Browser QA Report Pack",
    legacySlugs: ["browser-proof"],
    description: "Public browser QA skill that turns a live browser session into a reusable validation pack with steps, artifacts, checks, and a report.",
    longDescription: "Browser QA Report Pack is a small public OpenClaw skill for browser QA and debugging. It creates a machine-readable session manifest, records expected-versus-actual browser steps, ties screenshots and logs to each step, validates the resulting bundle, and renders a markdown report that is easier to hand off than screenshots in chat.",
    keyFeatures: [
      "Creates one machine-readable browser session manifest with app, goal, surfaces, and run context",
      "Appends artifact-backed steps with expected result, actual result, status, and artifact references",
      "Checks the bundle for missing screenshots, incomplete failed steps, and absolute artifact paths before sharing",
      "Renders a shareable markdown report for GitHub issues, release checks, and engineering handoffs"
    ],
    techStack: ["ClawHub", "Python", "Browser QA", "OpenClaw Skills", "Release Engineering"],
    benchmarks: [
      { label: "ClawHub downloads", value: "475", context: "public ClawHub listing, 2026-06-04" },
      { label: "Published versions", value: "6", context: "public ClawHub listing, 2026-06-04" },
      { label: "Public release", value: "v1.0.2", context: "GitHub + ClawHub" },
      { label: "Bundled scripts", value: "4", context: "init, append, check, render" },
      { label: "Artifact fields", value: "5", context: "screenshot, dom, console, network, video" },
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
      { label: "ClawHub downloads", value: "463", context: "public ClawHub listing, 2026-06-04" },
      { label: "Published versions", value: "6", context: "public ClawHub listing, 2026-06-04" },
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
    searchProfile: {
      capabilities: ["workflow automation","video publishing","release engineering"],
      evidence: "implementation"
    },
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
      { label: "ClawHub downloads", value: "530", context: "public ClawHub listing, 2026-06-04" },
      { label: "Published versions", value: "13", context: "public ClawHub listing, 2026-06-04" },
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
      { label: "ClawHub downloads", value: "447", context: "public ClawHub listing, 2026-06-04" },
      { label: "Published versions", value: "8", context: "public ClawHub listing, 2026-06-04" },
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
    searchProfile: {
      capabilities: ["presentation generation","document generation"],
      evidence: "implementation"
    },
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
      { label: "ClawHub downloads", value: "499", context: "public ClawHub listing, 2026-06-04" },
      { label: "Published versions", value: "7", context: "public ClawHub listing, 2026-06-04" },
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
    searchProfile: {
      capabilities: ["repository analytics","marketplace reporting"],
      evidence: "implementation"
    },
    aliases: ["github-stars-optimizer", "clawhub downloads tracker", "clawhub listing tracker"],
    description: "CLI and report flow for tracking GitHub stars, dated ClawHub listing snapshots, publisher stats, and listing deltas.",
    longDescription: "GitHub + ClawHub Downloads Tracker packages the `github-stars-optimizer` workflow into a public metrics surface. It pulls GitHub repository metadata, ClawHub leaderboards, explicit skill slugs, and Chrome Web Store detail-page stats, then renders a blunt listing report with downloads, star conversion gaps, snapshot deltas, 30-day scenarios, and consolidation bets. It keeps ClawHub snapshots visible in the portfolio instead of burying them inside separate package pages.",
    projectKind: "open-source",
    surfaceTags: ["open-source", "automation", "analytics"],
    keyFeatures: [
      "Fetches live ClawHub package stats and keeps exact download counts visible beside GitHub repo metadata",
      "Records Chrome Web Store detail-page stats only when public user counts, ratings, and versions are visible",
      "Stores snapshots so repeated runs can show deltas, fastest package download gains, and current pace",
      "Ranks consolidation and positioning bets when GitHub stars and ClawHub downloads are not converting"
    ],
    techStack: ["Python", "CLI", "GitHub API", "ClawHub Convex", "JSON Snapshots", "Markdown Reports", "Open-source Analytics"],
    benchmarks: [
      { label: "Tracked ClawHub downloads", value: "35,849", context: "public ClawHub owner profile, 2026-08-06 across 53 skills" },
      { label: "Tracked public skills", value: "53", context: "53 rows from live ClawHub publisher profile and paginated published-skill query, 2026-08-06" },
      { label: "CV Repro Lab downloads", value: "2,102 total", context: "1,145 data-science-cv-repro-lab + 957 sota-agent, 2026-08-06" },
      { label: "Strongest skill", value: "2,656 downloads", context: "gstack-review-stack public listing, 2026-08-06" },
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
      "Ships as a reproducible public release with Chrome Web Store metadata and repo records"
    ],
    techStack: ["Chrome Extension", "JavaScript", "Local-first Storage", "Readability", "Markdown Export", "Chrome Web Store"],
    benchmarks: [
      { label: "Public Chrome Web Store users", value: "2", context: "Chrome Web Store detail page, 2026-06-05" },
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
    description: "Chrome extension release for private summaries, simplification, translation, and safe-share cleanup with built-in AI.",
    longDescription: "LocalLens packages Chrome built-in AI into a privacy-first extension workflow: summarize a page, simplify dense text, translate selected content, and clean sensitive snippets before sharing. The release emphasizes local browser execution, clear support pages, and reproducible GitHub records.",
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
      { label: "AI workflows", value: "4", context: "summarize, simplify, translate, safe-share cleanup" },
      { label: "Runtime posture", value: "local browser", context: "Chrome built-in AI surface" },
      { label: "Support pages", value: "4", context: "home, privacy, support, uninstall" }
    ],
    links: [
      { text: "Prior Chrome Web Store route", url: "https://chromewebstore.google.com/detail/locallens-private-ai-summaries/bgmdmikdapojncddhpabnofcioffnhbg" },
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
    longDescription: "OpenClaw Chinese Laoshi Ops turns a private tutoring workflow into a sanitized public skill. It structures lesson source material, generates reviewable lesson packets, keeps source references explicit, and publishes the reusable operations pattern without leaking private student material.",
    projectKind: "open-source",
    surfaceTags: ["open-source", "automation", "education"],
    keyFeatures: [
      "Structures lesson source material into reusable Chinese learning packets",
      "Keeps source references and review state explicit for repeatable lesson preparation",
      "Publishes the workflow as a sanitized OpenClaw skill instead of exposing private tutoring artifacts",
      "Adds the package to the public ClawHub tracker with dated download, version, and star metrics"
    ],
    techStack: ["OpenClaw", "ClawHub", "Google Drive", "Language Learning", "Markdown", "Release Engineering"],
    benchmarks: [
      { label: "ClawHub downloads", value: "480", context: "public ClawHub listing, 2026-06-04" },
      { label: "Published versions", value: "7", context: "public ClawHub listing, 2026-06-04" },
      { label: "ClawHub stars", value: "1", context: "public ClawHub listing, 2026-06-04" },
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
    searchProfile: {
      capabilities: ["security review","static analysis","release testing"],
      evidence: "implementation"
    },
    aliases: ["tma security auditor", "telegram launch gate", "telegram mini app audit"],
    description: "Static launch gate for Telegram Mini Apps that flags initData, token, admin, CORS, PII, and Bot API dry-run risks before release.",
    longDescription: "Telegram Mini App Security Auditor packages a deterministic static audit for TMA projects before bot tokens, BotFather settings, or public channels are connected. It scans the project root for server-side initData validation signals, token-shaped literals, admin routes without obvious guards, wildcard CORS, unsafe HTML usage, frame-header risks, contact/PII/token request-form leaks, and live Bot API actions without dry-run or review gates. The public contract is intentionally conservative: it returns PASS, REVIEW, or BLOCK, and it does not claim complete runtime security.",
    projectKind: "open-source",
    surfaceTags: ["open-source", "automation", "security", "mini-app-security"],
    keyFeatures: [
      "Audits Telegram initData validation, committed token patterns, admin route guards, CORS, frame headers, and unsafe HTML signals",
      "Flags PII/token collection risks in request forms before a public Telegram Mini App launch",
      "Returns PASS, REVIEW, or BLOCK with JSON and Markdown reports for release review",
      "Keeps the guarantee narrow: a static heuristic launch gate, not a complete runtime-security guarantee"
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
    searchProfile: {
      capabilities: ["agent workflows","software development","verification","release engineering"],
      evidence: "workflow"
    },
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
    searchProfile: {
      capabilities: ["release engineering","browser automation","release testing"],
      evidence: "implementation"
    },
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
      { label: "ClawHub downloads", value: "676", context: "public ClawHub listing, 2026-06-04" },
      { label: "Published versions", value: "14", context: "public ClawHub listing, 2026-06-04" },
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
    searchProfile: {
      capabilities: ["machine learning","computer vision","model evaluation","image segmentation","mobile inference","model deployment"],
      evidence: "implementation"
    },
    aliases: ["dermaself mobile app", "flutter skin analysis", "mobile skin analysis app"],
    description: "Skin-analysis computer vision for Dermaself, connecting guided mobile capture with pore and wrinkle segmentation and usable results.",
    longDescription: "I developed Dermaself's cosmetic skin-analysis computer vision, spanning guided capture, facial regions, pore and wrinkle segmentation, model evaluation and mobile/API integration. The work joined PyTorch and OpenMMLab model development with ONNX and Flutter delivery. I resolved model-asset and runtime differences across cloud and GPU deployments, restoring matching segmentation outputs in regression comparisons. Capture quality, runtime behavior and reproducible evaluation guided candidate release decisions.",
    projectKind: "case-study",
    surfaceTags: ["mobile", "computer-vision", "health-ai", "case-study"],
    mobileReady: true,
    keyFeatures: ["Guided capture and facial-region processing for consistent model input", "Pore and wrinkle segmentation with reproducible model evaluation", "Mobile and API integration across Flutter, ONNX and cloud services", "Matching regression outputs across cloud and GPU runtimes"],
    techStack: ["Flutter", "Dart", "Firebase", "Riverpod", "GoRouter", "ONNX", "Mobile CV", "iOS", "Android"],
    links: [],
    mermaidDiagram: `flowchart LR
  Capture["Guided capture + input checks"] --> ROI["Facial regions + preprocessing"]
  ROI --> Runtime["Selected mobile candidate or server runtime"]
  Runtime --> Results["Masks + region measurements"]
  Runtime -.-> Evaluation["Separate model and runtime evaluation"]
  Evaluation --> Release["Candidate release decision"]`,
    images: [DERMASELF_FLUTTER_SKIN_ANALYSIS_IMAGE],
    thumbnail: DERMASELF_FLUTTER_SKIN_ANALYSIS_IMAGE.url,
    createdAt: "2026-05-05"
  },
  {
    id: 80,
    title: "ClearML Experiment Tracking for Dermaself",
    searchProfile: {
      capabilities: ["machine learning","MLOps","evaluation","experiment tracking","model validation"],
      evidence: "implementation"
    },
    aliases: ["clearml dermaself", "dermaself mlops", "skin analysis experiment tracking", "clear ml"],
    description: "MLOps case study for setting up ClearML tracking around Dermaself skin-analysis experiments, run metrics, and promotion gates.",
    longDescription: "ClearML Experiment Tracking for Dermaself captures the MLOps layer behind the Dermaself skin-analysis work. The public entry focuses on setting up ClearML-backed experiment tracking for model runs, dataset and parameter hygiene, metric review, artifact boundaries, and promotion decisions around the same public-safe Dermaself CV pipeline. It deliberately avoids publishing raw skin images, private datasets, model weights, ClearML server URLs, or user-level records.",
    projectKind: "case-study",
    surfaceTags: ["computer-vision", "mlops", "experiment-tracking", "clearml", "health-ai"],
    keyFeatures: [
      "Sets up ClearML experiment tracking for Dermaself model runs without exposing private workspaces",
      "Keeps datasets, parameters, metrics, artifacts, and promotion decisions reviewable across CV iterations",
      "Separates debug or overfit experiment notes from release-ready mobile and server claims",
      "Keeps raw skin images, private datasets, model weights, and ClearML server URLs out of public portfolio files"
    ],
    techStack: ["ClearML", "Python", "PyTorch", "ONNX", "TFLite", "Flutter", "Computer Vision", "MLOps", "Experiment Tracking"],
    benchmarks: [
      { label: "Tracking stack", value: "ClearML", context: "Dermaself MLOps setup added to public portfolio scope, 2026-06-09" },
      { label: "Tracked surfaces", value: "5", context: "dataset, parameters, metrics, artifacts, and promotion decisions" },
      { label: "Public posture", value: "sanitized", context: "public case study excludes raw skin photos, private datasets, model weights, and ClearML server URLs" },
      { label: "Promotion boundary", value: "review-gated", context: "debug experiments stay separate from release-ready mobile/server claims" }
    ],
    links: [],
    mermaidDiagram: `flowchart LR
  Data["Dermaself CV Dataset"] --> Runs["Model Training Runs"]
  Runs --> ClearML["ClearML Tracking"]
  ClearML --> Metrics["Metrics + Parameters"]
  ClearML --> Artifacts["Artifacts + Model Candidates"]
  Metrics --> Review["QA Review Gate"]
  Artifacts --> Review
  Review --> Promote["Mobile / Server Promotion Decision"]
  Review --> Public["Public Sanitization Boundary"]`,
    images: [CLEARML_DERMASELF_EXPERIMENT_TRACKING_IMAGE],
    thumbnail: CLEARML_DERMASELF_EXPERIMENT_TRACKING_IMAGE.url,
    createdAt: "2026-06-09"
  },
  {
    "id": 81,
    "title": "Agnitra - ML Profiling & Optimization",
    searchProfile: {
      capabilities: ["machine learning","model profiling","model inference","inference optimization","model evaluation","quantization"],
      evidence: "implementation"
    },
    "legacySlugs": [
      "agnitra-ai-inference-optimizer"
    ],
    "aliases": [
      "agnitra",
      "agnitra ai",
      "agnitra labs",
      "model profiling",
      "inference optimization",
      "decoder-only llm optimizer"
    ],
    "description": "A published Python SDK and CLI for inspecting model runtime and applying inference optimizations within existing ML workflows.",
    "longDescription": "I develop Agnitra, a Python SDK and CLI available on PyPI. Its profiling path records model-layer shapes and runtime operator events. A separate decoder-LLM optimization path selects hardware-aware quantization strategies and provides integration helpers for Hugging Face, LangChain and LlamaIndex. The beta release gives developers tools to investigate inference behavior; optimization results require workload-specific performance and output-quality evaluation.",
    "projectKind": "open-source",
    "surfaceTags": [
      "open-source",
      "ai-systems",
      "llm-inference",
      "mlops",
      "optimization"
    ],
    "keyFeatures": [
      "Inspect model layers, tensor shapes and runtime operator events",
      "Apply hardware-aware quantization to supported decoder-only language models",
      "Integrate optimization into existing Python, Hugging Face and agent workflows",
      "Use a separate decoder-LLM optimization path with workload-specific validation"
    ],
    "techStack": [
      "Python",
      "PyTorch",
      "Transformers",
      "torchao",
      "Hugging Face",
      "LangChain",
      "LlamaIndex",
      "MLOps"
    ],
    "links": [
      {
        "text": "Install from PyPI",
        "url": "https://pypi.org/project/agnitra/"
      },
      {
        "text": "Reproduce the CPU profiling example",
        "url": "https://zack-dev-cm.github.io/docs/artifacts/agnitra-cpu-profile/reproduce.py"
      },
      {
        "text": "Inspect the recorded model shapes (JSON)",
        "url": "https://zack-dev-cm.github.io/docs/artifacts/agnitra-cpu-profile/shape-report.json"
      }
    ],
    "images": [
      {
        "url": "/docs/images/agnitra-recorded-shapes.png",
        "alt": "Actual layer types and input/output tensor shapes recorded by Agnitra 0.2.4 for a small CPU profiling fixture",
        "caption": "Recorded output from Agnitra 0.2.4 on a randomly initialized CPU fixture. This demonstrates profiling; no optimization or accuracy comparison is shown."
      }
    ],
    "thumbnail": "/docs/images/agnitra-recorded-shapes.png",
    "createdAt": "2026-05-06",
    "canonicalLinks": {
      "website": "https://pypi.org/project/agnitra/"
    },
    "caseStudySections": [
      {
        "title": "Why this tool",
        "body": "Understanding a model's execution is a useful starting point for optimization. Agnitra exposes profiling through Python and the CLI, alongside a separate optimization API for supported decoder language models. The published example makes the profiling output directly inspectable."
      },
      {
        "title": "Inspect a real profiling run",
        "body": "The example below runs the released 0.2.4 profiling code on a small, randomly initialized PyTorch network. Agnitra records each layer's type, input and output shapes, dtype and operator events. The downloadable script recreates the fixture and writes the report. The recorded example uses CPU, Python 3.10.2 and PyTorch 2.9.1; it demonstrates the profiling path independently of the decoder-LLM optimization path."
      },
      {
        "title": "Released scope",
        "body": "The beta package is available on PyPI. Profiling and decoder-LLM optimization are separate execution paths. Automatic quality checks do not cover every optimization path, so developers need to measure output quality and runtime on their own workloads. The example here demonstrates profiling only."
      }
    ]
  },

  {
    id: 64,
    title: "Chrome Extension Studio Plugin",
    searchProfile: {
      capabilities: ["developer tooling","workflow automation","release engineering","browser extensions"],
      evidence: "implementation"
    },
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
      { label: "Source review date", value: "2026-04-18", context: "project source review" }
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
    searchProfile: {
      capabilities: ["operations","diagnostics","automation","system repair"],
      evidence: "implementation"
    },
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
      { label: "Source review date", value: "2026-04-17", context: "project source review" }
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
    searchProfile: {
      capabilities: ["agent workflows","MCP tools","web application","load testing","load test harness","release testing"],
      evidence: "implementation"
    },
    aliases: ["collectionsai chatgpt app", "conservation mcp app", "senior conservation widgets"],
    description: "ChatGPT app case study with MCP tools and widgets for conservation report Q&A, portfolio planning, materials estimates, staffing, and voice-note structuring.",
    longDescription: "CollectionsAI ChatGPT App packages a senior-conservation workflow as an MCP server plus ChatGPT widget layer. It exposes tools for report dashboards, factual Q&A, safe artifact listing, urgency rollups, capacity planning, material estimates, staffing assignments, dictated voice-note structuring, condition-report drafting, and end-to-end conservation cycles. The public case study focuses on the app architecture, widget metadata, release gates, and production posture.",
    projectKind: "case-study",
    surfaceTags: ["automation", "mcp", "chatgpt-app", "operations"],
    keyFeatures: [
      "Maps conservation report Q&A, dashboards, artifacts, planning, intake, and report drafting into explicit MCP tools",
      "Provides ChatGPT widget metadata for dashboard, QA, artifact, operations, and voice-review surfaces",
      "Includes production controls for auth, artifact protection, CORS allowlists, request limits, cache TTLs, timeouts, and security headers",
      "Ships release checks for Node syntax, preflight, publish posture, App Info audit, E2E, load, alpha scenarios, and demo runs"
    ],
    techStack: ["Node.js", "MCP", "ChatGPT Apps", "Zod", "Python", "Widget Metadata", "Release Gates"],
    benchmarks: [
      { label: "MCP tools", value: "10", context: "documented app tool surface" },
      { label: "Load harness", value: "10-user", context: "explicit concurrency test described in release checks" },
      { label: "Source review date", value: "2026-03-04", context: "project source review" }
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
    searchProfile: {
      capabilities: ["agent workflows","computer vision","image segmentation","report generation","workflow automation"],
      evidence: "implementation"
    },
    aliases: ["senior conservator agent", "conservation openclaw workflow", "autonomous conservation report"],
    description: "Autonomous OpenClaw workflow case study for conservation-style photo review, segmentation overlays, staged review gates, reports, audio, and manifests.",
    longDescription: "Senior Conservator OpenClaw Agent is an artifact-heavy conservation review case study. It combines a FastAPI dashboard, OpenClaw browser control, deep-research MCP tools, first-party image segmentation, ROI inspection, model-assisted comparison, report generation, voice output, video artifacts, and reproducibility manifests. The public case study summarizes the architecture and review-gated artifact flow as a reusable pattern for expert inspection work.",
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
      { label: "Review posture", value: "strict", context: "stage-by-stage gates documented in project records" },
      { label: "Source review date", value: "2026-03-01", context: "project source review" }
    ],
    links: [],
    images: [SENIOR_CONSERVATOR_VISUAL_INSPECTION_IMAGE],
    thumbnail: SENIOR_CONSERVATOR_VISUAL_INSPECTION_IMAGE.url,
    createdAt: "2026-03-01"
  },
  {
    id: 68,
    title: "SourcePack Chrome Extension Wave",
    searchProfile: {
      capabilities: ["browser extensions","research tools","source capture","transcript export"],
      evidence: "implementation"
    },
    aliases: ["sourcepack suite", "web2csv", "video2source", "sourcepack hub", "chatarchive", "browser run receipt", "support packet"],
    description: "Chrome Web Store wave for local research exports, transcript capture, AI chat export, source-pack libraries, and receipt utilities.",
    longDescription: "SourcePack Chrome Extension Wave packages a reusable Manifest V3 runtime plus focused Chrome extensions for visible table/list/card extraction, YouTube transcript exports, local source-pack libraries, ChatGPT conversation exports, browser-run receipts, and support packets. The delivery work included CWS listing contracts, public product pages, privacy/support pages, real-browser E2E artifacts, media gates, package ZIPs, and Chrome Web Store tracking. Current public links are limited to listings visible in the Chrome Web Store publisher search.",
    projectKind: "user-product",
    surfaceTags: ["browser-extension", "web", "automation", "release-engineering"],
    keyFeatures: [
      "Ships narrow Manifest V3 extensions from one shared SourcePack runtime without broad host permissions",
      "Exports local Markdown, JSON, CSV, NotebookLM-style Markdown, and SourcePack bundles after explicit user actions",
      "Includes public CWS reviewer pages, privacy/support pages, listing contracts, media manifests, and real-browser E2E artifacts",
      "Embeds Chrome Web Store detail-page tracking in this portfolio so reported user counts and risk metadata stay visible"
    ],
    techStack: ["Chrome Extension", "Manifest V3", "React", "TypeScript", "SourcePack", "Playwright", "Chrome Web Store"],
    benchmarks: [
      { label: "Current public publisher listings", value: "18", context: "Chrome Web Store detail pages and live developer dashboard, 2026-06-15" },
      { label: "Current publisher users", value: "253", context: "Chrome Web Store detail pages and dashboard proof across 15 displayed rows, 2026-06-15" },
      { label: "Average rating", value: "5.00", context: "4 reported Chrome Web Store ratings, 2026-06-15" },
      { label: "Visible SourcePack products", value: "4", context: "Web2CSV, Video2Source, SourcePack Hub, ChatArchive in public publisher results, 2026-06-15" }
    ],
    links: [
      { text: "SourcePack product pages", url: "https://sourcepack-tools.pages.dev/" },
      { text: "Chrome Web Store publisher", url: "https://chromewebstore.google.com/search/kaisenaiko" },
      { text: "Web2CSV CWS", url: "https://chromewebstore.google.com/detail/web2csv-table-list-extractor/egjcdmlfdnkpgkmffkhfdooacmglnjbc" },
      { text: "Video2Source CWS", url: "https://chromewebstore.google.com/detail/video2source-youtube-trans/hjfdpklldhofiehpcfcfdonjppdkmgoh" },
      { text: "SourcePack Hub CWS", url: "https://chromewebstore.google.com/detail/sourcepack-hub-local-ai-re/hlbflaklicefinhckdkbamhhkfklmgao" },
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
    searchProfile: {
      capabilities: ["security review","static analysis","artifact verification","software installation"],
      evidence: "implementation"
    },
    aliases: ["trusted clawhub gate", "clawhub install gate", "openclaw skill installer review"],
    description: "Skill-build case study for a local-first ClawHub/OpenClaw install wrapper that inspects skill artifacts before install and writes receipts.",
    longDescription: "Trusted ClawHub Install Gate is a local-first skill-build project for reducing blind trust in ClawHub/OpenClaw skill installation. It inspects an unpacked local skill directory, classifies the artifact as PASS, REVIEW, or BLOCK, refuses install by default unless the artifact is clean or explicitly approved for review-level risk, writes a receipt for what was inspected and installed, and later verifies installed content against that receipt. The public case study keeps the scope narrow: local directories only, no claim of complete runtime security, and workspace paths supplied explicitly.",
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
      { label: "Default unsafe install policy", value: "deny", context: "REVIEW and BLOCK require explicit handling or are refused in the 2026-05-07 source review" },
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
    searchProfile: {
      capabilities: ["machine learning","computer vision","text recognition","document recognition","model inference","model serving","OCR"],
      evidence: "implementation"
    },
    aliases: ["fast ocr", "onnx ocr api", "three-stage ocr"],
    description: "Containerized OCR API that stages line segmentation, word segmentation, and CRNN text recognition behind a FastAPI endpoint.",
    longDescription: "I built a containerized OCR inference service that turns line segmentation, word segmentation and CRNN recognition into a FastAPI image-upload workflow. It returns recognized text with line and word boxes as structured JSON. ONNX Runtime provides a portable CPU-serving path, with Docker packaging and explicit response contracts connecting the model pipeline to downstream applications.",
    projectKind: "case-study",
    surfaceTags: ["computer-vision", "ocr", "api", "mlops"],
    keyFeatures: ["Line segmentation, word segmentation and CRNN text recognition", "Image-upload API returning recognized text and geometry", "Portable CPU inference with ONNX Runtime", "Docker packaging and explicit downstream response contracts"],
    techStack: ["Python", "FastAPI", "ONNX Runtime", "CRNN", "OCR", "Docker", "Cloud Run"],
    links: [],
    mermaidDiagram: `flowchart LR
  Upload["Upload Image"] --> Line["Line Segmentation ONNX"]
  Line --> Word["Word Segmentation ONNX"]
  Word --> CRNN["CRNN Text Recognition"]
  CRNN --> Response["JSON Text + Boxes"]
  Response --> Review["Timing + Debug Metadata"]`,
    images: [FAST_OCR_ONNX_INFERENCE_IMAGE, SELECTED_AI_CV_EXCALIDRAW_IMAGE],
    thumbnail: FAST_OCR_ONNX_INFERENCE_IMAGE.url,
    createdAt: "2026-05-14"
  },
  {
    id: 71,
    title: "Full-Face Wrinkle and Skin Texture Segmentation Lab",
    searchProfile: {
      capabilities: ["machine learning","computer vision","image segmentation","model inference","model evaluation"],
      evidence: "implementation"
    },
    aliases: ["wrinkle segmentation lab", "skin texture segmentation", "cosmetic face analysis"],
    description: "Cosmetic face-texture pipeline with region masks, YOLO segmentation, skeletonized wrinkle traces, overlays, and visual quality gates.",
    longDescription: "Full-Face Wrinkle and Skin Texture Segmentation Lab is a deep learning case study for cosmetic face analysis. It segments face and neck regions, runs YOLO segmentation for wrinkle and fine-line masks, remaps detections from face ROI crops back to full-resolution coordinates, skeletonizes individual line traces, and writes overlays, region masks, CSV records, timing events, and QA panels. The public entry avoids medical claims and treats quality gates as review signals rather than deployment claim.",
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
      { label: "Gate posture", value: "advisory", context: "review signal, not automatic deployment claim" }
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
    images: [FULL_FACE_WRINKLE_SEGMENTATION_LAB_IMAGE, SELECTED_AI_CV_EXCALIDRAW_IMAGE],
    thumbnail: FULL_FACE_WRINKLE_SEGMENTATION_LAB_IMAGE.url,
    createdAt: "2026-05-14"
  },
  {
    id: 72,
    title: "Multimodal Video Search Platform",
    searchProfile: {
      capabilities: ["research","machine learning","information retrieval","semantic search","video search","model evaluation","multimodal retrieval","speech recognition","text recognition"],
      evidence: "implementation"
    },
    aliases: ["SVS4 search", "video neural search", "hybrid media search"],
    description: "Video search case study combining keyframes, ASR/OCR, object and face signals, visual embeddings, transcript embeddings, and hybrid retrieval.",
    longDescription: "I designed retrieval across video and rich media using complementary visual and language signals. The R&D pipeline normalizes uploads, extracts keyframes, transcribes speech, reads on-screen text and computes visual and text embeddings. Dense and sparse indexes feed hybrid ranking, while regression comparisons help evaluate signal coverage and failure recovery.",
    projectKind: "research",
    surfaceTags: ["computer-vision", "ai", "search", "video", "mlops"],
    keyFeatures: ["Keyframes, speech transcripts, OCR and scene information", "Visual and text embeddings for complementary retrieval signals", "Dense and sparse search with hybrid ranking", "Regression comparisons for retrieval coverage and recovery"],
    techStack: ["Python", "FastAPI", "Qdrant", "Postgres", "Visual Embeddings", "OCR", "ASR", "Hybrid Search", "Celery"],
    links: [],
    mermaidDiagram: `flowchart LR
  Video["Video"] --> Frames["Keyframes + visual embeddings"]
  Video --> ASR["Speech transcripts"]
  Frames --> OCR["On-screen text"]
  Frames --> VisualIndex["Visual index"]
  ASR --> TextIndex["Dense + sparse text index"]
  OCR --> TextIndex
  Query["Query"] --> Retrieve["Retrieve + fuse matches"]
  VisualIndex --> Retrieve
  TextIndex --> Retrieve
  Retrieve --> Results["Timestamped matches"]`,
    images: [MULTIMODAL_VIDEO_SEARCH_PLATFORM_IMAGE],
    thumbnail: MULTIMODAL_VIDEO_SEARCH_PLATFORM_IMAGE.url,
    createdAt: "2026-05-14"
  },
  {
    id: 73,
    title: "Public CV and Deep Learning GitHub Archive",
    searchProfile: {
      capabilities: ["research","machine learning","computer vision","model inference"],
      evidence: "summary"
    },
    aliases: ["public cv dl archive", "github computer vision archive", "older cv research repos"],
    description: "GitHub API-backed archive of public authored CV/DL repos across YOLO/EfficientNet detection, Cyrillic OCR, mobile ML Kit, TFLite, and vision-transformer prototypes.",
    longDescription: "Public CV and Deep Learning GitHub Archive consolidates earlier public authored computer-vision repositories into one discovery surface. A 2026-05-14 GitHub API review across zack-dev-cm and ZackPashkin surfaced relevant repositories for YOLO/EfficientNet object detection, Cyrillic handwriting OCR, OCR datasets, ML Kit face contours, TFLite glasses classification, DeIT/Swin/CvT transformer prototypes, document capture, energy-meter recognition, video search, and CLIP-assisted media tools. Forked upstream reference repos are treated as research context, not as authored portfolio claim.",
    projectKind: "research",
    surfaceTags: ["computer-vision", "deep-learning", "ocr", "mobile", "github"],
    keyFeatures: [
      "Separates authored public repos from forks and reference clones before using GitHub records",
      "Surfaces OCR, object detection, face landmarks, mobile inference, and vision-transformer work as one searchable archive",
      "Uses public repo metadata and generated case studies instead of unpublished notebook or service links",
      "Frames older prototypes as research and engineering breadth without claiming production deployment"
    ],
    techStack: ["Python", "PyTorch", "TensorFlow", "YOLO", "EfficientNet", "OCR", "ML Kit", "TFLite", "OpenCV", "Android", "Flutter"],
    benchmarks: [
      { label: "GitHub accounts reviewed", value: "2", context: "zack-dev-cm and ZackPashkin public API snapshot, 2026-05-14" },
      { label: "Public CV/DL repos sampled", value: "18+", context: "authored or project-specific public repositories, forks excluded from authored-count metrics" },
      { label: "Top public repo", value: "14 stars / 6 forks", context: "YOLOv3-EfficientNet-EffYolo API snapshot" },
      { label: "Source posture", value: "public-only", context: "public GitHub repos and generated case studies only" }
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
  Portfolio --> Guard["Public References Only"]`,
    images: [
      { url: `${LOCAL_IMG_BASE}/cv-ai-systems-map.png`, alt: "Computer vision systems map used for public CV and deep learning archive" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/cv-ai-systems-map.png`,
    createdAt: "2026-05-14"
  },
  {
    id: 74,
    title: "Colab CV/DL Prototype Archive",
    searchProfile: {
      capabilities: ["research","machine learning","computer vision","notebook experiments"],
      evidence: "summary"
    },
    aliases: ["colab notebooks archive", "cv dl prototype archive", "vision notebook prototypes"],
    description: "Public notebook-style CV/DL prototype archive for Swin/CvT starters, OCR finetuning, Android document capture, video search, lip sync, and CLIP media experiments.",
    longDescription: "Colab CV/DL Prototype Archive groups public notebook-style repositories and Colab-ready code that show research range across image classification, OCR finetuning, mobile document capture, video retrieval, lip-sync media generation, and CLIP-based creative tooling. The archive is intentionally scoped as prototype and research context: it links only public GitHub repositories and avoids unpublished notebooks, service endpoints, or restricted datasets.",
    projectKind: "research",
    surfaceTags: ["computer-vision", "deep-learning", "colab", "notebooks", "generative-ai"],
    keyFeatures: [
      "Groups older public notebooks into a coherent CV/DL research surface for agents and recruiters",
      "Covers image classification, OCR finetuning, document capture, multimodal video search, and generative media",
      "Keeps notebook references tied to public GitHub repos and generated case studies",
      "Labels the work as prototypes so agents do not confuse notebooks with maintained production services"
    ],
    techStack: ["Jupyter Notebook", "Google Colab", "PyTorch", "TensorFlow", "Swin Transformer", "CvT", "CLIP", "MMOCR", "OpenCV", "CameraX"],
    benchmarks: [
      { label: "Public prototype links", value: "8", context: "GitHub API and repo URL review, 2026-05-14" },
      { label: "Research families", value: "5", context: "classification, OCR, mobile capture, video retrieval, generative media" },
      { label: "Notebook posture", value: "prototype", context: "not presented as live service or production accuracy claim" },
      { label: "Source links", value: "public-only", context: "GitHub repos and generated case studies only" }
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
    images: [COLAB_CVDL_PROTOTYPE_ARCHIVE_IMAGE, SELECTED_AI_CV_EXCALIDRAW_IMAGE],
    thumbnail: COLAB_CVDL_PROTOTYPE_ARCHIVE_IMAGE.url,
    createdAt: "2026-05-14"
  },
  {
    id: 76,
    title: "Jaw and Face-Type Classifier for Aesthetic Review",
    searchProfile: {
      capabilities: ["machine learning","computer vision","classification","model evaluation","facial morphology"],
      evidence: "implementation"
    },
    aliases: [
      "jaw classifier",
      "face type classifier",
      "plastic surgery review",
      "beauty examination classifier",
      "aesthetic face analysis"
    ],
    description: "Computer-vision review system for jaw and face-type classification in beauty and plastic-surgery examination workflows.",
    longDescription: "Jaw and Face-Type Classifier for Aesthetic Review is a public-safe case study for facial morphology classification work. A 2026-06-04 private-source review covered jaw-class workspaces, jaw database materials, k-fold experiment folders, label text files, and a Jaw / Face-type analyser v0.12.7 deck. The public entry focuses on the engineering pattern: dataset and label QA, front/profile landmark handling, jawline and face-type classification, review overlays, experiment tracking, and release-ready privacy boundaries. It is framed as aesthetic-review decision support, not diagnosis, treatment planning, or a surgical recommendation system; raw face images, patient data, and private model weights are not published.",
    projectKind: "case-study",
    surfaceTags: ["computer-vision", "classification", "beautytech", "health-ai", "face-analysis"],
    keyFeatures: [
      "Combines front and profile facial review surfaces with jawline and facial landmark overlays",
      "Treats label QA and class taxonomy as first-class work before model comparison",
      "Uses k-fold experiment structure for repeatable classifier review instead of one-off screenshots",
      "Keeps private raw images, patient data, and model weights out of public portfolio artifacts"
    ],
    techStack: ["Python", "PyTorch", "OpenCV", "Computer Vision", "Facial Landmarks", "Classification", "K-fold Validation", "Visual QA"],
    benchmarks: [
      { label: "Review deck", value: "v0.12.7", context: "Jaw / Face-type analyser project deck checked 2026-06-04" },
      { label: "Experiment pattern", value: "k-fold", context: "classifier experiment folder review, 2026-06-04" },
      { label: "Reviewed references", value: "5+", context: "jaw-class workspaces, jaw database, analyzer deck, labels, and experiment folders" },
      { label: "Public posture", value: "sanitized", context: "no raw patient images, private labels, or model weights published" }
    ],
    links: [],
    mermaidDiagram: `flowchart LR
  Intake["Face Image Review"] --> Landmarks["Front / Profile Landmarks"]
  Landmarks --> Jaw["Jawline Geometry"]
  Landmarks --> FaceType["Face-Type Signals"]
  Jaw --> Classifier["Classifier Experiments"]
  FaceType --> Classifier
  Classifier --> QA["K-fold + Label QA"]
  QA --> Review["Aesthetic Review Overlay"]
  Review --> Guard["Public Sanitization Gate"]`,
    images: [
      { url: `${LOCAL_IMG_BASE}/jaw-face-type-classifier-card.png`, alt: "Anonymized jaw and face-type classification interface with facial landmarks and review charts" },
      SELECTED_AI_CV_EXCALIDRAW_IMAGE
    ],
    thumbnail: `${LOCAL_IMG_BASE}/jaw-face-type-classifier-card.png`,
    createdAt: "2026-06-04"
  },
  {
    id: 77,
    title: "Architectural Drawing and Interior Catalog Matching",
    searchProfile: {
      capabilities: ["computer vision","document recognition","information extraction","catalog matching","agent workflows"],
      evidence: "implementation"
    },
    aliases: [
      "architectural drawings recognition",
      "floor plan recognition",
      "room plan recognition",
      "interior catalog matching",
      "casework catalog matching",
      "commercial reception catalog preview",
      "school reception design configuration",
      "utility building interior planning",
      "whole building interior planning",
      "blueprint symbol detection"
    ],
    description: "CV and agentic pipeline for raw plans and elevations: extract rooms and callouts, match casework and finish catalog items, and preview reception, school, or utility-building interiors.",
    longDescription: "Architectural Drawing and Interior Catalog Matching is a public-safe case study for raw document-to-design configuration work. A 2026-06-04 source review covered plan uploads, PDF/image derivation, elevation-callout extraction, catalog-code capture, manufacturer catalog indexing, catalog mapping CSV/YAML, room-preset optimization, layout/render export, and InQI/CollectionsAI-style context routing parallels. The public entry focuses on parsing raw plans and elevations, matching rooms and callouts to catalog items, generating reception/school/utility-building interiors and exterior context previews, and exporting BOM/rationale artifacts without publishing private plans, manufacturer PDFs, addresses, client files, or proprietary SKU data.",
    projectKind: "case-study",
    surfaceTags: ["computer-vision", "architecture", "ocr", "catalog-matching", "interior-ai", "retrieval"],
    keyFeatures: [
      "Parses PDFs, blueprint images, and elevation sheets into room graphs, dimensions, OCR labels, and catalog callouts",
      "Maps visible callout codes to casework, finish, lighting, storage, and furniture catalog records with evidence notes",
      "Optimizes reception and room presets against coverage, fit, style, circulation, and building-level ensemble constraints",
      "Exports reviewable plan previews, commercial interior/exterior context renders, BOM CSVs, and rationale packets without exposing private source documents"
    ],
    techStack: ["Python", "OpenCV", "OCR", "PDF Processing", "LLM/Vision Parsing", "Catalog Indexing", "OpenEvolve", "BOM Export", "3D/CV", "Visual QA"],
    benchmarks: [
      { label: "Input families", value: "3", context: "PDF plans, raster blueprint images, and elevation/casework sheets from source review, 2026-06-04" },
      { label: "Catalog flow", value: "callouts -> items", context: "visible drawing codes mapped to catalog records, evidence notes, and candidate pools" },
      { label: "Output artifacts", value: "5", context: "room graph, catalog mapping, layout preview, render, and BOM/rationale export" },
      { label: "Public posture", value: "sanitized", context: "no private plans, addresses, manufacturer PDFs, raw client drawings, or proprietary SKU data published" }
    ],
    links: [],
    mermaidDiagram: `flowchart LR
  Docs["PDF / Blueprint / Elevation"] --> Parse["Vision + OCR Parsing"]
  Parse --> Rooms["Room Graph + Dimensions"]
  Parse --> Callouts["Catalog Callouts"]
  Callouts --> Catalog["Catalog Index + Evidence Notes"]
  Rooms --> Constraints["Program + Circulation Constraints"]
  Catalog --> Presets["Candidate Presets"]
  Constraints --> Presets
  Presets --> Render["Reception / School / Utility Preview"]
  Presets --> QA["Fit + Style + BOM QA"]
  Render --> Export["Rationale + BOM Bundle"]
  QA --> Export`,
    images: [
      { url: `${LOCAL_IMG_BASE}/architectural-plan-interior-matcher-card.png`, alt: "Architectural floorplan recognition and interior catalog matching visualization" },
      ARCHITECTURAL_CATALOG_RECEPTION_IMAGE
    ],
    thumbnail: `${LOCAL_IMG_BASE}/architectural-plan-interior-matcher-card.png`,
    createdAt: "2026-06-04"
  },
  {
    id: 78,
    title: "InQuest Project Binder RAG QA",
    searchProfile: {
      capabilities: ["agent workflows","retrieval augmented generation","document ai","information retrieval","semantic search","evaluation"],
      evidence: "implementation"
    },
    aliases: [
      "INQI Quest",
      "InQuest operation logic",
      "project binder agent",
      "site plan RAG",
      "binder vector storage"
    ],
    description: "Document agents that retrieve across project collections, preserve task context and save generated artifacts back to the right project.",
    longDescription: "I built project-aware document-agent workflows for InQuest. Context routing distinguishes the active project, reference collections and manually attached documents, with retrieval grounded in the selected sources. OpenAI Agents SDK and MCP connect tool calls, handoffs and persistent context. Generated files and answers stay associated with the relevant project, while evaluation scenarios check retrieval selection and save behavior.",
    projectKind: "case-study",
    surfaceTags: ["ai", "rag", "project-context", "qa", "vector-storage", "site-planning"],
    keyFeatures: ["Project-aware retrieval and attachment precedence", "Tool calls and handoffs with persistent task context", "Generated files saved to the relevant project collection", "Evaluation of retrieval selection and artifact persistence"],
    techStack: ["RAG", "Vector Stores", "OpenAI APIs", "Project Context", "Binder Workflows", "PDF Generation", "S3", "QA Matrix", "Web Search"],
    links: [],
    mermaidDiagram: `flowchart LR
  User["User Prompt"] --> Router["Context Router"]
  Project["Project Metadata"] --> Router
  Site["Site Plan + Elevation"] --> Router
  Attach["Manual Attachments"] --> Router
  Router --> Binders["Project / Reference / All Binders"]
  Binders --> Vector["Vector Retrieval"]
  Vector --> Answer["Grounded Answer"]
  Answer --> Save["PDF + Generated Files"]
  Save --> QA["Scenario QA Matrix"]`,
    images: [
      { url: `${LOCAL_IMG_BASE}/inqi-quest-binder-agent-card.png`, alt: "InQuest binder RAG workflow with site map, binders, vector nodes, and answer panel" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/inqi-quest-binder-agent-card.png`,
    createdAt: "2026-06-04"
  },
  {
    id: 79,
    title: "ComfyUI and Colab Generative Prototype Lab",
    searchProfile: {
      capabilities: ["research","machine learning","generative ai","image generation","model experimentation","fine tuning","workflow automation"],
      evidence: "summary"
    },
    aliases: [
      "ComfyUI prototype lab",
      "colab prototype archive",
      "custom models lab",
      "research paper implementation snippets",
      "generative media factory",
      "advanced notebook prototypes"
    ],
    description: "Notebook and prototype archive for ComfyUI automation, custom model experiments, paper-to-code snippets, and generated media pipelines.",
    longDescription: "ComfyUI and Colab Generative Prototype Lab adds the source-reviewed notebook and advanced prototype work that was missing from the public portfolio. The 2026-06-04 review covered Colab notebook folders, OCR and PDF-analysis demos, MMOCR notes, Falcon/LLM fine-tuning proposal notes, mobile PyTorch custom-library build notes, ComfyUI API automation, LivePortrait batch animation, MoviePy/FFmpeg assembly, and generative media pipeline planning. The public entry links only public repositories and describes the system patterns; private notebook URLs, restricted datasets, unpublished weights, and private proposal artifacts are not published.",
    projectKind: "research",
    surfaceTags: ["generative-ai", "colab", "notebooks", "computer-vision", "custom-models", "automation"],
    keyFeatures: [
      "Turns notebook experiments into reusable prototype families rather than isolated demos",
      "Automates ComfyUI workflow JSON through Python and WebSocket-style orchestration patterns",
      "Groups custom model, OCR, document QA, LLM fine-tuning, and media-assembly work under one research lab surface",
      "Keeps private Colab links, restricted datasets, unpublished weights, and proposal drafts out of public files"
    ],
    techStack: ["Google Colab", "ComfyUI", "Python", "PyTorch", "MMOCR", "PaddleOCR", "LangChain", "Pinecone", "MoviePy", "FFmpeg", "LivePortrait", "WebSocket"],
    benchmarks: [
      { label: "Prototype lanes", value: "6", context: "ComfyUI, LivePortrait, OCR/PDF, retrieval QA, model fine-tuning, media assembly" },
      { label: "Source posture", value: "public links only", context: "private source and Colab URLs excluded from published portfolio files" },
      { label: "Notebook posture", value: "prototype", context: "research and implementation snippets, not presented as maintained production services" },
      { label: "Review date", value: "2026-06-04", context: "private-source and local portfolio review for missing notebook/prototype work" }
    ],
    links: [
      { text: "Digits recognition MMOCR", url: "https://github.com/ZackPashkin/digits-recognition-mm-ocr" },
      { text: "Voice and lip sync Colab app", url: "https://github.com/ZackPashkin/voice-and-lip-sync-in-pytorch-web-app-colab" },
      { text: "Text to cartoon CLIP", url: "https://github.com/ZackPashkin/text2cartoon-pytorch-CLIP" }
    ],
    mermaidDiagram: `flowchart LR
  Notes["Notebook / Source Notes"] --> Families["Prototype Families"]
  Families --> OCR["OCR + PDF Analysis"]
  Families --> Models["Custom Models + Fine-tuning"]
  Families --> Comfy["ComfyUI Workflow JSON"]
  Families --> Media["MoviePy / FFmpeg Assembly"]
  Comfy --> Review["Human Review Gate"]
  OCR --> Review
  Models --> Review
  Media --> Review
  Review --> Public["Public Links Only"]`,
    images: [
      { url: `${LOCAL_IMG_BASE}/comfy-colab-prototype-lab-card.png`, alt: "Generative AI notebook and ComfyUI prototype lab with node graphs and media pipeline frames" },
      SELECTED_AI_CV_EXCALIDRAW_IMAGE
    ],
    thumbnail: `${LOCAL_IMG_BASE}/comfy-colab-prototype-lab-card.png`,
    createdAt: "2026-06-04"
  },
  {
    id: 75,
    title: "Research Claim Ledger",
    searchProfile: {
      capabilities: ["research review","claim verification","citation review"],
      evidence: "workflow"
    },
    aliases: ["research claim audit", "claim ledger skill", "academic source receipt"],
    description: "ClawHub skill-build case study for turning research drafts, source packets, literature matrices, or reviewer notes into source-backed claim ledgers.",
    longDescription: "Research Claim Ledger is a narrow public ClawHub skill for academic and technical writing review. It avoids the over-broad promise of a full research suite and focuses on one trust-building artifact: a claim-by-claim ledger that marks each sentence as supported, weakly-supported, overclaimed, wrong-source, missing-locator, stale-source, inaccessible, unsupported, or needing human review. The public case study compares this narrower wedge against broad academic-agent workflows and frames the deliverable as a receipt a writer can share with a supervisor, coauthor, or reviewer.",
    projectKind: "case-study",
    surfaceTags: ["research", "ai", "release-engineering", "openclaw"],
    keyFeatures: [
      "Turns draft sections, literature matrices, notes, citation lists, source packets, or reviewer comments into a structured claim ledger",
      "Separates supported claims from overclaims, missing locators, stale sources, inaccessible references, and human-review cases",
      "Keeps the first release instruction-only with no bundled scraping helper or hidden dependency surface",
      "Positions the skill as a small source receipt rather than a paper-writing, plagiarism, legal, medical, or financial review tool"
    ],
    techStack: ["ClawHub", "Codex Skills", "Research QA", "Citation Review", "Markdown", "Release Engineering"],
    benchmarks: [
      { label: "ClawHub downloads", value: "198", context: "public ClawHub listing, 2026-06-04" },
      { label: "Published versions", value: "1", context: "public ClawHub listing, 2026-06-04" },
      { label: "Verdict labels", value: "9", context: "supported, weakly-supported, overclaimed, wrong-source, missing-locator, stale-source, inaccessible, unsupported, needs-human-review" },
      { label: "Release posture", value: "instruction-only", context: "SKILL.md and agent config first release; scripts deferred until example ledgers validate the workflow" }
    ],
    links: [
      { text: "Open on ClawHub", url: "https://clawhub.ai/zack-dev-cm/research-claim-ledger" },
      { text: "Reference academic-research-skills", url: "https://github.com/Imbad0202/academic-research-skills" },
      { text: "Reference academic-research-skills-codex", url: "https://github.com/Imbad0202/academic-research-skills-codex" }
    ],
    images: [],
    thumbnail: "",
    hideImages: true,
    createdAt: "2026-05-22",
    canonicalLinks: {
      website: "https://clawhub.ai/zack-dev-cm/research-claim-ledger"
    }
  },
  {
    id: 50,
    title: "HH OpenClaw Agent",
    searchProfile: {
      capabilities: [],
      evidence: "name-only"
    },
    description: "HH OpenClaw Agent skill entry retained by name only.",
    longDescription: "HH OpenClaw Agent skill entry retained by name only.",
    keyFeatures: [
      "Skill name retained only",
      "Public listing links retained for source continuity"
    ],
    techStack: ["ClawHub", "Python", "OpenClaw Skills"],
    benchmarks: [
      { label: "ClawHub downloads", value: "487", context: "public ClawHub listing, 2026-06-09" },
      { label: "Published versions", value: "8", context: "public ClawHub listing, 2026-06-09" },
      { label: "Public release", value: "v1.0.5", context: "GitHub + ClawHub" },
      { label: "Public posture", value: "name-only", context: "portfolio copy intentionally keeps only the skill name" }
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
