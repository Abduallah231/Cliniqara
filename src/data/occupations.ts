const occupations = [
  // =========================
  // A
  // =========================
  {
    id: "accountant",
    label: "Accountant",
    value: "Accountant",
  },
  {
    id: "accounting-clerk",
    label: "Accounting Clerk",
    value: "Accounting Clerk",
  },
  {
    id: "accounting-manager",
    label: "Accounting Manager",
    value: "Accounting Manager",
  },
  {
    id: "actor",
    label: "Actor",
    value: "Actor",
  },
  {
    id: "actress",
    label: "Actress",
    value: "Actress",
  },
  {
    id: "administrator",
    label: "Administrator",
    value: "Administrator",
  },
  {
    id: "administrative-assistant",
    label: "Administrative Assistant",
    value: "Administrative Assistant",
  },
  {
    id: "agricultural-engineer",
    label: "Agricultural Engineer",
    value: "Agricultural Engineer",
  },
  {
    id: "agricultural-worker",
    label: "Agricultural Worker",
    value: "Agricultural Worker",
  },
  {
    id: "air-traffic-controller",
    label: "Air Traffic Controller",
    value: "Air Traffic Controller",
  },
  {
    id: "airline-employee",
    label: "Airline Employee",
    value: "Airline Employee",
  },
  {
    id: "architect",
    label: "Architect",
    value: "Architect",
  },
  {
    id: "artist",
    label: "Artist",
    value: "Artist",
  },
  {
    id: "assistant-manager",
    label: "Assistant Manager",
    value: "Assistant Manager",
  },
  {
    id: "athlete",
    label: "Athlete",
    value: "Athlete",
  },
  {
    id: "attorney",
    label: "Attorney",
    value: "Attorney",
  },
  {
    id: "author",
    label: "Author",
    value: "Author",
  },

  // =========================
  // B
  // =========================
  {
    id: "baker",
    label: "Baker",
    value: "Baker",
  },
  {
    id: "bank-employee",
    label: "Bank Employee",
    value: "Bank Employee",
  },
  {
    id: "banker",
    label: "Banker",
    value: "Banker",
  },
  {
    id: "barber",
    label: "Barber",
    value: "Barber",
  },
  {
    id: "bartender",
    label: "Bartender",
    value: "Bartender",
  },
  {
    id: "beautician",
    label: "Beautician",
    value: "Beautician",
  },
  {
    id: "biologist",
    label: "Biologist",
    value: "Biologist",
  },
  {
    id: "bookkeeper",
    label: "Bookkeeper",
    value: "Bookkeeper",
  },
  {
    id: "bricklayer",
    label: "Bricklayer",
    value: "Bricklayer",
  },
  {
    id: "business-analyst",
    label: "Business Analyst",
    value: "Business Analyst",
  },
  {
    id: "business-owner",
    label: "Business Owner",
    value: "Business Owner",
  },
  {
    id: "businessman",
    label: "Businessman",
    value: "Businessman",
  },
  {
    id: "businesswoman",
    label: "Businesswoman",
    value: "Businesswoman",
  },

  // =========================
  // C
  // =========================
  {
    id: "car-dealer",
    label: "Car Dealer",
    value: "Car Dealer",
  },
  {
    id: "car-mechanic",
    label: "Car Mechanic",
    value: "Car Mechanic",
  },
  {
    id: "carpenter",
    label: "Carpenter",
    value: "Carpenter",
  },
  {
    id: "cashier",
    label: "Cashier",
    value: "Cashier",
  },
  {
    id: "chef",
    label: "Chef",
    value: "Chef",
  },
  {
    id: "chemist",
    label: "Chemist",
    value: "Chemist",
  },
  {
    id: "civil-engineer",
    label: "Civil Engineer",
    value: "Civil Engineer",
  },
  {
    id: "cleaner",
    label: "Cleaner",
    value: "Cleaner",
  },
  {
    id: "clerk",
    label: "Clerk",
    value: "Clerk",
  },
  {
    id: "coach",
    label: "Coach",
    value: "Coach",
  },
  {
    id: "computer-engineer",
    label: "Computer Engineer",
    value: "Computer Engineer",
  },
  {
    id: "computer-technician",
    label: "Computer Technician",
    value: "Computer Technician",
  },
  {
    id: "consultant",
    label: "Consultant",
    value: "Consultant",
  },
  {
    id: "construction-worker",
    label: "Construction Worker",
    value: "Construction Worker",
  },
  {
    id: "contractor",
    label: "Contractor",
    value: "Contractor",
  },
  {
    id: "cook",
    label: "Cook",
    value: "Cook",
  },
  {
    id: "customer-service",
    label: "Customer Service",
    value: "Customer Service",
  },
  {
    id: "customer-service-agent",
    label: "Customer Service Agent",
    value: "Customer Service Agent",
  },

  // =========================
  // D
  // =========================
  {
    id: "data-analyst",
    label: "Data Analyst",
    value: "Data Analyst",
  },
  {
    id: "data-entry-clerk",
    label: "Data Entry Clerk",
    value: "Data Entry Clerk",
  },
  {
    id: "dentist",
    label: "Dentist",
    value: "Dentist",
  },
  {
    id: "designer",
    label: "Designer",
    value: "Designer",
  },
  {
    id: "driver",
    label: "Driver",
    value: "Driver",
  },
  {
    id: "delivery-driver",
    label: "Delivery Driver",
    value: "Delivery Driver",
  },
  {
    id: "doctor",
    label: "Doctor",
    value: "Doctor",
  },
  {
    id: "domestic-worker",
    label: "Domestic Worker",
    value: "Domestic Worker",
  },

  // =========================
  // E
  // =========================
  {
    id: "economist",
    label: "Economist",
    value: "Economist",
  },
  {
    id: "electrician",
    label: "Electrician",
    value: "Electrician",
  },
  {
    id: "electrical-engineer",
    label: "Electrical Engineer",
    value: "Electrical Engineer",
  },
  {
    id: "electronics-technician",
    label: "Electronics Technician",
    value: "Electronics Technician",
  },
  {
    id: "engineer",
    label: "Engineer",
    value: "Engineer",
  },
  {
    id: "entrepreneur",
    label: "Entrepreneur",
    value: "Entrepreneur",
  },

  // =========================
  // F
  // =========================
  {
    id: "factory-worker",
    label: "Factory Worker",
    value: "Factory Worker",
  },
  {
    id: "farmer",
    label: "Farmer",
    value: "Farmer",
  },
  {
    id: "fashion-designer",
    label: "Fashion Designer",
    value: "Fashion Designer",
  },
  {
    id: "film-director",
    label: "Film Director",
    value: "Film Director",
  },
  {
    id: "financial-analyst",
    label: "Financial Analyst",
    value: "Financial Analyst",
  },
    {
    id: "firefighter",
    label: "Firefighter",
    value: "Firefighter",
  },
  {
    id: "fisherman",
    label: "Fisherman",
    value: "Fisherman",
  },
  {
    id: "flight-attendant",
    label: "Flight Attendant",
    value: "Flight Attendant",
  },

  // =========================
  // G
  // =========================
  {
    id: "gardener",
    label: "Gardener",
    value: "Gardener",
  },
  {
    id: "general-manager",
    label: "General Manager",
    value: "General Manager",
  },
  {
    id: "geologist",
    label: "Geologist",
    value: "Geologist",
  },
  {
    id: "government-employee",
    label: "Government Employee",
    value: "Government Employee",
  },
  {
    id: "graphic-designer",
    label: "Graphic Designer",
    value: "Graphic Designer",
  },

  // =========================
  // H
  // =========================
  {
    id: "hairdresser",
    label: "Hairdresser",
    value: "Hairdresser",
  },
  {
    id: "hair-stylist",
    label: "Hair Stylist",
    value: "Hair Stylist",
  },
  {
    id: "healthcare-worker",
    label: "Healthcare Worker",
    value: "Healthcare Worker",
  },
  {
    id: "homemaker",
    label: "Homemaker",
    value: "Homemaker",
  },
  {
    id: "housekeeper",
    label: "Housekeeper",
    value: "Housekeeper",
  },
  {
    id: "housewife",
    label: "Housewife",
    value: "Housewife",
  },
  {
    id: "human-resources-manager",
    label: "Human Resources Manager",
    value: "Human Resources Manager",
  },

  // =========================
  // I
  // =========================
  {
    id: "insurance-agent",
    label: "Insurance Agent",
    value: "Insurance Agent",
  },
  {
    id: "interior-designer",
    label: "Interior Designer",
    value: "Interior Designer",
  },
  {
    id: "interpreter",
    label: "Interpreter",
    value: "Interpreter",
  },
  {
    id: "it-specialist",
    label: "IT Specialist",
    value: "IT Specialist",
  },
  {
    id: "it-technician",
    label: "IT Technician",
    value: "IT Technician",
  },

  // =========================
  // J
  // =========================
  {
    id: "journalist",
    label: "Journalist",
    value: "Journalist",
  },
  {
    id: "judge",
    label: "Judge",
    value: "Judge",
  },

  // =========================
  // L
  // =========================
  {
    id: "laborer",
    label: "Laborer",
    value: "Laborer",
  },
  {
    id: "lab-technician",
    label: "Laboratory Technician",
    value: "Laboratory Technician",
  },
  {
    id: "lawyer",
    label: "Lawyer",
    value: "Lawyer",
  },
  {
    id: "lecturer",
    label: "Lecturer",
    value: "Lecturer",
  },
  {
    id: "librarian",
    label: "Librarian",
    value: "Librarian",
  },

  // =========================
  // M
  // =========================
  {
    id: "machine-operator",
    label: "Machine Operator",
    value: "Machine Operator",
  },
  {
    id: "manager",
    label: "Manager",
    value: "Manager",
  },
  {
    id: "marketing-specialist",
    label: "Marketing Specialist",
    value: "Marketing Specialist",
  },
  {
    id: "masseur",
    label: "Masseur",
    value: "Masseur",
  },
  {
    id: "mechanic",
    label: "Mechanic",
    value: "Mechanic",
  },
  {
    id: "medical-doctor",
    label: "Medical Doctor",
    value: "Medical Doctor",
  },
  {
    id: "medical-student",
    label: "Medical Student",
    value: "Medical Student",
  },
  {
    id: "merchant",
    label: "Merchant",
    value: "Merchant",
  },
  {
    id: "military",
    label: "Military",
    value: "Military",
  },
  {
    id: "musician",
    label: "Musician",
    value: "Musician",
  },

  // =========================
  // N
  // =========================
  {
    id: "nurse",
    label: "Nurse",
    value: "Nurse",
  },
  {
    id: "nursing-student",
    label: "Nursing Student",
    value: "Nursing Student",
  },
  {
    id: "nutritionist",
    label: "Nutritionist",
    value: "Nutritionist",
  },

  // =========================
  // O
  // =========================
  {
    id: "office-employee",
    label: "Office Employee",
    value: "Office Employee",
  },
  {
    id: "office-worker",
    label: "Office Worker",
    value: "Office Worker",
  },
  {
    id: "optometrist",
    label: "Optometrist",
    value: "Optometrist",
  },
  {
    id: "owner",
    label: "Owner",
    value: "Owner",
  },

  // =========================
  // P
  // =========================
  {
    id: "paramedic",
    label: "Paramedic",
    value: "Paramedic",
  },
  {
    id: "pharmacist",
    label: "Pharmacist",
    value: "Pharmacist",
  },
  {
    id: "photographer",
    label: "Photographer",
    value: "Photographer",
  },
  {
    id: "physician",
    label: "Physician",
    value: "Physician",
  },
  {
    id: "pilot",
    label: "Pilot",
    value: "Pilot",
  },
  {
    id: "plumber",
    label: "Plumber",
    value: "Plumber",
  },
  {
    id: "police-officer",
    label: "Police Officer",
    value: "Police Officer",
  },
  {
    id: "policeman",
    label: "Policeman",
    value: "Policeman",
  },
  {
    id: "policewoman",
    label: "Policewoman",
    value: "Policewoman",
  },
  {
    id: "professor",
    label: "Professor",
    value: "Professor",
  },
  {
    id: "programmer",
    label: "Programmer",
    value: "Programmer",
  },
  {
    id: "project-manager",
    label: "Project Manager",
    value: "Project Manager",
  },
  {
    id: "psychologist",
    label: "Psychologist",
    value: "Psychologist",
  },

  // =========================
  // R
  // =========================
  {
    id: "receptionist",
    label: "Receptionist",
    value: "Receptionist",
  },
  {
    id: "researcher",
    label: "Researcher",
    value: "Researcher",
  },
  {
    id: "restaurant-worker",
    label: "Restaurant Worker",
    value: "Restaurant Worker",
  },
  {
    id: "retired",
    label: "Retired",
    value: "Retired",
  },

  // =========================
  // S
  // =========================
  {
    id: "sales-manager",
    label: "Sales Manager",
    value: "Sales Manager",
  },
  {
    id: "sales-representative",
    label: "Sales Representative",
    value: "Sales Representative",
  },
  {
    id: "salesperson",
    label: "Salesperson",
    value: "Salesperson",
  },
  {
    id: "scientist",
    label: "Scientist",
    value: "Scientist",
  },
  {
    id: "secretary",
    label: "Secretary",
    value: "Secretary",
  },
  {
    id: "security-guard",
    label: "Security Guard",
    value: "Security Guard",
  },
  {
    id: "social-worker",
    label: "Social Worker",
    value: "Social Worker",
  },
  {
    id: "software-developer",
    label: "Software Developer",
    value: "Software Developer",
  },
  {
    id: "software-engineer",
    label: "Software Engineer",
    value: "Software Engineer",
  },
  {
    id: "soldier",
    label: "Soldier",
    value: "Soldier",
  },
  {
    id: "student",
    label: "Student",
    value: "Student",
  },
  {
    id: "surgeon",
    label: "Surgeon",
    value: "Surgeon",
  },

  // =========================
  // T
  // =========================
  {
    id: "tailor",
    label: "Tailor",
    value: "Tailor",
  },
  {
    id: "teacher",
    label: "Teacher",
    value: "Teacher",
  },
  {
    id: "teaching-assistant",
    label: "Teaching Assistant",
    value: "Teaching Assistant",
  },
  {
    id: "technician",
    label: "Technician",
    value: "Technician",
  },
  {
    id: "telephone-operator",
    label: "Telephone Operator",
    value: "Telephone Operator",
  },
  {
    id: "tour-guide",
    label: "Tour Guide",
    value: "Tour Guide",
  },
  {
    id: "translator",
    label: "Translator",
    value: "Translator",
  },
  {
    id: "truck-driver",
    label: "Truck Driver",
    value: "Truck Driver",
  },

  // =========================
  // V
  // =========================
  {
    id: "veterinarian",
    label: "Veterinarian",
    value: "Veterinarian",
  },
  {
    id: "vet",
    label: "Vet",
    value: "Vet",
  },

  // =========================
  // W
  // =========================
  {
    id: "waiter",
    label: "Waiter",
    value: "Waiter",
  },
  {
    id: "waitress",
    label: "Waitress",
    value: "Waitress",
  },
  {
    id: "warehouse-worker",
    label: "Warehouse Worker",
    value: "Warehouse Worker",
  },
  {
    id: "web-developer",
    label: "Web Developer",
    value: "Web Developer",
  },
  {
    id: "welder",
    label: "Welder",
    value: "Welder",
  },
  {
    id: "writer",
    label: "Writer",
    value: "Writer",
  },

  // =========================
  // Child / Student
  // =========================
  {
    id: "child",
    label: "Child",
    value: "Child",
  },
  {
    id: "preschool-child",
    label: "Preschool Child",
    value: "Preschool Child",
  },
  {
    id: "school-student",
    label: "School Student",
    value: "School Student",
  },
  {
    id: "university-student",
    label: "University Student",
    value: "University Student",
  },

  // =========================
  // Common / General
  // =========================
  {
    id: "freelancer",
    label: "Freelancer",
    value: "Freelancer",
  },
  {
    id: "self-employed",
    label: "Self-Employed",
    value: "Self-Employed",
  },
  {
    id: "shop-owner",
    label: "Shop Owner",
    value: "Shop Owner",
  },
  {
    id: "shopkeeper",
    label: "Shopkeeper",
    value: "Shopkeeper",
  },
  {
    id: "sales-agent",
    label: "Sales Agent",
    value: "Sales Agent",
  },
  {
    id: "service-worker",
    label: "Service Worker",
    value: "Service Worker",
  },
  {
    id: "skilled-worker",
    label: "Skilled Worker",
    value: "Skilled Worker",
  },
  {
    id: "unskilled-worker",
    label: "Unskilled Worker",
    value: "Unskilled Worker",
  },
  {
    id: "unemployed",
    label: "Unemployed",
    value: "Unemployed",
  },
  {
    id: "unable-to-work",
    label: "Unable to Work",
    value: "Unable to Work",
  },
  {
    id: "household-worker",
    label: "Household Worker",
    value: "Household Worker",
  },
  {
    id: "retired-person",
    label: "Retired Person",
    value: "Retired Person",
  },
  {
    id: "other",
    label: "Other",
    value: "Other",
  },
];

export default occupations;