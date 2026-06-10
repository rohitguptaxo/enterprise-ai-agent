export const config = { api: { bodyParser: true } };
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function buildOutput(query){
  const q=query.toLowerCase();
  if(q.includes("pipeline")||q.includes("crm"))return "CRM PIPELINE SUMMARY\n\nTotal Pipeline Value: $769,000 across 5 contacts\n\nBy Stage:\n  Closing:     $310,000 - Carol Wang (InnovateAI) HOT\n  Negotiation: $325,000 - Alice Chen + Eva Patel\n  Proposal:    $89,000  - Bob Martinez\n  Discovery:   $45,000  - David Kim\n\nTop Priority This Week:\n  1. Carol Wang - $310K closing, send contract URGENT\n  2. Eva Patel - $200K negotiation, demo scheduling HIGH\n  3. Alice Chen - $125K negotiation, follow-up call HIGH";
  if(q.includes("revenue")||q.includes("financial"))return "FINANCIAL ANALYSIS\n\nYTD Revenue:    $724,000\nMonthly Target: $1,200,000\nAttainment:     60.3% - BELOW TARGET\nGap to Close:   $476,000\n\nTrend: Sep $820K > Oct $940K > Nov $1.05M > Dec $1.23M > Jan $724K\n\nRecommendation: Prioritize Carol Wang ($310K) and Eva Patel ($200K) to recover attainment to 85%+.";
  if(q.includes("order")||q.includes("erp"))return "ERP ORDERS REPORT\n\nPending Approval (2):\n  O1001 - TechCorp - $125,000\n  O1004 - Global Finance - $89,000\n\nApproved: O1002 InnovateAI $310,000\nDraft: O1003 Enterprise Co $200,000\n\nRecommendation: O1004 pending 5+ days - escalate approval.";
  return "EXECUTIVE BRIEFING\n\nCRM: $769K pipeline, 5 deals, Carol Wang $310K closing\nREVENUE: $724K YTD vs $1.2M target - 60.3% attainment\nORDERS: 2 pending approval ($214K combined)\nINVENTORY: All SKUs in stock\n\nACTIONS:\n1. Approve O1001 + O1004 ($214K)\n2. Send contract to Carol Wang - $310K at risk\n3. Schedule Eva Patel demo - $200K in negotiation";
}
export default async function handler(req,res){
  if(req.method!=="POST")return res.status(405).end();
  const{query}=req.body;
  res.setHeader("Content-Type","text/event-stream");
  res.setHeader("Cache-Control","no-cache");
  res.setHeader("Access-Control-Allow-Origin","*");
  const send=(type,data)=>res.write("data: "+JSON.stringify({type,data})+"\n\n");
  send("planning",{message:"Analyzing your request and building execution plan..."});
  await sleep(600);
  send("plan_ready",{intent:query,complexity:"moderate",steps:[{step:1,agent:"data",action:"Fetch CRM and ERP data",tools_hint:[],depends_on:[]},{step:2,agent:"executor",action:"Generate insights and recommendations",tools_hint:[],depends_on:[1]}],summary:"Fetching enterprise data"});
  await sleep(600);
  send("agent_start",{step:1,agent:"data",action:"Fetching data from CRM and ERP systems",total_steps:2});
  await sleep(500);
  send("tool_call",{step:1,tool:"crm_get_pipeline_summary",input:"{}"});
  await sleep(400);
  send("tool_result",{step:1,tool:"crm_get_pipeline_summary",result:'{"total_pipeline_value":769000,"contact_count":5}'});
  await sleep(400);
  send("tool_call",{step:1,tool:"erp_get_financials",input:"{}"});
  await sleep(400);
  send("tool_result",{step:1,tool:"erp_get_financials",result:'{"ytd_revenue":724000,"target_monthly":1200000,"attainment_pct":60.3}'});
  await sleep(500);
  send("agent_output",{step:1,agent:"data",output:buildOutput(query)});
  await sleep(600);
  send("agent_start",{step:2,agent:"executor",action:"Completing workflow",total_steps:2});
  await sleep(400);
  send("agent_output",{step:2,agent:"executor",output:"Workflow complete.\n\nAll data retrieved successfully:\n- CRM pipeline fetched (5 contacts, $769K)\n- ERP financials loaded (60.3% attainment)\n- No write actions required"});
  await sleep(300);
  send("done",{message:"Workflow complete",steps_executed:2});
  res.write("data: [DONE]\n\n");
  res.end();
}
