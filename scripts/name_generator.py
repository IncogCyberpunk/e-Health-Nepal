import json
import random


def generate_name(gender):
    with open("data/names.json", "r", encoding="utf-8") as f:
        names_data = json.load(f)
    if gender == "Male":
        first_name = random.choice(names_data["Male"]["first_names"])
        last_name = random.choice(names_data["Male"]["last_names"])
    else:
        first_name = random.choice(names_data["Female"]["first_names"])
        last_name = random.choice(names_data["Female"]["last_names"])
    return f"{first_name} {last_name}"
