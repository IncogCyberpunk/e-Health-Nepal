import os
import dotenv
import requests
import json
import time

dotenv.load_dotenv()

MMO_API_URL = os.getenv("MMO_API_URL")
MMO_API_TOKEN = os.getenv("MMO_API_TOKEN")


COUNT = 500
OUTPUT_FILE = "data/names.json"

data = {
    "male": {
        "first_names": [],
        "last_names": []
    },
    "female": {
        "first_names": [],
        "last_names": []
    }
}

def fetch_contact(gender):
    params = {
        "gender": gender,
        "localization": "ne_NP",
        "token": MMO_API_TOKEN
    }
    r = requests.get(MMO_API_URL, params=params, timeout=10)
    r.raise_for_status()
    return r.json()

for gender in ["male", "female"]:
    print(f"Fetching {COUNT} {gender} names...")
    while len(data[gender]["first_names"]) < COUNT:
        try:
            contact = fetch_contact(gender)

            data[gender]["first_names"].append(contact["firstname"])
            data[gender]["last_names"].append(contact["lastname"])
            print(f"  Fetched {len(data[gender]['first_names'])}/{COUNT}")

            time.sleep(0.2)  # avoid rate limit
        except Exception as e:
            print(f"Error: {e}")

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Saved {COUNT * 2} names to {OUTPUT_FILE}")
