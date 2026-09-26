Galería Visual

Una experiencia de galería web interactiva, moderna y altamente visual construida con las últimas tecnologías web. Diseñada para mostrar portafolios de arte, fotografía o diseño con animaciones fluidas, navegación intuitiva y páginas de detalle para cada obra.

Este proyecto está optimizado para ser un sitio web estático, lo que permite un despliegue rápido y gratuito a través de GitHub Pages.

Características Principales

Basado en la arquitectura del proyecto, la galería incluye:

Pantalla de carga personalizada (gallery-loading-screen.tsx) para una introducción elegante.

Presentación visual dinámica (image-stream-hero.tsx y works-wheel.tsx) para explorar las obras de forma interactiva.

Rutas dinámicas por obra (/obra/[id]) que generan páginas individuales detalladas para cada pieza del portafolio.

Totalmente responsivo usando Tailwind CSS.

Tipado estricto y seguro con TypeScript.

Tecnologías Utilizadas

Framework: Next.js (App Router)

Librería UI: React

Lenguaje: TypeScript

Estilos: Tailwind CSS

Despliegue: GitHub Actions & GitHub Pages

Estructura del Proyecto

Para facilitar la navegación y modificación del código, el proyecto está estructurado de la siguiente manera principal:

galeria-visual-limpia/
├── src/
│   ├── app/                 # Configuración del App Router de Next.js
│   │   ├── page.tsx         # Página principal de la galería
│   │   └── obra/[id]/       # Rutas dinámicas para la vista detallada de cada obra
│   ├── components/ui/       # Componentes de interfaz (Hero, Rueda, Loading)
│   ├── data/
│   │   └── gallery-items.ts # BASE DE DATOS LOCAL: Aquí se define la información de las obras
│   └── lib/                 # Utilidades generales (ej. clsx, tailwind-merge)
├── .github/workflows/       # Configuración de integración continua (CI/CD)
│   └── deploy.yml           # Archivo de automatización para subir a GitHub Pages
└── next.config.mjs          # Configuración de Next.js (output: 'export' habilitado)


Desarrollo Local

Para correr este proyecto en tu propia máquina, asegúrate de tener Node.js instalado. Sigue estos pasos:

Clona o descarga este repositorio.

Instala las dependencias:

npm install


Inicia el servidor de desarrollo:

npm run dev


Abre tu navegador en http://localhost:3000 para ver la galería en acción.

Cómo personalizar la galería (Añadir tus propias obras)

Toda la información que se muestra en la página está centralizada en un solo archivo para que sea muy fácil de actualizar sin tocar el código visual.

Navega a src/data/gallery-items.ts.

Edita, añade o elimina los objetos dentro del arreglo.

Asegúrate de colocar las imágenes correspondientes en tu carpeta pública o usar URLs válidas, y define sus IDs, títulos, descripciones, etc., según la estructura de datos que hayas definido en ese archivo.
