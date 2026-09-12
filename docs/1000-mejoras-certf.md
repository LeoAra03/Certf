# 1000 mejoras para Certf

Fecha: 2026-09-12. Estado: backlog maestro (roadmap de la app).

## Objetivo que se quiere superar

El objetivo principal de Certf es llevar a una persona con 0 experiencia a ser profesional, usando solo cursos y certificaciones gratis o verificadamente con descuento, con enlaces directos de postulación y cero descuentos fantasmas. Este documento lista 1000 mejoras para que la app no solo encuentre ofertas, sino que garantice el resultado final: estudiar, rendir, certificar y conseguir el empleo.

## Como leer

- Prioridad: P0 mueve el resultado (hacer primero), P1 corto plazo, P2 backlog.
- Esfuerzo: S (dias), M (semanas), L (meses). Impacto: 1 a 5.
- Uso personal: todo es local-first, privado y sin costo; nada aqui obliga a gastar.
- Este archivo alimenta el motor de auto-mejora (seccion 21): su version maquina es docs/1000-mejoras.json.

## Tipos de test considerados (gobiernan la preparacion)

1. opcion multiple.
2. opcion multiple cronometrado.
3. laboratorio practico (hands-on).
4. caso practico guiado.
5. defensa oral o entrevista.
6. proyecto entregable.
7. portafolio de evidencias.
8. coding en vivo.
9. simulacion de incidente o escenario.
10. evaluacion por competencias.
11. escrito abierto con rubrica.
12. demonstracion con informe.

## 01. Buscula: lo que mas mueve el objetivo

1. [P0] Agregar el campo 'examen' (tipo de test: opcion multiple, laboratorio, oral, proyecto, portafolio, coding) a cada certificacion del catalogo, y adaptar ruta, plan y preparacion al tipo real de examen.
2. [P0] Perfil personal local (puesto objetivo, nivel actual, horas reales por semana, idioma) que reordena el catalogo y genera el plan 0 a PRO personal.
3. [P0] Boton 'Siguiente accion' unico en la portada: siempre muestra exactamente que hacer ahora (postular, estudiar, simulacro, agendar examen, actualizar CV).
4. [P0] Plan semanal de estudio automatico con bloques realistas (turno, commute) y re-agendado automatico si se pierde un bloque.
5. [P0] Motor de simulacros por tipo de test: opcion multiple con feedback inmediato, laboratorio con sandbox, defensa oral con simulador, portafolio con rubrica.
6. [P0] Bitacora de errores: cada falla en simulacro queda guardada por tema, con repaso espaciado y export a Anki o flashcards del telefono.
7. [P0] Asistente de dia de examen: checklist T-7 a T-0, documentos, proctoring, prueba de sistema y contingencia (que hacer si todo falla).
8. [P0] Post-examen: registro automatico del resultado, politica y descuento de retake (fuente oficial) y actualizacion del panel 'Mis certificaciones'.
9. [P0] Portafolio personal verificable (web) con badges, proyectos y certificados, con enlace unico para pegar en CV y LinkedIn.
10. [P0] Generador de CV 0 a PRO (ATS, español e inglés) desde certificaciones + proyectos, con version por oferta y tracking de postulaciones.
11. [P0] Preparacion de entrevistas: banco de preguntas por area y nivel (junior a senior) en español e inglés, con grabacion de la respuesta y feedback.
12. [P0] Buscador de empleo local (Chile): Puyal, LinkedIn, Computrabajo y BNE con alertas diarias emparejadas a las certificaciones del usuario.
13. [P0] Benchmark salarial: rangos por puesto y ciudad (Chile) y remoto, con fuente y fecha, para fijar meta y evaluar ofertas.
14. [P0] Postulacion directa: cada tarjeta 100% gratis lleva a la pagina real de postular (Apply Now) y rastrea el estado (postulado, confirmado, admitido).
15. [P0] Recordatorios inteligentes por fechas reales (plazos, ventanas, examenes, renovaciones) con escala si se ignoran y 'lo hago ahora'.
16. [P0] Busqueda en tiempo real v2: consulta en lenguaje natural ('cert cloud gratis con examen en menos de 3 meses') con respuesta estructurada y evidencia.
17. [P0] Monitor de salud de enlaces: verificacion diaria automatica de todas las URLs del catalogo (status + texto clave) con alerta si mueren o cambia la condicion.
18. [P0] Deteccion automatica de fuentes nuevas: escaneo semanal de programas gratis o con descuento (universidades, vendors, gobierno) con verificacion antes de incorporarlos.
19. [P0] Verificacion anti-fantasma: toda oferta con nivel (oficial, prensa, comunidad), enlace a la evidencia y fecha de verificacion visible en la tarjeta.
20. [P0] Gestion central del estatus estudiantil para aplicar a todos los beneficios de estudiante (AWS, Google, Microsoft, Databricks, IBM) con estado y vencimiento.
21. [P0] Asistente de becas: paso a paso de cada beca (Coursera, edX, SENCE) con carta de postulacion borrador generada desde el perfil.
22. [P0] SENCE local: cursos gratis con fechas y ventanas de postulación, alertas de apertura y postulación directa con ClaveUnica.
23. [P0] Progreso con evidencia: reporte semanal (horas, simulacros, avance, badges) exportable a PDF, usable en entrevista como prueba de constancia.
24. [P0] Motor de auto-mejora: la app audita sus propios enlaces, datos, rendimiento y UX, y propone/aplica mejoras con changelog visible.
25. [P0] Retrospectiva semanal: cada domingo, pantalla 'que funciono, que falta, plan de la semana' generada desde datos reales.

## 02. Perfil personal y objetivo

26. [P1] Perfil con 'modo realista': si hay menos de 5 horas por semana, el plan solo usa micro-bloques y no castiga.
27. [P1] Importar CV o PDF para detectar las skills actuales y no recomendar lo que ya se domina.
28. [P1] Autoevaluacion por area (1 a 5) con mini-test por tipo de examen, para calibrar el punto de partida real.
29. [P1] Metas multiples: meta principal (empleo) + meta secundaria (cambio de area), cada una con su sub-plan.
30. [P1] Fotos de inicio: guardar el CV y el LinkedIn de hoy para medir el avance 'antes/despues' al final.
31. [P1] Perfil 100% local: sin cuenta, sin nube, exportable como JSON en un toque.
32. [P1] Si cambia la meta (por ejemplo ciber a datos), el roadmap se recalcula y conserva lo que sigue sirviendo.
33. [P1] Cambios explicitos: sin camara para examen, solo celular, internet limitado, zona horaria distinta.
34. [P1] Salario objetivo en CLP y en USD, con conversion y fuente visible.
35. [P1] Campo 'por que' (motivacion personal) que la app muestra en los dias dificeles.
36. [P1] Calendario familiar y de turnos: bloques que la app nunca ocupa (trabajo, familia, cursos presenciales).
37. [P1] Sincronizacion semanal de 2 minutos: la app pregunta 3 cosas (horas, energia, avance) y ajusta el plan.
38. [P1] Modo 'PRO en N meses': se fija la meta y el plan se invierte (que hacer cada semana hacia atras).
39. [P1] Perfil con 'modo estricto $0': oculta todo lo que cueste dinero, aunque sea barato.
40. [P2] Agregar el campo 'ciudad y region (para ofertas locales)' al perfil personal, con default local y ejemplo.
41. [P2] Agregar el campo 'horario de trabajo (turno, dias)' al perfil personal, con default local y ejemplo.
42. [P2] Agregar el campo 'tipo de internet (datos moviles, Wi-Fi, inestable)' al perfil personal, con default local y ejemplo.
43. [P2] Agregar el campo 'dispositivo principal (Android, PC, tablet)' al perfil personal, con default local y ejemplo.
44. [P2] Agregar el campo 'nivel de ingles (basico, intermedio, avanzado)' al perfil personal, con default local y ejemplo.
45. [P2] Agregar el campo 'modalidad objetivo (100 por ciento online, hibrida)' al perfil personal, con default local y ejemplo.
46. [P2] Agregar el campo 'franjas preferidas de estudio (manana, tarde, noche)' al perfil personal, con default local y ejemplo.
47. [P2] Agregar el campo 'maximo de horas por dia (limite duro)' al perfil personal, con default local y ejemplo.
48. [P2] Agregar el campo 'restriccion economica real ($0 estricto, presupuesto minimo)' al perfil personal, con default local y ejemplo.
49. [P2] Agregar el campo 'restriccion de energia (tamano maximo de bloque)' al perfil personal, con default local y ejemplo.
50. [P2] El perfil recalcula el impacto en la fase 'descubrir' al cambiar, y muestra el delta en semanas.
51. [P2] El perfil recalcula el impacto en la fase 'postular' al cambiar, y muestra el delta en semanas.
52. [P2] El perfil recalcula el impacto en la fase 'estudiar' al cambiar, y muestra el delta en semanas.
53. [P2] El perfil recalcula el impacto en la fase 'practicar en simulacro' al cambiar, y muestra el delta en semanas.
54. [P2] El perfil recalcula el impacto en la fase 'rendir el examen' al cambiar, y muestra el delta en semanas.
55. [P2] El perfil recalcula el impacto en la fase 'obtener la credencial' al cambiar, y muestra el delta en semanas.
56. [P2] El perfil recalcula el impacto en la fase 'verificar y renovar' al cambiar, y muestra el delta en semanas.
57. [P2] El perfil recalcula el impacto en la fase 'reutilizar en CV y empleo' al cambiar, y muestra el delta en semanas.
58. [P2] La autoevaluacion del perfil incluye un mini-test de tipo 'opcion multiple' para calibrar el nivel real.
59. [P2] La autoevaluacion del perfil incluye un mini-test de tipo 'opcion multiple cronometrado' para calibrar el nivel real.
60. [P2] La autoevaluacion del perfil incluye un mini-test de tipo 'laboratorio practico (hands-on)' para calibrar el nivel real.
61. [P2] La autoevaluacion del perfil incluye un mini-test de tipo 'caso practico guiado' para calibrar el nivel real.
62. [P2] Exportar el perfil como JSON cifrado en un toque, con import y verificacion (hash).
63. [P2] El perfil guarda el 'antes' (skills, CV, salario) para el comparativo de fin de ruta.
64. [P2] Si el perfil indica menos de 3 h por semana, el roadmap pasa a micro-hitos de 15 minutos.
65. [P2] El perfil valida sus propios campos (fechas coherentes, horas no negativas) al guardar.

## 03. Ruta 0 a PRO personalizada

66. [P1] Roadmap personal: secuencia ordenada de certificaciones del catalogo con hitos y semanas estimadas.
67. [P1] Cada hito con criterio de salida medible (simulacro en 80 o mas, proyecto entregado, postulacion enviada).
68. [P1] Prerrequisitos auto-detectados: si una cert exige conocimiento X, la ruta inserta antes la cert o curso que falta.
69. [P1] Tres rutas para el mismo objetivo: rapida, equilibrada y profunda, con diferencia de semanas y horas.
70. [P1] Visibilidad de sinergias: que certificaciones suman entre si (mismo vendor, mismo stack) para el CV.
71. [P1] Densidad maxima de carga por semana, con semanas buffer explicitas en el calendario.
72. [P1] Re-plan automatico si un hito se atrasa: recalcula fechas sin perder el progreso registrado.
73. [P1] 'Lista de descarte': certificaciones que ya no encajan en la meta, con el motivo guardado.
74. [P1] Roadmap exportable a PDF para guardarlo, imprimirlo o mostrarlo a un mentor.
75. [P1] Puertas (gating): no se muestra la cert N+1 hasta completar N o marcarla explicitamente como saltada.
76. [P1] ROI por certificacion en la ruta: peso en el mercado local, costo (debe ser $0), tiempo y dificultad.
77. [P1] Integracion con SENCE: si un curso local gratis cubre un hito, la ruta lo propone como via principal.
78. [P1] Tres zooms del roadmap: por trimestre, por mes y por semana.
79. [P1] Hito 'contratetable': la semana en que el CV queda listo para postular, con checklist de paquete (CV, LinkedIn, portafolio).
80. [P2] Plantilla 0 a PRO pre-hecha para el area de ciberseguridad: 4 hitos (base, medio, avanzado, contratetable), editable en minutos.
81. [P2] Plantilla 0 a PRO pre-hecha para el area de datos: 4 hitos (base, medio, avanzado, contratetable), editable en minutos.
82. [P2] Plantilla 0 a PRO pre-hecha para el area de IA y machine learning: 4 hitos (base, medio, avanzado, contratetable), editable en minutos.
83. [P2] Plantilla 0 a PRO pre-hecha para el area de nube: 4 hitos (base, medio, avanzado, contratetable), editable en minutos.
84. [P2] Plantilla 0 a PRO pre-hecha para el area de desarrollo web: 4 hitos (base, medio, avanzado, contratetable), editable en minutos.
85. [P2] Plantilla 0 a PRO pre-hecha para el area de gestion de proyectos: 4 hitos (base, medio, avanzado, contratetable), editable en minutos.
86. [P2] Plantilla 0 a PRO pre-hecha para el area de marketing digital: 4 hitos (base, medio, avanzado, contratetable), editable en minutos.
87. [P2] Plantilla 0 a PRO pre-hecha para el area de soporte y operaciones: 4 hitos (base, medio, avanzado, contratetable), editable en minutos.
88. [P2] El roadmap muestra las acciones exactas de la fase 'descubrir' con el boton que las ejecuta (abrir, postular, iniciar).
89. [P2] El roadmap muestra las acciones exactas de la fase 'postular' con el boton que las ejecuta (abrir, postular, iniciar).
90. [P2] El roadmap muestra las acciones exactas de la fase 'estudiar' con el boton que las ejecuta (abrir, postular, iniciar).
91. [P2] El roadmap muestra las acciones exactas de la fase 'practicar en simulacro' con el boton que las ejecuta (abrir, postular, iniciar).
92. [P2] El roadmap muestra las acciones exactas de la fase 'rendir el examen' con el boton que las ejecuta (abrir, postular, iniciar).
93. [P2] El roadmap muestra las acciones exactas de la fase 'obtener la credencial' con el boton que las ejecuta (abrir, postular, iniciar).
94. [P2] El roadmap muestra las acciones exactas de la fase 'verificar y renovar' con el boton que las ejecuta (abrir, postular, iniciar).
95. [P2] El roadmap muestra las acciones exactas de la fase 'reutilizar en CV y empleo' con el boton que las ejecuta (abrir, postular, iniciar).
96. [P2] Roadmap en 3 meses con densidad semanal calculada desde las horas disponibles.
97. [P2] Roadmap en 6 meses con densidad semanal calculada desde las horas disponibles.
98. [P2] Roadmap en 12 meses con densidad semanal calculada desde las horas disponibles.
99. [P2] Detector de combinacion optima: que certs juntos abren el puesto objetivo (base + especialidad + blanda).
100. [P2] El roadmap muestra la 'ruta minima viable' (menos horas para ser contratetable) y la 'ruta completa'.
101. [P2] Hito con 'evidencia': que hay que mostrar (simulacro, proyecto, badge) para considerarlo completado.
102. [P2] Si un hito depende de una ventana (beca, SENCE), el roadmap se alinea solo al calendario.
103. [P2] Boton 'pausar' del roadmap: congela con fecha, y re-planea al retomar.
104. [P2] El roadmap indica el riesgo de cada hito (probabilidad por requisitos) y la mitigacion.
105. [P2] Impresion en 1 pagina (A4) del roadmap completo, para la mesa o la nevera.

## 04. Plan de estudio y aprendizaje

106. [P1] Calendario de estudio con bloques realistas (commute, almuerzo) y re-agendado automatico si se salta uno.
107. [P1] Repaso espaciado: los errores de simulacros y las notas re-aparecen en intervalos 1, 3, 7 y 21 dias.
108. [P1] Recuerdo activo: antes de cada bloque, 5 preguntas sobre lo que se iba a estudiar.
109. [P1] Metodo por tipo de test: opcion multiple con banco de preguntas, laboratorio con sandbox, oral con simulador, portafolio con checklist.
110. [P1] Modo pomodoro con sonido local y sin internet.
111. [P1] Modo commute: lecciones de 15 a 20 minutos en audio o flashcards, solo con el telefono.
112. [P1] Notas de estudio por certificacion con busqueda y enlace a la fuente oficial de cada tema.
113. [P1] Deteccion de meseta: 3 semanas sin progreso cambia el metodo (de teorico a practico) y lo avisa.
114. [P1] Resumen diario de 10 minutos: que estudiar hoy y por que (basado en la fecha del examen).
115. [P1] Todo el material de estudio consolidado en una carpeta por cert (enlaces, PDF descargados, flashcards).
116. [P1] Estudio en paralelo de 2 certificaciones con intercalacion para evitar burnout.
117. [P1] Modo 'estudio minimo viable': si la semana se cae, queda solo lo imprescindible para mantener la fecha.
118. [P1] Packs de estudio offline por modulo, para descargar en dias de datos caros o lentos.
119. [P1] Contador semanal de horas con tendencia (subiendo, plana, cayendo) y alerta si cae dos semanas.
120. [P2] Modo de preparacion para 'opcion multiple': banco de 200 preguntas por cert con filtro por tema.
121. [P2] Modo de preparacion para 'opcion multiple cronometrado': simulacro completo con reloj real y sin volver atras.
122. [P2] Modo de preparacion para 'laboratorio practico (hands-on)': laboratorio guiado con Docker o VM y verificacion de cada paso.
123. [P2] Modo de preparacion para 'caso practico guiado': caso con datos reales (CSV, BI) y preguntas abiertas.
124. [P2] Modo de preparacion para 'defensa oral o entrevista': simulador con 10 preguntas por tema y grabacion de la respuesta.
125. [P2] Modo de preparacion para 'proyecto entregable': andamio del proyecto con entregables y checklist de aceptacion.
126. [P2] Modo de preparacion para 'portafolio de evidencias': checklist de evidencias con rubrica y seinal de 'listo'.
127. [P2] Modo de preparacion para 'coding en vivo': ejercicios locales con autograder y diff contra la solucion.
128. [P2] Micro-bloques para la franja 'commute': 10 a 20 min de flashcards o audio.
129. [P2] Micro-bloques para la franja 'almuerzo': 10 a 20 min de flashcards o audio.
130. [P2] Micro-bloques para la franja 'antes de dormir': 10 a 20 min de flashcards o audio.
131. [P2] Micro-bloques para la franja 'fin de semana': 10 a 20 min de flashcards o audio.
132. [P2] Repaso espaciado con regla 1, 3, 7 y 21 dias, y la proxima revision visible.
133. [P2] Repaso espaciado alternativo por densidad de errores (mas errores, mas frecuente).
134. [P2] Repaso espaciado anclado a la fecha del examen (densidad maxima la ultima semana).
135. [P2] Recuerdo activo: 5 preguntas sobre lo planificado antes de abrir el material.
136. [P2] Deteccion de meseta (3 semanas sin avance) con cambio de metodo documentado.
137. [P2] Resumen diario de 10 minutos: que estudiar hoy y por que.
138. [P2] Carpeta de estudio consolidada por cert (enlaces, PDF, flashcards).
139. [P2] Intercalacion de 2 certs en paralelo con plan anti-burnout.
140. [P2] Modo 'estudio minimo viable' para semanas caoticas, sin perder la fecha.
141. [P2] 'Hoja de trucos' de 1 pagina por cert, auto-generada desde las notas.
142. [P2] Log de metodos: que funciono (horas por puntaje) para replicarlo.
143. [P2] Calendario de mezcla: la app decide si hoy toca teoria, practica o simulacro (y por que).
144. [P2] Sesion corta de 30 minutos: objetivo claro, trabajo y cierre con 3 preguntas de repaso.
145. [P2] Estudio activo por defecto: cada bloque termina respondiendo algo o completando un paso de laboratorio.

## 05. Simulacros por tipo de examen

146. [P1] Motor de simulacros auto-generados a partir del temario (syllabus) oficial de cada certificacion.
147. [P1] Opcion multiple: feedback inmediato con explicacion y enlace a la fuente de cada pregunta.
148. [P1] Opcion multiple cronometrado: condiciones exactas del examen (tiempo, sin volver atras) con reporte por tema.
149. [P1] Laboratorio: guia paso a paso con sandbox (Docker o VM) y verificacion automatica del resultado de cada paso.
150. [P1] Defensa oral: simulador con preguntas en español e inglés y grabacion de la propia respuesta.
151. [P1] Portafolio: checklist de evidencias con rubrica auto-generada por item y seinal 'listo'.
152. [P1] Coding: ejercicios locales con autograder (tests) y diff contra la solucion de referencia.
153. [P1] Simulacion de incidente: escenario guiado con puntos de decision y postmortem al final.
154. [P1] Casos: caso de negocio con datos reales (CSV, BI) y preguntas abiertas con solucion modelo.
155. [P1] Simulacro con curva de dificultad (facil a dificil) y nivel adaptativo segun respuestas.
156. [P1] Bitacora global de errores por tema y por certificacion, con plan de repaso integrado.
157. [P1] Historial de puntajes con tendencia y seinal 'listo' (3 simulacros seguidos en 80 o mas).
158. [P1] Export de errores a Anki y a flashcards del telefono en un toque.
159. [P1] Regla dura: nunca se sirve un simulacro del tipo equivocado para la cert (usa el campo 'examen' del catalogo).
160. [P2] Simulacro completo de tipo 'opcion multiple' con reporte por tema y curva de dificultad.
161. [P2] Simulacro completo de tipo 'opcion multiple cronometrado' con reporte por tema y curva de dificultad.
162. [P2] Simulacro completo de tipo 'laboratorio practico (hands-on)' con reporte por tema y curva de dificultad.
163. [P2] Simulacro completo de tipo 'caso practico guiado' con reporte por tema y curva de dificultad.
164. [P2] Simulacro completo de tipo 'defensa oral o entrevista' con reporte por tema y curva de dificultad.
165. [P2] Simulacro completo de tipo 'proyecto entregable' con reporte por tema y curva de dificultad.
166. [P2] Simulacro completo de tipo 'portafolio de evidencias' con reporte por tema y curva de dificultad.
167. [P2] Simulacro completo de tipo 'coding en vivo' con reporte por tema y curva de dificultad.
168. [P2] Simulacro completo de tipo 'simulacion de incidente o escenario' con reporte por tema y curva de dificultad.
169. [P2] Simulacro completo de tipo 'evaluacion por competencias' con reporte por tema y curva de dificultad.
170. [P2] Simulacro completo de tipo 'escrito abierto con rubrica' con reporte por tema y curva de dificultad.
171. [P2] Simulacro completo de tipo 'demonstracion con informe' con reporte por tema y curva de dificultad.
172. [P2] Simulacros auto-generados para las certs de ciberseguridad desde el temario oficial.
173. [P2] Simulacros auto-generados para las certs de datos desde el temario oficial.
174. [P2] Simulacros auto-generados para las certs de IA y machine learning desde el temario oficial.
175. [P2] Simulacros auto-generados para las certs de nube desde el temario oficial.
176. [P2] Simulacros auto-generados para las certs de desarrollo web desde el temario oficial.
177. [P2] Simulacros auto-generados para las certs de gestion de proyectos desde el temario oficial.
178. [P2] Simulacro adaptativo: ajusta la dificultad segun las respuestas previas.
179. [P2] Bitacora de errores con repaso (1, 3, 7 y 21 dias) y export a Anki.
180. [P2] Seinal 'listo': 3 simulacros seguidos en 80 por ciento o mas, con tendencia estable.
181. [P2] Simulacro con audio: preguntas leidas en español o inglés para practicar a oido.
182. [P2] Simulacro en 'condiciones de examen': tiempo, ambiente y software de proctoring.
183. [P2] Reporte por tema con 'debiles/fortes' y la siguiente accion recomendada.
184. [P2] Comparativa de simulacros en el tiempo (grafica) por certificacion.
185. [P2] Simulacros offline (pack descargado por cert) para dias sin internet.

## 06. Logistica de examen y retakes

186. [P1] Asistente de dia de examen: checklist T-7, T-3, T-1 y T-0 (documentos, camara, software de proctoring, prueba de sistema).
187. [P1] Requisitos de proctoring auto-detectados por certificacion (OnVUE u otro) con enlace a la prueba de sistema.
188. [P1] 'Prueba mi PC' local: camara, micro, internet, navegador y zona horaria, con lista de fallas.
189. [P1] Countdown en vivo al examen en portada y en widget.
190. [P1] Plan B: que hacer si el examen sale mal (politica de retake, descuento de retake, tiempos de espera).
191. [P1] Calendario de retakes: la app registra la fecha del retake y la protege en el plan.
192. [P1] Registro del resultado (aprobado o no, puntaje, fecha) con foto o PDF del certificado adjunto.
193. [P1] Postulacion de logro: al aprobar, la app genera la siguiente accion (subir a Credly, actualizar CV, LinkedIn).
194. [P1] Contingencia de proctoring: segundo dispositivo de respaldo, navegador alterno, numeros de soporte.
195. [P1] Rutina anti-ansiedad de 2 minutos antes del examen (respiracion + checklist).
196. [P1] 'Paquete de examen' en un solo lugar: confirmacion, ID, temario, hojas permitidas.
197. [P1] Gestion de zona horaria: si el examen cae en otra zona, la alarma se pone en hora local (Chile).
198. [P1] Si el examen es oral o por proyecto: agendador con el evaluador y recordatorios mutuos.
199. [P1] Deteccion de descuento de retake (fuente oficial) y aplicacion automatica al plan.
200. [P2] Checklist de T-7 al examen con auto-verificacion (documentos, PC, proctoring).
201. [P2] Checklist de T-3 al examen con auto-verificacion (documentos, PC, proctoring).
202. [P2] Checklist de T-1 al examen con auto-verificacion (documentos, PC, proctoring).
203. [P2] Checklist de T-0 al examen con auto-verificacion (documentos, PC, proctoring).
204. [P2] Logistica adaptada a examenes de tipo 'opcion multiple' (materiales, ambiente, agendado con evaluador).
205. [P2] Logistica adaptada a examenes de tipo 'opcion multiple cronometrado' (materiales, ambiente, agendado con evaluador).
206. [P2] Logistica adaptada a examenes de tipo 'laboratorio practico (hands-on)' (materiales, ambiente, agendado con evaluador).
207. [P2] Logistica adaptada a examenes de tipo 'caso practico guiado' (materiales, ambiente, agendado con evaluador).
208. [P2] Logistica adaptada a examenes de tipo 'defensa oral o entrevista' (materiales, ambiente, agendado con evaluador).
209. [P2] Logistica adaptada a examenes de tipo 'proyecto entregable' (materiales, ambiente, agendado con evaluador).
210. [P2] Logistica adaptada a examenes de tipo 'portafolio de evidencias' (materiales, ambiente, agendado con evaluador).
211. [P2] Logistica adaptada a examenes de tipo 'coding en vivo' (materiales, ambiente, agendado con evaluador).
212. [P2] Plan de 'primer intento' con politica, costo (fuente oficial) y tiempos de espera.
213. [P2] Plan de 'retake tras no aprobar' con politica, costo (fuente oficial) y tiempos de espera.
214. [P2] Plan de 'segundo retake' con politica, costo (fuente oficial) y tiempos de espera.
215. [P2] Plan de 'recertificacion' con politica, costo (fuente oficial) y tiempos de espera.
216. [P2] Pre-ensayo del examen: simulacro completo en las mismas condiciones (hora, dispositivo, software) una semana antes.
217. [P2] Countdown al examen en portada y widget, con tono de alerta la semana previa.
218. [P2] Plan B de 24 h si se desaprueba: motivo, retake o via alternativa.
219. [P2] Registro del resultado (aprobado o no, puntaje, fecha) con foto del certificado.
220. [P2] Proxima accion automatica al aprobar (Credly, CV, LinkedIn, portafolio).
221. [P2] Examen en otra zona horaria: alarma en hora local (Chile) y aviso de diferencia.
222. [P2] Contingencia de proctoring: segundo dispositivo, navegador alterno, numeros de soporte.
223. [P2] Rutina anti-ansiedad de 2 minutos (respiracion + checklist) antes del examen.
224. [P2] Registro automatico del retake con el descuento detectado (fuente oficial).
225. [P2] Reporte post-examen (no aprobacion): analisis de errores por tema y plan de 2 semanas.

## 07. Busqueda en tiempo real v2

226. [P1] Busqueda por lenguaje natural: 'cert cloud gratis con examen en menos de 3 meses' con respuesta estructurada.
227. [P1] Filtros combinables: tipo de examen, idioma, duracion, costo, modalidad, plazo, nivel, vendor.
228. [P1] Cada resultado con evidencia (cita textual de la pagina) y fecha de verificacion (anti-fantasma).
229. [P1] Busqueda profunda: scraping bajo demanda de la fuente con progreso visible y cache local.
230. [P1] 'Que me encuentre': consultas guardadas que se re-ejecutan solas cada dia y avisan si hay novedades.
231. [P1] Busqueda semantica local del catalogo (embeddings) que funciona sin internet.
232. [P1] Busqueda por keywords del CV: 'que certificacion gratis me anade las skills que ya tengo'.
233. [P1] Respuesta con 'como postular en 3 pasos' para cada resultado.
234. [P1] Comparador de 2 o 3 ofertas: costo, tiempo, peso en el mercado, dificultad y tipo de examen.
235. [P1] Busqueda por voz en español (online u offline).
236. [P1] Ultimas busquedas con un toque para repetirlas.
237. [P1] Boton 'las 3 mejores para ti': top 3 ofertas segun el perfil, con el motivo de cada una.
238. [P1] Busqueda en el archivo de ofertas pasadas: que existio, que termino y que lo reemplazo.
239. [P1] Export de cualquier busqueda (JSON o CSV) con la evidencia completa.
240. [P2] Busqueda avanzada por 'tipo de examen', combinable con lenguaje natural.
241. [P2] Busqueda avanzada por 'idioma', combinable con lenguaje natural.
242. [P2] Busqueda avanzada por 'duracion (meses)', combinable con lenguaje natural.
243. [P2] Busqueda avanzada por 'costo ($0 o descuento)', combinable con lenguaje natural.
244. [P2] Busqueda avanzada por 'modalidad (online, hibrida)', combinable con lenguaje natural.
245. [P2] Busqueda avanzada por 'plazo (deadline)', combinable con lenguaje natural.
246. [P2] Busqueda avanzada por 'nivel (junior, intermedio)', combinable con lenguaje natural.
247. [P2] Busqueda avanzada por 'vendor', combinable con lenguaje natural.
248. [P2] Busqueda avanzada por 'area', combinable con lenguaje natural.
249. [P2] Busqueda avanzada por 'nivel de evidencia (oficial, prensa, comunidad)', combinable con lenguaje natural.
250. [P2] Consulta pre-configurada 'cert cloud gratis con examen en menos de 3 meses' con respuesta estructurada (oferta, evidencia, como postular).
251. [P2] Consulta pre-configurada 'cursos gratis locales (Chile) que me corresponden' con respuesta estructurada (oferta, evidencia, como postular).
252. [P2] Consulta pre-configurada 'certs que anaden las keywords de mi CV' con respuesta estructurada (oferta, evidencia, como postular).
253. [P2] Consulta pre-configurada 'descuentos 50 por ciento con estatus estudiantil' con respuesta estructurada (oferta, evidencia, como postular).
254. [P2] Consulta pre-configurada 'certs combinables con lo que ya estudio' con respuesta estructurada (oferta, evidencia, como postular).
255. [P2] Archivo de ofertas 'hoy' con lo que aparecio y lo que desaparecio.
256. [P2] Archivo de ofertas 'esta semana' con lo que aparecio y lo que desaparecio.
257. [P2] Archivo de ofertas 'este mes' con lo que aparecio y lo que desaparecio.
258. [P2] Archivo de ofertas 'los ultimos 6 meses' con lo que aparecio y lo que desaparecio.
259. [P2] 'Que me encuentre': consulta guardada que se re-ejecuta cada dia y avisa novedades.
260. [P2] Busqueda profunda con scraping bajo demanda, progreso visible y cache local.
261. [P2] Busqueda semantica local del catalogo (embeddings), sin internet.
262. [P2] Comparador de 2 a 3 ofertas: costo, tiempo, peso en el mercado, dificultad.
263. [P2] Cada resultado con 'como postular en 3 pasos' incluido.
264. [P2] Sugerencias en vivo mientras escribes (autocomplete) con resultados del catalogo local.
265. [P2] Historial de busquedas con estadisticas: que se busca mas y que nunca se encuentra.

## 08. Escaner, codigos, fugas y vouchers

266. [P1] Escáner de codigos de un solo uso con seinal 'esto solo se usa una vez' antes de consumirlo.
267. [P1] Verificacion de codigo antes de usar: confirmar que es valido en la pagina oficial antes de gastarlo.
268. [P1] Vouchers de estudiante: asistente central (AWS, Google, Microsoft, Databricks, IBM, Oracle) con estado de cada uno.
269. [P1] Estado de cada beneficio: aplicado, activo, vencido, con fecha y fuente oficial.
270. [P1] Dector de 'fugas': codigos que aparecen en la comunidad (Reddit, Discord) con nivel de riesgo y de verificacion.
271. [P1] Expiracion de codigos auto-detectada (texto de la pagina) y actualizacion del deadline en el calendario.
272. [P1] Copiar codigo en un toque, con contexto (donde usarlo, que paso, limite de uso).
273. [P1] Historial de codigos usados, para no re-utilizar uno de un solo uso por error.
274. [P1] Alerta de vouchers nuevos para el area del usuario (estudiante, residente, examen especifico).
275. [P1] 'Pila de beneficios': combinar voucher oficial + estudiante + promo, verificando que sea combinable.
276. [P1] Deteccion de 'codigos falsos': patrones que parecen codigos y no lo son, con explicacion.
277. [P1] Escáner sobre pagina del usuario: pegar cualquier URL y extraer la oferta con evidencia.
278. [P1] Reporte semanal de codigos: que expiraron y que aparecieron nuevos, con fuente.
279. [P1] Nivel de verificacion de cada fuga: oficial, prensa o comunidad; nunca se presenta una fuga no verificada como oficial.
280. [P2] Tracker de estado del voucher de estudiante de AWS (aplicado, activo, vencido) con fuente oficial.
281. [P2] Tracker de estado del voucher de estudiante de Google (aplicado, activo, vencido) con fuente oficial.
282. [P2] Tracker de estado del voucher de estudiante de Microsoft (aplicado, activo, vencido) con fuente oficial.
283. [P2] Tracker de estado del voucher de estudiante de Databricks (aplicado, activo, vencido) con fuente oficial.
284. [P2] Tracker de estado del voucher de estudiante de IBM (aplicado, activo, vencido) con fuente oficial.
285. [P2] Tracker de estado del voucher de estudiante de Oracle (aplicado, activo, vencido) con fuente oficial.
286. [P2] Detector de codigos 'un solo uso' con advertencia y paso de uso documentado.
287. [P2] Detector de codigos 'con expiracion' con advertencia y paso de uso documentado.
288. [P2] Detector de codigos 'personal' con advertencia y paso de uso documentado.
289. [P2] Detector de codigos 'de estudiante' con advertencia y paso de uso documentado.
290. [P2] Detector de codigos 'de residente' con advertencia y paso de uso documentado.
291. [P2] Detector de codigos 'de examen especifico' con advertencia y paso de uso documentado.
292. [P2] Escaneo de 'fugas' en Reddit con nivel de riesgo y verificacion (nunca se presenta como oficial sin confirmar).
293. [P2] Escaneo de 'fugas' en Discord con nivel de riesgo y verificacion (nunca se presenta como oficial sin confirmar).
294. [P2] Escaneo de 'fugas' en Telegram con nivel de riesgo y verificacion (nunca se presenta como oficial sin confirmar).
295. [P2] Escaneo de 'fugas' en X con nivel de riesgo y verificacion (nunca se presenta como oficial sin confirmar).
296. [P2] Escaneo de 'fugas' en foros con nivel de riesgo y verificacion (nunca se presenta como oficial sin confirmar).
297. [P2] Verificacion del codigo antes de consumirlo (dry-run si la pagina lo permite).
298. [P2] Copiar codigo en un toque, con contexto (donde, como, limite).
299. [P2] Historial de codigos usados, para no re-utilizar uno de un solo uso.
300. [P2] 'Pila de beneficios': que se puede combinar (voucher + estudiante + promo), verificado.
301. [P2] Detector de 'codigos falsos': patrones que parecen codigos y no lo son, con explicacion.
302. [P2] Escáner sobre URL del usuario: pegar cualquier pagina y extraer la oferta.
303. [P2] Reporte semanal de codigos: que expiraron y que son nuevos, con fuente.
304. [P2] Expiracion de codigos auto-detectada (texto de la pagina) y deadline en calendario.
305. [P2] Codigo con 'pasos de uso' (donde pegar, que campo, referencia visual).

## 09. Catalogo y fuentes

306. [P1] Nuevas fuentes: MOOCs de universidades, gobierno (Chile y LatAm), vendors (Cisco, Oracle, Google, etc.) con template de import.
307. [P1] Monitor de salud: chequeo diario de URLs (200 + texto clave) con alerta si un enlace muere o cambia.
308. [P1] Deteccion automatica de programas nuevos (diff de contenido + senales) con verificacion antes de agregar.
309. [P1] Cada oferta con 'nivel de verificacion' (oficial, prensa, comunidad) y fecha visible en la tarjeta.
310. [P1] Archivo automatico de ofertas expiradas con historial (que las reemplazo).
311. [P1] Catalogo de ofertas locales (SENCE, universidades, municipios) con ventana de postulacion.
312. [P1] Deteccion de cambios de condicion (precio, plazo) con changelog por oferta.
313. [P1] Vista 'catalogo por meta': filtrado por puesto objetivo, no por vendor.
314. [P1] Comunidad: reportar enlace roto con un toque y verificacion antes de corregir (con credito al que lo reporte).
315. [P1] Import de nuevas fuentes en YAML: agregar una fuente en 5 minutos sin tocar codigo.
316. [P1] Ranking de fuentes por rendimiento: ofertas validas encontradas y utiles para el perfil.
317. [P1] Idioma (es o en) auto-detectado por fuente y mostrado en la tarjeta.
318. [P1] 'Que hay de nuevo esta semana' en el catalogo, con diff visual de las tarjetas.
319. [P1] De-duplicacion: si dos fuentes ofrecen la misma cert, se une la tarjeta y se muestran ambas fuentes.
320. [P2] Tipo de fuente 'universidad' con template de import (YAML) y verificacion automatica.
321. [P2] Tipo de fuente 'gobierno (Chile y LatAm)' con template de import (YAML) y verificacion automatica.
322. [P2] Tipo de fuente 'vendor (Cisco, Oracle, Google)' con template de import (YAML) y verificacion automatica.
323. [P2] Tipo de fuente 'MOOC (edX, Coursera, FutureLearn)' con template de import (YAML) y verificacion automatica.
324. [P2] Tipo de fuente 'gremio (CChC, SII)' con template de import (YAML) y verificacion automatica.
325. [P2] Tipo de fuente 'comunidad (Reddit, Discord)' con template de import (YAML) y verificacion automatica.
326. [P2] Deteccion automatica y changelog por oferta de 'salud (status 200 + texto clave)'.
327. [P2] Deteccion automatica y changelog por oferta de 'cambio de precio o condicion'.
328. [P2] Deteccion automatica y changelog por oferta de 'programa nuevo'.
329. [P2] Deteccion automatica y changelog por oferta de 'programa eliminado'.
330. [P2] Deteccion automatica y changelog por oferta de 'expiracion de deadline'.
331. [P2] Deteccion automatica y changelog por oferta de 'cambio de ventana de postulacion'.
332. [P2] Deteccion automatica y changelog por oferta de 'disponible en español'.
333. [P2] Deteccion automatica y changelog por oferta de 'cambio de nivel de verificacion'.
334. [P2] Vista del catalogo 'por puesto objetivo' con filtro en un toque.
335. [P2] Vista del catalogo 'solo $0' con filtro en un toque.
336. [P2] Vista del catalogo 'por area' con filtro en un toque.
337. [P2] Vista del catalogo 'por deadline (90 dias)' con filtro en un toque.
338. [P2] Vista del catalogo 'por nivel de evidencia' con filtro en un toque.
339. [P2] Vista del catalogo 'por tipo de examen' con filtro en un toque.
340. [P2] De-duplicacion: si 2 fuentes ofrecen la misma cert, se unen (ambas visibles).
341. [P2] 'Que hay de nuevo esta semana' en el catalogo, con diff visual.
342. [P2] Comunidad: reportar enlace roto en un toque, con verificacion y credito.
343. [P2] Ranking de fuentes por rendimiento (ofertas validas utiles para el perfil).
344. [P2] Historial: archivo de ofertas expiradas (que las reemplazo), consultable.
345. [P2] Verificacion en un toque de cualquier oferta (re-scrape y cita visible).

## 10. Becas y beneficios locales (Chile)

346. [P1] Asistente central de becas: cada beca con requisitos, ventana y estado de postulacion del usuario.
347. [P1] Coursera: postulacion de financial aid guiada, con carta borrador adaptada al perfil (editable).
348. [P1] SENCE: cursos gratis con fechas y alertas de apertura de postulacion.
349. [P1] Postulacion directa a SENCE con ClaveUnica, paso a paso con capturas.
350. [P1] Estatus estudiantil: gestion de carnet y vigencia para usarlo en todos los beneficios.
351. [P1] Becas locales: base de becas chilenas (estado, universidades, fundaciones) con ventanas y requisitos.
352. [P1] CORFO y programas laborales: deteccion de programas que financian capacitacion o certificacion.
353. [P1] Cursos gratis de universidades: MOOCs y programas de U. de Chile, U. de Concepcion, PUC y otras.
354. [P1] Dector de 'semanas gratis': cursos gratis por tiempo limitado, con expiracion verificada.
355. [P1] Municipios: cursos municipales (Biobio y otras regiones) con registro y fechas.
356. [P1] Carta de postulacion generada automaticamente por beca, desde el perfil (motivo, situacion, objetivo).
357. [P1] Calendario de becas: ventanas, plazos y probabilidad (por cumplimiento de requisitos).
358. [P1] Plan B de beca: si no aprueba, la alternativa mas barata (descuento, voucher, instalments) verificada.
359. [P1] Deteccion de ofertas 'solo residentes' (por ejemplo 'gratis solo en Chile') con verificacion de elegibilidad.
360. [P2] Asistente de 'Coursera': requisitos, ventana, estado y carta de postulacion adaptada.
361. [P2] Asistente de 'edX': requisitos, ventana, estado y carta de postulacion adaptada.
362. [P2] Asistente de 'SENCE': requisitos, ventana, estado y carta de postulacion adaptada.
363. [P2] Asistente de 'becas estatales (Chile)': requisitos, ventana, estado y carta de postulacion adaptada.
364. [P2] Asistente de 'becas universitarias': requisitos, ventana, estado y carta de postulacion adaptada.
365. [P2] Asistente de 'programas CORFO': requisitos, ventana, estado y carta de postulacion adaptada.
366. [P2] Asistente de 'municipios': requisitos, ventana, estado y carta de postulacion adaptada.
367. [P2] Asistente de 'MOOCs de universidades publicas': requisitos, ventana, estado y carta de postulacion adaptada.
368. [P2] Alerta local de 'apertura de postulacion' con la accion en un toque.
369. [P2] Alerta local de 'cierre de ventana (48 h)' con la accion en un toque.
370. [P2] Alerta local de 'cierre de ventana (24 h)' con la accion en un toque.
371. [P2] Alerta local de 'resultado de postulacion' con la accion en un toque.
372. [P2] Alerta local de 'curso nuevo gratis del area' con la accion en un toque.
373. [P2] Alerta local de 'voucher nuevo con estatus estudiantil' con la accion en un toque.
374. [P2] Alerta local de 'cambio de requisitos' con la accion en un toque.
375. [P2] Guia del requisito 'ClaveUnica' con paso a paso y enlace directo.
376. [P2] Guia del requisito 'carnet estudiantil' con paso a paso y enlace directo.
377. [P2] Guia del requisito 'residencia (Chile)' con paso a paso y enlace directo.
378. [P2] Guia del requisito 'joven (18 a 29)' con paso a paso y enlace directo.
379. [P2] Guia del requisito 'mujer trabajadora' con paso a paso y enlace directo.
380. [P2] Guia del requisito 'subsidio al empleo' con paso a paso y enlace directo.
381. [P2] Guia del requisito 'BNE' con paso a paso y enlace directo.
382. [P2] Guia del requisito 'municipio local' con paso a paso y enlace directo.
383. [P2] Detector de 'semanas gratis': cursos gratis por tiempo limitado, con expiracion verificada.
384. [P2] Plan B de beca: si no aprueba, la alternativa mas barata verificada.
385. [P2] Calendario central de becas locales (ventanas, plazos, probabilidad por requisitos).

## 11. Postulacion directa y onboarding

386. [P1] Postulacion directa: cada tarjeta 100% gratis lleva con 'Postular ahora' a la pagina real del formulario.
387. [P1] Asistente de postulacion: el formulario se completa con los datos del perfil (auto-fill, confirmable).
388. [P1] Tracker de estado: postulado, confirmado, admitido, enrolado, con fecha y captura de cada cambio.
389. [P1] Email de confirmacion: guia local (en que bandeja buscarlo) para detectar la confirmacion rapido.
390. [P1] Trampas de onboarding documentadas por plataforma (por ejemplo 'Credly con el mismo email de la postulacion').
391. [P1] Onboarding por plataforma (UoPeople, Coursera, edX, mylearn, SkillBuilder): primeros pasos con capturas.
392. [P1] Si la postulacion se rechaza: motivo probable + siguiente opcion (re-postular, otra cert, otra beca).
393. [P1] 'Acceso': donde entra el curso cuando se aprueba, con enlace directo guardado en la tarjeta.
394. [P1] Sugerencia de email dedicado para certificaciones, con plantilla de creacion.
395. [P1] Checklist de datos personales (RUT, foto de ID, carnet estudiantil) para no perder tiempo en formularios.
396. [P1] Historial de postulaciones (todas, con estado) en una sola pantalla.
397. [P1] 'Paquete de postulacion': CV, carta y enlaces listos para pegar en cada formulario.
398. [P1] Deteccion de ventanas de postulacion ('abiertas hasta X') con countdown.
399. [P1] Deteccion de lista de espera y alerta cuando aperece cupo.
400. [P2] Onboarding paso a paso de 'UoPeople': crear cuenta, postular, entrar al curso, obtener badge.
401. [P2] Onboarding paso a paso de 'Coursera': crear cuenta, postular, entrar al curso, obtener badge.
402. [P2] Onboarding paso a paso de 'edX': crear cuenta, postular, entrar al curso, obtener badge.
403. [P2] Onboarding paso a paso de 'mylearn (Oracle)': crear cuenta, postular, entrar al curso, obtener badge.
404. [P2] Onboarding paso a paso de 'SkillBuilder (AWS)': crear cuenta, postular, entrar al curso, obtener badge.
405. [P2] Onboarding paso a paso de 'SkillsBuild (IBM)': crear cuenta, postular, entrar al curso, obtener badge.
406. [P2] Onboarding paso a paso de 'Microsoft Learn': crear cuenta, postular, entrar al curso, obtener badge.
407. [P2] Onboarding paso a paso de 'Fortinet Training': crear cuenta, postular, entrar al curso, obtener badge.
408. [P2] Estado 'postulado' en el tracker con fecha, captura y proxima accion.
409. [P2] Estado 'confirmacion recibida' en el tracker con fecha, captura y proxima accion.
410. [P2] Estado 'admitido' en el tracker con fecha, captura y proxima accion.
411. [P2] Estado 'enrolado' en el tracker con fecha, captura y proxima accion.
412. [P2] Estado 'rechazado' en el tracker con fecha, captura y proxima accion.
413. [P2] Estado 'lista de espera' en el tracker con fecha, captura y proxima accion.
414. [P2] Campo 'RUT o ID' auto-completado desde el perfil, con confirmacion manual.
415. [P2] Campo 'foto de ID' auto-completado desde el perfil, con confirmacion manual.
416. [P2] Campo 'carnet estudiantil' auto-completado desde el perfil, con confirmacion manual.
417. [P2] Campo 'email dedicado' auto-completado desde el perfil, con confirmacion manual.
418. [P2] Campo 'telefono' auto-completado desde el perfil, con confirmacion manual.
419. [P2] Campo 'direccion' auto-completado desde el perfil, con confirmacion manual.
420. [P2] Campo 'historial (si lo piden)' auto-completado desde el perfil, con confirmacion manual.
421. [P2] 'Postular ahora' que lleva al formulario real (cero landings de marketing).
422. [P2] Trampas de onboarding por plataforma (por ejemplo 'Credly con el mismo email').
423. [P2] 'Acceso': donde entra el curso al aprobar, con enlace directo guardado.
424. [P2] 'Paquete de postulacion': CV, carta y enlaces listos para pegar.
425. [P2] Ventanas de postulacion con countdown y alerta de lista de espera.

## 12. Seguimiento y verificacion de progreso

426. [P1] Panel 'Mis certificaciones': todas con estado (en curso, aprobada, badge activo, por renovar, vencida).
427. [P1] Verificacion automatica: badge en Credly o LinkedIn con enlace publico guardado.
428. [P1] Renovaciones: countdown y guia de recertificacion cuando aplique.
429. [P1] 'Prueba de avance': reporte semanal exportable (horas, simulacros, hitos).
430. [P1] Transcript local: listado cronologico de todo lo hecho, usable en entrevista.
431. [P1] Fotografia o PDF de cada certificado, con metadatos (fecha, emisor, enlace de verificacion).
432. [P1] Dector de gaps: que le falta al usuario para el puesto objetivo (comparado con ofertas reales).
433. [P1] Avance por area (ciber 60 por ciento, datos 20 por ciento) con grafica de radar.
434. [P1] 'Dias sin actividad' con reactivacion suave (plan de 7 dias, sin culpa).
435. [P1] Hitos automaticos: badges de progreso (10 h, 50 h, 100 h, 1ra cert, 3ra cert).
436. [P1] Sincronia con el plan: si el avance real va atrasado, alerta y re-plan en un toque.
437. [P1] 'Prueba de esfuerzo' para entrevista: horas, proyectos y simulacros realizados, exportable.
438. [P1] Valididad de cada cert (si caduca y en cuanto tiempo) visible en la tarjeta.
439. [P1] 'Antes y despues': comparacion del CV inicial contra el actual, lado a lado.
440. [P2] Estado 'en curso' en el panel 'Mis certificaciones', con fecha y accion.
441. [P2] Estado 'simulacro en 80 por ciento o mas' en el panel 'Mis certificaciones', con fecha y accion.
442. [P2] Estado 'aprobada' en el panel 'Mis certificaciones', con fecha y accion.
443. [P2] Estado 'badge activo' en el panel 'Mis certificaciones', con fecha y accion.
444. [P2] Estado 'por renovar (60 dias)' en el panel 'Mis certificaciones', con fecha y accion.
445. [P2] Estado 'vencida' en el panel 'Mis certificaciones', con fecha y accion.
446. [P2] Estado 'renovada' en el panel 'Mis certificaciones', con fecha y accion.
447. [P2] Verificacion y guardado de 'Credly (enlace publico)' por certificacion.
448. [P2] Verificacion y guardado de 'LinkedIn (certificacion)' por certificacion.
449. [P2] Verificacion y guardado de 'portafolio personal' por certificacion.
450. [P2] Verificacion y guardado de 'transcript local' por certificacion.
451. [P2] Verificacion y guardado de 'foto o PDF del certificado' por certificacion.
452. [P2] Detector de gaps para ciberseguridad: que falta para el puesto objetivo (vs ofertas reales).
453. [P2] Detector de gaps para datos: que falta para el puesto objetivo (vs ofertas reales).
454. [P2] Detector de gaps para IA y machine learning: que falta para el puesto objetivo (vs ofertas reales).
455. [P2] Detector de gaps para nube: que falta para el puesto objetivo (vs ofertas reales).
456. [P2] Detector de gaps para desarrollo web: que falta para el puesto objetivo (vs ofertas reales).
457. [P2] Detector de gaps para gestion de proyectos: que falta para el puesto objetivo (vs ofertas reales).
458. [P2] Detector de gaps para marketing digital: que falta para el puesto objetivo (vs ofertas reales).
459. [P2] Detector de gaps para soporte y operaciones: que falta para el puesto objetivo (vs ofertas reales).
460. [P2] 'Prueba de avance' semanal exportable (horas, simulacros, hitos).
461. [P2] Transcript local cronologico, usable en entrevista.
462. [P2] 'Antes/despues': CV inicial vs actual, lado a lado.
463. [P2] Hitos automaticos (10 h, 50 h, 100 h, 1ra cert, 3ra cert).
464. [P2] Alerta de desviacion: si el avance va atrasado al plan, re-plan en un toque.
465. [P2] Valididad de cada cert (si caduca y en cuanto) visible en la tarjeta.

## 13. CV, LinkedIn y portafolio

466. [P1] Generador de CV ATS desde certificaciones + proyectos, en español e inglés.
467. [P1] Version del CV por oferta: keywords auto-adaptadas a la oferta detectada.
468. [P1] Portafolio personal (web en Pages) con badges, proyectos y certificados, con enlace unico.
469. [P1] Asistente de LinkedIn: secciones (certificaciones, skills, 'acerca de') con texto borrador.
470. [P1] Al aprobar una cert: actualizar CV + LinkedIn + portafolio en un toque (editable antes de guardar).
471. [P1] Perfil de GitHub o GitLab: README con certificaciones y proyectos (template).
472. [P1] 'Impacto' de cada cert en el CV: no solo el nombre, sino que demuestra (skill verificable).
473. [P1] CV con QR que lleva al portafolio.
474. [P1] Asistente de proyectos: 3 proyectos de portafolio por area, paso a paso y con demo publica.
475. [P1] Carta de presentacion por oferta, con texto adaptado (borrador automatico, editable).
476. [P1] 'Que decir en la entrevista' por cert: version de 1 minuto y de 3 minutos.
477. [P1] Check de CV: coherencia (fechas, nombres exactos de certs, sin typos).
478. [P1] Historico de versiones del CV (v1, v2) con diff entre versiones.
479. [P1] Paquete descargable en un toque (CV + portafolio + carta, PDF).
480. [P2] Generador de CV en formato 'ATS (español)' desde certs + proyectos.
481. [P2] Generador de CV en formato 'ATS (inglés)' desde certs + proyectos.
482. [P2] Generador de CV en formato 'creativo (diseno y marketing)' desde certs + proyectos.
483. [P2] Generador de CV en formato 'academico (beca)' desde certs + proyectos.
484. [P2] Generador de CV en formato 'ejecutivo (senior)' desde certs + proyectos.
485. [P2] Generador de CV en formato 'remoto internacional' desde certs + proyectos.
486. [P2] Actualizacion automatica de 'LinkedIn (certificaciones)' al llegar una cert nueva (1 toque, editable).
487. [P2] Actualizacion automatica de 'LinkedIn (skills)' al llegar una cert nueva (1 toque, editable).
488. [P2] Actualizacion automatica de 'LinkedIn (acerca de)' al llegar una cert nueva (1 toque, editable).
489. [P2] Actualizacion automatica de 'GitHub (README)' al llegar una cert nueva (1 toque, editable).
490. [P2] Actualizacion automatica de 'GitLab (README)' al llegar una cert nueva (1 toque, editable).
491. [P2] Actualizacion automatica de 'portafolio web' al llegar una cert nueva (1 toque, editable).
492. [P2] Actualizacion automatica de 'correo de contacto' al llegar una cert nueva (1 toque, editable).
493. [P2] Actualizacion automatica de 'CV con QR' al llegar una cert nueva (1 toque, editable).
494. [P2] Asistente de 3 proyectos de portafolio para ciberseguridad (paso a paso, demo publica, codigo).
495. [P2] Asistente de 3 proyectos de portafolio para datos (paso a paso, demo publica, codigo).
496. [P2] Asistente de 3 proyectos de portafolio para IA y ML (paso a paso, demo publica, codigo).
497. [P2] Asistente de 3 proyectos de portafolio para nube (paso a paso, demo publica, codigo).
498. [P2] Asistente de 3 proyectos de portafolio para desarrollo (paso a paso, demo publica, codigo).
499. [P2] Asistente de 3 proyectos de portafolio para gestion de proyectos (paso a paso, demo publica, codigo).
500. [P2] A/B de CV: 2 versiones por oferta, y registrar cual trae mas entrevistas.
501. [P2] 'Impacto' de cada cert en el CV: que demuestra, no solo el nombre.
502. [P2] Carta de presentacion por oferta (borrador automatico, editable).
503. [P2] 'Que decir en la entrevista' por cert (1 minuto y 3 minutos).
504. [P2] Check de CV: coherencia (fechas, nombres exactos, typos).
505. [P2] Paquete descargable (CV + portafolio + carta, PDF) en un toque.

## 14. Empleo y mercado local

506. [P1] Buscador de empleo local (Puyal, LinkedIn, Computrabajo, BNE) con filtros por certificacion.
507. [P1] Alerta de empleo: ofertas nuevas que matchean el perfil, resenas diarias.
508. [P1] Match: cada oferta puntuada por su correspondencia con las certificaciones del usuario.
509. [P1] Tracker de postulaciones laborales: oferta, postulado, entrevista, respuesta, en kanban.
510. [P1] Salario benchmark local (Chile y remoto) con fuente y fecha actualizada.
511. [P1] 'CV minimo viable' de junior: que se necesita para conseguir la primera entrevista.
512. [P1] Banco de preguntas de entrevista por area y nivel, en español e inglés, con respuesta modelo.
513. [P1] Entrevista simulada: preguntas grabadas con auto-evaluacion de la respuesta.
514. [P1] Analisis de N ofertas reales: que piden (keywords, certs) frente a que tiene el usuario.
515. [P1] Remoto: guia de busqueda (zona horaria, pago en USD, contrato, impuestos en Chile).
516. [P1] Red: meetups y comunidades locales (Biobio, Santiago) con agenda y registro.
517. [P1] Plan '30 dias a la primera entrevista': accion concreta por dia.
518. [P1] Follow-up: recordatorio de seguimiento de postulaciones (a los 7 y 14 dias).
519. [P1] Evaluacion de oferta: checklist (salario, crecimiento, remoto, tipo de contrato).
520. [P2] Buscador de empleo en Puyal con filtros por certificacion y ciudad.
521. [P2] Buscador de empleo en LinkedIn con filtros por certificacion y ciudad.
522. [P2] Buscador de empleo en Computrabajo con filtros por certificacion y ciudad.
523. [P2] Buscador de empleo en BNE con filtros por certificacion y ciudad.
524. [P2] Buscador de empleo en Wellfound (remoto) con filtros por certificacion y ciudad.
525. [P2] Buscador de empleo en RemoteOK (remoto) con filtros por certificacion y ciudad.
526. [P2] Etapas del kanban laboral 'postulado' con recordatorio y proxima accion.
527. [P2] Etapas del kanban laboral 'primer contacto' con recordatorio y proxima accion.
528. [P2] Etapas del kanban laboral 'primera entrevista' con recordatorio y proxima accion.
529. [P2] Etapas del kanban laboral 'segunda entrevista' con recordatorio y proxima accion.
530. [P2] Etapas del kanban laboral 'reto tecnico' con recordatorio y proxima accion.
531. [P2] Etapas del kanban laboral 'oferta final' con recordatorio y proxima accion.
532. [P2] Etapas del kanban laboral 'rechazo' con recordatorio y proxima accion.
533. [P2] Etapas del kanban laboral 'sin respuesta (7 dias)' con recordatorio y proxima accion.
534. [P2] Benchmark salarial (Chile y remoto) para ciberseguridad, con fuente, ciudad y fecha.
535. [P2] Benchmark salarial (Chile y remoto) para datos, con fuente, ciudad y fecha.
536. [P2] Benchmark salarial (Chile y remoto) para IA y machine learning, con fuente, ciudad y fecha.
537. [P2] Benchmark salarial (Chile y remoto) para nube, con fuente, ciudad y fecha.
538. [P2] Benchmark salarial (Chile y remoto) para desarrollo web, con fuente, ciudad y fecha.
539. [P2] Benchmark salarial (Chile y remoto) para gestion de proyectos, con fuente, ciudad y fecha.
540. [P2] Benchmark salarial (Chile y remoto) para marketing digital, con fuente, ciudad y fecha.
541. [P2] Benchmark salarial (Chile y remoto) para soporte y operaciones, con fuente, ciudad y fecha.
542. [P2] Alerta diaria de ofertas que matchean el perfil, con puntuacion de match.
543. [P2] 'CV minimo viable' de junior: que se necesita para la primera entrevista.
544. [P2] Guia de empleo remoto (zona horaria, pago en USD, contrato, impuestos en Chile).
545. [P2] Plan '30 dias a la primera entrevista' con accion concreta por dia.

## 15. Comunidad y accountability

546. [P1] Grupo de estudio local: invitar a un amigo a compartir plan y ver el avance mutuo (con permiso).
547. [P1] Accountability: 1 persona ve las metas semanales del usuario (privado, opt-in).
548. [P1] Meetups locales: agenda de meetups tech (Biobio, Santiago) con registro.
549. [P1] Discord o Telegram: lista de grupos activos por area con reglas de entrada.
550. [P1] 'Estudia conmigo': timer local para sesiones virtuales con un buddy.
551. [P1] Meta publica (opcional): publicar el hito para recibir apoyo.
552. [P1] Mentores locales: directorio (voluntario) con disponibilidad.
553. [P1] Compartir reporte: PDF semanal para enviar al buddy de accountability.
554. [P1] Retos por meses (por ejemplo '100 h de estudio') con ranking privado.
555. [P1] Comunidad de 'primeras entrevistas': log de procesos y aprendizajes (anonimo).
556. [P1] Universidades (U. de Concepcion, U. de Chile, otras): grupos de estudiantes gratis para estudiar.
557. [P1] Intercambio de notas: compartir y recibir flashcards o resenas por certificacion.
558. [P1] Check-in semanal (5 min) con el buddy, con agenda y recordatorio.
559. [P1] Privado por default: nada se comparte sin permiso explícito.
560. [P2] Modo local 'estudio con buddy' (privado, con permiso explícito).
561. [P2] Modo local 'accountability (ver metas)' (privado, con permiso explícito).
562. [P2] Modo local 'grupo de estudio local' (privado, con permiso explícito).
563. [P2] Modo local 'mentor voluntario' (privado, con permiso explícito).
564. [P2] Modo local 'reto por meses' (privado, con permiso explícito).
565. [P2] Modo local 'check-in semanal (5 min)' (privado, con permiso explícito).
566. [P2] Modo local 'intercambio de flashcards' (privado, con permiso explícito).
567. [P2] Modo local 'log de procesos (anonimo)' (privado, con permiso explícito).
568. [P2] Directorio de meetups y comunidades tech de Biobio con agenda y entrada.
569. [P2] Directorio de meetups y comunidades tech de Santiago con agenda y entrada.
570. [P2] Directorio de meetups y comunidades tech de Chile (online) con agenda y entrada.
571. [P2] Directorio de meetups y comunidades tech de latinoamericano con agenda y entrada.
572. [P2] Grupo de estudiantes de U. de Concepcion para estudiar gratis (contacto y reglas).
573. [P2] Grupo de estudiantes de U. de Chile para estudiar gratis (contacto y reglas).
574. [P2] Grupo de estudiantes de U. de Talca para estudiar gratis (contacto y reglas).
575. [P2] Grupo de estudiantes de universidad local para estudiar gratis (contacto y reglas).
576. [P2] Timer local 'estudia conmigo' para sesiones virtuales con un buddy.
577. [P2] Compartir el reporte semanal (PDF) con el buddy de accountability (1 toque).
578. [P2] Muro de metas del grupo: todos ven su objetivo del mes (opt-in por persona).
579. [P2] Control de quien ve que: permisos por seccion (avances, cuenta, notas).
580. [P2] Ranking privado (local): yo contra mi historico, sin terceros.
581. [P2] Log comunitario de 'primeras entrevistas' con aprendizajes (anonimo).
582. [P2] Directorio de mentores locales (voluntario) con disponibilidad.
583. [P2] Grupos universitarios locales: como entrar y que ofrecen (gratis).
584. [P2] Reto del mes (opcional, propio) con tracking local.
585. [P2] Compartir fuentes verificadas (con credito) para mejorar el catalogo.

## 16. Notificaciones y recordatorios

586. [P1] Recordatorios inteligentes por fechas reales (plazos, ventanas, examenes) con T-7, T-3, T-1 y T-0.
587. [P1] Escala: si un recordatorio se ignora, se repite y propone nueva fecha.
588. [P1] Pantalla 'Hoy': que queda pendiente hoy (estudio, postulacion, plazo) en un solo lugar.
589. [P1] Recordatorio semanal (domingo): plan de la semana generado desde el roadmap.
590. [P1] Alerta de deadline con severidad (rojo, naranja, verde).
591. [P1] Notificacion local en Android (widget) sin abrir la app.
592. [P1] Snooze y 'lo hago ahora' directo desde la notificacion.
593. [P1] Horas silenciosas: sin notificaciones de noche salvo lo critico.
594. [P1] 'No me dejes perder la ventana': chequeo diario de SENCE y becas antes del cierre.
595. [P1] Digest opcional (1 vez al dia): las 3 novedades mas relevantes para el perfil.
596. [P1] Alerta de examen con paquete (que llevar, donde entrar, a que hora).
597. [P1] Alerta de renovacion de certs (60, 30 y 7 dias antes del vencimiento).
598. [P1] Alerta '30 dias sin actividad' con plan de reactivacion.
599. [P1] Todas las notificaciones locales (sin servidor) con override manual.
600. [P2] Notificacion 'T-7' para eventos de certs (examen, ventana, renovacion).
601. [P2] Notificacion 'T-3' para eventos de certs (examen, ventana, renovacion).
602. [P2] Notificacion 'T-1' para eventos de certs (examen, ventana, renovacion).
603. [P2] Notificacion 'T-0' para eventos de certs (examen, ventana, renovacion).
604. [P2] Notificacion 'T+1 (resultado)' para eventos de certs (examen, ventana, renovacion).
605. [P2] Notificacion 'T-60 (renovacion)' para eventos de certs (examen, ventana, renovacion).
606. [P2] Notificacion 'T-30 (renovacion)' para eventos de certs (examen, ventana, renovacion).
607. [P2] Notificacion 'T-7 (renovacion)' para eventos de certs (examen, ventana, renovacion).
608. [P2] Alerta local de 'apertura de postulacion (SENCE)' con la accion en un toque.
609. [P2] Alerta local de 'cierre de beca (48 h)' con la accion en un toque.
610. [P2] Alerta local de 'codigo nuevo (fuga)' con la accion en un toque.
611. [P2] Alerta local de 'cupos limitados detectados en la fuente' con la accion en un toque.
612. [P2] Alerta local de 'enlace del plan caido' con la accion en un toque.
613. [P2] Alerta local de 'simulacro listo' con la accion en un toque.
614. [P2] Alerta local de 'dia de examen' con la accion en un toque.
615. [P2] Alerta local de 'semana sin actividad' con la accion en un toque.
616. [P2] Digest local de 'manana (9:00)' (3 items, sin spam).
617. [P2] Digest local de 'tarde (15:00)' (3 items, sin spam).
618. [P2] Digest local de 'noche (20:00)' (3 items, sin spam).
619. [P2] Digest local de 'domingo (plan)' (3 items, sin spam).
620. [P2] Digest local de 'lunes (resumen)' (3 items, sin spam).
621. [P2] Escala: si el recordatorio se ignora, se repite y propone nueva fecha.
622. [P2] Notificaciones con texto accionable: la frase de la accion ya va en la notificacion.
623. [P2] Horas silenciosas (sin notificaciones de noche, salvo lo critico).
624. [P2] 'No me dejes perder la ventana': chequeo diario de SENCE y becas.
625. [P2] Modo 'silencio total' en un toque: pausa todo salvo examenes y deadlines rojos.

## 17. Offline, rendimiento y privacidad

626. [P1] 100 por ciento offline: catalogo, plan, simulacros y notas funcionan sin internet.
627. [P1] Packs offline por certificacion (descarga bajo demanda, con limite de espacio).
628. [P1] Sincronizacion de datos: los cambios hechos offline se integran al volver a tener red.
629. [P1] Privacidad local: todos los datos en el dispositivo; export opcional cifrado.
630. [P1] Sin cuentas, sin tracking, sin ads (uso personal, datos se quedan en el telefono).
631. [P1] Backup en un toque (JSON cifrado) hacia la nube del propio usuario.
632. [P1] Restore desde backup con verificacion (hash) para detectar corrupcion.
633. [P1] Rendimiento: arranque en menos de 1 s y busqueda local en menos de 200 ms (medido en CI).
634. [P1] Modo bajo consumo: sin animaciones en background, para bateria limitada.
635. [P1] Espacio reducido: limpieza de packs descargados con politica de retencion.
636. [P1] Seguridad: opcion de PIN o biometrico para abrir la app.
637. [P1] 'Borrar todo': borrado real con doble confirmacion (derecho al olvido).
638. [P1] Auditoria de privacidad: pantalla que muestra que datos guarda la app y donde.
639. [P1] Red inestable: reintentos automaticos con backoff y cola visible de operaciones.
640. [P2] Modulo 'catalogo' 100 por ciento offline: funciona sin internet.
641. [P2] Modulo 'plan' 100 por ciento offline: funciona sin internet.
642. [P2] Modulo 'simulacros' 100 por ciento offline: funciona sin internet.
643. [P2] Modulo 'notas' 100 por ciento offline: funciona sin internet.
644. [P2] Modulo 'busqueda' 100 por ciento offline: funciona sin internet.
645. [P2] Modulo 'CV' 100 por ciento offline: funciona sin internet.
646. [P2] Modulo 'escáner' 100 por ciento offline: funciona sin internet.
647. [P2] Modulo 'comunidad (local)' 100 por ciento offline: funciona sin internet.
648. [P2] Funcion local 'backup (JSON cifrado)' en un toque, con confirmacion.
649. [P2] Funcion local 'restore (con hash)' en un toque, con confirmacion.
650. [P2] Funcion local 'export (CSV)' en un toque, con confirmacion.
651. [P2] Funcion local 'sync (2 dispositivos)' en un toque, con confirmacion.
652. [P2] Funcion local 'borrado total' en un toque, con confirmacion.
653. [P2] Funcion local 'auditoria de privacidad' en un toque, con confirmacion.
654. [P2] Funcion local 'PIN o biometrico' en un toque, con confirmacion.
655. [P2] Funcion local 'modo bajo consumo' en un toque, con confirmacion.
656. [P2] Medicion y garantia de 'arranque menor a 1 s' en CI, con alerta de regresion.
657. [P2] Medicion y garantia de 'busqueda local menor a 200 ms' en CI, con alerta de regresion.
658. [P2] Medicion y garantia de 'smoke en 10 s' en CI, con alerta de regresion.
659. [P2] Medicion y garantia de 'limpieza de packs (espacio)' en CI, con alerta de regresion.
660. [P2] Medicion y garantia de 'red inestable (reintentos con backoff)' en CI, con alerta de regresion.
661. [P2] Medicion y garantia de '2G/3G (modo degradado)' en CI, con alerta de regresion.
662. [P2] Medicion y garantia de 'bateria (sin animaciones en background)' en CI, con alerta de regresion.
663. [P2] Medicion y garantia de 'Lighthouse sobre 90 (PWA)' en CI, con alerta de regresion.
664. [P2] Sin cuentas, sin tracking, sin ads (uso personal, datos en el dispositivo).
665. [P2] Sync opcional con la nube del propio usuario (WebDAV o Drive), cifrado.

## 18. Pulido Android y PWA

666. [P1] Widget en la portada del telefono: meta de hoy + proxima accion + countdown al examen.
667. [P1] Quick tiles (ajustes rapidos de Android): 'estudiar ahora' (arranca pomodoro).
668. [P1] Iconos de app con anillo de progreso (porcentaje de la cert actual).
669. [P1] PWA: instalable en telefono y escritorio, con shortcuts.
670. [P1] Modo oscuro por sistema + manual.
671. [P1] Tamano de texto ajustable (accesibilidad) y alto contraste.
672. [P1] Ojiva y tableta: layout de 2 columnas (plan + estudio).
673. [P1] Atajos de teclado (escritorio): busqueda, proxima accion, snooze.
674. [P1] Sonido local (sin audio externo) para estudio y celebraciones.
675. [P1] 'Hoy' en un gesto (swipe) desde cualquier pantalla.
676. [P1] Recientes: ultimas 5 acciones con regreso directo.
677. [P1] Modo inmersivo (fullscreen) para sesiones de estudio.
678. [P1] Version lite (menos peso) para telefonos antiguos (sin simulacros pesados).
679. [P1] Guia de instalacion PWA en navegadores comunes (Chrome, Safari, Edge).
680. [P2] Widget de la portada con 'meta de hoy + proxima accion' (1 toque abre la app).
681. [P2] Widget de la portada con 'countdown al examen' (1 toque abre la app).
682. [P2] Widget de la portada con 'porcentaje de estudio de la semana' (1 toque abre la app).
683. [P2] Widget de la portada con 'racha (dias)' (1 toque abre la app).
684. [P2] Widget de la portada con 'deadline de la semana' (1 toque abre la app).
685. [P2] Widget de la portada con 'avance de la cert en curso' (1 toque abre la app).
686. [P2] Quick tile de Android para 'estudiar ahora (pomodoro)'.
687. [P2] Quick tile de Android para 'abrir el plan'.
688. [P2] Quick tile de Android para 'hacer un simulacro'.
689. [P2] Quick tile de Android para 'proxima accion'.
690. [P2] Quick tile de Android para 'digest del dia'.
691. [P2] Quick tile de Android para 'snooze del deadline'.
692. [P2] Pulido y test visual en 'Android 14' (tamano, layout, gestos).
693. [P2] Pulido y test visual en 'Android 10 (antiguo)' (tamano, layout, gestos).
694. [P2] Pulido y test visual en 'PWA (Chrome)' (tamano, layout, gestos).
695. [P2] Pulido y test visual en 'PWA (Safari)' (tamano, layout, gestos).
696. [P2] Pulido y test visual en 'escritorio (Edge)' (tamano, layout, gestos).
697. [P2] Pulido y test visual en 'tableta' (tamano, layout, gestos).
698. [P2] Icono de app con anillo de progreso (porcentaje de la cert actual).
699. [P2] Modo oscuro por sistema + manual + alto contraste.
700. [P2] Tamano de texto ajustable (accesibilidad) y foco visible.
701. [P2] Layout de 2 columnas en ojiva y tableta (plan + estudio).
702. [P2] Atajos de teclado (escritorio): buscar, proxima accion, snooze.
703. [P2] Vibracion y hapticos para hitos, sin depender del sonido.
704. [P2] Modo inmersivo (fullscreen) y pantalla de recientes (ultimas 5 acciones).
705. [P2] Instalador offline (APK) para instalar sin datos, util para familia o viajes.

## 19. Asistente IA

706. [P1] Copiloto local: preguntas y respuestas sobre el catalogo, el plan y las notas.
707. [P1] 'Planea mi semana': genera el calendario de estudio desde la disponibilidad real.
708. [P1] CV por lenguaje natural: generar e iterar ('hazlo mas de datos', 'acortalo a 1 pagina').
709. [P1] Cartas: borrador por beca o por oferta, con tono formal y datos del perfil.
710. [P1] Entrevista: genera preguntas segun la oferta real (pegar la descripcion).
711. [P1] 'Explícame': cada tema del temario en 3 niveles (basico, medio, avanzado).
712. [P1] 'Pregúntame': preguntas instantaneas sobre lo estudiado hoy.
713. [P1] Resumenes: modulo o documento largo a 10 puntos clave.
714. [P1] 'Estoy listo?': evaluacion con simulacros y responde con honestidad (con datos).
715. [P1] Deteccion de derivacion: si el usuario estudia fuera de plan, propone re-ajuste.
716. [P1] 'Los 3 siguientes pasos mejores' con el motivo de cada uno.
717. [P1] Modo local (sin nube) por default; si usa nube, visible y opt-in.
718. [P1] Historial de conversaciones por tema (buscable).
719. [P1] Anti-halucinacion: cada respuesta cita el catalogo o una fuente con fecha (nada inventado).
720. [P2] Copilot para examenes de tipo 'opcion multiple': genera, simula y corrige con evidencia.
721. [P2] Copilot para examenes de tipo 'opcion multiple cronometrado': genera, simula y corrige con evidencia.
722. [P2] Copilot para examenes de tipo 'laboratorio practico (hands-on)': genera, simula y corrige con evidencia.
723. [P2] Copilot para examenes de tipo 'caso practico guiado': genera, simula y corrige con evidencia.
724. [P2] Copilot para examenes de tipo 'defensa oral o entrevista': genera, simula y corrige con evidencia.
725. [P2] Copilot para examenes de tipo 'proyecto entregable': genera, simula y corrige con evidencia.
726. [P2] Copilot para examenes de tipo 'portafolio de evidencias': genera, simula y corrige con evidencia.
727. [P2] Copilot para examenes de tipo 'coding en vivo': genera, simula y corrige con evidencia.
728. [P2] Copilot para examenes de tipo 'simulacion de incidente o escenario': genera, simula y corrige con evidencia.
729. [P2] Copilot para examenes de tipo 'evaluacion por competencias': genera, simula y corrige con evidencia.
730. [P2] Copilot para examenes de tipo 'escrito abierto con rubrica': genera, simula y corrige con evidencia.
731. [P2] Copilot para examenes de tipo 'demonstracion con informe': genera, simula y corrige con evidencia.
732. [P2] Banco de preguntas de entrevista de ciberseguridad (junior a senior) en español e inglés, con respuesta modelo.
733. [P2] Banco de preguntas de entrevista de datos (junior a senior) en español e inglés, con respuesta modelo.
734. [P2] Banco de preguntas de entrevista de IA y machine learning (junior a senior) en español e inglés, con respuesta modelo.
735. [P2] Banco de preguntas de entrevista de nube (junior a senior) en español e inglés, con respuesta modelo.
736. [P2] Banco de preguntas de entrevista de desarrollo web (junior a senior) en español e inglés, con respuesta modelo.
737. [P2] Banco de preguntas de entrevista de gestion de proyectos (junior a senior) en español e inglés, con respuesta modelo.
738. [P2] Banco de preguntas de entrevista de marketing digital (junior a senior) en español e inglés, con respuesta modelo.
739. [P2] Banco de preguntas de entrevista de soporte y operaciones (junior a senior) en español e inglés, con respuesta modelo.
740. [P2] Copilot local (sin nube) sobre el catalogo, el plan y las notas.
741. [P2] 'Planea mi semana': calendario de estudio desde la disponibilidad real.
742. [P2] CV por lenguaje natural: generar e iterar ('hazlo mas de datos').
743. [P2] 'Explícame' cada tema del temario en 3 niveles (basico, medio, avanzado).
744. [P2] 'Estoy listo?': evaluacion con simulacros y respuesta honesta (con datos).
745. [P2] Anti-halucinacion: cada respuesta cita el catalogo o una fuente con fecha.

## 20. Gamificacion y motivacion

746. [P1] Racha de dias de estudio (con tolerancia: 1 semana al mes no rompe la racha).
747. [P1] Niveles por area (0 a 10) con criterios visibles (horas, simulacros, certs).
748. [P1] Hitos: primera cert, 10 h, 50 h, 100 h, primera entrevista, primera oferta.
749. [P1] Pantalla 'Progreso': que cambio este mes (antes y despues).
750. [P1] Recompensa (personal): cuando se llega a un hito, el usuario define la recompensa.
751. [P1] XP visual por area (radar) y 'dias para la meta'.
752. [P1] 'Prueba de inicio': comparar semana 1 con semana N.
753. [P1] Retos por semanas (opcional, solo contra uno mismo).
754. [P1] 'Sin verguenza': si se rompe la racha, se reinicia sin perder historial.
755. [P1] Badge de constancia (3 meses activos, 6 meses activos).
756. [P1] 'Muro de avance': linea de tiempo visual de todo lo logrado.
757. [P1] Ranking privado (local): yo contra mi historico.
758. [P1] Celebracion: al aprobar un examen, pantalla de 10 segundos (sin spam).
759. [P1] Meta semanal visible: horas objetivo vs horas reales, con color (verde, amarillo).
760. [P2] Hito 'primera semana de estudio' con celebracion de 10 segundos (sin spam).
761. [P2] Hito 'primer simulacro en 70 por ciento' con celebracion de 10 segundos (sin spam).
762. [P2] Hito 'primer simulacro en 80 por ciento' con celebracion de 10 segundos (sin spam).
763. [P2] Hito 'primera postulacion' con celebracion de 10 segundos (sin spam).
764. [P2] Hito 'primera cert' con celebracion de 10 segundos (sin spam).
765. [P2] Hito 'tercera cert' con celebracion de 10 segundos (sin spam).
766. [P2] Hito 'primera entrevista' con celebracion de 10 segundos (sin spam).
767. [P2] Hito 'primera oferta' con celebracion de 10 segundos (sin spam).
768. [P2] Hito '100 h de estudio' con celebracion de 10 segundos (sin spam).
769. [P2] Hito '3 meses activo' con celebracion de 10 segundos (sin spam).
770. [P2] Hito '6 meses activo' con celebracion de 10 segundos (sin spam).
771. [P2] Hito 'meta cumplida' con celebracion de 10 segundos (sin spam).
772. [P2] Nivel (0 a 10) por area de ciberseguridad con criterios visibles (horas, simulacros, certs).
773. [P2] Nivel (0 a 10) por area de datos con criterios visibles (horas, simulacros, certs).
774. [P2] Nivel (0 a 10) por area de IA y machine learning con criterios visibles (horas, simulacros, certs).
775. [P2] Nivel (0 a 10) por area de nube con criterios visibles (horas, simulacros, certs).
776. [P2] Nivel (0 a 10) por area de desarrollo web con criterios visibles (horas, simulacros, certs).
777. [P2] Nivel (0 a 10) por area de gestion de proyectos con criterios visibles (horas, simulacros, certs).
778. [P2] Nivel (0 a 10) por area de marketing digital con criterios visibles (horas, simulacros, certs).
779. [P2] Nivel (0 a 10) por area de soporte y operaciones con criterios visibles (horas, simulacros, certs).
780. [P2] Racha de dias de estudio con tolerancia (1 semana al mes).
781. [P2] Semana perfecta: badge cuando se cumplen todas las metas semanales en 4 semanas seguidas.
782. [P2] Recompensa personal: el usuario define la recompensa por hito.
783. [P2] Nivel general 'PRO' (0 a 100) calculado por certs, horas y practica, con criterios visibles.
784. [P2] Log de rachas: historico de todas las rachas con su duracion, para ver el patron personal.
785. [P2] Curva personal: mi puntaje de simulacros contra el tiempo (grafica de aprendizaje).

## 21. Motor de auto-mejora (meta)

786. [P1] Auto-auditoria: la app chequea sus enlaces, datos y rendimiento, y propone correcciones.
787. [P1] Changelog visible: que mejoro y cuando (en la app y en el repo).
788. [P1] Tracker de roadmap: las 1000 mejoras de este documento como lista maquina (JSON) con estado.
789. [P1] Prioridad automatica: ordenar las 1000 mejoras por impacto y evidencia (no por intuicion).
790. [P1] Feedback: el usuario puntua cada pantalla (pulgar), y la app detecta puntos debiles.
791. [P1] Experimentos: A/B local (2 variantes de una pantalla) con metrica (tiempo a la accion).
792. [P1] 'Que hacer a continuacion': el motor propone 3 mejoras implementables (con diff o PR).
793. [P1] Monitor de enlaces 24/7 (via CI): si un enlace muere, se abre issue y se corrige.
794. [P1] Calidad de datos: verificacion semanal de que todo descuento tenga fuente real.
795. [P1] Deteccion de nuevas fuentes (web) y propuesta de incorporacion (con verificacion).
796. [P1] Rendimiento: medicion semanal (arranque, busqueda) con alerta de regresion.
797. [P1] Post-mortem semanal: que no funciono (pantallas, busquedas sin resultado) y accion.
798. [P1] Roadmap publico (repo) con estado por mejora (pendiente, en curso, lista).
799. [P1] 'Version del objetivo': cada mes, re-preguntar si el objetivo principal sigue siendo el mismo y ajustar.
800. [P2] Auto-auditoria semanal de 'todas las URLs del catalogo (status + texto clave)' con reporte e issue automatico.
801. [P2] Auto-auditoria semanal de 'cada descuento (fuente real)' con reporte e issue automatico.
802. [P2] Auto-auditoria semanal de 'fechas criticas (coherencia)' con reporte e issue automatico.
803. [P2] Auto-auditoria semanal de 'rendimiento (arranque, busqueda)' con reporte e issue automatico.
804. [P2] Auto-auditoria semanal de 'pantallas (accesibilidad)' con reporte e issue automatico.
805. [P2] Auto-auditoria semanal de 'datos (dedupe, orden, categoria)' con reporte e issue automatico.
806. [P2] Auto-auditoria semanal de 'simulacros (respuestas correctas con fuente)' con reporte e issue automatico.
807. [P2] Auto-auditoria semanal de 'docs (enlaces y ejemplos)' con reporte e issue automatico.
808. [P2] El motor consume 'este documento (1000 mejoras)' para ordenar que mejorar a continuacion.
809. [P2] El motor consume 'issues del repo' para ordenar que mejorar a continuacion.
810. [P2] El motor consume 'feedback (pulgar) por pantalla' para ordenar que mejorar a continuacion.
811. [P2] El motor consume 'metricas de uso (local)' para ordenar que mejorar a continuacion.
812. [P2] El motor consume 'post-mortem semanal' para ordenar que mejorar a continuacion.
813. [P2] El motor consume 'experimentos A/B locales' para ordenar que mejorar a continuacion.
814. [P2] El motor consume 'enlaces caidos (CI)' para ordenar que mejorar a continuacion.
815. [P2] El motor consume 'nuevas fuentes (web)' para ordenar que mejorar a continuacion.
816. [P2] Prioridad automatica de las 1000 mejoras por 'impacto (1 a 5)'.
817. [P2] Prioridad automatica de las 1000 mejoras por 'esfuerzo (S, M, L)'.
818. [P2] Prioridad automatica de las 1000 mejoras por 'evidencia (fuente)'.
819. [P2] Prioridad automatica de las 1000 mejoras por 'calificacion del usuario (manual)'.
820. [P2] Prioridad automatica de las 1000 mejoras por 'frecuencia de uso (local)'.
821. [P2] Prioridad automatica de las 1000 mejoras por 'tiempo a la accion'.
822. [P2] Prioridad automatica de las 1000 mejoras por 'caida de errores'.
823. [P2] Prioridad automatica de las 1000 mejoras por 'avance de la meta'.
824. [P2] Resumen de cambios de la version escrito en lenguaje de usuario (no tecnico).
825. [P2] 'Que hacer a continuacion': el motor propone 3 mejoras con diff o PR listo.

## 22. Datos y reportes

826. [P1] Reporte semanal (PDF): horas, avance, simulacros, deadlines.
827. [P1] Reporte mensual: que se consiguio, que falta, plan del mes siguiente.
828. [P1] 'Prueba' para entrevista: 1 pagina con horas, certs, proyectos y fechas.
829. [P1] Export de datos (JSON o CSV): todo, sin lock-in.
830. [P1] KPIs: constancia, avance, dias para la meta, en una pantalla.
831. [P1] Tendencia: horas por semana (6 meses) con alerta de caida.
832. [P1] 'Costo real' del plan (debe ser $0): muestra el gasto efectivo del usuario.
833. [P1] Reporte para mentor (opcional, privado, 1 pagina).
834. [P1] 'Estado de mis certs': validas, por renovar, vencidas (1 pantalla).
835. [P1] 'Estado de mis postulaciones': todas con estado y proxima accion.
836. [P1] Dashboard simple con los 5 numeros que importan.
837. [P1] 'Año en revision' (diciembre): que se logro, que se dejo, plan siguiente.
838. [P1] Comparativo: inicio vs actual (CV, skills, certs, salario).
839. [P1] Reporte en español e inglés (mismos datos) para procesos remotos.
840. [P2] Reporte auto-generado 'semanal (PDF)' con datos reales (sin manual).
841. [P2] Reporte auto-generado 'mensual (PDF)' con datos reales (sin manual).
842. [P2] Reporte auto-generado 'trimestral (resumen)' con datos reales (sin manual).
843. [P2] Reporte auto-generado 'año en revision (diciembre)' con datos reales (sin manual).
844. [P2] Reporte auto-generado 'bajo demanda (entrevista)' con datos reales (sin manual).
845. [P2] KPI 'constancia (semanas al plan)' en el dashboard (1 pantalla, 5 numeros).
846. [P2] KPI 'avance (porcentaje de certs)' en el dashboard (1 pantalla, 5 numeros).
847. [P2] KPI 'horas (semana)' en el dashboard (1 pantalla, 5 numeros).
848. [P2] KPI 'simulacros (promedio de puntaje)' en el dashboard (1 pantalla, 5 numeros).
849. [P2] KPI 'dias para la meta' en el dashboard (1 pantalla, 5 numeros).
850. [P2] KPI 'costo real (debe ser $0)' en el dashboard (1 pantalla, 5 numeros).
851. [P2] KPI 'certs activas' en el dashboard (1 pantalla, 5 numeros).
852. [P2] KPI 'postulaciones (estado)' en el dashboard (1 pantalla, 5 numeros).
853. [P2] Export en un toque a 'JSON (todo)' (sin lock-in).
854. [P2] Export en un toque a 'CSV (catalogo)' (sin lock-in).
855. [P2] Export en un toque a 'PDF (reportes)' (sin lock-in).
856. [P2] Export en un toque a 'Markdown (roadmap)' (sin lock-in).
857. [P2] Export en un toque a 'imagen (dashboard)' (sin lock-in).
858. [P2] Guion de 60 segundos: como narrar el propio progreso en una entrevista.
859. [P2] Tendencia de horas por semana (6 meses) con alerta.
860. [P2] Resumen en 3 numeros para el buddy de accountability (avance, horas, deadline mas cercano).
861. [P2] Expediente unico: todas las evidencias (certs, badges, proyectos) en 1 carpeta con indice.
862. [P2] Resumen de actividad laboral: postulaciones por semana, entrevistas y tasa de respuesta.
863. [P2] Comparativo inicio vs actual (CV, skills, certs, salario).
864. [P2] Reporte con graficas: barras de horas, linea de simulacros y mapa de areas (1 pagina).
865. [P2] 'Que funciono': analisis mensual del metodo (que se mantiene).

## 23. Calidad y testing

866. [P1] Test E2E: flujos criticos del usuario (buscar, postular, estudiar, rendir).
867. [P1] Link checker en CI: todas las URLs del catalogo (status + texto clave).
868. [P1] Test de datos: todo descuento con fuente verificable (cero fantasmas).
869. [P1] Accesibilidad: WCAG AA (contraste, lector de pantalla, foco visible).
870. [P1] Rendimiento: Lighthouse sobre 90 (PWA) y arranque menor a 1 s (Android).
871. [P1] Reporte de crashes (local, sin PII) con pasos de reproduccion.
872. [P1] Test en dispositivo real (2G/3G, almacenamiento bajo, Biobio).
873. [P1] Regresion: cada push corre toda la bateria (CI existente, expandirla).
874. [P1] Test visual: screenshots por pantalla (detectar rompida visual).
875. [P1] Test de datos: de-duplicacion, orden y categoria del catalogo.
876. [P1] 'Smoke' de 10 segundos para el usuario (boton 'probar la app').
877. [P1] Canary: backup de datos antes de cambios grandes, con rollback.
878. [P1] Metrica de exito (north star): por ciento de semanas con plan completado.
879. [P1] Tests publicos (repo) con reporte legible por humanos.
880. [P2] Test E2E del flujo 'buscar, postular, estudiar, rendir' en CI.
881. [P2] Test E2E del flujo 'perfil, plan, semana' en CI.
882. [P2] Test E2E del flujo 'escáner, codigo, uso' en CI.
883. [P2] Test E2E del flujo 'CV, oferta, entrevista' en CI.
884. [P2] Test E2E del flujo 'notificacion, accion, done' en CI.
885. [P2] Test E2E del flujo 'backup, restore, verificacion' en CI.
886. [P2] Test E2E del flujo 'offline, online (sync)' en CI.
887. [P2] Test E2E del flujo 'primer arranque, primera cert' en CI.
888. [P2] Suite de tests 'unitarios (logica)' con reporte visible (repo).
889. [P2] Suite de tests 'de integracion (datos)' con reporte visible (repo).
890. [P2] Suite de tests 'e2e (flujos)' con reporte visible (repo).
891. [P2] Suite de tests 'visuales (screenshots)' con reporte visible (repo).
892. [P2] Suite de tests 'de accesibilidad (WCAG AA)' con reporte visible (repo).
893. [P2] Suite de tests 'de rendimiento (Lighthouse sobre 90)' con reporte visible (repo).
894. [P2] Suite de tests 'de seguridad (sin PII)' con reporte visible (repo).
895. [P2] Suite de tests 'en dispositivo real (2G/3G, espacio bajo)' con reporte visible (repo).
896. [P2] Check en CI de '100 por ciento de las URLs del catalogo' (falla si regresa).
897. [P2] Check en CI de '100 por ciento de los descuentos con fuente' (falla si regresa).
898. [P2] Check en CI de 'fechas criticas (coherencia)' (falla si regresa).
899. [P2] Check en CI de 'dedupe y orden del catalogo' (falla si regresa).
900. [P2] Check en CI de 'orden de categorias (fijo)' (falla si regresa).
901. [P2] Check en CI de 'cero emojis (todo el proyecto)' (falla si regresa).
902. [P2] Check en CI de 'data.json sincronizado con data.js' (falla si regresa).
903. [P2] Check en CI de 'APK contiene el data.json actual' (falla si regresa).
904. [P2] Modo diagnostico: prueba de camara, red, almacenamiento y permisos en un toque.
905. [P2] Datos versionados: snapshot automatico semanal del store local (rollback en un toque).

## 24. Documentacion y onboarding

906. [P1] Primer arranque: asistente de 3 minutos (meta, horas, nivel) con defaults sensatos.
907. [P1] Ayuda local (FAQ) por pantalla, buscable.
908. [P1] 'Como se hace' por video corto (aplicar, beca, examen) para los flujos criticos.
909. [P1] Glosario: proctoring, temario, financial aid, ClaveUnica, voucher, un solo uso (en español).
910. [P1] 'Que es esta pantalla' (1 toque de informacion en cada pantalla).
911. [P1] Onboarding de cada plataforma (UoPeople, Coursera, mylearn) con capturas.
912. [P1]  Tutorial local (Chile): SENCE, ClaveUnica, BNE paso a paso.
913. [P1] Checklist de 'los primeros 7 dias' con marcado de completado.
914. [P1] Docs (repo) con arquitectura y decisiones (para que el usuario mantenga la app).
915. [P1] 'Hojita de trucos' del plan (1 pagina) imprimible.
916. [P1] Ayuda sin internet (todo local).
917. [P1] 'Reportar un problema' (local, con contexto, sin PII).
918. [P1] Version de docs (changelog por version de la app).
919. [P1] Modo 'mentor': guia para explicar la app a una tercera persona.
920. [P2] 'Como se hace' local (texto + capturas) de 'primer arranque (asistente 3 min)'.
921. [P2] 'Como se hace' local (texto + capturas) de 'como postular (a cualquier cert)'.
922. [P2] 'Como se hace' local (texto + capturas) de 'como conseguir la beca'.
923. [P2] 'Como se hace' local (texto + capturas) de 'como rendir el examen (proctoring)'.
924. [P2] 'Como se hace' local (texto + capturas) de 'como actualizar el CV'.
925. [P2] 'Como se hace' local (texto + capturas) de 'como conseguir el badge (Credly)'.
926. [P2] 'Como se hace' local (texto + capturas) de 'como usar SENCE (ClaveUnica)'.
927. [P2] 'Como se hace' local (texto + capturas) de 'como exportar los datos'.
928. [P2] El termino 'proctoring' en el glosario local (español, 2 lineas).
929. [P2] El termino 'temario' en el glosario local (español, 2 lineas).
930. [P2] El termino 'financial aid' en el glosario local (español, 2 lineas).
931. [P2] El termino 'ClaveUnica' en el glosario local (español, 2 lineas).
932. [P2] El termino 'voucher' en el glosario local (español, 2 lineas).
933. [P2] El termino 'codigo de un solo uso' en el glosario local (español, 2 lineas).
934. [P2] El termino 'ATS' en el glosario local (español, 2 lineas).
935. [P2] El termino 'badge (Credly)' en el glosario local (español, 2 lineas).
936. [P2] El termino 'retake' en el glosario local (español, 2 lineas).
937. [P2] El termino 'recertificacion' en el glosario local (español, 2 lineas).
938. [P2] El termino 'gap' en el glosario local (español, 2 lineas).
939. [P2] El termino 'ROI de una cert' en el glosario local (español, 2 lineas).
940. [P2] Primer arranque: asistente de 3 minutos (meta, horas, nivel) con defaults.
941. [P2] Mini-demo interactiva de 30 segundos al entrar por primera vez a cada seccion.
942. [P2] Checklist de 'los primeros 7 dias' con marcado y recordatorio.
943. [P2] Ayuda local (FAQ) por pantalla, buscable, sin internet.
944. [P2] Pantalla de 'rescate': si todo va mal, las 3 cosas que hay que hacer hoy (1 pagina).
945. [P2] Modo 'preguntar a la app': describir el problema con mis palabras y recibir la seccion de ayuda.

## 25. Expansion y sostenibilidad

946. [P1] Multi-dispositivo (opcional, cifrado): telefono + escritorio en sincronia.
947. [P1] Otros paises: template para adaptar a Peru, Colombia y Mexico (beneficios locales).
948. [P1] Multi-usuario (familia o amigos) con perfiles privados.
949. [P1] Modo mentor: 1 usuario guia a otros (local, gratis).
950. [P1] Aportar a la comunidad: compartir fuentes verificadas (con credito).
951. [P1] Sostenibilidad: costo 0 de mantener (CI gratis, open source).
952. [P1] 'Fork personal': el usuario puede forkear el repo y personalizar (guia).
953. [P1] Roadmap abierto: cualquiera (el usuario) propone mejoras con una plantilla.
954. [P1] Archivo: versiones antiguas de datos (historial de ofertas) consultable.
955. [P1] 'Certf 2.0': vision del proximo ano en 1 pagina (objetivo, hitos, metrica).
956. [P1] Medicion de exito: por ciento de semanas con plan completado (publico en repo).
957. [P1] 'Legacy': si el usuario se detiene, sus datos son exportables y su portafolio vive.
958. [P1] Open source (ya lo es): licencia y contribucion claras.
959. [P1] 'Si se logra el objetivo': plan de mantenimiento (renovaciones, nueva meta).
960. [P2] Template de adaptacion a Peru: beneficios locales, portales y moneda (1 YAML).
961. [P2] Template de adaptacion a Colombia: beneficios locales, portales y moneda (1 YAML).
962. [P2] Template de adaptacion a Mexico: beneficios locales, portales y moneda (1 YAML).
963. [P2] Template de adaptacion a Ecuador: beneficios locales, portales y moneda (1 YAML).
964. [P2] Template de adaptacion a otro municipio de Chile: beneficios locales, portales y moneda (1 YAML).
965. [P2] Modo local '2 dispositivos (sync cifrado)' (privado, opcional).
966. [P2] Modo local 'familia (perfiles privados)' (privado, opcional).
967. [P2] Modo local 'mentor (1 a varios, local)' (privado, opcional).
968. [P2] Modo local 'comunidad (fuentes verificadas)' (privado, opcional).
969. [P2] Modo local 'fork personal (guia)' (privado, opcional).
970. [P2] Modo local 'legacy (datos exportables)' (privado, opcional).
971. [P2] Sostenibilidad de 'repo (open source)': costo 0 de mantener y forkeable.
972. [P2] Sostenibilidad de 'CI (gratuita)': costo 0 de mantener y forkeable.
973. [P2] Sostenibilidad de 'datos (costo 0)': costo 0 de mantener y forkeable.
974. [P2] Sostenibilidad de 'distribucion (APK propio)': costo 0 de mantener y forkeable.
975. [P2] Sostenibilidad de 'roadmap (abierto)': costo 0 de mantener y forkeable.
976. [P2] Sostenibilidad de 'licencia (clara)': costo 0 de mantener y forkeable.
977. [P2] Sostenibilidad de 'contribucion (plantilla)': costo 0 de mantener y forkeable.
978. [P2] Sostenibilidad de 'arquitectura (documentada)': costo 0 de mantener y forkeable.
979. [P2] Hoja de ruta anual editable: 4 cuartos con 3 hitos cada uno, revisable en diciembre.
980. [P2] Medicion de exito publica (repo): por ciento de semanas con plan completado.
981. [P2] Archivo de versiones antiguas de datos (historial de ofertas).
982. [P2] Modo 'ya me contratan': al lograr la meta, la app pasa a mantener certs y proponer la siguiente.
983. [P2] Roadmap abierto: el usuario propone mejoras con una plantilla.
984. [P2] 'Fork personal': forkear y personalizar en 10 minutos (guia).
985. [P2] Aportar a la comunidad: fuentes verificadas con credito.

## 26. Transversales y extras

986. [P1] Pantalla 'Hoy' global: las 3 cosas mas importantes del dia (estudiar, postular, deadline) en 1 lugar.
987. [P1] Busqueda unica global (catalogo + notas + CV + ofertas) con secciones en el resultado.
988. [P1] Modo '10 minutos': cuando solo hay 10 min, la app muestra exactamente que hacer con ese tiempo.
989. [P1] El campo 'examen' del catalogo alimenta simulacros, plan, logistica y CV (1 sola fuente de verdad).
990. [P1] Coherencia de idioma: toda la app en español (export en inglés), sin jerga innecesaria.
991. [P1] Politica anti-fantasma visible: toda pantalla con oferta muestra la fecha de verificacion.
992. [P1] Atajos numericos globales: 1 (hoy), 2 (plan), 3 (buscar), 4 (examen), 5 (reporte).
993. [P1] Voz (español): decir 'que sigue?' y la app responde con la accion.
994. [P1] 'Semana en revision' cada domingo (5 min): logros, atrasos, plan.
995. [P1] 'Mes en revision' (15 min): hitos, metodo, ajuste del mes.
996. [P1] Todo lo que cuesta dinero es opcional: el nucleo es $0.
997. [P1] Modo enfoque: apaga notificaciones salvo examen y deadlines.
998. [P1] Modo recuperacion: despues de 2 semanas fuera, plan de 7 dias para volver sin culpa.
999. [P1] Datos: 1 solo store local (JSON) versionado, con migraciones al actualizar.
1000. [P1] 'Donde lo deje': la app guarda el punto pendiente y retoma donde estaba.

