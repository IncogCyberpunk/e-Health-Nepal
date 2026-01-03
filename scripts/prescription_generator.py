import random

# Predefined prescriptions and descriptions
_prescriptions = {
    "No Significant Health Issue": [
        "Routine follow-up, maintain healthy lifestyle",
        "Regular exercise and balanced diet"
    ],
    "Hypertension": [
        "Amlodipine 5mg OD, low-salt diet",
        "Losartan 50mg OD, monitor BP daily"
    ],
    "Type 2 Diabetes": [
        "Metformin 500mg BD, low-sugar diet",
        "Glipizide 5mg OD, monitor blood glucose"
    ],
    "High Cholesterol": [
        "Atorvastatin 10mg OD, reduce saturated fat intake",
        "Simvastatin 20mg OD, increase fiber in diet"
    ],
    "Obesity": [
        "Lifestyle modification, exercise 150min/week",
        "Calorie-restricted diet, monitor weight weekly"
    ],
    "Upper Respiratory Infection": [
        "Paracetamol 500mg TDS as needed, rest and fluids",
        "Cough syrup 10ml TDS, stay hydrated"
    ],
    "Seasonal Allergies": [
        "Cetirizine 10mg OD, avoid allergens",
        "Loratadine 10mg OD, nasal saline spray"
    ],
    "Asthma": [
        "Salbutamol inhaler 2 puffs PRN, monitor symptoms",
        "Budesonide inhaler 1 puff BD"
    ],
    "Sinusitis": [
        "Amoxicillin 500mg TDS 7 days, steam inhalation",
        "Nasal saline spray 3–4 times/day"
    ],
    "Gastroenteritis": [
        "ORS solution as needed, maintain hydration",
        "Loperamide 2mg after loose stools, light diet"
    ],
    "Anemia": [
        "Ferrous sulfate 325mg OD, iron-rich diet",
        "Multivitamin with iron, increase leafy greens"
    ],
    "Arthritis": [
        "Ibuprofen 400mg TDS as needed, gentle exercise",
        "Naproxen 250mg BD, physiotherapy"
    ],
    "Chronic Back Pain": [
        "Paracetamol 500mg TDS as needed, stretching exercises",
        "NSAID gel locally, posture correction"
    ],
    "Depression": [
        "Sertraline 50mg OD, regular counseling",
        "Fluoxetine 20mg OD, supportive therapy"
    ],
    "Migraine": [
        "Sumatriptan 50mg as needed, avoid triggers",
        "Paracetamol 500mg at onset, rest in dark room"
    ],
    "Undifferentiated Fever": [
        "Paracetamol 500mg TDS, maintain hydration",
        "Monitor temperature, rest and fluids"
    ]
}

_descriptions = {
    "No Significant Health Issue": [
        "No significant health concerns. Maintain routine follow-up and a healthy lifestyle.",
        "Overall healthy. Continue balanced diet and regular exercise."
    ],
    "Hypertension": [
        "Elevated blood pressure detected. Lifestyle modification and antihypertensives recommended.",
        "Chronic high blood pressure; monitor regularly and follow prescribed medication."
    ],
    "Type 2 Diabetes": [
        "High blood sugar levels suggest type 2 diabetes. Manage with oral medications and diet control.",
        "Insulin resistance noted. Monitor glucose and adhere to lifestyle modifications."
    ],
    "High Cholesterol": [
        "Elevated cholesterol levels. Statins and dietary adjustments advised.",
        "Risk of cardiovascular disease due to high cholesterol. Follow medication and diet plan."
    ],
    "Obesity": [
        "Body mass index indicates obesity. Recommend diet and exercise interventions.",
        "Excess weight may lead to health complications. Lifestyle management is essential."
    ],
    "Upper Respiratory Infection": [
        "Symptoms suggest a viral upper respiratory infection. Symptomatic treatment advised.",
        "Mild infection of the upper respiratory tract; hydration and rest recommended."
    ],
    "Seasonal Allergies": [
        "Allergic symptoms present. Antihistamines and allergen avoidance recommended.",
        "Seasonal allergy flare-up. Monitor triggers and use prescribed medications."
    ],
    "Asthma": [
        "Chronic respiratory condition with airway inflammation. Use inhalers as needed.",
        "Asthma symptoms present. Follow rescue and maintenance medication plan."
    ],
    "Sinusitis": [
        "Inflammation of the sinuses observed. Antibiotics or symptomatic treatment advised.",
        "Sinus infection with congestion and discomfort. Supportive care recommended."
    ],
    "Gastroenteritis": [
        "Gastrointestinal infection causing diarrhea and vomiting. Hydration is critical.",
        "Inflammation of the stomach and intestines; maintain fluids and light diet."
    ],
    "Anemia": [
        "Low hemoglobin levels detected. Iron supplementation and diet recommended.",
        "Signs of anemia present. Nutritional support and medication advised."
    ],
    "Arthritis": [
        "Joint inflammation causing pain and stiffness. NSAIDs and physiotherapy suggested.",
        "Chronic arthritis noted; manage with medications and gentle exercises."
    ],
    "Chronic Back Pain": [
        "Persistent back pain reported. Pain relief and posture correction advised.",
        "Chronic lumbar discomfort. Exercise, analgesics, and ergonomic adjustments recommended."
    ],
    "Depression": [
        "Mood disorder identified. Counseling and antidepressant therapy recommended.",
        "Symptoms of depression present; psychological support and medication advised."
    ],
    "Migraine": [
        "Recurring headaches consistent with migraine. Pain relief and trigger avoidance advised.",
        "Migraine attacks noted; use prescribed medications and avoid known triggers."
    ],
    "Undifferentiated Fever": [
        "Fever without clear cause. Monitor symptoms and maintain hydration.",
        "Acute fever observed; supportive care recommended while investigating cause."
    ]
}

def generate_prescription(diagnosis: str) -> str:
    options = _prescriptions.get(diagnosis)
    if not options:
        return "No prescription available"
    return random.choice(options)

def generate_description(diagnosis: str) -> str:
    options = _descriptions.get(diagnosis)
    if not options:
        return "No description available"
    return random.choice(options)
