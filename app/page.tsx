import { RelationshipGraph } from '@/components/relationship-graph';

const pillars = [
  {
    title: 'Graph interaction',
    description: 'Drag the map, click a person, and inspect live relationship context without leaving the canvas.'
  },
  {
    title: 'Memory + reminders',
    description: 'Each selected node surfaces notes, cadence, and reminder cards so the graph behaves like an operating system.'
  },
  {
    title: 'AI drafting',
    description: 'The right panel now reserves explicit room for message generation instead of leaving AI as a vague future placeholder.'
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ink bg-grid-fade text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-6 py-10 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-100">
              Build 02 · Relationship intelligence workspace
            </span>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Continue the build with a usable graph workspace, not just a landing shell.
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-300">
                This iteration turns the prototype into a relationship operations dashboard: interactive graph on the left,
                actionable contact memory on the right, and an explicit slot for AI-generated follow-up drafts.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {pillars.map((pillar) => (
                <article
                  key={pillar.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-100/80">{pillar.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{pillar.description}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-6 shadow-neon backdrop-blur-xl">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-violet-200/70">What changed in this pass</p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Selection-aware contact detail panel</li>
                <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Reminder cards and recent timeline for each contact</li>
                <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">AI draft prompt block wired to the selected node</li>
                <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Dashboard-style stats above the graph canvas</li>
              </ul>
            </div>
          </aside>
        </div>

        <RelationshipGraph />
      </section>
    </main>
  );
}
