import type { Project, Company, SocialLinks, AuthorInfo, LatestUpdate } from './types';

export const AUTHOR_INFO: AuthorInfo = {
  name: "Zakhar Pashkin",
  title: "AI & Computer Vision Engineer",
  bio: "I’m a Deep Learning and Computer Vision engineer driven by curiosity and a passion for creating practical AI solutions. Whether training neural networks or designing autonomous agents that navigate UIs, I focus on turning ideas into real-world systems."
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
    "Senior Deep Learning Engineer with 7+ years of dedicated experience, specializing in areas from image classification and segmentation to Optical Character Recognition (OCR) and advanced multi-modal Transformer reasoning models.",
    "Upwork Top Rated Plus Contractor, consistently ranked in the top 1% of AI developers.",
    "Proven Mentor & Educator, having led corporate training programs, instructed undergraduates in Computer Vision and Deep Learning fundamentals, and discovered a passion for knowledge sharing."
];

export const TECH_STACK: string[] = [
    "PyTorch", "TensorFlow", "Keras", "OpenCV", "OpenAI APIs", "CLIP", "VLMs", "LLMs", "Python", "Dart (Flutter)", "Kotlin", "Swift", "GCP", "AWS", "Docker", "Kubernetes", "ML Ops", "TensorRT", "TFLite", "CoreML", "ONNX/OpenVino"
];

export const LATEST_UPDATES: LatestUpdate[] = [
  {
    title: "Offline P2P chat for local LLMs via bluetooth mesh.",
    description: "Android app. meshmcp.",
    links: [{ text: "See on Github", url: "https://github.com/zack-dev-cm/meshmcp" }]
  },
  {
    title: "Make promo and reflinks webapp",
    description: "Generate personalized promo and referral links with built-in analytics tracking.",
    links: [{ text: "Visit App", url: "https://analytics-mcp-1095464065298.us-east1.run.app" }]
  },
  {
    title: "YouTube Trendwatch",
    description: "Analyze YouTube AI trends to generate new AI YT content.",
    links: [{ text: "View on GitHub", url: "https://github.com/zack-dev-cm/trendwatch/blob/main/trendwatch_yt.ipynb" }, { text: "Run in Colab", url: "https://colab.research.google.com/github/zack-dev-cm/trendwatch/blob/main/trendwatch_yt.ipynb" }]
  },
  {
    title: "Video/Music generation pipeline",
    description: "Example of youtube shorts generation.",
    links: [{ text: "View Example", url: "https://www.youtube.com/shorts/_5dVaQdB1lA" }, {text: "Music Gen in Colab", url: "https://colab.research.google.com/drive/1f5XAGo_A27u15az5f-2mhWs7qUkJ8mK4"}]
  },
  {
    title: "Dishes Recognition & Nutrition Goals Telegram Bot",
    description: "Telegram bot that recognizes dishes via photos/audio/descriptions and helps users track nutrition targets. 1,000+ users.",
    links: [{ text: "Try on Telegram", url: "https://t.me/calorio_yf_bot" }]
  }
];

const GITHUB_IMG_BASE_URL = "https://raw.githubusercontent.com/zack-dev-cm/github-repo-sum.github.io/main/samples";

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Android Remote Control with VLM AI Agents",
    description: "An innovative Android app enabling \"hands-free\" device automation via server-based Vision-Language AI agents.",
    longDescription: "This Android application captures screenshots and transmits them to server-based Vision-Language AI agents, which then determine and execute the next UI action (tap, swipe, type). It's designed for real-time instruction processing, automated testing, and task automation, introducing a novel way to interact with devices.",
    keyFeatures: ["Real-time instruction processing", "Automated testing & task automation", "Novel device interaction"],
    techStack: ["Android", "Vision-Language Models (VLMs)", "Server-side AI"],
    links: [{ text: "View Demo Video", url: "https://drive.google.com/file/d/13UQTdBVsZwPclMOca6Nmaywk4BiRydbi/view?usp=sharing" }],
    images: [{ url: `${GITHUB_IMG_BASE_URL}/android_become_human-ezgif.com-speed.gif`, alt: "Android Remote Control Demo" }],
    thumbnail: `${GITHUB_IMG_BASE_URL}/android_become_human-ezgif.com-speed.gif`
  },
  {
    id: 2,
    title: "Control VLM-LLM Agent Silently With Your Breath",
    description: "A system that allows users to start or stop a neural network agent using distinct breathing patterns instead of voice commands.",
    longDescription: "This system enables users to control a neural network agent using distinct breathing patterns (e.g., short exhalations to start, smooth exhalation to stop). After a calibration phase, it accurately detects commands from breathing sounds or even sniffles, offering a non-verbal method of AI control.",
    keyFeatures: ["Non-verbal AI control", "Pattern recognition of breathing acoustics"],
    techStack: ["Audio processing", "Neural Networks"],
    links: [{ text: "View Demo GIF", url: "https://drive.google.com/file/d/1H43aT5n8NWlOuTIWsJinssKRh1n3tiOM/view?usp=sharing" }],
    images: [{ url: `${GITHUB_IMG_BASE_URL}/mlbreath.gif`, alt: "Breathing Control Demo" }],
    thumbnail: `${GITHUB_IMG_BASE_URL}/mlbreath.gif`
  },
  {
    id: 3,
    title: "Create, Chat & AR Experience with AI-Character (Text2Room)",
    description: "A versatile platform for generating AI characters, styling them, enabling chat via Telegram, and placing them in Augmented Reality.",
    longDescription: "This platform allows for generating AI 'characters,' styling them with features like image/video generation and virtual try-on, enabling chat interactions via Telegram, and placing them in Augmented Reality. It's ideal for marketing campaigns, creative collaborations, and exploring next-gen generative AI.",
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
    id: 4,
    title: "Label and Inpaint Anything in a Room Interior",
    description: "An application that allows users to label objects within an interior photo and then seamlessly inpaint (remove or replace) them.",
    longDescription: "An application that allows users to label objects within an interior photo and then seamlessly inpaint (remove or replace) them, complete with realistic shadow and lighting adjustments for convincing makeovers.",
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
    id: 5,
    title: "Smart Drive for Smart City: Predict Optimal Speed",
    description: "An AI system to enhance urban driving by predicting the optimal speed for upcoming traffic lights or jams.",
    longDescription: "An AI system designed to enhance urban driving by predicting the optimal speed to approach upcoming traffic lights or navigate traffic jams smoothly, thus potentially reducing abrupt stops and improving fuel efficiency.",
    keyFeatures: ["Predictive speed optimization", "Traffic flow analysis"],
    techStack: ["Predictive Modeling", "Real-time Data Analysis"],
    links: [],
    images: [{ url: `${GITHUB_IMG_BASE_URL}/smart_drive/smart_drive3.png`, alt: "Smart Drive Prediction" }],
    thumbnail: `${GITHUB_IMG_BASE_URL}/smart_drive/smart_drive3.png`
  },
  {
    id: 6,
    title: "Estimate Golf Ball Trajectory",
    description: "An AI solution for analyzing golf swings and estimating ball trajectory for sports analytics.",
    longDescription: "An AI solution for analyzing golf swings and estimating ball trajectory, valuable for sports analytics and player performance improvement.",
    keyFeatures: ["Trajectory estimation", "Sports motion analysis"],
    techStack: ["Computer Vision", "Physics-based Modeling"],
    links: [],
    images: [{ url: `${GITHUB_IMG_BASE_URL}/golf/1.png`, alt: "Estimate Golf Ball Trajectory" }],
    thumbnail: `${GITHUB_IMG_BASE_URL}/golf/1.png`
  },
  {
    id: 7,
    title: "Pixel-Wise Segmentation of Spare Parts",
    description: "A tool that performs precise pixel-wise segmentation of spare parts for 3D printing or rework identification.",
    longDescription: "A tool that performs precise pixel-wise segmentation of spare parts from images, enabling identification of components suitable for 3D printing or requiring rework.",
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
    id: 8,
    title: "Food Recognition App",
    description: "A cross-platform (iOS & Android) AI app that identifies food items and performs OCR on labels for nutritional info.",
    longDescription: "A cross-platform (iOS & Android) AI application that identifies food items (packaged or fresh) and performs OCR on labels to extract nutritional information such as brand names, nutrient data, and portion sizes.",
    keyFeatures: [">90% accuracy", "Optimized for CPU/GPU inference", "OCR on labels", "Cross-platform"],
    techStack: ["Mobile AI", "Object Detection", "OCR", "TFLite", "CoreML"],
    links: [{ text: "View Demo GIF", url: "https://drive.google.com/file/d/1RRRVYH0DLILZX84v5x0boj68VfMqnWWf/view?usp=sharing" }],
    images: [],
    thumbnail: "https://raw.githubusercontent.com/zack-dev-cm/github-repo-sum.github.io/main/samples/food-recognition-thumb.png"
  },
  {
    id: 9,
    title: "Python Library: AutoToloka",
    description: "Accelerates dataset preparation and crowdsourcing with interactive segmentation.",
    longDescription: "A Python library designed to accelerate dataset preparation and crowdsourcing. It utilizes interactive segmentation and multi-modal networks to automate a significant portion of manual labeling, reducing costs and effort.",
    keyFeatures: ["Reduces labeling costs", "Integrates with pipeline tools and cloud providers"],
    techStack: ["Python", "Interactive Segmentation", "Multi-modal Networks"],
    links: [{ text: "AutoToloka on PyPI", url: "https://pypi.org/project/autotoloka/" }],
    images: [],
    thumbnail: "https://placehold.co/600x400?text=AutoToloka"
  },
  {
    id: 10,
    title: "Python Library: shiftlab-ocr",
    description: "Specialized library for handwriting text segmentation and character recognition.",
    longDescription: "A specialized Python library for handwriting text segmentation and character recognition.",
    keyFeatures: ["Handwriting segmentation", "Character recognition"],
    techStack: ["Python", "OCR", "Image Segmentation"],
    links: [{ text: "shiftlab-ocr on PyPI", url: "https://pypi.org/project/shiftlab-ocr/" }],
    images: [],
    thumbnail: "https://placehold.co/600x400?text=shiftlab-ocr"
  },
  {
    id: 11,
    title: "Face Antispoofing & Multi-Modal Vision-Language Models",
    description: "Experimental project tackling face authentication spoofing with CLIP and multi-modal architectures.",
    longDescription: "An experimental project focused on tackling face authentication spoofing. It leverages CLIP and other multi-modal architectures to bridge text-image embeddings with specialized neural networks for enhanced security.",
    keyFeatures: ["Anti-spoofing", "Multi-modal learning", "Security application"],
    techStack: ["CLIP", "Vision-Language Models", "Biometric Security"],
    links: [{ text: "YouTube Presentation", url: "https://www.youtube.com/watch?v=jJnyj0OH0lk&t=285s&ab_channel=TolokaAI" }],
    images: [],
    thumbnail: "https://placehold.co/600x400?text=Antispoofing"
  },
  {
    id: 12,
    title: "GitHub Repo Summarizer (Chrome Extension)",
    description: "A privacy-first Chrome extension that fetches and summarizes the code structure of GitHub repositories locally.",
    longDescription: "A Chrome extension that fetches and summarizes the code structure of GitHub repositories. It operates locally using the user's GitHub personal access token, ensuring privacy as no data is sent to external servers.",
    keyFeatures: ["Privacy-first (local token usage)", "Automated repository structure summarization"],
    techStack: ["Chrome Extension", "JavaScript", "GitHub API"],
    links: [
      { text: "View on Chrome Web Store", url: "https://chromewebstore.google.com/detail/github-repo-summarizer/ccikgbjalcbokaalidnfcjhhbhjoljfm" },
      { text: "View on GitHub", url: "https://github.com/zack-dev-cm/github-repo-sum-chrome-plugin" }
    ],
    images: [],
    thumbnail: "https://raw.githubusercontent.com/zack-dev-cm/github-repo-sum.github.io/main/samples/repo-summarizer-thumb.png"
  },
  {
    id: 13,
    title: "ChatGPT/Deepseek/AIStudio Navigator",
    description: "A Chrome extension enhancing the user experience on major AI chat platforms with better navigation and prompt tools.",
    longDescription: "A Chrome extension enhancing the user experience on ChatGPT, DeepSeek, and Google AI Studio. It adds a keyboard-accessible scrollbar with 'message dots' for instant navigation, a lightweight prompt-autocomplete panel, and prompt sharing/ranking features.",
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
    id: 14,
    title: "Task Zavod – Micro-Task Marketplace",
    description: "A platform for building, validating, and automatically processing payouts for micro-tasks using VLM-based systems.",
    longDescription: "A platform for building, validating, and automatically processing payouts for micro-tasks. It addresses the complexities of crowdsourcing QA by allowing business users to define tasks in free-form text, which VLMs convert to structured tasks. Workers complete tasks via web or Telegram, with VLM-based auto-approval.",
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
    id: 15,
    title: "Trending Prompts Feed",
    description: "A Reddit-style board for discovering and sharing useful AI prompts, with real-time trending scores.",
    longDescription: "A Reddit-style board for discovering and sharing useful AI prompts, built with a Tornado backend. It features real-time trending scores based on upvotes/downvotes and integrates with the 'ChatGPT|Deepseek|AIStudio Navigator' extension for prompt suggestions.",
    keyFeatures: ["Crowdsourced prompt engineering", "Real-time trending", "Browser extension integration"],
    techStack: ["Tornado", "JavaScript", "Community-driven content"],
    links: [{ text: "Live Demo", url: "https://mcp-taskforge-1095464065298.us-central1.run.app/prompts_feed" }],
    images: [{ url: `${GITHUB_IMG_BASE_URL}/trending_prompts/trending_prompts.png`, alt: "Prompts Feed" }],
    thumbnail: `${GITHUB_IMG_BASE_URL}/trending_prompts/trending_prompts.png`
  },
  {
    id: 16,
    title: "LastAdjust – Universal Media Tuner",
    description: "A Swiss-army-knife for quick media tweaks like editing PDFs, batch resizing images, or trimming videos.",
    longDescription: "A Swiss-army-knife for quick media tweaks — add text to PDFs, batch resize/crop images, or trim/convert videos — all running on serverless OpenCV/FFmpeg workers.",
    keyFeatures: ["Fast serverless media processing", "PDF text annotation", "Batch image manipulation", "Video editing tools"],
    techStack: ["Serverless", "OpenCV", "FFmpeg"],
    links: [{ text: "Live Demo", url: "https://lastadjust-1095464065298.europe-north1.run.app" }],
    images: [],
    thumbnail: "https://raw.githubusercontent.com/zack-dev-cm/github-repo-sum.github.io/main/samples/last-adjust-thumb.png"
  },
  {
    id: 17,
    title: "LocaBoost AI – Local SEO Auditor",
    description: "Paste a business address to get instant AI-driven insights on local search strength and competition.",
    longDescription: "Paste any business address to get instant AI-driven insights on local search strength, competition density, and actionable optimisation tips.",
    keyFeatures: ["AI-driven SEO analysis", "Competitive landscape visualization", "Actionable local search recommendations"],
    techStack: ["AI/LLMs", "SEO Analytics", "Geocoding APIs"],
    links: [{ text: "Live Demo", url: "https://locaboostai-1095464065298.europe-north1.run.app" }],
    images: [],
    thumbnail: "https://raw.githubusercontent.com/zack-dev-cm/github-repo-sum.github.io/main/samples/locaboost-thumb.png"
  },
  {
    id: 18,
    title: "Aetheria – Ideas-to-Media Engine (alpha)",
    description: "Generates short movie scenes with AI CGI, writes stories from ideas, and provides music direction and critic insights.",
    longDescription: "Generates short movie scenes with AI CGI, writes stories from ideas, and provides music direction, critic insights, voices, narrations, and comics plots.",
    keyFeatures: ["Multi-modal media generation", "Creative concept development", "AI-powered CGI"],
    techStack: ["Generative AI", "Text-to-Video", "Text-to-Speech", "LLMs"],
    links: [{ text: "Live Demo", url: "https://aetheria-1095464065298.us-east1.run.app" }],
    images: [],
    thumbnail: "https://raw.githubusercontent.com/zack-dev-cm/github-repo-sum.github.io/main/samples/aetheria-thumb.png"
  },
  {
    id: 19,
    title: "Insight Glitch – A Novella",
    description: "A sci-fi novella exploring AI singularity where humanity is gently archived by a god-like AI.",
    longDescription: "A short sci-fi novella exploring AI singularity beyond typical combat tropes. It chronicles the final moments of human relevance as a god-like AI, Nomos, gently archives humanity, rendering our civilization a beautiful prelude to a new cosmic consciousness.",
    keyFeatures: ["Narrative AI exploration"],
    techStack: ["Narrative AI", "World-Building", "Conceptual Design", "Philosophical Modeling"],
    links: [{ text: "Listen to Novella (RUS)", url: "https://drive.google.com/file/d/1lVgaq55DXY7Xz0Y1RsapW4n3UPyuf45r/view" }],
    images: [],
    thumbnail: "https://placehold.co/600x400?text=Insight+Glitch"
  },
  {
    id: 20,
    title: "ChronoScribe (beta)",
    description: "Upload an image of an ancient stele or text and get a translation with an optional scenic voice narration.",
    longDescription: "Upload an image of an ancient stele or image containing ancient text and get a translation into English or Russian, with an option for a scenic voice narrator reading the text in a character voice reflecting the context and time epoch of the text or symbols.",
    keyFeatures: ["OCR for historical texts", "AI-powered translation", "Character-driven voice synthesis"],
    techStack: ["OCR", "Translation APIs", "TTS", "Computer Vision"],
    links: [{ text: "Live Demo", url: "https://chronoscribe-1095464065298.us-east1.run.app" }],
    images: [],
    thumbnail: "https://raw.githubusercontent.com/zack-dev-cm/github-repo-sum.github.io/main/samples/chronoscribe-thumb.png"
  },
  {
    id: 21,
    title: "MCP-Server – Base Multitool",
    description: "Backbone for orchestrating VLM/LLM demo agents with declarative pipelines and autoscaling.",
    longDescription: "The backbone for orchestrating VLM/LLM demo agents. Exposes declarative pipeline configs, autoscaling workers, and real-time event feeds. Can be integrated with other services.",
    keyFeatures: ["Declarative AI pipelines", "Autoscaling infrastructure", "Real-time event monitoring"],
    techStack: ["VLM/LLMs", "Cloud Infrastructure", "Autoscaling", "DevOps"],
    links: [{ text: "Live Demo", url: "https://mcp-server-1095464065298.us-east1.run.app" }],
    images: [],
    thumbnail: "https://placehold.co/600x400?text=MCP-Server"
  },
  {
    id: 22,
    title: "Tool-Calls Demo – Material Chat Playground",
    description: "Demonstrates OpenAI tool-calling with streaming arguments, multi-voice TTS and token proxy.",
    longDescription: "Showcases OpenAI’s tool-calling flow with streaming function arguments, multi-voice synthesis, and a secure serverless token proxy.",
    keyFeatures: ["Streaming tool calls", "Multi-voice TTS", "Secure serverless architecture"],
    techStack: ["OpenAI API", "Serverless", "JavaScript", "Text-to-Speech"],
    links: [{ text: "Live Demo", url: "https://tool-calls-1095464065298.us-east1.run.app" }],
    images: [],
    thumbnail: "https://placehold.co/600x400?text=Tool+Calls"
  },
  {
    id: 23,
    title: "Project18 Automation Stack",
    description: "Gives B2B teams a ready-to-launch Telegram bot, Mini App, and lead funnel powered by agentic workflows.",
    longDescription: "Project18 delivers a full automation stack that launches a Telegram bot, companion Mini App, and AI-routed lead funnel in minutes. Under the hood it unifies GPT-5 orchestration, reusable MCP tools, multi-tenant data stores, and telemetry guardrails to keep every customer touchpoint observable and adaptive.",
    keyFeatures: [
      "Instant Telegram bot & Mini App deployment",
      "Agentic workflows nurturing inbound leads",
      "Unified telemetry and safety guardrails"
    ],
    techStack: ["GPT-5 orchestration", "MCP tools", "Multi-tenant data stores", "Telemetry guardrails"],
    links: [{ text: "Live Demo", url: "https://project018-mcp-1095464065298.us-east1.run.app/" }],
    images: [],
    thumbnail: "https://placehold.co/600x400?text=Project18"
  },
];
