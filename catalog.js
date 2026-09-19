/* =====================================================================
   Token Cost Coach: platform and model catalog
   ---------------------------------------------------------------------
   DATA ONLY. Edit this file to add platforms or update model names.
   Model names change often, so matching is done by model FAMILY (words like
   "opus", "flash", "nano") rather than exact version numbers.
   Last reviewed against providers' public model and pricing pages: 2026-09-19.
   Features are stated only where the provider documents them. null = not
   checked or not documented; the app then gives general advice instead.
   ===================================================================== */
var CATALOG_ASOF = "2026-09-19";

/* Model families: turn any model name from a bill, export or code into a size tier.
   small = cheapest and fastest, mid = everyday workhorse, top = most capable and most expensive. */
var FAMILIES = [
  { fam:/claude|haiku|sonnet|opus|fable|mythos/i, small:/haiku/i, mid:/sonnet/i, top:/opus|fable|mythos/i, dflt:"mid" },
  { fam:/gpt|chatgpt|\bo[134]\b|o[134]-|codex/i, small:/nano|4o-?mini|4\.1-?mini|3\.5-?turbo/i, mid:/mini|instant|4o|4\.1|oss/i, top:/gpt-?5|gpt-?6|gpt-?4(?![o.])|\bo[13]\b|\bo3|\bo4|pro|codex/i, dflt:"mid" },
  { fam:/gemini|gemma|imagen/i, small:/flash-?lite|lite|gemma|nano/i, mid:/flash/i, top:/pro|ultra/i, dflt:"mid" },
  { fam:/grok/i, small:/fast|mini|code|build/i, mid:/^$/, top:/4\.5|heavy|grok-?[56]/i, dflt:"mid" },
  { fam:/mistral|mixtral|codestral|devstral|magistral|ministral|pixtral/i, small:/small|nemo|ministral|\b[78]b\b/i, mid:/medium|codestral|devstral|pixtral/i, top:/large|magistral|8x22b/i, dflt:"mid" },
  { fam:/deepseek/i, small:/flash|chat|lite/i, mid:/^$/, top:/pro|reasoner|r1/i, dflt:"mid" },
  { fam:/llama/i, small:/\b(1|3|7|8|11)b\b|scout/i, mid:/maverick|70b/i, top:/405b|behemoth/i, dflt:"mid" },
  { fam:/qwen|qwq/i, small:/turbo|flash|mini|\b([0-9]|1[0-4])b\b/i, mid:/^$/, top:/max|235b|397b/i, dflt:"mid" },
  { fam:/kimi|moonshot/i, small:/lite|mini/i, mid:/^$/, top:/^$/, dflt:"mid" },
  { fam:/glm|zhipu/i, small:/air|flash/i, mid:/^$/, top:/^$/, dflt:"mid" },
  { fam:/minimax/i, small:/lite|mini/i, mid:/^$/, top:/^$/, dflt:"mid" },
  { fam:/nova|titan/i, small:/micro|lite/i, mid:/pro/i, top:/premier/i, dflt:"mid" },
  { fam:/command|cohere/i, small:/r7b|nano|light/i, mid:/command-?r(?!\+)/i, top:/command-?a|r-?plus|r\+/i, dflt:"mid" },
  { fam:/sonar|perplexity/i, small:/sonar(?!-?(pro|reason|deep))/i, mid:/sonar-?pro/i, top:/reason|deep/i, dflt:"mid" }
];

/* Platforms. kinds: app (chat app), api (pay per token), coding (coding assistant),
   cloud (big-cloud model hosting), host (fast hosting of open models), router (one key, many models),
   open (open-weight models you can self-host).
   names: how the platform is named in text. vendor: used to spot overlapping subscriptions.
   ladder: what to route easy / everyday / hardest work to (check current names).
   cache / batch: what the provider documents. */
var PLATFORMS = [
  /* ---- chat apps ---- */
  { id:"chatgpt", name:"ChatGPT", vendor:"OpenAI", kinds:["app"], names:["ChatGPT"], match:/chat ?gpt/i, popular:true,
    menu:[{n:"Instant (default)",tier:"small"},{n:"Thinking",tier:"mid"},{n:"Pro",tier:"top"}],
    habit:"In ChatGPT, use the default (Instant) model for everyday questions and drafts. Switch to Thinking or Pro only for hard reasoning, long analysis or tricky code." },
  { id:"claude-app", name:"Claude", vendor:"Anthropic", kinds:["app"], names:["Claude"], match:/\bclaude\b(?!\s*(code|api))/i, popular:true,
    menu:[{n:"Haiku (fast)",tier:"small"},{n:"Sonnet",tier:"mid"},{n:"Opus",tier:"top"}],
    habit:"In Claude, use Sonnet for most work and keep Opus for the hardest problems. Turn on extended thinking only when a question needs it." },
  { id:"gemini-app", name:"Gemini", vendor:"Google", kinds:["app"], names:["Gemini"], match:/\bgemini\b(?!\s*(api|cli))/i, popular:true,
    menu:[{n:"Fast",tier:"small"},{n:"Thinking",tier:"mid"},{n:"Pro",tier:"top"}],
    habit:"In Gemini, use the fast option for quick questions and switch to Pro or Thinking only when a question is hard." },
  { id:"ms-copilot", name:"Microsoft Copilot", short:"MS Copilot", vendor:"Microsoft", kinds:["app"], names:["Microsoft Copilot"], match:/(microsoft|m365|office|windows|bing) copilot|copilot (chat|pro)\b/i, popular:true, menu:[] },
  { id:"perplexity", name:"Perplexity", vendor:"Perplexity", kinds:["app","api"], names:["Perplexity"], match:/\bperplexity\b|\bsonar\b/i, popular:true,
    menu:[{n:"Quick search (Sonar)",tier:"small"},{n:"Pro search",tier:"mid"},{n:"Deep research / reasoning",tier:"top"}],
    habit:"In Perplexity, use quick search for simple lookups and save Pro or deep research for questions that need many sources." },
  { id:"grok-app", name:"Grok", vendor:"xAI", kinds:["app"], names:["Grok"], match:/\bgrok\b(?!\s*api)/i, popular:true, menu:[] },
  { id:"meta-ai", name:"Meta AI", vendor:"Meta", kinds:["app"], names:["Meta AI"], match:/meta ai/i, menu:[] },
  { id:"le-chat", name:"Le Chat (Mistral)", short:"Le Chat", vendor:"Mistral", kinds:["app"], names:["Le Chat"], match:/le chat/i, menu:[] },
  { id:"deepseek-app", name:"DeepSeek app", short:"DeepSeek app", vendor:"DeepSeek", kinds:["app"], names:["DeepSeek"], match:/deepseek (app|chat)\b/i, menu:[] },
  { id:"notion-ai", name:"Notion AI", vendor:"Notion", kinds:["app"], names:["Notion AI"], match:/notion ai/i, menu:[] },

  /* ---- model APIs ---- */
  { id:"openai-api", name:"OpenAI API", vendor:"OpenAI", kinds:["api"], names:["OpenAI"], match:/\bopenai\b|\bgpt-?[3-9]/i, popular:true,
    menu:[{n:"GPT-5.4 nano",tier:"small"},{n:"GPT-5.4 mini",tier:"mid"},{n:"GPT-5 mini",tier:"mid"},{n:"GPT-4o / 4.1 (older)",tier:"mid"},{n:"GPT-5.5",tier:"top"},{n:"GPT-5.5 Pro or o-series",tier:"top"}],
    ladder:{small:"GPT-5.4 nano",mid:"GPT-5.4 mini",top:"GPT-5.5"}, cache:"automatic", batch:true, reasoning:true },
  { id:"anthropic-api", name:"Anthropic API", vendor:"Anthropic", kinds:["api"], names:["Anthropic","Claude"], match:/\banthropic\b|claude api/i, popular:true,
    menu:[{n:"Haiku 4.5",tier:"small"},{n:"Sonnet 5",tier:"mid"},{n:"Sonnet 4.x",tier:"mid"},{n:"Opus 5",tier:"top"},{n:"Opus 4.x",tier:"top"},{n:"Fable 5",tier:"top"}],
    ladder:{small:"Haiku 4.5",mid:"Sonnet 5",top:"Opus 5"}, cache:"explicit", batch:true, reasoning:true },
  { id:"gemini-api", name:"Gemini API", vendor:"Google", kinds:["api"], names:["Gemini API","Gemini"], match:/gemini api|ai studio|generativelanguage/i, popular:true,
    menu:[{n:"3.1 Flash-Lite",tier:"small"},{n:"2.5 Flash-Lite",tier:"small"},{n:"3 Flash",tier:"mid"},{n:"2.5 Flash",tier:"mid"},{n:"3.1 Pro",tier:"top"},{n:"2.5 Pro",tier:"top"}],
    ladder:{small:"Gemini 3.1 Flash-Lite",mid:"Gemini 3 Flash",top:"Gemini 3.1 Pro"}, cache:"yes", batch:true, reasoning:true },
  { id:"xai-api", name:"xAI (Grok) API", short:"xAI API", vendor:"xAI", kinds:["api"], names:["Grok API","Grok"], match:/grok api|x\.ai|xai api/i,
    menu:[{n:"Grok 4.1 Fast",tier:"small"},{n:"Grok Code Fast",tier:"small"},{n:"Grok 4.3",tier:"mid"},{n:"Grok 4.5",tier:"top"}],
    ladder:{small:"Grok 4.1 Fast",mid:"Grok 4.3",top:"Grok 4.5"}, cache:"yes", batch:null, reasoning:true },
  { id:"mistral-api", name:"Mistral API", vendor:"Mistral", kinds:["api"], names:["Mistral"], match:/\bmistral\b|codestral|mixtral/i, popular:true,
    menu:[{n:"Small 4",tier:"small"},{n:"Medium 3.5",tier:"mid"},{n:"Codestral",tier:"mid"},{n:"Large 3",tier:"top"}],
    ladder:{small:"Mistral Small 4",mid:"Mistral Medium 3.5",top:"Mistral Large 3"}, cache:null, batch:null },
  { id:"deepseek-api", name:"DeepSeek API", vendor:"DeepSeek", kinds:["api"], names:["DeepSeek"], match:/\bdeepseek\b/i, popular:true,
    menu:[{n:"V4-Flash",tier:"small"},{n:"V4-Pro",tier:"top"}],
    ladder:{small:"V4-Flash",mid:"V4-Flash",top:"V4-Pro"}, cache:"automatic", batch:null, reasoning:true,
    habit:"DeepSeek's reasoning (thinking) mode is on by default and its thinking text is billed like output. Switch it off for routine requests." },
  { id:"cohere-api", name:"Cohere", vendor:"Cohere", kinds:["api"], names:["Cohere"], match:/\bcohere\b|command[- ]?(a|r)\b/i,
    menu:[{n:"Command R7B",tier:"small"},{n:"Command R",tier:"mid"},{n:"Command A",tier:"top"}], ladder:{small:"Command R7B",mid:"Command R",top:"Command A"}, cache:null, batch:null },

  /* ---- big-cloud model hosting ---- */
  { id:"bedrock", name:"Amazon Bedrock", short:"Bedrock", vendor:"Amazon", kinds:["cloud"], names:["Amazon Bedrock"], match:/bedrock|amazon nova/i, popular:true,
    menu:[{n:"Small model (Haiku, Nova Lite class)",tier:"small"},{n:"Mid model (Sonnet, Nova Pro class)",tier:"mid"},{n:"Top model (Opus, Nova Premier class)",tier:"top"}], cache:null, batch:null },
  { id:"azure-openai", name:"Azure OpenAI / AI Foundry", short:"Azure OpenAI", vendor:"Microsoft", kinds:["cloud"], names:["Azure OpenAI"], match:/azure (openai|ai)|ai foundry/i, popular:true,
    menu:[{n:"Small model (nano class)",tier:"small"},{n:"Mid model (mini class)",tier:"mid"},{n:"Top model (flagship or Pro)",tier:"top"}], cache:null, batch:null },
  { id:"vertex", name:"Google Vertex AI", short:"Vertex AI", vendor:"Google", kinds:["cloud"], names:["Vertex AI"], match:/vertex/i,
    menu:[{n:"Small model (Flash-Lite class)",tier:"small"},{n:"Mid model (Flash class)",tier:"mid"},{n:"Top model (Pro class)",tier:"top"}], cache:null, batch:null },

  /* ---- fast hosts and routers for open models ---- */
  { id:"groq", name:"Groq", vendor:"Groq", kinds:["host"], names:["Groq"], match:/\bgroq\b/i, menu:[{n:"Small open model",tier:"small"},{n:"Mid open model",tier:"mid"},{n:"Large open model",tier:"top"}] },
  { id:"together", name:"Together AI", short:"Together", vendor:"Together", kinds:["host"], names:["Together AI"], match:/together ai|together\.ai/i, menu:[{n:"Small open model",tier:"small"},{n:"Mid open model",tier:"mid"},{n:"Large open model",tier:"top"}] },
  { id:"fireworks", name:"Fireworks AI", short:"Fireworks", vendor:"Fireworks", kinds:["host"], names:["Fireworks AI"], match:/fireworks/i, menu:[{n:"Small open model",tier:"small"},{n:"Mid open model",tier:"mid"},{n:"Large open model",tier:"top"}] },
  { id:"cerebras", name:"Cerebras", vendor:"Cerebras", kinds:["host"], names:["Cerebras"], match:/cerebras/i, menu:[{n:"Small open model",tier:"small"},{n:"Mid open model",tier:"mid"},{n:"Large open model",tier:"top"}] },
  { id:"openrouter", name:"OpenRouter", vendor:"OpenRouter", kinds:["router"], names:["OpenRouter"], match:/openrouter/i, menu:[{n:"Cheap models",tier:"small"},{n:"Mid models",tier:"mid"},{n:"Frontier models",tier:"top"}] },
  { id:"open-weight", name:"Open-weight models (Llama, Qwen, Kimi, GLM, Gemma)", short:"Open-weight", vendor:"Open", kinds:["open"], names:["Open-weight model"], match:/llama|qwen|kimi|\bglm\b|gemma|gpt-oss|minimax|ollama|vllm/i,
    menu:[{n:"Small (up to about 14B)",tier:"small"},{n:"Mid (about 30 to 70B)",tier:"mid"},{n:"Large (Kimi, GLM, Qwen 235B, Llama 405B class)",tier:"top"}] },

  /* ---- coding assistants ---- */
  { id:"cursor", name:"Cursor", vendor:"Cursor", kinds:["coding"], names:["Cursor"], match:/\bcursor\b(?!\s*[:;])/i, popular:true,
    menu:[{n:"Auto / included models",tier:"small"},{n:"Premium models (Claude, GPT, Gemini)",tier:"mid"},{n:"MAX or top premium models",tier:"top"}] },
  { id:"github-copilot", name:"GitHub Copilot", short:"GitHub Copilot", vendor:"Microsoft", kinds:["coding"], names:["Copilot"], match:/github copilot|\bcopilot\b(?!\s*chat)/i, popular:true,
    menu:[{n:"Included models",tier:"small"},{n:"Premium models",tier:"mid"},{n:"Top premium models",tier:"top"}] },
  { id:"windsurf", name:"Windsurf", vendor:"Windsurf", kinds:["coding"], names:["Windsurf"], match:/windsurf/i,
    menu:[{n:"Default / included models",tier:"small"},{n:"Premium models",tier:"mid"},{n:"Top premium models",tier:"top"}] },
  { id:"claude-code", name:"Claude Code", vendor:"Anthropic", kinds:["coding"], names:["Claude Code"], match:/claude code/i, popular:true,
    menu:[{n:"Haiku",tier:"small"},{n:"Sonnet",tier:"mid"},{n:"Opus",tier:"top"}] },
  { id:"codex", name:"OpenAI Codex", vendor:"OpenAI", kinds:["coding"], names:["Codex"], match:/\bcodex\b/i,
    menu:[{n:"Codex mini",tier:"small"},{n:"Codex (default)",tier:"mid"},{n:"Top model (GPT-5.5)",tier:"top"}] },
  { id:"replit", name:"Replit", vendor:"Replit", kinds:["coding"], names:["Replit"], match:/\breplit\b/i, menu:[] },
  { id:"lovable", name:"Lovable", vendor:"Lovable", kinds:["coding"], names:["Lovable"], match:/\blovable\b/i, menu:[] }
];
