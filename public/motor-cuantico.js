/* MANOLIT∞ FORESTAL - aplicacion completa en UN solo archivo.
 * Union exacta de los 12 modulos, en el mismo orden de carga de siempre.
 * Menos peticiones HTTP (objetivo EcoIndex <38). Cada modulo va separado
 * por ";" para que la concatenacion sea siempre segura.
 */

/* ==================== idiomas.js ==================== */
/**
 * MANOLIT∞ FORESTAL - Motor de idiomas
 * Castellano, Català, Euskera, Galego, English, Français
 */
const IDIOMAS = {
    es: {
        titulo: "MANOLIT∞ FORESTAL",
        subtitulo: "SIMULADOR CUÁNTICO DE ESTRÉS DE BIOMASA Y PREDICCIÓN DE PROPAGACIÓN",
        modoCientifico: "Modo Científico",
        modoCiudadano: "Modo Ciudadano",
        estres: "ESTRÉS DE BIOMASA",
        selecciona: "SELECCIONA UNA ZONA FORESTAL",
        datosEntrada: "> DATOS DE ENTRADA",
        latlon: "LAT/LON",
        temp: "TEMP (Q0)",
        hum: "HUMEDAD (Q1)",
        viento: "VIENTO (Q2)",
        direccion: "DIRECCIÓN VIENTO",
        nucleo: "> NÚCLEO CUÁNTICO (3 Qubits)",
        incendios: "> INCENDIOS ACTIVOS (FIRMS)",
        cargando: "Cargando capa de fuegos...",
        avisoLegal: "Aviso Legal y Metodología",
        descargarPdf: "Descargar informe PDF",
        chatTitulo: "Manolito · Asesor de Extinción",
        chatPlaceholder: "Pregunta a Manolito sobre esta zona...",
        chatSaludo: "Soy Manolito. Dime coordenadas, viento o una zona y te digo dónde actuar primero.",
        propagacion: "> PROPAGACIÓN Y ZONAS DE TRABAJO",
        zonaSeguro: "Zona segura – estrés normal",
        zonaAmbar: "Alerta preventiva – estrés moderado",
        zonaRojo: "Polvorín crítico – riesgo inminente",
        calculando: "CALCULANDO...",
        zonaAgua: "ZONA DE AGUA",
        zonaAguaMsg: "No es posible calcular estrés de biomasa forestal sobre el agua.",
        simulacionNoIniciadaAgua: "> Simulación no iniciada (zona de agua).",
        popupZonaAgua: "Zona de Agua",
        errorDatosClima: "Error al obtener datos meteorológicos. Verifica la conexión.",
        ceroFuegosVisibles: "0 fuegos visibles en esta zona",
        fuegosActivosDetectados: "{count} fuegos activos detectados",
        errorFirms: "Error al conectar con FIRMS",
        errorFirmsDev: "Mostrando fuegos de EJEMPLO (usa 'wrangler dev' para datos reales)",
        popupIncendioActivo: "Incendio activo (VIIRS)",
        popupBrillo: "Brillo",
        popupConfianza: "Confianza",
        popupEvaluarRiesgo: "Evaluar riesgo cuántico",
        tooltipPropagacion: "Zona estimada de propagación (según viento actual)",
        popupEstresBiomasa: "Estrés de Biomasa",
        actionOptimo: "Biomasa en estado óptimo. Continúa con la vigilancia periódica de la zona.",
        actionRecomendada: "<strong>ACCIÓN RECOMENDADA:</strong> Solicita a los servicios forestales la revisión y limpieza preventiva de esta franja, priorizando cabeza y flancos según el viento.",
        actionUrgente: "<strong>ACCIÓN URGENTE:</strong> Notifica a bomberos/servicios forestales. Consulta el apartado de Propagación para las zonas prioritarias de trabajo.",
        logRyAplicadas: "> RY(θ) aplicadas.",
        logCnotEjecutados: "> CNOT (0→2) y CNOT (2→1) ejecutados. Variables entrelazadas.",
        logMedicionEjecutada: "> Medición de Born ejecutada. Colapso del estado.",
        titleModoCiudadano: "Ocultar detalles técnicos",
        titleModoCiencia: "Ver detalles técnicos de la simulación",
        titleColapsar: "Click para expandir/colapsar",
        errorCargaLegal: "Error al cargar el contenido del aviso legal. Por favor, recarga la página.",
        trabajoUrgenciaBaja: "vigilancia preventiva rutinaria",
        trabajoUrgenciaMedia: "trabajo preventivo programado en los próximos días",
        trabajoUrgenciaAlta: "intervención urgente, prioridad alta",
        trabajoVientoFlojo: "viento flojo: la propagación esperada sería moderada y relativamente predecible",
        trabajoVientoModerado: "viento moderado-fuerte: la cabeza de un posible incendio avanzaría con velocidad significativa",
        trabajoVientoFuerte: "viento fuerte: riesgo de comportamiento errático, focos secundarios por pavesas y avance muy rápido en cabeza",
        trabajoTexto: `Con viento procedente del {cardCola} ({windDirOrigen}°) a {windSpeed} km/h, un incendio en este punto avanzaría hacia el {cardAvance}. {intensidadViento}.\n\nPRIORIDAD 1 - CABEZA (dirección {cardAvance}): asegurar cortafuegos y retirar biomasa en la franja situada a favor del viento; es la zona de mayor velocidad de avance y de mayor riesgo para personas y estructuras.\n\nPRIORIDAD 2 - FLANCOS ({cardFlancoIzq} y {cardFlancoDer}): trabajar estas franjas perpendiculares para evitar que el incendio "abra" y aumente su frente activo.\n\nZONA DE MENOR PRIORIDAD INMEDIATA - COLA ({cardCola}, a barlovento): el avance del fuego en esta dirección es mucho más lento; es la zona relativamente más segura para maniobras de apoyo y puntos de control, aunque no debe descuidarse.\n\nNivel recomendado de actuación: {urgencia}.`,
        pdfSubtitulo: "Informe técnico de riesgo y propagación de incendio forestal",
        pdfEstadoIncendioActivo: "INCENDIO ACTIVO",
        pdfEstadoRiesgoAlto: "RIESGO ALTO (vigilancia)",
        pdfEstadoRiesgoBajo: "riesgo bajo-moderado",
        pdfSeleccionaZona: "Selecciona primero una zona en el mapa para generar el informe.",
        pdfErrorCarga: "No se pudo cargar el generador de PDF. Comprueba tu conexión.",
        pdfAlerta: "ALERTA", pdfAviso: "AVISO",
        pdfDentroPerimetro: "DENTRO del perímetro estimado", pdfAlejate: "Aléjate",
        pdfSiCerca: "si estás cerca de la zona, aléjate", pdfEmergencias: "Emergencias",
        pdfSinConfirmar: "sin incendio confirmado, zona bajo vigilancia",
        pdfFecha: "Fecha del informe", pdfLugar: "Lugar aproximado", pdfNoDisponible: "No disponible",
        pdfCoordenadas: "Coordenadas", pdfTemperatura: "Temperatura", pdfHumedad: "Humedad relativa",
        pdfViento: "Viento", pdfDireccionLower: "dirección", pdfEstresBiomasa: "Estrés de biomasa (modelo cuántico)",
        pdfIncendiosCercanos: "Incendios activos en 25km (satélite)", pdfMasCercano: "el más cercano a",
        pdfNingunoDetectado: "ninguno detectado", pdfPerimetroIncendio: "Perímetro estimado de incendio",
        pdfDentroPerimetroCorto: "dentro del perímetro", pdfFocoDe: "foco de",
        pdfPerimetroCercano: "Perímetro estimado más cercano", pdfADistancia: "a",
        pdfRecomendacionTitulo: "Recomendación de zonas de trabajo", pdfSinRecomendacion: "Sin recomendación calculada.",
        pdfNotaRojo: "Este informe es un modelo de apoyo a la decisión basado en datos meteorológicos abiertos (Open-Meteo), satélite de incendios (NASA FIRMS) y una simulación de circuito cuántico ejecutada en el navegador. El perímetro estimado es una aproximación geométrica calculada a partir de los puntos de calor detectados y NO es un dato oficial verificado sobre el terreno. No sustituye las órdenes de mando de bomberos, Protección Civil, AEMET ni al 112. Hay indicios de incendio activo en esta zona: ante cualquier duda, contacta con el 112 o con Protección Civil/bomberos.",
        pdfNotaVerde: "Este informe es un modelo de apoyo a la decisión basado en datos meteorológicos abiertos (Open-Meteo) y una simulación de circuito cuántico ejecutada en el navegador. El perímetro estimado, cuando aparece, es una aproximación geométrica calculada a partir de los puntos de calor detectados y NO es un dato oficial verificado sobre el terreno. No sustituye las órdenes de mando de bomberos, Protección Civil, AEMET ni al 112. Ante un incendio activo, contacta siempre con el 112.",
        fwiToggle: "Índice FWI (peligro de incendio)",
        fwiToggleActivar: "Activar capa FWI de peligro de incendio",
        fwiToggleDesactivar: "Desactivar capa FWI de peligro de incendio",
        fwiLeyendaTitulo: "Índice FWI (EFFIS)",
        fwiLeyendaExpandir: "Mostrar leyenda FWI",
        fwiLeyendaColapsar: "Ocultar leyenda FWI",
        fwiMuyBajo: "Muy bajo",
        fwiBajo: "Bajo",
        fwiModerado: "Moderado",
        fwiAlto: "Alto",
        fwiMuyAlto: "Muy alto",
        fwiExtremo: "Extremo",
        fwiCargando: "Cargando capa FWI…",
        fwiError: "No se pudo cargar la capa FWI. Reintentar",
        fwiFuente: "Fuente: EFFIS / Copernicus ECMWF",
        "recursos.toggleAria": "Activar capa de recursos de extinción",
        "recursos.panelTitulo": "Recursos de extinción",
        "recursos.tipoHidrante": "Hidrante",
        "recursos.tipoDeposito": "Depósito de agua",
        "recursos.tipoHelisuperficie": "Helisuperficie",
        "recursos.tipoBalsa": "Balsa / embalse",
        "recursos.tipoBomberos": "Parque de bomberos",
        "recursos.cargando": "Cargando recursos…",
        "recursos.errorSaturado": "Servidor de mapas saturado. Inténtalo de nuevo en unos minutos.",
        "recursos.errorRed": "Sin conexión con el servidor de recursos.",
        "recursos.zoomNecesario": "Zona demasiado grande: acerca el mapa para cargar recursos.",
        "recursos.contador": "{n} recursos en la zona visible",
        "recursos.sinResultados": "No hay recursos de este tipo en la zona visible.",
        "recursos.copiar": "Copiar coords",
        "recursos.copiado": "¡Copiado!",
        "recursos.tipo": "Tipo",
        "recursos.nombre": "Nombre",
        "recursos.coords": "Coordenadas",
        "recursos.reintentar": "Reintentar",
        "pwa.online": "En línea",
        "pwa.offline": "Sin conexión — modo campo",
        "pwa.prepararZona": "Preparar zona para campo",
        "pwa.preparando": "Descargando mapa de la zona… {hechas}/{total}",
        "pwa.zonaLista": "Zona lista para uso offline ({tiles} tiles)",
        "pwa.zonaError": "No se pudo preparar la zona. Reintenta con conexión.",
        "pwa.sinMapa": "Mapa no disponible todavía",
        "pwa.cerrarAviso": "Cerrar aviso",
        "pwa.expandir": "Mostrar el botón de preparar zona",
        "gps.miUbicacion": "Mi ubicación",
        "gps.dejarSeguir": "Dejar de seguir mi ubicación",
        bandasTituloToggle: "Mostrar/ocultar bandas de propagación estimada",
        bandasTooltip: "t+{h}h ≈ {km} km (cabeza de fuego)",
        bandasAviso: "Estimación simplificada: viento y velocidad constantes. No usar para decisiones operativas.",
        "evac.boton": "Evacuación",
        "evac.botonAria": "Activar el sistema de evacuación por GPS. Tu posición no sale de tu dispositivo.",
        "evac.alertaRoja": "PELIGRO DE INCENDIO CERCANO ({dist}). Inicie la evacuación de inmediato.",
        "evac.alertaAmarilla": "Zona de riesgo de incendio a {dist}. Manténgase alerta y prepárese para evacuar.",
        "evac.iniciar": "Iniciar evacuación",
        "evac.detener": "Detener evacuación",
        "evac.haciaZonaSegura": "Zona segura a {dist}",
        "evac.rumbo": "Rumbo de escape: {card} ({grados}°)",
        "evac.modoBrujula": "Modo brújula: GPS débil. Siga el último rumbo conocido.",
        "evac.buscandoGps": "Localizando GPS…",
        "evac.sinGps": "GPS no disponible. Active la ubicación del dispositivo.",
        "evac.recalculando": "Recalculando vector de escape…",
        "evac.offline": "Sin conexión: navegando con los últimos datos guardados ({hora})",
        "evac.permisoBrujula": "Toca para activar la brújula",
        "evac.popupEscapar": "Escapar de este foco",
        "evac.fueraDeZona": "Fuera de la zona de peligro inmediato. Siga alejándose.",
        "evac.privacidad": "GPS procesado solo en tu dispositivo. Nada sale del móvil.",
        "evac.datosGuardados": "Datos de incendio guardados: {hora}",
        "evac.sinDatos": "Sin datos de incendios. Muévase en dirección contraria al humo y llame al 112.",
        "evac.cerrar": "Cerrar navegación de evacuación",
        "evac.sigueHacia": "Sigue hacia el {card}",
        "evac.calibraBrujula": "Brújula errática: calibra moviendo el móvil en forma de 8",
        "evac.gpsEdad": "hace {s} s",
        "evac.errorPermiso": "Permiso de ubicación denegado. Actívalo en los ajustes del navegador.",
        "evac.errorSinSenal": "Sin señal de ubicación. Sal a cielo abierto o activa la ubicación del sistema.",
        "evac.errorTimeout": "El GPS tarda demasiado en responder. Inténtalo de nuevo a cielo abierto.",
        "evac.vigilar": "Avisarme si hay fuego cerca (usa GPS)",
        "evac.vigilando": "Vigilancia de proximidad activa — toca para parar",
        "me.huir": "Huir del incendio",
        "me.huirAria": "Activa la guía de escape con flechas usando el GPS y la brújula de tu móvil. Te pedirá permiso de ubicación.",
        "me.ubicando": "Obteniendo tu ubicación…",
        "me.guiaActiva": "Guía de escape activa. Sigue la flecha.",
        "evac.avisoLineaRecta": "La flecha marca la dirección más corta, no una ruta segura garantizada: no esquiva el fuego ni el terreno. Prioriza siempre las indicaciones de Protección Civil y bomberos."
    },
    ca: {
        titulo: "MANOLIT∞ FORESTAL",
        subtitulo: "SIMULADOR QUÀNTIC D'ESTRÈS DE BIOMASSA I PREDICCIÓ DE PROPAGACIÓ",
        modoCientifico: "Mode Científic",
        modoCiudadano: "Mode Ciutadà",
        estres: "ESTRÈS DE BIOMASSA",
        selecciona: "SELECCIONA UNA ZONA FORESTAL",
        datosEntrada: "> DADES D'ENTRADA",
        latlon: "LAT/LON",
        temp: "TEMP (Q0)",
        hum: "HUMITAT (Q1)",
        viento: "VENT (Q2)",
        direccion: "DIRECCIÓ DEL VENT",
        nucleo: "> NUCLI QUÀNTIC (3 Qubits)",
        incendios: "> INCENDIS ACTIUS (FIRMS)",
        cargando: "Carregant capa d'incendis...",
        avisoLegal: "Avís Legal i Metodologia",
        descargarPdf: "Descarregar informe PDF",
        chatTitulo: "Manolito · Assessor d'Extinció",
        chatPlaceholder: "Pregunta a Manolito sobre aquesta zona...",
        chatSaludo: "Sóc Manolito. Dóna'm coordenades, vent o una zona i et diré on actuar primer.",
        propagacion: "> PROPAGACIÓ I ZONES DE TREBALL",
        zonaSeguro: "Zona segura – estrès normal",
        zonaAmbar: "Alerta preventiva – estrès moderat",
        zonaRojo: "Pólvora crítica – risc imminent",
        calculando: "CALCULANT...",
        zonaAgua: "ZONA D'AIGUA",
        zonaAguaMsg: "No és possible calcular l'estrès de biomassa forestal sobre l'aigua.",
        simulacionNoIniciadaAgua: "> Simulació no iniciada (zona d'aigua).",
        popupZonaAgua: "Zona d'Aigua",
        errorDatosClima: "Error en obtenir dades meteorològiques. Verifiqueu la connexió.",
        ceroFuegosVisibles: "0 focs visibles en aquesta zona",
        fuegosActivosDetectados: "{count} focs actius detectats",
        errorFirms: "Error en connectar amb FIRMS",
        errorFirmsDev: "Mostrant focs d'EXEMPLE (usa 'wrangler dev' per a dades reals)",
        popupIncendioActivo: "Incendi actiu (VIIRS)",
        popupBrillo: "Brillantor",
        popupConfianza: "Confiança",
        popupEvaluarRiesgo: "Avaluar risc quàntic",
        tooltipPropagacion: "Zona estimada de propagació (segons el vent actual)",
        popupEstresBiomasa: "Estrès de Biomassa",
        actionOptimo: "Biomassa en estat òptim. Continueu amb la vigilància periòdica de la zona.",
        actionRecomendada: "<strong>ACCIÓ RECOMANADA:</strong> Sol·liciteu als serveis forestals la revisió i neteja preventiva d'aquesta franja, prioritzant cap i flancs segons el vent.",
        actionUrgente: "<strong>ACCIÓ URGENT:</strong> Notifiqueu a bombers/serveis forestals. Consulteu l'apartat de Propagació per a les zones prioritàries de treball.",
        logRyAplicadas: "> RY(θ) aplicades.",
        logCnotEjecutados: "> CNOT (0→2) i CNOT (2→1) executats. Variables entrellaçades.",
        logMedicionEjecutada: "> Mesura de Born executada. Col·lapse de l'estat.",
        titleModoCiudadano: "Amagar detalls tècnics",
        titleModoCiencia: "Veure detalls tècnics de la simulació",
        titleColapsar: "Clic per expandir/col·lapsar",
        errorCargaLegal: "Error en carregar el contingut de l'avís legal. Si us plau, recarregueu la pàgina.",
        trabajoUrgenciaBaja: "vigilància preventiva rutinària",
        trabajoUrgenciaMedia: "treball preventiu programat per als propers dies",
        trabajoUrgenciaAlta: "intervenció urgent, prioritat alta",
        trabajoVientoFlojo: "vent fluix: la propagació esperada seria moderada i relativament predictible",
        trabajoVientoModerado: "vent moderat-fort: el cap d'un possible incendi avançaria amb velocitat significativa",
        trabajoVientoFuerte: "vent fort: risc de comportament erràtic, focus secundaris per paveses i avanç molt ràpid al cap",
        trabajoTexto: `Amb vent procedent del {cardCola} ({windDirOrigen}°) a {windSpeed} km/h, un incendi en aquest punt avançaria cap al {cardAvance}. {intensidadViento}.\n\nPRIORITAT 1 - CAP (direcció {cardAvance}): assegurar tallafocs i retirar biomassa a la franja situada a favor del vent; és la zona de major velocitat d'avanç i de major risc per a persones i estructures.\n\nPRIORITAT 2 - FLANCS ({cardFlancoIzq} i {cardFlancoDer}): treballar aquestes franges perpendiculars per evitar que l'incendi "obri" i augmenti el seu front actiu.\n\nZONA DE MENOR PRIORITAT IMMEDIATA - CUA ({cardCola}, a sobrevent): l'avanç del foc en aquesta direcció és molt més lent; és la zona relativament més segura per a maniobres de suport i punts de control, encara que no s'ha de descuidar.\n\nNivell recomanat d'actuació: {urgencia}.`,
        pdfSubtitulo: "Informe tècnic de risc i propagació d'incendi forestal",
        pdfEstadoIncendioActivo: "INCENDI ACTIU",
        pdfEstadoRiesgoAlto: "RISC ALT (vigilància)",
        pdfEstadoRiesgoBajo: "risc baix-moderat",
        pdfSeleccionaZona: "Selecciona primer una zona al mapa per generar l'informe.",
        pdfErrorCarga: "No s'ha pogut carregar el generador de PDF. Comprova la teva connexió.",
        pdfAlerta: "ALERTA", pdfAviso: "AVÍS",
        pdfDentroPerimetro: "DINS del perímetre estimat", pdfAlejate: "Allunya't",
        pdfSiCerca: "si estàs a prop de la zona, allunya't", pdfEmergencias: "Emergències",
        pdfSinConfirmar: "sense incendi confirmat, zona sota vigilància",
        pdfFecha: "Data de l'informe", pdfLugar: "Lloc aproximat", pdfNoDisponible: "No disponible",
        pdfCoordenadas: "Coordenades", pdfTemperatura: "Temperatura", pdfHumedad: "Humitat relativa",
        pdfViento: "Vent", pdfDireccionLower: "direcció", pdfEstresBiomasa: "Estrès de biomassa (model quàntic)",
        pdfIncendiosCercanos: "Incendis actius en 25km (satèl·lit)", pdfMasCercano: "el més proper a",
        pdfNingunoDetectado: "cap detectat", pdfPerimetroIncendio: "Perímetre estimat d'incendi",
        pdfDentroPerimetroCorto: "dins del perímetre", pdfFocoDe: "focus de",
        pdfPerimetroCercano: "Perímetre estimat més proper", pdfADistancia: "a",
        pdfRecomendacionTitulo: "Recomanació de zones de treball", pdfSinRecomendacion: "Sense recomanació calculada.",
        pdfNotaRojo: "Aquest informe és un model de suport a la decisió basat en dades meteorològiques obertes (Open-Meteo), satèl·lit d'incendis (NASA FIRMS) i una simulació de circuit quàntic executada al navegador. El perímetre estimat és una aproximació geomètrica calculada a partir dels punts de calor detectats i NO és una dada oficial verificada sobre el terreny. No substitueix les ordres de comandament de bombers, Protecció Civil, AEMET ni el 112. Hi ha indicis d'incendi actiu en aquesta zona: davant de qualsevol dubte, contacta amb el 112 o amb Protecció Civil/bombers.",
        pdfNotaVerde: "Aquest informe és un model de suport a la decisió basat en dades meteorològiques obertes (Open-Meteo) i una simulació de circuit quàntic executada al navegador. El perímetre estimat, quan apareix, és una aproximació geomètrica calculada a partir dels punts de calor detectats i NO és una dada oficial verificada sobre el terreny. No substitueix les ordres de comandament de bombers, Protecció Civil, AEMET ni el 112. Davant d'un incendi actiu, contacta sempre amb el 112.",
        fwiToggle: "Índex FWI (perill d'incendi)",
        fwiToggleActivar: "Activar la capa FWI de perill d'incendi",
        fwiToggleDesactivar: "Desactivar la capa FWI de perill d'incendi",
        fwiLeyendaTitulo: "Índex FWI (EFFIS)",
        fwiLeyendaExpandir: "Mostrar la llegenda FWI",
        fwiLeyendaColapsar: "Amagar la llegenda FWI",
        fwiMuyBajo: "Molt baix",
        fwiBajo: "Baix",
        fwiModerado: "Moderat",
        fwiAlto: "Alt",
        fwiMuyAlto: "Molt alt",
        fwiExtremo: "Extrem",
        fwiCargando: "Carregant la capa FWI…",
        fwiError: "No s'ha pogut carregar la capa FWI. Reintentar",
        fwiFuente: "Font: EFFIS / Copernicus ECMWF",
        "recursos.toggleAria": "Activa la capa de recursos d'extinció",
        "recursos.panelTitulo": "Recursos d'extinció",
        "recursos.tipoHidrante": "Hidrante",
        "recursos.tipoDeposito": "Dipòsit d'aigua",
        "recursos.tipoHelisuperficie": "Helisuperfície",
        "recursos.tipoBalsa": "Bassa / embassament",
        "recursos.tipoBomberos": "Parc de bombers",
        "recursos.cargando": "Carregant recursos…",
        "recursos.errorSaturado": "Servidor de mapes saturat. Torna-ho a provar d'aquí a uns minuts.",
        "recursos.errorRed": "Sense connexió amb el servidor de recursos.",
        "recursos.zoomNecesario": "Zona massa gran: apropa el mapa per carregar recursos.",
        "recursos.contador": "{n} recursos a la zona visible",
        "recursos.sinResultados": "No hi ha recursos d'aquest tipus a la zona visible.",
        "recursos.copiar": "Copia coordenades",
        "recursos.copiado": "Copiat!",
        "recursos.tipo": "Tipus",
        "recursos.nombre": "Nom",
        "recursos.coords": "Coordenades",
        "recursos.reintentar": "Torna-ho a provar",
        "pwa.online": "En línia",
        "pwa.offline": "Sense connexió — mode camp",
        "pwa.prepararZona": "Prepara la zona per a camp",
        "pwa.preparando": "Descarregant el mapa de la zona… {hechas}/{total}",
        "pwa.zonaLista": "Zona llesta per a ús offline ({tiles} tessel·les)",
        "pwa.zonaError": "No s'ha pogut preparar la zona. Torna-ho a provar amb connexió.",
        "pwa.sinMapa": "El mapa encara no està disponible",
        "pwa.cerrarAviso": "Tancar l'avís",
        "pwa.expandir": "Mostrar el botó de preparar zona",
        "gps.miUbicacion": "La meva ubicació",
        "gps.dejarSeguir": "Deixar de seguir la meva ubicació",
        bandasTituloToggle: "Mostrar/amagar bandes de propagació estimada",
        bandasTooltip: "t+{h}h ≈ {km} km (cap de foc)",
        bandasAviso: "Estimació simplificada: vent i velocitat constants. No fer-la servir per a decisions operatives.",
        "evac.boton": "Evacuació",
        "evac.botonAria": "Activa el sistema d'evacuació per GPS. La teva posició no surt del teu dispositiu.",
        "evac.alertaRoja": "PERILL D'INCENDI PROPER ({dist}). Inicieu l'evacuació immediatament.",
        "evac.alertaAmarilla": "Zona de risc d'incendi a {dist}. Estigueu alerta i prepareu-vos per evacuar.",
        "evac.iniciar": "Inicia l'evacuació",
        "evac.detener": "Atura l'evacuació",
        "evac.haciaZonaSegura": "Zona segura a {dist}",
        "evac.rumbo": "Rumb d'escapada: {card} ({grados}°)",
        "evac.modoBrujula": "Mode brúixola: GPS feble. Seguiu l'últim rumb conegut.",
        "evac.buscandoGps": "Localitzant GPS…",
        "evac.sinGps": "GPS no disponible. Activeu la ubicació del dispositiu.",
        "evac.recalculando": "Recalculant el vector d'escapada…",
        "evac.offline": "Sense connexió: navegant amb les últimes dades desades ({hora})",
        "evac.permisoBrujula": "Toca per activar la brúixola",
        "evac.popupEscapar": "Escapar d'aquest focus",
        "evac.fueraDeZona": "Fora de la zona de perill immediat. Continueu allunyant-vos.",
        "evac.privacidad": "GPS processat només al teu dispositiu. Res no surt del mòbil.",
        "evac.datosGuardados": "Dades d'incendi desades: {hora}",
        "evac.sinDatos": "Sense dades d'incendis. Allunyeu-vos en direcció contrària al fum i truqueu al 112.",
        "evac.cerrar": "Tanca la navegació d'evacuació",
        "evac.sigueHacia": "Seguiu en direcció {card}",
        "evac.calibraBrujula": "Brúixola erràtica: calibra movent el mòbil en forma de 8",
        "evac.gpsEdad": "fa {s} s",
        "evac.errorPermiso": "Permís d'ubicació denegat. Activa'l als ajustos del navegador.",
        "evac.errorSinSenal": "Sense senyal d'ubicació. Surt a cel obert o activa la ubicació del sistema.",
        "evac.errorTimeout": "El GPS triga massa a respondre. Torna-ho a provar a cel obert.",
        "evac.vigilar": "Avisa'm si hi ha foc a prop (usa GPS)",
        "evac.vigilando": "Vigilància de proximitat activa — toca per parar",
        "me.huir": "Fugir de l'incendi",
        "me.huirAria": "Activa la guia d'escapada amb fletxes fent servir el GPS i la brúixola del mòbil. Et demanarà permís d'ubicació.",
        "me.ubicando": "Obtenint la teva ubicació…",
        "me.guiaActiva": "Guia d'escapada activa. Segueix la fletxa.",
        "evac.avisoLineaRecta": "La fletxa marca la direcció més curta, no una ruta segura garantida: no evita el foc ni el terreny. Prioritza sempre les indicacions de Protecció Civil i bombers."
    },
    eu: {
        titulo: "MANOLIT∞ FORESTAL",
        subtitulo: "BIOMASA ESTRESAREN SIMULAGAILU KUANTIKOA ETA HEDAPEN IRAGARPENA",
        modoCientifico: "Modu Zientifikoa",
        modoCiudadano: "Herritar Modua",
        estres: "BIOMASA ESTRESA",
        selecciona: "AUKERATU BASO-EREMU BAT",
        datosEntrada: "> SARRERA DATUAK",
        latlon: "LAT/LON",
        temp: "TENP. (Q0)",
        hum: "HEZETASUNA (Q1)",
        viento: "HAIZEA (Q2)",
        direccion: "HAIZEAREN NORABIDEA",
        nucleo: "> NUKLEO KUANTIKOA (3 Qubit)",
        incendios: "> SU AKTIBOAK (FIRMS)",
        cargando: "Suen geruza kargatzen...",
        avisoLegal: "Lege Oharra eta Metodologia",
        descargarPdf: "PDF txostena deskargatu",
        chatTitulo: "Manolito · Itzalketa Aholkularia",
        chatPlaceholder: "Galdetu Manolitori eremu honi buruz...",
        chatSaludo: "Manolito naiz. Eman koordenatuak, haizea edo eremu bat, eta esango dizut non jardun lehenik.",
        propagacion: "> HEDAPENA ETA LAN-EREMUAK",
        zonaSeguro: "Eremu segurua – estres normala",
        zonaAmbar: "Prebentzio alerta – estres moderatua",
        zonaRojo: "Arrisku larria – arrisku hurbila",
        calculando: "KALKULATZEN...",
        zonaAgua: "UR EREMUA",
        zonaAguaMsg: "Ezin da baso-biomasaren estresa kalkulatu ur gainean.",
        simulacionNoIniciadaAgua: "> Simulazioa ez da hasi (ur eremua).",
        popupZonaAgua: "Ur Eremua",
        errorDatosClima: "Errorea datu meteorologikoak lortzean. Egiaztatu konexioa.",
        ceroFuegosVisibles: "0 su ikusgai eremu honetan",
        fuegosActivosDetectados: "{count} su aktibo detektatu dira",
        errorFirms: "Errorea FIRMS-ekin konektatzean",
        errorFirmsDev: "ADIBIDEZKO suak erakusten (erabili 'wrangler dev' benetako datuetarako)",
        popupIncendioActivo: "Su aktiboa (VIIRS)",
        popupBrillo: "Distira",
        popupConfianza: "Konfiantza",
        popupEvaluarRiesgo: "Arrisku kuantikoa ebaluatu",
        tooltipPropagacion: "Zabalpen estimatua (uneko haizearen arabera)",
        popupEstresBiomasa: "Biomasa Estresa",
        actionOptimo: "Biomasa egoera ezin hobean. Jarraitu eremuaren aldizkako zaintzarekin.",
        actionRecomendada: "<strong>GOMENDATUTAKO EKINTZA:</strong> Eskatu baso-zerbitzuei zerrenda honen prebentzio-berrikuspena eta garbiketa, haizearen arabera burua eta hegalak lehenetsiz.",
        actionUrgente: "<strong>PREMIAZKO EKINTZA:</strong> Jakinarazi suhiltzaileei/baso-zerbitzuei. Kontsultatu Hedapen atala lehentasunezko lan-eremuetarako.",
        logRyAplicadas: "> RY(θ) aplikatuta.",
        logCnotEjecutados: "> CNOT (0→2) eta CNOT (2→1) exekutatuta. Aldagaiak korapilatuta.",
        logMedicionEjecutada: "> Born-en neurketa exekutatuta. Egoeraren kolapsoa.",
        titleModoCiudadano: "Xehetasun teknikoak ezkutatu",
        titleModoCiencia: "Simulazioaren xehetasun teknikoak ikusi",
        titleColapsar: "Egin klik zabaltzeko/tolesteko",
        errorCargaLegal: "Errorea lege-oharraren edukia kargatzean. Mesedez, birkargatu orria.",
        trabajoUrgenciaBaja: "prebentziozko zaintza erregularra",
        trabajoUrgenciaMedia: "datozen egunetan programatutako prebentzio-lana",
        trabajoUrgenciaAlta: "premiazko esku-hartzea, lehentasun handia",
        trabajoVientoFlojo: "haize ahula: espero den hedapena moderatua eta nahiko aurreikusgarria litzateke",
        trabajoVientoModerado: "haize moderatu-indartsua: sute posible baten buruak abiadura handiz egingo luke aurrera",
        trabajoVientoFuerte: "haize indartsua: portaera irregularra izateko arriskua, txinpartengatiko bigarren mailako fokuak eta aurrerapen oso azkarra buruan",
        trabajoTexto: `{cardCola}-tik datorren haizearekin ({windDirOrigen}°) {windSpeed} km/h-ko abiaduran, puntu honetako sute batek {cardAvance}-rantz egingo luke aurrera. {intensidadViento}.\n\nLEHENTASUNA 1 - BURUA ({cardAvance} norabidea): suebakiak ziurtatu eta biomasa kendu haizearen aldeko zerrendan; abiadura handieneko eta pertsona eta egiturarentzako arrisku handieneko eremua da.\n\nLEHENTASUNA 2 - HEGALAK ({cardFlancoIzq} eta {cardFlancoDer}): zerrenda perpendikular hauek landu, suteak "ireki" eta bere fronte aktiboa handitzea saihesteko.\n\nBEREHALAKO LEHENTASUN TXIKIAGOKO EREMUA - BUZTANA ({cardCola}, haizearen kontra): suaren aurrerapena norabide honetan askoz motelagoa da; laguntza-maniobrak eta kontrol-puntuak egiteko eremu nahiko seguruena da, baina ez da alde batera utzi behar.\n\nJarduera-maila gomendatua: {urgencia}.`,
        pdfSubtitulo: "Baso-suteen arrisku eta hedapenaren txosten teknikoa",
        pdfEstadoIncendioActivo: "SU AKTIBOA",
        pdfEstadoRiesgoAlto: "ARRISKU HANDIA (zaintza)",
        pdfEstadoRiesgoBajo: "arrisku baxu-ertaina",
        pdfSeleccionaZona: "Aukeratu lehenik eremu bat maparen txostena sortzeko.",
        pdfErrorCarga: "Ezin izan da PDF sortzailea kargatu. Egiaztatu konexioa.",
        pdfAlerta: "ALERTA", pdfAviso: "OHARRA",
        pdfDentroPerimetro: "estimatutako perimetroaren BARNEAN", pdfAlejate: "Urrundu",
        pdfSiCerca: "eremutik gertu bazaude, urrundu", pdfEmergencias: "Larrialdiak",
        pdfSinConfirmar: "sua baieztatu gabe, eremua zaintzapean",
        pdfFecha: "Txostenaren data", pdfLugar: "Gutxi gorabeherako lekua", pdfNoDisponible: "Ez dago eskuragarri",
        pdfCoordenadas: "Koordenatuak", pdfTemperatura: "Tenperatura", pdfHumedad: "Hezetasun erlatiboa",
        pdfViento: "Haizea", pdfDireccionLower: "norabidea", pdfEstresBiomasa: "Biomasa estresa (eredu kuantikoa)",
        pdfIncendiosCercanos: "Su aktiboak 25km-tan (satelitea)", pdfMasCercano: "hurbilena",
        pdfNingunoDetectado: "bat ere ez detektatu", pdfPerimetroIncendio: "Suaren perimetro estimatua",
        pdfDentroPerimetroCorto: "perimetroaren barnean", pdfFocoDe: "fokua",
        pdfPerimetroCercano: "Perimetro estimatu hurbilena", pdfADistancia: "hemen:",
        pdfRecomendacionTitulo: "Lan-eremuen gomendioa", pdfSinRecomendacion: "Ez dago gomendio kalkulaturik.",
        pdfNotaRojo: "Txosten hau erabaki-laguntzako eredu bat da, datu meteorologiko irekietan (Open-Meteo), su-sateliteetan (NASA FIRMS) eta nabigatzailean exekutatutako zirkuitu kuantikoaren simulazio batean oinarrituta. Perimetro estimatua hurbilketa geometriko bat da, detektatutako beroguneetatik kalkulatua, eta EZ da lurrean egiaztatutako datu ofiziala. Ez du ordezkatzen suhiltzaileen, Babes Zibilaren, AEMETen edo 112ren agindua. Sute aktiboaren zantzuak daude eremu honetan: edozein zalantza izanez gero, jarri harremanetan 112rekin edo Babes Zibilarekin/suhiltzaileekin.",
        pdfNotaVerde: "Txosten hau erabaki-laguntzako eredu bat da, datu meteorologiko irekietan (Open-Meteo) eta nabigatzailean exekutatutako zirkuitu kuantikoaren simulazio batean oinarrituta. Agertzen denean, perimetro estimatua hurbilketa geometriko bat da, detektatutako beroguneetatik kalkulatua, eta EZ da lurrean egiaztatutako datu ofiziala. Ez du ordezkatzen suhiltzaileen, Babes Zibilaren, AEMETen edo 112ren agindua. Su aktiboaren aurrean, jarri beti harremanetan 112rekin.",
        fwiToggle: "FWI indizea (sute arriskua)",
        fwiToggleActivar: "Aktibatu sute arriskuaren FWI geruza",
        fwiToggleDesactivar: "Desaktibatu sute arriskuaren FWI geruza",
        fwiLeyendaTitulo: "FWI indizea (EFFIS)",
        fwiLeyendaExpandir: "Erakutsi FWI legenda",
        fwiLeyendaColapsar: "Ezkutatu FWI legenda",
        fwiMuyBajo: "Oso baxua",
        fwiBajo: "Baxua",
        fwiModerado: "Moderatua",
        fwiAlto: "Altua",
        fwiMuyAlto: "Oso altua",
        fwiExtremo: "Muturrekoa",
        fwiCargando: "FWI geruza kargatzen…",
        fwiError: "Ezin izan da FWI geruza kargatu. Saiatu berriro",
        fwiFuente: "Iturria: EFFIS / Copernicus ECMWF",
        "recursos.toggleAria": "Aktibatu sutea itzaltzeko baliabideen geruza",
        "recursos.panelTitulo": "Itzaltzeko baliabideak",
        "recursos.tipoHidrante": "Hidrante",
        "recursos.tipoDeposito": "Ur-depositua",
        "recursos.tipoHelisuperficie": "Helisuperficie",
        "recursos.tipoBalsa": "Urmaela / urtegia",
        "recursos.tipoBomberos": "Suhiltzaile-parkea",
        "recursos.cargando": "Baliabideak kargatzen…",
        "recursos.errorSaturado": "Mapa-zerbitzaria gainezka dago. Saiatu berriro minutu batzuetan.",
        "recursos.errorRed": "Ez dago konexiorik baliabide-zerbitzariarekin.",
        "recursos.zoomNecesario": "Eremua handiegia da: hurbildu mapa baliabideak kargatzeko.",
        "recursos.contador": "{n} baliabide ikusgai dagoen eremuan",
        "recursos.sinResultados": "Ez dago mota horretako baliabiderik ikusgai dagoen eremuan.",
        "recursos.copiar": "Kopiatu koordenatuak",
        "recursos.copiado": "Kopiatuta!",
        "recursos.tipo": "Mota",
        "recursos.nombre": "Izena",
        "recursos.coords": "Koordenatuak",
        "recursos.reintentar": "Saiatu berriro",
        "pwa.online": "Linean",
        "pwa.offline": "Konexiorik gabe — kanpo modua",
        "pwa.prepararZona": "Prestatu eremua kanporako",
        "pwa.preparando": "Eremuaren mapa deskargatzen… {hechas}/{total}",
        "pwa.zonaLista": "Eremua offline erabiltzeko prest ({tiles} lauza)",
        "pwa.zonaError": "Ezin izan da eremua prestatu. Saiatu berriz konexioarekin.",
        "pwa.sinMapa": "Mapa oraindik ez dago erabilgarri",
        "pwa.cerrarAviso": "Itxi abisua",
        "pwa.expandir": "Erakutsi eremua prestatzeko botoia",
        "gps.miUbicacion": "Nire kokapena",
        "gps.dejarSeguir": "Utzi nire kokapena jarraitzen",
        bandasTituloToggle: "Erakutsi/ezkutatu hedapen-estimazioko bandak",
        bandasTooltip: "t+{h}h ≈ {km} km (suaren burua)",
        bandasAviso: "Estimazio sinplifikatua: haizea eta abiadura konstanteak. Ez erabili erabaki operatiboetarako.",
        "evac.boton": "Ebakuazioa",
        "evac.botonAria": "Gaitu GPS bidezko ebakuazio-sistema. Zure kokapena ez da zure gailutik ateratzen.",
        "evac.alertaRoja": "SU HURBILAREN ARRISKUA ({dist}). Hasi ebakuazioa berehala.",
        "evac.alertaAmarilla": "Su-arriskuko zona {dist}(-e)ra. Egon zaitez erne eta prestatu ebakuaziorako.",
        "evac.iniciar": "Hasi ebakuazioa",
        "evac.detener": "Gelditu ebakuazioa",
        "evac.haciaZonaSegura": "Gune seguru {dist}(-e)ra",
        "evac.rumbo": "Ihes-norabidea: {card} ({grados}°)",
        "evac.modoBrujula": "Iparrorratz modua: GPS ahula. Jarraitu ezagutzen den azken norabidea.",
        "evac.buscandoGps": "GPSa lokalizatzen…",
        "evac.sinGps": "GPSa ez dago erabilgarri. Gaitu gailuaren kokapena.",
        "evac.recalculando": "Ihes-bektorea berriz kalkulatzen…",
        "evac.offline": "Konexiorik gabe: gordetako azken datuekin nabigatzen ({hora})",
        "evac.permisoBrujula": "Ukitu iparrorratza aktibatzeko",
        "evac.popupEscapar": "Ihes egin foku honetatik",
        "evac.fueraDeZona": "Berehalako arrisku-gunetik kanpo. Jarraitu urruntzen.",
        "evac.privacidad": "GPSa zure gailuan bakarrik prozesatzen da. Ezer ez da mugikorretik ateratzen.",
        "evac.datosGuardados": "Suaren datuak gordeta: {hora}",
        "evac.sinDatos": "Su-daturik ez. Joan kearen kontrako noranzkoan eta deitu 112ra.",
        "evac.cerrar": "Itxi ebakuazio-nabigazioa",
        "evac.sigueHacia": "Jarraitu {card} norabidean",
        "evac.calibraBrujula": "Iparrorratz irregularra: kalibratu mugikorra 8 forman mugituz",
        "evac.gpsEdad": "duela {s} s",
        "evac.errorPermiso": "Kokapen-baimena ukatuta. Gaitzu nabigatzailearen ezarpenetan.",
        "evac.errorSinSenal": "Kokapen-seinalerik ez. Atera zeru irekira edo gaitzu sistemaren kokapena.",
        "evac.errorTimeout": "GPSak gehiegi berandutzen du. Saiatu berriro zeru irekian.",
        "evac.vigilar": "Abisatu sua gertu badago (GPSa erabiltzen du)",
        "evac.vigilando": "Hurbiltasun-zaintza aktibo — ukitu gelditzeko",
        "me.huir": "Ihes egin sutik",
        "me.huirAria": "Gaitu ihes-gidaia geziekin, zure mugikorraren GPSa eta iparrorratza erabiliz. Kokapen-baimena eskatuko dizu.",
        "me.ubicando": "Zure kokapena lortzen…",
        "me.guiaActiva": "Ihes-gidaia aktibo. Jarraitu gezia.",
        "evac.avisoLineaRecta": "Geziak norabide laburrena markatzen du, ez bide seguru bermatua: ez du sua ez lursaila saihesten. Beti lehenetsi Babes Zibilaren eta suhiltzaileen jarraibideak."
    },
    gl: {
        titulo: "MANOLIT∞ FORESTAL",
        subtitulo: "SIMULADOR CUÁNTICO DE ESTRÉS DE BIOMASA E PREDICIÓN DE PROPAGACIÓN",
        modoCientifico: "Modo Científico",
        modoCiudadano: "Modo Cidadán",
        estres: "ESTRÉS DE BIOMASA",
        selecciona: "SELECCIONA UNHA ZONA FORESTAL",
        datosEntrada: "> DATOS DE ENTRADA",
        latlon: "LAT/LON",
        temp: "TEMP (Q0)",
        hum: "HUMIDADE (Q1)",
        viento: "VENTO (Q2)",
        direccion: "DIRECCIÓN DO VENTO",
        nucleo: "> NÚCLEO CUÁNTICO (3 Qubits)",
        incendios: "> LUMES ACTIVOS (FIRMS)",
        cargando: "Cargando capa de lumes...",
        avisoLegal: "Aviso Legal e Metodoloxía",
        descargarPdf: "Descargar informe PDF",
        chatTitulo: "Manolito · Asesor de Extinción",
        chatPlaceholder: "Pregúntalle a Manolito sobre esta zona...",
        chatSaludo: "Son Manolito. Dime coordenadas, vento ou unha zona e direiche onde actuar primeiro.",
        propagacion: "> PROPAGACIÓN E ZONAS DE TRABALLO",
        zonaSeguro: "Zona segura – estrés normal",
        zonaAmbar: "Alerta preventiva – estrés moderado",
        zonaRojo: "Polvorín crítico – risco inminente",
        calculando: "CALCULANDO...",
        zonaAgua: "ZONA DE AUGA",
        zonaAguaMsg: "Non é posible calcular o estrés da biomasa forestal sobre a auga.",
        simulacionNoIniciadaAgua: "> Simulación non iniciada (zona de auga).",
        popupZonaAgua: "Zona de Auga",
        errorDatosClima: "Erro ao obter datos meteorolóxicos. Verifique a conexión.",
        ceroFuegosVisibles: "0 lumes visibles nesta zona",
        fuegosActivosDetectados: "{count} lumes activos detectados",
        errorFirms: "Erro ao conectar con FIRMS",
        errorFirmsDev: "Amosando lumes de EXEMPLO (usa 'wrangler dev' para datos reais)",
        popupIncendioActivo: "Lume activo (VIIRS)",
        popupBrillo: "Brillo",
        popupConfianza: "Confianza",
        popupEvaluarRiesgo: "Avaliar risco cuántico",
        tooltipPropagacion: "Zona estimada de propagación (segundo o vento actual)",
        popupEstresBiomasa: "Estrés de Biomasa",
        actionOptimo: "Biomasa en estado óptimo. Continúe coa vixilancia periódica da zona.",
        actionRecomendada: "<strong>ACCIÓN RECOMENDADA:</strong> Solicite aos servizos forestais a revisión e limpeza preventiva desta franxa, priorizando cabeza e flancos segundo o vento.",
        actionUrgente: "<strong>ACCIÓN URXENTE:</strong> Notifique a bombeiros/servizos forestais. Consulte o apartado de Propagación para as zonas prioritarias de traballo.",
        logRyAplicadas: "> RY(θ) aplicadas.",
        logCnotEjecutados: "> CNOT (0→2) e CNOT (2→1) executados. Variables entrelazadas.",
        logMedicionEjecutada: "> Medición de Born executada. Colapso do estado.",
        titleModoCiudadano: "Ocultar detalles técnicos",
        titleModoCiencia: "Ver detalles técnicos da simulación",
        titleColapsar: "Clic para expandir/colapsar",
        errorCargaLegal: "Erro ao cargar o contido do aviso legal. Por favor, recargue a páxina.",
        trabajoUrgenciaBaja: "vixilancia preventiva rutineira",
        trabajoUrgenciaMedia: "traballo preventivo programado para os vindeiros días",
        trabajoUrgenciaAlta: "intervención urxente, prioridade alta",
        trabajoVientoFlojo: "vento frouxo: a propagación agardada sería moderada e relativamente predicible",
        trabajoVientoModerado: "vento moderado-forte: a cabeza dun posible incendio avanzaría con velocidade significativa",
        trabajoVientoFuerte: "vento forte: risco de comportamento errático, focos secundarios por faíscas e avance moi rápido na cabeza",
        trabajoTexto: `Con vento procedente do {cardCola} ({windDirOrigen}°) a {windSpeed} km/h, un incendio neste punto avanzaría cara ao {cardAvance}. {intensidadViento}.\n\nPRIORIDADE 1 - CABEZA (dirección {cardAvance}): asegurar cortalumes e retirar biomasa na franxa situada a favor do vento; é a zona de maior velocidade de avance e de maior risco para persoas e estruturas.\n\nPRIORIDADE 2 - FLANCOS ({cardFlancoIzq} e {cardFlancoDer}): traballar estas franxas perpendiculares para evitar que o incendio "abra" e aumente a súa fronte activa.\n\nZONA DE MENOR PRIORIDADE INMEDIATA - COLA ({cardCola}, a barlovento): o avance do lume nesta dirección é moito máis lento; é a zona relativamente máis segura para manobras de apoio e puntos de control, aínda que non debe descoidarse.\n\nNivel recomendado de actuación: {urgencia}.`,
        pdfSubtitulo: "Informe técnico de risco e propagación de incendio forestal",
        pdfEstadoIncendioActivo: "LUME ACTIVO",
        pdfEstadoRiesgoAlto: "RISCO ALTO (vixilancia)",
        pdfEstadoRiesgoBajo: "risco baixo-moderado",
        pdfSeleccionaZona: "Selecciona primeiro unha zona no mapa para xerar o informe.",
        pdfErrorCarga: "Non se puido cargar o xerador de PDF. Verifica a túa conexión.",
        pdfAlerta: "ALERTA", pdfAviso: "AVISO",
        pdfDentroPerimetro: "DENTRO do perímetro estimado", pdfAlejate: "Afástate",
        pdfSiCerca: "se estás preto da zona, afástate", pdfEmergencias: "Emerxencias",
        pdfSinConfirmar: "sen incendio confirmado, zona baixo vixilancia",
        pdfFecha: "Data do informe", pdfLugar: "Lugar aproximado", pdfNoDisponible: "Non dispoñible",
        pdfCoordenadas: "Coordenadas", pdfTemperatura: "Temperatura", pdfHumedad: "Humidade relativa",
        pdfViento: "Vento", pdfDireccionLower: "dirección", pdfEstresBiomasa: "Estrés de biomasa (modelo cuántico)",
        pdfIncendiosCercanos: "Lumes activos en 25km (satélite)", pdfMasCercano: "o máis próximo a",
        pdfNingunoDetectado: "ningún detectado", pdfPerimetroIncendio: "Perímetro estimado de incendio",
        pdfDentroPerimetroCorto: "dentro do perímetro", pdfFocoDe: "foco de",
        pdfPerimetroCercano: "Perímetro estimado máis próximo", pdfADistancia: "a",
        pdfRecomendacionTitulo: "Recomendación de zonas de traballo", pdfSinRecomendacion: "Sen recomendación calculada.",
        pdfNotaRojo: "Este informe é un modelo de apoio á decisión baseado en datos meteorolóxicos abertos (Open-Meteo), satélite de incendios (NASA FIRMS) e unha simulación de circuíto cuántico executada no navegador. O perímetro estimado é unha aproximación xeométrica calculada a partir dos puntos de calor detectados e NON é un dato oficial verificado sobre o terreo. Non substitúe as ordes de mando de bombeiros, Protección Civil, AEMET nin ao 112. Hai indicios de incendio activo nesta zona: ante calquera dúbida, contacta co 112 ou con Protección Civil/bombeiros.",
        pdfNotaVerde: "Este informe é un modelo de apoio á decisión baseado en datos meteorolóxicos abertos (Open-Meteo) e unha simulación de circuíto cuántico executada no navegador. O perímetro estimado, cando aparece, é unha aproximación xeométrica calculada a partir dos puntos de calor detectados e NON é un dato oficial verificado sobre o terreo. Non substitúe as ordes de mando de bombeiros, Protección Civil, AEMET nin ao 112. Ante un incendio activo, contacta sempre co 112.",
        fwiToggle: "Índice FWI (perigo de incendio)",
        fwiToggleActivar: "Activar a capa FWI de perigo de incendio",
        fwiToggleDesactivar: "Desactivar a capa FWI de perigo de incendio",
        fwiLeyendaTitulo: "Índice FWI (EFFIS)",
        fwiLeyendaExpandir: "Mostrar a lenda FWI",
        fwiLeyendaColapsar: "Agochar a lenda FWI",
        fwiMuyBajo: "Moi baixo",
        fwiBajo: "Baixo",
        fwiModerado: "Moderado",
        fwiAlto: "Alto",
        fwiMuyAlto: "Moi alto",
        fwiExtremo: "Extremo",
        fwiCargando: "Cargando a capa FWI…",
        fwiError: "Non se puido cargar a capa FWI. Reintentar",
        fwiFuente: "Fonte: EFFIS / Copernicus ECMWF",
        "recursos.toggleAria": "Activar a capa de recursos de extinción",
        "recursos.panelTitulo": "Recursos de extinción",
        "recursos.tipoHidrante": "Hidrante",
        "recursos.tipoDeposito": "Depósito de auga",
        "recursos.tipoHelisuperficie": "Helisuperficie",
        "recursos.tipoBalsa": "Balsa / encoro",
        "recursos.tipoBomberos": "Parque de bombeiros",
        "recursos.cargando": "Cargando recursos…",
        "recursos.errorSaturado": "Servidor de mapas saturado. Téntao de novo nuns minutos.",
        "recursos.errorRed": "Sen conexión co servidor de recursos.",
        "recursos.zoomNecesario": "Zona grande de máis: achega o mapa para cargar recursos.",
        "recursos.contador": "{n} recursos na zona visible",
        "recursos.sinResultados": "Non hai recursos deste tipo na zona visible.",
        "recursos.copiar": "Copiar coordenadas",
        "recursos.copiado": "Copiado!",
        "recursos.tipo": "Tipo",
        "recursos.nombre": "Nome",
        "recursos.coords": "Coordenadas",
        "recursos.reintentar": "Reintentar",
        "pwa.online": "En liña",
        "pwa.offline": "Sen conexión — modo campo",
        "pwa.prepararZona": "Preparar zona para campo",
        "pwa.preparando": "Descargando o mapa da zona… {hechas}/{total}",
        "pwa.zonaLista": "Zona lista para uso offline ({tiles} teselas)",
        "pwa.zonaError": "Non se puido preparar a zona. Téntao de novo con conexión.",
        "pwa.sinMapa": "O mapa aínda non está dispoñible",
        "pwa.cerrarAviso": "Pechar o aviso",
        "pwa.expandir": "Amosar o botón de preparar zona",
        "gps.miUbicacion": "A miña localización",
        "gps.dejarSeguir": "Deixar de seguir a miña localización",
        bandasTituloToggle: "Amosar/agochar bandas de propagación estimada",
        bandasTooltip: "t+{h}h ≈ {km} km (cabeza de lume)",
        bandasAviso: "Estimación simplificada: vento e velocidade constantes. Non usar para decisións operativas.",
        "evac.boton": "Evacuación",
        "evac.botonAria": "Activar o sistema de evacuación por GPS. A túa posición non sae do teu dispositivo.",
        "evac.alertaRoja": "PERIGO DE INCENDIO PRÓXIMO ({dist}). Inicie a evacuación de inmediato.",
        "evac.alertaAmarilla": "Zona de risco de incendio a {dist}. Manteñasete alerta e prepárese para evacuar.",
        "evac.iniciar": "Iniciar evacuación",
        "evac.detener": "Deter evacuación",
        "evac.haciaZonaSegura": "Zona segura a {dist}",
        "evac.rumbo": "Rumbo de fuxida: {card} ({grados}°)",
        "evac.modoBrujula": "Modo compás: GPS débil. Siga o último rumbo coñecido.",
        "evac.buscandoGps": "Localizando GPS…",
        "evac.sinGps": "GPS non dispoñible. Active a localización do dispositivo.",
        "evac.recalculando": "Recalculando o vector de fuxida…",
        "evac.offline": "Sen conexión: navegando cos últimos datos gardados ({hora})",
        "evac.permisoBrujula": "Toca para activar o compás",
        "evac.popupEscapar": "Fuxir deste foco",
        "evac.fueraDeZona": "Fóra da zona de perigo inmediato. Siga afastándose.",
        "evac.privacidad": "GPS procesado só no teu dispositivo. Nada sae do móbil.",
        "evac.datosGuardados": "Datos do incendio gardados: {hora}",
        "evac.sinDatos": "Sen datos de incendios. Móvase en dirección contraria ao fume e chame ao 112.",
        "evac.cerrar": "Pechar a navegación de evacuación",
        "evac.sigueHacia": "Siga en dirección {card}",
        "evac.calibraBrujula": "Compás errático: calibra movendo o móbil en forma de 8",
        "evac.gpsEdad": "hai {s} s",
        "evac.errorPermiso": "Permiso de localización denegado. Actívao nos axustes do navegador.",
        "evac.errorSinSenal": "Sen sinal de localización. Saín a ceo aberto ou activa a localización do sistema.",
        "evac.errorTimeout": "O GPS tarda de máis en responder. Téntao de novo a ceo aberto.",
        "evac.vigilar": "Avisarme se hai lume preto (usa GPS)",
        "evac.vigilando": "Vixilancia de proximidade activa — toca para parar",
        "me.huir": "Fuxir do incendio",
        "me.huirAria": "Activa a guía de fuxida con frechas usando o GPS e o compás do teu móbil. Pedirache permiso de localización.",
        "me.ubicando": "Obtendo a túa localización…",
        "me.guiaActiva": "Guía de fuxida activa. Segue a frecha.",
        "evac.avisoLineaRecta": "A frecha marca a dirección máis curta, non unha ruta segura garantida: non evita o lume nin o terreo. Prioriza sempre as indicacións de Protección Civil e bombeiros."
    },
    en: {
        titulo: "MANOLIT∞ FOREST",
        subtitulo: "QUANTUM BIOMASS STRESS SIMULATOR AND FIRE SPREAD PREDICTION",
        modoCientifico: "Scientific Mode",
        modoCiudadano: "Citizen Mode",
        estres: "BIOMASS STRESS",
        selecciona: "SELECT A FOREST AREA",
        datosEntrada: "> INPUT DATA",
        latlon: "LAT/LON",
        temp: "TEMP (Q0)",
        hum: "HUMIDITY (Q1)",
        viento: "WIND (Q2)",
        direccion: "WIND DIRECTION",
        nucleo: "> QUANTUM CORE (3 Qubits)",
        incendios: "> ACTIVE FIRES (FIRMS)",
        cargando: "Loading fire layer...",
        avisoLegal: "Legal Notice and Methodology",
        descargarPdf: "Download PDF report",
        chatTitulo: "Manolito · Suppression Advisor",
        chatPlaceholder: "Ask Manolito about this area...",
        chatSaludo: "I'm Manolito. Give me coordinates, wind data or an area and I'll tell you where to act first.",
        propagacion: "> SPREAD AND WORK ZONES",
        zonaSeguro: "Safe zone – normal stress",
        zonaAmbar: "Preventive alert – moderate stress",
        zonaRojo: "Critical tinderbox – imminent risk",
        calculando: "CALCULATING...",
        zonaAgua: "WATER AREA",
        zonaAguaMsg: "Cannot calculate forest biomass stress over water.",
        simulacionNoIniciadaAgua: "> Simulation not started (water area).",
        popupZonaAgua: "Water Area",
        errorDatosClima: "Error fetching weather data. Please check your connection.",
        ceroFuegosVisibles: "0 visible fires in this area",
        fuegosActivosDetectados: "{count} active fires detected",
        errorFirms: "Error connecting to FIRMS",
        errorFirmsDev: "Showing EXAMPLE fires (use 'wrangler dev' for real data)",
        popupIncendioActivo: "Active fire (VIIRS)",
        popupBrillo: "Brightness",
        popupConfianza: "Confidence",
        popupEvaluarRiesgo: "Evaluate quantum risk",
        tooltipPropagacion: "Estimated spread zone (based on current wind)",
        popupEstresBiomasa: "Biomass Stress",
        actionOptimo: "Biomass in optimal condition. Continue periodic monitoring of the area.",
        actionRecomendada: "<strong>RECOMMENDED ACTION:</strong> Request preventive review and clearing of this strip from forestry services, prioritizing head and flanks according to wind.",
        actionUrgente: "<strong>URGENT ACTION:</strong> Notify fire department/forestry services. Consult the Spread section for priority work zones.",
        logRyAplicadas: "> RY(θ) applied.",
        logCnotEjecutados: "> CNOT (0→2) & CNOT (2→1) executed. Variables entangled.",
        logMedicionEjecutada: "> Born measurement executed. State collapsed.",
        titleModoCiudadano: "Hide technical details",
        titleModoCiencia: "View technical simulation details",
        titleColapsar: "Click to expand/collapse",
        errorCargaLegal: "Error loading legal notice content. Please reload the page.",
        trabajoUrgenciaBaja: "routine preventive surveillance",
        trabajoUrgenciaMedia: "preventive work scheduled in the coming days",
        trabajoUrgenciaAlta: "urgent intervention, high priority",
        trabajoVientoFlojo: "light wind: expected spread would be moderate and relatively predictable",
        trabajoVientoModerado: "moderate-strong wind: the head of a possible fire would advance with significant speed",
        trabajoVientoFuerte: "strong wind: risk of erratic behavior, spot fires from embers, and very rapid head advance",
        trabajoTexto: `With wind from {cardCola} ({windDirOrigen}°) at {windSpeed} km/h, a fire at this point would advance towards {cardAvance}. {intensidadViento}.\n\nPRIORITY 1 - HEAD (direction {cardAvance}): secure firebreaks and clear biomass in the downwind strip; this is the area of fastest advance and greatest risk to people and structures.\n\nPRIORITY 2 - FLANKS ({cardFlancoIzq} and {cardFlancoDer}): work these perpendicular strips to prevent the fire from "opening up" and increasing its active front.\n\nLOWER IMMEDIATE PRIORITY ZONE - TAIL ({cardCola}, upwind): fire spread in this direction is much slower; it is the relatively safer area for support maneuvers and control points, although it should not be neglected.\n\nRecommended level of action: {urgencia}.`,
        pdfSubtitulo: "Technical report on forest fire risk and spread",
        pdfEstadoIncendioActivo: "ACTIVE FIRE",
        pdfEstadoRiesgoAlto: "HIGH RISK (surveillance)",
        pdfEstadoRiesgoBajo: "low-moderate risk",
        pdfSeleccionaZona: "Select an area on the map first to generate the report.",
        pdfErrorCarga: "Could not load the PDF generator. Check your connection.",
        pdfAlerta: "ALERT", pdfAviso: "NOTICE",
        pdfDentroPerimetro: "INSIDE the estimated perimeter", pdfAlejate: "Move away",
        pdfSiCerca: "if you are near the area, move away", pdfEmergencias: "Emergencies",
        pdfSinConfirmar: "no confirmed fire, area under surveillance",
        pdfFecha: "Report date", pdfLugar: "Approximate location", pdfNoDisponible: "Not available",
        pdfCoordenadas: "Coordinates", pdfTemperatura: "Temperature", pdfHumedad: "Relative humidity",
        pdfViento: "Wind", pdfDireccionLower: "direction", pdfEstresBiomasa: "Biomass stress (quantum model)",
        pdfIncendiosCercanos: "Active fires within 25km (satellite)", pdfMasCercano: "closest at",
        pdfNingunoDetectado: "none detected", pdfPerimetroIncendio: "Estimated fire perimeter",
        pdfDentroPerimetroCorto: "inside the perimeter", pdfFocoDe: "focus of",
        pdfPerimetroCercano: "Closest estimated perimeter", pdfADistancia: "at",
        pdfRecomendacionTitulo: "Recommended work zones", pdfSinRecomendacion: "No recommendation calculated.",
        pdfNotaRojo: "This report is a decision-support model based on open weather data (Open-Meteo), fire satellite data (NASA FIRMS), and a quantum circuit simulation run in the browser. The estimated perimeter is a geometric approximation calculated from detected heat points and is NOT officially verified ground data. It does not replace the orders of firefighters, Civil Protection, AEMET or 112. There are signs of active fire in this area: if in doubt, contact 112 or Civil Protection/firefighters.",
        pdfNotaVerde: "This report is a decision-support model based on open weather data (Open-Meteo) and a quantum circuit simulation run in the browser. The estimated perimeter, when shown, is a geometric approximation calculated from detected heat points and is NOT officially verified ground data. It does not replace the orders of firefighters, Civil Protection, AEMET or 112. In case of an active fire, always contact 112.",
        fwiToggle: "FWI index (fire danger)",
        fwiToggleActivar: "Enable FWI fire danger layer",
        fwiToggleDesactivar: "Disable FWI fire danger layer",
        fwiLeyendaTitulo: "FWI index (EFFIS)",
        fwiLeyendaExpandir: "Show FWI legend",
        fwiLeyendaColapsar: "Hide FWI legend",
        fwiMuyBajo: "Very low",
        fwiBajo: "Low",
        fwiModerado: "Moderate",
        fwiAlto: "High",
        fwiMuyAlto: "Very high",
        fwiExtremo: "Extreme",
        fwiCargando: "Loading FWI layer…",
        fwiError: "Could not load the FWI layer. Retry",
        fwiFuente: "Source: EFFIS / Copernicus ECMWF",
        "recursos.toggleAria": "Toggle firefighting resources layer",
        "recursos.panelTitulo": "Firefighting resources",
        "recursos.tipoHidrante": "Fire hydrant",
        "recursos.tipoDeposito": "Water tank",
        "recursos.tipoHelisuperficie": "Helipad",
        "recursos.tipoBalsa": "Pond / reservoir",
        "recursos.tipoBomberos": "Fire station",
        "recursos.cargando": "Loading resources…",
        "recursos.errorSaturado": "Map server is overloaded. Please try again in a few minutes.",
        "recursos.errorRed": "No connection to the resources server.",
        "recursos.zoomNecesario": "Area too large: zoom in to load resources.",
        "recursos.contador": "{n} resources in the visible area",
        "recursos.sinResultados": "No resources of this type in the visible area.",
        "recursos.copiar": "Copy coords",
        "recursos.copiado": "Copied!",
        "recursos.tipo": "Type",
        "recursos.nombre": "Name",
        "recursos.coords": "Coordinates",
        "recursos.reintentar": "Retry",
        "pwa.online": "Online",
        "pwa.offline": "Offline — field mode",
        "pwa.prepararZona": "Prepare area for field work",
        "pwa.preparando": "Downloading area map… {hechas}/{total}",
        "pwa.zonaLista": "Area ready for offline use ({tiles} tiles)",
        "pwa.zonaError": "Could not prepare the area. Retry with a connection.",
        "pwa.sinMapa": "Map not available yet",
        "pwa.cerrarAviso": "Dismiss notice",
        "pwa.expandir": "Show the prepare-area button",
        "gps.miUbicacion": "My location",
        "gps.dejarSeguir": "Stop following my location",
        bandasTituloToggle: "Show/hide estimated fire spread bands",
        bandasTooltip: "t+{h}h ≈ {km} km (fire head)",
        bandasAviso: "Simplified estimate: constant wind and spread rate. Do not use for operational decisions.",
        "evac.boton": "Evacuation",
        "evac.botonAria": "Activate the GPS evacuation system. Your position never leaves your device.",
        "evac.alertaRoja": "NEARBY FIRE DANGER ({dist}). Start evacuating immediately.",
        "evac.alertaAmarilla": "Fire risk zone {dist} away. Stay alert and prepare to evacuate.",
        "evac.iniciar": "Start evacuation",
        "evac.detener": "Stop evacuation",
        "evac.haciaZonaSegura": "Safe area {dist} away",
        "evac.rumbo": "Escape bearing: {card} ({grados}°)",
        "evac.modoBrujula": "Compass mode: weak GPS. Follow the last known bearing.",
        "evac.buscandoGps": "Locating GPS…",
        "evac.sinGps": "GPS unavailable. Enable device location.",
        "evac.recalculando": "Recalculating escape vector…",
        "evac.offline": "Offline: navigating with last saved data ({hora})",
        "evac.permisoBrujula": "Tap to enable the compass",
        "evac.popupEscapar": "Escape this fire",
        "evac.fueraDeZona": "Out of the immediate danger zone. Keep moving away.",
        "evac.privacidad": "GPS processed only on your device. Nothing leaves your phone.",
        "evac.datosGuardados": "Fire data saved: {hora}",
        "evac.sinDatos": "No fire data. Move away from the smoke and call 112.",
        "evac.cerrar": "Close evacuation navigation",
        "evac.sigueHacia": "Keep heading {card}",
        "evac.calibraBrujula": "Erratic compass: calibrate by moving the phone in a figure-8",
        "evac.gpsEdad": "{s} s ago",
        "evac.errorPermiso": "Location permission denied. Enable it in your browser settings.",
        "evac.errorSinSenal": "No location signal. Move to open sky or enable system location.",
        "evac.errorTimeout": "GPS is taking too long. Try again with a clear view of the sky.",
        "evac.vigilar": "Warn me if fire is nearby (uses GPS)",
        "evac.vigilando": "Proximity watch active — tap to stop",
        "me.huir": "Escape the fire",
        "me.huirAria": "Activates arrow escape guidance using your phone's GPS and compass. It will ask for location permission.",
        "me.ubicando": "Getting your location…",
        "me.guiaActiva": "Escape guidance active. Follow the arrow.",
        "evac.avisoLineaRecta": "The arrow points the shortest direction, not a guaranteed safe route: it does not avoid the fire or the terrain. Always prioritize instructions from Civil Protection and firefighters."
    },
    fr: {
        titulo: "MANOLIT∞ FORESTAL",
        subtitulo: "SIMULATEUR QUANTIQUE DE STRESS DE BIOMASSE ET PRÉVISION DE PROPAGATION",
        modoCientifico: "Mode Scientifique",
        modoCiudadano: "Mode Citoyen",
        estres: "STRESS DE BIOMASSE",
        selecciona: "SÉLECTIONNEZ UNE ZONE FORESTIÈRE",
        datosEntrada: "> DONNÉES D'ENTRÉE",
        latlon: "LAT/LON",
        temp: "TEMP (Q0)",
        hum: "HUMIDITÉ (Q1)",
        viento: "VENT (Q2)",
        direccion: "DIRECTION DU VENT",
        nucleo: "> NOYAU QUANTIQUE (3 Qubits)",
        incendios: "> INCENDIES ACTIFS (FIRMS)",
        cargando: "Chargement de la couche incendies...",
        avisoLegal: "Mentions Légales et Méthodologie",
        descargarPdf: "Télécharger le rapport PDF",
        chatTitulo: "Manolito · Conseiller Extinction",
        chatPlaceholder: "Demandez à Manolito à propos de cette zone...",
        chatSaludo: "Je suis Manolito. Donnez-moi des coordonnées, le vent ou une zone et je vous dirai où agir en premier.",
        propagacion: "> PROPAGATION ET ZONES DE TRAVAIL",
        zonaSeguro: "Zone sûre – stress normal",
        zonaAmbar: "Alerte préventive – stress modéré",
        zonaRojo: "Poudrière critique – risque imminent",
        calculando: "CALCUL EN COURS...",
        zonaAgua: "ZONE D'EAU",
        zonaAguaMsg: "Impossible de calculer le stress de la biomasse forestière sur l'eau.",
        simulacionNoIniciadaAgua: "> Simulation non démarrée (zone d'eau).",
        popupZonaAgua: "Zone d'eau",
        errorDatosClima: "Erreur lors de la récupération des données météorologiques. Vérifiez la connexion.",
        ceroFuegosVisibles: "0 feux visibles dans cette zone",
        fuegosActivosDetectados: "{count} feux actifs détectés",
        errorFirms: "Erreur de connexion à FIRMS",
        errorFirmsDev: "Affichage des feux d'EXEMPLE (utilisez 'wrangler dev' pour les données réelles)",
        popupIncendioActivo: "Incendie actif (VIIRS)",
        popupBrillo: "Luminosité",
        popupConfianza: "Confiance",
        popupEvaluarRiesgo: "Évaluer le risque quantique",
        tooltipPropagacion: "Zone de propagation estimée (selon le vent actuel)",
        popupEstresBiomasa: "Stress de la Biomasse",
        actionOptimo: "Biomasse en état optimal. Poursuivre la surveillance périodique de la zone.",
        actionRecomendada: "<strong>ACTION RECOMMANDÉE :</strong> Demander aux services forestiers la révision et le nettoyage préventif de cette bande, en priorisant la tête et les flancs selon le vent.",
        actionUrgente: "<strong>ACTION URGENTE :</strong> Avertir les pompiers/services forestiers. Consulter la section Propagation pour les zones de travail prioritaires.",
        logRyAplicadas: "> RY(θ) appliquées.",
        logCnotEjecutados: "> CNOT (0→2) et CNOT (2→1) exécutés. Variables intriquées.",
        logMedicionEjecutada: "> Mesure de Born exécutée. Effondrement de l'état.",
        titleModoCiudadano: "Masquer les détails techniques",
        titleModoCiencia: "Voir les détails techniques de la simulation",
        titleColapsar: "Cliquer pour déplier/replier",
        errorCargaLegal: "Erreur lors du chargement du contenu de l'avis légal. Veuillez recharger la page.",
        trabajoUrgenciaBaja: "surveillance préventive de routine",
        trabajoUrgenciaMedia: "travaux préventifs programmés dans les prochains jours",
        trabajoUrgenciaAlta: "intervention urgente, haute priorité",
        trabajoVientoFlojo: "vent faible : la propagation attendue serait modérée et relativement prévisible",
        trabajoVientoModerado: "vent modéré à fort : la tête d'un éventuel incendie avancerait à une vitesse significative",
        trabajoVientoFuerte: "vent fort : risque de comportement erratique, de foyers secondaires dus aux escarbilles et d'avancée très rapide en tête",
        trabajoTexto: `Avec un vent venant de {cardCola} ({windDirOrigen}°) à {windSpeed} km/h, un incendie à ce point avancerait vers {cardAvance}. {intensidadViento}.\n\nPRIORITÉ 1 - TÊTE (direction {cardAvance}) : sécuriser les pare-feux et défricher la biomasse dans la bande sous le vent ; c'est la zone de plus grande vitesse de propagation et de plus grand risque pour les personnes et les structures.\n\nPRIORITÉ 2 - FLANCS ({cardFlancoIzq} et {cardFlancoDer}) : travailler ces bandes perpendiculaires pour empêcher l'incendie de "s'ouvrir" et d'augmenter son front actif.\n\nZONE DE PRIORITÉ IMMÉDIATE INFÉRIEURE - QUEUE ({cardCola}, au vent) : la progression du feu dans cette direction est beaucoup plus lente ; c'est la zone relativement la plus sûre pour les manœuvres de soutien et les points de contrôle, bien qu'elle ne doive pas être négligée.\n\nNiveau d'action recommandé : {urgencia}.`,
        pdfSubtitulo: "Rapport technique de risque et propagation d'incendie forestier",
        pdfEstadoIncendioActivo: "INCENDIE ACTIF",
        pdfEstadoRiesgoAlto: "RISQUE ÉLEVÉ (surveillance)",
        pdfEstadoRiesgoBajo: "risque faible-modéré",
        pdfSeleccionaZona: "Sélectionnez d'abord une zone sur la carte pour générer le rapport.",
        pdfErrorCarga: "Impossible de charger le générateur de PDF. Vérifiez votre connexion.",
        pdfAlerta: "ALERTE", pdfAviso: "AVIS",
        pdfDentroPerimetro: "À L'INTÉRIEUR du périmètre estimé", pdfAlejate: "Éloignez-vous",
        pdfSiCerca: "si vous êtes près de la zone, éloignez-vous", pdfEmergencias: "Urgences",
        pdfSinConfirmar: "aucun incendie confirmé, zone sous surveillance",
        pdfFecha: "Date du rapport", pdfLugar: "Lieu approximatif", pdfNoDisponible: "Non disponible",
        pdfCoordenadas: "Coordonnées", pdfTemperatura: "Température", pdfHumedad: "Humidité relative",
        pdfViento: "Vent", pdfDireccionLower: "direction", pdfEstresBiomasa: "Stress de la biomasse (modèle quantique)",
        pdfIncendiosCercanos: "Incendies actifs dans un rayon de 25km (satellite)", pdfMasCercano: "le plus proche à",
        pdfNingunoDetectado: "aucun détecté", pdfPerimetroIncendio: "Périmètre estimé de l'incendie",
        pdfDentroPerimetroCorto: "à l'intérieur du périmètre", pdfFocoDe: "foyer de",
        pdfPerimetroCercano: "Périmètre estimé le plus proche", pdfADistancia: "à",
        pdfRecomendacionTitulo: "Recommandation des zones de travail", pdfSinRecomendacion: "Aucune recommandation calculée.",
        pdfNotaRojo: "Ce rapport est un modèle d'aide à la décision basé sur des données météorologiques ouvertes (Open-Meteo), un satellite d'incendies (NASA FIRMS) et une simulation de circuit quantique exécutée dans le navigateur. Le périmètre estimé est une approximation géométrique calculée à partir des points de chaleur détectés et n'est PAS une donnée officielle vérifiée sur le terrain. Il ne remplace pas les ordres des pompiers, de la Protection Civile, de l'AEMET ni du 112. Des indices d'incendie actif sont présents dans cette zone : en cas de doute, contactez le 112 ou la Protection Civile/les pompiers.",
        pdfNotaVerde: "Ce rapport est un modèle d'aide à la décision basé sur des données météorologiques ouvertes (Open-Meteo) et une simulation de circuit quantique exécutée dans le navigateur. Le périmètre estimé, lorsqu'il apparaît, est une approximation géométrique calculée à partir des points de chaleur détectés et n'est PAS une donnée officielle vérifiée sur le terrain. Il ne remplace pas les ordres des pompiers, de la Protection Civile, de l'AEMET ni du 112. En cas d'incendie actif, contactez toujours le 112.",
        fwiToggle: "Indice FWI (danger d'incendie)",
        fwiToggleActivar: "Activer la couche FWI de danger d'incendie",
        fwiToggleDesactivar: "Désactiver la couche FWI de danger d'incendie",
        fwiLeyendaTitulo: "Indice FWI (EFFIS)",
        fwiLeyendaExpandir: "Afficher la légende FWI",
        fwiLeyendaColapsar: "Masquer la légende FWI",
        fwiMuyBajo: "Très faible",
        fwiBajo: "Faible",
        fwiModerado: "Modéré",
        fwiAlto: "Élevé",
        fwiMuyAlto: "Très élevé",
        fwiExtremo: "Extrême",
        fwiCargando: "Chargement de la couche FWI…",
        fwiError: "Impossible de charger la couche FWI. Réessayer",
        fwiFuente: "Source : EFFIS / Copernicus ECMWF",
        "recursos.toggleAria": "Activer la couche des ressources d'extinction",
        "recursos.panelTitulo": "Ressources d'extinction",
        "recursos.tipoHidrante": "Bouche d'incendie",
        "recursos.tipoDeposito": "Réservoir d'eau",
        "recursos.tipoHelisuperficie": "Hélisurface",
        "recursos.tipoBalsa": "Bassin / réservoir",
        "recursos.tipoBomberos": "Caserne de pompiers",
        "recursos.cargando": "Chargement des ressources…",
        "recursos.errorSaturado": "Serveur cartographique saturé. Réessayez dans quelques minutes.",
        "recursos.errorRed": "Pas de connexion au serveur de ressources.",
        "recursos.zoomNecesario": "Zone trop grande : zoomez pour charger les ressources.",
        "recursos.contador": "{n} ressources dans la zone visible",
        "recursos.sinResultados": "Aucune ressource de ce type dans la zone visible.",
        "recursos.copiar": "Copier les coordonnées",
        "recursos.copiado": "Copié !",
        "recursos.tipo": "Type",
        "recursos.nombre": "Nom",
        "recursos.coords": "Coordonnées",
        "recursos.reintentar": "Réessayer",
        "pwa.online": "En ligne",
        "pwa.offline": "Hors connexion — mode terrain",
        "pwa.prepararZona": "Préparer la zone pour le terrain",
        "pwa.preparando": "Téléchargement de la carte de la zone… {hechas}/{total}",
        "pwa.zonaLista": "Zone prête hors ligne ({tiles} tuiles)",
        "pwa.zonaError": "Impossible de préparer la zone. Réessayez avec une connexion.",
        "pwa.sinMapa": "Carte pas encore disponible",
        "pwa.cerrarAviso": "Fermer l'avis",
        "pwa.expandir": "Afficher le bouton de préparation de zone",
        "gps.miUbicacion": "Ma position",
        "gps.dejarSeguir": "Arrêter de suivre ma position",
        bandasTituloToggle: "Afficher/masquer les bandes de propagation estimée",
        bandasTooltip: "t+{h}h ≈ {km} km (tête de feu)",
        bandasAviso: "Estimation simplifiée : vent et vitesse constants. Ne pas utiliser pour des décisions opérationnelles.",
        "evac.boton": "Évacuation",
        "evac.botonAria": "Activer le système d'évacuation GPS. Votre position ne quitte jamais votre appareil.",
        "evac.alertaRoja": "DANGER D'INCENDIE PROCHE ({dist}). Commencez l'évacuation immédiatement.",
        "evac.alertaAmarilla": "Zone à risque d'incendie à {dist}. Restez vigilant et préparez-vous à évacuer.",
        "evac.iniciar": "Démarrer l'évacuation",
        "evac.detener": "Arrêter l'évacuation",
        "evac.haciaZonaSegura": "Zone sûre à {dist}",
        "evac.rumbo": "Cap de fuite : {card} ({grados}°)",
        "evac.modoBrujula": "Mode boussole : GPS faible. Suivez le dernier cap connu.",
        "evac.buscandoGps": "Localisation GPS…",
        "evac.sinGps": "GPS indisponible. Activez la localisation de l'appareil.",
        "evac.recalculando": "Recalcul du vecteur de fuite…",
        "evac.offline": "Hors connexion : navigation avec les dernières données enregistrées ({hora})",
        "evac.permisoBrujula": "Touchez pour activer la boussole",
        "evac.popupEscapar": "Fuir ce foyer",
        "evac.fueraDeZona": "Hors de la zone de danger immédiat. Continuez à vous éloigner.",
        "evac.privacidad": "GPS traité uniquement sur votre appareil. Rien ne quitte le téléphone.",
        "evac.datosGuardados": "Données d'incendie enregistrées : {hora}",
        "evac.sinDatos": "Pas de données d'incendie. Éloignez-vous de la fumée et appelez le 112.",
        "evac.cerrar": "Fermer la navigation d'évacuation",
        "evac.sigueHacia": "Continuez cap {card}",
        "evac.calibraBrujula": "Boussole erratique : calibrez en décrivant un 8 avec le téléphone",
        "evac.gpsEdad": "il y a {s} s",
        "evac.errorPermiso": "Permission de localisation refusée. Activez-la dans les réglages du navigateur.",
        "evac.errorSinSenal": "Pas de signal de localisation. Sortez à découvert ou activez la localisation du système.",
        "evac.errorTimeout": "Le GPS met trop de temps à répondre. Réessayez à ciel ouvert.",
        "evac.vigilar": "M'avertir si un feu est proche (utilise le GPS)",
        "evac.vigilando": "Veille de proximité active — touchez pour arrêter",
        "me.huir": "Fuir l'incendie",
        "me.huirAria": "Active le guidage de fuite par flèches avec le GPS et la boussole de votre téléphone. Il demandera la permission de localisation.",
        "me.ubicando": "Obtention de votre position…",
        "me.guiaActiva": "Guidage de fuite actif. Suivez la flèche.",
        "evac.avisoLineaRecta": "La flèche indique la direction la plus courte, pas un itinéraire sûr garanti : elle n'évite ni le feu ni le terrain. Suivez toujours en priorité les instructions de la Protection civile et des pompiers."
    }

};

let idiomaActual = localStorage.getItem('manolitoIdioma') || 'es';

function t(clave, interpolaciones = {}) {
    let texto = (IDIOMAS[idiomaActual] && IDIOMAS[idiomaActual][clave]) || IDIOMAS.es[clave] || clave;
    for (const k in interpolaciones) {
        texto = texto.replace(new RegExp(`\\{${k}\\}`, 'g'), interpolaciones[k]);
    }
    return texto;
}

function aplicarIdioma() {
    document.documentElement.lang = idiomaActual;
    const setText = (id, clave) => { const el = document.getElementById(id); if (el) el.textContent = t(clave); };

    setText('ui-subtitle', 'subtitulo');
    setText('ui-datos-entrada-h2', 'datosEntrada');
    setText('ui-label-latlon', 'latlon');
    setText('ui-label-temp', 'temp');
    setText('ui-label-hum', 'hum');
    setText('ui-label-viento', 'viento');
    setText('ui-label-direccion', 'direccion');
    setText('ui-nucleo-h2', 'nucleo');
    setText('ui-incendios-h2', 'incendios');
    setText('contador-fuegos', 'cargando');
    setText('open-legal-link', 'avisoLegal');
    setText('btn-descargar-pdf', 'descargarPdf');
    setText('manolito-chat-titulo', 'chatTitulo');
    setText('ui-propagacion-h2', 'propagacion');

    const percentPlaceholder = document.getElementById('ui-alert');
    if (percentPlaceholder && percentPlaceholder.dataset.estado === 'inicial') {
        percentPlaceholder.textContent = t('selecciona');
    }

    const toggleModeBtn = document.getElementById('toggle-mode');
    if (toggleModeBtn) {
        const dashboard = document.getElementById('dashboard');
        const esCiudadano = dashboard && dashboard.classList.contains('mode-citizen');
        toggleModeBtn.textContent = esCiudadano ? t('modoCientifico') : t('modoCiudadano');
    }

    const chatInput = document.getElementById('manolito-input');
    if (chatInput) chatInput.placeholder = t('chatPlaceholder');

    const selector = document.getElementById('selector-idioma');
    if (selector) selector.value = idiomaActual;
}

function cambiarIdioma(nuevoIdioma) {
    if (!IDIOMAS[nuevoIdioma]) return;
    idiomaActual = nuevoIdioma;
    localStorage.setItem('manolitoIdioma', nuevoIdioma);
    aplicarIdioma();
    // Aviso a los módulos de capas (capa-fwi y bandas-propagacion usan nombres distintos)
    document.dispatchEvent(new CustomEvent('manolito:idioma-cambiado'));
    window.dispatchEvent(new CustomEvent('manolitoforestal:idioma-cambiado'));
}

document.addEventListener('DOMContentLoaded', () => {
    const selector = document.getElementById('selector-idioma');
    if (selector) {
        selector.value = idiomaActual;
        selector.addEventListener('change', (e) => cambiarIdioma(e.target.value));
    }
    aplicarIdioma();
});

;

/* ==================== baliza-ultrasonica.js ==================== */
/**
 * MANOLIT∞ FORESTAL - Nodo de Sincronización Táctica P2P
 * Módulo 1: Baliza Ultrasónica de Proximidad (v2, reingeniería acústica)
 * =====================================================================
 *
 * QUÉ EMITEN Y QUÉ OYEN LOS MÓVILES DE VERDAD (la física manda):
 *
 *  - Los altavoces de smartphone reproducen hasta ~20 kHz, pero por
 *    encima de ~19 kHz caen mucho de volumen (respuesta del altavoz
 *    miniatura) y algunos sistemas de audio recortan a 48 kHz de
 *    muestreo. La banda 17-20 kHz es la que la literatura de "acoustic
 *    data transmission" usa porque es audible-para-el-móvil pero
 *    prácticamente inaudible para personas (el oído adulto raramente
 *    pasa de 16-17 kHz).
 *  - Los micrófonos de smartphone sí captan 17-20 kHz sin problema
 *    (muestrean a 44,1/48 kHz -> Nyquist 22/24 kHz), SIEMPRE que se
 *    desactiven los filtros de voz (echoCancellation, noiseSuppression,
 *    autoGainControl), que si no, borran el tono antes de analizarlo.
 *
 * CAMBIOS RESPECTO A LA VERSIÓN ANTERIOR (por qué fallaba en campo):
 *
 *  1. BANDA REAL: antes 18,5-19,8 kHz con pasos de 40 Hz. 40 Hz entre
 *     símbolos con tramas de 80 ms roza el límite de resolución
 *     (incertidumbre ~1/0,08 s = 12,5 Hz, sí, pero con ruido y deriva
 *     del reloj se solapan los picos). Ahora: 33 símbolos entre
 *     17,3 y 19,86 kHz con pasos de 80 Hz (~7 bins FFT de separación a
 *     48 kHz/4096 puntos) y marca de inicio en 17,22 kHz.
 *
 *  2. BUG DE SÍMBOLOS DUPLICADOS (crítico): el bucle lee el espectro a
 *     ~60 fps, así que cada tono de 80 ms se veía 4-5 veces y el ID se
 *     registraba con caracteres repetidos ("AABBC..."), rompiendo el
 *     checksum casi siempre. Ahora hay una MÁQUINA DE ESTADOS: un tono
 *     solo se registra UNA vez, cuando permanece estable varios frames
 *     y luego cambia (o cesa).
 *
 *  3. UMBRAL ADAPTATIVO (SNR), no fijo: antes bastaba superar -65 dB y
 *     cualquier pitido electrónico colaba. Ahora el pico debe superar
 *     la MEDIANA del ruido de la banda en al menos +9 dB, que es el
 *     criterio clásico de detección de tonos en ruido (análisis de
 *     densidad espectral). El ruido ambiental plano ya no dispara nada.
 *
 *  4. SÍMBOLOS MÁS LARGOS (110 ms + 30 ms de guarda) con rampas de
 *     subida/bajada de 8 ms: evita los "clics" de conmutación que
 *     ensucian la FFT y que además delatan el tono al oído.
 *
 *  5. SEÑALES DE ALARMA AUDIBLES (nuevo): la baliza ultrasónica sirve
 *     para el "apretón de manos" automático, pero en una emergencia
 *     también hace falta LLAMAR LA ATENCIÓN DE PERSONAS. Se añaden dos
 *     señales que cualquier móvil emite alto y claro:
 *       - Sirena "yelp" (barrido 650↔1450 Hz): patrón de alerta real.
 *       - SOS en morse a 880 Hz (· · · — — — · · ·): universal.
 *     Ambas usan su propio AudioContext, funcionan aunque el modo
 *     emergencia ultrasónico esté parado.
 *
 * API:
 *   const baliza = new BalizaUltrasonica(id => console.log('cerca:', id));
 *   await baliza.iniciar();   // pide micrófono una vez
 *   baliza.detener();
 *   BalizaUltrasonica.emitirSirena(8);     // segundos, audible
 *   BalizaUltrasonica.emitirSOSMorse();    // audible
 *   BalizaUltrasonica.pararAlarmas();
 */

(function () {
'use strict';

const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 33 símbolos, sin I/O/0/1 (confusión)

class BalizaUltrasonica {
    constructor(onDispositivoDetectado) {
        this.onDispositivoDetectado = onDispositivoDetectado;
        this.audioCtx = null;
        this.analizador = null;
        this.microfono = null;
        this.emitiendo = false;
        this.escuchando = false;
        this.idPropio = this.generarIdCorto();
        this.dispositivosVistos = new Map();

        // --- Plan de frecuencias (ver cabecera) ---
        this.FREQ_BASE = 17300;          // Hz, símbolo 0
        this.FREQ_PASO = 80;             // Hz entre símbolos (~7 bins FFT)
        this.FREQ_MARCA = 17220;         // marca de inicio de trama
        this.FREQ_MAX = this.FREQ_BASE + this.FREQ_PASO * (ALFABETO.length - 1); // 19.860 Hz
        this.DURACION_SIMBOLO_MS = 110;
        this.GUARDA_SIMBOLO_MS = 30;

        // --- Estado del receptor (máquina de estados anti-duplicados) ---
        this._tonoActual = null;         // frecuencia cuantizada vigente
        this._tonoFrames = 0;            // frames consecutivos en ese tono
        this._tramaActual = [];
        this._ultimoSimboloTs = 0;
        this._ultimoFrameConTonoTs = 0;
    }

    generarIdCorto() {
        let id = '';
        const cryptoObj = window.crypto || window.msCrypto;
        const buf = new Uint8Array(6);
        if (cryptoObj && cryptoObj.getRandomValues) cryptoObj.getRandomValues(buf);
        else for (let i = 0; i < 6; i++) buf[i] = Math.floor(Math.random() * 256);
        for (let i = 0; i < 6; i++) id += ALFABETO[buf[i] % ALFABETO.length];
        return id;
    }

    _calcularChecksum(id) {
        let suma = 0;
        for (const c of id) suma += ALFABETO.indexOf(c);
        return ALFABETO[suma % ALFABETO.length];
    }

    idAFrecuencias(idConChecksum) {
        return idConChecksum.split('').map(c => this.FREQ_BASE + ALFABETO.indexOf(c) * this.FREQ_PASO);
    }

    // Cuantiza una frecuencia al símbolo más cercano, o null si no cae
    // dentro de la tolerancia de ninguno (±medio paso).
    frecuenciaACaracter(freq) {
        const indice = Math.round((freq - this.FREQ_BASE) / this.FREQ_PASO);
        if (indice < 0 || indice >= ALFABETO.length) return null;
        const esperada = this.FREQ_BASE + indice * this.FREQ_PASO;
        if (Math.abs(freq - esperada) > this.FREQ_PASO / 2) return null;
        return ALFABETO[indice];
    }

    async iniciar() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (this.audioCtx.state === 'suspended') {
            try { await this.audioCtx.resume(); } catch (e) {}
        }
        await this.iniciarEscucha();
        this.iniciarEmision();
    }

    detener() {
        this.emitiendo = false;
        this.escuchando = false;
        if (this.audioCtx) { try { this.audioCtx.close(); } catch (e) {} }
        this.audioCtx = null;
    }

    // ---------------- EMISIÓN ULTRASÓNICA ----------------
    iniciarEmision() {
        this.emitiendo = true;
        const emitirCiclo = () => {
            if (!this.emitiendo || !this.audioCtx) return;
            this.emitirId(this.idPropio);
            const duracionTramaMs = (this.idPropio.length + 2) * (this.DURACION_SIMBOLO_MS + this.GUARDA_SIMBOLO_MS);
            const espera = 3500 + Math.random() * 2000;
            setTimeout(emitirCiclo, espera + duracionTramaMs);
        };
        emitirCiclo();
    }

    emitirId(id) {
        const checksum = this._calcularChecksum(id);
        const frecuencias = this.idAFrecuencias(id + checksum);
        const gain = this.audioCtx.createGain();
        gain.gain.value = 0.35; // volumen de emisión (0-1)
        gain.connect(this.audioCtx.destination);

        let t = this.audioCtx.currentTime + 0.05;
        this._emitirTono(this.FREQ_MARCA, t, gain);
        t += (this.DURACION_SIMBOLO_MS + this.GUARDA_SIMBOLO_MS) / 1000;
        for (const f of frecuencias) {
            this._emitirTono(f, t, gain);
            t += (this.DURACION_SIMBOLO_MS + this.GUARDA_SIMBOLO_MS) / 1000;
        }
    }

    _emitirTono(freq, cuando, gainNode) {
        const osc = this.audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        // Envolvente con rampas de 8 ms: sin rampa, el arranque/parada
        // brusca genera un "clic" de banda ancha que contamina la FFT.
        const env = this.audioCtx.createGain();
        const dur = this.DURACION_SIMBOLO_MS / 1000;
        env.gain.setValueAtTime(0, cuando);
        env.gain.linearRampToValueAtTime(1, cuando + 0.008);
        env.gain.setValueAtTime(1, cuando + dur - 0.008);
        env.gain.linearRampToValueAtTime(0, cuando + dur);
        osc.connect(env);
        env.connect(gainNode);
        osc.start(cuando);
        osc.stop(cuando + dur + 0.01);
    }

    // ---------------- ESCUCHA ULTRASÓNICA ----------------
    async iniciarEscucha() {
        // echoCancellation/noiseSuppression/autoGainControl en false:
        // esos filtros de "limpieza de voz" clasifican un tono agudo y
        // estable como ruido y lo eliminan antes de que lo veamos.
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false,
                channelCount: 1
            }
        });
        this.microfono = this.audioCtx.createMediaStreamSource(stream);
        this.analizador = this.audioCtx.createAnalyser();
        this.analizador.fftSize = 4096;
        this.analizador.smoothingTimeConstant = 0; // sin suavizado: necesitamos ver el tono real en cada frame
        this.microfono.connect(this.analizador);
        this.escuchando = true;
        this._bucleDeteccion();
    }

    _bucleDeteccion() {
        if (!this.escuchando || !this.analizador) return;
        const buffer = new Float32Array(this.analizador.frequencyBinCount);
        this.analizador.getFloatFrequencyData(buffer);

        const freqDetectada = this._detectarTono(buffer);
        this._maquinaEstados(freqDetectada);

        requestAnimationFrame(() => this._bucleDeteccion());
    }

    /**
     * Detección con umbral ADAPTATIVO: el pico de la banda debe superar
     * la mediana del ruido de la propia banda en >= +9 dB (y un mínimo
     * absoluto de -72 dB). Un pitido estable pero débil, o ruido de
     * banda ancha (que sube toda la banda a la vez, mediana incluida),
     * no pasan el filtro.
     */
    _detectarTono(buffer) {
        const sampleRate = this.audioCtx.sampleRate;
        const binHz = sampleRate / this.analizador.fftSize;
        const binMin = Math.max(0, Math.floor((this.FREQ_MARCA - 150) / binHz));
        const binMax = Math.min(buffer.length - 1, Math.ceil((this.FREQ_MAX + 150) / binHz));
        if (binMax - binMin < 8) return null; // sampleRate demasiado bajo para esta banda

        let mejorBin = -1, mejorValor = -Infinity;
        const valores = [];
        for (let i = binMin; i <= binMax; i++) {
            valores.push(buffer[i]);
            if (buffer[i] > mejorValor) { mejorValor = buffer[i]; mejorBin = i; }
        }

        // Mediana del ruido de banda (robusta frente al propio pico)
        valores.sort((a, b) => a - b);
        const mediana = valores[Math.floor(valores.length / 2)];

        if (mejorValor < -72) return null;                 // silencio absoluto
        if (mejorValor < mediana + 9) return null;         // no destaca sobre el ruido (SNR insuficiente)

        // El pico debe estar centrado en un bin único (un tono real),
        // no ser un escalón de banda ancha: comprobamos que los bins
        // vecinos inmediatos caen claramente.
        const izq = buffer[mejorBin - 1] !== undefined ? buffer[mejorBin - 1] : -Infinity;
        const der = buffer[mejorBin + 1] !== undefined ? buffer[mejorBin + 1] : -Infinity;
        if (Math.max(izq, der) > mejorValor - 3) return null; // demasiado plano = ruido

        return mejorBin * binHz;
    }

    /**
     * Máquina de estados: convierte la sucesión de frames (60 por
     * segundo) en símbolos discretos. Un tono SOLO se registra una vez:
     * cuando llevaba >= 2 frames estable y luego cambia o desaparece.
     * Así un símbolo de 110 ms (6-7 frames) se cuenta exactamente una
     * vez, y un parpadeo de un solo frame (ruido impulsivo) se ignora.
     */
    _maquinaEstados(freq) {
        const ahora = Date.now();

        if (freq === null) {
            // Silencio: si llevábamos un tono estable, ciérralo
            if (this._tonoActual !== null && this._tonoFrames >= 2) {
                this._registrarSimbolo(this._tonoActual, ahora);
            }
            this._tonoActual = null;
            this._tonoFrames = 0;
            // Si llevamos mucho sin recibir nada, la trama murió
            if (this._tramaActual.length > 0 && ahora - this._ultimoSimboloTs > 600) {
                this._tramaActual = [];
            }
            return;
        }

        // Cuantiza el tono: marca de inicio o símbolo del alfabeto
        let clave;
        if (Math.abs(freq - this.FREQ_MARCA) <= this.FREQ_PASO / 2) clave = 'MARCA';
        else clave = this.frecuenciaACaracter(freq);
        if (clave === null) { this._tonoActual = null; this._tonoFrames = 0; return; }

        if (clave === this._tonoActual) {
            this._tonoFrames++;
        } else {
            // Cambio de tono: el anterior, si era estable, ya es símbolo
            if (this._tonoActual !== null && this._tonoFrames >= 2) {
                this._registrarSimbolo(this._tonoActual, ahora);
            }
            this._tonoActual = clave;
            this._tonoFrames = 1;
        }
        this._ultimoFrameConTonoTs = ahora;
    }

    _registrarSimbolo(clave, ahora) {
        if (clave === 'MARCA') {
            this._tramaActual = [];
            this._ultimoSimboloTs = ahora;
            return;
        }
        // Símbolo de datos: debe llegar dentro del ritmo de la trama
        if (this._tramaActual.length === 0 && ahora - this._ultimoSimboloTs > 400) {
            // Símbolo suelto sin marca de inicio reciente: probablemente
            // nos comimos la marca o es ruido; lo usamos como arranque
            // optimista solo si después cuadra el checksum.
            this._tramaActual = [];
        }
        this._ultimoSimboloTs = ahora;
        this._tramaActual.push(clave);

        if (this._tramaActual.length === 7) { // 6 de ID + 1 de checksum
            const idDetectado = this._tramaActual.slice(0, 6).join('');
            const checksumRecibido = this._tramaActual[6];
            this._tramaActual = [];
            if (checksumRecibido !== this._calcularChecksum(idDetectado)) return; // ruido, se descarta
            if (idDetectado !== this.idPropio) this._notificarDispositivo(idDetectado);
        }
    }

    _notificarDispositivo(id) {
        const ahora = Date.now();
        const ultimaVez = this.dispositivosVistos.get(id);
        this.dispositivosVistos.set(id, ahora);
        if (!ultimaVez || ahora - ultimaVez > 20000) {
            if (this.onDispositivoDetectado) this.onDispositivoDetectado(id);
        }
    }

    // ============================================================
    // SEÑALES AUDIBLES DE ALARMA (para personas, no para móviles)
    // Estáticas: funcionan sin activar la baliza ultrasónica.
    // ============================================================

    /** Sirena tipo "yelp": barrido repetido 650 <-> 1450 Hz. */
    static emitirSirena(segundos = 8) {
        const ctx = BalizaUltrasonica._ctxAlarma();
        BalizaUltrasonica._alarmaHasta = Date.now() + segundos * 1000;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        gain.gain.value = 0.7;
        osc.type = 'triangle'; // más armónicos que el seno: suena "de sirena" y atraviesa mejor el ruido
        osc.connect(gain); gain.connect(ctx.destination);
        const t0 = ctx.currentTime;
        const ciclo = 0.55; // segundos por barrido
        const pasos = Math.ceil(segundos / ciclo);
        for (let i = 0; i < pasos; i++) {
            osc.frequency.setValueAtTime(650, t0 + i * ciclo);
            osc.frequency.linearRampToValueAtTime(1450, t0 + i * ciclo + ciclo / 2);
            osc.frequency.linearRampToValueAtTime(650, t0 + (i + 1) * ciclo);
        }
        osc.start(t0);
        osc.stop(t0 + segundos);
        return osc;
    }

    /** SOS en morse a 880 Hz: · · ·  — — —  · · · (x2) */
    static emitirSOSMorse() {
        const ctx = BalizaUltrasonica._ctxAlarma();
        const gain = ctx.createGain();
        gain.gain.value = 0.8;
        gain.connect(ctx.destination);
        const PUNTO = 0.12, RAYA = 0.36, HUECO = 0.12, HUECO_GRUPO = 0.45;
        const patron = [PUNTO, PUNTO, PUNTO, RAYA, RAYA, RAYA, PUNTO, PUNTO, PUNTO];
        let t = ctx.currentTime + 0.05;
        for (let rep = 0; rep < 2; rep++) {
            for (const dur of patron) {
                const osc = ctx.createOscillator();
                osc.type = 'sine'; osc.frequency.value = 880;
                osc.connect(gain);
                osc.start(t); osc.stop(t + dur);
                t += dur + HUECO;
            }
            t += HUECO_GRUPO;
        }
    }

    static pararAlarmas() {
        if (BalizaUltrasonica._ctx) {
            try { BalizaUltrasonica._ctx.close(); } catch (e) {}
            BalizaUltrasonica._ctx = null;
        }
    }

    static _ctxAlarma() {
        if (!BalizaUltrasonica._ctx || BalizaUltrasonica._ctx.state === 'closed') {
            BalizaUltrasonica._ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (BalizaUltrasonica._ctx.state === 'suspended') BalizaUltrasonica._ctx.resume();
        return BalizaUltrasonica._ctx;
    }
}

window.BalizaUltrasonica = BalizaUltrasonica;

})();
;

/* ==================== modo-emergencias.js ==================== */
/**
 * MANOLIT∞ FORESTAL - Modo de Emergencia
 * Panel visual + orquestador de conexiones WebRTC reales
 * + Protocolo de retransmisión mesh (integrado en este mismo archivo)
 *
 * ÚNICO ARCHIVO de frontend. Añade en tu index.html, DESPUÉS de
 * baliza-ultrasonica.js:
 *
 *   <script src="baliza-ultrasonica.js"></script>
 *   <script src="modo-emergencias.js"></script>
 *
 * Qué hace:
 * 1. Inyecta su propio CSS y HTML (botón flotante + panel).
 * 2. Al "Activar modo emergencia" arranca BalizaUltrasonica.
 * 3. Al detectar un ID cercano, decide sola quién "llama" y quién
 *    "responde" (comparando IDs, sin choques) y abre un
 *    RTCPeerConnection real con canal de datos ("peligro").
 * 4. La señalización (el papeleo SDP/ICE que WebRTC necesita para
 *    arrancar) viaja AUTOMÁTICAMENTE por tu propio Worker, a través de
 *    la ruta /senal (ver senales.js). Nada de copiar/pegar códigos.
 * 5. NUEVO: cuando llega un mensaje de emergencia por cualquier canal
 *    abierto, se reenvía solo a todos los demás móviles conectados
 *    (con un límite de saltos y sin repetirlo dos veces), así el
 *    mensaje puede viajar de móvil en móvil aunque el que lo mandó
 *    ya no esté cerca de quien lo recibe al final.
 *
 * CÓMO SE USA DESDE TU PROPIA APP (por ejemplo, al pulsar un botón):
 *
 *   window.gestorEmergencia.emitirEmergencia('FUEGO', { lat: 37.38, lng: -5.99 });
 *   window.gestorEmergencia.emitirEmergencia('ATRAPADO');
 *   window.gestorEmergencia.emitirEmergencia('SOS');
 *   window.gestorEmergencia.emitirEmergencia('ESTOY_A_SALVO');
 *
 * PARA MOSTRAR EN PANTALLA LAS EMERGENCIAS QUE VAN LLEGANDO:
 *
 *   window.addEventListener('manolit:emergencia', function(e) {
 *     console.log(e.detail); // { id, codigo, de, ts, lat, lng... }
 *     // aquí pon tu código para pintarlo en la pantalla
 *   });
 */

(function () {
  'use strict';

  // ============================================================
  // 0. PROTOCOLO MESH - catálogo de códigos de emergencia
  // ============================================================
  const MESH_TTL_MAXIMO = 6; // cuántos móviles como máximo puede saltar un mensaje
  const MESH_VENTANA_REPETIDOS_MS = 5 * 60 * 1000; // 5 minutos

  const MESH_CODIGOS = {
    SOS: 1,
    FUEGO: 2,
    ATRAPADO: 3,
    NECESITO_AYUDA: 4,
    ESTOY_A_SALVO: 5,
  };

  const MESH_NOMBRES = {
    1: 'SOS',
    2: 'Fuego',
    3: 'Persona atrapada',
    4: 'Necesita ayuda',
    5: 'A salvo',
  };

  // ============================================================
  // 1. ESTILOS
  // ============================================================
  const CSS = `
    :root {
      --me-rojo: #ff2b3d;
      --me-rojo-oscuro: #b30015;
      --me-fondo: #0d0f14;
      --me-panel: #14171f;
      --me-texto: #f2f2f2;
      --me-texto-tenue: #9aa0ab;
      --me-borde: #2a2f3a;
    }

    #me-fab {
      position: fixed;
      left: 18px;
      bottom: 90px;
      width: 62px;
      height: 62px;
      border-radius: 50%;
      background: linear-gradient(145deg, var(--me-rojo), var(--me-rojo-oscuro));
      box-shadow: 0 4px 18px rgba(255, 43, 61, 0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 99998;
      border: none;
      transition: transform .15s ease;
    }
    #me-fab:active { transform: scale(0.92); }
    #me-fab svg { width: 30px; height: 30px; }

    #me-fab.me-activo {
      animation: me-pulso 1.4s infinite;
    }
    @keyframes me-pulso {
      0%   { box-shadow: 0 0 0 0 rgba(255,43,61,0.65); }
      70%  { box-shadow: 0 0 0 16px rgba(255,43,61,0); }
      100% { box-shadow: 0 0 0 0 rgba(255,43,61,0); }
    }

    #me-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      z-index: 99999;
      display: none;
      align-items: flex-end;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #me-overlay.me-abierto { display: flex; }

    #me-panel {
      width: 100%;
      max-width: 480px;
      max-height: 82vh;
      overflow-y: auto;
      background: var(--me-panel);
      border-top: 1px solid var(--me-borde);
      border-radius: 20px 20px 0 0;
      padding: 20px 20px 28px;
      color: var(--me-texto);
      box-shadow: 0 -8px 30px rgba(0,0,0,0.5);
      animation: me-subir .22s ease-out;
    }
    @keyframes me-subir {
      from { transform: translateY(24px); opacity: 0; }
      to   { transform: translateY(0); opacity: 1; }
    }

    #me-panel h2 {
      margin: 0 0 4px;
      font-size: 19px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--me-rojo);
    }
    #me-panel .me-sub {
      color: var(--me-texto-tenue);
      font-size: 13px;
      margin-bottom: 16px;
      line-height: 1.4;
    }

    #me-btn-toggle {
      width: 100%;
      padding: 14px;
      border-radius: 12px;
      border: none;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: .2px;
      cursor: pointer;
      background: var(--me-rojo);
      color: white;
      transition: background .15s ease;
    }
    #me-btn-toggle.me-on { background: #2a2f3a; }
    #me-btn-toggle:active { opacity: .85; }

    #me-estado {
      margin-top: 14px;
      font-size: 13px;
      color: var(--me-texto-tenue);
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 18px;
    }
    #me-estado .me-punto {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--me-texto-tenue);
      flex: none;
    }
    #me-estado.me-buscando .me-punto {
      background: #ffb020;
      animation: me-parpadeo 1s infinite;
    }
    @keyframes me-parpadeo { 50% { opacity: .25; } }

    #me-mi-id {
      margin-top: 8px;
      font-size: 12px;
      color: var(--me-texto-tenue);
    }
    #me-mi-id b { color: var(--me-texto); letter-spacing: 1px; }

    #me-lista {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .me-item {
      background: #1b1f29;
      border: 1px solid var(--me-borde);
      border-radius: 10px;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
    }
    .me-item .me-id { font-weight: 700; letter-spacing: 1px; }
    .me-badge {
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 20px;
      font-weight: 600;
    }
    .me-badge.buscando  { background: #3a3320; color: #ffb020; }
    .me-badge.conectando{ background: #26314a; color: #6aa0ff; }
    .me-badge.conectado { background: #1f3a26; color: #3ddc6a; }
    .me-badge.fallo     { background: #3a2020; color: #ff6a6a; }

    #me-log-wrap { display: none; margin-top: 16px; }
    #me-log-wrap.me-visible { display: block; }
    #me-log {
      background: #0a0c11;
      border: 1px solid var(--me-borde);
      border-radius: 10px;
      padding: 10px;
      height: 110px;
      overflow-y: auto;
      font-size: 12px;
      color: #c9d1d9;
      font-family: ui-monospace, monospace;
    }
    #me-log div { margin-bottom: 4px; }

    #me-envio { display: flex; gap: 8px; margin-top: 10px; }
    #me-envio input {
      flex: 1;
      background: #0a0c11;
      border: 1px solid var(--me-borde);
      border-radius: 8px;
      padding: 10px;
      color: var(--me-texto);
      font-size: 13px;
    }
    #me-envio button {
      background: var(--me-rojo);
      border: none;
      color: white;
      border-radius: 8px;
      padding: 0 16px;
      font-weight: 700;
      cursor: pointer;
    }

    #me-cerrar {
      position: absolute;
      top: 14px;
      right: 16px;
      background: none;
      border: none;
      color: var(--me-texto-tenue);
      font-size: 20px;
      cursor: pointer;
    }

    .me-fila-alarmas {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }
    .me-btn-alarma {
      flex: 1;
      padding: 10px 6px;
      border-radius: 10px;
      border: 1px solid var(--me-borde);
      background: #1b1f29;
      color: var(--me-texto);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .me-btn-alarma:active { background: #262c3a; }
    .me-btn-alarma-stop { flex: 0 0 76px; }

    /* Botón de huida: lo más importante del panel, siempre visible */
    #me-btn-huir {
      width: 100%;
      margin-top: 12px;
      min-height: 56px;
      padding: 14px;
      border-radius: 12px;
      border: 2px solid #ffd54f;
      background: #1b1f29;
      color: #ffd54f;
      font-size: 16px;
      font-weight: 800;
      letter-spacing: .3px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    #me-btn-huir:active { background: #262c3a; }
    #me-btn-huir svg { flex: none; }
    #me-huir-estado {
      margin-top: 8px;
      font-size: 12px;
      color: var(--me-texto-tenue);
      min-height: 16px;
      text-align: center;
    }

    /* Vigilancia de proximidad: secundaria, dentro del panel (nada flota en el mapa) */
    #me-btn-vigilar {
      width: 100%;
      margin-top: 8px;
      min-height: 48px;
      padding: 10px;
      border-radius: 12px;
      border: 1px solid var(--me-borde);
      background: #1b1f29;
      color: var(--me-texto);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    #me-btn-vigilar:active { background: #262c3a; }
    #me-btn-vigilar[aria-pressed="true"] {
      border-color: #3ddc6a;
      color: #3ddc6a;
    }
  `;

  // Textos con traducción en caliente si idiomas.js está cargado
  function tme(clave, fallback) {
    const s = (typeof window.t === 'function') ? window.t(clave) : clave;
    return (!s || s === clave) ? fallback : s;
  }

  // ============================================================
  // 2. HTML
  // ============================================================
  const ICONO_TRIANGULO = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L1 21H23L12 3Z" fill="white"/>
      <rect x="11" y="9" width="2" height="6" fill="#b30015"/>
      <rect x="11" y="16.5" width="2" height="2" fill="#b30015"/>
    </svg>
  `;

  const HTML = `
    <button id="me-fab" title="Modo Emergencia">${ICONO_TRIANGULO}</button>
    <div id="me-overlay">
      <div id="me-panel" style="position:relative;">
        <button id="me-cerrar">✕</button>
        <h2>${ICONO_TRIANGULO.replace('width:30','width:20')} Modo Emergencia</h2>
        <div class="me-sub">
          Detecta a otras personas cerca por ultrasonido y abre una conexión
          directa (WebRTC) para intercambiar datos de peligro, sin depender
          de que todo el mundo tenga internet en ese momento.
        </div>

        <button id="me-btn-toggle">Activar modo emergencia</button>

        <button id="me-btn-huir" type="button"></button>
        <div id="me-huir-estado" role="status" aria-live="polite"></div>
        <button id="me-btn-vigilar" type="button" aria-pressed="false"></button>

        <div class="me-fila-alarmas">
          <button class="me-btn-alarma" id="me-btn-sirena" title="Sirena audible para que personas cercanas te localicen">Sirena</button>
          <button class="me-btn-alarma" id="me-btn-sos" title="SOS en morse, audible (··· −−− ···)">SOS sonoro</button>
          <button class="me-btn-alarma me-btn-alarma-stop" id="me-btn-silencio" title="Callar todas las alarmas">Silencio</button>
        </div>

        <div id="me-estado"><span class="me-punto"></span><span id="me-estado-txt">Modo desactivado</span></div>
        <div id="me-mi-id"></div>

        <div id="me-lista"></div>

        <div id="me-log-wrap">
          <div id="me-log"></div>
          <div id="me-envio">
            <input id="me-input" placeholder="Mensaje de prueba..." />
            <button id="me-enviar">Enviar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // ============================================================
  // 3. LÓGICA
  // ============================================================
  // STUN solo descubre tu IP pública. En redes móviles con NAT
  // simétrico (muy común en 4G/5G) STUN NO BASTA y WebRTC no conecta:
  // hace falta un servidor TURN que retransmita el tráfico. Si tienes
  // uno, configúralo en tu index.html ANTES de este script:
  //
  //   <script>
  //     window.MANOLIT_TURN = {
  //       urls: 'turn:tu-servidor-turn.com:3478',
  //       username: 'usuario',
  //       credential: 'clave'
  //     };
  //   </script>
  const RTC_CONFIG = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ].concat(window.MANOLIT_TURN ? [window.MANOLIT_TURN] : [])
  };
  const INTERVALO_SONDEO_MS = 1500; // cada cuánto pregunta al Worker si hay mensajes

  class GestorEmergencia {
    constructor() {
      this.activo = false;
      this.baliza = null;
      this.conexiones = new Map(); // id remoto -> { pc, canalDatos, estado }
      this._timerSondeo = null;
      this._meshVistos = new Map(); // ids de mensajes de emergencia ya procesados
      this._candidatosPendientes = new Map(); // id remoto -> candidatos ICE que llegaron antes que la oferta/respuesta
      this._montarUI();
      // Ahorro de batería: pwa-offline.js emite estos eventos al ocultar/mostrar la pestaña
      window.addEventListener('manolito:pausa', () => { clearInterval(this._timerSondeo); this._timerSondeo = null; });
      window.addEventListener('manolito:reanudar', () => { if (this.activo && !this._timerSondeo) this._iniciarSondeoSenales(); });
    }

    // ---------- UI ----------
    _montarUI() {
      const estilo = document.createElement('style');
      estilo.textContent = CSS;
      document.head.appendChild(estilo);

      const contenedor = document.createElement('div');
      contenedor.innerHTML = HTML;
      document.body.appendChild(contenedor);

      this.$fab = document.getElementById('me-fab');
      this.$overlay = document.getElementById('me-overlay');
      this.$cerrar = document.getElementById('me-cerrar');
      this.$toggle = document.getElementById('me-btn-toggle');
      this.$estado = document.getElementById('me-estado');
      this.$estadoTxt = document.getElementById('me-estado-txt');
      this.$miId = document.getElementById('me-mi-id');
      this.$lista = document.getElementById('me-lista');
      this.$logWrap = document.getElementById('me-log-wrap');
      this.$log = document.getElementById('me-log');
      this.$input = document.getElementById('me-input');
      this.$enviar = document.getElementById('me-enviar');
      this.$huir = document.getElementById('me-btn-huir');
      this.$huirEstado = document.getElementById('me-huir-estado');
      this.$vigilar = document.getElementById('me-btn-vigilar');

      // Textos traducibles del botón de huida
      const ICONO_FLECHA = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2 L19 21 L12 17 L5 21 Z" fill="currentColor"/></svg>';
      const ponerTextosHuir = () => {
        this.$huir.innerHTML = ICONO_FLECHA + '<span>' + tme('me.huir', 'Huir del incendio') + '</span>';
        this.$huir.setAttribute('aria-label', tme('me.huirAria', 'Activa la guía de escape con flechas usando el GPS y la brújula de tu móvil. Te pedirá permiso de ubicación.'));
      };
      ponerTextosHuir();
      document.addEventListener('manolito:idioma-cambiado', ponerTextosHuir);
      window.addEventListener('manolitoforestal:idioma-cambiado', ponerTextosHuir);

      this.$huir.addEventListener('click', () => this._iniciarGuiaEscape());

      // Vigilancia de proximidad: avisa (banner cerrable) si un perímetro
      // activo se acerca. Vive aquí, en el panel — nada flota en el mapa.
      const vigilanciaActiva = () => !!(window.manolitoEvacuacion && window.manolitoEvacuacion.estado && window.manolitoEvacuacion.estado.monitorizando);
      const ponerTextosVigilar = () => {
        const activa = vigilanciaActiva();
        this.$vigilar.textContent = activa
          ? tme('evac.vigilando', 'Vigilancia de proximidad activa — toca para parar')
          : tme('evac.vigilar', 'Avisarme si hay fuego cerca (usa GPS)');
        this.$vigilar.setAttribute('aria-pressed', activa ? 'true' : 'false');
      };
      ponerTextosVigilar();
      document.addEventListener('manolito:idioma-cambiado', ponerTextosVigilar);
      window.addEventListener('manolitoforestal:idioma-cambiado', ponerTextosVigilar);
      this.$vigilar.addEventListener('click', () => {
        if (!window.manolitoEvacuacion) {
          this.$huirEstado.textContent = tme('evac.sinDatos', 'Sin datos de incendios. Muévase en dirección contraria al humo y llame al 112.');
          return;
        }
        if (vigilanciaActiva()) window.manolitoEvacuacion.detenerVigilancia();
        else window.manolitoEvacuacion.vigilar();
        ponerTextosVigilar();
      });

      this.$fab.addEventListener('click', () => {
        ponerTextosVigilar(); // por si la vigilancia cambió con el panel cerrado
        this.$overlay.classList.add('me-abierto');
      });
      this.$cerrar.addEventListener('click', () => this.$overlay.classList.remove('me-abierto'));
      this.$overlay.addEventListener('click', (e) => { if (e.target === this.$overlay) this.$overlay.classList.remove('me-abierto'); });
      this.$toggle.addEventListener('click', () => this.activo ? this.desactivar() : this.activar());
      this.$enviar.addEventListener('click', () => this._enviarPrueba());

      // Alarmas audibles: para que PERSONAS te oigan (la baliza
      // ultrasónica es para que te detecten otros móviles).
      const btnSirena = document.getElementById('me-btn-sirena');
      const btnSos = document.getElementById('me-btn-sos');
      const btnSilencio = document.getElementById('me-btn-silencio');
      if (btnSirena) btnSirena.addEventListener('click', () => {
        if (window.BalizaUltrasonica) { window.BalizaUltrasonica.emitirSirena(8); this._log('Sirena audible emitiendo (8 s)'); }
      });
      if (btnSos) btnSos.addEventListener('click', () => {
        if (window.BalizaUltrasonica) { window.BalizaUltrasonica.emitirSOSMorse(); this._log('SOS en morse emitiendo'); }
      });
      if (btnSilencio) btnSilencio.addEventListener('click', () => {
        if (window.BalizaUltrasonica) { window.BalizaUltrasonica.pararAlarmas(); this._log('Alarmas detenidas'); }
      });
    }

    _log(msg) {
      const linea = document.createElement('div');
      const hora = new Date().toLocaleTimeString();
      linea.textContent = `[${hora}] ${msg}`;
      this.$log.appendChild(linea);
      this.$log.scrollTop = this.$log.scrollHeight;
    }

    // ---------- ACTIVAR / DESACTIVAR ----------
    async activar() {
      if (typeof window.BalizaUltrasonica !== 'function') {
        this.$estadoTxt.textContent = 'Falta baliza-ultrasonica.js en la página';
        return;
      }

      this.baliza = new window.BalizaUltrasonica((idDetectado) => this._alDetectarDispositivo(idDetectado));
      try {
        await this.baliza.iniciar();
      } catch (e) {
        this.$estadoTxt.textContent = 'No se pudo activar el micrófono';
        this._log('Error al iniciar la baliza: ' + e.message);
        return;
      }

      this.activo = true;
      this.$fab.classList.add('me-activo');
      this.$toggle.textContent = 'Desactivar modo emergencia';
      this.$toggle.classList.add('me-on');
      this.$estado.classList.add('me-buscando');
      this.$estadoTxt.textContent = 'Buscando dispositivos cercanos...';
      this.$miId.innerHTML = `Tu ID de emergencia: <b>${this.baliza.idPropio}</b>`;
      this.$logWrap.classList.add('me-visible');

      this._iniciarSondeoSenales();
      this._log('Modo emergencia activado. Escuchando ultrasonidos...');
    }

    desactivar() {
      this.activo = false;
      if (this.baliza) this.baliza.detener();
      if (this._timerSondeo) { clearInterval(this._timerSondeo); this._timerSondeo = null; }

      for (const [, info] of this.conexiones) {
        try { info.pc.close(); } catch (e) {}
      }
      this.conexiones.clear();
      this.$lista.innerHTML = '';

      this.$fab.classList.remove('me-activo');
      this.$toggle.textContent = 'Activar modo emergencia';
      this.$toggle.classList.remove('me-on');
      this.$estado.classList.remove('me-buscando');
      this.$estadoTxt.textContent = 'Modo desactivado';
      this._log('Modo emergencia desactivado.');
    }

    // ---------- GUÍA DE ESCAPE (flechas GPS + brújula) ----------
    // Pide permiso de ubicación (gesto del usuario), centra el mapa en la
    // posición real y arranca el módulo de evacuación (evacuacion.js), que
    // pinta la flecha parpadeante hacia la zona segura y repite el rumbo
    // en voz alta cada 10 s. Todo el cálculo ocurre en el propio móvil.
    _iniciarGuiaEscape() {
      if (!('geolocation' in navigator)) {
        this.$huirEstado.textContent = tme('evac.sinGps', 'GPS no disponible. Active la ubicación del dispositivo.');
        return;
      }
      this.$huirEstado.textContent = tme('me.ubicando', 'Obteniendo tu ubicación…');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const mapa = window.manolitoMapa || window.map;
          if (mapa && mapa.setView) mapa.setView([latitude, longitude], Math.max(mapa.getZoom(), 15));
          this.$huirEstado.textContent = tme('me.guiaActiva', 'Guía de escape activa. Sigue la flecha.');
          if (window.manolitoEvacuacion && typeof window.manolitoEvacuacion.iniciar === 'function') {
            this.$overlay.classList.remove('me-abierto');
            window.manolitoEvacuacion.iniciar();
          } else {
            this.$huirEstado.textContent = tme('evac.sinDatos', 'Sin datos de incendios. Muévase en dirección contraria al humo y llame al 112.');
          }
        },
        (err) => {
          // Diagnóstico claro: permiso denegado, sin señal o timeout
          let clave = 'evac.sinGps';
          let fb = 'GPS no disponible. Active la ubicación del dispositivo.';
          if (err && err.code === 1) {
            clave = 'evac.errorPermiso';
            fb = 'Permiso de ubicación denegado. Actívalo en los ajustes del navegador.';
          } else if (err && err.code === 2) {
            clave = 'evac.errorSinSenal';
            fb = 'Sin señal de ubicación. Sal a cielo abierto o activa la ubicación del sistema.';
          } else if (err && err.code === 3) {
            clave = 'evac.errorTimeout';
            fb = 'El GPS tarda demasiado en responder. Inténtalo de nuevo a cielo abierto.';
          }
          this.$huirEstado.textContent = tme(clave, fb);
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
      );
    }

    // ---------- DETECCIÓN POR ULTRASONIDO ----------
    _alDetectarDispositivo(idRemoto) {
      // Si ya hay conexión viva o en curso, no duplicar; pero si FALLÓ
      // y el móvil sigue emitiendo su baliza, se reintenta solo.
      if (this.conexiones.has(idRemoto)) {
        const previa = this.conexiones.get(idRemoto);
        if (previa.estado !== 'fallo') return;
        try { previa.pc.close(); } catch (e) {}
        this.conexiones.delete(idRemoto);
        this._log(`Reintentando conexión con ${idRemoto}...`);
      }
      this._log(`Dispositivo detectado cerca: ${idRemoto}`);
      this._actualizarBadge(idRemoto, 'buscando');

      const idPropio = this.baliza.idPropio;
      const soyIniciador = idPropio < idRemoto; // regla determinista, evita choque

      this._crearConexionWebRTC(idRemoto, soyIniciador);
    }

    // ---------- WEBRTC ----------
    _crearConexionWebRTC(idRemoto, soyIniciador) {
      const pc = new RTCPeerConnection(RTC_CONFIG);
      const info = { pc, canalDatos: null, estado: 'conectando' };
      this.conexiones.set(idRemoto, info);
      this._actualizarBadge(idRemoto, 'conectando');

      pc.onicecandidate = (evento) => {
        if (evento.candidate) {
          this._enviarSenal(idRemoto, { tipo: 'candidato', candidato: evento.candidate });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') {
          info.estado = 'conectado';
          this._actualizarBadge(idRemoto, 'conectado');
          this._log(`Conectado con ${idRemoto}. Canal de datos de peligro listo.`);
        } else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
          info.estado = 'fallo';
          this._actualizarBadge(idRemoto, 'fallo');
        }
      };

      if (soyIniciador) {
        const canal = pc.createDataChannel('peligro');
        this._prepararCanalDatos(canal, idRemoto, info);

        pc.createOffer()
          .then((oferta) => pc.setLocalDescription(oferta))
          .then(() => this._enviarSenal(idRemoto, { tipo: 'oferta', sdp: pc.localDescription }));
      } else {
        pc.ondatachannel = (evento) => this._prepararCanalDatos(evento.channel, idRemoto, info);
      }
    }

    _prepararCanalDatos(canal, idRemoto, info) {
      info.canalDatos = canal;
      canal.onopen = () => this._log(`Canal de datos abierto con ${idRemoto}`);
      // NUEVO: además del log normal, cualquier mensaje que llegue se
      // pasa por el protocolo mesh para ver si hay que retransmitirlo.
      canal.onmessage = (evento) => {
        this._log(`${idRemoto} → ${evento.data}`);
        this._meshAlLlegarMensaje(evento.data, idRemoto);
      };
    }

    async _alRecibirSenal(idRemoto, mensaje) {
      let info = this.conexiones.get(idRemoto);

      if (mensaje.tipo === 'oferta') {
        if (!info) {
          this._crearConexionWebRTC(idRemoto, false);
          info = this.conexiones.get(idRemoto);
        }
        await info.pc.setRemoteDescription(new RTCSessionDescription(mensaje.sdp));
        await this._vaciarCandidatosPendientes(idRemoto, info);
        const respuesta = await info.pc.createAnswer();
        await info.pc.setLocalDescription(respuesta);
        this._enviarSenal(idRemoto, { tipo: 'respuesta', sdp: info.pc.localDescription });
        return;
      }

      // Cloudflare KV no garantiza el orden de entrega: un candidato ICE
      // puede llegar ANTES que la oferta/respuesta a la que pertenece.
      // Antes se descartaba en silencio y la conexión moría sin motivo
      // aparente. Ahora se encola y se aplica cuando toca.
      if (mensaje.tipo === 'candidato') {
        if (!info || !info.pc.remoteDescription) {
          if (!this._candidatosPendientes.has(idRemoto)) this._candidatosPendientes.set(idRemoto, []);
          this._candidatosPendientes.get(idRemoto).push(mensaje.candidato);
          return;
        }
        try { await info.pc.addIceCandidate(mensaje.candidato); } catch (e) {}
        return;
      }

      if (!info) return;

      if (mensaje.tipo === 'respuesta') {
        await info.pc.setRemoteDescription(new RTCSessionDescription(mensaje.sdp));
        await this._vaciarCandidatosPendientes(idRemoto, info);
      }
    }

    async _vaciarCandidatosPendientes(idRemoto, info) {
      const pendientes = this._candidatosPendientes.get(idRemoto) || [];
      for (const candidato of pendientes) {
        try { await info.pc.addIceCandidate(candidato); } catch (e) {}
      }
      this._candidatosPendientes.delete(idRemoto);
      if (pendientes.length) this._log(`Aplicados ${pendientes.length} candidato(s) ICE que habían llegado antes de tiempo`);
    }

    // ---------- SEÑALIZACIÓN AUTOMÁTICA VÍA TU WORKER ----------
    // Un móvil deja el mensaje con POST /senal, el otro lo recoge
    // preguntando con GET /senal?para=SU_ID. No hay que copiar nada.
    _enviarSenal(destino, mensaje) {
      const conRemitente = Object.assign({ de: this.baliza.idPropio }, mensaje);
      fetch('/senal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ de: this.baliza.idPropio, para: destino, datos: conRemitente })
      }).catch((e) => this._log('No se pudo enviar la señal: ' + e.message));
    }

    _iniciarSondeoSenales() {
      this._timerSondeo = setInterval(async () => {
        if (!this.activo || !this.baliza) return;
        try {
          const resp = await fetch(`/senal?para=${encodeURIComponent(this.baliza.idPropio)}`);
          if (!resp.ok) return;
          const mensajes = await resp.json();
          for (const m of mensajes) {
            this._alRecibirSenal(m.de, m.datos);
          }
        } catch (e) {
          // Fallo de red puntual: no pasa nada, se reintenta en el
          // siguiente ciclo de sondeo.
        }
      }, INTERVALO_SONDEO_MS);
    }

    // ---------- UI: lista de dispositivos ----------
    _actualizarBadge(id, estado) {
      let item = document.getElementById('me-item-' + id);
      if (!item) {
        item = document.createElement('div');
        item.id = 'me-item-' + id;
        item.className = 'me-item';
        item.innerHTML = `<span class="me-id">${id}</span><span class="me-badge"></span>`;
        this.$lista.appendChild(item);
      }
      const badge = item.querySelector('.me-badge');
      badge.className = 'me-badge ' + estado;
      const etiquetas = { buscando: 'buscando', conectando: 'conectando', conectado: 'conectado', fallo: 'fallo' };
      badge.textContent = etiquetas[estado] || estado;
    }

    // ---------- Enviar datos de peligro reales (mensaje suelto, sin mesh) ----------
    enviarDatoPeligro(objeto) {
      const texto = JSON.stringify(objeto);
      let enviados = 0;
      for (const [, info] of this.conexiones) {
        if (info.canalDatos && info.canalDatos.readyState === 'open') {
          info.canalDatos.send(texto);
          enviados++;
        }
      }
      this._log(`Dato de peligro enviado a ${enviados} dispositivo(s)`);
      return enviados;
    }

    _enviarPrueba() {
      const texto = this.$input.value.trim();
      if (!texto) return;
      const enviados = this.enviarDatoPeligro({ tipo: 'prueba', texto, ts: Date.now() });
      if (enviados === 0) this._log('No hay ninguna conexión abierta todavía con nadie');
      this.$input.value = '';
    }

    // ============================================================
    // 4. PROTOCOLO MESH — retransmisión automática entre móviles
    // ============================================================

    // Llama a esto para mandar una emergencia nueva a toda la red.
    // Ejemplo: gestorEmergencia.emitirEmergencia('FUEGO', { lat: 37.38, lng: -5.99 })
    emitirEmergencia(codigoTexto, datosExtra) {
      datosExtra = datosExtra || {};
      const codigo = MESH_CODIGOS[codigoTexto];
      if (!codigo) {
        console.warn('[Mesh] Código desconocido:', codigoTexto, '— usa uno de:', Object.keys(MESH_CODIGOS).join(', '));
        return null;
      }

      const mensaje = Object.assign({
        tipo: 'emergencia-mesh',
        id: this._meshGenerarId(),
        codigo: codigo,
        ttl: MESH_TTL_MAXIMO,
        de: (this.baliza && this.baliza.idPropio) || '??????',
        ts: Date.now(),
      }, datosExtra);

      this._meshVistos.set(mensaje.id, Date.now());
      const enviados = this._meshDifundir(mensaje, null);
      this._log(`Emergencia emitida (${MESH_NOMBRES[codigo]}) a ${enviados} dispositivo(s)`);
      return mensaje;
    }

    // Se llama automáticamente desde _prepararCanalDatos cada vez que
    // llega cualquier mensaje por el canal de datos.
    _meshAlLlegarMensaje(datoTexto, idRemoto) {
      let mensaje;
      try {
        mensaje = JSON.parse(datoTexto);
      } catch (e) {
        return; // no era JSON, se ignora
      }
      if (!mensaje || mensaje.tipo !== 'emergencia-mesh' || !mensaje.id) return;

      if (this._meshVistos.has(mensaje.id)) return; // repetido, no lo proceses dos veces
      this._meshVistos.set(mensaje.id, Date.now());
      this._meshLimpiarAntiguos();

      const nombre = MESH_NOMBRES[mensaje.codigo] || 'Emergencia';
      this._log(`${nombre} — recibida vía ${idRemoto}, reenviando a la red...`);
      window.dispatchEvent(new CustomEvent('manolit:emergencia', { detail: mensaje }));

      // Reenvía a los demás, con un pequeño retraso al azar para que no
      // todos los móviles reenvíen exactamente en el mismo instante.
      if (mensaje.ttl > 0) {
        const paraReenviar = Object.assign({}, mensaje, { ttl: mensaje.ttl - 1 });
        setTimeout(() => this._meshDifundir(paraReenviar, idRemoto), Math.random() * 300);
      }
    }

    _meshDifundir(mensaje, idQueLoEnvio) {
      const texto = JSON.stringify(mensaje);
      let enviados = 0;
      for (const [idVecino, info] of this.conexiones) {
        if (idVecino === idQueLoEnvio) continue; // no se lo devuelvas a quien te lo mandó
        if (info.canalDatos && info.canalDatos.readyState === 'open') {
          info.canalDatos.send(texto);
          enviados++;
        }
      }
      return enviados;
    }

    _meshGenerarId() {
      return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }

    _meshLimpiarAntiguos() {
      const ahora = Date.now();
      for (const [id, ts] of this._meshVistos) {
        if (ahora - ts > MESH_VENTANA_REPETIDOS_MS) this._meshVistos.delete(id);
      }
    }
  }

  window.gestorEmergencia = new GestorEmergencia();

  // API pública mínima para el resto de tu app:
  //   window.gestorEmergencia.activar()
  //   window.gestorEmergencia.enviarDatoPeligro({ lat, lng, tipo: 'incendio' })
  //   window.gestorEmergencia.emitirEmergencia('FUEGO', { lat, lng })
})();

;

/* ==================== motor-fuego-cientifico.js ==================== */
/**
 * MANOLIT∞ FORESTAL - MOTOR CIENTÍFICO DE COMPORTAMIENTO DEL FUEGO
 * =================================================================
 * Este módulo sustituye las "estimaciones a ojo" por los modelos que usa
 * la ciencia operativa real de incendios forestales:
 *
 *   1. ÍNDICE DE PELIGRO METEOROLÓGICO — Fosberg Fire Weather Index
 *      (Fosberg, 1978). Lo usan los servicios meteorológicos de EE.UU.
 *      (NWS) para el "fire weather". Solo necesita temperatura, humedad
 *      relativa y viento: exactamente lo que ya tenemos de Open-Meteo.
 *      La humedad de equilibrio del combustible fino (EMC) que calcula
 *      se reutiliza como humedad del combustible de 1 hora en Rothermel.
 *
 *   2. VELOCIDAD DE PROPAGACIÓN — Modelo de Rothermel (1972, USDA),
 *      el estándar mundial (es el núcleo de BehavePlus, FARSITE, FlamMap
 *      y WRF-Fire), con los 13 modelos de combustible de Anderson (1982).
 *      Validado contra salidas de referencia de BehavePlus:
 *        - Modelo 9, humedad 6%, viento media llama 5 mph -> 8,7 ch/h (ref: 6-8)
 *        - Modelo 8, humedad 6%, viento media llama 5 mph -> 1,9 ch/h (ref: 1,5-3)
 *
 *   3. INTENSIDAD Y LLAMA — Byram (1959): intensidad de línea de fuego
 *      I = H·w·R y longitud de llama L = 0,0775·I^0,46.
 *
 *   4. ZONA DE SEGURIDAD — Butler & Cohen (1998, USFS): distancia mínima
 *      de separación = 4 × altura de llama (criterio operativo real para
 *      definir "safety zones" en incendios).
 *
 *   5. ESCAPE — geometría del incendio: el fuego avanza a sotavento
 *      (cabeza), los flancos van a ±90°, la cola está a barlovento
 *      (zona ya quemada = refugio). Se calculan azimuts concretos.
 *
 *   6. PENDIENTE — se estima con la API de elevación de Open-Meteo
 *      (una sola llamada, 5 puntos) y entra en Rothermel como factor
 *      de pendiente phi_s (el fuego acelera cuesta arriba).
 *
 * Límite de viento: siguiendo la recomendación de Andrews, Cruz y
 * Rothermel (2013, Int. J. Wildland Fire), NO se aplica el límite de
 * viento clásico (demasiado restrictivo); solo se impide que la ROS
 * supere la propia velocidad del viento a media llama (físicamente
 * imposible para un frente sostenido por convección).
 *
 * Expone: window.MotorFuego
 */

(function () {
'use strict';

// ============================================================
// 1. MODELOS DE COMBUSTIBLE DE ANDERSON (1982) — datos USFS
//    cargas en lb/ft², sigma en ft⁻¹, profundidad en ft, Mx en %
// ============================================================
const MODELOS_COMBUSTIBLE = {
    1:  { w: [0.034, 0, 0, 0, 0],                 sig1: 3500, prof: 1.0, mx: 12, nombre: 'Hierba corta' },
    2:  { w: [0.092, 0.046, 0.023, 0.023, 0],     sig1: 3000, prof: 1.0, mx: 15, nombre: 'Hierba con sotobosque' },
    3:  { w: [0.138, 0, 0, 0, 0],                 sig1: 1500, prof: 2.5, mx: 25, nombre: 'Hierba alta' },
    4:  { w: [0.230, 0.184, 0.092, 0, 0.230],     sig1: 2000, prof: 6.0, mx: 20, nombre: 'Chaparral / matorral alto denso' },
    5:  { w: [0.046, 0.023, 0, 0, 0.092],         sig1: 2000, prof: 2.0, mx: 20, nombre: 'Matorral arbustivo (1-2 m)' },
    6:  { w: [0.069, 0.115, 0.092, 0, 0],         sig1: 1750, prof: 2.5, mx: 25, nombre: 'Matorral latente' },
    7:  { w: [0.052, 0.086, 0.069, 0, 0.017],     sig1: 1750, prof: 2.5, mx: 40, nombre: 'Matorral bajo con hojarasca' },
    8:  { w: [0.069, 0.046, 0.115, 0, 0],         sig1: 2000, prof: 0.2, mx: 30, nombre: 'Hojarasca de coníferas (dosel cerrado)' },
    9:  { w: [0.134, 0.019, 0.007, 0, 0],         sig1: 2500, prof: 0.2, mx: 25, nombre: 'Hojarasca de frondosas' },
    10: { w: [0.138, 0.092, 0.230, 0, 0.092],     sig1: 2000, prof: 1.0, mx: 25, nombre: 'Bosque con sotobosque y combustible muerto' },
    11: { w: [0.069, 0.207, 0.253, 0, 0],         sig1: 1500, prof: 1.0, mx: 15, nombre: 'Restos de corta ligeros' },
    12: { w: [0.184, 0.644, 0.759, 0, 0],         sig1: 1500, prof: 2.3, mx: 15, nombre: 'Restos de corta medios' },
    13: { w: [0.322, 1.058, 1.288, 0, 0],         sig1: 1500, prof: 3.0, mx: 15, nombre: 'Restos de corta pesados' },
};

const SIG10 = 109.0, SIG100 = 30.0;   // ft⁻¹, fijos en Rothermel
const RHO_P = 32.0;                   // lb/ft³ densidad de partícula
const S_T = 0.0555, S_E = 0.010;      // contenido mineral total / efectivo
const HEAT_BTU_LB = 8000.0;           // contenido calorífico bajo
const WAF_MEDIA_LLAMA = 0.5;          // reducción viento 10m -> media llama (aprox. estándar)

// ============================================================
// 2. FOSBERG FIRE WEATHER INDEX (1978) + EMC
//    La EMC (humedad de equilibrio del combustible fino) es la
//    humedad de combustible de 1 hora que entra en Rothermel.
// ============================================================
function humedadCombustible1h(tempC, humPct) {
    const T = tempC * 9 / 5 + 32;  // las ecuaciones originales van en °F
    const h = humPct;
    let m;
    if (h < 10)       m = 0.03229 + 0.281073 * h - 0.000578 * h * T;
    else if (h <= 50) m = 2.22749 + 0.160107 * h - 0.014784 * T;
    else              m = 21.0606 + 0.005565 * h * h - 0.00035 * h * T - 0.483199 * h;
    return Math.min(35, Math.max(1, m)); // %
}

function fosbergFFWI(tempC, humPct, windKmh) {
    const m = humedadCombustible1h(tempC, humPct);
    const x = Math.min(m, 30) / 30;
    const n = 1 - 2 * x + 1.5 * x * x - 0.5 * x * x * x;
    const U = windKmh * 0.621371; // mph
    return n * Math.sqrt(1 + U * U) / 0.3002;
}

function nivelFFWI(ffwi) {
    if (ffwi < 25) return 'bajo';
    if (ffwi < 50) return 'moderado';
    if (ffwi < 75) return 'alto';
    return 'extremo';
}

// ============================================================
// 3. ROTHERMEL (1972) — velocidad de propagación de superficie
//    ros en m/min; pendiente en % (positiva = fuego cuesta arriba)
// ============================================================
function rothermel(modeloId, m1Pct, windKmh, pendientePct) {
    const mod = MODELOS_COMBUSTIBLE[modeloId];
    if (!mod) return null;
    const w = mod.w;
    const m10 = m1Pct + 1, m100 = m1Pct + 2;      // aprox. estándar
    const M_HERB = 30, M_WOOD = 100;              // herbáceo curado / leñoso vivo
    const sigs  = [mod.sig1, SIG10, SIG100, 1500, 1500];
    const moist = [m1Pct / 100, m10 / 100, m100 / 100, M_HERB / 100, M_WOOD / 100]; // FRACCIÓN
    const mxDead = mod.mx / 100;
    const esMuerto = [true, true, true, false, false];

    const W0 = w.reduce((a, b) => a + b, 0);
    if (W0 <= 0) return null;
    const rhoB = W0 / mod.prof;
    const beta = rhoB / RHO_P;

    // Pesos por superficie (formulación clásica de Albini 1976)
    const Adead = sigs[0] * w[0] / RHO_P + sigs[1] * w[1] / RHO_P + sigs[2] * w[2] / RHO_P;
    const Alive = sigs[3] * w[3] / RHO_P + sigs[4] * w[4] / RHO_P;
    const Atot = Adead + Alive;
    if (Atot <= 0) return null;
    const fDead = Adead / Atot, fLive = Alive / Atot;
    const g = w.map((wi, i) => {
        const denom = esMuerto[i] ? Adead : Alive;
        return denom > 0 ? (sigs[i] * wi / RHO_P) / denom : 0;
    });

    const sigma = (g[0] * sigs[0] + g[1] * sigs[1] + g[2] * sigs[2]) * fDead
                + (g[3] * sigs[3] + g[4] * sigs[4]) * fLive;
    if (sigma <= 0) return null;

    const betaOp = 3.348 * Math.pow(sigma, -0.8189);
    const Aw = 133 * Math.pow(sigma, -0.7913);
    const gammaMax = Math.pow(sigma, 1.5) / (495 + 0.0594 * Math.pow(sigma, 1.5));
    const gamma = gammaMax * Math.pow(beta / betaOp, Aw) * Math.exp(Aw * (1 - beta / betaOp));

    const Mdead = g[0] * moist[0] + g[1] * moist[1] + g[2] * moist[2];
    const Mlive = g[3] * moist[3] + g[4] * moist[4];
    const damp = r => { r = Math.min(r, 1); return Math.max(0, 1 - 2.59 * r + 5.11 * r * r - 3.52 * r * r * r); };
    const etaDead = damp(Mdead / mxDead);
    const etaLive = Alive > 0 ? damp(Mdead > 0 ? Mlive / Mdead : 0) : 0;
    const etaS = 0.174 * Math.pow(S_E, -0.19);

    const wnDead = (g[0] * w[0] + g[1] * w[1] + g[2] * w[2]) * (1 - S_T);
    const wnLive = (g[3] * w[3] + g[4] * w[4]) * (1 - S_T);

    const IR = gamma * (wnDead * etaDead + wnLive * etaLive) * HEAT_BTU_LB * etaS; // Btu/ft²/min

    const xi = Math.pow(192 + 0.2595 * sigma, -1) * Math.exp((0.792 + 0.681 * Math.sqrt(sigma)) * (beta + 0.1));

    const U = windKmh * 54.6807 * WAF_MEDIA_LLAMA; // ft/min a media llama
    const C = 7.47 * Math.exp(-0.133 * Math.pow(sigma, 0.55));
    const B = 0.02526 * Math.pow(sigma, 0.54);
    const E = 0.715 * Math.exp(-3.59e-4 * sigma);
    const phiW = C * Math.pow(U, B) * Math.pow(beta / betaOp, -E);

    const tanPhi = Math.max(0, pendientePct || 0) / 100;
    const phiS = 5.275 * Math.pow(beta, -0.3) * tanPhi * tanPhi;

    const QigDead = g[0] * (250 + 1116 * moist[0]) + g[1] * (250 + 1116 * moist[1]) + g[2] * (250 + 1116 * moist[2]);
    const QigLive = g[3] * (250 + 1116 * moist[3]) + g[4] * (250 + 1116 * moist[4]);
    const Qig = QigDead * fDead + QigLive * fLive; // Btu/lb
    const eps = Math.exp(-138 / sigma);

    let RftMin = IR * xi * (1 + phiW + phiS) / (rhoB * eps * Qig); // ft/min
    if (!isFinite(RftMin) || RftMin < 0) RftMin = 0;

    // Recomendación de Andrews, Cruz & Rothermel (2013): la ROS no puede
    // superar el viento efectivo a media llama.
    const UeffMMin = windKmh * 1000 / 60 * WAF_MEDIA_LLAMA;
    let RmMin = RftMin * 0.3048;
    if (RmMin > UeffMMin) RmMin = UeffMMin;

    // Byram: intensidad de línea I = H·w·R  (H=18000 kJ/kg poder calorífico de emisión)
    const wConsumKgm2 = (wnDead + wnLive) * 4.8824 * 0.75; // 75% del fino se consume
    const IkwM = 18000 * wConsumKgm2 * (RmMin / 60);

    // Longitud de llama de Byram (m)
    const llamaM = IkwM > 0 ? 0.0775 * Math.pow(IkwM, 0.46) : 0;

    return {
        rosMMin: RmMin,
        intensidadKwM: IkwM,
        llamaM,
        distanciaSeguridadM: llamaM * 4, // Butler & Cohen 1998
        humedad1h: m1Pct,
        modeloId,
        modeloNombre: mod.nombre,
        cargaTotalTHa: W0 * 48.82,       // lb/ft² -> t/ha (biomasa superficial disponible)
        pendientePct: pendientePct || 0
    };
}

// ============================================================
// 4. MAPEO VEGETACIÓN (OpenStreetMap) -> MODELO DE ANDERSON
// ============================================================
function mapearVegetacionAModelo(vegetacionTexto, tipoCubierta) {
    const t = (vegetacionTexto || '').toLowerCase();
    const c = (tipoCubierta || '').toLowerCase();

    if (c.includes('scrub') || c.includes('heath') || t.includes('matorral') || t.includes('scrub') || t.includes('heath'))
        return 5;   // matorral arbustivo (modelo 5; chaparral muy denso sería 4)
    if (c.includes('grass') || c.includes('meadow') || t.includes('grass') || t.includes('herb'))
        return 2;   // hierba con algo de sotobosque
    if (t.includes('needle') || t.includes('conifer') || t.includes('pinus') || t.includes('pino') || t.includes('abies') || t.includes('picea'))
        return 8;   // hojarasca de coníferas
    if (t.includes('broadleaf') || t.includes('quercus') || t.includes('roble') || t.includes('haya') || t.includes('fagus') || t.includes('encina'))
        return 9;   // hojarasca de frondosas
    return 10;      // bosque mixto con sotobosque: el caso mediterráneo más común
}

// ============================================================
// 5. PENDIENTE EN DIRECCIÓN DE PROPAGACIÓN (Open-Meteo, 1 llamada)
//    Muestrea 5 puntos (centro + 100 m en N/S/E/O) y estima el
//    gradiente del terreno proyectado sobre el azimut de avance.
// ============================================================
async function estimarPendiente(lat, lon, azimutDeg) {
    try {
        const dLat = 100 / 111320;
        const dLon = 100 / (111320 * Math.cos(lat * Math.PI / 180));
        const lats = [lat, lat + dLat, lat - dLat, lat, lat].join(',');
        const lons = [lon, lon, lon, lon + dLon, lon - dLon].join(',');
        const resp = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lats}&longitude=${lons}`);
        if (!resp.ok) return null;
        const data = await resp.json();
        const e = data.elevation;
        if (!e || e.length < 5) return null;
        // Gradiente hacia el norte y hacia el este (m / 100 m)
        const gradN = (e[1] - e[2]) / 2;   // % positivo = sube hacia el norte
        const gradE = (e[3] - e[4]) / 2;   // % positivo = sube hacia el este
        const az = azimutDeg * Math.PI / 180;
        const pendiente = gradN * Math.cos(az) + gradE * Math.sin(az);
        return Math.round(pendiente * 10) / 10; // % en la dirección de avance
    } catch (err) {
        return null;
    }
}

// ============================================================
// 6. GEOMETRÍA DE ESCAPE — azimuts concretos según el viento
// ============================================================
function gradosACardinal(deg) {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
    return dirs[Math.round(deg / 22.5) % 16];
}

function calcularEscape(windDirOrigen) {
    const azAvance = (windDirOrigen + 180) % 360;      // hacia dónde CORRE el fuego
    const azFlancoA = (azAvance + 90) % 360;
    const azFlancoB = (azAvance + 270) % 360;
    const azBarlovento = windDirOrigen;                // de donde viene el viento = zona ya quemada o sin quemar
    return {
        azAvance, azFlancoA, azFlancoB, azBarlovento,
        cardAvance: gradosACardinal(azAvance),
        cardFlancoA: gradosACardinal(azFlancoA),
        cardFlancoB: gradosACardinal(azFlancoB),
        cardBarlovento: gradosACardinal(azBarlovento)
    };
}

// ============================================================
// 7. EVALUACIÓN COMPLETA DE UN PUNTO
//    Entrada: lo que ya tenemos de Open-Meteo + vegetación OSM.
//    Salida: todo lo que Manolito y el panel necesitan.
// ============================================================
function evaluarPunto(o) {
    const tempC = o.tempC, humPct = o.humPct, windKmh = o.windKmh;
    if (typeof tempC !== 'number' || typeof humPct !== 'number' || typeof windKmh !== 'number') return null;

    const ffwi = fosbergFFWI(tempC, humPct, windKmh);
    const m1 = humedadCombustible1h(tempC, humPct);
    const modeloId = mapearVegetacionAModelo(o.vegetacionTexto, o.tipoCubierta);
    const ros = rothermel(modeloId, m1, windKmh, o.pendientePct || 0);

    let escape = null;
    if (typeof o.windDir === 'number') escape = calcularEscape(o.windDir);

    return {
        ffwi: Math.round(ffwi * 10) / 10,
        ffwiNivel: nivelFFWI(ffwi),
        humedadCombustible1h: Math.round(m1 * 10) / 10,
        combustible: ros ? {
            modeloId: ros.modeloId,
            nombre: ros.modeloNombre,
            cargaTHa: Math.round(ros.cargaTotalTHa * 10) / 10
        } : null,
        rosMMin: ros ? Math.round(ros.rosMMin * 100) / 100 : null,
        rosKmh: ros ? Math.round(ros.rosMMin * 60 / 10) / 100 : null,
        intensidadKwM: ros ? Math.round(ros.intensidadKwM) : null,
        llamaM: ros ? Math.round(ros.llamaM * 10) / 10 : null,
        distanciaSeguridadM: ros ? Math.round(ros.distanciaSeguridadM) : null,
        pendientePct: (typeof o.pendientePct === 'number') ? o.pendientePct : null,
        escape,
        notas: 'ROS por Rothermel (1972) con modelo Anderson ' + modeloId +
               (o.pendientePct ? ', pendiente estimada ' + o.pendientePct + '%' : ', terreno llano asumido') +
               '. Peligro meteorológico FFWI de Fosberg (1978). Llama por Byram (1959). Zona de seguridad: 4× llama (Butler & Cohen 1998).'
    };
}

window.MotorFuego = {
    evaluarPunto,
    estimarPendiente,
    fosbergFFWI,
    humedadCombustible1h,
    mapearVegetacionAModelo,
    calcularEscape,
    MODELOS_COMBUSTIBLE
};

})();
;

/* ==================== motor-cuantico.js ==================== */
/**
 * MANOLIT∞ FORESTAL - SIMULADOR CUÁNTICO DE ESTRÉS DE BIOMASA
 * Regla 30-30-30 con entrelazamiento, capas de fuego real (NASA FIRMS),
 * áreas quemadas reales (EFFIS), predicción de propagación por viento
 * y asesor Manolito.
 */

// 0. CONSTANTES Y CONFIGURACIÓN
const DOM = {
    map: 'map',
    dashboard: document.getElementById('dashboard'),
    toggleDashboardBtn: document.getElementById('toggle-dashboard'),
    toggleModeBtn: document.getElementById('toggle-mode'),
    quantumLogSection: document.getElementById('quantum-log-section'),
    logRY: document.getElementById('log-ry'),
    logCNOT: document.getElementById('log-cnot'),
    logMedicion: document.getElementById('log-medicion'),
    logDetalles: document.getElementById('log-detalles'),
    uiCoords: document.getElementById('ui-coords'),
    uiPercent: document.getElementById('ui-percent'),
    uiAlert: document.getElementById('ui-alert'),
    uiAction: document.getElementById('ui-action'),
    uiTemp: document.getElementById('ui-temp'),
    uiHum: document.getElementById('ui-hum'),
    uiWind: document.getElementById('ui-wind'),
    uiWindDir: document.getElementById('ui-wind-dir'),
    uiPropagacion: document.getElementById('ui-propagacion-texto'),
    contadorFuegos: document.getElementById('contador-fuegos'),
    reopenDashboardBtn: document.getElementById('reopen-dashboard-btn'),
    legalModal: document.getElementById('legal-modal'),
    legalContentContainer: document.getElementById('legal-content-container'),
    acceptLegalBtn: document.getElementById('accept-legal-btn'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    openLegalLink: document.getElementById('open-legal-link')
};

// Contexto compartido con Manolito (chat) y el generador de PDF
window.ultimoContextoManolito = null;

// Datos de ejemplo para la capa de fuegos. Se usan como fallback si la API
// de FIRMS no está disponible (ej. al ejecutar sin 'wrangler dev').
const CSV_EJEMPLO_FUEGOS = `latitude,longitude,bright_ti4,scan,track,acq_date,acq_time,satellite,instrument,confidence,version,bright_ti5,frp,daynight
40.4,-4.0,345.1,0.45,0.6,2024-07-25,14:30,NPP,VIIRS,h,2.0NRT,301.2,12.5,D
40.2,-4.3,338.7,0.5,0.65,2024-07-25,14:31,NPP,VIIRS,n,2.0NRT,298.0,8.1,D
40.1,-4.5,352.9,0.4,0.55,2024-07-25,14:32,NPP,VIIRS,h,2.0NRT,305.4,15.0,D`;

/**
 * Utilidad para retrasar la ejecución de una función (debounce).
 * Evita que se llame a la API de Overpass en cada clic rápido.
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => { clearTimeout(timeout); func(...args); };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 1. INICIALIZACIÓN DEL MAPA
const map = L.map('map', {
    center: [40.0, -3.0],
    zoom: 6,
    zoomControl: true
});
// Hook público para los módulos de capas (FWI, recursos, PWA offline)
window.manolitoMapa = map;

// Capas base
const baseDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CartoDB',
    subdomains: 'abcd',
    maxZoom: 20
});

const baseSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Esri, Maxar, Earthstar Geographics',
    maxZoom: 19
});

const baseTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenTopoMap contributors',
    maxZoom: 17
});

baseSat.addTo(map); // capa por defecto (satélite, como en la imagen de referencia)

// Grupo de incendios (puntos FIRMS)
const grupoFuegos = L.layerGroup().addTo(map);

// Grupo del perímetro estimado de incendios activos (se dibuja a partir
// de los propios puntos FIRMS agrupados, y crece/cambia según llegan
// detecciones nuevas del satélite)
const grupoPerimetroFuegos = L.layerGroup().addTo(map);

// Capa de áreas quemadas reales (EFFIS - Copernicus, gratis, sin API key)
// ARREGLADO: el nombre correcto de la capa es "effis.nrt.ba.poly" (verificado
// contra el servidor). "EFFIS:BurntAreasAll" no existe y por eso no cargaba.
// Estilo "zona quemada" fiel a la cartografía EFFIS: interior oscuro
// ceniza y contorno rojo intenso (como la foto de referencia del usuario).
const SLD_CONTORNO_AMARILLO = '<?xml version="1.0" encoding="UTF-8"?><StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc"><NamedLayer><Name>effis.nrt.ba.poly</Name><UserStyle><FeatureTypeStyle><Rule><PolygonSymbolizer><Fill><CssParameter name="fill">#3a3a3a</CssParameter><CssParameter name="fill-opacity">0.62</CssParameter></Fill><Stroke><CssParameter name="stroke">#ff2b1a</CssParameter><CssParameter name="stroke-width">2.4</CssParameter></Stroke></PolygonSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';

const capasEffis = L.tileLayer.wms('https://maps.effis.emergency.copernicus.eu/effis', {
    layers: 'effis.nrt.ba.poly',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    opacity: 0.95,
    sld_body: SLD_CONTORNO_AMARILLO,
    attribution: 'EFFIS - Copernicus (actualizado por paso de satélite VIIRS, casi en tiempo real)'
});

// Control de capas en bottomright para que no tape el dashboard
const capasBase = {
    "Oscura (Dark Matter)": baseDark,
    "Satélite (ESRI)": baseSat,
    "Topográfica": baseTopo
};

const capasOverlay = {
    "Incendios activos - puntos (FIRMS)": grupoFuegos,
    "Perímetro estimado - incendios activos": grupoPerimetroFuegos,
    "Áreas quemadas reales (EFFIS)": capasEffis
};

L.control.layers(capasBase, capasOverlay, {
    position: 'bottomright',
    collapsed: true   // todo se abre/cierra a voluntad; nada desplegado por defecto
}).addTo(map);

// 1c. CONTROL "MI UBICACIÓN" — punto azul estilo Google Maps.
// Un toque: pide permiso, centra el mapa en ti y te dibuja (punto azul con
// halo pulsante + círculo de precisión). Sigue tu posición mientras esté
// activo. Otro toque: lo apaga y limpia. Si falla, un aviso dice el motivo
// EXACTO (permiso denegado / sin señal / timeout), nada de silencios.
(function instalarControlUbicacion() {
    // Estilos del punto azul (halo pulsante + núcleo), autocontenidos
    const cssUbicacion = document.createElement('style');
    cssUbicacion.textContent =
        '.mf-ubicacion-dot{position:relative;width:22px;height:22px;}' +
        '.mf-ubicacion-nucleo{position:absolute;inset:3px;border-radius:50%;' +
        'background:#1a73e8;border:2.5px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.45);}' +
        '.mf-ubicacion-pulso{position:absolute;inset:-9px;border-radius:50%;' +
        'background:rgba(26,115,232,.28);animation:mf-pulso-ubicacion 2s ease-out infinite;}' +
        '@keyframes mf-pulso-ubicacion{0%{transform:scale(.5);opacity:.9;}' +
        '70%{transform:scale(1.6);opacity:0;}100%{transform:scale(1.6);opacity:0;}}' +
        '.mf-toast-ubicacion{position:fixed;bottom:150px;left:50%;transform:translateX(-50%);' +
        'z-index:2000;max-width:min(420px,86vw);padding:12px 16px;border-radius:10px;' +
        'background:rgba(7,10,16,.94);color:#fff;font:600 13px/1.4 system-ui,sans-serif;' +
        'box-shadow:0 4px 14px rgba(0,0,0,.5);display:none;}' +
        '.leaflet-control-miubicacion a{display:flex!important;align-items:center;' +
        'justify-content:center;}' +
        '.leaflet-control-miubicacion.mf-ubicacion-activa a{background:#1a73e8!important;}' +
        '.leaflet-control-miubicacion.mf-ubicacion-activa svg{stroke:#fff!important;}';
    document.head.appendChild(cssUbicacion);

    let watchId = null;
    let capaUbicacion = null;
    let toastTimer = null;

    function toastUbicacion(texto) {
        let el = document.querySelector('.mf-toast-ubicacion');
        if (!el) {
            el = document.createElement('div');
            el.className = 'mf-toast-ubicacion';
            el.setAttribute('role', 'alert');
            document.body.appendChild(el);
        }
        el.textContent = texto;
        el.style.display = 'block';
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => { el.style.display = 'none'; }, 7000);
    }

    function pintarUbicacion(lat, lon, precision) {
        if (!capaUbicacion) {
            capaUbicacion = L.layerGroup().addTo(map);
        }
        capaUbicacion.clearLayers();
        // Círculo de precisión (hasta 2 km de radio pintado, para no tapar media provincia)
        if (isFinite(precision) && precision > 0) {
            L.circle([lat, lon], {
                radius: Math.min(precision, 2000),
                color: '#1a73e8', weight: 1, opacity: 0.5,
                fillColor: '#1a73e8', fillOpacity: 0.12
            }).addTo(capaUbicacion);
        }
        // Punto azul con halo pulsante (como Google Maps)
        L.marker([lat, lon], {
            icon: L.divIcon({
                className: '',
                html: '<div class="mf-ubicacion-dot"><div class="mf-ubicacion-pulso"></div><div class="mf-ubicacion-nucleo"></div></div>',
                iconSize: [22, 22],
                iconAnchor: [11, 11]
            }),
            interactive: false,
            keyboard: false,
            zIndexOffset: 1000
        }).addTo(capaUbicacion);
    }

    function apagarUbicacion(controlEl) {
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        watchId = null;
        if (capaUbicacion) { capaUbicacion.clearLayers(); map.removeLayer(capaUbicacion); capaUbicacion = null; }
        controlEl.classList.remove('mf-ubicacion-activa');
    }

    function alErrorUbicacion(err, controlEl) {
        let clave = 'evac.sinGps', fb = 'GPS no disponible. Active la ubicación del dispositivo.';
        if (err && err.code === 1) { clave = 'evac.errorPermiso'; fb = 'Permiso de ubicación denegado. Actívalo en los ajustes del navegador.'; }
        else if (err && err.code === 2) { clave = 'evac.errorSinSenal'; fb = 'Sin señal de ubicación. Sal a cielo abierto o activa la ubicación del sistema.'; }
        else if (err && err.code === 3) { clave = 'evac.errorTimeout'; fb = 'El GPS tarda demasiado en responder. Inténtalo de nuevo a cielo abierto.'; }
        toastUbicacion((typeof t === 'function' && t(clave) !== clave) ? t(clave) : fb);
        apagarUbicacion(controlEl);
    }

    const controlUbicacion = L.control({ position: 'topleft' });
    controlUbicacion.onAdd = function () {
        const caja = L.DomUtil.create('div', 'leaflet-bar leaflet-control-miubicacion');
        const btn = L.DomUtil.create('a', '', caja);
        btn.href = '#';
        btn.setAttribute('role', 'button');
        const ponerAria = () => {
            const activa = caja.classList.contains('mf-ubicacion-activa');
            const clave = activa ? 'gps.dejarSeguir' : 'gps.miUbicacion';
            const fb = activa ? 'Dejar de seguir mi ubicación' : 'Mi ubicación';
            btn.setAttribute('aria-label', (typeof t === 'function' && t(clave) !== clave) ? t(clave) : fb);
            btn.title = btn.getAttribute('aria-label');
        };
        // Icono de diana (círculo con cruz), estilo "localizar"
        btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
            '<circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="1.6" fill="#333" stroke="none"/>' +
            '<path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>';
        L.DomEvent.disableClickPropagation(caja);
        L.DomEvent.on(btn, 'click', function (e) {
            L.DomEvent.preventDefault(e);
            if (watchId !== null) { apagarUbicacion(caja); ponerAria(); return; }
            if (!('geolocation' in navigator)) {
                toastUbicacion('GPS no disponible en este dispositivo.');
                return;
            }
            caja.classList.add('mf-ubicacion-activa');
            ponerAria();
            let primerFix = true;
            watchId = navigator.geolocation.watchPosition(function (pos) {
                const c = pos.coords;
                pintarUbicacion(c.latitude, c.longitude, c.accuracy);
                if (primerFix) {
                    primerFix = false;
                    map.setView([c.latitude, c.longitude], Math.max(map.getZoom(), 15));
                }
            }, function (err) { alErrorUbicacion(err, caja); ponerAria(); }, {
                enableHighAccuracy: true, maximumAge: 5000, timeout: 15000
            });
        });
        ponerAria();
        // i18n en caliente
        document.addEventListener('manolito:idioma-cambiado', ponerAria);
        window.addEventListener('manolitoforestal:idioma-cambiado', ponerAria);
        return caja;
    };
    controlUbicacion.addTo(map);
})();

let marcadorActivo = null;      // marcador de evaluación cuántica
let flechaViento = null;        // flecha de dirección de viento
let conoPropagacion = null;     // polígono/cono de propagación estimada

// 2. SIMULADOR CUÁNTICO (3 Qubits)
class QuantumSimulator {
    constructor() {
        this.estado = [1, 0, 0, 0, 0, 0, 0, 0];
    }

    aplicarRY(qubitIndex, theta) {
        const cos = Math.cos(theta / 2);
        const sin = Math.sin(theta / 2);

        for (let i = 0; i < 8; i++) {
            if ((i & (1 << (2 - qubitIndex))) === 0) {
                const i0 = i;
                const i1 = i | (1 << (2 - qubitIndex));
                const a = this.estado[i0];
                const b = this.estado[i1];
                this.estado[i0] = a * cos - b * sin;
                this.estado[i1] = a * sin + b * cos;
            }
        }
    }

    aplicarCNOT(controlIndex, targetIndex) {
        for (let i = 0; i < 8; i++) {
            const isControl1 = (i & (1 << (2 - controlIndex))) !== 0;
            const isTarget0 = (i & (1 << (2 - targetIndex))) === 0;
            if (isControl1 && isTarget0) {
                const i0 = i;
                const i1 = i | (1 << (2 - targetIndex));
                [this.estado[i0], this.estado[i1]] = [this.estado[i1], this.estado[i0]];
            }
        }
    }

    medirRiesgoIgnicion() {
        const pesos = { 3: 0.5, 5: 0.7, 6: 0.7, 7: 1.0 };
        let riesgo = 0;
        for (let idx of [3, 5, 6, 7]) {
            riesgo += pesos[idx] * Math.pow(this.estado[idx], 2);
        }
        return (riesgo * 100).toFixed(2);
    }

    obtenerDetalles() {
        const probs = {};
        for (let idx of [3, 5, 6, 7]) {
            probs[idx] = (Math.pow(this.estado[idx], 2) * 100).toFixed(2);
        }
        return probs;
    }
}

// 3. NORMALIZACIÓN
// Escala progresiva: no exige condiciones extremas para empezar a puntuar.
// Antes: temp<25°C, hum>40% o viento<15km/h daban 0% de riesgo siempre,
// aunque el punto tuviera cierto riesgo de fondo real. Ahora escala desde
// condiciones moderadas, en línea con cómo se comportan los índices de
// peligro de incendio de referencia (más graduales, sin "todo o nada").
function normalizarVariables(temp, hum, wind) {
    const pTemp = Math.min(1, Math.max(0, (temp - 10) / 30));  // 10°C→0 ... 40°C→1
    const pHum = Math.min(1, Math.max(0, (85 - hum) / 65));    // 85%→0 ... 20%→1
    const pWind = Math.min(1, Math.max(0, wind / 45));         // 0km/h→0 ... 45km/h→1
    return { pTemp, pHum, pWind };
}

// 3b. UTILIDADES DE VIENTO Y PROPAGACIÓN
function gradosACardinal(deg) {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return dirs[Math.round(deg / 22.5) % 16];
}

function azimutPropagacion(windDirOrigenDeg) {
    return (windDirOrigenDeg + 180) % 360;
}

function destinoDesdeAzimut(lat, lon, azimutDeg, distanciaKm) {
    const R = 6371;
    const brng = azimutDeg * Math.PI / 180;
    const lat1 = lat * Math.PI / 180;
    const lon1 = lon * Math.PI / 180;
    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distanciaKm / R) +
        Math.cos(lat1) * Math.sin(distanciaKm / R) * Math.cos(brng));
    const lon2 = lon1 + Math.atan2(
        Math.sin(brng) * Math.sin(distanciaKm / R) * Math.cos(lat1),
        Math.cos(distanciaKm / R) - Math.sin(lat1) * Math.sin(lat2)
    );
    return [lat2 * 180 / Math.PI, lon2 * 180 / Math.PI];
}

function calcularZonasDeTrabajo(windDirOrigen, windSpeed, pct) {
    const azAvance = azimutPropagacion(windDirOrigen);
    const azFlancoDer = (azAvance + 90) % 360;
    const azFlancoIzq = (azAvance + 270) % 360;
    const azCola = windDirOrigen;

    const cardAvance = gradosACardinal(azAvance);
    const cardFlancoDer = gradosACardinal(azFlancoDer);
    const cardFlancoIzq = gradosACardinal(azFlancoIzq);
    const cardCola = gradosACardinal(azCola);

    let urgencia;
    if (pct < 40) urgencia = t('trabajoUrgenciaBaja');
    else if (pct < 75) urgencia = t('trabajoUrgenciaMedia');
    else urgencia = t('trabajoUrgenciaAlta');

    let intensidadViento;
    if (windSpeed < 15) intensidadViento = t('trabajoVientoFlojo');
    else if (windSpeed < 35) intensidadViento = t('trabajoVientoModerado');
    else intensidadViento = t('trabajoVientoFuerte');

    const texto = t('trabajoTexto', {
        cardCola, windDirOrigen, windSpeed, cardAvance, intensidadViento,
        cardFlancoIzq, cardFlancoDer, urgencia
    });

    return { texto, azAvance, azFlancoDer, azFlancoIzq, azCola, cardAvance, cardFlancoDer, cardFlancoIzq, cardCola };
}

// Identifica el nombre real (pueblo, aldea, ciudad...) más cercano a cada
// zona de trabajo (cabeza y flancos), no solo el punto de clic. Usa la misma
// geocodificación inversa que ya se usa para el punto principal.
async function obtenerNombresZonasTrabajo(lat, lon, azAvance, azFlancoIzq, azFlancoDer, distanciaKm) {
    const puntoAvance = destinoDesdeAzimut(lat, lon, azAvance, distanciaKm);
    const puntoFlancoIzq = destinoDesdeAzimut(lat, lon, azFlancoIzq, distanciaKm * 0.7);
    const puntoFlancoDer = destinoDesdeAzimut(lat, lon, azFlancoDer, distanciaKm * 0.7);

    const [nombreAvance, nombreFlancoIzq, nombreFlancoDer] = await Promise.all([
        obtenerNombreLugar(puntoAvance[0], puntoAvance[1]),
        obtenerNombreLugar(puntoFlancoIzq[0], puntoFlancoIzq[1]),
        obtenerNombreLugar(puntoFlancoDer[0], puntoFlancoDer[1])
    ]);

    return {
        avance: { nombre: nombreAvance, lat: puntoAvance[0], lon: puntoAvance[1] },
        flancoIzq: { nombre: nombreFlancoIzq, lat: puntoFlancoIzq[0], lon: puntoFlancoIzq[1] },
        flancoDer: { nombre: nombreFlancoDer, lat: puntoFlancoDer[0], lon: puntoFlancoDer[1] }
    };
}

function dibujarPropagacion(lat, lon, windDirOrigen, windSpeed, colorHex) {
    if (flechaViento) map.removeLayer(flechaViento);
    if (conoPropagacion) map.removeLayer(conoPropagacion);

    const azAvance = azimutPropagacion(windDirOrigen);
    const distanciaKm = Math.min(8, 1.5 + windSpeed / 8);

    const puntoLejano = destinoDesdeAzimut(lat, lon, azAvance, distanciaKm);
    const puntoIzq = destinoDesdeAzimut(lat, lon, (azAvance + 25) % 360, distanciaKm * 0.7);
    const puntoDer = destinoDesdeAzimut(lat, lon, (azAvance - 25 + 360) % 360, distanciaKm * 0.7);

    conoPropagacion = L.polygon([[lat, lon], puntoIzq, puntoLejano, puntoDer], {
        color: colorHex,
        weight: 1.5,
        fillColor: colorHex,
        fillOpacity: 0.12,
        dashArray: '4 4'
    }).addTo(map).bindTooltip(t('tooltipPropagacion'));

    flechaViento = L.polyline([[lat, lon], puntoLejano], {
        color: colorHex,
        weight: 2,
        opacity: 0.8
    }).addTo(map);
}

// 4. EJECUCIÓN DEL MOTOR CUÁNTICO
function ejecutarMotorCuantico(lat, lon, temp, hum, wind, windDir, lugar, humedadSuelo, esDia) {
    const { pTemp, pHum, pWind } = normalizarVariables(temp, hum, wind);

    const thetaQ0 = 2 * Math.asin(Math.sqrt(pTemp));
    const thetaQ1 = 2 * Math.asin(Math.sqrt(pHum));
    const thetaQ2 = 2 * Math.asin(Math.sqrt(pWind));

    const sim = new QuantumSimulator();
    sim.aplicarRY(0, thetaQ0);
    sim.aplicarRY(1, thetaQ1);
    sim.aplicarRY(2, thetaQ2);

    DOM.logRY.innerHTML =
        `${t('logRyAplicadas')}<br> Q0(Temp): ${thetaQ0.toFixed(3)} rad<br> Q1(Hum): ${thetaQ1.toFixed(3)} rad<br> Q2(Wind): ${thetaQ2.toFixed(3)} rad`;

    sim.aplicarCNOT(0, 2);
    sim.aplicarCNOT(2, 1);
    DOM.logCNOT.textContent = t('logCnotEjecutados');

    const porcentajePeligro = sim.medirRiesgoIgnicion();
    const detalles = sim.obtenerDetalles();

    DOM.logMedicion.textContent = t('logMedicionEjecutada');
    DOM.logDetalles.innerHTML =
        `P(|011⟩) = ${detalles[3]}%<br>P(|101⟩) = ${detalles[5]}%<br>P(|110⟩) = ${detalles[6]}%<br>P(|111⟩) = ${detalles[7]}%`;

    actualizarInterfazYMapa(lat, lon, porcentajePeligro, temp, hum, wind, windDir, lugar, humedadSuelo, esDia);
}

// 5. ACTUALIZACIÓN VISUAL
function actualizarInterfazYMapa(lat, lon, pct, temp, hum, wind, windDir, lugar, humedadSuelo, esDia) {
    DOM.uiPercent.textContent = `${pct}%`;
    DOM.dashboard.classList.remove('estado-reposo', 'estado-ambar', 'estado-rojo');
    DOM.uiAlert.dataset.estado = 'evaluado';

    let colorHex = "";
    let alertText = "";
    let actionText = "";
    if (pct < 40) {
        DOM.dashboard.classList.add('estado-reposo');
        alertText = t('zonaSeguro');
        actionText = t('actionOptimo');
        colorHex = "#00f3ff";
    } else if (pct < 75) {
        DOM.dashboard.classList.add('estado-ambar');
        alertText = t('zonaAmbar');
        actionText = t('actionRecomendada');
        colorHex = "#ffaa00";
    } else {
        DOM.dashboard.classList.add('estado-rojo');
        alertText = t('zonaRojo');
        actionText = t('actionUrgente');
        colorHex = "#ff003c";
    }

    if (marcadorActivo) map.removeLayer(marcadorActivo);
    marcadorActivo = L.circleMarker([lat, lon], {
        radius: 14,
        fillColor: colorHex,
        color: colorHex,
        weight: 2.5,
        opacity: 0.9,
        fillOpacity: 0.55
    }).addTo(map).bindPopup(`<b>${t('popupEstresBiomasa')}:</b> ${pct}%<br><small>${alertText}</small>`);
    DOM.uiAlert.textContent = alertText.toUpperCase();
    DOM.uiAction.innerHTML = actionText;

    let recomendacion = null;
    let zonasPrioritarias = null;
    if (typeof windDir === 'number' && !isNaN(windDir)) {
        recomendacion = calcularZonasDeTrabajo(windDir, wind, pct);
        dibujarPropagacion(lat, lon, windDir, wind, colorHex);

        // Coordenadas concretas de cada zona prioritaria, no solo el cardinal
        const distKm = Math.min(8, 1.5 + wind / 8);
        const [latCab, lonCab] = destinoDesdeAzimut(lat, lon, recomendacion.azAvance, distKm);
        const [latFD, lonFD] = destinoDesdeAzimut(lat, lon, recomendacion.azFlancoDer, distKm * 0.6);
        const [latFI, lonFI] = destinoDesdeAzimut(lat, lon, recomendacion.azFlancoIzq, distKm * 0.6);
        zonasPrioritarias = {
            cabeza: { lat: latCab, lon: lonCab, lugar: null },
            flancoDer: { lat: latFD, lon: lonFD, lugar: null },
            flancoIzq: { lat: latFI, lon: lonFI, lugar: null }
        };

        const textoCoords = `\n\nPuntos concretos a asegurar:\n• Cabeza (avance): ${latCab.toFixed(5)}, ${lonCab.toFixed(5)}\n• Flanco derecho: ${latFD.toFixed(5)}, ${lonFD.toFixed(5)}\n• Flanco izquierdo: ${latFI.toFixed(5)}, ${lonFI.toFixed(5)}`;
        if (DOM.uiPropagacion) DOM.uiPropagacion.innerHTML = (recomendacion.texto + textoCoords).replace(/\n/g, '<br><br>');

        // En paralelo, se busca el nombre del lugar de cada punto (pueblo,
        // aldea, ciudad) y se actualiza el panel y el contexto en cuanto
        // llega, sin bloquear la evaluación inicial.
        Promise.all([
            obtenerNombreLugar(latCab, lonCab),
            obtenerNombreLugar(latFD, lonFD),
            obtenerNombreLugar(latFI, lonFI)
        ]).then(([nombreCab, nombreFD, nombreFI]) => {
            if (!window.ultimoContextoManolito || window.ultimoContextoManolito.lat !== lat || window.ultimoContextoManolito.lon !== lon) return;
            window.ultimoContextoManolito.zonasPrioritarias.cabeza.lugar = nombreCab;
            window.ultimoContextoManolito.zonasPrioritarias.flancoDer.lugar = nombreFD;
            window.ultimoContextoManolito.zonasPrioritarias.flancoIzq.lugar = nombreFI;
            const textoConNombres = `\n\nPuntos concretos a asegurar:\n• Cabeza (avance): ${nombreCab || 'lugar no identificado'} (${latCab.toFixed(5)}, ${lonCab.toFixed(5)})\n• Flanco derecho: ${nombreFD || 'lugar no identificado'} (${latFD.toFixed(5)}, ${lonFD.toFixed(5)})\n• Flanco izquierdo: ${nombreFI || 'lugar no identificado'} (${latFI.toFixed(5)}, ${lonFI.toFixed(5)})`;
            const prefijoPerimetro = (window.ultimoContextoManolito.perimetroEstimado && window.ultimoContextoManolito.perimetroEstimado.dentro)
                ? `AVISO — ESTE PUNTO ESTÁ DENTRO DE UN PERÍMETRO ESTIMADO DE INCENDIO ACTIVO (área aproximada del foco: ${window.ultimoContextoManolito.perimetroEstimado.areaHa.toFixed(1)} ha). Prioridad máxima: confirma con el 112 y no accedas a la zona sin coordinación con los servicios de extinción.\n\n`
                : '';
            window.ultimoContextoManolito.recomendacionTexto = prefijoPerimetro + recomendacion.texto + textoConNombres;
            if (DOM.uiPropagacion) DOM.uiPropagacion.innerHTML = (prefijoPerimetro + recomendacion.texto + textoConNombres).replace(/\n/g, '<br><br>');
        }).catch(() => {});
    }

    const perimetroEstimado = evaluarPerimetroParaPunto(lat, lon);
    let textoRecomendacionFinal = recomendacion ? recomendacion.texto : actionText.replace(/<[^>]+>/g, '');
    if (perimetroEstimado && perimetroEstimado.dentro) {
        const avisoPerimetro = `AVISO — ESTE PUNTO ESTÁ DENTRO DE UN PERÍMETRO ESTIMADO DE INCENDIO ACTIVO (área aproximada del foco: ${perimetroEstimado.areaHa.toFixed(1)} ha). Prioridad máxima: confirma con el 112 y no accedas a la zona sin coordinación con los servicios de extinción.\n\n${textoRecomendacionFinal}`;
        textoRecomendacionFinal = avisoPerimetro;
        if (DOM.uiPropagacion) DOM.uiPropagacion.innerHTML = avisoPerimetro.replace(/\n/g, '<br><br>');
    }

    window.ultimoContextoManolito = {
        lat, lon, temp, hum, wind,
        windDir: windDir,
        windDirCardinal: (typeof windDir === 'number') ? gradosACardinal(windDir) : null,
        pct,
        lugar: lugar || null,
        humedadSuelo: (typeof humedadSuelo === 'number') ? humedadSuelo : null,
        esDia: (typeof esDia === 'boolean') ? esDia : null,
        vegetacion: null,
        tipoCubierta: null,
        aguaCercana: null,
        pendientePct: null,
        ciencia: null,
        perimetroEstimado,
        zonasPrioritarias,
        recomendacionTexto: textoRecomendacionFinal
    };

    // Capa científica real (Fosberg + Rothermel + Byram): primera pasada
    // con terreno llano, y en cuanto se estima la pendiente real del
    // terreno (API de elevación de Open-Meteo) se recalcula.
    recalcularCienciaFuego();
    if (typeof windDir === 'number' && window.MotorFuego) {
        const az = azimutPropagacion(windDir);
        window.MotorFuego.estimarPendiente(lat, lon, az).then(p => {
            const c = window.ultimoContextoManolito;
            if (c && c.lat === lat && c.lon === lon && typeof p === 'number') {
                c.pendientePct = p;
                recalcularCienciaFuego();
            }
        }).catch(() => {});
    }
}

// Recalcula la capa científica cada vez que llega un dato nuevo
// (vegetación de OSM, pendiente real...) y actualiza el panel y el
// contexto que lee Manolito. Es el "método más preciso que existe":
// Rothermel es el estándar operativo mundial (BehavePlus/FARSITE).
function recalcularCienciaFuego() {
    const c = window.ultimoContextoManolito;
    const div = document.getElementById('ui-ciencia-texto');
    if (!c || !window.MotorFuego) return;
    c.ciencia = window.MotorFuego.evaluarPunto({
        tempC: c.temp, humPct: c.hum, windKmh: c.wind,
        windDir: c.windDir, vegetacionTexto: c.vegetacion,
        tipoCubierta: c.tipoCubierta, pendientePct: c.pendientePct
    });
    const s = c.ciencia;
    if (!s || !div) return;
    const lineas = [
        `<b>Análisis científico (Fosberg / Rothermel / Byram)</b>`,
        `▸ Peligro meteorológico FFWI: <b>${s.ffwi}</b> (${s.ffwiNivel})`,
        `▸ Humedad del combustible fino (1h): ${s.humedadCombustible1h}%`
    ];
    if (s.combustible) lineas.push(`▸ Combustible estimado: ${s.combustible.nombre} (~${s.combustible.cargaTHa} t/ha de combustible fino superficial)`);
    if (s.rosMMin !== null) {
        lineas.push(`▸ Propagación potencial: <b>${s.rosMMin} m/min</b> (${s.rosKmh} km/h)${s.pendientePct !== null ? ` con pendiente del ${s.pendientePct}%` : ' en llano'}`);
        lineas.push(`▸ Intensidad: ${s.intensidadKwM} kW/m · Llama ~${s.llamaM} m · Distancia de seguridad ≥ ${s.distanciaSeguridadM} m (Butler-Cohen)`);
    }
    if (s.escape) {
        lineas.push(`▸ Si prendiera aquí: avanzaría hacia el <b>${s.escape.cardAvance}</b>. Huida: perpendicular (${s.escape.cardFlancoA} o ${s.escape.cardFlancoB}) o hacia lo ya quemado (${s.escape.cardBarlovento}). Nunca hacia el ${s.escape.cardAvance}.`);
    }
    div.innerHTML = lineas.join('<br>');

    // Bandas de propagación t+2/6/12h (módulo opcional bandas-propagacion.js)
    if (window.bandasPropagacion && s && typeof s.rosMMin === 'number') {
        window.bandasPropagacion.actualizar(c.lat, c.lon, {
            rosMMin: s.rosMMin,
            windKmh: c.wind,
            windDir: c.windDir
        });
    }
}

// 6a. OVERPASS CON RESPALDO (varios espejos + timeout)
const OVERPASS_MIRRORS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.private.coffee/api/interpreter'
];

async function consultarOverpass(query, timeoutMs = 8000) {
    for (const url of OVERPASS_MIRRORS) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const resp = await fetch(url, {
                method: 'POST',
                body: 'data=' + encodeURIComponent(query),
                signal: controller.signal
            });
            clearTimeout(timer);
            if (resp.ok) return await resp.json();
            console.warn(`[Overpass] ${url} respondió ${resp.status}, probando siguiente espejo`);
        } catch (e) {
            clearTimeout(timer);
            console.warn(`[Overpass] Fallo en ${url}:`, e.message, '— probando siguiente espejo');
        }
    }
    console.error('[Overpass] Todos los espejos fallaron.');
    return null;
}

// 6b. CONTEXTO AMPLIADO: vegetación y agua cercana
// Además de nombres de especies, ahora también devuelve la CUBIERTA
// dominante (bosque / matorral / hierba), que es lo que el motor
// científico (motor-fuego-cientifico.js) usa para elegir el modelo de
// combustible de Anderson con el que calcula la propagación real.
async function obtenerContextoTerreno(lat, lon) {
    const radioMetros = 3000;
    const query = `
        [out:json][timeout:10];
        (
          nwr["natural"="wood"](around:${radioMetros},${lat},${lon});
          nwr["landuse"="forest"](around:${radioMetros},${lat},${lon});
          nwr["natural"="scrub"](around:${radioMetros},${lat},${lon});
          nwr["natural"="heath"](around:${radioMetros},${lat},${lon});
          nwr["natural"="grassland"](around:${radioMetros},${lat},${lon});
          nwr["landuse"="meadow"](around:${radioMetros},${lat},${lon});
          nwr["natural"="water"](around:${radioMetros},${lat},${lon});
          nwr["waterway"="river"](around:${radioMetros},${lat},${lon});
          nwr["landuse"="reservoir"](around:${radioMetros},${lat},${lon});
        );
        out tags 10;
    `;

    const data = await consultarOverpass(query);
    if (!data) {
        return { vegetacion: 'No disponible (fallo de consulta a OpenStreetMap)', aguaCercana: null, tipoCubierta: null };
    }

    const especies = new Set();
    let hayAgua = false;
    let hayBosque = false, hayMatorral = false, hayHierba = false;
    let leafType = null;
    (data.elements || []).forEach(el => {
        const tags = el.tags || {};
        if (tags.natural === 'water' || tags.waterway === 'river' || tags.landuse === 'reservoir') hayAgua = true;
        if (tags.natural === 'wood' || tags.landuse === 'forest') hayBosque = true;
        if (tags.natural === 'scrub' || tags.natural === 'heath') hayMatorral = true;
        if (tags.natural === 'grassland' || tags.landuse === 'meadow') hayHierba = true;
        if (tags.leaf_type) { especies.add(tags.leaf_type); leafType = tags.leaf_type; }
        if (tags.species) especies.add(tags.species);
        if (tags.genus) especies.add(tags.genus);
    });

    let tipoVegetacion = 'No determinado con precisión (sin etiquetado detallado en OpenStreetMap para este punto)';
    if (especies.size > 0) {
        tipoVegetacion = Array.from(especies).join(', ');
    } else if (hayBosque) {
        tipoVegetacion = 'Masa forestal genérica (sin especie detallada en OSM)';
    } else if (hayMatorral) {
        tipoVegetacion = 'Matorral (scrub/heath en OSM)';
    } else if (hayHierba) {
        tipoVegetacion = 'Herbazal (grassland/meadow en OSM)';
    }

    // Cubierta dominante para el modelo de combustible: manda lo que
    // más inflamabilidad representa (el matorral arde peor que el bosque).
    let tipoCubierta = null;
    if (hayMatorral) tipoCubierta = 'scrub';
    else if (hayBosque) tipoCubierta = leafType === 'needleleaved' ? 'needleleaved'
                                   : leafType === 'broadleaved' ? 'broadleaved' : 'forest';
    else if (hayHierba) tipoCubierta = 'grass';

    return { vegetacion: tipoVegetacion, aguaCercana: hayAgua, tipoCubierta };
}

// 6c. FETCH CON REINTENTOS (clima) — para que nunca se quede colgado
async function fetchConReintentos(url, intentos = 3, timeoutMs = 6000) {
    for (let i = 0; i < intentos; i++) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const resp = await fetch(url, { signal: controller.signal });
            clearTimeout(timer);
            if (resp.ok) return resp;
            console.warn(`[Clima] Intento ${i + 1} respondió ${resp.status}`);
        } catch (e) {
            clearTimeout(timer);
            console.warn(`[Clima] Intento ${i + 1} falló:`, e.message);
        }
        if (i < intentos - 1) await new Promise(r => setTimeout(r, 600));
    }
    return null;
}

// 6. OBTENCIÓN DE DATOS METEOROLÓGICOS (clic en mapa)
async function obtenerDatosClimaticos(lat, lon) {
    DOM.uiCoords.textContent = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    DOM.uiPercent.textContent = t('calculando');
    DOM.dashboard.classList.remove('estado-reposo', 'estado-ambar', 'estado-rojo');

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,soil_moisture_0_to_1cm,is_day`;

    const resp = await fetchConReintentos(url, 3, 6000);

    if (!resp) {
        DOM.uiPercent.textContent = 'Error';
        DOM.uiAlert.textContent = t('errorDatosClima');
        if (DOM.uiAlert) DOM.uiAlert.dataset.estado = 'error';
        DOM.uiAction.innerHTML = '';
        return;
    }

    try {
        const data = await resp.json();

        if (data.elevation <= 0) {
            DOM.uiAlert.textContent = t('zonaAgua');
            DOM.uiAction.innerHTML = t('zonaAguaMsg');
            DOM.uiPercent.textContent = "N/A";
            DOM.uiTemp.textContent = `- °C`;
            DOM.uiHum.textContent = `- %`;
            DOM.uiWind.textContent = `- km/h`;
            if (DOM.uiWindDir) DOM.uiWindDir.textContent = `--`;
            if (DOM.uiPropagacion) DOM.uiPropagacion.textContent = '';
            DOM.logRY.textContent = t('simulacionNoIniciadaAgua');
            DOM.logCNOT.textContent = "";
            DOM.logMedicion.textContent = "";
            DOM.logDetalles.textContent = "";

            if (marcadorActivo) map.removeLayer(marcadorActivo);
            marcadorActivo = L.circleMarker([lat, lon], {
                radius: 14,
                fillColor: '#0077be',
                color: '#00c3ff',
                weight: 2.5,
                opacity: 0.9,
                fillOpacity: 0.6
            }).addTo(map).bindPopup(`<b>${t('popupZonaAgua')}</b><br><small>Elevación: ${data.elevation}m</small>`);
            window.ultimoContextoManolito = null;
            window.bandasPropagacion?.limpiar?.();
            return;
        }

        const temp = data.current.temperature_2m;
        const hum = data.current.relative_humidity_2m;
        const wind = data.current.wind_speed_10m;
        const windDir = data.current.wind_direction_10m;
        const humedadSuelo = data.current.soil_moisture_0_to_1cm;
        const esDia = data.current.is_day === 1;

        DOM.uiTemp.textContent = `${temp} °C`;
        DOM.uiHum.textContent = `${hum} %`;
        DOM.uiWind.textContent = `${wind} km/h`;
        if (DOM.uiWindDir) DOM.uiWindDir.textContent = `${windDir}° (${gradosACardinal(windDir)})`;

        obtenerNombreLugar(lat, lon).then(lugar => {
            if (window.ultimoContextoManolito && window.ultimoContextoManolito.lat === lat && window.ultimoContextoManolito.lon === lon) {
                window.ultimoContextoManolito.lugar = lugar;
            }
        }).catch(() => {});

        obtenerContextoTerreno(lat, lon).then(terreno => {
            if (window.ultimoContextoManolito && window.ultimoContextoManolito.lat === lat && window.ultimoContextoManolito.lon === lon) {
                window.ultimoContextoManolito.vegetacion = terreno.vegetacion;
                window.ultimoContextoManolito.aguaCercana = terreno.aguaCercana;
                window.ultimoContextoManolito.tipoCubierta = terreno.tipoCubierta;
                recalcularCienciaFuego(); // recalcula Rothermel con el modelo de combustible correcto
            }
        }).catch(() => {});

        ejecutarMotorCuantico(lat, lon, temp, hum, wind, windDir, null, humedadSuelo, esDia);
    } catch (error) {
        console.error('[Clima] Error procesando respuesta:', error);
        DOM.uiPercent.textContent = 'Error';
        DOM.uiAlert.textContent = t('errorDatosClima');
        if (DOM.uiAlert) DOM.uiAlert.dataset.estado = 'error';
        DOM.uiAction.innerHTML = '';
    }
}

// 7a. AGRUPACIÓN Y PERÍMETRO ESTIMADO A PARTIR DE PUNTOS ACTIVOS
// Esto NO es un dato inventado: se calcula en directo a partir de los propios
// puntos reales de FIRMS. Cada vez que llegan detecciones nuevas del satélite,
// el contorno se vuelve a calcular y por tanto crece, se junta con otros focos
// o cambia de forma, igual que en las webs de seguimiento de incendios.

function distanciaHaversineMetros(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = d => d * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
}

// Agrupa puntos cercanos entre sí (radio en metros) en focos independientes
function agruparPuntosFuego(puntos, radioMetros = 4000) {
    const grupos = [];
    const visitado = new Array(puntos.length).fill(false);
    for (let i = 0; i < puntos.length; i++) {
        if (visitado[i]) continue;
        const grupo = [puntos[i]];
        visitado[i] = true;
        let cambiado = true;
        while (cambiado) {
            cambiado = false;
            for (let j = 0; j < puntos.length; j++) {
                if (visitado[j]) continue;
                for (const p of grupo) {
                    if (distanciaHaversineMetros(p.lat, p.lon, puntos[j].lat, puntos[j].lon) <= radioMetros) {
                        grupo.push(puntos[j]);
                        visitado[j] = true;
                        cambiado = true;
                        break;
                    }
                }
            }
        }
        grupos.push(grupo);
    }
    return grupos;
}

// Envolvente convexa (contorno exterior) de un grupo de puntos
function envolventeConvexa(puntos) {
    if (puntos.length < 3) return puntos;
    const pts = puntos.map(p => ({ x: p.lon, y: p.lat, orig: p }))
        .sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x));
    const cruz = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

    const inferior = [];
    for (const p of pts) {
        while (inferior.length >= 2 && cruz(inferior[inferior.length - 2], inferior[inferior.length - 1], p) <= 0) inferior.pop();
        inferior.push(p);
    }
    const superior = [];
    for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        while (superior.length >= 2 && cruz(superior[superior.length - 2], superior[superior.length - 1], p) <= 0) superior.pop();
        superior.push(p);
    }
    inferior.pop(); superior.pop();
    return inferior.concat(superior).map(p => p.orig);
}

// Ensancha el contorno hacia fuera desde su centroide un margen EN METROS
// (no un factor): el margen es real en el terreno. Devuelve [lat, lon].
function expandirDesdeCentroide(puntos, margenM = 350) {
    const lat0 = puntos.reduce((s, p) => s + p.lat, 0) / puntos.length;
    const lon0 = puntos.reduce((s, p) => s + p.lon, 0) / puntos.length;
    const R = 6371000, toRad = d => d * Math.PI / 180, toDeg = r => r * 180 / Math.PI;
    const mPorDegLat = toRad(1) * R;
    const mPorDegLon = mPorDegLat * Math.cos(toRad(lat0));
    return puntos.map(p => {
        const dy = (p.lat - lat0) * mPorDegLat;
        const dx = (p.lon - lon0) * mPorDegLon;
        const d = Math.hypot(dx, dy);
        const f = d > 0 ? (d + margenM) / d : 1;
        return [lat0 + (dy * f) / mPorDegLat, lon0 + (dx * f) / mPorDegLon];
    });
}

// Suavizado de Chaikin para polígonos cerrados: convierte el contorno de
// vértices duros (aspecto "minecraft") en una forma curva y orgánica, como
// una cicatriz de fuego real. Dos iteraciones bastan.
function suavizarChaikin(coords, iteraciones = 2) {
    let pts = coords;
    for (let it = 0; it < iteraciones; it++) {
        const salida = [];
        for (let i = 0; i < pts.length; i++) {
            const a = pts[i], b = pts[(i + 1) % pts.length];
            salida.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25]);
            salida.push([a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
        }
        pts = salida;
    }
    return pts;
}

// Radio del grupo en metros: distancia del centroide al punto más alejado.
function radioGrupoMetros(puntos) {
    const lat0 = puntos.reduce((s, p) => s + p.lat, 0) / puntos.length;
    const lon0 = puntos.reduce((s, p) => s + p.lon, 0) / puntos.length;
    let max = 0;
    for (const p of puntos) {
        max = Math.max(max, distanciaHaversineMetros(lat0, lon0, p.lat, p.lon));
    }
    return max;
}

function areaPoligonoHa(coordsLatLon) {
    if (coordsLatLon.length < 3) return 0;
    const lat0 = coordsLatLon.reduce((s, c) => s + c[0], 0) / coordsLatLon.length;
    const R = 6371000;
    const toRad = d => d * Math.PI / 180;
    const pts = coordsLatLon.map(([lat, lon]) => {
        const x = toRad(lon) * R * Math.cos(toRad(lat0));
        const y = toRad(lat) * R;
        return [x, y];
    });
    let area = 0;
    for (let i = 0; i < pts.length; i++) {
        const [x1, y1] = pts[i];
        const [x2, y2] = pts[(i + 1) % pts.length];
        area += x1 * y2 - x2 * y1;
    }
    return Math.abs(area) / 2 / 10000; // m² -> ha
}

function puntoDentroPoligono(lat, lon, coordsLatLon) {
    let dentro = false;
    for (let i = 0, j = coordsLatLon.length - 1; i < coordsLatLon.length; j = i++) {
        const [latI, lonI] = coordsLatLon[i];
        const [latJ, lonJ] = coordsLatLon[j];
        const interseca = ((latI > lat) !== (latJ > lat)) &&
            (lon < (lonJ - lonI) * (lat - latI) / (latJ - latI) + lonI);
        if (interseca) dentro = !dentro;
    }
    return dentro;
}

// Guarda la geometría de todos los perímetros activos dibujados, para poder
// consultar luego si un punto cualquiera cae dentro de alguno o a qué
// distancia está del más cercano (lo usa el informe y la recomendación).
window.perimetrosActivosGeom = [];

// Dado un punto, dice si está DENTRO de un perímetro activo estimado, o a
// qué distancia (km) está del más cercano, y el área aproximada (ha) de ese foco.
function evaluarPerimetroParaPunto(lat, lon) {
    if (!window.perimetrosActivosGeom || !window.perimetrosActivosGeom.length) return null;
    let mejor = null;
    for (const geom of window.perimetrosActivosGeom) {
        let dentro = false;
        let distKm;
        if (geom.tipo === 'poligono') {
            dentro = puntoDentroPoligono(lat, lon, geom.coords);
            distKm = Math.min(...geom.coords.map(([la, lo]) => distanciaHaversineMetros(lat, lon, la, lo) / 1000));
        } else {
            const d = distanciaHaversineMetros(lat, lon, geom.centro[0], geom.centro[1]);
            dentro = d <= geom.radioM;
            distKm = Math.max(0, (d - geom.radioM) / 1000);
        }
        if (dentro) return { dentro: true, distanciaKm: 0, areaHa: geom.areaHa };
        if (!mejor || distKm < mejor.distanciaKm) mejor = { dentro: false, distanciaKm: distKm, areaHa: geom.areaHa };
    }
    return mejor;
}

function dibujarPerimetrosActivos(puntos) {
    grupoPerimetroFuegos.clearLayers();
    window.perimetrosActivosGeom = [];
    if (!puntos.length) return;

    // Perímetro en tiempo real con el mismo lenguaje visual que las
    // áreas quemadas EFFIS: relleno oscuro ceniza + contorno rojo continuo
    // (nada de líneas a tramos ni esquinas rectas: formas orgánicas).
    const estiloPerimetro = {
        color: '#ff2b1a',
        weight: 2.4,
        fillColor: '#3a3a3a',
        fillOpacity: 0.5
    };

    const grupos = agruparPuntosFuego(puntos, 4000);
    grupos.forEach(grupo => {
        if (grupo.length === 1) {
            const radioM = 400;
            L.circle([grupo[0].lat, grupo[0].lon], { ...estiloPerimetro, radius: radioM })
                .addTo(grupoPerimetroFuegos)
                .bindTooltip('Perímetro estimado a partir de detecciones activas');
            window.perimetrosActivosGeom.push({
                tipo: 'circulo', centro: [grupo[0].lat, grupo[0].lon], radioM,
                areaHa: Math.PI * radioM * radioM / 10000
            });
        } else if (grupo.length === 2) {
            const [a, b] = grupo;
            const midLat = (a.lat + b.lat) / 2, midLon = (a.lon + b.lon) / 2;
            const radio = Math.max(500, distanciaHaversineMetros(a.lat, a.lon, b.lat, b.lon) / 2 + 300);
            L.circle([midLat, midLon], { ...estiloPerimetro, radius: radio })
                .addTo(grupoPerimetroFuegos)
                .bindTooltip('Perímetro estimado a partir de detecciones activas');
            window.perimetrosActivosGeom.push({
                tipo: 'circulo', centro: [midLat, midLon], radioM: radio,
                areaHa: Math.PI * radio * radio / 10000
            });
        } else {
            // Contorno orgánico: envolvente convexa + margen en metros +
            // suavizado Chaikin. El resultado es una mancha curva que rodea
            // los focos, no un cuadrado: como una cicatriz de fuego real.
            const hull = envolventeConvexa(grupo);
            const margenM = Math.max(350, radioGrupoMetros(grupo) * 0.15);
            const contorno = suavizarChaikin(expandirDesdeCentroide(hull, margenM), 2);
            L.polygon(contorno, estiloPerimetro)
                .addTo(grupoPerimetroFuegos)
                .bindTooltip('Perímetro estimado a partir de detecciones activas (crece con nuevas detecciones)');
            window.perimetrosActivosGeom.push({
                tipo: 'poligono', coords: contorno,
                areaHa: areaPoligonoHa(contorno)
            });
        }
    });
}

// 7b. PROCESADOR DE DATOS DE INCENDIOS
function procesarCsvFuegos(csv) {
    grupoFuegos.clearLayers();
    const lineas = csv.trim().split('\n');
    if (lineas.length <= 1) {
        DOM.contadorFuegos.textContent = t('ceroFuegosVisibles');
        grupoPerimetroFuegos.clearLayers();
        return 0;
    }

    let contador = 0;
    const puntosParaPerimetro = [];
    for (let i = 1; i < lineas.length; i++) {
        const cols = lineas[i].split(',');
        const lat = parseFloat(cols[0]);
        const lon = parseFloat(cols[1]);
        const brillo = parseFloat(cols[2]);
        const confianza = cols[9];

        if (isNaN(lat) || isNaN(lon)) continue;

        const color = confianza === 'h' ? '#ff4500' : (confianza === 'n' ? '#ffaa00' : '#ff0000');
        // Marcador en forma de llama (SVG, no cuadrado ni emoji): fiel a
        // lo que hay en el terreno. El color indica la confianza VIIRS.
        const marker = L.marker([lat, lon], {
            icon: L.divIcon({
                className: 'mf-fuego-icono',
                html: '<svg width="26" height="34" viewBox="0 0 24 32" aria-hidden="true">' +
                    '<path d="M12 1 C13.5 6 18 8.5 18 15 a7.5 7.5 0 0 1-15 0 C4.5 11 6 10 7 7.5 8 10 9.5 11 10 11 c0-4 1-8 2-10 Z" ' +
                    'fill="' + color + '" stroke="#fff" stroke-width="1.2"/>' +
                    '<path d="M12 13 c2 2.5 3.5 4 3.5 6.5 a4 4 0 0 1-8 0 c0-2.5 1.5-4 4.5-6.5 Z" fill="#ffd54f" opacity="0.9"/>' +
                    '</svg>',
                iconSize: [26, 34],
                iconAnchor: [13, 32],
                popupAnchor: [0, -30]
            })
        }).addTo(grupoFuegos);

        marker.bindPopup(`
            <b>${t('popupIncendioActivo')}</b><br>
            ${t('popupBrillo')}: ${brillo} K<br>
            ${t('popupConfianza')}: ${confianza}<br>
            <button class="evaluar-fuego-btn" data-lat="${lat}" data-lon="${lon}">${t('popupEvaluarRiesgo')}</button>
        `);

        puntosParaPerimetro.push({ lat, lon, confianza });
        contador++;
    }

    dibujarPerimetrosActivos(puntosParaPerimetro);
    return contador;
}

// 7. CAPA DE INCENDIOS ACTIVOS (NASA FIRMS)
let fuegosUltimaActualizacion = 0;

async function cargarFuegosActivos() {
    if (Date.now() - fuegosUltimaActualizacion < 10000 && grupoFuegos.getLayers().length > 0) return;

    try {
        const bounds = map.getBounds();
        const sur = bounds.getSouth();
        const oeste = bounds.getWest();
        const norte = bounds.getNorth();
        const este = bounds.getEast();

        const boundsParam = `${oeste},${sur},${este},${norte}`;
        const url = `/getFires?bounds=${boundsParam}`;

        const resp = await fetch(url);
        if (!resp.ok) throw new Error("FIRMS no respondió");
        const csv = await resp.text();

        const contador = procesarCsvFuegos(csv);

        if (contador > 0) {
            DOM.contadorFuegos.textContent = t('fuegosActivosDetectados', { count: contador });
        }
        fuegosUltimaActualizacion = Date.now();

    } catch (error) {
        console.error("Error cargando FIRMS:", error);
        procesarCsvFuegos(CSV_EJEMPLO_FUEGOS);
        DOM.contadorFuegos.textContent = t('errorFirmsDev');
        fuegosUltimaActualizacion = Date.now();
    }
}

// 8. INTERACTIVIDAD DE LA INTERFAZ Y LÓGICA LEGAL
function setupUIInteractions() {
    // En pantallas estrechas el panel arranca cerrado: nada desplegado
    // por defecto, todo se abre a voluntad (excepto emergencias).
    if (window.matchMedia && window.matchMedia('(max-width: 640px)').matches) {
        DOM.dashboard.classList.add('closed');
        DOM.reopenDashboardBtn.style.display = 'block';
    }

    DOM.toggleDashboardBtn.addEventListener('click', function () {
        DOM.dashboard.classList.add('closed');
        DOM.reopenDashboardBtn.style.display = 'block';
    });

    DOM.reopenDashboardBtn.addEventListener('click', function () {
        DOM.dashboard.classList.remove('closed');
        this.style.display = 'none';
    });

    if (DOM.toggleModeBtn) {
        DOM.toggleModeBtn.addEventListener('click', function () {
            DOM.dashboard.classList.toggle('mode-citizen');
            const isCitizenMode = DOM.dashboard.classList.contains('mode-citizen');
            this.textContent = isCitizenMode ? t('modoCientifico') : t('modoCiudadano');
            this.title = isCitizenMode ? t('titleModoCiencia') : t('titleModoCiudadano');
        });
    }

    if (DOM.quantumLogSection) {
        const logHeader = DOM.quantumLogSection.querySelector('h2');
        if (logHeader) {
            logHeader.addEventListener('click', () => {
                DOM.quantumLogSection.classList.toggle('section-collapsed');
            });
            logHeader.style.cursor = 'pointer';
            logHeader.title = t('titleColapsar');
        }
    }

    const debouncedObtenerDatosClimaticos = debounce(function (e) {
        obtenerDatosClimaticos(e.latlng.lat, e.latlng.lng);
    }, 500);
    map.on('click', debouncedObtenerDatosClimaticos);

    map.getContainer().addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('evaluar-fuego-btn')) {
            const lat = parseFloat(e.target.dataset.lat);
            const lon = parseFloat(e.target.dataset.lon);
            obtenerDatosClimaticos(lat, lon);
            map.closePopup();
        }
    });

    map.on('load moveend zoomend', cargarFuegosActivos);
}

async function initLegalNotice() {
    const hideModal = () => { DOM.legalModal.style.display = 'none'; };
    const showModal = () => { DOM.legalModal.style.display = 'flex'; };

    try {
        const response = await fetch('legal.html');
        if (!response.ok) throw new Error('No se pudo cargar el aviso legal.');
        const legalHTML = await response.text();
        DOM.legalContentContainer.innerHTML = legalHTML;
    } catch (error) {
        console.error(error);
        DOM.legalContentContainer.innerHTML = `<p>${t('errorCargaLegal')}</p>`;
    }

    DOM.acceptLegalBtn.addEventListener('click', () => {
        localStorage.setItem('manolitoLegalAccepted', 'true');
        hideModal();
    });
    DOM.modalCloseBtn.addEventListener('click', hideModal);
    DOM.openLegalLink.addEventListener('click', (e) => {
        e.preventDefault();
        showModal();
    });

    if (localStorage.getItem('manolitoLegalAccepted') !== 'true') {
        showModal();
    }
}

// 9. INICIO DE LA APLICACIÓN
document.addEventListener('DOMContentLoaded', () => {
    if (DOM.uiAlert) DOM.uiAlert.dataset.estado = 'inicial';
    initLegalNotice();
    setupUIInteractions();
    cargarFuegosActivos();
});

;

/* ==================== manolito-chat.js ==================== */
/**
 * MANOLIT∞ FORESTAL - Widget de chat "Manolito"
 * Se conecta a /manolito (Cloudflare Pages Function) y usa el contexto
 * de la última zona evaluada (window.ultimoContextoManolito) para dar
 * recomendaciones de dónde trabajar la biomasa según viento y riesgo.
 */

function crearBurbuja(texto, clase) {
    const cont = document.getElementById('manolito-mensajes');
    const div = document.createElement('div');
    div.className = `manolito-msg ${clase}`;
    div.textContent = texto;
    cont.appendChild(div);
    cont.scrollTop = cont.scrollHeight;
    return div;
}

async function enviarMensajeManolito() {
    const input = document.getElementById('manolito-input');
    const texto = input.value.trim();
    if (!texto) return;
    input.value = '';

    crearBurbuja(texto, 'msg-user');
    const pensando = crearBurbuja('...', 'msg-bot msg-thinking');

    try {
        const resp = await fetch('/manolito', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: texto,
                contexto: window.ultimoContextoManolito || null,
                idioma: (typeof idiomaActual !== 'undefined') ? idiomaActual : 'es'
            })
        });
        const data = await resp.json();
        pensando.remove();
        if (data.respuesta) {
            crearBurbuja(data.respuesta, 'msg-bot');
        } else {
            crearBurbuja(data.error || 'Manolito no ha podido responder ahora mismo.', 'msg-bot msg-error');
        }
    } catch (e) {
        pensando.remove();
        crearBurbuja('Error de conexión con Manolito. Comprueba tu red.', 'msg-bot msg-error');
    }
}

function setupManolitoChat() {
    const toggleBtn = document.getElementById('manolito-toggle-btn');
    const panel = document.getElementById('manolito-panel');
    const closeBtn = document.getElementById('manolito-close-btn');
    const sendBtn = document.getElementById('manolito-send-btn');
    const input = document.getElementById('manolito-input');

    if (!toggleBtn || !panel) return;

    toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('manolito-abierto');
        if (panel.classList.contains('manolito-abierto') && document.getElementById('manolito-mensajes').children.length === 0) {
            crearBurbuja(t('chatSaludo'), 'msg-bot');
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', () => panel.classList.remove('manolito-abierto'));
    if (sendBtn) sendBtn.addEventListener('click', enviarMensajeManolito);
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') enviarMensajeManolito();
        });
    }
}

document.addEventListener('DOMContentLoaded', setupManolitoChat);
;

/* ==================== pdf-informe.js ==================== */
/**
 * MANOLIT∞ FORESTAL - Generador de informe PDF
 * jsPDF se carga PEREZOSAMENTE desde el CDN oficial (cdnjs): solo se
 * descargan sus ~360 KB si el usuario pulsa "Descargar informe PDF".
 * Antes se cargaba en cada visita, uses el PDF o no.
 */

// Carga perezosa de jsPDF (CDN oficial). Se cachea la promesa para que
// el segundo clic no descargue nada.
let promesaJsPdf = null;
function cargarJsPdf() {
    if (window.jspdf) return Promise.resolve();
    if (promesaJsPdf) return promesaJsPdf;
    promesaJsPdf = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        s.onload = () => resolve();
        s.onerror = () => { promesaJsPdf = null; reject(new Error('jspdf no cargó')); };
        document.head.appendChild(s);
    });
    return promesaJsPdf;
}

async function obtenerNombreLugar(lat, lon) {
    try {
        // URL correcta de Nominatim (API de geocodificación inversa de OpenStreetMap)
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=es&zoom=10`;
        const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!resp.ok) return null;
        const data = await resp.json();
        const addr = data.address || {};
        const partes = [
            addr.village || addr.town || addr.city || addr.municipality || addr.hamlet,
            addr.county || addr.state_district,
            addr.state
        ].filter(Boolean);
        return partes.length ? partes.join(', ') : (data.display_name || null);
    } catch (e) {
        console.warn('[obtenerNombreLugar] Error:', e.message);
        return null;
    }
}

// Mismo criterio que en el chat: rojo = incendio activo confirmado por
// satélite o punto dentro del perímetro estimado; amarillo = sin fuego
// confirmado pero estrés de biomasa alto; verde = riesgo bajo-moderado.
// Se usa para el aviso del 112 en el PDF.
function determinarEstadoPunto(c) {
    if (c.incendiosActivosCercanos > 0 || (c.perimetroEstimado && c.perimetroEstimado.dentro)) {
        return { color: 'rojo', etiqueta: 'INCENDIO ACTIVO', rgb: [200, 30, 30] };
    }
    const pct = parseFloat(c.pct);
    if (!isNaN(pct) && pct >= 60) {
        return { color: 'amarillo', etiqueta: 'RIESGO ALTO (vigilancia)', rgb: [190, 140, 0] };
    }
    return { color: 'verde', etiqueta: 'riesgo bajo-moderado', rgb: [40, 130, 60] };
}

async function generarInformePDF(contexto) {
    if (!contexto || !contexto.lat) {
        alert((typeof t === 'function' && t('pdfSeleccionaZona') !== 'pdfSeleccionaZona') ? t('pdfSeleccionaZona') : 'Selecciona primero una zona en el mapa para generar el informe.');
        return;
    }
    try {
        await cargarJsPdf();
    } catch (e) {
        alert((typeof t === 'function' && t('pdfErrorCarga') !== 'pdfErrorCarga') ? t('pdfErrorCarga') : 'No se pudo cargar el generador de PDF. Comprueba tu conexión.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const fecha = new Date().toLocaleString('es-ES');
    const estado = determinarEstadoPunto(contexto);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('MANOLIT FORESTAL', 15, 20);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Informe técnico de riesgo y propagación de incendio forestal', 15, 28);
    doc.setDrawColor(200);
    doc.line(15, 32, 195, 32);

    let y = 42;
    if (estado.color !== 'verde') {
        doc.setFillColor(...estado.rgb);
        doc.roundedRect(15, y - 6, 180, 10, 1.5, 1.5, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');

        let textoAviso;
        if (contexto.perimetroEstimado && contexto.perimetroEstimado.dentro) {
            textoAviso = `ALERTA: ${estado.etiqueta} — DENTRO del perímetro estimado. Aléjate. Emergencias: 112`;
        } else if (estado.color === 'rojo') {
            textoAviso = `ALERTA: ${estado.etiqueta} — si estás cerca de la zona, aléjate. Emergencias: 112`;
        } else {
            textoAviso = `AVISO: ${estado.etiqueta} — sin incendio confirmado, zona bajo vigilancia`;
        }

        let tamanoLetra = 11;
        doc.setFontSize(tamanoLetra);
        while (doc.getTextWidth(textoAviso) > 170 && tamanoLetra > 6) {
            tamanoLetra -= 0.5;
            doc.setFontSize(tamanoLetra);
        }

        doc.text(textoAviso, 15, y + 1);
        doc.setTextColor(0, 0, 0);
        y += 12;
    }

    const COL_VALOR_MIN = 68;
    const linea = (label, valor, colorValor) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(0, 0, 0);
        const labelTexto = `${label}:`;
        doc.text(labelTexto, 15, y);
        const anchoLabel = doc.getTextWidth(labelTexto);
        const xValor = Math.max(COL_VALOR_MIN, 15 + anchoLabel + 4);
        doc.setFont('helvetica', 'normal');
        if (colorValor) doc.setTextColor(...colorValor);
        doc.text(String(valor), xValor, y);
        doc.setTextColor(0, 0, 0);
        y += 8;
    };

    linea('Fecha del informe', fecha);
    linea('Lugar aproximado', contexto.lugar || 'No disponible');
    linea('Coordenadas', `${contexto.lat.toFixed(5)}, ${contexto.lon.toFixed(5)}`);
    linea('Temperatura', `${contexto.temp} °C`);
    linea('Humedad relativa', `${contexto.hum} %`);
    linea('Viento', `${contexto.wind} km/h, dirección ${contexto.windDir}° (${contexto.windDirCardinal || ''})`);
    linea('Estrés de biomasa (modelo cuántico)', `${contexto.pct} %`, estado.color !== 'verde' ? estado.rgb : null);
    if (contexto.incendiosActivosCercanos !== undefined && contexto.incendiosActivosCercanos !== null) {
        linea('Incendios activos en 25km (satélite)', contexto.incendiosActivosCercanos > 0
            ? `${contexto.incendiosActivosCercanos} (el más cercano a ${contexto.distanciaIncendioMasCercanoKm} km)`
            : 'ninguno detectado');
    }

    if (contexto.perimetroEstimado) {
        const p = contexto.perimetroEstimado;
        if (p.dentro) {
            linea('Perímetro estimado de incendio', `dentro del perímetro (foco de ~${p.areaHa.toFixed(1)} ha)`, estado.color !== 'verde' ? estado.rgb : null);
        } else {
            linea('Perímetro estimado más cercano', `a ${p.distanciaKm.toFixed(1)} km (foco de ~${p.areaHa.toFixed(1)} ha)`);
        }
    }

    y += 4;
    doc.setDrawColor(200);
    doc.line(15, y, 195, y);
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Recomendación de zonas de trabajo', 15, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    const textoRecom = contexto.recomendacionTexto || 'Sin recomendación calculada.';
    const lineasTexto = doc.splitTextToSize(textoRecom, 180);
    doc.text(lineasTexto, 15, y);
    y += lineasTexto.length * 5.5 + 10;

    doc.setFontSize(8.5);
    doc.setTextColor(120);
    const nota = estado.color === 'rojo'
        ? 'Este informe es un modelo de apoyo a la decisión basado en datos meteorológicos abiertos (Open-Meteo), satélite de incendios (NASA FIRMS) y una simulación de circuito cuántico ejecutada en el navegador. El perímetro estimado es una aproximación geométrica calculada a partir de los puntos de calor detectados y NO es un dato oficial verificado sobre el terreno. No sustituye las órdenes de mando de bomberos, Protección Civil, AEMET ni al 112. Hay indicios de incendio activo en esta zona: ante cualquier duda, contacta con el 112 o con Protección Civil/bomberos.'
        : 'Este informe es un modelo de apoyo a la decisión basado en datos meteorológicos abiertos (Open-Meteo) y una simulación de circuito cuántico ejecutada en el navegador. El perímetro estimado, cuando aparece, es una aproximación geométrica calculada a partir de los puntos de calor detectados y NO es un dato oficial verificado sobre el terreno. No sustituye las órdenes de mando de bomberos, Protección Civil, AEMET ni al 112. Ante un incendio activo, contacta siempre con el 112.';
    const lineasNota = doc.splitTextToSize(nota, 180);
    doc.text(lineasNota, 15, y);

    const nombreArchivo = `manolito-informe-${contexto.lat.toFixed(3)}_${contexto.lon.toFixed(3)}.pdf`;
    doc.save(nombreArchivo);
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-descargar-pdf');
    if (btn) {
        btn.addEventListener('click', () => generarInformePDF(window.ultimoContextoManolito));
    }
});

;

/* ==================== capa-fwi.js ==================== */
/**
 * MANOLIT∞ FORESTAL - Capa FWI (Fire Weather Index) de EFFIS/Copernicus
 *
 * Capa coropleta WMS de peligro de incendio (FWI del ECMWF) servida por el
 * European Forest Fire Information System (EFFIS). Gratuita, sin API key.
 *
 * Patrones:
 *  - IIFE + 'use strict'. Un único hook público: window.capaFWI.
 *  - Lazy-load real: el L.tileLayer.wms NO se crea hasta la primera activación.
 *  - DOM inyectado con retry loop (setInterval, máx 20 intentos × 200 ms).
 *  - Textos vía i18n global del proyecto: t('clave') con fallback a la clave
 *    (idiomas.js expone IDIOMAS + t() + cambiarIdioma()). Fallback interno en
 *    español si t() aún no está disponible.
 *
 * Integración: este módulo necesita una referencia al mapa Leaflet.
 * motor-cuantico.js crea el mapa como `const map = L.map('map', ...)`, que NO
 * queda expuesto en window. El integrador debe añadir una línea tras crear el
 * mapa:  window.manolitoMapa = map;
 * (este módulo también prueba window.map como fallback, por compatibilidad).
 */
(function () {
    'use strict';

    // ------------------------------------------------------------------ i18n
    // Fallbacks en español por si idiomas.js aún no ha cargado (defer order).
    var FALLBACK_ES = {
        fwiToggle: 'Índice FWI (peligro de incendio)',
        fwiToggleActivar: 'Activar capa FWI de peligro de incendio',
        fwiToggleDesactivar: 'Desactivar capa FWI de peligro de incendio',
        fwiLeyendaTitulo: 'Índice FWI (EFFIS)',
        fwiLeyendaExpandir: 'Mostrar leyenda FWI',
        fwiLeyendaColapsar: 'Ocultar leyenda FWI',
        fwiMuyBajo: 'Muy bajo',
        fwiBajo: 'Bajo',
        fwiModerado: 'Moderado',
        fwiAlto: 'Alto',
        fwiMuyAlto: 'Muy alto',
        fwiExtremo: 'Extremo',
        fwiCargando: 'Cargando capa FWI…',
        fwiError: 'No se pudo cargar la capa FWI. Reintentar',
        fwiFuente: 'Fuente: EFFIS / Copernicus ECMWF'
    };

    function tr(clave) {
        try {
            if (typeof window.t === 'function') {
                var v = window.t(clave);
                // t() devuelve la propia clave si no existe: usar fallback.
                if (v && v !== clave) return v;
            } else if (typeof t === 'function') {
                var v2 = t(clave);
                if (v2 && v2 !== clave) return v2;
            }
        } catch (e) { /* i18n no disponible todavía */ }
        return FALLBACK_ES[clave] || clave;
    }

    // ------------------------------------------------------- Constantes capa
    var WMS_URL = 'https://maps.effis.emergency.copernicus.eu/effis';
    var WMS_OPTS = {
        service: 'WMS',
        version: '1.1.1',        // 1.1.1 evita el lío de ejes lat/lon de 1.3.0
        request: 'GetMap',
        layers: 'mf010.fwi',
        format: 'image/png',
        transparent: true,
        opacity: 0.55,
        attribution: 'FWI © EFFIS - Copernicus (ECMWF)'
    };

    var TIMEOUT_CARGA_MS = 8000;
    var MAX_INTENTOS_DOM = 20;
    var INTERVALO_DOM_MS = 200;

    // Escala oficial EFFIS de clases de peligro FWI (umbrales superiores).
    var CLASES_FWI = [
        { clave: 'fwiMuyBajo',  color: '#00FF00', rango: '< 5.2' },
        { clave: 'fwiBajo',     color: '#C0FF00', rango: '5.2 – 11.2' },
        { clave: 'fwiModerado', color: '#FFFF00', rango: '11.2 – 21.3' },
        { clave: 'fwiAlto',     color: '#FFA500', rango: '21.3 – 38' },
        { clave: 'fwiMuyAlto',  color: '#FF0000', rango: '38 – 50' },
        { clave: 'fwiExtremo',  color: '#800080', rango: '≥ 50' }
    ];

    // ---------------------------------------------------------------- Estado
    var capaWms = null;          // se crea solo en la primera activación
    var estaActiva = false;
    var cargando = false;
    var timerTimeout = null;
    var ui = null;               // { contenedor, boton, leyenda, estado }

    function obtenerMapa() {
        return window.manolitoMapa || window.map || null;
    }

    // ------------------------------------------------------------------- CSS
    function inyectarCSS() {
        if (document.getElementById('capa-fwi-css')) return;
        var css = document.createElement('style');
        css.id = 'capa-fwi-css';
        css.textContent = [
            // Botón FWI: cuadrado de 48px SOLO con icono, debajo del control
            // de zoom de Leaflet (que ocupa ~78px). Nada de tarjetas anchas
            // que tapan el +/-: ocupa lo mismo que un botón de zoom.
            '#capa-fwi-wrap{position:absolute;top:118px;left:10px;z-index:500;',
            '  font-family:inherit;max-width:min(280px,calc(100vw - 32px));}',
            '#capa-fwi-toggle{width:48px;min-width:48px;height:48px;min-height:48px;',
            '  display:flex;align-items:center;justify-content:center;padding:0;',
            '  cursor:pointer;border-radius:10px;',
            '  border:1px solid rgba(0,243,255,0.35);',
            '  background:rgba(5,16,19,0.85);color:#e8f6f8;',
            '  box-shadow:0 2px 10px rgba(0,0,0,0.4);}',
            // El texto del botón existe para lectores de pantalla, pero no
            // ocupa sitio en el mapa (patrón visually-hidden).
            '#capa-fwi-toggle .fwi-texto{position:absolute;width:1px;height:1px;',
            '  overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;}',
            '#capa-fwi-toggle:hover{filter:brightness(1.15);}',
            '#capa-fwi-toggle:focus-visible{outline:3px solid #00f3ff;outline-offset:2px;}',
            '#capa-fwi-toggle[aria-pressed="true"]{',
            '  background:rgba(255,165,0,0.28);border-color:rgba(255,165,0,0.85);}',
            '#capa-fwi-toggle .fwi-spinner{display:none;width:16px;height:16px;',
            '  border:2px solid rgba(255,255,255,0.25);border-top-color:#ffa500;',
            '  border-radius:50%;animation:fwi-giro 0.8s linear infinite;}',
            '#capa-fwi-toggle.fwi-cargando .fwi-spinner{display:inline-block;}',
            '@keyframes fwi-giro{to{transform:rotate(360deg);}}',
            '#capa-fwi-estado{margin-top:6px;font-size:0.75rem;color:#ffd27a;',
            '  background:rgba(5,16,19,0.85);border-radius:6px;padding:6px 10px;',
            '  display:none;}',
            '#capa-fwi-estado.fwi-visible{display:block;}',
            '#capa-fwi-estado button{margin-left:8px;min-width:48px;',
            '  min-height:48px;padding:6px 10px;cursor:pointer;border-radius:6px;',
            '  border:1px solid rgba(0,243,255,0.4);background:transparent;',
            '  color:#e8f6f8;font-size:0.75rem;}',
            '#capa-fwi-leyenda{margin-top:8px;background:rgba(5,16,19,0.9);',
            '  border:1px solid rgba(0,243,255,0.3);border-radius:8px;',
            '  padding:8px 10px;color:#e8f6f8;font-size:0.75rem;}',
            '#capa-fwi-leyenda[hidden]{display:none;}',
            '#capa-fwi-leyenda-titulo{display:flex;justify-content:space-between;',
            '  align-items:center;gap:8px;min-height:48px;width:100%;',
            '  background:none;border:none;color:inherit;font:inherit;',
            '  font-weight:700;cursor:pointer;padding:6px 0;}',
            '#capa-fwi-leyenda-lista{list-style:none;margin:6px 0 0;padding:0;}',
            '#capa-fwi-leyenda-lista[hidden]{display:none;}',
            '#capa-fwi-leyenda-lista li{display:flex;align-items:center;gap:8px;',
            '  margin-bottom:4px;}',
            '#capa-fwi-leyenda-lista .fwi-muestra{width:18px;height:14px;',
            '  flex:0 0 18px;border-radius:3px;border:1px solid rgba(255,255,255,0.35);}',
            '#capa-fwi-leyenda-lista .fwi-rango{margin-left:auto;opacity:0.75;',
            '  font-variant-numeric:tabular-nums;}',
            '#capa-fwi-leyenda-fuente{margin-top:6px;font-size:0.65rem;opacity:0.6;}',
            // En móvil también arriba a la izquierda, bajo el zoom: abajo
            // chocaba con "Preparar zona" y con el botón de emergencias.
        ].join('\n');
        document.head.appendChild(css);
    }

    // ------------------------------------------------------------------- DOM
    function construirUI(contenedor) {
        inyectarCSS();

        var wrap = document.createElement('div');
        wrap.id = 'capa-fwi-wrap';

        var boton = document.createElement('button');
        boton.id = 'capa-fwi-toggle';
        boton.type = 'button';
        boton.setAttribute('aria-pressed', 'false');
        boton.setAttribute('aria-label', tr('fwiToggleActivar'));
        boton.innerHTML = '<span class="fwi-spinner" aria-hidden="true"></span>' +
            '<span aria-hidden="true">' + '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 C13.2 6.5 17 8.5 17 13.6 a5 5 0 0 1-10 0 C7 10.5 8 9.5 8.8 7.6 9.6 9.5 10.6 10.2 11 10.2 c0-3.4 .6-6.6 1-8.2 Z" fill="currentColor"/></svg>' + '</span>' +
            '<span class="fwi-texto"></span>';
        boton.querySelector('.fwi-texto').textContent = tr('fwiToggle');
        boton.addEventListener('click', function () { api.toggle(); });

        var estado = document.createElement('div');
        estado.id = 'capa-fwi-estado';
        estado.setAttribute('role', 'status');
        estado.setAttribute('aria-live', 'polite');

        var leyenda = document.createElement('div');
        leyenda.id = 'capa-fwi-leyenda';
        leyenda.hidden = true;

        var titulo = document.createElement('button');
        titulo.id = 'capa-fwi-leyenda-titulo';
        titulo.type = 'button';
        titulo.setAttribute('aria-expanded', 'false');
        titulo.setAttribute('aria-label', tr('fwiLeyendaExpandir'));

        var lista = document.createElement('ul');
        lista.id = 'capa-fwi-leyenda-lista';
        lista.hidden = true;

        function reconstruirLeyenda() {
            titulo.innerHTML = '';
            var spanTit = document.createElement('span');
            spanTit.textContent = tr('fwiLeyendaTitulo');
            var spanFlecha = document.createElement('span');
            spanFlecha.setAttribute('aria-hidden', 'true');
            spanFlecha.textContent = lista.hidden ? '▸' : '▾';
            titulo.appendChild(spanTit);
            titulo.appendChild(spanFlecha);
            titulo.setAttribute('aria-label',
                lista.hidden ? tr('fwiLeyendaExpandir') : tr('fwiLeyendaColapsar'));

            lista.innerHTML = '';
            CLASES_FWI.forEach(function (c) {
                var li = document.createElement('li');
                var muestra = document.createElement('span');
                muestra.className = 'fwi-muestra';
                muestra.style.backgroundColor = c.color;
                muestra.setAttribute('aria-hidden', 'true');
                var nombre = document.createElement('span');
                nombre.textContent = tr(c.clave);
                var rango = document.createElement('span');
                rango.className = 'fwi-rango';
                rango.textContent = c.rango;
                li.appendChild(muestra);
                li.appendChild(nombre);
                li.appendChild(rango);
                lista.appendChild(li);
            });
            var fuente = leyenda.querySelector('.fwi-fuente');
            if (fuente) fuente.textContent = tr('fwiFuente');
        }

        titulo.addEventListener('click', function () {
            lista.hidden = !lista.hidden;
            titulo.setAttribute('aria-expanded', String(!lista.hidden));
            reconstruirLeyenda();
        });

        var fuente = document.createElement('div');
        fuente.id = 'capa-fwi-leyenda-fuente';
        fuente.className = 'fwi-fuente';

        leyenda.appendChild(titulo);
        leyenda.appendChild(lista);
        leyenda.appendChild(fuente);

        wrap.appendChild(boton);
        wrap.appendChild(estado);
        wrap.appendChild(leyenda);
        contenedor.appendChild(wrap);

        ui = { contenedor: wrap, boton: boton, leyenda: leyenda, estado: estado,
               reconstruirLeyenda: reconstruirLeyenda };
        reconstruirLeyenda();

        // Re-traducir si el usuario cambia de idioma (idiomas.js dispara este
        // evento; si no existe, el usuario verá el último idioma cacheado).
        document.addEventListener('manolito:idioma-cambiado', refrescarTextos);
    }

    function refrescarTextos() {
        if (!ui) return;
        ui.boton.querySelector('.fwi-texto').textContent = tr('fwiToggle');
        ui.boton.setAttribute('aria-label',
            estaActiva ? tr('fwiToggleDesactivar') : tr('fwiToggleActivar'));
        ui.reconstruirLeyenda();
    }

    function mostrarEstado(texto, conReintento) {
        if (!ui) return;
        ui.estado.innerHTML = '';
        ui.estado.appendChild(document.createTextNode(texto));
        if (conReintento) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = '↻';
            btn.setAttribute('aria-label', texto);
            btn.addEventListener('click', function () { api.activar(); });
            ui.estado.appendChild(btn);
        }
        ui.estado.classList.add('fwi-visible');
    }

    function ocultarEstado() {
        if (ui) ui.estado.classList.remove('fwi-visible');
    }

    // ------------------------------------------------------------------ Capa
    function limpiarTimeout() {
        if (timerTimeout) { clearTimeout(timerTimeout); timerTimeout = null; }
    }

    function activarCapa() {
        var map = obtenerMapa();
        if (!map) return; // aún no hay mapa; el retry loop lo reintentará

        if (!capaWms) {
            cargando = true;
            ui.boton.classList.add('fwi-cargando');
            mostrarEstado(tr('fwiCargando'), false);

            // EFFIS sirve el FWI del día: sin TIME el servidor devuelve tiles
            // vacíos. Se calcula la fecha UTC de hoy al instanciar la capa.
            var hoyUTC = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
            capaWms = L.tileLayer.wms(WMS_URL,
                Object.assign({}, WMS_OPTS, { time: hoyUTC }));

            var tileOk = false;
            capaWms.on('load', function () {
                tileOk = true;
                limpiarTimeout();
                cargando = false;
                ui.boton.classList.remove('fwi-cargando');
                ocultarEstado();
            });

            timerTimeout = setTimeout(function () {
                if (tileOk || !cargando) return;
                cargando = false;
                ui.boton.classList.remove('fwi-cargando');
                map.removeLayer(capaWms);
                capaWms = null;
                estaActiva = false;
                ui.boton.setAttribute('aria-pressed', 'false');
                ui.boton.setAttribute('aria-label', tr('fwiToggleActivar'));
                ui.leyenda.hidden = true;
                mostrarEstado(tr('fwiError'), true);
            }, TIMEOUT_CARGA_MS);
        }

        capaWms.addTo(map);
        estaActiva = true;
        ui.boton.setAttribute('aria-pressed', 'true');
        ui.boton.setAttribute('aria-label', tr('fwiToggleDesactivar'));
        ui.leyenda.hidden = false;
    }

    function desactivarCapa() {
        var map = obtenerMapa();
        limpiarTimeout();
        if (cargando) {
            cargando = false;
            if (ui) ui.boton.classList.remove('fwi-cargando');
        }
        if (map && capaWms) map.removeLayer(capaWms);
        estaActiva = false;
        if (ui) {
            ui.boton.setAttribute('aria-pressed', 'false');
            ui.boton.setAttribute('aria-label', tr('fwiToggleActivar'));
            ui.leyenda.hidden = true;
            ocultarEstado();
        }
    }

    // --------------------------------------------------------------- API pública
    var api = {
        activar: function () {
            if (estaActiva || cargando) return;
            if (!ui) return; // UI aún no inyectada; el retry seguirá
            activarCapa();
        },
        desactivar: function () { desactivarCapa(); },
        toggle: function () {
            if (estaActiva) desactivarCapa();
            else api.activar();
        },
        activa: function () { return estaActiva; }
    };
    window.capaFWI = api;

    // ------------------------------------------------- Inyección con retry loop
    // Espera a que exista el contenedor del mapa Y el mapa Leaflet expuesto.
    var intentos = 0;
    var intervalo = setInterval(function () {
        intentos++;
        var contenedor = document.getElementById('map');
        var mapListo = !!obtenerMapa();
        if (contenedor && mapListo) {
            clearInterval(intervalo);
            if (!ui) construirUI(document.body);
        } else if (intentos >= MAX_INTENTOS_DOM) {
            clearInterval(intervalo);
            // Sin mapa expuesto no podemos funcionar: no rompemos nada.
            if (typeof console !== 'undefined') {
                console.warn('[capa-fwi] No se encontró window.manolitoMapa ni window.map. ' +
                    'Añade: window.manolitoMapa = map; tras crear el mapa en motor-cuantico.js');
            }
        }
    }, INTERVALO_DOM_MS);
})();

;

/* ==================== capa-recursos.js ==================== */
/**
 * MANOLIT∞ FORESTAL — Capa de recursos de extinción (OpenStreetMap / Overpass)
 * ---------------------------------------------------------------------------
 * Capa LAZY: no consulta a Overpass hasta que el usuario la activa.
 * Tipos: hidrantes, depósitos de agua, helisuperficies, balsas/embalses
 * y parques de bomberos. Filtrado en cliente, caché en sessionStorage,
 * debounce en moveend y protección ante rate-limit (429/504/timeout).
 *
 * Licencia: AGPL-3.0 (igual que el resto del proyecto).
 * Sin APIs de pago. Vanilla JS + Leaflet 1.9.4.
 *
 * Expone: window.capaRecursos = { activar, desactivar, toggle, activa, recargar }
 */
(function () {
    'use strict';

    /* ================= CONFIGURACIÓN ================= */

    var OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
    var DEBOUNCE_MS = 800;
    var MAX_LADO_GRADOS = 0.5;      // si el bbox supera 0.5° de lado, pedimos zoom
    var CACHE_PREFIX = 'mf-recursos:';
    var CACHE_TTL_MS = 10 * 60 * 1000; // 10 min

    var TIPOS = {
        hidrante: {
            svg: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5 C13.8 6.5 17.5 9 17.5 13.5 a5.5 5.5 0 0 1-11 0 C6.5 9 10.2 6.5 12 2.5 Z" fill="#fff"/></svg>',
            i18n: 'recursos.tipoHidrante',
            overpass: [
                'node["emergency"="fire_hydrant"]({{bbox}});',
                'way["emergency"="fire_hydrant"]({{bbox}});'
            ]
        },
        deposito: {
            svg: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="3" fill="none" stroke="#fff" stroke-width="2"/><path d="M5 13 h14" stroke="#fff" stroke-width="2"/></svg>',
            i18n: 'recursos.tipoDeposito',
            overpass: [
                'node["emergency"="water_tank"]({{bbox}});',
                'way["emergency"="water_tank"]({{bbox}});'
            ]
        },
        helisuperficie: {
            svg: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4 v16 M17 4 v16 M7 12 h10" stroke="#fff" stroke-width="3" fill="none"/></svg>',
            i18n: 'recursos.tipoHelisuperficie',
            overpass: [
                'node["aeroway"="helipad"]({{bbox}});',
                'way["aeroway"="helipad"]({{bbox}});'
            ]
        },
        balsa: {
            svg: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14 c2-2 4-2 6 0 s4 2 6 0 4-2 4 0 v4 H4 Z" fill="#fff"/></svg>',
            i18n: 'recursos.tipoBalsa',
            overpass: [
                'node["natural"="water"]["water"~"^(reservoir|basin)$"]({{bbox}});',
                'way["natural"="water"]["water"~"^(reservoir|basin)$"]({{bbox}});',
                'way["landuse"="reservoir"]({{bbox}});'
            ]
        },
        bomberos: {
            svg: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 C13.2 6.5 17 8.5 17 13.6 a5 5 0 0 1-10 0 C7 10.5 8 9.5 8.8 7.6 9.6 9.5 10.6 10.2 11 10.2 c0-3.4 .6-6.6 1-8.2 Z" fill="#fff"/></svg>',
            i18n: 'recursos.tipoBomberos',
            overpass: [
                'node["emergency"="fire_station"]({{bbox}});',
                'way["emergency"="fire_station"]({{bbox}});'
            ]
        }
    };

    /* ================= I18N CON FALLBACK ================= */
    /* El proyecto define t() en idiomas.js. Aquí resolvemos con cascada:
       window.t → window.i18n.t → IDIOMAS[lang] → fallback ES embebido → clave. */

    var FALLBACK_ES = {
        'recursos.toggleAria': 'Activar capa de recursos de extinción',
        'recursos.panelTitulo': 'Recursos de extinción',
        'recursos.tipoHidrante': 'Hidrante',
        'recursos.tipoDeposito': 'Depósito de agua',
        'recursos.tipoHelisuperficie': 'Helisuperficie',
        'recursos.tipoBalsa': 'Balsa / embalse',
        'recursos.tipoBomberos': 'Parque de bomberos',
        'recursos.cargando': 'Cargando recursos…',
        'recursos.errorSaturado': 'Servidor de mapas saturado. Inténtalo de nuevo en unos minutos.',
        'recursos.errorRed': 'Sin conexión con el servidor de recursos.',
        'recursos.zoomNecesario': 'Zona demasiado grande: acerca el mapa para cargar recursos.',
        'recursos.contador': '{n} recursos en la zona visible',
        'recursos.sinResultados': 'No hay recursos de este tipo en la zona visible.',
        'recursos.copiar': 'Copiar coords',
        'recursos.copiado': '¡Copiado!',
        'recursos.tipo': 'Tipo',
        'recursos.nombre': 'Nombre',
        'recursos.coords': 'Coordenadas',
        'recursos.reintentar': 'Reintentar'
    };

    function idiomaActual() {
        var sel = document.getElementById('selector-idioma');
        if (sel && sel.value) return sel.value;
        var html = document.documentElement.lang;
        return (html || 'es').slice(0, 2);
    }

    function tr(clave) {
        try {
            if (typeof window.t === 'function') {
                var v = window.t(clave);
                if (v && v !== clave) return v;
            }
            if (window.i18n && typeof window.i18n.t === 'function') {
                var v2 = window.i18n.t(clave);
                if (v2 && v2 !== clave) return v2;
            }
            if (window.IDIOMAS) {
                var lang = idiomaActual();
                var pack = window.IDIOMAS[lang] || window.IDIOMAS.es;
                if (pack && pack[clave]) return pack[clave];
            }
        } catch (e) { /* cascada al fallback */ }
        return FALLBACK_ES[clave] || clave;
    }

    /* ================= ESTADO ================= */

    var mapa = null;
    var grupo = null;            // L.layerGroup con los marcadores
    var elementos = [];          // datos brutos de la última consulta
    var filtros = {};            // tipo → boolean (todos activos al inicio)
    var estaActiva = false;
    var consultaEnCurso = false;
    var debounceTimer = null;
    var ui = {};                 // referencias DOM
    var haSidoConsultado = false;

    Object.keys(TIPOS).forEach(function (k) { filtros[k] = true; });

    /* ================= OVERPASS ================= */

    function bboxActual() {
        var b = mapa.getBounds();
        return {
            south: b.getSouth(), west: b.getWest(),
            north: b.getNorth(), east: b.getEast()
        };
    }

    function bboxDemasiadoGrande(b) {
        return (b.north - b.south) > MAX_LADO_GRADOS ||
               (b.east - b.west) > MAX_LADO_GRADOS;
    }

    function claveCache(b) {
        function r(x) { return Math.round(x * 100) / 100; }
        return CACHE_PREFIX + r(b.south) + ',' + r(b.west) + ',' + r(b.north) + ',' + r(b.east);
    }

    function leerCache(clave) {
        try {
            var raw = sessionStorage.getItem(clave);
            if (!raw) return null;
            var obj = JSON.parse(raw);
            if (!obj || (Date.now() - obj.ts) > CACHE_TTL_MS) return null;
            return obj.elementos;
        } catch (e) { return null; }
    }

    function guardarCache(clave, lista) {
        try {
            sessionStorage.setItem(clave, JSON.stringify({ ts: Date.now(), elementos: lista }));
        } catch (e) { /* sessionStorage lleno: seguimos sin caché */ }
    }

    function construirQuery(b) {
        var bboxStr = b.south + ',' + b.west + ',' + b.north + ',' + b.east;
        var partes = [];
        Object.keys(TIPOS).forEach(function (k) {
            TIPOS[k].overpass.forEach(function (frag) {
                partes.push(frag.split('{{bbox}}').join(bboxStr));
            });
        });
        return '[out:json][timeout:25];(' + partes.join('') + ');out center;';
    }

    function clasificar(tags) {
        if (!tags) return null;
        if (tags.emergency === 'fire_hydrant') return 'hidrante';
        if (tags.emergency === 'water_tank') return 'deposito';
        if (tags.aeroway === 'helipad') return 'helisuperficie';
        if (tags.emergency === 'fire_station') return 'bomberos';
        if (tags.natural === 'water' || tags.landuse === 'reservoir') return 'balsa';
        return null;
    }

    function normalizar(el) {
        var lat = el.lat, lon = el.lon;
        if (el.type === 'way' && el.center) { lat = el.center.lat; lon = el.center.lon; }
        if (typeof lat !== 'number' || typeof lon !== 'number') return null;
        var tipo = clasificar(el.tags || {});
        if (!tipo) return null;
        return {
            tipo: tipo,
            lat: lat,
            lon: lon,
            nombre: (el.tags && (el.tags.name || el.tags.operator)) || null
        };
    }

    /* ================= CONSULTA (lazy, con caché y rate-limit) ================= */

    function consultar() {
        if (!estaActiva || !mapa || consultaEnCurso) return;

        var b = bboxActual();

        if (bboxDemasiadoGrande(b)) {
            elementos = [];
            pintarMarcadores();
            mostrarEstado('zoom');
            return;
        }

        var ck = claveCache(b);
        var enCache = leerCache(ck);
        if (enCache) {
            elementos = enCache;
            haSidoConsultado = true;
            pintarMarcadores();
            mostrarEstado('ok');
            return;
        }

        consultaEnCurso = true;
        mostrarEstado('cargando');

        fetch(OVERPASS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'data=' + encodeURIComponent(construirQuery(b))
        })
            .then(function (res) {
                if (res.status === 429 || res.status === 504) {
                    // Rate limit / gateway saturado: avisar y NO reintentar en bucle.
                    throw new Error('saturado');
                }
                if (!res.ok) throw new Error('http_' + res.status);
                return res.json();
            })
            .then(function (json) {
                var lista = (json.elements || []).map(normalizar).filter(Boolean);
                elementos = lista;
                haSidoConsultado = true;
                guardarCache(ck, lista);
                pintarMarcadores();
                mostrarEstado('ok');
            })
            .catch(function (err) {
                if (err && err.message === 'saturado') mostrarEstado('saturado');
                else mostrarEstado('red');
            })
            .finally(function () {
                consultaEnCurso = false;
            });
    }

    function alMoverMapa() {
        if (!estaActiva) return;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(consultar, DEBOUNCE_MS);
    }

    /* ================= PINTADO ================= */

    function icono(tipo) {
        return L.divIcon({
            className: 'mf-recurso-icono mf-recurso-' + tipo,
            html: '<span role="img" aria-label="' + tr(TIPOS[tipo].i18n) + '">' +
                  TIPOS[tipo].svg + '</span>',
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -14]
        });
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function htmlPopup(el) {
        var coords = el.lat.toFixed(5) + ', ' + el.lon.toFixed(5);
        var html = '<div class="mf-recurso-popup">' +
            '<strong>' + tr('recursos.tipo') + ':</strong> ' + escapeHtml(tr(TIPOS[el.tipo].i18n)) + '<br>';
        if (el.nombre) {
            html += '<strong>' + tr('recursos.nombre') + ':</strong> ' + escapeHtml(el.nombre) + '<br>';
        }
        html += '<strong>' + tr('recursos.coords') + ':</strong> <code>' + coords + '</code><br>' +
            '<button type="button" class="mf-btn-copiar" data-coords="' + coords + '" ' +
            'style="min-width:48px;min-height:48px;margin-top:6px;cursor:pointer;">' +
            tr('recursos.copiar') + '</button></div>';
        return html;
    }

    function pintarMarcadores() {
        if (!grupo) return;
        grupo.clearLayers();
        var visibles = 0;
        elementos.forEach(function (el) {
            if (!filtros[el.tipo]) return;
            visibles++;
            L.marker([el.lat, el.lon], { icon: icono(el.tipo), title: tr(TIPOS[el.tipo].i18n) })
                .bindPopup(htmlPopup(el))
                .addTo(grupo);
        });
        actualizarContador(visibles);
    }

    /* ================= UI: ESTADO / CONTADOR ================= */

    function mostrarEstado(estado) {
        if (!ui.estado) return;
        ui.estado.classList.remove('mf-cargando');
        ui.spinner.hidden = true;
        switch (estado) {
            case 'cargando':
                ui.estado.textContent = tr('recursos.cargando');
                ui.spinner.hidden = false;
                ui.estado.classList.add('mf-cargando');
                break;
            case 'saturado':
                ui.estado.textContent = tr('recursos.errorSaturado');
                break;
            case 'red':
                ui.estado.textContent = tr('recursos.errorRed');
                break;
            case 'zoom':
                ui.estado.textContent = tr('recursos.zoomNecesario');
                actualizarContador(0);
                break;
            default:
                ui.estado.textContent = '';
        }
    }

    function actualizarContador(n) {
        if (!ui.contador) return;
        if (!haSidoConsultado) { ui.contador.textContent = ''; return; }
        var msg = tr('recursos.contador').replace('{n}', String(n));
        if (n === 0 && elementos.length === 0) {
            var b = mapa ? bboxActual() : null;
            if (b && !bboxDemasiadoGrande(b)) msg = tr('recursos.sinResultados');
        }
        ui.contador.textContent = msg;
    }

    /* ================= UI: TOGGLE + PANEL ================= */

    function inyectarEstilos() {
        if (document.getElementById('mf-recursos-css')) return;
        var css = document.createElement('style');
        css.id = 'mf-recursos-css';
        css.textContent =
            /* Botón: abajo-IZQUIERDA (chat abajo-derecha, dashboard arriba-derecha,
               selector de idioma arriba-izquierda → sin colisiones). */
            '#mf-recursos-toggle{position:fixed;left:12px;bottom:12px;z-index:1000;' +
            'min-width:48px;min-height:48px;border-radius:12px;border:1px solid rgba(0,243,255,.4);' +
            'background:rgba(10,14,20,.9);color:#fff;font-size:1.4rem;cursor:pointer;' +
            'display:flex;align-items:center;justify-content:center;padding:0 12px;gap:6px}' +
            '#mf-recursos-toggle[aria-pressed="true"]{background:rgba(0,120,180,.85)}' +
            '#mf-recursos-panel{position:fixed;left:12px;bottom:72px;z-index:1000;' +
            'background:rgba(10,14,20,.94);color:#eee;border:1px solid rgba(0,243,255,.35);' +
            'border-radius:12px;padding:12px 14px;min-width:220px;max-width:calc(100vw - 24px);' +
            'font-size:.95rem;backdrop-filter:blur(4px)}' +
            '#mf-recursos-panel[hidden]{display:none}' +
            '#mf-recursos-panel fieldset{border:none;margin:0;padding:0}' +
            '#mf-recursos-panel legend{font-weight:700;margin-bottom:8px}' +
            '#mf-recursos-panel label{display:flex;align-items:center;gap:10px;' +
            'min-height:48px;cursor:pointer}' +
            '#mf-recursos-panel input[type=checkbox]{width:22px;height:22px}' +
            '#mf-recursos-estado{margin-top:8px;min-height:1.2em;color:#ffb347;display:flex;' +
            'align-items:center;gap:8px}' +
            '#mf-recursos-contador{margin-top:4px;color:#7fd4ff}' +
            '.mf-spinner{width:18px;height:18px;border:3px solid rgba(255,255,255,.25);' +
            'border-top-color:#00f3ff;border-radius:50%;animation:mf-spin 1s linear infinite}' +
            '@keyframes mf-spin{to{transform:rotate(360deg)}}' +
            '.mf-recurso-icono{background:rgba(10,14,20,.85);border:2px solid #00f3ff;' +
            'border-radius:50%;display:flex;align-items:center;justify-content:center;' +
            'font-size:16px;box-shadow:0 0 6px rgba(0,0,0,.6)}' +
            '.mf-recurso-popup code{user-select:all}' +
            '@media (max-width:420px){#mf-recursos-panel{left:12px;right:12px;max-width:none}}';
        document.head.appendChild(css);
    }

    function crearUI() {
        inyectarEstilos();

        var toggle = document.createElement('button');
        toggle.id = 'mf-recursos-toggle';
        toggle.type = 'button';
        toggle.setAttribute('aria-pressed', 'false');
        toggle.setAttribute('aria-label', tr('recursos.toggleAria'));
        toggle.setAttribute('aria-controls', 'mf-recursos-panel');
        toggle.innerHTML = '<span aria-hidden="true">' + '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 C13.2 6.5 17 8.5 17 13.6 a5 5 0 0 1-10 0 C7 10.5 8 9.5 8.8 7.6 9.6 9.5 10.6 10.2 11 10.2 c0-3.4 .6-6.6 1-8.2 Z" fill="#fff"/></svg>' + '</span>';

        var panel = document.createElement('section');
        panel.id = 'mf-recursos-panel';
        panel.setAttribute('aria-label', tr('recursos.panelTitulo'));
        panel.hidden = true;

        var fieldset = document.createElement('fieldset');
        var legend = document.createElement('legend');
        legend.textContent = tr('recursos.panelTitulo');
        fieldset.appendChild(legend);

        Object.keys(TIPOS).forEach(function (k) {
            var label = document.createElement('label');
            var cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = true;
            cb.dataset.tipo = k;
            cb.setAttribute('aria-label', tr(TIPOS[k].i18n));
            cb.addEventListener('change', function () {
                filtros[k] = cb.checked;   // filtrado en cliente, sin re-consultar
                pintarMarcadores();
            });
            label.appendChild(cb);
            var span = document.createElement('span');
            span.innerHTML = TIPOS[k].svg + ' '; span.appendChild(document.createTextNode(tr(TIPOS[k].i18n)));
            label.appendChild(span);
            fieldset.appendChild(label);
        });
        panel.appendChild(fieldset);

        var estado = document.createElement('p');
        estado.id = 'mf-recursos-estado';
        estado.setAttribute('aria-live', 'polite');
        var spinner = document.createElement('span');
        spinner.className = 'mf-spinner';
        spinner.hidden = true;
        spinner.setAttribute('aria-hidden', 'true');
        estado.appendChild(spinner);
        var estadoTxt = document.createElement('span');
        estado.appendChild(estadoTxt);
        panel.appendChild(estado);

        var contador = document.createElement('p');
        contador.id = 'mf-recursos-contador';
        contador.setAttribute('aria-live', 'polite');
        panel.appendChild(contador);

        document.body.appendChild(toggle);
        document.body.appendChild(panel);

        ui.toggle = toggle;
        ui.panel = panel;
        ui.estado = estadoTxt;
        ui.spinner = spinner;
        ui.contador = contador;

        toggle.addEventListener('click', function () {
            toggleCapa();
        });

        // Botón "Copiar coords" dentro de popups (delegado sobre el mapa)
        mapa.on('popupopen', function (e) {
            var node = e.popup && e.popup.getElement();
            if (!node) return;
            var btn = node.querySelector('.mf-btn-copiar');
            if (!btn) return;
            btn.addEventListener('click', function () {
                var texto = btn.dataset.coords;
                function feedback() {
                    var antes = btn.textContent;
                    btn.textContent = tr('recursos.copiado');
                    btn.disabled = true;
                    setTimeout(function () { btn.textContent = antes; btn.disabled = false; }, 1500);
                }
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(texto).then(feedback, feedback);
                } else {
                    var ta = document.createElement('textarea');
                    ta.value = texto;
                    document.body.appendChild(ta);
                    ta.select();
                    try { document.execCommand('copy'); } catch (e2) { /* noop */ }
                    document.body.removeChild(ta);
                    feedback();
                }
            });
        });
    }

    /* ================= API PÚBLICA ================= */

    function activar() {
        if (estaActiva || !mapa) return;
        estaActiva = true;
        if (!grupo) grupo = L.layerGroup().addTo(mapa);
        else grupo.addTo(mapa);
        mapa.on('moveend', alMoverMapa);
        ui.toggle.setAttribute('aria-pressed', 'true');
        ui.panel.hidden = false;
        consultar(); // primera consulta: aquí empieza la carga lazy
    }

    function desactivar() {
        if (!estaActiva) return;
        estaActiva = false;
        clearTimeout(debounceTimer);
        mapa.off('moveend', alMoverMapa);
        if (grupo) mapa.removeLayer(grupo);
        ui.toggle.setAttribute('aria-pressed', 'false');
        ui.panel.hidden = true;
        mostrarEstado('ok');
    }

    function toggleCapa() { estaActiva ? desactivar() : activar(); }

    function recargar() {
        // Invalida la caché del bbox actual y fuerza re-consulta si está activa.
        if (mapa) {
            try { sessionStorage.removeItem(claveCache(bboxActual())); } catch (e) { /* noop */ }
        }
        if (estaActiva) consultar();
    }

    window.capaRecursos = {
        activar: activar,
        desactivar: desactivar,
        toggle: toggleCapa,
        activa: function () { return estaActiva; },
        recargar: recargar
    };

    /* ================= ARRANQUE: resolver el mapa con retry loop ================= */
    /* motor-cuantico.js declara `const map = L.map('map', …)` en ámbito global
       de script (no en window). Probamos varios hooks antes de rendirnos. */

    function resolverMapa() {
        if (window.manolitoMapa && typeof window.manolitoMapa.getBounds === 'function') {
            return window.manolitoMapa;
        }
        if (window.map && typeof window.map.getBounds === 'function') {
            return window.map;
        }
        try {
            // eslint-disable-next-line no-undef
            if (typeof map !== 'undefined' && map && typeof map.getBounds === 'function') {
                return map; // binding léxico global del script motor-cuantico.js
            }
        } catch (e) { /* no disponible */ }
        return null;
    }

    var intentos = 0;
    var MAX_INTENTOS = 20;
    var intervalo = setInterval(function () {
        var m = resolverMapa();
        if (m && document.body) {
            clearInterval(intervalo);
            mapa = m;
            crearUI();
        } else if (++intentos >= MAX_INTENTOS) {
            clearInterval(intervalo);
            console.warn('[capa-recursos] mapa Leaflet no encontrado tras ' +
                MAX_INTENTOS + ' intentos; window.capaRecursos queda expuesta pero inactiva.');
        }
    }, 200);
})();

;

/* ==================== bandas-propagacion.js ==================== */
/**
 * MANOLIT∞ FORESTAL - BANDAS ESTIMADAS DE PROPAGACIÓN DE INCENDIO
 * =================================================================
 * Dibuja 3 bandas elípticas concéntricas (t+2h, t+6h, t+12h) desde el
 * último punto evaluado, usando la ROS real del motor científico
 * (Rothermel 1972, window.MotorFuego) y el viento actual.
 *
 * MODELO: elipse estándar de propagación (Anderson 1983 / Alexander 1985,
 * "simple ellipse model", el mismo que usa la literatura operativa de
 * FARSITE para formas de fuego):
 *
 *   - La dirección del eje mayor es la de AVANCE del fuego = viento
 *     hacia sotavento: azAvance = (windDirOrigen + 180) % 360.
 *   - Distancia de cabeza (head fire) en t minutos:
 *         head_m = rosMMin * t
 *   - Distancia de cola (back fire): fracción del head según el viento
 *     U (km/h):  ratio = clamp(0.5 - 0.005*U, 0.3, 0.5)
 *     (con viento fuerte la cola avanza proporcionalmente menos; en
 *     calma la forma tiende a circular y back->0.5*head por asimetría
 *     de encendido puntual).
 *   - Relación longitud/anchura: LB = clamp(1 + 0.25 * U, 1, 8)
 *     (forma canónica de Anderson 1983 / Finney; LB=1 con calma,
 *     ~2-3 con viento moderado, acotado a 8 para no producir agujas
 *     irreales con vendavales).
 *   - Longitud total L = head + back; semiejes:
 *         a = L / 2            (semieje mayor)
 *         b = L / (2 * LB)     (semieje menor)
 *         offset = (head - back) / 2   (centro desplazado a sotavento:
 *                                       el punto de ignición NO es el
 *                                       centro geométrico de la elipse)
 *
 * APROXIMACIONES (¡estimación simplificada, NO herramienta operativa!):
 *   1. ROS constante durante todo el horizonte: ignora el ciclo
 *      diario, cambios de viento, agotamiento/curado del combustible
 *      y los cortafuegos naturales (ríos, carreteras, roquedo).
 *   2. Viento constante en velocidad y dirección durante 12 h.
 *   3. No modela aceleración inicial del fuego (point-ignition
 *      acceleration): las primeras horas reales son algo menores.
 *   4. No modela antorchas, fuego de copas ni focos secundarios
 *      (spotting), que en episodios extremos adelantan mucho el frente.
 *   5. La pendiente ya entra en la ROS vía Rothermel, pero se asume
 *      uniforme en todas las direcciones de la elipse.
 *
 * INTEGRACIÓN:
 *   - Mapa Leaflet: el módulo intenta obtenerlo así, por este orden:
 *       1. Captura la instancia en el constructor L.Map si este script
 *          se carga ANTES de motor-cuantico.js (recomendado).
 *       2. window.MANOLITO_MAPA (si el integrador lo expone).
 *       3. Evento 'manolitoforestal:mapa-listo' con detail = map.
 *     Hay un retry loop (máx ~10 s) hasta tener mapa y DOM listos.
 *   - El integrador debe llamar tras cada evaluación:
 *       window.bandasPropagacion.actualizar(lat, lng, datosMotor)
 *     (ver bandas.integracion.md para el formato exacto de datosMotor).
 *
 * Expone UN solo hook: window.bandasPropagacion =
 *   { actualizar(lat, lng, datosMotor), limpiar(), visibles(), toggle() }
 *
 * Licencia: AGPL (como el resto del proyecto).
 */

(function () {
'use strict';

// ============================================================
// 1. CONSTANTES DEL MODELO
// ============================================================
const BANDAS = [
    { horas: 12, color: '#ffe600' },  // AMARILLO - se dibuja primero (al fondo)
    { horas: 6,  color: '#ffaa00' },  // NARANJA
    { horas: 2,  color: '#ff003c' }   // ROJO - se dibuja último (encima)
];
const FILL_OPACITY = 0.15;
const MAX_VERTICES = 64;        // rendimiento móvil
const RADIO_TIERRA_KM = 6371;

// ============================================================
// 2. I18N — usa la t() global de idiomas.js si existe
//    (idiomas.js: 6 idiomas es/ca/eu/gl/en/fr, t(clave, params)).
//    Si falta la clave o la función, cae a este diccionario (es).
// ============================================================
const FALLBACK = {
    bandasTituloToggle: 'Mostrar/ocultar bandas de propagación estimada',
    bandasTooltip: 't+{h}h ≈ {km} km (cabeza de fuego)',
    bandasAviso: 'Estimación simplificada: viento y velocidad constantes. No usar para decisiones operativas.'
};
function tr(clave, params) {
    let s;
    if (typeof window.t === 'function') {
        s = window.t(clave, params || {});
        if (typeof s === 'string' && s !== clave) return s;
    }
    s = FALLBACK[clave] || clave;
    if (params) {
        Object.keys(params).forEach(k => {
            s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), String(params[k]));
        });
    }
    return s;
}

// ============================================================
// 3. GEODESIA — destino sobre la esfera (misma fórmula que
//    destinoDesdeAzimut de motor-cuantico.js, autocontenida aquí)
// ============================================================
function destinoDesdeAzimut(lat, lon, azimutDeg, distanciaKm) {
    const brng = azimutDeg * Math.PI / 180;
    const lat1 = lat * Math.PI / 180;
    const lon1 = lon * Math.PI / 180;
    const d = distanciaKm / RADIO_TIERRA_KM;
    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) +
        Math.cos(lat1) * Math.sin(d) * Math.cos(brng));
    const lon2 = lon1 + Math.atan2(
        Math.sin(brng) * Math.sin(d) * Math.cos(lat1),
        Math.cos(d) - Math.sin(lat1) * Math.sin(lat2)
    );
    return [lat2 * 180 / Math.PI, lon2 * 180 / Math.PI];
}

// ============================================================
// 4. GEOMETRÍA DE LA ELIPSE DE FUEGO
//    Devuelve vértices [lat, lon] (<= MAX_VERTICES) y distancias.
//    El punto (lat, lon) es el foco de ignición; el centro de la
//    elipse está desplazado a sotavento (head > back).
// ============================================================
function calcularElipse(lat, lon, rosMMin, minutos, windKmh, windDirOrigen) {
    const headM = Math.max(0, rosMMin) * minutos;
    if (headM <= 0) return null;

    const U = Math.max(0, windKmh || 0);
    const LB = Math.min(8, Math.max(1, 1 + 0.25 * U));            // Anderson/Finney
    const ratioBack = Math.min(0.5, Math.max(0.3, 0.5 - 0.005 * U));
    const backM = headM * ratioBack;

    const longitudM = headM + backM;
    const a = longitudM / 2;                   // semieje mayor (m)
    const b = longitudM / (2 * LB);            // semieje menor (m)
    const offsetM = (headM - backM) / 2;       // desplazamiento del centro

    const azAvance = (typeof windDirOrigen === 'number' && !isNaN(windDirOrigen))
        ? (windDirOrigen + 180) % 360
        : 0; // sin viento: forma circular hacia el norte (LB=1 => b=a)

    // Centro de la elipse desplazado a sotavento
    const centro = destinoDesdeAzimut(lat, lon, azAvance, offsetM / 1000);

    // Proyección local en grados: lon ajustado por cos(lat)
    const lat0 = centro[0] * Math.PI / 180;
    const mPorGradoLat = 111320;
    const mPorGradoLon = 111320 * Math.cos(lat0) || 1e-6;
    const azRad = azAvance * Math.PI / 180;

    const vertices = [];
    const N = Math.min(MAX_VERTICES, 64);
    for (let i = 0; i < N; i++) {
        const th = (2 * Math.PI * i) / N;
        // x = a lo largo del eje mayor (dirección de avance), y = perpendicular
        const x = a * Math.cos(th);   // +x = hacia cabeza
        const y = b * Math.sin(th);
        // Rotar: x apunta al azimut azAvance (componentes N y E)
        const norteM = x * Math.cos(azRad) - y * Math.sin(azRad);
        const esteM  = x * Math.sin(azRad) + y * Math.cos(azRad);
        vertices.push([
            centro[0] + norteM / mPorGradoLat,
            centro[1] + esteM / mPorGradoLon
        ]);
    }
    return { vertices, headM, backM, LB };
}

// ============================================================
// 5. ESTADO Y RENDERIZADO
// ============================================================
let mapa = null;
let grupoBandas = null;        // L.layerGroup con las 3 bandas
let capaAviso = null;          // marcador del aviso "estimación simplificada"
let botonToggle = null;
let visible = true;
let ultimaEvaluacion = null;   // { lat, lng, datos } para redibujar al reactivar

function asegurarGrupo() {
    if (!grupoBandas) grupoBandas = L.layerGroup();
    if (visible && mapa && !mapa.hasLayer(grupoBandas)) grupoBandas.addTo(mapa);
}

function limpiarCapas() {
    if (grupoBandas) grupoBandas.clearLayers();
    if (capaAviso && mapa) { mapa.removeLayer(capaAviso); capaAviso = null; }
}

function renderizar(lat, lng, datos) {
    if (!mapa) return;
    limpiarCapas();
    ultimaEvaluacion = { lat, lng, datos };

    const rosMMin = Number(datos.rosMMin);
    if (!isFinite(rosMMin) || rosMMin <= 0) return; // sin propagación: nada que dibujar

    asegurarGrupo();

    // De mayor a menor para que las tres se vean (12h al fondo)
    BANDAS.forEach(banda => {
        const el = calcularElipse(lat, lng, rosMMin, banda.horas * 60,
                                  datos.windKmh, datos.windDir);
        if (!el) return;
        const km = (el.headM / 1000);
        const kmTxt = km >= 10 ? km.toFixed(0) : km.toFixed(1);
        const poligono = L.polygon(el.vertices, {
            color: banda.color,
            weight: 2,
            opacity: 0.95,
            fillColor: banda.color,
            fillOpacity: FILL_OPACITY,
            interactive: true
        });
        poligono.bindTooltip(
            tr('bandasTooltip', { h: banda.horas, km: kmTxt }),
            {
                permanent: true,
                direction: 'center',
                className: 'banda-propagacion-tooltip',
                interactive: false
            }
        );
        poligono.addTo(grupoBandas);
    });

    // Aviso "estimación simplificada" junto al punto de ignición
    capaAviso = L.marker([lat, lng], {
        interactive: true,
        keyboard: true,
        icon: L.divIcon({
            className: 'banda-aviso-icono',
            html: '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 L22 20 H2 Z" fill="#ffb300" stroke="#000" stroke-width="1"/><rect x="11" y="9" width="2" height="6" fill="#000"/><rect x="11" y="16.5" width="2" height="2" fill="#000"/></svg>',
            iconSize: [24, 24],
            iconAnchor: [12, 30]
        }),
        title: tr('bandasAviso')
    });
    capaAviso.bindTooltip(tr('bandasAviso'), { direction: 'top' });
    if (visible) capaAviso.addTo(mapa);
}

// ============================================================
// 6. CAPTURA DEL MAPA LEAFLET
//    motor-cuantico.js guarda el mapa en una `const` local: no es
//    accesible desde fuera. Tres vías (documentadas para el integrador):
//      a) Parche del constructor L.Map si cargamos antes que el motor
//         (el <script> debe ir ANTES de motor-cuantico.js).
//      b) window.MANOLITO_MAPA expuesta por el integrador.
//      c) Evento 'manolitoforestal:mapa-listo' (e.detail = mapa).
// ============================================================
function capturarMapa(m) { if (m && !mapa) { mapa = m; onMapaListo(); } }

if (window.L && window.L.Map && window.L.Map.prototype && !window.L.Map.__manolitoParcheado) {
    const addInitHookOriginal = window.L.Map.prototype.addInitHook;
    // Vía más segura: envolver el constructor
    const MapOriginal = window.L.Map;
    window.L.Map = function (id, options) {
        const instancia = new MapOriginal(id, options);
        capturarMapa(instancia);
        return instancia;
    };
    window.L.Map.prototype = MapOriginal.prototype;
    window.L.Map.__manolitoParcheado = true;
    // L.map() es factoría: también la envolvemos
    const factoriaOriginal = window.L.map;
    window.L.map = function (id, options) {
        const instancia = factoriaOriginal(id, options);
        capturarMapa(instancia);
        return instancia;
    };
}

window.addEventListener('manolitoforestal:mapa-listo', function (e) {
    capturarMapa(e && e.detail);
});

// Retry loop: DOM + mapa (máx 40 intentos x 250 ms = 10 s)
let intentosMapa = 0;
const reintento = setInterval(function () {
    intentosMapa++;
    if (!mapa && window.MANOLITO_MAPA) capturarMapa(window.MANOLITO_MAPA);
    if (mapa || intentosMapa >= 40) {
        if (mapa || intentosMapa >= 40) clearInterval(reintento);
        if (mapa) asegurarBoton();
        else console.warn('[bandas-propagacion] No se encontró el mapa Leaflet. ' +
            'Expón window.MANOLITO_MAPA o carga este script antes de motor-cuantico.js.');
    }
}, 250);

function onMapaListo() {
    asegurarBoton();
    if (ultimaEvaluacion) {
        renderizar(ultimaEvaluacion.lat, ultimaEvaluacion.lng, ultimaEvaluacion.datos);
    }
}

// ============================================================
// 7. BOTÓN TOGGLE — accesible, >=48px, abajo-izquierda
//    (no colisiona: zoom arriba-izq, idioma arriba-izq compensado,
//     dashboard arriba-der, capas + chat abajo-der)
// ============================================================
function inyectarCss() {
    if (document.getElementById('bandas-propagacion-css')) return;
    const style = document.createElement('style');
    style.id = 'bandas-propagacion-css';
    style.textContent = [
        '#bandas-toggle{position:absolute;left:12px;bottom:96px;z-index:600;',
        'min-width:48px;min-height:48px;width:52px;height:52px;border-radius:10px;',
        'border:1px solid rgba(255,255,255,.12);background:rgba(14,19,28,.88);',
        'color:#ffe600;font-size:24px;line-height:1;cursor:pointer;',
        'display:flex;align-items:center;justify-content:center;',
        'backdrop-filter:blur(8px);touch-action:manipulation;}',
        '#bandas-toggle:hover,#bandas-toggle:focus-visible{outline:2px solid #ffe600;outline-offset:2px;}',
        '#bandas-toggle[aria-pressed="false"]{opacity:.55;}',
        '.banda-propagacion-tooltip{background:rgba(14,19,28,.9);color:#e6ecf2;',
        'border:1px solid rgba(255,255,255,.25);border-radius:6px;',
        'font:600 11px Inter,sans-serif;box-shadow:none;}',
        '.banda-propagacion-tooltip:before{display:none;}',
        '@media (max-width:640px){#bandas-toggle{bottom:120px;left:10px;}}'
    ].join('');
    document.head.appendChild(style);
}

function asegurarBoton() {
    if (botonToggle || !document.body) return;
    inyectarCss();
    botonToggle = document.createElement('button');
    botonToggle.id = 'bandas-toggle';
    botonToggle.type = 'button';
    botonToggle.setAttribute('aria-pressed', String(visible));
    botonToggle.setAttribute('aria-label', tr('bandasTituloToggle'));
    botonToggle.title = tr('bandasTituloToggle');
    botonToggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 C13.2 6.5 17 8.5 17 13.6 a5 5 0 0 1-10 0 C7 10.5 8 9.5 8.8 7.6 9.6 9.5 10.6 10.2 11 10.2 c0-3.4 .6-6.6 1-8.2 Z" fill="currentColor"/></svg>';
    botonToggle.addEventListener('click', function () { api.toggle(); });
    document.body.appendChild(botonToggle);

    // Si el idioma cambia en caliente, re-etiquetar
    window.addEventListener('manolitoforestal:idioma-cambiado', function () {
        if (botonToggle) {
            botonToggle.setAttribute('aria-label', tr('bandasTituloToggle'));
            botonToggle.title = tr('bandasTituloToggle');
        }
    });
}

// ============================================================
// 8. API PÚBLICA (único hook window.*)
//    datosMotor (campos REALES de window.MotorFuego.evaluarPunto + viento):
//      {
//        rosMMin:  number  (m/min, de evaluarPunto().rosMMin)   [obligatorio]
//        windKmh:  number  (km/h, viento 10 m de Open-Meteo)    [obligatorio]
//        windDir:  number  (grados, DIRECCIÓN DE ORIGEN del
//                           viento, igual que en todo el código) [opcional:
//                                                                 sin él la
//                                                                 banda es circular]
//      }
// ============================================================
const api = {
    actualizar: function (lat, lng, datosMotor) {
        if (typeof lat !== 'number' || typeof lng !== 'number' || !datosMotor) return;
        if (!mapa) { ultimaEvaluacion = { lat, lng, datos: datosMotor }; return; }
        renderizar(lat, lng, datosMotor);
    },
    limpiar: function () {
        ultimaEvaluacion = null;
        limpiarCapas();
    },
    visibles: function () { return visible; },
    toggle: function () {
        visible = !visible;
        if (botonToggle) botonToggle.setAttribute('aria-pressed', String(visible));
        if (!mapa || !grupoBandas) return;
        if (visible) {
            grupoBandas.addTo(mapa);
            if (capaAviso) capaAviso.addTo(mapa);
        } else {
            mapa.removeLayer(grupoBandas);
            if (capaAviso) mapa.removeLayer(capaAviso);
        }
    }
};

window.bandasPropagacion = api;

})();

;

/* ==================== pwa-offline.js ==================== */
/**
 * MANOLIT∞ FORESTAL — Soporte PWA / offline (pwa-offline.js)
 * ----------------------------------------------------------
 * Piezas:
 *   1. Registro del Service Worker (solo con https + soporte nativo).
 *   2. Badge flotante online/offline accesible (eventos + navigator.onLine).
 *   3. Botón "Preparar zona para campo": envía PRECARGA_ZONA al SW con el
 *      bbox visible del mapa y zoom actual ±1, muestra progreso (aria-live)
 *      y guarda la última respuesta FIRMS en IndexedDB.
 *   4. Arranque offline: si no hay red, expone los últimos FIRMS cacheados.
 *   5. BATERÍA: al ocultarse la pestaña emite el evento 'manolito:pausa' y
 *      al volver 'manolito:reanudar' (window). Otros módulos (modo-emergencias,
 *      animaciones del motor) deberían pausar sus timers con esos eventos.
 *      Este módulo solo pausa/reanuda lo que él mismo controla.
 *
 * Patrones del proyecto: IIFE + 'use strict', un solo hook window.*,
 * retry loop para DOM, ARIA, botones ≥48px, mobile-first, vanilla JS.
 *
 * Expone: window.manolitoOffline = {
 *   prepararZona(), hayDatosOffline(), obtenerFirmsCache(), estado()
 * }
 *
 * Licencia: AGPL-3.0 (igual que el resto del proyecto).
 */
(function () {
    'use strict';

    /* ================= CONFIGURACIÓN ================= */

    var DB_NOMBRE = 'manolito-offline';
    var DB_STORE = 'datos';
    var CLAVE_FIRMS = 'ultimosFirms';
    var RETRY_MAX = 20;       // 20 × 250 ms = 5 s esperando al DOM/mapa
    var RETRY_MS = 250;

    /* ================= ESTADO INTERNO ================= */

    var swRegistro = null;
    var badge = null;
    var badgeDescartado = false; // true si el usuario cerró el badge (hasta el próximo cambio de red)
    var boton = null;
    var miniFab = null;
    var zonaProgreso = null;
    var zonaTexto = null;
    var barraProgreso = null;
    var enLinea = navigator.onLine;
    var preparando = false;

    /* ================= I18N (con fallback si idiomas.js no está) ================= */

    function tt(clave) {
        if (typeof window.t === 'function') return window.t(clave);
        // Fallbacks en castellano por si el módulo se carga antes de idiomas.js
        var fb = {
            'pwa.online': 'En línea',
            'pwa.offline': 'Sin conexión — modo campo',
            'pwa.prepararZona': 'Preparar zona para campo',
            'pwa.preparando': 'Descargando mapa de la zona… {hechas}/{total}',
            'pwa.zonaLista': 'Zona lista para uso offline ({tiles} tiles)',
            'pwa.zonaError': 'No se pudo preparar la zona. Reintenta con conexión.',
            'pwa.sinMapa': 'Mapa no disponible todavía',
            'pwa.cerrarAviso': 'Cerrar aviso de conexión',
            'pwa.expandir': 'Mostrar el botón de preparar zona'
        };
        return fb[clave] || clave;
    }

    /* ================= INDEXEDDB (helper mínimo, sin librerías) ================= */

    function abrirDB() {
        return new Promise(function (resolve, reject) {
            var req = indexedDB.open(DB_NOMBRE, 1);
            req.onupgradeneeded = function () {
                req.result.createObjectStore(DB_STORE);
            };
            req.onsuccess = function () { resolve(req.result); };
            req.onerror = function () { reject(req.error); };
        });
    }

    function idbPoner(clave, valor) {
        return abrirDB().then(function (db) {
            return new Promise(function (resolve, reject) {
                var tx = db.transaction(DB_STORE, 'readwrite');
                tx.objectStore(DB_STORE).put(valor, clave);
                tx.oncomplete = function () { db.close(); resolve(); };
                tx.onerror = function () { db.close(); reject(tx.error); };
            });
        });
    }

    function idbObtener(clave) {
        return abrirDB().then(function (db) {
            return new Promise(function (resolve, reject) {
                var req = db.transaction(DB_STORE, 'readonly').objectStore(DB_STORE).get(clave);
                req.onsuccess = function () { db.close(); resolve(req.result); };
                req.onerror = function () { db.close(); reject(req.error); };
            });
        });
    }

    /* ================= SERVICE WORKER ================= */

    function registrarSW() {
        var esSeguro = location.protocol === 'https:' ||
            location.hostname === 'localhost' || location.hostname === '127.0.0.1';
        if (!('serviceWorker' in navigator) || !esSeguro) {
            console.info('[PWA] Service Worker no disponible (¿falta https?).');
            return;
        }
        navigator.serviceWorker.register('sw.js').then(function (reg) {
            swRegistro = reg;
        }).catch(function (e) {
            console.warn('[PWA] Fallo al registrar el SW:', e);
        });
    }

    /* ================= BADGE ONLINE / OFFLINE ================= */

    function crearBadge() {
        badge = document.createElement('div');
        badge.id = 'pwa-badge-conexion';
        badge.setAttribute('role', 'status');
        badge.setAttribute('aria-live', 'polite');
        badge.style.cssText =
            'position:fixed;top:calc(env(safe-area-inset-top,0px) + 10px);left:50%;' +
            'transform:translateX(-50%);z-index:1800;padding:8px 16px;border-radius:999px;' +
            'font:600 13px/1.4 system-ui,sans-serif;color:#070a10;' +
            'box-shadow:0 2px 8px rgba(0,0,0,.5);pointer-events:none;' +
            'transition:background .3s,opacity .3s;';
        document.body.appendChild(badge);
        actualizarBadge();
    }

    function actualizarBadge() {
        if (!badge) return;
        // Si el usuario lo cerró, no se vuelve a mostrar hasta que cambie la red.
        if (badgeDescartado) {
            badge.style.display = 'none';
            return;
        }
        badge.style.display = '';
        // Sin emojis: el color de fondo ya comunica el estado (cian = en
        // línea, naranja = sin conexión) y un punto CSS refuerza el texto.
        const punto = '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:currentColor;margin-right:7px;vertical-align:1px"></span>';
        if (enLinea) {
            badge.innerHTML = punto;
            badge.appendChild(document.createTextNode(tt('pwa.online')));
            badge.style.background = '#00f3ff';
            // En línea: visible un momento y luego se atenúa para no estorbar.
            badge.style.opacity = '0.35';
        } else {
            badge.innerHTML = punto;
            badge.appendChild(document.createTextNode(tt('pwa.offline')));
            badge.style.background = '#ff9f43';
            badge.style.opacity = '1';
        }
        // Botón ✕ para cerrar el aviso (el badge tiene pointer-events:none,
        // así que el ✕ los reactiva solo para sí mismo).
        var btnX = document.createElement('button');
        btnX.type = 'button';
        btnX.textContent = '✕';
        btnX.setAttribute('aria-label', tt('pwa.cerrarAviso'));
        btnX.style.cssText =
            'pointer-events:auto;margin-left:10px;width:32px;height:32px;border:0;' +
            'border-radius:50%;background:rgba(7,10,16,.18);color:inherit;' +
            'font:700 14px/1 system-ui,sans-serif;cursor:pointer;vertical-align:middle;';
        btnX.addEventListener('click', function () {
            badgeDescartado = true;
            actualizarBadge();
        });
        badge.appendChild(btnX);
    }

    function alCambiarConexion() {
        enLinea = navigator.onLine;
        // Un cambio real de red vuelve a mostrar el badge aunque se hubiera cerrado.
        badgeDescartado = false;
        actualizarBadge();
    }

    /* ================= BOTÓN "PREPARAR ZONA PARA CAMPO" ================= */

    function resolverMapa() {
        // Mismo orden de resolución que capa-recursos.js.
        if (window.manolitoMapa) return window.manolitoMapa;
        if (window.map) return window.map;
        try { if (typeof map !== 'undefined') return map; } catch (e) { /* binding léxico */ }
        return null;
    }

    var LS_BOTON_OCULTO = 'manolitoPwaBotonOculto';

    function botonOcultoGuardado() {
        try { return localStorage.getItem(LS_BOTON_OCULTO) === '1'; } catch (e) { return false; }
    }

    // Colapsa el botón grande a un mini-FAB redondo (y viceversa), con persistencia.
    function ponerBotonColapsado(colapsado) {
        if (!boton || !miniFab) return;
        boton.style.display = colapsado ? 'none' : '';
        miniFab.style.display = colapsado ? '' : 'none';
        try { localStorage.setItem(LS_BOTON_OCULTO, colapsado ? '1' : '0'); } catch (e) { /* sin storage */ }
    }

    function crearBoton() {
        boton = document.createElement('button');
        boton.id = 'pwa-btn-preparar-zona';
        boton.type = 'button';
        // ≥48px de alto, bottom-left para no colisionar con el chat (bottom-right)
        // ni con el dashboard (panel lateral superior).
        boton.style.cssText =
            'position:fixed;left:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 12px);' +
            'z-index:1800;min-height:48px;min-width:48px;padding:12px 40px 12px 18px;border:0;' +
            'border-radius:12px;background:#00f3ff;color:#070a10;cursor:pointer;' +
            'font:700 14px/1.2 system-ui,sans-serif;box-shadow:0 2px 10px rgba(0,0,0,.6);';
        boton.setAttribute('aria-label', tt('pwa.prepararZona'));
        boton.textContent = tt('pwa.prepararZona');
        boton.addEventListener('click', prepararZona);

        // ✕ en la esquina del botón: lo colapsa a un mini-FAB para dejar el mapa limpio.
        var btnColapsar = document.createElement('span');
        btnColapsar.textContent = '✕';
        btnColapsar.setAttribute('role', 'button');
        btnColapsar.setAttribute('aria-label', tt('pwa.cerrarAviso'));
        btnColapsar.style.cssText =
            'position:absolute;top:2px;right:6px;width:28px;height:28px;display:flex;' +
            'align-items:center;justify-content:center;font:700 13px/1 system-ui,sans-serif;' +
            'color:rgba(7,10,16,.65);cursor:pointer;';
        btnColapsar.addEventListener('click', function (ev) {
            ev.stopPropagation();
            ponerBotonColapsado(true);
        });
        boton.appendChild(btnColapsar);

        // Mini-FAB: mismo sitio, redondo, semitransparente; un toque restaura el botón.
        miniFab = document.createElement('button');
        miniFab.id = 'pwa-btn-preparar-mini';
        miniFab.type = 'button';
        miniFab.style.cssText =
            'position:fixed;left:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 12px);' +
            'z-index:1800;width:48px;height:48px;border:0;border-radius:50%;display:none;' +
            'align-items:center;justify-content:center;background:rgba(0,243,255,.35);' +
            'color:#070a10;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.5);';
        miniFab.setAttribute('aria-label', tt('pwa.expandir'));
        miniFab.innerHTML =
            '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
            'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M12 3v12"/><path d="M6 11l6 6 6-6"/><path d="M5 21h14"/></svg>';
        miniFab.addEventListener('click', function () { ponerBotonColapsado(false); });

        zonaProgreso = document.createElement('div');
        zonaProgreso.id = 'pwa-progreso-zona';
        zonaProgreso.setAttribute('role', 'status');
        zonaProgreso.setAttribute('aria-live', 'polite');
        zonaProgreso.style.cssText =
            'position:fixed;left:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 72px);' +
            'z-index:1800;width:min(320px,80vw);padding:10px 12px;border-radius:10px;' +
            'background:rgba(7,10,16,.92);color:#00f3ff;font:600 12px/1.4 system-ui,sans-serif;' +
            'display:none;border:1px solid rgba(0,243,255,.25);';
        // Barra de progreso real debajo del texto
        var barraWrap = document.createElement('div');
        barraWrap.style.cssText = 'height:6px;border-radius:3px;background:rgba(255,255,255,.12);margin-top:8px;overflow:hidden;';
        barraProgreso = document.createElement('div');
        barraProgreso.style.cssText = 'height:100%;width:0%;background:#00f3ff;transition:width .25s ease;';
        barraWrap.appendChild(barraProgreso);
        zonaProgreso.appendChild(barraWrap);
        zonaTexto = document.createElement('div');
        zonaProgreso.insertBefore(zonaTexto, barraWrap);
        document.body.appendChild(boton);
        document.body.appendChild(miniFab);
        document.body.appendChild(zonaProgreso);
        // Respeta la preferencia guardada de la última visita.
        if (botonOcultoGuardado()) ponerBotonColapsado(true);
    }

    function mostrarProgreso(texto, pct) {
        if (!zonaProgreso) return;
        zonaTexto.textContent = texto;
        zonaProgreso.style.display = texto ? 'block' : 'none';
        if (barraProgreso) {
            var v = (typeof pct === 'number' && isFinite(pct)) ? Math.max(0, Math.min(100, pct)) : 0;
            barraProgreso.style.width = v + '%';
        }
    }

    function escucharMensajesSW() {
        if (!('serviceWorker' in navigator)) return;
        navigator.serviceWorker.addEventListener('message', function (event) {
            var d = event.data || {};
            if (d.type === 'PRECARGA_PROGRESO') {
                var pct = (d.total > 0) ? (d.hechas / d.total) * 100 : 0;
                mostrarProgreso(tt('pwa.preparando').replace('{hechas}', d.hechas).replace('{total}', d.total), pct);
            } else if (d.type === 'PRECARGA_COMPLETA') {
                preparando = false;
                if (boton) boton.disabled = false;
                if (d.error) {
                    mostrarProgreso(tt('pwa.zonaError'), 0);
                } else {
                    mostrarProgreso(tt('pwa.zonaLista').replace('{tiles}', d.tiles), 100);
                    // Guardar también los últimos FIRMS para consulta offline.
                    guardarFirmsCache().catch(function () {});
                }
                setTimeout(function () { mostrarProgreso(''); }, 8000);
            }
        });
    }

    // Descarga (vía SW, network-first) y guarda en IndexedDB los FIRMS del bbox visible.
    function guardarFirmsCache() {
        var m = resolverMapa();
        if (!m || !enLinea) return Promise.resolve();
        var b = m.getBounds();
        var param = b.getWest() + ',' + b.getSouth() + ',' + b.getEast() + ',' + b.getNorth();
        return fetch('/getFires?bounds=' + param).then(function (resp) {
            if (!resp.ok) throw new Error('FIRMS ' + resp.status);
            return resp.text();
        }).then(function (csv) {
            return idbPoner(CLAVE_FIRMS, {
                csv: csv,
                bbox: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()],
                guardado: Date.now()
            });
        }).catch(function (e) {
            console.warn('[PWA] No se pudieron cachear los FIRMS:', e);
        });
    }

    function prepararZona() {
        if (preparando) return Promise.resolve(false);
        var m = resolverMapa();
        if (!m) {
            mostrarProgreso(tt('pwa.sinMapa'));
            return Promise.resolve(false);
        }
        if (!swRegistro || !swRegistro.active) {
            mostrarProgreso(tt('pwa.zonaError'));
            return Promise.resolve(false);
        }
        preparando = true;
        if (boton) boton.disabled = true;

        var b = m.getBounds();
        var z = m.getZoom();
        swRegistro.active.postMessage({
            type: 'PRECARGA_ZONA',
            bbox: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()],
            zoomMin: Math.max(0, z - 1),
            zoomMax: Math.min(20, z + 1)
        });
        mostrarProgreso(tt('pwa.preparando').replace('{hechas}', 0).replace('{total}', '…'));
        return Promise.resolve(true);
    }

    /* ================= API PÚBLICA ================= */

    function hayDatosOffline() {
        return idbObtener(CLAVE_FIRMS).then(function (v) { return !!v; }).catch(function () { return false; });
    }

    function obtenerFirmsCache() {
        return idbObtener(CLAVE_FIRMS).catch(function () { return null; });
    }

    function estado() {
        return {
            enLinea: enLinea,
            swActivo: !!(swRegistro && swRegistro.active),
            preparando: preparando
        };
    }

    window.manolitoOffline = {
        prepararZona: prepararZona,
        hayDatosOffline: hayDatosOffline,
        obtenerFirmsCache: obtenerFirmsCache,
        estado: estado
    };

    /* ================= BATERÍA: eventos de pausa/reanudación =================
     * Documentación para otros módulos:
     *   window.addEventListener('manolito:pausa',   ...) → detener timers,
     *     sondeos (setInterval de modo-emergencias), animaciones, etc.
     *   window.addEventListener('manolito:reanudar', ...) → reanudarlos.
     * Este módulo solo emite los eventos; cada módulo pausa LO SUYO.        */

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            window.dispatchEvent(new CustomEvent('manolito:pausa'));
        } else {
            enLinea = navigator.onLine;
            actualizarBadge();
            window.dispatchEvent(new CustomEvent('manolito:reanudar'));
        }
    });

    /* ================= ARRANQUE ================= */

    function arrancarOffline() {
        if (enLinea) return;
        // Sin red al arrancar: comprobar si hay FIRMS guardados y avisar.
        hayDatosOffline().then(function (hay) {
            if (hay) console.info('[PWA] Sin red: hay datos FIRMS offline disponibles vía manolitoOffline.obtenerFirmsCache()');
        });
    }

    window.addEventListener('online', alCambiarConexion);
    window.addEventListener('offline', alCambiarConexion);
    escucharMensajesSW();
    registrarSW();

    // Retry loop: espera a que exista document.body (el script usa defer,
    // pero somos defensivos por si se carga de otra forma).
    var intentos = 0;
    var retry = setInterval(function () {
        intentos++;
        if (document.body) {
            clearInterval(retry);
            crearBadge();
            crearBoton();
            arrancarOffline();
        } else if (intentos >= RETRY_MAX) {
            clearInterval(retry);
            console.warn('[PWA] DOM no disponible; badge y botón no creados.');
        }
    }, RETRY_MS);
})();

;

/* ==================== evacuacion.js ==================== */
/**
 * MANOLIT∞ FORESTAL — evacuacion.js
 * ==================================
 * Sistema de evacuación en tiempo real con navegación híbrida
 * (GPS + brújula + capa offline). Módulo AUTÓNOMO: no toca el chat
 * ni el motor científico; solo lee window.perimetrosActivosGeom
 * (perímetros activos ya dibujados) y window.ultimoContextoManolito
 * (viento del punto seleccionado, si existe).
 *
 * PRINCIPIOS:
 *  - PRIVACIDAD ESTRICTA: la posición GPS jamás sale del dispositivo.
 *    Todos los cálculos (distancias, vectores de escape) se hacen aquí,
 *    en el navegador del usuario. No se envía nada a ningún servidor.
 *  - OFFLINE REAL: los perímetros de incendio conocidos se guardan en
 *    IndexedDB como base matemática inmutable. Si se corta internet, la
 *    navegación sigue funcionando con el último dato guardado.
 *  - MODO VECTORIAL: en monte no hay calles que seguir. Se calcula un
 *    VECTOR (rumbo de escape) desde la posición del usuario hacia zona
 *    limpia: perpendicular al avance del fuego o hacia barlovento /
 *    terreno ya quemado, según la doctrina de comportamiento del fuego.
 *  - FAILSAFE: si el GPS pierde precisión (humo, dosel forestal), se
 *    entra en MODO BRÚJULA PURO manteniendo el último rumbo de escape
 *    conocido apoyándose solo en el norte magnético. Nunca se deja al
 *    usuario sin una flecha en pantalla.
 *  - UI DE ESTRÉS: una flecha grande, flotante y PARPADEANTE superpuesta
 *    al mapa (estilo brújula militar), legible con sol, con guantes y
 *    corriendo. Botones >= 48px, role="alert", vibra en alerta roja.
 *
 * Expone: window.manolitoEvacuacion = { iniciar, detener, vigilar,
 *   detenerVigilancia, estado }
 * SIN WIDGET FLOTANTE: este módulo no pinta ningún botón permanente en
 * el mapa. La activación se hace desde el modo de emergencias
 * (modo-emergencias.js): botón "Huir del incendio" y vigilancia de
 * proximidad. Aquí solo viven la flecha, el panel y los avisos.
 * Respeta 'manolito:pausa' / 'manolito:reanudar' (batería): la
 * monitorización se duerme con la pestaña oculta; una evacuación ACTIVA
 * mantiene el GPS porque la vida manda sobre la batería.
 */
(function () {
    'use strict';

    // ================= i18n =================
    // Fallback en español por si idiomas.js aún no cargó la clave.
    const T_FALLBACK = {
        'evac.boton': 'Evacuación',
        'evac.botonAria': 'Activar el sistema de evacuación por GPS. Tu posición no sale de tu dispositivo.',
        'evac.alertaRoja': 'PELIGRO DE INCENDIO CERCANO ({dist}). Inicie la evacuación de inmediato.',
        'evac.alertaAmarilla': 'Zona de riesgo de incendio a {dist}. Manténgase alerta y prepárese para evacuar.',
        'evac.iniciar': 'Iniciar evacuación',
        'evac.detener': 'Detener evacuación',
        'evac.haciaZonaSegura': 'Zona segura a {dist}',
        'evac.rumbo': 'Rumbo de escape: {card} ({grados}°)',
        'evac.modoBrujula': 'Modo brújula: GPS débil. Siga el último rumbo conocido.',
        'evac.buscandoGps': 'Localizando GPS…',
        'evac.sinGps': 'GPS no disponible. Active la ubicación del dispositivo.',
        'evac.recalculando': 'Recalculando vector de escape…',
        'evac.offline': 'Sin conexión: navegando con los últimos datos guardados ({hora})',
        'evac.permisoBrujula': 'Toca para activar la brújula',
        'evac.popupEscapar': 'Escapar de este foco',
        'evac.fueraDeZona': 'Fuera de la zona de peligro inmediato. Siga alejándose.',
        'evac.privacidad': 'GPS procesado solo en tu dispositivo. Nada sale del móvil.',
        'evac.datosGuardados': 'Datos de incendio guardados: {hora}',
        'evac.sinDatos': 'Sin datos de incendios. Muévase en dirección contraria al humo y llame al 112.',
        'evac.cerrar': 'Cerrar navegación de evacuación',
        'evac.sigueHacia': 'Sigue hacia el {card}',
        'evac.calibraBrujula': 'Brújula errática: calibra moviendo el móvil en forma de 8',
        'evac.gpsEdad': 'hace {s} s',
        'evac.errorPermiso': 'Permiso de ubicación denegado. Actívalo en los ajustes del navegador.',
        'evac.errorSinSenal': 'Sin señal de ubicación. Sal a cielo abierto o activa la ubicación del sistema.',
        'evac.errorTimeout': 'El GPS tarda demasiado en responder. Inténtalo de nuevo a cielo abierto.',
        'evac.vigilar': 'Avisarme si hay fuego cerca (usa GPS)',
        'evac.vigilando': 'Vigilancia de proximidad activa — toca para parar',
        'evac.avisoLineaRecta': 'La flecha marca la dirección más corta, no una ruta segura garantizada: no esquiva el fuego ni el terreno. Prioriza siempre las indicaciones de Protección Civil y bomberos.'
    };

    function tt(clave, interp) {
        let s = (typeof window.t === 'function') ? window.t(clave) : clave;
        if (!s || s === clave) s = T_FALLBACK[clave] || clave;
        if (interp) for (const k in interp) s = s.replace('{' + k + '}', interp[k]);
        return s;
    }

    function gradosACardinalLocal(deg) {
        const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
        return dirs[Math.round(deg / 22.5) % 16];
    }

    // ================= Matemática geográfica (todo en local) =================
    const R_TIERRA = 6371000;
    const rad = d => d * Math.PI / 180;
    const deg = r => r * 180 / Math.PI;

    function distanciaM(lat1, lon1, lat2, lon2) {
        const dLat = rad(lat2 - lat1), dLon = rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
        return 2 * R_TIERRA * Math.asin(Math.sqrt(a));
    }

    function rumboEntre(lat1, lon1, lat2, lon2) {
        const dLon = rad(lon2 - lon1);
        const y = Math.sin(dLon) * Math.cos(rad(lat2));
        const x = Math.cos(rad(lat1)) * Math.sin(rad(lat2)) -
            Math.sin(rad(lat1)) * Math.cos(rad(lat2)) * Math.cos(dLon);
        return (deg(Math.atan2(y, x)) + 360) % 360;
    }

    function puntoDestino(lat, lon, az, distM) {
        const d = distM / R_TIERRA, a = rad(az);
        const lat2 = Math.asin(Math.sin(rad(lat)) * Math.cos(d) +
            Math.cos(rad(lat)) * Math.sin(d) * Math.cos(a));
        const lon2 = rad(lon) + Math.atan2(
            Math.sin(a) * Math.sin(d) * Math.cos(rad(lat)),
            Math.cos(d) - Math.sin(rad(lat)) * Math.sin(lat2));
        return [deg(lat2), ((deg(lon2) + 540) % 360) - 180];
    }

    function puntoEnPoligono(lat, lon, coords) {
        let dentro = false;
        for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
            const [ilat, ilon] = coords[i], [jlat, jlon] = coords[j];
            if (((ilon > lon) !== (jlon > lon)) &&
                (lat < (jlat - ilat) * (lon - ilon) / (jlon - ilon) + ilat)) {
                dentro = !dentro;
            }
        }
        return dentro;
    }

    // Distancia (m) a una zona de peligro (círculo o polígono) y punto más
    // cercano de su borde, que se usa como referencia para el vector radial.
    function distanciaAZona(lat, lon, zona) {
        if (zona.tipo === 'poligono') {
            const dentro = puntoEnPoligono(lat, lon, zona.coords);
            let mejor = Infinity, punto = null;
            for (const [la, lo] of zona.coords) {
                const d = distanciaM(lat, lon, la, lo);
                if (d < mejor) { mejor = d; punto = [la, lo]; }
            }
            return { distM: dentro ? 0 : mejor, dentro, puntoCercano: punto };
        }
        const d = distanciaM(lat, lon, zona.centro[0], zona.centro[1]);
        return {
            distM: Math.max(0, d - zona.radioM),
            dentro: d <= zona.radioM,
            puntoCercano: zona.centro
        };
    }

    // ================= Persistencia local (IndexedDB) =================
    // Base matemática inmutable: últimos perímetros conocidos. Si internet
    // se corta, la app sigue navegando con este dato.
    const IDB_NAME = 'manolito-evacuacion';
    const IDB_STORE = 'zonas';

    function idbAbrir() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(IDB_NAME, 1);
            req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async function idbGuardarZonas(zonas) {
        try {
            const db = await idbAbrir();
            await new Promise((resolve, reject) => {
                const tx = db.transaction(IDB_STORE, 'readwrite');
                tx.objectStore(IDB_STORE).put({ id: 'perimetros', zonas, ts: Date.now() }, 'perimetros');
                tx.oncomplete = resolve;
                tx.onerror = () => reject(tx.error);
            });
            estado.tsDatosGuardados = Date.now();
            db.close();
        } catch (e) {
            console.warn('[Evacuación] No se pudieron guardar los perímetros:', e.message);
        }
    }

    async function idbLeerZonas() {
        try {
            const db = await idbAbrir();
            const dato = await new Promise((resolve, reject) => {
                const req = db.transaction(IDB_STORE, 'readonly').objectStore(IDB_STORE).get('perimetros');
                req.onsuccess = () => resolve(req.result || null);
                req.onerror = () => reject(req.error);
            });
            db.close();
            if (dato && Array.isArray(dato.zonas) && dato.zonas.length) {
                estado.zonasGuardadas = dato.zonas;
                estado.tsDatosGuardados = dato.ts;
            }
        } catch (e) {
            console.warn('[Evacuación] No se pudieron leer los perímetros guardados:', e.message);
        }
    }

    // ================= Estado del módulo =================
    const estado = {
        monitorizando: false,     // GPS en bajo consumo vigilando proximidad
        evacuando: false,         // navegación activa con flecha
        zonasGuardadas: null,     // último snapshot de IndexedDB
        tsDatosGuardados: null,
        azEscape: null,           // último rumbo de escape calculado (failsafe)
        meta: null,               // [lat, lon] de la zona segura actual
        heading: null,            // orientación del dispositivo (brújula)
        gpsCourse: null,          // rumbo GPS (fallback si no hay brújula)
        ultimaPos: null,          // {lat, lon, precision, ts}
        modoBrujulaPuro: false,   // failsafe: GPS degradado
        nivelAlerta: null,        // null | 'amarilla' | 'roja'
        pausado: false,           // pestaña oculta (evento manolito:pausa)
        anguloSuavizado: null,    // ángulo de pantalla tras el filtro anti-temblor
        brujulaErratica: false,   // saltos bruscos repetidos de heading → pedir calibración
        avisoFueraEmitido: false  // banner "fuera de peligro" mostrado una vez por evacuación
    };

    // Umbrales de proximidad al borde de un perímetro activo
    const UMBRAL_ROJO_M = 300;      // dentro o a menos de 300 m: evacuar ya
    const UMBRAL_AMARILLO_M = 1200; // a menos de 1,2 km: aviso de preparación
    const GPS_MALO_M = 75;          // precisión peor que esto = GPS degradado
    const GPS_STALE_MS = 12000;     // sin fix en 12 s durante evacuación = degradado
    // Ajustes de la guía de la flecha (skill forestal-escape-arrow):
    const MAGNETIC_DECLINATION_DEG = -0.7; // declinación magnética Andalucía 2026
    const REDIBUJO_MS = 500;          // la flecha se redibuja cada 500 ms con el último heading (barato)
    const GPS_SONDEO_MS = 2000;       // el GPS se sondea cada ~2 s (caro); la UI interpola entre medias
    const REPETIR_INSTRUCCION_MS = 10000; // cadencia de protocolo: repetir el rumbo cada 10 s bajo estrés
    const FUERA_PELIGRO_M = 2000;     // distancia al perímetro para dar la zona por superada

    // Zonas de peligro: las vivas del mapa; si no hay (offline), las guardadas.
    function zonasActuales() {
        const vivas = window.perimetrosActivosGeom;
        if (Array.isArray(vivas) && vivas.length) return { zonas: vivas, origen: 'vivo' };
        if (estado.zonasGuardadas && estado.zonasGuardadas.length) return { zonas: estado.zonasGuardadas, origen: 'cache' };
        return { zonas: [], origen: 'vacio' };
    }

    // Guarda en IndexedDB cada vez que cambian los perímetros del mapa.
    let ultimoSnapshotZonas = '';
    function persistirSiCambia() {
        const vivas = window.perimetrosActivosGeom;
        if (!Array.isArray(vivas) || !vivas.length) return;
        const snap = JSON.stringify(vivas);
        if (snap !== ultimoSnapshotZonas) {
            ultimoSnapshotZonas = snap;
            idbGuardarZonas(vivas);
        }
    }

    // ================= Lógica del vector de escape =================
    // Doctrina: el fuego avanza a sotavento. El escape correcto es
    // PERPENDICULAR al avance (hacia los flancos) o hacia lo ya quemado a
    // BARLOVENTO. Nunca sotavento ni cuesta arriba por vaguadas alineadas.
    // Se puntúan los rumbos candidatos simulando un paso de 1 km y eligiendo
    // el que más aumenta la distancia al perímetro.
    function calcularVectorEscape(lat, lon) {
        const { zonas } = zonasActuales();
        if (!zonas.length) return null;

        let peorZona = null;
        for (const z of zonas) {
            const d = distanciaAZona(lat, lon, z);
            if (!peorZona || d.distM < peorZona.distM || (d.dentro && !peorZona.dentro)) {
                peorZona = { ...d, zona: z };
            }
        }
        if (!peorZona) return null;

        // Rumbo radial: del punto del fuego más cercano hacia el usuario
        // (seguir hacia afuera, alejándose del frente).
        const ref = peorZona.puntoCercano;
        const azRadial = ref ? rumboEntre(ref[0], ref[1], lat, lon) : 0;

        const candidatos = [azRadial];
        const ctx = window.ultimoContextoManolito;
        if (ctx && typeof ctx.windDir === 'number') {
            const azAvance = (ctx.windDir + 180) % 360; // el fuego corre a sotavento
            candidatos.push((azAvance + 90) % 360);     // flanco A (perpendicular)
            candidatos.push((azAvance - 90 + 360) % 360); // flanco B (perpendicular)
            candidatos.push(ctx.windDir);               // barlovento: hacia lo quemado
        }

        let mejorAz = azRadial, mejorDist = -1;
        for (const az of candidatos) {
            const [pla, plo] = puntoDestino(lat, lon, az, 1000);
            let dMin = Infinity;
            for (const z of zonas) dMin = Math.min(dMin, distanciaAZona(pla, plo, z).distM);
            if (dMin > mejorDist) { mejorDist = dMin; mejorAz = az; }
        }

        // Meta: punto limpio a distancia suficiente (mínimo 2 km, o lo que
        // falte para salir de la zona + 1,5 km de margen de seguridad).
        const distMeta = Math.max(2000, peorZona.distM + 1500);
        const meta = puntoDestino(lat, lon, mejorAz, distMeta);
        return {
            azEscape: mejorAz,
            meta,
            distZonaM: peorZona.distM,
            dentro: peorZona.dentro
        };
    }

    // ================= Brújula (fusión de sensores) =================
    // Android: 'deviceorientationabsolute' con alpha absoluto.
    // iOS: 'deviceorientation' con webkitCompassHeading (requiere permiso
    // explícito desde un gesto del usuario en iOS 13+).
    function alOrientacion(e) {
        let h = null;
        if (typeof e.webkitCompassHeading === 'number' && !isNaN(e.webkitCompassHeading)) {
            h = e.webkitCompassHeading;
        } else if (typeof e.alpha === 'number' && (e.absolute || e.alpha !== null)) {
            h = 360 - e.alpha;
        }
        if (h === null || isNaN(h)) return;
        // Corrección por orientación de la pantalla: si el usuario gira el
        // móvil a apaisado mientras corre, la flecha sigue apuntando bien.
        const giro = (screen.orientation && typeof screen.orientation.angle === 'number')
            ? screen.orientation.angle
            : (typeof window.orientation === 'number' ? window.orientation : 0);
        h = (h + giro + 360) % 360;

        // Detección de brújula errática (metal, líneas eléctricas, vehículos):
        // saltos de más de 60° en menos de 300 ms, tres veces seguidas.
        const ahora = Date.now();
        if (ultimoHeading !== null && ahora - ultimoHeadingTs < 300) {
            let salto = Math.abs(h - ultimoHeading);
            if (salto > 180) salto = 360 - salto;
            if (salto > 60) {
                saltosBrujula++;
                if (saltosBrujula >= 3 && !estado.brujulaErratica) {
                    estado.brujulaErratica = true;
                    pintarEstadoNav();
                }
            } else if (saltosBrujula > 0) {
                saltosBrujula--;
                if (saltosBrujula === 0 && estado.brujulaErratica) {
                    estado.brujulaErratica = false;
                    pintarEstadoNav();
                }
            }
        }
        ultimoHeading = h;
        ultimoHeadingTs = ahora;
        estado.heading = h;
    }
    let ultimoHeading = null, ultimoHeadingTs = 0, saltosBrujula = 0;

    async function activarBrujula() {
        if (typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permiso = await DeviceOrientationEvent.requestPermission();
                if (permiso !== 'granted') return false;
            } catch (e) {
                return false;
            }
        }
        window.addEventListener('deviceorientationabsolute', alOrientacion, true);
        window.addEventListener('deviceorientation', alOrientacion, true);
        return true;
    }

    function desactivarBrujula() {
        window.removeEventListener('deviceorientationabsolute', alOrientacion, true);
        window.removeEventListener('deviceorientation', alOrientacion, true);
        estado.heading = null;
    }

    // ================= GPS =================
    let watchMonitoreo = null;
    let watchEvacuacion = null;

    function alErrorGps(err) {
        console.warn('[Evacuación] GPS:', err.message);
        // Diagnóstico claro según el motivo del fallo (permiso, señal, timeout)
        let clave = 'evac.sinGps';
        if (err && err.code === 1) clave = 'evac.errorPermiso';
        else if (err && err.code === 2) clave = 'evac.errorSinSenal';
        else if (err && err.code === 3) clave = 'evac.errorTimeout';
        if (estado.evacuando) {
            // Failsafe: si el GPS falla en plena evacuación, no soltamos al
            // usuario — pasamos a brújula pura con el último rumbo conocido.
            estado.modoBrujulaPuro = true;
            pintarEstadoNav();
        } else {
            pintarBanner(tt(clave), 'amarilla');
        }
    }

    function alPosicionMonitoreo(pos) {
        estado.ultimaPos = { lat: pos.coords.latitude, lon: pos.coords.longitude, precision: pos.coords.accuracy, ts: Date.now() };
        comprobarProximidad(pos.coords.latitude, pos.coords.longitude);
    }

    function alPosicionEvacuacion(pos) {
        const c = pos.coords;
        estado.ultimaPos = { lat: c.latitude, lon: c.longitude, precision: c.accuracy, ts: Date.now() };
        if (typeof c.heading === 'number' && !isNaN(c.heading) && c.speed > 0.5) {
            estado.gpsCourse = c.heading; // rumbo por desplazamiento (fallback sin brújula)
        }

        // Degradación del sensor: humo denso o dosel forestal.
        estado.modoBrujulaPuro = (c.accuracy > GPS_MALO_M);

        const anterior = estado.azEscape;
        const vec = calcularVectorEscape(c.latitude, c.longitude);
        if (vec) {
            estado.azEscape = vec.azEscape;
            estado.meta = vec.meta;
            dibujarVectorEnMapa(c.latitude, c.longitude, vec.meta);
            // Recálculo dinámico: si el usuario se desvía, el rumbo cambia.
            if (anterior !== null) {
                let diff = Math.abs(vec.azEscape - anterior);
                if (diff > 180) diff = 360 - diff;
                if (diff > 25) flashRecalculando();
            }
            pintarDistancia(vec);
            // Zona superada: fuera del perímetro y a más de FUERA_PELIGRO_M.
            // Se avisa una vez por evacuación; la navegación sigue activa.
            if (!vec.dentro && vec.distZonaM > FUERA_PELIGRO_M && !estado.avisoFueraEmitido) {
                estado.avisoFueraEmitido = true;
                pintarBanner(tt('evac.fueraDeZona'), 'amarilla');
            }
        } else {
            pintarBanner(tt('evac.sinDatos'), 'roja');
        }
        pintarEstadoNav();
        comprobarProximidad(c.latitude, c.longitude);
    }

    function comprobarProximidad(lat, lon) {
        const { zonas } = zonasActuales();
        if (!zonas.length) return;
        let dMin = Infinity, dentro = false;
        for (const z of zonas) {
            const d = distanciaAZona(lat, lon, z);
            if (d.dentro) dentro = true;
            dMin = Math.min(dMin, d.distM);
        }
        const kmTxt = dMin < 1000 ? `${Math.round(dMin)} m` : `${(dMin / 1000).toFixed(1)} km`;

        if ((dentro || dMin < UMBRAL_ROJO_M) && estado.nivelAlerta !== 'roja') {
            estado.nivelAlerta = 'roja';
            pintarBanner(tt('evac.alertaRoja', { dist: dentro ? '0 m' : kmTxt }), 'roja', true);
            if (navigator.vibrate) navigator.vibrate([400, 150, 400, 150, 400]);
        } else if (!dentro && dMin >= UMBRAL_ROJO_M && dMin < UMBRAL_AMARILLO_M && estado.nivelAlerta !== 'roja' && estado.nivelAlerta !== 'amarilla') {
            estado.nivelAlerta = 'amarilla';
            pintarBanner(tt('evac.alertaAmarilla', { dist: kmTxt }), 'amarilla', true);
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        } else if (!dentro && dMin >= UMBRAL_AMARILLO_M && estado.nivelAlerta && !estado.evacuando) {
            estado.nivelAlerta = null;
            ocultarBanner();
        }
    }

    // ================= Arranque / parada =================
    function iniciarMonitoreo() {
        if (estado.monitorizando || !('geolocation' in navigator)) return;
        estado.monitorizando = true;
        watchMonitoreo = navigator.geolocation.watchPosition(alPosicionMonitoreo, alErrorGps, {
            enableHighAccuracy: false, maximumAge: 30000, timeout: 20000
        });
    }

    function detenerMonitoreo() {
        if (watchMonitoreo !== null) navigator.geolocation.clearWatch(watchMonitoreo);
        watchMonitoreo = null;
        estado.monitorizando = false;
        estado.nivelAlerta = null;
        ocultarBanner();
    }

    async function iniciarEvacuacion() {
        if (!('geolocation' in navigator)) {
            pintarBanner(tt('evac.sinGps'), 'roja');
            return;
        }
        await activarBrujula(); // gesto del usuario: aquí cabe el permiso de iOS
        detenerMonitoreo();
        estado.evacuando = true;
        estado.modoBrujulaPuro = false;
        estado.anguloSuavizado = null;
        estado.avisoFueraEmitido = false;
        mostrarNav();
        pintarBanner(tt('evac.buscandoGps'), 'amarilla');
        watchEvacuacion = navigator.geolocation.watchPosition(alPosicionEvacuacion, alErrorGps, {
            enableHighAccuracy: true, maximumAge: GPS_SONDEO_MS, timeout: 10000
        });
        timerFlecha = setInterval(bucleFlecha, REDIBUJO_MS);
        timerVoz = setInterval(repetirInstruccion, REPETIR_INSTRUCCION_MS);
    }

    function detenerEvacuacion() {
        if (watchEvacuacion !== null) navigator.geolocation.clearWatch(watchEvacuacion);
        watchEvacuacion = null;
        if (timerFlecha !== null) clearInterval(timerFlecha);
        if (timerVoz !== null) clearInterval(timerVoz);
        timerFlecha = timerVoz = null;
        try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) { }
        estado.evacuando = false;
        estado.modoBrujulaPuro = false;
        estado.anguloSuavizado = null;
        desactivarBrujula();
        ocultarNav();
        ocultarBanner();
        limpiarVectorEnMapa();
        // La vigilancia de proximidad NO se reactiva sola: la controla el
        // usuario desde el modo de emergencias (evita avisos no pedidos).
    }

    // ================= Mapa: vector de escape =================
    let capaVector = null;
    function dibujarVectorEnMapa(lat, lon, meta) {
        const mapa = window.manolitoMapa;
        if (!mapa || !window.L) return;
        if (!capaVector) {
            capaVector = L.layerGroup().addTo(mapa);
        }
        capaVector.clearLayers();
        // Línea discontinua de referencia sobre el mapa (la flecha flotante
        // es la guía principal; esta línea orienta al mirar el mapa).
        L.polyline([[lat, lon], meta], {
            color: '#00e5ff', weight: 4, dashArray: '10 8', opacity: 0.9
        }).addTo(capaVector);
        L.circleMarker(meta, {
            radius: 10, fillColor: '#00e676', color: '#fff', weight: 2, fillOpacity: 0.9
        }).addTo(capaVector).bindTooltip(tt('evac.haciaZonaSegura', { dist: '' }));
        L.circleMarker([lat, lon], {
            radius: 8, fillColor: '#2196f3', color: '#fff', weight: 2, fillOpacity: 1
        }).addTo(capaVector);
    }

    function limpiarVectorEnMapa() {
        if (capaVector) {
            capaVector.clearLayers();
            const mapa = window.manolitoMapa;
            if (mapa) mapa.removeLayer(capaVector);
            capaVector = null;
        }
    }

    // ================= UI: estilos autocontenidos =================
    function inyectarEstilos() {
        if (document.getElementById('evac-estilos')) return;
        const css = `
#evac-alerta{position:fixed;top:0;left:0;right:0;z-index:1300;padding:12px 52px 12px 14px;font-size:17px;
 font-weight:700;text-align:center;display:none;line-height:1.35}
#evac-alerta.roja{background:#b71c1c;color:#fff;animation:evacParpadeo 1s step-start infinite}
#evac-alerta.amarilla{background:#ffb300;color:#000}
#evac-alerta button{min-width:48px;min-height:48px;margin-top:8px;font-size:16px;font-weight:700;
 border-radius:10px;border:2px solid currentColor;background:transparent;color:inherit;cursor:pointer;
 display:block;width:100%}
#evac-alerta .evac-cerrar-alerta{position:absolute;top:2px;right:4px;width:48px;min-width:48px;
 height:48px;min-height:48px;margin:0;padding:0;display:flex;align-items:center;justify-content:center;
 border:none;background:transparent;color:inherit;font-size:20px;font-weight:700;cursor:pointer}
#evac-nav{position:fixed;inset:0;z-index:1250;pointer-events:none;display:none}
#evac-flecha{position:absolute;top:18%;left:50%;margin-left:-70px;width:140px;height:140px;
 transform-origin:50% 50%;will-change:transform}
#evac-flecha svg{width:100%;height:100%;filter:drop-shadow(0 0 10px rgba(255,60,0,.9));
 animation:evacParpadeo 0.8s step-start infinite}
#evac-panel{position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,.9);color:#fff;
 padding:12px 14px;border-radius:16px 16px 0 0;text-align:center;pointer-events:auto}
#evac-dist{font-size:26px;font-weight:800}
#evac-rumbo{font-size:17px;margin-top:2px}
#evac-estado{font-size:14px;margin-top:6px;color:#ffd54f;min-height:18px}
#evac-nota{font-size:12px;margin-top:6px;color:#b0bec5}
#evac-aviso{font-size:11px;margin-top:6px;color:#ef9a9a;line-height:1.3}
#evac-cerrar{min-width:48px;min-height:48px;margin-top:10px;font-size:16px;font-weight:700;
 border-radius:10px;border:2px solid #fff;background:#b71c1c;color:#fff;cursor:pointer;width:100%}
.evac-escapar-btn{min-width:48px;min-height:48px;margin-top:6px;font-weight:700;border-radius:8px;
 border:2px solid #b71c1c;background:#fff;color:#b71c1c;cursor:pointer;width:100%}
@keyframes evacParpadeo{0%{opacity:1}50%{opacity:.25}100%{opacity:1}}
@media (orientation:landscape){
 #evac-flecha{top:8%;width:110px;height:110px;margin-left:-55px}
 #evac-panel{left:auto;right:0;width:320px;border-radius:16px 0 0 0}
}
body.modo-accesible #evac-alerta.roja{background:#ff0000;color:#fff;animation:none}
body.modo-accesible #evac-flecha svg{animation:none;filter:drop-shadow(0 0 14px #ff0)}
`;
        const st = document.createElement('style');
        st.id = 'evac-estilos';
        st.textContent = css;
        document.head.appendChild(st);
    }

    // ================= UI: DOM =================
    let elBanner, elNav, elFlecha, elDist, elRumbo, elEstado, elNota, elAviso;

    function construirUI() {
        inyectarEstilos();

        elBanner = document.createElement('div');
        elBanner.id = 'evac-alerta';
        elBanner.setAttribute('role', 'alert');
        elBanner.setAttribute('aria-live', 'assertive');
        document.body.appendChild(elBanner);

        elNav = document.createElement('div');
        elNav.id = 'evac-nav';
        elNav.innerHTML = `
<div id="evac-flecha" aria-hidden="true">
 <svg viewBox="0 0 100 100"><polygon points="50,4 88,92 50,70 12,92" fill="#ff3c00" stroke="#fff" stroke-width="4"/></svg>
</div>
<div id="evac-panel" role="status">
 <div id="evac-dist" aria-live="polite"></div>
 <div id="evac-rumbo"></div>
 <div id="evac-estado" aria-live="polite"></div>
 <div id="evac-aviso"></div>
 <div id="evac-nota"></div>
 <button id="evac-cerrar" type="button"></button>
</div>`;
        document.body.appendChild(elNav);

        elFlecha = document.getElementById('evac-flecha');
        elDist = document.getElementById('evac-dist');
        elRumbo = document.getElementById('evac-rumbo');
        elEstado = document.getElementById('evac-estado');
        elNota = document.getElementById('evac-nota');
        elAviso = document.getElementById('evac-aviso');
        const btnCerrar = document.getElementById('evac-cerrar');
        btnCerrar.addEventListener('click', detenerEvacuacion);

        actualizarTextos();
    }

    function actualizarTextos() {
        const btnCerrar = document.getElementById('evac-cerrar');
        if (btnCerrar) btnCerrar.textContent = tt('evac.detener');
        if (elNota) {
            const offline = !navigator.onLine;
            const hora = estado.tsDatosGuardados
                ? new Date(estado.tsDatosGuardados).toLocaleTimeString()
                : '—';
            elNota.textContent = offline
                ? tt('evac.offline', { hora })
                : tt('evac.privacidad');
        }
        if (elAviso) elAviso.textContent = tt('evac.avisoLineaRecta');
        ultimoTextoEstado = ''; // fuerza repintar la línea de estado en el nuevo idioma
        if (estado.evacuando) pintarEstadoNav();
    }

    function pintarBanner(texto, nivel, conBoton) {
        if (!elBanner) return;
        elBanner.className = nivel || '';
        elBanner.style.display = 'block';
        elBanner.innerHTML = '';
        const span = document.createElement('span');
        span.textContent = texto;
        elBanner.appendChild(span);
        if (conBoton && !estado.evacuando) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = tt('evac.iniciar');
            btn.addEventListener('click', iniciarEvacuacion);
            elBanner.appendChild(btn);
        }
        // Toda notificación se puede cerrar: el mapa manda.
        const btnX = document.createElement('button');
        btnX.type = 'button';
        btnX.className = 'evac-cerrar-alerta';
        btnX.textContent = '✕';
        btnX.setAttribute('aria-label', tt('evac.cerrar'));
        btnX.addEventListener('click', descartarBanner);
        elBanner.appendChild(btnX);
    }

    function descartarBanner() {
        ocultarBanner();
        estado.nivelAlerta = null;
        // Si era un aviso de proximidad (no una evacuación activa), se deja
        // de vigilar para que el aviso no reaparezca a los pocos segundos.
        if (estado.monitorizando && !estado.evacuando) detenerMonitoreo();
    }

    function ocultarBanner() {
        if (elBanner) elBanner.style.display = 'none';
    }

    function mostrarNav() {
        if (elNav) elNav.style.display = 'block';
    }

    function ocultarNav() {
        if (elNav) elNav.style.display = 'none';
    }

    function pintarDistancia(vec) {
        if (!elDist || !estado.ultimaPos) return;
        const dMeta = distanciaM(estado.ultimaPos.lat, estado.ultimaPos.lon, vec.meta[0], vec.meta[1]);
        const kmTxt = dMeta < 1000 ? `${Math.round(dMeta)} m` : `${(dMeta / 1000).toFixed(1)} km`;
        elDist.textContent = tt('evac.haciaZonaSegura', { dist: kmTxt });
        elRumbo.textContent = tt('evac.rumbo', {
            card: gradosACardinalLocal(vec.azEscape),
            grados: Math.round(vec.azEscape)
        });
    }

    let ultimoTextoEstado = '';
    function pintarEstadoNav() {
        if (!elEstado) return;
        let texto = '';
        if (estado.modoBrujulaPuro) {
            texto = tt('evac.modoBrujula');
        } else if (estado.ultimaPos) {
            const edad = Math.round((Date.now() - estado.ultimaPos.ts) / 1000);
            texto = `GPS ±${Math.round(estado.ultimaPos.precision)} m` +
                (edad > 5 ? ` · ${tt('evac.gpsEdad', { s: edad })}` : '');
        }
        if (estado.brujulaErratica) texto += (texto ? ' · ' : '') + tt('evac.calibraBrujula');
        // Solo tocar el DOM (y el aria-live) cuando el texto cambia de verdad
        if (texto && texto !== ultimoTextoEstado) {
            ultimoTextoEstado = texto;
            elEstado.textContent = texto;
        }
        actualizarTextosNota();
    }

    function actualizarTextosNota() {
        if (!elNota) return;
        const offline = !navigator.onLine;
        const hora = estado.tsDatosGuardados
            ? new Date(estado.tsDatosGuardados).toLocaleTimeString()
            : '—';
        elNota.textContent = offline ? tt('evac.offline', { hora }) : tt('evac.privacidad');
    }

    let flashTimer = null;
    function flashRecalculando() {
        if (!elEstado) return;
        elEstado.textContent = tt('evac.recalculando');
        clearTimeout(flashTimer);
        flashTimer = setTimeout(pintarEstadoNav, 1500);
    }

    // ================= Flecha flotante =================
    // Gira con la diferencia entre el rumbo de escape (bearing, norte
    // verdadero) y la orientación del dispositivo (heading, norte MAGNÉTICO):
    // la punta señala SIEMPRE la dirección física de huida. Por eso al restar
    // se aplica la declinación magnética: convierte el bearing al mismo
    // marco de referencia que usa la brújula. Si la referencia es el rumbo
    // GPS (course), ese ya viene en norte verdadero y no lleva corrección.
    //
    // Batería: el GPS se sondea cada ~2 s (caro) y la flecha se redibuja
    // cada 500 ms reutilizando el último heading (barato). El filtro de
    // suavizado respeta el salto 360°/0° para que la aguja no tiemble.

    function suavizarAngulo(previo, nuevo, factor = 0.3) {
        if (previo === null) return nuevo;
        const diff = ((nuevo - previo + 540) % 360) - 180; // diferencia angular más corta
        return (previo + diff * factor + 360) % 360;
    }

    let timerFlecha = null;
    let timerVoz = null;

    function bucleFlecha() {
        if (!estado.evacuando) return;
        if (estado.azEscape !== null && elFlecha) {
            let objetivo;
            if (estado.heading !== null) {
                objetivo = (estado.azEscape + MAGNETIC_DECLINATION_DEG - estado.heading + 360) % 360;
            } else if (estado.gpsCourse !== null) {
                objetivo = (estado.azEscape - estado.gpsCourse + 360) % 360;
            } else {
                objetivo = estado.azEscape; // sin sensores: flecha fija respecto al norte
            }
            estado.anguloSuavizado = suavizarAngulo(estado.anguloSuavizado, objetivo);
            elFlecha.style.transform = `rotate(${estado.anguloSuavizado}deg)`;
        }
        // GPS stale: sin fix reciente en plena evacuación = brújula pura
        if (estado.ultimaPos && (Date.now() - estado.ultimaPos.ts > GPS_STALE_MS) && !estado.modoBrujulaPuro) {
            estado.modoBrujulaPuro = true;
        }
        // Edad del fix visible (batería baja / ahorro de energía ralentiza el GPS)
        pintarEstadoNav();
    }

    // Repetición de protocolo: cada 10 s se repite el rumbo de escape en
    // voz alta y se refuerza en texto. Bajo estrés la instrucción hablada
    // no depende de mirar la pantalla. Si la voz no está disponible, la
    // indicación visual sigue funcionando igual.
    function repetirInstruccion() {
        if (!estado.evacuando || estado.azEscape === null) return;
        const card = gradosACardinalLocal(estado.azEscape);
        const texto = tt('evac.sigueHacia', { card });
        if (elEstado) elEstado.dataset.ultimaVoz = texto;
        try {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(texto);
                u.lang = document.documentElement.lang || 'es';
                u.rate = 1.05;
                u.volume = 1;
                window.speechSynthesis.speak(u);
            }
        } catch (e) { /* voz no disponible: la flecha y el texto siguen */ }
    }

    // ================= Activación manual desde un foco =================
    // Al abrir el popup de un foco FIRMS se inyecta "Escapar de este foco".
    function engancharPopups() {
        const mapa = window.manolitoMapa;
        if (!mapa) return;
        mapa.on('popupopen', (e) => {
            const el = e.popup.getElement();
            if (!el || !el.querySelector('.evaluar-fuego-btn') || el.querySelector('.evac-escapar-btn')) return;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'evac-escapar-btn';
            btn.textContent = tt('evac.popupEscapar');
            btn.addEventListener('click', () => {
                mapa.closePopup();
                iniciarEvacuacion();
            });
            el.querySelector('.leaflet-popup-content')?.appendChild(btn);
        });
    }

    // ================= Eventos globales =================
    function engancharEventos() {
        // Batería: pestaña oculta → dormir monitorización (una evacuación
        // activa NO se duerme: la vida manda sobre la batería).
        window.addEventListener('manolito:pausa', () => {
            estado.pausado = true;
            if (estado.monitorizando && !estado.evacuando) {
                if (watchMonitoreo !== null) navigator.geolocation.clearWatch(watchMonitoreo);
                watchMonitoreo = null;
            }
        });
        window.addEventListener('manolito:reanudar', () => {
            estado.pausado = false;
            if (estado.monitorizando && watchMonitoreo === null && !estado.evacuando) {
                watchMonitoreo = navigator.geolocation.watchPosition(alPosicionMonitoreo, alErrorGps, {
                    enableHighAccuracy: false, maximumAge: 30000, timeout: 20000
                });
            }
        });

        // Pérdida de conexión: la navegación no se interrumpe; solo se
        // informa de que los datos son los últimos guardados.
        window.addEventListener('offline', actualizarTextosNota);
        window.addEventListener('online', () => { actualizarTextosNota(); persistirSiCambia(); });

        // i18n en caliente
        document.addEventListener('manolito:idioma-cambiado', actualizarTextos);
        window.addEventListener('manolitoforestal:idioma-cambiado', actualizarTextos);

        // Persistencia continua de perímetros (base inmutable offline)
        setInterval(() => { if (!estado.pausado) persistirSiCambia(); }, 20000);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') persistirSiCambia();
        });
    }

    // ================= Init =================
    function init() {
        construirUI();
        idbLeerZonas(); // precarga la base inmutable para uso offline
        engancharEventos();
        // El mapa se crea en motor-cuantico.js (defer anterior): reintenta
        // por si el orden de carga cambiara algún día.
        let intentos = 0;
        const reintento = setInterval(() => {
            if (window.manolitoMapa) {
                clearInterval(reintento);
                engancharPopups();
            } else if (++intentos >= 20) {
                clearInterval(reintento);
                console.warn('[Evacuación] mapa no disponible tras 20 intentos');
            }
        }, 200);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.manolitoEvacuacion = {
        iniciar: iniciarEvacuacion,
        detener: detenerEvacuacion,
        vigilar: iniciarMonitoreo,
        detenerVigilancia: detenerMonitoreo,
        estado
    };
})();

;
