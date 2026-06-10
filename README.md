# Enterprise AI Workflow Agent

> A production-ready multi-agent AI system that automates enterprise workflows across CRM & ERP systems with real-time streaming.

**Live Demo:** https://enterprise-ai-agent-delta.vercel.app  

---

## What It Does

You type a business query like *"Give me a full pipeline summary and flag at-risk deals"* — and instead of just answering, **three specialized AI agents collaborate** to fetch data, analyze it, and execute actions in real time. Every step streams live to your terminal as it happens.

---

## Demo Screenshots

### AI Terminal — Live Agent Pipeline
The terminal streams every event: planning, tool calls, results, and final output in real time.

### CRM Pipeline Tab
Contact cards with deal values, pipeline stages, status badges, and open tasks.

### ERP Orders Tab
Order management with status tracking and full inventory table.

### Financials Tab
Revenue metrics, monthly bar chart, and pipeline breakdown by stage.

---

## Architecture

```
User Query
    │
    ▼
┌─────────────────────────────────────────────────────┐
│                  Vercel Serverless                    │
│                                                       │
│  POST /api/workflow/stream  (SSE real-time stream)   │
│                                                       │
│  ┌─────────────────┐                                 │
│  │  PLANNER AGENT  │  Analyzes query, builds plan    │
│  │                 │  Outputs: steps, complexity,     │
│  │                 │  agent assignments               │
│  └────────┬────────┘                                 │
│           │ Structured Plan (JSON)                    │
│           ▼                                           │
│  ┌────────────────┐    ┌──────────────────────────┐  │
│  │  DATA AGENT    │    │    EXECUTOR AGENT         │  │
│  │                │    │                           │  │
│  │  READ tools:   │    │  WRITE tools:             │  │
│  │  • pipeline    │    │  • approve_order          │  │
│  │  • financials  │    │  • update_task            │  │
│  │  • contacts    │    │  • generate insights      │  │
│  │  • orders      │    │                           │  │
│  └────────────────┘    └──────────────────────────┘  │
│           │  Tool Calling + SSE Stream                │
│           ▼                                           │
│  ┌──────────────────────────────────────────────┐    │
│  │         Mock CRM & ERP Data Store             │    │
│  │  Contacts │ Tasks │ Orders │ Inventory │ $$$  │    │
│  └──────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
           │
           │  Server-Sent Events (real-time)
           ▼
┌─────────────────────────────────────────────────────┐
│            React + TypeScript Frontend               │
│                                                      │
│  ┌──────────────┐  ┌───────┐  ┌─────┐  ┌────────┐  │
│  │  AI Terminal │  │  CRM  │  │ ERP │  │Finance │  │
│  │  Live stream │  │ Data  │  │Data │  │  Data  │  │
│  └──────────────┘  └───────┘  └─────┘  └────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## The 3 Agents Explained

### 1. Planner Agent
- Receives raw user query
- Uses GPT-4 reasoning to break it into structured steps
- Decides which agent handles each step (data vs executor)
- Outputs: `intent`, `complexity`, `steps[]`, `summary`
- No tools — pure chain-of-thought planning

### 2. Data Agent
- Handles all **READ** operations
- Tools available:
  - `crm_get_pipeline_summary` — total deal values by stage
  - `crm_list_contacts` — all contacts with status
  - `crm_list_open_tasks` — pending tasks by priority
  - `erp_list_orders` — orders with status filter
  - `erp_get_inventory` — stock levels by SKU
  - `erp_get_financials` — revenue, targets, attainment
- Synthesizes results into business-readable summaries

### 3. Executor Agent
- Handles all **WRITE** operations
- Tools available:
  - `erp_approve_order` — approve pending orders
  - `crm_update_task_status` — mark tasks complete
- Reports exactly what changed with IDs and new states

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 + TypeScript | Dashboard UI |
| Styling | CSS-in-JS + Glassmorphism | Beige/dark theme |
| Build Tool | Vite | Fast dev + build |
| Backend | Vercel Serverless Functions | API routes |
| AI Agents | LangChain + GPT-4 | Agent orchestration |
| Streaming | Server-Sent Events (SSE) | Real-time updates |
| Deployment | Vercel | Frontend + API |
| Version Control | GitHub | Source code |

---

## Project Structure

```
enterprise-ai-agent/
├── frontend/                    # React TypeScript app
│   ├── src/
│   │   └── App.tsx              # Main dashboard (all tabs + streaming)
│   ├── api/                     # Vercel serverless functions
│   │   ├── health.js            # Health check endpoint
│   │   ├── presets.js           # Quick query presets
│   │   ├── crm.js               # CRM data (contacts + tasks)
│   │   ├── erp.js               # ERP data (orders + inventory + financials)
│   │   └── workflow.js          # Multi-agent SSE streaming endpoint
│   ├── vercel.json              # URL routing config
│   ├── vite.config.ts           # Vite configuration
│   └── package.json
├── backend/                     # Python FastAPI (local dev)
│   ├── agents/
│   │   └── workflow.py          # LangChain agent orchestrator
│   ├── tools/
│   │   ├── enterprise_tools.py  # LangChain @tool definitions
│   │   └── mock_data.py         # Mock CRM & ERP data
│   ├── main.py                  # FastAPI app
│   ├── run.py                   # Server entry point
│   └── requirements.txt
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/workflow/stream` | SSE stream — runs multi-agent workflow |
| `GET` | `/api/crm/contacts` | List all CRM contacts |
| `GET` | `/api/crm/tasks` | List all CRM tasks |
| `GET` | `/api/erp/orders` | List all ERP orders |
| `GET` | `/api/erp/inventory` | Inventory snapshot |
| `GET` | `/api/erp/financials` | Financial metrics |
| `GET` | `/api/presets` | Quick query suggestions |
| `GET` | `/api/health` | Health check |

---

## SSE Event Types

The workflow streams these events in sequence:

```typescript
type EventType =
  | "planning"      // Planner agent started
  | "plan_ready"    // Structured plan produced (JSON)
  | "agent_start"   // Agent beginning a step
  | "tool_call"     // Tool being invoked (with args)
  | "tool_result"   // Tool response data
  | "agent_output"  // Final step output text
  | "done"          // Workflow complete
  | "error"         // Error occurred
```

---

## Mock Data

The app includes realistic enterprise mock data:

**CRM:**
- 5 contacts across different deal stages ($45K–$310K)
- 4 tasks with priority levels (urgent/high/medium/low)
- Pipeline total: $769,000

**ERP:**
- 4 orders (pending/approved/draft statuses)
- 4 inventory SKUs with stock levels
- 5 months of revenue history

**Financials:**
- YTD Revenue: $724,000
- Monthly Target: $1,200,000
- Attainment: 60.3%
- Pipeline gap analysis

---

## Running Locally

### Prerequisites
- Node.js 18+
- Python 3.11+
- OpenAI API key (optional — mock responses work without it)

### Frontend Only (Vercel serverless — recommended)
```bash
cd frontend
npm install
npm run dev
```
Visit http://localhost:5173

### Full Stack (with Python backend)
```bash
# Terminal 1 — Backend
cd backend
pip install -r requirements.txt
python run.py

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

---

## Example Queries

Try these in the AI Terminal:

| Query | What Happens |
|---|---|
| "Pipeline summary" | Data agent fetches all CRM deals by stage |
| "List pending orders" | ERP agent shows orders awaiting approval |
| "Revenue vs target" | Financial analysis with attainment % |
| "Full executive briefing" | All 3 agents run in sequence |
| "Approve orders over $100K" | Executor agent writes approvals |

---

## Key Features

- **Real-time streaming** — watch agents think and act live via SSE
- **3-agent pipeline** — Planner → Data → Executor separation of concerns
- **Tool calling** — agents select and invoke the right tools automatically
- **Glassmorphism UI** — beige/dark theme with 3D card hover effects
- **4 dashboard tabs** — Terminal, CRM, ERP, Financials
- **Zero cold starts** — Vercel serverless, always-on
- **No API key needed** — works fully with mock data

---

## Deployment

**Frontend + API:** Vercel  
**Live URL:** https://enterprise-ai-agent-delta.vercel.app

To redeploy after changes:
```bash
cd frontend
npx vercel --prod
```

---

## What I'd Add Next

- [ ] Real Salesforce/HubSpot CRM integration
- [ ] Real SAP/NetSuite ERP integration  
- [ ] OpenAI GPT-4 for dynamic responses (not mock)
- [ ] Authentication with JWT
- [ ] Persistent conversation history
- [ ] Export reports as PDF
- [ ] Mobile responsive design
- [ ] WebSocket support for lower latency

---

## Author

**Rohit Gupta** — [@rohitguptaxo](https://github.com/rohitguptaxo)

Built as a portfolio project demonstrating multi-agent AI architecture, real-time streaming, and enterprise system design.

---

*Built with React, TypeScript, Vite, Vercel Serverless, LangChain, and GPT-4*
