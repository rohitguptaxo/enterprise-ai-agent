import json, os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from tools.mock_data import CRM_CONTACTS, CRM_TASKS, ERP_ORDERS, ERP_INVENTORY, ERP_FINANCIALS

app = FastAPI(title="Enterprise AI Workflow API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class WorkflowRequest(BaseModel):
    query: str
    session_id: Optional[str] = None

@app.post("/api/workflow/stream")
async def workflow_stream(request: WorkflowRequest):
    async def event_generator():
        import asyncio
        openai_key = os.environ.get("OPENAI_API_KEY","")
        events = [
            {"type":"planning","data":{"message":"Analyzing your request..."}},
            {"type":"plan_ready","data":{"intent":request.query,"complexity":"moderate","steps":[{"step":1,"agent":"data","action":"Fetch CRM and ERP data","tools_hint":[],"depends_on":[]},{"step":2,"agent":"executor","action":"Execute any required actions"}],"summary":"Processing complete"}},
            {"type":"agent_start","data":{"step":1,"agent":"data","action":"Fetching relevant data","total_steps":2}},
            {"type":"tool_call","data":{"step":1,"tool":"crm_get_pipeline_summary","input":"{}"}},
            {"type":"tool_result","data":{"step":1,"tool":"crm_get_pipeline_summary","result":json.dumps({"total_pipeline_value":769000,"contact_count":5})}},
            {"type":"agent_output","data":{"step":1,"agent":"data","output":f"Query: {request.query}\n\nPipeline Total: $769,000 across 5 contacts.\nTop opportunity: Carol Wang (InnovateAI) - $310,000 in closing stage.\nPending orders: O1001 ($125K) and O1004 ($89K) awaiting approval.\nRevenue attainment: 60.3% of $1.2M monthly target."}},
            {"type":"agent_start","data":{"step":2,"agent":"executor","action":"Completing workflow","total_steps":2}},
            {"type":"agent_output","data":{"step":2,"agent":"executor","output":"Workflow complete. No write actions required for this query."}},
            {"type":"done","data":{"message":"Workflow complete","steps_executed":2}},
        ]
        for e in events:
            yield f"data: {json.dumps(e)}\n\n"
            await asyncio.sleep(0.6)
        yield "data: [DONE]\n\n"
    return StreamingResponse(event_generator(), media_type="text/event-stream", headers={"Cache-Control":"no-cache","X-Accel-Buffering":"no"})

@app.get("/api/crm/contacts")
async def get_contacts(): return {"contacts": list(CRM_CONTACTS.values())}

@app.get("/api/crm/tasks")
async def get_tasks():
    enriched = []
    for t in CRM_TASKS.values():
        c = CRM_CONTACTS.get(t["contact_id"], {})
        enriched.append({**t, "contact_name": c.get("name",""), "company": c.get("company","")})
    return {"tasks": enriched}

@app.get("/api/erp/orders")
async def get_orders(): return {"orders": list(ERP_ORDERS.values())}

@app.get("/api/erp/inventory")
async def get_inventory(): return {"inventory": list(ERP_INVENTORY.values())}

@app.get("/api/erp/financials")
async def get_financials():
    f = ERP_FINANCIALS.copy()
    f["revenue_gap_to_target"] = f["target_monthly"] - f["ytd_revenue"]
    f["attainment_pct"] = round(f["ytd_revenue"] / f["target_monthly"] * 100, 1)
    return f

@app.get("/api/presets")
async def get_presets():
    return {"presets":[
        {"id":"1","label":"Pipeline Summary","query":"Give me a full CRM pipeline summary with deal values by stage.","category":"crm"},
        {"id":"2","label":"Open Tasks","query":"List all open CRM tasks sorted by priority.","category":"crm"},
        {"id":"3","label":"Revenue Analysis","query":"Are we on track to hit our monthly revenue target?","category":"erp"},
        {"id":"4","label":"Pending Orders","query":"List all pending approval orders in ERP.","category":"erp"},
        {"id":"5","label":"Full Briefing","query":"Give me a complete executive briefing across CRM and ERP.","category":"both"},
        {"id":"6","label":"Inventory Check","query":"Check current inventory levels.","category":"erp"},
    ]}

@app.get("/api/health")
async def health(): return {"status":"ok","agents":["planner","data","executor"]}
