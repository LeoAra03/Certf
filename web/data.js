/* Certf — fuente única de datos.
   Este archivo se lee directamente en la web (sin fetch, para que funcione en "file"://
   dentro del WebView de Android) y tools/build_data.py lo convierte a data.json
   para el lado nativo (notificaciones).

   Campos por credencial:
     id, n (nombre), i (institución), p (peso CV 1-10), c (área),
     t  = gratis | beca | descuento | estudiante      (condición)
     disc = descuento máximo verificable en %  (100 = gratis total, 50 = mitad de precio)
     kind = cert (certificación/examen) | badge (insignia o credencial digital)
     examen = tipo de test (opcion multiple, laboratorio, oral, proyecto...)
     peso_n = por que pesa en el CV (razon verificable)
     cond, url, lang, verify, deadline (opcional), note
*/

window.__CERTF__ = {
  "updated": "2026-09-12",

  // Fechas críticas / vencimientos de vouchers y promociones
  "deadlines": [
    {
      "id": "aws-aif2cloud",
      "title": "Código AIF2CLOUD (AWS): AI Practitioner 50% + Cloud Practitioner gratis",
      "date": "2026-09-30",
      "approx": false,
      "url": "https://www.pearsonvue.com/us/en/aws/aif2cloud.html",
      "note": "Debes rendir y aprobar AIF-C01 antes del 30-sep-2026 para que el CLF-C02 te salga $0."
    },
    {
      "id": "ms-certweek-start",
      "title": "Microsoft Certification Week 2026 (inicio)",
      "date": "2026-09-28",
      "approx": false,
      "url": "https://certweeks.fastlane.net/amer/az-sec-en",
      "note": "5 días de entrenamiento en vivo. Voucher 100% si asistes y sacas ≥80% en el LevelUp assessment. Requiere email corporativo."
    },
    {
      "id": "ms-certweek-end",
      "title": "Microsoft Certification Week 2026 (fin)",
      "date": "2026-10-02",
      "approx": false,
      "url": "https://certweeks.fastlane.net/amer/az-sec-en",
      "note": "Último día para completar las 5 sesiones y reclamar el voucher."
    },
    {
      "id": "aws-clf-deadline",
      "title": "Último día para rendir gratis AWS Cloud Practitioner (CLF-C02)",
      "date": "2026-11-30",
      "approx": false,
      "url": "https://www.pearsonvue.com/us/en/aws/aif2cloud.html",
      "note": "Solo si aprobaste AIF-C01 con el código AIF2CLOUD antes del 30-sep-2026."
    },
    {
      "id": "ms-ignite",
      "title": "Microsoft Ignite 2026 (Cloud Skills Challenges con vouchers)",
      "date": "2026-11-16",
      "approx": true,
      "url": "https://learn.microsoft.com/en-us/training/events/",
      "note": "Fecha referencial de nov-2026. Los retos de habilidades de Ignite suelen dar vouchers de 50% y a veces 100%: usa la misma cuenta Microsoft Learn con la que rendirás."
    },
    {
      "id": "reinvent",
      "title": "AWS re:Invent 2026 (voucher 50% para asistentes)",
      "date": "2026-11-30",
      "approx": true,
      "url": "https://aws.amazon.com/certification/",
      "note": "Fecha referencial (30-nov a 4-dic). Confirma en aws.amazon.com antes de planificar."
    },
    {
      "id": "isc2-codes",
      "title": "Vencen los códigos gratuitos ISC2 1MCC ya emitidos",
      "date": "2026-12-31",
      "approx": false,
      "url": "https://www.isc2.org/1mcc",
      "note": "Solo aplica si te inscribiste antes del 20-may-2026. El programa ya no acepta nuevos."
    }
  ],

  // Catálogo de credenciales. p = peso en el CV (1-10). t = gratis | beca | descuento | estudiante
  "certs": [
    { "id": "aws-clf", "n": "AWS Certified Cloud Practitioner (CLF-C02)", "i": "AWS", "p": 10, "c": "Cloud", "t": "gratis", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple", "peso_n": "La credencial cloud más pedida en vacantes junior; el empleador la verifica en Credly (URL pública).",
      "cond": "100% gratis con código AIF2CLOUD o con voucher de estudiante (21 badges)", "url": "https://www.pearsonvue.com/us/en/aws/aif2cloud.html",
      "lang": "Inglés", "verify": "Credly (URL pública)", "deadline": "aws-aif2cloud",
      "note": "La credencial cloud más pedida en vacantes junior. Pasa filtros ATS y el empleador puede verificarla en Credly." },

    { "id": "aws-aif", "n": "AWS Certified AI Practitioner (AIF-C01)", "i": "AWS", "p": 9, "c": "IA", "t": "descuento", "disc": 50, "kind": "cert",
      "examen": "Opción múltiple", "peso_n": "Certificación nueva de IA de AWS; es la llave para que el Cloud Practitioner te salga gratis.",
      "cond": "50% dto (US$50) con AIF2CLOUD: la página trae 'Get promo code' y el registro del examen · 100% gratis con voucher de estudiante", "url": "https://www.pearsonvue.com/us/en/aws/aif2cloud.html",
      "lang": "Inglés", "verify": "Credly", "deadline": "aws-aif2cloud",
      "note": "Certificación de IA fundacional, sin requisitos técnicos. Es la llave para que el CLF salga gratis. Si eres estudiante, el voucher de US$100 está en builder.aws.com/student-rewards." },

    { "id": "ms-certweek", "n": "Examen Microsoft a elección (AZ-305, AI-200, DP-600, SC-500, GH-600, PL-400)", "i": "Microsoft", "p": 9, "c": "Cloud", "t": "gratis", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple", "peso_n": "Única vía hoy a un examen Microsoft de rol (pagado normalmente) con voucher 100%.",
      "cond": "Voucher 100% en Certification Week 2026 (28-sep a 2-oct)", "url": "https://certweeks.fastlane.net/amer/az-sec-en",
      "lang": "Inglés", "verify": "Credly", "deadline": "ms-certweek-start",
      "note": "Única vía gratuita hoy a un examen Microsoft rol-basado. Requiere email corporativo (partner) y ≥80% en el assessment." },

    { "id": "ms-applied", "n": "Microsoft Applied Skills (30+ credenciales de laboratorio)", "i": "Microsoft", "p": 8, "c": "Cloud", "t": "gratis", "disc": 100, "kind": "cert",
      "examen": "Laboratorio práctico", "peso_n": "Credencial de Microsoft sin pagar examen: demuestra ejecución en laboratorios reales, no teoría.",
      "cond": "100% gratis: elige la credencial en el catálogo directo y rinde la evaluación en laboratorio real", "url": "https://learn.microsoft.com/en-us/credentials/browse/?credential_types=applied%20skills",
      "lang": "Inglés", "verify": "Perfil Microsoft Learn + Credly",
      "note": "Credencial verificable de Microsoft sin pagar examen. Demuestra ejecución, no teoría. No caduca. Entra con cuenta Microsoft gratis." },

    { "id": "g-cyber", "n": "Google Cybersecurity", "i": "Google", "p": 8, "c": "Seguridad", "t": "beca", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple + proyecto final", "peso_n": "Alineada con CompTIA Security+ y con el consorcio de 150+ empleadores de Google.",
      "cond": "Beca Financial Aid 75–100% (≈15-16 días de aprobación)", "url": "https://www.coursera.org/google-certificates/cybersecurity-certificate",
      "lang": "Español / Inglés", "verify": "Certificado Coursera con URL propia",
      "note": "Alineado con CompTIA Security+; acceso al consorcio de 150+ empleadores de Google." },

    { "id": "g-data", "n": "Google Data Analytics (+ Advanced Data Analytics)", "i": "Google", "p": 8, "c": "Datos", "t": "beca", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple + proyecto final", "peso_n": "La certificación de datos más reconocida por reclutadores no técnicos.",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/google-certificates/data-analytics-certificate",
      "lang": "Español / Inglés", "verify": "Certificado Coursera",
      "note": "SQL + Tableau + R. La certificación de datos más reconocida por reclutadores no técnicos." },

    { "id": "g-ai", "n": "Google AI Professional Certificate (nuevo 2026)", "i": "Google", "p": 8, "c": "IA", "t": "beca", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple + proyecto final", "peso_n": "Programa de IA nuevo de Google (2026): la marca Google pesa en IA.",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/google-certificates/google-ai",
      "lang": "Inglés", "verify": "Certificado Coursera",
      "note": "Programa de IA de Google lanzado en 2026; la marca Google en IA pesa más que un curso genérico de prompts." },

    { "id": "stanford-ml", "n": "Machine Learning Specialization (Andrew Ng)", "i": "Stanford + DeepLearning.AI", "p": 8, "c": "IA", "t": "beca", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple + proyecto final", "peso_n": "El nombre Stanford en el CV y la base sólida para roles de ML.",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/specializations/machine-learning-introduction",
      "lang": "Inglés", "verify": "Certificado Coursera (Stanford Online)",
      "note": "Nombre Stanford en el CV; base sólida para roles de ML. 836.000 inscritos, 4.9/5." },

    { "id": "ibm-cyber-uopeople", "n": "IBM SkillsBuild Certificate in Cybersecurity (vía UoPeople)", "i": "IBM + University of the People", "p": 8, "c": "Seguridad", "t": "gratis", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple (4 cursos + final)", "peso_n": "Credencial IBM + hasta 12 créditos universitarios transferibles, todo a $0.",
      "cond": "100% gratis: postula directo (Apply Now) en la página oficial; 4 cursos, examen y credencial + hasta 12 créditos universitarios", "url": "https://www.uopeople.edu/programs/certificate/ibm-skillsbuild/cybersecurity/",
      "lang": "Inglés", "verify": "Credly",
      "note": "El certificado gratuito más fuerte disponible hoy: ~60-65 h, credencial IBM y créditos transferibles. Postulación: botón Apply Now (crea cuenta UoPeople y elige el major 'IBM SkillsBuild'); el curso se ingresa desde my.uopeople.edu. Crea Credly con el MISMO email de la postulación. Plazo 1 año, 80% para aprobar." },

    { "id": "ibm-cyber-coursera", "n": "IBM Cybersecurity Analyst", "i": "IBM", "p": 8, "c": "Seguridad", "t": "beca", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple + proyectos", "peso_n": "Prepara el examen CompTIA Security+ con herramientas reales (SIEM, pentesting).",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/professional-certificates/ibm-cybersecurity-analyst",
      "lang": "Inglés", "verify": "Certificado Coursera",
      "note": "14 cursos orientados a herramientas (SIEM, pentesting, forense) y prepara el examen CompTIA Security+." },

    { "id": "ibm-ds", "n": "IBM Data Science Professional Certificate", "i": "IBM", "p": 8, "c": "Datos", "t": "beca", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple + capstone", "peso_n": "Certificado de datos con capstone y portafolio: keywords fuertes para ATS.",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/professional-certificates/ibm-data-science",
      "lang": "Inglés", "verify": "Certificado Coursera",
      "note": "12 cursos con capstone y portafolio de proyectos. Python, SQL, Pandas, scikit-learn." },

    { "id": "cs50", "n": "CS50x / CS50P / CS50AI / CS50SQL", "i": "Harvard", "p": 8, "c": "Desarrollo", "t": "gratis", "disc": 100, "kind": "cert",
      "examen": "Proyectos + coding", "peso_n": "Harvard en el CV sin costo; de las credenciales gratuitas más exigidas del mundo.",
      "cond": "100% gratis completando problem sets + proyecto final", "url": "https://cs50.harvard.edu/x/",
      "lang": "Inglés", "verify": "certificates.cs50.io (link único)",
      "note": "Harvard en el CV sin pagar los US$219 del certificado verificado de edX. CS50AI es de las mejores credenciales gratuitas de IA." },

    { "id": "mit-micromasters", "n": "MITx MicroMasters en Statistics and Data Science", "i": "MIT", "p": 8, "c": "Datos", "t": "descuento", "disc": 90, "kind": "cert",
      "examen": "Opción múltiple + proyectos", "peso_n": "Peso académico real: se convalida en másteres de MIT y otras universidades.",
      "cond": "Asistencia financiera 80–90% (US$1.350 a ≈US$150-300)", "url": "https://www.edx.org/micromasters/mitx-statistics-and-data-science",
      "lang": "Inglés", "verify": "Certificado edX / MITx",
      "note": "Peso académico real, convalidable en másteres MIT y de otras universidades. edX nunca da el 100%." },

    { "id": "fortinet-fcf", "n": "Fortinet FCF + FCA Cybersecurity (NSE 1, 2 y 3)", "i": "Fortinet Training Institute", "p": 7, "c": "Seguridad", "t": "gratis", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple (examen online $0)", "peso_n": "Poca cert de seguridad con examen a $0 real; cuenta en empresas con Fortinet.",
      "cond": "100% gratis: entra directo al curso NSE 1 (cuenta gratis); NSE 2/3 y exámenes FCF/FCA a $0", "url": "https://training.fortinet.com/local/staticpage/view.php?page=library_cybersecurity-and-cloud-fundamentals",
      "lang": "Inglés", "verify": "Fortinet Training Institute + Credly",
      "note": "De las pocas certificaciones de seguridad con examen $0 real (no solo curso gratis). Pesa en empresas con firewall Fortinet; suma keywords de ciberseguridad en el ATS. En el mismo sitio: NSE 2 'Introduction to NGFW' y NSE 3 'FortiGate Operator'." },

    { "id": "aws-exam-benefit", "n": "AWS Exam Pass Benefit (50% en tu siguiente examen)", "i": "AWS", "p": 7, "c": "Cloud", "t": "descuento", "disc": 50, "kind": "cert",
      "examen": "Opción múltiple", "peso_n": "Beneficio permanente (no promoción): 50% en el examen siguiente, visible en tu cuenta AWS.",
      "cond": "Aprueba cualquier examen AWS: 50% dto en el siguiente (vigente 12 meses)", "url": "https://aws.amazon.com/certification/",
      "lang": "Inglés", "verify": "Cuenta AWS Certification",
      "note": "Beneficio permanente, no una promoción: encadena CLF a SAA a Developer y baja de US$400 a ≈US$250. El voucher llega por correo a los pocos días de aprobar." },

    { "id": "g-pm", "n": "Google Project Management", "i": "Google", "p": 7, "c": "Gestión", "t": "beca", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple + proyecto final", "peso_n": "Alternativa creíble al CAPM/PMP para perfiles junior de gestión.",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/google-certificates/project-management-certificate",
      "lang": "Español / Inglés", "verify": "Certificado Coursera",
      "note": "Alternativa creíble antes del CAPM/PMP. 121.000 reseñas, 4.9/5." },

    { "id": "g-it", "n": "Google IT Support", "i": "Google", "p": 7, "c": "Cloud", "t": "beca", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple + proyecto final", "peso_n": "La más aceptada para el primer empleo de soporte/helpdesk (base de CompTIA A+).",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/google-certificates/it-support-certificate",
      "lang": "Español / Inglés", "verify": "Certificado Coursera",
      "note": "Prepara CompTIA A+; el más aceptado para primer empleo de soporte/helpdesk." },

    { "id": "ibm-da", "n": "IBM Data Analyst Professional Certificate", "i": "IBM", "p": 7, "c": "Datos", "t": "beca", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple + proyectos", "peso_n": "Muy orientado a herramientas (Excel, SQL, Python, Tableau): keywords fuertes para ATS.",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/professional-certificates/ibm-data-analyst",
      "lang": "Inglés", "verify": "Certificado Coursera",
      "note": "Excel, SQL, Python, Cognos y Tableau. Muy orientado a herramientas: buenas keywords para ATS." },

    { "id": "meta-fe", "n": "Meta Front-End Developer", "i": "Meta", "p": 7, "c": "Desarrollo", "t": "beca", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple + proyecto final", "peso_n": "Marca Meta + proyecto final que sirve de portafolio.",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/professional-certificates/meta-front-end-developer",
      "lang": "Inglés", "verify": "Certificado Coursera",
      "note": "HTML/CSS/JS + React + Bootstrap con marca Meta, con proyecto final para portafolio." },

    { "id": "meta-db", "n": "Meta Database Engineer", "i": "Meta", "p": 7, "c": "Datos", "t": "beca", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple + proyectos", "peso_n": "9 cursos con 5 proyectos de bases de datos aplicados.",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/professional-certificates/meta-database-engineer",
      "lang": "Inglés", "verify": "Certificado Coursera",
      "note": "SQL, modelado, MySQL y Python aplicados a bases de datos. 9 cursos con 5 proyectos." },

    { "id": "oracle-foundations", "n": "Oracle OCI / OCI AI / Data Foundations", "i": "Oracle University", "p": 7, "c": "Cloud", "t": "gratis", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple (examen online $0)", "peso_n": "Pesa en empresas con stack Oracle; paths oficiales a $0.",
      "cond": "Catálogo oficial 'Free Training and Certifications': entra a cada learning path y dale Start (cuenta MyLearn gratis)", "url": "https://mylearn.oracle.com/ou/story/163512",
      "lang": "Inglés", "verify": "Oracle CertView + badge",
      "note": "Muy valorado en empresas con stack Oracle. Los paths Foundations (OCI, OCI AI, Data) salen con etiqueta 'Certification' en el catálogo; confirma en tu cuenta que el examen está en $0 antes de empezar." },

    { "id": "cisco-junior-cyber", "n": "Cisco Junior Cybersecurity Analyst (5 cursos)", "i": "Cisco Networking Academy", "p": 7, "c": "Seguridad", "t": "gratis", "disc": 100, "kind": "badge",
      "examen": "Labs + opción múltiple", "peso_n": "Ruta oficial Cisco hacia CCST Cybersecurity y CCNA, con 7 labs.",
      "cond": "100% gratis con badge Cisco por curso", "url": "https://www.netacad.com/courses/introduction-to-cybersecurity",
      "lang": "20 idiomas (incl. español)", "verify": "Badge Cisco (Credly)",
      "note": "Ruta oficial Cisco Security con 7 labs; escala natural a CCST Cybersecurity y CCNA." },

    { "id": "ibm-da-uopeople", "n": "IBM SkillsBuild Certificate in Data Analytics (vía UoPeople)", "i": "IBM + University of the People", "p": 7, "c": "Datos", "t": "gratis", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple (3 cursos + final)", "peso_n": "Credencial IBM + hasta 8 créditos universitarios, todo a $0.",
      "cond": "100% gratis: postula directo (Apply Now); 3 cursos + hasta 8 créditos universitarios", "url": "https://www.uopeople.edu/programs/certificate/ibm-skillsbuild/data-analytics/",
      "lang": "Inglés", "verify": "Credly",
      "note": "Misma lógica que el de ciberseguridad, perfil analista de datos, sin costo y sin esperar aprobación de beca. Postulación: botón Apply Now (cuenta UoPeople, major 'IBM SkillsBuild'); el curso se ingresa desde my.uopeople.edu." },

    { "id": "g-ux", "n": "Google UX Design", "i": "Google", "p": 7, "c": "Desarrollo", "t": "beca", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple + portafolio (Figma)", "peso_n": "En UX contrata el portafolio: aquí lo construyes y termina con proyectos en Figma.",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/google-certificates/ux-design-certificate",
      "lang": "Español / Inglés", "verify": "Certificado Coursera",
      "note": "Terminas con portafolio en Figma: en UX lo que contrata es el portafolio, y aquí lo construyes." },

    { "id": "edx-verified", "n": "Cursos verificados de edX (HarvardX, MITx, …)", "i": "Harvard / MIT / edX", "p": 7, "c": "Datos", "t": "descuento", "disc": 90, "kind": "cert",
      "examen": "Opción múltiple + proyectos", "peso_n": "El mismo certificado verificado que el pagado (HarvardX, MITx).",
      "cond": "Asistencia financiera 80–90% (máx. 5 aplicaciones)", "url": "https://courses.edx.org/financial-assistance/",
      "lang": "Inglés", "verify": "Certificado verificado edX",
      "note": "Mismo certificado que el pagado. El remanente suele ser US$20-60 por curso." },

    { "id": "anthropic-academy", "n": "Anthropic Academy (IA, Claude, Claude Code, MCP)", "i": "Anthropic", "p": 6, "c": "IA", "t": "gratis", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple", "peso_n": "Credencial de IA de primera línea (Anthropic) con URL de verificación única.",
      "cond": "100% gratis: ~18 cursos con certificado oficial y URL de verificación única", "url": "https://anthropic.skilljar.com/",
      "lang": "Inglés", "verify": "Certificado Anthropic (Skilljar) con link único",
      "note": "Lanzado en marzo 2026: credencial de IA de primera línea, sin costo ni tarjeta. Empieza por 'AI Fluency: Framework & Foundations' y sigue con 'Building with the Claude API'. No expira." },

    { "id": "gcp-skillsboost", "n": "Google Cloud Skills Boost (300+ skill badges)", "i": "Google Cloud", "p": 6, "c": "Cloud", "t": "gratis", "disc": 100, "kind": "badge",
      "examen": "Laboratorio práctico", "peso_n": "Badges con URL propia que demuestran práctica real en GCP (GenAI, BigQuery, Kubernetes).",
      "cond": "100% gratis: labs reales + skill badge verificable (los exámenes Cloud siguen siendo pagos)", "url": "https://www.cloudskillsboost.google/",
      "lang": "Inglés", "verify": "Perfil público de Google Cloud Skills Boost",
      "note": "Badges con URL propia que demuestran práctica real en GCP (GenAI, BigQuery, Kubernetes). Ideal para llenar el perfil mientras preparas Cloud Digital Leader." },

    { "id": "aws-badges", "n": "AWS Skill Builder Digital Badges (Cloud Quest, Knowledge)", "i": "AWS", "p": 6, "c": "Cloud", "t": "gratis", "disc": 100, "kind": "badge",
      "examen": "Opción múltiple (online)", "peso_n": "Complemento creíble de AWS en LinkedIn; incluye el voucher de estudiante (US$100).",
      "cond": "100% gratis (los exámenes de certificación siguen siendo pagos)", "url": "https://aws.amazon.com/training/badges/",
      "lang": "Inglés", "verify": "Credly",
      "note": "Complemento creíble en LinkedIn mientras preparas el Cloud Practitioner. Además: 21 badges de estudiante = voucher de US$100." },

    { "id": "skillshop", "n": "Google Skillshop (Google Ads, GA4, YouTube, Waze)", "i": "Google", "p": 6, "c": "Marketing", "t": "gratis", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple", "peso_n": "Certificaciones oficiales de producto Google: pesan en marketing digital y analítica web.",
      "cond": "100% gratis", "url": "https://skillshop.withgoogle.com",
      "lang": "Multilenguaje (incl. español)", "verify": "Perfil público de Skillshop",
      "note": "Certificaciones oficiales de producto Google: pesan en marketing digital y analítica web." },

    { "id": "mongodb", "n": "MongoDB Certified Developer / DBA Associate", "i": "MongoDB University", "p": 6, "c": "Datos", "t": "estudiante", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple (examen online $0)", "peso_n": "Certificación de proveedor (no de curso), gratis para estudiantes verificados.",
      "cond": "Gratis para estudiantes verificados (valor US$150) vía GitHub Student Pack", "url": "https://education.github.com/pack",
      "lang": "Inglés", "verify": "Perfil de certificación MongoDB",
      "note": "Certificación de proveedor (no un badge de curso). Requiere completar el learning path y ser estudiante verificado." },

    { "id": "github-foundations", "n": "GitHub Foundations Certification", "i": "GitHub (Microsoft)", "p": 6, "c": "Desarrollo", "t": "estudiante", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple (online)", "peso_n": "Credencial de GitHub/Microsoft; los vouchers son limitados (la app los detecta al aparecer).",
      "cond": "Voucher gratis para estudiantes verificados (stock limitado; cupones 2025-26 vencían el 30-jun-2026)", "url": "https://education.github.com/pack",
      "lang": "Inglés", "verify": "Credly",
      "note": "Revisa cada mes: GitHub repone tandas de vouchers y se agotan rápido. El botón 'Buscar páginas' de esta app los detecta apenas aparecen." },

    { "id": "cisco-netacad", "n": "Cisco NetAcad: Python, Data Science, CCNA v7", "i": "Cisco Networking Academy", "p": 6, "c": "Desarrollo", "t": "gratis", "disc": 100, "kind": "badge",
      "examen": "Labs + opción múltiple", "peso_n": "Marca líder en networking; sus cursos de Python incluyen laboratorio gratis.",
      "cond": "100% gratis con badge Cisco", "url": "https://www.netacad.com/courses",
      "lang": "Multilenguaje (incl. español)", "verify": "Badge Cisco",
      "note": "Marca #1 en networking; los cursos de Python son de los pocos gratuitos con laboratorio." },

    { "id": "cisco-skillsforall", "n": "Cisco Skills for All (badges en español)", "i": "Cisco", "p": 6, "c": "Desarrollo", "t": "gratis", "disc": 100, "kind": "badge",
      "examen": "Opción múltiple", "peso_n": "La vía más rápida a badges Cisco en español, sin inscripción universitaria.",
      "cond": "100% gratis, sin inscripción universitaria: badges por curso (IA, Python, ciberseguridad, networking)", "url": "https://skillsforall.com/",
      "lang": "Español / Inglés", "verify": "Badge digital Cisco (compartible en LinkedIn)",
      "note": "La vía más rápida a badges Cisco en español: no necesitas que tu institución esté adscrita a NetAcad. Cuenta para la ruta CCST/CCNA." },

    { "id": "ibm-cognitive", "n": "IBM Cognitive Class (600+ cursos con badge/certificado)", "i": "IBM", "p": 5, "c": "Datos", "t": "gratis", "disc": 100, "kind": "badge",
      "examen": "Opción múltiple", "peso_n": "Marca IBM gratis con evidencia verificable mientras se procesa una beca.",
      "cond": "100% gratis con certificado y badge por learning path (Data Science, AI, Cloud, Blockchain)", "url": "https://cognitiveclass.ai/",
      "lang": "Inglés", "verify": "Certificado IBM Cognitive Class (URL propia)",
      "note": "Marca IBM gratis y sin espera de beca: útil para mostrar Python/SQL/ML con evidencia verificable mientras sale la beca de Coursera." },

    { "id": "g-mkt", "n": "Google Digital Marketing & E-commerce", "i": "Google", "p": 6, "c": "Marketing", "t": "beca", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple + proyecto final", "peso_n": "Se apila con Skillshop (Ads + GA4) para un perfil de marketing completo.",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/google-certificates/digital-marketing-certificate",
      "lang": "Español / Inglés", "verify": "Certificado Coursera",
      "note": "Se apila muy bien con Skillshop (Ads + GA4) para perfiles de marketing." },

    { "id": "ibm-short", "n": "IBM SkillsBuild: AI, Data, Cybersecurity y Agile (cursos cortos)", "i": "IBM", "p": 5, "c": "IA", "t": "gratis", "disc": 100, "kind": "badge",
      "examen": "Opción múltiple", "peso_n": "Badges IBM de 4-20 h con Credly: suman marca al perfil sin esperar beca.",
      "cond": "100% gratis: entra directo al catálogo, crea cuenta gratis (Sign up) y enrégate", "url": "https://skillsbuild.org/learning-catalog",
      "lang": "Inglés", "verify": "Credly",
      "note": "4-20 h cada uno, con credencial digital Credly. Ideales para sumar marca IBM al perfil mientras esperas una beca. En el catálogo filtra por tema (AI, Cybersecurity, Data) e idioma (incluye Español)." },

    { "id": "digital-garage", "n": "Fundamentals of Digital Marketing (Garage Digital / Grow with Google)", "i": "Google", "p": 5, "c": "Marketing", "t": "gratis", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple", "peso_n": "La credencial gratuita de marketing mejor considerada en español (acreditada por IAB Europe).",
      "cond": "100% gratis en español", "url": "https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing",
      "lang": "Español", "verify": "Certificado Google / IAB Europe",
      "note": "40 h, acreditado por IAB Europe. La credencial gratuita de marketing mejor considerada en español. La plataforma tiene más cursos con certificado (IA generativa, datos, productividad)." },

    { "id": "hubspot", "n": "HubSpot Academy (Inbound, Content, Sales, Marketing)", "i": "HubSpot", "p": 5, "c": "Marketing", "t": "gratis", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple", "peso_n": "De las pocas certificaciones gratis de marketing/ventas que los reclutadores reconocen por nombre.",
      "cond": "100% gratis con certificación verificable por URL", "url": "https://academy.hubspot.com/certification",
      "lang": "Español / Inglés", "verify": "Perfil público de HubSpot Academy",
      "note": "De las pocas certificaciones gratis de marketing/ventas que los reclutadores reconocen por nombre. Se agrega directo a LinkedIn." },

    { "id": "sence-microsoft", "n": "SENCE + Microsoft: IA generativa, Copilot, Azure, Power BI, C#", "i": "SENCE (Chile) + Microsoft", "p": 5, "c": "IA", "t": "gratis", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple", "peso_n": "Certificado estatal chileno + marca Microsoft: buena combinación para el CV local.",
      "cond": "100% gratis en Chile: postula en el Buscador de Cursos de SENCE (eligemejor.sence.cl) con ClaveÚnica; +18 años, RUN", "url": "https://sence.gob.cl/personas/noticias/sence-y-microsoft-abren-tres-nuevos-cursos-gratuitos-para-ampliar-competencias-digitales",
      "lang": "Español", "verify": "Certificado SENCE / Microsoft Learn",
      "note": "Contenido oficial de Microsoft (Azure, Power BI, Copilot, C#) gratis y en español para residentes en Chile. Certificado estatal + marca Microsoft: buena combinación para el CV local. El enlace es la noticia oficial; la postulación se hace en el buscador de cursos con ClaveÚnica." },

    { "id": "freecodecamp", "n": "freeCodeCamp (11 certificaciones)", "i": "freeCodeCamp", "p": 5, "c": "Desarrollo", "t": "gratis", "disc": 100, "kind": "cert",
      "examen": "Coding + proyectos", "peso_n": "Pesa el portafolio (proyectos públicos y código), no la marca.",
      "cond": "100% gratis con URL pública verificable", "url": "https://www.freecodecamp.org/learn",
      "lang": "Inglés / Español", "verify": "Perfil público con proyectos",
      "note": "~300 h por certificación y 5 proyectos. Pesa el portafolio, no la marca. Está traducido al español (freecodecamp.org/espanol)." },

    { "id": "santander-open", "n": "Santander Open Academy (cursos y becas gratis)", "i": "Banco Santander", "p": 4, "c": "Gestión", "t": "gratis", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple", "peso_n": "Peso medio: suma inglés y competencias blandas verificables a $0.",
      "cond": "100% gratis, sin ser cliente ni tener título; +18 años de 12 países (incl. Chile)", "url": "https://www.santanderopenacademy.com/es",
      "lang": "Español / Inglés", "verify": "Certificado de completitud de la plataforma",
      "note": "Sin límite de plazas: cursos cortos en habilidades demandadas (inglés, IA, Excel, empleabilidad) + convocatorias de becas con universidades. Peso medio en CV, pero suma inglés y competencias blandas verificables." },

    { "id": "telefonica-conecta", "n": "Fundación Telefónica · Conecta Empleo", "i": "Fundación Telefónica Movistar", "p": 4, "c": "Gestión", "t": "gratis", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple", "peso_n": "Itinerarios en español con Certificado Global; en Chile opera con convenio SENCE.",
      "cond": "100% gratis con certificado por curso y 'Certificado Global' al completar un itinerario", "url": "https://conectaempleo.fundaciontelefonica.com/",
      "lang": "Español", "verify": "Certificado Conecta Empleo",
      "note": "Itinerarios en español de ciberseguridad, IA, datos, Office y competencias profesionales. En Chile opera con convenio SENCE." },

    { "id": "capacitate-slim", "n": "Capacítate para el empleo (Fundación Carlos Slim)", "i": "Fundación Carlos Slim", "p": 3, "c": "Gestión", "t": "gratis", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple", "peso_n": "Peso bajo en CV técnico: demuestra oficios y competencias digitales en español.",
      "cond": "100% gratis con diploma y constancias por curso", "url": "https://capacitateparaelempleo.org/",
      "lang": "Español", "verify": "Diploma con folio de la plataforma",
      "note": "Peso bajo en CV técnico, pero útil para demostrar oficios y competencias digitales en español, y es gratis sin requisitos. En Chile también vía convenio SENCE." },

    { "id": "helsinki-ai", "n": "Elements of AI / Building AI", "i": "Universidad de Helsinki", "p": 5, "c": "IA", "t": "gratis", "disc": 100, "kind": "cert",
      "examen": "Opción múltiple", "peso_n": "Credencial universitaria europea en IA (2 ECTS en Finlandia).",
      "cond": "100% gratis con certificado descargable", "url": "https://www.elementsofai.com",
      "lang": "26 idiomas (incl. español)", "verify": "Certificado descargable",
      "note": "Credencial universitaria europea de alfabetización en IA (2 ECTS en Finlandia)." },

    { "id": "helsinki-fso", "n": "Full Stack Open", "i": "Universidad de Helsinki", "p": 5, "c": "Desarrollo", "t": "gratis", "disc": 100, "kind": "cert",
      "examen": "Coding + proyectos", "peso_n": "Full-stack con aval universitario y portafolio excelente (React, Node, TypeScript).",
      "cond": "100% gratis con certificado", "url": "https://fullstackopen.com/en/",
      "lang": "Inglés", "verify": "Certificado de la Universidad de Helsinki",
      "note": "React + Node + TypeScript + GraphQL con aval universitario. Excelente portafolio." },

    { "id": "kaggle", "n": "Kaggle Learn (Pandas, Data Viz, ML, Feature Engineering)", "i": "Kaggle / Google", "p": 4, "c": "Datos", "t": "gratis", "disc": 100, "kind": "badge",
      "examen": "Opción múltiple + notebooks", "peso_n": "Peso bajo-medio: útil como relleno de keywords en perfiles de datos.",
      "cond": "100% gratis con certificado por micro-curso", "url": "https://www.kaggle.com/learn",
      "lang": "Inglés", "verify": "Perfil de Kaggle",
      "note": "Peso bajo-medio: útil como relleno de palabras clave en perfiles de datos." },

    { "id": "trailhead", "n": "Trailhead Superbadges / Ranger rank", "i": "Salesforce", "p": 4, "c": "Marketing", "t": "gratis", "disc": 100, "kind": "badge",
      "examen": "Laboratorio práctico", "peso_n": "Badges Salesforce gratis (no es certificación oficial): muestra práctica, no título.",
      "cond": "100% gratis (NO es una certificación oficial)", "url": "https://trailhead.salesforce.com",
      "lang": "Inglés", "verify": "Perfil de Trailhead",
      "note": "Las certificaciones Salesforce cuestan US$75+; la gratuidad de AI terminó el 31-dic-2025." }
  ],


  // Rutas 0 a PRO: de cero experiencia a perfil profesional.
  // Cada fase trae VARIAS opciones para elegir (no una sola).
  // ids referencia SIEMPRE al campo id de "certs" (si no existe, no se muestra).
  // fechas referencia el campo id de "deadlines" (vouchers por evento).
  "rutas": [
    {
      "id": "cloud", "area": "Cloud", "papel": "Soporte / Cloud junior",
      "fases": [
        { "n": 1, "titulo": "Fundamentos a costo cero", "plazo": "4-8 semanas",
          "objetivo": "Vocabulario, primeros labs y badges verificables que llenan tu perfil mientras no tienes experiencia.",
          "ids": ["ms-applied", "gcp-skillsboost", "aws-badges", "cisco-netacad"] },
        { "n": 2, "titulo": "Primera certificación verificable", "plazo": "2-4 meses",
          "objetivo": "El primer examen que el empleador puede verificar. La AI Practitioner es la llave: con ella el Cloud Practitioner te sale gratis.",
          "ids": ["aws-aif", "aws-clf", "oracle-foundations", "g-it"] },
        { "n": 3, "titulo": "Encadena descuentos y credenciales", "plazo": "2-4 meses",
          "objetivo": "50% en el siguiente examen, badges Cisco y competencias de empleabilidad en español.",
          "ids": ["aws-exam-benefit", "cisco-skillsforall", "santander-open"] },
        { "n": 4, "titulo": "Examen de rol con voucher 100%", "plazo": "cuando haya evento",
          "objetivo": "Examen de rol (AZ-305, SC-500, etc.) a costo cero en eventos oficiales. Vigila las fechas abajo.",
          "ids": ["ms-certweek", "aws-exam-benefit"], "fechas": ["ms-ignite", "reinvent"] }
      ]
    },
    {
      "id": "seguridad", "area": "Seguridad", "papel": "Analista de seguridad junior",
      "fases": [
        { "n": 1, "titulo": "Fundamentos de ciberseguridad", "plazo": "4-8 semanas",
          "objetivo": "Ruta oficial Cisco con 7 labs y la única certificación de seguridad con examen a US$0 real (Fortinet FCF).",
          "ids": ["cisco-junior-cyber", "fortinet-fcf", "ibm-cognitive"] },
        { "n": 2, "titulo": "Certificación con marca (beca)", "plazo": "3-5 meses",
          "objetivo": "Google Cybersecurity está alineado con CompTIA Security+; IBM prepara el examen con herramientas reales (SIEM, pentesting).",
          "ids": ["g-cyber", "ibm-cyber-coursera", "cisco-skillsforall"] },
        { "n": 3, "titulo": "Certificación 100% gratis + créditos", "plazo": "4-8 meses",
          "objetivo": "IBM via UoPeople: examen y credencial gratis, más hasta 12 créditos universitarios transferibles.",
          "ids": ["ibm-cyber-uopeople", "g-it"] },
        { "n": 4, "titulo": "Examen de rol con voucher 100%", "plazo": "cuando haya evento",
          "objetivo": "SC-500 u otro examen de seguridad Microsoft gratis en Certification Week / Ignite. Vigila las fechas abajo.",
          "ids": ["ms-certweek", "fortinet-fcf"], "fechas": ["ms-ignite"] }
      ]
    },
    {
      "id": "ia", "area": "IA", "papel": "Analista junior de IA / automatizaciones",
      "fases": [
        { "n": 1, "titulo": "Alfabetización en IA", "plazo": "3-6 semanas",
          "objetivo": "Certificado universitario europeo (2 ECTS), cursos oficiales de Anthropic con link de verificación único y credenciales IBM gratis.",
          "ids": ["helsinki-ai", "anthropic-academy", "ibm-cognitive"] },
        { "n": 2, "titulo": "Certificado profesional de IA (beca)", "plazo": "3-5 meses",
          "objetivo": "El programa de IA de Google (nuevo 2026), contenido oficial de Microsoft gratis en Chile, o la base clásica de Machine Learning de Stanford.",
          "ids": ["g-ai", "sence-microsoft", "stanford-ml"] },
        { "n": 3, "titulo": "Certificación de proveedor de IA", "plazo": "2-3 meses",
          "objetivo": "AWS AI Practitioner al 50% (y con ella el Cloud Practitioner gratis) + credenciales cortas IBM para sumar marca.",
          "ids": ["aws-aif", "ibm-short"] },
        { "n": 4, "titulo": "Examen de rol con voucher 100%", "plazo": "cuando haya evento",
          "objetivo": "AI-200 u otro examen de rol Microsoft gratis en eventos, encadenando el 50% del Exam Pass Benefit de AWS.",
          "ids": ["ms-certweek", "aws-exam-benefit"], "fechas": ["ms-ignite"] }
      ]
    },
    {
      "id": "datos", "area": "Datos", "papel": "Analista de datos junior",
      "fases": [
        { "n": 1, "titulo": "Fundamentos de datos", "plazo": "4-8 semanas",
          "objetivo": "Micro-cursos Kaggle, learning paths IBM y Python con laboratorio en Cisco, todos gratis y con badge.",
          "ids": ["kaggle", "ibm-cognitive", "cisco-netacad"] },
        { "n": 2, "titulo": "Certificado de analista (beca)", "plazo": "3-5 meses",
          "objetivo": "Google Data Analytics (la más reconocida por reclutadores no técnicos) o IBM Data Analyst con SQL y Python.",
          "ids": ["g-data", "ibm-da"] },
        { "n": 3, "titulo": "Profundiza con capstone y portafolio", "plazo": "4-6 meses",
          "objetivo": "IBM Data Science con 12 cursos y portafolio, o peso académico real con MicroMasters de MIT (asistencia 80-90%).",
          "ids": ["ibm-ds", "mit-micromasters", "edx-verified"] },
        { "n": 4, "titulo": "Certificación 100% gratis + créditos", "plazo": "4-8 meses",
          "objetivo": "IBM via UoPeople (gratis + hasta 8 créditos universitarios) o Meta Database Engineer con proyectos.",
          "ids": ["ibm-da-uopeople", "meta-db"] }
      ]
    },
    {
      "id": "desarrollo", "area": "Desarrollo", "papel": "Desarrollador web junior",
      "fases": [
        { "n": 1, "titulo": "Primer código con portafolio", "plazo": "3-6 meses",
          "objetivo": "freeCodeCamp (proyectos públicos), Python con laboratorio en Cisco y credenciales cortas IBM, todo gratis.",
          "ids": ["freecodecamp", "cisco-netacad", "ibm-short"] },
        { "n": 2, "titulo": "Base sólida de ingeniería", "plazo": "4-8 meses",
          "objetivo": "CS50 de Harvard (gratis completando los problem sets), Full Stack Open de Helsinki o Meta Front-End (beca) con portafolio final.",
          "ids": ["cs50", "helsinki-fso", "meta-fe"] },
        { "n": 3, "titulo": "Certificaciones de estudiante", "plazo": "2-4 meses",
          "objetivo": "Si eres estudiante: MongoDB gratis vía GitHub Student Pack y el voucher de GitHub Foundations (revisa la pestaña Buscar páginas: se agota).",
          "ids": ["mongodb", "github-foundations"] },
        { "n": 4, "titulo": "Examen de rol con voucher 100%", "plazo": "cuando haya evento",
          "objetivo": "PL-400, GH-600 u otro examen de rol Microsoft gratis en eventos, más el 50% encadenado de AWS si vas por ese lado.",
          "ids": ["ms-certweek", "aws-exam-benefit"], "fechas": ["ms-ignite", "reinvent"] }
      ]
    },
    {
      "id": "marketing", "area": "Marketing y gestión", "papel": "Marketing digital / soporte de proyectos",
      "fases": [
        { "n": 1, "titulo": "Fundamentos de marketing digital", "plazo": "4-8 semanas",
          "objetivo": "HubSpot (los reclutadores lo reconocen por nombre), Fundamentals de Google en español y Skillshop (Ads, GA4, YouTube).",
          "ids": ["hubspot", "digital-garage", "skillshop"] },
        { "n": 2, "titulo": "Certificados profesionales (beca)", "plazo": "3-5 meses",
          "objetivo": "Google Digital Marketing & E-commerce, Google UX Design (terminas con portafolio en Figma) y cursos de empleabilidad de Santander.",
          "ids": ["g-mkt", "g-ux", "santander-open"] },
        { "n": 3, "titulo": "Gestión de proyectos", "plazo": "3-5 meses",
          "objetivo": "Google Project Management (alternativa creíble antes del CAPM), itinerarios Conecta Empleo y Capacítate, todos gratis en español.",
          "ids": ["g-pm", "telefonica-conecta", "capacitate-slim"] },
        { "n": 4, "titulo": "Badges y base técnica", "plazo": "continuo",
          "objetivo": "Trailhead suma badges Salesforce gratis, y Google IT Support (beca) te da la base de soporte más aceptada para primer empleo.",
          "ids": ["trailhead", "g-it"] }
      ]
    }
  ],

  // Recordatorios accionables (checklist)
  "tips": [
    "Usa el botón 'Buscar páginas' cada vez que vayas a postular: revisa en vivo las páginas oficiales y te dice al tiro si la oferta es 100% gratis, 50% u otro descuento, y si hay un código publicado (incluso de un solo uso).",
    "Coursera: aplica a Financial Aid en la página del CURSO individual (no la especialización), enlace 'Financial aid available' bajo el botón Enroll.",
    "Escribe los dos ensayos de 150+ palabras con tu situación real y un objetivo laboral concreto. No copies textos: Coursera detecta respuestas repetidas.",
    "Mientras esperas los ~15-16 días de la beca, entra en modo Audit y avanza con las clases. No pierdes progreso.",
    "AWS: verifica tu estado de estudiante en Builder Center (SheerID) para recibir 12 meses de Skill Builder Premium y el voucher de US$100 a los 21 badges.",
    "AWS Exam Pass Benefit: cada examen aprobado te da 50% en el siguiente por 12 meses. Encadena CLF a SAA a Developer y ahorras ≈US$150.",
    "GitHub Student Pack: activa MongoDB (certificación gratis) y revisa el voucher de GitHub Foundations con el botón Buscar páginas.",
    "Badges sí suman si tienen URL verificable (Credly, Skills Boost, Cisco, IBM): agrégalos en LinkedIn en 'Licencias y certificaciones', no en 'Cursos'.",
    "En español y gratis: Cisco Skills for All, Google Garage Digital, HubSpot Academy, SENCE+Microsoft (Chile), Conecta Empleo y Santander Open Academy.",
    "Cada certificado en tu CV debe llevar su link de verificación (Credly, Coursera, cs50.io, Skillshop, CertView). Sin URL, el ATS no lo cuenta."
  ],

  // Guía: como postular a las credenciales 100% gratis (paso a paso)
  "tips_gratis": [
    "Empieza por la barra 'Siguiente acción': siempre te señala la mejor credencial gratis según tu peso en el CV y tu progreso.",
    "Elige una tarjeta con el botón 'Postular ahora' (100% gratis): te lleva directo al formulario real, sin páginas de marketing.",
    "Crea la cuenta gratuita con el MISMO email que usarás para Credly y LinkedIn: evita que el badge quede desvinculado de tu perfil.",
    "IBM vía UoPeople: botón Apply Now en la página oficial, elige 'IBM SkillsBuild' como Academic Field/Major y entra al curso desde my.uopeople.edu. No piden antecedentes; plazo 1 año.",
    "SkillsBuild, mylearn (Oracle), NetAcad y Skills for All: solo creas la cuenta gratis y pulsas Enroll/Start. Nunca piden tarjeta.",
    "Si eres estudiante (MongoDB, GitHub): verifica tu estatus una vez en el GitHub Student Pack y reutilízalo en cada plataforma.",
    "SENCE (Chile): postula con ClaveÚnica (RUN, +18) desde el Buscador de Cursos. Es 100% gratis para residentes.",
    "Al entrar al curso, márcalo 'En curso' aquí con fecha objetivo: la app te recuerda y mantiene el plan en orden.",
    "Al aprobar: guarda la URL pública del badge o certificado (Credly, Coursera, cs50.io, CertView) y agrégalo en LinkedIn en 'Licencias y certificaciones', no en 'Cursos'.",
    "Una credencial sin URL de verificación pública no cuenta para el ATS: antes de empezar un curso, confirma que tenga enlace público (cada tarjeta muestra su forma de verificación)."
  ]
};
