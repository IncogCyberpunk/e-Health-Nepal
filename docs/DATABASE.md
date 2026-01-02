How They Connect (Database Design)
Tables Needed:

1. citizens  [MVP]
nid_number (PK), full_name, father_name, mother_name,
dob, age, sex, blood_group, phone, email, address,
citizenship_number [ASSUME GOVERNMENT ALREADY HAS THIS]


2. health_records [MVP]
id (PK), nid_number (FK), hospital_id (FK),
record_type, title, description, diagnosis,
prescription, issued_date, created_by_doctor_id


3. hospitals
hospital_id (PK), name, license_number, address,
phone, type (public/private)

4. entitlements [MVP]
id (PK), nid_number (FK), entitlement_type,
eligibility_reason, valid_from, valid_until
(e.g., "free_medication", "Senior citizen", 2024-2025)

5. access_logs
id (PK), accessed_by, nid_accessed, timestamp,
action (viewed/modified), ip_address

