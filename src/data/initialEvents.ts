import { EventItem } from '../types';

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Noche Acústica & Jam Session',
    shortDescription: 'Guitarra en vivo, versiones íntimas y micrófono abierto para artistas locales.',
    longDescription: 'Ven a disfrutar de una velada mágica bajo las luces tenues de nuestra terraza. Contaremos con el dúo acústico "Cuerdas al Viento" interpretando versiones de indie, pop y clásicos del rock acústico. A partir de las 22:30h abriremos la Jam Session para cualquier cliente que desee subir y compartir su talento con una consumición de cortesía.',
    date: '2026-11-12',
    time: '20:30',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
    externalUrl: 'https://sagricola.es/reservas-concierto',
    status: 'active',
    category: 'Música',
    location: 'Escenario Terraza',
    price: 'Entrada Libre',
    capacity: 'Aforo limitado a 60 personas',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-2',
    title: 'Cata Maridada de Cervezas y Quesos de Autor',
    shortDescription: 'Degustación guiada de 5 cervezas artesanas y quesos curados de proximidad.',
    longDescription: 'Descubre los secretos de la fermentación y el maridaje perfecto de la mano de nuestro sommelier invitado. Degustaremos 5 variedades exclusivas (desde Neipa frutal hasta Imperial Stout envejecida en barrica), acompañadas de una tabla de 5 quesos artesanos premiados, frutos secos y panes de masa madre horneados esa misma tarde.',
    date: '2026-11-14',
    time: '19:00',
    imageUrl: 'https://images.unsplash.com/photo-1538488881522-4326c36460f7?auto=format&fit=crop&w=1000&q=80',
    externalUrl: 'https://sagricola.es/entradas-cata',
    status: 'active',
    category: 'Gastronomía',
    location: 'Salón Bodega',
    price: '18€ / persona',
    capacity: 'Plazas limitadas a 25 asistentes',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-3',
    title: 'Gran Torneo Pub Quiz: Cultura Pop & Cine',
    shortDescription: 'Forma tu equipo de hasta 4 amigos, responde preguntas frikis y gana rondas gratis.',
    longDescription: '¡Vuelven nuestros jueves de trivial! 4 rondas de preguntas sobre cine, series de culto, música de los 90 y cultura general. Premios para los 3 primeros equipos clasificados: jarra de cerveza para el 3º, cena de picoteo para el 2º y un vale de 80€ para consumir en el local para el equipo campeón.',
    date: '2026-11-19',
    time: '21:00',
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1000&q=80',
    externalUrl: 'https://sagricola.es/inscribir-equipo-trivial',
    status: 'active',
    category: 'Juegos',
    location: 'Zona Bar Principal',
    price: 'Gratis con consumición',
    capacity: 'Máximo 15 equipos',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-4',
    title: 'Retro Party 80s & 90s con DJ Dani',
    shortDescription: 'Los grandes himnos del synthwave, eurodance y pop rock de dos décadas doradas.',
    longDescription: 'Prepara tu mejor outfit retro para bailar sin descanso. DJ Dani a los platos con vinilos originales, proyecciones nostálgicas en pantalla gigante y carta especial de cócteles retro. ¡Prohibido no bailar!',
    date: '2026-11-28',
    time: '23:00',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
    externalUrl: 'https://sagricola.es/fiesta-retro',
    status: 'inactive', // Inactivo / Oculto según requerimiento
    category: 'Fiesta',
    location: 'Club & Pista Central',
    price: 'Entrada 10€ (incluye copa)',
    capacity: 'Hasta completar aforo',
    createdAt: new Date().toISOString(),
  },
];

export const CATEGORIES = ['Todos', 'Música', 'Gastronomía', 'Juegos', 'Fiesta', 'Especial'];

export const IMAGE_PRESETS = [
  {
    label: 'Concierto / Música en vivo',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Cerveza / Brindis / Amigos',
    url: 'https://images.unsplash.com/photo-1538488881522-4326c36460f7?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Pub Quiz / Juegos de mesa',
    url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Fiesta / DJ / Pista de baile',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Cócteles de autor / Coctelería',
    url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Cena gastronómica / Tapas',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
  },
];
