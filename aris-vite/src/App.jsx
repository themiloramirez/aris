import React from 'react';

// ============================================================
// App.jsx — Aris v0.34 (migrado a Vite — Reforma Gregoriana 25/07/2026)
// ============================================================
// Este archivo es el contenido del script principal de Aris,
// adaptado para Vite. Main.jsx maneja el render raíz.
// ============================================================


// === imagenes.js — bibliotecarios base64 ===
const IMG_MARBLE   = "assets/img/marmolblanco1.jpg";
const IMG_TORTUGA  = "assets/img/tortuga1.png";
const IMG_ARISTOTELES = "assets/img/aristoteles1.jpg";
const IMG_BACON       = "assets/img/bacon1.jpg";
const IMG_TERESA      = "assets/img/teresa1.jpg";
const IMG_BORGES      = "assets/img/borges1.png";

// === biblioteca-template.js ===
// data/biblioteca-template.js
// Plantilla genérica de biblioteca — ablaut completo (ISO900B sección 5, corregida 23/06).
// Toda biblioteca nueva debe respetar esta forma. Formato único `facts` (list+flavors queda obsoleto).

/**
 * @typedef {Object} Biblioteca
 * @property {string} _id          - grado _: identidad interna, snake_case, nunca traducir
 * @property {"beginner"|"normal"|"hard"} _level - grado _: Paperback | Hardcover | Incunabula
 * @property {"en"|"es"} _lang     - grado _
 * @property {string} _field       - grado _: geografia | humanidades | ciencias_duras | artes | deportes
 * @property {string} name         - grado 0: visible al jugador
 * @property {string} desc         - grado 0: visible al jugador
 * @property {number|null} "total-" - grado -: null si es abierta por razón filosófica (nunca por pereza)
 * @property {number} ["metmin-"]  - grado -: opcional, si se omite se calcula como max(2, round(total*0.6))
 * @property {number} ["dificultad-"] - grado -: 1-5, subjetiva y ajustable a mano (ej. Moiras=2, Grayas=4 aunque ambas tengan 3 elementos — el total NO determina la dificultad por sí solo).
 * @property {number} ["lejania-"] - grado -: 1-5, distancia cultural/espacial/temporal del tema respecto al jugador promedio (asignada a mano al crear cada biblioteca, igual que dificultad).
 * @property {number} ["prioridad-"] - grado -: opcional, override manual absoluto del orden — si existe, gana sobre cualquier cálculo de score.
 * @property {Object.<string,string>} facts - clave normalizada -> flavor text
 * @property {Object.<string,string[]>} [synonyms] - clave normalizada (debe existir en facts) -> array de sinónimos genuinos (palabras DISTINTAS, mismo referente — ej. "indigo": ["anil"]). Hueco real detectado 28/06: el checklist de ISO900B lo exige, pero no existía campo en el código hasta ahora.
 */

function crearBiblioteca({ id, level, lang, field, name, desc, total, metmin, dificultad, lejania, prioridad, facts, synonyms }) {
  return {
    _id: id,
    _level: level,
    _lang: lang,
    _field: field,
    name,
    desc,
    "total-": total,
    "metmin-": metmin ?? (total ? Math.max(2, Math.round(total * 0.6)) : null),
    "dificultad-": dificultad ?? 3,
    "lejania-": lejania ?? 3,
    "prioridad-": prioridad ?? null,
    facts,
    synonyms: synonyms ?? {}
  };
}

/** Ejemplo real, usando el panteón de Matemáticas de Disertatio como caso de prueba. */
const EJEMPLO_MATEMATICAS = crearBiblioteca({
  id: "disertatio_matematicas",
  level: "hard", // Disertatio vive en Incunabula
  lang: "es",
  field: "ciencias_duras",
  name: "Disertatio — Matemáticas",
  desc: "Nombra 7 de los grandes pensadores de las matemáticas.",
  total: 7,
  metmin: 7, // Disertatio exige el set completo, no 60%
  facts: {
    euclides: "Que toda una disciplina (geometría no-euclidiana) se defina por oposición a ti dice mucho.",
    euler: "Notación matemática: sin él seríamos casi analfanumeri… ¿qué?",
    gauss: "Suena la campana de Gauss, el príncipe de las matemáticas.",
    "al khwarizmi": "El algoritmo detrás de todos los algoritmos. ¡Pero no lo culpes a él!",
    brahmagupta: "¿Nada vendrá de nada? Si la nada es el cero ¡vendrá toda la matemática!",
    noether: "Le pidió a Einstein una carta de recomendación. Einstein le pidió que le explicara su propio teorema.",
    pitagoras: "¿Por ser legendario es menos real? ¡Triangúlame eso!"
  }
});

// === paperback.js ===
// data/paperback.js
// Primeras 3 bibliotecas de Paperback, en EN y ES, pobladas para 1.0 (28/06).



// ============ OCÉANOS / OCEANS ============
// Caso simple: 5 océanos, consenso real (incluyendo el Antártico/Austral, reconocido oficialmente en 2000).

const OCEANOS_ES = crearBiblioteca({
  id: "oceanos", level: "beginner", lang: "es", field: "geografia",
  name: "Océanos", desc: "Nombra los océanos del mundo.",
  total: 5, dificultad: 1, lejania: 1,
  facts: {
    pacifico: "El más grande y profundo — más superficie que toda la masa de tierra junta.",
    atlantico: "El segundo más grande, y el que separa (o une, según se mire) América de Europa y África.",
    indico: "El más cálido de los tres grandes — baña costas de África, Asia y Oceanía.",
    "artico": "El más pequeño y el menos profundo — casi enteramente cubierto de hielo marino.",
    "antartico": "El quinto, y el más nuevo en los mapas: reconocido oficialmente como océano en el año 2000. Rodea la Antártida y define la corriente más poderosa del planeta."
  },
  synonyms: { "antartico": ["austral", "oceano austral", "oceano antartico"] }
});

const OCEANS_EN = crearBiblioteca({
  id: "oceans", level: "beginner", lang: "en", field: "geografia",
  name: "Oceans", desc: "Name the world's oceans.",
  total: 5, dificultad: 1, lejania: 1,
  facts: {
    pacific: "The largest and deepest — more surface area than all landmasses combined.",
    atlantic: "The second largest, separating (or connecting, depending on how you look at it) the Americas from Europe and Africa.",
    indian: "The warmest of the major oceans — borders Africa, Asia, and Oceania.",
    arctic: "The smallest and shallowest — almost entirely covered in sea ice.",
    southern: "Also called the Antarctic Ocean — officially recognized as a fifth ocean in the year 2000."
  },
  synonyms: { southern: ["antarctic", "antarctic ocean", "southern ocean"] }
});

// ============ CONTINENTES / CONTINENTS ============
// Caso paradigmático de asimetría EN/ES: la convención hispana cuenta 6 (América unida),
// la anglosajona cuenta 7 (separa North/South America). No es error de traducción — es
// diferencia real de tradición educativa. Documentado explícitamente, no oculto.

const CONTINENTES_ES = crearBiblioteca({
  id: "continentes", level: "beginner", lang: "es", field: "geografia",
  name: "Continentes", desc: "Nombra los continentes (convención hispanohablante: 6).",
  total: 6, dificultad: 1, lejania: 1,
  facts: {
    africa: "El segundo más grande, y cuna de la humanidad según el consenso paleontológico.",
    america: "Tratado como uno solo en la convención hispanohablante — desde Alaska hasta Tierra del Fuego.",
    "antartida": "El único sin población permanente — solo bases científicas.",
    asia: "El más grande y poblado de todos, por amplio margen.",
    europa: "El más pequeño de los continentes con población permanente — y aun así, el que más se cree el centro del mundo.",
    oceania: "El más fragmentado — miles de islas además de Australia continental."
  }
});

const CONTINENTS_EN = crearBiblioteca({
  id: "continents", level: "beginner", lang: "en", field: "geografia",
  name: "Continents", desc: "Name the continents (Anglophone convention: 7).",
  total: 7, dificultad: 1, lejania: 1,
  facts: {
    africa: "The second largest, and the cradle of humanity according to paleontological consensus.",
    "north america": "Treated as separate from South America in the Anglophone convention.",
    "south america": "Home to the Amazon — the largest rainforest on Earth.",
    antarctica: "The only one with no permanent population — only research stations.",
    asia: "The largest and most populous by a wide margin.",
    europe: "The smallest of the traditional continents, not counting Antarctica.",
    oceania: "The most fragmented — thousands of islands beyond mainland Australia."
  }
});

// ============ SPICE GIRLS ============
// Caso de prueba real ya verificado contra el bug legendario "13 Spice Girls" (test-spice-girls.mjs).
// Mismo contenido en ambos idiomas — los nombres propios no se traducen.

const SPICE_GIRLS_FACTS = {
  "melanie brown": "Scary Spice — la voz más potente del grupo.",
  "melanie chisholm": "Sporty Spice — la única que mantuvo carrera deportiva paralela.",
  "emma bunton": "Baby Spice — la más joven del grupo original.",
  "geri halliwell": "Ginger Spice — se fue primero, volvió para la reunión.",
  "victoria beckham": "Posh Spice — la única cuyo apodo era una aspiración, no una descripción. Lo irónico: fue la única que realmente la cumplió."
};

const SPICE_GIRLS_SYNONYMS = {
  "melanie brown": ["mel b", "scary spice", "scary"],
  "melanie chisholm": ["mel c", "sporty spice", "sporty", "melanie c"],
  "emma bunton": ["baby spice", "baby"],
  "geri halliwell": ["ginger spice", "ginger", "geri"],
  "victoria beckham": ["posh spice", "posh", "victoria adams"]
};

const SPICE_GIRLS_ES = crearBiblioteca({
  id: "spice_girls", level: "beginner", lang: "es", field: "artes",
  name: "Spice Girls", desc: "Nombra a las cinco integrantes de las Spice Girls.",
  total: 5, dificultad: 2, lejania: 2,
  facts: SPICE_GIRLS_FACTS, synonyms: SPICE_GIRLS_SYNONYMS
});

const SPICE_GIRLS_EN = crearBiblioteca({
  id: "spice_girls_en", level: "beginner", lang: "en", field: "artes",
  name: "Spice Girls", desc: "Name the five members of the Spice Girls.",
  total: 5, dificultad: 2, lejania: 1, // lejanía más baja en EN: tema de origen anglosajón, menos "lejano" para ese público
  facts: SPICE_GIRLS_FACTS, synonyms: SPICE_GIRLS_SYNONYMS
});


// ============ ESTÓMAGOS DE LA VACA ============
const ESTOMAGOS_ES = crearBiblioteca({
  id: "estomagos_es", level: "beginner", lang: "es", field: "ciencias_duras",
  name: "Estómagos de la vaca", desc: "Nombra los 4 compartimentos del estómago de la vaca.",
  total: 4, metmin: 4, dificultad: 2, lejania: 3,
  facts: {
    panza:   "El más grande — hasta 95 litros. Fermenta, rumia, y junto al bonete es lo que comés cuando pedís mondongo. La democracia del pasto.",
    bonete:  "Su forma de gorro eclesiástico de cuatro puntas le dio el nombre. Filtra lo que la panza fermentó.",
    librillo:"Sus pliegues parecen páginas — de ahí el nombre. Lee lo que los otros dos prepararon.",
    cuajar:  "Cuajar: El único estómago verdadero: tiene secreción gástrica. Y la enzima que contiene cuaja la leche — sin él, no hay queso."
  },
  synonyms: {
    panza:    ["rumen","rumia","primer estomago"],
    bonete:   ["reticulo","retículo","segundo estomago"],
    librillo: ["omaso","tercer estomago"],
    cuajar:   ["abomaso","cuarto estomago"]
  }
});

const COWSTOMACHS_EN = crearBiblioteca({
  id: "cowstomachs_en", level: "beginner", lang: "en", field: "ciencias_duras",
  name: "Stomachs of a cow", desc: "Name the 4 compartments of a cow's stomach.",
  total: 4, metmin: 4, dificultad: 2, lejania: 3,
  facts: {
    rumen:     "The largest compartment — holds up to 95 litres. Fermentation happens here. Also what you're eating in tripe.",
    reticulum: "Named for its honeycomb texture. Filters what the rumen fermented.",
    omasum:    "Its many folds look like pages — hence the nickname 'bible stomach'.",
    abomasum:  "Its many folds look like pages — hence the nickname 'bible stomach'."
  },
  synonyms: {
    rumen:     ["paunch","first stomach","fermentation chamber"],
    reticulum: ["honeycomb stomach","bonnet","second stomach"],
    omasum:    ["bible stomach","manyplies","third stomach"],
    abomasum:  ["true stomach","fourth stomach","rennet stomach"]
  }
});

// ============ SIETE PECADOS CAPITALES ============
const PECADOS_ES = crearBiblioteca({
  id: "pecados_es", level: "beginner", lang: "es", field: "humanidades",
  name: "Los siete pecados capitales", desc: "Nombra los 7 pecados capitales.",
  total: 7, metmin: 5, dificultad: 2, lejania: 2,
  facts: {
    soberbia: "Del latín superbia — ponerse por encima. El pecado original y más grave. El que hizo caer a Lucifer.",
    avaricia: "El más capitalista. Dante no escatimó en sus representantes en el cuarto círculo: casi se desborda.",
    lujuria:  "El segundo círculo de Dante. Paolo y Francesca y el tiempo feliz en la miseria. Su retrato induce a veces nostalgia.",
    envidia:  "Nunca produce placer, ni a víctimas ni a perpetrantes. Es mejor despertarla que sentirla. Con Aris.",
    gula:     "El más delicioso, por definición. Su derivado, golosina, ha perdido por completo su connotación negativa.",
    ira:      "El único pecado que puede dirigirse completamente hacia afuera. Devastador con bastante literalidad.",
    pereza:   "El único pecado que dio nombre a un animal: el perezoso. También conocida como acedia, indolencia o melancolía."
  },
  synonyms: {
    soberbia: ["orgullo","hubris","arrogancia","altivez"],
    avaricia: ["codicia","tacañeria","mezquindad"],
    lujuria:  ["lascivia","concupiscencia","libido"],
    envidia:  ["celos"],
    gula:     ["glotoneria","voracidad","glotonería"],
    ira:      ["rabia","colera","furia","cólera"],
    pereza:   ["acedia","indolencia","desidia","flojera"]
  }
});

const SINS_EN = crearBiblioteca({
  id: "sins_en", level: "beginner", lang: "en", field: "humanidades",
  name: "The seven deadly sins", desc: "Name all 7 deadly sins.",
  total: 7, metmin: 5, dificultad: 2, lejania: 2,
  facts: {
    pride:    "From Latin superbia — to place oneself above. The original sin, and the gravest. The one that brought Lucifer down.",
    greed:    "The most capitalist of the seven. Dante didn't stint on its representatives in the fourth circle — it nearly overflows.",
    lust:     "Dante's second circle. Paolo and Francesca, and the happy time in misery. Its portrait sometimes inspires nostalgia.",
    envy:     "The only sin that brings no pleasure — not even to the one who feels it. Better to inspire it than to feel it.",
    gluttony: "The sin of binge eaters. Do binge watchers deserve their own? Would they notice?",
    wrath:    "The only sin that can be directed entirely outward. Devastating, quite literally.",
    sloth:    "The only sin that named an animal — the animal was named after the sin, not the other way around."
  },
  synonyms: {
    pride:    ["hubris","arrogance","vanity"],
    greed:    ["avarice","covetousness"],
    lust:     ["lechery","concupiscence"],
    envy:     ["jealousy"],
    gluttony: ["voracity"],
    wrath:    ["anger","rage","fury","ire"],
    sloth:    ["acedia","laziness","idleness"]
  }
});

// ============ HUESOS DEL OÍDO HUMANO ============
const HUESOS_OIDO_ES = crearBiblioteca({
  id: "huesos_oido_es", level: "beginner", lang: "es", field: "ciencias_duras",
  name: "Huesos del oído humano", desc: "Nombra los 3 huesecillos del oído medio.",
  total: 3, metmin: 3, dificultad: 2, lejania: 2,
  facts: {
    martillo: "El primero en la cadena. Recibe las vibraciones del tímpano y las transmite al yunque. El más grande de los tres — y aun así mide 8mm.",
    yunque:   "El intermediario. Recibe del martillo, entrega al estribo. En el oído, la discreción es una virtud.",
    estribo:  "El más pequeño del cuerpo humano — 3mm. Todo lo que hemos oído alguna vez pasó por aquí."
  },
  synonyms: {
    martillo: ["malleus"],
    yunque:   ["incus"],
    estribo:  ["stapes"]
  }
});

const EAR_BONES_EN = crearBiblioteca({
  id: "ear_bones_en", level: "beginner", lang: "en", field: "ciencias_duras",
  name: "Bones of the human ear", desc: "Name the 3 tiny bones of the middle ear.",
  total: 3, metmin: 3, dificultad: 2, lejania: 3,
  facts: {
    malleus: "The first in the chain — receives vibrations from the eardrum. The largest of the three at a full 8mm.",
    incus:   "The go-between. Takes from the malleus, gives to the stapes. Discretion is a virtue in the middle ear.",
    stapes:  "The smallest bone in the human body — 3mm. Everything you have ever heard passed through here."
  },
  synonyms: {
    malleus: ["hammer","martillo"],
    incus:   ["anvil","yunque"],
    stapes:  ["stirrup","estribo"]
  }
});

// ============ SIETE MARAVILLAS DEL MUNDO ANTIGUO ============
const MARAVILLAS_ES = crearBiblioteca({
  id: "maravillas_es", level: "beginner", lang: "es", field: "humanidades",
  name: "Las Siete Maravillas del Mundo Antiguo", desc: "Nombra las 7 Maravillas del Mundo Antiguo.",
  total: 7, metmin: 5, dificultad: 3, lejania: 3,
  facts: {
    "gran piramide de giza":           "Pirámides de Giza: La única maravilla que sigue en pie. Las otras seis: destruidas por terremotos, incendios y el tiempo. Ellas: aquí.",
    "jardines colgantes de babilonia": "Jardines de Babilonia: La única maravilla cuya existencia es debatida. Ningún texto babilónico la menciona. Quizás en Nínive. Quizás un sueño.",
    "estatua de zeus en olimpia":      "Estatua de Zeus en Olimpia: Criselefantina — 12 metros de marfil y oro, de Fidias. Destrucción incierta: ¿Constantinopla? ¿Siglo V? ¿Incendio?",
    "templo de artemis en efeso":      "Templo de Artemisa en Éfeso: Quemado por Eróstrato en 356 a.C. — para ser famoso. Funcionó. Reconstruido. Destruido de nuevo. Al final: piedras.",
    "mausoleo de halicarnaso":         "Mausoleo de Halicarnaso: La tumba de Mausolo fue tan impresionante que su nombre se convirtió en sustantivo común. Cada mausoleo le debe la palabra.",
    "coloso de rodas":                 "Coloso de Rodas: Un Helios de 33 metros. Un pie a cada lado del puerto y en pie 54 años. En pedazos en el suelo 900 años — nadie se atrevió a moverlos.",
    "faro de alejandria":              "Faro de Alejandría: Entre 120 y 137 metros — el edificio más alto del mundo durante siglos. Su nombre en árabe, al-manāra, dio origen a 'minarete'."
  },
  synonyms: {
    "gran piramide de giza":           ["piramides de giza","piramide de giza","gran piramide","piramide de keops","piramides de egipto","piramides de guiza","piramide de guizeh"],
    "jardines colgantes de babilonia": ["jardines de babilonia","jardines colgantes"],
    "estatua de zeus en olimpia":      ["estatua de zeus","zeus de olimpia"],
    "templo de artemis en efeso":      ["templo de artemisa","templo de artemis","templo de diana","templo de efeso","templo de artemisa en efeso"],
    "mausoleo de halicarnaso":         ["mausoleo de mausolo","el mausoleo"],
    "coloso de rodas":                 ["el coloso","coloso"],
    "faro de alejandria":              ["el faro","faro de alejandr"]
  }
});

const WONDERS_EN = crearBiblioteca({
  id: "wonders_en", level: "beginner", lang: "en", field: "humanidades",
  name: "Seven Wonders of the Ancient World", desc: "Name all 7 Wonders of the Ancient World.",
  total: 7, metmin: 5, dificultad: 3, lejania: 2,
  facts: {
    "great pyramid of giza":        "Great Pyramid of Giza: The only Wonder still standing. All others: destroyed by earthquakes, fires, time. This one: here.",
    "hanging gardens of babylon":   "Hanging Gardens of Babylon: The only Wonder whose existence is debated. No Babylonian text mentions them. Perhaps Nineveh. Perhaps a dream.",
    "statue of zeus at olympia":    "Statue of Zeus at Olympia: chryselephantine — 12 metres of ivory and gold, by Pheidias. Fate uncertain: Constantinople? Fire? Fifth century?",
    "temple of artemis at ephesus": "Temple of Artemis at Ephesus: Burned by Herostratus in 356 BC — for fame. It worked. Rebuilt. Destroyed again. Eventually: stones.",
    "mausoleum at halicarnassus":   "Mausoleum at Halicarnassus: Mausolus's tomb was so impressive his name became a common noun. Every mausoleum owes him the word.",
    "colossus of rhodes":           "Colossus of Rhodes: A 33-metre Helios. Astride the harbour entrance, standing 54 years. In fragments on the ground 900 years — no one dared move them.",
    "lighthouse of alexandria":     "Lighthouse of Alexandria: Between 120 and 137 metres — the tallest building in the world for centuries. Its Arabic name, al-manāra, gave us 'minaret'."
  },
  synonyms: {
    "great pyramid of giza":        ["pyramids of giza","great pyramid","pyramid of cheops","pyramid of khufu","giza pyramid"],
    "hanging gardens of babylon":   ["hanging gardens","gardens of babylon"],
    "statue of zeus at olympia":    ["statue of zeus","zeus of olympia"],
    "temple of artemis at ephesus": ["temple of artemis","temple of diana","temple of diana at ephesus"],
    "mausoleum at halicarnassus":   ["mausoleum of mausolus","the mausoleum"],
    "colossus of rhodes":           ["the colossus","colossus"],
    "lighthouse of alexandria":     ["pharos","pharos of alexandria","the lighthouse"]
  }
});


// ============ LUNAS GALILEANAS DE JÚPITER ============
const LUNAS_GALILEANAS_ES = crearBiblioteca({
  id: "lunas_galileanas_es", level: "beginner", lang: "es", field: "ciencias_duras",
  name: "Lunas galileanas de Júpiter", desc: "Nombra las 4 grandes lunas que Galileo descubrió en 1610.",
  total: 4, metmin: 4, dificultad: 2, lejania: 3,
  facts: {
    io:        "El cuerpo más volcánicamente activo del sistema solar. Mientras lees esto, está erupcionando.",
    europa:    "Tiene un océano subterráneo bajo su corteza de hielo. La candidata más estudiada para albergar vida extraterrestre.",
    ganimedes: "La luna más grande del sistema solar — más grande que Mercurio. Tiene su propio campo magnético.",
    calisto:   "El objeto con más cráteres del sistema solar. Tan bombardeada que no puede recibir más impactos sin borrar los anteriores."
  },
  synonyms: {
    ganimedes: ["ganímedes","ganymede"],
    calisto:   ["callisto"]
  }
});

const GALILEAN_MOONS_EN = crearBiblioteca({
  id: "galilean_moons_en", level: "beginner", lang: "en", field: "ciencias_duras",
  name: "Galilean moons of Jupiter", desc: "Name the 4 large moons Galileo discovered in 1610.",
  total: 4, metmin: 4, dificultad: 2, lejania: 3,
  facts: {
    io:       "The most volcanically active body in the solar system. It is erupting as you read this.",
    europa:   "Has a subsurface ocean beneath its ice shell. The most serious candidate for extraterrestrial life.",
    ganymede: "The largest moon in the solar system — bigger than Mercury. Has its own magnetic field.",
    callisto: "The most heavily cratered object in the solar system. So bombarded it cannot receive more impacts without erasing the old ones."
  },
  synonyms: {
    ganymede: ["ganimedes"]
  }
});

// ============ MACRONUTRIENTES ============
const MACRONUTRIENTES_ES = crearBiblioteca({
  id: "macronutrientes_es", level: "beginner", lang: "es", field: "ciencias_duras",
  name: "Macronutrientes", desc: "Nombra los 3 macronutrientes.",
  total: 3, metmin: 3, dificultad: 1, lejania: 3,
  facts: {
    proteinas:     "Proteínas: Los ladrillos, albañiles y guardianes del cuerpo. Y también muchas hormonas, transportadores, receptores. Comodines imprescindibles.",
    carbohidratos: "El combustible principal del cerebro y los músculos. Sin ellos, el cuerpo quema lo que no debería.",
    grasas:        "El macronutriente más calumniado. Sin ellas: sin hormonas, sin vitaminas A/D/E/K, sin cerebro funcional."
  },
  synonyms: {
    proteinas:     ["proteína","protein"],
    carbohidratos: ["hidratos de carbono","carbos","carbohidrato"],
    grasas:        ["lipidos","lípidos","lipido","grasa"]
  }
});

const MACRONUTRIENTS_EN = crearBiblioteca({
  id: "macronutrients_en", level: "beginner", lang: "en", field: "ciencias_duras",
  name: "Macronutrients", desc: "Name the 3 macronutrients.",
  total: 3, metmin: 3, dificultad: 1, lejania: 3,
  facts: {
    proteins:      "The body's building blocks. Muscles, enzymes, antibodies. Everything that acts, is protein.",
    carbohydrates: "The primary fuel for brain and muscles. Without them, the body burns what it shouldn't.",
    fats:          "The most maligned macronutrient. Without them: no hormones, no vitamins A/D/E/K, no functioning brain."
  },
  synonyms: {
    proteins:      ["protein"],
    carbohydrates: ["carbs","carbohydrate","sugars"],
    fats:          ["lipids","lipid","fat"]
  }
});

// ============ MESES CON 30 DÍAS ============
const MESES_30_ES = crearBiblioteca({
  id: "meses_30_es", level: "beginner", lang: "es", field: "humanidades",
  name: "Meses con 30 días", desc: "Nombra los 4 meses que tienen exactamente 30 días.",
  total: 4, metmin: 4, dificultad: 1, lejania: 2,
  facts: {
    abril:      "El mes más cruel, según T.S. Eliot. Mezcla memoria y deseo. Treinta días — y todos cuentan.",
    junio:      "El solsticio de verano en el norte, de invierno en el sur. El día más largo y el más corto, según dónde estés.",
    septiembre: "Suena a séptimo, es el noveno. Julio César reorganizó el calendario y nadie reencuadró el conteo.",
    noviembre:  "Su nombre dice noveno (novem). Es el undécimo. Mismo culpable: la reforma juliana. Al menos diciembre aún cierra el año."
  },
  synonyms: {
    septiembre: ["setiembre"]
  }
});

const MONTHS_30_EN = crearBiblioteca({
  id: "months_30_en", level: "beginner", lang: "en", field: "humanidades",
  name: "Months with 30 days", desc: "Name the 4 months with exactly 30 days.",
  total: 4, metmin: 4, dificultad: 1, lejania: 2,
  facts: {
    april:     "The cruellest month, according to Eliot. Mixing memory and desire. Thirty days — and every one counts.",
    june:      "Summer solstice in the north, winter in the south. The longest day and the shortest, depending on where you are.",
    september: "Its name says seventh (septem). It is the ninth. Julius Caesar reorganised the calendar and no one updated the names.",
    november:  "Its name says ninth (novem). It is the eleventh. Same culprit: the Julian reform. At least December still ends the year."
  }
});

// ============ ÓRDENES ARQUITECTÓNICAS GRIEGAS ============
const ORDENES_ES = crearBiblioteca({
  id: "ordenes_es", level: "normal", lang: "es", field: "artes",
  name: "Órdenes arquitectónicas griegas", desc: "Nombra los 3 órdenes de la arquitectura griega clásica.",
  total: 3, metmin: 3, dificultad: 2, lejania: 3,
  facts: {
    dorica:   "Dórica: Las del Partenón, la más antigua y sobria. Sin base y con capitel liso. Menos es más: la austeridad encarnada.",
    jonica:   "Jónica: Reconocible por las volutas en espiral que dan elegancia al Erecteion.",
    corintia: "La más ornamentada — capitel de hojas de acanto. Surgida en Grecia, difundida y canonizada en Roma."
  },
  synonyms: {
    dorica:   ["orden dorica","orden dorico","dorico"],
    jonica:   ["orden jonica","orden jonico","jonico","jónica","jónico"],
    corintia: ["orden corintia","orden corintio","corintio"]
  }
});

const ORDERS_EN = crearBiblioteca({
  id: "orders_en", level: "normal", lang: "en", field: "artes",
  name: "Classical Greek architectural orders", desc: "Name the 3 Greek orders of architecture.",
  total: 3, metmin: 3, dificultad: 2, lejania: 3,
  facts: {
    doric:      "The oldest and most austere. No base, plain capital. The Parthenon is Doric. Austerity as architecture.",
    ionic:      "Recognisable by its scroll-shaped volutes. More elegant than the Doric. The Erechtheion is Ionic.",
    corinthian: "The most ornate — acanthus-leaf capital. Favoured by the Romans. What the Greeks started, Rome multiplied."
  },
  synonyms: {
    doric:      ["doric order","dorian"],
    ionic:      ["ionic order"],
    corinthian: ["corinthian order"]
  }
});


// ============ GASES NOBLES ============
const GASES_NOBLES_ES = crearBiblioteca({
  id: "gases_nobles_es", level: "beginner", lang: "es", field: "ciencias_duras",
  name: "Gases nobles", desc: "Nombra los 6 gases nobles (grupo 18 de la tabla periódica).",
  total: 6, metmin: 4, dificultad: 3, lejania: 3,
  facts: {
    helio:   "Del griego Helios, sol. Descubierto en el espectro solar antes que en la Tierra. El único elemento no extraído primero del suelo.",
    neon:    "Del griego neos, nuevo. No reacciona con nada — y sin embargo ilumina la noche de casi todas las ciudades del planeta.",
    argon:   "Del griego argos, inactivo. El 1% del aire que respirás ahora mismo. No hace nada. No importa. Está.",
    kripton: "Del griego kryptos, oculto. Tan difícil de aislar que tardaron años en encontrarlo. No es solo el planeta de Superman.",
    xenon:   "Del griego xenos, extraño. Sus iones azules propulsan satélites. Sin él, el GPS no existiría.",
    radon:   "Del radio, del que se desprende. El único gas noble radiactivo. Se filtra del suelo, se acumula en sótanos. Segunda causa de cáncer de pulmón tras el tabaco."
  },
  synonyms: {
    helio:   ["helium"],
    neon:    ["neón","neon"],
    argon:   ["argón","argon"],
    kripton: ["kriptón","krypton","cripton"],
    xenon:   ["xenón","xeon"],
    radon:   ["radón","radon"]
  }
});

const NOBLE_GASES_EN = crearBiblioteca({
  id: "noble_gases_en", level: "beginner", lang: "en", field: "ciencias_duras",
  name: "Noble gases", desc: "Name the 6 noble gases (group 18 of the periodic table).",
  total: 6, metmin: 4, dificultad: 3, lejania: 3,
  facts: {
    helium:  "From Greek Helios, sun. Discovered in the solar spectrum before it was found on Earth. The only element not first extracted from the ground.",
    neon:    "From Greek neos, new. Reacts with nothing — and yet illuminates the night of almost every city on the planet.",
    argon:   "From Greek argos, inactive. 1% of the air you are breathing right now. Does nothing. Doesn't matter. It's there.",
    krypton: "From Greek kryptos, hidden. So difficult to isolate that it took years to find. Not just Superman's planet.",
    xenon:   "From Greek xenos, strange. Its blue ions propel satellites. Without it, GPS would not exist.",
    radon:   "From radium, which it escapes from. The only radioactive noble gas. Seeps from the ground, accumulates in basements. Second leading cause of lung cancer after tobacco."
  },
  synonyms: {
    krypton: ["kripton","kriptonite"]
  }
});

// ============ SIGNOS DEL ZODÍACO ============
const ZODIACO_ES = crearBiblioteca({
  id: "zodiaco_es", level: "beginner", lang: "es", field: "humanidades",
  name: "Signos del zodíaco", desc: "Doce constelaciones. Doce catasterismos. Nombra los signos del zodíaco occidental.",
  total: 12, metmin: 8, dificultad: 2, lejania: 1,
  facts: {
    aries:       "El carnero de vellón dorado — su piel fue el Vellocino de Oro que buscaron los Argonautas. Catasterizado por Zeus en memoria del viaje.",
    tauro:       "El toro que Zeus usó para raptar a Europa. La luna de Júpiter cierra el círculo.",
    geminis:     "Cástor y Pólux — uno mortal, uno inmortal. Compartieron la inmortalidad a días alternos. El amor fraternal como ecuación imposible.",
    cancer:      "El cangrejo que Hera mandó a molestar a Heracles mientras combatía la Hidra. Heracles lo aplastó. Le dieron una constelación de consuelo.",
    leo:         "El León de Nemea. El primero de los trabajos de Heracles. Si ya te lo encontraste, vencido; si no, apúntalo.",
    virgo:       "La constelación más grande del zodíaco. Deméter, Isis, la Virgen. Cada cultura proyectó aquí su madre cósmica.",
    libra:       "La única constelación del zodíaco que no representa un ser vivo. La justicia como la única abstracción digna del cielo.",
    escorpio:    "El escorpión que mató a Orión. Zeus los puso en lados opuestos del cielo para que nunca coincidieran.",
    sagitario:   "El centauro arquero. Apunta al centro de la Vía Láctea — literalmente: el agujero negro supermasivo está en esa dirección.",
    capricornio: "La cabra-pez. Una de las constelaciones más antiguas documentadas — los sumerios ya la conocían hace 3.000 años.",
    acuario:     "Acuario: El aguador. Los griegos lo asociaron con Ganimedes, copero de los dioses — el mismo nombre que lleva hoy la luna más grande de Júpiter.",
    piscis:      "Piscis: Afrodita y Eros transformados para escapar de Tifón. El zodíaco termina donde el amor huye."
  },
  synonyms: {
    geminis:     ["géminis"],
    cancer:      ["cáncer"],
    sagitario:   ["sagitarius"],
    capricornio: ["capricorn"],
    escorpio:    ["escorpion","scorpio"]
  }
});

const ZODIAC_EN = crearBiblioteca({
  id: "zodiac_en", level: "beginner", lang: "en", field: "humanidades",
  name: "Signs of the zodiac", desc: "Twelve constellations. Twelve catasterisms — look it up. Name the signs of the western zodiac.",
  total: 12, metmin: 8, dificultad: 2, lejania: 1,
  facts: {
    aries:       "The golden-fleeced ram — its skin became the Golden Fleece sought by the Argonauts. Catasterised by Zeus in memory of the voyage.",
    taurus:      "The bull Zeus became to abduct Europa. The moon of Jupiter closes the circle.",
    gemini:      "Castor and Pollux — one mortal, one immortal. They shared immortality on alternate days. Fraternal love as an impossible equation.",
    cancer:      "The crab Hera sent to bother Heracles while he fought the Hydra. Heracles crushed it. It got a constellation as consolation.",
    leo:         "The Nemean Lion. The first of the Labours of Heracles. If you've already met it, defeated; if not, note it down.",
    virgo:       "The largest constellation in the zodiac. Demeter, Isis, the Virgin. Every culture projected its cosmic mother here.",
    libra:       "The only zodiac constellation not representing a living being. Justice as the only abstraction worthy of the sky.",
    scorpio:     "The scorpion that killed Orion. Zeus placed them on opposite sides of the sky so they would never meet.",
    sagittarius: "The archer centaur. Points at the centre of the Milky Way — literally: the supermassive black hole lies in that direction.",
    capricorn:   "The sea-goat. One of the oldest documented constellations — the Sumerians already knew it 3,000 years ago.",
    aquarius:    "The water-bearer. Associated with Ganymede, cupbearer of the gods — the same name carried today by the largest moon of Jupiter.",
    pisces:      "Aphrodite and Eros transformed to escape Typhon. The zodiac ends where love flees."
  },
  synonyms: {
    scorpio:     ["scorpius","scorpion"],
    sagittarius: ["sagitario","sagitarius"],
    capricorn:   ["capricornus","capricornio"]
  }
});


// ============ SABORES BÁSICOS ============
const SABORES_ES = crearBiblioteca({
  id: "sabores_es", level: "beginner", lang: "es", field: "ciencias_duras",
  name: "Sabores básicos", desc: "Nombra los 5 sabores básicos reconocidos por la neurociencia.",
  total: 5, metmin: 5, dificultad: 1, lejania: 2,
  facts: {
    dulce:  "El primero que reconocemos y el preferido de los golosos. Si glucosa es energía, dulce es bueno — no es tu glucomanía, es la evolución.",
    acido:  "Ácido: Como en los cítricos o agrio como en el vinagre. La fermentación puede ser delicia o toxicidad — el ácido avisa cuál.",
    salado: "La única roca que comemos. Nos dio salarios, salazones, salmueras, Galicias, halógenos y el mejor libro de Kurlansky.",
    amargo: "Al que más sensibles somos — concentraciones ínfimas porque es alarma de veneno. El chocolate y el café: triunfos sobre lo natural. Un delicioso gom jabbar.",
    umami:  "Umami: El quinto sabor — el de los champiñones, los tomates, el miso, las algas y el parmesano. Ikeda lo identificó en 1908 y ese mismo año patentó el MSG. El 'síndrome del restaurante chino' fue un mito. El sabor, no."
  },
  synonyms: {
    acido:  ["agrio","ácido"],
    umami:  ["glutamato","msg","sabroso"]
  }
});

const TASTES_EN = crearBiblioteca({
  id: "tastes_en", level: "beginner", lang: "en", field: "ciencias_duras",
  name: "Basic tastes", desc: "Name the 5 basic tastes recognised by neuroscience.",
  total: 5, metmin: 5, dificultad: 1, lejania: 2,
  facts: {
    sweet:  "The first taste we recognise, preferred by infants and sugar lovers alike. Glucose equals energy, sweet equals good — it's not your sweet tooth, it's evolution.",
    sour:   "As in citrus or vinegar. Fermentation can be delicious or toxic — sour warns you which.",
    salty:  "The only rock we eat. It gave us salaries, salt fish, salads, brines, and the best book by Kurlansky.",
    bitter: "The taste we're most sensitive to — tiny concentrations, because it signals poison. Coffee and chocolate: triumphs over nature. A delicious gom jabbar.",
    umami:  "Umami: The fifth taste — mushrooms, tomatoes, miso, seaweed, parmesan. Ikeda identified it in 1908 and patented MSG that same year. The 'Chinese restaurant syndrome' was a myth. The taste was not."
  },
  synonyms: {
    sour:  ["acidic","tart"],
    umami: ["glutamate","msg","savory","savoury"]
  }
});

// ============ HUESOS DEL CARPO ============
const HUESOS_CARPO_ES = crearBiblioteca({
  id: "huesos_carpo_es", level: "normal", lang: "es", field: "ciencias_duras",
  name: "Huesos del carpo", desc: "Los 8 huesecillos de la muñeca, organizados en dos filas. Nombra todos.",
  total: 8, metmin: 5, dificultad: 4, lejania: 4,
  facts: {
    escafoides: "El más fracturado del carpo. Cae mal la mano, se rompe este. El más ignorado hasta que duele.",
    semilunar:  "Con forma de media luna. El más propenso a luxarse. La muñeca tiene su propio ciclo lunar.",
    piramidal:  "El tercero en la fila proximal. Forma triangular. La anatomía describe lo que ve.",
    pisiforme:  "El más pequeño del carpo — del latín pisum, guisante. La anatomía nombra lo que ve.",
    trapecio:   "No confundir con el músculo de la espalda. El que articula con el pulgar — sin él, no hay pinza.",
    trapezoide: "El más difícil de fracturar del carpo. Tan bien protegido que los cirujanos casi nunca lo ven suelto.",
    grande:     "El mayor del carpo — de ahí el nombre. Centro geométrico de la muñeca.",
    ganchoso:   "Tiene un proceso en forma de gancho. Articula con el meñique y el anular. El ancla del carpo."
  },
  synonyms: {
    escafoides: ["escaphoid","navicular","escafoide"],
    semilunar:  ["lunate","lunar"],
    piramidal:  ["triquetrum","triangular","trique"],
    pisiforme:  ["pisiform"],
    trapecio:   ["trapezium","greater multangular"],
    trapezoide: ["trapezoid","lesser multangular","trapezoide"],
    grande:     ["capitate","capitado","hueso grande"],
    ganchoso:   ["hamate","hamato","unciforme"]
  }
});

const CARPALS_EN = crearBiblioteca({
  id: "carpals_en", level: "normal", lang: "en", field: "ciencias_duras",
  name: "Carpal bones", desc: "The 8 small bones of the wrist, in two rows. Name them all.",
  total: 8, metmin: 5, dificultad: 4, lejania: 4,
  facts: {
    scaphoid:   "The most commonly fractured carpal bone. Fall badly on your hand and this breaks. The most ignored until it hurts.",
    lunate:     "Moon-shaped. The most prone to dislocation. The wrist has its own lunar cycle.",
    triquetrum: "Third in the proximal row. Triangular shape. Anatomy describes what it sees.",
    pisiform:   "The smallest carpal — from Latin pisum, pea. Anatomy names what it sees.",
    trapezium:  "Not the muscle. The bone that articulates with the thumb — without it, no pinch grip.",
    trapezoid:  "The hardest carpal to fracture. So well protected that surgeons almost never see it loose.",
    capitate:   "The largest carpal — hence the name (caput, head). Geometric centre of the wrist.",
    hamate:     "Has a hook-shaped process — hence the name. Articulates with the ring and little fingers. The anchor of the carpus."
  },
  synonyms: {
    scaphoid:   ["escafoides","navicular","escafoide"],
    lunate:     ["semilunar","lunar"],
    triquetrum: ["piramidal","triangular","triquetral"],
    pisiform:   ["pisiforme"],
    trapezium:  ["trapecio","greater multangular"],
    trapezoid:  ["trapezoide","lesser multangular"],
    capitate:   ["grande","capitado"],
    hamate:     ["ganchoso","hamato","unciform"]
  }
});

// ============ PLANETAS ENANOS ============
const PLANETAS_ENANOS_ES = crearBiblioteca({
  id: "planetas_enanos_es", level: "normal", lang: "es", field: "ciencias_duras",
  name: "Planetas enanos reconocidos por la IAU", desc: "La IAU reconoce 5 planetas enanos oficiales. Nombrá todos.",
  total: 5, metmin: 4, dificultad: 3, lejania: 4,
  facts: {
    pluton:   "Plutón: El más famoso degradado de la historia de la astronomía. La IAU (2006) lo convirtió en planeta enano y acabó con décadas de mnemotecnias. Ni él ni nosotros hemos logrado reponernos.",
    eris:     "La diosa de la discordia le da el nombre — y lo merece. Su descubrimiento en 2005 obligó a la IAU a redefinir planeta. Más grande que Plutón en más de un sentido.",
    haumea:   "Una fértil diosa hawaiana da nombre a un huevo rotante que da una vuelta completa en 4 horas. Tiene dos lunas y un anillo. La más extraña de los cinco.",
    makemake: "El dios creador del panteón de la Isla de Pascua le da su nombre. Sin atmósfera, sin lunas, sin dejarnos saber mucho. No molestar.",
    ceres:    "Único planeta enano del cinturón de asteroides. Fue planeta desde 1801 hasta 1850 — luego rebajado por abundancia de vecinos análogos. El Plutón OG."
  },
  synonyms: {
    pluton:   ["pluto","plutón"],
    haumea:   ["hauméa"],
    makemake: ["make make"]
  }
});

const DWARF_PLANETS_EN = crearBiblioteca({
  id: "dwarf_planets_en", level: "normal", lang: "en", field: "ciencias_duras",
  name: "IAU-recognised dwarf planets", desc: "The IAU officially recognises 5 dwarf planets. Name them all.",
  total: 5, metmin: 4, dificultad: 3, lejania: 4,
  facts: {
    pluto:    "The most famous demotion in the history of astronomy. The IAU (2006) reclassified it and ended decades of mnemonics. Neither it nor we have quite recovered.",
    eris:     "Named for the goddess of discord — deservedly. Its discovery in 2005 forced the IAU to redefine planet. Larger than Pluto in more than one sense.",
    haumea:   "A fertile Hawaiian goddess names a tumbling egg that completes one rotation every 4 hours. Two moons, a ring, and the strangest shape of the five.",
    makemake: "Named after the creator god of Rapa Nui mythology. No atmosphere, no moons, not telling us much. Do not disturb.",
    ceres:    "The only dwarf planet in the asteroid belt. It was a planet from 1801 to 1850 — demoted when too many similar neighbours showed up. The original Pluto."
  },
  synonyms: {
    pluto:    ["pluton","plutón"],
    haumea:   ["hauméa"],
    makemake: ["make make"]
  }
});


// ============ FILÓSOFOS PRESOCRÁTICOS ============
const PRESOCRATICOS_ES = crearBiblioteca({
  id: "presocraticos_es", level: "normal", lang: "es", field: "humanidades",
  name: "Filósofos presocráticos", desc: "Antes de Sócrates, los griegos indagaron los principios primeros de la realidad (ἀρχαί). Nombra a sus grandes pensadores.",
  total: 8, metmin: 5, dificultad: 4, lejania: 4,
  facts: {
    tales:         "El primero. Predijo un eclipse solar en 585 a.C. y dijo que todo era agua. Dos de tres no está mal para empezar la filosofía.",
    anaximandro:   "Discípulo de Tales. Todo viene del apeiron — lo indefinido, lo ilimitado. El primer concepto abstracto de la historia.",
    anaximenes:    "Anaxímenes: Discípulo de Anaximandro. El principio es el aire — que al condensarse da agua, tierra, piedra; al rarificarse, fuego. La primera teoría de estados de la materia.",
    heraclito:     "Heráclito: No completas dos veces una misma biblioteca mientras te bañas en el Aqueloo. ¿Qué? Todo fluye. El logos: la razón universal. Su oscuridad no es bug, es feature.",
    parmenides:    "Parménides: El ser es, el no-ser no es y el cambio es ilusión. Si esto te enseñó algo es que no entendiste nada: ya lo sabías desde antes. 2500 años de discusión y contando.",
    empedocles:    "Empédocles: Los cuatro elementos más el amor y el odio como fuerzas. Se lanzó al Etna para demostrar que era inmortal. No lo era.",
    pitagoras:     "Pitágoras: Todo es número y la música es matemática. Su teorema parece no serlo. Ante todo: ¡No frijoles/habas/judías!",
    democrito:     "Demócrito: Entre risas y átomos se convirtió en el patrono de la física (sin adjetivos de época). El átomo como base de todo. Llegó a los 90 y su legado hasta nosotros."
  },
  synonyms: {
    tales:       ["tales de mileto","thales","thales of miletus"],
    anaximandro: ["anaximander"],
    anaximenes:  ["anaxímenes","anaximenes de mileto","anaximenes of miletus"],
    heraclito:   ["heráclito","heraclitus","heraclito de efeso"],
    parmenides:  ["parménides","parmenides de elea"],
    empedocles:  ["empédocles","empedocles de agrigento"],
    pitagoras:   ["pitágoras","pythagoras","pitagoras de samos"],
    democrito:   ["demócrito","democritus","democrito de abdera"]
  },
  extraClips: [
    { _id: "zenon",      name: "Zenón",      flavor: "Zenón: Aquiles nunca alcanza a la tortuga. La flecha en vuelo está inmóvil. El movimiento es imposible. Demostrado. (Parménides lo agradece.)" },
    { _id: "anaxagoras", name: "Anaxágoras", flavor: "Anaxágoras: El nous — mente cósmica — como principio ordenador. Dijo que el sol era una roca incandescente, no un dios. Le costó el exilio de Atenas." },
    { _id: "leucipo",    name: "Leucipo",    flavor: "Leucipo: Junto a Demócrito en todas las listas. ¿Cuánto es suyo y cuánto de su discípulo? La historia prefirió al elegido del pueblo sobre el del caballo blanco." }
  ]
});

const PRESOCRATICS_EN = crearBiblioteca({
  id: "presocratics_en", level: "normal", lang: "en", field: "humanidades",
  name: "Presocratic philosophers", desc: "Before Socrates, the Greeks investigated the first principles of reality (ἀρχαί). Name their great thinkers.",
  total: 8, metmin: 5, dificultad: 4, lejania: 4,
  facts: {
    thales:        "The first. Predicted a solar eclipse in 585 BC and said everything was water. Two out of three isn't bad for starting philosophy.",
    anaximander:   "Thales's student. Everything comes from the apeiron — the indefinite, the unlimited. The first abstract concept in history.",
    anaximenes:    "Anaximander's student. The principle is air — condensed: water, earth, stone; rarefied: fire. The first theory of states of matter.",
    heraclitus:    "You cannot complete the same library twice while bathing in the Achelous. Everything flows. The logos: universal reason. His obscurity is not a bug, it's a feature.",
    parmenides:    "Being is, non-being is not, and change is illusion. If this taught you something, you understood nothing — you already knew it. 2,500 years of debate and counting.",
    empedocles:    "Four elements plus love and strife as forces. Jumped into Etna to prove he was immortal. He was not.",
    pythagoras:    "Everything is number and music is mathematics. His theorem may not be his. Above all: no beans!",
    democritus:    "Between laughter and atoms he became the patron of physics (no era adjective needed). The atom as the basis of everything. He reached 90 and his legacy reached us."
  },
  synonyms: {
    thales:      ["tales","tales de mileto","thales of miletus"],
    anaximander: ["anaximandro"],
    anaximenes:  ["anaxímenes","anaximenes de mileto"],
    heraclitus:  ["heráclito","heraclito","heraclitus of ephesus"],
    parmenides:  ["parménides","parmenides of elea"],
    empedocles:  ["empédocles","empedocles of akragas"],
    pythagoras:  ["pitágoras","pitagoras","pythagoras of samos"],
    democritus:  ["demócrito","democrito","democritus of abdera"]
  },
  extraClips: [
    { _id: "zeno",        name: "Zeno",        flavor: "Zeno: Achilles never catches the tortoise. The arrow in flight is motionless. Motion is impossible. Proven. (Parmenides is grateful.)" },
    { _id: "anaxagoras2", name: "Anaxagoras",  flavor: "Anaxagoras: The nous — cosmic mind — as ordering principle. Said the sun was an incandescent rock, not a god. It cost him exile from Athens." },
    { _id: "leucippus",   name: "Leucippus",   flavor: "Leucippus: Together with Democritus in every list. How much is his and how much his student's? The history preferred the one the people chose over the one on a white horse." }
  ]
});

// ============ FASES DE LA LUNA ============
const FASES_LUNA_ES = crearBiblioteca({
  id: "fases_luna_es", level: "beginner", lang: "es", field: "ciencias_duras",
  name: "Fases de la luna", desc: "La luna tiene cuatro fases principales. Nómbralas.",
  total: 4, metmin: 4, dificultad: 1, lejania: 2,
  facts: {
    nueva:      "Luna nueva: Invisible desde la Tierra. El lado iluminado mira al sol, no a nosotros. La oscuridad más visible.",
    creciente:  "Luna creciente: Crece hacia la derecha en el hemisferio norte, hacia la izquierda en el sur. La luna no sabe dónde estás ni podría importarle.",
    llena:      "Luna llena: La única fase que tiene nombre propio según el mes — luna de cosecha, luna de sangre, superluna. La más narrativa y lunática.",
    menguante:  "Luna menguante: El espejo de la creciente. Lo que sube, baja. Menguar se usa poco, pero es prima de menú, minuto, minuta, minucioso, desmenuzar, minuendo..."
  },
  synonyms: {
    nueva:     ["luna nueva","new moon","novilunio"],
    creciente: ["luna creciente","cuarto creciente"],
    llena:     ["luna llena","plenilunio","full moon"],
    menguante: ["luna menguante","cuarto menguante"]
  }
});

const MOON_PHASES_EN = crearBiblioteca({
  id: "moon_phases_en", level: "beginner", lang: "en", field: "ciencias_duras",
  name: "Phases of the moon", desc: "The moon has four main phases. Name them.",
  total: 4, metmin: 4, dificultad: 1, lejania: 2,
  facts: {
    "new moon":       "New moon: Invisible from Earth. The illuminated side faces the sun, not us. The most visible darkness.",
    "crescent moon":  "Crescent moon: Grows to the right in the northern hemisphere, to the left in the south. The moon doesn't know where you are, nor could it care.",
    "full moon":      "Full moon: The only phase with its own names by month — harvest moon, blood moon, supermoon. The most narrative, the most lunatic.",
    "waning moon":    "Waning moon: The mirror of the crescent. What rises, falls. Four weeks, four acts."
  },
  synonyms: {
    "new moon":      ["nueva","novilunio","dark moon"],
    "crescent moon": ["waxing crescent","first quarter","creciente"],
    "full moon":     ["plenilunio","llena"],
    "waning moon":   ["waning crescent","last quarter","menguante"]
  }
});

// ============ TIPOS DE TRIÁNGULO ============
const TRIANGULOS_ES = crearBiblioteca({
  id: "triangulos_es", level: "beginner", lang: "es", field: "ciencias_duras",
  name: "Tipos de triángulo", desc: "Tres lados, tres ángulos, tres tipos. Nómbralos.",
  total: 3, metmin: 3, dificultad: 1, lejania: 3,
  facts: {
    equilatero: "Equilátero: Los tres lados iguales, los tres ángulos iguales — 60° cada uno. Símbolo de la Trinidad, del triángulo alquímico, del ojo que todo lo ve.",
    isosceles:  "Isósceles: Dos lados iguales. Del griego isos (igual) y skelos (pierna). Las caras de las pirámides de Giza son isósceles.",
    escaleno:   "Ningún lado igual, ningún ángulo igual. El más libre, el más olvidado. Del griego skalenos: cojo, irregular."
  },
  synonyms: {
    equilatero: ["equilátero","equilateral"],
    isosceles:  ["isósceles","isosceles"],
    escaleno:   ["scalene"]
  }
});

const TRIANGLES_EN = crearBiblioteca({
  id: "triangles_en", level: "beginner", lang: "en", field: "ciencias_duras",
  name: "Types of triangle", desc: "Three sides, three angles, three types. Name them.",
  total: 3, metmin: 3, dificultad: 1, lejania: 3,
  facts: {
    equilateral: "Three equal sides, three equal angles — 60 degrees each. Symbol of the Trinity, the alchemical triangle, the all-seeing eye.",
    isosceles:   "Two equal sides. From Greek isos (equal) and skelos (leg). The faces of the pyramids of Giza are isosceles.",
    scalene:     "No equal sides, no equal angles. The freest, the most forgotten. From Greek skalenos: uneven, limping."
  },
  synonyms: {
    equilateral: ["equilátero","equilatero"],
    isosceles:   ["isósceles"],
    scalene:     ["escaleno"]
  }
});

// ============ DIOSES OLÍMPICOS GRIEGOS / OLYMPIC GODS ============
// Total: 12 canónicos + Hestia y Dioniso como closeAnswers explicativos.
// Hades incluido como closeAnswer: no olímpico por residencia, sí por rango.

const DIOSES_OLIMPICOS_ES = crearBiblioteca({
  id: "dioses_olimpicos_es", level: "lineup", lang: "es", field: "humanidades",
  name: "Dioses olímpicos griegos", desc: "Nombra los doce dioses del Olimpo.",
  total: 12, metmin: 8, dificultad: 2, lejania: 2,
  facts: {
    zeus:      "El rayo, el trueno y la paternidad ubicua. Su deseo no discriminaba estatus divino, género o parentesco. Infiel y poderoso, de bebé se parecía a una piedra.",
    hera:      "Hermana y esposa de Zeus. Deidad del matrimonio, los pavos reales y los celos. Su affaire solitario le dio frutos cojos: Hefesto.",
    poseidon:  "Dios del mar, los terremotos y los caballos. Perdió Atenas contra Atenea por un voto democrático y un olivo. Venía salado.",
    demeter:   "Diosa de la cosecha y las estaciones. Literalmente la madre. En su CV, rubro inventos: el invierno, la huelga de hambre y las inmortalizaciones fallidas.",
    atenea:    "Lo suyo: la buena guerra, la sabiduría y las artes manuales. Su nacimiento le quitó la migraña a Zeus.",
    apolo:     "Todo lo más brillante: el sol, la música, la poesía y la profecía. El más griego entre los griegos: bello y racional. No sabía decir ni entender el no.",
    artemis:   "Diosa virginal de la caza y la luna. Gemela y opuesto de Apolo: arquera, soberbia y luminosa, pero salvaje, indomable y lunar. Sobre todo implacable.",
    ares:      "El horror de la guerra bruta. Detestado por todos, amado a veces por Afrodita. Ganaba batallas, perdía todo lo demás. Roma lo redimió como Marte.",
    afrodita:  "Diosa del amor y la belleza. Nació de la espuma del mar donde cayeron los genitales de Urano. Chipre era el F5 de su virginidad.",
    hefesto:   "El ígneo herrero del Olimpo. Horrendo y casado con Afrodita. Cojo, hábil y precoz. Con redes y tronos atrapó a su madre y su esposa.",
    hermes:    "Hurto postpartum, psicopompos, en Egipto trismegistos. El más hermético, por definición. El más encantador y embaucador.",
    dioniso:   "Dios del vino, el éxtasis y el teatro, nació dos veces. Llegó tarde pero con trago. Su culto: ménades, sátiros, bacanalias, canibalismo.",
  },
  synonyms: {
    zeus:     ["júpiter","jupiter"],
    hera:     ["juno"],
    poseidon: ["poseidón","neptuno","neptune"],
    demeter:  ["deméter","ceres"],
    atenea:   ["atena","minerva","palas","pallas"],
    apolo:    ["apolo","apollo","febo","phoebus"],
    artemis:  ["ártemis","diana"],
    ares:     ["marte","mars"],
    afrodita: ["venus"],
    hefesto:  ["hefaistos","vulcano","vulcan"],
    hermes:   ["mercurio","mercury"],
    dioniso:  ["dionisio","baco","bacchus"],
  }
});

const OLYMPIC_GODS_EN = crearBiblioteca({
  id: "olympic_gods_en", level: "beginner", lang: "en", field: "humanidades",
  name: "Greek Olympic gods", desc: "Name the twelve gods of Olympus.",
  total: 12, metmin: 8, dificultad: 2, lejania: 2,
  facts: {
    zeus:       "Thunder, lightning, and ubiquitous fatherhood. His desire did not discriminate by divine status, gender, or kinship. Powerful and faithless — as a baby, he looked like a rock.",
    hera:       "Sister and wife of Zeus. Goddess of marriage, peacocks, and jealousy. Her only solo affair produced a lame son: Hephaestus.",
    poseidon:   "God of the sea, earthquakes, and horses. Lost Athens to Athena by democratic vote and an olive tree. He never quite got over it.",
    demeter:    "Goddess of the harvest and the seasons. Literally the mother. Her inventions: winter, the hunger strike, and several failed immortalizations.",
    athena:     "Her domain: strategic war, wisdom, and the crafts. Her birth cured Zeus's migraine. She saved Orestes. She condemned Arachne.",
    apollo:     "The brightest of all: sun, music, poetry, prophecy. The most Greek among the Greeks: beautiful and rational. He never learned to hear — or say — no.",
    artemis:    "Virgin goddess of the hunt and the moon. Apollo's twin and opposite: archer, proud, luminous — but wild, untameable, lunar. Above all, merciless.",
    ares:       "The horror of raw war. Despised by all, loved occasionally by Aphrodite. He won battles and lost everything else. Rome redeemed him as Mars.",
    aphrodite:  "Goddess of love and beauty. Born from sea foam where Uranus's severed parts fell. Cyprus was her virginity's refresh button.",
    hephaestus: "The fiery smith of Olympus. Ugly and married to Aphrodite. Lame, skilled, and precocious. He trapped his mother and his wife with nets and thrones.",
    hermes:     "Postpartum theft, psychopomp, Trismegistus in Egypt. The most hermetic, by definition. The most charming and the most cunning.",
    dionysus:   "God of wine, ecstasy, and theatre — born twice. He arrived late but with drinks. His cult: maenads, satyrs, bacchanals, cannibalism.",
  },
  synonyms: {
    zeus:       ["jupiter","júpiter"],
    hera:       ["juno"],
    poseidon:   ["neptune","neptuno"],
    demeter:    ["ceres"],
    athena:     ["athene","minerva","pallas"],
    apollo:     ["phoebus","apolo"],
    artemis:    ["diana"],
    ares:       ["mars","marte"],
    aphrodite:  ["venus","afrodita"],
    hephaestus: ["vulcan","hefesto","hephaestos"],
    hermes:     ["mercury","mercurio"],
    dionysus:   ["bacchus","dioniso","dionisus"],
  }
});

// ============ JUECES DEL INFRAMUNDO GRIEGO / JUDGES OF THE GREEK UNDERWORLD ============
// Tres jueces exactos, fuente: mitología clásica (Platón, Gorgias; Píndaro, Olímpicas).
// Elegidos por haber sido los legisladores más justos entre los mortales.

const JUECES_INFRAMUNDO_ES = crearBiblioteca({
  id: "jueces_inframundo_es", level: "normal", lang: "es", field: "humanidades",
  name: "Jueces del inframundo griego", desc: "Nombra los tres jueces de los muertos en la mitología griega.",
  total: 3, metmin: 3, dificultad: 3, lejania: 2,
  facts: {
    minos:      "Hijo de Zeus y Europa, rigió y legisló en Creta. El mino (putativo) en el minotauro. Como juez: palabra final y voto de desempate último. Dante le puso cola.",
    radamantis: "Hermano de Minos, mismo padre y madre. Amante de Apolo en vida. Juzgaba las almas de Oriente. El más sereno — ninguna fuente lo recuerda equivocándose.",
    eaco:       "Medio hermano: Zeus y Egina. Guardián de las llaves del inframundo, juez de Occidente. El más estricto. Abuelo de Aquiles — que terminó bajo su jurisdicción.",
  },
  synonyms: {
    minos:      ["mino"],
    radamantis: ["radamanto","rhadamanthus","rhadamantis"],
    eaco:       ["éaco","aeacus"],
  }
});

const JUDGES_UNDERWORLD_EN = crearBiblioteca({
  id: "judges_underworld_en", level: "normal", lang: "en", field: "humanidades",
  name: "Judges of the Greek underworld", desc: "Name the three judges of the dead in Greek mythology.",
  total: 3, metmin: 3, dificultad: 3, lejania: 2,
  facts: {
    minos:        "Son of Zeus and Europa, king and lawgiver of Crete. The 'mino' (putative) in Minotaur. As judge: final word and casting vote. Dante gave him a tail.",
    rhadamanthus: "Minos's brother — same father, same mother. Lover of Apollo in life. He judged the souls of the East. The most serene of the three — no source records him ever being wrong.",
    aeacus:       "Half-brother: Zeus and Aegina, not Europa. Guardian of the underworld's keys, judge of the West. The strictest. Grandfather of Achilles — who ended up under his jurisdiction.",
  },
  synonyms: {
    minos:        ["mino"],
    rhadamanthus: ["rhadamantis","radamantis","radamanthus","radamanto"],
    aeacus:       ["eaco","éaco"],
  }
});


const PALABRAS_ACENTO_ES = crearBiblioteca({
  id: "palabras_acento_es", level: "beginner", lang: "es", field: "humanidades",
  name: "Palabras según el acento", desc: "Nombra los cuatro tipos de palabras en español según en qué sílaba cae el acento.",
  total: 4, metmin: 4, dificultad: 2, lejania: 1,
  facts: {
    agudas:           "Acento en la última; tilde si termina en vocal, n o s. Así tildé bien. Pues 'bien' no la tildaré: ni ni, ni la, ni no... ¿ves?",
    graves:           "Acento en la penúltima; tilde si NO termina en vocal, n o s. Casi toda nuestra lengua comprende solo graves. ¿Notaste? Solo graves. Nunca fueron accidentes.",
    esdrujulas:       "Acento en la antepenúltima, siempre tildada. ¿Cúrcuma esdrújula? ¡Música mística!",
    sobreesdrujulas:  "Acento antes de la antepenúltima. Formas verbales con pronombres o adverbios compuestos. Explícamelo apócrifamente, Chomsky."
  },
  synonyms: {
    agudas:          ["oxítona", "oxítonas"],
    graves:          ["llanas", "llana", "paroxítona", "paroxítonas"],
    esdrujulas:      ["esdrújula", "proparoxítona", "proparoxítonas"],
    sobreesdrujulas: ["sobreesdrújula", "preproparoxítona", "preproparoxítonas"]
  }
});

// ============ LENGUAS ROMANCES MÁS HABLADAS / MOST SPOKEN ROMANCE LANGUAGES ============
// Criterio: hablantes nativos. Fuente: Ethnologue/SIL. 7 lenguas cerradas.

const ROMANCES_ES = crearBiblioteca({
  id: "romances_es", level: "beginner", lang: "es", field: "humanidades",
  name: "Lenguas romances más habladas", desc: "Nombra las siete lenguas romances más habladas por número de hablantes nativos.",
  total: 7, metmin: 5, dificultad: 2, lejania: 2,
  facts: {
    español:   "La lengua de Cervantes, García Márquez y el reggaetón. ~485M hablantes nativos en 20 países — en solo uno thethean.",
    portugués: "Nació como galaicoportugués y tuvo dos hijos: Brasil y Portugal. Sus ~240M hablantes nativos a veces dudan de ser mellizos.",
    francés:   "La lengua de la diplomacia hasta que dejó de serlo. ~80M nativos, legión de nostálgicos.",
    italiano:  "El latín que se quedó en casa pero no por eso dejó de mutar. El toscano de Dante se oficializó con Garibaldi. Tarde, pero bien.",
    rumano:    "Romance inesperado al este del Danubio. Sobrevivió eslavo, otomano y comunismo. Langue de da: sigue siendo latín, pero sí es da.",
    catalán:   "La literatura y la l·l lo separan orgullosamente de sus vecinos. ~10M entre el Mediterráneo y los Pirineos. No le digas dialecto: nunca ni en ningún lugar.",
    gallego:   "Hermana del portugués, prima del español. ~2.4M hablantes en el noroeste ibérico. La L suave que une el pulpo a la gallega y a Rosalía de Castro.",
  },
  synonyms: {
    español:   ["castellano","spanish"],
    portugués: ["portuguese"],
    francés:   ["french","français"],
    italiano:  ["italian"],
    rumano:    ["rumanian","romanian","moldavo","moldovan"],
    catalán:   ["catalan","valenciano"],
    gallego:   ["galego","galician"],
  }
});

const ROMANCE_LANGUAGES_EN = crearBiblioteca({
  id: "romance_languages_en", level: "beginner", lang: "en", field: "humanidades",
  name: "Most spoken Romance languages", desc: "Name the seven most spoken Romance languages by native speakers.",
  total: 7, metmin: 5, dificultad: 2, lejania: 1,
  facts: {
    spanish:    "The language of Cervantes, García Márquez, and reggaetón. ~485M native speakers in 20 countries — only one of them lisps.",
    portuguese: "Born as Galician-Portuguese and had two children: Brazil and Portugal. Its ~240M native speakers sometimes wonder if they're really twins.",
    french:     "The language of diplomacy — until it wasn't. ~80M native speakers and a legion of nostalgics.",
    italian:    "The Latin that stayed home but kept mutating anyway. Dante fixed the Tuscan dialect in the 13th century. Garibaldi made it official. Better late.",
    romanian:   "An unexpected Romance language east of the Danube. It survived Slavic, Ottoman, and Communist — and is still Latin. But da means yes.",
    catalan:    "Its literature and its l·l set it proudly apart from its neighbors. ~10M speakers between the Mediterranean and the Pyrenees. Never call it a dialect.",
    galician:   "Sister of Portuguese, cousin of Spanish. ~2.4M speakers in northwest Iberia. The soft L that unites the octopus dish and Rosalía de Castro.",
  },
  synonyms: {
    spanish:    ["castellano","español"],
    portuguese: ["portugués"],
    french:     ["français","francés"],
    italian:    ["italiano"],
    romanian:   ["rumano","moldovan","moldavo"],
    catalan:    ["català","valencian","valenciano"],
    galician:   ["galego","gallego"],
  }
});

// ============ LENGUAS GERMÁNICAS MÁS HABLADAS / MOST SPOKEN GERMANIC LANGUAGES ============
// Criterio: hablantes nativos. 7 lenguas cerradas.

const GERMANICAS_ES = crearBiblioteca({
  id: "germanicas_es", level: "beginner", lang: "es", field: "humanidades",
  name: "Lenguas germánicas más habladas", desc: "Nombra las siete lenguas germánicas más habladas por número de hablantes nativos.",
  total: 7, metmin: 5, dificultad: 2, lejania: 2,
  facts: {
    inglés:    "Germánico de cuna con más del 50% de vocabulario romance. ~380M hablantes nativos, ~1.5B totales. La gramática manda menos que la inercia histórica.",
    alemán:    "Goethe, Kant, Wagner. Alemania, Austria, parte de Suiza y una diáspora enorme. Curiosamenteaglutinante podría ser una sola palabra en él. ~100M nativos.",
    holandés:  "Entre el alemán y el inglés, geográfica y lingüísticamente. Su G gutural suena amenazante pero es inofensiva. A veces se hace llamar flamenco. ~23M hablantes.",
    sueco:     "La más hablada de las escandinavas. IKEA la internacionalizó sin querer y no de la mejor manera. [insertar broma de nombre de producto]. ~10M nativos.",
    afrikáans: "Hija del holandés, nacida en el Cabo de Buena Esperanza. ~7M hablantes nativos. Nos dieron safari y apartheid. No los retemos.",
    danés:     "La que suena como sueco con la boca llena. Lo dicen los suecos. Los daneses lo negarían, pero con demasiadas vocales. ~6M hablantes.",
    noruego:   "Tiene dos formas escritas oficiales: bokmål y nynorsk. Los pacíficos noruegos tienen gracias a esto algo sobre qué pelear. ~5M hablantes.",
  },
  synonyms: {
    inglés:    ["english"],
    alemán:    ["german","deutsch"],
    holandés:  ["dutch","neerlandés","flamenco","flemish"],
    sueco:     ["swedish","svenska"],
    afrikáans: ["afrikaans"],
    danés:     ["danish","dansk"],
    noruego:   ["norwegian","norsk","bokmål","nynorsk"],
  }
});

const GERMANIC_LANGUAGES_EN = crearBiblioteca({
  id: "germanic_languages_en", level: "beginner", lang: "en", field: "humanidades",
  name: "Most spoken Germanic languages", desc: "Name the seven most spoken Germanic languages by native speakers.",
  total: 7, metmin: 5, dificultad: 2, lejania: 2,
  facts: {
    english:   "Germanic by birth, with over 50% Romance vocabulary. ~380M native speakers, ~1.5B total. Grammar matters less than historical momentum.",
    german:    "Goethe, Kant, Wagner. Germany, Austria, part of Switzerland, and a vast diaspora. Curiosouslyadglutinative could be a single word in it. ~100M natives.",
    dutch:     "Between German and English, geographically and linguistically. Its guttural G sounds threatening but isn't. Sometimes goes by Flemish. ~23M speakers.",
    swedish:   "The most spoken of the Scandinavian languages. IKEA internationalized it without meaning to, and not in the best way. [insert product name joke]. ~10M natives.",
    afrikaans: "Daughter of Dutch, born at the Cape of Good Hope. ~7M native speakers. They gave us safari and apartheid. Let's not provoke them.",
    danish:    "The one that sounds like Swedish with a mouth full of food. The Swedes say so. The Danes would deny it — with too many vowels. ~6M speakers.",
    norwegian: "It has two official written forms: bokmål and nynorsk. The peaceable Norwegians have this to argue about. ~5M speakers.",
  },
  synonyms: {
    english:   ["inglés"],
    german:    ["alemán","deutsch"],
    dutch:     ["holandés","neerlandés","flemish","flamenco"],
    swedish:   ["sueco","svenska"],
    afrikaans: ["afrikáans"],
    danish:    ["danés","dansk"],
    norwegian: ["noruego","norsk","bokmål","nynorsk"],
  }
});

// ============ RELIGIONES MÁS PRACTICADAS / MOST PRACTICED RELIGIONS ============
// Criterio: religiones organizadas con nombre propio, por número de practicantes.
// Se excluyen categorías paraguas (animismo, religiones tradicionales).

const RELIGIONES_ES = crearBiblioteca({
  id: "religiones_es", level: "beginner", lang: "es", field: "humanidades",
  name: "Religiones más practicadas del mundo", desc: "Nombra las siete religiones organizadas con más practicantes.",
  total: 7, metmin: 5, dificultad: 2, lejania: 1,
  facts: {
    cristianismo: "La más grande por número. ~2.4B practicantes entre católicos, protestantes y ortodoxos. De un pesebre en Palestina; conquistó Roma; dividió Europa.",
    islam:        "La más joven de este grupo y la de crecimiento más rápido. Antes y ahora. ~1.9B. La Hégira, el Corán, el profeta. Monoteísmo sin mediadores.",
    hinduismo:    "En edad, la hermana mayor del grupo. Y la más multitudinaria en deidades. ~1.2B. Sin fundador único, sin fecha de inicio. Un universo, no una iglesia.",
    budismo:      "Fundada por alguien que rechazó ser dios al contemplar el sufrimiento del hombre. ~500M. La única gran religión sin deidad obligatoria.",
    sijismo:      "~25M, pero con kirpán y gurúes. Fundado en el Punjab en el siglo XV. Monoteísmo igualitario: ni castas ni géneros sagrados. El templo más dorado.",
    judaísmo:     "~15M — Menos practicantes, más diásporas. Inauguró las religiones del libro. Su influencia es la más desproporcionada de la historia.",
    taoísmo:      "~12M declarados, pero coherente consigo misma nunca se cuentan bien. El Tao que puede ser nombrado no es el Tao eterno. Lao-Tsé dixit en un Yin-Yang.",
  },
  synonyms: {
    cristianismo: ["christian","christianity","cristiana"],
    islam:        ["islamismo","muslim","musulmán"],
    hinduismo:    ["hinduism","hindú"],
    budismo:      ["buddhism","buddhist","budista"],
    sijismo:      ["sikhism","sikh"],
    judaísmo:     ["judaism","judío","jewish"],
    taoísmo:      ["taoism","taoist","daoísmo","daoism"],
  }
});

const RELIGIONS_EN = crearBiblioteca({
  id: "religions_en", level: "beginner", lang: "en", field: "humanidades",
  name: "Most practiced religions in the world", desc: "Name the seven organized religions with the most practitioners.",
  total: 7, metmin: 5, dificultad: 2, lejania: 1,
  facts: {
    christianity: "The largest by number. ~2.4B practitioners among Catholics, Protestants, and Orthodox. From a manger in Palestine; it conquered Rome and divided Europe.",
    islam:        "The youngest in this group and the fastest growing — then and now. ~1.9B. The Hijra, the Quran, the Prophet. Monotheism without intermediaries.",
    hinduism:     "The eldest of the group. And the most prolific in deities. ~1.2B. No single founder, no start date. A universe, not a church.",
    buddhism:     "Founded by someone who refused to be a god upon contemplating human suffering. ~500M. The only major religion without a mandatory deity.",
    sikhism:      "~25M, but with kirpan and gurus. Founded in the Punjab in the 15th century. Egalitarian monotheism: no castes, no sacred genders. The most golden temple.",
    judaism:      "~15M — fewest practitioners, most diasporas. It inaugurated the religions of the book. Its influence is the most disproportionate in history.",
    taoism:       "~12M declared, but true to itself, never counted well. The Tao that can be named is not the eternal Tao. Lao-Tzu dixit, in a Yin-Yang.",
  },
  synonyms: {
    christianity: ["christian","cristianismo","cristiano"],
    islam:        ["islamic","muslim","islamism","islamismo"],
    hinduism:     ["hindu","hinduismo"],
    buddhism:     ["buddhist","budismo"],
    sikhism:      ["sikh","sijismo"],
    judaism:      ["jewish","judaísmo","judío"],
    taoism:       ["taoist","taoísmo","daoism","daoísmo"],
  }
});


// === Bibs movidas antes de PAPERBACK_ES (forward reference fix) ===
const PENTATEUCO_ES = crearBiblioteca({
  id: "pentateuco_es", level: "beginner", lang: "es", field: "humanidades",
  name: "El Pentateuco", desc: "Nombra los 5 libros de la Torá (o del Antiguo Testamento, si prefieres).",
  total: 5, metmin: 3, dificultad: 1, lejania: 2,
  facts: {
    genesis: "Bereshit: 'En el principio' de todo. Creación, caída, Caín, diluvio, Babel, Abraham. El big bang bíblico — costillas y culpas femeninas.",
    exodo: "Shemot: 'Nombres'. Al fondo, pirámides y desierto: Esclavitud, plagas, y bastones mágicos. Moisés, el mar partido en dos y la ley, en diez mandamientos.",
    levitico: "Vayikra: 'Y llamó'. Leyes, ritos, sacrificios, pureza. La ley es aburrida de leer, pero sigue gobernándonos.",
    numeros: "Bamidbar: 'En el desierto'. 40 años vagando en él o leer un libro lleno de censos y quejas. La tierra prometida pero no a Moisés.",
    deuteronomio: "Devarim: 'Palabras'. La 'segunda ley' en griego. El final de Moisés: resumen, sermón, despedida. Muere viendo la tierra prometida desde el monte Nebó."
  }
});


const ISLAS_CARIBE_ES = crearBiblioteca({
  id: "islas_caribe_es", level: "beginner", lang: "es", field: "humanidades",
  name: "Las 5 mayores islas del Caribe", desc: "Nombra las 5 islas más grandes del mar Caribe por extensión.",
  total: 5, metmin: 3, dificultad: 1, lejania: 2,
  facts: {
    cuba: "De sobra la más grande del Caribe: 109k de km2. Revolución, habanos y mojitos. Celia y la sonora: ¡azúcar!",
    "la espanola": "Virreina caribeña partida en dos: Haití francófono y República Dominicana merenguera. Hasta los satélites notan la frontera. No digas perejil.",
    jamaica: "Tercera mayor. Reggae, jerk chicken, Usain Bolt. Potencia cultural y retrógrada: la más homofóbica de occidente.",
    "puerto rico": "Cuarta mayor. Ni estado ni país: territorio de USA desde 1898. Reguetonera, beisbolera, resiliente. Borinquen vota pero ni cuenta.",
    trinidad: "Quinta mayor, pegada a Venezuela. Calypso, soca y por si algo, Tobago. Petróleo y asfalto: el Pitch Lake es el mayor depósito natural de asfalto del mundo."
  },
  synonyms: {
    "la espanola": ["hispaniola", "la española"]
  }
});


const NAVES_COLON_ES = crearBiblioteca({
  id: "naves_colon_es", level: "beginner", lang: "es", field: "humanidades",
  name: "Naves de Colón", desc: "Nombra las 3 naves con las que Colón llegó a América en 1492.",
  total: 3, metmin: 2, dificultad: 1, lejania: 1,
  facts: {
    pinta: 'La Pinta: Pintada de colores vistosos — "la pintá". La más rápida y la primera en avistar tierra cuando Rodrigo de Triana —no Colón— gritó "¡Tierra!"',
    nina: 'La Niña se llamaba Santa Clara. "Niña" era apodo derivado del apellido de su dueño, Juan Niño — apodos que derrotan santas.',
    santa_maria: 'La nao capitana — ni siquiera era carabela. Los marineros la llamaban "La Gallega"; recordada por su nombre de bautizo y su naufragio junto a la Hispaniola.'
  },
  synonyms: {
    nina: ["santa clara"],
    santa_maria: ["la gallega"]
  }
});


const TRIMURTI_ES = crearBiblioteca({
  id: "trimurti_es", level: "beginner", lang: "es", field: "humanidades",
  name: "Tríada hindú", desc: "Nombra los 3 dioses principales del hinduismo (la Trimurti).",
  total: 3, metmin: 2, dificultad: 1, lejania: 2,
  facts: {
    brahma: "El creador, hoy casi sin templos — dicen — por una maldición mítica. Pushkar tiene el único importante.",
    vishnu: "Preservador, restaurador, recreador: diez avatares — Rama, Krishna y otros. El azul del trío.",
    shiva: "Masculino, pese a lo que diga el lore de Final Fantasy. El principio de la transformación, a veces malentendido como destrucción."
  }
});


const EVANGELISTAS_ES = crearBiblioteca({
  id: "evangelistas_es", level: "beginner", lang: "es", field: "humanidades",
  name: "Los cuatro evangelistas", desc: "Nombra a los cuatro autores de los evangelios canónicos.",
  total: 4, metmin: 3, dificultad: 1, lejania: 1,
  facts: {
    mateo: "Símbolo: el ángel. Recaudador de impuestos antes de Cristo. Escribió para judíos: su primer dato es confirmar la ascendencia de Jesús hasta Abraham.",
    marcos: "El más breve pero se cree que fue la base de Lucas y Mateo. Símbolo: el león alado y Venecia. No conoció a Jesús en persona.",
    lucas: "Médico, compañero de Pablo. Su símbolo es el buey. Tampoco conoció a Jesús — su prosa: científica y narrativa, como una historia clínica.",
    juan: "El águila: el más amado y joven. El raro del combo: su evangelio no se parece a los otros tres (los sinópticos)."
  }
});


const ISLAS_MEDITERRANEO_ES = crearBiblioteca({
  id: "islas_mediterraneo_es", level: "beginner", lang: "es", field: "humanidades",
  name: "Las 5 mayores islas del Mediterráneo", desc: "Nombra las 5 islas más grandes del mar Mediterráneo por extensión.",
  total: 5, metmin: 3, dificultad: 1, lejania: 2,
  facts: {
    sicilia: "La mayor de las cinco y la más invadida. Etna, mafia, cannoli. Magna Grecia, árabes y normandos: siempre siciliana.",
    cerdena: "Cerdeña: La segunda mayor brilla con rareza. Sus nuragas (torres prehistóricas) son aislados culturales. Sus habitantes: los más longevos de Europa.",
    chipre: "La tercera mayor y hoy partida en tres (UE, turcos, ONU). Afrodita nació aquí, dicen, y su virginidad se renueva cada vez en sus playas.",
    corcega: "Córcega: francesa, pero con acento propio. Cuarta en tamaño. Cuna de Napoleón y sus guerras cambiamundos. Maquis: la resistencia pintoresca.",
    creta: "Cuna del minotauro: minoicos y laberintos. Cnosos y el lineal A: sin entender. Origen de Europa — amante de Zeus y nombre de civilización."
  },
  synonyms: {
    cerdena: ["cerdeña"],
    corcega: ["córcega"]
  }
});


const PAPERBACK_ES = [OCEANOS_ES, CONTINENTES_ES, SPICE_GIRLS_ES, ESTOMAGOS_ES, PECADOS_ES, HUESOS_OIDO_ES, MARAVILLAS_ES, LUNAS_GALILEANAS_ES, MACRONUTRIENTES_ES, MESES_30_ES, GASES_NOBLES_ES, ZODIACO_ES, SABORES_ES, FASES_LUNA_ES, TRIANGULOS_ES, PALABRAS_ACENTO_ES, ROMANCES_ES, GERMANICAS_ES, RELIGIONES_ES, PENTATEUCO_ES, ISLAS_CARIBE_ES, NAVES_COLON_ES, TRIMURTI_ES, EVANGELISTAS_ES, ISLAS_MEDITERRANEO_ES];
const PENTATEUCH_EN = crearBiblioteca({
  id: "pentateuch_en", level: "beginner", lang: "en", field: "humanidades",
  name: "The Pentateuch", desc: "Name the 5 books of the Torah (or the Old Testament, if you prefer).",
  total: 5, metmin: 3, dificultad: 1, lejania: 2,
  facts: {
    genesis: 'Bereshit: "In the beginning" of it all. Creation, fall, Cain, flood, Babel, Abraham. The biblical big bang — ribs and feminine blame.',
    exodus: 'Shemot: "Names." Pyramids and desert in the background: slavery, plagues, magic staffs. Moses, the sea split in two and the law, in ten commandments.',
    leviticus: 'Vayikra: "And He called." Laws, rites, sacrifice, purity. The law is boring to read, but it still governs us.',
    numbers: 'Bamidbar: "In the wilderness." 40 years wandering in it — or reading a book full of censuses and complaints. The promised land, but not to Moses.',
    deuteronomy: "Devarim: \"Words.\" \"Second law\" in Greek. Moses' finale: summary, sermon, farewell. Dies overlooking the promised land from Mount Nebo."
  }
});

// ============ ISLAS DEL CARIBE / CARIBBEAN ISLANDS ============

const CARIBBEAN_ISLANDS_EN = crearBiblioteca({
  id: "caribbean_islands_en", level: "beginner", lang: "en", field: "humanidades",
  name: "5 Largest Caribbean Islands", desc: "Name the 5 largest islands in the Caribbean Sea by area.",
  total: 5, metmin: 3, dificultad: 1, lejania: 2,
  facts: {
    cuba: "By far the largest Caribbean island: 109k km². Revolution, cigars and mojitos. Celia and la Sonora: ¡azúcar!",
    hispaniola: "Second largest, split in two: francophone Haiti and merengue-loving Dominican Republic. Even satellites notice the border. Don't mispronounce perejil.",
    jamaica: "Third largest. Reggae, jerk chicken, Usain Bolt. Cultural powerhouse and retrograde: the most homophobic place in the West.",
    "puerto rico": "Fourth largest. Neither state nor country: US territory since 1898. Reggaetonera, beisbolera, resilient. Borinquen votes but it doesn't count.",
    trinidad: "Fifth largest, hugging Venezuela. Calypso, soca and oh right, Tobago. Oil and asphalt: the Pitch Lake is the world's largest natural asphalt deposit."
  },
  synonyms: {
    hispaniola: ["la española", "la espanola", "santo domingo"]
  }
});

// === incunabula.js ===
// data/incunabula.js
// Bibliotecas de Incunabula. Primera: Corrientes filosóficas, migrada del index.html viejo (v3),
// corrigiendo un bug real encontrado en la fuente original: "ilustracion" e "iluminismo" eran
// entradas duplicadas del mismo concepto (Voltaire/Rousseau/Kant, razón contra superstición).
// Fusionadas en una sola entrada bajo "ilustracion", con "iluminismo" como synonym.




const CARAVELS_EN = crearBiblioteca({
  id: "caravels_en", level: "beginner", lang: "en", field: "humanidades",
  name: "Columbus's Ships", desc: "Name the 3 ships that carried Columbus to America in 1492.",
  total: 3, metmin: 2, dificultad: 2, lejania: 4,
  facts: {
    pinta: 'The Pinta: named for being brightly painted — "la pintá." The fastest of the three, and first to sight land — Rodrigo de Triana, not Columbus, shouted "Land!"',
    nina: 'The Niña: Spanish for "the girl." Her real name was Santa Clara. "Niña" came from her owner\'s surname, Juan Niño — a nickname outranking a saint.',
    santa_maria: 'The flagship — and not actually a caravel at all, but a nao. Sailors called her "La Gallega"; she\'s remembered by her baptismal name, and by her wreck off Hispaniola.'
  },
  synonyms: {
    nina: ["santa clara"],
    santa_maria: ["la gallega"]
  }
});

// ============ TRÍADA HINDÚ / HINDU TRIAD ============

const HINDU_TRIAD_EN = crearBiblioteca({
  id: "hindu_triad_en", level: "beginner", lang: "en", field: "humanidades",
  name: "Hindu Triad", desc: "Name the 3 principal gods of Hinduism (the Trimurti).",
  total: 3, metmin: 2, dificultad: 1, lejania: 2,
  facts: {
    brahma: "The creator, yet only one major temple in India nowadays (Pushkar) — because of an alleged curse. No god is venerated in his own country.",
    vishnu: "Preserver, restorer, recreator: ten avatars — Rama, Krishna, and others. The blue one of the trio.",
    shiva: "Male, despite what Final Fantasy lore might say. The principle of transformation, sometimes misunderstood as destruction."
  }
});

// ============ EVANGELISTAS / EVANGELISTS ============

const EVANGELISTS_EN = crearBiblioteca({
  id: "evangelists_en", level: "beginner", lang: "en", field: "humanidades",
  name: "The Four Evangelists", desc: "Name the four authors of the canonical Gospels.",
  total: 4, metmin: 3, dificultad: 1, lejania: 1,
  facts: {
    matthew: "The angel. Tax collector before Christ. Wrote for Jews: his first move is proving Jesus's lineage back to Abraham.",
    mark: "The shortest, but believed to be the source for Luke and Matthew. The winged lion and Venice. Never met Jesus.",
    luke: "Physician, Paul's companion. The ox. Never met Jesus either — his prose: scientific and narrative. Like a medical record.",
    john: "The eagle: the most beloved and youngest. The odd one out: his gospel doesn't resemble the other three (the Synoptics)."
  }
});

// ============ ISLAS DEL MEDITERRÁNEO / MEDITERRANEAN ISLANDS ============

const MEDITERRANEAN_ISLANDS_EN = crearBiblioteca({
  id: "mediterranean_islands_en", level: "beginner", lang: "en", field: "humanidades",
  name: "5 Largest Mediterranean Islands", desc: "Name the 5 largest islands in the Mediterranean Sea by area.",
  total: 5, metmin: 3, dificultad: 1, lejania: 2,
  facts: {
    sicily: "The largest and most invaded of the five. Etna, mafia, cannoli. Magna Graecia, Arabs and Normans: always Sicilian.",
    sardinia: "Sardinia: the second largest shines with oddity. Its nuragas (prehistoric towers) are cultural isolates. Its people: the longest-lived in Europe.",
    cyprus: "Third largest, split in 3 (EU, Turks, UN). Birthplace of Aphrodite, or so is said. Her virginity gets renewed on its beaches every time.",
    corsica: "Corsica: French, but with its own accent. Fourth in size. Birthplace of Napoleon and his world-changing wars. Maquis: the picturesque resistance.",
    crete: "Cradle of the minotaur: Minoans and labyrinths. Knossos and Linear A: still undeciphered. Origin of Europe — lover of Zeus and name of a civilisation."
  }
});

// ============ VANISHED STATES / ESTADOS DESAPARECIDOS ============
// Abierta por diseño (total: null) — universo genuinamente vasto, se juega por vicio,
// no por completar (definición de Milo, 28/06). Todas las fechas verificadas con fuente real.



const PAPERBACK_EN = [OCEANS_EN, CONTINENTS_EN, SPICE_GIRLS_EN, COWSTOMACHS_EN, SINS_EN, EAR_BONES_EN, WONDERS_EN, GALILEAN_MOONS_EN, MACRONUTRIENTS_EN, MONTHS_30_EN, NOBLE_GASES_EN, ZODIAC_EN, TASTES_EN, MOON_PHASES_EN, TRIANGLES_EN, OLYMPIC_GODS_EN, ROMANCE_LANGUAGES_EN, GERMANIC_LANGUAGES_EN, RELIGIONS_EN, PENTATEUCH_EN, CARIBBEAN_ISLANDS_EN, HINDU_TRIAD_EN, EVANGELISTS_EN, MEDITERRANEAN_ISLANDS_EN, CARAVELS_EN];

// === hardcover.js ===
// data/hardcover.js
// 3 bibliotecas de Hardcover, pobladas y verificadas 28/06.



// ============ HALÓGENOS ============
// Verificado: grupo 17 de la tabla periódica, 6 elementos confirmados (incluye Teneso,
// sintetizado 2010 — dato ya usado hoy temprano, mantengo verificación).

const HALOGENOS_ES = crearBiblioteca({
  id: "halogenos", level: "normal", lang: "es", field: "ciencias_duras",
  name: "Halógenos", desc: "Nombra los halógenos.",
  total: 6, dificultad: 3, lejania: 2,
  facts: {
    fluor: "El más reactivo de todos los elementos — corroe hasta el vidrio.",
    cloro: "Usado para desinfectar agua desde el siglo XIX.",
    bromo: "Líquido a temperatura ambiente, raro entre los no metales.",
    yodo: "Esencial para la tiroides — su nombre viene del griego 'violeta'.",
    astato: "Tan radiactivo y escaso que nunca se ha visto a simple vista.",
    teneso: "El más reciente, sintetizado por primera vez en 2010."
  }
});

const HALOGENS_EN = crearBiblioteca({
  id: "halogens", level: "normal", lang: "en", field: "ciencias_duras",
  name: "Halogens", desc: "Name the halogens.",
  total: 6, dificultad: 3, lejania: 2,
  facts: {
    fluorine: "The most reactive of all elements — it corrodes even glass.",
    chlorine: "Used to disinfect water since the 19th century.",
    bromine: "Liquid at room temperature, rare among nonmetals.",
    iodine: "Essential for the thyroid — its name comes from the Greek for 'violet'.",
    astatine: "So radioactive and scarce it has never been seen with the naked eye.",
    tennessine: "The most recent, first synthesized in 2010."
  }
});

// ============ LAS NUEVE MUSAS ============
// Verificado: 9 musas según Hesíodo (Teogonía), cada una con dominio específico bien documentado.

const MUSAS_ES = crearBiblioteca({
  id: "musas", level: "normal", lang: "es", field: "humanidades",
  name: "Las nueve Musas", desc: "Nombra a las nueve musas griegas.",
  total: 9, dificultad: 4, lejania: 4,
  facts: {
    caliope: "Musa de la poesía épica — la mayor de las nueve, según Hesíodo.",
    clio: "Musa de la historia — su nombre significa 'la que celebra'.",
    erato: "Musa de la poesía amorosa y la lírica erótica.",
    euterpe: "Musa de la música y la poesía lírica — su nombre significa 'la que deleita'.",
    melpomene: "Musa de la tragedia — originalmente asociada al canto, no al teatro.",
    polimnia: "Musa de la poesía sacra y los himnos — su nombre significa 'muchos himnos'.",
    terpsicore: "Musa de la danza — su nombre dio origen a 'terpsicorense'.",
    talia: "Musa de la comedia — también asociada a la agricultura en algunas fuentes.",
    urania: "Musa de la astronomía — su nombre significa 'la celestial'."
  },
  synonyms: {
    polimnia: ["polihimnia"] // la transliteración más fiel al griego supera el umbral de fuzzyMatch (distancia 2)
  }
});

const MUSES_EN = crearBiblioteca({
  id: "muses", level: "normal", lang: "en", field: "humanidades",
  name: "The Nine Muses", desc: "Name the nine Greek muses.",
  total: 9, dificultad: 4, lejania: 4,
  facts: {
    calliope: "Muse of epic poetry — the eldest of the nine, according to Hesiod.",
    clio: "Muse of history — her name means 'the one who celebrates'.",
    erato: "Muse of love poetry and erotic lyric.",
    euterpe: "Muse of music and lyric poetry — her name means 'the one who delights'.",
    melpomene: "Muse of tragedy — originally associated with singing, not theater.",
    polyhymnia: "Muse of sacred poetry and hymns — her name means 'many hymns'.",
    terpsichore: "Muse of dance — her name gave rise to 'terpsichorean'.",
    thalia: "Muse of comedy — also associated with agriculture in some sources.",
    urania: "Muse of astronomy — her name means 'the heavenly one'."
  }
});

// ============ PREFIJOS NUMÉRICOS GRIEGOS 1-10 ============
// Verificado: prefijos clásicos usados en español/inglés científico-culto
// (mono, di, tri... no confundir con los latinos uni, bi, tri).

const PREFIJOS_GRIEGOS_ES = crearBiblioteca({
  id: "prefijos_griegos", level: "normal", lang: "es", field: "humanidades",
  name: "Prefijos numéricos griegos (1-10)", desc: "Nombra los prefijos griegos del 1 al 10.",
  total: 10, dificultad: 3, lejania: 3,
  facts: {
    "mono": "Uno — de ahí 'monólogo', 'monoteísmo'.",
    "di": "Dos — de ahí 'dióxido', 'dilema' (literalmente 'dos premisas').",
    "tri": "Tres — de ahí 'triángulo', 'trilogía'.",
    "tetra": "Cuatro — de ahí 'tetraedro', 'tetralogía'.",
    "penta": "Cinco — de ahí 'pentágono', 'pentatlón'.",
    "hexa": "Seis — de ahí 'hexágono', 'hexámetro'.",
    "hepta": "Siete — de ahí 'heptágono', 'heptatlón'.",
    "octa": "Ocho — de ahí 'octágono', 'pulpo' viene de la misma raíz indirectamente.",
    "enea": "Nueve — el menos conocido de todos. Da nombre a las Enéadas de Plotino, donde 'nueve' también significaba 'el plural de plurales': el todo.",
    "deca": "Diez — de ahí 'década', 'decágono'."
  }
});

const GREEK_NUMERICAL_PREFIXES_EN = crearBiblioteca({
  id: "greek_prefixes", level: "normal", lang: "en", field: "humanidades",
  name: "Greek Numerical Prefixes (1-10)", desc: "Name the Greek prefixes from 1 to 10.",
  total: 10, dificultad: 3, lejania: 3,
  facts: {
    "mono": "One — as in 'monologue', 'monotheism'.",
    "di": "Two — as in 'dioxide', 'dilemma' (literally 'two premises').",
    "tri": "Three — as in 'triangle', 'trilogy'.",
    "tetra": "Four — as in 'tetrahedron', 'tetralogy'.",
    "penta": "Five — as in 'pentagon', 'pentathlon'.",
    "hexa": "Six — as in 'hexagon', 'hexameter'.",
    "hepta": "Seven — as in 'heptagon', 'heptathlon'.",
    "octa": "Eight — as in 'octagon'; 'octopus' shares the root indirectly.",
    "ennea": "Nine — the least known of all. It names Plotinus's Enneads, where 'nine' also meant 'the plural of plurals': the totality.",
    "deca": "Ten — as in 'decade', 'decagon'."
  }
});


// ============ 12 TRABAJOS DE HERACLES ============
const HERACLES_ES = crearBiblioteca({
  id: "heracles_es", level: "normal", lang: "es", field: "humanidades",
  name: "Los 12 trabajos de Heracles", desc: "Nombra cualquiera de los 12 trabajos de Heracles.",
  total: 12, metmin: 8, dificultad: 4, lejania: 3,
  facts: {
    "leon de nemea":              "León de Nemea: Su piel era impenetrable a las armas — Heracles lo estranguló y se puso su piel de capucha.",
    "hidra de lerna":             "Hidra de Lerna: Cortarle una cabeza hacía brotar dos. Heracles cauterizó cada muñón. Iolao sostuvo la antorcha.",
    "cierva de cerinea":          "Cierva de Cerínea: Cuernos de oro, pezuñas de bronce, consagrada a Artemisa. Capturarla viva, sin herirla, y cargarla hasta Euristeo — todo él solito.",
    "jabali de erimanto":         "Jabalí de Erimanto: Capturarlo vivo. Más fácil decirlo. De paso, Heracles liquidó a varios centauros que no tenían nada que ver.",
    "establos del rey augias":    "Establos de Augias: 3.000 bueyes acumulando 30 años de estiércol contra dos ríos desviados por el más grande héroe. Relucientes quedaron.",
    "pajaros del lago estinfalo": "Pájaros de Estínfalo: Pico, alas y garras de bronce, plumas como flechas. Los espantó con castañuelas de bronce y los mató a flechazos mientras huían.",
    "toro de creta":              "Toro de Creta: El mismo toro blanco que Poseidón envió a Minos — y que Minos no sacrificó. El origen de todo el problema cretense.",
    "yeguas de diomedes":         "Yeguas de Diomedes: Caníbales, alimentadas con carne humana. Heracles les dio a su dueño como aperitivo y luego las despachó.",
    "cinturon de hipolita":       "Cinturón de Hipólita: La reina de las Amazonas accedió a dárselo. Hera intervino, se armó la batalla. Simplicidad imposible.",
    "bueyes de gerion":           "Bueyes de Gerión: Gerión tenía tres cuerpos unidos por la cadera. Sus bueyes: rojos, perfectos, al otro extremo del mundo conocido.",
    "manzanas de las hesperides": "Manzanas de las Hespérides: Heracles convenció a Atlas de ir por ellas mientras él sostenía el cielo — y lo engañó para recuperar la carga. Atlas: burlado.",
    "cerbero":                    "Cerbero: El trabajo final — traer de vuelta al guardián tricéfalo del Inframundo. Una vida de perros."
  },
  synonyms: {
    "leon de nemea":              ["leon nemeo","el leon"],
    "hidra de lerna":             ["hidra","la hidra"],
    "cierva de cerinea":          ["cierva de cerineia","cierva dorada","la cierva"],
    "jabali de erimanto":         ["jabali erimanto","el jabali"],
    "establos del rey augias":    ["establos de augias","establos augias","cuadras de augias"],
    "pajaros del lago estinfalo": ["aves de estinfalo","pajaros estinfalo","aves estinfalides"],
    "toro de creta":              ["toro cretense","el toro"],
    "yeguas de diomedes":         ["caballos de diomedes","yeguas diomedes"],
    "cinturon de hipolita":       ["cinto de hipolita","cinturon hipolita"],
    "bueyes de gerion":           ["ganado de gerion","bueyes gerion"],
    "manzanas de las hesperides": ["manzanas hesperides","manzanas doradas"],
    "cerbero":                    ["can cerbero","cancerbero","cerebro"]
  }
});

const HERACLES_EN = crearBiblioteca({
  id: "heracles_en", level: "normal", lang: "en", field: "humanidades",
  name: "The 12 Labours of Heracles", desc: "Name any of the 12 Labours of Heracles.",
  total: 12, metmin: 8, dificultad: 4, lejania: 3,
  facts: {
    "nemean lion":              "Nemean Lion: Its skin was impervious to weapons — Heracles strangled it and wore its hide as a hood.",
    "lernean hydra":            "Lernaean Hydra: Cut off one head and two grew back. Heracles cauterised each stump. Iolaus held the torch.",
    "ceryneian hind":           "Ceryneian Hind: Golden antlers, bronze hooves, sacred to Artemis. Capture it alive, unhurt, and carry it to Eurystheus — all by himself.",
    "erymanthian boar":         "Erymanthian Boar: Capture it alive. Easier said. Along the way Heracles also wiped out several centaurs who had nothing to do with it.",
    "augean stables":           "Augean Stables: 3,000 cattle, 30 years of dung, cleaned in one day by rerouting two rivers. Gleaming.",
    "stymphalian birds":        "Stymphalian Birds: Bronze beaks, wings and claws, feathers like arrows. Startled with bronze castanets, shot down while fleeing.",
    "cretan bull":              "Cretan Bull: The same white bull Poseidon sent to Minos — which Minos refused to sacrifice. The origin of the entire Cretan problem.",
    "mares of diomedes":        "Mares of Diomedes: Man-eating, fed on human flesh. Heracles fed them their owner as an appetiser, then dispatched them.",
    "girdle of hippolyta":      "Girdle of Hippolyta: The Amazon queen agreed to give it. Hera intervened, battle ensued. Simplicity is impossible.",
    "cattle of geryon":         "Cattle of Geryon: Geryon had three bodies fused at the hip. His cattle: red, perfect, at the far edge of the known world.",
    "apples of the hesperides": "Apples of the Hesperides: Heracles convinced Atlas to fetch them while he held up the sky — then tricked him into taking it back. Atlas: outwitted.",
    "cerberus":                 "Cerberus: The final labour — retrieve the three-headed guardian of the Underworld. A dog's life."
  },
  synonyms: {
    "nemean lion":              ["lion of nemea","the nemean lion"],
    "lernean hydra":            ["lernaean hydra","hydra of lerna","the hydra"],
    "ceryneian hind":           ["cerynean hind","golden hind","hind of ceryneia"],
    "erymanthian boar":         ["boar of erymanthus","erymanthean boar"],
    "augean stables":           ["stables of augeas","augeas stables"],
    "stymphalian birds":        ["stymphalian bird","birds of stymphalia"],
    "cretan bull":              ["bull of crete","the cretan bull"],
    "mares of diomedes":        ["horses of diomedes","mares of diomed"],
    "girdle of hippolyta":      ["belt of hippolyta","girdle of hippolyte"],
    "cattle of geryon":         ["oxen of geryon","herd of geryon"],
    "apples of the hesperides": ["golden apples","apples of hesperides"],
    "cerberus":                 ["kerberos","the cerberus","three headed dog"]
  }
});


// ============ LOS 12 CÉSARES SEGÚN SUETONIO ============
const CESARES_ES = crearBiblioteca({
  id: "cesares_es", level: "normal", lang: "es", field: "humanidades",
  name: "Los 12 Césares según Suetonio", desc: "Ave César. Nombra los emperadores inmortalizados por Suetonio en 'Las vidas de los doce Césares'.",
  total: 12, metmin: 8, dificultad: 4, lejania: 3,
  facts: {
    "julio cesar":  "Julio César: El césar por antonomasia — más dictador que emperador. Dio nombre al título de todos los demás, y de paso a los káisers y los zares.",
    augusto:        "Octaviano fue el primer verdadero emperador. Convirtió la república en Imperio con una sutileza que lo mantuvo 44 años en el poder.",
    tiberio:        "Se retiró a Capri y gobernó a distancia. Roma nunca supo si eso era sabiduría o cobardía.",
    caligula:       "Hizo cónsul a su caballo. O eso dicen. Cuatro años de reinado, locura e infamia bajo un nombre que significa pequeña bota.",
    claudio:        "Subestimado toda su vida — incluyendo por los que lo nombraron emperador para controlarlo. Su espada y su pared: Mesalina y Agripina.",
    neron:          "Mató a su madre tras varios intentos fallidos. Quemó Roma al acorde de un laúd, dicen. Su fama puede ser exagerada — pero exonerarlo de todo sería difícil.",
    galba:          "El año de los cuatro emperadores. Sobrevivió 7 meses. La guardia pretoriana lo decapitó en el Foro.",
    oton:           "Tres meses de reinado. Se suicidó para evitar más guerra civil. Suetonio lo retrata con más dignidad que a la mayoría.",
    vitelio:        "Ocho meses. Su nombre viene de vitellus — ternera. Sus banquetes eran legendarios. Lo arrastró el pueblo por las calles al final.",
    vespasiano:     "Cobró por usar los urinarios públicos. El dinero no huele, dijo. Construyó el Coliseo.",
    tito:           "Destruyó Jerusalén. Construyó el arco que lleva su nombre. Murió a los 41 — Roma lloró como pocas veces.",
    domiciano:      "El último de los flavios. Exigió que lo llamaran Señor y Dios. Lo asesinaron en su dormitorio."
  },
  synonyms: {
    "julio cesar":  ["julius caesar","caesar","cesar","julio","caius julius caesar","gaio julio cesar"],
    augusto:        ["octaviano","octavio","octavian","augustus","octavianus","gaio octavio"],
    tiberio:        ["tiberius","tiberio julio cesar"],
    caligula:       ["calígula","gaius","gayo"],
    claudio:        ["claudius","tiberio claudio"],
    neron:          ["nero","nerón"],
    galba:          ["servio galba"],
    oton:           ["otho","othon","marco otón"],
    vitelio:        ["vitellius","aulo vitelio"],
    vespasiano:     ["vespasian","vespasianus","tito flavio vespasiano"],
    tito:           ["titus","tito flavio"],
    domiciano:      ["domitian","domitianus","tito flavio domiciano"]
  }
});

const CAESARS_EN = crearBiblioteca({
  id: "caesars_en", level: "normal", lang: "en", field: "humanidades",
  name: "The 12 Caesars according to Suetonius", desc: "Hail Caesar. Name the emperors immortalised by Suetonius in 'The Twelve Caesars'.",
  total: 12, metmin: 8, dificultad: 4, lejania: 3,
  facts: {
    "julius caesar": "Julius Caesar: The Caesar by antonomasia — more dictator than emperor. Gave his name to all the others, and to the kaisers and tsars.",
    augustus:        "Octavian was the first true emperor. Turned the republic into an Empire with such subtlety he stayed in power for 44 years.",
    tiberius:        "Retired to Capri and ruled from a distance. Rome never knew if that was wisdom or cowardice.",
    caligula:        "Made his horse a consul. So they say. Four years of madness and infamy under a name meaning little boot.",
    claudius:        "Underestimated all his life — including by those who made him emperor to control him. His sword and his wall: Messalina and Agrippina.",
    nero:            "Killed his mother after several failed attempts. Burned Rome to the tune of a lute, they say. His reputation may be exaggerated — but exonerating him entirely would be difficult.",
    galba:           "The year of the four emperors. Survived 7 months. The Praetorian Guard beheaded him in the Forum.",
    otho:            "Three months in power. Killed himself to prevent more civil war. Suetonius portrays him with more dignity than most.",
    vitellius:       "Eight months. His name comes from vitellus — calf. His banquets were legendary. The people dragged him through the streets at the end.",
    vespasian:       "Money has no smell, he said — after charging for using public urinals. Built the Colosseum.",
    titus:           "Destroyed Jerusalem. Built the arch that bears his name. Died at 41 — Rome mourned as rarely before.",
    domitian:        "The last Flavian. Demanded to be called Lord and God. Assassinated in his bedroom."
  },
  synonyms: {
    "julius caesar": ["caesar","julio cesar","gaius julius caesar","caius julius caesar"],
    augustus:        ["octavian","octavio","augusto","octavianus"],
    tiberius:        ["tiberio"],
    caligula:        ["caligula","gaius"],
    claudius:        ["claudio"],
    nero:            ["nerón","neron"],
    otho:            ["oton","othon"],
    vitellius:       ["vitelio","aulus vitellius"],
    vespasian:       ["vespasiano","vespasianus"],
    titus:           ["tito"],
    domitian:        ["domiciano","domitianus"]
  }
});

// ============ MESES CON 31 DÍAS ============
const MESES_31_ES = crearBiblioteca({
  id: "meses_31_es", level: "lineup", lang: "es", field: "humanidades",
  name: "Meses con 31 días", desc: "Desde las reformas julianas (46 a.C.), siete meses tienen 31 días. ¿Cuáles?",
  total: 7, metmin: 5, dificultad: 1, lejania: 2,
  facts: {
    enero:    "Jano, el dios de las puertas y los comienzos. Dos caras: una mira al año que termina, otra al que empieza.",
    marzo:    "Marte, dios de la guerra. Era el primer mes del calendario romano — antes de que enero y febrero existieran.",
    mayo:     "Maia, madre de Hermes. El mes más romano de los que suenan más griegos.",
    julio:    "Julio César: el primer mes que llevó nombre de persona real, no de dios. La vanidad como reforma del calendario.",
    agosto:   "Augusto no quería quedar con menos días que su tío César. Le robó uno a febrero. Por eso febrero tiene 28.",
    octubre:  "Octo, ocho. Era el octavo — ahora es el décimo. Víctima de la misma reforma que desplazó a septiembre y noviembre.",
    diciembre:"Decem, diez. Era el décimo — ahora es el duodécimo. El único que aún termina el año, a pesar de todo."
  },
  synonyms: {}
});

const MONTHS_31_EN = crearBiblioteca({
  id: "months_31_en", level: "lineup", lang: "en", field: "humanidades",
  name: "Months with 31 days", desc: "Since the Julian reforms (46 BC), seven months have 31 days. Which ones?",
  total: 7, metmin: 5, dificultad: 1, lejania: 2,
  facts: {
    january:  "Janus, god of doors and beginnings. Two faces: one looks at the year ending, the other at the one beginning.",
    march:    "Mars, god of war. The first month of the original Roman calendar — before January and February existed.",
    may:      "Maia, mother of Hermes. The most Roman month that sounds most Greek.",
    july:     "Julius Caesar: the first month to bear the name of a real person, not a god. Vanity as calendar reform.",
    august:   "Augustus didn't want fewer days than his uncle Julius Caesar. He took one from February. That's why February has 28.",
    october:  "Octo, eight. It was the eighth — now the tenth. Victim of the same reform that displaced September and November.",
    december: "Decem, ten. It was the tenth — now the twelfth. The only one that still ends the year, despite everything."
  },
  synonyms: {}
});

// ============ DECATLÓN OLÍMPICO ============
const DECATLON_ES = crearBiblioteca({
  id: "decatlon_es", level: "normal", lang: "es", field: "ciencias_duras",
  name: "Pruebas del decatlón olímpico", desc: "Diez pruebas. Un rey de los atletas. Nombra las pruebas del decatlón olímpico.",
  total: 10, metmin: 7, dificultad: 3, lejania: 3,
  facts: {
    "100 metros":           "100 metros: La prueba más corta del decatlón. El decatleta más rápido del mundo es más lento que el velocista más lento del mundo.",
    "salto de longitud":    "Salto de longitud: La única prueba de campo del primer día que premia la explosividad pura. Pausa en el aire.",
    "lanzamiento de peso":  "Lanzamiento de peso: Una bola de metal de 7,26 kg. No se lanza — se empuja. La diferencia técnica importa.",
    "salto de altura":      "Salto de altura: Fosbury lo cambió todo en 1968 saltando de espaldas. Nadie volvió a saltar de frente.",
    "400 metros":           "400 metros: Cierra el primer día. Demasiado larga para esprintar, demasiado corta para descansar. Y sí, vaya y corra a revisar: la RAE reconoce esprint.",
    "110 metros vallas":    "110 metros vallas: Abre el segundo día. 1,067 metros y diez vallas donde la técnica importa más que la velocidad.",
    "lanzamiento de disco": "Lanzamiento de disco: El más griego de todos. Mirón lo esculpió en el siglo V a.C. El Discóbolo es este momento exacto.",
    "salto con pertiga":    "Salto con pértiga: La prueba más técnica. Una fibra de carbono, 5 metros de altura, y mucha fe.",
    "lanzamiento de jabalina": "Lanzamiento de jabalina: El más antiguo — habilidad de caza y guerra antes de ser deporte. El nombre viene del jabalí que se cazaba con ella.",
    "1500 metros":          "1500 metros: El cierre. El decatleta lleva 9 pruebas en el cuerpo. No importa ganar — importa terminar."
  },
  synonyms: {
    "salto de longitud":       ["salto largo","long jump"],
    "lanzamiento de peso":     ["lanzamiento de bala","peso","bala","shot put"],
    "salto de altura":         ["alto","high jump"],
    "110 metros vallas":       ["110 vallas","vallas","110m vallas","hurdles"],
    "lanzamiento de disco":    ["disco","discus"],
    "salto con pertiga":       ["pertiga","garrocha","salto con garrocha","pole vault"],
    "lanzamiento de jabalina": ["jabalina","javelin","javalina"],
    "salto de longitud":       ["longitud","largo"]
  }
});

const DECATHLON_EN = crearBiblioteca({
  id: "decathlon_en", level: "normal", lang: "en", field: "ciencias_duras",
  name: "Olympic decathlon events", desc: "Ten events. One king of athletes. Name the events of the Olympic decathlon.",
  total: 10, metmin: 7, dificultad: 3, lejania: 3,
  facts: {
    "100 metres":     "100 metres: The shortest event in the decathlon. The fastest decathlete in the world is slower than the slowest specialist sprinter.",
    "long jump":      "Long jump: The only field event on day one that rewards pure explosiveness. A pause in the air.",
    "shot put":       "Shot put: A 7.26 kg metal ball. It is not thrown — it is pushed. The technical difference matters.",
    "high jump":      "High jump: Fosbury changed everything in 1968 by jumping backwards. No one jumped forwards again.",
    "400 metres":     "400 metres: Closes day one. Too long to sprint, too short to rest.",
    "110 metres hurdles": "110 metres hurdles: Opens day two. Ten hurdles at 1.067 metres where technique matters more than speed.",
    "discus throw":   "Discus throw: The most Greek of all. Myron sculpted it in the fifth century BC. The Discobolus is this exact moment.",
    "pole vault":     "Pole vault: The most technical event. A carbon fibre pole, 5 metres of height, and a great deal of faith.",
    "javelin throw":  "Javelin throw: The oldest — a hunting and war skill before it was a sport.",
    "1500 metres":    "1500 metres: The finale. The decathlete carries nine events in their body. Winning doesn't matter — finishing does."
  },
  synonyms: {
    "100 metres":         ["100m","100 meters"],
    "long jump":          ["salto de longitud","salto largo"],
    "shot put":           ["peso","bala","lanzamiento de peso","lanzamiento de bala"],
    "high jump":          ["salto de altura","alto"],
    "400 metres":         ["400m","400 meters"],
    "110 metres hurdles": ["110 hurdles","110m hurdles","vallas","110 vallas"],
    "discus throw":       ["discus","disco","lanzamiento de disco"],
    "pole vault":         ["pertiga","garrocha","salto con pertiga","salto con garrocha"],
    "javelin throw":      ["javelin","jabalina","javalina","lanzamiento de jabalina"],
    "1500 metres":        ["1500m","1500 meters","mile"]
  }
});


// ============ NÚMEROS PRIMOS HASTA 100 ============
const PRIMOS_ES = crearBiblioteca({
  id: "primos_es", level: "normal", lang: "es", field: "ciencias_duras",
  name: "Números primos hasta 100", desc: "Hay 25 números primos menores que 100. Nombra todos los que puedas.",
  total: 25, metmin: 15, dificultad: 4, lejania: 4,
  facts: {
    "2":  "2: El único primo par. Todos los demás son impares — excepto este rebelde fundacional.",
    "3":  "3: Para ser tan pequeño, ¡carga con tanta historia! Trinidades, colores primarios, estados de la materia, Benelux, tiempos, medallas, cerditos, manzanas, chiflados...",
    "5":  "5: La estrella más popular tiene 5 puntas. Los equinodermos eligieron la simetría pentagonal hace 500 millones de años. Se decía que teníamos 5 sentidos. La mano habla sola.",
    "7":  "7: El número favorito de la humanidad según estudios de psicología. Los humanos no eligen el azar tan aleatoriamente.",
    "11": "11: El menor primo de dos dígitos. Palíndromo, primo, y la hora en que todo el mundo hace un deseo.",
    "13": "13: El más supersticioso de los primos. Los hoteles suelen saltarse el piso 13. El número sigue ahí, pero nos movió el piso.",
    "17": "17: El número que elegimos más frecuentemente cuando nos piden uno 'al azar' entre el 1 y el 20. ¿Nada es aleatorio?",
    "19": "19: Menos famoso, no menos importante: La Torre Oscura de S. King, los 19 ángeles del Corán, el Sol en el Tarot.",
    "23": "23: El número de pares de cromosomas humanos. La biología te define con dos dígitos. Así no quieras.",
    "29": "29: El de febrero engendra a los jóvenes más falsos del mundo occidental. Técnicamente cumplen cada cuatro años — pero el pasaporte dice lo que dice.",
    "31": "31: Baskin-Robbins y sus 31 sabores — uno por cada día del mes. El marketing, el primo sabroso de las matemáticas.",
    "37": "37: Si 'la suerte está echada', es en favor del 37: el más elegido si se pide un número al azar entre 1 y 100.",
    "41": "41: Número atómico del niobio. No llores por este dato tan trivial — el niobio está en tu teléfono.",
    "43": "43: Viene después de la respuesta a la cuestión de la vida, el universo y todo lo demás. Nos dijo un Babel Fish.",
    "47": "47: El primo favorito de los guionistas de Star Trek. Aparece en casi todos los episodios. Alguien lo puso ahí a propósito.",
    "53": "53: A.C. Muere Craso ante los Partos. D.C. Claudio adopta a Nerón. Nos reservamos el derecho al non sequitur.",
    "59": "59: El prefijo de Bolivia, Guyana, Ecuador, Paraguay, Surinam, Uruguay y Guayana Francesa. Un dígito, un subcontinente entero.",
    "61": "61: Highway 61 Revisited, Bob Dylan, 1965. El álbum que cambió la música popular. El primo que cambió de carril.",
    "67": "67: Año del Sgt. Pepper, del Verano del Amor y del Che. El primo más hippie.",
    "71": "71: Número atómico del lutecio — ¿París como inspiración para la última de las tierras raras? Sin duda raro, pero mejor que neoytterbio y cassiopeio.",
    "73": "73: El favorito de Sheldon Cooper. 'Es el 21° primo, su espejo 37 es el 12°, y 21 es 3×7.' No lo inventó — es verdad.",
    "79": "79: Número atómico del oro. Aurum. El primo más valioso de la tabla periódica.",
    "83": "83: Primo noveno de Sophie Germain. Digo, noveno primo de Sophie Germain. 2p+1.",
    "89": "89: El mayor de los primos de Fibonacci. Y si el matemático nos suena antiguo, ahora ¿su primo mayor?",
    "97": "97: El mayor primo menor que 100. El último guardián antes del centenar."
  },
  synonyms: {}
});

const PRIMES_EN = crearBiblioteca({
  id: "primes_en", level: "normal", lang: "en", field: "ciencias_duras",
  name: "Prime numbers up to 100", desc: "There are 25 prime numbers less than 100. Name as many as you can.",
  total: 25, metmin: 15, dificultad: 4, lejania: 4,
  facts: {
    "2":  "2: The only even prime. All others are odd — except this foundational rebel.",
    "3":  "3: Small but mighty: trinities, primary colours, states of matter, Benelux, medals, little pigs, apples, stooges...",
    "5":  "5: The most popular star has 5 points. Echinoderms chose pentagonal symmetry 500 million years ago. We were said to have 5 senses. The hand speaks for itself.",
    "7":  "7: Humanity's favourite number according to psychology studies. Humans don't choose randomness as randomly as they think.",
    "11": "11: The smallest two-digit prime. Palindrome, prime, and the time everyone makes a wish.",
    "13": "13: The most superstitious prime. Hotels skip the 13th floor. The number is still there — it just moved the floor.",
    "17": "17: The number people most often choose when asked for one 'at random' between 1 and 20. Nothing is random.",
    "19": "19: Less famous, no less important: The Dark Tower by S. King, 19 angels in the Quran, the Sun in Tarot.",
    "23": "23: The number of pairs of human chromosomes. Biology defines you in two digits. Whether you like it or not.",
    "29": "29: The February birthday makes the world's most technically honest liars. They do turn a year older every four years — just ask their passport.",
    "31": "31: Baskin-Robbins and its 31 flavours — one per day of the month. Marketing, the tastiest cousin of mathematics.",
    "37": "37: The most 'random' number — the one most people choose when asked for a number between 1 and 100. The die is cast.",
    "41": "41: Atomic number of niobium. Don't cry over this trivial fact — niobium is in your phone.",
    "43": "43: Comes right after the answer to life, the universe and everything. A Babel Fish told us.",
    "47": "47: The favourite prime of Star Trek writers. It appears in almost every episode. Someone put it there on purpose.",
    "53": "53: BC: Crassus dies at Carrhae. AD: Claudius adopts Nero. We reserve the right to non sequitur.",
    "59": "59: The dialling code prefix of Bolivia, Guyana, Ecuador, Paraguay, Suriname, Uruguay and French Guiana. One digit, an entire subcontinent.",
    "61": "61: Highway 61 Revisited, Bob Dylan, 1965. The album that changed popular music. The prime that changed lanes.",
    "67": "67: Year of Sgt. Pepper, the Summer of Love, and Che. The hippiest prime.",
    "71": "71: Atomic number of lutetium — Paris as inspiration for the last of the rare earths? Undeniably rare, but better than neo-ytterbium and cassiopium.",
    "73": "73: Sheldon Cooper's favourite. 'It's the 21st prime, its mirror 37 is the 12th, and 21 is 3×7.' He didn't make it up — it's true.",
    "79": "79: Atomic number of gold. Aurum. The most valuable prime on the periodic table.",
    "83": "83: Ninth in Sophie Germain's sequence. Gauss received it signed: Monsieur LeBlanc. He was pleasantly surprised to find it was from Mlle. Germain.",
    "89": "89: The largest Fibonacci prime. And if the mathematician sounds ancient — what about his prime cousin?",
    "97": "97: The largest prime below 100. The last guardian before the centenary."
  },
  synonyms: {}
});

// ============ PRIMEROS 12 NÚMEROS DE FIBONACCI / FIRST 12 FIBONACCI NUMBERS ============

const FIBONACCI_ES = crearBiblioteca({
  id: "fibonacci_es", level: "normal", lang: "es", field: "ciencias_duras",
  name: "Los primeros 12 números de Fibonacci", desc: "Nombra los primeros doce números de la sucesión de Fibonacci. La secuencia tiene un número que se repite — aquí aparece una sola vez.",
  total: 12, metmin: 8, dificultad: 3, lejania: 2,
  facts: {
    "0":   "Mayas, indios, persas y árabes lo conocieron antes que Europa. Mucho más que nada y sin embargo...",
    "1":   "El único que se repite. RSVP: ¿Mi +1 puede ser mi gemelo?",
    "2":   "Primero viene el uno que el dos, pero con el dos es que nos empezamos a mover. Y no paramos.",
    "3":   "1+2. Aparece en pétalos de flores, espirales de piñas, y colas de galaxias. El favorito de los principiantes de Aris.",
    "5":   "2+3. El número de pétalos más común en las flores silvestres. Vitruvio, estrellas, equinodermos. No es casualidad.",
    "8":   "3+5. Número de espirales en la mayoría de los girasoles. Fibonacci disfrazado de Van Gogh en el campo.",
    "13":  "5+8. Número de espirales en sentido contrario en el mismo girasol. La naturaleza es redundante y a la vez y de otro modo, no lo es.",
    "21":  "8+13. La proporción entre términos consecutivos se acerca cada vez más a φ (1,618...). Oro de 24 kilates.",
    "34":  "13+21. Nos aproximamos casi perfectamente a la más perfecta aproximación: φ. Oro casi puro.",
    "55":  "21+34. El primero simétrico. Subjetivo pero nada suena tan bien como fünfundfünfzig.",
    "89":  "34+55. El de la espiral de la concha del nautilo (el animal, no el submarino). ¿Qué? ¿por tanteo?",
    "144": "55+89. El único cuadrado perfecto en la sucesión después del primero. 12².",
  },
  synonyms: {
    "0": ["cero", "zero"],
    "1": ["uno", "one"],
  }
});

const FIBONACCI_EN = crearBiblioteca({
  id: "fibonacci_en", level: "normal", lang: "en", field: "ciencias_duras",
  name: "The first 12 Fibonacci numbers", desc: "Name the first twelve numbers in the Fibonacci sequence. One number repeats in the sequence — include it only once.",
  total: 12, metmin: 8, dificultad: 3, lejania: 2,
  facts: {
    "0":   "Mayans, Indians, Persians, and Arabs knew it before Europe. Much more than nothing, and yet...",
    "1":   "The only one that repeats. RSVP: can my plus-one be my twin?",
    "2":   "The one comes before the two, but the two is where things start moving. And don't stop.",
    "3":   "1+2. Appears in flower petals, pine cone spirals, and galaxy arms. The Aris beginner's favourite.",
    "5":   "2+3. The most common petal count in wildflowers. Vitruvius, stars, echinoderms. Not a coincidence.",
    "8":   "3+5. Number of spirals in most sunflowers. Fibonacci disguised as Van Gogh in the field.",
    "13":  "5+8. Number of counter-spirals in the same sunflower. Nature is redundant, and at the same time, in another way, it isn't.",
    "21":  "8+13. The ratio of consecutive terms gets ever closer to φ (1.618...). 24-carat gold.",
    "34":  "13+21. We're approaching almost perfectly the most perfect approximation: φ. Nearly pure gold.",
    "55":  "21+34. The first symmetric one. Subjective, but nothing sounds quite like fünfundfünfzig.",
    "89":  "34+55. The one in the nautilus shell spiral (the animal, not the submarine). What? By trial and error?",
    "144": "55+89. The only perfect square in the sequence after the first. 12².",
  },
  synonyms: {
    "0": ["zero", "cero"],
    "1": ["one", "uno"],
  }
});

// ============ PAÍSES CRUZADOS POR EL MERIDIANO DE GREENWICH / COUNTRIES CROSSED BY THE PRIME MERIDIAN ============

const GREENWICH_ES = crearBiblioteca({
  id: "greenwich_es", level: "normal", lang: "es", field: "geografia",
  name: "Países cruzados por el meridiano de Greenwich", desc: "Nombra los ocho países por los que pasa el meridiano de Greenwich (0°), de norte a sur.",
  total: 8, metmin: 5, dificultad: 3, lejania: 2,
  facts: {
    "reino unido":  "El que eligió con egoísmo por dónde iba el meridiano. Greenwich, Londres. El centro del poder vuelto centro geográfico.",
    "francia":      "Pasa por Normandía y las Landas. Los franceses aún no aceptan del todo que el meridiano cero no pase por París.",
    "españa":       "Entra por Castellón, pasa por Valencia y sale por Alicante. España en el meridiano — y aún así a una hora más que el Reino Unido. Explica muchas ojeras.",
    "argelia":      "El meridiano entra al continente africano por Argelia. El Sáhara dividido en dos por una línea invisible que no corta mucho.",
    "mali":         "El Sáhara continúa. Mali el país moderno es cruzado; el imperio homónimo, obsoleto, también.",
    "burkina faso": "El antiguo Alto Volta (¡que no es un baile!). Escasamente rozado por el meridiano, no así por el colonialismo.",
    "togo":         "¿Se puede uno escabullir de los ingleses? No.",
    "ghana":        "El último de norte a sur. El meridiano de Greenwich termina su recorrido africano en el Golfo de Guinea.",
  },
  synonyms: {
    "reino unido": ["uk", "gran bretaña", "gran bretania", "inglaterra", "united kingdom"],
    "burkina faso": ["burkina", "alto volta"],
  }
});

const GREENWICH_EN = crearBiblioteca({
  id: "greenwich_en", level: "normal", lang: "en", field: "geografia",
  name: "Countries crossed by the Prime Meridian", desc: "Name the eight countries through which the Prime Meridian (0°) passes.",
  total: 8, metmin: 5, dificultad: 3, lejania: 2,
  facts: {
    "united kingdom": "The one that chose where the meridian would go. Greenwich, London. The cartographer's privilege.",
    "france":         "Passes through Normandy and the Landes. The French never fully accepted that the zero meridian didn't go through Paris.",
    "spain":          "Enters through Castellón, passes through Valencia, exits through Alicante. On the meridian — and still an hour ahead of the UK.",
    "algeria":        "The meridian enters Africa through Algeria. The Sahara split in two by an invisible line.",
    "mali":           "The Sahara continues. Mali is the second African country it crosses.",
    "burkina faso":   "A brief stroke on the map: the meridian barely grazes the country's eastern edge.",
    "togo":           "A narrow country from north to south — and the meridian crosses it anyway.",
    "ghana":          "The last one. The Prime Meridian ends its African journey in the Gulf of Guinea.",
  },
  synonyms: {
    "united kingdom": ["uk", "great britain", "england", "britain"],
    "burkina faso":   ["burkina"],
  }
});

// ============ PAÍSES CRUZADOS POR EL ECUADOR / COUNTRIES CROSSED BY THE EQUATOR ============

const ECUADOR_PAISES_ES = crearBiblioteca({
  id: "ecuador_paises_es", level: "normal", lang: "es", field: "geografia",
  name: "Países cruzados por el Ecuador", desc: "Nombra los trece países por los que pasa la línea del ecuador.",
  total: 13, metmin: 8, dificultad: 3, lejania: 2,
  facts: {
    "ecuador":                         "Más te vale que lo hayas adivinado fácil. Era tan obvio. El ombligo del mundo.",
    "colombia":                        "El ecuador cruza el Amazonas colombiano. Leticia, la ciudad, es hemisferio sur. Pocos colombianos piensan en ello.",
    "brasil":                          "Acapara kilómetros del ecuador como ninguno. La Amazonía, el grado cero de la latitud y la natura.",
    "santo tomé y príncipe":           "Dos islas volcánicas en el Golfo de Guinea. El ecuador las divide casi por la mitad. Entrometido.",
    "gabón":                           "Su capital: Libreville — un nombre que dice mucho. El ecuador pasa por el centro del país.",
    "república del congo":             "Recuerda: no todas las repeticiones lo son. No olvides a su hermana explícitamente democrática.",
    "república democrática del congo": "El país más grande de África subsahariana. La selva del Congo es la segunda selva tropical más grande del mundo.",
    "uganda":                          "El lago Victoria, que Uganda comparte con sus vecinos, está cortado por el ecuador. De los últimos topónimos coloniales lacustres.",
    "kenia":                           "Nairobi está apenas al sur del ecuador. El aeropuerto internacional más cercano al ecuador del mundo.",
    "somalia":                         "La punta del Cuerno de África. El ecuador dice adiós a África y se embarca de vacaciones al Índico.",
    "maldivas":                        "El archipiélago más llano del mundo — y el ecuador lo atraviesa. Ninguna isla supera los 2,4 metros de altitud: No al mal de alturas.",
    "indonesia":                       "El ecuador cruza Sumatra, Borneo y Sulawesi. El archipiélago más atravesado por la línea.",
    "kiribati":                        "El único país que está en los cuatro hemisferios a la vez: norte, sur, este y oeste. Merry Christmas en tantos sentidos y momentos.",
  },
  synonyms: {
    "república del congo":             ["congo brazzaville", "congo", "rep congo"],
    "república democrática del congo": ["rdcongo", "congo kinshasa", "rd congo", "rdc"],
    "santo tomé y príncipe":           ["sao tome", "santo tome"],
    "maldivas":                        ["maldives"],
  }
});

const EQUATOR_COUNTRIES_EN = crearBiblioteca({
  id: "equator_countries_en", level: "normal", lang: "en", field: "geografia",
  name: "Countries crossed by the Equator", desc: "Name the thirteen countries through which the Equator passes.",
  total: 13, metmin: 8, dificultad: 3, lejania: 2,
  facts: {
    "ecuador":                    "The only country named after the line that crosses it. The Middle of the World as a tourist attraction.",
    "colombia":                   "The equator enters through the Colombian Amazon. Few Colombians know this.",
    "brazil":                     "The country through which the most kilometers of equator pass. The Amazon at degree zero.",
    "são tomé and príncipe":      "Two volcanic islands in the Gulf of Guinea. The equator divides them almost in half.",
    "gabon":                      "Capital Libreville — a name that already says something. The equator passes through the center of the country.",
    "republic of the congo":      "Not to be confused with the Democratic Republic of the Congo, which also appears on this list.",
    "democratic republic of the congo": "The largest country in sub-Saharan Africa. The equator crosses through the north.",
    "uganda":                     "Lake Victoria, shared with Kenya and Tanzania, is cut by the equator.",
    "kenya":                      "Nairobi sits just south of the equator. The world's closest major international airport to the equator.",
    "somalia":                    "The tip of the Horn of Africa, just before the Indian Ocean.",
    "maldives":                   "The flattest archipelago in the world — and the equator runs through it. No island exceeds 2.4 meters in altitude.",
    "indonesia":                  "The equator crosses Sumatra, Borneo, and Sulawesi. The most-crossed archipelago on the line.",
    "kiribati":                   "The only country in all four hemispheres at once: north, south, east, and west.",
  },
  synonyms: {
    "republic of the congo":           ["congo brazzaville", "congo"],
    "democratic republic of the congo":["drc", "congo kinshasa", "dr congo"],
    "são tomé and príncipe":           ["sao tome", "saint thomas"],
  }
});

// ============ PROVINCIAS Y TERRITORIOS DE CANADÁ / PROVINCES AND TERRITORIES OF CANADA ============

const CANADA_ES = crearBiblioteca({
  id: "canada_es", level: "normal", lang: "es", field: "geografia",
  name: "Provincias y territorios de Canadá", desc: "Nombra las diez provincias y tres territorios de Canadá.",
  total: 13, metmin: 8, dificultad: 3, lejania: 2,
  facts: {
    "ontario":                    "La más poblada. Toronto, Ottawa, las Cataratas del Niágara. El motor económico del país.",
    "quebec":                     "La única provincia oficialmente francófona. El separatismo y la poutine como identidad permanente.",
    "columbia británica":         "La del Pacífico y la de Cascadia. Vancouver, las montañas Rocosas, y el clima más amable (y caro) del país.",
    "alberta":                    "El petróleo, las praderas y las Rocosas. La provincia más conservadora. La más rica per cápita en dinero y dinosaurios y la más pobre en ratas: 0.",
    "manitoba":                   "Centro geográfico de Canadá y cuna de Winnie the Pooh. Masones, arte inuit, mi emoción se encendería si no fuera tanto el frío.",
    "saskatchewan":               "Trigo, canola y cielos infinitos. La única provincia con fronteras completamente rectas. Pesadilla en pruebas de deletreo.",
    "nueva escocia":              "La más atlántica. Halifax, los acadios, y la mayor marea del mundo en la bahía de Fundy.",
    "nuevo brunswick":            "La única provincia oficialmente bilingüe. Francés e inglés con igual estatus legal.",
    "terranova y labrador":       "La última en unirse a Canadá — en 1949. El cabo más oriental de América del Norte. Patria de una de las razas más adorables de perro y de Mr. Peanutbutter.",
    "isla del príncipe eduardo":  "La más pequeña y la más agrícola. La patria de la papa canadiense y de Ana de las Tejas Verdes.",
    "territorios del noroeste":   "Auroras boreales, osos polares y menos de 50.000 habitantes en un territorio del tamaño de Colombia. La puerta a Asia del pasaje noroeste.",
    "yukón":                      "La fiebre del oro de 1896, el río Yukón y el pico más alto de Canadá: el monte Logan. El Klondike hizo rico al pato más avaro de la historia.",
    "nunavut":                    "El más grande. El menos poblado. Creado en 1999 como territorio inuit autónomo. Futuro inicio del pasaje noroeste.",
  },
  synonyms: {
    "columbia británica":        ["bc", "british columbia"],
    "nueva escocia":             ["nova scotia"],
    "nuevo brunswick":           ["new brunswick"],
    "terranova y labrador":      ["terranova", "newfoundland", "newfoundland and labrador"],
    "isla del príncipe eduardo": ["pei", "prince edward island"],
    "territorios del noroeste":  ["northwest territories", "nwt"],
    "yukón":                     ["yukon"],
  }
});

const CANADA_EN = crearBiblioteca({
  id: "canada_en", level: "normal", lang: "en", field: "geografia",
  name: "Provinces and territories of Canada", desc: "Name the ten provinces and three territories of Canada.",
  total: 13, metmin: 8, dificultad: 3, lejania: 2,
  facts: {
    "ontario":                   "The most populous. Toronto, Ottawa, Niagara Falls. The economic engine. And what looks like New York or Chicago on screen is very often Toronto.",
    "quebec":                    "The only officially francophone province. Separatism and poutine as permanent identity.",
    "british columbia":          "Pacific coast and Cascadia. Vancouver, the Rockies, and the country's most liveable (and priciest) climate.",
    "alberta":                   "Oil, prairies, and the Rockies. The most conservative province. Richest per capita in money and dinosaurs, poorest in rats: 0.",
    "manitoba":                  "Canada's geographic centre and Winnie the Pooh's birthplace. Freemasons, Inuit art, and a cold that explains everything.",
    "saskatchewan":              "Wheat, canola, and endless skies. The only province with perfectly straight borders. A spelling test's worst nightmare.",
    "nova scotia":               "The most Atlantic. Halifax, the Acadians, and the world's highest tides in the Bay of Fundy.",
    "new brunswick":             "Canada's only officially bilingual province. French and English with equal legal status. Was almost called New Ireland — but George III's German roots won out.",
    "newfoundland and labrador": "The last to join Canada — in 1949. The easternmost point of North America. Home of one of the world's most adorable dog breeds and Mr. Peanutbutter.",
    "prince edward island":      "The smallest and most agricultural. Named after a prince who never visited but lobbied hard for the honour — and fathered Queen Victoria. Anne of Green Gables lives here.",
    "northwest territories":     "Northern lights, polar bears, and fewer than 50,000 people in a territory the size of Colombia. Gateway to Asia via the Northwest Passage.",
    "yukon":                     "The 1896 gold rush, the Yukon River, and Canada's highest peak: Mount Logan. The Klondike made Scrooge McDuck the richest duck in history.",
    "nunavut":                   "The largest. The least populated. Created in 1999 as an autonomous Inuit territory. Future start of the Northwest Passage.",
  },
  synonyms: {
    "british columbia":          ["bc", "columbia británica"],
    "nova scotia":               ["nueva escocia"],
    "new brunswick":             ["nuevo brunswick"],
    "newfoundland and labrador": ["newfoundland", "terranova"],
    "prince edward island":      ["pei", "isla del príncipe eduardo"],
    "northwest territories":     ["nwt", "territorios del noroeste"],
  }
});

// ============ ESTADOS MIEMBROS DE LA UE / EU MEMBER STATES ============

const ESTADOS_UE_ES = crearBiblioteca({
  id: "estados_ue_es", level: "normal", lang: "es", field: "humanidades",
  name: "Estados miembros de la UE", desc: "Nombra los 27 estados miembros de la Unión Europea.",
  total: 27, metmin: 18, dificultad: 3, lejania: 1,
  facts: {
    "alemania":          "La mayor economía del bloque. Motor industrial, pesadilla fiscal para el sur. Unificada en el XIX, reunificada en el XX, ¿no nos sorprendan en el XXI?",
    "francia":           "Arte, ciencia, deleite. ¿Qué le ha faltado? Carbón. Con Alemania: equipazo. París como capital no oficial de Europa. Miembro fundador.",
    "italia":            "La tercera economía. Miembro fundador y eterno laboratorio de crisis políticas. De los casos más deliciosos de contraste norte y sur.",
    "españa":            "La cuarta economía y la primera fiesta empieza a las 2 am. Salió Franco y ella se destapó para entrar en 1986. Cervantes, vino, siesta: le debemos tanto.",
    "polonia":           "La mayor economía del este. Bisagra entre Europa occidental y el espacio postsoviético. Ha desaparecido 8 veces y regresado. Esperamos que esta vez se amañe.",
    "países bajos":      "Ámsterdam: diamantes. Rotterdam: el mayor puerto. Segunda potencia mundial en agricultura: ellos. Primeros capitalistas: ellos. Las zanahorias naranjadas: ¿qué?",
    "bélgica":           "Bélgica es Tintín: un valón de lengua, un flamenco de cara y acto. Pero también Magritte, Amberes y Bruselas. La más diplomática y 541 días sin gobierno.",
    "suecia":            "Entró en 1995 bailando Ace of Base mientras ABBA asentía. Nórdica pero no en el euro. Ikea ha hecho del sueco el hazmerreír de medio mundo.",
    "austria":           "Patria real del croissant, el vals y la Sachertorte. Viena, el Danubio, la modernidad. En la UE desde 1995. Si los otomanos la hubieran logrado...",
    "dinamarca":         "Entre insular y peninsular, ¿tanto hygge hostigará? No nos da para testearlo. UE desde 1973 pero, ¿sin euro y con un Schengen raro en un túnel larguísimo?",
    "finlandia":         "Reducto finoúgrico y talón de Aquiles estalíneo. Más vocales per cápita que reinvenciones de Nokia por década.",
    "grecia":            "Miembro desde 1981. Cuna de la democracia, epicentro de la crisis del euro de 2010. Tzatziki y cíclades.",
    "portugal":          "Más de mil recetas de bacalao, el origen de la tempura, el peri peri y la era de las exploraciones. Tres palabras: Pasteis de nata.",
    "república checa":   "Divorciada aterciopelada de Eslovaquia desde 1993. Uno de los principales núcleos industriales en la entreguerra. UE desde 2004 pero sin euro.",
    "rumanía":           "Entró en 2007. La mayor población del este de la UE junto a Polonia. Al parecer Drácula es menos voraz de lo que dicen, pero Ceausescu, no.",
    "hungría":           "En la UE desde 2004. El miembro más conflictivo en términos de Estado de derecho. Si alguien se llama Atila (sí, ¡hoy en día!) seguro es húngaro.",
    "eslovaquia":        "La mitad carpática de Checoslovaquia. En la UE y en el euro desde 2009. Bratislava y Viena: las capitales más contiguas del mundo.",
    "bulgaria":          "El único cirílico en la UE, la patria del yogurt, cuyo bacilo sigue llevando su nombre. Ayvar y rakija los comparte con sus vecinos... aunque lo niegue.",
    "croacia":           "El miembro más reciente: entró en 2013. Costa dálmata, turismo, corbatas y ser fondo de series y películas: sus principales activos.",
    "eslovenia":         "La ex-yugoslava que nunca fue tan yugoslava. Alpes, euro, Liubliana. El dinero cambió muchas cosas — entre ellas, con quién almuerza.",
    "lituania":          "La mayor de las tres bálticas. Alguna vez, con Polonia, formaron el estado más grande de Europa. Los húsares alados volaron desde aquí. Ahora en el euro.",
    "letonia":           "Del sánduche báltico: la carne. Riga como capital cultural. Lietuva, Latvia, Letonia, Łotwa, Lotyšsko, Latvio... casi más disfraces lingüísticos que habitantes.",
    "estonia":           "La más digital del mundo. e-Residency, voto electrónico, gobierno en la nube. Nos dio a Skype pero no lo merecimos.",
    "chipre":            "Dividida desde 1974: sur griego y europeo; norte turco no reconocido; buffer de la ONU en medio. La Corea soleada del Mediterráneo. Chipriota: gentilicio trampa",
    "luxemburgo":        "Transporte público gratis para todos. Mayor PIB per cápita de la UE. El precio del metro es el salario mínimo (cero).",
    "malta":             "El estado miembro más pequeño. Nada que ver con las bebidas ni el cereal, todo que ver con el perro. En la UE desde 2004.",
    "irlanda":           "Las Irlandas y la UE se tocan por debajo de la mesa. La única frontera terrestre post-Brexit. El milagro celta tras la hambruna de la papa.",
  },
  synonyms: {
    "países bajos":    ["holanda", "netherlands", "holland"],
    "república checa": ["chequia", "czech republic", "czechia"],
    "rumanía":         ["romania", "rumania"],
  }
});

const EU_STATES_EN = crearBiblioteca({
  id: "eu_states_en", level: "normal", lang: "en", field: "humanidades",
  name: "EU member states", desc: "Name the 27 member states of the European Union.",
  total: 27, metmin: 18, dificultad: 3, lejania: 1,
  facts: {
    "germany":          "The largest economy. Industrial engine, fiscal nightmare for the south. Unified in the 19th century, reunified in the 20th. Hopefully unsurprising in the 21st.",
    "france":           "Art, science, delight. Any lacks? Coal. With Germany: dream team and founding member. Paris as Europe's unofficial capital.",
    "italy":            "The third economy. Founding member and eternal laboratory of political crisis. The most delicious north-south contrast in the world.",
    "spain":            "\"Generalissimo Francisco Franco is still dead\", says SNL. Spain in the EU since 1986, say we. Cervantes, paella, siesta: we owe it so much.",
    "poland":           "The largest eastern economy. Hinge between Western Europe and post-Soviet space. Gone and back: 8 times already. We hope it sticks this time.",
    "netherlands":      "Amsterdam: diamonds. Rotterdam: the biggest port. Second largest agricultural power in the world: them. First capitalists: them. Orange carrots: what?",
    "belgium":          "Belgium is Tintin: Walloon in tongue, Flemish in face and deed. But also Magritte, Antwerp and Brussels. The most diplomatic — 541 days without a government.",
    "sweden":           "Joined in 1995 dancing to Ace of Base while ABBA nodded. Nordic but not in the euro. IKEA has made Swedish the punchline of half the world.",
    "austria":          "True birthplace of the croissant, the waltz and the Sachertorte. Vienna, the Danube, modernity. In the EU since 1995. If the Ottomans had managed to...",
    "denmark":          "Between island and peninsula, full of hygge. Technically in the EU since 1973 but — no euro and a funny Schengen arrangement? Through a very long tunnel.",
    "finland":          "Finno-Ugric outpost among the Nordics. The longest Russian border in the EU. Stalin's Achilles heel. In NATO since 2023.",
    "greece":           "Member since 1981. Cradle of democracy, epicentre of the 2010 eurozone crisis. Tzatziki and the Cyclades.",
    "portugal":         "Over a thousand cod recipes, the origin of tempura, peri peri, and the age of exploration. Three words: Pastéis de nata.",
    "czech republic":   "Velvet divorce from Slovakia in 1993. One of the great industrial hubs of the interwar period. EU since 2004, but no euro.",
    "romania":          "Joined in 2007. Largest eastern population alongside Poland. Dracula turned out to be less voracious than advertised. Ceaușescu, not so much.",
    "hungary":          "In the EU since 2004. Its most conflicted member on rule of law. If you meet an Attila nowadays — fear not, but you might — they're probably Hungarian.",
    "slovakia":         "The Carpathian half of Czechoslovakia. In the EU and euro since 2009. Bratislava and Vienna: the world's two most adjacent capitals.",
    "bulgaria":         "The EU's only Cyrillic script — they perfected it here. Birthplace of yoghurt, whose bacillus still bears its name. Shares ayvar and rakia with its neighbours. Though it denies it.",
    "croatia":          "The most recent member: joined in 2013. Dalmatian coast, tourism, neckties, and being the backdrop for half of Hollywood.",
    "slovenia":         "The least southern ex-Yugoslav. Alps, euro, Ljubljana. Money changed many things — including who it lunches with.",
    "lithuania":        "Largest of the three Baltics. Once, with Poland, they formed the biggest state in Europe. The winged hussars flew from here. Now in the euro.",
    "latvia":           "The meat in the Baltic sandwich. Riga as the cultural capital. Lietuva, Latvia, Letonia, Łotwa, Lotyšsko, Latvio... almost more linguistic disguises than inhabitants.",
    "estonia":          "The world's most digital country. e-Residency, electronic voting, government in the cloud. It gave us Skype and we didn't deserve it.",
    "cyprus":           "Divided since 1974: Greek south in the EU; unrecognised Turkish north; UN buffer zone in between. The sunny Korea of the Mediterranean. Cypriot: a trick demonym.",
    "luxembourg":       "Free public transport for everyone. Highest GDP per capita in the EU. The price of the metro is the minimum wage (zero).",
    "malta":            "The smallest member state. Nothing to do with the drinks or the cereal, everything to do with the dog. In the EU since 2004.",
    "ireland":          "The UK and the EU touch each other's Irelands under the table. The only land border post-Brexit. The Celtic Tiger, after the potato famine.",
  },
  synonyms: {
    "czech republic":  ["czechia", "chequia", "república checa"],
    "netherlands":     ["holland", "holanda", "países bajos"],
    "germany":         ["alemania", "deutschland"],
  }
});

// ============ ESTADOS DE LOS ESTADOS UNIDOS / STATES OF THE UNITED STATES ============

const ESTADOS_USA_ES = crearBiblioteca({
  id: "estados_usa_es", level: "normal", lang: "es", field: "geografia",
  name: "Estados de los Estados Unidos", desc: "Nombra los 50 estados de los Estados Unidos.",
  total: 50, metmin: 35, dificultad: 2, lejania: 1,
  facts: {
    "alabama":        "El estado del algodón y de la lucha por los derechos civiles. Montgomery y Selma. Allí se hizo la primera llamada al 911. No sabemos si eso es un mérito.",
    "alaska":         "El más grande y el menos denso. Comprado a Rusia en 1867 por 7,2 millones de dólares. La «locura de Seward» resultó genial: petróleo, estrategia, paisajes.",
    "arizona":        "El Gran Cañón, el desierto de Sonora, y la frontera más transitada del mundo con México. Phoenix no para de crecer aunque sabe que no debería.",
    "arkansas":       "El estado natal de Bill Clinton. El único con producción de diamantes en Norteamérica: los que encuentres ¡son tuyos!",
    "california":     "Silicon Valley, Hollywood, terremotos. Rival de Japón e India por el 4to lugar mundial. Nombrada por una tierra fantástica, salió convirtiéndose en ella.",
    "colorado":       "Las Montañas Rocosas, Denver, y la mayor concentración de cumbres de más de 4.000 metros en EEUU. Ah, y el río.",
    "connecticut":    "El más pequeño de los que no son islas. Yale, 1701. ¿Por eso los estados de Nueva Inglaterra son tan difíciles de deletrear?",
    "delaware":       "El primero en ratificar la Constitución y en desembarazarse de muchos impuestos. Sede legal de más de la mitad de las empresas Fortune 500.",
    "florida":        "El estado del sol, los huracanes, Disney World y los votos que deciden elecciones. Y caimanes y boas y gente que sale en las noticias.",
    "georgia":        "Atlanta, Coca-Cola, Martin Luther King y el melocotón como símbolo oficial. Nadie la confunde con la del Cáucaso, pero a ella con ésta, sí.",
    "hawaii":         "El único estado insular es el número 50 desde 1959. El más lejano del continente. Tú dices piña, yo digo malaria aviar.",
    "idaho":          "Las patatas más famosas de EE.UU. y las cataratas Snake River. El único con un nombre 100% arbitrario que finge ser indígena.",
    "illinois":       "Chicago, el viento, y el estado natal de Abraham Lincoln y Barack Obama. Su «s» muda delata a los latinos.",
    "indiana":        "Las 500 Millas de Indianápolis. El estado de los Hoosiers, así nadie entienda por qué.",
    "iowa":           "El maíz, las caucus y el primer estado en votar en las primarias presidenciales. No se nos ocurre nada más, ni a ellos.",
    "kansas":         "El centro geográfico de los 48 estados contiguos. Hogar de Dorothy y Toto, el perro, no la banda.",
    "kentucky":       "El tabaco, los caballos pura sangre y el Derby de Kentucky. Edificios manchados de moho por las destiladoras de whisky.",
    "louisiana":      "Nueva Orleans, el jazz, el mardi gras y la cocina cajún. La herencia francesa más visible — vendida con medio continente a centavos el acre.",
    "maine":          "El estado más al noreste. Las langostas, los faros y el otoño más fotogénico. Casi Canadá.",
    "maryland":       "Rodea Washington D.C. por tres lados. La bahía de Chesapeake, los cangrejos azules y suburbios capitalinos por doquier. Primo del bloody Mary.",
    "massachusetts":  "Boston, Harvard, el MIT y el punto de partida de la Revolución americana. Solo el estado del río le gana en letras repetidas.",
    "michigan":       "Detroit, la industria automotriz y los Grandes Lagos. El que tiene más kilómetros de costa interior. Techno, Motown, Art Deco.",
    "minnesota":      "El país de los 10.000 lagos — en realidad son más de 14.000. La fuente del Mississippi y las Juicy Lucy. No queda en Escandinavia, solo lo parece.",
    "mississippi":    "El más pobre de los estados. El río que le da nombre también le dio su cultura musical. Su delta: pobre en dinero, desbordante en cultura.",
    "missouri":       "El Arco de San Luis, la puerta al Oeste y el estado natal de Mark Twain. Y Kansas City de sorpresa.",
    "montana":        "El cuarto estado más grande. Glacier National Park y el cielo más grande de América. El inglés perdió la tilde montañosa para llamar la atención.",
    "nebraska":       "El granero de América. Omaha y el hogar de Warren Buffett. Prima lejana de Alaska. Muy lejana.",
    "nevada":         "Reno, casinos y el desierto de Mojave. Más pruebas nucleares que cualquier otro lugar del mundo. ¿Nevada? Sí, nieva. Los nombres no mienten, pero Vegas olvida.",
    "new hampshire":  "El primero en celebrar primarias presidenciales. Pequeño pero decisivo. Mucho más famoso que Hampshire.",
    "new jersey":     "El estado más densamente poblado. Springsteen, la Estatua de la Libertad y Atlantic City. Mucho mejor de lo que la gente se espera, que es bastante poco.",
    "new mexico":     "Profundamente hispano. Enormes desiertos, la primera prueba nuclear, Roswell y White Sands. Y Breaking Bad de propina. ¿Que dónde quedó lo hispano?",
    "new york":       "La capital del mundo en el estado más icónico. Wall Street, Broadway, el Met. Talk Shows, Friends y la Nana Fine.",
    "north carolina": "Charlotte, Research Triangle y el primer vuelo de los hermanos Wright en Kitty Hawk. Casi nadie recuerda de quién es epónima.",
    "north dakota":   "El estado menos visitado. Petróleo, praderas y la frontera con Canadá. Y no Mount Rushmore.",
    "ohio":           "Siete presidentes nacidos aquí. El campo de batalla electoral por excelencia. De Toledo se dice que es el Ohio de Ohio.",
    "oklahoma":       "El territorio indio por excelencia después del sendero de lágrimas. El Dust Bowl de los años 30 y el musical de Broadway.",
    "oregon":         "Portland, los bosques de secuoyas, el volcán Monte Hood y la costa del Pacífico. Se rumora que infinitos tipos de leche.",
    "pennsylvania":   "Filadelfia, Pittsburgh y los amish. Sus dutch no son dutch (holandeses), sino alemanes de incógnito.",
    "rhode island":   "El estado más pequeño. La primera colonia en declarar independencia. Hawaii, no te sientas insegura: Rhode Island, como cualquier hombre, no es una isla.",
    "south carolina": "El primer estado en separarse de la Unión en 1860. El primer disparo de la Guerra Civil. El estado del Yodo, vencido por la sal yodada en los 1920s.",
    "south dakota":   "El Monte Rushmore, las Badlands y el hogar ancestral de los lakota. Dicen que mejor que la del norte.",
    "tennessee":      "Nashville, Memphis, el country y el blues. El único con halógeno propio. Elvis no era de aquí.",
    "texas": "1836-1845. Independiente de México, después se anexó a Estados Unidos por voluntad propia. ¿Recuerdan el Álamo?",
    "utah":           "El Gran Lago Salado, los mormones y el Parque Nacional de Zion. Las dirty sodas como sustituto al alcohol y el café.",
    "vermont":        "Un monte verde con miel de maple, cheddar y Bernie. El primer estado en abolir la esclavitud pero solo para adultos. No lo hagas sentir mal, revisa en silencio.",
    "virginia":       "La cuna de los presidentes fundadores. Ocho presidentes nacidos aquí, incluido Washington. Inspirado en Isabel I.",
    "washington":     "Seattle, Microsoft, Amazon, Boeing y los bosques de pinos del noroeste. Y el grunge siempre de último.",
    "west virginia":  "Se separó de Virginia en 1863 por no separarse de la Unión. El carbón como historia. Mucho más al este que la mayoría pero no más que Virginia.",
    "wisconsin":      "Queso y cerveza. ¿Cómo mejorar lo ya perfecto?",
    "wyoming":        "El menos poblado. Yellowstone, el Grand Teton y el primer estado en dar voto a la mujer.",
  },
  synonyms: {
    "luisiana":           ["louisiana"],
    "míchigan":           ["michigan"],
    "misisipi":           ["mississippi"],
    "misuri":             ["missouri"],
    "nuevo hampshire":    ["new hampshire"],
    "nueva jersey":       ["new jersey"],
    "nueva york":         ["new york"],
    "nuevo méxico":       ["new mexico"],
    "carolina del norte": ["north carolina"],
    "dakota del norte":   ["north dakota"],
    "pensilvania":        ["pennsylvania"],
    "rhode island":       ["rhode island"],
    "carolina del sur":   ["south carolina"],
    "dakota del sur":     ["south dakota"],
    "tennessee":          ["tennessee"],
    "virginia occidental":["west virginia"],
  }
});

const USA_STATES_EN = crearBiblioteca({
  id: "usa_states_en", level: "normal", lang: "en", field: "geografia",
  name: "States of the United States", desc: "Name the 50 states of the United States.",
  total: 50, metmin: 35, dificultad: 2, lejania: 1,
  facts: {
    "alabama":        "The cotton state and the civil rights battleground. Montgomery and Selma. Home of the first 911 call. Not sure if that counts as a merit.",
    "alaska":         "The largest and least dense. Purchased from Russia in 1867 for $7.2 million. \"Seward's Folly\" turned out brilliantly: oil, strategy, landscapes.",
    "arizona":        "The Grand Canyon, the Sonoran Desert, and the world's busiest land border with Mexico. Phoenix keeps growing even though it knows it shouldn't.",
    "arkansas":       "Bill Clinton's home state. The only one with diamond mining open to the public: finders keepers.",
    "california":     "Silicon Valley, Hollywood, earthquakes. Rival of Japan and India for 4th place worldwide. Named after a fantasy land — it became one.",
    "colorado":       "The Rockies, Denver, and the highest concentration of 14,000-foot peaks in the US. Oh, and the river.",
    "connecticut":    "The smallest non-island state. Yale, 1701. Is that why New England states are so hard to spell?",
    "delaware":       "First to ratify the Constitution and to shed many taxes. Legal home to more than half the Fortune 500.",
    "florida":        "Sun, hurricanes, Disney World and the votes that decide elections. Also alligators, pythons, and people on the news.",
    "georgia":        "Atlanta, Coca-Cola, Martin Luther King and the peach as official symbol. Nobody thinks it's in the Caucasus, but many go looking for the other Georgia there.",
    "hawaii":         "The only island state, number 50 since 1959. The farthest from the continent. You say pineapple, I say avian malaria.",
    "idaho":          "America's most famous potatoes and Snake River Falls. The only state with a name that's 100% made up and pretends to be indigenous.",
    "illinois":       "Chicago, the wind, birthplace of Lincoln and Obama. Its silent \"s\" trips up Spanish speakers every time.",
    "indiana":        "The Indianapolis 500. Home of the Hoosiers, not that anyone knows what that means.",
    "iowa":           "Corn, caucuses, and the first state to vote in presidential primaries. Nothing else comes to our mind or theirs.",
    "kansas":         "The geographic centre of the 48 contiguous states. Home of Dorothy and Toto — the dog, not the band.",
    "kentucky":       "Tobacco, thoroughbreds and the Kentucky Derby. Buildings stained with mould from the whiskey distilleries.",
    "louisiana":      "New Orleans, jazz, Mardi Gras and Cajun cuisine. The most visible French heritage — sold with half the continent for a few cents an acre.",
    "maine":          "The most northeastern state. Lobsters, lighthouses and the most photogenic autumn. Almost Canada.",
    "maryland":       "Surrounds Washington D.C. on three sides. Chesapeake Bay, blue crabs and capital suburbs as far as the eye can see. Cousin of the Bloody Mary.",
    "massachusetts":  "Boston, Harvard, MIT and the starting point of the American Revolution. Only that state with the river beats it in repeated letters.",
    "michigan":       "Detroit, the auto industry and the Great Lakes. The most inland coastline of any state. Techno, Motown, Art Deco.",
    "minnesota":      "The Land of 10,000 Lakes — actually more than 14,000. The source of the Mississippi and the Juicy Lucy. Not in Scandinavia, but feels like it.",
    "mississippi":    "The poorest state. The river that named it also gave it its musical culture. Its delta: poor in money, overflowing in culture.",
    "missouri":       "The Gateway Arch, the gateway to the West, and Mark Twain's home state. And Kansas City, surprisingly.",
    "montana":        "The fourth largest state. Glacier National Park and the biggest sky in America. English dropped the tilde on the ñ to avoid drawing attention.",
    "nebraska":       "America's breadbasket. Omaha and Warren Buffett's home. Distant cousin of Alaska. Very distant.",
    "nevada":         "Reno, casinos and the Mojave. More nuclear tests than anywhere else on Earth. Nevada? Yes, it snows. Names don't lie, but Vegas forgets.",
    "new hampshire":  "First to hold presidential primaries. Small but decisive. Much more famous than Hampshire.",
    "new jersey":     "The most densely populated state. Springsteen, the Statue of Liberty and Atlantic City. Better than what people expect, which isn't much. The state of irony.",
    "new mexico":     "Deeply Hispanic. Vast deserts, the first nuclear test, Roswell and White Sands. Breaking Bad as a bonus. Where did the Hispanic go?",
    "new york":       "The world's capital in the most iconic state. Wall Street, Broadway, the Met. Talk shows, Friends and Fran Drescher.",
    "north carolina": "Charlotte, Research Triangle and the Wright Brothers' first flight at Kitty Hawk. Almost nobody remembers whose name it bears.",
    "north dakota":   "The least visited state. Oil, prairies and the Canadian border. And not Mount Rushmore.",
    "ohio":           "Seven presidents born here. The ultimate electoral battleground. Toledo is said to be the Ohio of Ohio.",
    "oklahoma":       "The great Indian Territory, after the Trail of Tears. The Dust Bowl of the 1930s and the Broadway musical.",
    "oregon":         "Portland, redwood forests, Mount Hood and the Pacific coast. Rumoured to have infinite types of milk.",
    "pennsylvania":   "Philadelphia, Pittsburgh and the Amish. Its Dutch aren't Dutch — they're Germans in disguise.",
    "rhode island":   "The smallest state. The first colony to declare independence from Britain. Hawaii, do not feel insecure: Rhode Island, like any man, is not an island.",
    "south carolina": "First state to secede in 1860. First shot of the Civil War. The Iodine State, defeated by iodized salt in the 1920s.",
    "south dakota":   "Mount Rushmore, the Badlands and the ancestral home of the Lakota. Said to be better than the north one.",
    "tennessee":      "Nashville, Memphis, country and blues. The only state with its own chemical element. Elvis wasn't from here.",
    "texas": "1836-1845. Independiente de México, después se anexó a Estados Unidos por voluntad propia. ¿Recuerdan el Álamo?",
    "utah":           "The Great Salt Lake, the Mormons and Zion National Park. Dirty sodas as a substitute for alcohol and coffee.",
    "vermont":        "A green mountain with maple syrup, cheddar and Bernie. First state to abolish slavery — but only for adults. Don't make it feel too bad. Factcheck quietly.",
    "virginia":       "Cradle of the founding presidents. Eight born here, including Washington. Named after Elizabeth I.",
    "washington":     "Seattle, Microsoft, Amazon, Boeing and the pine forests of the northwest. And grunge, always last.",
    "west virginia":  "Split from Virginia in 1863 to avoid splitting from the Union. Coal as history. Much further east than most, but not more than Virginia.",
    "wisconsin":      "Cheese and beer. How do you improve on perfection based on only one vowel?",
    "wyoming":        "The least populated. Yellowstone, Grand Teton and the first state to grant women the vote.",
  },
  synonyms: {
    "west virginia": ["virginia occidental"],
    "rhode island":  ["rhode island"],
  }
});


const UNIDADES_SI_ES = crearBiblioteca({
  id: "unidades_si_es", level: "normal", lang: "es", field: "ciencias_duras",
  name: "Unidades base del SI", desc: "Nombra las 7 unidades base del Sistema Internacional de Unidades.",
  total: 7, metmin: 5,
  facts: {
    metro: "Longitud. 1791: valía una diezmillonésima del meridiano. Hoy: la distancia recorrida por la luz en 1/299.792.458 de segundo. Francés y todo, el metro no para.",
    kilogramo: "Masa. Definida por un objeto físico hasta 2019: un cilindro de Pt-Ir en París. Redefinido ya en función de la constante de Planck. Igual sigues pesando igual.",
    segundo: "La más antigua y aun así nadie conoce el \"primero\". Rarísima: 9.192.631.770 oscilaciones del átomo de cesio-133. El tiempo medido por lo que no cambia con él.",
    ampere: "Corriente eléctrica. Epónima de André-Marie Ampère, matemático francés que nunca tocó un cable. Adaptadores del mundo: culpenle a él.",
    kelvin: "Temperatura termodinámica. Cero absoluto: −273,15°C. Lord Kelvin propuso la escala; nunca llegó al cero que nombró. Nadie ha llegado. Ni tú con tus ex.",
    mol: "Cantidad de materia. 6,022×10²³ entidades — el número de Avogadro. Una unidad inventada cuando la química se cansó de contar átomos uno a uno.",
    candela: "La intensidad luminosa. La más cotidiana e ignorada: cuánta luz y en qué dirección. Su origen: la llama de una vela de esperma de ballena. En serio. Progreso.",
  },
  synonyms: {
    ampere: ["amperio", "amp"],
    mol: ["mole"],
  }
});

const UNIDADES_SI_EN = crearBiblioteca({
  id: "unidades_si_en", level: "normal", lang: "en", field: "ciencias_duras",
  name: "SI base units", desc: "Name the 7 base units of the International System of Units.",
  total: 7, metmin: 5,
  facts: {
    metre: "Length. 1791: one ten-millionth of the meridian. Today: the distance light travels in 1/299,792,458 of a second. The French Revolution's most precise legacy.",
    kilogram: "Mass. The only one defined by a physical object (a Pt-Ir cylinder in Paris), until 2019: then, redefined via Planck's constant. You still weigh the same.",
    second: "The oldest and yet nobody knows the \"first.\" Bizarre: 9,192,631,770 oscillations of a caesium-133 atom. Time measured by what doesn't change with it.",
    ampere: "Electric current. Named after André-Marie Ampère, a French mathematician who never touched a wire. Adapters of the world: blame him.",
    kelvin: "Thermodynamic temperature. Absolute zero: −273.15°C. Lord Kelvin proposed the scale; never reached the zero he named. Nobody has. Not even you and your exes.",
    mole: "Amount of substance. 6.022×10²³ entities — Avogadro's number. A unit invented when chemistry got tired of counting atoms one by one.",
    candela: "Luminous intensity. The most everyday and most ignored: how much light and in which direction. Origin: a spermaceti candle flame. Seriously. Progress.",
  },
  synonyms: {
    metre: ["meter"],
    ampere: ["amp"],
    mole: ["mol"],
  }
});

const PACTO_VARSOVIA_ES = crearBiblioteca({
  id: "pacto_varsovia_es", level: "normal", lang: "es", field: "historia",
  name: "Miembros del Pacto de Varsovia", desc: "Nombra los 8 países firmantes del Pacto de Varsovia (1955).",
  total: 8, metmin: 6,
  facts: {
    "union sovietica": "El firmante mayor. Ella era el pacto y el bloque. La URSS colapsó en 1991, el pacto, seis meses antes. Orquestró invasiones a Praga y Budapest.",
    albania: "La más díscola. Se alejó en 1961 por el cisma sino-soviético y se retiró en 1968 tras la Primavera de Praga. La oveja negra del rebaño rojo, con búnkeres.",
    bulgaria: "El miembro más fiel. Nunca cuestionó Moscú, nunca tuvo su Primavera. Tanta lealtad que algunos la llamaban la decimosexta república soviética.",
    checoslovaquia: "Invadida por los demás en 1968. Primavera de Praga de ocho meses, frenada por el Pacto y sus tanques en una noche. Dubček sobrevivió; la reforma, pausada.",
    hungria: "La primera en tratar de huir: revolución de 1956, aplastada por los soviéticos. El puente de las cadenas bombardeado, en ruinas, ni sabemos si eso es ironía.",
    "republica democratica alemana": "Hecha por simetrías luego de la disolución del 3er Reich. El más icónico muro y solo con su caída se abrió a la reunificación,",
    polonia: "Anfitriona involuntaria: el Pacto lleva el nombre de su capital. Solidarność, Walesa y Wotyla: Ni 40+ años pudieron con la fé de los más católicos del pacto.",
    rumania: "La más independiente. Ceaușescu condenó la invasión de Checoslovaquia en 1968 y estableció relaciones con China. La única que mató a sus déspotas.",
  },
  synonyms: {
    "union sovietica": ["urss", "soviet union", "rusia"],
    "republica democratica alemana": ["rda", "alemania oriental", "east germany"],
    rumania: ["rumanía"],
    hungria: ["hungría"],
  }
});

const PACTO_VARSOVIA_EN = crearBiblioteca({
  id: "pacto_varsovia_en", level: "normal", lang: "en", field: "historia",
  name: "Warsaw Pact members", desc: "Name the 8 founding members of the Warsaw Pact (1955).",
  total: 8, metmin: 6,
  facts: {
    "soviet union": "The founding member. She was the pact and the bloc. The USSR collapsed in 1991; the pact, six months earlier. It orchestrated invasions of Prague and Budapest.",
    albania: "The most wayward. The Sino-Soviet split (1961) pushed it away; then withdrew after the invasion of Prague. The red flock's black sheep kept the bunkers.",
    bulgaria: "The most loyal member. Never questioned Moscow, never had its Spring. Such devotion that some called it the sixteenth Soviet republic.",
    czechoslovakia: "Invaded by its allies in 1968. The Prague Spring lasted eight months; the Pact's tanks ended it in one night. Dubček survived; the reform, paused.",
    hungary: "The first to try to leave: the 1956 revolution, crushed by the Soviets. The Chain Bridge bombed, in ruins — we still don't know if that's irony.",
    "east germany": "Built from the symmetries of a divided Reich. The most iconic wall, and only with its fall did reunification open.",
    poland: "The involuntary host: the Pact bears the name of its capital. Solidarność, Wałęsa and Wojtyła: decades couldn't break the faith of its most Catholic member.",
    romania: "The most independent. Ceaușescu condemned the 1968 invasion of Czechoslovakia and forged ties with China. The only one that executed its despots.",
  },
  synonyms: {
    "soviet union": ["ussr", "union sovietica", "russia"],
    "east germany": ["gdr", "german democratic republic", "rda"],
    romania: ["rumania", "roumania"],
  }
});

const HARDCOVER_ES = [HALOGENOS_ES, MUSAS_ES, PREFIJOS_GRIEGOS_ES, HERACLES_ES, ORDENES_ES, CESARES_ES, DECATLON_ES, HUESOS_CARPO_ES, PLANETAS_ENANOS_ES, PRIMOS_ES, PRESOCRATICOS_ES, JUECES_INFRAMUNDO_ES, FIBONACCI_ES, GREENWICH_ES, ECUADOR_PAISES_ES, CANADA_ES, ESTADOS_UE_ES, ESTADOS_USA_ES, UNIDADES_SI_ES, PACTO_VARSOVIA_ES];
const HARDCOVER_EN = [HALOGENS_EN, MUSES_EN, GREEK_NUMERICAL_PREFIXES_EN, HERACLES_EN, ORDERS_EN, CAESARS_EN, DECATHLON_EN, CARPALS_EN, DWARF_PLANETS_EN, PRIMES_EN, PRESOCRATICS_EN, JUDGES_UNDERWORLD_EN, FIBONACCI_EN, GREENWICH_EN, EQUATOR_COUNTRIES_EN, CANADA_EN, EU_STATES_EN, USA_STATES_EN, UNIDADES_SI_EN, PACTO_VARSOVIA_EN];

// ============ PENTATEUCO / PENTATEUCH ============
const CORRIENTES_FILOSOFICAS_ES = crearBiblioteca({
  id: "corrientes_filosoficas", level: "hard", lang: "es", field: "humanidades",
  name: "Corrientes filosóficas", desc: "Nombra cualquier corriente o escuela filosófica.",
  total: 33, metmin: 15,
  dificultad: 4, lejania: 3,
  facts: {
    estoicismo: "Acepta lo que no puedes controlar; cambia lo que puedes. Una talla le sirve a muchos: Marco Aurelio (emperador), Séneca (rico), Epicteto (esclavo), tú, yo.",
    epicureismo: "Placer es ausencia de dolor y turbación (aponía y ataraxia) y amistad, saber y pocas cosas más. Académicos y pueblo lo leen de formas opuestas.",
    platonismo: "Lo visible es sombra del mundo de las Formas y sombras de sombras. La caverna, el sol, las Ideas. Le debemos medio Sócrates, pero él a Sócrates más.",
    peripatetismo: "La de Aristóteles — nombrada por los pasillos del Liceo. Todo: artes, ciencias, chismes. Inauguran el tema de que los camellos odian el incesto.",
    cinismo: "La virtud es el único bien; lo convencional, fuera. Su ideal: el perro (kynos). Diógenes, el del barril, quitó del sol a Alejandro y desplumó a Platón.",
    escepticismo: "Suspende el juicio — toda certeza es imposible. Nada es cierto, ni esto. Pirrón y Sexto Empírico. El dogma que se devora a sí mismo como ouroboros.",
    cirenaismo: "El placer — físico e inmediato — es el único bien. Aristipo de Cirene cobró a Sócrates por sus lecciones. Tan deleitantes que no quedó texto ni escuela.",
    racionalismo: "La razón, no los sentidos, es la fuente primaria del conocimiento. Descartes, Spinoza, Leibniz. Cogito, sustancia, mónadas — y la duda y la deducción.",
    empirismo: "El conocimiento viene de la experiencia sensorial y la mente empieza vacía. Locke, Hume, Berkeley. Hume y el café: dos estimulantes contra el sopor de Kant.",
    idealismo: "Todo está en tu mente, excepto tu mente que está en la de dios. Berkeley: 'ser es ser percibido'. Árboles cayendo solos, piedras pateadas por Johnson: empate.",
    "idealismo aleman": "Fichte, Schelling y Hegel niños peleando por el legado crítico de Kant. Juicio analítico: los idealistas alemanes son y no son kantianos.",
    ilustracion: "Razón, ciencia y derechos humanos contra superstición y tiranía. Voltaire, Rousseau, Kant. La luz del XVIII brilló tanto que cegó al XX. Razón sola: error.",
    misticismo: "Experiencia directa de lo divino, más allá de la razón. Eckhart, Santa Teresa, partes de Wittgenstein. La más alta lírica de lo inefable y lo indubitable.",
    neoplatonismo: "El Uno emana el Intelecto, el Intelecto emana el Alma, el Alma emana la materia. Plotino emana de Platón; Agustín emana de Plotino. ¿Epifenómenos todos?",
    existencialismo: "Existencia precede a esencia: existiendo decides quién eres. Sartre, Camus, De Beauvoir. Náuseas, Sísifo sonriente, el otro como infierno y la mujer hecha.",
    fenomenologia: "Volver a las cosas mismas — describir la experiencia como tal, sin presupuestos. Husserl la fundó; Heidegger la secuestró, complejizó/enredó y se alzó con los títulos.",
    hermeneutica: "De interpretación de textos sagrados a historia y lectura de la acción humana. Gadamer: comprender es reinterpretar. El círculo hermenéutico sin fin.",
    estructuralismo: "El significado nace en sistemas de diferencias negativas, no de esencias positivas. Saussure en la lengua; Lévi-Strauss, en los mitos. El XX, en todo.",
    posestructuralismo: "Las estructuras existen pero son inestables, históricas, atravesadas de poder. Foucault las arqueologizó; Lyotard declaró el fin de los grandes relatos.",
    deconstruccionismo: "Remontarse atrás hacia el origen que es casi la nada y el ocaso de la verdad. La *différance* no es un error tipográfico.",
    marxismo: "La historia es la historia de la lucha de clases. Lo material determina al espíritu. Marx pone a Hegel de cabeza; Lenin, a Marx; Stalin hace rodar la de todos.",
    materialismo: "La realidad es fundamentalmente física: todo es átomos (y vacío). Demócrito lo intuyó; Hobbes lo sistematizó; La Mettrie lo escandalizó.",
    pragmatismo: "La verdad es lo que funciona. Peirce lo formuló; James lo popularizó; Dewey lo democratizó; Rorty lo sobrevivió. Hay cosas inequívocamente americanas.",
    utilitarismo: "El mayor bien para el mayor número. Bentham contabilizaba sensaciones; Mill lo refinó. La otra tiranía (aquí, moral, allá, política) de la mayoría.",
    deontologia: "Actúa por deber, no por consecuencias. El imperativo categórico: actúa como si tu acción fuera ley universal. Kant no podría habernos mentido.",
    anarquismo: "Toda autoridad coercitiva es ilegítima. Proudhon: 'la propiedad es un robo'. Bakunin y Marx se pelearon. Kropotkin estudió hormigas. Emma Goldman, todo.",
    vitalismo: "La vida se resiste a la ciencia. Bergson: élan vital. Dilthey: ciencias del espíritu. Eternos espantapájaros de los analíticos — y aún así, perduran.",
    feminismo: "La mujer como algo que vale la pena tomarse en serio en términos filosóficos. Innovador, visionario, bastante tardío. De Beauvoir fundó; Butler desfundó.",
    poscolonialismo: "Crítica del poder colonial y sus legados. Fanon y las violencias. Said y la invención del Oriente. Spivak la voz del sub. La voz de los sin voz.",
    hedonismo: "El placer es el bien supremo — paraguas amplio que cobija desde Aristipo (físico e inmediato) y Epicuro (tranquilidad) a Onfray (todo lo anterior sin culpa).",
    pesimismo: "La voluntad es sufrimiento, no impulso vital. Schopenhauer: términos largos y cuádruples para expresar lo que el budismo ni quiere ni puede. Antipangloss.",
    positivismo: "Si no se verifica empíricamente, no vale como saber. En el ingenuo XIX, Comte inventó la sociología y quería una religión de la Humanidad. No le fue bien.",
    "positivismo logico": "Lo metafísico no es ni siquiera falso, carece de sentido. Círculo de Viena: Carnap, Schlick, Neurath. La guerra los dispersó, Wittgenstein los destrozó.",
  },
  synonyms: {
    ilustracion: ["iluminismo", "ilustración"],
    posestructuralismo: ["postestructuralismo"],
    deconstruccionismo: ["deconstrucción", "deconstruccion"],
    deontologia: ["deontología"],
    fenomenologia: ["fenomenología"],
    hermeneutica: ["hermenéutica"],
    "idealismo aleman": ["idealismo alemán"],
    "positivismo logico": ["positivismo lógico"],
    poscolonialismo: ["poscolonialismo", "postcolonialismo"],
    cirenaismo: ["cirenaísmo"],
    escepticismo: ["escepticismo", "excepticismo"],
  }
});


// ============ HABÍA UNA VEZ ============
// IC ES — cuentos infantiles clásicos por uso contemporáneo, no por genealogía de género.
// Criterio (Milo, 13/07): los unifica el uso como "cuento infantil clásico", no si hay hada
// literal, tradición oral pura, o definición estricta de "cuento". Expansión no-europea
// (Vasilisa, Pájaro de fuego, Momotaro) política deliberada, no cuota.
// JMAHM completo: todas las FTs aprobadas por Milo.

const HABIA_UNA_VEZ_ES = crearBiblioteca({
  id: "habia_una_vez", level: "hard", lang: "es", field: "humanidades",
  name: "Había una vez", desc: "Nombra cualquier cuento de hadas o cuento infantil clásico.",
  total: 35, metmin: 15,
  dificultad: 3, lejania: 2,
  facts: {
    cenicienta: "Antes Rodopis, entre griega y egipcia. Perrault con zapatilla de cristal; la tradición y Grimm: de oro. Bibidi carroza de calabaza: la magia del XX.",
    blancanieves: "Grimm, 1812. La reina no pedía el corazón — sino pulmones e hígado: ¿vanidad o anemia? Su hermana, Rosa Roja, no dio la talla de la historia.",
    bella_durmiente: "Ella llevaba más de dos siglos de embarazo anónimo: ¡dormida! Consenso: cero consenso. ¿Despertar? Un beso (Grimm) o una astilla.",
    caperucita_roja: "El lobo suprematista: abuela de aperitivo, caperucita de plato fuerte. Y ya. Leñadores/cuento=0. Moraleja: no confíes ni en conocidos ni desconocidos.",
    hansel_y_gretel: "Hambruna, pequeña edad de hielo, abandono en el bosque, una bruja y un horno salvador. ¿Hace falta decir que no eran niños cazarrecompensas?",
    sirenita: "Por él, ella siente caminar sobre cristales rotos; él elige a otra y ella se vuelve espuma de mar. Aún así, menos terrible que casi todo Andersen.",
    rapunzel: "Grimm y el folklore son crueles: embarazo delatado por ropa que no cierra, destierro, príncipe cegado por espinas, mucho acondicionador, aun así: final feliz.",
    rumpelstiltskin: "Oro por primogénitos (lee la letra menuda). Shylock invertido: el horror es contractual, no su exoneración.",
    gato_con_botas: "Perrault, 1697. El gato más productivo, benevolente y mejor vestido se inventa al Marqués de Carabás. La farsa como arte y política.",
    bella_y_la_bestia: "Madame de Villeneuve, 1740 — lo de Disney y Beaumont son, a lo sumo, resúmenes. El original: mucho más largo, mucho más raro.",
    pinocho: "Collodi, 1883. Allí, el grillo muere en la página 3 aplastado por Pinocho. Luego es conciencia fantasma de un pinocho mucho más villano.",
    pulgarcita: "Andersen, 1835: Niña del tamaño de un pulgar, secuestrada por sapos, prometida a un topo, salvada por una golondrina. Andersen, casi siempre te pasas...",
    patito_feo: "El pobre sufre tanto hasta que descubre lo que es. Y luego dicen que a buen fin no hay mal principio. Rara avis feliz en Andersen.",
    traje_nuevo_del_emperador: "Andersen, 1837. Estafas, política y moda como indicios de una teoría de la verdad. Definitorio para el concepto de veeduría.",
    jack_y_las_habichuelas: "Tradición oral inglesa. Semillas mágicas, gigante dormido, arpa que delata. Quien roba a un ladrón... ¿emprende y fructifica?",
    ricitos_de_oro: "Una invasión, tres protagonistas tradicionales (anciana, zorra, rubia rizada). Los osos como víctimas y la protagonista invasora, la villana.",
    barba_azul: "Perrault, 1697. Asesino serial de esposas, habitación prohibida, notoria barba. ¿Que Gilles de Rais? Calumnia: lo de él eran los niños.",
    reina_de_las_nieves: "Andersen, 1844: Kay y Gerda. Un espejo roto, una astilla en el ojo, un corazón de hielo. Inspira Narnia y Frozen, pero nadie copia el dolor de Andersen.",
    principe_rana: "Ha evolucionado paralelo al amor: antes se daba con golpes a la pared, ya con besos. Por fin algo de optimismo, hermanos Grimm.",
    cerillera: "Ya que no hay lobos ni ogros y casi ni abuelas, es el más terrible y vigente. Niña muerta de frío, alucinando de hambre, en Navidad. ¡Andersen, no más!",
    soldadito_de_plomo: "Andersen y muy él. Amor imposible: un soldado cojo y una bailarina de papel. El amor arde y ellos con él. ¿Arder amando es mejor que no haber amado?",
    vasilisa_la_bella: "La Cenicienta rusa con Baba Yaga de madrina. Más oscura, más honesta, más patas de gallina. La muñeca heredada de su madre muerta: el hilo salvador.",
    pajaro_de_fuego: "Un pájaro luminoso ruso que beneficia y perjudica a su captor. Stravinsky lo convirtió en ballet y París, en motín. Como a casi todo.",
    momotaro: "El Niño Durazno más amado del Japón — nacido de un durazno gigante y criado por viejitos, conquista la isla de los ogros. Sin ironía ni azúcar agregado.",
    gata_blanca: "Madame d'Aulnoy, 1698. El cuento de hadas original. Reina transformada en gata; telas, nueces y mascotas minúsculas. Estilo mayúsculo.",
    ali_baba: "Las mil y una noches. Cuarenta ladrones, una cueva y la contraseña más famosa (¡no la uses online! considera: abreteajonjoli1234!).",
    aladino: "Originalmente en China, no Arabia — uno de tantos y deliciosos errores del traductor Galland. Otro: inventar al genio de la lámpara.",
    simbad: "Siete viajes, cada uno más imposible. La Odisea árabe: monstruos, naufragios, riquezas. Bagdad presaqueo mongol: puerto fantástico de lo inverosímil.",
    piel_de_asno: "Perrault, 1694. Padre que corteja a su hija con vestidos del color del tiempo, de la luna y del sol. Huye disfrazada de burra con un anillo cenicientesco.",
    princesa_y_el_guisante: "Andersen, 1835. Una reina quiere casar a su hijo con una princesa real. ¿La prueba? una alverja bajo veinte colchones. Si incomoda ¡es princesa!",
    zapatillas_rojas: "Andersen: unas zapatillas que hacen bailar sin parar. Irreversiblemente. Entre raves y Kate Bush. Demasiado horrible para Disney. Andersen, ¡te pasaste!",
    flautista_de_hamelin: "La música como exterminio de ratas y como éxodo infantil. El medioevo era raro: tener ratas o perder niños, elijan, sajones.",
    tres_cerditos: "Folklore inglés: arquitectura como carácter y destino. Ladrillo mata palo y paja: lobo, ídem. La casa propia y firme como happy end y fin en sí mismo.",
    musicos_de_bremen: "Grimm: un burro, un perro, un gato y un gallo — ya viejos y desgastados — arman banda y conquistan una casa. Subversivo y viejo cadáver exquisito.",
    pulgarcito: "Perrault, 1697 — ni primo de la de Andersen. Niño pequeño, hambruna, abandono, ogro caníbal. Migas de pan: el primer fracaso de future-proofing.",
  },
  synonyms: {
    cenicienta: ["la cenicienta", "cinderella"],
    blancanieves: ["blanca nieves", "snow white"],
    bella_durmiente: ["la bella durmiente", "sleeping beauty", "aurora"],
    caperucita_roja: ["caperucita", "la caperucita", "la caperucita roja"],
    hansel_y_gretel: ["hansel y gretel", "hansel", "gretel"],
    sirenita: ["la sirenita", "little mermaid", "ariel"],
    rapunzel: ["rapunzel"],
    rumpelstiltskin: ["rumplestiltskin", "rumpelstiltskin"],
    gato_con_botas: ["el gato con botas", "puss in boots"],
    bella_y_la_bestia: ["la bella y la bestia", "beauty and the beast"],
    pinocho: ["pinocchio"],
    pulgarcita: ["pulgarcita"],
    patito_feo: ["el patito feo", "ugly duckling"],
    traje_nuevo_del_emperador: ["el traje nuevo del emperador", "traje nuevo", "el rey desnudo"],
    jack_y_las_habichuelas: ["jack y las habichuelas magicas", "las habichuelas magicas", "jack and the beanstalk"],
    ricitos_de_oro: ["ricitos de oro", "goldilocks"],
    barba_azul: ["barba azul", "bluebeard"],
    reina_de_las_nieves: ["la reina de las nieves", "snow queen"],
    principe_rana: ["el principe rana", "el principe sapo", "the frog prince"],
    cerillera: ["la cerillera", "la vendedora de fosforos", "la vendedora de cerillas"],
    soldadito_de_plomo: ["el soldadito de plomo", "tin soldier"],
    vasilisa_la_bella: ["vasilisa", "vasilisa la bella"],
    pajaro_de_fuego: ["el pajaro de fuego", "pájaro de fuego", "firebird"],
    momotaro: ["momotaro", "el nino durazno"],
    gata_blanca: ["la gata blanca", "the white cat"],
    ali_baba: ["ali baba", "alí babá", "abrete sesamo", "ábrete sésamo"],
    aladino: ["aladdin", "aladino"],
    simbad: ["sinbad", "simbad el marino"],
    piel_de_asno: ["piel de asno", "donkeyskin"],
    princesa_y_el_guisante: ["la princesa y el guisante", "la princesa y la arveja", "princess and the pea"],
    zapatillas_rojas: ["las zapatillas rojas", "the red shoes"],
    flautista_de_hamelin: ["el flautista de hamelin", "el flautista de hamelín", "pied piper"],
    tres_cerditos: ["los tres cerditos", "the three little pigs"],
    musicos_de_bremen: ["los musicos de bremen", "los músicos de bremen", "town musicians of bremen"],
    pulgarcito: ["pulgarcito", "le petit poucet", "tom thumb"],
  }
});

// ============ HABÍA UNA VEZ EN ============
// ============ CORRIENTES FILOSÓFICAS EN ============
const CORRIENTES_FILOSOFICAS_EN = crearBiblioteca({
  id: "philosophical_currents", level: "hard", lang: "en", field: "humanities",
  name: "Philosophical currents", desc: "Name any philosophical school or movement.",
  total: 33, metmin: 15,
  dificultad: 4, lejania: 3,
  facts: {
    stoicism: "Accept what you can't control; change what you can. One size fits all: Marcus Aurelius (emperor), Seneca (rich), Epictetus (slave), you, me.",
    epicureanism: "Pleasure as absence of pain and anxiety (aponia, ataraxia) — never excess. Gardens, friends, frugal food. Academia and audience getting opposite messages.",
    platonism: "The visible world is shadows of shadows. The cave, the sun, the Ideas. We owe half our Socrates to Plato — but Plato owes more to Socrates.",
    peripateticism: "Aristotle's school — named for the covered walkways of the Lyceum, not for walking. Everything: arts, sciences, gossip. Camels hating incest: probably hearsay.",
    cynicism: "Virtue as the only good; convention, out. The dog (kynos) as ideal. Alexander was a huge fanboy of Diogenes who, in turn, plucked Plato's man.",
    skepticism: "Suspend judgment — certainty is impossible. Nothing is certain, not even this. Pyrrho, Sextus Empiricus. The dogma that eats itself like an ouroboros.",
    cyrenaicism: "Physical and immediate pleasure is the only good. Aristippus of Cyrene charged Socrates for his lessons. So enjoyable no text or school survived.",
    rationalism: "Reason, not the senses, is the primary source of knowledge. Descartes, Spinoza, Leibniz. The cogito, substance, monads — it's all deductions and doubts.",
    empiricism: "Knowledge comes from sensory experience; the mind starts empty. Locke, Hume, Berkeley. Hume and coffee: two stimulants against Kant's dogmatic slumber.",
    neoplatonism: "The One emanates the Intellect; the Intellect, the Soul; the Soul, matter. Plotinus emanates from Plato; Augustine from Plotinus. Epiphenomena all the way down?",
    idealism: "It's all in your mind, but your mind is in God's. Berkeley: 'to be is to be perceived'. Falling trees, Johnson kicking stones: draw?",
    german_idealism: "Fichte, Schelling and Hegel, children squabbling over Kant's critical legacy. Analytic judgment: German idealists are and aren't Kantians.",
    enlightenment: "Reason, science and rights against superstition and tyranny. Voltaire, Rousseau, Kant. The light of the 1700s burned so bright it blinded the 1900s. Reason alone: error.",
    mysticism: "Direct experience of the divine, beyond reason. Eckhart, Saint Teresa, parts of Wittgenstein. The highest lyricism about what's most ineffable.",
    existentialism: "Existence before essence: you exist first, then you become. Sartre, Camus, De Beauvoir. Nausea, Sisyphus smiling, hell as the others, woman as artifact.",
    phenomenology: "Back to the things themselves — describe the experiences themselves, sans biases. Husserl founded it; Heidegger hijacked it, entangled and got the prize.",
    hermeneutics: "Theory of interpretation: from sacred texts to history to human action. Gadamer: to understand is always to reinterpret. The hermeneutic circle has no exit.",
    structuralism: "Meaning arises from systems of negative differences, not positive essences. Saussure for language; Lévi-Strauss for myth. The 20th century for everything.",
    post_structuralism: "Structures exist but are unstable, historical, shot through by power. Foucault archaeologized them; Lyotard declared the end of all metanarratives. And yet...",
    deconstructionism: "Trace it all back towards the origin — which is almost nothing — and watch the text undo its own certainties. Derrida, la *différance* is not a typo.",
    marxism: "History as history of class struggle. Matter determines spirit. Marx vs. Hegel; Lenin vs. Marx; Stalin vs. everybody: say, another purge?",
    materialism: "Reality is fundamentally physical: everything is atoms and void. Democritus came up with it; Hobbes systematized it; La Mettrie scandalized everyone with it.",
    pragmatism: "Truth is whatever works. Peirce, the origin; James, the divulger; Dewey gave it to the masses; Rorty survived them all. Unmistakably American.",
    utilitarianism: "The greatest good for the greatest number. Bentham counted sensations; Mill refined it. The other tyranny — moral here, political there — of the majority.",
    deontology: "Act from duty, not for consequences. The categorical imperative: act as if your action were universal law. Kant couldn't possibly have lied to us.",
    anarchism: "All coercive authority is illegitimate. Proudhon: 'property is theft'. Bakunin and Marx fell out. Kropotkin studied ants. Emma Goldman, everything.",
    vitalism: "Life resists science. Bergson: élan vital. Dilthey: sciences of the spirit. Eternal punching bags for analytic philosophers — and yet, they endure.",
    feminism: "Women's experience taken seriously as philosophy. Innovative, visionary, remarkably late. De Beauvoir grounded it; Butler ungrounded it.",
    postcolonialism: "Critique of colonial power and its legacies. Fanon and the violences. Said and the invented Orient. Spivak: the voice of the sub. The voiceless, now with voice!",
    hedonism: "Pleasure as the highest good — a wide umbrella covering Aristippus (physical, immediate), Epicurus (tranquility) and Onfray (all of the above, without guilt).",
    pessimism: "The will is suffering, not vital impulse. Schopenhauer: long quadruple terms for what Buddhism neither wants nor can say. Anti-Pangloss.",
    positivism: "If not empirically verifiable, it doesn't count as knowledge. The naive 1800s: Comte invented sociology and wanted a religion of Humanity. It didn't go well.",
    logical_positivism: "Metaphysics isn't even false — it's meaningless. Vienna Circle: Carnap, Schlick, Neurath. The war scattered them; Wittgenstein dismantled them.",
  },
  synonyms: {
    enlightenment: ["the enlightenment", "age of enlightenment", "age of reason"],
    german_idealism: ["german idealism"],
    post_structuralism: ["post-structuralism", "poststructuralism"],
    deconstructionism: ["deconstruction", "deconstructivism"],
    logical_positivism: ["logical positivism", "logical empiricism"],
    postcolonialism: ["post-colonialism", "postcolonial theory"],
    cyrenaicism: ["cyrenaism"],
    peripateticism: ["peripatetic school"],
  }
});

const HABIA_UNA_VEZ_EN = crearBiblioteca({
  id: "once_upon_a_time", level: "hard", lang: "en", field: "humanities",
  name: "Once Upon a Time", desc: "Name any fairy tale or classic children's story.",
  total: 35, metmin: 15,
  dificultad: 3, lejania: 2,
  facts: {
    cinderella: "Rhodopis was the first — Greek-Egyptian, sandal stolen by an eagle. Perrault made it glass; the masses preferred gold. The pumpkin coach was Disney's.",
    snow_white: "Grimm, 1812. The Evil Queen didn't want her heart — but her lungs and liver, vanity or anemia? Her sister, Rose Red didn't make the cut.",
    sleeping_beauty: "Pregnant for two centuries, unknowingly because of deep sleep. Consensus: zero consent. Her alarm clock: a kiss (Grimm) or a splinter.",
    little_red_riding_hood: "Perrault gives a banquet to the wolf: grandma as an entrée, the girl as the main. Zero saviors/page in the classic. Don't trust strangers. Or anyone.",
    hansel_and_gretel: "Famine, Little Ice Age, forest abandonment, a witch and a lifesaving oven. Were they bounty hunters? Are you really asking that about children?",
    little_mermaid: "For him, she walked as if on broken glass. He picked the other girl; she dissolved into sea foam. Given it's Andersen's, it feels almost happy.",
    rapunzel: "The Grimms pull no punches: pregnancy revealed by tight clothes, exile, and a prince blinded by thorns. Happy ending anyways and great conditioner.",
    rumpelstiltskin: "Gold for firstborns (DO read the fine print). The horror isn't the imp — it's the contractual law that followed it. At least Shylock was naive.",
    puss_in_boots: "Perrault, 1697. A cat with nothing to his name invents the Marquis of Carabas from scratch. Fraud as art form and political theory.",
    beauty_and_the_beast: "Madame de Villeneuve, 1740 — not Disney's, not Beaumont's, both were mere summarizers. Unabridged: much longer, much weirder.",
    pinocchio: "Collodi, 1883, Italian. The talking cricket dies on page 3 — squashed by Pinocchio. Returns as a ghost conscience. Also, the boy was the villain.",
    thumbelina: "Andersen, 1835: Girl the size of a thumb, kidnapped by toads, engaged to a mole, saved by a swallow. Nobody asked what she wanted.",
    ugly_duckling: "Too much suffering, and then selfknowledge. Some say all's well that ends well, but poor swan. The literal rara avis that ended up happy in Andersen.",
    emperors_new_clothes: "Andersen, 1837. Con artists, politics and fashion as insights into what truth actually is. Oversight in both senses started here.",
    jack_and_the_beanstalk: "English oral tradition. Magic beans, sleeping giant, a singing harp. Thieves robbing thieves: the OG entrepreneurship.",
    goldilocks: "Breaking and entering with a succession of suspects: old woman, fox, blonde girl. The bears: victims if a bit radical. The girl: guilty of mediocrity.",
    bluebeard: "Perrault, 1697. Serial wife-killer, forbidden room, notable beard. Gilles de Rais? —No way, slander: his thing was children.",
    snow_queen: "Andersen, 1844: Kay and Gerda. A broken mirror, a splinter in the eye, a heart of ice. Inspired Narnia and Frozen. Both omitted the pain.",
    frog_prince: "It evolved alongside love: the spell, traditionally broken by throwing the frog against the wall, now operates via kiss. Progress is undeniable.",
    little_match_girl: "No wolves, no witches, barely any grandmothers — and still the most terrible. A girl dying alone of cold and hunger on Christmas Eve. Andersen: enough!",
    tin_soldier: "An impossible love: a one-legged tin soldier and a paper dancer. Love burns — as do they. Is it better to have loved and burned or to not have loved at all?",
    vasilisa: "The Russian Cinderella, costarring Baba Yaga. Darker, stranger, more chicken legs. The doll inherited from her dead mother: the thread that saves her.",
    firebird: "Russian folklore: a luminous bird both blesses and curses its captors. Stravinsky turned it into ballet and Paris into a riot. As Paris usually does.",
    momotaro: "The Peach Boy, Japan's most beloved hero — born from a giant peach, raised by old folks, conqueror of Demon Island. No irony, no added sugar.",
    white_cat: "Madame d'Aulnoy, 1698. The OG once upon a time. A queen transformed into a cat; subtle fabrics, tiny seeds and tiny pets. The most precious style.",
    ali_baba: "One Thousand and One Nights. Forty thieves, a cave, the most famous password ever (just don't use it online). Early opening between east and west.",
    aladdin: "Originally set in China, not Arabia — one of translator Galland's many delightful errors. Another one: inventing the genie of the lamp.",
    sinbad: "Seven voyages, each more impossible than the last. The Arabic Odyssey: monsters, shipwrecks, riches. Baghdad pre-Mongol: the original fantastic port.",
    donkeyskin: "Perrault, 1694. A father who courts his daughter with dresses the color of time, the moon and the sun. She flees in a donkey skin with a Cinderella-ish ring.",
    princess_and_the_pea: "Andersen, 1835. A queen wants a real princess for her son. The test? A pea under twenty mattresses. Felt it? Welcome, your majesty.",
    red_shoes: "Andersen: Shoes that make you dance. Always, irreversibly. Between raves and Kate Bush. Too horrible for Disney. Andersen, you went too far!",
    pied_piper: "Music: between rat extermination and literal kidnappings. The Middle Ages were odd: pick your poison — rats or missing children, Saxons.",
    three_little_pigs: "English folklore: architecture as character and destiny. Brick beats wood and straw — wolf, idem. Ownership and brick as the ultimate happy ending.",
    musicians_of_bremen: "Grimm: a donkey, a dog, a cat and a rooster — old and worn out — form a band and take over a house. Subversive and a very old cadavre exquis.",
    tom_thumb: "Perrault, 1697 — no relation to Andersen's tiny girl. Small boy, famine, abandonment, cannibal ogre. Breadcrumbs: the first failure of future-proofing.",
  },
  synonyms: {
    cinderella: ["cinderella"],
    snow_white: ["snow white", "snowwhite"],
    sleeping_beauty: ["sleeping beauty", "aurora", "briar rose"],
    little_red_riding_hood: ["little red riding hood", "red riding hood"],
    hansel_and_gretel: ["hansel and gretel", "hansel", "gretel"],
    little_mermaid: ["little mermaid", "the little mermaid", "ariel"],
    rapunzel: ["rapunzel"],
    rumpelstiltskin: ["rumpelstiltskin", "rumplestiltskin"],
    puss_in_boots: ["puss in boots"],
    beauty_and_the_beast: ["beauty and the beast"],
    pinocchio: ["pinocchio"],
    thumbelina: ["thumbelina"],
    ugly_duckling: ["ugly duckling", "the ugly duckling"],
    emperors_new_clothes: ["the emperor's new clothes", "emperor's new clothes", "emperors new clothes"],
    jack_and_the_beanstalk: ["jack and the beanstalk", "jack and the bean stalk"],
    goldilocks: ["goldilocks", "goldilocks and the three bears"],
    bluebeard: ["bluebeard", "blue beard"],
    snow_queen: ["the snow queen", "snow queen"],
    frog_prince: ["the frog prince", "frog prince"],
    little_match_girl: ["the little match girl", "little match girl"],
    tin_soldier: ["the tin soldier", "tin soldier", "the steadfast tin soldier"],
    vasilisa: ["vasilisa", "vasilisa the beautiful"],
    firebird: ["the firebird", "firebird"],
    momotaro: ["momotaro", "the peach boy"],
    white_cat: ["the white cat", "white cat"],
    ali_baba: ["ali baba", "ali baba and the forty thieves", "open sesame"],
    aladdin: ["aladdin", "aladdin and the magic lamp"],
    sinbad: ["sinbad", "sinbad the sailor"],
    donkeyskin: ["donkeyskin", "donkey skin", "peau d'ane"],
    princess_and_the_pea: ["the princess and the pea", "princess and the pea"],
    red_shoes: ["the red shoes", "red shoes"],
    pied_piper: ["the pied piper", "pied piper", "pied piper of hamelin"],
    three_little_pigs: ["the three little pigs", "three little pigs"],
    musicians_of_bremen: ["the musicians of bremen", "musicians of bremen", "town musicians of bremen"],
    tom_thumb: ["tom thumb"],
  }
});

// ============ EXPRESIONES FRANCESAS ============

// IC ES — criterio (Milo, 13/07): decir la versión francesa en vez de la calcada española
// es un acto de registro/pertenencia a círculo culto, no de necesidad léxica.
// 5 entradas con nota de vanity-riesgo (⚠️): coup d'état, nouveau riche, petite bourgeoisie,
// beaux arts, faux amis — monitorear en testeo, podar si nadie las pone nunca.
// JMAHM completo: todas las FTs aprobadas por Milo.

const EXPRESIONES_FRANCESAS_ES = crearBiblioteca({
  id: "expresiones_francesas", level: "hard", lang: "es", field: "humanidades",
  name: "Expresiones francesas", desc: "Nombra cualquier expresión francesa de uso en español culto.",
  total: 95, metmin: 35,
  dificultad: 4, lejania: 3,
  facts: {
    "avant-garde": "Literalmente: lo que va adelante (del ejército). Del campo de batalla a galerías y museos: el arte como avanzada ante el porvenir.",
    "hors d'œuvres": "Fuera de la obra — los bocados previos al plato principal. También \"fuera de lo principal\": el aperitivo delicioso que a menudo querríamos repetir.",
    "vis-à-vis": "Cara a cara — literalmente, rostro frente a rostro. Por los carruajes donde los pasajeros, quisieran o no, se daban la cara.",
    "tête-à-tête": "Cabeza a cabeza, íntimamente. Conversación entre dos, y sin testigos. También: sofá doble curvo donde dos personas se sientan y se miran.",
    "ménage à trois": "Hogar de tres. Ménage (hogar/gestión doméstica) pero con +1. La erótica del eufemismo: entre francesa o latina, sea cual sea la lengua.",
    "coup d'état": "Golpe de estado. La acción y el concepto son franceses. Desde Napoleón y en los más diversos contextos: un término indómito y perenne. A la francesa.",
    "ancien régime": "El régimen antiguo — lo de antes de la Revolución Francesa. Ahora: cuasisinónimo de \"de antier\", papá retrógrado, o no me gusta (pero en francés).",
    "nouveau riche": "Nuevo rico. El que sabe sabe, el que no, lo dice en vernáculo y pasa vergüenzas. El que es más antiguo y rico aún más habla de la petite b...",
    "tableau vivant": "Cuadro vivo — recreación humana pero estática de una imagen. Salones aristocráticos, Madonna, pesebres y Vogue: el cuerpo como composición y arte.",
    "prêt-à-porter": "Listo para llevar. Chanel y el siglo XX democratizaron la moda. La alternativa a la haute couture: lujo accesible, elegancia en serie. Verdugo de auras.",
    "art nouveau": "Arte nuevo — estilo orgánico y floral de 1890-1910. Mucha, Klimt, el metro de París. La naturaleza sinuosa, la diva, la ponzoña: arquitectura, joyería, pósters.",
    "beaux arts": "Bellas artes — pero aún más bellas por francesas. Transforman a París de laberinto medieval a avenidas y edificios públicos \"civilizados\". No se gana en todo.",
    "trompe l'œil": "Engaña el ojo — pintura que engaña con moscas, perspectiva simulada, cortinajes. Frescos romanos, trampantojos y por encima: Magritte.",
    "faux pas": "Paso en falso — literal. La falta social notada pero no acusada. Miradas de complicidad, sorna y superioridad. Lo hablamos luego en privado.",
    "faux amis": "Falsos amigos — palabras parecidas entre idiomas, que te ponen en ridículo. Terrible y embarazada vs. Terrific and embarrassed. Tan bizarro.",
    "chef d'œuvre": "Obra maestra — la obra cumbre de un creador. Del sistema gremial medieval (la obra, aval del maestro). El que lo dice rara vez las crea.",
    "à propos": "A propósito — en el momento justo, viniendo al caso. La versión española ya es casi un non sequitur. La francesa, casi un adjetivo.",
    "comme ci comme ça": "Así o asá — ni bien ni mal, más o menos. La respuesta francesa a ¿cómo estás? desde la más hermética *politesse* y la ambigüedad educada.",
    "sous-chef": "Bajo el chef — el contramaestre de la cocina. El que pica y suda mientras el jefe triunfa y saluda.",
    "filet mignon": "Filete tierno — literalmente, filete pequeño y delicado. El más noble del lomo. Francia le puso nombre y tocineta y champiñones; el mundo, precio.",
    "je ne sais quoi": "No sé qué — definiendo lo indefinible desde la indefinición. El francés la lengua que se resiste a ser palabras, diría Saussure. Encanto presente y tácito.",
    "comme il faut": "Como debe ser — lo correcto, lo apropiado, lo que se espera. Convención tan obvia que va en tres palabras (y una mirada).",
    "au gratin": "Gratinado — con queso o pan rallado dorado al horno. De sobras a guarnición de lujo: la costra como redención culinaria, solo Francia podía descubrirlo.",
    "au pair": "A la par — chica (o chico) extranjera cuida niños por alojamiento y clases del idioma. Tantos lo anhelan hasta que lo hacen. El francés, el mejor marketing.",
    "bien-pensant": "Bien pensante — el que piensa lo que se debe pensar, según quien decide qué se debe. ¿Para qué ser librepensador pudiendo ser correcto?",
    "blasé": "Hastiado, quemado, de vuelta y a prueba de todo. El parisino arquetípico: nada sorprende, nada entusiasma, todo ya lo vio. Callo general.",
    "bon mot": "Buena palabra — el comentario puntual, ingenioso, gracioso y oportuno. Lo que hace de los franceses, gloriosos y odiosos interlocutores.",
    "bon vivant": "El que vive bien — goza sin culpa: mesa, vino, compañía. Ni glotón ni vicioso: hace de la buena vida un arte y se nota.",
    "cause célèbre": "Causa célebre — el caso símbolo de las grandes causas. Dreyfus fue la primera; hoy cada semana hay tres. Lo célèbre es warholiano.",
    "chaise longue": "Silla larga — el sofá para reclinarse a medias. Del salón burgués al diván del psicoanalista. Tendida en ella fumaba Sarita, diría un crucigrama.",
    "cinéma vérité": "Cine verdad — el documental sin guion que sigue la realidad con cámara en mano. La cámara el testigo más incómodo. En su versión más baja, la cámara escondida.",
    "cordon bleu": "Cinta azul — la condecoración más alta del Ancien Régime, luego celebérrima escuela de cocina, luego pollo relleno de queso y jamón. Progreso.",
    "coup de grâce": "Golpe de gracia — el tiro final que despacha. Del campo de batalla a cualquier metáfora de ahora a la novelita de Yourcenar.",
    "décolleté": "Descotado — el escote como decisión estética y social. La Corte lo reglamentó. Cuánto es demasiado: cuando el anterior y el posterior ya se juntan.",
    "dénouement": "Desenlace — el nudo que se desenreda al final. Del teatro clásico a toda narrativa: el momento final, pase lo que pase. Godard: cuando sea.",
    "détente": "Distensión — relajación de tensiones entre enemigos. Nixon y Kissinger con la URSS o el inglés con el francés lengua y diplomacia de facto.",
    "émigré": "Emigrado — quien huye de su país por razones políticas. Originalmente: los nobles que huyeron de la Revolución Francesa. Luego: todos los demás, aller-retour.",
    "en passant": "De paso — incidentalmente. También: la captura de peón más elegante del ajedrez, la que pierden miopes de visión o temporalidad.",
    "esprit de corps": "Espíritu de cuerpo — la cohesión y lealtad que une a un grupo. Militar, empresarial, colectiva, gestaltiana. Difícil de lograr conociendo a ton chef.",
    "fait accompli": "Hecho consumado, prueba superada — lo que pasó, pasó. La diplomacia y la Realpolitik casadas por el cinismo. ¿Mejor negociar o ganar?",
    "femme fatale": "Mujer fatal — la que seduce y destruye. Del mito a la pantalla negra: Lilith, Judith, Dalila, Mata Hari, Dietrich, Stanwyck. Me asusta pero me gusta.",
    "fiancé": "Prometido/a — las parejas hispanas más esnob lo usan para creerse americanas. El limbo entre el compromiso y la boda y la pesadilla de la convivencia.",
    "en route": "En camino — de paso, en tránsito. El estado más honesto de casi todo proyecto ambicioso, de tus paquetes más valiosos y de tus planes más endebles.",
    "film noir": "Cine negro — la corrupción americana bajo la luz francesa. Bogart de gabán, Stanwyck y los seguros, halcones, ocasos, persianas: el pesimismo como estética.",
    "fin de siècle": "Fin de siglo — agotamiento elegante de una época. El XIX que termina entre decadentismo, extenuación y presagio. Cada siglo tiene el suyo desde el XIX.",
    "haute couture": "Alta costura — la moda medida en horas de trabajo de artesanos especializados. Única, medida, irrepetible. Arte opuesto al prêt-à-porter.",
    "haute cuisine": "Alta cocina — la gastronomía como arte mayor. Carême la codificó, Escoffier la exportó, Bocuse trató de democratizarla. Michelin la difundió.",
    "hors de combat": "Fuera de combate — herido, incapacitado, eliminado de la lid. Del campo de batalla al K.O en el ring: suspende el juego y sus reglas.",
    "idée fixe": "Idea fija — el pensamiento que no se va. Obsesión intelectualizada. Berlioz la convirtió en técnica musical; Freud, en síntoma.",
    "impasse": "Sin salida — literalmente, callejón sin salida. La negociación que llegó al punto muerto. Si ni en francés se puede solucionar, renuncie o dígale aporía.",
    "laissez-faire": "Dejen hacer — la mano invisible se ve al frenar al Estado. Los fisiócratas lo inventaron; Smith lo difundió; el XIX lo sufrió; el XXI lo discute.",
    "liaison": "Enlace, vínculo — pero casi siempre innominado. La relación extramarital con más glamour. También: salsa y fenómeno fonético.",
    "milieu": "Medio, ambiente, entorno — el contexto social de formación. Zola lo hizo sistema; la sociología lo adoptó. Yo soy yo y mi circunstancia, diría Ortega.",
    "mise en scène": "Puesta en escena — lo que el director pone ante la cámara. Encuadre, luz, actores, decorado. La marca visible del estilo del cineasta.",
    "mot juste": "La palabra justa — la única palabra correcta para cada cosa. Obsesiva y flaubertiana, agónica en la punta de la lengua, víctima del traductor.",
    "noblesse oblige": "La nobleza obliga — quien tiene privilegios tiene deberes. Entre responsabilidad social y cuidar el propio pellejo perfumado.",
    "nom de plume": "Nombre de pluma — seudónimo literario. Voltaire, Stendhal, George Sand, Neruda: no los llamaban a almorzar con esos nombres tan cultos.",
    "nonchalance": "Despreocupación elegante, desparpajo de calidad — la calma sin esfuerzo. ¿Nada te afecta? ¿Todo te afecta? Nadie tendrá como saberlo.",
    "nouvelle vague": "Nueva ola — la conmoción francesa de los 60. Godard, Truffaut, Chabrol. Moreau, Léaud, Belmondo y Karina: nos enamoraron a todos.",
    "objet d'art": "Objeto de arte — el chéchere obra, la pieza decorativa con mayúcula. Entre el arte y la industrial: el diseño que sí se graduó. O lo finge.",
    "par excellence": "Por excelencia — no solo antonomasia: sobresaliencia. La imagen en el diccionario Larousse, la foto en el menú Michelin, la entrada de la Encyclopedie.",
    "passé": "Pasado de moda — fue pero ya se fue y (esperamos) nunca volverá. Más despectivo que anticuado, más elegante que out.",
    "papier-mâché": "Papel mas(ti)cado — pulpa de papel y cola que al secar se vuelve rígida. Carnavales, piñata, fallas de Valencia: entre sublime y desechable, siempre popular.",
    "pièce de résistance": "Pieza de resistencia — el plato fuerte, el número estelar, la estrella de la velada. Tírale lo que quieras y si algo sobrevive es ella.",
    "protégé": "Protegido — el joven talento bajo el ala de un maestro o mecenas. Más pecuniario que aprendiz, más artístico que becario. Relación eterna.",
    "roman à clef": "Novela con llave — ficción donde los personajes son reales disfrazados. À la recherche, Capote: ¿Venganza literaria u homenaje? Casi siempre la primera.",
    "savoir-faire": "Saber hacer — habilidad práctica y tacto ejecutado. No es talento ni conocimiento: es hacer lo correcto en el momento justo. La muscle memory general.",
    "soirée": "Velada — la reunión nocturna elegante. Más que un coctel, menos que un baile: el formato burgués para la conversación, la música y el flirteo con protocolo.",
    "touché": "Tocado — la estocada decisiva. De la esgrima a la conversación: el gesto de quien pierde un punto y trata de asumirlo con elegancia.",
    "mise en place": "Todo en su lugar — la preparación previa culinaria: ingredientes, utensilios, limpieza. Madre de la delicia, la higiene y que te quieran seguir visitando.",
    "vernissage": "Barnizado — inauguración privada de una exposición. Vino, artistas, críticos, tú: Arte con aviso de 'recién pintado' todavía.",
    "beau monde": "Bello mundo — la alta sociedad elegante y bien relacionada a la que, esperamos, perteneces. Un reflejo hermoso en el espejo y Proust analítico en medio.",
    "d'accord": "De acuerdo — sí, pero más allá de eso, concuerdo. Mi aprobación subjetiva importa tanto o más que el hecho. Te hace sonar refinado y sabio (y soberbio).",
    "au contraire": "Al contrario — decir que no en la cara del otro, de frente pero con clase. Dado el carácter usual de los franceses, casi que no debería ya existir.",
    "agent provocateur": "Agente provocador — infiltrado que incita al grupo que espía. De la policía zarista a la lencería de lujo: la marca trasnacional más sincera.",
    "maître d'": "Maître d'hôtel abreviado — el coordinador del restaurante te recibe, te ubica, te ignora y te insulta. Como debe ser. El encanto discreto de la burguesía.",
    "potpourri": "Literalmente: olla podrida — mezcla olorosa de pétalos secos y especias. Rara vez un elogio, a menos que hablemos de músicos con TDAH.",
    "bête noire": "Bestia negra — tu némesis personal. Propia, irracional, intensa y constante. Cada quien tiene la suya y rara vez la elige o elimina.",
    "plat du jour": "Plato del día — carpe diem culinario y por que toca. El rasero democrático de la fortuna: si no le gusta, cocine o pida a la...",
    "avant la lettre": "Antes de la palabra — prefigurar, hacer algo antes de que exista el término para ello. Incomprendidos, visionarios, locos: pioneros avant la lettre.",
    "presque rien": "Casi nada — el título que Jankélévitch le dio a su filosofía de lo inefable. Liminal a lo perceptible. Apenas algo, pero ahí.",
    "joie de vivre": "Alegría de vivir — el entusiasmo irrazonable por estar vivo. Matisse la pintó, Zola la tituló. El francés lengua exaltada y jovial a priori.",
    "petite mort": "Pequeña muerte — disolución orgásmica en el todo: ¿conciencia? ¿para qué?. Eufemismo clásico entre el placer y la nada. Freud y Bataille: lectores literales.",
    "enfant terrible": "Niño terrible — no solo es detestable por talentoso, sino porque te hace sentir viejo. Artista, genio o simplemente insoportable.",
    "vol-au-vent": "Vuela en el viento — hojaldre tan ligero que casi flota. Carême lo bautizó en el XIX. Hoy: entrada clásica, boda común, buffet de empresa. Poulet et duxelles.",
    "raison d'être": "Razón de ser que justifica la existencia de algo o alguien. La nuestra: el saber y el grotesco. Si tienes que preguntárselo a un filósofo es que no la tienes.",
    "déjà vu": "Ya visto — la sensación de haber vivido este momento antes. Neurólogos: lo discuten en eternos deja vus. Proust: novela entera. El francés inefable y diciente.",
    "carte blanche": "Carta en blanco — autorización total, sin letras menudas. Poder absoluto delegado: allí donde fueres, haz lo que quieres, que yo respondo (si algo).",
    "en masse": "En masa — todos juntos, en bloque, sin distinción. De los ejércitos a las redes sociales a Elías Canetti: la cantidad como argumento horrible.",
    "force majeure": "Fuerza mayor — imprevistos ineludibles. El francés del derecho como eufemismo para procesos subpilóricos, menstruales, catástrofes, perezas...",
    "tour de force": "Vuelta de fuerza — hazaña de habilidad o virtuosismo. Parecía imposible y lo lograste como si nada. No falta en cada reseña literaria.",
    "pied-à-terre": "Pie en tierra — apartamento pequeño en una ciudad donde no se vive del todo. El lujo discreto de tener dónde caer muerto si algo.",
    "sangfroid": "Sangre fría — calma bajo presión extrema. ¿Poiquilotérmico? Al revés, controlo mi stiff upper lip ad libitum.",
    "à la carte": "A la carta — ordene lo que se le antoje, querido acaudalado, estamos a su servicio. La contraparte del menú fijo del día de las masas.",
    "double entendre": "Doble sentido — expresión con dos lecturas, una inocente y una de Mae West. Hoy día más inglesa que francesa, pardon my french.",
  },
  synonyms: {
    "avant-garde": ["avant garde", "avantgarde"],
    "hors d'œuvres": ["hors d'oeuvres", "hors doeuvres", "hor d'oeuvres"],
    "vis-à-vis": ["vis a vis", "vis-a-vis"],
    "tête-à-tête": ["tete a tete", "tête a tête", "tete-a-tete"],
    "ménage à trois": ["menage a trois", "ménage a trois", "menage à trois"],
    "coup d'état": ["coup d'etat", "coup detat", "coup d etat"],
    "ancien régime": ["ancien regime"],
    "prêt-à-porter": ["pret a porter", "pret-a-porter", "prêt a porter"],
    "beaux arts": ["beaux-arts"],
    "trompe l'œil": ["trompe l'oeil", "trompe loeil", "trompe-l'oeil"],
    "faux pas": ["faux-pas"],
    "chef d'œuvre": ["chef d'oeuvre", "chef doeuvre"],
    "à propos": ["a propos", "apropos"],
    "comme ci comme ça": ["comme ci comme ca"],
    "sous-chef": ["sous chef"],
    "blasé": ["blase"],
    "cause célèbre": ["cause celebre"],
    "cinéma vérité": ["cinema verite", "cinema verité"],
    "cordon bleu": ["cordon bleu"],
    "coup de grâce": ["coup de grace"],
    "décolleté": ["decollete"],
    "dénouement": ["denouement"],
    "détente": ["detente"],
    "émigré": ["emigre"],
    "esprit de corps": ["esprit de corps"],
    "fait accompli": ["fait accompli"],
    "femme fatale": ["femme fatale"],
    "fiancé": ["fiance", "fiancée", "fiancee"],
    "bien-pensant": ["bien pensant"],
    "chaise longue": ["chaise lounge", "chaise longue"],
    "bon vivant": ["bon vivant"],
    "fin de siècle": ["fin de siecle", "fin du siecle"],
    "haute couture": ["haute couture"],
    "haute cuisine": ["haute cuisine"],
    "hors de combat": ["hors de combat"],
    "idée fixe": ["idee fixe"],
    "laissez-faire": ["laissez faire", "laissez-faire"],
    "milieu": ["milieu"],
    "mise en scène": ["mise en scene", "mise-en-scene"],
    "noblesse oblige": ["noblesse oblige"],
    "nom de plume": ["nom de plume"],
    "nouvelle vague": ["nouvelle vague"],
    "objet d'art": ["objet d'art", "objet dart"],
    "par excellence": ["par excellence"],
    "papier-mâché": ["papier mache", "papier-mache"],
    "pièce de résistance": ["piece de resistance", "pièce de resistance"],
    "protégé": ["protege"],
    "roman à clef": ["roman a clef", "roman à clef"],
    "savoir-faire": ["savoir faire"],
    "soirée": ["soiree"],
    "touché": ["touche"],
    "mise en place": ["mise en place"],
    "vernissage": ["vernissage"],
    "beau monde": ["beau monde"],
    "d'accord": ["d accord", "daccord"],
    "au contraire": ["au contraire"],
    "agent provocateur": ["agent provocateur"],
    "émigré": ["emigre"],
    "film noir": ["film noir"],
    "liaison": ["liaison"],
    "roman à clef": ["roman a clef"],
    "maître d'": ["maitre d", "maitre d'", "maître d"],
    "bête noire": ["bete noire"],
    "plat du jour": ["plat du jour"],
    "avant la lettre": ["avant la lettre"],
    "presque rien": ["presque rien"],
    "joie de vivre": ["joie de vivre"],
    "petite mort": ["petite mort"],
    "vol-au-vent": ["vol au vent", "volovan", "vol-au-vent"],
    "raison d'être": ["raison d'etre", "raison detre"],
    "déjà vu": ["deja vu", "déja vu"],
    "carte blanche": ["carte blanche"],
    "force majeure": ["force majeure"],
    "tour de force": ["tour de force"],
    "pied-à-terre": ["pied a terre", "pied-a-terre"],
    "à la carte": ["a la carte"],
    "double entendre": ["double entendre"],
  }
});
const EXPRESIONES_FRANCESAS_EN = crearBiblioteca({
  id: "expresiones_francesas_en", level: "hard", lang: "en", field: "humanidades",
  name: "French expressions", desc: "Name any French expression or locution in common cultured use.",
  total: null, dificultad: 4, lejania: 3,
  facts: {
    "avant-garde": "Literally: what goes ahead (of the army). From battlefield to galleries and museums: art guarding us from the future.",
    "hors d'œuvres": "Outside the work — the bites before the main course. Also: the only French term that English spelling made worse. What everyone wants seconds of.",
    "vis-à-vis": "Face to face — literally, face opposite face. From carriages where passengers, whether they liked it or not, faced each other.",
    "tête-à-tête": "Head to head, intimately. Conversation between two, without witnesses. Also: a double curved sofa where two people sit facing each other.",
    "ménage à trois": "Household of three. Ménage (home/domestic management) but with +1. French and Latin, the classiest sources of erotic euphemisms.",
    "coup d'état": "Stroke of state. The action and the concept are French. From Napoleon onward, in the most diverse contexts: an untameable and perennial term. Very French.",
    "ancien régime": "The old regime — what came before the French Revolution. Now: quasi-synonym for whatever came before, or whatever authority survives.",
    "nouveau riche": "Newly rich. If you know, you know; if not, you say it in the vernacular (such a misstep, wink). The older, richer and wiser say petite b...",
    "tableau vivant": "Living picture — human but static recreation of an image. Aristocratic salons, Madonna, nativity scenes and Vogue: the body as composition and art.",
    "prêt-à-porter": "Ready to wear. Chanel and the 20th century democratized fashion. Alternative to haute couture: accessible luxury, serialized elegance. Killer of auras.",
    "art nouveau": "New art — organic and floral style from 1890-1910. Mucha, Klimt, the Paris metro. Sinuous nature, the diva, the poison: architecture, jewellery, posters.",
    "beaux arts": "Fine arts — and even finer just because French. Transformed Paris from medieval labyrinth to boulevards and public buildings.",
    "trompe l'œil": "Deceives the eye — painting that fools with flies, simulated perspective, drapery. Roman frescoes, trompe l\'oeils and above all: Magritte.",
    "faux pas": "False step — literal. The social slip noticed but not called out. Knowing glances, mockery and superiority. Let\'s discuss it later... in private.",
    "faux amis": "False friends — similar words that mean differently across languages. La monnaie is and is not a coin, because un coin is a french corner. Grande deception!",
    "chef d'œuvre": "Masterpiece — the crowning work of a creator. From the medieval guild system (the work, the master\'s credential). Those who say it rarely create them.",
    "à propos": "To the point — at the right moment, coming to the matter, by the way. In French it\'s almost an adjective, and usually more precise than in translation.",
    "comme ci comme ça": "So-so — neither good nor bad, more or less. The French answer to how are you? Courtesy of the most hermetic politesse and educated ambiguity.",
    "sous-chef": "Under the chef — the kitchen\'s second-in-command. The one who chops and sweats while the boss triumphs and waves.",
    "filet mignon": "Tender fillet — literally, small and delicate cut. The noblest of the loin. France gave it a name and bacon and mushrooms; the world gave it a price.",
    "je ne sais quoi": "I don\'t know what, noun — defining the indefinable through indefinition. Saussure would say: a subtle break between langue and parole.",
    "comme il faut": "As it should be — the correct, appropriate, expected thing. Convention so obvious it fits in three words (and a stern look).",
    "au gratin": "Gratinated — with golden cheese or breadcrumbs from the oven. From leftovers to luxury garnish: the crust as culinary redemption.",
    "au pair": "At par — foreign girl (or boy) cares for children in exchange for lodging and language classes. So many want it until they do it. French: the best marketing.",
    "bien-pensant": "Right-thinking — the one who thinks what ought to be thought, according to whoever decides what ought to be. Why be a freethinker when you can be correct?",
    "blasé": "Jaded, burnt out, seen it all. The archetypal Parisian: nothing surprises, nothing excites, all already seen. Great chaos: general silence.",
    "bon mot": "Good word — the timely, witty, gracious and apt remark. What makes the French such glorious and insufferable interlocutors.",
    "bon vivant": "One who lives well — enjoys without guilt: table, wine, company. Neither glutton nor profligate: the good life as an art, and it shows.",
    "cause célèbre": "Famous cause — the symbolic case of great causes. Dreyfus was the first; today there are three a week. The célèbre is Warholian.",
    "chaise longue": "Long chair — the sofa for half-reclining. From the bourgeois salon to the psychoanalyst\'s couch. The most mispronounced piece of furniture in English.",
    "cinéma vérité": "Truth cinema — the handheld documentary follows reality sans script. Camera as intruder and witness. At its lowest: the hidden camera.",
    "cordon bleu": "Blue ribbon — the highest decoration of the Ancien Régime, then a celebrated cooking school, then chicken stuffed with cheese and ham. Progress.",
    "coup de grâce": "Stroke of grace — the final shot that finishes it. From battlefield to any metaphor, to Yourcenar\'s novel of the same name.",
    "décolleté": "Décolletaged — the neckline as aesthetic and social decision. The Court regulated it. How much is too much: when front and back already meet.",
    "dénouement": "Unravelling — the knot that comes undone at the end. From classical theatre to all narrative: the final moment, whatever happens. Godard\'s: whenever.",
    "détente": "Easing — relaxation of tensions between enemies. Nixon and Kissinger with the USSR, or English with French as de facto diplomatic language.",
    "émigré": "Emigrant — one who flees their country for political reasons. Originally: nobles who fled the French Revolution. Then: everyone else, aller-retour.",
    "en passant": "In passing — incidentally. Also: the most elegant pawn capture in chess, the one missed by the short-sighted or temporally impaired.",
    "esprit de corps": "Spirit of the body — the cohesion and loyalty that unites a group. Military, corporate, collective, Gestaltian. Hard to achieve when you know ton chef.",
    "fait accompli": "Accomplished fact — whatever happened, happened. Diplomacy and Realpolitik married by cynicism. Why negotiate when you can win?",
    "l'esprit de l'escalier": "The staircase wit — the perfect comeback strikes only after you\'re gone. Serious debate: is this or the Encyclopédie Diderot\'s greatest contribution?",
    "femme fatale": "Fatal woman — she who seduces and destroys. From myth to the silver screen: Lilith, Judith, Delilah, Mata Hari, Dietrich, Stanwyck. Terrifying and irresistible.",
    "fiancé": "Betrothed — French conquered love long ago, or at least its terminology. The limbo between the engagement and the nightmare of cohabitation.",
    "en route": "On the way — in transit, passing through. The most honest state of almost every ambitious project, your most valuable packages, and your flimsiest plans.",
    "film noir": "Black film — American corruption under French light. Bogart in a trench coat, Stanwyck and insurance, falcons, sunsets, venetian blinds: pessimism as aesthetic.",
    "fin de siècle": "End of century — the elegant exhaustion of an era. The 19th century ending in decadentism, depletion and foreboding. Every century has had its own since.",
    "haute couture": "High dressmaking — fashion measured in hours of specialized craftwork. Unique, tailored, unrepeatable. Art opposite to prêt-à-porter.",
    "haute cuisine": "High cooking — gastronomy as major art. Carême codified it, Escoffier exported it, Bocuse tried to democratize it. Michelin diffused it.",
    "hors de combat": "Out of combat — wounded, incapacitated, eliminated from the fray. From battlefield to K.O. in the ring: suspends the game and its rules.",
    "idée fixe": "Fixed idea — the thought that won\'t leave. Intellectualized obsession. Berlioz made it a musical technique; Freud, a symptom.",
    "impasse": "No way through — literally, a dead-end street. The negotiation that reached a standstill. If not even French can solve it, give up or call it aporia.",
    "laissez-faire": "Let it be done — the invisible hand when the State steps back. The physiocrats coined it; Smith spread it; the 19th century suffered it; the 21st debates it.",
    "liaison": "Link, bond — but almost always unnamed. The extramarital relationship with the most glamour. Also: a sauce and a phonetic phenomenon.",
    "milieu": "Environment, surroundings — the social context of formation. Zola made it a system; sociology adopted it. I am myself and my circumstance, Ortega would say.",
    "mise en scène": "Staging — what the director places before the camera. Framing, light, actors, set. The visible mark of a filmmaker\'s style.",
    "mot juste": "The right word — the only correct word for each thing. Obsessive and Flaubertian, agonizing on the tip of the tongue, victim of the translator.",
    "noblesse oblige": "Nobility obliges — those with privilege have duties. Between social responsibility and looking after your own perfumed hide.",
    "nom de plume": "Pen name — literary pseudonym. Voltaire, Stendhal, George Sand, George Eliot, Twain: nobody called them to lunch with those cultured names.",
    "nonchalance": "Elegant unconcern, aloof disinterest — effortless calm. Nothing affects you? Everything affects you? Nobody will ever know.",
    "nouvelle vague": "New wave — the French upheaval of the 60s. Godard, Truffaut, Chabrol. Moreau, Léaud, Belmondo and Karina: they made us all fall in love.",
    "objet d'art": "Art object — knick-knacks and tchotchkes as artwork, decorative pieces with a capital D. Art and industry: design that did graduate. Or pretends to.",
    "par excellence": "By excellence — not just the best: the defining example. The dictionary image, the Michelin photo, the Encyclopédie entry. The one that sets the standard.",
    "passé": "Past, dated — was, is no more, and hopefully never will ever again be. More dismissive than \'old-fashioned\', more elegant than \'out\'.",
    "papier-mâché": "Masticated paper — paper pulp and glue that hardens on drying. Carnivals, piñatas, Valencia\'s fallas: between sublime and disposable, always popular.",
    "pièce de résistance": "The piece that resists — the main dish, the star number, the evening\'s highlight. Throw everything at it; whatever survives is this.",
    "protégé": "Protected one — young talent under a master\'s or patron\'s wing. More financial than apprentice, more artistic than grantee. An eternal relationship.",
    "roman à clef": "Novel with a key — fiction where characters are real people in disguise. Proust, Capote: literary revenge or homage? Almost always the former.",
    "savoir-faire": "Know-how — practical skill and executed tact. Not talent, not knowledge: doing the right thing at the right moment. General muscle memory.",
    "soirée": "Evening gathering — the elegant nocturnal reunion. More than a cocktail, less than a ball: the bourgeois format for conversation, music and flirtation.",
    "touché": "Touched — the decisive thrust. From fencing to conversation: the gesture of whoever loses a point and tries to assume it with elegance.",
    "mise en place": "Everything in its place — prior culinary preparation: ingredients, utensils, cleanliness. Mother of delight, hygiene and being invited back.",
    "vernissage": "Varnishing — private opening of an exhibition. Wine, artists, critics, you: Art with a \'wet paint\' sign still up.",
    "beau monde": "Beautiful world — the elegant, well-connected high society to which, we hope, you belong. A beautiful reflection in the mirror with Proust musing in the middle.",
    "d'accord": "Agreed — yes, but beyond that, I concur. My subjective approval matters as much or more than the fact. Makes you sound refined and wise (and smug).",
    "au contraire": "On the contrary — saying no to someone\'s face, head-on but with class. Given the usual character of the French, it\'s almost surprising this still exists.",
    "agent provocateur": "Provocateur agent — infiltrator who incites the group they spy on. From the Tsarist police to luxury lingerie: the most sincere transnational brand.",
    "maître d'": "Abbreviated maître d\'hôtel — receives you, seats you, ignores you and insults you. As it should be. The discreet charm of the bourgeoisie.",
    "potpourri": "Literally: rotten pot — fragrant mix of dried petals and spices. Rarely a compliment, unless we\'re talking about musicians with ADHD.",
    "bête noire": "Black beast — your personal nemesis. Your own, irrational, intense and constant. Everyone has one and rarely chooses or gets rid of it.",
    "plat du jour": "Dish of the day — culinary carpe diem, because it\'s what\'s on. The democratic leveller of fortune: if you don\'t like it, cook or order from the...",
    "avant la lettre": "Before the word — to prefigure, to do something before the term for it exists. The misunderstood, the visionary, the mad: all pioneers avant la lettre.",
    "presque rien": "Almost nothing — the title Jankélévitch gave his philosophy of the ineffable. Liminal to the perceptible. Barely something, but there.",
    "joie de vivre": "Joy of living — the unreasonable enthusiasm for being alive. Matisse painted it, Zola titled it. French: exalted and jovial language a priori.",
    "petite mort": "Little death — orgasmic dissolution into the whole: consciousness? what for? Between pleasure and nothingness. Freud and Bataille: literal readers.",
    "enfant terrible": "Terrible child — not only detestable for being talented, but because they make you feel old. Artist, genius or simply insufferable.",
    "vol-au-vent": "Flies in the wind — lofty, airy, floaty pastry. Carême named it. Today (poulet et duxelles): classic starter, basic wedding, office buffet.",
    "raison d'être": "Reason for being — what justifies one\'s existence. Ours: knowledge and the grotesque. If you have to ask a philosopher, you don\'t have one.",
    "déjà vu": "Already seen — the sensation of having lived this moment before. Neurologists debate it in eternal déjà vus. Proust: an entire novel.",
    "carte blanche": "Blank card — total authorization, no fine print. Absolute delegated power: wherever you go, do as you wish, I\'ll answer for it (if anything).",
    "en masse": "In mass — all together, in bulk, without distinction. From armies to social networks to Elias Canetti: quantity as a horrible argument.",
    "force majeure": "Major force — unavoidable unforeseen events. French legalese as euphemism for sub-piloric processes, catastrophes, menstrual cycles, laziness...",
    "tour de force": "Turn of strength — feat of skill or virtuosity. Seemed impossible and you pulled it off as if nothing. Never absent from any literary review.",
    "pied-à-terre": "Foot on earth — small apartment in a city where one doesn\'t quite live. The discreet luxury of having somewhere to fall dead if needed.",
    "sangfroid": "Cold blood — calm under extreme pressure. Poikilothermic? Quite the reverse: I control my stiff upper lip ad libitum.",
    "à la carte": "By the menu — order whatever you fancy, dear affluent one, we are at your service. The counterpart to the fixed daily menu for the masses.",
    "double entendre": "Double meaning — expression with two readings, one innocent and one by Mae West. More English than French today, pardon my French.",
  },
});


// ============ EXPRESIONES LATINAS ============


// Criterio de cribado (ISO900B sección 2): ¿salió del nicho original al uso culto general,
// o se quedó adentro? "Et caetera" deliberadamente NO incluida — ya cruzó del todo a "etcétera",
// asimilada como palabra propia del español, sin "olor a latín" suficiente para esta biblioteca.

const EXPRESIONES_LATINAS_ES = crearBiblioteca({
  id: "expresiones_latinas", level: "hard", lang: "es", field: "humanidades",
  name: "Expresiones latinas", desc: "Nombra cualquier expresión o locución latina de uso culto.",
  total: null, dificultad: 4, lejania: 3,
  facts: {
    "carpe diem": "Aprovecha el día — de Horacio, hoy más en camisetas que en poesía. Más de intensificar la experiencia que de ser temerario.",
    "in vino veritas": "En el vino está la verdad — el alcohol como primer suero de la verdad. Incierto: una tía mía me dijo una edad falsa estando borracha.",
    "ad hoc": "Para esto específicamente — improvisado a la medida del momento. Este mensaje es ad hoc.",
    "statu quo": "El estado actual de las cosas — lo que se defiende o se rompe. Hay que mantener el statu quo.",
    "sui generis": "De su propio género — único, impar, sin categoría que lo contenga. Rompieron el molde luego de hacerlo.",
    "per se": "Por sí mismo — sin necesidad de nada más para ser lo que es. Esta frase se entiende per se.",
    "vox populi": "La voz del pueblo — lo que todos dicen, aunque nadie lo firme. ¡Romanos chismosos!",
    "cogito ergo sum": "Pienso, luego/por ende existo — Descartes, el cimiento más citado de la filosofía moderna. Con lo ricas que son las res(es) extensas.",
    "memento mori": "Recuerda que morirás — el aviso más antiguo que sigue sin gustarle a nadie. Sigue siendo mejor que lo de Heidegger.",
    "tabula rasa": "Tabla rasa — la mente antes de cualquier experiencia, según el empirismo. Un supuesto formateo de fábrica.",
    "ad infinitum": "Hasta el infinito — como lo que haces en esta biblioteca: aprender ad infinitum. Muy práctico para burlas a lentos y minuciosos.",
    "de facto": "De hecho — lo que es así aunque nadie lo haya decretado. Base de la Realpolitik que es cero latina.",
    "ipso facto": "Por ese mismo hecho — inmediato, sin trámite de por medio. Base de exigencias y regaños.",
    "modus operandi": "Forma de operar — el patrón que delata, en crimen o en costumbre. El MO de un asesino serial dicen algunos que es una farsa.",
    "persona non grata": "Persona no grata — el título que nadie quiere recibir en su propia fiesta. Ni en la ajena. Los poetas en la república, por ejemplo.",
    "terra incognita": "Tierra desconocida — lo que el mapa todavía no se atreve a nombrar y ni se atreve a llenar de dragones aún.",
    "alma mater": "Madre nutricia — así llamamos a la universidad que nos formó. Y luego que madre no hay sino una...",
    "de gustibus non est disputandum": "Sobre gustos no hay disputa — el final de cualquier discusión sin salida. \"Entre gustos no hay disgustos\" — dijo disgustado.",
    "habeas corpus": "Que tengas el cuerpo — el derecho a no desaparecer sin explicación. Ay, los cóndores del sur.",
    "lapsus linguae": "Desliz de la lengua — decir lo que no se quería, sin querer. Hoy en día tiene un hermano tecladorum.",
    "mea culpa": "Mi culpa — la forma más corta de admitir un error: yendo a su pulpa. Y ¡rima!",
    "non sequitur": "No se sigue — cuando la conclusión no tiene nada que ver con la premisa. Ninguna jirafa discreparía, de momento.",
    "quid pro quo": "Algo por algo — el trueque que disfraza casi cualquier favor. Lo que se pedía de Clarice.",
    "ad nauseam": "Hasta el hastío — repetido tantas veces o con tanta intensidad que genera emesis menos eufemísticas que esta.",
    "ex nihilo": "De la nada — de donde se originan comúnmente nuestros iniciados. Potestad de dioses y prestidigitadores.",
    "sine qua non": "Sin la cual no — la condición sin la que nada más importa. Acertar es condición sine qua non de ganar.",
    "post mortem": "Después de la muerte — lo que se descubre, dice o hace cuando ya no hay vuelta atrás. Por lo general de poca importancia para el finado.",
    "ad libitum": "A voluntad — sin guion, improvisado libremente. Su primo corto 'ad lib' triunfa diariamente en escenarios anglos.",
    "in situ": "En el lugar mismo — sin moverlo de donde estaba. No confundir con ínsito que nadie usa ni conoce.",
    "ad absurdum": "Hasta el absurdo — llevar una idea al límite para demostrar su falsedad. Reductio...: Socráticamente reducir ideas ajenas a un estado contradictorio.",
    "in extremis": "En el extremo — última gota de tiempo, recurso o vida. Técnicamente lo penúltimo y casi último.",
    "modus vivendi": "Modo de vivir — lo que nadie quiere que le intervengan o critiquen. A menos que sea con millones.",
    "mutatis mutandis": "Cambiando lo que haya que cambiar — misma regla, muchas aplicaciones contextuales. Ctrl-C Ctrl-V pero smart.",
    "pars pro toto": "La parte por el todo — cabezas de ganado, malas lenguas, Bruselas se pronunció. La prima latina de la metonimia.",
    "prima facie": "A primera vista — parece cierto sin pedir examen. Cuando, prima facie, todo parece bien, prima facie, conviene rascar.",
    "bona fide": "De buena fe — sin engaños, trampas, tramoyas: con intención honesta. Lo contrario de casi todo lo humano.",
    "ex ungue leonem": "Por la uña, el león — el todo deducido de la partícula. El método más deductivo: Holmes, Cuvier, Morelli. ¡Y Bernoulli con Newton!",
    "non plus ultra": "No más allá — el límite último, lo insuperable. Hércules, grafitero, lo grabó en sus columnas que ya se sienten tan cercanas.",
    "ora pro nobis": "Ruega por nosotros — procesiones, letanías a santos, pedigüeñería. El crowdsourcing de la intercesión divina.",
    "ancilla dei": "Sierva/esclava de Dios — título de la Virgen María en la Anunciación. \"He aquí la... Hágase en mí según tu voluntad\" — El segundo gran Fiat.",
    "agnus dei": "Cordero de Dios — Cristo como víctima sacrificial inocente. También: el disco de cuero bendito, la oración de la misa, el de Fauré.",
    "gratia dei": "Por gracia de Dios — lo que justifica reyes, papas y afortunados o lo que sea. La lotería cósmica con mejor marketing y aval.",
    "per saecula saeculorum": "Por los siglos de los siglos — la fórmula eterna de la eternidad litúrgica. Amén interminable y en latín, como las misas de antes.",
    "noli me tangere": "No me toques — dijo Cristo resucitado a Magdalena. Tocado por todos: Rizal el filipino, Picasso, Corregio, Tiziano, Holbein, botánicos, soldados.",
    "veni vidi vici": "Vine, vi, vencí — César a Amelia tras Zela, 47 a.C. El prototuit. Tres palabras y luego Polonia, Ghostbusters, Hillary. Tricolon, hendíatris y asíndeton. Obvio.",
    "alea iacta est": "La suerte está echada — César cruzando el Rubicón, 49 a.C. Él lo dijo en griego y así le sonó al mundo que lo latinizó.",
    "panem et circenses": "Pan y circo — Juvenal diagnosticando el Imperio: al pueblo le basta comida y espectáculo. Dos milenios después: pizza y Netflix.",
    "ave caesar": "Ave César — el saludo gladiatorial premortem. Más mitológico que la loba, menos histórico que el laúd de Nerón, dixerunt.",
    "carthago delenda est": "Cartago debe ser destruida/borrada — Catón el Viejo, fin de cada discurso en Repeat 1 durante años. Lo de la sal es falso.",
    "malleus maleficarum": "El martillo de las brujas — el manual de caza de brujas de 1486. Sprenger y Kramer. El libro más peligroso de la historia que no es un manifiesto político.",
    "in medias res": "En la mitad — empezar una historia ya empezada, en el medio, no en el principio. Homero, Virgilio, casi todo ya. La prima latina que justifica el flashback.",
    "deus ex machina": "El dios de(sde) la máquina — cuando la trama se resuelve externamente, por algo ajeno a ella: dioses, azar, caimanes, lo que sea pero no 'orgánico'.",
    "alter ego": "El otro yo — la identidad paralela, el doble, la máscara. De Jekyll a Superman a lo falsos que somos en Instagram y X y LinkedIn y Fb y....",
    "in flagrante": "En llamas — pillado en el acto, con las manos en la masa. Técnicamente 'in flagrante delicto' pero mientras dicen lo último se escapan.",
    "curriculum vitae": "El curso de la vida — el resumen que muestra que sabes resumir o amplificar o maquillar lo que dices que has hecho. Eufemístico por definición.",
    "inter alia": "Entre otras cosas — la fórmula académica para decir 'hay más pero o me pagan más o tengo cansados los dedos.'",
    "ad portas": "A las puertas — cuando está que pasa el umbral. Aníbal ad portas: el pánico romano y paquidérmico que se volvió expresión universal.",
    "tempus fugit": "El tiempo huye — Virgilio, en las Geórgicas. Y ni intentes huir tú, él huye de ti hasta que te alcanza y nadie, que sepamos, le ha ganado.",
    "dum spiro spero": "Mientras respiro, espero — divisa de Carolina del Sur, de Cicerón, de cualquiera que no se rinde. ¿Optimismo? Algo es algo.",
    "et in arcadia ego": "Yo también estuve en la Arcadia — la muerte que penetró hasta el paraíso. Poussin, Goethe, la melancolía más hermosa de la cultura occidental.",
    "errare humanum est": "Errar es humano (y de AIs) — Séneca, con topping de Agustín (perseverar en el error es diabólico) que demás que ni lo dijo así. Aplicarlo: ¿muy o poco humano?",
    "homo homini lupus": "El hombre es el lobo del hombre — Plauto primero, Hobbes después. Nuestra misma naturaleza nos enfrenta y enseña a declinar irregulares.",
    "pecunia non olet": "El dinero no huele — Vespasiano al gravar los urinarios públicos. Su hijo Tito se quejó; él lo puso a oler una moneda.",
    "contra natura": "Contra la naturaleza — lo que viola el orden natural, que es tantos y ninguno a la vez. Equiparable a menudo a no me gusta, me da asco, no es lo mío.",
    "aqua vitae": "El agua de la vida — medievalés para alcohol destilado. Aquavit, whisky (uisce beatha en gaélico), eau de vie, aguardiente: lo que se siente no se traduce.",
    "mare magnum": "El gran mar — lo tormentoso y abrumante... de la burocracia o las tareas o ya lo que sea. Las metáforas desgastan y se desgastan.",
    "et caetera": "Y lo demás — tras de que abreviaba, ya la abreviamos: etc. De las latinas que mejor se saben maquillar de inglesas, hispanas, francesas...",
    "idem": "Lo mismo — para no repetir lo que ya se dijo. En bibliografía: mismo autor. En conversación: yo también, exacto, afirmativo. El atajo más elegante y perezoso.",
  }
});
const EXPRESIONES_LATINAS_EN = crearBiblioteca({
  id: "expresiones_latinas_en", level: "hard", lang: "en", field: "humanidades",
  name: "Latin expressions", desc: "Name any Latin expression or locution in common cultured use.",
  total: null, dificultad: 4, lejania: 3,
  facts: {
    "carpe diem": "Seize the day — from Horace, now on more t-shirts than books. About intensifying experience, not being reckless.",
    "in vino veritas": "In wine there is truth — alcohol as the original truth serum. Uncertain: a tipsy aunt once gave me a false age.",
    "ad hoc": "For this specifically — improvised, tailored to the moment. This meeting could have been an ad hoc email.",
    "statu quo": "The current state of things — what gets defended or broken. Maintaining it is always someone\'s full-time job.",
    "sui generis": "Of its own kind — unique, matchless, no category contains it. They broke the mold after making it.",
    "per se": "In and of itself — without needing anything else to be what it is. This sentence is self-explanatory per se.",
    "vox populi": "The voice of the people — what everyone says though no one signs it. Gossipy Romans!",
    "cogito ergo sum": "I think therefore I am — Descartes\' starting point. Some thoughtless days we\'ve been almost gone.",
    "memento mori": "Remember you will die — medieval reminder, now a tattoo aesthetic. Amazing on baroque paintings, not a great conversation starter at parties.",
    "tabula rasa": "Blank slate — the mind before experience writes on it. Locke said yes, Chomsky talked and broke the spell.",
    "ad infinitum": "To infinity — without end, without limit, without mercy. And so on, and so on, ad infinitum. Ad infinitum et plus ultra, as a certain space ranger would say.",
    "de facto": "In fact, in practice — what actually happens regardless of what the rules say. The de facto leader rarely has the title.",
    "ipso facto": "By that very fact — the consequence follows automatically from the premise. Ipso facto, therefore, right away.",
    "modus operandi": "Mode of operation — how someone characteristically does things. Every detective/serial killer show needs at least one.",
    "persona non grata": "Unwelcome person — diplomatically expelled or socially radioactive. The most elegant way to uninvite someone.",
    "terra incognita": "Unknown territory — uncharted land, unexplored field. Every map\'s most interesting corner.",
    "alma mater": "Nourishing mother — the institution that educated you. Claimed with pride or irony depending on the decade.",
    "de gustibus non est disputandum": "There\'s no disputing taste — the classical way of ending an argument about pineapple on pizza.",
    "habeas corpus": "You shall have the body — the legal right not to be imprisoned without charge. Eight centuries old and still doing the work.",
    "lapsus linguae": "Slip of the tongue — what Freud turned into a whole theory. Sometimes a mistake is just a mistake. Nowadays joined by its cousin lapsus keyboardorum.",
    "mea culpa": "My fault — the shortest way to admit a mistake, admitting it in one take. Cheap rhyme, I know, mea culpa!",
    "non sequitur": "It doesn\'t follow — when the conclusion has nothing to do with the premise. No wise giraffe would disagree, for now.",
    "quid pro quo": "Something for something — the barter that dresses up almost any favor. What the gourmet asked of Clarice.",
    "curriculum vitae": "The course of life — the summary that shows you know how to summarize, expand, or embellish what you claim to have done. Euphemistic by definition.",
    "inter alia": "Among other things — the academic formula for saying \'there\'s more but either pay me more or my fingers are tired.\'",
    "ad portas": "At the gates — when it\'s about to cross the threshold. Hannibal ad portas: the Roman and pachydermic panic that became a universal expression.",
    "tempus fugit": "Time flees — Virgil, in the Georgics. Don\'t try to flee yourself: it flees from you until it catches you, and nobody, as far as we know, has won.",
    "dum spiro spero": "While I breathe, I hope — motto of South Carolina, of Cicero, of anyone who doesn\'t give up. Optimism? Better than nothing.",
    "et in arcadia ego": "I too was in Arcadia — death penetrating even paradise. Poussin, Goethe, the most beautiful melancholy in Western culture.",
    "errare humanum est": "To err is human (and AI\'s) — Seneca, with Augustinian topping (to persevere in error is diabolical). Probably not said that way, confirming its humanity.",
    "homo homini lupus": "Man (is) wolf to man — Plautus first, Hobbes later. Our very nature confronts us and teaches us how to drop the copula and decline homo.",
    "pecunia non olet": "Money doesn\'t smell — Vespasian, taxing public urinals. His son Titus complained; he made him smell a coin.",
    "contra natura": "Against nature — whatever violates the natural order, everything and nothing at once. Often: don\'t like it, disgusts me, not my thing.",
    "aqua vitae": "The water of life — medieval for distilled alcohol. Aquavit, whisky (uisce beatha in Gaelic), eau de vie, aguardiente: the feeling can\'t be translated.",
    "mare magnum": "The great sea — the stormy and overwhelming... of bureaucracy or tasks or whatever. Metaphors wear out and get worn out.",
    "et caetera": "And the rest — we\'ve abbreviated it further: etc. Among the Latin expressions that best disguise as English, Spanish, French...",
    "idem": "The same — author, reference, book, idea, etc. Almost the laziest shortcut (id. beats it).",
    "ad nauseam": "To the point of nausea — repeated until unbearable. Political campaigns and infommercials both coincide at what shouldn\'t be called the vomitorium.",
    "ex nihilo": "Out of nothing — creation without prior material. God\'s method, Lear\'s greatest quote, and every Sunday morning cook\'s enchantment.",
    "sine qua non": "Without which not — the indispensable condition. The sine qua non of any good plan: having one. Of executing it: having at least two.",
    "post mortem": "After death — the analysis that comes too late to help but not too late to judge. The best part: it can\'t hurt!",
    "ad libitum": "At liberty, as desired — musicians\' permission to improvise. Jazz lived here before it had a name.",
    "in situ": "In place, on site — examined where it actually is, not moved to a lab. Archaeologists\' favorite excuse not to rush and to get the best suntan.",
    "modus vivendi": "Way of living — an arrangement that works well enough for everyone to tolerate. Not peace, but functional.",
    "prima facie": "At first sight — seems true without requiring examination. When prima facie everything looks fine, prima facie, you should dig deeper.",
    "bona fide": "In good faith, genuine — the real McCoy. A bona fide miracle is just a coincidence nobody debunked yet. English: why mispronounce everything?",
    "ex ungue leonem": "From the claw, the lion — the whole from a part. Sherlock\'s method, predating him by two millennia. Also Bernoulli\'s to guess Newton\'s identity.",
    "non plus ultra": "Nothing beyond — the absolute limit, the pinnacle. Gibraltar\'s original slogan. Now mostly on cognac bottles and hyperboles.",
    "ora pro nobis": "Pray for us — the litany\'s recurring plea. Repetition as spiritual technology. If only \'bis\' or \'ditto\' had been more popular before.",
    "ancilla dei": "Handmaid of God — servant of the divine. The virgin Mary\'s response to God\'s advances. Atwood made it dystopian; it always was.",
    "agnus dei": "Lamb of God — Christ as innocent sacrificial victim. Also: the blessed leather disc, the mass prayer, and Fauré\'s.",
    "gratia dei": "By the grace of God — what justifies kings, popes, and the lucky. The cosmic lottery with better marketing and divine endorsement.",
    "per saecula saeculorum": "For ages of ages — the eternal formula of liturgical eternity. An endless Amen in Latin, like masses of old.",
    "noli me tangere": "Touch me not — Christ\'s words to Mary Magdalene after resurrection. Touched by everyone since: Rizal, Picasso, Correggio, Titian, Holbein, botanists, soldiers.",
    "veni vidi vici": "I came I saw I conquered — Caesar to Amelia after Zela, 47 BC. The proto-tweet. Three words, then Poland, Ghostbusters, Hillary.",
    "alea iacta est": "The die is cast — Caesar crossing the Rubicon, 49 BC. He said it in Greek and the world latinized it.",
    "panem et circenses": "Bread and circuses — Juvenal diagnosing the Empire: people need food and spectacle. Two millennia later: pizza and Netflix.",
    "ave caesar": "Hail Caesar — the gladiatorial pre-mortem salute. More mythological than the she-wolf, less historical than Nero\'s lute, they say.",
    "carthago delenda est": "Carthage must be destroyed — Cato the Elder, end of every speech on repeat for years. The salt story is false.",
    "malleus maleficarum": "The hammer of witches — the 1486 witch-hunting manual. Sprenger and Kramer. The most dangerous book in history that isn\'t a political manifesto.",
    "in medias res": "In the middle — starting a story already in progress. Homer, Virgil, almost everything since. The Latin cousin that justified the flashback.",
    "deus ex machina": "The god from the machine — when the plot resolves externally, by something outside it: gods, chance, crocodiles, anything but \'organic.\'",
    "alter ego": "The other self — the parallel identity, the double, the mask. From Jekyll to Superman to how fake we are on Instagram, X, LinkedIn and Fb and....",
    "in flagrante": "In flames — caught in the act, red-handed. Technically \'in flagrante delicto\' but by the time they finish saying it, you\'re gone.",
    "ad absurdum": "To the point of absurdity — pushing an argument until it collapses under its own weight. Reductio ad absurdum: logic\'s own weapon against bad logic.",
    "in extremis": "In the extreme — at the last possible moment, when all else has failed. The last-resort latin.",
    "mutatis mutandis": "Changing what needs to change — same rule, many contextual applications. Ctrl-C Ctrl-V but smart.",
    "pars pro toto": "The part for the whole — when a piece stands for everything. Synecdoche\'s Latin ID card.",
  },
});

// ============ NAVES DE COLÓN / COLUMBUS'S SHIPS ============
const VANISHED_STATES_ES = crearBiblioteca({
  id: "vanished_states", level: "hard", lang: "es", field: "geografia",
  name: "Estados desaparecidos", desc: "Nombra cualquier estado, imperio o nación que ya no exista.",
  total: null, dificultad: 4, lejania: 4,
  facts: {
    "union sovietica": "1917-1991. El mayor y más estrepitoso experimento comunista. Rusia aún conserva el cuerpo de Lenin y más del 50% de nostalgia soviética.",
    checoslovaquia: "1945-1993. Se separó en la famosa y pacífica Revolución de Terciopelo.",
    yugoslavia: "1918-1992. La unión de eslavos del sur se disolvió en conflictos étnicos que se volvieron bélicos en los 90s.",
    "austria hungria": "1867-1918. Moderno, culto y multicultural. Disuelto tras la WWI en estados étnicos. Loos, Klimt, Freud: el último estertor del imperio como civilización.",
    prusia: "1525-1947. El motor tras la unificación de Alemania y de su propia caída.",
    "alemania oriental": "1949-1990. Zona de influencia de la URSS. Epicentro de la Ostalgie contemporánea — subdesarrollada, semidespoblada, sobreenvidiada.",
    "imperio otomano": "1299-1922. Uno de los imperios más longevos y poderosos terminó apodado 'el viejo enfermo de Europa'.",
    "gran colombia": "1819-1831. El sueño de Bolívar comprendía a Colombia, Venezuela, Ecuador, Panamá y parte de Perú y Brasil. Doce años: nada mal para un sueño.",
    sikkim: "1642-1975. Reino budista en el Himalaya, anexado por India tras un referéndum disputado.",
    zanzibar: "1856-1890, 1963-1964. Primero como sultanato, luego como breve estado independiente. Unido a Tanganica para formar Tanzania en 1964.",
    "imperio bizantino": "330-1453. El Imperio Romano sobrevivió mil años después de la caída de Roma, hasta que los otomanos tomaron Constantinopla. Su endónimo: romanos, no bizantinos.",
    "republica de venecia": "697-1797. Cristal, leones, Tiziano. Mil cien años de comercio, intriga y máscaras, terminados por Napoleón sin un solo disparo importante.",
    "imperio mogol": "1526-1857. No, no nos saltamos una N. Construyeron el Taj Mahal. Los británicos los disolvieron tras una rebelión fallida.",
    sealand: "1967-presente (no reconocido). Una plataforma militar abandonada, ocupada y declarada 'nación' — nadie más la reconoce, pero tampoco insiste en disolverla.",
    "estados confederados": "1861-1865. Cuatro años de existencia, ninguno de reconocimiento internacional pleno. Atlanta incendiada y banderas anacrónicas y ofensivas.",
    texas: "1836-1845. Independiente de México, después se anexó a Estados Unidos por voluntad propia.",
    "hawai": "1795-1893. Reino colonizado militarmente (y luego con piñas). ¿Legitimidad? Los afectados más directos la niegan.",
    "imperio austriaco": "1804-1867. Solo 63 años antes de adoptar su apellido de casada y ser Austria-Hungría. Metternich, pasteles y el Danubio Azul de Strauss.",
    "republica de las dos naciones": "1569-1795. Enorme unión de Polonia y Lituania. Paradisium Iudaeorum. Los Húsares Alados no bastaron: desmembrada por Rusia, Prusia y Austria.",
    biafra: "1967-1970. Secesión igbo del sureste de Nigeria. Poco reconocida (5 países) y derrotada tras una guerra civil devastadora que desembocó en una enorme hambruna.",
    crimea: "1992, 2014. Declaró independencia dos veces en tres décadas — la segunda terminó en anexión rusa disputada internacionalmente.",
    "reino de las dos sicilias": "1816-1861. El reino más grande de Italia (Nápoles y la isla) antes de la unificación, disuelto por Garibaldi.",
    "estados papales": "754-1870. Más de mil años bajo gobierno directo del Papa — que se mudó a Aviñón en el XIV y olvidó empacar el estado. Duró hasta la unificación italiana.",
    "republica de florencia": "1115-1532. Cuna del Renacimiento, gobernada por gremios y banqueros antes de caer ante los Medici y surgir aún más.",
    "republica de genova": "1099-1797. Rival comercial eterna de Venecia. Cuna de Colón y el pesto. Ambas disueltas por Napoleón el mismo año.",
    "ducado de borgona": "1032-1477. La espada y la pared: Francia y el Sacro Imperio. Murió con Carlos el Temerario, pero aun lo celebramos con el vino y el color.",
    "imperio inca": "c.1438-1533. El más extenso de los precolombinos. Pizarro capturó a Atahualpa, cobró su rescate en oro y lo ejecutó igual. Definición de no jugar limpio.",
    "reino de aksum": "c.100-940. Cuerno de África y partes de Yemen: según el profeta Mani, una de las cuatro grandes potencias del mundo antiguo — junto a Roma, Persia y China.",
    "imperio de mali": "c.1235-1610. Mansa Musa, posiblemente el hombre más rico de la historia, repartió tanto oro en su viaje a Meca que devaluó la moneda egipcia por años.",
    "imperio songhai": "c.1400-1591. Caído ante Marruecos en la Batalla de Tondibi — 40.000 soldados songhai sin pólvora contra apenas 4.000 marroquíes con cañones.",
    "tibet": "1912-1951. La caída de los Qing y la anexión china lo enmarcan y la disputa perdura hasta hoy. De las peores rimas de Mecano: Ay Dalai.",
    "reino de tahiti": "1788-1880. Pomare V, su rey, vendió la soberanía a Francia por una pensión y un título — murió de alcoholismo poco después.",
    "reino de kongo": "c.1390-1914. 500+ años de historia. Declinó tan lento que el título de Manikongo lo sobrevivió como honorífico vacío durante décadas.",
    "reino de benin": "c.1180-1897. 700+ años de poder y arte propio: cortados en una sola expedición británica. Sus tesoros artísticos adornan museos europeos y gritan: restitución.",
    "corona de aragon": "1035-1707. Un quinto de España y medio Mediterráneo. Sicilia vía herencia de Constanza; Cerdeña, Nápoles, hasta Atenas. Jaume conquistó; el mar quedó.",
    "alemania occidental": "1949-1990. Se reunificó con Alemania Oriental en 1990: caída del muro de Berlín, concierto de David Hasselhoff, todo lo demás.",
    "imperio persa aquemenida": "c.550-330 a.C. Inventores de la libertad de cultos y el correo. Ciro, rey de reyes. Conquistado por Alejandro Magno en 330 a.C.",
    "persia moderna": "1935. Renombrada Irán por el sha a nivel internacional — los propios persas siempre se llamaron a sí mismos iraníes (arios).",
    "vietnam del sur": "1955-1975. Perder es ganar un poco: reunida con su hermana norteña en 1975. Su Pho es mas dulce y denso.",
    "vietnam del norte": "1945-1975. Ganar es ganar y Vietnam le ha ganado a unos inimaginables. Pho mas anisado y transparente.",
    "yemen del sur": "1967-1990. El único estado comunista del mundo árabe — alineado con la URSS, Cuba y Alemania Oriental, hasta unificarse con Yemen del Norte.",
    "ceilan": "1948-1972. Una de las grandes patrias de la canela, conocido hoy día como Sri Lanka. Tigres peligrosos de otro tipo.",
    "rodesia": "1965-1980. De los pocos estados epónimos — nombrado por Cecil J. Rhodes. La actual Zimbabue fue récord de inflación.",
    "costa de oro": "1957. Convertido en Ghana aunque no coincide con el imperio homónimo (¿dijimos mucho?). Adalid de la tendencia independentista en África subsahariana.",
    "abisinia": "c.1270-1936. La actual Etiopía fue el único país africano en no ser colonizado, salvo la breve ocupación italiana entre 1936 y 1941. Café, Iglesias talladas y —dicen— el arca de la alianza.",
    "birmania": "1948-1989. Su sittuyin parece un ajedrez tradicional, pero la disposición inicial de las piezas es según la elección del jugador. Renombrada Myanmar en 1989.",
    "congo belga": "1908-1960. ¿El peor dato en todo Aris? Quedas advertido. El sistema colonial de Leopoldo II: Cuotas de caucho o amputaciones. Se nos quiebra la voz.",
    "manchuria": "1932-1945. Estado títere japonés (Manchukuo) durante la Segunda Guerra. Escenario de la atroz Unidad 731. Retratada literariamente por Murakami y Ken Liu.",
    "tanganica": "1961-1964. Se unió a Zanzíbar en 1964 para formar Tanzania. El gran lago transnacional Tanganica aún porta su nombre.",
    "niasalandia": "1907-1964. La actual Malaui ('tierra de llamas') portó alguna vez este nombre, que significaba 'tierra del lago'. Éste es el segundo más profundo del mundo y tiene más peces cíclidos que cualquier otro.",
    "rodesia del norte": "1924-1964. Cecil J. Rhodes dio nombre a dos estados: éste, la actual Zambia, contiene las cataratas de Victoria, uno de los últimos epónimos coloniales.",
    "bechuanalandia": "1885-1966. De los más pobres de África antes — de los más ricos hoy como Botsuana. Diamantes: no siempre para siempre, pero ¡sí que rinden!",
    "basutolandia": "1884-1966. El actual Lesoto: único país del mundo enteramente sobre 1000m. Se atraviesa a lomo de pony. El reino en el cielo, sin metáfora.",
    "dahomey": "1960-1975. Distinta del antiguo reino precolonial homónimo. Renombrada Benín en 1975. Las amazonas de Dahomey: guerreras reales, no del cómic.",
    "alto volta": "1958-1984. Renombrado Burkina Faso en 1984 — 'Tierra de Hombres Íntegros'. Y no, no es un baile isabelino.",
    "sumeria": "c.4500-1900 a.C. Casi todo empieza aquí: escritura, calendario, casi todo lo que viene en grupos de 7 o 60.",
    "acad": "c.2334-2154 a.C. Se inventó el concepto de imperio y lo ejerció hasta 2154 a.C. Enheduanna, princesa e hija de Sargón, es la primera autora cuyo nombre conservamos.",
    "babilonia": "539 a.C. Legendaria pero real. Ciro el Grande la conquistó. Sus famosos jardines colgantes probablemente nunca estuvieron ahí — habrían sido en realidad obra del rey asirio Senaquerib, en Nínive.",
    "asiria": "612 a.C. Potencia militar y ¿conservatorio cultural? Cuando Nínive fue incendiada, la biblioteca de Asurbanipal, llena de tablillas de arcilla, fue cocida por el fuego y así se salvó hasta hoy. Le debemos el Gilgamesh.",
    "cartago": "146 a.C. ¿Delenda est? Lo sentimos, Catón — aunque Cartago fue arrasada, su memoria perdura. Y lo de la sal sembrada en sus ruinas es mentira.",
    "fenicia": "332 a.C. Todos sus antecesores fueron analfabetos: Fenicia inventó el alfabeto. Y el/la púrpura. Y difundió el papiro — biblioteca viene de Biblos.",
    "indias orientales neerlandesas": "1800-1949. La tierra de las especias. Una sola de estas islas (Run) fue intercambiada por Manhattan en 1667.",
    "indochina francesa": "1887-1954. Más allá de mon amour, la influencia francesa se sigue sintiendo en el café con leche condensada, en la baguette del banh mi, en el alfabeto mismo del vietnamita, en el pho y en...",
    "tannu tuva": "1921-1944. Absorbida por la URSS en 1944 — Feynman quería visitarla, pero la burocracia soviética se interpuso.",
    "republica de weimar": "1919-1933. La primera gran víctima de Hitler. Uno de los peores casos de hiperinflación vistos en Occidente.",
    "tercer reich": "1933-1945. La tercera fue la vencidísima. Hambrienta de Lebensraum, aspiraba a mil años de gloria — lleva 80+ como sinónimo popular del mal y la infamia.",
    "raj britanico": "1858-1947. Tras la Segunda Guerra Mundial y la hambruna de Bengala, India alcanzó la independencia junto a Pakistán y, más tarde, Bangladés.",
    "imperio mongol": "1206-1368. De sobra el imperio contiguo más extenso de la historia: 24 millones de km². Por ende, inventores de la autopista (el sistema de postas a lo largo de la Ruta de la Seda).",
    "lidia": "c.1200-546 a.C. Inventaron la moneda acuñada. La acumularon. Su rey, Creso, resultó ser menos feliz de lo que creía.",
    "bophuthatswana": "1977-1994. Los bantustanes, como Bophuthatswana, eran territorios donde las minorías blancas del apartheid confinaban a las mayorías negras, sin derechos ciudadanos plenos. Reintegrado en 1994.",
    "transkei": "1976-1994. Bantustán del apartheid, igual que Bophuthatswana — territorio donde se confinaba a la mayoría negra sin derechos ciudadanos plenos. Reintegrado en 1994.",
      "checoslovaquia": "1918-1939; 1945-1992. Dos repúblicas unidas y separadas dos veces: con fuerza por nazis y con maña por divorcio de terciopelo. Delata boomers: aun la llaman así.",
    "yugoslavia": "1918-1992. La unión sureña (yugo-) de eslavos (-slavia) se disolvió en conflictos étnicos que se volvieron bélicos en los 90s. Tito como cemento de una nación.",
    "biafra": "1967-1970. Secesión igbo del sureste de Nigeria. Poco reconocida (5 países) y derrotada tras una guerra civil devastadora que desembocó en una enorme hambruna.",
    "crimea": "1992, 2014. Declaró independencia dos veces en tres décadas — la segunda terminó en anexión rusa disputada internacionalmente.",
    "alemania nazi": "1933-1945. Ver: Tercer Reich.",
    "sacro imperio romano germanico": "800/962-1806. Voltaire: ni santo, ni romano, ni imperio. A veces germánico. Federico Barbarroja, mucho mejor que la operación del bigotudo.",
    "imperio romano": "27 a.C.–476 d.C. De Augusto a Rómulo Augústulo: sus nombres juntos suenan tan mal como el fin del imperio. Oriente siguió mil años más.",
    "mesopotamia": "c.3500 a.C.–539 a.C. Cuna de casi todo: escritura, rueda, ley, cerveza y quejas por escrito (la primera es sumeria). Hoy, Irak, siempre entrerríos.",
    "francia de vichy": "1940-1944. Pétain: colaboracionismo nazi en un spa termal. Vergüenza francesa, parlamento-casino y agua famosa mundialmente.",
    "nueva espana": "1521-1821. 300+ años de virreinato: Tenochtitlan vuelto Ciudad de México. Más grande y rica que España misma. Epicentro hispanoparlante durante siglos ya.",
    "nueva granada": "1717-1819. El virreinato de Colombia, Venezuela, Panamá y Ecuador. Bolívar lo convirtió en otro estado que no te vamos a revelar.",
    "reino de kush": "c.1070 a.C.–350 d.C. Nubia conquistó Egipto, gobernándolo como Dinastía XXV. Pirámides propias, más pequeñas y más puntiagudas que las egipcias.",
    "imperio carolingio": "800-843. Carlomagno reunificó Europa occidental por primera vez desde Roma. Verdún lo partió en tres Francias: la de Carlos, la de Luis y la de Lotario — hoy Francia, Alemania y una herida abierta.",
    "union de kalmar": "1397-1523. Dinamarca, Suecia y Noruega bajo una corona creada por Margarita I de Dinamarca. Desde Groenlandia hasta Finlandia pero tan despoblada.",
    "imperio corasmio": "c.1077-1231. Genghis Khan pidió comercio, el sha le devolvió la cabeza del embajador. Resultado: una de las destrucciones más totales de la historia.",
    "republica de ragusa": "1358-1808. Hoy más famosa como King's Landing o Dubrovnik: Napoleón la disolvió junto a dos de sus rivales — hoy ni se puede ir allí, siempre está llena.",
    "imperio de trebisonda": "1204-1461. La última gota del último sucesor del imperio que empezó con Augusto. Una gota que duró 8 años en caer, tras Constantinopla.",
    "egipto ptolemaico": "305-30 a.C. Con cara de griego, con ka egipcio. Ptolomeo I se quedó con el cadáver de Alejandro y con el país: siglos de incesto que desembocaron en Cleopatra VII.",
    "reino de bohemia": "c.1198-1918. Praga, Kafka y todas las Pilsen del mundo. Tricultural: germana, judaica, eslava. Inventora de la defenestración y de su propia primavera.",
    "ducado de saboya": "1416-1860. De estado alpino a germen de Italia unida: su rey fue el primero italiano, Vittorio Emanuele II. Además de Italia nos dejó los Savoiardi (ladyfingers).",
    "gran ducado de toscana": "1569-1861. Florencia como capital Medici: erigidos los Uffizi. Renacimiento calidad de exportación. Disuelto en la unificación italiana casi sin resistencia.",
    "reino de sukhothai": "c.1238-1438. El primer reino tailandés, cuyas escritura y cultura fundaron la Tailandia moderna. Sukhothai: \"amanecer de la felicidad\". Añadimos \"delicia\".",
    "reino de ayutthaya": "1351-1767. Cuatro siglos de dominio comercial en el sudeste asiático. Birmania la saqueó en 1767: una de las ciudades más ricas de Asia, arrasada en semanas.",
    "bulgaria del volga": "c.660-1236. Estado musulmán turco sobre el Volga — antecesor del Tartaristán moderno. Genghis Khan (oh, ¡sorpresa!) la borró del mapa. ¿Paronimia inconspicua?",
    "gran moravia": "c.833-907. Primer gran estado eslavo. Cirilo y Metodio, monjes, inventaron aquí el glagolítico, abuelo del cirílico. Sin Gran Moravia: cero escritura rusa.",
    "liga hanseatica": "c.1356-1669. Ni reino ni imperio: red comercial del Báltico y el Mar del Norte. Multinacional y más fuerte que muchos. Lübeck, Hamburgo, Bergen, Gdansk.",
    "imperio seleucida": "312-63 a.C. La más ardua conquista de Alejandro, la gozó Seleuco — de Siria a Persia — hasta que Roma se la tragó pedazo a pedazo.",
    "imperio parto": "247 a.C.–224 d.C. El imperio iraní, talón de Aquiles de Roma durante siglos. En Carras, se dice, aniquilaron a Craso dándole a beber oro fundido.",
    "reino grecobactriano": "256-120 a.C. Último límite helénico: budista y pegado a India desde Afganistán. Monedas bilingües: griego de un lado, prácrito del otro.",
    "reino de macedonia": "c.808-168 a.C. Creció con Filipo II, explotó con Alejandro. Brevemente el centro de casi todo. Nunca yugoslava ni norteña.",
    "lotaringia": "843-959. El pedazo incómodo de Verdún: ni Francia ni Alemania. Su nombre sobrevive en Lorena. Alsacia, Borgoña, Provenza: todo suyo, todo efímero.",
    "reino merovingio": "c.481-751. Los francos pre-Carlomagno. Clodoveo la fundó, los \"reyes holgazanes\" la hundieron. Los carolingios no les dieron ni las gracias.",
    "vinlandia": "c.1000. Los nórdicos le ganaron a Colón por cinco siglos. L'Anse aux Meadows (Terranova): único sitio nórdico confirmado en norteamérica.",
    "austrasia": "c.511-751. La mitad oriental de los francos. Reims, Metz, Colonia. De aquí salieron los Pipínidas — y de ellos, Carlomagno y muchos chistes inmaduros.",
    "neustria": "c.511-751. La mitad occidental de los francos. París, Soissons, Tours. Rival eterna de Austrasia — conflagradas por los carol-algos.",
  },
  synonyms: {
    "union sovietica": ["urss", "u r s s"],
    checoslovaquia: ["czsk"],
    "austria hungria": ["ah", "austrohungria"],
    "alemania oriental": ["rda", "alemania del este"],
    "imperio otomano": ["otomanos", "imperio ottomano"],
    "gran colombia": ["gc"],
    "imperio bizantino": ["bizancio", "imperio romano de oriente"],
    "republica de venecia": ["venecia", "serenisima", "republica serenisima"],
    "imperio mogol": ["mogoles", "mughal", "imperio mughal"],
    sealand: ["principado de sealand"],
    "estados confederados": ["csa", "confederacion de estados americanos", "estados confederados de america"],
    texas: ["republica de texas", "texas independiente"],
    "hawai": ["reino de hawai", "hawai independiente", "hawaii"],
    "republica de las dos naciones": ["mancomunidad polaco lituana", "polonia lituania", "comunidad polaco lituana", "commonwealth polaco lituano"],
    biafra: ["republica de biafra"],
    crimea: ["republica de crimea", "crimea independiente"],
    "reino de las dos sicilias": ["dos sicilias"],
    "estados papales": ["estado pontificio", "estados pontificios"],
    "republica de florencia": ["florencia republicana", "florencia"],
    "republica de genova": ["genova republicana", "genova", "genoa"],
    "ducado de borgona": ["borgona", "borgoña", "burgundia", "ducado de burgundia"],
    "imperio inca": ["tahuantinsuyo", "incas"],
    "imperio de mali": ["mali", "imperio mandinga"],
    "imperio songhai": ["songhai"],
    "tibet": ["tibet independiente"],
    "reino de tahiti": ["tahiti"],
    "reino de kongo": ["kongo"],
    "reino de benin": ["benin", "edo"],
    "corona de aragon": ["aragon", "reino de aragon"],
    "imperio persa aquemenida": ["imperio persa", "persia aquemenida", "imperio aquemenida"],
    "persia moderna": ["persia"],
    "vietnam del sur": ["republica de vietnam"],
    "vietnam del norte": ["republica democratica de vietnam"],
    "ceilan": ["sri lanka colonial"],
    "rodesia": ["rhodesia"],
    "costa de oro": ["gold coast"],
    "congo belga": ["belgian congo"],
    "manchuria": ["manchukuo", "estado de manchuria"],
    "tanganica": ["tanganyika"],
    "niasalandia": ["nyasalandia"],
    "rodesia del norte": ["northern rhodesia"],
    "bechuanalandia": ["bechuanaland"],
    "basutolandia": ["basutoland"],
    "sumeria": ["sumer"],
    "acad": ["akkad", "imperio acadio"],
    "reino de aksum": ["aksum", "imperio aksumita", "axum"],
    "indochina francesa": ["indochina"],
    "tercer reich": ["alemania nazi"],
    "raj britanico": ["raj britanico de la india", "india britanica"],
    "imperio mongol": ["mongoles"]
  }
});

// ============ VANISHED STATES EN ============
const VANISHED_STATES_EN = crearBiblioteca({
  id: "vanished_states_en", level: "hard", lang: "en", field: "geography",
  name: "Vanished States", desc: "Name any country, empire or state that no longer exists.",
  total: 96, metmin: 20,
  dificultad: 4, lejania: 4,
  facts: {
    soviet_union: "1917-1991. The largest and loudest communist experiment. Russia still keeps Lenin's embalmed body and over 50% Soviet nostalgia.",
    austria_hungary: "1867-1918. Modern, cultured, multicultural. Dissolved after WWI into smaller ethnic states. Loos, Klimt, Freud: the last throes of empire as civilization.",
    east_germany: "1949-1990. Soviet sphere. Ground zero of contemporary Ostalgie — underdeveloped, underpopulated, overenvied.",
    ottoman_empire: "1299-1922. One of history's longest and most powerful empires — later nicknamed 'the sick man of Europe', then dead in WWI.",
    gran_colombia: "1819-1831. Bolívar's dream: Colombia, Venezuela, Ecuador, Panama, parts of Peru and Brazil. Twelve years. Most dreams are shorter/worse than his.",
    byzantine_empire: "330-1453. The Roman Empire survived a thousand years after Rome's fall, until the Ottomans took Constantinople. Their endonym: Romans, never Byzantines.",
    republic_of_venice: "697-1797. Glass, lions, Titian. Eleven hundred years of trade, intrigue and masks, ended by Napoleon without a single important shot fired.",
    mughal_empire: "1526-1857. The Taj Mahal, hookahs and an obsession with harems and pigeons. Rembrandt loved them; the Brits dissolved them after a failed rebellion.",
    confederate_states: "1861-1865. Years of existence: 4; international recognition: none. Atlanta on fire, a flag that lives on as anachronism and offense.",
    kingdom_of_hawaii: "1795-1893. First colonized militarily — then with pineapples. Legitimacy? The most directly affected deny it. Rulers with the most mellifluous names.",
    austrian_empire: "1804-1867. Lasted only 63 years before taking its married name and becoming Austria-Hungary. Metternich, pastries, and Strauss's Blue Danube.",
    polish_lithuanian_commonwealth: "1569-1795. Huge union of Poland and Lithuania. Paradisium Iudaeorum. Despite the awesomely named Winged Hussars, partitioned by Russia, Prussia and Austria.",
    kingdom_of_the_two_sicilies: "1816-1861. The largest kingdom in Italy (Naples and the island) before unification, dissolved by Garibaldi. The Mediterranean as polity.",
    papal_states: "754-1870. Over a thousand years under direct papal rule — the Pope moved to Avignon in the 1300s and forgot to pack his land. Gone with Italian unification.",
    republic_of_florence: "1115-1532. Cradle of the Renaissance, governed by guilds and bankers before falling to the Medici and rising again, better, higher.",
    republic_of_genoa: "1099-1797. Gave us both Columbus and pesto. The everlasting commercial rival of la Serenissima, until Napoleon got them both in the same year.",
    duchy_of_burgundy: "1032-1477. Squeezed between France and the HRE. Dead with Charles the Bold, but it lives on in great wine and one of the noblest colors.",
    inca_empire: "c.1438-1533. The largest pre-Columbian empire. Pizarro captured Atahualpa, collected his ransom in gold and executed him anyway. Unfairest game.",
    kingdom_of_aksum: "c.100-940. Horn of Africa (Ethiopia), parts of Yemen. The prophet Mani said: one of the four great powers of antiquity — alongside Rome, Persia and China.",
    mali_empire: "c.1235-1610. Mansa Musa, maybe the wealthiest person in history, caused the first known inflation crisis. How? By giving golden alms on his way to Mecca.",
    songhai_empire: "c.1400-1591. Fell to Morocco at the Battle of Tondibi: 40k Songhai soldiers without gunpowder didn't stand a chance against 4k Moroccans... with cannons.",
    tibet: "1912-1951. Framed by the Qing collapse and Chinese annexation. The dispute endures. Lhasa remains dreamlike: lofty, distant, unreal.",
    kingdom_of_tahiti: "1788-1880. King Pomaré V sold sovereignty to France for a pension and a title — and died of alcoholism shortly after.",
    kingdom_of_kongo: "c.1390-1914. 500+ years of history. Declined so slowly the title of Manikongo survived as an empty honorific for decades after the state was gone.",
    kingdom_of_benin: "c.1180-1897. 700+ years of power and art — ended in a single British expedition. Their treasures fill western museums, chanting: restitution.",
    crown_of_aragon: "1035-1707. A fifth of Spain and half the Mediterranean under one crown. Sicily came via Constance's inheritance; Sardinia, Naples and even Athens followed. Jaume conquered; the sea remained.",
    west_germany: "1949-1990. Reunified with East Germany in 1990: down came the Berlin Wall, up went David Hasselhoff's fame. Brought the Wind of Change to the east.",
    achaemenid_empire: "c.550-330 BC. Inventors of religious freedom and postal services. Cyrus, King of Kings. Conquered by Alexander the Great in 330 BC.",
    modern_persia: "Renamed Iran by the Shah in 1935 — Persians always called themselves Iranians (Aryans). Global name change; sustained local identity.",
    south_vietnam: "1955-1975. Reunited with its northern sister in 1975. Saigon became Ho Chi Minh City. Its Pho is sweeter, denser — the south always was.",
    north_vietnam: "1945-1975. Nothing beats winning — and Vietnam has triumphed over the unimaginable. Its Pho: more star anise, much clearer.",
    south_yemen: "1967-1990. The only communist state in the Arab world — aligned with the USSR, Cuba and East Germany, until the reunification with North Yemen.",
    ceylon: "1948-1972. One of the great homelands of cinnamon, it is known today as Sri Lanka. First country to elect a woman head of government — Bandaranaike, 1960.",
    rhodesia: "1965-1980. Named after Cecil Rhodes. As Zimbabwe, it printed 100-trillion-dollar bills. Hungary holds the inflation record, but winning at inflation = losing at everything else.",
    gold_coast: "1957. Became Ghana, a country without any overlap with the old empire of the same name (shhh, no hints). Trailblazer of the independence of sub-Saharan Africa.",
    abyssinia: "c.1270-1936. The only African country never colonized — except briefly by Italy (1936-1941). Coffee, rock-hewn churches, and possibly the Ark of the Covenant.",
    burma: "1948-1989. Their sittuyin looks like chess, but, in the setup phase, pieces are placed at the player's discretion. Renamed Myanmar in 1989.",
    belgian_congo: "1908-1960. The worst fact in all of Aris. Leopold II's colonial system: rubber quotas or amputations. Our voice cracks.",
    manchuria: "1932-1945. Japanese puppet state (Manchukuo) during WWII. Site of the atrocious Unit 731. Portrayed literarily by both Murakami and Ken Liu.",
    tanganyika: "1961-1964. Merged with Zanzibar in 1964 to form Tanzania. Lake Tanganyika still carries its name. Geography outlasting politics.",
    nyasaland: "1907-1964. Present-day Malawi ('land of flames') once meant 'land of the lake'. Africa's second deepest lake — and the world's most diverse in cichlids (mbuna).",
    northern_rhodesia: "1924-1964. Cecil J. Rhodes named two states: this one, now Zambia, contains Victoria Falls — one of the last colonial eponyms standing.",
    bechuanaland: "1885-1966. Rags to riches, African political edition. Poor before, wealthy now as Botswana. Diamonds: not always forever, but, boy, they do deliver.",
    basutoland: "1884-1966. Present-day Lesotho: the only country entirely above 1000m. Crossed on pony. The kingdom in the sky — no metaphor.",
    dahomey: "1960-1975. Distinct from the pre-colonial kingdom of the same name. Renamed Benin in 1975. The Dahomey Amazons: real-life warriors, not mere drawings.",
    upper_volta: "1958-1984. Renamed Burkina Faso in 1984 — 'Land of Incorruptible People'. Clearly not an Elizabethan dance.",
    sumer: "c.4500-1900 BC. Almost everything starts here: writing, the calendar, almost everything that comes in groups of 7 or 60. Clearly not aliens.",
    akkad: "c.2334-2154 BC. Invented the concept of empire. Enheduanna, daughter of Sargon, is the first author whose name survives to this day.",
    babylon: "539 BC. Legendary but real. Conquered by Cyrus the Great. Its famous hanging gardens were likely Sennacherib's, in Nineveh. Its lottery was Borges' and ours.",
    assyria: "612 BC. Military power — and accidental library. When Nineveh burned, Ashurbanipal's clay tablets were fired and thus preserved to today. We owe it Gilgamesh.",
    carthage: "146 BC. Delenda est? Yes it was but, sorry, Cato — Carthage was razed, but its memory endures. And the salt sown in its ruins: a myth.",
    phoenicia: "c.1500-332 BC. Analphabetism everywhere, and then: the Phoenician alphabet gave birth to all the others. We owe it purple and a tiny book: the 'Bible' comes from Byblos.",
    dutch_east_indies: "1800-1949. The spice islands. So valuable that a single one of them — Run — was traded for Manhattan in 1667.",
    french_indochina: "1887-1954. Beyond mon amour: France left behind condensed-milk coffee, the banh mi sandwich, the Vietnamese alphabet, and the pho.",
    tannu_tuva: "1921-1944. Absorbed by the USSR in 1944. Feynman desperately wanted to visit; the Soviet bureaucracy had many other plans.",
    weimar_republic: "1919-1933. Hitler's first great victim. Cabarets, Bauhaus, Hirschfeld, and cocaine in a milieu of hyperinflation and post-Versailles unsustainability.",
    third_reich: "1933-1945. Third time, the charmless. Lebensraum-hungry Germany craved 1000 years of glory, 80+ years later it remains a popular synonym of evil and infamy.",
    british_raj: "1858-1947. After WWII and the Bengal famine, India achieved independence alongside Pakistan — and later Bangladesh.",
    mongol_empire: "1206-1368. By far the largest contiguous empire in history: 24 million km². Inventors of the highway in a way, a long one, the Silk Route.",
    lydia: "c.1200-546 BC. Invented coinage, hoarded it. Their king, Croesus, turned out to be less happy than he thought. Solon had warned him.",
    bophuthatswana: "1977-1994. A Bantustan: the apartheid fiction of a homeland where Black majorities were confined without full citizenship. Reintegrated in 1994.",
    transkei: "1976-1994. Another Bantustan, same system: apartheid's geography of dispossession. Reintegrated in 1994.",
    czechoslovakia: "1918-1939; 1945-1992. United and separated twice: once by Nazis, once by the Velvet Divorce. Boomers should press F5 to refresh its name.",
    yugoslavia: "1918-1992. The southern (yugo-) union of Slavs dissolved into ethnic wars in the 90s. Tito was the glue. After Tito, everything fell apart.",
    biafra: "1967-1970. Igbo secession from southeast Nigeria. Recognized by 5 countries, defeated after a devastating civil war and famine.",
    crimea: "1992, 2014. Declared independence twice in three decades — the second time ended in a still disputed Russian annexation.",
    holy_roman_empire: "800/962-1806. Voltaire: neither holy, nor Roman, nor an empire. Sometimes Germanic. Frederick Barbarossa: far better than the mustachioed operation.",
    roman_empire: "27 BC–476 AD. From Augustus to Romulus Augustulus: their names together sound as bad as the empire's end. The East carried on for a thousand more years.",
    mesopotamia: "c.3500-539 BC. Cradle of almost everything: writing, the wheel, law, beer and written complaints. Today: Iraq, always between rivers.",
    vichy_france: "1940-1944. Pétain: Nazi collaboration at a spa resort. French shame, casino parliament, and globally famous fancy water.",
    new_spain: "1521-1821. 300+ years of viceroyalty: Tenochtitlan became Mexico City. Larger and richer than Spain itself. Hispanic epicenter for centuries.",
    new_granada: "1717-1819. The viceroyalty of Colombia, Venezuela, Panama and Ecuador. Bolívar turned it into another state we won't reveal here.",
    kingdom_of_kush: "c.1070 BC–350 AD. Nubia conquered Egypt, ruling it as Dynasty XXV. Their own pyramids: smaller, steeper, prouder, more abundant.",
    carolingian_empire: "800-843. Western Europe reunited by Charlemagne (unseen since Rome). Verdun split it in three: France, Germany and an open wound of sauerkraut/choucroute.",
    kalmar_union: "1397-1523. Denmark, Sweden and Norway under one crown, created by Margaret I of Denmark. From Greenland to Finland — thinly peopled.",
    khwarazmian_empire: "c.1077-1231. Genghis Khan requested trade; the Shah sent back his ambassador's head. Result: a case study in obliteration.",
    republic_of_ragusa: "1358-1808. Better known today as King's Landing or Dubrovnik — dissolved by Napoleon alongside two rivals. Now impossible to visit: always full.",
    empire_of_trebizond: "1204-1461. The last drop of Rome's last successor. A drop that took 8 years to fall, after Constantinople.",
    ptolemaic_egypt: "305-30 BC. Greek face, Egyptian ka. Ptolemy I took Alexander's corpse and the country: centuries of incest culminated in Cleopatra VII.",
    kingdom_of_bohemia: "c.1198-1918. Prague, Kafka and all the Pilsners of the world. Tricultural: German, Jewish, Slavic. Inventor of defenestration and its own spring.",
    duchy_of_savoy: "1416-1860. From Alpine state to the seed of unified Italy: its king was Italy's first, Vittorio Emanuele II. Also gave us the Savoiardo (ladyfinger).",
    great_moravia: "c.833-907. First great Slavic state. Cyril and Methodius invented the Glagolitic alphabet here — grandfather of Cyrillic. Without Great Moravia: zero Russian writing.",
    hanseatic_league: "c.1356-1669. Neither kingdom nor empire: a Baltic and North Sea trade network. Multinational and stronger than most states. Lübeck, Hamburg, Bergen, Gdańsk.",
    seleucid_empire: "312-63 BC. Alexander's hardest conquest, enjoyed by Seleucus — from Syria to Persia — until Rome swallowed it piece by piece.",
    parthian_empire: "247 BC–224 AD. Iran's empire, Rome's Achilles' heel for centuries. At Carrhae, they reportedly killed Crassus by pouring molten gold down his throat.",
    greco_bactrian_kingdom: "256-120 BC. The last Hellenistic frontier: Buddhist and adjacent to India from Afghanistan. Bilingual coins: Greek on one side, Prakrit on the other.",
    kingdom_of_macedonia: "c.808-168 BC. Grew with Philip II, exploded with Alexander. Briefly the center of almost everything. Never Yugoslav. Never northern.",
    lotharingia: "843-959. The awkward piece of Verdun: neither France nor Germany. Its name survives in Lorraine. Alsace, Burgundy, Provence: all its, all fleeting.",
    merovingian_kingdom: "c.481-751. The pre-Carolingian Franks. Clovis founded it; the 'do-nothing kings' sank it. The Carolingians didn't even say thank you.",
    vinland: "c.1000. The Norse beat Columbus by five centuries. L'Anse aux Meadows (Newfoundland): the only confirmed Norse site in North America.",
    austrasia: "c.511-751. The eastern half of the Franks. Reims, Metz, Cologne. From here came the Pippinids — and from them, Charlemagne and many immature jokes.",
    neustria: "c.511-751. The western half of the Franks. Paris, Soissons, Tours. Eternal rival of Austrasia — both consumed by the Carol-whatevers.",
    volga_bulgaria: "c.660-1236. Muslim Turkic state on the Volga — ancestor of modern Tatarstan. Genghis Khan (oh, surprise!) erased it from the map.",
    duchy_of_tuscany: "1569-1861. Florence as Medici capital: the Uffizi built. Renaissance as export quality. Dissolved into Italian unification with barely a murmur.",
    kingdom_of_sukhothai: "c.1238-1438. The first Thai kingdom, whose script and culture founded modern Thailand. Sukhothai: 'dawn of happiness'. We add: delight.",
    kingdom_of_ayutthaya: "1351-1767. Four centuries of commercial dominance in Southeast Asia. Burma sacked it in 1767: one of Asia's richest cities, razed in weeks.",
  },
  synonyms: {
    third_reich: ["nazi germany", "nazi deutschland", "third reich"],
    soviet_union: ["ussr", "cccp"],
    byzantine_empire: ["eastern roman empire", "byzantium"],
    holy_roman_empire: ["hre"],
    ptolemaic_egypt: ["ptolemaic kingdom"],
    czechoslovakia: ["czech republic and slovakia"],
    yugolslavia: ["sfry"],
    dutch_east_indies: ["netherlands east indies"],
    french_indochina: ["indochina"],
    mongol_empire: ["mongolia"],
    carolingian_empire: ["empire of charlemagne"],
    hanseatic_league: ["hansa", "the hanse"],
    greek_bactrian_kingdom: ["greco-bactrian kingdom"],
    vinland: ["vinlandia"],
    volga_bulgaria: ["volga-ural bulgaria"],
  }
});






// ============ PhD FILOSOFÍA EN ============
// 39 FTs — JMAHM completo (Jakob + Wilhelm, 15/07)
// Las claves son las mismas del pool ES; los FTs están en EN.

// data/disertatio.js — ACTUALIZADO 30/06: synonyms por ciencia, extraClips aceptados.

const DISERTATIO = {
  _id: "disertatio",
  name: "Disertatio",
  desc: "El examen que separa Paperback de Hardcover. Cinco ciencias, siete pensadores cada una.",
  ciencias: [
    {
      _id: "matematicas", name: "Matemáticas",
      pensadores: [
        { _id: "euclides",    name: "Euclides",    flavor: "Que toda una disciplina (geometría no-euclidiana) se defina por oposición a ti dice mucho." , flavor_en: "When an entire discipline (non-Euclidean geometry) defines itself in opposition to you: you're HUGE." },
        { _id: "euler",       name: "Euler",        flavor: "Notación matemática: sin él seríamos casi analfanumeri… ¿qué?" , flavor_en: "Mathematical notation: how could one calculate what one cannot write down?" },
        { _id: "gauss",       name: "Gauss",        flavor: "Suena la campana de Gauss, el príncipe de las matemáticas." , flavor_en: "The Gaussian bell rings: the prince of mathematics." },
        { _id: "alkhwarizmi", name: "Al-Khwarizmi", flavor: "El algoritmo detrás de todos los algoritmos. ¡Pero no lo culpes a él!" , flavor_en: "The algorithm behind all algorithms. Don't blame him, though." },
        { _id: "brahmagupta", name: "Brahmagupta",  flavor: "¿Nada vendrá de nada? Si la nada es el cero ¡vendrá toda la matemática!" , flavor_en: "Nothing will come of nothing? If that nothing is zero, all mathematics will follow." },
        { _id: "noether",     name: "Noether",      flavor: "Le pidió a Einstein una carta de recomendación. Einstein le pidió que le explicara su propio teorema." , flavor_en: "Asked Einstein for a letter of recommendation. Einstein asked her for an explanation of his theorem." },
        { _id: "pitagoras",   name: "Pitágoras",    flavor: "¿Por ser legendario es menos real? ¡Triangúlame eso!" , flavor_en: "Being legendary doesn't make you less real. Triangulate that!" }
      ],
      extraClips: [
        { _id: "leibniz",     name: "Leibniz",      flavor: "El cálculo, la notación, el código binario. No es justo: ¡y la teodicea!" , flavor_en: "Calculus, notation, binary code. Unfair — the theodicy on top." },
        { _id: "newton_mate", name: "Newton",        flavor: "Sí, Newton, todo gira en torno a ti. O al menos matemática, física, alquimia…" , flavor_en: "Yes, Newton, everything revolves around you. Or at least mathematics, physics, alchemy..." },
        { _id: "galois",      name: "Galois",        flavor: "Murió en un duelo a los 20. La matemática moderna apenas estaba empezando a entenderlo." , flavor_en: "Died in a duel at 20. Modern mathematics had barely begun to get him." },
        { _id: "pascal",      name: "Pascal",        flavor: "Probable o improbable, Pascal está detrás. Y ¿conocés la Pascalina?" , flavor_en: "Probable or improbable, Pascal is behind it. Do you know the Pascaline?" }
      ],
      synonyms: {
        alkhwarizmi: ["al khwarizmi","al khuwarizmi","algoritmi","al juarismi","al-khwarizmi"],
        brahmagupta: ["brahma gupta"],
        pitagoras:   ["pythagoras"],
        euclides:    ["euclid"],
        noether:     ["emmy noether"],
        newton_mate: ["newton","isaac newton"],
        leibniz:     ["gottfried leibniz"],
        pascal:      ["blaise pascal"],
        galois:      ["evariste galois"]
      }
    },
    {
      _id: "fisica", name: "Física",
      pensadores: [
        { _id: "newton_fis",        name: "Newton",             flavor: "Tema universal de suma gravedad: Ineludible.", flavor_en: "Unavoidable: A matter of universal gravity." },
        { _id: "maxwell",           name: "Maxwell",            flavor: "Electrizante y magnético, ¿cómo resistirse?" , flavor_en: "Electric and magnetic — resistance is futile?" },
        { _id: "einstein",          name: "Einstein",           flavor: "Esto NO es relativo. Absolutamente imprescindible." , flavor_en: "This is NOT relative. Absolutely indispensable." },
        { _id: "bohr",              name: "Bohr",               flavor: "Institucionalidad, complementariedad, modelo (atómico) a seguir." , flavor_en: "Institutionality, complementarity, and a (atomic) model to follow." },
        { _id: "heisenberg",        name: "Heisenberg",         flavor: "Cero incertidumbre: Podemos postular esta posición y este momento de Heisenberg." , flavor_en: "Zero uncertainty: we can postulate this position and this moment of Heisenberg." },
        { _id: "democrito_leucipo", name: "Demócrito / Leucipo",flavor: "Puedes tratar de partirlo como quieras: Pero aquí comienza la verdad de la física." , flavor_en: "Try to split it as much as you like: but here begins the truth of physics." },
        { _id: "feynman",           name: "Feynman",            flavor: "Abrirle los ojos a generaciones enteras le dio el apodo de gran explicador." , flavor_en: "Opening the eyes of entire generations earned him the nickname of the great explainer." }
      ],
      extraClips: [
        { _id: "marie_curie_fis",   name: "Marie Curie",        flavor: "Dos nobeles: Sus logros irradian todo el siglo XX de la mejor y peor manera." , flavor_en: "Two Nobels: her achievements irradiate all of the 20th century, for better and worse." },
        { _id: "aristoteles_fis",   name: "Aristóteles",        flavor: "El primer motor, el primer obstáculo, el primero en todo caso." , flavor_en: "The prime mover, the prime obstacle, the prime in every case." },
        { _id: "faraday",           name: "Faraday",            flavor: "El más irremplazable para todos los que jugamos Aris. Quien se oponga: ¡a una caja de Faraday!" , flavor_en: "The most irreplaceable for all of us playing Aris. Any objectors: into a Faraday cage!" }
      ],
      synonyms: {
        democrito_leucipo: ["democrito","leucipo","democritus","democrito y leucipo"],
        newton_fis:        ["newton","isaac newton"],
        einstein:          ["albert einstein"],
        bohr:              ["niels bohr"],
        heisenberg:        ["werner heisenberg"],
        feynman:           ["richard feynman"],
        marie_curie_fis:   ["marie curie","curie"],
        aristoteles_fis:   ["aristoteles","aristotle"],
        faraday:           ["michael faraday"]
      }
    },
    {
      _id: "quimica", name: "Química",
      pensadores: [
        { _id: "lavoisier",        name: "Lavoisier",    flavor: "Elemental y noble: su fama contiene y resiste el óxido." , flavor_en: "Elementary and noble: his fame contains and resists oxidation." },
        { _id: "mendeleyev",       name: "Mendeléyev",   flavor: "No te dejes encasillar, a menos que seas un elemento y Mendeleiev esté cerca.", flavor_en: "Don't let yourself be pigeonholed — unless you're an element and Mendeleev is nearby." },
        { _id: "boyle",            name: "Boyle",        flavor: "Hay cosas que tienden a ocupar todo el volumen posible: la fama de Boyle y sobre lo que teorizó." , flavor_en: "Some things tend to occupy all available volume: Boyle's fame and what he theorized about." },
        { _id: "pauling",          name: "Pauling",      flavor: "Dos Nobeles: átomos y países enlazados. Lo de la vitamina C, después." , flavor_en: "Two Nobels: atoms and nations bonded. The vitamin C thing, later." },
        { _id: "marie_curie_quim", name: "Marie Curie",  flavor: "Sí, otra vez. Eso explica su doble grandeza." , flavor_en: "Yes, again. That explains her double greatness." },
        { _id: "lise_meitner",     name: "Lise Meitner", flavor: "Pieza clave de la fisión nuclear. Rehusó convertirla en arma. Más de la gloria que de la fama." , flavor_en: "Key piece in nuclear fission. Refused to turn it into a weapon. More of the glory, less of the fame." },
        { _id: "pierre_curie",     name: "Pierre Curie", flavor: "Habrá quien dirá que iónica, pero su dupla con Marie fue covalente de la mejor forma." , flavor_en: "Some might call it ionic, but his partnership with Marie was covalent in the best way." }
      ],
      extraClips: [
        { _id: "seaborg",   name: "Seaborg",   flavor: "¿Qué? ¡10 elementos transuránicos! Y yo que ni sabía que había tantos." , flavor_en: "What? 10 transuranium elements! And I didn't even know there were that many." },
        { _id: "haber",     name: "Haber",     flavor: "Amoniaco sintético, revolución verde: media humanidad no desnutrida. Gas de cloro, ataque químico en Ypres: esposa química suicidada esa misma noche." , flavor_en: "Synthetic ammonia, green revolution: food for half of the world. Chlorine gas, chemical war in Ypres: his chemist wife's suicide that same night." },
        { _id: "hahn",      name: "Hahn",      flavor: "Fisión nuclear experimental (1938). Su colega Lise Meitner hizo el análisis (huyendo de los nazis). Nobel para él. Un elemento con su nombre para ella." , flavor_en: "Experimental nuclear fission (1938). His colleague Lise Meitner did the analysis (while fleeing the Nazis). Nobel for him. An element named after her." },
        { _id: "paracelso", name: "Paracelso", flavor: "La dosis hace el veneno: fundó la toxicología. Arrasó con Galeno y Avicena — bueno, sus libros. Médico, hereje, alquimista. Un poco insoportable." , flavor_en: "The dose makes the poison: founded toxicology. Burned Galen and Avicenna — ok, their books. Doctor, heretic, alchemist. A bit much." }
      ],
      synonyms: {
        mendeleyev:        ["mendeleev","mendeleiev"],
        marie_curie_quim:  ["marie curie","curie"],
        lise_meitner:      ["meitner","lise"],
        pierre_curie:      ["pierre"],
        haber:             ["fritz haber"],
        hahn:              ["otto hahn"],
        paracelso:         ["paracelsus","theophrastus","bombastus"]
      }
    },
    {
      _id: "biologia", name: "Biología",
      pensadores: [
        { _id: "darwin",               name: "Darwin",                 flavor: "No fue una selección arbitraria nuestra, fue por la natural." , flavor_en: "It wasn't an arbitrary selection here — it was natural!" },
        { _id: "aristoteles_bio",      name: "Aristóteles",            flavor: "El ser se dice de muchas maneras: biológica, física, lógica…" , flavor_en: "Being is said in many ways: biological, physical, logical..." },
        { _id: "mendel",               name: "Mendel",                 flavor: "Nuestra herencia y las arvejas coloridas: su mayor legado." , flavor_en: "Our inheritance and his colorful peas: his greatest legacy." },
        { _id: "linneo",               name: "Linneo",                 flavor: "El orden de los órdenes… y familias y reinos y…." , flavor_en: "The order of orders... and families and kingdoms and..." },
        { _id: "pasteur",              name: "Pasteur",                flavor: "Que no te dé rabia. Ni muchas cosas más. Gracias a Pasteur." , flavor_en: "Don't get rabid. Or many other things. Thank Pasteur." },
        { _id: "watson_crick_franklin",name: "Watson / Crick / Franklin",flavor: "Una hélice doble. Con triples descubridores. Un mérito único." , flavor_en: "One double helix. Three discoverers. One credit." },
        { _id: "wallace",              name: "Wallace",                flavor: "Hay líneas metodológicas y hay líneas biogeográficas como la de Wallace." , flavor_en: "There are methodological lines and there are biogeographical lines — like Wallace's." }
      ],
      extraClips: [
        { _id: "leeuwenhoek", name: "Leeuwenhoek", flavor: "No son muchos quienes pueden jactarse de haber descubierto un mundo entero." , flavor_en: "Not many people can boast of having discovered an entire world." },
        { _id: "koch",        name: "Koch",         flavor: "Cuatro postulados, un enfoque enteramente nuevo de la enfermedad. No dioses ni miasmas: gérmenes identificables y claros." , flavor_en: "Four postulates, an entire new approach to disease. Not gods or miasmas: clear identifiable germs." },
        { _id: "haeckel",     name: "Haeckel",      flavor: "Acuñó 'ecología', 'filogenia', 'ontogenia'. Grande también como artista. Equivocado a menudo, pero ¡qué factura!" , flavor_en: "Coined 'ecology', 'phylogeny', 'ontogeny'. Huge also as an artist. Wrong often, but, the workmanship!" }
      ],
      synonyms: {
        aristoteles_bio:       ["aristoteles","aristotle"],
        linneo:                ["linnaeus","carl linnaeus"],
        watson_crick_franklin: ["watson","crick","franklin","rosalind franklin"],
        leeuwenhoek:           ["van leeuwenhoek","antonie van leeuwenhoek"],
        koch:                  ["robert koch"],
        haeckel:               ["ernst haeckel"]
      }
    },
    {
      _id: "astronomia", name: "Astronomía",
      pensadores: [
        { _id: "copernico", name: "Copérnico",              flavor: "El más revolucionario de todos. Punto." , flavor_en: "The most revolutionary of all. Period." },
        { _id: "galileo",   name: "Galileo",                flavor: "Y, sin embargo, gira. ¿Leyenda o legendario?" , flavor_en: "And yet it moves. Legend or legendary?" },
        { _id: "kepler",    name: "Kepler",                 flavor: "Sin darle más vueltas, ¿démosle elipsis?" , flavor_en: "No more running 'round in circles — let's do ellipses." },
        { _id: "hubble",    name: "Hubble",                 flavor: "Antes de él vivíamos en un barrio. Después de él en una megagalactópolis." , flavor_en: "Before him we lived in a neighborhood. After him: in a metagalactopolis." },
        { _id: "sagan",     name: "Sagan",                  flavor: "Visionario, lúcido, traductor para las masas de un pequeño punto azul." , flavor_en: "Visionary, lucid, translator for the masses of a pale blue dot." },
        { _id: "leavitt",   name: "Henrietta Swan Leavitt", flavor: "Punto de referencia obligado en más de un sentido.", flavor_en: "A mandatory reference point — in more than one sense." },
        { _id: "halley",    name: "Halley",                 flavor: "Lo celebramos a diario y cada 76 años." , flavor_en: "We celebrate him daily and every 76 years." }
      ],
      extraClips: [
        { _id: "ptolomeo", name: "Ptolomeo", flavor: "Se equivocó en casi todo: ¿Despreciable? No: así empiezan las ciencias." , flavor_en: "Wrong about almost everything. Sorry for him? No way — that's how science starts." },
        { _id: "herschel", name: "Herschel", flavor: "Iban milenios sin el descubrimiento de un nuevo planeta cuando: Herschel y Urano." , flavor_en: "Millennia passed without new planets — and, then: Herschel and Uranus." },
        { _id: "hawking",  name: "Hawking",  flavor: "Que a veces no lo entendamos no le quita puntos a él, a nosotros sí." , flavor_en: "Not getting him sometimes doesn't subtract from him — but from us." }
      ],
      synonyms: {
        copernico: ["copernicus","nicolas copernico"],
        galileo:   ["galileo galilei"],
        leavitt:   ["henrietta leavitt"],
        ptolomeo:  ["ptolemy","ptolemeo"]
      }
    }
  ]
};

// === phd.js ===
// data/phd.js
// Examen de PhD (Borges, separa Hardcover de Incunabula). Estructura real, contenido placeholder.
// Nombres reales sacados del "Arca de la Humanidad" (armado en otro chat) — son datos factuales
// (nombres propios de pensadores/artistas históricos), no texto creativo protegido.
// Flavor texts son PLACEHOLDER NUMERADO ([1], [2], [3]...) — el trabajo real de redactarlos
// uno por uno es la tarea más larga que vamos a hacer, según Milo. Esto solo prueba arquitectura.

function pensador(id, name) {
  return { _id: id, name, flavor: `[placeholder ${id}]` };
}

const PHD = {
  _id: "phd",
  name: "Examen de PhD",
  desc: "El rito que administra Borges, separa Hardcover de Incunabula. Cinco ramas, cada una con su pool.",

  ramas: [
    {
      _id: "filosofia",
      name: "Filosofía",
      pool: [
        { _id: "aristoteles", name: "Aristóteles", flavor: "Patrono nuestro, clasificador y fundador de casi todas las disciplinas. Paseador incansable, aterrizado, barbado." , flavor_en: "Our patron: classifier and founder of almost every discipline. Tireless walker, grounded, bearded. Wisest factchecker about camel sexuality." },
        { _id: "platon", name: "Platón", flavor: "Siempre mirando hacia arriba: las Ideas son más reales que las cosas. Sigue peleando con Aristóteles en Rafael." , flavor_en: "Always looking up: Ideas are more real than things. Still arguing with Aristotle in Raphael. Real name: Aristocles." },
        { _id: "socrates", name: "Sócrates", flavor: "Ni escribió ni estuvo nunca de acuerdo con la escritura. Se escurre como sus ideas. Patrón y víctima de los fact-checks." , flavor_en: "Never wrote, never agreed with writing. As slippery as his ideas. Patron saint and first victim of fact-checking." },
        { _id: "kant", name: "Kant", flavor: "Nunca salió de Königsberg. Siendo lo exterior incognoscible para qué. Despertado por Hume, trascendente por natura." , flavor_en: "Never left Königsberg. Why would you, if the exterior is unknowable? Woken by Hume, transcendental and judgmental by nature." },
        { _id: "hegel", name: "Hegel", flavor: "La historia apunta arriba y adelante. Entenderlo: difícil; una vez lo entiendes lo ves en toda parte. No traduzcas Aufhebung." , flavor_en: "History points upward and forward. Understanding him: hard. Once you do, you see him everywhere. Don't translate Aufhebung." },
        { _id: "nietzsche", name: "Nietzsche", flavor: "Superhombre, muerte de dios, eterno retorno: tan presente que a veces invisible. Colapsó en Turín abrazando un caballo maltratado. La culpa de todo: su hermana." , flavor_en: "Übermensch, God's death, eternal return: so present he's sometimes invisible. Collapsed in Turin hugging an abused horse. His sister: guilty of everything." },
        { _id: "descartes", name: "Descartes", flavor: "Pienso, luego existo. Meditaciones y deducciones desde la cama. El método y el plano: sus marcas. Némesis y víctima mortal de madrugar." , flavor_en: "I think, therefore I am. Meditations from bed. Methods, doubts and planes: his trademarks. Nemesis and mortal victim of early rising." },
        { _id: "hume", name: "Hume", flavor: "La causalidad es hábito: ¿cómo probar sin dudas que el sol calienta o que se es uno? Despertador de Kant (sin snooze)." , flavor_en: "Causality is habit: how do you prove the sun warms, or that you're one person? Kant's alarm clock — no snooze." },
        { _id: "spinoza", name: "Spinoza", flavor: "Deus sive Natura: Dios = Naturaleza. Pulidor de lentes y métodos: el geométrico forjó su ética. La perseverancia del ser (conatus)." , flavor_en: "Deus sive Natura: God = Nature. Polisher of lenses and methods — the geometric forged his ethics. The perseverance of being (conatus)." },
        { _id: "leibniz", name: "Leibniz", flavor: "Mónadas sin ventanas, el mejor de los mundos posibles y la notación del cálculo (con mejor letra que Newton). Veía lo mejor de cada terremoto." , flavor_en: "Windowless monads, the best of all possible worlds, calculus notation neater than Newton's. Found the upside in every earthquake." },
        { _id: "wittgenstein", name: "Wittgenstein", flavor: "Pague un filósofo, lleve al menos dos: De lo que no se puede hablar, hay que callar, pero luego, muchos juegos. Culto millonario y maestro rural." , flavor_en: "Buy one philosopher, get at least two: whereof one cannot speak — silence; then, many games. Millionaire turned village schoolteacher." },
        { _id: "schopenhauer", name: "Schopenhauer", flavor: "La voluntad como fuerza ciega que todo lo mueve. El pesimismo como sistema. No compitas con Hegel así tengas títulos larguísimos." , flavor_en: "The will as blind force driving everything. Pessimism as a system. Don't compete with Hegel, however long your titles." },
        { _id: "kierkegaard", name: "Kierkegaard", flavor: "Angustia y salto de fe en tres estadios. Padre del existencialismo y dandy a la vez. ¿O lo uno o lo otro, Soren?" , flavor_en: "Anxiety and leaps of faith across three stages. Father of existentialism and dandy at once. Either/Or, Søren?" },
        { _id: "marx", name: "Marx", flavor: "Fantasma en Europa y el tiempo. Más profeta que economista, mejor periodista que ambos. Vivió de un ángel (Engels) y murió sin nada. El Capital: continuará." , flavor_en: "A specter haunting Europe and time. More prophet than economist, better journalist than both. Lived off Engels, died with nothing. Das Kapital: to be continued." },
        { _id: "sartre", name: "Sartre", flavor: "Existo antes de ser. El infierno son los demás. Rechazó el Nobel (¿por náuseas?). Con Beauvoir: la pareja más incómoda de París. Swinger precoz." , flavor_en: "I exist before I am. Hell is other people. Turned down the Nobel (nausea?). With Beauvoir: Paris's most uncomfortable couple. Swinging pioneer." },
        { _id: "camus", name: "Camus", flavor: "Sísifo sonriente, apestado. Nobel a los 44, muerto a los 46 con Gallimard. En el bolsillo: un tiquete de tren sin usar. Aún grita: NO existencialista." , flavor_en: "Smiling Sisyphus, plague-stricken. Nobel at 44, dead at 46 in Gallimard's car. Unused train ticket in pocket. His echo: NOT an existentialist." },
        { _id: "husserl", name: "Husserl", flavor: "Volver a las cosas mismas: la fenomenología. Maestro de Heidegger, el nazi. Judío en la Alemania de los 30: su alumno lo ignoró y luego, peor." , flavor_en: "Back to the things themselves: phenomenology. Heidegger's teacher. Jewish in 1930s Germany: his student ignored him, then worse." },
        { _id: "heidegger", name: "Heidegger", flavor: "El ser y el tiempo. El Dasein. El olvido del ser. Mucho más nazi que Platón y que casi cualquiera. Lo óntico y lo ontológico: ¿genialidad o boutade?" , flavor_en: "Being and time. Dasein. The forgetting of being. Far more Nazi than Plato or almost anyone. The ontic and the ontological: genius or das Gegenteil?" },
        { _id: "locke", name: "Locke", flavor: "Tabula rasa: nacemos en blanco, pero el verde no es verde, lo ves verde. Derechos naturales, contrato social. Jefferson lo copió sin cita APA." , flavor_en: "Tabula rasa: born blank, but green isn't green — you see it green. Natural rights, social contract. Jefferson copied him without an APA citation." },
        { _id: "rousseau", name: "Rousseau", flavor: "Nacemos bueno y la sociedad nos corrompe. Tratadista sobre educación (con cinco hijos abandonados). Falso armenio en UK." , flavor_en: "Born good, corrupted by society. Theorist of education (with five abandoned children). Fake Armenian in the UK." },
        { _id: "epicuro", name: "Epicuro", flavor: "El placer es ausencia de dolor y turbación, o la amistad o el conocimiento. Lo demás: falso o mal placer. El más famoso hedonista vivía como un monje." , flavor_en: "Pleasure is absence of pain and anxiety — or friendship, or knowledge. Everything else: false or bad pleasure. History's most famous hedonist lived like a monk." },
        { _id: "seneca", name: "Séneca", flavor: "Estoico e imperial: millonario, preceptor de Nerón, suicida por orden del mismo, hispano. Cartas a Lucilio: el primer \"podcast\" de Roma (en calidad y fecha)." },
        { _id: "marco_aurelio", name: "Marco Aurelio", flavor: "El gran emperador filósofo, tal vez el mejor regente-pensador de la historia — rara et magna avis. Sus Meditaciones: íntimas y sin intención de publicar." , flavor_en: "The great philosopher-emperor, perhaps history's best ruler-thinker — rara et magna avis. His Meditations: intimate, never meant to be published." },
        { _id: "berkeley", name: "Berkeley", flavor: "Ser es ser percibido. ¿Nadie te ve? ¡Dejas de existir! Aunque, Dios... El solipsismo más piadoso. Imposible de creer y de dudar." , flavor_en: "To be is to be perceived. Nobody's watching? You cease to exist! Unless God... The most pious solipsism. Impossible to believe — or to doubt." },
        { _id: "voltaire", name: "Voltaire", flavor: "Anagramático antagonista de la superstición, la intolerancia y el optimismo leibniziano. Cándido, la mejor introducción a la filosofía. Corresponsal de Catota." , flavor_en: "Anagrammatic antagonist of superstition, intolerance and Leibnizian optimism. Candide: the best introduction to philosophy. Catherine the Great's pen pal." },
        { _id: "san_agustin", name: "San Agustín", flavor: "Fiestero converso, africano Doctor de la Iglesia y águila. Platón + San Pablo = teología occidental. Sus Confesiones inventaron la introspección." , flavor_en: "Reformed party-goer, African Doctor of the Church, Eagle of Hippo. Plato + Saint Paul = Western theology. His Confessions invented introspection." },
        { _id: "santo_tomas", name: "Santo Tomás", flavor: "Aristóteles + fe cristiana = escolástica. La razón justifica la fe en cinco vías. Enemigos multitudinarios: averroístas, agustinianos, seglares..." , flavor_en: "Aristotle + Christian faith = scholasticism. Reason justifies faith in five ways. Enemies: countless — Averroists, Augustinians, laypeople..." },
        { _id: "simone_de_beauvoir", name: "Simone de Beauvoir", flavor: "No se nace mujer: se llega a serlo. Existencialismo general (o sea, de género). Con Sartre, pareja: luchas de egos que solían perder otras. El Segundo Sexo." , flavor_en: "One is not born a woman — one becomes one. Existentialism applied to gender. With Sartre: ego battles others usually lost. The Second Sex." },
        { _id: "hannah_arendt", name: "Hannah Arendt", flavor: "Judía alemana: sobrevivió lo impensable y luego lo pensó. Los totalitarismos y la banalidad del mal. Tanta lucidez rara vez cae bien." , flavor_en: "German Jew: survived the unthinkable, then thought it through. Totalitarianism and the banality of evil. That much lucidity rarely goes down well." },
        { _id: "buda", name: "Buda", flavor: "Siddhartha Gautama: príncipe que dejó todo por el sufrimiento y luego también a él. Cuatro verdades y ocho senderos, pero maya. ¿La religión más filosófica?" , flavor_en: "Siddhartha Gautama: prince who gave up everything for suffering — then suffering too. Four truths, eight paths, but maya. The most philosophical religion?" },
        { _id: "epicteto", name: "Epicteto", flavor: "Esclavo filósofo: no escribió, sus alumnos lo escribieron. Controla lo que puedes y contrólate para no desgastarte en lo que no. El mejor tipo de autoayuda." , flavor_en: "Philosopher-slave: he didn't write — his students did. Control what you can; don't waste yourself on what you can't. The best kind of self-help." },
        { _id: "parmenides", name: "Parménides", flavor: "El ser es, el no-ser no es: ¡siempre! Siendo así, desde antes ya sabías esto porque, de paso, ¿antes? Si nada puede moverse o cambiar, ¿para qué argumentar?" },
        { _id: "platon", name: "Platón", flavor: "El diálogo como filosofía, desde lo inconclusivo del maestro hasta lo casi fanático suyo propio. Su nombre \"ancho\" cobija tanto su espalda como sus intereses." , flavor_en: "Being is, non-being is not — always! Given that, you already knew this. And by the way: 'before'? If nothing moves or changes, why argue?" },
        { _id: "confucio", name: "Confucio", flavor: "No fundó una religión sino un sistema de relaciones y exámenes. Ren (benevolencia), li (ritual) y la jerarquía como ética. Patrono milenario de la burocracia." , flavor_en: "Founded no religion — a system of relationships and examinations. Ren (benevolence), li (ritual), hierarchy as ethics. Millennia-old patron of bureaucracy." },
        { _id: "avicena", name: "Avicena", flavor: "Ibn Sina: el gran terapeuta del medioevo. Curar y filosofar se parecen. Germen de gérmenes, la ictericia como síntoma. Prisionero y bebedor de orina." , flavor_en: "Ibn Sina: the great medieval healer. Curing and philosophizing 2x1. Germ of germs, jaundice as symptom. Prisoner and taster of urine." },
        { _id: "karl_popper", name: "Karl Popper", flavor: "Si no puede ser falso, no puede ser científico (chao, marxismo y psicoanálisis: pseudociencias). La sociedad abierta y sus enemigos. Platón, persona non grata." , flavor_en: "If it can't be falsified, it's not science (goodbye, Marxism and psychoanalysis). The open society and its enemies. Plato: persona non grata." },
        { _id: "russell", name: "Russell", flavor: "Matemáticas, lógica, paz, sexo, bertrandrussell.com avant la lettre. Nobel de Literatura. Cofundador de la filosofía analítica con Frege. Divulgador sin piedad." , flavor_en: "Mathematics, logic, peace, sex. Too late for polymathy, too early for the internet. Nobel in Literature. Co-founder of analytic philosophy." },
        { _id: "diogenes", name: "Diógenes", flavor: "Su dirección: un barril, la de sus pajas, donde fuera. Alejandro quitasol y Diógenes cero tímido. Patrono de punks, viejos verdes y demás sabios." , flavor_en: "His address: a barrel; his pleasures, wherever. Moved Alexander's shadow; didn't blink. Patron saint of punks, dirty old men and other sages." },
        { _id: "heraclito", name: "Heráclito", flavor: "Todo fluye, solo el logos perdura. Escribía para no ser entendido — lo logró de sobra. Oscuro por diseño, profundo por necesidad. Ojo: boñiga no es terapia." , flavor_en: "Everything flows, only the logos endures. Wrote to be misunderstood — succeeded brilliantly. Dark by design, deep by necessity. Note: dung is not therapy." },
        { _id: "averroes", name: "Averroes", flavor: "Ibn Rushd: el ctrl-c, ctrl-v con comentarios que le devolvió Aristóteles a Europa. Córdoba: bisagra entre islam y escolástica. Prohibido y luego canónico." , flavor_en: "Ibn Rushd: the ctrl-c, ctrl-v with commentary that gave Aristotle back to Europe. Córdoba: hinge between Islam and scholasticism. Banned, then canonical." }
      ],
      pedir: 7
    },
    {
      _id: "ciencias_humanas",
      name: "Ciencias Humanas",
      pool: [
        { _id: "freud", name: "Sigmund Freud", flavor: "El inconsciente, el Edipo, la libido: todo es sexo y muerte (Eros y Tánatos) y tu mamá. La escucha metódica. Su diván: el gran confesionario laico." },
        { _id: "max_weber", name: "Max Weber", flavor: "Ética protestante, espíritu del capitalismo: el trabajo duro como señal de gracia divina. La jaula de hierro de la burocracia. Vacúnate contra la gripa." , flavor_en: "Protestant ethic, spirit of capitalism: hard work as sign of divine grace. The iron cage of bureaucracy. Get your flu shot." },
        { _id: "durkheim", name: "Émile Durkheim", flavor: "Aspirante a rabino, teórico social del suicidio, padre de la anomia. La religión como cohesión: Dios es la sociedad mirándose al espejo." },
        { _id: "herodoto", name: "Heródoto", flavor: "Padre de la historia y paisano del mausoleo. Historia = pesquisa: escribió todo — hasta lo que no vio. Trampolín de Tucídides (como crítico)." , flavor_en: "Father of history from the lands of the mausoleum. History = inquiry: wrote everything, especially what he didn't see. Thucydides's launching pad (as critic)." },
        { _id: "saussure", name: "Ferdinand de Saussure", flavor: "La lengua: sistema arbitrario de diferencias. 'Es vaca porque ni es perro ni colibrí ni...' Sin Saussure, ni estructuralismo ni medio siglo XX." },
        { _id: "foucault", name: "Foucault", flavor: "¿Todo es poder? El skinhead más famoso. El tercer y más reciente pensador de la sospecha. Sexo, clínica, locura, cuerpo. El gran mártir académico del SIDA." , flavor_en: "Is everything power? History's most famous skinhead. Third and most recent master of suspicion. Sex, clinic, madness, body. Academia's great AIDS martyr." },
        { _id: "levi_strauss", name: "Lévi-Strauss", flavor: "Los mitos funcionan como lenguajes y la antropología es música estructural. Buenos y rigurosos salvajes, tristes trópicos, bricolage y triángulos culinarios." , flavor_en: "Myths work like languages; anthropology is structural music. Good savages, sad tropics, bricolage and culinary triangles. Unrelated to the best of AIs." },
        { _id: "bourdieu", name: "Bourdieu", flavor: "Cuatro capitales, némesis de la petite bourgeoisie y sus faux pas, pero como académico, petulante quizás. La violencia simbólica y el habitus." , flavor_en: "Four capitals, nemesis of the petite bourgeoisie and their faux pas — though as an academic, arguably one himself. Symbolic violence and habitus." },
        { _id: "chomsky", name: "Noam Chomsky", flavor: "Tábula gramática: venimos de fábrica con núcleos de lenguaje. Sus incoloras ideas verdes aun duermen pero el pirahã es furioso, dicen." },
        { _id: "benjamin", name: "Walter Benjamin", flavor: "El aura vs. la reproducción técnica. Marx y la cábala. De las víctimas que más nos duelen del nazismo. Casi llega a España, su manuscrito llegó al mundo." },
        { _id: "tucidides", name: "Tucídides", flavor: "Siempre segundo y quejumbroso. La guerra del Peloponeso. Ni dioses ni destino: poder, miedo y ambición. El del príncipe le heredó mucho, él a pocos." , flavor_en: "Always second, always complaining. The Peloponnesian War. No gods, no fate: power, fear and ambition. The Prince's author owed him much; he owed few." },
        { _id: "jung", name: "Carl Gustav Jung", flavor: "Inconsciente colectivo, arquetipos y la sombra. Antipródigo del del diván: pelea sin perdón. ¿Su sincronicidad hizo que tú y nosotros lo incluyéramos aquí?" },
        { _id: "maquiavelo", name: "Maquiavelo", flavor: "El príncipe como manual de poder sin moral. No inventó la crueldad política: la describió. Su adjetivo es mucho peor que él." , flavor_en: "The Prince as a manual of power without morality. Didn't invent political cruelty — described it. His adjective is far worse than he was." },
        { _id: "adam_smith", name: "Adam Smith", flavor: "La mano invisible del mercado. La riqueza de las naciones: de los más citados y menos leídos. Profesor de filosofía moral antes de su fama." , flavor_en: "The invisible hand of the market. The Wealth of Nations: among the most cited and least read. Moral philosophy professor before his fame." },
        { _id: "keynes", name: "John Maynard Keynes", flavor: "Demanda agregada, gasto público como estímulo, el multiplicador. Economista de día, especulador exitoso de noche. Bloomsbury y el ballet: tuvo su cuota." },
        { _id: "simmel", name: "Georg Simmel", flavor: "La sociología de lo cotidiano: dinero, moda, extranjero, la metrópolis. El más literario de los sociólogos clásicos. Judío sin cátedra en Berlín." },
        { _id: "barthes", name: "Roland Barthes", flavor: "La muerte del autor. La de su madre: cámara lúcida. Egoísta justificado de recuerdos. Abreojos muerto por un camión de lavandería." },
        { _id: "marc_bloch", name: "Marc Bloch", flavor: "Medievalista francés fusilado por la Resistencia. Murió como vivió: estudiando el poder y desafiándolo." },
        { _id: "mary_beard", name: "Mary Beard", flavor: "La clasicista más famosa de Twitter. Lleva décadas diciéndonos que Roma no era tan blanca ni tan ordenada." },
        { _id: "harari", name: "Yuval Noah Harari", flavor: "Contó la historia de la humanidad en un bestseller y convenció a millones. Los historiadores no se lo perdonan." },
        { _id: "judith_butler", name: "Judith Butler", flavor: "El género no es lo que eres sino lo que haces. Gender Trouble, 1990: el libro que convirtió la performatividad en subversión." },
        { _id: "edward_said", name: "Edward Said", flavor: "Jerosolimitano, profesor de Columbia, inventó el orientalismo como crítica. Occidente (apegado a sus chinoiseries) aún no termina de digerirlo." },
        { _id: "frantz_fanon", name: "Frantz Fanon", flavor: "Psiquiatra martiniqués que diagnosticó el colonialismo como enfermedad mental. Los condenados de la tierra, 1961." },
        { _id: "margaret_mead", name: "Margaret Mead", flavor: "Fue a Samoa a estudiar adolescentes y cambió la antropología. Quizás inventó algo de lo que encontró. Enemiga del PMS." },
        { _id: "marcel_mauss", name: "Marcel Mauss", flavor: "Sobrino de Durkheim, inventor del don: el regalo que humilla y obliga y encadena y endeuda." },
        { _id: "goffman", name: "Erving Goffman", flavor: "La presentación de la persona, 1959. La vida social es teatro. Todos actuamos, todos tenemos bastidores. No confundir con el bardo." },
        { _id: "bauman", name: "Zygmunt Bauman", flavor: "Inventó la modernidad líquida: todo fluye, nada dura, el amor incluido. Polonia lo expulsó; Inglaterra lo acogió." },
        { _id: "milton_friedman", name: "Milton Friedman", flavor: "El economista que convenció al mundo de que el mercado sabe más que el Estado. Thatcher y Pinochet tomaron nota." },
        { _id: "piketty", name: "Thomas Piketty", flavor: "Demostró con datos que la desigualdad crece sola. El capital en el siglo XXI lo leyó todo el mundo menos los ricos." },
        { _id: "john_stuart_mill", name: "John Stuart Mill", flavor: "Utilitarista, feminista avant la lettre, defensor de la libertad individual. Raro para su época; obvio para la nuestra." },
        { _id: "piaget", name: "Jean Piaget", flavor: "Estudió a sus propios hijos para entender cómo aprenden los niños. Fundó la psicología del desarrollo. Ha envejecido genial." },
        { _id: "maslow", name: "Abraham Maslow", flavor: "Dibujó la pirámide de las necesidades humanas. Tan fundamental y difundido que a veces ya ni lo vemos." },
        { _id: "alejandro_magno", name: "Alejandro Magno", flavor: "Conquistó el mundo conocido antes de los 33. Murió en Babilonia. ¿Fiebre, veneno o exceso? Aún se discute." },
        { _id: "julio_cesar", name: "Julio César", flavor: "Cruzó el Rubicón, conquistó las Galias, murió en el Senado. Dio nombre a los meses, los zares y las cesáreas." },
        { _id: "sun_tzu", name: "Sun Tzu", flavor: "Escribió El arte de la guerra hace 2500 años. Hoy lo leen ejecutivos, entrenadores y generales por igual." },
        { _id: "gandhi", name: "Mahatma Gandhi", flavor: "Derrotó al Imperio Británico con una marcha de sal y un telar. La no-violencia como estrategia política total. Preferimos no hablar de enemas." },
        { _id: "mandela", name: "Nelson Mandela", flavor: "27 años preso. Salió y perdonó. Presidió Sudáfrica sin venganza. El siglo XX no tuvo muchos así. Patrono del efecto más molesto del presente." },
        { _id: "churchill", name: "Winston Churchill", flavor: "Salvó a Europa del nazismo con discursos, whisky y terquedad. También con trigo de la India: hambruna de Bengala." },
      ],
      pedir: 10
    },
    {
      _id: "escenicas",
      name: "Escénicas",
      pool: [
        { _id: "shakespeare", name: "Shakespeare", flavor: "El más grande y ubicuo. No inventó el inglés pero casi (y de paso lo humano). Hamlet, Lear, Otelo, Macbeth y su señora. Mal helenista y peor marido." , flavor_en: "Without peers. Didn't invent English — just about half of it and human nature. Give or take. Main tragedies: Hamlet, Lear, Othello, Macbeth and marriage. Bad Hellenist, worse husband." },
        { _id: "moliere", name: "Molière", flavor: "La suya, la gran comedia moderna. Tartufo, el misántropo, el avaro. Murió en escena como enfermo imaginario. Tan gracioso que no llega a trágico." , flavor_en: "The greatest modern comic. Tartuffe, the misanthrope, the miser. Died onstage playing a deluded sick man. So funny he failed at being tragic." },
        { _id: "stanislavski", name: "Stanislavski", flavor: "El método: vivir el personaje, no representarlo. Padre del actor moderno. De Moscú a Hollywood sin escalas ni pasaporte. No justifica ser grosero o loco." , flavor_en: "The method: live the character, don't represent it. Father of the modern actor. From Moscow to Hollywood, no passport. Doesn't justify rudeness or unhingedness." },
        { _id: "brecht", name: "Brecht", flavor: "Teatro épico: espectador pensante, no plañideras. El distanciamiento (Verfremdung), su política, el Berliner Ensemble, su laboratorio. Más coraje que madre." , flavor_en: "Epic theatre: thinking spectator, not weeping one. Distancing effect (Verfremdung), politics, the Berliner Ensemble as lab. More courage than Mother." },
        { _id: "artaud", name: "Artaud", flavor: "El teatro de la crueldad: no narrar sino golpear los nervios. Loco y visionario, peyote y manicomios. El cuerpo sin órganos original." , flavor_en: "Theatre of cruelty: don't narrate — assault the nerves. Mad and visionary, peyote and asylums. The original body without organs." },
        { _id: "grotowski", name: "Grotowski", flavor: "Teatro pobre: sin decorados, sin luces, sin nada salvo el actor y el espectador. El más riguroso y radical heredero de Stanislavski. Dogma 95 en escena, live." , flavor_en: "Poor theatre: no sets, no lights, nothing but actor and spectator. The most rigorous and radical heir of Stanislavski. Dogma 95 onstage, live." },
        { _id: "chekhov", name: "Chéjov", flavor: "Nada pasa y todo sucede. El tío Vania, Las tres hermanas, El jardín de los cerezos. El arma de Chekhov: siempre dispara y si no, su porqué tendrá." },
        { _id: "lope_de_vega", name: "Lope de Vega", flavor: "1800 obras, 500 conservadas: Fénix de los Ingenios. Inventó el teatro popular español. Soldado, sacerdote, amante serial: vivió cuatro vidas." , flavor_en: "1800 plays, 500 surviving: Phoenix of Wits. Invented popular Spanish theatre. Also, soldier, priest, serial lover: lived four lives." },
        { _id: "calderon", name: "Calderón de la Barca", flavor: "Hipogrifo violento: así abre La vida es sueño. ¿Qué es la vida? Una ilusión. El gran barroco desengañado. Más filósofo que Tirso, más denso que Lope." },
        { _id: "sofocles", name: "Sófocles", flavor: "Edipo, Antígona, Electra. Introdujo el tercer actor y pintó los decorados y a la gente como mejor de lo que es. Ganó más que sus pares. Murió a los 90, feliz." , flavor_en: "Oedipus, Antigone, Electra. Introduced the third actor and painted sets. Portrayed people better than they are. Won more than his peers. Died at 90, happy." },
        { _id: "esquilo", name: "Esquilo", flavor: "El primero: sin él ni segundo actor ni diálogo. La única trilogía que quedó. Orestes y Xerxes: venganza e historia. Muerte: tortuga del cielo contra calva." , flavor_en: "The first: without him, no second actor, no dialogue. The only complete trilogy that survived. Orestes and Xerxes: revenge and history. Death: sky-turtle vs. bald head." },
        { _id: "euripides", name: "Eurípides", flavor: "El más moderno y melodrámático. Medea, Hécuba vuelta perro, las Troyanas. ¿Impío o humanista? Favorito de nuestro patrono. Más cercano al feminismo y lo queer." , flavor_en: "The most modern and melodramatic. Medea, Hecuba turned dog, the Trojan Women. Impious or humanist? Our patron's favorite. Closest to feminism and queer sensibility." },
        { _id: "aristofanes", name: "Aristófanes", flavor: "La gran comedia antigua: obscena, política, salvaje. Nubes, Ranas, Lisístrata, mujeres y política. Se burló del padre de la filosofía: en vida y en público." , flavor_en: "Greatest ancient comic: obscene, political, ruthless. Clouds, Frogs, Lysistrata — women and politics. Mocked the father of philosophy in public, live." },
        { _id: "ibsen", name: "Ibsen", flavor: "El padre del drama moderno. Casa de muñecas, Hedda Gabler, El pato salvaje. La mujer en el centro del escenario europeo y sin pedir permiso." , flavor_en: "Father of modern drama. A Doll's House, Hedda Gabler, The Wild Duck. Woman at the center of the European stage, no permissions asked." },
        { _id: "strindberg", name: "Strindberg", flavor: "El otro sueco, el oscuro. La señorita Julia, El padre. Misógino declarado pero de los mejores retratistas de mujeres (después del de Hedda)." , flavor_en: "The other Swede, the dark one. Miss Julie, The Father. Declared misogynist but among the finest portrayers of women (after Hedda's creator)." },
        { _id: "beckett", name: "Beckett", flavor: "Esperando a Godot: nadie llega, nada pasa, bis. Nobel 1969. Autor en francés para no lucirse en inglés. Más nada que palabras, más palabras que nadie." , flavor_en: "Waiting for Godot: no arrivals, nothing happens, in a loop. Nobel 1969. Wrote in French to avoid showing off in English. More nothing than words; more words than anyone." },
        { _id: "pirandello", name: "Pirandello", flavor: "Seis personajes en busca de autor: metateatro premetateatro. Nobel 1934: fundido y donado a fascistas para colonizar Etiopía. Juzgamos (y la historia más)." , flavor_en: "Six Characters: metatheatre before metatheatre. Nobel 1934: melted his medal, donated to fascists to colonize Ethiopia. They failed." },
        { _id: "wagner", name: "Wagner", flavor: "Gesamtkunstwerk (obra total y única): todas las artes en una. ¿Qué diría del cine? Venerado por tiranos y filósofos a ratos. Antisemita como pocos." , flavor_en: "Gesamtkunstwerk (total artwork): all arts as one. What would he say about cinema? Venerated by tyrants and philosophers in turns. Antisemite of rare dedication." },
        { _id: "lorca", name: "Lorca", flavor: "Teatro poético, gitano y trágico. Bodas de sangre, Yerma, Bernarda Alba. Fusilado al alba de la guerra civil. Cuerpo aún perdido, protomártir gay." , flavor_en: "Poetic, gypsy, tragic theatre. Blood Wedding, Yerma, The House of Bernarda Alba. Shot at dawn in the Civil War. Body still missing. Gay proto-martyr." },
        { _id: "pinter", name: "Pinter", flavor: "Pausas y silencios elocuentes. Nobel 2005. Antibelicista, politizador y dramaturgo sin pausa ni tregua. También sin pausa: su pasión por el cricket." , flavor_en: "Eloquent pauses and silences. Nobel 2005. Anti-war, politicized playwright without pause or truce. Also without pause: his passion for cricket." },
        { _id: "hitchcock", name: "Hitchcock", flavor: "Elevó el suspense a gran género y la dirección a arte. MacGuffins, rubias en blanco y negro, antispoilers avant la lettre. Mejor director, mal modelo moral." , flavor_en: "Elevated suspense to a great genre and direction to an art. MacGuffins, blondes even in B&W, anti-spoilers avant la lettre. Greatest director, poor moral model." },
        { _id: "bach", name: "Bach", flavor: "El más matemático de los músicos: razón y pasión en éxtasis. Variaciones Goldberg, Pasiones, el Clave bien temperado. Gran esposa, obra y prole." , flavor_en: "The most mathematical of musicians: reason and passion in ecstasy. Goldberg Variations, Passions, the Well-Tempered Clavier. Great wife, work and offspring." },
        { _id: "brando", name: "Marlon Brando", flavor: "Método encarnado: el más práctico en definir al actor moderno (nunca leyó a Stanislavski). Deseo, Padrino, Apocalypse. Gordo, difícil, irrepetible. ¡Stella!" },
        { _id: "kubrick", name: "Kubrick", flavor: "Perfeccionista clínico: todo calculado, cada actor agotado. 2001, Naranja, Shining. Para huir de USA se encerró en una casa en UK. Pobre Shelley Duvall." , flavor_en: "Clinical perfectionist: everything calculated, every actor exhausted. 2001, Clockwork Orange, The Shining. Fled USA to a UK lockdown. Poor Shelley Duvall." },
        { _id: "beethoven", name: "Beethoven", flavor: "Sordo, furioso y despeinado. Nueve sinfonías como arco vital. Se dice que más moreno de lo que lo pintan. Su Heroica: dedicada a Napoleón, quitada al emperador." , flavor_en: "Deaf, furious and disheveled. Nine symphonies as vital arc. Said to be darker-skinned than portraits suggest. His Eroica: for Napoleon, then taken back." },
        { _id: "scorsese", name: "Scorsese", flavor: "Cine americano tan de autor que es cuasiitaliano. Taxi Driver, Goodfellas, Raging Bull. Violencia litúrgica. Cinéfilo y guardián." , flavor_en: "American cinema so authored it's quasi-Italian. Taxi Driver, Goodfellas, Raging Bull. Liturgical violence. Cinephile and guardian." },
        { _id: "verdi", name: "Verdi", flavor: "Cima operática: Rigoletto, Traviata, Aida, Falstaff: ni la mitad de su catálogo. La donna è mobile. Viva V.E.R.D.I. ¡Ni le hables de Wagner!" , flavor_en: "Operatic peak: Rigoletto, Traviata, Aida, Falstaff — not even half his catalogue. La donna è mobile. Viva V.E.R.D.I. Don't mention Wagner." },
        { _id: "almodovar", name: "Almodóvar", flavor: "De punk queer de la movida a celebrada lumbrera imprescindible. Casi nadie ha sido más elocuente sobre la feminidad. Rojo, diseño, dolor, grotesco." , flavor_en: "From queer punk of the movida to celebrated indispensable luminary. Few have been more eloquent about femininity. Red, design, pain, grotesque." },
        { _id: "chaplin", name: "Chaplin", flavor: "Vagabundo sabio, judío incierto: risa sin crueldad y con política. Triplicó la edad de su última mujer: cero gracioso. Casi todo lo demás: demasiado." , flavor_en: "Wise tramp, uncertain Jew: laughter without cruelty and with politics. Tripled his last wife's age: not funny. Almost everything else: too much." },
        { _id: "callas", name: "Callas", flavor: "La voz de la ópera del XX: en auge, caída y cine. Técnica, drama, Onassis. Murió sola en París con el teléfono al lado. La Divina no tenía a quién llamar." , flavor_en: "The operatic voice of the 20th century. Technique, drama, Onassis. Died alone in Paris, phone beside her. La Divina had no one to call." },
        { _id: "orson_welles", name: "Orson Welles", flavor: "Ciudadano Kane a los 25. Aclamada pero no por Hearst quien la inspiró. De ahí: Hollywood perdiendo pero que él no ganando. Rosebud." , flavor_en: "Citizen Kane at 25. Acclaimed — not by Hearst, who inspired it. From there: Hollywood losing but him not winning. Rosebud." },
        { _id: "kurosawa", name: "Kurosawa", flavor: "El cine japonés que Occidente entendió y el que no. Rashomon, los Siete Samurais, Ran. Cada plano: una pintura. Pretender entender es una incomprensión." , flavor_en: "Japanese cinema the West thought had understood — which was wrong. Rashomon, Seven Samurai, Ran. Every frame: a painting." },
        { _id: "fellini", name: "Fellini", flavor: "Roma, el circo, el sueño y la memoria. 8½ como autobiografía universal. Inventó su propio adjetivo: felliniano. Soñamos que nos vean como él a su mujer." , flavor_en: "Rome, the circus, dream and memory. 8½ as universal autobiography. Invented his own adjective: Felliniesque. We all dream of being seen as he saw his wife." },
        { _id: "bergman_ingmar", name: "Ingmar Bergman", flavor: "El silencio de Dios como gravedad filmográfica. El séptimo sello, Persona, Gritos y susurros. Sueco, luterano y tan oscuro. En al menos dos sentidos." },
        { _id: "truffaut", name: "Truffaut", flavor: "Los 400 golpes: el niño cinéfilo y libre. El corazón infantil de la nouvelle vague. Nos regaló a Fanny Ardant y el tourbillon de la vie. Crítico y artista." , flavor_en: "The 400 Blows: the cinephile child, free. The childlike heart of the Nouvelle Vague. Gave us Fanny Ardant and le tourbillon de la vie. Critic and artist." },
        { _id: "mozart", name: "Mozart", flavor: "Prodigio a los 5, maestro a los 10, muerto a los 35. Precoz hasta para Rimbaud. Las letras más sucias de la música más culta." , flavor_en: "Prodigy at 5, master at 10, dead at 35. Precocious even for Rimbaud. The dirtiest lyrics in the most refined music." },
        { _id: "pavarotti", name: "Pavarotti", flavor: "La voz más pop del bel canto del XX. Tres tenores, pero él arrasaba. Playback o no: escalofríos/sílaba imbatibles. Ese Vincerò te conquista siempre." , flavor_en: "The most pop voice of bel canto. Three Tenors, but he swept the room. Playback or not: unbeatable in chills per syllable. That Vincerò always conquers." },
        { _id: "caruso", name: "Caruso", flavor: "La voz que gritó: ¡vale la pena grabar! Primer tenor pop. Lo que conservamos es sombra y susurro de lo que podía: la tecnología apenas empezaba." , flavor_en: "The voice that shouted: recording is worth it! First tenor pop star. What we kept is shadow and whisper of what he could do: technology was barely beginning." },
        { _id: "freddie_mercury", name: "Freddie Mercury", flavor: "Cuatro octavas, bisexual declarado, global: persa de Zanzíbar vía Londres. Bohemian Rhapsody: una toma. Quizás el mayor ícono trágico del SIDA. ¿Caruso quién?" , flavor_en: "Four octaves, openly bisexual, global: Persian from Zanzibar via London. Bohemian Rhapsody: one take. Perhaps the greatest tragic icon of AIDS. Caruso who?" },
        { _id: "goethe", name: "Goethe", flavor: "El hombre universal y alemán. Fausto vendealmas; Werther, suicidio en boga. Su teoría de colores primarios contra Newton: arte ante/contra ciencia." , flavor_en: "The universal German. Faust sells souls; Werther made suicide fashionable. His theory of primary colors against Newton: art before/against science." },
        { _id: "chopin", name: "Chopin", flavor: "Un piano que llora en polaco. Nocturnos como confesiones susurrantes. Su corazón volvió a Varsovia, su música no podría nunca irse." , flavor_en: "A piano weeping in Polish. Nocturnes as whispered confessions. His heart returned to Warsaw; his music travelled everywhere." },
        { _id: "tchaikovsky", name: "Tchaikovsky", flavor: "Cascanueces, Lago de los Cisnes, 1812 con cañones. Homosexual en la Rusia zarista. La Patética como despedida. Muerte incierta: ¿cólera? ¿suicidio?" , flavor_en: "Nutcracker, Swan Lake, 1812 with cannons. Gay in tsarist Russia. The Pathétique as farewell. Cause of death uncertain: cholera? Suicide?" },
        { _id: "puccini", name: "Puccini", flavor: "La Bohème, Tosca, Madama Butterfly. Turandot: ¿inconclusa o concluida con la pequeña Liù? Otro la cerró. Da igual: el Vincerò es de Puccini." , flavor_en: "La Bohème, Tosca, Madama Butterfly. Turandot: unfinished or finished with little Liù? Someone else closed it. No matter: the Vincerò is Puccini's." },
        { _id: "stravinsky", name: "Stravinsky", flavor: "La Consagración de la Primavera: pague estreno, lleve motín, 1913. Reinventor del ritmo. ¿Coherencia? Eso no se le pide a genios proteicos." , flavor_en: "The Rite of Spring: buy one premiere, get one riot, 1913. Reinventor of rhythm. Consistency? Not a requirement for protean geniuses." },
        { _id: "haendel", name: "Haendel", flavor: "El Mesías: 24 días de fiebre creativa con culmen en El Aleluya. Se escucha de pie: tradición desde su estreno, motivo perdido en la leyenda." , flavor_en: "The Messiah: 24 days of creative fever, culminating in the Hallelujah. To be heard while standing: a tradition since its premiere, the reason: long lost." },
        { _id: "coppola", name: "Coppola", flavor: "El Padrino, la tragedia griega más moderna e italoamericana. Apocalypse Now: la guerra como delirio. Dinástico: al pobre Nick le tocó fingir no pertenecer." , flavor_en: "The Godfather: the most modern Greek tragedy, Italian-American edition. Apocalypse Now: war as total delirium. Dynastic: poor Nick behind a Cage." },
        { _id: "spielberg", name: "Spielberg", flavor: "El niño soñador: extraterrestres y tiburones. Tiburón: el blockbuster veraniego se siente eterno, pero viene de él. Schindler's List: mostrar lo impensable." , flavor_en: "The dreaming boy: aliens and sharks. Jaws: the summer blockbuster feels eternal but starts here. Schindler's List: showing the unthinkable." },
        { _id: "disney", name: "Disney", flavor: "La house del mouse hecha de dominio público intocabilizado. Fumador, imaginador, no congelado. Blancanieves: primer largo animado exitoso. Lo mejor: Donald." , flavor_en: "The house the mouse built on untouchable public domain. Smoker, dreamer, not frozen. Snow White: first successful animated feature. The best part: Donald." },
        { _id: "sarah_bernhardt", name: "Sarah Bernhardt", flavor: "La Divina fama antes la de la ópera. Camille, Hamlet en pantalones y falda. Amputada: siguió actuando sin prótesis, cargada en diván." , flavor_en: "La Divina before opera claimed the title. Camille, Hamlet in trousers and skirts. Amputated: kept performing without prosthesis, carried on a *chaise longue*." },
        { _id: "godard", name: "Godard", flavor: "Principio, nudo, desenlace: barajados. Anna Karina, Alphaville, A bout de souffle: A+ Quality. Tricromías de un Pierrot y mucho comunismo." , flavor_en: "Beginning, middle, end: shuffled. Anna Karina, Alphaville, À bout de souffle: A+ Quality. Trichromes of a Pierrot and a lot of communism." },
        { _id: "bunuel", name: "Buñuel", flavor: "El discreto encanto de un perro andaluz exterminador. Deseo, dios, Deneuve. Mucho más que un ojo cortado y surrealismo daliesco." , flavor_en: "The discreet charm of an exterminating chien Andalou. Desire, Dios, Deneuve. Far more than a sliced eye and Dalí's surrealism." },
        { _id: "eisenstein", name: "Eisenstein", flavor: "La magia del cine: la edición, casi inventada por él, un supuesto gay. La escalera de Potiomkin (Odessa), la masacre con más remixes: de intocables a naked gun." , flavor_en: "The magic of cinema: editing, almost invented by him, a rumored gay man. The Potemkin staircase (Odessa): most remixed massacre — Untouchables to Naked Gun." },
        { _id: "miyazaki", name: "Miyazaki", flavor: "Como retrataba las olas, él también se iba y volvía. Totoro, Chihiro, Mononoke: ecología, infancia, vuelo. Más grande que Ghibli mismo." , flavor_en: "Like the waves he painted, he too left and returned. Totoro, Chihiro, Mononoke: ecology, childhood, flight. Larger than Ghibli itself." },
        { _id: "katharine_hepburn", name: "Katharine Hepburn", flavor: "Pantalones, acento, veneno de taquilla y 4 Oscars a mejor actriz, insuperada hasta hoy. Leopardo, Leonor, y 26 años siendo \"la otra\" de Tracy." },
        { _id: "laurence_olivier", name: "Laurence Olivier", flavor: "Sinónimo de actor shakespeariano del XX y el charmant Mr. de Winter a la sombra de *Rebecca*. Con su mujer: tumultos y talentos." , flavor_en: "Synonym of Shakespearean acting in the 20th century, and the charmant Mr. de Winter in *Rebecca*'s shadow. With his wife: turmoil and talent." },
        { _id: "judy_garland", name: "Judy Garland", flavor: "El Mago de Oz a los 16, encorsetada y sobremedicada. La actriz como títere del estudio. Estrella, Saint Louis, ícono sobre el arcoiris." , flavor_en: "The Wizard of Oz at 16, corseted and overmedicated by the studio. Star, Meet Me in St. Louis, icon over the rainbow." },
        { _id: "nijinsky", name: "Nijinsky", flavor: "El salto que negó la gravedad. Estrenó La Consagración de la Primavera con su paisano en 1913 — los motines también se coreografían." , flavor_en: "The leap that defied gravity. Premiered The Rite of Spring with his compatriot in 1913 — riots can be choreographed too." },
        { _id: "isadora_duncan", name: "Isadora Duncan", flavor: "Madre de la danza moderna, escandalosamente descalza y descorsetada. Complot: una bufanda y una rueda de carro la mataron." , flavor_en: "Mother of modern dance, scandalously barefoot and uncorseted. A conspiracy: a scarf and a car wheel killed her." },
        { _id: "liszt", name: "Liszt", flavor: "La primera superstrella. La Lisztomanía — acuñe de Heine — generaba desmayos y peleas por su pelo entre mujeres. El más grande pianista y famoso húngaro." , flavor_en: "The first superstar. Lisztomania — Heine's coinage — caused fainting and fights over his hair. The greatest pianist and most famous Hungarian." },
        { _id: "visconti", name: "Visconti", flavor: "Gatopardo, Muerte en Venecia, La caída de los dioses: el arte de la eurodecadencia. La demasía en la precisión con el sol cayendo al fondo." },
        { _id: "wilder", name: "Wilder", flavor: "El apartamento, Sunset Boulevard, tal vez lo mejor de Monroe. El heredero más cercano del director del toque. De los peor traducidos al español." },
        { _id: "tarkovski", name: "Tarkovski", flavor: "El tiempo su más extensa materia. Entre un mantra y un rezo: ver sus películas es un acto de fe y paciencia." },
        { _id: "woody_allen", name: "Woody Allen", flavor: "Más de 50 películas (casi todas con algo de psicoanálisis). Ansioso, neoyorquino, intelectual con chiste. Annie Hall reinventó la comedia romántica." },
        { _id: "vivaldi", name: "Vivaldi", flavor: "Il Prete Rosso, el cura pelirrojo tras 500+ conciertos originales. Las cuatro estaciones: el barroco más figurativo y pop." },
        { _id: "mahler", name: "Mahler", flavor: "Diez sinfonías: su cosmos. Nueve completas, una inconclusa como destino. Director de orquesta de día, compositor de madrugada. Freud lo vio una vez. Solo una." },
        { _id: "meryl_streep", name: "Meryl Streep", flavor: "21 nominaciones, tres Oscars. Puede todo: acentos, géneros, edades. Cuando se lo propone, grandeza, sorpresa y humor. ¿G.O.A.T.?" },
        { _id: "nureyev", name: "Nureyev", flavor: "1961, el ballet moderno dando el salto de la defección a occidente. Quizás la gran pareja del ballet del XX junto con *la* prima ballerina assoluta inglesa." },
        { _id: "buster_keaton", name: "Buster Keaton", flavor: "El hombre que nunca sonreía aunque le cayera una casa encima. De maquinista a acróbata, matemático del gag. La ingeniería del humor." },
        { _id: "ingrid_bergman", name: "Ingrid Bergman", flavor: "Casablanca, Notorious, Persona. Sueca en Hollywood, exiliada por el puritanismo de USA, retornó triunfal. Sin duda hermosa, pero tanto más." },
        { _id: "tennessee_williams", name: "Tennessee Williams", flavor: "El tranvía, el verano, la gata y el cristal. El mayor trágico americano del XX. El Sur, las belles, el sudor. Se destruyen con una elegancia que duele." },
        { _id: "bob_dylan", name: "Bob Dylan", flavor: "Nobel 2016: de los más merecidos y escandalosos a la vez. Un cantante que recuerda que lírica y música alguna vez fueron lo mismo." },
        { _id: "elvis", name: "Elvis", flavor: "El Rey. Gospel negro + country blanco = rock and roll. Una hermana lo prefiguró. El cuerpo como escándalo. La industria y la fama lo engulleron entero." },
        { _id: "michael_jackson", name: "Michael Jackson", flavor: "Thriller, Off the Wall, Bad. El Gesamtkunstler: voz, baile, producción, video, vida. Moonwalk como firma. Neverland como jaula dorada." },
        { _id: "john_lennon", name: "John Lennon", flavor: "Beatle y post-Beatle. Locura y carisma a dosis iguales. Asesinado frente a su casa en 1980, a los 40 años. Dudamos reponernos." },
        { _id: "jimi_hendrix", name: "Jimi Hendrix", flavor: "Tres años de carrera, cuatro álbumes, la guitarra vuelta a inventar. Purple Haze, Voodoo Child. Murió a los 27. Inauguró el Club con un punteo fatal." },
        { _id: "miles_davis", name: "Miles Davis", flavor: "Kind of Blue: bestseller de jazz, así, a secas. Bebop, cool, fusión: cuatro reinvenciones, un genio. Negro, difícil, genial, imperdonablemente influyente." },
        { _id: "billie_holiday", name: "Billie Holiday", flavor: "Strange Fruit: la canción más valiente del siglo XX. Voz rota que dolía más que una perfecta. La persiguió el FBI; la mató el jazz y lo que rodeó al jazz." },
        { _id: "david_bowie", name: "David Bowie", flavor: "Ziggy Stardust, Aladdin Sane, the White Duke: mutante eterno. Heroes, Let's Dance, Blackstar. ¿Somos los únicos en creer que iba a ser inmortal?" },
        { _id: "madonna", name: "Madonna", flavor: "La reina del pop y de la reinvención. Hizo masivos al pop, el vogueing y la electrónica. Algún día agregaremos su nombre al bridge de *Vogue*." },
        { _id: "toscanini", name: "Toscanini", flavor: "El dictador de la batuta. Fundó la NBC Symphony para la radio, reformó la Scala y La Met. Blindado ante la ceguera por una memoria genial." },
        { _id: "balanchine", name: "Balanchine", flavor: "El arquitecto del ballet neoclásico. Fundó el New York City Ballet. Con Stravinsky: la conjunción más fértil de música y danza." },
        { _id: "baryshnikov", name: "Baryshnikov", flavor: "La defección más célebre del ballet tras Nureyev. Técnica perfecta, longevidad insólita. De Kirov a Broadway: pocos cuerpos han durado más." },
        { _id: "margot_fonteyn", name: "Margot Fonteyn", flavor: "La prima ballerina assoluta inglesa. Con Nureyev: la pareja del siglo. Debutó a los 14, bailó hasta los 60. Dame, ecuatoriana de corazón, arruinada al final." },
        { _id: "lubitsch", name: "Lubitsch", flavor: "El toque. Comedia sofisticada de clase y con clase. Ser o no ser, Ninotchka, Trouble in Paradise. Nos quejamos con Wilder: 'no más films de Lubitsch.'" },
        { _id: "cassavetes", name: "Cassavetes", flavor: "El padre del cine independiente americano. Hipotecaba su casa para filmar. Sus actores improvisaban y nunca parecían actuando. El amor de Gena Rowlands." },
        { _id: "antonioni", name: "Antonioni", flavor: "El eclipse, La aventura, Blow-Up: el cine del vacío existencial y la incomunicación. Moda y desiertos. Tan moderno sigue siendo vanguardia." },
        { _id: "haneke", name: "Haneke", flavor: "La incomodidad como método. La Pianiste, Amour, Caché, los menos Funny Games. No te deja salir del cine bien: ni anímica ni moralmente." },
        { _id: "fassbinder", name: "Fassbinder", flavor: "40 películas en 16 años. Y ¡largas! Murió a los 37. Melodrama como crítica social, la RFA como espejo de la brutalidad ordinaria. El Balzac del cine alemán." },
        { _id: "leonard_bernstein", name: "Leonard Bernstein", flavor: "Director, compositor, pedagogo, showman. West Side Story. Sus conciertos de TV para niños: una generación entera aprendió música con él." },
        { _id: "pasolini", name: "Pasolini", flavor: "El evangelio según San Mateo, Saló, Medea. Marxista, católico, gay, escandaloso, asesinado. El artista más incómodo del siglo XX italiano." },
        { _id: "wong_kar_wai", name: "Wong Kar-wai", flavor: "In the Mood for Love, Chungking Express, 2046. El cineasta del deseo no consumado. Rueda sin guion, edita años. El tiempo como materia; Tarkovski neón." },
        { _id: "ozu", name: "Ozu", flavor: "El maestro del tatami. Cuentos de Tokio: la familia, el tiempo que pasa, los hijos que se van. Planos fijos, cámara baja, emoción devastadora sin dramatismo." },
        { _id: "murnau", name: "Murnau", flavor: "Nosferatu, Fausto, Amanecer. El expresionismo alemán en su cima. La sombra que camina sola: inventó el lenguaje visual del terror." },
        { _id: "martha_graham", name: "Martha Graham", flavor: "La madre de la danza moderna americana. La contracción y la expansión como vocabulario. Sus bailarines: Cunningham, Hawkins, Limón. Bailó hasta los 75." },
        { _id: "pina_bausch", name: "Pina Bausch", flavor: "Tanztheater: danza-teatro donde se habla con el cuerpo. Café Müller, Kontakthof. Wenders y Almodóvar la preservaron en film." },
        { _id: "anna_magnani", name: "Anna Magnani", flavor: "La actriz más verdadera del neorrealismo. Roma ciudad abierta, La lupa. Tennessee Williams la amó lo suficiente para escribirle La rosa tatuada. Oscar 1955." },
        { _id: "gardel", name: "Gardel", flavor: "El zorzal criollo. La voz más reconocible del tango. Murió en Medellín en 1935 en un accidente de aviación. Cada día canta mejor." },
      ],
      pedir: 7
    },
    {
      _id: "plasticas",
      name: "Plásticas",
      pool: [
        { _id: "leonardo", name: "Leonardo", flavor: "Ideal renacentista: Pintó, esculpió, ingenió, diseccionó. Gioconda y Vitruvio en la última cena. Apócrifas katanas." , flavor_en: "Renaissance ideal: painted, sculpted, engineered, dissected. Gioconda and Vitruvius at the Last Supper. Apocryphal katanas." },
        { _id: "miguel_angel", name: "Miguel Ángel", flavor: "La Capilla, el David y la Pietà: ¿Qué más decir? Arquitecto de San Pedro. Gruñón inmortal justificado. El más queer: sibilas musculosas." , flavor_en: "The Chapel, David and the Pietà: what more is there to say? Architect of Saint Peter's. Immortally grumpy, justifiably so. The most queer: muscular sibyls." },
        { _id: "picasso", name: "Picasso", flavor: "Azul, rosa, collab cubista que se llevó la gloria. Guernica: 03/05/19XX. 20k+ obras. Amó a muchas, maltrató a casi todas. Artista y hombre de su tiempo." , flavor_en: "Blue, pink, cubist collab that got all the glory. Guernica: 05/03/19XX. 20k+ works. Loved many, mistreated almost all. Artist and man of his time." },
        { _id: "van_gogh", name: "Van Gogh", flavor: "La posteridad como gloria. 900 pinturas, una venta. La oreja: no apta para envíos. La noche engirasolada en Arles." , flavor_en: "Posterity as glory. 900 paintings, one sale. The ear: not suitable for mailing. The sunflowered night in Arles." },
        { _id: "rembrandt", name: "Rembrandt", flavor: "El artista y sus mujer(es), leitmotiven de envejecimiento. El cenit del claroscuro pero en Holanda. Quebró dos veces. Murió en la pobreza." , flavor_en: "The artist and his wife as leitmotif of change and aging. Dutch zenith of chiaroscuro. Went bankrupt twice. Died in poverty." },
        { _id: "velazquez", name: "Velázquez", flavor: "Pintor de pintores, enanos, borrachos y poderosos. Meninas, hilanderas y vieja friendo huevo: todos brillan igual. Lanzas que prefiguran horrores." , flavor_en: "Painter of painters, dwarfs, drunks and the powerful. Las Meninas, the spinners, old woman frying eggs: all equally brilliant. Lances prefiguring horrors." },
        { _id: "goya", name: "Goya", flavor: "Retratista de cortes y guerras. Caprichoso y sordo testigo. Fusilamientos, Saturno, el perrito. Último old master, primer moderno. Goyesco lo define como nada." , flavor_en: "Portraitist of courts and wars. Deaf witness, capricious eye. Executions, Saturn, the little dog. Last old master, first modern. Goyesque defines him." },
        { _id: "dali", name: "Dalí", flavor: "Surrealismo y la mejor pincelada: su marca personal. Relojes líquidos, el bigote, Gala y labios-sofás. Genio e impostor. ¿Somos aguafiestas? Franquista." , flavor_en: "Surrealism and the finest brushstroke: his personal brand. Liquid clocks, the mustache, Gala and lip-sofas. Genius and impostor. Buzzkill? Francoist." },
        { _id: "kahlo", name: "Kahlo", flavor: "Cejas, México y dolor de espalda: 55 autorretratos entre 143 pinturas. Entre su amado y su apropiación pop la han vuelto cada vez más problemática." , flavor_en: "Eyebrows, Mexico and back pain: 55 self-portraits among 143 paintings. Between her beloved and her pop appropriation, she's become increasingly complicated." },
        { _id: "warhol", name: "Warhol", flavor: "La lata de sopa, Marilyn, la fábrica y las polaroid: industrioso. ¿Casandra de la celebridad por 15 minutos? Fiestero, canoso y genio de lo superficial." , flavor_en: "The soup can, Marilyn, the Factory and the Polaroids: industrious. Cassandra of 15-minute celebrity? Party-goer, silver-haired genius of the superficial." },
        { _id: "rafael", name: "Rafael", flavor: "Madonnas y griegos escolares: vírgenes divinas, nuestro patrono señalando abajo y su maestro arriba. Murió celebrando sus 37, dicen que de sexo. Amable y amado." , flavor_en: "Madonnas and scholastic Greeks: divine virgins, our patron pointing down, his master up. Died celebrating his 37th, allegedly of sex. Gentle and beloved." },
        { _id: "caravaggio", name: "Caravaggio", flavor: "El tenebrismo que cambió todo: Luz, Medusa, virtudes. El lumpen sacro. Asesino, canalla y fugitivo hasta morir. Su violencia y su pintura: indistinguibles." , flavor_en: "The tenebrist who changed everything. The sacred lumpen. Murderer, scoundrel, fugitive until death. His violence and his painting: indistinguishable." },
        { _id: "vermeer", name: "Vermeer", flavor: "34-36 cuadros en toda su vida. La de la perla, La lechera. Murió endeudado y su mujer vendió pan para pagar. Lento, perfecto, misterioso, a veces demasiado." , flavor_en: "34-36 paintings in a lifetime. Girl with a Pearl, The Milkmaid. Died indebted; his wife sold bread to pay. Slow, perfect, mysterious, sometimes too much." },
        { _id: "monet", name: "Monet", flavor: "La impresión, la luz y el agua más florida. Fundador y casi sinónimo del Impresionismo. Giverny y Orangerie: ¿qué hay más feliz que rodearse de Monet(s)?" , flavor_en: "The impression, the light and the most flowered water. Founder of Impressionism. Giverny and Orangerie: what's happier than being surrounded by Monets?" },
        { _id: "klimt", name: "Klimt", flavor: "El beso, Judit, Adele. Oro, erotismo y Viena 1900. Modelos=amantes=musas. La Secesión como movimiento interrumpido. Tantos techos perdidos para siempre." , flavor_en: "The Kiss, Judith, Adele. Gold, eroticism and Vienna 1900. Models=lovers=muses. The Secession as interrupted movement. So many lost ceilings, forever." },
        { _id: "rodin", name: "Rodin", flavor: "El pensador, El beso, Las puertas del infierno. Hizo pensar a la piedra. Canalla: Camille Claudel alumna/amante/rival/coautora al manicomio." , flavor_en: "The Thinker, The Kiss, The Gates of Hell. Made stone think. Scoundrel: Camille Claudel — student/lover/rival/co-author — sent to the asylum." },
        { _id: "donatello", name: "Donatello", flavor: "David desnudo: el primero desde la antigüedad. Florencia preLeonardo. El Renacimiento empieza aquí. Debió ser Caravaggio en TMNT." , flavor_en: "Nude David: the first since antiquity. Florence pre-Leonardo. The Renaissance starts here. Should have been Caravaggio in TMNT." },
        { _id: "gaudi", name: "Gaudí", flavor: "La Sagrada Familia: inacabada desde 1882, pero pronto, dicen. Barcelona, Pedrera y Batlló. Atropellado por un tranvía por caremendigo. Ironía urban(ist)a." , flavor_en: "La Sagrada Família: unfinished since 1882 — soon, they say. Barcelona, Pedrera and Batlló. Run over by a tram for looking like a beggar. Urban(ist) irony." },
        { _id: "le_corbusier", name: "Le Corbusier", flavor: "La máquina de habitar. El urbanismo del XX para bien y para mal. Unité d'Habitation, Chandigarh, la Villa Savoye. Seamos planos: Fascista en los 40." , flavor_en: "The machine for living. 20th-century urbanism for better and worse. Unité d'Habitation, Chandigarh, Villa Savoye. Stated 'planely': Fascist in the 40s." },
        { _id: "matisse", name: "Matisse", flavor: "El color como emoción pura. Fauvista y luego solo. Sus gouaches recortadas ya en la silla de ruedas, mucho más grande que tus óleos y los de casi cualquiera." , flavor_en: "Color as pure emotion. Fauvist then solo. His cut-out gouaches from a wheelchair, far greater than his oils and almost anyone else's." },
        { _id: "cezanne", name: "Cézanne", flavor: "Padre de todos los ismos del XX, miembro de ninguno. La fruta como musa. Monet lo admiraba, Picasso lo adoraba. La pintura como color en dos dimensiones." , flavor_en: "Father of every 20th-century ism, member of none. Fruit as muse. Monet admired him, Picasso adored him. Painting as color in two dimensions." },
        { _id: "manet", name: "Manet", flavor: "El de los escándalos: un almuerzo y unas desnudas mironas. Protofeminista que retrató y formó a su genial cuñada pintora. Tan moderno que ni lo sabía." , flavor_en: "The scandal-maker: a luncheon and some staring nudes. Proto-feminist who painted and mentored his brilliant sister-in-law. So modern he didn't even know it." },
        { _id: "munch", name: "Munch", flavor: "El grito no es un grito: es un temblor. Noruego, angustiado, prolífico. La ansiedad existencial antes de que la ansiedad tuviera nombre. Ah, y la muerte." , flavor_en: "The Scream isn't a scream: it's a tremor. Norwegian, anguished, prolific. Existential anxiety before anxiety had a name. Oh, and death." },
        { _id: "botticelli", name: "Botticelli", flavor: "Simonetta: musa, virgen y venus. Un monje loco: no sabemos cuánto ni qué perdimos por su culpa en la hoguera de las vanidades. Tan neoplatónico y sutil." , flavor_en: "Simonetta: muse, virgin and Venus. A mad monk: we don't know how much we lost to his bonfire of the vanities. So Neoplatonic and subtle." },
        { _id: "rubens", name: "Rubens", flavor: "La carne como paisaje de abundancia. Flamenco, diplomático, caballero. Voluptuosidad, mitología y carne por doquier. Medio Prado es suyo." , flavor_en: "Flesh as landscape of abundance. Flemish, diplomat, knight. Voluptuousness, mythology and curves everywhere. Half the Prado is his." },
        { _id: "el_bosco", name: "El Bosco", flavor: "Infiernos musicales, carros de heno, el más delicioso jardín. Bestias y multitudes en el Prado más insoportable. Felipe II (tan puritano) lo tenía en su pieza." , flavor_en: "Musical hells, haywains, the most delicious garden. Creatures and crowds in the Prado's most unbearable room. Philip II — the prude — kept him in his bedroom." },
        { _id: "gauguin", name: "Gauguin", flavor: "Huyó de Europa a Tahití: encontró el sol, exportó sus ITS. Mucho más que amarillos: también rosados a veces. Sus pinturas: radiantes como el sol colonial." , flavor_en: "Fled Europe to Tahiti: found the sun, exported his STIs. More than yellows — pinks sometimes too. His paintings: radiant as the colonial sun." },
        { _id: "pollock", name: "Pollock", flavor: "Dripping: la pintura como acto físico, postrepresentación. El expresionismo abstracto americano: la CIA como marketing. Murió borracho al volante con dos." , flavor_en: "Dripping: painting as physical act, post-representation. American abstract expressionism: the CIA as marketing department. Died drunk at the wheel with two." },
        { _id: "magritte", name: "Magritte", flavor: "Esto no es una pregunta, es una felicitación por elegir a Magritte. Manzanas, besos velados y sombreros. El surrealismo más filosófico y más gracioso." , flavor_en: "This is not a question, it's a congratulation for choosing Magritte. Apples, veiled kisses and bowler hats. The most philosophical and funniest surrealism." },
        { _id: "bernini", name: "Bernini", flavor: "Éxtasis, piedra viva: Teresa, David, la Fontana. Se ganó el laurel con Dafne. El Barroco más romano. Freelance de arquitecto, dramaturgo y pintor." , flavor_en: "Ecstasy, living stone: Teresa, David, the Fountain. Won his laurels with Daphne. The most Roman Baroque. Freelance architect, playwright and painter." },
        { _id: "degas", name: "Degas", flavor: "El movimiento y el tul congelados. Bailarinas e hipódromos: más anatomía, menos jardines. Ah y *el* escultor de combo." },
        { _id: "renoir", name: "Renoir", flavor: "La alegría, su programa estético. Luz, piel, reuniones a plein air. Amable, dulce, casi leve y tan criticado por eso. Demasiado bello para el postneoclasicismo." },
        { _id: "kandinsky", name: "Kandinsky", flavor: "El primer no figurativo \'del todo\'. Composición VIII, Amarillo, rojo, azul. Sinestesia como método: cada color tiene un sonido, cada forma una emoción." },
        { _id: "miro", name: "Miró", flavor: "El universo lúdico. Formas orgánicas primarias, colores puros, humor cósmico. Surrealismo sin pesadilla ni trauma: el arte moderno, infante." },
        { _id: "klee", name: "Klee", flavor: "Pintor, músico, teórico. Bauhaus y más allá. Una línea que sale a pasear: su definición del dibujo, y la más precisa que existe. Y ¡el color!" },
        { _id: "schiele", name: "Schiele", flavor: "El cuerpo como angustia y podredumbre. Líneas tensas, posturas imposibles, erotismo incómodo. Muerto de gripe española a los 28, tras Klimt, su maestro." },
        { _id: "el_greco", name: "El Greco", flavor: "El manierismo de mayor altura: figuras alargadas, colores venecianos, espiritualidad perturbadora. Cretense en Toledo. Patrono del expresionismo." },
        { _id: "giotto", name: "Giotto", flavor: "El primero en pintar personas que lo parecen. Antes de él: iconos. Después de él: el Renacimiento. La Capilla Scrovegni: el Big Bang de la pintura occidental." },
        { _id: "turner", name: "Turner", flavor: "La luz, único tema y fijación real. Tempestades, nieblas, incendios del Parlamento. Según Constable pintaba con vapor de colores. Abstracto avant la lettre." },
        { _id: "rothko", name: "Rothko", flavor: "Rectángulos de color que causan llanto (ni broma ni metáfora). Sus murales en la Capilla de Houston son para exactamente ese fin. Se suicidó en 1970." },
        { _id: "brancusi", name: "Brancusi", flavor: "La escultura esencial. El beso, El pájaro en el espacio. Rumano en París que rechazó trabajar con Rodin: \'nada crece a la sombra de los grandes árboles.\'" },
        { _id: "giacometti", name: "Giacometti", flavor: "Figuras largas como sombras de arena mojada. La imposibilidad del otro. Sartre lo elevó, pero él ya estaba arriba mucho antes." },
        { _id: "chagall", name: "Chagall", flavor: "El sueño: realidad colorida. Novias flotantes, violinistas y tejados, aldeas rusas y cabras en el aire. El último estertor de la pintura judaica centroeuropea." },
        { _id: "van_eyck", name: "Van Eyck", flavor: "El inventor de la pintura al óleo según Vasari (no confíes en Vasari, pero casi). El matrimonio Arnolfini: un espejo, dos personas, la Edad Media de audiencia." },
        { _id: "tiziano", name: "Tiziano", flavor: "El más longevo y grande venecianos: murió con más de 80, pintó hasta el final. El color como firma y arquitectura. Carlos V recogió su pincel del suelo." },
        { _id: "gentileschi", name: "Gentileschi", flavor: "Artemisia (hija de Orazio), quizás la más grande maestra antigua. Variaciones sobre Judit decapitando a Holofernes: ella y la historia." },
        { _id: "o_keeffe", name: "O'Keeffe", flavor: "Flores enormes que son y no lo son. El desierto de Nuevo México: su universo propio. La pintora americana más importante del XX: sin discusión." },
        { _id: "basquiat", name: "Basquiat", flavor: "Neo-expresionismo, grafiti, jazz, anatomía, racismo, muerte. Muerto a los 27. El primer artista negro en vender a precios de Picasso en subasta." },
        { _id: "mucha", name: "Mucha", flavor: "Art nouveau: carteles, joyería, ilustración y la enormidad de su Ciclo Eslavo. Sus mujeres: ondulantes, floridas, áureas. Diseñó los billetes de Checoslovaquia." },
        { _id: "rivera", name: "Rivera", flavor: "Los murales mexicanos: la historia del pueblo. Con Kahlo: amor tormentoso. Rockefeller Center lo contrató y luego destruyó su mural." },
        { _id: "delacroix", name: "Delacroix", flavor: "La libertad guiando al pueblo: la más citada de la Revolución Francesa. Romanticismo, color y movimiento. Ingres lo odiaba." },
        { _id: "seurat", name: "Seurat", flavor: "El puntillismo inventado desde la física del color. Un domingo en la Grande Jatte: millones de puntos, una tarde, toda la burguesía parisina. Murió a los 31." },
        { _id: "frank_lloyd_wright", name: "Frank Lloyd Wright", flavor: "Arquitectura orgánica: la casa nace del paisaje. La Casa de la Cascada, el Guggenheim. \'El arquitecto más grande de todos los tiempos\', dijo." },
        { _id: "cartier_bresson", name: "Henri Cartier-Bresson", flavor: "Inventor del instante decisivo. Testigo de la guerra, capturó en blanco y negro lo mejor y lo peor: niños, sabios, colaboracionistas." },
        { _id: "yves_saint_laurent", name: "Yves Saint Laurent", flavor: "Le dio a la mujer el garbo del pantalón de smoking. ¿Democratización, hurto o manifiesto? Lo que sea pero en seda." },
      ],
      pedir: 7
    },
    {
      _id: "letras",
      name: "Letras",
      pool: [
        { _id: "cervantes", name: "Cervantes", flavor: "Soldado, manco y cautivo. El Quijote: cumbre, cimiento, risas. Acabó con la novela de caballería uniéndose a ella. Salvó a occidente de más de una manera." , flavor_en: "Soldier, one-handed and captive. Don Quixote: summit, foundation, laughter. Ended the chivalric novel by rewriting it. Saved the West in more ways than one." },
        { _id: "dante", name: "Dante", flavor: "La Comedia como mapa del cosmos medieval. Un guía romano, una florentina de destino. Exiliado, ciudadano de postrimerías y currículos." , flavor_en: "The Comedy as map of the medieval cosmos. A Roman poet for guide, a Florentine lady as destiny. Exiled, citizen of afterlives and curricula." },
        { _id: "homero", name: "Homero", flavor: "La justeza ciega, la voz de multitudes ¿en uno o en muchos? La Ilíada y la Odisea y tantas atribuciones anexas. No le perdonamos el catálogo de las naves." , flavor_en: "Blind precision, voice of multitudes — one or many? The Iliad and the Odyssey and so many annexed attributions. We don't forgive him the catalogue of ships." },
        { _id: "borges", name: "Borges", flavor: "La biblioteca, el laberinto, el espejo, el tigre. Ciego como Homero, argentino como el mate. Escritor de escritores, redentor de vocablos, carlista. No a Perón." , flavor_en: "The library, the labyrinth, the mirror, the tiger. Blind like Homer, Argentine like mate. Writer of writers, redeemer of words, Carlist. No to Perón." },
        { _id: "kafka", name: "Kafka", flavor: "Proceso, Metamorfosis, Castillo: inacabados y perfectos. Le pidió a Brod quemarlos — Brod no quiso. Sed nocturna: balcón en pijama. El trauma y sus ROIs." , flavor_en: "Trial, Metamorphosis, Castle: unfinished and perfect. Asked Brod to burn them — Brod refused. Nocturnal thirst: balcony in pyjamas. Trauma and its ROIs." },
        { _id: "montaigne", name: "Montaigne", flavor: "El ensayo como intento de abordar lo imposible de zanjar definitivamente. Dar a luz a uno de los géneros más grandes de las letras no es nada pequeño." },
        { _id: "proust", name: "Proust", flavor: "En busca del tiempo perdido: 3000 páginas, una madeleine, un tiempo recobrado. Frases de largo aliento, tapones de corcho, memoria involuntaria." , flavor_en: "In Search of Lost Time: 3000 pages, one madeleine, one time regained. Long-breathed sentences, cork stoppers, involuntary memory." },
        { _id: "dostoievski", name: "Dostoievski", flavor: "Crimen y castigo, Karamázov, El idiota. Condenado a muerte, indultado en el último segundo. Epiléptico, ludópata, profeta. Cada psiquiatra y culpable lo lee." , flavor_en: "Crime and Punishment, Karamazov, The Idiot. Condemned, pardoned at the last second. Epileptic, gambler, prophet. Every psychiatrist and guilty party reads him." },
        { _id: "tolstoi", name: "Tolstoi", flavor: "Guerra y paz, Anna K.: dos novelas totales. Anarcocristiano y claro en prosa y espíritu, repudió su obra a los 50. Murió de frío huyendo de su clara casa." , flavor_en: "War and Peace, Anna K.: two total novels. Anarcho-Christian, clear in prose and spirit, repudiated his work at 50. Died of cold, fleeing his own bright home." },
        { _id: "joyce", name: "Joyce", flavor: "Ulises: siete años para describir un día en Dublín. Finnegans Wake: el lenguaje como ouroboros. ¿Más grande cuanto menos impenetrable? Pregúntanos en 50 años." , flavor_en: "Ulysses: seven years to describe one day in Dublin. Finnegans Wake: language as ouroboros. Great and/or impenetrable? Ask us in 50 years." },
        { _id: "woolf", name: "Virginia Woolf", flavor: "Mrs. Dalloway, Al faro, Las olas. Flujo de conciencia: suyo y de Joyce, sin coordinación. Bolsillos llenos de piedras en el río. ¿Tienes tu cuarto propio?" },
        { _id: "virgilio", name: "Virgilio", flavor: "¿Fue Rómulo o La Eneida quién fundó Roma? Guía infernal postmortem de Dante. Pidió quemar la Eneida... a Augusto. En algo tenía que fallar el poeta." , flavor_en: "Was it Romulus or the Aeneid that founded Rome? Posthumous infernal guide for Dante. Asked Augustus to burn the Aeneid. Had to fail at something." },
        { _id: "ovidio", name: "Ovidio", flavor: "Las Metamorfosis: medio renacimiento (la mejor mitad). Arte de amar: conquista, seducción y exilio. Ningún lector se le resiste." , flavor_en: "The Metamorphoses: half the Renaissance (the better half). Art of Love: conquest, seduction and exile. No reader can resist him." },
        { _id: "garcia_marquez", name: "García Márquez", flavor: "Cien años de soledad y gloria: realismo mágico hasta el cansancio. Nobel 1982. Macondo y Gabo queridos, ¡tan locales y universales!" , flavor_en: "One Hundred Years of Solitude and glory: magical realism till exhaustion. Nobel 1982. Macondo and Gabo: so universal and yet so familiar." },
        { _id: "flaubert", name: "Flaubert", flavor: "Palabra justa y cliché: inspiraciones simultáneas. Madame Bovary NO fue él (¿y?). Rendimiento: 1 frase perfecta/semana. El segundo francés más cervantino." , flavor_en: "The right word and the cliché: simultaneous inspirations. Madame Bovary was NOT him (so?). 1 perfect sentence/week. The second most Cervantine Frenchman." },
        { _id: "poe", name: "Poe", flavor: "El cuento: autocontenido, de una sentada, perfecto. Detective, terror, poesía. Murió solo y delirante en Baltimore. Nevermore." , flavor_en: "The short story: self-contained, one-sitting, perfect. Detective, horror, poetry. Died alone and delirious in Baltimore. Nevermore." },
        { _id: "baudelaire", name: "Baudelaire", flavor: "Flâneur, sífilis y floristería (del mal). La belleza en lo abyecto, lo moderno en lo decadente. Obsceno condenado y protomaldito." , flavor_en: "Flâneur, syphilis and floristry (of evil). Beauty in the abject, the modern in the decadent. Condemned obscenity and first of the cursed poets." },
        { _id: "rimbaud", name: "Rimbaud", flavor: "La peor vara para juzgar tu éxito: su obra, entre sus 15 y 21 años. Luego: silencio, África, armas y sexo escandaloso. Una temporada en el infierno basta." , flavor_en: "The worst yardstick for measuring your success: his zenith, between 15 and 21. Then: silence, Africa, arms and scandalous sex. One Season in Hell is enough." },
        { _id: "neruda", name: "Neruda", flavor: "Adalid de la poesía en español. Veinte poemas y Canto general. Senador, comunista y Nobel 1971. Mucho más famoso que su bohemio epónimo." , flavor_en: "Champion of poetry in Spanish. Twenty Poems and Canto General. Senator, communist, Nobel 1971. Far more famous than his bohemian namesake." },
        { _id: "calvino", name: "Calvino", flavor: "Si una noche de invierno un viajero en un sendero de arañas y ciudades invisibles. Italiano, lúdico y deleitable. El lector como obra. Oulipo italiano." , flavor_en: "If on a winter's night a traveler on a spider's web of invisible cities. Italian, playful and delightful. Reader as oeuvre. Italian Oulipo." },
        { _id: "cortazar", name: "Cortázar", flavor: "Rayuela: Arma tu propia novela. Cronopios, jazz, París y Buenos Aires, famas. La prole de la maga hasta se inmiscuye entre los Buendía." },
        { _id: "octavio_paz", name: "Octavio Paz", flavor: "El laberinto de la soledad: México como enigma. Nobel 1990. Poeta y ensayista, embajador y ruptura. La soledad como método, y vaya método." },
        { _id: "vargas_llosa", name: "Vargas Llosa", flavor: "Nobel 2010. La ciudad y los perros, La fiesta del Chivo, las visitadoras y el escribidor. ¿Arsonista marxista o bombero liberal?" },
        { _id: "rulfo", name: "Rulfo", flavor: "Pedro Páramo: los muertos hablan y los vivos están más muertos. Prendió en llamas el llano que era latinoamérica antes de su chispa mágica." },
        { _id: "bolano", name: "Bolaño", flavor: "Los detectives salvajes y 2666: la épica del fracaso literario. Chileno en México, exiliado en España. Murió a los 50, ya legendario. La obra llegó sola." },
        { _id: "hugo", name: "Victor Hugo", flavor: "Les Misérables, Notre-Dame de París. Romanticismo y conciencia social. Exiliado y vuelto héroe nacional. Hasta su hija tiene película célebre." },
        { _id: "stendhal", name: "Stendhal", flavor: "El rojo y el negro: el mejor espejo para llevar en un viaje. Julien Sorel: El más amado antihéroe moderno. Además de Stendhal: 200+ seudónimos. Y un síndrome." },
        { _id: "balzac", name: "Balzac", flavor: "La Comedia Humana: 90+ novelas sobre una sola sociedad. Café como diesel, deudas como motor. Zola sistematizó lo que él ya había hecho. ¡Y esos títulos!" },
        { _id: "austen", name: "Jane Austen", flavor: "Ironía como escalpelo social. Orgullo y prejuicio, Emma. Anne, en Persuasión, puede ser ella: solterona a los 24 y ¡sabia!" },
        { _id: "wilde", name: "Oscar Wilde", flavor: "El ingenio: su moral y estética. Retratos, importancias, abanicos y baladas. Sublime y camp. ¿Pudo un solo hombre inventarse el modo de vida de millones?" },
        { _id: "faulkner", name: "Faulkner", flavor: "El Sur cósmico. El sonido y la furia: cuatro voces, un mismo desastre. Nobel 1949. Escribía con whisky; editaba sin él, según decía." },
        { _id: "ajmatova", name: "Ajmátova", flavor: "La voz que redefinió la idea de Réquiem. Su material: la memoria de sus amigas (con Stalin lo escrito era mortífero). Y ni así pudo contra ella." },
        { _id: "eco", name: "Umberto Eco", flavor: "Novelista, ensayista, semiótico, esteta y éxito en ventas involuntario. Sus fortés: belleza, medioevo, mentiras, fealdad, casi todo." },
        { _id: "mann", name: "Thomas Mann", flavor: "La montaña mágica, Muerte en Venecia. Nobel 1929. Otro de esos últimos grandes europeos. Exiliado por los nazis; regresó donde ya todo era silencio." },
        { _id: "pessoa", name: "Pessoa", flavor: "Heterónimos como poética y filosofía: Caeiro, Reis, de Campos. Vivió quieto en Lisboa, siendo muchos; murió con un baúl de papeles sin publicar." },
        { _id: "orwell", name: "Orwell", flavor: "1984 y Rebelión en la granja: dos pulmones del XX: lúcidos, quizás demasiado. Entre reportero y espía en la guerra civil. Muerto a los 46 de TB." },
        { _id: "dickinson", name: "Emily Dickinson", flavor: "Reclusa de Amherst. 1800 poemas en cajones, 10 vieron la luz mientras vivía. Muerte, inmortalidad y esa cosa con plumas: sus mayores temas." },
        { _id: "dickens", name: "Dickens", flavor: "Triunfo estético y comercial. Oliver Twist, Copperfield, Scrooge, las dos ciudades. Niño obrero, adulto millonario, denunciante del siglo. Antisemita reformado." },
        { _id: "asturias", name: "Miguel Ángel Asturias", flavor: "Nobel 1967, el primero latinoamericano. El señor presidente: la dictadura como pesadilla. Guatemala, indigenismo y surrealismo: triángulo inédito hasta él." },
        { _id: "pushkin", name: "Pushkin", flavor: "Allí empieza la Rusia literaria: raro pero real consenso. Evgeni Onegin: novela, verso, espejo nacional. Muerto a los 37 en un duelo. ¡Qué romántico!" },
        { _id: "bulgakov", name: "Bulgakov", flavor: "El maestro y Margarita: Satán en Moscú, Pilatos en Jerusalén. Stalin lo leyó (raro) y no lo mató (aún más raro). ¿El Kafka soviético?" },
        { _id: "gogol", name: "Gogol", flavor: "Las almas muertas y El inspector. El humor pesadillesco y la sátira documental. Ucraniano basal para Rusia. Quemó el segundo tomo de su obra maestra." },
        { _id: "rilke", name: "Rilke", flavor: "Las Elegías de Duino: diez poemas, diez años, una crisis. Cartas a un joven poeta: lo más leído (tatuado en Gaga). Bohemio de lengua alemana, cosmopolita." },
        { _id: "zweig", name: "Stefan Zweig", flavor: "El mundo de ayer: la memoria de una Europa que ya no existe. Biógrafo de genios, exiliado en Brasil. Se suicidó con su mujer cuando cayó Singapur." },
        { _id: "murakami", name: "Murakami", flavor: "Tokio Blues, Kafka en la orilla, 1Q84. El pop como portal a lo onírico. Jazz, pasta y soledad: trilogía de sus fieles. Suecos, ¿no tiene Nobel por exitoso?" },
        { _id: "mishima", name: "Mishima", flavor: "La novela ritual. El pabellón de oro, El mar de la fertilidad. Confesiones de una máscara. Ultranacionalista, culturista, homoerótico, seppuku ante la dieta." },
        { _id: "saramago", name: "Saramago", flavor: "Ensayo sobre la ceguera, El evangelio según Jesucristo. Nobel 1998, el único portugués. Sin mayúsculas en los diálogos: puntuación como política." },
        { _id: "petrarca", name: "Petrarca", flavor: "El soneto como forma. Laura: musas reales o inventadas dan lo mismo. Primer humanista, primer turista literario. Subió el Mont Ventoux para inventar el paisaje." },
        { _id: "primo_levi", name: "Primo Levi", flavor: "Si esto es un hombre: el testimonio más sereno sobre Auschwitz. Químico de profesión. La prosa de la supervivencia: precisa, sin odio, sin perdón tampoco." },
        { _id: "zola", name: "Zola", flavor: "El ciclo de los Rougon-Macquart: 20 novelas, una familia, un siglo. Naturalismo como ciencia social. J'accuse: Dreyfus, la verdad y la cárcel posible." },
        { _id: "sor_juana", name: "Sor Juana", flavor: "Primera poeta de América. Novohispana, autodidacta, monja por necesidad. Hombres necios: feminismo del XVII sin saberlo. Vendió su biblioteca para los pobres." },
        { _id: "kawabata", name: "Kawabata", flavor: "Nobel 1968, primer japonés. País de nieve, La casa de las bellas durmientes. Mono no aware: la belleza efímera que duele. Gas, tras el seppuku de Mishima." },
        { _id: "vallejo", name: "César Vallejo", flavor: "Trilce, Heraldos negros: poeta enorme y menos conocido y laureado de lo debido. Muerto en París, un viernes como predijo y sin patria." },
        { _id: "celine", name: "Céline", flavor: "Viaje al fin de la noche: la prosa más brutal del XX. Colaboracionista, antisemita, exiliado, amnistiado. Entre homme terrible génial y faux pas." },
        { _id: "hemingway", name: "Hemingway", flavor: "Nobel 1954. El iceberg: el peso de lo no dicho. El viejo y el mar, Por quién doblan las campanas. Lo de los zapatos de bebé sin usar no es de él." },
        { _id: "fitzgerald", name: "Fitzgerald", flavor: "El gran Gatsby: el sueño USA en 180 páginas. Bebió su talento y el de Zelda. Princeton, París, Hollywood. Vida acelerada y desmesurada." },
        { _id: "nabokov", name: "Nabokov", flavor: "Lolita, Pálido fuego, Ada o el ardor. Ruso en inglés, mariposas y ajedrez. Un poco insoportable, tabú y acertado. El estilo como argumento moral." },
        { _id: "margaret_atwood", name: "Margaret Atwood", flavor: "El cuento de la criada, Oryx y Crake. Canadiense, feminista ardiente y ardida, ecologista sin panfleto. La distopía como género. No le digas scifi." },
        { _id: "toni_morrison", name: "Toni Morrison", flavor: "Nobel 1993 (la primera afroamericana). Beloved, La canción de Salomón. La esclavitud como trauma inacallable." },
        { _id: "clarice_lispector", name: "Clarice Lispector", flavor: "La más extraña de las grandes: Brasileña nacida en Ucrania y casi fenomenóloga. La pasión según G.H., La hora de la estrella." },
        { _id: "isabel_allende", name: "Isabel Allende", flavor: "La casa de los espíritus: el realismo mágico femenino. La más leída en español después de García Márquez. Sobrina de Salvador. Escribe sin parar." },
        { _id: "sylvia_plath", name: "Sylvia Plath", flavor: "La campana de cristal, Ariel. Confesión, desahogo, confidencia: su arte. Luego, un horno, 1963, a los 30. Y sigue tan viva." },
        { _id: "ts_eliot", name: "T.S. Eliot", flavor: "La tierra baldía, Los hombres huecos. Nobel 1948. Un poco antisemita, bastante machista y aún así: enorme poeta." },
        { _id: "lord_byron", name: "Lord Byron", flavor: "El primer rockstar literario. Don Juan, Childe Harold. Pie zambo, amores escandalizantes, combatiente. A veces máscara y cara coinciden." },
        { _id: "mary_shelley", name: "Mary Shelley", flavor: "Frankenstein: ciencia ficción pionera. Tú ¿cómo cambias el mundo cuando/porque llueve? Hija y amada de genios medio locos. Ella aún más genial." },
        { _id: "solzhenitsyn", name: "Solzhenitsyn", flavor: "Archipiélago Gulag, Un día en la vida de Iván Denísovich. Nobel 1970. Pocos osaron/lograron retratar los campos soviéticos. Lo expulsaron, volvió y murió." },
        { _id: "machado_de_assis", name: "Machado de Assis", flavor: "El mayor escritor brasileño antes de cierta ucraniana. Memorias póstumas de Blas Cubas: novela narrada por un muerto, 1881. Visionario general." },
        { _id: "szymborska", name: "Szymborska", flavor: "Nobel 1996 (a regañadientes). La papelera como editor y control de calidad: 350 poemas en casi 60 años. Crucigramera, excelsa, enorme." },
        { _id: "ruben_dario", name: "Rubén Darío", flavor: "El modernismo en español empieza aquí. Nicaragüense universal, diplomático accidental, bebedor incorregible. Azul...: un libro que cambió el idioma." },
        { _id: "pasternak", name: "Pasternak", flavor: "Doctor Zhivago: el amor y la revolución rusa en una misma herida. Nobel 1958 que la URSS lo obligó a rechazar. Sus poemas: mejor que la novela, dicen algunos." },
        { _id: "turguenev", name: "Turguénev", flavor: "Padres e hijos: el nihilismo antes de que Nietzsche lo pusiera de moda. El más europeo de los rusos. Abrió la puerta por la que entraron Dostoievski y Tolstói." },
        { _id: "colette", name: "Colette", flavor: "Claudine, Gigi, La vagabunda. La escritora más sensual de Francia, que es decir mucho. Se inventó a sí misma varias veces. Music-hall, escándalos y gatos." },
        { _id: "karen_blixen", name: "Karen Blixen", flavor: "Memorias de África: Dinamarca, Kenia, amor y café. Escribía en inglés bajo seudónimo masculino. No ganó el Nobel; Hemingway dijo que debería haberlo ganado." },
        { _id: "gide", name: "André Gide", flavor: "Los monederos falsos, El inmoralista. Nobel 1947. Protestantismo, homosexualidad. Lúcido visionario sobre el África colonial." },
        { _id: "verne", name: "Jules Verne", flavor: "Leguas, vueltas, semanas e islas. Las ilusiones del XIX sobre el XX. Tantos empezamos a leer en serio con él. Nemo: ¿villano o víctima?" },
        { _id: "maupassant", name: "Maupassant", flavor: "Artista de la brevedad, la crueldad y lo sobrio. Bola de sebo, La maison Tellier. Discípulo de Flaubert: Muerto de sífilis a los 42, un lugar común." },
        { _id: "yourcenar", name: "Yourcenar", flavor: "Alexis, Adriano y Zenón: tres transfiguraciones de una mujer que amaba los hombres que amaban los hombres. Primera mujer en la Académie." },
        { _id: "duras", name: "Marguerite Duras", flavor: "El amante: autobiografía o ficción, da lo mismo. Hiroshima mon amour. La elipsis como forma de decir lo máximo diciendo lo mínimo." },
        { _id: "cioran", name: "Cioran", flavor: "Ocasos y cimas, Europa mirándose en un espejo roto. Rumano en francés, aforista del pesimismo. 60 años en París sin pedir la ciudadanía." },
        { _id: "beauvoir", name: "Simone de Beauvoir", flavor: "El segundo sexo: la mujer como artefacto. Novelista, filósofa, pareja incómoda de Sartre: egos en amor y luchas constantes que perdían otras." },
        { _id: "apollinaire", name: "Apollinaire", flavor: "Alcools, Caligramas: poesía Y pintura. Inventó la palabra surrealismo. Murió de gripe española en 1918, dos días antes del armisticio." },
        { _id: "verlaine", name: "Verlaine", flavor: "Fiestas galantes, Romanzas sin palabras. La música antes que el sentido. La otra mitad del escándalo Rimbaud. Absinthe, cárcel y arrepentimiento cíclico." },
        { _id: "breton", name: "André Breton", flavor: "Manifiestos del surrealismo. Pope del movimiento: juicios arbitrarios, casi oníricos. Nadja: el amor loco como método. Dicen que no le gustaba la música." },
        { _id: "carlos_fuentes", name: "Carlos Fuentes", flavor: "La muerte de Artemio Cruz, Terra Nostra. El gran novelista del México moderno. Diplomático, ensayista, polemista. La historia como materia prima inagotable." },
        { _id: "gabriela_mistral", name: "Gabriela Mistral", flavor: "Nobel 1945, la primera latinoamericana. Sonetos de la muerte, Desolación. Maestra rural chilena que llegó a cónsul y a inmortal." },
        { _id: "benedetti", name: "Benedetti", flavor: "Inventario. El poeta más querido del Río de la Plata: Táctica y estrategia merece una cápsula del tiempo de 500 años." },
        { _id: "nicanor_parra", name: "Nicanor Parra", flavor: "La antipoesía: el poema que se ríe de sí mismo. Físico matemático y poeta. Hermano de Violeta. Vivió 103 años como si fuera una broma suya." },
        { _id: "melville", name: "Melville", flavor: "Moby Dick: la novela (y la ballena) como futilidad y mise en abyme. Bartleby: preferiríamos no discutirlo." },
        pensador("shakespeare_letras", "Shakespeare"),
        pensador("hemingway", "Hemingway")
      ],
      pedir: 7
    }
  ]
};

// === respuestas.js ===
// engine/respuestas.js
// Normalización + comparación de respuestas del jugador contra el panteón/bibliotecas.
// Decisiones de diseño (consignadas 27-28/06):
//  - Umbral de tolerancia a errores: max(1, floor(largo/8)), techo 3.
//  - Doble coincidencia: prioriza menor distancia; empate exacto = rechazo genérico, no se adivina.
//  - closeAnswers: diccionario manual de errores predecibles con flavor text propio, vive aparte (ver closeAnswers.js).

/**
 * Normaliza un string para comparación: minúsculas, sin tildes, sin artículo inicial,
 * sin puntuación, espacios colapsados.
 * Toda clave guardada en datos (panteones, bibliotecas) debe nacer ya normalizada
 * (ver ISO900B sección 3) — esta función normaliza el INPUT del jugador en tiempo real.
 */
function norm(str) {
  if (!str) return "";
  let s = str.toLowerCase().trim();
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // quita tildes/diacríticos
  s = s.replace(/^(el|la|los|las|the)\s+/i, ""); // artículo inicial
  s = s.replace(/[^\w\s]/g, ""); // puntuación
  s = s.replace(/\s+/g, " ").trim(); // espacios colapsados
  return s;
}

/**
 * Distancia de edición de Levenshtein simple (sin transposición especial por ahora —
 * Damerau-Levenshtein queda pendiente de evaluar si hace falta detectar inversiones
 * de 2 caracteres explícitamente, ver codeo.md sección de fuzzyMatch).
 */
function distanciaEdicion(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/** Umbral de tolerancia: piso 1, techo 3, proporcional al largo. */
function umbralTolerancia(largo) {
  return Math.min(3, Math.max(1, Math.floor(largo / 8)));
}

/**
 * Compara el input del jugador contra una lista de respuestas válidas
 * (ej. todos los _id o sinónimos de un pensador/elemento de biblioteca).
 * Devuelve { ok: true } si hay match exacto o dentro de tolerancia,
 * { ok: false, casiCorrectos: [...] } si hubo candidatos cerca pero no certeza,
 * { ok: false } si no hubo nada cerca.
 */
/**
 * Expande una lista de claves válidas agregando sus sinónimos declarados.
 * Ej: claves=["indigo"], synonyms={indigo: ["anil"]} -> ["indigo", "anil"]
 */
function expandirConSinonimos(claves, synonyms = {}) {
  const expandido = [...claves];
  for (const clave of claves) {
    const sinonimosDeEsta = synonyms[clave];
    if (sinonimosDeEsta) expandido.push(...sinonimosDeEsta);
  }
  return expandido;
}

function compararRespuesta(inputCrudo, respuestasValidas) {
  const input = norm(inputCrudo);
  const candidatos = respuestasValidas.map(norm);

  // 1. Match exacto
  if (candidatos.includes(input)) {
    return { ok: true, exacto: true, candidatoCorregido: input };
  }

  // 2. FuzzyMatch: calcular distancia contra cada candidato
  const conDistancia = candidatos.map((c) => ({
    candidato: c,
    distancia: distanciaEdicion(input, c),
    umbral: umbralTolerancia(c.length)
  }));

  const dentroDeTolerancia = conDistancia.filter((c) => c.distancia <= c.umbral);

  if (dentroDeTolerancia.length === 0) {
    return { ok: false };
  }

  // 3. Doble coincidencia: si hay más de un candidato dentro de tolerancia,
  // priorizar el de menor distancia; si hay empate exacto, no adivinar.
  const minDistancia = Math.min(...dentroDeTolerancia.map((c) => c.distancia));
  const mejores = dentroDeTolerancia.filter((c) => c.distancia === minDistancia);

  if (mejores.length > 1) {
    // empate exacto entre dos o más candidatos — rechazo genérico, no se adivina
    return { ok: false, ambiguo: true };
  }

  return { ok: true, exacto: false, candidatoCorregido: mejores[0].candidato };
}

// === closeAnswers.js ===
// engine/closeAnswers.js
// Diccionario manual de errores ultracomunes y predecibles por biblioteca (ISO900B sección 7).
// Cada entrada puede tener 1 o varias variantes de flavor text — si hay varias, se elige una al azar
// (azar simple, sin memoria por jugador — ver PENDIENTES-COPY.md para la razón de empezar así).

const CLOSE_ANSWERS = {
  examen_planetas: {
    pluton: [
      "¿Que un planeta enano no sea un planeta?",
      "Estuviste cerca, Plutón está lejos... de ser un planeta. Intenta más cerca."
    ]
  },
  paises_ue: {
    uk: [
      "Desde 2016 el desayuno británico ya no forma parte de los desayunos europeos."
    ]
  },
  cuatro_tragedias_shakespeare: {
    "romeo y julieta": [
      "Exceso de muerte de jóvenes y falta de celos, duda, ambición y vanidad."
    ]
  },
  prefijos_griegos: {
    uni: ["Ese es latino, no griego — pero sí, ambos significan lo mismo."],
    bi: ["Latino otra vez — el griego para dos empieza distinto."]
  },
  // futuras entradas: agregar aquí siguiendo el mismo patrón.
  dioses_olimpicos_es: {
    hestia: ["Hestia es olímpica de origen pero cedió su asiento a Dioniso — según algunas fuentes, los doce canónicos la excluyen por eso. Digna hasta el final."],
    hades:  ["Hades tiene rango olímpico pero vive en el inframundo — el Olimpo le queda lejos por elección propia o por destino, según a quién le preguntes."],
  },
  olympic_gods_en: {
    hestia: ["Hestia has Olympian status but yielded her seat to Dionysus — some traditions exclude her from the canonical twelve for that reason. Graceful to the end."],
    hades:  ["Hades has Olympian rank but lives underground — Olympus is too far, whether by fate or by choice, depending on who you ask."],
  },
  jueces_inframundo_es: {
    sarpedon: ["Sarpedón era hermano de Minos y Radamantis — mismo padre y madre — pero murió en Troya y quedó en la historia como héroe bélico, no como juez."],
  },
  judges_underworld_en: {
    sarpedon: ["Sarpedon was brother to Minos and Rhadamanthus — same father, same mother — but died at Troy and passed into history as a war hero, not a judge."],
  },
};

/**
 * Busca si el input del jugador coincide con una entrada de closeAnswers para esta biblioteca.
 * Si hay match, devuelve un flavor text elegido al azar entre las variantes disponibles.
 * Si no hay match, devuelve null (el llamador debe caer al rechazo genérico).
 */
function buscarCloseAnswer(bibliotecaId, inputNormalizado) {
  const entradas = CLOSE_ANSWERS[bibliotecaId];
  if (!entradas) return null;

  const variantes = entradas[inputNormalizado];
  if (!variantes || variantes.length === 0) return null;

  const indice = Math.floor(Math.random() * variantes.length);
  return variantes[indice];
}

// === examenAdmision.js ===
// engine/examenAdmision.js — ACTUALIZADO 30/06: synonyms para colores del espectro.

const ESCALA_ADJETIVOS = { beginner: "iniciado", normal: "erudito", hard: "eminencia" };

const COPY_EXAMEN = {
  llegadaDirecta: "La puerta cruje al abrirse. Adentro: ¡¿un examen!? Una voz sabia, antigua y con fuerte acento—pero ¿de dónde?—dice: 'Formalidad fugaz y fácil: ¡fáctico!. Reintenta las veces que quieras.' Pausa teatral. 'Ahora, si fallas demasiadas veces, ni quiero imaginármelo.'",
  llegadaPorBrag: ({ nombreReferente, adjetivo }) =>
    `${nombreReferente} no aparece por ningún lado — ya entró, así son los ${adjetivo}. Pero a falta de algo más, ¿una puerta? y ¿un examen? Una voz sabia, antigua y con fuerte acento—pero ¿de dónde?—dice: 'Formalidad fugaz y fácil: ¡fáctico! Reintenta las veces que quieras.' Pausa teatral. 'Ahora, si fallas demasiadas veces, ni quiero imaginarme que dirá ${nombreReferente}... o yo mismo.'`,
  aceptado: "Hmm, no lo dudé por un segundo. Bienvenido a Aris, sígueme a El Vasto Vacío, que es donde ocurre toda la diversión. No temas engancharte, este es el único vicio que de verdad te ayuda.",
  fallo: "A todos nos pasa... Bueno, no a todos... Bueno, a casi nadie, la verdad. Pero un sabio más viejo que yo decía que el que se equivoca y aprende es el que gana en realidad.",
  bragSalida: ({ link }) => `Lo acepto: no fue fácil. Digo... ¡fue facilísimo, y aquí estoy, aceptado con honores! ¿Y tú? Te espero adentro: ${link}`
};

function determinarRutaEntrada(nombreIngresado, params) {
  if (norm(nombreIngresado) === "eckhart") return { tipo: "eckhart" };
  const ref = params.get("ref");
  if (ref) return { tipo: "brag", nombreReferente: ref };
  return { tipo: "directa" };
}

function calcularNivelReferente({ nivelMaximoBiblioteca, disertatioCompletada, phdIntentadoOSuperado }) {
  if (phdIntentadoOSuperado && nivelMaximoBiblioteca === "hard") return "hard";
  if (disertatioCompletada && nivelMaximoBiblioteca === "normal") return "normal";
  return "beginner";
}
function adjetivoParaReferente(nivelReferente) {
  return ESCALA_ADJETIVOS[nivelReferente] || ESCALA_ADJETIVOS.beginner;
}

const POOL_OBVIAS = [
  crearBiblioteca({ id: "examen_dias_semana", level: "exadm", lang: "es", field: "humanidades",
    name: "Días de la semana", desc: "Nombra los días de la semana.", total: 7, metmin: 7,
    facts: { lunes:"Lunae dies. Lo nocturno lunar ¿le prestará pereza? El día más odiado/amado según si es o no festivo.",martes:"Martis dies: día de Marte. Ya te despertaste y es el momento de salir a guerreártela, cosa que no hizo Marte.",miercoles:"Mercurii dies: Mercurio, dios veloz, parte la semana e indica que empieza la bajada. Si te piden rima: estiércoles.",jueves:"Iovis dies: Júpiter. Pasa Júpiter y llega la gloria, pero luego. Si alguien dice 'juernes': bloquéalo.",viernes:"Veneris dies: Venus. La relación etimológica de viernes y venérea no es incidental. ¡Ojo!",sabado:"Del hebreo Shabbat: descanso. 'Debería ser sagrado' — claman contratistas y asalariados.",domingo:"Dominicus dies: día del Señor. La orden: descansar. La rebeldía: ocuparte para llegar aun peor al lunes." } }),
  crearBiblioteca({ id: "examen_estaciones", level: "exadm", lang: "es", field: "ciencias_duras",
    name: "Estaciones del año", desc: "Nombra las estaciones del año.", total: 4, metmin: 4,
    facts: { primavera:"Del latín prima vera: el primer verdor. Cuando son quince te despiertan y, si no, te arrullan sus lluvias.",verano:"Del latín veranum: tiempo primaveral. En el sur es en navidad. Una golondrina no lo hace. ¿Que qué?",otono:"Del latín autumnus, de origen etrusco. Pariente de retoño en el ciclo y de ocaso en el destino.",invierno:"Primo de invernar e hibernar: pasar el frío. La N fue un topping castellano caprichoso. No trates de quitarle el in-.",
        otono: "Del latín autumnus, de origen etrusco. Pariente de retoño en el ciclo y de ocaso en el destino." } }),
  crearBiblioteca({ id: "examen_notas_musicales", level: "exadm", lang: "es", field: "artes",
    name: "Notas musicales", desc: "Nombra las notas musicales.", total: 7, metmin: 7,
    facts: { do:"Dominus en el himno de Guido de Arezzo, siglo XI. Primera y última nota, alfa y omega, do y do.",re:"Resonare fibris: segunda nota del himno a San Juan. ¿Guido d'Arezzo inventó el solfeo por pereza o falta de AI?",mi:"Mira gestorum. Tercera nota: discreta, sin agendas. Mi menor — de los acordes más melancólicos.",fa:"Famuli tuorum. Se dice que su disonancia con si — el diabolus in musica — era anatema en el pasado.",sol:"Solve polluti. La más redonda y cantable. Luminosa y esférica como el sol, pero nada que ver.",la:"La menor, la más triste. 440 Hz desde 1939: la guerra terminó la guerra de la. Antes, cada orquesta afinaba a su antojo.",si:"Sancte Iohannes. Algunos optan por si en vez de ti. Quédate dónde más te valoren." } }),
  crearBiblioteca({ id: "examen_elementos_antiguedad", level: "exadm", lang: "es", field: "ciencias_duras",
    name: "Elementos de la antigüedad", desc: "Nombra los cuatro elementos de la antigüedad.", total: 4, metmin: 4,
    facts: { tierra:"Para Aristóteles: fría y seca. Para Empédocles: uno de los cuatro principios. Para nosotros: planeta, piso, polvo, mugre...",agua:"Principio de todo para Tales de Mileto, quien fue, a su vez, principio de principios de casi todo. De la vida al menos, ¡sin duda!",aire:"Anaxímenes: el principio (arché) universal. 20k litros de nitrógeno y oxígeno que inhalamos diario sin pensarlo o decidirlo.",fuego:"Para Heráclito, el elemento-proceso. Todo fluye — especialmente la llama y el tiempo — y ambos lo consumen todo." } }),
  crearBiblioteca({ id: "examen_puntos_cardinales", level: "exadm", lang: "es", field: "geografia",
    name: "Puntos cardinales", desc: "Nombra los puntos cardinales.", total: 4, metmin: 4,
    facts: { norte:"Del germánico norþ. Las brújulas apuntan al norte magnético a 500 km del polo norte geográfico. Y está migrando rápido.",sur:"Del germánico sunþaz: hacia el sol. Si alguna vez encuentras un mapa antiguo germánico: ¡no lo uses!",este:"Oriente: donde nace el sol que nos orienta. Las iglesias medievales miraban al este: sus altares a salvo del ocaso.",oeste:"Occidente, ocaso, poniente: donde muere el sol al caer. Comparte raíz con caer, cadáver, ocasión, accidente, occipucio." },
    synonyms: {
      este:  ["oriente","orient","east"],
      oeste: ["occidente","poniente","west"],
      norte: ["north"],
      sur:   ["south"]
    }
  })
];

const POOL_FALSAMENTE_OBVIAS = [
  crearBiblioteca({ id: "examen_planetas", level: "exadm", lang: "es", field: "ciencias_duras",
    name: "Planetas del sistema solar", desc: "Nombra los planetas del sistema solar.", total: 8, metmin: 8,
    facts: { mercurio:"Años de 88 días terrestres y días de 59. Tu sueldo llega más rápido pero se te va en las 177 comidas del día.",venus:"Mucho más caliente que cualquiera, a pesar de ser el segundo en distancia del sol. El invernadero perfecto. Para matar. Lo que sea. Venera lo probó. Varias veces.",tierra:"El único planeta conocido con chicles, logaritmos y hordas insultando a la UAI respecto a si Plutón cuenta o no.",marte:"Olympus Mons: el volcán más grande del sistema solar (3x el Everest). Mira por encima del hombro al Everest, sonriéndole a Mauna Kea que emerge triunfante del mar.",jupiter:"Su Gran Mancha Roja: una tormenta activa de 1,3x el tamaño de la Tierra y 350+ años. Se encoge. Y aun así es más grande.",saturno:"Sus anillos tienen apenas ~10 metros de grosor y, según la fuente, de 100 a 4.500 millones de años. La astronomía, ciencia inexacta.",urano:"Rota de lado: eje inclinado 98°. Cuando te chocan en la mañana lo único que quieres es dormir acostado el resto del día.",neptuno:"El más matemático: predicho antes de visto. Le Verrier calculó su posición con lápiz, ilusionando a tantos que aun buscan el X." } }),
  crearBiblioteca({ id: "examen_colores_espectro", level: "exadm", lang: "es", field: "artes",
    name: "Colores del espectro", desc: "Nombra los colores del espectro (arcoíris).", total: 7, metmin: 7,
    facts: { rojo:"La longitud de onda más larga visible: ~700 nm. Casi todas las lenguas lo nombran de primero. Las mujeres lo ven más (los toros menos).",naranja:"Casi todas las lenguas de Europa lo nombran por la fruta, cuyo nombre viene a su vez del persa. Turandot pero dulce.",amarillo:"El más visible para el ojo humano. Comparte raíz con amargo y amaretto. La bilis escandalizando la lengua.",verde:"El ojo distingue más matices de verde que de cualquier otro color. Primo de lo virtuoso y viril y vigoroso.",azul:"El último color usual en recibir nombre en la mayoría de lenguas. La negra mar de los griegos, el verdeazul de los orientales, etc.",indigo:"Newton lo incluyó para armonizar con las 7 notas musicales. Nadie le hizo mucho caso. Los jeans adoptaron luego el índigo.",violeta:"El límite de lo visible: ~380 nm. Más allá, ultravioleta. Abejas, aves y algunos tetracrómatas lo trascienden.",
        indigo: "Newton lo incluyó para armonizar con las 7 notas musicales. Nadie le hizo mucho caso. Los jeans adoptaron luego el índigo." },
    synonyms: {
      violeta: ["morado","purpura","lila"],
      naranja:  ["naranjado","anaranjado"],
      indigo:   ["anil","añil","índigo"]
    }
  }),
  crearBiblioteca({ id: "examen_sentidos", level: "exadm", lang: "es", field: "ciencias_duras",
    name: "Sentidos", desc: "Nombra los sentidos.", total: 5, metmin: 5,
    facts: { vista:"Usa el 30% de la corteza cerebral (~10 millones de bits/s) que a su vez consume el 20% de tus calorías. Mirar: la mejor dieta.",oido:"El único sentido que no se puede apagar voluntariamente. Funciona incluso durante el sueño profundo. Y luego que de oídas es despectivo.",olfato:"El más antiguo evolutivamente. Conecta directo al sistema límbico (saltándose el tálamo): por eso los olores disparan memorias sin aviso y no se pueden evocar.",gusto:"Solo distingue 5 sabores básicos. Todo lo demás es aroma. Entre gustos no hay disgustos, pero entre olfatos...",tacto:"El primero en desarrollarse en el embrión. Tacto, presión, temperatura, caricias, dolor, equilibrio, propiocepción..." } })
];

function armarExamenAdmision() {
  const obvias = mezclarYTomar(POOL_OBVIAS, 3);
  const falsasObvias = mezclarYTomar(POOL_FALSAMENTE_OBVIAS, 2);
  return mezclarYTomar([...obvias, ...falsasObvias], 5);
}
function mezclarYTomar(arr, n) {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia.slice(0, n);
}


const { useState, useEffect } = React;

// === JugarBiblioteca.jsx ===
// 30/06 v2: names map para display limpio, botón Continuar al completar.

// formatFlavor: parser mínimo de markdown para flavor text.
// Soporta **negrita**, ~~tachado~~, *cursiva* — combinables entre sí (ver ISO900B).
// El orden en el regex importa: ** se evalúa antes que * en cada posición para
// que "**bold**" nunca se lea como cursiva rota. No usa dangerouslySetInnerHTML:
// solo envuelve substrings en <strong>/<s>/<em>, cero riesgo de inyección HTML.
function formatFlavor(text, keyPrefix = "ff") {
  if (!text) return text;
  const re = /\*\*(.+?)\*\*|~~(.+?)~~|\*(.+?)\*/;
  const m = text.match(re);
  if (!m) return text;
  const before = text.slice(0, m.index);
  const after = text.slice(m.index + m[0].length);
  let Tag, inner;
  if (m[1] !== undefined) { Tag = "strong"; inner = m[1]; }
  else if (m[2] !== undefined) { Tag = "s"; inner = m[2]; }
  else { Tag = "em"; inner = m[3]; }
  return (
    <React.Fragment key={keyPrefix}>
      {before}
      <Tag>{formatFlavor(inner, keyPrefix + "i")}</Tag>
      {formatFlavor(after, keyPrefix + "a")}
    </React.Fragment>
  );
}

function resolverClaveCanonica(valorEncontrado, synonyms) {
  for (const [canonica, listaSinonimos] of Object.entries(synonyms)) {
    if (listaSinonimos.includes(valorEncontrado)) return canonica;
  }
  return valorEncontrado;
}

// === Pistas de Teresa — localStorage por bib ===
function cargarPistas(bibId) {
  try {
    const raw = localStorage.getItem("aris_pistas_" + bibId);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
function guardarPistas(bibId, pistas) {
  try { localStorage.setItem("aris_pistas_" + bibId, JSON.stringify(pistas)); } catch {}
}

// Aplicar efecto de intercesión a un elemento pendiente
function aplicarEfectoIntercesion(interc, pendientes) {
  if (!pendientes || pendientes.length === 0) return null;
  // Target: el elemento más corto pendiente (alfabético en empate)
  const sorted = [...pendientes].sort((a, b) => a.length - b.length || a.localeCompare(b));
  const target = sorted[0];
  if (!target) return null;
  const id = interc.id;
  if (id === "principia") return { [target]: "α·" + target[0].toUpperCase() };
  if (id === "ultima") return { [target]: "ω·" + target[target.length - 1].toUpperCase() };
  if (id === "vocalitas") {
    const vocals = target.split("").map(c => "aeiouáéíóúü".includes(c.toLowerCase()) ? c.toUpperCase() : "·").join("");
    return { [target]: "∀·" + vocals };
  }
  if (id === "consonantia") {
    const cons = target.split("").map(c => "aeiouáéíóúü".includes(c.toLowerCase()) ? "·" : c.toUpperCase()).join("");
    return { [target]: "∁·" + cons };
  }
  if (id === "fiat_lux") return { [target]: "✦·" + target };
  if (id === "numerus") return { [target]: "#·" + target.length };
  return null;
}

function JugarBiblioteca({ biblioteca, onCompletada, mensajeCompletacion, modoTimer = "tortuga", tiempoLimite = null, onAbrirTeresa }) {
  const [encontrados, setEncontrados] = useState([]);
  const [input, setInput] = useState("");
  const [ultimoFeedback, setUltimoFeedback] = useState(null);
  const [esperandoContinuar, setEsperandoContinuar] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const [tiempoAgotado, setTiempoAgotado] = useState(false);
  const [pistas, setPistas] = useState(() => cargarPistas(biblioteca?._id || ""));
  const intervalRef = React.useRef(null);
  const startRef = React.useRef(null);

  // Escuchar intercesiones de Teresa
  React.useEffect(() => {
    function onIntercesion(e) {
      const { interc } = e.detail;
      const clavesValidas2 = Object.keys(biblioteca.facts || {});
      const encontradasKeys = encontrados.map(f => f.clave);
      const pendientes = clavesValidas2.filter(k => !encontradasKeys.includes(k));
      const efecto = aplicarEfectoIntercesion(interc, pendientes);
      if (efecto) {
        const nuevasPistas = { ...pistas, ...efecto };
        setPistas(nuevasPistas);
        guardarPistas(biblioteca._id, nuevasPistas);
      }
    }
    window.addEventListener("aris:intercesion", onIntercesion);
    return () => window.removeEventListener("aris:intercesion", onIntercesion);
  }, [encontrados, pistas, biblioteca]);

  // Timer: Aquiles (cuenta hacia arriba) y Atalanta (cuenta hacia abajo)
  React.useEffect(() => {
    if (modoTimer === "tortuga") return;
    startRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
      setSegundos(elapsed);
      if (modoTimer === "atalanta" && tiempoLimite && elapsed >= tiempoLimite) {
        clearInterval(intervalRef.current);
        setTiempoAgotado(true);
      }
    }, 500);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Detener timer al completar
  React.useEffect(() => {
    if (esperandoContinuar || tiempoAgotado) clearInterval(intervalRef.current);
  }, [esperandoContinuar, tiempoAgotado]);

  // Enter avanza cuando está en estado "esperandoContinuar"
  React.useEffect(() => {
    if (!esperandoContinuar) return;
    function onKey(e) {
      if (e.key === "Enter") { setEsperandoContinuar(false); onCompletada?.(biblioteca, "oro", segundos); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [esperandoContinuar, segundos]);

  const clavesValidas = Object.keys(biblioteca.facts);
  const clavesConSinonimos = expandirConSinonimos(clavesValidas, biblioteca.synonyms);
  const total   = biblioteca["total-"];
  const metmin  = biblioteca["metmin-"] ?? 1;
  const names   = biblioteca.names ?? {}; // id->nombre real para display en pills

  const completaOro     = total !== null && encontrados.length >= total;
  const metminAlcanzado = encontrados.length >= metmin;
  const puedeVerde      = metminAlcanzado && !completaOro && !esperandoContinuar;

  function manejarEnvio(e) {
    e.preventDefault();
    if (!input.trim() || esperandoContinuar || completaOro) return;
    const resultado = compararRespuesta(input, clavesConSinonimos);
    if (resultado.ok) {
      const valorMatcheado = resultado.candidatoCorregido ?? input.toLowerCase().trim();
      const clave = resolverClaveCanonica(valorMatcheado, biblioteca.synonyms ?? {});
      const yaEstaba = encontrados.some((e) => e.clave === clave);
      if (yaEstaba) {
        setUltimoFeedback({ tipo: "repetido", texto: "Ya tenías ese." });
      } else {
        const nuevos = [...encontrados, { clave, flavor: biblioteca.facts[clave] || "" }];
        setEncontrados(nuevos);
        setUltimoFeedback({ tipo: "ok", clave, texto: biblioteca.facts[clave] || "" });
        setInput("");
        // Limpiar pista del elemento encontrado
        if (pistas[clave]) {
          const nuevasPistas = { ...pistas };
          delete nuevasPistas[clave];
          setPistas(nuevasPistas);
          guardarPistas(biblioteca._id, nuevasPistas);
        }
        if (total !== null && nuevos.length >= total) {
          setEsperandoContinuar(true); // mostrar FT + botón, no avanzar todavía
        }
      }
    } else if (resultado.ambiguo) {
      setUltimoFeedback({ tipo: "no", texto: "Casi, pero no estoy seguro de cuál querías decir — revisá la ortografía." });
    } else {
      const closeAnswer = buscarCloseAnswer(biblioteca._id, norm(input));
      setUltimoFeedback({ tipo: "no", texto: closeAnswer || "No encontrado. Probá otra vez." });
    }
  }

  const estilo = {
    "--color-fondo": "#F7F3E8","--color-tinta": "#2A2A24",
    "--color-acento": "#A4502E","--color-ok": "#3E5942",
    fontFamily: "Georgia, serif", background: "var(--color-fondo)",
    color: "var(--color-tinta)", maxWidth: 420, margin: "0 auto",
    padding: 24, border: "1px solid var(--color-tinta)"
  };

  function fmtTiempo(s) {
    const m = Math.floor(s / 60), sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  return (
    <div style={estilo}>
      <h2 style={{ fontSize: 18, margin: "0 0 4px" }}>{biblioteca.name}</h2>
      {modoTimer !== "tortuga" && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <p style={{ fontSize: 12, color: "#8A8A78", fontStyle: "italic" }}>{biblioteca.desc}</p>
          <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif",
            color: modoTimer === "atalanta" && tiempoLimite
              ? (tiempoLimite - segundos < 10 ? "#A4502E" : "#7A5C00")
              : "#2A2A24" }}>
            {modoTimer === "atalanta" && tiempoLimite
              ? fmtTiempo(Math.max(0, tiempoLimite - segundos))
              : fmtTiempo(segundos)}
            {modoTimer === "atalanta" ? " ⏳" : " ⏱"}
          </span>
        </div>
      )}
      {modoTimer === "tortuga" && (
        <p style={{ fontSize: 12, color: "#8A8A78", margin: "0 0 16px", fontStyle: "italic" }}>{biblioteca.desc}</p>
      )}
      <p style={{ fontSize: 11, color: "#8A8A78", margin: "0 0 8px" }}>
        {encontrados.length} de {total ?? "\u221e"}
        {metmin && !completaOro && !esperandoContinuar &&
          <span style={{ color: "#8A8A78", marginLeft: 8 }}>(mín. {metmin})</span>}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16, minHeight: 28 }}>
        {encontrados.map((e) => (
          <span key={e.clave} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 12,
            background: "var(--color-ok)", color: "#F7F3E8", textTransform: "capitalize" }}>
            {names[e.clave] || e.clave}
          </span>
        ))}
      </div>
      {Object.keys(pistas).length > 0 && (
        <div style={{ marginBottom: 10 }}>
          {Object.entries(pistas).map(([elem, pista]) => (
            <div key={elem} style={{ fontSize: 11, color: "#7A5C00", fontStyle: "italic",
                 background: "#FEFBE8", border: "1px solid #D4A937", padding: "3px 8px",
                 marginBottom: 3, display: "inline-block", marginRight: 4 }}>
              {pista}
            </div>
          ))}
        </div>
      )}
      {!esperandoContinuar && !completaOro && (
        <form onSubmit={manejarEnvio}>
          <input value={input} onChange={(e) => setInput(e.target.value)}
            style={{ fontSize: 14, padding: 8, width: "100%", marginBottom: 8, boxSizing: "border-box" }}
            autoFocus />
        </form>
      )}
      {ultimoFeedback && (
        <p style={{ fontSize: 12, fontStyle: "italic", minHeight: 18,
          color: ultimoFeedback.tipo === "no" ? "var(--color-acento)" : "var(--color-tinta)" }}>
          {ultimoFeedback.tipo === "ok" && ultimoFeedback.clave && (
            <><strong style={{ fontStyle: "normal" }}>{names[ultimoFeedback.clave] || (ultimoFeedback.clave.charAt(0).toUpperCase() + ultimoFeedback.clave.slice(1))}. </strong></>
          )}
          {formatFlavor(ultimoFeedback.texto)}
        </p>
      )}
      {tiempoAgotado && (
        <div style={{ marginTop: 16, borderTop: "0.5px solid #BFBAA8", paddingTop: 14, textAlign: "center" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#A4502E", marginBottom: 8 }}>Tiempo agotado. {encontrados.length} de {total ?? "∞"}.</p>
          <button onClick={() => onCompletada?.(biblioteca, encontrados.length >= (metmin ?? 0) ? "verde" : null, segundos)}
            style={{ padding: "8px 18px", cursor: "pointer", background: "#A4502E",
              color: "#F7F3E8", border: "none", fontFamily: "Georgia, serif", fontSize: 13 }}>
            Continuar →
          </button>
        </div>
      )}
      {puedeVerde && !tiempoAgotado && (
        <div style={{ marginTop: 16, borderTop: "0.5px solid #BFBAA8", paddingTop: 14 }}>
          <p style={{ fontSize: 11, color: "#8A8A78", fontStyle: "italic", marginBottom: 8 }}>
            Llegaste al mínimo. Puedes dar la biblioteca por completa… o seguir.
          </p>
          <button onClick={() => onCompletada?.(biblioteca, "verde", segundos)}
            style={{ padding: "6px 14px", cursor: "pointer", background: "#3E5942",
              color: "#F7F3E8", border: "none", fontFamily: "Georgia, serif", fontSize: 12 }}>
            Dar por completa ✓
          </button>
        </div>
      )}
      {esperandoContinuar && (
        <div style={{ marginTop: 16, borderTop: "0.5px solid #BFBAA8", paddingTop: 14, textAlign: "center" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#7A5C00", marginBottom: 12 }}>
            {mensajeCompletacion || "¡Completa! ✦"}
            {modoTimer !== "tortuga" && <span style={{ fontSize: 12, color: "#8A8A78", display: "block", marginTop: 4 }}>{fmtTiempo(segundos)}</span>}
          </p>
          <button onClick={() => { setEsperandoContinuar(false); onCompletada?.(biblioteca, "oro", segundos); }}
            style={{ padding: "8px 18px", cursor: "pointer", background: "#7A5C00",
              color: "#F7F3E8", border: "none", fontFamily: "Georgia, serif", fontSize: 13 }}>
            Continuar →
          </button>
        </div>
      )}
    </div>
  );
}

// === ElVastoVacio.jsx ===
// ACTUALIZADO 30/06: verde/oro visual + barra de logros para IC abiertas.

const NIVEL_SIMBOLO = { beginner: "☉", normal: "☽", hard: "★" };
const NIVEL_LABEL   = { beginner: "Paperback", normal: "Hardcover", hard: "Incunabula" };

const LOGROS_IC = [
  { umbral: 10, nombre: "Especialista" }, { umbral: 20, nombre: "Lumbrera" },
  { umbral: 30, nombre: "Sabelotodo" },  { umbral: 40, nombre: "Heurista" },
  { umbral: 50, nombre: "Autoridad" },   { umbral: 60, nombre: "Sumo Pontífice" },
  { umbral: 70, nombre: "Archimandrita" },{ umbral: 80, nombre: "Enciclopedia" },
  { umbral: 90, nombre: "Kircher" },     { umbral: 100, nombre: "Omnisapiente" },
];

function calcularLogro(completados, capacidad) {
  if (!capacidad) return null;
  const pct = Math.min(100, (completados / capacidad) * 100);
  let logro = null;
  for (const l of LOGROS_IC) { if (pct >= l.umbral) logro = l; }
  return { logro, pct };
}

function ElVastoVacio({ bibliotecas = [], onAbrirBiblioteca }) {
  const completas = bibliotecas.filter((b) => b.tipoComplecion).length;
  const enOro     = bibliotecas.filter((b) => b.tipoComplecion === "oro").length;
  const total     = bibliotecas.length;
  return (
    <div style={{"--color-fondo":"#F7F3E8","--color-tinta":"#2A2A24","--color-acento":"#A4502E",
      "--color-tenue":"#8A8A78","--color-linea":"#BFBAA8","--color-verde":"#3E5942","--color-oro":"#7A5C00",
      fontFamily:"Georgia, serif",color:"var(--color-tinta)",
      maxWidth:420,margin:"0 auto",border:"1px solid var(--color-tinta)",
      backgroundImage:`url(${IMG_MARBLE})`,backgroundSize:"cover",backgroundPosition:"center",
      backgroundBlendMode:"multiply",backgroundColor:"rgba(247,243,232,0.55)"}}>
      <div style={{ padding: "18px 22px 12px" }}>
        <p style={{ fontSize: 9, color: "var(--color-tenue)", margin: "0 0 6px", letterSpacing: 1.5 }}>FIG. 3 — TABULA PROGRESSUS</p>
        <h1 style={{ fontSize: 19, margin: 0, fontWeight: 400, fontStyle: "italic",
          borderBottom: "1px solid var(--color-tinta)", paddingBottom: 8, display: "inline-block" }}>El Vasto Vacío</h1>
        <p style={{ fontSize: 11, color: "var(--color-tenue)", margin: "6px 0 0" }}>
          {completas} de {total} completadas
          {enOro > 0 && <span style={{ color: "var(--color-oro)", marginLeft: 8 }}>· {enOro} ✦ en dorado</span>}
        </p>
      </div>
      <svg width="100%" height="60" viewBox="0 0 380 60" style={{ display: "block", padding: "0 22px" }}>
        {bibliotecas.slice(0, 6).map((b, i) => {
          const x = 40 + i * 60, y = 15 + (i % 3) * 12;
          return <circle key={b._id} cx={x} cy={y}
            r={b.tipoComplecion ? 3 : 1.8}
            fill={b.tipoComplecion==="oro" ? "#7A5C00" : b.tipoComplecion==="verde" ? "#3E5942" : "#8A8A78"} />;
        })}
      </svg>
      <div style={{ padding: "10px 22px 18px", display: "flex", flexDirection: "column", gap: 1 }}>
        {bibliotecas.map((b) => <FilaBiblioteca key={b._id} biblioteca={b} onClick={onAbrirBiblioteca} />)}
      </div>
      <div style={{ padding: "9px 22px", borderTop: "1px solid var(--color-tinta)", textAlign: "center" }}>
        <span style={{ fontSize: 9, color: "var(--color-tenue)", letterSpacing: 0.5 }}>EX BIBLIOTHECA ARIS, MMXXVI</span>
      </div>
    </div>
  );
}

function FilaBiblioteca({ biblioteca, onClick }) {
  const { name, _level, completados, total, capacidad, bloqueada, tipoComplecion } = biblioteca;
  const esAbierta = total === null || total === undefined;
  if (bloqueada) return (
    <div style={{ padding: "11px 0 11px 8px", borderBottom: "0.5px solid var(--color-linea)",
      display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: 0.4,
      cursor: "default" }}>
      <div>
        <span style={{ fontSize: 13, fontWeight: 700, fontStyle: "italic", color: "var(--color-tenue)" }}>{name}</span>
        <span style={{ fontSize: 10, color: "var(--color-tenue)", fontStyle: "italic", marginLeft: 6 }}>
          {NIVEL_SIMBOLO[_level]} {NIVEL_LABEL[_level]}
        </span>
      </div>
      <span style={{ fontSize: 11, color: "var(--color-tenue)" }}>— — —</span>
    </div>
  );
  const esOro   = tipoComplecion === "oro";
  const esVerde = tipoComplecion === "verde";
  const completa = !!tipoComplecion;
  const bordeIzq = esOro ? "3px solid #7A5C00" : esVerde ? "3px solid #3E5942" : "3px solid transparent";
  const infoLogro = esAbierta && capacidad ? calcularLogro(completados, capacidad) : null;
  return (
    <div onClick={() => onClick?.(biblioteca)}
      style={{ padding: "11px 0 11px 8px", borderBottom: "0.5px solid var(--color-linea)",
        borderLeft: bordeIzq, cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{name}</span>
          <span style={{ fontSize: 10, color: "var(--color-tenue)", fontStyle: "italic", marginLeft: 6 }}>
            {NIVEL_SIMBOLO[_level]} {NIVEL_LABEL[_level]}
          </span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600,
          color: esOro ? "#7A5C00" : esVerde ? "#3E5942" : "var(--color-acento)" }}>
          {esOro ? "✦ completo" : esVerde ? "✓ completo" : esAbierta ? `${completados} / ∞` : `${completados} / ${total}`}
        </span>
      </div>
      {esAbierta && capacidad > 0 && completados > 0 && infoLogro && (
        <div style={{ marginTop: 7 }}>
          <div style={{ height: 3, background: "#BFBAA8", borderRadius: 2, overflow: "hidden", marginBottom: 4 }}>
            <div style={{ height: "100%", width: `${infoLogro.pct}%`,
              background: infoLogro.pct >= 100 ? "#7A5C00" : "#3E5942", borderRadius: 2 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 10, color: "#3E5942", fontStyle: "italic" }}>
              {infoLogro.logro ? `${infoLogro.logro.nombre} · ${Math.round(infoLogro.pct)}%` : `${Math.round(infoLogro.pct)}%`}
            </span>
            {(() => { const prox = LOGROS_IC.find(l => l.umbral > infoLogro.pct);
              return prox ? <span style={{ fontSize: 9, color: "var(--color-tenue)" }}>→ {prox.nombre} ({prox.umbral}%)</span> : null; })()}
          </div>
        </div>
      )}
    </div>
  );
}

// === ExamenAdmision.jsx ===
// components/ExamenAdmision.jsx




function ExamenAdmision({ onAceptado }) {
  const [nombre, setNombre] = useState("");
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");

  function manejarEnvioNombre(e) {
    e.preventDefault();
    const r = determinarRutaEntrada(nombre, params);
    if (r.tipo === "eckhart") {
      onAceptado({ modoEckhart: true });
      return;
    }
    // Pantalla de nombre cumplida — App.jsx toma el control y arranca EXAMEN_BIBLIOTECAS
    // con JugarBiblioteca (el examen real son 5 bibliotecas-pregunta, no preguntas sueltas).
    onAceptado({ nombre, ruta: r });
  }

  const estilo = {
    "--color-fondo": "#EBE3D0",
    "--color-tinta": "#2B2620",
    "--color-acento": "#A4502E",
    fontFamily: "Georgia, serif",
    background: "var(--color-fondo)",
    color: "var(--color-tinta)",
    maxWidth: 420,
    margin: "0 auto",
    padding: 28,
    lineHeight: 1.6
  };

  return (
    <div style={estilo}>
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>Aris</h1>
      <form onSubmit={manejarEnvioNombre}>
        <label style={{ fontSize: 13, display: "block", marginBottom: 8 }}>¿Cómo te llamas?</label>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ fontSize: 14, padding: 8, width: "100%", marginBottom: 12 }}
          autoFocus
        />
        <button type="submit" style={{ padding: "8px 16px", fontSize: 13 }}>
          Entrar
        </button>
      </form>
    </div>
  );
}

// === BibliotecaCompletada.jsx ===
// ACTUALIZADO 30/06: dos modos oro/verde.


// === Sistema de Brag ===
// URL base del juego (cambiar cuando esté deployado)
const ARIS_URL = "https://themiloramirez.github.io/aris";

// Artículos por biblioteca _id (género + número para el brag)
// "los" / "las" / "el" / "la" / "cada" (invariante)
const ARTICULOS_BIB = {
  oceanos_es:                "los",
  continentes_es:            "los",
  spice_girls_es:            "las",
  halogenos_es:              "los",
  nueve_musas_es:            "las",
  prefijos_griegos_es:       "los",
  corrientes_filosoficas_es: "las",
  expresiones_latinas_es:    "las",
  vanished_states_es:        "los",
};

// Textos de brag por nivel — IC más shady
const BRAG_INTRO = {
  beginner: (titulo, campo, brag) =>
    `Acabo de nombrar ${brag}. Me dicen: ${titulo} en ${campo}. ¿Y tú? Juega Aris:`,
  normal: (titulo, campo, brag) =>
    `${brag} — nombrados. Todos. Me gané el título de ${titulo} en ${campo}. ¿Tú también puedes? Aris:`,
  hard: (titulo, campo, brag) =>
    `${titulo} en ${campo}. ${brag}, sin pestañear. Juega Aris si quieres medir cuánto te falta:`
};

// Brags de hito (ExAdm, Dis, PhD)
const BRAG_HITOS = {
  exadm: "Pasé el examen de admisión de Aris. Sin trampa, sin red. ¿Te animás? Juega:",
  dis:   "Disertatio superada. Cinco ciencias, siete pensadores cada una. Hardcover desbloqueado. Aris:",
  phd:   "PhD de Aris completado. El Arca de la Humanidad, rama a rama. Incunabula es mía. Aris:"
};

function generarTextoBrag(biblioteca, tipoComplecion, nivel) {
  if (tipoComplecion !== "oro") return null; // solo brag en completación dorada
  const articulo = ARTICULOS_BIB[biblioteca._id] || "los";
  const nombre   = biblioteca.name || "";
  const bragBib  = articulo + " " + nombre;
  const titulo   = TITULOS_NIVEL[nivel] || "iniciado";
  const campo    = CAMPO_DISPLAY[biblioteca._field] || (biblioteca._field || "");
  const fn       = BRAG_INTRO[nivel] || BRAG_INTRO.beginner;
  return fn(titulo, campo, bragBib) + " " + ARIS_URL;
}

async function compartirBrag(texto) {
  // Web Share API (funciona en móvil y algunos desktops modernos)
  if (navigator.share) {
    try {
      await navigator.share({ text: texto, url: ARIS_URL });
      return "compartido";
    } catch {}
  }
  // Fallback: copiar al clipboard
  try {
    await navigator.clipboard.writeText(texto);
    return "copiado";
  } catch {
    return "error";
  }
}


// === Tabla de completación por campo × nivel ===
const TITULOS_NIVEL = { beginner: "iniciado", normal: "erudito", hard: "eminencia" };

const CAMPO_DISPLAY = {
  geografia:      "Geografía",
  artes:          "Artes",
  humanidades:    "Humanidades",
  ciencias_duras: "Ciencias"
};

const FRASES_COMPLETACION = {
  geografia: {
    beginner: "¡Qué bien ubicado!",
    normal:   "¡Estás en todas partes!",
    hard:     "¡Punto de referencia universal!"
  },
  artes: {
    beginner: "¡Enfant terrible!",
    normal:   "¡Exquisito esteta!",
    hard:     "¡Sublime, orgánico, iconoclasta!"
  },
  humanidades: {
    beginner: "¡Humanista en ciernes!",
    normal:   "¡Exegeta de bípedos implumes!",
    hard:     "¡Ciudadano visionario de la República de las Letras!"
  },
  ciencias_duras: {
    beginner: "¡Preciso, exacto, correcto!",
    normal:   "¡Hipótesis confirmada!",
    hard:     "¡El universo se calibra respecto a ti!"
  }
};

const FRASE_GENERICA = {
  beginner: "¡Bien hecho!",
  normal:   "¡Notable!",
  hard:     "¡Magistral!"
};

function BibliotecaCompletada({ biblioteca, tipoComplecion = "verde", onVolver, onBrag }) {
  const esOro = tipoComplecion === "oro";
  React.useEffect(() => {
    function onKey(e) { if (e.key === "Enter") onVolver?.(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const nivel   = biblioteca?._level || "beginner";
  const campo   = biblioteca?._field || "";
  const titulo  = TITULOS_NIVEL[nivel] || "iniciado";
  const display = CAMPO_DISPLAY[campo] || campo;
  const frases  = FRASES_COMPLETACION[campo] || FRASE_GENERICA;
  const frase   = frases[nivel] || frases.beginner || "¡Bien hecho!";

  const colorBorde = esOro ? "#7A5C00" : "#3E5942";
  const icono      = esOro ? "✦" : "✓";
  const subtexto   = esOro
    ? "Panteón completo. La biblioteca es tuya."
    : "Mínimo alcanzado. La biblioteca queda abierta para más.";

  const [estadoBrag, setEstadoBrag] = useState(null); // null | "copiado" | "compartido" | "error"
  const textoBrag = generarTextoBrag(biblioteca, tipoComplecion, nivel);

  async function manejarRegodéate() {
    if (!textoBrag) return;
    const resultado = await compartirBrag(textoBrag);
    setEstadoBrag(resultado);
    if (resultado === "copiado") setTimeout(() => setEstadoBrag(null), 2500);
  }

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#F7F3E8", color: "#2A2A24",
      maxWidth: 420, margin: "0 auto", padding: 40, textAlign: "center",
      border: `2px solid ${colorBorde}`, borderRadius: 8 }}>
      <style>{`@keyframes apareceConRebote{0%{transform:scale(0.6);opacity:0}60%{transform:scale(1.08);opacity:1}100%{transform:scale(1);opacity:1}}.triunfo-icono{animation:apareceConRebote 0.5s ease-out}`}</style>
      <div className="triunfo-icono" style={{ fontSize: 44, marginBottom: 12, color: colorBorde }}>{icono}</div>
      <p style={{ fontSize: 13, color: "#8A8A78", fontStyle: "italic", marginBottom: 4 }}>
        {esOro ? `Eres un gran ${titulo} en ${display}.` : `${biblioteca?.name} — completada (mín.)`}
      </p>
      {esOro && (
        <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{frase}</p>
      )}
      <p style={{ fontSize: 12, color: "#8A8A78", fontStyle: "italic", marginBottom: 20 }}>{subtexto}</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={onVolver} style={{ padding: "8px 16px", cursor: "pointer" }}>
          Volver al Vasto Vacío
        </button>
        {esOro && textoBrag && (
          <button onClick={manejarRegodéate}
            style={{ padding: "8px 16px", cursor: "pointer",
              background: estadoBrag === "copiado" ? "#3E5942" : "#7A5C00",
              color: "#F7F3E8", border: "none", fontFamily: "Georgia, serif", fontSize: 13 }}>
            {estadoBrag === "copiado"    ? "¡Copiado! ✓"
           : estadoBrag === "compartido" ? "¡Compartido! ✦"
           : "Regodéate →"}
          </button>
        )}
      </div>
      {estadoBrag === "copiado" && (
        <p style={{ fontSize: 10, color: "#8A8A78", marginTop: 10, fontStyle: "italic" }}>
          Texto copiado al portapapeles — pegalo donde quieras.
        </p>
      )}
    </div>
  );
}

// === Disertatio — Bacon B1 intro ===
// B1: Primera aparición de Bacon. Trigger: el jugador entra a la Disertatio por primera vez.
// Aristóteles lo acaba de presentar (A9c). Bacon se presenta gradualmente.

const TEXTO_B1 = [
  "Esto puede parecer un juego pero en realidad es un ejercicio del ingenio, una prueba experimental del saber. Soy Francis Bacon: me alegra verte trascender los rangos.",
  "Mi siglo fue el de ver más allá y más profundo con telescopios y microscopios. Y de imaginar lo aún inconcebible como máquinas de todo tipo.",
  "Mi mente científica me abrió los ojos a todo esto y más. Ahora sometamos la tuya a la prueba máxima del saber: la Disertatio.",
  "Deberás demostrar la aplicación de tus sentidos a la historia de las ciencias y, cuando lo logres, engrosarás la cofradía de la óptima curiosidad.",
];

function DisertatioBaconIntro({ onComenzar }) {
  const [linea, setLinea] = React.useState(0);
  const esUltima = linea >= TEXTO_B1.length - 1;

  React.useEffect(() => {
    function onKey(e) { if (e.key === "Enter") avanzar(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [linea]);

  function avanzar() {
    if (!esUltima) setLinea(l => l + 1);
    else onComenzar();
  }

  const s = {
    wrap: { fontFamily: "Georgia, serif", background: "#1A1208", color: "#F2E9D5",
            maxWidth: 420, margin: "0 auto", padding: "0 0 0 0",
            display: "flex", flexDirection: "column" },
    imgWrap: { width: "100%", height: 220, overflow: "hidden", flexShrink: 0 },
    img: { width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center",
           filter: "sepia(20%) brightness(0.85)" },
    body: { padding: "24px 28px 32px", display: "flex", flexDirection: "column", alignItems: "center" },
    etiqueta: { fontSize: 9, color: "#D4A937", letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" },
    nombre: { fontSize: 14, fontWeight: 700, color: "#D4A937", marginBottom: 20 },
    burbuja: { background: "rgba(242,233,213,0.06)", border: "1px solid rgba(242,233,213,0.15)",
               padding: "18px 22px", marginBottom: 24, lineHeight: 1.7,
               fontSize: 14, fontStyle: "italic", textAlign: "left", minHeight: 70,
               display: "flex", alignItems: "center", justifyContent: "center", width: "100%", boxSizing: "border-box" },
    dots: { display: "flex", gap: 8, marginBottom: 24, justifyContent: "center" },
    dot: (activo) => ({ width: 5, height: 5, borderRadius: "50%",
                        background: activo ? "#D4A937" : "rgba(212,169,55,0.3)" }),
    btn: { border: "1px solid #D4A937", background: "none", color: "#D4A937",
           fontFamily: "Georgia, serif", fontSize: 12, padding: "9px 24px",
           cursor: "pointer", letterSpacing: 1 },
  };

  return (
    <div style={s.wrap}>
      <div style={s.imgWrap}>
        <img src={IMG_BACON} alt="Francis Bacon" style={s.img} />
      </div>
      <div style={s.body}>
        <p style={s.etiqueta}>DISERTATIO</p>
        <p style={s.nombre}>Francis Bacon</p>
        <div style={s.burbuja}>{TEXTO_B1[linea]}</div>
        <div style={s.dots}>
          {TEXTO_B1.map((_, i) => <div key={i} style={s.dot(i === linea)} />)}
        </div>
        <button style={s.btn} onClick={avanzar}>
          {esUltima ? "Comenzar Disertatio →" : "Continuar →"}
        </button>
      </div>
    </div>
  );
}

// Bacon B3 — Despedida y relevo a Borges (Disertatio completada)
const TEXTO_B3 = [
  "La ciencia no tiene ocasos, solo albas. Pero, ¿quién se acerca? ¿Algo más allá de la ciencia? ¿Las ciencias? ¿Qué?",
  "Trasciende cálculos, medidas, unidades y hasta números. Mis sentidos enmudecen. ¿Cómo es que entiendo lo que ni veo?",
  "¿Imaginar? Tal vez por ahí va la cosa. No sé si ese bastón que oigo tendrá algo que ver.",
];

function DisertatioBaconAprobado({ onContinuar }) {
  const [linea, setLinea] = React.useState(0);
  const esUltima = linea >= TEXTO_B3.length - 1;

  React.useEffect(() => {
    function onKey(e) { if (e.key === "Enter") avanzar(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [linea]);

  function avanzar() {
    if (!esUltima) setLinea(l => l + 1);
    else onContinuar();
  }

  const s = {
    wrap: { fontFamily: "Georgia, serif", background: "#1A1208", color: "#F2E9D5",
            maxWidth: 420, margin: "0 auto", display: "flex", flexDirection: "column" },
    imgWrap: { width: "100%", height: 180, overflow: "hidden" },
    img: { width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center",
           filter: "sepia(30%) brightness(0.75)" },
    body: { padding: "24px 28px 32px", display: "flex", flexDirection: "column", alignItems: "center" },
    etiqueta: { fontSize: 9, color: "#D4A937", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" },
    badge: { fontSize: 18, fontWeight: 700, color: "#D4A937", marginBottom: 4 },
    sub: { fontSize: 12, color: "#9A856A", marginBottom: 20, fontStyle: "italic" },
    burbuja: { background: "rgba(242,233,213,0.06)", border: "1px solid rgba(242,233,213,0.15)",
               padding: "18px 22px", marginBottom: 24, lineHeight: 1.7,
               fontSize: 14, fontStyle: "italic", textAlign: "left", width: "100%", boxSizing: "border-box" },
    dots: { display: "flex", gap: 8, marginBottom: 24, justifyContent: "center" },
    dot: (activo) => ({ width: 5, height: 5, borderRadius: "50%",
                        background: activo ? "#D4A937" : "rgba(212,169,55,0.3)" }),
    btn: { border: "1px solid #D4A937", background: "none", color: "#D4A937",
           fontFamily: "Georgia, serif", fontSize: 12, padding: "9px 24px",
           cursor: "pointer", letterSpacing: 1 },
  };

  return (
    <div style={s.wrap}>
      <div style={s.imgWrap}>
        <img src={IMG_BACON} alt="Francis Bacon" style={s.img} />
      </div>
      <div style={s.body}>
        <p style={s.etiqueta}>DISERTATIO SUPERADA</p>
        <p style={s.badge}>✦ Hardcover desbloqueado</p>
        <p style={s.sub}>Francis Bacon · despedida</p>
        <div style={s.burbuja}>{TEXTO_B3[linea]}</div>
        <div style={s.dots}>
          {TEXTO_B3.map((_, i) => <div key={i} style={s.dot(i === linea)} />)}
        </div>
        <button style={s.btn} onClick={avanzar}>
          {esUltima ? "Continuar →" : "Continuar →"}
        </button>
      </div>
    </div>
  );
}

// === Disertatio.jsx ===
// 30/06 v2: names map, key prop, extraClips, synonyms.

const FASES_DISERTATIO = { INTRO: "intro", CIENCIA: "ciencia", APROBADO: "aprobado" };

function Disertatio({ onCompletado }) {
  const [fase, setFase] = useState(FASES_DISERTATIO.INTRO);
  const [indiceCiencia, setIndiceCiencia] = useState(0);
  const ciencias = DISERTATIO.ciencias;
  const cienciaActual = ciencias[indiceCiencia];

  const INTRO_CIENCIAS = {
    matematicas: "Antes del 2 viene el 1 y antes de todos los números, los pensadores sin los cuales las matemáticas serían impensables. No todos, claro: solo siete.",
    fisica:      "El big bang es el principio de todo — menos de sí mismo: eso lo concibió la física teórica. ¿Y a la física, quién? Dinos siete sin los cuales la disciplina sería inconcebible.",
    quimica:     "Este pool de sabios viola la ley del octeto: aquí te pedimos solo siete químicos, pero tan brillantes que sus reacciones en la historia sean exotérmicas.",
    biologia:    "La ciencia que estudia la vida fue construida por personas cuyo legado sigue vivaz, viviente y vivo: ¿Siete pensadores sin los cuales la biología no estaría viva?",
    astronomia:  "Lumbreras de la ciencia del espacio exterior hay demasiadas. Aquí solo te pedimos siete sin las cuales el firmamento sería menos firme."
  };

  function cienciaComoBiblioteca(ciencia) {
    const facts = {}, names = {};
    for (const p of ciencia.pensadores) { facts[p._id] = p.flavor; names[p._id] = p.name; }
    for (const ec of (ciencia.extraClips || [])) { facts[ec._id] = ec.flavor; names[ec._id] = ec.name; }
    return {
      _id: "disertatio_" + ciencia._id,
      name: "Disertatio — " + ciencia.name,
      desc: INTRO_CIENCIAS[ciencia._id] || ("Nombra " + ciencia.pensadores.length + " pensadores de " + ciencia.name + "."),
      "total-": ciencia.pensadores.length,
      "metmin-": ciencia.pensadores.length,
      synonyms: ciencia.synonyms || {},
      names,
      facts
    };
  }

  function manejarCienciaCompletada() {
    if (indiceCiencia + 1 < ciencias.length) setIndiceCiencia(indiceCiencia + 1);
    else setFase(FASES_DISERTATIO.APROBADO);
  }

  const estiloIntro = { fontFamily:"Georgia,serif",background:"#EBE3D0",color:"#2B2620",
    maxWidth:420,margin:"0 auto",padding:28,lineHeight:1.6,textAlign:"center" };

  if (fase === FASES_DISERTATIO.INTRO) return (
    <DisertatioBaconIntro onComenzar={() => setFase(FASES_DISERTATIO.CIENCIA)} />
  );

  if (fase === FASES_DISERTATIO.CIENCIA) return (
    <div>
      <p style={{ textAlign: "center", fontSize: 11, color: "#8A8A78", marginBottom: 8 }}>
        Disertatio \u2014 ciencia {indiceCiencia + 1} de {ciencias.length}</p>
      <JugarBiblioteca key={cienciaActual._id}
        biblioteca={cienciaComoBiblioteca(cienciaActual)}
        onCompletada={manejarCienciaCompletada} />
    </div>
  );

  if (fase === FASES_DISERTATIO.APROBADO) return (
    <DisertatioBaconAprobado onContinuar={() => onCompletado?.()} />
  );
  return null;
}

// === PhD — Borges J1/J2 ===
// J1: Primera aparición de Borges. Trigger: jugador entra al PhD.
// J2: Resultado (madlib) — se genera al completar el PhD.

const TEXTO_J1 = [
  "Ni ves como te veo, pero te veo más como te ve Teresa que como fuiste visto por Bacon. La noche y los libros son mi don y yo soy Borges.",
  "Espero que el horizonte de la ciencia sea para ti un peldaño en el escalar del saber. ¿Has pensado sobre el pensamiento?",
  "¿Te atreves a remontarte al PhD donde probarás que sabes saber?",
];

function PhDBorgesIntro({ onComenzar }) {
  const [linea, setLinea] = React.useState(0);
  const esUltima = linea >= TEXTO_J1.length - 1;

  React.useEffect(() => {
    function onKey(e) { if (e.key === "Enter") avanzar(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [linea]);

  function avanzar() {
    if (!esUltima) setLinea(l => l + 1);
    else onComenzar();
  }

  const s = {
    wrap: { fontFamily: "Georgia, serif", background: "#0D0D0D", color: "#F2E9D5",
            maxWidth: 420, margin: "0 auto", display: "flex", flexDirection: "column",
            border: "2px solid #D4A937" },
    imgWrap: { width: "100%", height: 220, overflow: "hidden" },
    img: { width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top",
           filter: "sepia(15%) brightness(0.8) contrast(1.1)" },
    body: { padding: "24px 28px 32px", display: "flex", flexDirection: "column", alignItems: "center" },
    etiqueta: { fontSize: 9, color: "#D4A937", letterSpacing: 2, marginBottom: 10, textTransform: "uppercase" },
    nombre: { fontSize: 14, fontWeight: 700, color: "#D4A937", marginBottom: 20 },
    burbuja: { background: "rgba(212,169,55,0.05)", border: "1px solid rgba(212,169,55,0.2)",
               padding: "18px 22px", marginBottom: 24, lineHeight: 1.75,
               fontSize: 14, fontStyle: "italic", textAlign: "left", width: "100%", boxSizing: "border-box" },
    dots: { display: "flex", gap: 8, marginBottom: 24, justifyContent: "center" },
    dot: (activo) => ({ width: 5, height: 5, borderRadius: "50%",
                        background: activo ? "#D4A937" : "rgba(212,169,55,0.25)" }),
    btn: { border: "1px solid #D4A937", background: "none", color: "#D4A937",
           fontFamily: "Georgia, serif", fontSize: 12, padding: "9px 24px",
           cursor: "pointer", letterSpacing: 1 },
  };

  return (
    <div style={s.wrap}>
      <div style={s.imgWrap}>
        <img src={IMG_BORGES} alt="Borges" style={s.img} />
      </div>
      <div style={s.body}>
        <p style={s.etiqueta}>EXAMEN DE PHD</p>
        <p style={s.nombre}>Jorge Luis Borges</p>
        <div style={s.burbuja}>{TEXTO_J1[linea]}</div>
        <div style={s.dots}>
          {TEXTO_J1.map((_, i) => <div key={i} style={s.dot(i === linea)} />)}
        </div>
        <button style={s.btn} onClick={avanzar}>
          {esUltima ? "Comenzar PhD →" : "Continuar →"}
        </button>
      </div>
    </div>
  );
}

// J2 — Madlib borgesiano con los humanistas elegidos por el jugador
// Los nombres A-J = los 10 aceptados en el PhD (en orden de aparición)
function generarMadlibBorges(nombresElegidos) {
  const n = nombresElegidos;
  if (!n || n.length < 10) return null;
  return "Es casi inconcebible la historia de la cultura sin la fortuita conjunción del pensamiento de " + n[0] + " y el de " + n[1] + ". Pero, con la mediación lúcida de " + n[2] + ", a quien, hoy, nadie osaría leer sin la luz que le añade " + n[3] + ", la genialidad de " + n[4] + " cumplió sus condiciones de posibilidad. ¿Qué habría sido de las postrimerías de " + n[5] + ", de las prefiguraciones de " + n[6] + " y de las contradicciones denunciadas por " + n[7] + " sin esa constelación previa (en sentido lógico, no temporal)? Dicen — y el chisme es un avatar del saber — que leyendo a " + n[8] + " en clave de " + n[9] + " pueden vislumbrarse indicios.";
}

function PhDBorgesAprobado({ onContinuar, nombresElegidos }) {
  const madlib = nombresElegidos ? generarMadlibBorges(nombresElegidos) : null;

  const s = {
    wrap: { fontFamily: "Georgia, serif", background: "#0D0D0D", color: "#F2E9D5",
            maxWidth: 420, margin: "0 auto", display: "flex", flexDirection: "column",
            border: "2px solid #D4A937" },
    imgWrap: { width: "100%", height: 160, overflow: "hidden" },
    img: { width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top",
           filter: "sepia(20%) brightness(0.7)" },
    body: { padding: "24px 28px 32px", display: "flex", flexDirection: "column", alignItems: "center" },
    etiqueta: { fontSize: 9, color: "#D4A937", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" },
    badge: { fontSize: 17, fontWeight: 700, color: "#D4A937", marginBottom: 4 },
    sub: { fontSize: 12, color: "#9A856A", marginBottom: 20, fontStyle: "italic" },
    madlib: { background: "rgba(212,169,55,0.05)", border: "1px solid rgba(212,169,55,0.2)",
              padding: "18px 22px", marginBottom: 24, lineHeight: 1.75,
              fontSize: 13, fontStyle: "italic", textAlign: "left", width: "100%", boxSizing: "border-box" },
    btn: { border: "1px solid #D4A937", background: "none", color: "#D4A937",
           fontFamily: "Georgia, serif", fontSize: 12, padding: "9px 24px",
           cursor: "pointer", letterSpacing: 1 },
  };

  return (
    <div style={s.wrap}>
      <div style={s.imgWrap}>
        <img src={IMG_BORGES} alt="Borges" style={s.img} />
      </div>
      <div style={s.body}>
        <p style={s.etiqueta}>PHD SUPERADO · INCUNABULA DESBLOQUEADO</p>
        <p style={s.badge}>✦ El Arca de la Humanidad</p>
        <p style={s.sub}>Jorge Luis Borges · veredicto</p>
        {madlib && <div style={s.madlib}>{madlib}</div>}
        <button style={s.btn} onClick={onContinuar}>Continuar →</button>
      </div>
    </div>
  );
}

// === PhD.jsx ===
// ACTUALIZADO 30/06: key prop agregado para consistencia con Disertatio.

const FASES_PHD = { INTRO: "intro", RAMA: "rama", APROBADO: "aprobado" };

function PhD({ onCompletado }) {
  const [fase, setFase] = useState(FASES_PHD.INTRO);
  const [indiceRama, setIndiceRama] = useState(0);
  const ramas = PHD.ramas;
  const ramaActual = ramas[indiceRama];

  function ramaComoBiblioteca(rama) {
    const facts = {};
    for (const p of rama.pool) facts[p._id] = p.flavor;
    return { _id: `phd_${rama._id}`, name: `PhD — ${rama.name}`,
      desc: `Nombra ${rama.pedir} de ${rama.name}.`, "total-": rama.pedir, synonyms: {}, facts };
  }

  function manejarRamaCompletada() {
    if (indiceRama + 1 < ramas.length) setIndiceRama(indiceRama + 1);
    else setFase(FASES_PHD.APROBADO);
  }

  const estiloIntro = { fontFamily:"Georgia,serif",background:"#1A0F08",color:"#F2E9D5",
    maxWidth:420,margin:"0 auto",padding:28,lineHeight:1.6,textAlign:"center",border:"2px solid #D4A937" };

  if (fase === FASES_PHD.INTRO) return (
    <PhDBorgesIntro onComenzar={() => setFase(FASES_PHD.RAMA)} />
  );

  if (fase === FASES_PHD.RAMA) return (
    <div>
      <p style={{ textAlign: "center", fontSize: 11, color: "#8A8A78", marginBottom: 8 }}>
        PhD — rama {indiceRama + 1} de {ramas.length}</p>
      <JugarBiblioteca key={ramaActual._id} biblioteca={ramaComoBiblioteca(ramaActual)}
        onCompletada={manejarRamaCompletada} />
    </div>
  );

  if (fase === FASES_PHD.APROBADO) return (
    <PhDBorgesAprobado onContinuar={() => onCompletado?.()} />
  );
  return null;
}


// === PantallaAristoteles — Bienvenida / Examen de admisión (reemplaza PantallaCharTest) ===
// A1: Aristóteles como voz sin cara. La identidad no se revela hasta A4 (tras el examen).

const TEXTO_A1 = [
  "La puerta cruje al abrirse. Adentro: ¡¿un examen!?",
  "Una voz sabia, antigua y con fuerte acento —pero ¿de dónde?— dice: «Formalidad fugaz y fácil: ¡fáctico! Reintenta las veces que quieras.»",
  "Pausa teatral. «Ahora, si fallas demasiadas veces, ni quiero imaginármelo.»",
];

const TEXTO_BA1 = ({ nombreReferente, adjetivo }) => [
  `${nombreReferente} no aparece por ningún lado — ya entró, así son los ${adjetivo}. Pero a falta de algo más, ¿una puerta? y ¿un examen?`,
  "Una voz sabia, antigua y con fuerte acento —pero ¿de dónde?— dice: «Formalidad fugaz y fácil: ¡fáctico! Reintenta las veces que quieras.»",
  `Pausa teatral. «Ahora, si fallas demasiadas veces, ni quiero imaginarme que dirá ${nombreReferente}... o yo mismo.»`,
];

function PantallaCharTest({ onContinuar, rutaEntrada }) {
  const [lineaActual, setLineaActual] = React.useState(0);
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const ref = params.get("ref");
  const adjetivo = "sabios";

  const lineas = (rutaEntrada === "brag" && ref)
    ? TEXTO_BA1({ nombreReferente: ref, adjetivo })
    : TEXTO_A1;

  const esUltima = lineaActual >= lineas.length - 1;

  React.useEffect(() => {
    function onKey(e) { if (e.key === "Enter") avanzar(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lineaActual]);

  function avanzar() {
    if (!esUltima) setLineaActual(l => l + 1);
    else onContinuar();
  }

  const s = {
    wrap: { fontFamily: "Georgia, serif", background: "#1A1208", color: "#F2E9D5",
            maxWidth: 420, margin: "0 auto", padding: 40, minHeight: "100vh",
            display: "flex", flexDirection: "column", justifyContent: "center",
            alignItems: "center", textAlign: "left", boxSizing: "border-box" },
    burbuja: { background: "rgba(242,233,213,0.08)", border: "1px solid rgba(242,233,213,0.2)",
               padding: "24px 28px", marginBottom: 32, lineHeight: 1.7,
               fontSize: 15, fontStyle: "italic", minHeight: 80,
               display: "flex", alignItems: "center", justifyContent: "center" },
    dots: { display: "flex", gap: 8, marginBottom: 28, justifyContent: "center" },
    dot: (activo) => ({ width: 6, height: 6, borderRadius: "50%",
                        background: activo ? "#D4A937" : "rgba(212,169,55,0.3)" }),
    btn: { border: "1px solid #D4A937", background: "none", color: "#D4A937",
           fontFamily: "Georgia, serif", fontSize: 13, padding: "10px 28px",
           cursor: "pointer", letterSpacing: 1 },
  };

  return (
    <div style={s.wrap}>
      <div style={s.burbuja}>{lineas[lineaActual]}</div>
      <div style={s.dots}>
        {lineas.map((_, i) => <div key={i} style={s.dot(i === lineaActual)} />)}
      </div>
      <button style={s.btn} onClick={avanzar}>
        {esUltima ? "Entrar →" : "Continuar →"}
      </button>
    </div>
  );
}

// === Aristóteles A2aa / A4 — Post-examen y presentación ===
// A2aa: primer mensaje tras pasar el examen (antes de A4 propiamente)
// A4: Aristóteles se revela con imagen

const TEXTO_A4 = [
  "Nunca lo dudé y eso está mal: la duda es el punto de partida de la ciencia, pero, ¿ya qué?",
  "Mi nombre es Aristóteles, es posible que hayas leído sobre mí. ¿Sabes leer, creo? Si llegaste hasta acá asumo que sí y que me conoces y que vas entendiendo el juego.",
  "Esto es el Vasto Vacío y tú lo irás llenando. Elige temas, ingresa a cada biblioteca y demuestra lo que sabes.",
  "Dudas: para eso está internet. O el botón de ayuda abajo.",
  "Cautela: cada que lo hundes, una wiki fascinante se pierde para siempre.",
  "Falso, pero no te hagas, ¡ya entendiste!",
];

function PantallaAristotelesA4({ onContinuar }) {
  const [linea, setLinea] = React.useState(0);
  const esUltima = linea >= TEXTO_A4.length - 1;

  React.useEffect(() => {
    function onKey(e) { if (e.key === "Enter") avanzar(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [linea]);

  function avanzar() {
    if (!esUltima) setLinea(l => l + 1);
    else onContinuar();
  }

  const s = {
    wrap: { fontFamily: "Georgia, serif", background: "#F7F3E8", color: "#2A2A24",
            maxWidth: 420, margin: "0 auto", display: "flex", flexDirection: "column",
            border: "1px solid #2A2A24" },
    imgWrap: { width: "100%", height: 220, overflow: "hidden" },
    img: { width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%",
           filter: "sepia(8%) brightness(0.95)" },
    body: { padding: "24px 28px 32px", display: "flex", flexDirection: "column", alignItems: "center" },
    etiqueta: { fontSize: 9, color: "#8A8A78", letterSpacing: 2, marginBottom: 10, textTransform: "uppercase" },
    nombre: { fontSize: 14, fontWeight: 700, color: "#2A2A24", marginBottom: 20 },
    burbuja: { background: "#FEFBE8", border: "1px solid #D4C9A8",
               padding: "18px 22px", marginBottom: 24, lineHeight: 1.75,
               fontSize: 14, fontStyle: "italic", textAlign: "left", width: "100%", boxSizing: "border-box" },
    dots: { display: "flex", gap: 8, marginBottom: 24, justifyContent: "center" },
    dot: (activo) => ({ width: 5, height: 5, borderRadius: "50%",
                        background: activo ? "#2A2A24" : "#BFBAA8" }),
    btn: { border: "1px solid #2A2A24", background: "none", color: "#2A2A24",
           fontFamily: "Georgia, serif", fontSize: 12, padding: "9px 24px",
           cursor: "pointer", letterSpacing: 1 },
  };

  return (
    <div style={s.wrap}>
      <div style={s.imgWrap}>
        <img src={IMG_ARISTOTELES} alt="Aristóteles" style={s.img} />
      </div>
      <div style={s.body}>
        <p style={s.etiqueta}>BIENVENIDO · EL VASTO VACÍO</p>
        <p style={s.nombre}>Aristóteles</p>
        <div style={s.burbuja}>{TEXTO_A4[linea]}</div>
        <div style={s.dots}>
          {TEXTO_A4.map((_, i) => <div key={i} style={s.dot(i === linea)} />)}
        </div>
        <button style={s.btn} onClick={avanzar}>
          {esUltima ? "Entrar al Vasto Vacío →" : "Continuar →"}
        </button>
      </div>
    </div>
  );
}

// === App ===
// ACTUALIZADO 30/06: localStorage, tipoComplecion oro/verde, triggers correctos, capacidad para barra IC.

const STORAGE_KEY = "aris_progreso_v3";

function estadoInicialProgreso(catalogo) {
  return catalogo.map((b) => ({ ...b, completados: 0, tipoComplecion: null }));
}

function cargarProgreso(catalogo) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const guardado = JSON.parse(raw);
    const mapa = guardado.bibliotecas ?? {};
    // Siempre partir del catálogo actual como fuente de verdad.
    // Bibs nuevas aparecen con completados:0; bibs eliminadas se ignoran.
    const progreso = catalogo.map((b) => ({
      ...b,
      completados: mapa[b._id]?.completados ?? 0,
      tipoComplecion: mapa[b._id]?.tipoComplecion ?? null
    }));
    return { progreso, disertatioCompletada: guardado.disertatioCompletada ?? false,
             phdCompletado: guardado.phdCompletado ?? false };
  } catch { return null; }
}

function guardarProgreso(progreso, disertatioCompletada, phdCompletado) {
  try {
    const bibliotecas = {};
    for (const b of progreso) bibliotecas[b._id] = { completados: b.completados, tipoComplecion: b.tipoComplecion };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ bibliotecas, disertatioCompletada, phdCompletado }));
  } catch {}
}

// === Sistema de Feedback ===

const VOCATIVOS = {
  geografia:      { beginner: "Pseudoeratóstenes",            normal: "Distorsionado Mercator",                    hard: "Fulgurante Sputnik" },
  humanidades:    { beginner: "Tratadista extraviado",         normal: "Enciclopedista truncado",                   hard: "Guardián de la wunderkammer de lo incompleto" },
  ciencias_duras: { beginner: "Lumbrera intermitente",         normal: "Polímata amnésico",                         hard: "Oh, singularidad impar en sus olvidos" },
  artes:          { beginner: "Artista de lo inconcluso",      normal: "Vasari que se quedó sin tinta",             hard: "Hiperesteta de alta latencia" },
  deportes:       { beginner: "Laureado condenado al olvido",  normal: "Pierre de Coubertin, que ya ni sabe quién es", hard: "Árbitro de lo arbitrario" },
};

const IMPERATIVOS = {
  geografia:      "¡Ubíquese!",
  humanidades:    "¡Fundaméntese!",
  ciencias_duras: "¡Exijo replicación!",
  artes:          "¡Inspírese!",
  deportes:       "¡Suba de liga!",
};

function obtenerVocativo(field, level) {
  const campo = VOCATIVOS[field] ?? VOCATIVOS["humanidades"];
  return campo[level] ?? campo["beginner"];
}

function FeedbackModal({ biblioteca, onCerrar }) {
  const [camino, setCamino] = React.useState(null); // null | "falta" | "sobra" | "falla" | "saludos"
  const [textoLibre, setTextoLibre] = React.useState("");
  const [elementoSobra, setElementoSobra] = React.useState("");
  const [correo, setCorreo] = React.useState("");
  const [enviado, setEnviado] = React.useState(false);

  const field   = biblioteca?._field    ?? "humanidades";
  const level   = biblioteca?._level    ?? "beginner";
  const bibName = biblioteca?.name      ?? "esta biblioteca";
  const vocativo   = obtenerVocativo(field, level);
  const imperativo = IMPERATIVOS[field] ?? "¡Fundaméntese!";

  // Elementos que el jugador ya acertó (para dropdown de "sobra")
  const elementosAcertados = biblioteca
    ? Object.keys(biblioteca.facts ?? {}).filter(k => biblioteca._acertados?.includes(k))
    : [];

  const construirMensaje = () => {
    if (camino === "falta")
      return `${vocativo}, ¿Cómo es que falta algo tan obvio? "${textoLibre}" debería estar en ${bibName}. ${imperativo}`;
    if (camino === "sobra")
      return `${vocativo}, ¿Cómo es que sobra algo tan obvio? "${elementoSobra}" NO debería estar en ${bibName}. ${imperativo}`;
    if (camino === "falla")
      return `El mecanismo de Antikythera / la pascalina / las tarjetas perforadas funcionaba(n) mejor. ${textoLibre} Programen revisión y codéense con lo mejor.`;
    if (camino === "saludos")
      return `Al adalid del saber en el empíreo de la omnisapiencia, holi. ${textoLibre}`;
    return "";
  };

  const puedeEnviar = () => {
    if (camino === "falta")    return textoLibre.trim().length > 0;
    if (camino === "sobra")    return elementoSobra.length > 0;
    if (camino === "falla")    return textoLibre.trim().length > 0;
    if (camino === "saludos")  return textoLibre.trim().length > 0;
    return false;
  };

  const enviar = async () => {
    const mensaje = construirMensaje();
    try {
      await fetch("https://formspree.io/f/xrenarlo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          camino,
          biblioteca: bibName,
          field,
          level,
          mensaje,
          correo: correo || "(no proporcionado)",
        }),
      });
    } catch (_) { /* si falla el envío, igual mostramos confirmación */ }
    setEnviado(true);
  };

  const s = {
    overlay: { position:"fixed", inset:0, background:"rgba(42,42,36,0.7)", zIndex:100,
               display:"flex", alignItems:"center", justifyContent:"center", padding:16 },
    caja:    { background:"#F7F3E8", border:"1px solid #2A2A24", fontFamily:"Georgia, serif",
               maxWidth:400, width:"100%", padding:24, position:"relative" },
    titulo:  { fontSize:11, letterSpacing:1.5, textTransform:"uppercase",
               borderBottom:"1px solid #2A2A24", paddingBottom:8, marginBottom:16 },
    btn:     { border:"1px solid #2A2A24", background:"none", fontFamily:"Georgia, serif",
               padding:"8px 14px", cursor:"pointer", fontSize:13, margin:"4px 0", width:"100%",
               textAlign:"left" },
    btnActivo: { border:"1px solid #2A2A24", background:"#2A2A24", color:"#F7F3E8",
                 fontFamily:"Georgia, serif", padding:"8px 14px", cursor:"pointer",
                 fontSize:13, margin:"4px 0", width:"100%", textAlign:"left" },
    input:   { width:"100%", border:"1px solid #8A8A78", background:"#F7F3E8",
               fontFamily:"Georgia, serif", fontSize:13, padding:8, marginTop:8, boxSizing:"border-box" },
    select:  { width:"100%", border:"1px solid #8A8A78", background:"#F7F3E8",
               fontFamily:"Georgia, serif", fontSize:13, padding:8, marginTop:8 },
    enviar:  { marginTop:16, border:"1px solid #2A2A24", background:"#2A2A24", color:"#F7F3E8",
               fontFamily:"Georgia, serif", padding:"10px 20px", cursor:"pointer", fontSize:13 },
    cerrar:  { position:"absolute", top:12, right:14, background:"none", border:"none",
               cursor:"pointer", fontSize:18, color:"#8A8A78" },
  };

  if (enviado) return (
    <div style={s.overlay}>
      <div style={s.caja}>
        <button style={s.cerrar} onClick={onCerrar}>×</button>
        <p style={s.titulo}>Mensaje recibido</p>
        <p style={{ fontSize:13, lineHeight:1.6 }}>
          Tu reporte ha llegado a la sede de la omnisapiencia. Lo leeremos con la misma seriedad con que leemos todo: mucha.
        </p>
        <button style={s.enviar} onClick={onCerrar}>Cerrar</button>
      </div>
    </div>
  );

  return (
    <div style={s.overlay}>
      <div style={s.caja}>
        <button style={s.cerrar} onClick={onCerrar}>×</button>
        <p style={s.titulo}>¿Falta? ¿Sobra? ¿Falla? ¿Saludos?</p>

        {!camino && (
          <div>
            {[
              ["falta",   "¿Cómo es que falta algo tan obvio?"],
              ["sobra",   "¿Cómo es que sobra algo tan obvio?"],
              ["falla",   "Todo sistema falla, pero ¿hasta este?"],
              ["saludos", "Al adalid del saber en el empíreo de la omnisapiencia…"],
            ].map(([k, label]) => (
              <button key={k} style={s.btn} onClick={() => setCamino(k)}>{label}</button>
            ))}
          </div>
        )}

        {camino && (
          <div>
            <button style={{ ...s.btn, fontSize:11, color:"#8A8A78", width:"auto" }}
              onClick={() => { setCamino(null); setTextoLibre(""); setElementoSobra(""); }}>
              ← Volver
            </button>

            {camino === "falta" && (
              <div style={{ marginTop:12 }}>
                <p style={{ fontSize:13, lineHeight:1.6, fontStyle:"italic" }}>
                  {vocativo}, ¿Cómo es que falta algo tan obvio?
                </p>
                <input style={s.input} placeholder="¿Qué debería estar aquí?"
                  value={textoLibre} onChange={e => setTextoLibre(e.target.value)} />
                <p style={{ fontSize:12, color:"#8A8A78", marginTop:4 }}>
                  debería estar en <strong>{bibName}</strong>. {imperativo}
                </p>
              </div>
            )}

            {camino === "sobra" && (
              <div style={{ marginTop:12 }}>
                <p style={{ fontSize:13, lineHeight:1.6, fontStyle:"italic" }}>
                  {vocativo}, ¿Cómo es que sobra algo tan obvio?
                </p>
                {elementosAcertados.length > 0
                  ? <select style={s.select} value={elementoSobra}
                      onChange={e => setElementoSobra(e.target.value)}>
                      <option value="">— elegí un elemento —</option>
                      {elementosAcertados.map(k => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </select>
                  : <p style={{ fontSize:12, color:"#8A8A78", marginTop:8 }}>
                      Completá al menos un elemento de esta biblioteca para poder reportar que sobra.
                    </p>
                }
                {elementoSobra && (
                  <p style={{ fontSize:12, color:"#8A8A78", marginTop:4 }}>
                    NO debería estar en <strong>{bibName}</strong>. {imperativo}
                  </p>
                )}
              </div>
            )}

            {camino === "falla" && (
              <div style={{ marginTop:12 }}>
                <p style={{ fontSize:13, lineHeight:1.6, fontStyle:"italic" }}>
                  El mecanismo de Antikythera / la pascalina / las tarjetas perforadas funcionaba(n) mejor.
                </p>
                <textarea style={{ ...s.input, height:80, resize:"vertical" }}
                  placeholder="Describan el desastre técnico aquí..."
                  value={textoLibre} onChange={e => setTextoLibre(e.target.value)} />
                <p style={{ fontSize:12, color:"#8A8A78", marginTop:4 }}>
                  Programen revisión y codéense con lo mejor.
                </p>
              </div>
            )}

            {camino === "saludos" && (
              <div style={{ marginTop:12 }}>
                <p style={{ fontSize:13, lineHeight:1.6, fontStyle:"italic" }}>
                  Al adalid del saber en el empíreo de la omnisapiencia, holi.
                </p>
                <textarea style={{ ...s.input, height:80, resize:"vertical" }}
                  placeholder="Tu mensaje aquí..."
                  value={textoLibre} onChange={e => setTextoLibre(e.target.value)} />
              </div>
            )}

            <input style={{ ...s.input, marginTop:16 }}
              placeholder="Tu correo (opcional, para que podamos responder)"
              value={correo} onChange={e => setCorreo(e.target.value)} />

            {puedeEnviar() && (
              <button style={s.enviar} onClick={enviar}>Enviar</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// === Fórmula Atalanta ===
function calcularTiempoLimite(biblioteca) {
  const elementos = Object.keys(biblioteca.facts ?? {});
  const n = elementos.length;
  const avgLen = elementos.reduce((s, k) => s + k.length, 0) / (n || 1);
  const lejania = biblioteca["lejania-"] ?? 2;
  return Math.round(n * avgLen * lejania);
}

function fmtTiempo(s) {
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// === SelectorModos ===
function SelectorModos({ onIniciar }) {
  const [timer, setTimer] = useState("tortuga");
  const [scope, setScope] = useState("local");

  const s = {
    wrap: { fontFamily: "Georgia, serif", background: "#F7F3E8", color: "#2A2A24",
            maxWidth: 420, margin: "0 auto", padding: 24, border: "1px solid #2A2A24" },
    label: { fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase",
             color: "#8A8A78", margin: "16px 0 8px", display: "block" },
    row: { display: "flex", gap: 8, marginBottom: 8 },
    btn: (active) => ({
      flex: 1, padding: "10px 8px", border: "1px solid #2A2A24", cursor: "pointer",
      fontFamily: "Georgia, serif", fontSize: 12, textAlign: "center",
      background: active ? "#2A2A24" : "transparent", color: active ? "#F7F3E8" : "#2A2A24"
    }),
    start: { width: "100%", marginTop: 20, padding: "12px 0", border: "1px solid #2A2A24",
             background: "#2A2A24", color: "#F7F3E8", fontFamily: "Georgia, serif",
             fontSize: 14, cursor: "pointer" }
  };

  const modos = [
    { id: "tortuga",  label: "Tortuga",  sub: "Sin cronómetro",         icono: <img src={IMG_TORTUGA} alt="Tortuga" style={{width:32,height:32,objectFit:"contain",verticalAlign:"middle",marginRight:6,filter:"sepia(20%) brightness(0.9)"}} /> },
    { id: "aquiles",  label: "Aquiles",  sub: "Con cronómetro",          icono: "⚡" },
    { id: "atalanta", label: "Atalanta", sub: "Tiempo límite por bib",   icono: "🏹" },
  ];

  const scopes = [
    { id: "local",    label: "Local Games", sub: "Una biblioteca a la vez",        icono: "🎯" },
    { id: "olimpiada",label: "Olimpiada",   sub: "Todas las Paperbacks seguidas",  icono: "🏛️" },
  ];

  return (
    <div style={s.wrap}>
      <p style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase",
                  borderBottom: "1px solid #2A2A24", paddingBottom: 8, marginBottom: 4 }}>
        SELECCIONAR MODO
      </p>
      <span style={s.label}>Tiempo</span>
      <div style={s.row}>
        {modos.map(m => (
          <button key={m.id} style={s.btn(timer === m.id)} onClick={() => setTimer(m.id)}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
              {m.icono && typeof m.icono === "string" ? <span style={{marginRight:4}}>{m.icono}</span> : m.icono}
              {m.label}
            </div>
            <div style={{ fontSize: 10, color: timer === m.id ? "#BFBAA8" : "#8A8A78", marginTop: 2 }}>{m.sub}</div>
          </button>
        ))}
      </div>
      <span style={s.label}>Alcance</span>
      <div style={s.row}>
        {scopes.map(sc => (
          <button key={sc.id} style={s.btn(scope === sc.id)} onClick={() => setScope(sc.id)}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
              {sc.icono && <span style={{marginRight:4}}>{sc.icono}</span>}
              {sc.label}
            </div>
            <div style={{ fontSize: 10, color: scope === sc.id ? "#BFBAA8" : "#8A8A78", marginTop: 2 }}>{sc.sub}</div>
          </button>
        ))}
      </div>
      <button style={s.start} onClick={() => onIniciar({ timer, scope })}>
        Comenzar →
      </button>
    </div>
  );
}

// === Sistema de Santa Teresa — Intercesiones ===

const TERESA_INTERC = [
  { id: "principia", nombre: "Principia principiorum", costo: 1, efecto: "Revela la letra inicial de un elemento.", icono: "α" },
  { id: "ultima",    nombre: "Ultima omnium",          costo: 1, efecto: "Revela la letra final de un elemento.",   icono: "ω" },
  { id: "vocalitas", nombre: "Vocalitas",              costo: 3, efecto: "Revela las vocales de un elemento.",      icono: "∀" },
  { id: "consonantia",nombre:"Consonantia",            costo: 4, efecto: "Revela las consonantes de un elemento.", icono: "∁" },
  { id: "fiat_lux",  nombre: "Fiat lux",               costo: 5, efecto: "Revela el elemento completo.",           icono: "✦" },
  { id: "consulta",  nombre: "Consulta amicorum",      costo: 0, efecto: "Comparte esta biblioteca. Pide ayuda.", icono: "✉" },
];

const TERESA_MAX = 5;
const TERESA_BIBS_DESBLOQUEO = 7;

function cargarTeresa() {
  try {
    const raw = localStorage.getItem("aris_teresa_v1");
    if (!raw) return { disponibles: TERESA_MAX, usadas: [] };
    return JSON.parse(raw);
  } catch { return { disponibles: TERESA_MAX, usadas: [] }; }
}

function guardarTeresa(estado) {
  localStorage.setItem("aris_teresa_v1", JSON.stringify(estado));
}

function calcularDisponibles(usadas) {
  const ahora = Date.now();
  const vigentes = usadas.filter(u => ahora - u.ts < 24 * 60 * 60 * 1000);
  return Math.max(0, TERESA_MAX - vigentes.length);
}

// SVG de Santa Teresa (tocado minimalista con destello)
function TeresaSVG({ size = 28 }) {
  const s = size;
  const cx = s / 2, cy = s / 2;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ display: "block" }}>
      <path d={`M${cx},${s*0.08} Q${s*0.1},${s*0.38} ${s*0.08},${s*0.72} Q${cx},${s*0.8} ${s*0.92},${s*0.72} Q${s*0.9},${s*0.38} ${cx},${s*0.08}Z`} fill="#2A2A24"/>
      <path d={`M${s*0.1},${s*0.72} Q${s*0.13},${s*0.58} ${cx},${s*0.54} Q${s*0.87},${s*0.58} ${s*0.9},${s*0.72} Q${cx},${s*0.77} ${s*0.1},${s*0.72}Z`} fill="#F5F2EA"/>
      <ellipse cx={cx} cy={s*0.86} rx={s*0.22} ry={s*0.14} fill="#EEE0CC"/>
      <circle cx={cx} cy={s*0.1} r={s*0.07} fill="#C4A020" opacity="0.9"/>
      <line x1={cx} y1={s*0.02} x2={cx} y2={s*0.06} stroke="#C4A020" strokeWidth={s*0.04}/>
    </svg>
  );
}

function TeresaModal({ biblioteca, onCerrar, onIntercesion }) {
  const [estado, setEstado] = React.useState(cargarTeresa);
  const disponibles = calcularDisponibles(estado.usadas ?? []);

  function gastar(interc) {
    if (interc.costo > disponibles && interc.costo > 0) return;
    const nuevasUsadas = [...(estado.usadas ?? [])];
    for (let i = 0; i < interc.costo; i++) nuevasUsadas.push({ ts: Date.now() });
    const nuevo = { ...estado, usadas: nuevasUsadas };
    guardarTeresa(nuevo);
    setEstado(nuevo);
    if (interc.id === "consulta") {
      const bibName = biblioteca?.name ?? "una biblioteca";
      const faltantes = biblioteca ? Object.keys(biblioteca.facts ?? {}).length - (biblioteca._acertados?.length ?? 0) : "?";
      const msg = encodeURIComponent(`Perdido en "${bibName}" en Aris. Me faltan ${faltantes} elementos. ¿Me ayudás? Demostralo vos también: themiloramirez.github.io/aris`);
      window.open(`https://wa.me/?text=${msg}`, "_blank");
    } else {
      onIntercesion?.(interc);
      // Dispatch custom event for JugarBiblioteca to intercept
      window.dispatchEvent(new CustomEvent("aris:intercesion", { detail: { interc } }));
    }
    onCerrar();
  }

  const s = {
    overlay:  { position:"fixed", inset:0, background:"rgba(42,42,36,0.75)", zIndex:200,
                display:"flex", alignItems:"center", justifyContent:"center", padding:16 },
    caja:     { background:"#F7F3E8", border:"1px solid #2A2A24", fontFamily:"Georgia, serif",
                maxWidth:380, width:"100%", padding:24, position:"relative" },
    titulo:   { fontSize:11, letterSpacing:1.8, textTransform:"uppercase", color:"#8A8A78",
                borderBottom:"1px solid #BFBAA8", paddingBottom:8, marginBottom:4 },
    nombre:   { fontSize:16, fontWeight:700, color:"#2A2A24", margin:"0 0 2px" },
    cita:     { fontSize:12, fontStyle:"italic", color:"#8A8A78", margin:"0 0 16px" },
    interc:   { borderBottom:"0.5px solid #BFBAA8", padding:"10px 0", display:"flex",
                alignItems:"center", gap:12, cursor:"pointer" },
    icono:    { fontSize:18, color:"#7A5C00", minWidth:24, textAlign:"center" },
    btnNombre:{ fontSize:13, fontWeight:700, color:"#2A2A24", margin:0 },
    btnDesc:  { fontSize:11, color:"#8A8A78", margin:0 },
    costo:    { marginLeft:"auto", fontSize:11, color:"#7A5C00", fontWeight:700, whiteSpace:"nowrap" },
    cerrar:   { position:"absolute", top:12, right:14, background:"none", border:"none",
                cursor:"pointer", fontSize:18, color:"#8A8A78", fontFamily:"Georgia, serif" },
    pool:     { fontSize:11, color:"#8A8A78", textAlign:"center", margin:"12px 0 0" },
  };

  return (
    <div style={s.overlay}>
      <div style={s.caja}>
        <button style={s.cerrar} onClick={onCerrar}>×</button>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
          <TeresaSVG size={32}/>
          <p style={s.titulo}>Intercesiones de Santa Teresa</p>
        </div>
        <p style={s.nombre}>Santa Teresa de Ávila</p>
        <p style={s.cita}>"Muero porque no muero." — Estoy en las bibliotecas. ¿Qué necesitás?</p>

        {TERESA_INTERC.map(interc => {
          const puedo = interc.costo === 0 || disponibles >= interc.costo;
          return (
            <div key={interc.id}
              style={{ ...s.interc, opacity: puedo ? 1 : 0.4, cursor: puedo ? "pointer" : "default" }}
              onClick={() => puedo && gastar(interc)}>
              <span style={s.icono}>{interc.icono}</span>
              <div style={{ flex:1 }}>
                <p style={s.btnNombre}>{interc.nombre}</p>
                <p style={s.btnDesc}>{interc.efecto}</p>
              </div>
              <span style={s.costo}>
                {interc.costo === 0 ? "gratis" : `${interc.costo} ✦`}
              </span>
            </div>
          );
        })}

        <p style={s.pool}>
          {disponibles} de {TERESA_MAX} intercesiones disponibles
          {disponibles < TERESA_MAX && " · se renuevan 24h tras su uso"}
        </p>
      </div>
    </div>
  );
}

// Pantalla JRPG de presentación de Santa Teresa
function TeresaPresentacion({ onAceptar }) {
  const s = {
    wrap:   { fontFamily:"Georgia, serif", background:"#F7F3E8", color:"#2A2A24",
              maxWidth:420, margin:"0 auto", padding:32, border:"1px solid #2A2A24",
              textAlign:"center" },
    titulo: { fontSize:11, letterSpacing:2, textTransform:"uppercase", color:"#8A8A78",
              marginBottom:20 },
    burbuja:{ background:"#2A2A24", color:"#F7F3E8", padding:"16px 20px", marginTop:20,
              fontSize:13, lineHeight:1.7, textAlign:"left", position:"relative" },
    triangle:{ width:0, height:0, borderLeft:"10px solid transparent",
               borderRight:"10px solid transparent", borderTop:"10px solid #2A2A24",
               margin:"0 auto" },
    btn:    { marginTop:24, border:"1px solid #2A2A24", background:"none",
              fontFamily:"Georgia, serif", fontSize:12, padding:"10px 24px", cursor:"pointer",
              letterSpacing:0.5 },
  };

  return (
    <div style={s.wrap}>
      <div style={{ width: "100%", height: 180, overflow: "hidden", marginBottom: 0 }}>
        <img src={IMG_TERESA} alt="Santa Teresa" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%" }} />
      </div>
      <p style={s.titulo}>Un nuevo personaje ha aparecido</p>
      <TeresaSVG size={72}/>
      <div style={s.burbuja}>
        <p style={{ margin:"0 0 10px", fontWeight:700 }}>Santa Teresa de Ávila</p>
        <p style={{ margin:"0 0 10px" }}>
          Has completado tus primeras siete bibliotecas. Veo que tenés sed de saber — y que a veces el saber se resiste.
        </p>
        <p style={{ margin:"0 0 10px" }}>
          Yo intercedo. Tenés cinco intercesiones cada día, una por una se renuevan a las veinticuatro horas de su uso.
        </p>
        <p style={{ margin:0, fontStyle:"italic", color:"#BFBAA8" }}>
          No las gastes en lo obvio. Mis moradas son costosas.
        </p>
      </div>
      <div style={s.triangle}/>
      <button style={s.btn} onClick={onAceptar}>Entendido — gracias, Teresa</button>
    </div>
  );
}

const PANTALLAS = {
  CHAR_TEST:"char_test",
  ARISTOTELES_A4:"aristoteles_a4",  // Presentación de Aristóteles tras el examen
  EXAMEN:"examen", EXAMEN_BIBLIOTECAS:"examen_bibliotecas",
  MODOS:"modos",
  VASTO_VACIO:"vasto_vacio",
  JUGANDO_BIBLIOTECA:"jugando_biblioteca", BIBLIOTECA_COMPLETADA:"biblioteca_completada",
  OLIMPIADA:"olimpiada",
  TERESA_PRESENTACION:"teresa_presentacion",
  DISERTATIO:"disertatio", PHD:"phd"
};

// Fórmula de ordenamiento: total × dificultad × lejania (ascendente = más fácil primero)
function scoreOrden(b) {
  const t = b["total-"] ?? 50;
  const d = b["dificultad-"] ?? 3;
  const l = b["lejania-"] ?? 3;
  return t * d * l;
}

const BIBLIOTECAS_CATALOGO = [
  ...PAPERBACK_ES, ...HARDCOVER_ES,
  CORRIENTES_FILOSOFICAS_ES, EXPRESIONES_LATINAS_ES, EXPRESIONES_FRANCESAS_ES, VANISHED_STATES_ES, HABIA_UNA_VEZ_ES
].sort((a, b) => {
  // Primero por nivel (beginner → normal → hard), luego por score dentro del nivel
  const niveles = { beginner: 0, normal: 1, hard: 2 };
  const na = niveles[a._level] ?? 1, nb = niveles[b._level] ?? 1;
  if (na !== nb) return na - nb;
  return scoreOrden(a) - scoreOrden(b);
});

function ArisStamp() {
  const [tiempo, setTiempo] = React.useState('');
  React.useEffect(() => {
    function pad(n) { return String(n).padStart(2, '0'); }
    function tick() {
      const d = new Date();
      setTiempo('ARIS v0.34 · 25/07/2026 · ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{
      position: 'fixed', bottom: 6, right: 10,
      fontSize: 9, color: '#8A8A78',
      fontFamily: 'monospace', letterSpacing: '0.5px',
      pointerEvents: 'none', zIndex: 9999
    }}>{tiempo}</div>
  );
}


function App() {
  const guardado = cargarProgreso(BIBLIOTECAS_CATALOGO);

  const [pantalla, setPantalla] = useState(PANTALLAS.CHAR_TEST);  // ⚠️ era: guardado ? PANTALLAS.VASTO_VACIO : PANTALLAS.EXAMEN
  const [examenBibliotecas, setExamenBibliotecas] = useState([]);
  const [indiceExamenActual, setIndiceExamenActual] = useState(0);
  const [bibliotecaJugando, setBibliotecaJugando] = useState(null);
  const [tipoComplecionActual, setTipoComplecionActual] = useState(null);
  const [progresoBibliotecas, setProgresoBibliotecas] = useState(
    guardado?.progreso ?? estadoInicialProgreso(BIBLIOTECAS_CATALOGO)
  );
  const [configAbierta, setConfigAbierta] = useState(false);
  const [ayudaAbierta, setAyudaAbierta] = useState(false);
  const [modoNoche, setModoNoche] = useState(false);
  const [modoEckhart, setModoEckhart] = useState(false);
  const [feedbackAbierto, setFeedbackAbierto] = useState(false);
  const [teresaAbierta, setTeresaAbierta] = useState(false);
  const [teresaPresentada, setTeresaPresentada] = useState(
    () => localStorage.getItem("aris_teresa_presentada") === "1"
  );
  const [modoActivo, setModoActivo] = useState({ timer: "tortuga", scope: "local" });
  const [olimpiadaQueue, setOlimpiadaQueue] = useState([]);
  const [olimpiadaIndex, setOlimpiadaIndex] = useState(0);
  const [olimpiadaTiempos, setOlimpiadaTiempos] = useState([]);
  const [disertatioCompletada, setDisertatioCompletada] = useState(guardado?.disertatioCompletada ?? false);
  const [phdCompletado, setPhdCompletado] = useState(guardado?.phdCompletado ?? false);

  // Guardar en localStorage en cada cambio de estado relevante
  useEffect(() => {
    guardarProgreso(progresoBibliotecas, disertatioCompletada, phdCompletado);
  }, [progresoBibliotecas, disertatioCompletada, phdCompletado]);

  function todasPBCompletas() {
    return progresoBibliotecas.filter(b => b._level === "beginner").every(b => b.tipoComplecion !== null);
  }
  function todasHCCompletas() {
    return progresoBibliotecas.filter(b => b._level === "normal").every(b => b.tipoComplecion !== null);
  }

  function manejarAceptadoExamen({ modoEckhart: esEckhart }) {
    if (esEckhart) { setModoEckhart(true); setPantalla(PANTALLAS.VASTO_VACIO); return; }
    const examen = armarExamenAdmision();
    setExamenBibliotecas(examen); setIndiceExamenActual(0);
    setPantalla(PANTALLAS.EXAMEN_BIBLIOTECAS);
  }

  function mostrarA4() {
    setPantalla(PANTALLAS.ARISTOTELES_A4);
  }

  function manejarBibliotecaExamenCompletada() {
    if (indiceExamenActual + 1 < examenBibliotecas.length) setIndiceExamenActual(indiceExamenActual + 1);
    else mostrarA4();  // Aristóteles se presenta antes de entrar al VV
  }

  function manejarBibliotecaCompletada(biblioteca, tipoComplecion) {
    setProgresoBibliotecas(prev => prev.map(b => {
      if (b._id !== biblioteca._id) return b;
      // El tipoComplecion nunca se degrada: oro > verde > null
      const mejorLogro = b.tipoComplecion === "oro" ? "oro" : tipoComplecion;
      const nuevosCompletados = tipoComplecion === "oro" ? b["total-"] : (b["metmin-"] ?? b.completados);
      return { ...b, completados: nuevosCompletados, tipoComplecion: mejorLogro };
    }));
    setBibliotecaJugando(biblioteca);
    setTipoComplecionActual(tipoComplecion);
    setPantalla(PANTALLAS.BIBLIOTECA_COMPLETADA);
  }

  function resetear() {
    localStorage.removeItem(STORAGE_KEY);
    setProgresoBibliotecas(estadoInicialProgreso(BIBLIOTECAS_CATALOGO));
    setDisertatioCompletada(false); setPhdCompletado(false);
    setPantalla(PANTALLAS.EXAMEN);
  }

  const esExamen = pantalla === PANTALLAS.EXAMEN || pantalla === PANTALLAS.EXAMEN_BIBLIOTECAS;
  const pbsCompletadas = progresoBibliotecas.filter(b => b._level === "beginner" && b.tipoComplecion).length;
  const teresaDesbloqueada = pbsCompletadas >= TERESA_BIBS_DESBLOQUEO;

  React.useEffect(() => {
    if (teresaDesbloqueada && !teresaPresentada && pantalla === PANTALLAS.VASTO_VACIO) {
      localStorage.setItem("aris_teresa_presentada", "1");
      setTeresaPresentada(true);
      setPantalla(PANTALLAS.TERESA_PRESENTACION);
    }
  }, [pbsCompletadas, pantalla]);

  const sBtnPanel = {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", gap: 2,
    background: "transparent", border: "none", cursor: "pointer",
    color: "#E8D49A", padding: "8px 2px 10px", minHeight: 52,
  };
  const sIconPanel = { fontSize: 16, lineHeight: 1 };
  const sLblPanel  = { fontSize: 9, letterSpacing: 0.8, textTransform: "uppercase",
                        fontFamily: "Cinzel, Georgia, serif" };

  const panelBotones = !esExamen ? (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      zIndex: 200,
      display: "flex", justifyContent: "space-around", alignItems: "stretch",
      background: "rgba(30,26,16,0.96)",
      borderTop: "1px solid #C8A84B",
      backdropFilter: "blur(4px)",
      fontFamily: "EB Garamond, Georgia, serif",
      maxWidth: 420, margin: "0 auto",
    }}>
      {/* Config */}
      <button onClick={() => setConfigAbierta(true)}
        title="Configuración: idioma, sonido"
        style={sBtnPanel}>
        <span style={sIconPanel}>⚙</span>
        <span style={sLblPanel}>Config</span>
      </button>
      {/* Ayuda */}
      <button onClick={() => setAyudaAbierta(true)}
        title="Cómo funciona Aris"
        style={sBtnPanel}>
        <span style={sIconPanel}>?</span>
        <span style={sLblPanel}>Ayuda</span>
      </button>
      {/* VVV */}
      <button onClick={() => {
          setBibliotecaJugando(null);
          setPantalla(PANTALLAS.VASTO_VACIO);
        }}
        title="Volver al Vasto Vacío"
        style={sBtnPanel}>
        <span style={sIconPanel}>⬡</span>
        <span style={sLblPanel}>VVV</span>
      </button>
      {/* Teresa */}
      <button
        onClick={() => teresaDesbloqueada && setTeresaAbierta(true)}
        title={teresaDesbloqueada ? "Intercesiones de Santa Teresa" : "Se desbloquea al completar 7 Paperbacks"}
        style={{ ...sBtnPanel, opacity: teresaDesbloqueada ? 1 : 0.38, cursor: teresaDesbloqueada ? "pointer" : "default" }}>
        <TeresaSVG size={18} />
        <span style={sLblPanel}>Teresa</span>
      </button>
      {/* Modos */}
      <button onClick={() => setPantalla(PANTALLAS.MODOS)}
        title="Modos de juego"
        style={sBtnPanel}>
        <span style={sIconPanel}>▷</span>
        <span style={sLblPanel}>Modos</span>
      </button>
      {/* Día / Noche */}
      <button onClick={() => setModoNoche(m => !m)}
        title={modoNoche ? "Modo día" : "Modo noche"}
        style={sBtnPanel}>
        <span style={sIconPanel}>{modoNoche ? "☀" : "☾"}</span>
        <span style={sLblPanel}>{modoNoche ? "Día" : "Noche"}</span>
      </button>
    </div>
  ) : null;

  const modalesFlotantes = (
    <>
      {feedbackAbierto && <FeedbackModal biblioteca={bibliotecaJugando} onCerrar={() => setFeedbackAbierto(false)} />}
      {configAbierta && (
        <div style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(30,26,16,0.85)",
                      display:"flex", alignItems:"center", justifyContent:"center" }}
             onClick={() => setConfigAbierta(false)}>
          <div style={{ background:"#F7F3E8", border:"1px solid #2A2A24", padding:24, maxWidth:320, width:"90%",
                        fontFamily:"Georgia, serif" }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize:16, fontWeight:400, marginBottom:16, borderBottom:"1px solid #2A2A24", paddingBottom:8 }}>
              Configuración
            </h2>
            <p style={{ fontSize:13, color:"#5a5040", marginBottom:8 }}>Idioma: <strong>Español</strong> (inglés próximamente)</p>
            <p style={{ fontSize:13, color:"#5a5040", marginBottom:16 }}>Sonido: próximamente</p>
            <button onClick={() => setConfigAbierta(false)}
              style={{ background:"#2A2A24", color:"#F7F3E8", border:"none", padding:"6px 16px",
                       fontFamily:"Georgia, serif", fontSize:12, cursor:"pointer" }}>
              Cerrar
            </button>
          </div>
        </div>
      )}
      {ayudaAbierta && (
        <div style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(30,26,16,0.85)",
                      display:"flex", alignItems:"center", justifyContent:"center" }}
             onClick={() => setAyudaAbierta(false)}>
          <div style={{ background:"#F7F3E8", border:"1px solid #2A2A24", padding:24, maxWidth:340, width:"90%",
                        fontFamily:"Georgia, serif", maxHeight:"80vh", overflowY:"auto" }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize:16, fontWeight:400, marginBottom:12, borderBottom:"1px solid #2A2A24", paddingBottom:8 }}>
              Cómo funciona Aris
            </h2>
            <p style={{ fontSize:13, lineHeight:1.6, color:"#2A2A24", marginBottom:10 }}>
              <strong>El Vasto Vacío</strong> es tu mapa. Contiene todas las bibliotecas disponibles, organizadas por nivel: Paperback, Hardcover e Incunabula.
            </p>
            <p style={{ fontSize:13, lineHeight:1.6, color:"#2A2A24", marginBottom:10 }}>
              Entra en una biblioteca e ingresa los elementos que recuerdes. Completarla en el mínimo de intentos la marca en <span style={{color:"#8a6f2a"}}>dorado</span>.
            </p>
            <p style={{ fontSize:13, lineHeight:1.6, color:"#2A2A24", marginBottom:16 }}>
              <strong>Teresa</strong> te ofrece pistas. Se desbloquea al completar 7 Paperbacks. Tenés 5 intercesiones diarias.
            </p>
            <button onClick={() => setAyudaAbierta(false)}
              style={{ background:"#2A2A24", color:"#F7F3E8", border:"none", padding:"6px 16px",
                       fontFamily:"Georgia, serif", fontSize:12, cursor:"pointer" }}>
              Entendido
            </button>
          </div>
        </div>
      )}
      {teresaAbierta && <TeresaModal
        biblioteca={bibliotecaJugando}
        onCerrar={() => setTeresaAbierta(false)}
        onIntercesion={(interc) => { window._teresaIntercesion = { interc, ts: Date.now() }; }}
      />}
    </>
  );

  if (pantalla === PANTALLAS.TERESA_PRESENTACION) return (
    <React.Fragment>
      <TeresaPresentacion onAceptar={() => setPantalla(PANTALLAS.VASTO_VACIO)} />
      {panelBotones}{modalesFlotantes}
    </React.Fragment>
  );

  if (pantalla === PANTALLAS.MODOS) return (
    <React.Fragment>
      <SelectorModos onIniciar={({ timer, scope }) => {
        setModoActivo({ timer, scope });
        if (scope === "olimpiada") {
          const queue = progresoBibliotecas.filter(b => b._level === "beginner");
          setOlimpiadaQueue(queue);
          setOlimpiadaIndex(0);
          setOlimpiadaTiempos([]);
          setBibliotecaJugando(queue[0]);
          setPantalla(PANTALLAS.OLIMPIADA);
        } else {
          setPantalla(PANTALLAS.VASTO_VACIO);
        }
      }} />
      {panelBotones}{modalesFlotantes}
    </React.Fragment>
  );

  if (pantalla === PANTALLAS.OLIMPIADA) {
    const bActual = olimpiadaQueue[olimpiadaIndex];
    if (!bActual) return null;
    const tiempoLimite = modoActivo.timer === "atalanta" ? calcularTiempoLimite(bActual) : null;
    return (
      <React.Fragment>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 11, color: "#8A8A78",
                      textAlign: "center", padding: "8px 0", letterSpacing: 0.5 }}>
          Olimpiada — {olimpiadaIndex + 1} / {olimpiadaQueue.length}
          {olimpiadaTiempos.length > 0 && (
            <span style={{ marginLeft: 12 }}>
              Acumulado: {fmtTiempo(olimpiadaTiempos.reduce((a, b) => a + b, 0))}
            </span>
          )}
        </div>
        <JugarBiblioteca
          key={bActual._id}
          biblioteca={bActual}
          modoTimer={modoActivo.timer}
          tiempoLimite={tiempoLimite}
          mensajeCompletacion={olimpiadaIndex < olimpiadaQueue.length - 1
            ? `${olimpiadaIndex + 1}/${olimpiadaQueue.length} — Siguiente: ${olimpiadaQueue[olimpiadaIndex + 1]?.name}`
            : `¡Olimpiada completa! ${olimpiadaQueue.length} bibliotecas. ✦`}
          onCompletada={(bib, tipo, tiempo) => {
            const nuevosTiempos = [...olimpiadaTiempos, tiempo ?? 0];
            setOlimpiadaTiempos(nuevosTiempos);
            if (tipo) {
              setProgresoBibliotecas(prev => prev.map(b =>
                b._id === bib._id ? { ...b, tipoComplecion: tipo } : b));
            }
            if (olimpiadaIndex < olimpiadaQueue.length - 1) {
              setOlimpiadaIndex(olimpiadaIndex + 1);
              setBibliotecaJugando(olimpiadaQueue[olimpiadaIndex + 1]);
            } else {
              setPantalla(PANTALLAS.VASTO_VACIO);
            }
          }}
        />
        {panelBotones}{modalesFlotantes}
      </React.Fragment>
    );
  }

  // ⚠️ PROVISIONAL — quitar antes del lanzamiento público
  if (pantalla === PANTALLAS.CHAR_TEST)
    return <PantallaCharTest onContinuar={() => setPantalla(guardado ? PANTALLAS.VASTO_VACIO : PANTALLAS.EXAMEN)} />;

  if (pantalla === PANTALLAS.ARISTOTELES_A4)
    return <PantallaAristotelesA4 onContinuar={() => setPantalla(PANTALLAS.VASTO_VACIO)} />;

  if (pantalla === PANTALLAS.EXAMEN)
    return <ExamenAdmision onAceptado={manejarAceptadoExamen} />;

  if (pantalla === PANTALLAS.EXAMEN_BIBLIOTECAS) {
    const bActual = examenBibliotecas[indiceExamenActual];
    return (
      <div>
        <p style={{ textAlign:"center",fontSize:11,color:"#8A8A78",marginBottom:8 }}>
          Examen de admisión — {indiceExamenActual + 1} de {examenBibliotecas.length}</p>
        <JugarBiblioteca key={bActual._id} biblioteca={bActual} onCompletada={manejarBibliotecaExamenCompletada}
          mensajeCompletacion={(() => {
            const restantes = examenBibliotecas.length - indiceExamenActual - 1;
            return restantes > 0
              ? `Sabía que sabías. ¿Sabías que solo faltan ${restantes} más?`
              : "Sabía que sabías. ¡Y eso era todo!";
          })()} />
      </div>
    );
  }

  if (pantalla === PANTALLAS.VASTO_VACIO) return (
    <React.Fragment>
      <div>
        <ElVastoVacio
          bibliotecas={progresoBibliotecas.map(b => ({
            _id: b._id, name: b.name, _level: b._level, completados: b.completados,
            total: b["total-"], capacidad: Object.keys(b.facts ?? {}).length,
            tipoComplecion: b.tipoComplecion,
            bloqueada: (b._level==="normal" && !disertatioCompletada && !modoEckhart) ||
                       (b._level==="hard"   && !phdCompletado          && !modoEckhart)
          }))}
          onAbrirBiblioteca={(bSimp) => {
            if (bSimp.tipoComplecion === "verde") {
              setProgresoBibliotecas(prev => prev.map(b =>
                b._id === bSimp._id ? {...b, completados: 0, tipoComplecion: null} : b));
            }
            const bFull = progresoBibliotecas.find(b => b._id === bSimp._id);
            setBibliotecaJugando(bFull); setPantalla(PANTALLAS.JUGANDO_BIBLIOTECA);
          }}
        />
        {!disertatioCompletada && (
          <div style={{ textAlign:"center", marginTop: 12 }}>
            <button
              onClick={() => todasPBCompletas() && setPantalla(PANTALLAS.DISERTATIO)}
              style={{ fontSize:11, padding:"6px 16px", fontFamily:"Georgia, serif",
                border:"1px solid #2A2A24", cursor: todasPBCompletas() ? "pointer" : "default",
                background: todasPBCompletas() ? "#2A2A24" : "transparent",
                color: todasPBCompletas() ? "#F7F3E8" : "#8A8A78",
                opacity: todasPBCompletas() ? 1 : 0.5 }}>
              {todasPBCompletas() ? "Intentar Disertatio →" : "Disertatio (completa Paperback primero)"}
            </button>
          </div>
        )}
        {disertatioCompletada && !phdCompletado && !modoEckhart && todasHCCompletas() && (
          <div style={{ textAlign:"center",marginTop:12 }}>
            <button onClick={() => setPantalla(PANTALLAS.PHD)}
              style={{ padding:"8px 16px",cursor:"pointer",background:"#1A0F08",color:"#D4A937" }}>
              Intentar PhD</button>
          </div>
        )}
        <div style={{ textAlign:"center", marginTop: 12, marginBottom: 4 }}>
          <button onClick={() => setPantalla(PANTALLAS.MODOS)}
            style={{ fontSize:11, color:"#8A8A78", background:"none", border:"1px solid #BFBAA8",
                     cursor:"pointer", padding:"4px 12px", fontFamily:"Georgia, serif" }}>
            🎮 Modos de juego
          </button>
        </div>
        <div style={{ textAlign:"center",marginTop:8 }}>
          <button onClick={resetear}
            style={{ fontSize:10,color:"#8A8A78",background:"none",border:"none",cursor:"pointer" }}>
            [dev: resetear progreso]</button>
        </div>
      </div>
      {panelBotones}{modalesFlotantes}
    </React.Fragment>
  );

  if (pantalla === PANTALLAS.JUGANDO_BIBLIOTECA) return (
    <React.Fragment>
      <JugarBiblioteca
        key={bibliotecaJugando._id}
        biblioteca={bibliotecaJugando}
        modoTimer={modoActivo.timer}
        tiempoLimite={modoActivo.timer === "atalanta" ? calcularTiempoLimite(bibliotecaJugando) : null}
        onCompletada={manejarBibliotecaCompletada}
      />
      {panelBotones}{modalesFlotantes}
    </React.Fragment>
  );

  if (pantalla === PANTALLAS.BIBLIOTECA_COMPLETADA) return (
    <React.Fragment>
      <BibliotecaCompletada biblioteca={bibliotecaJugando} tipoComplecion={tipoComplecionActual}
        onVolver={() => setPantalla(PANTALLAS.VASTO_VACIO)}
        onBrag={() => setPantalla(PANTALLAS.VASTO_VACIO)} />
      {panelBotones}{modalesFlotantes}
    </React.Fragment>
  );

  if (pantalla === PANTALLAS.DISERTATIO) return (
    <React.Fragment>
      <Disertatio onCompletado={() => { setDisertatioCompletada(true); setPantalla(PANTALLAS.VASTO_VACIO); }} />
      {panelBotones}{modalesFlotantes}
    </React.Fragment>
  );

  if (pantalla === PANTALLAS.PHD) return (
    <React.Fragment>
      <PhD onCompletado={() => { setPhdCompletado(true); setPantalla(PANTALLAS.VASTO_VACIO); }} />
      {panelBotones}{modalesFlotantes}
    </React.Fragment>
  );

  return <ArisStamp />;
}


export default App;
