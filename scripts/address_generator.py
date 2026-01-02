import csv
import random

csv_path = "data/location.csv"

def load_location_data(csv_path):
    data = []

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            data.append({
                "district": row["District"].strip(),
                "municipality": row["Name of Municipalities"].strip(),
                "wards": int(row["Numbers of Wards"])
            })
    return data

def generate_address(location_data):
    loc = random.choice(location_data)
    ward_no = random.randint(1, loc["wards"])

    return f"Ward No.{ward_no}-{loc['municipality']} {loc['district']}, Nepal"

