import random

def generate_diagonis():
    diagnoses = ["Diabetes", "Hypertension", "High Cholesterol", "Asthma",
        "Seasonal Allergies", "Arthritis", "Obesity", "Anemia",
        "Depression", "Back Pain", "Migraines", "Sinusitis"]

    pick_random_diagoses = random.sample(diagnoses,random.randint(1,4))
    one_random_diagnosis = random.choice(pick_random_diagoses)
    return one_random_diagnosis



# Function to generate random prescriptions
def generate_prescriptions():
    medicines = [{"medicine": "Metformin", "dosage": "500mg", "duration": "30 days"},
        {"medicine": "Lisinopril", "dosage": "10mg", "duration": "30 days"},
        {"medicine": "Atorvastatin", "dosage": "20mg", "duration": "60 days"},
        {"medicine": "Albuterol", "dosage": "90mcg", "duration": "as needed"},
        {"medicine": "Loratadine", "dosage": "10mg", "duration": "30 days"},
        {"medicine": "Ibuprofen", "dosage": "400mg", "duration": "14 days"}]

    pick_random_medicines = random.sample(medicines,random.randint(1,3))
    one_random_medicine = random.choice(pick_random_medicines)
    return one_random_medicine["dosage"] + " of " + one_random_medicine["medicine"] + " for " + one_random_medicine["duration"]