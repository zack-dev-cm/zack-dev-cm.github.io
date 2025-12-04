import type { Project, Company, SocialLinks, AuthorInfo, LatestUpdate } from './types';

export const AUTHOR_INFO: AuthorInfo = {
  name: "Zakhar Pashkin",
  title: "AI & Computer Vision Engineer",
  bio: "Deep Learning/Computer Vision engineer shipping agentic products across mobile, web, and cloud. I design VLM/LLM systems end-to-end and focus on turning scrappy prototypes into reliable launches."
};

export const SOCIAL_LINKS: SocialLinks = {
  linkedin: "https://www.linkedin.com/in/zakhar-pashkin-a524a6163/",
  email: "kaisenaiko@gmail.com",
  githubPrimary: "https://github.com/zack-dev-cm",
  githubSecondary: "https://github.com/ZackPashkin",
  telegram: "https://t.me/rheuiii"
};

export const COMPANIES: Company[] = [
  { name: "Entrust", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Entrust_textlogo.svg" },
  { name: "Lumenis", logoUrl: "https://iconape.com/wp-content/png_logo_vector/lumenis-ltd-logo.png" },
  { name: "Carb Manager", logoUrl: "https://logotyp.us/file/carb-manager.svg" },
  { name: "Gorillas", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Logo_Gorillas_(delivery_company)_color.svg" },
  { name: "Stellarix", logoUrl: "https://stellarix.com/wp-content/themes/stellarix/assets/images/logo.png" },
  { name: "Synoptic Technologies", logoUrl: "https://assets.adityatrading.in/media/images/ipo/stocklogo/Synoptics%20Technologies%20Limited%20Logo/Synoptics_Technologies_Limited_Logo.png" },
  { name: "Milliken & Company", logoUrl: "https://www.pngkey.com/png/full/568-5688498_next-milliken-company-logo.png" },
  { name: "CFT", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Cft_logo_ru.png" },
  { name: "Korona Pay", logoUrl: "https://logotic.me/system/assets/uploads/vector-files/koronapay-1669936470-logotic-brand.svg" },
  { name: "Curv Innovation", logoUrl: "https://cdn0.trampos.co/companies/logos/1139740/ea11bdb2d783c2563c6dd26e9267d10db671ab49/original/CURV_-_WHITE_BACKGROUNG.png" }
];

export const KEY_HIGHLIGHTS: string[] = [
  "7+ years building applied CV/ML products: OCR, segmentation, VLMs, and mobile inference.",
  "Upwork Top Rated Plus contractor (top 1% AI devs) shipping production-grade systems fast.",
  "Hands-on mentor/educator who has led corporate trainings and coached CV/ML teams."
];

export const TECH_STACK: string[] = [
  "PyTorch", "TensorFlow", "Keras", "OpenCV", "OpenAI APIs", "CLIP", "VLMs", "LLMs", "Python", "TypeScript", "React", "Cloudflare Workers", "Android", "iOS", "GCP", "AWS", "Docker", "Kubernetes", "ML Ops", "TensorRT", "TFLite", "CoreML", "ONNX/OpenVino"
];

export const LATEST_UPDATES: LatestUpdate[] = [
  {
    title: "URL → Markdown Worker (Cloudflare)",
    description: "Edge micro-SaaS that streams HTML-to-Markdown with Google Cache fallback and MCP SSE endpoint.",
    links: [{ text: "GitHub", url: "https://github.com/zack-dev-cm/micro10" }]
  },
  {
    title: "Beauty Visual Inbox mini-app",
    description: "Telegram bots + React mini-app for salons: publish photo batches, likes, notifications, and analytics.",
    links: [{ text: "GitHub", url: "https://github.com/zack-dev-cm/bvis" }, { text: "Live app", url: "https://bvis-1095464065298.us-east1.run.app" }]
  },
  {
    title: "Turbo Tots Garage (motion + touch PWA)",
    description: "Playful toddler dashboard with motion sensors, audio cues, and Playwright E2E coverage.",
    links: [{ text: "GitHub", url: "https://github.com/zack-dev-cm/toddler_games" }]
  }
];

const GITHUB_IMG_BASE_URL = "https://raw.githubusercontent.com/zack-dev-cm/github-repo-sum.github.io/main/samples";
const BASE_PATH = (import.meta.env.BASE_URL || "").replace(/\/+$/, "");
const LOCAL_IMG_BASE = `${BASE_PATH}/images`;

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Android Remote Control with VLM AI Agents",
    description: "Hands-free Android automation via server-side VLM agents deciding the next tap/swipe/type.",
    longDescription: "Android app streams screenshots to Vision-Language agents that decide and execute actions. Built for real-time instruction following, automated testing, and accessibility/ops automation.",
    keyFeatures: ["Real-time instruction processing", "Automated testing & task automation", "Novel device interaction"],
    techStack: ["Android", "Vision-Language Models", "Server-side AI"],
    links: [{ text: "View Demo Video", url: "https://drive.google.com/file/d/13UQTdBVsZwPclMOca6Nmaywk4BiRydbi/view?usp=sharing" }],
    images: [{ url: `${GITHUB_IMG_BASE_URL}/android_become_human-ezgif.com-speed.gif`, alt: "Android Remote Control Demo" }],
    thumbnail: `${GITHUB_IMG_BASE_URL}/android_become_human-ezgif.com-speed.gif`
  },
  {
    id: 2,
    title: "Control VLM-LLM Agent Silently With Your Breath",
    description: "Start/stop a neural agent with breathing patterns—no voice commands needed.",
    longDescription: "Breath-based control after a short calibration: detect sharp exhales to start, smooth exhale to stop. Works on mic audio or sniffles for silent agent control.",
    keyFeatures: ["Non-verbal AI control", "Pattern recognition of breathing acoustics"],
    techStack: ["Audio processing", "Neural Networks"],
    links: [{ text: "View Demo GIF", url: "https://drive.google.com/file/d/1H43aT5n8NWlOuTIWsJinssKRh1n3tiOM/view?usp=sharing" }],
    images: [{ url: `${GITHUB_IMG_BASE_URL}/mlbreath.gif`, alt: "Breathing Control Demo" }],
    thumbnail: `${GITHUB_IMG_BASE_URL}/mlbreath.gif`
  },
  {
    id: 3,
    title: "meshmcp – Offline P2P Chat for Local LLMs",
    description: "Bluetooth mesh messaging + LLM reasoning on constrained devices.",
    longDescription: "Android + iOS mesh chat that keeps conversations alive without internet. Messages hop over Bluetooth mesh and feed local/edge LLMs for summarization and commands.",
    keyFeatures: ["Offline mesh networking", "Local LLM reasoning", "Energy-efficient relay routing"],
    techStack: ["Android", "iOS", "Bluetooth Mesh", "Local LLMs"],
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
    links: [{ text: "Visit App", url: "https://analytics-mcp-1095464065298.us-east1.run.app" }],
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
      { text: "Live Demo", url: "https://adfeed-1095464065298.us-central1.run.app/" },
      { text: "View Demo Video", url: "https://drive.google.com/file/d/1kvg4gjCNFPmrI3URPsM3eIyQ_vqSk1Ow/view?usp=sharing" }
    ],
    images: [{ url: `${GITHUB_IMG_BASE_URL}/adfeed_her.gif`, alt: "Create, Chat & AR Experience with AI-Character" }],
    thumbnail: `${GITHUB_IMG_BASE_URL}/adfeed_her.gif`
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
      { url: `${GITHUB_IMG_BASE_URL}/interior/marble_floor_w_reflections.png`, alt: "Marble Floor with Reflections" },
      { url: `${GITHUB_IMG_BASE_URL}/interior/1.png`, alt: "Interior Example 1" }
    ],
    thumbnail: `${GITHUB_IMG_BASE_URL}/interior/marble_floor_w_reflections.png`
  },
  {
    id: 7,
    title: "Smart Drive for Smart City: Predict Optimal Speed",
    description: "Predict the optimal speed before traffic lights or jams to smooth city driving.",
    longDescription: "Predictive model that anticipates lights/traffic, aiming to cut abrupt stops and improve fuel efficiency for urban driving.",
    keyFeatures: ["Predictive speed optimization", "Traffic flow analysis"],
    techStack: ["Predictive Modeling", "Real-time Data Analysis"],
    links: [],
    images: [{ url: `${GITHUB_IMG_BASE_URL}/smart_drive/smart_drive3.png`, alt: "Smart Drive Prediction" }],
    thumbnail: `${GITHUB_IMG_BASE_URL}/smart_drive/smart_drive3.png`
  },
  {
    id: 8,
    title: "Estimate Golf Ball Trajectory",
    description: "Analyze golf swings and estimate ball trajectory for coaching and analytics.",
    longDescription: "Computer vision + physics model to estimate ball flight and swing quality for sports analytics.",
    keyFeatures: ["Trajectory estimation", "Sports motion analysis"],
    techStack: ["Computer Vision", "Physics-based Modeling"],
    links: [],
    images: [{ url: `${GITHUB_IMG_BASE_URL}/golf/1.png`, alt: "Estimate Golf Ball Trajectory" }],
    thumbnail: `${GITHUB_IMG_BASE_URL}/golf/1.png`
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
      { url: `${GITHUB_IMG_BASE_URL}/key_segm/download (61).png`, alt: "Key Segmentation 1" },
      { url: `${GITHUB_IMG_BASE_URL}/key_segm/download (62).png`, alt: "Key Segmentation 2" }
    ],
    thumbnail: `${GITHUB_IMG_BASE_URL}/key_segm/download (61).png`
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
      { url: "https://raw.githubusercontent.com/zack-dev-cm/github-repo-sum.github.io/main/samples/food-recognition-thumb.png", alt: "Food recognition app" },
      { url: `${LOCAL_IMG_BASE}/food_avatar.png`, alt: "Calorio nutrition assistant" }
    ],
    thumbnail: "https://raw.githubusercontent.com/zack-dev-cm/github-repo-sum.github.io/main/samples/food-recognition-thumb.png"
  },
  {
    id: 11,
    title: "Dishes Recognition & Nutrition Goals Telegram Bot",
    description: "Telegram bot that recognizes dishes from photos/audio and tracks nutrition goals (1,000+ users).",
    longDescription: "Multimodal Telegram bot that understands dish photos/voice/text, logs calories/macros, and nudges users toward daily nutrition targets.",
    keyFeatures: ["Vision + voice dish detection", "Nutrition goal tracking", "Telegram-native UX"],
    techStack: ["Telegram Bot API", "OCR", "Speech-to-Text", "LLMs"],
    links: [{ text: "Try on Telegram", url: "https://t.me/calorio_yf_bot" }],
    images: [
      { url: `${LOCAL_IMG_BASE}/bot_welcome.png`, alt: "Nutrition bot welcome screen" },
      { url: `${LOCAL_IMG_BASE}/food_avatar.png`, alt: "Calorio brand avatar" }
    ],
    thumbnail: `${LOCAL_IMG_BASE}/bot_welcome.png`
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
    description: "Privacy-first Chrome extension that summarizes repo structure locally.",
    longDescription: "Fetches GitHub repo trees with the user's token and summarizes structure locally—no external servers involved.",
    keyFeatures: ["Privacy-first (local token usage)", "Automated repository structure summarization"],
    techStack: ["Chrome Extension", "JavaScript", "GitHub API"],
    links: [
      { text: "View on Chrome Web Store", url: "https://chromewebstore.google.com/detail/github-repo-summarizer/ccikgbjalcbokaalidnfcjhhbhjoljfm" },
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/github-repo-sum-chrome-plugin" }
    ],
    images: [{ url: `${LOCAL_IMG_BASE}/github_repo_summarizer_ext.png`, alt: "GitHub repo summarizer UI" }],
    thumbnail: `${LOCAL_IMG_BASE}/github_repo_summarizer_ext.png`
  },
  {
    id: 16,
    title: "ChatGPT/Deepseek/AIStudio Navigator",
    description: "Chrome extension with keyboard scrollbar, prompt autocomplete, and sharing.",
    longDescription: "Adds a keyboard-driven scrollbar with message dots, lightweight prompt autocomplete, and prompt sharing/ranking for ChatGPT/Deepseek/Google AI Studio.",
    keyFeatures: ["Improved chat navigation", "Prompt autocomplete", "Community-ranked prompts"],
    techStack: ["Chrome Extension", "JavaScript", "UI/UX"],
    links: [
      { text: "Visit Webpage", url: "https://aichatnavigator.online" },
      { text: "View on Chrome Web Store", url: "https://chromewebstore.google.com/detail/chatgpt-scrollbar/jnoonpeekddinkiecaonhocaflcgbhap?pli=1" }
    ],
    images: [
      { url: `${GITHUB_IMG_BASE_URL}/scroller.gif`, alt: "ChatGPT Scrollbar Demo" },
      { url: `${GITHUB_IMG_BASE_URL}/nav/navigator_chrome.png`, alt: "Navigator Chrome" }
    ],
    thumbnail: `${GITHUB_IMG_BASE_URL}/scroller.gif`
  },
  {
    id: 17,
    title: "Task Zavod – Micro-Task Marketplace",
    description: "VLM-powered micro-task builder with Telegram + web worker flows.",
    longDescription: "Business users define tasks in free-form text; VLMs structure them and auto-approve payouts. Workers use web or Telegram, backed by Tornado + SQLite.",
    keyFeatures: ["VLM-powered task structuring", "Automated approval & payout", "Web & Telegram interfaces"],
    techStack: ["Tornado", "SQLite", "OpenAI", "VLM", "Telegram Bot API"],
    links: [{ text: "Try App", url: "https://mcp-taskforge-1095464065298.us-central1.run.app/task_zavod" }],
    images: [
      { url: `${GITHUB_IMG_BASE_URL}/task_zavod/task_zavod.jpg`, alt: "Task Zavod example" },
      { url: `${GITHUB_IMG_BASE_URL}/task_zavod/task_zavod2.jpg`, alt: "Task Zavod example 2" }
    ],
    thumbnail: `${GITHUB_IMG_BASE_URL}/task_zavod/task_zavod.jpg`
  },
  {
    id: 18,
    title: "Trending Prompts Feed",
    description: "Reddit-style board with trending scores and extension integration.",
    longDescription: "Crowdsourced prompt feed with real-time trending, built on Tornado and integrated with the Navigator extension for prompt suggestions.",
    keyFeatures: ["Crowdsourced prompt engineering", "Real-time trending", "Browser extension integration"],
    techStack: ["Tornado", "JavaScript", "Community-driven content"],
    links: [{ text: "Live Demo", url: "https://mcp-taskforge-1095464065298.us-central1.run.app/prompts_feed" }],
    images: [{ url: `${GITHUB_IMG_BASE_URL}/trending_prompts/trending_prompts.png`, alt: "Prompts Feed" }],
    thumbnail: `${GITHUB_IMG_BASE_URL}/trending_prompts/trending_prompts.png`
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
    links: [{ text: "Live Demo", url: "https://lastadjust-1095464065298.europe-north1.run.app" }],
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
    links: [{ text: "Live Demo", url: "https://locaboostai-1095464065298.europe-north1.run.app" }],
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
    links: [{ text: "Live Demo", url: "https://aetheria-1095464065298.us-east1.run.app" }],
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
    links: [{ text: "Live Demo", url: "https://chronoscribe-1095464065298.us-east1.run.app" }],
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
    links: [{ text: "Live Demo", url: "https://mcp-server-1095464065298.us-east1.run.app" }],
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
    links: [{ text: "Live Demo", url: "https://tool-calls-1095464065298.us-east1.run.app" }],
    images: [{ url: `${LOCAL_IMG_BASE}/tool_calls.png`, alt: "Tool calling playground" }],
    thumbnail: `${LOCAL_IMG_BASE}/tool_calls.png`
  },
  {
    id: 28,
    title: "Project18 Automation Stack",
    description: "Ready-to-launch Telegram bot + Mini App + lead funnel powered by agentic workflows.",
    longDescription: "Bundle that spins up a Telegram bot, Mini App, and AI lead funnel in minutes. Unifies orchestration, reusable MCP tools, multi-tenant data, and telemetry guardrails.",
    keyFeatures: [
      "Instant Telegram bot & Mini App deployment",
      "Agentic workflows nurturing inbound leads",
      "Unified telemetry and safety guardrails",
      "Bundled delivery across clients, data, and operations"
    ],
    techStack: ["GPT-5 orchestration", "MCP tools", "Multi-tenant data stores", "Telemetry guardrails"],
    links: [{ text: "Live Demo", url: "https://project018-mcp-1095464065298.us-east1.run.app/" }],
    images: [{ url: `${GITHUB_IMG_BASE_URL}/build_auto/project018.png`, alt: "Project18 automation stack" }],
    thumbnail: `${GITHUB_IMG_BASE_URL}/build_auto/project018.png`,
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
  }
];
