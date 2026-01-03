import csv
import random

def load_location_data(csv_path):
    data = []

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        reader.fieldnames = [h.strip() for h in reader.fieldnames]
        for row in reader:
            data.append({
                "district": row["District"].strip(),
                "municipality": row["Name of Municipalities"].strip(),
                "wards": int(row["Numbers of Wards"]),
                "province": row["Province"].strip()
            })
    return data

def load_location_data_by_province(csv_path):
    data = {}

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        reader.fieldnames = [h.strip() for h in reader.fieldnames]
        for row in reader:
            province = row["Province"].strip()
            if province not in data:
                data[province] = []
            data[province].append({
                "district": row["District"].strip(),
                "municipality": row["Name of Municipalities"].strip(),
                "wards": int(row["Numbers of Wards"]),
                "province": province
            })
    return data

def generate_address(location_data):
    loc = random.choice(location_data)
    ward_no = random.randint(1, loc["wards"])

    return f"Ward No.{ward_no}-{loc['municipality']} {loc['district']}, {loc['province']}"

