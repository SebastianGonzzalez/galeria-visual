Galería Visual

Una experiencia web interactiva, moderna y altamente visual para presentar arte, fotografía, diseño y proyectos creativos.

Galería Visual es una galería web diseñada para mostrar obras de forma atractiva e inmersiva, combinando animaciones fluidas, navegación intuitiva y páginas de detalle individuales para cada pieza.

El proyecto está optimizado para funcionar como un sitio web estático, permitiendo un despliegue rápido, sencillo y gratuito mediante GitHub Pages.

Características

Pantalla de carga personalizada
Introducción visual mediante gallery-loading-screen.tsx.

Presentación dinámica de obras
Experiencia interactiva mediante componentes como image-stream-hero.tsx y works-wheel.tsx.

Páginas individuales para cada obra
Cada pieza cuenta con su propia ruta dinámica:

/obra/[id]


Diseño totalmente responsivo
Adaptado para dispositivos móviles, tablets y ordenadores.

Estilos modernos con Tailwind CSS

TypeScript
Tipado estricto para mejorar la seguridad y mantenibilidad del código.

Despliegue automático
Preparado para desplegarse en GitHub Pages mediante GitHub Actions.

Generación estática
Configurado con output: 'export' para generar una versión estática del sitio.

Tecnologías utilizadas
Tecnología	Uso
Next.js	Framework principal
React	Construcción de la interfaz
TypeScript	Lenguaje y tipado
Tailwind CSS	Diseño y estilos
GitHub Actions	Automatización del despliegue
GitHub Pages	Hosting del sitio
Estructura del proyecto

La estructura principal del proyecto está organizada de la siguiente manera:

galeria-visual-limpia/
│
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   │   └── Página principal de la galería
│   │   │
│   │   └── obra/
│   │       └── [id]/
│   │           └── Página dinámica de cada obra
│   │
│   ├── components/
│   │   └── ui/
│   │       └── Componentes visuales de la interfaz
│   │           ├── Hero
│   │           ├── Works Wheel
│   │           └── Loading Screen
│   │
│   ├── data/
│   │   └── gallery-items.ts
│   │       └── Información de las obras
│   │
│   └── lib/
│       └── Utilidades generales
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│           └── Automatización del despliegue
│
├── next.config.mjs
│   └── Configuración de Next.js
│
└── package.json

Desarrollo local
1. Clonar el repositorio

Clona este repositorio en tu ordenador:

git clone https://github.com/TU-USUARIO/TU-REPOSITORIO.git


Luego entra en la carpeta del proyecto:

cd galeria-visual-limpia

2. Instalar dependencias

Asegúrate de tener Node.js instalado y ejecuta:

npm install

3. Iniciar el servidor de desarrollo
npm run dev

4. Abrir el proyecto

Visita:

http://localhost:3000

Personalizar la galería

La información de las obras está centralizada en un único archivo, lo que permite modificar el contenido sin necesidad de cambiar los componentes visuales.

Archivo principal

Dirígete a:

src/data/gallery-items.ts


En este archivo puedes añadir, modificar o eliminar obras.

Por ejemplo:

{
  id: "mi-obra",
  title: "Mi Obra",
  description: "Descripción de la obra",
  image: "/images/mi-obra.jpg"
}


La estructura exacta de cada objeto dependerá de los campos definidos actualmente en gallery-items.ts.

Añadir imágenes

Puedes almacenar las imágenes dentro de la carpeta pública del proyecto:

public/
└── images/
    ├── obra-1.jpg
    ├── obra-2.jpg
    └── obra-3.jpg


Después puedes referenciarlas desde los datos de la galería:

image: "/images/obra-1.jpg"


También puedes utilizar URLs externas válidas si la estructura de datos del proyecto lo permite.

Despliegue en GitHub Pages

El proyecto está preparado para utilizar GitHub Actions y generar automáticamente la versión estática del sitio.

El flujo de despliegue se encuentra en:

.github/workflows/deploy.yml


La configuración de Next.js utiliza:

output: 'export'


Esto permite generar los archivos estáticos necesarios para alojar la galería en GitHub Pages.

Flujo de despliegue
Código
   │
   ▼
GitHub
   │
   ▼
GitHub Actions
   │
   ▼
Build de Next.js
   │
   ▼
Archivos estáticos
   │
   ▼
GitHub Pages


Cada actualización enviada al repositorio puede activar automáticamente el proceso de despliegue.

Objetivo del proyecto

El objetivo de Galería Visual es proporcionar una base moderna y flexible para crear experiencias digitales enfocadas en contenido visual.

Puede utilizarse como base para:

Portafolios de artistas

Portafolios de fotografía

Proyectos de diseño

Galerías digitales

Portafolios profesionales

Proyectos creativos y personales

Notas

Antes de desplegar el proyecto, revisa especialmente:

La configuración de next.config.mjs.

Las rutas de las imágenes.

El contenido de src/data/gallery-items.ts.

La configuración de GitHub Pages.

El workflow ubicado en .github/workflows/deploy.yml.

Licencia

Este proyecto puede ser utilizado y modificado según los términos de la licencia incluida en el repositorio.

Si el proyecto no incluye una licencia todavía, considera añadir una antes de distribuirlo públicamente.
