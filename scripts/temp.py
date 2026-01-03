# import json
# import pandas


# data = pandas.read_csv("data/institute.csv")

# institutes = []
# for _, row in data.iterrows():
#     institutes.append({
#         "name": row["Hospital"],
#         "location": row["City"],
#         "province": row["Province"],
#         "description": row["Description"] if not pandas.isna(row["Description"]) else ""
#     })

# with open("data/institute.json", "w", encoding="utf-8") as f:
#     json.dump(institutes, f, ensure_ascii=False, indent=4)


from diagnosis_generator import generate_diagnosis
from datetime import date
from faker import Faker
fake = Faker()

date = fake.date_between(start_date="-10y", end_date="today")
dx = generate_diagnosis(
    age=5,
    sex="M",
    visit_date=date,
    province="Bagmati",
    start_year=2015
)
print(date.year, date.month, date.day)
print(dx)