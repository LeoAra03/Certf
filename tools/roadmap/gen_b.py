# -*- coding: utf-8 -*-
"""Mejoras generadas por matriz: S14 a S25 (26 por seccion)."""

from base import TEST_TYPES, AREAS


def s14():
    out = []
    for portal in ["Puyal", "LinkedIn", "Computrabajo", "BNE", "Wellfound (remoto)", "RemoteOK (remoto)"]:
        out.append("Buscador de empleo en %s con filtros por certificacion y ciudad." % portal)
    for ev in ["postulado", "primer contacto", "primera entrevista", "segunda entrevista", "reto tecnico", "oferta final", "rechazo", "sin respuesta (7 dias)"]:
        out.append("Etapas del kanban laboral '%s' con recordatorio y proxima accion." % ev)
    for a in AREAS:
        out.append("Benchmark salarial (Chile y remoto) para %s, con fuente, ciudad y fecha." % a)
    out += [
        "Alerta diaria de ofertas que matchean el perfil, con puntuacion de match.",
        "'CV minimo viable' de junior: que se necesita para la primera entrevista.",
        "Guia de empleo remoto (zona horaria, pago en USD, contrato, impuestos en Chile).",
        "Plan '30 dias a la primera entrevista' con accion concreta por dia.",
    ]
    return out


def s15():
    out = []
    for c in ["estudio con buddy", "accountability (ver metas)", "grupo de estudio local", "mentor voluntario", "reto por meses", "check-in semanal (5 min)", "intercambio de flashcards", "log de procesos (anonimo)"]:
        out.append("Modo local '%s' (privado, con permiso explícito)." % c)
    for t in ["Biobio", "Santiago", "Chile (online)", "latinoamericano"]:
        out.append("Directorio de meetups y comunidades tech de %s con agenda y entrada." % t)
    for u in ["U. de Concepcion", "U. de Chile", "U. de Talca", "universidad local"]:
        out.append("Grupo de estudiantes de %s para estudiar gratis (contacto y reglas)." % u)
    out += [
        "Timer local 'estudia conmigo' para sesiones virtuales con un buddy.",
        "Compartir el reporte semanal (PDF) con el buddy de accountability (1 toque).",
        "Muro de metas del grupo: todos ven su objetivo del mes (opt-in por persona).",
        "Control de quien ve que: permisos por seccion (avances, cuenta, notas).",
        "Ranking privado (local): yo contra mi historico, sin terceros.",
        "Log comunitario de 'primeras entrevistas' con aprendizajes (anonimo).",
        "Directorio de mentores locales (voluntario) con disponibilidad.",
        "Grupos universitarios locales: como entrar y que ofrecen (gratis).",
        "Reto del mes (opcional, propio) con tracking local.",
        "Compartir fuentes verificadas (con credito) para mejorar el catalogo.",
    ]
    return out


def s16():
    out = []
    for d in ["T-7", "T-3", "T-1", "T-0", "T+1 (resultado)", "T-60 (renovacion)", "T-30 (renovacion)", "T-7 (renovacion)"]:
        out.append("Notificacion '%s' para eventos de certs (examen, ventana, renovacion)." % d)
    for ev in ["apertura de postulacion (SENCE)", "cierre de beca (48 h)", "codigo nuevo (fuga)", "cupos limitados detectados en la fuente", "enlace del plan caido", "simulacro listo", "dia de examen", "semana sin actividad"]:
        out.append("Alerta local de '%s' con la accion en un toque." % ev)
    for h in ["manana (9:00)", "tarde (15:00)", "noche (20:00)", "domingo (plan)", "lunes (resumen)"]:
        out.append("Digest local de '%s' (3 items, sin spam)." % h)
    out += [
        "Escala: si el recordatorio se ignora, se repite y propone nueva fecha.",
        "Notificaciones con texto accionable: la frase de la accion ya va en la notificacion.",
        "Horas silenciosas (sin notificaciones de noche, salvo lo critico).",
        "'No me dejes perder la ventana': chequeo diario de SENCE y becas.",
        "Modo 'silencio total' en un toque: pausa todo salvo examenes y deadlines rojos.",
    ]
    return out


def s17():
    out = []
    for x in ["catalogo", "plan", "simulacros", "notas", "busqueda", "CV", "escáner", "comunidad (local)"]:
        out.append("Modulo '%s' 100 por ciento offline: funciona sin internet." % x)
    for b in ["backup (JSON cifrado)", "restore (con hash)", "export (CSV)", "sync (2 dispositivos)", "borrado total", "auditoria de privacidad", "PIN o biometrico", "modo bajo consumo"]:
        out.append("Funcion local '%s' en un toque, con confirmacion." % b)
    for m in ["arranque menor a 1 s", "busqueda local menor a 200 ms", "smoke en 10 s", "limpieza de packs (espacio)", "red inestable (reintentos con backoff)", "2G/3G (modo degradado)", "bateria (sin animaciones en background)", "Lighthouse sobre 90 (PWA)"]:
        out.append("Medicion y garantia de '%s' en CI, con alerta de regresion." % m)
    out += [
        "Sin cuentas, sin tracking, sin ads (uso personal, datos en el dispositivo).",
        "Sync opcional con la nube del propio usuario (WebDAV o Drive), cifrado.",
    ]
    return out


def s18():
    out = []
    for w in ["meta de hoy + proxima accion", "countdown al examen", "porcentaje de estudio de la semana", "racha (dias)", "deadline de la semana", "avance de la cert en curso"]:
        out.append("Widget de la portada con '%s' (1 toque abre la app)." % w)
    for g in ["estudiar ahora (pomodoro)", "abrir el plan", "hacer un simulacro", "proxima accion", "digest del dia", "snooze del deadline"]:
        out.append("Quick tile de Android para '%s'." % g)
    for d in ["Android 14", "Android 10 (antiguo)", "PWA (Chrome)", "PWA (Safari)", "escritorio (Edge)", "tableta"]:
        out.append("Pulido y test visual en '%s' (tamano, layout, gestos)." % d)
    out += [
        "Icono de app con anillo de progreso (porcentaje de la cert actual).",
        "Modo oscuro por sistema + manual + alto contraste.",
        "Tamano de texto ajustable (accesibilidad) y foco visible.",
        "Layout de 2 columnas en ojiva y tableta (plan + estudio).",
        "Atajos de teclado (escritorio): buscar, proxima accion, snooze.",
        "Vibracion y hapticos para hitos, sin depender del sonido.",
        "Modo inmersivo (fullscreen) y pantalla de recientes (ultimas 5 acciones).",
        "Instalador offline (APK) para instalar sin datos, util para familia o viajes.",
    ]
    return out


def s19():
    out = []
    for t in TEST_TYPES:
        out.append("Copilot para examenes de tipo '%s': genera, simula y corrige con evidencia." % t)
    for a in AREAS:
        out.append("Banco de preguntas de entrevista de %s (junior a senior) en español e inglés, con respuesta modelo." % a)
    out += [
        "Copilot local (sin nube) sobre el catalogo, el plan y las notas.",
        "'Planea mi semana': calendario de estudio desde la disponibilidad real.",
        "CV por lenguaje natural: generar e iterar ('hazlo mas de datos').",
        "'Explícame' cada tema del temario en 3 niveles (basico, medio, avanzado).",
        "'Estoy listo?': evaluacion con simulacros y respuesta honesta (con datos).",
        "Anti-halucinacion: cada respuesta cita el catalogo o una fuente con fecha.",
    ]
    return out


def s20():
    out = []
    for m in ["primera semana de estudio", "primer simulacro en 70 por ciento", "primer simulacro en 80 por ciento", "primera postulacion", "primera cert", "tercera cert", "primera entrevista", "primera oferta", "100 h de estudio", "3 meses activo", "6 meses activo", "meta cumplida"]:
        out.append("Hito '%s' con celebracion de 10 segundos (sin spam)." % m)
    for a in AREAS:
        out.append("Nivel (0 a 10) por area de %s con criterios visibles (horas, simulacros, certs)." % a)
    out += [
        "Racha de dias de estudio con tolerancia (1 semana al mes).",
        "Semana perfecta: badge cuando se cumplen todas las metas semanales en 4 semanas seguidas.",
        "Recompensa personal: el usuario define la recompensa por hito.",
        "Nivel general 'PRO' (0 a 100) calculado por certs, horas y practica, con criterios visibles.",
        "Log de rachas: historico de todas las rachas con su duracion, para ver el patron personal.",
        "Curva personal: mi puntaje de simulacros contra el tiempo (grafica de aprendizaje).",
    ]
    return out


def s21():
    out = []
    for x in ["todas las URLs del catalogo (status + texto clave)", "cada descuento (fuente real)", "fechas criticas (coherencia)", "rendimiento (arranque, busqueda)", "pantallas (accesibilidad)", "datos (dedupe, orden, categoria)", "simulacros (respuestas correctas con fuente)", "docs (enlaces y ejemplos)"]:
        out.append("Auto-auditoria semanal de '%s' con reporte e issue automatico." % x)
    for s in ["este documento (1000 mejoras)", "issues del repo", "feedback (pulgar) por pantalla", "metricas de uso (local)", "post-mortem semanal", "experimentos A/B locales", "enlaces caidos (CI)", "nuevas fuentes (web)"]:
        out.append("El motor consume '%s' para ordenar que mejorar a continuacion." % s)
    for i in ["impacto (1 a 5)", "esfuerzo (S, M, L)", "evidencia (fuente)", "calificacion del usuario (manual)", "frecuencia de uso (local)", "tiempo a la accion", "caida de errores", "avance de la meta"]:
        out.append("Prioridad automatica de las 1000 mejoras por '%s'." % i)
    out += [
        "Resumen de cambios de la version escrito en lenguaje de usuario (no tecnico).",
        "'Que hacer a continuacion': el motor propone 3 mejoras con diff o PR listo.",
    ]
    return out


def s22():
    out = []
    for r in ["semanal (PDF)", "mensual (PDF)", "trimestral (resumen)", "año en revision (diciembre)", "bajo demanda (entrevista)"]:
        out.append("Reporte auto-generado '%s' con datos reales (sin manual)." % r)
    for k in ["constancia (semanas al plan)", "avance (porcentaje de certs)", "horas (semana)", "simulacros (promedio de puntaje)", "dias para la meta", "costo real (debe ser $0)", "certs activas", "postulaciones (estado)"]:
        out.append("KPI '%s' en el dashboard (1 pantalla, 5 numeros)." % k)
    for f in ["JSON (todo)", "CSV (catalogo)", "PDF (reportes)", "Markdown (roadmap)", "imagen (dashboard)"]:
        out.append("Export en un toque a '%s' (sin lock-in)." % f)
    out += [
        "Guion de 60 segundos: como narrar el propio progreso en una entrevista.",
        "Tendencia de horas por semana (6 meses) con alerta.",
        "Resumen en 3 numeros para el buddy de accountability (avance, horas, deadline mas cercano).",
        "Expediente unico: todas las evidencias (certs, badges, proyectos) en 1 carpeta con indice.",
        "Resumen de actividad laboral: postulaciones por semana, entrevistas y tasa de respuesta.",
        "Comparativo inicio vs actual (CV, skills, certs, salario).",
        "Reporte con graficas: barras de horas, linea de simulacros y mapa de areas (1 pagina).",
        "'Que funciono': analisis mensual del metodo (que se mantiene).",
    ]
    return out


def s23():
    out = []
    for f in ["buscar, postular, estudiar, rendir", "perfil, plan, semana", "escáner, codigo, uso", "CV, oferta, entrevista", "notificacion, accion, done", "backup, restore, verificacion", "offline, online (sync)", "primer arranque, primera cert"]:
        out.append("Test E2E del flujo '%s' en CI." % f)
    for t in ["unitarios (logica)", "de integracion (datos)", "e2e (flujos)", "visuales (screenshots)", "de accesibilidad (WCAG AA)", "de rendimiento (Lighthouse sobre 90)", "de seguridad (sin PII)", "en dispositivo real (2G/3G, espacio bajo)"]:
        out.append("Suite de tests '%s' con reporte visible (repo)." % t)
    for m in ["100 por ciento de las URLs del catalogo", "100 por ciento de los descuentos con fuente", "fechas criticas (coherencia)", "dedupe y orden del catalogo", "orden de categorias (fijo)", "cero emojis (todo el proyecto)", "data.json sincronizado con data.js", "APK contiene el data.json actual"]:
        out.append("Check en CI de '%s' (falla si regresa)." % m)
    out += [
        "Modo diagnostico: prueba de camara, red, almacenamiento y permisos en un toque.",
        "Datos versionados: snapshot automatico semanal del store local (rollback en un toque).",
    ]
    return out


def s24():
    out = []
    for s in ["primer arranque (asistente 3 min)", "como postular (a cualquier cert)", "como conseguir la beca", "como rendir el examen (proctoring)", "como actualizar el CV", "como conseguir el badge (Credly)", "como usar SENCE (ClaveUnica)", "como exportar los datos"]:
        out.append("'Como se hace' local (texto + capturas) de '%s'." % s)
    for t in ["proctoring", "temario", "financial aid", "ClaveUnica", "voucher", "codigo de un solo uso", "ATS", "badge (Credly)", "retake", "recertificacion", "gap", "ROI de una cert"]:
        out.append("El termino '%s' en el glosario local (español, 2 lineas)." % t)
    out += [
        "Primer arranque: asistente de 3 minutos (meta, horas, nivel) con defaults.",
        "Mini-demo interactiva de 30 segundos al entrar por primera vez a cada seccion.",
        "Checklist de 'los primeros 7 dias' con marcado y recordatorio.",
        "Ayuda local (FAQ) por pantalla, buscable, sin internet.",
        "Pantalla de 'rescate': si todo va mal, las 3 cosas que hay que hacer hoy (1 pagina).",
        "Modo 'preguntar a la app': describir el problema con mis palabras y recibir la seccion de ayuda.",
    ]
    return out


def s25():
    out = []
    for c in ["Peru", "Colombia", "Mexico", "Ecuador", "otro municipio de Chile"]:
        out.append("Template de adaptacion a %s: beneficios locales, portales y moneda (1 YAML)." % c)
    for m in ["2 dispositivos (sync cifrado)", "familia (perfiles privados)", "mentor (1 a varios, local)", "comunidad (fuentes verificadas)", "fork personal (guia)", "legacy (datos exportables)"]:
        out.append("Modo local '%s' (privado, opcional)." % m)
    for x in ["repo (open source)", "CI (gratuita)", "datos (costo 0)", "distribucion (APK propio)", "roadmap (abierto)", "licencia (clara)", "contribucion (plantilla)", "arquitectura (documentada)"]:
        out.append("Sostenibilidad de '%s': costo 0 de mantener y forkeable." % x)
    out += [
        "Hoja de ruta anual editable: 4 cuartos con 3 hitos cada uno, revisable en diciembre.",
        "Medicion de exito publica (repo): por ciento de semanas con plan completado.",
        "Archivo de versiones antiguas de datos (historial de ofertas).",
        "Modo 'ya me contratan': al lograr la meta, la app pasa a mantener certs y proponer la siguiente.",
        "Roadmap abierto: el usuario propone mejoras con una plantilla.",
        "'Fork personal': forkear y personalizar en 10 minutos (guia).",
        "Aportar a la comunidad: fuentes verificadas con credito.",
    ]
    return out


GEN = {
    "S14": s14, "S15": s15, "S16": s16, "S17": s17, "S18": s18,
    "S19": s19, "S20": s20, "S21": s21, "S22": s22, "S23": s23,
    "S24": s24, "S25": s25,
}
