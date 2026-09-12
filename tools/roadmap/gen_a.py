# -*- coding: utf-8 -*-
"""Mejoras generadas por matriz: S02 a S14 (26 por seccion)."""

from base import TEST_TYPES, AREAS, PHASES


def s02():
    out = []
    campos = [
        "ciudad y region (para ofertas locales)",
        "horario de trabajo (turno, dias)",
        "tipo de internet (datos moviles, Wi-Fi, inestable)",
        "dispositivo principal (Android, PC, tablet)",
        "nivel de ingles (basico, intermedio, avanzado)",
        "modalidad objetivo (100 por ciento online, hibrida)",
        "franjas preferidas de estudio (manana, tarde, noche)",
        "maximo de horas por dia (limite duro)",
        "restriccion economica real ($0 estricto, presupuesto minimo)",
        "restriccion de energia (tamano maximo de bloque)",
    ]
    for c in campos:
        out.append("Agregar el campo '%s' al perfil personal, con default local y ejemplo." % c)
    for p in PHASES:
        out.append("El perfil recalcula el impacto en la fase '%s' al cambiar, y muestra el delta en semanas." % p)
    for t in TEST_TYPES[:4]:
        out.append("La autoevaluacion del perfil incluye un mini-test de tipo '%s' para calibrar el nivel real." % t)
    out += [
        "Exportar el perfil como JSON cifrado en un toque, con import y verificacion (hash).",
        "El perfil guarda el 'antes' (skills, CV, salario) para el comparativo de fin de ruta.",
        "Si el perfil indica menos de 3 h por semana, el roadmap pasa a micro-hitos de 15 minutos.",
        "El perfil valida sus propios campos (fechas coherentes, horas no negativas) al guardar.",
    ]
    return out


def s03():
    out = []
    for a in AREAS:
        out.append("Plantilla 0 a PRO pre-hecha para el area de %s: 4 hitos (base, medio, avanzado, contratetable), editable en minutos." % a)
    for p in PHASES:
        out.append("El roadmap muestra las acciones exactas de la fase '%s' con el boton que las ejecuta (abrir, postular, iniciar)." % p)
    for m in ["3", "6", "12"]:
        out.append("Roadmap en %s meses con densidad semanal calculada desde las horas disponibles." % m)
    out += [
        "Detector de combinacion optima: que certs juntos abren el puesto objetivo (base + especialidad + blanda).",
        "El roadmap muestra la 'ruta minima viable' (menos horas para ser contratetable) y la 'ruta completa'.",
        "Hito con 'evidencia': que hay que mostrar (simulacro, proyecto, badge) para considerarlo completado.",
        "Si un hito depende de una ventana (beca, SENCE), el roadmap se alinea solo al calendario.",
        "Boton 'pausar' del roadmap: congela con fecha, y re-planea al retomar.",
        "El roadmap indica el riesgo de cada hito (probabilidad por requisitos) y la mitigacion.",
        "Impresion en 1 pagina (A4) del roadmap completo, para la mesa o la nevera.",
    ]
    return out


def s04():
    out = []
    modo = {
        "opcion multiple": "banco de 200 preguntas por cert con filtro por tema.",
        "opcion multiple cronometrado": "simulacro completo con reloj real y sin volver atras.",
        "laboratorio practico (hands-on)": "laboratorio guiado con Docker o VM y verificacion de cada paso.",
        "caso practico guiado": "caso con datos reales (CSV, BI) y preguntas abiertas.",
        "defensa oral o entrevista": "simulador con 10 preguntas por tema y grabacion de la respuesta.",
        "proyecto entregable": "andamio del proyecto con entregables y checklist de aceptacion.",
        "portafolio de evidencias": "checklist de evidencias con rubrica y seinal de 'listo'.",
        "coding en vivo": "ejercicios locales con autograder y diff contra la solucion.",
    }
    for t, f in modo.items():
        out.append("Modo de preparacion para '%s': %s" % (t, f))
    for b in ["commute", "almuerzo", "antes de dormir", "fin de semana"]:
        out.append("Micro-bloques para la franja '%s': 10 a 20 min de flashcards o audio." % b)
    out += [
        "Repaso espaciado con regla 1, 3, 7 y 21 dias, y la proxima revision visible.",
        "Repaso espaciado alternativo por densidad de errores (mas errores, mas frecuente).",
        "Repaso espaciado anclado a la fecha del examen (densidad maxima la ultima semana).",
        "Recuerdo activo: 5 preguntas sobre lo planificado antes de abrir el material.",
        "Deteccion de meseta (3 semanas sin avance) con cambio de metodo documentado.",
        "Resumen diario de 10 minutos: que estudiar hoy y por que.",
        "Carpeta de estudio consolidada por cert (enlaces, PDF, flashcards).",
        "Intercalacion de 2 certs en paralelo con plan anti-burnout.",
        "Modo 'estudio minimo viable' para semanas caoticas, sin perder la fecha.",
        "'Hoja de trucos' de 1 pagina por cert, auto-generada desde las notas.",
        "Log de metodos: que funciono (horas por puntaje) para replicarlo.",
        "Calendario de mezcla: la app decide si hoy toca teoria, practica o simulacro (y por que).",
        "Sesion corta de 30 minutos: objetivo claro, trabajo y cierre con 3 preguntas de repaso.",
        "Estudio activo por defecto: cada bloque termina respondiendo algo o completando un paso de laboratorio.",
    ]
    return out


def s05():
    out = []
    for t in TEST_TYPES:
        out.append("Simulacro completo de tipo '%s' con reporte por tema y curva de dificultad." % t)
    for a in AREAS[:6]:
        out.append("Simulacros auto-generados para las certs de %s desde el temario oficial." % a)
    out += [
        "Simulacro adaptativo: ajusta la dificultad segun las respuestas previas.",
        "Bitacora de errores con repaso (1, 3, 7 y 21 dias) y export a Anki.",
        "Seinal 'listo': 3 simulacros seguidos en 80 por ciento o mas, con tendencia estable.",
        "Simulacro con audio: preguntas leidas en español o inglés para practicar a oido.",
        "Simulacro en 'condiciones de examen': tiempo, ambiente y software de proctoring.",
        "Reporte por tema con 'debiles/fortes' y la siguiente accion recomendada.",
        "Comparativa de simulacros en el tiempo (grafica) por certificacion.",
        "Simulacros offline (pack descargado por cert) para dias sin internet.",
    ]
    return out


def s06():
    out = []
    for x in ["T-7", "T-3", "T-1", "T-0"]:
        out.append("Checklist de %s al examen con auto-verificacion (documentos, PC, proctoring)." % x)
    for t in TEST_TYPES[:8]:
        out.append("Logistica adaptada a examenes de tipo '%s' (materiales, ambiente, agendado con evaluador)." % t)
    for p in ["primer intento", "retake tras no aprobar", "segundo retake", "recertificacion"]:
        out.append("Plan de '%s' con politica, costo (fuente oficial) y tiempos de espera." % p)
    out += [
        "Pre-ensayo del examen: simulacro completo en las mismas condiciones (hora, dispositivo, software) una semana antes.",
        "Countdown al examen en portada y widget, con tono de alerta la semana previa.",
        "Plan B de 24 h si se desaprueba: motivo, retake o via alternativa.",
        "Registro del resultado (aprobado o no, puntaje, fecha) con foto del certificado.",
        "Proxima accion automatica al aprobar (Credly, CV, LinkedIn, portafolio).",
        "Examen en otra zona horaria: alarma en hora local (Chile) y aviso de diferencia.",
        "Contingencia de proctoring: segundo dispositivo, navegador alterno, numeros de soporte.",
        "Rutina anti-ansiedad de 2 minutos (respiracion + checklist) antes del examen.",
        "Registro automatico del retake con el descuento detectado (fuente oficial).",
        "Reporte post-examen (no aprobacion): analisis de errores por tema y plan de 2 semanas.",
    ]
    return out


def s07():
    out = []
    filtros = [
        "tipo de examen", "idioma", "duracion (meses)", "costo ($0 o descuento)",
        "modalidad (online, hibrida)", "plazo (deadline)", "nivel (junior, intermedio)",
        "vendor", "area", "nivel de evidencia (oficial, prensa, comunidad)",
    ]
    for f in filtros:
        out.append("Busqueda avanzada por '%s', combinable con lenguaje natural." % f)
    consultas = [
        "cert cloud gratis con examen en menos de 3 meses",
        "cursos gratis locales (Chile) que me corresponden",
        "certs que anaden las keywords de mi CV",
        "descuentos 50 por ciento con estatus estudiantil",
        "certs combinables con lo que ya estudio",
    ]
    for q in consultas:
        out.append("Consulta pre-configurada '%s' con respuesta estructurada (oferta, evidencia, como postular)." % q)
    for r in ["hoy", "esta semana", "este mes", "los ultimos 6 meses"]:
        out.append("Archivo de ofertas '%s' con lo que aparecio y lo que desaparecio." % r)
    out += [
        "'Que me encuentre': consulta guardada que se re-ejecuta cada dia y avisa novedades.",
        "Busqueda profunda con scraping bajo demanda, progreso visible y cache local.",
        "Busqueda semantica local del catalogo (embeddings), sin internet.",
        "Comparador de 2 a 3 ofertas: costo, tiempo, peso en el mercado, dificultad.",
        "Cada resultado con 'como postular en 3 pasos' incluido.",
        "Sugerencias en vivo mientras escribes (autocomplete) con resultados del catalogo local.",
        "Historial de busquedas con estadisticas: que se busca mas y que nunca se encuentra.",
    ]
    return out


def s08():
    out = []
    for v in ["AWS", "Google", "Microsoft", "Databricks", "IBM", "Oracle"]:
        out.append("Tracker de estado del voucher de estudiante de %s (aplicado, activo, vencido) con fuente oficial." % v)
    for k in ["un solo uso", "con expiracion", "personal", "de estudiante", "de residente", "de examen especifico"]:
        out.append("Detector de codigos '%s' con advertencia y paso de uso documentado." % k)
    for c in ["Reddit", "Discord", "Telegram", "X", "foros"]:
        out.append("Escaneo de 'fugas' en %s con nivel de riesgo y verificacion (nunca se presenta como oficial sin confirmar)." % c)
    out += [
        "Verificacion del codigo antes de consumirlo (dry-run si la pagina lo permite).",
        "Copiar codigo en un toque, con contexto (donde, como, limite).",
        "Historial de codigos usados, para no re-utilizar uno de un solo uso.",
        "'Pila de beneficios': que se puede combinar (voucher + estudiante + promo), verificado.",
        "Detector de 'codigos falsos': patrones que parecen codigos y no lo son, con explicacion.",
        "Escáner sobre URL del usuario: pegar cualquier pagina y extraer la oferta.",
        "Reporte semanal de codigos: que expiraron y que son nuevos, con fuente.",
        "Expiracion de codigos auto-detectada (texto de la pagina) y deadline en calendario.",
        "Codigo con 'pasos de uso' (donde pegar, que campo, referencia visual).",
    ]
    return out


def s09():
    out = []
    for s in ["universidad", "gobierno (Chile y LatAm)", "vendor (Cisco, Oracle, Google)", "MOOC (edX, Coursera, FutureLearn)", "gremio (CChC, SII)", "comunidad (Reddit, Discord)"]:
        out.append("Tipo de fuente '%s' con template de import (YAML) y verificacion automatica." % s)
    for o in ["salud (status 200 + texto clave)", "cambio de precio o condicion", "programa nuevo", "programa eliminado", "expiracion de deadline", "cambio de ventana de postulacion", "disponible en español", "cambio de nivel de verificacion"]:
        out.append("Deteccion automatica y changelog por oferta de '%s'." % o)
    for g in ["por puesto objetivo", "solo $0", "por area", "por deadline (90 dias)", "por nivel de evidencia", "por tipo de examen"]:
        out.append("Vista del catalogo '%s' con filtro en un toque." % g)
    out += [
        "De-duplicacion: si 2 fuentes ofrecen la misma cert, se unen (ambas visibles).",
        "'Que hay de nuevo esta semana' en el catalogo, con diff visual.",
        "Comunidad: reportar enlace roto en un toque, con verificacion y credito.",
        "Ranking de fuentes por rendimiento (ofertas validas utiles para el perfil).",
        "Historial: archivo de ofertas expiradas (que las reemplazo), consultable.",
        "Verificacion en un toque de cualquier oferta (re-scrape y cita visible).",
    ]
    return out


def s10():
    out = []
    for b in ["Coursera", "edX", "SENCE", "becas estatales (Chile)", "becas universitarias", "programas CORFO", "municipios", "MOOCs de universidades publicas"]:
        out.append("Asistente de '%s': requisitos, ventana, estado y carta de postulacion adaptada." % b)
    for w in ["apertura de postulacion", "cierre de ventana (48 h)", "cierre de ventana (24 h)", "resultado de postulacion", "curso nuevo gratis del area", "voucher nuevo con estatus estudiantil", "cambio de requisitos"]:
        out.append("Alerta local de '%s' con la accion en un toque." % w)
    for r in ["ClaveUnica", "carnet estudiantil", "residencia (Chile)", "joven (18 a 29)", "mujer trabajadora", "subsidio al empleo", "BNE", "municipio local"]:
        out.append("Guia del requisito '%s' con paso a paso y enlace directo." % r)
    out += [
        "Detector de 'semanas gratis': cursos gratis por tiempo limitado, con expiracion verificada.",
        "Plan B de beca: si no aprueba, la alternativa mas barata verificada.",
        "Calendario central de becas locales (ventanas, plazos, probabilidad por requisitos).",
    ]
    return out


def s11():
    out = []
    for pl in ["UoPeople", "Coursera", "edX", "mylearn (Oracle)", "SkillBuilder (AWS)", "SkillsBuild (IBM)", "Microsoft Learn", "Fortinet Training"]:
        out.append("Onboarding paso a paso de '%s': crear cuenta, postular, entrar al curso, obtener badge." % pl)
    for st in ["postulado", "confirmacion recibida", "admitido", "enrolado", "rechazado", "lista de espera"]:
        out.append("Estado '%s' en el tracker con fecha, captura y proxima accion." % st)
    for d in ["RUT o ID", "foto de ID", "carnet estudiantil", "email dedicado", "telefono", "direccion", "historial (si lo piden)"]:
        out.append("Campo '%s' auto-completado desde el perfil, con confirmacion manual." % d)
    out += [
        "'Postular ahora' que lleva al formulario real (cero landings de marketing).",
        "Trampas de onboarding por plataforma (por ejemplo 'Credly con el mismo email').",
        "'Acceso': donde entra el curso al aprobar, con enlace directo guardado.",
        "'Paquete de postulacion': CV, carta y enlaces listos para pegar.",
        "Ventanas de postulacion con countdown y alerta de lista de espera.",
    ]
    return out


def s12():
    out = []
    for st in ["en curso", "simulacro en 80 por ciento o mas", "aprobada", "badge activo", "por renovar (60 dias)", "vencida", "renovada"]:
        out.append("Estado '%s' en el panel 'Mis certificaciones', con fecha y accion." % st)
    for v in ["Credly (enlace publico)", "LinkedIn (certificacion)", "portafolio personal", "transcript local", "foto o PDF del certificado"]:
        out.append("Verificacion y guardado de '%s' por certificacion." % v)
    for a in AREAS:
        out.append("Detector de gaps para %s: que falta para el puesto objetivo (vs ofertas reales)." % a)
    out += [
        "'Prueba de avance' semanal exportable (horas, simulacros, hitos).",
        "Transcript local cronologico, usable en entrevista.",
        "'Antes/despues': CV inicial vs actual, lado a lado.",
        "Hitos automaticos (10 h, 50 h, 100 h, 1ra cert, 3ra cert).",
        "Alerta de desviacion: si el avance va atrasado al plan, re-plan en un toque.",
        "Valididad de cada cert (si caduca y en cuanto) visible en la tarjeta.",
    ]
    return out


def s13():
    out = []
    for f in ["ATS (español)", "ATS (inglés)", "creativo (diseno y marketing)", "academico (beca)", "ejecutivo (senior)", "remoto internacional"]:
        out.append("Generador de CV en formato '%s' desde certs + proyectos." % f)
    for l in ["LinkedIn (certificaciones)", "LinkedIn (skills)", "LinkedIn (acerca de)", "GitHub (README)", "GitLab (README)", "portafolio web", "correo de contacto", "CV con QR"]:
        out.append("Actualizacion automatica de '%s' al llegar una cert nueva (1 toque, editable)." % l)
    for p in ["ciberseguridad", "datos", "IA y ML", "nube", "desarrollo", "gestion de proyectos"]:
        out.append("Asistente de 3 proyectos de portafolio para %s (paso a paso, demo publica, codigo)." % p)
    out += [
        "A/B de CV: 2 versiones por oferta, y registrar cual trae mas entrevistas.",
        "'Impacto' de cada cert en el CV: que demuestra, no solo el nombre.",
        "Carta de presentacion por oferta (borrador automatico, editable).",
        "'Que decir en la entrevista' por cert (1 minuto y 3 minutos).",
        "Check de CV: coherencia (fechas, nombres exactos, typos).",
        "Paquete descargable (CV + portafolio + carta, PDF) en un toque.",
    ]
    return out


GEN = {
    "S02": s02, "S03": s03, "S04": s04, "S05": s05, "S06": s06,
    "S07": s07, "S08": s08, "S09": s09, "S10": s10, "S11": s11,
    "S12": s12, "S13": s13, "S14": None,  # S14 se define en gen_b para orden de import
}
