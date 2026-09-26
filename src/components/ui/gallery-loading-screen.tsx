"use client";

// Pantalla de carga de la Galería Visual.
//
// Reutiliza el corredor de ImageStreamHero con las mismas imágenes de la
// galería (para que la carga ya se sienta parte de la obra, no un splash
// genérico) y las precarga de verdad: mientras el usuario ve el corredor,
// el navegador va bajando los <img> reales que luego usará WorksWheel, así
// la rueda no aparece con destellos en blanco.
//
// Se queda en pantalla al menos `minDuration` ms y hasta que todas las
// imágenes terminen de cargar (lo que tarde más), y después se desvanece
// con un fade y se desmonta, llamando a `onFinish`.
import * as React from "react";
import { cn } from "@/lib/utils";
import { ImageStreamHero, type StreamImage } from "@/components/ui/image-stream-hero";

const FADE_MS = 600;

export interface GalleryLoadingScreenProps {
  /** Mismas imágenes que se van a mostrar en la galería. */
  images: StreamImage[];
  /** Texto central. */
  label?: string;
  /** Tiempo mínimo visible en pantalla, en ms, aunque las imágenes carguen antes. */
  minDuration?: number;
  /** Tarjetas por riel del corredor (más = más denso). */
  cards?: number;
  /** Segundos que tarda una tarjeta en recorrer todo el corredor (más alto = más lento y más visible). */
  speed?: number;
  /**
   * Se llama justo cuando empieza el fade-out (la pantalla de carga todavía
   * es visible un instante más). Úsalo para arrancar la animación de
   * entrada de lo que hay detrás, así se cruzan en vez de verse un corte.
   */
  onReady?: () => void;
  /** Se llama una vez que el fade-out termina y la pantalla ya se desmontó. */
  onFinish?: () => void;
  className?: string;
}

export function GalleryLoadingScreen({
  images,
  label = "Galería Visual",
  minDuration = 5000,
  cards = 7,
  speed = 26,
  onReady,
  onFinish,
  className,
}: GalleryLoadingScreenProps) {
  const [loaded, setLoaded] = React.useState(0);
  const [ready, setReady] = React.useState(false); // listo para empezar el fade
  const [hidden, setHidden] = React.useState(false); // fade terminado, desmontar

  // Momento en que se montó la pantalla de carga, para medir cuánto tiempo
  // real ha pasado (y no dar por cumplido `minDuration` antes de tiempo).
  const startedAt = React.useRef(0);
  React.useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Precarga real de las imágenes de la galería.
  React.useEffect(() => {
    if (images.length === 0) {
      setLoaded(0);
      return;
    }
    let cancelled = false;
    let done = 0;

    images.forEach(({ src }) => {
      const img = new window.Image();
      img.onload = img.onerror = () => {
        if (cancelled) return;
        done += 1;
        setLoaded(done);
      };
      img.src = src;
    });

    return () => {
      cancelled = true;
    };
  }, [images]);

  // Combina "imágenes listas" + "tiempo mínimo cumplido": solo cuando ambas
  // condiciones se cumplen se agenda el cierre, esperando lo que falte de
  // minDuration desde que se montó (nunca antes).
  React.useEffect(() => {
    const allLoaded = images.length === 0 || loaded >= images.length;
    if (!allLoaded) return;

    const elapsed = Date.now() - startedAt.current;
    const remaining = Math.max(0, minDuration - elapsed);
    const timer = window.setTimeout(() => {
      setReady(true);
      onReady?.();
    }, remaining);
    return () => window.clearTimeout(timer);
  }, [loaded, images.length, minDuration, onReady]);

  // Una vez "ready", corre el fade y luego desmonta.
  React.useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => {
      setHidden(true);
      onFinish?.();
    }, FADE_MS);
    return () => window.clearTimeout(t);
  }, [ready, onFinish]);

  if (hidden) return null;

  const percent = images.length
    ? Math.min(100, Math.round((loaded / images.length) * 100))
    : 100;

  return (
    <div
      aria-hidden={ready}
      className={cn(
        "bg-background fixed inset-0 z-[999] flex items-center justify-center transition-opacity ease-out",
        ready ? "pointer-events-none opacity-0" : "opacity-100",
        className,
      )}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <ImageStreamHero images={images} cards={cards} speed={speed} className="absolute inset-0" />

      {/* Velo para que el título quede legible sobre el corredor */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 55%, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.88) 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-3">
        <span
          className="tracking-tight"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 30,
            color: "#f0ede8",
          }}
        >
          {label}
        </span>

        <div className="h-px w-28 overflow-hidden bg-white/10">
          <div
            className="h-full transition-[width] duration-200 ease-out"
            style={{ width: `${percent}%`, background: "#c8b89a" }}
          />
        </div>

        <span
          className="uppercase tracking-widest"
          style={{ fontSize: 11, color: "#6b6b6b" }}
        >
          Cargando {percent}%
        </span>
      </div>
    </div>
  );
}

export default GalleryLoadingScreen;