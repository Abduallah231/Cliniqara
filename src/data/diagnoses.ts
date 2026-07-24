export interface Diagnosis {
  code: string;
  name: string;
}

const diagnoses = [
    // =========================
  // Cardiovascular
  // =========================

  { code: "I10", name: "Hypertension" },
  { code: "I11.0", name: "Hypertensive Heart Disease" },
  { code: "I12.9", name: "Hypertensive Chronic Kidney Disease" },
  { code: "I16.0", name: "Hypertensive Urgency" },
  { code: "I16.1", name: "Hypertensive Emergency" },

  { code: "I50.9", name: "Heart Failure" },
  { code: "I50.2", name: "Heart Failure with Reduced Ejection Fraction (HFrEF)" },
  { code: "I50.3", name: "Heart Failure with Preserved Ejection Fraction (HFpEF)" },
  { code: "I50.8", name: "Acute Decompensated Heart Failure" },

  { code: "I20.0", name: "Unstable Angina" },
  { code: "I20.8", name: "Stable Angina" },
  { code: "I24.9", name: "Acute Coronary Syndrome" },
  { code: "I21.3", name: "ST Elevation Myocardial Infarction (STEMI)" },
  { code: "I21.4", name: "Non-ST Elevation Myocardial Infarction (NSTEMI)" },

  { code: "I48.0", name: "Atrial Fibrillation" },
  { code: "I48.1", name: "Atrial Flutter" },
  { code: "I47.1", name: "Supraventricular Tachycardia" },
  { code: "I47.2", name: "Ventricular Tachycardia" },
  { code: "I49.0", name: "Ventricular Fibrillation" },
  { code: "R00.1", name: "Sinus Bradycardia" },
  { code: "R00.0", name: "Sinus Tachycardia" },
  { code: "I44.3", name: "Complete Heart Block" },
  { code: "I44.0", name: "First Degree AV Block" },
  { code: "I49.9", name: "Cardiac Arrhythmia" },

  { code: "I30.9", name: "Acute Pericarditis" },
  { code: "I31.9", name: "Pericardial Effusion" },
  { code: "I40.9", name: "Myocarditis" },
  { code: "I42.9", name: "Cardiomyopathy" },
  { code: "I33.0", name: "Infective Endocarditis" },

  { code: "I35.0", name: "Aortic Stenosis" },
  { code: "I35.1", name: "Aortic Regurgitation" },
  { code: "I34.0", name: "Mitral Regurgitation" },
  { code: "I34.2", name: "Mitral Stenosis" },

  { code: "I26.9", name: "Pulmonary Embolism" },
  { code: "I82.4", name: "Deep Vein Thrombosis" },
  { code: "I71.0", name: "Aortic Dissection" },
  { code: "I73.9", name: "Peripheral Arterial Disease" },
  { code: "I87.2", name: "Chronic Venous Insufficiency" },
  { code: "I83.9", name: "Varicose Veins" },

  // =========================
  // Respiratory
  // =========================

  { code: "J45.9", name: "Asthma" },
  { code: "J46", name: "Acute Severe Asthma" },
  { code: "J44.9", name: "COPD" },
  { code: "J44.1", name: "Acute Exacerbation of COPD" },

  { code: "J20.9", name: "Acute Bronchitis" },
  { code: "J18.9", name: "Community Acquired Pneumonia" },
  { code: "J15.9", name: "Hospital Acquired Pneumonia" },
  { code: "J69.0", name: "Aspiration Pneumonia" },

  { code: "U07.1", name: "COVID-19" },
  { code: "J10.1", name: "Influenza" },

  { code: "J06.9", name: "Upper Respiratory Tract Infection" },
  { code: "J01.9", name: "Acute Sinusitis" },
  { code: "J32.9", name: "Chronic Sinusitis" },
  { code: "J02.9", name: "Pharyngitis" },
  { code: "J03.9", name: "Tonsillitis" },
  { code: "J04.0", name: "Laryngitis" },

  { code: "A15.0", name: "Pulmonary Tuberculosis" },
  { code: "J90", name: "Pleural Effusion" },
  { code: "J93.9", name: "Pneumothorax" },
  { code: "J98.2", name: "Tension Pneumothorax" },

  { code: "J47", name: "Bronchiectasis" },
  { code: "J84.9", name: "Interstitial Lung Disease" },
  { code: "I27.2", name: "Pulmonary Hypertension" },
  { code: "G47.33", name: "Obstructive Sleep Apnea" },
  { code: "C34.9", name: "Lung Cancer" },

  // =========================
  // Gastroenterology
  // =========================

  { code: "K21.9", name: "Gastroesophageal Reflux Disease (GERD)" },
  { code: "K27.9", name: "Peptic Ulcer Disease" },
  { code: "K29.7", name: "Gastritis" },
  { code: "K52.9", name: "Acute Gastroenteritis" },

  { code: "K58.9", name: "Irritable Bowel Syndrome" },
  { code: "K51.9", name: "Ulcerative Colitis" },
  { code: "K50.9", name: "Crohn Disease" },
  { code: "K52.3", name: "Inflammatory Bowel Disease" },

  { code: "K35.8", name: "Acute Appendicitis" },
  { code: "K80.2", name: "Biliary Colic" },
  { code: "K81.0", name: "Acute Cholecystitis" },
  { code: "K83.0", name: "Acute Cholangitis" },

  { code: "K85.9", name: "Acute Pancreatitis" },
  { code: "K86.1", name: "Chronic Pancreatitis" },

  { code: "B19.9", name: "Acute Viral Hepatitis" },
  { code: "K74.6", name: "Liver Cirrhosis" },
  { code: "K76.0", name: "Fatty Liver Disease" },
  { code: "K70.1", name: "Alcoholic Hepatitis" },

  { code: "K59.0", name: "Constipation" },
  { code: "R19.7", name: "Diarrhea" },
  { code: "K64.9", name: "Hemorrhoids" },

  { code: "K57.9", name: "Diverticular Disease" },
  { code: "K57.3", name: "Acute Diverticulitis" },
  { code: "K90.0", name: "Celiac Disease" },
  { code: "E73.9", name: "Lactose Intolerance" },

  { code: "C16.9", name: "Gastric Cancer" },
  { code: "C18.9", name: "Colorectal Cancer" },

    // =========================
  // Endocrinology
  // =========================

  { code: "E11.9", name: "Type 2 Diabetes Mellitus" },
  { code: "E10.9", name: "Type 1 Diabetes Mellitus" },
  { code: "R73.0", name: "Prediabetes" },
  { code: "O24.4", name: "Gestational Diabetes" },

  { code: "E11.65", name: "Uncontrolled Diabetes Mellitus" },
  { code: "E11.10", name: "Diabetic Ketoacidosis" },
  { code: "E11.00", name: "Hyperosmolar Hyperglycemic State" },
  { code: "E16.2", name: "Hypoglycemia" },

  { code: "E03.9", name: "Hypothyroidism" },
  { code: "E05.9", name: "Hyperthyroidism" },
  { code: "E04.9", name: "Goiter" },
  { code: "E04.1", name: "Thyroid Nodule" },
  { code: "E06.3", name: "Hashimoto Thyroiditis" },
  { code: "E05.0", name: "Graves Disease" },
  { code: "E07.9", name: "Thyroid Disorder" },

  { code: "E27.1", name: "Adrenal Insufficiency" },
  { code: "E24.9", name: "Cushing Syndrome" },
  { code: "E28.2", name: "Polycystic Ovary Syndrome" },
  { code: "E21.3", name: "Hyperparathyroidism" },
  { code: "E20.9", name: "Hypoparathyroidism" },

  { code: "E66.9", name: "Obesity" },
  { code: "R63.6", name: "Underweight" },
  { code: "E55.9", name: "Vitamin D Deficiency" },
  { code: "E53.8", name: "Vitamin B12 Deficiency" },

  // =========================
  // Nephrology & Urology
  // =========================

  { code: "N39.0", name: "Urinary Tract Infection" },
  { code: "N10", name: "Acute Pyelonephritis" },
  { code: "N30.0", name: "Acute Cystitis" },
  { code: "N30.2", name: "Chronic Cystitis" },

  { code: "N17.9", name: "Acute Kidney Injury" },
  { code: "N18.9", name: "Chronic Kidney Disease" },
  { code: "N19", name: "End Stage Renal Disease" },

  { code: "N20.0", name: "Kidney Stone" },
  { code: "N23", name: "Renal Colic" },
  { code: "N13.3", name: "Hydronephrosis" },

  { code: "N04.9", name: "Nephrotic Syndrome" },
  { code: "N05.9", name: "Nephritic Syndrome" },
  { code: "N00.9", name: "Acute Glomerulonephritis" },

  { code: "N40.0", name: "Benign Prostatic Hyperplasia" },
  { code: "N41.9", name: "Prostatitis" },
  { code: "N43.3", name: "Hydrocele" },
  { code: "I86.1", name: "Varicocele" },

  { code: "N32.81", name: "Overactive Bladder" },
  { code: "R32", name: "Urinary Incontinence" },
  { code: "R33.9", name: "Urinary Retention" },
  { code: "R31.9", name: "Hematuria" },

  // =========================
  // Neurology
  // =========================

  { code: "G43.9", name: "Migraine" },
  { code: "G44.2", name: "Tension Headache" },
  { code: "G44.0", name: "Cluster Headache" },
  { code: "R51", name: "Headache" },

  { code: "I63.9", name: "Ischemic Stroke" },
  { code: "I61.9", name: "Hemorrhagic Stroke" },
  { code: "G45.9", name: "Transient Ischemic Attack" },

  { code: "G40.9", name: "Epilepsy" },
  { code: "R56.0", name: "Febrile Seizure" },
  { code: "R56.9", name: "Seizure" },

  { code: "G03.9", name: "Meningitis" },
  { code: "G04.9", name: "Encephalitis" },

  { code: "G51.0", name: "Bell's Palsy" },
  { code: "G20", name: "Parkinson Disease" },
  { code: "G35", name: "Multiple Sclerosis" },

  { code: "G61.0", name: "Guillain-Barre Syndrome" },
  { code: "G62.9", name: "Peripheral Neuropathy" },
  { code: "G50.0", name: "Trigeminal Neuralgia" },
  { code: "G25.0", name: "Essential Tremor" },

  { code: "R42", name: "Vertigo" },
  { code: "H81.1", name: "Benign Paroxysmal Positional Vertigo" },
  { code: "H81.0", name: "Meniere Disease" },
  { code: "R55", name: "Syncope" },

  { code: "G47.0", name: "Insomnia" },
  { code: "F51.0", name: "Primary Insomnia" },
  { code: "G47.3", name: "Sleep Apnea" },

    // =========================
  // Hematology
  // =========================

  { code: "D50.9", name: "Iron Deficiency Anemia" },
  { code: "D51.9", name: "Vitamin B12 Deficiency Anemia" },
  { code: "D52.9", name: "Folate Deficiency Anemia" },
  { code: "D53.9", name: "Megaloblastic Anemia" },
  { code: "D59.9", name: "Hemolytic Anemia" },
  { code: "D61.9", name: "Aplastic Anemia" },
  { code: "D64.9", name: "Anemia" },

  { code: "D57.1", name: "Sickle Cell Disease" },
  { code: "D56.9", name: "Thalassemia" },
  { code: "D68.9", name: "Coagulation Disorder" },
  { code: "D69.6", name: "Thrombocytopenia" },
  { code: "D72.8", name: "Leukocytosis" },
  { code: "D70.9", name: "Neutropenia" },

  { code: "C91.9", name: "Leukemia" },
  { code: "C81.9", name: "Hodgkin Lymphoma" },
  { code: "C85.9", name: "Non-Hodgkin Lymphoma" },
  { code: "C90.0", name: "Multiple Myeloma" },

  // =========================
  // Rheumatology
  // =========================

  { code: "M19.9", name: "Osteoarthritis" },
  { code: "M06.9", name: "Rheumatoid Arthritis" },
  { code: "M10.9", name: "Gout" },
  { code: "M32.9", name: "Systemic Lupus Erythematosus" },
  { code: "M45.9", name: "Ankylosing Spondylitis" },
  { code: "M35.0", name: "Sjogren Syndrome" },
  { code: "M35.3", name: "Polymyalgia Rheumatica" },
  { code: "M31.9", name: "Vasculitis" },
  { code: "M79.7", name: "Fibromyalgia" },
  { code: "M81.9", name: "Osteoporosis" },
  { code: "M85.8", name: "Osteopenia" },

  // =========================
  // Dermatology
  // =========================

  { code: "L03.9", name: "Cellulitis" },
  { code: "L20.9", name: "Atopic Dermatitis" },
  { code: "L30.9", name: "Eczema" },
  { code: "L40.9", name: "Psoriasis" },
  { code: "L70.0", name: "Acne Vulgaris" },
  { code: "L50.9", name: "Urticaria" },

  { code: "B02.9", name: "Herpes Zoster" },
  { code: "B35.9", name: "Dermatophytosis" },
  { code: "B36.9", name: "Fungal Skin Infection" },
  { code: "B86", name: "Scabies" },
  { code: "L01.0", name: "Impetigo" },

  { code: "L23.9", name: "Allergic Contact Dermatitis" },
  { code: "L24.9", name: "Irritant Contact Dermatitis" },
  { code: "L21.9", name: "Seborrheic Dermatitis" },
  { code: "L71.9", name: "Rosacea" },
  { code: "L80", name: "Vitiligo" },
  { code: "L60.0", name: "Ingrown Toenail" },

  // =========================
  // ENT
  // =========================

  { code: "H66.9", name: "Otitis Media" },
  { code: "H60.9", name: "Otitis Externa" },
  { code: "H61.2", name: "Impacted Ear Wax" },
  { code: "H91.9", name: "Hearing Loss" },
  { code: "H93.1", name: "Tinnitus" },

  { code: "J30.9", name: "Allergic Rhinitis" },
  { code: "J33.9", name: "Nasal Polyps" },
  { code: "J32.9", name: "Chronic Rhinosinusitis" },
  { code: "J34.2", name: "Deviated Nasal Septum" },

  { code: "J03.9", name: "Acute Tonsillitis" },
  { code: "J35.0", name: "Chronic Tonsillitis" },
  { code: "J36", name: "Peritonsillar Abscess" },
  { code: "R04.0", name: "Epistaxis" },

  { code: "R49.0", name: "Hoarseness" },
  { code: "R13.1", name: "Dysphagia" },

  // =========================
  // Ophthalmology
  // =========================

  { code: "H10.9", name: "Conjunctivitis" },
  { code: "H10.1", name: "Allergic Conjunctivitis" },
  { code: "S05.0", name: "Corneal Abrasion" },
  { code: "H16.9", name: "Keratitis" },

  { code: "H40.9", name: "Glaucoma" },
  { code: "H40.2", name: "Acute Angle Closure Glaucoma" },
  { code: "H26.9", name: "Cataract" },

  { code: "E11.31", name: "Diabetic Retinopathy" },
  { code: "H35.30", name: "Age Related Macular Degeneration" },
  { code: "H33.2", name: "Retinal Detachment" },

  { code: "H04.1", name: "Dry Eye Syndrome" },
  { code: "H01.0", name: "Blepharitis" },
  { code: "H00.0", name: "Hordeolum (Stye)" },
  { code: "H00.1", name: "Chalazion" },
  { code: "H52.7", name: "Refractive Error" },

    // =========================
  // Obstetrics & Gynecology
  // =========================

  { code: "Z34.9", name: "Normal Pregnancy" },
  { code: "O21.9", name: "Hyperemesis Gravidarum" },
  { code: "O14.9", name: "Preeclampsia" },
  { code: "O15.9", name: "Eclampsia" },
  { code: "O13", name: "Gestational Hypertension" },
  { code: "O20.0", name: "Threatened Miscarriage" },
  { code: "O03.9", name: "Spontaneous Abortion" },
  { code: "O00.9", name: "Ectopic Pregnancy" },
  { code: "O42.9", name: "Premature Rupture of Membranes" },
  { code: "O60.1", name: "Preterm Labor" },
  { code: "O80", name: "Normal Vaginal Delivery" },
  { code: "O82", name: "Cesarean Delivery" },
  { code: "N80.9", name: "Endometriosis" },
  { code: "N73.9", name: "Pelvic Inflammatory Disease" },
  { code: "N76.0", name: "Acute Vaginitis" },
  { code: "B37.3", name: "Vulvovaginal Candidiasis" },
  { code: "A59.0", name: "Trichomoniasis" },
  { code: "N92.0", name: "Menorrhagia" },
  { code: "N91.2", name: "Amenorrhea" },
  { code: "N94.6", name: "Dysmenorrhea" },
  { code: "N93.9", name: "Abnormal Uterine Bleeding" },
  { code: "D25.9", name: "Uterine Fibroid" },
  { code: "N83.2", name: "Ovarian Cyst" },

  // =========================
  // Orthopedics
  // =========================

  { code: "M54.5", name: "Low Back Pain" },
  { code: "M54.2", name: "Neck Pain" },
  { code: "M50.2", name: "Cervical Disc Prolapse" },
  { code: "M51.2", name: "Lumbar Disc Prolapse" },
  { code: "M54.3", name: "Sciatica" },
  { code: "M75.0", name: "Frozen Shoulder" },
  { code: "M75.1", name: "Rotator Cuff Tear" },
  { code: "M77.1", name: "Tennis Elbow" },
  { code: "G56.0", name: "Carpal Tunnel Syndrome" },
  { code: "M72.2", name: "Plantar Fasciitis" },
  { code: "M76.6", name: "Achilles Tendinitis" },
  { code: "M84.4", name: "Stress Fracture" },
  { code: "S83.5", name: "Anterior Cruciate Ligament Injury" },
  { code: "S93.4", name: "Ankle Sprain" },
  { code: "S43.0", name: "Shoulder Dislocation" },
  { code: "S73.0", name: "Hip Dislocation" },
  { code: "S52.5", name: "Distal Radius Fracture" },
  { code: "S72.0", name: "Neck of Femur Fracture" },

  // =========================
  // General Surgery
  // =========================

  { code: "K40.9", name: "Inguinal Hernia" },
  { code: "K42.9", name: "Umbilical Hernia" },
  { code: "K43.9", name: "Incisional Hernia" },
  { code: "K61.0", name: "Perianal Abscess" },
  { code: "K60.2", name: "Anal Fissure" },
  { code: "L05.9", name: "Pilonidal Sinus" },
  { code: "L02.9", name: "Skin Abscess" },
  { code: "L72.3", name: "Sebaceous Cyst" },
  { code: "D17.9", name: "Lipoma" },
  { code: "K40.3", name: "Strangulated Inguinal Hernia" },

  // =========================
  // Emergency & Critical Care
  // =========================

  { code: "A41.9", name: "Sepsis" },
  { code: "R65.2", name: "Septic Shock" },
  { code: "R57.1", name: "Hypovolemic Shock" },
  { code: "R57.0", name: "Cardiogenic Shock" },
  { code: "R57.8", name: "Obstructive Shock" },
  { code: "T78.2", name: "Anaphylaxis" },
  { code: "T67.0", name: "Heat Stroke" },
  { code: "E86.0", name: "Dehydration" },
  { code: "R07.4", name: "Chest Pain" },
  { code: "R06.0", name: "Dyspnea" },
  { code: "R10.9", name: "Acute Abdominal Pain" },
  { code: "R11.2", name: "Nausea and Vomiting" },
  { code: "R04.2", name: "Hemoptysis" },
  { code: "K92.2", name: "Gastrointestinal Bleeding" },
  { code: "R04.0", name: "Epistaxis" },
  { code: "T14.9", name: "Trauma" },
  { code: "T07", name: "Multiple Trauma" },
  { code: "R40.2", name: "Coma" },

  // =========================
  // Infectious Diseases
  // =========================

  { code: "A09", name: "Acute Infectious Diarrhea" },
  { code: "A01.0", name: "Typhoid Fever" },
  { code: "A90", name: "Dengue Fever" },
  { code: "B50.9", name: "Malaria" },
  { code: "B34.9", name: "Viral Infection" },
  { code: "B99", name: "Infectious Disease" },
  { code: "A46", name: "Erysipelas" },
  { code: "A49.9", name: "Bacterial Infection" },
  { code: "B37.9", name: "Candidiasis" },
  { code: "B35.9", name: "Dermatophytosis" },
  { code: "B02.9", name: "Herpes Zoster" },
  { code: "B00.9", name: "Herpes Simplex Infection" },
  { code: "B01.9", name: "Chickenpox" },
  { code: "B05.9", name: "Measles" },
  { code: "B06.9", name: "Rubella" },
  { code: "B26.9", name: "Mumps" },
  { code: "Z20.9", name: "Exposure to Communicable Disease" },
];

export default diagnoses;