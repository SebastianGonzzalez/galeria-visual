"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { WorksWheel, type GalleryItem } from "@/components/ui/works-wheel";
import { GalleryLoadingScreen } from "@/components/ui/gallery-loading-screen";
import { GALLERY_ITEMS } from "@/data/gallery-items";

// La rueda solo necesita título / imagen / href; el resto (descripción, slug)
// vive en @/data/gallery-items y lo usa la vista de detalle en /obra/[id].
const ITEMS: GalleryItem[] = GALLERY_ITEMS.map(({ title, image, slug }) => ({
  title,
  image,
  href: `/obra/${slug}`,
}));

function GalleryPageInner() {
  // La pantalla de carga se queda montada hasta que ella misma avisa que
  // terminó su fade-out; ahí recién se desmonta y queda solo la rueda.
  const [loading, setLoading] = useState(true);
  // Arranca en `false` (invisible/achicada) y pasa a `true` en cuanto la
  // pantalla de carga empieza su fade-out, para que la rueda entre con una
  // animación en vez de aparecer de golpe cuando `loading` se vuelve false.
  const [revealed, setRevealed] = useState(false);

  // Si venimos de /obra/{slug} con "← Volver a la galería", esa página
  // agrega ?item={slug} para que la rueda arranque ya mostrando esa obra
  // en vez de reiniciar en el anillo.
  const searchParams = useSearchParams();
  const itemParam = searchParams.get("item");
  const initialIndex = itemParam
    ? GALLERY_ITEMS.findIndex((it) => it.slug === itemParam)
    : -1;

  return (
    <main className="h-screen w-full overflow-hidden" style={{ background: "#0a0a0a" }}>
      <div
        className="h-full w-full transition-all duration-[900ms] ease-out"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "scale(1)" : "scale(1.06)",
          filter: revealed ? "blur(0px)" : "blur(6px)",
        }}
      >
        <WorksWheel
          items={ITEMS}
          label="Galería Visual"
          className="h-full"
          initialActive={initialIndex >= 0 ? initialIndex : undefined}
        />
      </div>

      {loading && (
        <GalleryLoadingScreen
          images={GALLERY_ITEMS.map(({ image, title }) => ({ src: image, alt: title }))}
          label="Galería Visual"
          minDuration={2000}
          onReady={() => setRevealed(true)}
          onFinish={() => setLoading(false)}
        />
      )}
    </main>
  );
}

export default function GalleryPage() {
  // useSearchParams exige un límite de Suspense; el fallback no se llega a
  // ver en la práctica porque esta página siempre se renderiza en cliente.
  return (
    <Suspense fallback={null}>
      <GalleryPageInner />
    </Suspense>
  );
}