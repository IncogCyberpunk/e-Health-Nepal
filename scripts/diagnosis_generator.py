import random
# from datetime import date


DIAGNOSES = {
    "No Significant Health Issue": 0.03,
    "Hypertension": 0.10,
    "Type 2 Diabetes": 0.06,
    "High Cholesterol": 0.06,
    "Obesity": 0.07,
    "Upper Respiratory Infection": 0.12,
    "Seasonal Allergies": 0.05,
    "Asthma": 0.04,
    "Sinusitis": 0.04,
    "Gastroenteritis": 0.06,
    "Anemia": 0.05,
    "Arthritis": 0.05,
    "Chronic Back Pain": 0.06,
    "Depression": 0.04,
    "Migraine": 0.04,
    "Undifferentiated Fever": 0.09
}

def age_multiplier(diagnosis, age):
    if diagnosis in ["Hypertension", "Type 2 Diabetes", "High Cholesterol"]:
        if age < 30: 
            return 0.2
        if age < 45: 
            return 0.7
        if age < 60: 
            return 1.5
        return 2.2

    if diagnosis == "Obesity":
        if age < 15: 
            return 0.3
        if age < 25: 
            return 0.8
        if age < 55: 
            return 1.4
        return 1.1

    if diagnosis == "Arthritis":
        if age < 40: 
            return 0.2
        if age < 55: 
            return 1.0
        return 2.0

    if diagnosis in ["Depression", "Migraine"]:
        if age < 15: 
            return 0.4
        if age < 35: 
            return 1.4
        if age < 55: 
            return 1.1
        return 0.8

    if diagnosis == "Anemia":
        if age < 15: 
            return 0.8
        if age < 45: 
            return 1.4
        return 1.0

    if diagnosis == "Upper Respiratory Infection":
        if age < 15 or age > 60:
            return 1.3

    if diagnosis == "No Significant Health Issue":
        if age < 25: 
            return 1.6
        if age > 60: 
            return 0.5
        
    if diagnosis == "Chronic Back Pain":
        if age < 30:
            return 0.5
        if age < 50:
            return 1.2
        return 1.6

    return 1.0


def sex_multiplier(diagnosis, sex):
    if diagnosis in ["Anemia", "Depression", "Migraine"]:
        if sex == "Female":
            return 1.3
    if diagnosis == "Gastroenteritis":
        if sex == "Male":
            return 1.2
    return 1.0

MONTH_MULTIPLIERS = {
    "Upper Respiratory Infection": {12:1.4, 1:1.4, 2:1.3},
    "Sinusitis": {12:1.3, 1:1.3},
    "Seasonal Allergies": {3:1.4, 4:1.5, 5:1.3},
    "Gastroenteritis": {6:1.4, 7:1.6, 8:1.6, 9:1.4},
    "Undifferentiated Fever": {6:1.3, 7:1.4, 8:1.4}
}

def month_multiplier(diagnosis, month):
    return MONTH_MULTIPLIERS.get(diagnosis, {}).get(month, 1.0)


TREND_UP = {
    "Hypertension": 0.015,
    "Type 2 Diabetes": 0.020,
    "Obesity": 0.025,
    "Depression": 0.020
}

TREND_DOWN = {
    "Anemia": -0.010
}

def year_trend_multiplier(diagnosis, year, start_year):
    year_index = year - start_year
    slope = TREND_UP.get(diagnosis, TREND_DOWN.get(diagnosis, 0.0))
    return 1.0 + year_index * slope


PROVINCE_MULTIPLIERS = {
    "Bagmati": {
        "Hypertension": 1.2,
        "Type 2 Diabetes": 1.25,
        "Obesity": 1.3,
        "Depression": 1.2
    },
    "Gandaki": {
        "Hypertension": 1.1,
        "Type 2 Diabetes": 1.1
    },
    "Koshi": {
        "Anemia": 1.2,
        "Gastroenteritis": 1.1
    },
    "Madhesh": {
        "Anemia": 1.3,
        "Gastroenteritis": 1.2
    },
    "Lumbini": {
        "Gastroenteritis": 1.1
    },
    "Karnali": {
        "Anemia": 1.4,
        "No Significant Health Issue": 0.7
    },
    "Sudurpashchim": {
        "Anemia": 1.35,
        "Gastroenteritis": 1.15
    }
}

def province_multiplier(diagnosis, province):
    return PROVINCE_MULTIPLIERS.get(province, {}).get(diagnosis, 1.0)


def generate_diagnosis(age, sex, visit_date, province, start_year = 2010):
    month = visit_date.month
    year = visit_date.year
    if sex == "Other":
        sex = random.choice(["Male", "Female"])

    weights = {}

    for diagnosis, base_prob in DIAGNOSES.items():
        w = base_prob
        w *= age_multiplier(diagnosis, age)
        w *= month_multiplier(diagnosis, month)
        w *= year_trend_multiplier(diagnosis, year, start_year)
        w *= province_multiplier(diagnosis, province)
        w *= sex_multiplier(diagnosis, sex)
        w *= random.uniform(0.85, 1.15)  # noise

        weights[diagnosis] = max(w, 0.0001)

    diagnoses = list(weights.keys())
    probs = list(weights.values())

    return random.choices(diagnoses, weights=probs, k=1)[0]

# Example usage:
# dx = generate_diagnosis(
#     age=45,
#     sex="Female",
#     visit_date=date(2023, 3, 15),
#     province="Bagmati",
#     # start_year=2015
# )
# print(dx)