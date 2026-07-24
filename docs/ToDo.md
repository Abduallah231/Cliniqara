3) WorkingDayDto
حاليًا تتحقق من وجود:
startTime
endTime
لكن لا تتحقق أن:
startTime < endTime
وهذا يسمح بإدخال:
18:00
08:00
وسيقبلها النظام.
هذا يحتاج Validator مخصص لاحقًا. ليس ضروريًا الآن، لكن سجله ضمن الـ TODO.

