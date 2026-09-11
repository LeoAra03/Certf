/* Certf — fuente única de datos.
   Este archivo se lee directamente en la web (sin fetch, para que funcione en "file"://
   dentro del WebView de Android) y tools/build_data.py lo convierte a data.json
   para el lado nativo (notificaciones). */

window.__CERTF__ = {
  "updated": "2026-09-10",

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
    { "id": "aws-clf", "n": "AWS Certified Cloud Practitioner (CLF-C02)", "i": "AWS", "p": 10, "c": "Cloud", "t": "gratis",
      "cond": "100% gratis con código AIF2CLOUD o con voucher de estudiante (21 badges)", "url": "https://www.pearsonvue.com/us/en/aws/aif2cloud.html",
      "lang": "Inglés", "verify": "Credly (URL pública)", "deadline": "aws-aif2cloud",
      "note": "La credencial cloud más pedida en vacantes junior. Pasa filtros ATS y el empleador puede verificarla en Credly." },

    { "id": "aws-aif", "n": "AWS Certified AI Practitioner (AIF-C01)", "i": "AWS", "p": 9, "c": "IA", "t": "descuento",
      "cond": "50% dto (US$50) con AIF2CLOUD · 100% gratis con voucher de estudiante", "url": "https://builder.aws.com/student-rewards",
      "lang": "Inglés", "verify": "Credly", "deadline": "aws-aif2cloud",
      "note": "Certificación de IA fundacional, sin requisitos técnicos. Es la llave para que el CLF salga gratis." },

    { "id": "ms-certweek", "n": "Examen Microsoft a elección (AZ-305, AI-200, DP-600, SC-500, GH-600, PL-400)", "i": "Microsoft", "p": 9, "c": "Cloud", "t": "gratis",
      "cond": "Voucher 100% en Certification Week 2026 (28-sep a 2-oct)", "url": "https://certweeks.fastlane.net/amer/az-sec-en",
      "lang": "Inglés", "verify": "Credly", "deadline": "ms-certweek-start",
      "note": "Única vía gratuita hoy a un examen Microsoft rol-basado. Requiere email corporativo (partner) y ≥80% en el assessment." },

    { "id": "ms-applied", "n": "Microsoft Applied Skills (30+ credenciales de laboratorio)", "i": "Microsoft", "p": 8, "c": "Cloud", "t": "gratis",
      "cond": "100% gratis: formación + evaluación en laboratorio real", "url": "https://learn.microsoft.com/en-us/credentials/applied-skills/",
      "lang": "Inglés", "verify": "Perfil Microsoft Learn + Credly",
      "note": "Credencial verificable de Microsoft sin pagar examen. Demuestra ejecución, no teoría. No caduca." },

    { "id": "g-cyber", "n": "Google Cybersecurity", "i": "Google", "p": 8, "c": "Seguridad", "t": "beca",
      "cond": "Beca Financial Aid 75–100% (≈15-16 días de aprobación)", "url": "https://www.coursera.org/google-certificates/cybersecurity-certificate",
      "lang": "Español / Inglés", "verify": "Certificado Coursera con URL propia",
      "note": "Alineado con CompTIA Security+; acceso al consorcio de 150+ empleadores de Google." },

    { "id": "g-data", "n": "Google Data Analytics (+ Advanced Data Analytics)", "i": "Google", "p": 8, "c": "Datos", "t": "beca",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/google-certificates/data-analytics-certificate",
      "lang": "Español / Inglés", "verify": "Certificado Coursera",
      "note": "SQL + Tableau + R. La certificación de datos más reconocida por reclutadores no técnicos." },

    { "id": "g-ai", "n": "Google AI Professional Certificate (nuevo 2026)", "i": "Google", "p": 8, "c": "IA", "t": "beca",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/google-certificates/google-ai",
      "lang": "Inglés", "verify": "Certificado Coursera",
      "note": "Programa de IA de Google lanzado en 2026; la marca Google en IA pesa más que un curso genérico de prompts." },

    { "id": "stanford-ml", "n": "Machine Learning Specialization (Andrew Ng)", "i": "Stanford + DeepLearning.AI", "p": 8, "c": "IA", "t": "beca",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/specializations/machine-learning-introduction",
      "lang": "Inglés", "verify": "Certificado Coursera (Stanford Online)",
      "note": "Nombre Stanford en el CV; base sólida para roles de ML. 836.000 inscritos, 4.9/5." },

    { "id": "ibm-cyber-uopeople", "n": "IBM SkillsBuild Certificate in Cybersecurity (vía UoPeople)", "i": "IBM + University of the People", "p": 8, "c": "Seguridad", "t": "gratis",
      "cond": "100% gratis: capacitación, examen y credencial + hasta 12 créditos universitarios ACE", "url": "https://skillsbuild.org/college-students/college-certificates",
      "lang": "Inglés", "verify": "Credly",
      "note": "El certificado gratuito más fuerte disponible hoy: ~60-65 h, credencial IBM y créditos transferibles. Plazo 1 año, 80% para aprobar." },

    { "id": "ibm-cyber-coursera", "n": "IBM Cybersecurity Analyst", "i": "IBM", "p": 8, "c": "Seguridad", "t": "beca",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/professional-certificates/ibm-cybersecurity-analyst",
      "lang": "Inglés", "verify": "Certificado Coursera",
      "note": "14 cursos orientados a herramientas (SIEM, pentesting, forense) y prepara el examen CompTIA Security+." },

    { "id": "ibm-ds", "n": "IBM Data Science Professional Certificate", "i": "IBM", "p": 8, "c": "Datos", "t": "beca",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/professional-certificates/ibm-data-science",
      "lang": "Inglés", "verify": "Certificado Coursera",
      "note": "12 cursos con capstone y portafolio de proyectos. Python, SQL, Pandas, scikit-learn." },

    { "id": "cs50", "n": "CS50x / CS50P / CS50AI / CS50SQL", "i": "Harvard", "p": 8, "c": "Desarrollo", "t": "gratis",
      "cond": "100% gratis completando problem sets + proyecto final", "url": "https://cs50.harvard.edu/x/",
      "lang": "Inglés", "verify": "certificates.cs50.io (link único)",
      "note": "Harvard en el CV sin pagar los US$219 del certificado verificado de edX. CS50AI es de las mejores credenciales gratuitas de IA." },

    { "id": "mit-micromasters", "n": "MITx MicroMasters en Statistics and Data Science", "i": "MIT", "p": 8, "c": "Datos", "t": "descuento",
      "cond": "Asistencia financiera 80–90% (US$1.350 → ≈US$150-300)", "url": "https://www.edx.org/micromasters/mitx-statistics-and-data-science",
      "lang": "Inglés", "verify": "Certificado edX / MITx",
      "note": "Peso académico real, convalidable en másteres MIT y de otras universidades. edX nunca da el 100%." },

    { "id": "g-pm", "n": "Google Project Management", "i": "Google", "p": 7, "c": "Gestión", "t": "beca",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/google-certificates/project-management-certificate",
      "lang": "Español / Inglés", "verify": "Certificado Coursera",
      "note": "Alternativa creíble antes del CAPM/PMP. 121.000 reseñas, 4.9/5." },

    { "id": "g-it", "n": "Google IT Support", "i": "Google", "p": 7, "c": "Cloud", "t": "beca",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/google-certificates/it-support-certificate",
      "lang": "Español / Inglés", "verify": "Certificado Coursera",
      "note": "Prepara CompTIA A+; el más aceptado para primer empleo de soporte/helpdesk." },

    { "id": "ibm-da", "n": "IBM Data Analyst Professional Certificate", "i": "IBM", "p": 7, "c": "Datos", "t": "beca",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/professional-certificates/ibm-data-analyst",
      "lang": "Inglés", "verify": "Certificado Coursera",
      "note": "Excel, SQL, Python, Cognos y Tableau. Muy orientado a herramientas → buenas keywords para ATS." },

    { "id": "meta-fe", "n": "Meta Front-End Developer", "i": "Meta", "p": 7, "c": "Desarrollo", "t": "beca",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/professional-certificates/meta-front-end-developer",
      "lang": "Inglés", "verify": "Certificado Coursera",
      "note": "HTML/CSS/JS + React + Bootstrap con marca Meta, con proyecto final para portafolio." },

    { "id": "meta-db", "n": "Meta Database Engineer", "i": "Meta", "p": 7, "c": "Datos", "t": "beca",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/professional-certificates/meta-database-engineer",
      "lang": "Inglés", "verify": "Certificado Coursera",
      "note": "SQL, modelado, MySQL y Python aplicados a bases de datos. 9 cursos con 5 proyectos." },

    { "id": "oracle-foundations", "n": "Oracle OCI / OCI AI / Data Foundations", "i": "Oracle University", "p": 7, "c": "Cloud", "t": "gratis",
      "cond": "Oracle ofrece 'free training and certifications' en nivel Foundations (verificar en tu cuenta)", "url": "https://mylearn.oracle.com/ou/story/163512",
      "lang": "Inglés", "verify": "Oracle CertView + badge",
      "note": "Muy valorado en empresas con stack Oracle. Revisa qué examen Foundations está efectivamente en $0 antes de empezar." },

    { "id": "cisco-junior-cyber", "n": "Cisco Junior Cybersecurity Analyst (5 cursos)", "i": "Cisco Networking Academy", "p": 7, "c": "Seguridad", "t": "gratis",
      "cond": "100% gratis con badge Cisco por curso", "url": "https://www.netacad.com/courses/introduction-to-cybersecurity",
      "lang": "20 idiomas (incl. español)", "verify": "Badge Cisco (Credly)",
      "note": "Ruta oficial Cisco Security con 7 labs; escala natural a CCST Cybersecurity y CCNA." },

    { "id": "ibm-da-uopeople", "n": "IBM SkillsBuild Certificate in Data Analytics (vía UoPeople)", "i": "IBM + University of the People", "p": 7, "c": "Datos", "t": "gratis",
      "cond": "100% gratis + hasta 8 créditos universitarios", "url": "https://skillsbuild.org/college-students/college-certificates",
      "lang": "Inglés", "verify": "Credly",
      "note": "Misma lógica que el de ciberseguridad, perfil analista de datos, sin costo y sin esperar aprobación de beca." },

    { "id": "g-ux", "n": "Google UX Design", "i": "Google", "p": 7, "c": "Desarrollo", "t": "beca",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/google-certificates/ux-design-certificate",
      "lang": "Español / Inglés", "verify": "Certificado Coursera",
      "note": "Terminas con portafolio en Figma: en UX lo que contrata es el portafolio, y aquí lo construyes." },

    { "id": "edx-verified", "n": "Cursos verificados de edX (HarvardX, MITx, …)", "i": "Harvard / MIT / edX", "p": 7, "c": "Datos", "t": "descuento",
      "cond": "Asistencia financiera 80–90% (máx. 5 aplicaciones)", "url": "https://courses.edx.org/financial-assistance/",
      "lang": "Inglés", "verify": "Certificado verificado edX",
      "note": "Mismo certificado que el pagado. El remanente suele ser US$20-60 por curso." },

    { "id": "aws-badges", "n": "AWS Skill Builder Digital Badges (Cloud Quest, Knowledge)", "i": "AWS", "p": 6, "c": "Cloud", "t": "gratis",
      "cond": "100% gratis (los exámenes de certificación siguen siendo pagos)", "url": "https://aws.amazon.com/training/badges/",
      "lang": "Inglés", "verify": "Credly",
      "note": "Complemento creíble en LinkedIn mientras preparas el Cloud Practitioner." },

    { "id": "skillshop", "n": "Google Skillshop (Google Ads, GA4, YouTube, Waze)", "i": "Google", "p": 6, "c": "Marketing", "t": "gratis",
      "cond": "100% gratis", "url": "https://skillshop.withgoogle.com",
      "lang": "Multilenguaje", "verify": "Perfil público de Skillshop",
      "note": "Certificaciones oficiales de producto Google: pesan en marketing digital y analítica web." },

    { "id": "mongodb", "n": "MongoDB Certified Developer / DBA Associate", "i": "MongoDB University", "p": 6, "c": "Datos", "t": "estudiante",
      "cond": "Gratis para estudiantes verificados (valor US$150) vía GitHub Student Pack", "url": "https://education.github.com/pack",
      "lang": "Inglés", "verify": "Perfil de certificación MongoDB",
      "note": "Certificación de proveedor (no un badge de curso). Requiere completar el learning path y ser estudiante verificado." },

    { "id": "github-foundations", "n": "GitHub Foundations Certification", "i": "GitHub (Microsoft)", "p": 6, "c": "Desarrollo", "t": "estudiante",
      "cond": "Voucher gratis para estudiantes verificados (stock limitado; cupones 2025-26 vencían el 30-jun-2026)", "url": "https://education.github.com/pack",
      "lang": "Inglés", "verify": "Credly",
      "note": "Revisa cada mes: GitHub repone tandas de vouchers y se agotan rápido." },

    { "id": "cisco-netacad", "n": "Cisco NetAcad: Python, Data Science, CCNA v7", "i": "Cisco Networking Academy", "p": 6, "c": "Desarrollo", "t": "gratis",
      "cond": "100% gratis con badge Cisco", "url": "https://www.netacad.com/courses",
      "lang": "Multilenguaje", "verify": "Badge Cisco",
      "note": "Marca #1 en networking; los cursos de Python son de los pocos gratuitos con laboratorio." },

    { "id": "g-mkt", "n": "Google Digital Marketing & E-commerce", "i": "Google", "p": 6, "c": "Marketing", "t": "beca",
      "cond": "Beca Financial Aid 75–100%", "url": "https://www.coursera.org/google-certificates/digital-marketing-certificate",
      "lang": "Español / Inglés", "verify": "Certificado Coursera",
      "note": "Se apila muy bien con Skillshop (Ads + GA4) para perfiles de marketing." },

    { "id": "ibm-short", "n": "IBM SkillsBuild: AI, Data, Cybersecurity y Agile (cursos cortos)", "i": "IBM", "p": 5, "c": "IA", "t": "gratis",
      "cond": "100% gratis con credencial digital Credly", "url": "https://skillsbuild.org",
      "lang": "Inglés", "verify": "Credly",
      "note": "4-20 h cada uno. Ideales para sumar marca IBM al perfil mientras esperas una beca." },

    { "id": "digital-garage", "n": "Fundamentals of Digital Marketing (Digital Garage)", "i": "Google", "p": 5, "c": "Marketing", "t": "gratis",
      "cond": "100% gratis", "url": "https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing",
      "lang": "Español", "verify": "Certificado Google / IAB Europe",
      "note": "40 h, acreditado por IAB Europe. La credencial gratuita de marketing mejor considerada." },

    { "id": "freecodecamp", "n": "freeCodeCamp (11 certificaciones)", "i": "freeCodeCamp", "p": 5, "c": "Desarrollo", "t": "gratis",
      "cond": "100% gratis con URL pública verificable", "url": "https://www.freecodecamp.org/learn",
      "lang": "Inglés", "verify": "Perfil público con proyectos",
      "note": "~300 h por certificación y 5 proyectos. Pesa el portafolio, no la marca." },

    { "id": "helsinki-ai", "n": "Elements of AI / Building AI", "i": "Universidad de Helsinki", "p": 5, "c": "IA", "t": "gratis",
      "cond": "100% gratis con certificado descargable", "url": "https://www.elementsofai.com",
      "lang": "26 idiomas (incl. español)", "verify": "Certificado descargable",
      "note": "Credencial universitaria europea de alfabetización en IA (2 ECTS en Finlandia)." },

    { "id": "helsinki-fso", "n": "Full Stack Open", "i": "Universidad de Helsinki", "p": 5, "c": "Desarrollo", "t": "gratis",
      "cond": "100% gratis con certificado", "url": "https://fullstackopen.com/en/",
      "lang": "Inglés", "verify": "Certificado de la Universidad de Helsinki",
      "note": "React + Node + TypeScript + GraphQL con aval universitario. Excelente portafolio." },

    { "id": "kaggle", "n": "Kaggle Learn (Pandas, Data Viz, ML, Feature Engineering)", "i": "Kaggle / Google", "p": 4, "c": "Datos", "t": "gratis",
      "cond": "100% gratis con certificado por micro-curso", "url": "https://www.kaggle.com/learn",
      "lang": "Inglés", "verify": "Perfil de Kaggle",
      "note": "Peso bajo-medio: útil como relleno de palabras clave en perfiles de datos." },

    { "id": "trailhead", "n": "Trailhead Superbadges / Ranger rank", "i": "Salesforce", "p": 4, "c": "Marketing", "t": "gratis",
      "cond": "100% gratis (NO es una certificación oficial)", "url": "https://trailhead.salesforce.com",
      "lang": "Inglés", "verify": "Perfil de Trailhead",
      "note": "Las certificaciones Salesforce cuestan US$75+; la gratuidad de AI terminó el 31-dic-2025." }
  ],

  // Recordatorios accionables (checklist)
  "tips": [
    "Coursera: aplica a Financial Aid en la página del CURSO individual (no la especialización), enlace 'Financial aid available' bajo el botón Enroll.",
    "Escribe los dos ensayos de 150+ palabras con tu situación real y un objetivo laboral concreto. No copies textos: Coursera detecta respuestas repetidas.",
    "Mientras esperas los ~15-16 días de la beca, entra en modo Audit y avanza con las clases. No pierdes progreso.",
    "AWS: verifica tu estado de estudiante en Builder Center (SheerID) para recibir 12 meses de Skill Builder Premium y el voucher de US$100 a los 21 badges.",
    "GitHub Student Pack: activa MongoDB (certificación gratis) y revisa el voucher de GitHub Foundations.",
    "Cada certificado en tu CV debe llevar su link de verificación (Credly, Coursera, cs50.io, Skillshop, CertView). Sin URL, el ATS no lo cuenta."
  ]
};
