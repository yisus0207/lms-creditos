// data/reviews.ts
// Datos separados del componente ReviewsSection.
// TODO: reemplazar los datos placeholder (id 4 al 6) con datos reales.

export interface Review {
  id: number;
  name: string;
  role: string;
  img: string;
  text: string;
  stars: number;
}

export const reviews: Review[] = [
  {
    id: 1,
    name: 'Marisol G.',
    role: 'Propiedad en Bogotá',
    img: '/images/testimonials/marisol.png',
    text: 'Logramos comprar nuestro apartamento en tiempo récord. El equipo de LMS se encargó de toda la burocracia bancaria. ¡Increíble!',
    stars: 5
  },
  {
    id: 2,
    name: 'Carlos R.',
    role: 'Inversión Inmobiliaria',
    img: '/images/testimonials/carlos.png',
    text: 'La transparencia fue total. Me ahorré más de $1.8M en escrituras gracias a su promoción. Realmente cumplen lo que prometen.',
    stars: 5
  },
  {
    id: 3,
    name: 'Elena V.',
    role: 'Primer Hogar',
    img: '/images/testimonials/elena.png',
    text: 'Como madre soltera, pensé que el crédito sería imposible. LMS ajustó mi perfil y hoy ya tengo mi casa propia. Gratitud eterna.',
    stars: 5
  },
  // TODO: reemplazar con datos reales
  {
    id: 4,
    name: 'Javier M.',
    role: 'Renovación de Vivienda',
    img: '/images/testimonials/javier.png',
    text: 'Impresionante el nivel de detalle y seguimiento diario. Todo el trámite fue transparente y sin dolores de cabeza. Muy recomendados.',
    stars: 5
  },
  {
    id: 5,
    name: 'Lucía F.',
    role: 'Casa Campestre',
    img: '/images/testimonials/lucia.png',
    text: 'Pensamos que comprar fuera de la ciudad sería un problema para los bancos, pero ellos lo hicieron ver extremadamente fácil.',
    stars: 5
  },
  {
    id: 6,
    name: 'Diego T.',
    role: 'Apartamento Nuevo',
    img: '/images/testimonials/diego.png',
    text: 'Desde la primera asesoría supe que estábamos en las mejores manos. Consiguieron una tasa de interés que no imaginaba posible.',
    stars: 5
  }
];
