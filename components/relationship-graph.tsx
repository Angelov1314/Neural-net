'use client';

import { memo, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  Position,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type NodeMouseHandler,
  type NodeProps
} from 'reactflow';
import 'reactflow/dist/style.css';

type ContactNodeData = {
  name: string;
  role: string;
  warmth: 'Core' | 'Warm' | 'Active' | 'Watch';
  note: string;
  company: string;
  cadence: string;
  nextAction: string;
  aiDraft: string;
  tags: string[];
};

type Reminder = {
  label: string;
  due: string;
  owner: string;
};

type TimelineItem = {
  title: string;
  detail: string;
  timestamp: string;
};

type WorkspaceRecord = {
  summary: string;
  reminders: Reminder[];
  timeline: TimelineItem[];
};

const workspaceRecords: Record<string, WorkspaceRecord> = {
  central: {
    summary:
      'You are at the center of the graph. This workspace should quickly show who needs follow-up, what context matters, and what message to send next.',
    reminders: [
      { label: 'Review warm contacts', due: 'Today · 18:00', owner: 'You' },
      { label: 'Refresh AI summaries', due: 'Tomorrow · 09:30', owner: 'System' }
    ],
    timeline: [
      {
        title: 'Weekly relationship review',
        detail: 'Cluster contacts by warmth and upcoming asks.',
        timestamp: '2h ago'
      },
      {
        title: 'Knowledge graph sync',
        detail: 'Merged notes and reminder metadata from the latest session.',
        timestamp: 'Yesterday'
      }
    ]
  },
  advisor: {
    summary:
      'Trusted strategic advisor with high signal. Best touchpoints are concise monthly updates with a direct decision or ask at the end.',
    reminders: [
      { label: 'Send March update', due: 'Mar 26 · 10:00', owner: 'You' },
      { label: 'Add product launch note', due: 'Mar 25 · 16:00', owner: 'AI draft' }
    ],
    timeline: [
      {
        title: 'Call recap tagged',
        detail: 'Highlighted request for a sharper narrative around ICP traction.',
        timestamp: 'Today'
      },
      {
        title: 'Reminder created',
        detail: 'Monthly advisor sync created from conversation summary.',
        timestamp: '3 days ago'
      }
    ]
  },
  investor: {
    summary:
      'Active investor relationship. Prefers crisp metrics, confidence, and a clear pointer on where leverage or intros are needed.',
    reminders: [
      { label: 'Share KPI snapshot', due: 'Mar 24 · 08:30', owner: 'You' },
      { label: 'Prepare intro list', due: 'Mar 27 · 14:00', owner: 'Ops' }
    ],
    timeline: [
      {
        title: 'Deck link opened',
        detail: 'Investor reviewed updated memo and spent the longest time on the GTM slide.',
        timestamp: '4h ago'
      },
      {
        title: 'Draft suggested',
        detail: 'AI proposed a short investor check-in with 3 traction bullets.',
        timestamp: 'Yesterday'
      }
    ]
  },
  operator: {
    summary:
      'Potential operator/partner connection. Relationship is promising but still exploratory, so follow-ups should stay lightweight and specific.',
    reminders: [
      { label: 'Book demo follow-up', due: 'Mar 28 · 11:00', owner: 'You' },
      { label: 'Attach workflow mock', due: 'Mar 27 · 17:30', owner: 'Design' }
    ],
    timeline: [
      {
        title: 'Demo completed',
        detail: 'Positive response to reminder automation and contact memory features.',
        timestamp: 'Yesterday'
      },
      {
        title: 'Partner fit note',
        detail: 'Marked as watchlist pending stronger automation use case overlap.',
        timestamp: '5 days ago'
      }
    ]
  }
};

const warmthStyles: Record<ContactNodeData['warmth'], string> = {
  Core: 'border-cyan-400/40 bg-cyan-400/15 text-cyan-100',
  Warm: 'border-emerald-400/40 bg-emerald-400/15 text-emerald-100',
  Active: 'border-violet-400/40 bg-violet-400/15 text-violet-100',
  Watch: 'border-amber-400/40 bg-amber-400/15 text-amber-100'
};

const ContactNode = memo(({ data, selected }: NodeProps<ContactNodeData>) => {
  return (
    <div
      className={[
        'min-w-64 rounded-3xl border bg-slate-950/85 p-4 backdrop-blur-xl transition duration-300',
        selected ? 'border-cyan-300/60 shadow-neon' : 'border-white/10 shadow-[0_10px_40px_rgba(15,23,42,0.35)]'
      ].join(' ')}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/50">Contact</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{data.name}</h3>
          <p className="mt-1 text-sm text-slate-400">{data.company}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs ${warmthStyles[data.warmth]}`}>{data.warmth}</span>
      </div>
      <p className="text-sm text-slate-200">{data.role}</p>
      <p className="mt-3 text-sm leading-6 text-slate-400">{data.note}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {data.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          cadence {data.cadence}
        </span>
        <span>next: {data.nextAction}</span>
      </div>
    </div>
  );
});

ContactNode.displayName = 'ContactNode';

const nodeTypes = { contact: ContactNode };

const initialNodes: Node<ContactNodeData>[] = [
  {
    id: 'central',
    type: 'contact',
    position: { x: 380, y: 220 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      name: 'You',
      role: 'Founder / relationship operator',
      warmth: 'Core',
      company: 'Neural Net',
      cadence: 'Daily review',
      nextAction: 'Prioritize outreach',
      note: 'Track important people, surface context quickly, and prepare next-step outreach.',
      aiDraft: 'Summarize each cluster, rank urgency, and prepare short follow-up drafts for the top three contacts.',
      tags: ['hub', 'notes', 'ai-draft']
    }
  },
  {
    id: 'advisor',
    type: 'contact',
    position: { x: 20, y: 70 },
    sourcePosition: Position.Right,
    targetPosition: Position.Right,
    data: {
      name: 'Maya Chen',
      role: 'Strategic advisor',
      warmth: 'Warm',
      company: 'Northstar Studio',
      cadence: 'Monthly',
      nextAction: 'Share launch update',
      note: 'Prefers concise updates with tangible asks. Strong fit for milestone-based follow-ups.',
      aiDraft:
        'Draft a concise monthly update to Maya: include launch progress, one metric, and one direct question about positioning.',
      tags: ['advisor', 'warm-intro', 'strategy']
    }
  },
  {
    id: 'investor',
    type: 'contact',
    position: { x: 790, y: 60 },
    sourcePosition: Position.Left,
    targetPosition: Position.Left,
    data: {
      name: 'Jordan Lee',
      role: 'Angel investor',
      warmth: 'Active',
      company: 'Summit Angels',
      cadence: 'Bi-weekly',
      nextAction: 'Send KPI snapshot',
      note: 'Interested in traction snapshots. Best updates are precise, metric-forward, and low-friction to scan.',
      aiDraft:
        'Prepare a 5-sentence investor update with KPI highlights, one customer proof point, and a short ask for introductions.',
      tags: ['investor', 'metrics', 'intros']
    }
  },
  {
    id: 'operator',
    type: 'contact',
    position: { x: 810, y: 380 },
    sourcePosition: Position.Left,
    targetPosition: Position.Left,
    data: {
      name: 'Ari Patel',
      role: 'Potential partner',
      warmth: 'Watch',
      company: 'Orbit Ops',
      cadence: 'As needed',
      nextAction: 'Follow up on demo',
      note: 'Follow up after product demo. Relationship should stay light until a strong workflow overlap is confirmed.',
      aiDraft:
        'Write a friendly post-demo follow-up that recaps reminder automation, mentions the next experiment, and asks for one concrete workflow example.',
      tags: ['partner', 'demo', 'watchlist']
    }
  }
];

const initialEdges: Edge[] = [
  {
    id: 'central-advisor',
    source: 'advisor',
    target: 'central',
    label: 'Strategic guidance',
    type: 'smoothstep',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: '#67e8f9' },
    style: { stroke: '#22d3ee', strokeWidth: 2 }
  },
  {
    id: 'central-investor',
    source: 'central',
    target: 'investor',
    label: 'Traction updates',
    type: 'smoothstep',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: '#a78bfa' },
    style: { stroke: '#a78bfa', strokeWidth: 2 }
  },
  {
    id: 'central-operator',
    source: 'central',
    target: 'operator',
    label: 'Demo follow-up',
    type: 'smoothstep',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f472b6' },
    style: { stroke: '#f472b6', strokeWidth: 2 }
  }
];

const workspaceStats = [
  { label: 'Contacts in focus', value: '24', hint: '+3 this week' },
  { label: 'Pending reminders', value: '08', hint: '2 due today' },
  { label: 'AI drafts queued', value: '11', hint: '5 ready to review' }
];

export function RelationshipGraph() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(initialNodes[0].id);

  const defaultEdgeOptions = useMemo(
    () => ({
      type: 'smoothstep',
      animated: true
    }),
    []
  );

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? nodes[0];
  const selectedRecord = workspaceRecords[selectedNode.id];

  const handleNodeClick: NodeMouseHandler = (_, node) => {
    setSelectedNodeId(node.id);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_380px]">
      <section className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {workspaceStats.map((stat) => (
            <article key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{stat.label}</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <strong className="text-3xl font-semibold text-white">{stat.value}</strong>
                <span className="text-sm text-cyan-200">{stat.hint}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="relative h-[720px] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-neon">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_25%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cyan-300/10 to-transparent" />
          <div className="absolute left-6 top-6 z-10 rounded-2xl border border-white/10 bg-slate-900/75 px-4 py-3 text-sm text-slate-200 backdrop-blur-xl">
            <p className="font-medium text-white">Relationship workspace</p>
            <p className="mt-1 max-w-sm text-slate-400">
              Click a node to inspect notes, reminders, and the AI-assisted next message. Drag to reorganize your active map.
            </p>
          </div>
          <ReactFlow
            fitView
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            defaultEdgeOptions={defaultEdgeOptions}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="rgba(148, 163, 184, 0.18)" gap={32} />
            <MiniMap
              pannable
              zoomable
              nodeColor={(node) => (node.id === selectedNodeId ? '#22d3ee' : '#a78bfa')}
              maskColor="rgba(2, 6, 23, 0.55)"
              style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}
            />
            <Controls className="!border-white/10 !bg-slate-900/80 !text-white" />
          </ReactFlow>
        </div>
      </section>

      <aside className="space-y-5 rounded-[2rem] border border-white/10 bg-slate-900/65 p-5 shadow-neon backdrop-blur-xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/60">Selected contact</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{selectedNode.data.name}</h2>
              <p className="mt-1 text-sm text-slate-400">
                {selectedNode.data.role} · {selectedNode.data.company}
              </p>
            </div>
            <span className={`rounded-full border px-3 py-1 text-xs ${warmthStyles[selectedNode.data.warmth]}`}>
              {selectedNode.data.warmth}
            </span>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">{selectedRecord.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedNode.data.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-slate-950/80 px-2.5 py-1 text-xs text-slate-300">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">Next reminders</h3>
            <span className="text-xs uppercase tracking-[0.28em] text-slate-500">{selectedNode.data.cadence}</span>
          </div>
          <div className="mt-4 space-y-3">
            {selectedRecord.reminders.map((reminder) => (
              <article key={reminder.label} className="rounded-2xl border border-white/10 bg-slate-950/75 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-100">{reminder.label}</p>
                  <span className="text-xs text-cyan-200">{reminder.owner}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">Due {reminder.due}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-white">AI draft</h3>
          <p className="mt-4 rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4 text-sm leading-7 text-slate-200">
            {selectedNode.data.aiDraft}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-white">Recent timeline</h3>
          <div className="mt-4 space-y-4">
            {selectedRecord.timeline.map((item) => (
              <article key={`${item.title}-${item.timestamp}`} className="relative pl-5">
                <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                <p className="font-medium text-slate-100">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">{item.detail}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">{item.timestamp}</p>
              </article>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
