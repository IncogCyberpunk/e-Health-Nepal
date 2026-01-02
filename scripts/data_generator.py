import json
import random
from faker import Faker
from datetime import timedelta
from address_generator import load_location_data, generate_address
from diagnosis_generator import generate_diagonis, generate_prescriptions

fake = Faker()
Faker.seed(42)


NUM_CITIZEN = 1000
NUM_INSTITUTES = 50
citizens = []
citizen_nids = []
health_institutes = []

location_data = load_location_data("data/location.csv")

for _ in range(NUM_CITIZEN):
    nid = fake.unique.numerify("###-###-###-#")
    citizen_nids.append(nid)

    citizens.append({
        "nid_number": nid,
        "full_name": fake.name(),
        "citizenship_number": fake.unique.numerify("##-##-##-#####"),
        "date_of_birth": fake.date_of_birth(minimum_age=18, maximum_age=90).isoformat(),
        "sex": random.choice(["Male", "Female", "Other"]),
        "blood_group": random.choice(["A+","A-","B+","B-","O+","O-","AB+","AB-"]),
        "father_name": fake.name_male(),
        "mother_name": fake.name_female(),
        "address": generate_address(location_data),
        "phone": fake.unique.numerify(random.choice(["+977 98########", "+977 97########"])),
        "email": fake.email(),
        "created_at": fake.date_time_this_decade().isoformat()
    })

for i in range(1, NUM_INSTITUTES + 1):
    institute_type = random.choice(["hospital", "clinic", "health_post"])
    health_institutes.append({
        "institute_id": i,
        "name": fake.company()+ random.choice(["", " "+institute_type.capitalize(), " Private Ltd."]),
        "type": institute_type,
        "ownership": random.choice(["government", "private"]),
        "address": generate_address(location_data),
        "phone": fake.unique.numerify("01-#######"),
        "is_active": True,
        "created_at": fake.date_time_this_decade().isoformat(),
        "license_number": fake.unique.numerify(random.choice(["LIC-########", "HLT-########", "MED-########"]))
    })

health_records = []
record_id = 1
institute_ids = [i["institute_id"] for i in health_institutes]
record_types = ["OPD", "IPD", "Emergency", "Teleconsult", "Lab", "Pharmacy", "DayCare"]
for nid in citizen_nids:
    for _ in range(random.randint(1, 5)):
        health_records.append({
            "record_id": record_id,
            "nid_number": nid,
            "institute_id": random.choice(institute_ids),
            "record_type": random.choices(record_types, weights=[50, 10, 15, 10, 5, 5, 5])[0],
            "title": fake.catch_phrase(),
            "description": fake.text(max_nb_chars=200),
            "diagnosis": generate_diagonis(),
            "prescription": generate_prescriptions(),
            "issued_date": fake.date_between(start_date="-3y", end_date="today").isoformat()
        })
        record_id += 1

entitlements = []
entitlement_id = 1
entitlement_mapping = {
    "Health": ["Standard National Health Insurance", "Universal Healthcare Coverage"],
    "Senior": ["Age-based subsidy (Over 65)", "Retirement Benefit Scheme"],
    "Disability": ["Physical Impairment Support", "Permanent Disability Grant"],
    "Maternity": ["Prenatal Care Package", "Post-delivery Support"],
    "Veteran": ["Military Service Benefit", "Ex-Servicemen Health Scheme"],
    "Low Income": ["Below Poverty Line (BPL) Card", "Social Welfare Subsidy"]
}

for nid in citizen_nids:
    for _ in range(random.randint(0, 2)):
        valid_from = fake.date_between(start_date="-5y", end_date="today")
        valid_until = valid_from + timedelta(days=random.randint(180, 1460))
        e_type = random.choice(list(entitlement_mapping.keys()))
        reason = random.choice(entitlement_mapping[e_type])

        entitlements.append({
            "entitlement_id": entitlement_id,
            "nid_number": nid,
            "entitlement_type": e_type,
            "eligibility_reason": reason,
            "valid_from": valid_from.isoformat(),
            "valid_until": valid_until.isoformat()
        })
        entitlement_id += 1

def write_json(filename, data):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

write_json("data/citizens.json", citizens)
write_json("data/health_institutes.json", health_institutes)
write_json("data/health_records.json", health_records)
write_json("data/entitlements.json", entitlements)