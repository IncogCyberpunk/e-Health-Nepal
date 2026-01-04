import os
from dotenv import load_dotenv
from supabase import create_client, Client
import json

# Load .env variables
load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials in .env")


supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

response = supabase.table("citizens").select("*").execute()
# print(response.data)


os.makedirs("../../data", exist_ok=True)

with open(f"../../data/citizens.json", "w", encoding="utf-8") as f:
    json.dump(response.data, f, indent=2, ensure_ascii=False)

    
# print("Data saved to ../../data/output.json")
response = supabase.table("entitlements").select("*").execute()
# print(response.data)


os.makedirs("../../data", exist_ok=True)

with open(f"../../data/entitlements.json", "w", encoding="utf-8") as f:
    json.dump(response.data, f, indent=2, ensure_ascii=False)

response = supabase.table("health_institutes").select("*").execute()
# print(response.data)


os.makedirs("../../data", exist_ok=True)

with open(f"../../data/health_institutes.json", "w", encoding="utf-8") as f:
    json.dump(response.data, f, indent=2, ensure_ascii=False)

response = supabase.table("health_records").select("*").execute()
# print(response.data)


os.makedirs("../../data", exist_ok=True)

with open(f"../../data/health_records.json", "w", encoding="utf-8") as f:
    json.dump(response.data, f, indent=2, ensure_ascii=False)