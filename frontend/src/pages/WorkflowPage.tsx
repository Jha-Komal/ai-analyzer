import { DatabaseIcon, BrainCircuitIcon, BarChart2Icon, LightbulbIcon, SparklesIcon, ArrowDownIcon, CheckCircleIcon } from 'lucide-react';

const STEPS = [
  {
    icon: DatabaseIcon,
    color: 'text-sky-400',
    bg: 'bg-sky-400/10 border-sky-400/20',
    glow: 'shadow-[0_0_20px_rgba(56,189,248,0.08)]',
    step: '01',
    title: 'Multi-Source Data Collection',
    description:
      'Reviews are ingested simultaneously from four public platforms — App Store, Google Play Store, Reddit, and X (Twitter). Each source is connected in real time, with reviews normalised into a unified schema regardless of original format.',
    details: [
      'App Store — star ratings + review text',
      'Google Play Store — version-aware reviews',
      'Reddit — community discussion threads',
      'X / Twitter — real-time social mentions',
    ],
    badge: '3,000+ reviews',
  },
  {
    icon: BrainCircuitIcon,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10 border-violet-400/20',
    glow: 'shadow-[0_0_20px_rgba(167,139,250,0.08)]',
    step: '02',
    title: 'AI-Powered Per-Review Analysis',
    description:
      'Every review is passed through GPT-4o-mini in batches of 10. The model extracts 11 structured dimensions from each review, producing a rich per-review data object saved to a local SQLite database.',
    details: [
      'Sentiment — positive / neutral / negative',
      'Emotion — frustrated, happy, confused…',
      'Themes — delivery, pricing, app usability…',
      'Pain Points — specific friction moments',
      'Shopping Habit — frequency & behaviour pattern',
      'Category Barrier — what stops exploration',
      'Experiment Likelihood — high / medium / low',
      'Feature Requests — explicit user asks',
      'Product Category — Fresh & Grocery, Electronics…',
      'Summary — one-sentence review distillation',
      'Confidence Score — 0–1 reliability signal',
    ],
    badge: '11 dimensions extracted',
  },
  {
    icon: BarChart2Icon,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/20',
    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.08)]',
    step: '03',
    title: 'Statistical Aggregation (No AI)',
    description:
      'All per-review analyses are aggregated into frequency distributions using pure code — no additional AI calls. This ensures the statistical layer is fast, deterministic, and fully auditable.',
    details: [
      'Sentiment distribution across all sources',
      'Top themes by mention frequency',
      'Top pain points ranked by occurrence',
      'Emotion profile across the user base',
      'Shopping habit segmentation',
      'Category barrier distribution',
      'Product category breakdown',
      'Sentiment trend over time (monthly)',
    ],
    badge: '8 distribution charts',
  },
  {
    icon: LightbulbIcon,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.08)]',
    step: '04',
    title: 'Evidence-Based Insight Generation',
    description:
      'Aggregated stats and a representative sample of 20 reviews are passed to GPT-4o-mini to answer 8 fixed research questions. The prompt enforces evidence-only answers — no invented reasoning. Questions are batched in pairs to stay within token limits.',
    details: [
      'Why do users buy from the same categories repeatedly?',
      'What prevents exploration of new categories?',
      'How do users discover products today?',
      'What role do habits play in purchasing behaviour?',
      'What information is needed before trying a new category?',
      'What frustrations emerge repeatedly?',
      'Which user segments experiment more?',
      'What unmet needs appear consistently?',
    ],
    badge: '8 research questions answered',
  },
  {
    icon: SparklesIcon,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10 border-rose-400/20',
    glow: 'shadow-[0_0_20px_rgba(251,113,133,0.08)]',
    step: '05',
    title: 'Priority-Tiered Recommendations',
    description:
      'Insights and aggregated stats are used to generate actionable product recommendations, ranked across four effort–impact tiers. Each recommendation includes a rationale grounded in the review data.',
    details: [
      'Quick Wins — high impact, low effort (1–2 weeks)',
      'Medium Priority — meaningful impact (1–3 months)',
      'High Priority — strategic value (3–6 months)',
      'Long-Term — transformative initiatives (6+ months)',
    ],
    badge: '8+ recommendations',
  },
];

const VALIDATION = [
  { label: 'Confidence scores', desc: 'Every insight carries a 0–1 confidence score based on evidence density' },
  { label: 'Supporting review IDs', desc: 'Each finding links back to specific review IDs used as evidence' },
  { label: 'Key findings ranked', desc: 'Findings within each insight are ranked by strength of evidence' },
  { label: 'Evidence type labelled', desc: 'Direct vs. inferred findings are explicitly separated' },
];

export function WorkflowPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground">AI Discovery Engine — How It Works</h2>
        <p className="text-sm text-muted-foreground">
          A five-stage pipeline that turns raw user reviews into evidence-backed product insights
        </p>
      </div>

      {/* Pipeline steps */}
      <div className="space-y-3">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="space-y-2">
              <div className={`rounded-xl border p-5 ${s.bg} ${s.glow} transition-all`}>
                <div className="flex items-start gap-4">
                  {/* Step number + icon */}
                  <div className="flex flex-col items-center gap-1 shrink-0 w-10">
                    <span className="text-xs font-bold text-muted-foreground/60 tracking-widest">{s.step}</span>
                    <div className={`rounded-lg p-2 border ${s.bg}`}>
                      <Icon className={`h-4 w-4 ${s.color}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${s.bg} ${s.color}`}>
                        {s.badge}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 pt-1">
                      {s.details.map((d, j) => (
                        <li key={j} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                          <CheckCircleIcon className={`h-3 w-3 mt-0.5 shrink-0 ${s.color}`} />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {i < STEPS.length - 1 && (
                <div className="flex justify-center">
                  <ArrowDownIcon className="h-4 w-4 text-muted-foreground/30" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Insight validation */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h3 className="text-sm font-bold text-foreground">How Insight Quality Is Validated</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {VALIDATION.map((v, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-muted/40 border border-border/50 p-3">
              <CheckCircleIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground">{v.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h3 className="text-sm font-bold text-foreground">Tech Stack</h3>
        <div className="flex flex-wrap gap-2">
          {['GPT-4o-mini', 'Node.js + Express', 'Prisma + SQLite', 'React + Vite', 'TailwindCSS', 'Recharts', 'Zod', 'OpenAI SDK'].map((t) => (
            <span key={t} className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted border border-border text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
