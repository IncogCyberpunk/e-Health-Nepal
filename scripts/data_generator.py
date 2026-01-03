import json
import random
import pandas
from faker import Faker
from datetime import timedelta, date
from address_generator import load_location_data, generate_address, load_location_data_by_province
from diagnosis_generator import generate_diagnosis
from prescription_generator import generate_prescription , generate_description
from name_generator import generate_name
from itertools import count

fake = Faker()
Faker.seed(100)


location_data = load_location_data("data/new_location.csv")
location_data_by_province = load_location_data_by_province("data/new_location.csv")
institutes_json = pandas.read_json("data/institute.json")


#-------------- Generate Citizens ------------
NUM_CITIZEN = 1000
citizens = []
citizen_nids = []
citizens_ages = []
citizens_sex = []

for _ in range(NUM_CITIZEN):

    nid = fake.unique.numerify("###-###-###-#")
    citizen_nids.append(nid)
    sex = random.choices(["Male", "Female", "Other"], weights=[49, 47, 4])[0]
    dob= fake.date_of_birth(minimum_age=18, maximum_age=90)
    today = date.today()
    age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

    citizens_sex.append(sex)
    citizens_ages.append(age)

    citizens.append({
        "nid_number": nid,
        "full_name": generate_name(sex),
        "citizenship_number": fake.unique.numerify("##-##-##-#####"),
        "date_of_birth": dob.isoformat(),
        "sex": sex,
        "blood_group": random.choice(["A+","A-","B+","B-","O+","O-","AB+","AB-"]),
        "father_name": fake.name_male(),
        "mother_name": fake.name_female(),
        "address": generate_address(location_data),
        "phone": fake.unique.numerify(random.choice(["+977 98########", "+977 97########"])),
        "email": fake.email(),
        "created_at": fake.date_time_this_decade().isoformat()
    })



#-------------- Generate Health Institutes ------------
NUM_INSTITUTES = len(institutes_json)
health_institutes = []
institute_provinces = []

for i in range(1, NUM_INSTITUTES + 1):
    institute_type = random.choice(["hospital", "clinic", "health_post"])
    province = institutes_json.iloc[i % len(institutes_json)]["province"]
    institute_provinces.append(province)
    health_institutes.append({
        "institute_id": i,
        "name": institutes_json.iloc[i % len(institutes_json)]["name"],
        "type": institute_type,
        "ownership": random.choice(["government", "private"]),
        "address": generate_address(location_data_by_province[province]),
        "phone": fake.unique.numerify("01-#######"),
        "is_active": True,
        "created_at": fake.date_time_this_decade().isoformat(),
        "license_number": fake.unique.numerify(random.choice(["LIC-########", "HLT-########", "MED-########"]))
    })



#-------------- Generate Health Records ------------
health_records = []
record_id = 1
institute_ids = [i["institute_id"] for i in health_institutes]
record_types = ["clinical_note", "lab_report", "imaging_report", "prescription", "discharge_summary"]

for nid in citizen_nids:
    for _ in range(random.randint(1, 8)):

        date = fake.date_between(start_date="-15y", end_date="today")
        institute_id = random.choice(institute_ids)
        province = institute_provinces[institute_id - 1]
        age = citizens_ages[citizen_nids.index(nid)]
        sex = citizens_sex[citizen_nids.index(nid)]
        diagnosis = generate_diagnosis(
            age=age,
            sex=sex,
            visit_date=date,
            province=province,
        )
        health_records.append({
            "record_id": record_id,
            "nid_number": nid,
            "institute_id": institute_id,
            "record_type": random.choices(record_types, weights=[35, 15, 20, 20, 10])[0],
            "title": diagnosis + " Report",
            "description": generate_description(diagnosis),
            "diagnosis": diagnosis,
            "prescription": generate_prescription(diagnosis),
            "issued_date": fake.date_between(start_date="-10y", end_date="today").isoformat()
        })
        record_id += 1


#-------------- Generate Entitlements ------------
entitlements = []
entitlement_mapping = {
    "Senior": ["Age-based subsidy (Over 65)", "Retirement Benefit Scheme"],
    "Disability": ["Physical Impairment Support", "Permanent Disability Grant"],
    "Maternity": ["Prenatal Care Package", "Post-delivery Support"],
    "Veteran": ["Military Service Benefit", "Ex-Servicemen Health Scheme"],
    "Low Income": ["Below Poverty Line (BPL) Card", "Social Welfare Subsidy"]
}

entitlement_id = count(1)

def apply_for_entitlement(nid_number, e_type):
    if e_type not in entitlement_mapping:
        return
    
    entitlement_id_value = next(entitlement_id)
    valid_from = fake.date_between(start_date="-5y", end_date="today")
    valid_until = valid_from + timedelta(days=random.randint(180, 1460))
    reason = random.choice(entitlement_mapping[e_type])

    entitlements.append({
        "entitlement_id": entitlement_id_value,
        "nid_number": nid_number,
        "entitlement_type": e_type,
        "eligibility_reason": reason,
        "valid_from": valid_from.isoformat(),
        "valid_until": valid_until.isoformat()
    })

for i, nid in enumerate(citizen_nids):
    age = citizens_ages[i]
    sex = citizens_sex[i]
    if age >= 65:
        apply_for_entitlement(nid, "Senior")

    if sex == "Female" and random.random() < 0.3 and age < 50 and age > 18:
        apply_for_entitlement(nid, "Maternity")
    
    if random.random() < 0.1:
        apply_for_entitlement(nid, "Disability")
    
    if age > 40 and random.random() < 0.2:
        apply_for_entitlement(nid, "Veteran")
    
    if random.random() < 0.25:
        apply_for_entitlement(nid, "Low Income")

#-------------- Write to JSON files ------------
def write_json(filename, data):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

write_json("data/citizens.json", citizens)
write_json("data/health_institutes.json", health_institutes)
write_json("data/health_records.json", health_records)
write_json("data/entitlements.json", entitlements)