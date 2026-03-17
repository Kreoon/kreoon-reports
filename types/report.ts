// ═══ Core Report Data ═══
export interface ReportData {
  id: string;
  created_at: string;
  expires_at: string;
  platform: Platform;
  content_type: ContentType;
  original_url: string;
  creator_username: string;
  creator_followers: number | null;
  duration_seconds: number | null;
  caption: string;
  hashtags: string[];
  metrics: Metrics;
  drive_video_url: string | null;
  drive_media_id: string | null;
  gemini_analysis: GeminiAnalysis;
  strategic_analysis: StrategicAnalysis;
  verdict: Verdict;
  scores: Scores;
  wizard_config: WizardConfig | null;
  replicas: Replicas | null;
  production_guide: ProductionGuide;
  publish_strategy: PublishStrategy;
  success_metrics: SuccessMetrics;
  teleprompter_script: string | null;
  branding: Branding;
}

export type Platform = 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'linkedin' | 'facebook';
export type ContentType = 'reel' | 'post' | 'carousel' | 'story' | 'short' | 'video' | 'thread' | 'unknown';

// ═══ Metrics ═══
export interface Metrics {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  engagement_rate?: number;
}

// ═══ Scores ═══
export interface Scores {
  hook: number;
  copy: number;
  strategy: number;
  production: number;
  virality: number;
  total: number;
  replication_difficulty: number;
}

// ═══ Gemini Visual Analysis ═══
export interface GeminiAnalysis {
  transcription: string;
  scenes: GeminiScene[];
  production: ProductionSpecs;
  emotional_timeline: EmotionalPoint[];
  full_analysis: string;
}

export interface GeminiScene {
  time_start: string;
  time_end: string;
  shot: string;
  camera: string;
  action: string;
  text_on_screen: string | null;
  emotional_energy: number; // 1-10
  emotion: string;
}

export interface ProductionSpecs {
  lighting: string;
  audio: string;
  quality: number;
  editing: string;
  cuts_per_minute: number;
  aspect_ratio: string;
}

export interface EmotionalPoint {
  timestamp: string;
  energy: number;
  emotion: string;
}

// ═══ Strategic Analysis (12 Dimensions) ═══
export interface StrategicAnalysis {
  structure: {
    hook: DimensionData;
    development: DimensionData;
    cta: DimensionData;
    format: DimensionData;
  };
  copy: {
    formula: DimensionData & { detected: string; confidence: number };
    power_words: DimensionData & { words: PowerWord[] };
    mental_triggers: DimensionData & { used: string[]; missing: string[] };
    tone: DimensionData & { brain: BrainTriune; disc: string };
  };
  strategy: {
    funnel: DimensionData & { stage: 'TOFU' | 'MOFU' | 'BOFU'; schwartz: number };
    pillar: DimensionData & { breakdown: PillarBreakdown[] };
    sales_angle: DimensionData & { pain: string; desire: string; transformation: string; maslow: string };
    virality: DimensionData & { pattern: string; emotion: string; shareability: string };
  };
  raw_text: string;
}

export interface DimensionData {
  score: number;
  description: string;
  tags?: string[];
  recommendation?: string;
}

export interface PowerWord {
  word: string;
  effect: string;
  category: 'urgency' | 'trust' | 'desire' | 'ease' | 'fear' | 'social';
}

export interface BrainTriune {
  reptilian: number;
  limbic: number;
  neocortex: number;
}

export interface PillarBreakdown {
  pillar: 'Educar' | 'Entretener' | 'Inspirar' | 'Vender';
  percentage: number;
}

// ═══ Verdict ═══
export interface Verdict {
  works: VerdictItem[];
  improve: VerdictItem[];
  opportunity: VerdictItem;
}

export interface VerdictItem {
  title: string;
  description: string;
  action?: string;
}

// ═══ Wizard & Replicas ═══
export interface WizardConfig {
  topic: string;
  objective: 'alcance' | 'leads' | 'venta' | 'autoridad';
  platform: string;
}

export interface Replicas {
  faithful: ReplicaVersion;
  improved: ReplicaVersion & { improvements: string[]; triggers_added: string[]; neurocopy_changes: string[] };
  kreoon: ReplicaVersion & { storybrand: StoryBrand; creator_brief: CreatorBrief };
}

export interface ReplicaVersion {
  hook: string;
  script: ScriptLine[];
  caption: string;
  hashtags: string;
  production_notes: string;
}

export interface ScriptLine {
  time: string;
  text: string;
  direction: string;
  on_screen_text?: string;
  section: 'hook' | 'development' | 'cta' | 'transition';
}

export interface StoryBrand {
  hero: string;
  guide: string;
  plan: string;
  cta: string;
  success: string;
  failure: string;
}

export interface CreatorBrief {
  brand: string;
  product: string;
  objective: string;
  platform: string;
  duration: string;
  key_messages: string[];
  dos: string[];
  donts: string[];
  deliverables: string[];
}

// ═══ Production Guide ═══
export interface ProductionGuide {
  checklist: ChecklistGroup[];
  script_timeline: ScriptLine[];
  setup: TechnicalSetup;
  music: MusicSuggestion;
}

export interface ChecklistGroup {
  group: string;
  items: string[];
}

export interface TechnicalSetup {
  camera: string;
  resolution: string;
  lighting: string;
  audio: string;
  background: string;
  editing: string;
}

export interface MusicSuggestion {
  type: string;
  name: string | null;
  trending: boolean;
  volume_recommendation: string;
  source: string;
}

// ═══ Publish Strategy ═══
export interface PublishStrategy {
  best_day: string;
  best_time: string;
  timezone: string;
  reason: string;
  post_actions: PostAction[];
  caption_final: string;
  hashtags_final: string[];
  repurposing: RepurposingItem[];
  week_plan: WeekPlanDay[];
}

export interface PostAction {
  minutes_after: number;
  action: string;
}

export interface RepurposingItem {
  platform: string;
  format: string;
  adaptation: string;
}

export interface WeekPlanDay {
  day: string;
  content: string;
}

// ═══ Success Metrics ═══
export interface SuccessMetrics {
  kpis: KPI[];
  benchmarks: BenchmarkData;
  evaluation_timeline: EvaluationMilestone[];
  plan_b: string[];
}

export interface KPI {
  metric: string;
  target: string;
  evaluate_at: string;
  status: 'pending' | 'met' | 'missed';
}

export interface BenchmarkData {
  er_average: number;
  good_post: number;
  viral_threshold: number;
  platform: string;
}

export interface EvaluationMilestone {
  label: string;
  checks: string[];
}

// ═══ Branding ═══
export interface Branding {
  show_kreoon: boolean;
  primary_color: string;
}
