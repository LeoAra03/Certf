# -*- coding: utf-8 -*-
"""Base del roadmap de 1000 mejoras para Certf.

Reglas del documento:
- Sin emojis, sin flechas. Español (nombres propios exceptuados).
- Prioridades: P0 (mueve el resultado: 0 a PRO y empleo), P1 (corto plazo), P2 (backlog).
- Esfuerzo: S (dias), M (semanas), L (meses).
- El motor de auto-mejora (S21) consume docs/1000-mejoras.json como roadmap.
"""

SECCIONES = [
    ("S01", "Buscula: lo que mas mueve el objetivo"),
    ("S02", "Perfil personal y objetivo"),
    ("S03", "Ruta 0 a PRO personalizada"),
    ("S04", "Plan de estudio y aprendizaje"),
    ("S05", "Simulacros por tipo de examen"),
    ("S06", "Logistica de examen y retakes"),
    ("S07", "Busqueda en tiempo real v2"),
    ("S08", "Escaner, codigos, fugas y vouchers"),
    ("S09", "Catalogo y fuentes"),
    ("S10", "Becas y beneficios locales (Chile)"),
    ("S11", "Postulacion directa y onboarding"),
    ("S12", "Seguimiento y verificacion de progreso"),
    ("S13", "CV, LinkedIn y portafolio"),
    ("S14", "Empleo y mercado local"),
    ("S15", "Comunidad y accountability"),
    ("S16", "Notificaciones y recordatorios"),
    ("S17", "Offline, rendimiento y privacidad"),
    ("S18", "Pulido Android y PWA"),
    ("S19", "Asistente IA"),
    ("S20", "Gamificacion y motivacion"),
    ("S21", "Motor de auto-mejora (meta)"),
    ("S22", "Datos y reportes"),
    ("S23", "Calidad y testing"),
    ("S24", "Documentacion y onboarding"),
    ("S25", "Expansion y sostenibilidad"),
    ("S26", "Transversales y extras"),
]

SECCION_NOMBRE = dict(SECCIONES)

# Los 12 tipos de test que gobiernan la preparacion (requisito del roadmap).
TEST_TYPES = [
    "opcion multiple",
    "opcion multiple cronometrado",
    "laboratorio practico (hands-on)",
    "caso practico guiado",
    "defensa oral o entrevista",
    "proyecto entregable",
    "portafolio de evidencias",
    "coding en vivo",
    "simulacion de incidente o escenario",
    "evaluacion por competencias",
    "escrito abierto con rubrica",
    "demonstracion con informe",
]

AREAS = [
    "ciberseguridad",
    "datos",
    "IA y machine learning",
    "nube",
    "desarrollo web",
    "gestion de proyectos",
    "marketing digital",
    "soporte y operaciones",
]

PHASES = [
    "descubrir",
    "postular",
    "estudiar",
    "practicar en simulacro",
    "rendir el examen",
    "obtener la credencial",
    "verificar y renovar",
    "reutilizar en CV y empleo",
]


def parse(item):
    """Item opcionalmente con prefijo 'P0::' / 'P1::'. Devuelve (texto, prio)."""
    if item.startswith("P0::"):
        return item[4:], "P0"
    if item.startswith("P1::"):
        return item[4:], "P1"
    return item, None
