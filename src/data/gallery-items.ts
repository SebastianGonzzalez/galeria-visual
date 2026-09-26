// Datos centrales de la galería.
//
// Un solo lugar para título / imagen / descripción de cada obra, así la
// rueda (src/app/page.tsx) y la página de detalle (src/app/obra/[id]/page.tsx)
// leen exactamente lo mismo. No hay campo de categoría: la galería ya no
// filtra por categorías.

export interface GalleryPiece {
  /** Identificador estable usado en la URL: /obra/{slug}. */
  slug: string;
  /** Nombre de la obra. */
  title: string;
  /** URL de la imagen. */
  image: string;
  /** Texto corto mostrado en la vista de detalle y usado como descripción para compartir (Open Graph). */
  description: string;
}

export const GALLERY_ITEMS: GalleryPiece[] = [
  {
    slug: "1",
    title: "Horizonte I",
    image: "https://images6.alphacoders.com/138/thumb-1920-1387268.jpg",
    description:
      "La primera pieza de la serie: una línea de horizonte que separa dos masas de color casi en silencio.",
  },
  {
    slug: "2",
    title: "Horizonte II",
    image: "https://images4.alphacoders.com/140/thumb-1920-1405510.webp",
    description:
      "El mismo gesto que la pieza anterior, pero con la luz cayendo desde otro ángulo, más frío.",
  },
  {
    slug: "3",
    title: "Horizonte III",
    image: "https://images5.alphacoders.com/131/thumb-1920-1311994.jpeg",
    description:
      "Una composición donde el punto de fuga se desplaza fuera del cuadro, dejando la escena en tensión.",
  },
  {
    slug: "4",
    title: "Horizonte IV",
    image: "https://images4.alphacoders.com/136/thumb-1920-1360883.jpeg",
    description:
      "Capas de color superpuestas hasta perder la referencia de arriba y abajo.",
  },
  {
    slug: "5",
    title: "Horizonte V",
    image: "https://images3.alphacoders.com/645/thumb-1920-645549.jpg",
    description:
      "La quinta variación: menos paisaje, más textura — la línea se disuelve en grano.",
  },
  {
    slug: "6",
    title: "Horizonte VI",
    image: "https://images3.alphacoders.com/123/thumb-1920-1235167.jpg",
    description:
      "Un estudio de contraste: un extremo casi negro, el otro casi blanco, sin gradiente entre ambos.",
  },
  {
    slug: "7",
    title: "Horizonte VII",
    image: "https://images6.alphacoders.com/129/thumb-1920-1299626.jpg",
    description:
      "La escena se repite pero el color se invierte, como si fuera el negativo de otra pieza de la serie.",
  },
  {
    slug: "8",
    title: "Horizonte VIII",
    image: "https://images5.alphacoders.com/131/thumb-1920-1312197.jpg",
    description:
      "Una pausa dentro de la serie: composición simétrica, quieta, casi arquitectónica.",
  },
  {
    slug: "9",
    title: "Horizonte IX",
    image: "https://images6.alphacoders.com/131/thumb-1920-1313827.jpg",
    description:
      "El horizonte se curva ligeramente, sugiriendo una escala mucho mayor de la que cabe en el cuadro.",
  },
  {
    slug: "10",
    title: "Horizonte X",
    image: "https://images2.alphacoders.com/115/thumb-1920-1158348.jpg",
    description:
      "Una variación nocturna: el mismo horizonte, pero con la mayor parte de la información escondida en la sombra.",
  },
  {
    slug: "11",
    title: "Horizonte XI",
    image: "https://images8.alphacoders.com/925/thumb-1920-925960.png",
    description:
      "Cierre de la serie: todos los elementos anteriores condensados en una sola imagen final.",
  },
];
