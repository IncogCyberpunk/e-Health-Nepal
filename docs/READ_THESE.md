┌─────────────────────────────────────────────────┐
│         CENTRALIZED DATABASE (Supabase)         │
│  - Citizens (NID, demographics)                 │
│  - Health Records (visits, diagnoses, meds)     │
│  - Entitlements (insurance, subsidies)          │
│  - Analytics Data                               │
└─────────────────────────────────────────────────┘
         ↓              ↓              ↓
    GOVERNMENT     HOSPITALS      CITIZENS


---

## Three Separate Portals

### 1. **GOVERNMENT PORTAL** (Admin/Oversight)
**Who uses it**: Ministry of Health officials, policy makers

**Features needed**:

- **Dashboard Analytics**
  - Disease outbreak tracking (which areas have what diseases)
  - Vaccination coverage rates
  - Hospital utilization statistics
  - Demographics health trends

- **Citizen Registry Management**
  - View all citizens and their health status
  - Track entitlements (who's eligible for free treatment, subsidies)
  - Generate reports (e.g., "How many diabetes patients in Kathmandu?")

- **Hospital Network Oversight**
  - Monitor which hospitals are submitting records
  - Audit trail of who accessed what
  - Approve/manage hospital credentials

- **Policy Tools**
  - Budget allocation based on disease prevalence
  - Identify underserved areas

**Login**: Government official credentials (not NID)

---

### 2. **HOSPITAL/CLINIC PORTAL** (Data Entry)
**Who uses it**: Doctors, nurses, hospital admin staff

**Features needed**:

- **Patient Lookup**
  - Enter NID → retrieve complete medical history
  - Shows: past visits, allergies, current medications, blood type
  - Shows entitlements (e.g., "This patient gets free diabetes meds")

- **Record Creation**
  - Add new visit record
  - Diagnosis, prescriptions, lab results
  - Upload documents (X-rays, reports)

- **Appointment Management**
  - Schedule follow-ups
  - Send reminders to patients

- **Verification System**
  - Confirm patient identity (NID + maybe biometric/OTP)
  - Digital signatures for prescriptions

**Login**: Hospital staff credentials + hospital license verification

**Workflow Example**:
1. Patient walks in → Staff enters NID → System shows history
2. Doctor examines → Doctor adds diagnosis & prescription
3. Record saved → Patient can see it immediately on their app

---

### 3. **CITIZEN PORTAL**
**Who uses it**: General public (patients)

**Features**:

- **View Records** (what you have)
  - All past visits, prescriptions, lab reports
  - Vaccination records

- **Download/Share**
  - Get PDF of medical history for new doctor
  - Share specific records with family

- **Appointments**
  - Book hospital visits
  - See upcoming appointments

- **Entitlements**
  - Check what benefits they're eligible for
  - "You can get free flu vaccine at these hospitals"

- **Emergency Info**
  - Quick access to blood type, allergies for emergencies

**Login**: NID + verification (OTP to phone)






