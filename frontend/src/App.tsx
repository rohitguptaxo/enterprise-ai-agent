import { useState, useEffect, useRef } from "react";

const API = "http://127.0.0.1:8000";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#2a2a2a;color:#323232;font-family:'Inter',sans-serif;overflow:hidden;}
  ::-webkit-scrollbar{width:5px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:#888;border-radius:3px;}
  .glass{background:rgba(221,208,200,0.93);backdrop-filter:blur(12px);border:1px solid rgba(50,50,50,0.15);box-shadow:0 8px 32px rgba(0,0,0,0.25),inset 0 1px 0 rgba(255,255,255,0.35);}
  .card{background:rgba(221,208,200,0.93);border:1px solid rgba(50,50,50,0.13);border-radius:12px;padding:16px 18px;box-shadow:0 4px 16px rgba(0,0,0,0.12),inset 0 1px 0 rgba(255,255,255,0.3);transition:transform 0.25s,box-shadow 0.25s;}
  .card:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.35);}
  .nav-btn{display:flex;align-items:center;gap:10px;padding:9px 13px;border-radius:9px;cursor:pointer;font-size:13px;font-weight:500;transition:all 0.18s;border:1px solid transparent;color:#666;user-select:none;}
  .nav-btn:hover{background:rgba(50,50,50,0.07);border-color:rgba(50,50,50,0.15);color:#323232;}
  .nav-btn.active{background:rgba(50,50,50,0.11);border-color:rgba(50,50,50,0.28);color:#323232;font-weight:600;}
  .preset-btn{padding:8px 11px;border-radius:8px;cursor:pointer;border:1px solid rgba(50,50,50,0.1);background:rgba(221,208,200,0.35);transition:all 0.15s;margin-bottom:3px;}
  .preset-btn:hover{background:rgba(50,50,50,0.08);border-color:rgba(50,50,50,0.2);}
  .agent-pill{display:flex;align-items:center;gap:6px;background:rgba(221,208,200,0.65);border:1px solid rgba(50,50,50,0.15);border-radius:20px;padding:5px 13px;transition:all 0.3s;}
  .agent-pill.active{background:rgba(5,150,105,0.12);border-color:rgba(5,150,105,0.4);box-shadow:0 0 12px rgba(5,150,105,0.2);}
  .agent-dot{width:7px;height:7px;border-radius:50%;background:#ccc;transition:all 0.3s;}
  .agent-dot.active{background:#059669;box-shadow:0 0 8px #059669;}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.35;}}
  .pulsing{animation:pulse 1.4s infinite;}
  @keyframes slideIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
  .log-row{display:flex;gap:11px;padding:8px 0;border-bottom:1px solid rgba(50,50,50,0.07);animation:slideIn 0.22s ease;}
  .tag{display:inline-flex;align-items:center;border-radius:5px;padding:2px 8px;font-size:10px;font-weight:700;letter-spacing:0.05em;}
  .execute-btn{background:linear-gradient(135deg,#323232,#555);border:none;color:#DDD0C8;border-radius:9px;padding:11px 22px;cursor:pointer;font-family:'Inter',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.07em;transition:all 0.2s;box-shadow:0 4px 14px rgba(50,50,50,0.35);white-space:nowrap;}
  .execute-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(50,50,50,0.45);}
  .execute-btn.stop{background:linear-gradient(135deg,#7f1d1d,#991b1b);color:#fff;box-shadow:0 4px 14px rgba(239,68,68,0.3);}
  .clear-btn{background:none;border:1px solid rgba(50,50,50,0.2);color:#777;border-radius:9px;padding:9px 18px;cursor:pointer;font-family:'Inter',sans-serif;font-size:11px;letter-spacing:0.06em;transition:all 0.15s;}
  .clear-btn:hover{background:rgba(50,50,50,0.06);color:#555;}
  textarea{background:rgba(255,252,250,0.75);border:1px solid rgba(50,50,50,0.22);border-radius:10px;color:#323232;font-size:13px;font-family:'Inter',sans-serif;padding:11px 14px 11px 34px;resize:none;outline:none;width:100%;line-height:1.6;transition:border-color 0.2s,box-shadow 0.2s;}
  textarea:focus{border-color:rgba(50,50,50,0.45);box-shadow:0 0 0 3px rgba(50,50,50,0.07);}
  textarea::placeholder{color:#aaa;}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:13px;}
  .grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:11px;}
  .tbl-head{display:grid;padding:9px 14px;border-bottom:1px solid rgba(50,50,50,0.14);}
  .tbl-row{display:grid;padding:10px 14px;border-bottom:1px solid rgba(50,50,50,0.07);transition:background 0.12s;}
  .tbl-row:hover{background:rgba(50,50,50,0.04);}
  .section-label{font-size:10px;font-weight:700;letter-spacing:0.13em;color:#888;margin-bottom:13px;}
  .progress-bar{height:3px;background:#ddd;border-radius:2px;overflow:hidden;}
  .progress-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,#323232,#666);transition:width 0.4s ease;}
`;

const STATUS_MAP = {
  hot:["#ef4444","#fef2f2"], active:["#059669","#f0fdf4"], cold:["#888","#f5f5f5"],
  approved:["#059669","#f0fdf4"], pending_approval:["#d97706","#fffbeb"], draft:["#888","#f5f5f5"],
  urgent:["#ef4444","#fef2f2"], high:["#d97706","#fffbeb"], medium:["#2563eb","#eff6ff"], low:["#888","#f5f5f5"],
};
function Tag({ s }) {
  const [fg, bg] = STATUS_MAP[s] || ["#888","#f5f5f5"];
  return <span className="tag" style={{color:fg,background:bg,border:`1px solid ${fg}33`}}>{s.replace(/_/g," ").toUpperCase()}</span>;
}

const LOG_STYLES = {
  user:    { icon:"›", color:"#DDD0C8", bg:"transparent", label:"YOU" },
  planning:{ icon:"○", color:"#a78bfa", bg:"transparent", label:"PLANNER" },
  plan:    { icon:"≡", color:"#60a5fa", bg:"transparent", label:"PLAN" },
  agent:   { icon:"▶", color:"#34d399", bg:"transparent", label:"AGENT" },
  tool:    { icon:"→", color:"#fbbf24", bg:"transparent", label:"TOOL CALL" },
  result:  { icon:"←", color:"#9ca3af", bg:"transparent", label:"RESULT" },
  output:  { icon:"●", color:"#e2e8f0", bg:"transparent", label:"OUTPUT" },
  done:    { icon:"✓", color:"#34d399", bg:"transparent", label:"DONE" },
  error:   { icon:"✗", color:"#f87171", bg:"transparent", label:"ERROR" },
};

const fmt = n => n?.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}) ?? "$0";
let _c = 0;
const uid = () => `e${++_c}-${Date.now()}`;

export default function App() {
  const [tab, setTab] = useState("terminal");
  const [query, setQuery] = useState("");
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);
  const [activeAgent, setActiveAgent] = useState(null); // "planner"|"data"|"executor"
  const [step, setStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [presets, setPresets] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [financials, setFinancials] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const bottomRef = useRef(null);
  const abortRef = useRef(null);

  // Load presets on mount
  useEffect(() => {
    fetch(`${API}/api/presets`)
      .then(r => r.json())
      .then(d => setPresets(d.presets || []))
      .catch(() => {});
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Load tab data
  useEffect(() => {
    if (tab === "crm") {
      setDataLoading(true);
      Promise.all([
        fetch(`${API}/api/crm/contacts`).then(r => r.json()),
        fetch(`${API}/api/crm/tasks`).then(r => r.json()),
      ]).then(([c, t]) => {
        setContacts(c.contacts || []);
        setTasks(t.tasks || []);
        setDataLoading(false);
      }).catch(() => setDataLoading(false));
    }
    if (tab === "erp") {
      setDataLoading(true);
      Promise.all([
        fetch(`${API}/api/erp/orders`).then(r => r.json()),
        fetch(`${API}/api/erp/inventory`).then(r => r.json()),
      ]).then(([o, i]) => {
        setOrders(o.orders || []);
        setInventory(i.inventory || []);
        setDataLoading(false);
      }).catch(() => setDataLoading(false));
    }
    if (tab === "financials") {
      setDataLoading(true);
      fetch(`${API}/api/erp/financials`)
        .then(r => r.json())
        .then(d => { setFinancials(d); setDataLoading(false); })
        .catch(() => setDataLoading(false));
    }
  }, [tab]);

  const addLog = (type, content) =>
    setLogs(p => [...p, { id: uid(), type, content, ts: new Date() }]);

  const runWorkflow = async (q) => {
    if (running) return;
    setLogs([]);
    setRunning(true);
    setStep(0);
    setTotalSteps(0);
    setActiveAgent("planner");
    addLog("user", q);
    setTab("terminal");

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const res = await fetch(`${API}/api/workflow/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
        signal: abort.signal,
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") continue;

          try {
            const e = JSON.parse(raw);
            const { type, data } = e;

            if (type === "planning") {
              setActiveAgent("planner");
              addLog("planning", data.message);
            } else if (type === "plan_ready") {
              setTotalSteps(data.steps?.length || 0);
              const stepList = data.steps?.map(s => `  Step ${s.step}: [${s.agent.toUpperCase()}] ${s.action}`).join("\n") || "";
              addLog("plan", `Intent: ${data.intent}\nComplexity: ${data.complexity}\nSteps:\n${stepList}`);
            } else if (type === "agent_start") {
              setStep(data.step);
              setTotalSteps(data.total_steps || 0);
              const agentType = data.agent === "data" ? "data" : "executor";
              setActiveAgent(agentType);
              addLog("agent", `[${data.agent.toUpperCase()} AGENT] Step ${data.step}/${data.total_steps}\nTask: ${data.action}`);
            } else if (type === "tool_call") {
              addLog("tool", `${data.tool}\nInput: ${data.input}`);
            } else if (type === "tool_result") {
              addLog("result", data.result);
            } else if (type === "agent_output") {
              addLog("output", data.output);
            } else if (type === "done") {
              setActiveAgent(null);
              addLog("done", `Workflow complete — ${data.steps_executed} step${data.steps_executed !== 1 ? "s" : ""} executed successfully`);
            } else if (type === "error") {
              setActiveAgent(null);
              addLog("error", `Error: ${data.message}`);
            }
          } catch {}
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") addLog("error", err.message);
    } finally {
      setRunning(false);
      setActiveAgent(null);
    }
  };

  const stopWorkflow = () => {
    abortRef.current?.abort();
    setRunning(false);
    setActiveAgent(null);
    addLog("error", "Workflow cancelled by user");
  };

  const AGENTS = [
    { key: "planner", label: "PLANNER" },
    { key: "data",    label: "DATA" },
    { key: "executor",label: "EXECUTOR" },
  ];

  const CAT_COLORS = { crm: "#2563eb", erp: "#7c3aed", both: "#059669" };

  const TABS = [
    { id: "terminal",   icon: "⌘", label: "AI Terminal" },
    { id: "crm",        icon: "◈", label: "CRM Pipeline" },
    { id: "erp",        icon: "◉", label: "ERP Orders" },
    { id: "financials", icon: "◆", label: "Financials" },
  ];

  const pct = totalSteps > 0 ? Math.round((step / totalSteps) * 100) : 0;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#2a2a2a", overflow: "hidden" }}>
      <style>{css}</style>

      {/* ── HEADER ── */}
      <header className="glass" style={{ height: 54, display: "flex", alignItems: "center", padding: "0 20px", gap: 14, flexShrink: 0, borderRadius: 0, borderLeft: "none", borderRight: "none", borderTop: "none", zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#323232,#666)", display: "flex", alignItems: "center", justifyContent: "center", color: "#DDD0C8", fontSize: 17, fontWeight: 700, boxShadow: "0 3px 10px rgba(50,50,50,0.35)", flexShrink: 0 }}>E</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.07em", color: "#323232", lineHeight: 1.2 }}>ENTERPRISE <span style={{ color: "#666" }}>AI AGENT</span></div>
            <div style={{ fontSize: 10, color: "#999", letterSpacing: "0.08em" }}>MULTI-AGENT WORKFLOW SYSTEM</div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Agent status pills */}
        {AGENTS.map(a => (
          <div key={a.key} className={`agent-pill${activeAgent === a.key ? " active" : ""}`}>
            <div className={`agent-dot${activeAgent === a.key ? " active pulsing" : ""}`} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", color: activeAgent === a.key ? "#059669" : "#999" }}>{a.label}</span>
          </div>
        ))}

        <div style={{ width: 1, height: 22, background: "rgba(50,50,50,0.15)", margin: "0 4px" }} />
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: running ? "#059669" : "#aaa" }}>
          {running ? `STEP ${step}/${totalSteps}` : "READY"}
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── SIDEBAR ── */}
        <aside className="glass" style={{ width: 218, flexShrink: 0, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 2, borderRadius: 0, borderTop: "none", borderBottom: "none", borderLeft: "none", overflowY: "auto" }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.13em", color: "#bbb", padding: "3px 10px 6px" }}>NAVIGATION</div>

          {TABS.map(t => (
            <div key={t.id} className={`nav-btn${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>
              <span style={{ fontSize: 14, width: 18, textAlign: "center", lineHeight: 1 }}>{t.icon}</span>
              <span>{t.label}</span>
              {tab === t.id && <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: "#555" }} />}
            </div>
          ))}

          <div style={{ height: 1, background: "rgba(50,50,50,0.1)", margin: "10px 0" }} />
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.13em", color: "#bbb", padding: "3px 10px 6px" }}>QUICK QUERIES</div>

          {presets.length === 0 && (
            <div style={{ fontSize: 11, color: "#bbb", padding: "8px 12px" }}>No presets — backend offline?</div>
          )}

          {presets.map(p => (
            <div key={p.id} className="preset-btn" onClick={() => { if (!running) runWorkflow(p.query); }}
              style={{ opacity: running ? 0.45 : 1, cursor: running ? "not-allowed" : "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: CAT_COLORS[p.category] || "#888", flexShrink: 0, display: "block" }} />
                <span style={{ fontSize: 11, color: "#555", lineHeight: 1.35 }}>{p.label}</span>
              </div>
            </div>
          ))}
        </aside>

        {/* ── MAIN ── */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {tab === "terminal" && (
            <>
              {/* Log area */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#2f2f2f" }}>
                {logs.length === 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 18, paddingBottom: "4vh" }}>
                    <div style={{ width: 72, height: 72, borderRadius: 18, background: "rgba(221,208,200,0.08)", border: "1px solid rgba(221,208,200,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#DDD0C8" }}>E</div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 17, fontWeight: 600, color: "#DDD0C8", marginBottom: 7, letterSpacing: "0.03em" }}>AWAITING QUERY</div>
                      <div style={{ fontSize: 12, color: "#666", maxWidth: 340, lineHeight: 1.7 }}>Type a query below or click a preset to launch the multi-agent pipeline</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      {[["PLANNER","#a78bfa"],["→","#555"],["DATA","#60a5fa"],["→","#555"],["EXECUTOR","#34d399"]].map(([lbl, col], i) =>
                        lbl === "→"
                          ? <span key={i} style={{ color: col, fontSize: 16 }}>→</span>
                          : <div key={i} style={{ padding: "5px 13px", borderRadius: 7, background: col + "18", border: `1px solid ${col}38`, fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", color: col }}>{lbl}</div>
                      )}
                    </div>
                  </div>
                ) : (
                  logs.map(entry => {
                    const s = LOG_STYLES[entry.type] || { icon: "·", color: "#888", label: entry.type };
                    return (
                      <div key={entry.id} className="log-row">
                        <div style={{ paddingTop: 3, flexShrink: 0, color: s.color, fontFamily: "monospace", fontSize: 13, width: 14, textAlign: "center" }}>{s.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: s.color, opacity: 0.85 }}>{s.label}</span>
                            <span style={{ fontSize: 9, color: "#555", marginLeft: "auto", fontFamily: "monospace" }}>
                              {entry.ts.toLocaleTimeString("en-US", { hour12: false })}
                            </span>
                          </div>
                          <pre style={{ margin: 0, fontFamily: entry.type === "output" || entry.type === "user" ? "'Inter',sans-serif" : "'JetBrains Mono',monospace", fontSize: entry.type === "output" ? 13 : 11, color: entry.type === "result" ? "#9ca3af" : s.color, whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.65 }}>{entry.content}</pre>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Progress bar */}
              {running && totalSteps > 0 && (
                <div style={{ padding: "7px 24px", background: "#272727", borderTop: "1px solid rgba(221,208,200,0.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 10, color: "#888" }}>
                    <span>Step {step} of {totalSteps} — {activeAgent?.toUpperCase() || "..."} agent active</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                </div>
              )}

              {/* Input bar */}
              <div className="glass" style={{ padding: "14px 20px", borderRadius: 0, borderLeft: "none", borderRight: "none", borderBottom: "none" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <span style={{ position: "absolute", left: 13, top: 12, color: "#aaa", fontSize: 14, pointerEvents: "none" }}>›</span>
                    <textarea
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (query.trim() && !running) { runWorkflow(query.trim()); setQuery(""); }
                        }
                      }}
                      placeholder="Describe your workflow query… (Enter to execute, Shift+Enter for newline)"
                      rows={2}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                    <button className={`execute-btn${running ? " stop" : ""}`} onClick={running ? stopWorkflow : () => { if (query.trim()) { runWorkflow(query.trim()); setQuery(""); } }}>
                      {running ? "■  STOP" : "▶  EXECUTE"}
                    </button>
                    {logs.length > 0 && !running && (
                      <button className="clear-btn" onClick={() => setLogs([])}>CLEAR</button>
                    )}
                  </div>
                </div>
                <div style={{ marginTop: 7, fontSize: 10, color: "#aaa", letterSpacing: "0.05em", display: "flex", justifyContent: "space-between" }}>
                  <span>PLANNER → DATA AGENT → EXECUTOR AGENT</span>
                  <span>LangChain · GPT-4 · FastAPI · SSE Stream</span>
                </div>
              </div>
            </>
          )}

          {tab === "crm" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "22px 24px", background: "#f5f0ed" }}>
              {dataLoading ? (
                <div style={{ textAlign: "center", paddingTop: 60, color: "#aaa" }}>Loading CRM data…</div>
              ) : (
                <>
                  <div className="section-label">CONTACTS & PIPELINE</div>
                  {contacts.length === 0 && <div style={{ color: "#aaa", fontSize: 13, marginBottom: 20 }}>No contacts — is the backend running at {API}?</div>}
                  <div className="grid2" style={{ marginBottom: 22 }}>
                    {contacts.map(c => (
                      <div key={c.id} className="card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(50,50,50,0.09)", border: "1px solid rgba(50,50,50,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#323232", flexShrink: 0 }}>
                              {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#323232" }}>{c.name}</div>
                              <div style={{ fontSize: 11, color: "#888" }}>{c.company}</div>
                            </div>
                          </div>
                          <Tag s={c.status} />
                        </div>
                        <div style={{ fontSize: 11, color: "#999", marginBottom: 10, fontFamily: "monospace" }}>{c.email}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid rgba(50,50,50,0.09)" }}>
                          <span style={{ fontSize: 16, fontWeight: 700, color: "#323232" }}>{fmt(c.deal_value)}</span>
                          <span style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", background: "rgba(50,50,50,0.07)", padding: "3px 8px", borderRadius: 5 }}>{c.stage}</span>
                        </div>
                        <div style={{ fontSize: 10, color: "#bbb", marginTop: 6 }}>Last contact: {c.last_contact}</div>
                      </div>
                    ))}
                  </div>

                  <div className="section-label">OPEN TASKS</div>
                  {tasks.filter(t => !t.done).length === 0 && <div style={{ color: "#aaa", fontSize: 13 }}>No open tasks.</div>}
                  {tasks.filter(t => !t.done).map(t => (
                    <div key={t.id} className="card" style={{ display: "flex", alignItems: "center", gap: 14, borderRadius: 10, padding: "11px 16px", marginBottom: 8 }}>
                      <Tag s={t.priority} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#323232" }}>{t.title}</div>
                        <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{t.contact_name} · {t.company}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 10, color: "#bbb" }}>Due</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#d97706", fontFamily: "monospace" }}>{t.due}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {tab === "erp" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "22px 24px", background: "#f5f0ed" }}>
              {dataLoading ? (
                <div style={{ textAlign: "center", paddingTop: 60, color: "#aaa" }}>Loading ERP data…</div>
              ) : (
                <>
                  <div className="section-label">ORDERS</div>
                  {orders.length === 0 && <div style={{ color: "#aaa", fontSize: 13, marginBottom: 20 }}>No orders — is the backend running at {API}?</div>}
                  {orders.map(o => (
                    <div key={o.id} className="card" style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#323232", fontFamily: "monospace", background: "rgba(50,50,50,0.07)", padding: "3px 8px", borderRadius: 6 }}>{o.id}</span>
                          <span style={{ fontSize: 13, color: "#323232", fontWeight: 500 }}>{o.customer}</span>
                        </div>
                        <Tag s={o.status} />
                      </div>
                      <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color: "#323232" }}>{fmt(o.total)}</span>
                        <span style={{ fontSize: 11, color: "#999" }}>Created {o.created}</span>
                        <span style={{ fontSize: 11, color: "#bbb", marginLeft: "auto" }}>{o.items?.length || 0} line item{o.items?.length !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  ))}

                  <div className="section-label" style={{ marginTop: 22 }}>INVENTORY</div>
                  {inventory.length === 0 && <div style={{ color: "#aaa", fontSize: 13 }}>No inventory data.</div>}
                  <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                    <div className="tbl-head" style={{ gridTemplateColumns: "1.6fr 2.2fr 0.9fr 1fr", background: "rgba(50,50,50,0.04)" }}>
                      {["SKU", "Product", "Stock", "Unit Price"].map(h => (
                        <span key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#888" }}>{h}</span>
                      ))}
                    </div>
                    {inventory.map(i => (
                      <div key={i.sku} className="tbl-row" style={{ gridTemplateColumns: "1.6fr 2.2fr 0.9fr 1fr" }}>
                        <span style={{ fontSize: 11, color: "#888", fontFamily: "monospace" }}>{i.sku}</span>
                        <span style={{ fontSize: 12, color: "#323232" }}>{i.name}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#059669" }}>{i.stock?.toLocaleString()}</span>
                        <span style={{ fontSize: 12, color: "#323232" }}>{fmt(i.unit_price)}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {tab === "financials" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "22px 24px", background: "#f5f0ed" }}>
              {dataLoading ? (
                <div style={{ textAlign: "center", paddingTop: 60, color: "#aaa" }}>Loading financial data…</div>
              ) : !financials ? (
                <div style={{ color: "#aaa", fontSize: 13 }}>No data — is the backend running at {API}?</div>
              ) : (
                <>
                  <div className="section-label">KEY METRICS</div>
                  <div className="grid4" style={{ marginBottom: 22 }}>
                    {[
                      { label: "YTD Revenue",     value: fmt(financials.ytd_revenue),     color: "#323232" },
                      { label: "Monthly Target",  value: fmt(financials.target_monthly),  color: "#555" },
                      { label: "Attainment",       value: `${financials.attainment_pct}%`, color: financials.attainment_pct >= 80 ? "#059669" : "#d97706" },
                      { label: "Pipeline Value",   value: fmt(financials.pipeline_total),  color: "#7c3aed" },
                    ].map(s => (
                      <div key={s.label} className="card" style={{ borderRadius: 12 }}>
                        <div style={{ fontSize: 10, color: "#999", letterSpacing: "0.08em", marginBottom: 8 }}>{s.label}</div>
                        <div style={{ fontSize: 21, fontWeight: 700, color: s.color }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div className="card" style={{ borderRadius: 14 }}>
                      <div className="section-label">MONTHLY REVENUE</div>
                      {(() => {
                        const maxR = Math.max(...financials.monthly_revenue.map(r => r.revenue));
                        return financials.monthly_revenue.map(r => (
                          <div key={r.month} style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 11 }}>
                            <div style={{ width: 50, fontSize: 10, color: "#888", flexShrink: 0, fontFamily: "monospace" }}>{r.month.replace(" 20", "'")}</div>
                            <div style={{ flex: 1, height: 17, background: "rgba(50,50,50,0.07)", borderRadius: 3, overflow: "hidden" }}>
                              <div style={{ height: "100%", borderRadius: 3, background: r.revenue === maxR ? "#323232" : "rgba(50,50,50,0.22)", width: `${(r.revenue / maxR) * 100}%`, transition: "width 0.5s ease" }} />
                            </div>
                            <div style={{ fontSize: 11, color: "#555", minWidth: 66, textAlign: "right", fontFamily: "monospace" }}>{fmt(r.revenue)}</div>
                          </div>
                        ));
                      })()}
                    </div>

                    <div className="card" style={{ borderRadius: 14 }}>
                      <div className="section-label">PIPELINE BY STAGE</div>
                      {[
                        { label: "Closing",     value: 310000, color: "#059669" },
                        { label: "Negotiation", value: 325000, color: "#2563eb" },
                        { label: "Proposal",    value: 89000,  color: "#d97706" },
                        { label: "Discovery",   value: 45000,  color: "#888"    },
                      ].map(s => (
                        <div key={s.label} style={{ marginBottom: 13 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                            <span style={{ fontSize: 11, color: "#666" }}>{s.label}</span>
                            <span style={{ fontSize: 11, fontWeight: 600, color: s.color, fontFamily: "monospace" }}>{fmt(s.value)}</span>
                          </div>
                          <div style={{ height: 5, background: "rgba(50,50,50,0.08)", borderRadius: 3 }}>
                            <div style={{ height: "100%", borderRadius: 3, background: s.color, width: `${(s.value / 769000) * 100}%`, transition: "width 0.5s ease" }} />
                          </div>
                        </div>
                      ))}
                      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(50,50,50,0.09)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "#999" }}>Gap to target</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#ef4444", fontFamily: "monospace" }}>{fmt(financials.revenue_gap_to_target)}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
