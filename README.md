# Galería Visual

Galería creada con Next.js, React, TypeScript y Tailwind CSS.

## Desarrollo local

```bash
npm install
npm run dev
```

## Publicar en GitHub Pages

El proyecto está configurado como exportación estática (`output: 'export'`) y tiene un workflow de GitHub Actions en `.github/workflows/deploy.yml`.

1. Crea un repositorio en GitHub (por ejemplo `galeria-visual-limpia`).
2. Sube todos los archivos de este proyecto a la rama `main`.
3. En GitHub entra a **Settings → Pages**.
4. En **Build and deployment → Source**, selecciona **GitHub Actions**.
5. Haz push a `main` o vuelve a ejecutar el workflow desde **Actions**.

La configuración detecta automáticamente el nombre del repositorio y genera el `basePath` correcto para GitHub Pages.
