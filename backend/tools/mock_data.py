CRM_CONTACTS = {
    "C001": {"id":"C001","name":"Alice Chen","email":"alice@techcorp.io","company":"TechCorp","status":"active","deal_value":125000,"stage":"negotiation","last_contact":"2024-01-15"},
    "C002": {"id":"C002","name":"Bob Martinez","email":"bob@globalfinance.com","company":"Global Finance","status":"active","deal_value":89000,"stage":"proposal","last_contact":"2024-01-10"},
    "C003": {"id":"C003","name":"Carol Wang","email":"carol@innovateai.com","company":"InnovateAI","status":"hot","deal_value":310000,"stage":"closing","last_contact":"2024-01-18"},
    "C004": {"id":"C004","name":"David Kim","email":"david@startupxyz.io","company":"StartupXYZ","status":"cold","deal_value":45000,"stage":"discovery","last_contact":"2023-12-20"},
    "C005": {"id":"C005","name":"Eva Patel","email":"eva@enterprise.co","company":"Enterprise Co","status":"active","deal_value":200000,"stage":"negotiation","last_contact":"2024-01-17"},
}
CRM_TASKS = {
    "T001": {"id":"T001","contact_id":"C001","title":"Follow-up call","due":"2024-01-25","priority":"high","done":False},
    "T002": {"id":"T002","contact_id":"C003","title":"Send contract draft","due":"2024-01-20","priority":"urgent","done":False},
    "T003": {"id":"T003","contact_id":"C002","title":"Proposal review","due":"2024-01-22","priority":"medium","done":True},
    "T004": {"id":"T004","contact_id":"C005","title":"Demo scheduling","due":"2024-01-24","priority":"high","done":False},
}
ERP_ORDERS = {
    "O1001": {"id":"O1001","customer":"TechCorp","contact_id":"C001","items":[{"sku":"ENT-LIC-001","qty":50,"unit_price":2500}],"total":125000,"status":"pending_approval","created":"2024-01-14"},
    "O1002": {"id":"O1002","customer":"InnovateAI","contact_id":"C003","items":[{"sku":"ENT-LIC-002","qty":100,"unit_price":3100}],"total":310000,"status":"approved","created":"2024-01-16"},
    "O1003": {"id":"O1003","customer":"Enterprise Co","contact_id":"C005","items":[{"sku":"PRO-SUITE-001","qty":40,"unit_price":5000}],"total":200000,"status":"draft","created":"2024-01-17"},
    "O1004": {"id":"O1004","customer":"Global Finance","contact_id":"C002","items":[{"sku":"ENT-LIC-001","qty":30,"unit_price":2967}],"total":89000,"status":"pending_approval","created":"2024-01-09"},
}
ERP_INVENTORY = {
    "ENT-LIC-001": {"sku":"ENT-LIC-001","name":"Enterprise License Basic","stock":500,"unit_price":2500,"category":"license"},
    "ENT-LIC-002": {"sku":"ENT-LIC-002","name":"Enterprise License Premium","stock":200,"unit_price":3100,"category":"license"},
    "PRO-SUITE-001": {"sku":"PRO-SUITE-001","name":"Professional Suite","stock":150,"unit_price":5000,"category":"suite"},
    "ADD-ON-ANALYTICS": {"sku":"ADD-ON-ANALYTICS","name":"Analytics Add-on","stock":999,"unit_price":800,"category":"addon"},
}
ERP_FINANCIALS = {
    "monthly_revenue": [
        {"month":"Sep 2023","revenue":820000},{"month":"Oct 2023","revenue":940000},
        {"month":"Nov 2023","revenue":1050000},{"month":"Dec 2023","revenue":1230000},
        {"month":"Jan 2024","revenue":724000},
    ],
    "pipeline_total": sum(c["deal_value"] for c in CRM_CONTACTS.values()),
    "orders_pending": 2,
    "ytd_revenue": 724000,
    "target_monthly": 1200000,
}
