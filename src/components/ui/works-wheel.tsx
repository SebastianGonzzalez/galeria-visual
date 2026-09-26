"use client";

// Galería Visual — rueda de portfolio con tema editorial oscuro.
//
// Al inicio los trabajos forman un anillo alrededor del título central.
// Al girar, el anillo se abre en un tambor 3D: la carta delantera queda
// plana y a tamaño completo; las de arriba y abajo rotan en perspectiva.
// Seguir girando lleva la siguiente pieza al frente.
//
// Todo se controla con un solo número — `turn` — leído por un rAF que
// escribe transforms directamente al DOM. 0 = anillo, 1 = tambor con
// ítem 0 al frente, y cada número entero después es un ítem más.
//
// Si nadie toca la rueda por un rato, avanza sola muy despacio (autoplay);
// cualquier interacción (rueda del mouse, arrastre, teclado, clic) la para
// al toque.
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface GalleryItem {
  /** Nombre de la obra. Se muestra en el índice y junto a la carta delantera. */
  title: string;
  /** URL de la imagen. Acepta cualquier src válido para <img>. */
  image: string;
  /** Enlace al hacer clic en la carta (por ejemplo /obra/1). Omitir para solo explorar. */
  href?: string;
}

export interface WorksWheelProps extends Omit<
  React.ComponentPropsWithoutRef<"section">,
  "children"
> {
  items: GalleryItem[];
  /** Texto central del anillo. */
  label?: string;
  /** Índice (0-based) con el que arrancar ya en modo tambor, sin pasar por el anillo. Útil al volver de la vista de detalle. */
  initialActive?: number;
}

// ── Geometría ──────────────────────────────────────────────────────────────

const CARD_H    = 0.38;   // altura carta / alto del escenario
const CARD_MAX_W = 0.34;  // ancho máximo carta / ancho del escenario
const CARD_RATIO = 1.45;  // ancho / alto de la carta
const STEP      = 40;     // grados entre cartas en el tambor
const DRUM      = 2.22;   // radio del tambor, en alturas de carta
const LENS      = 2.7;    // distancia de perspectiva
const RING_R    = 1.14;   // radio del anillo
const BOW       = 1.82;   // curvatura lateral del arco
const CULL      = 1.6;    // culling por distancia angular

const WHEEL_UNITS = 900;
const DRAG_UNITS  = 420;
const SETTLE      = 140;  // ms de silencio antes de asentarse en un ítem
const EASE        = 0.12; // suavizado por frame

const AUTOPLAY_IDLE = 5000; // ms sin interacción antes de que arranque el autoplay
const AUTOPLAY_STEP = 3200; // ms entre cada avance automático

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rad  = (deg: number) => (deg * Math.PI) / 180;

const bowAt = (drumDeg: number, bow: number) =>
  -bow * (1 - Math.cos(rad(drumDeg)));

function place(
  ringDeg: number,
  drumDeg: number,
  ringR:   number,
  drumR:   number,
  bow:     number,
  m:       number,
): string {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  );
}

type Stage = { w: number; h: number };

// ── Componente ─────────────────────────────────────────────────────────────

export function WorksWheel({
  items,
  label   = "Galería Visual",
  initialActive,
  className,
  ...props
}: WorksWheelProps) {
  const stageRef  = React.useRef<HTMLDivElement>(null);
  const wheelRef  = React.useRef<HTMLDivElement>(null);
  const cardRefs  = React.useRef<(HTMLElement | null)[]>([]);
  const labelRef  = React.useRef<HTMLDivElement>(null);
  const titleRef  = React.useRef<HTMLDivElement>(null);

  const turn   = React.useRef(0);
  const target = React.useRef(0);
  const drag   = React.useRef<number | null>(null);
  const settling = React.useRef(0);
  const lastInteraction = React.useRef(Date.now());

  const [active, setActive] = React.useState(0);
  const [stage,  setStage]  = React.useState<Stage>({ w: 0, h: 0 });
  const [reduced, setReduced] = React.useState(false);

  const count = items.length;
  const last  = Math.max(count - 1, 0);

  // Reduced motion
  React.useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(q.matches);
    read();
    q.addEventListener("change", read);
    return () => q.removeEventListener("change", read);
  }, []);

  // ResizeObserver
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Métricas derivadas del tamaño del escenario
  const metrics = React.useMemo(() => {
    const { w, h } = stage;
    const cardW = Math.min(h * CARD_H * CARD_RATIO, w * CARD_MAX_W);
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    const ringR = cardH * RING_R;
    const ringScale = count
      ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
      : 1;
    return {
      cardW, cardH, drumR, ringR, ringScale,
      bow:   cardH * BOW,
      depth: cardH * LENS,
    };
  }, [stage, count]);

  const to = React.useCallback(
    (next: number) => { target.current = clamp(next, 0, last + 1); },
    [last],
  );

  // Navegación disparada por el usuario: además de mover la rueda, marca
  // que hubo interacción para que el autoplay espere de nuevo su tiempo de
  // inactividad antes de retomar.
  const userTo = React.useCallback(
    (next: number) => {
      lastInteraction.current = Date.now();
      to(next);
    },
    [to],
  );

  // Si se pide arrancar ya en un ítem puntual (p. ej. al volver de la vista
  // de detalle), salta directo al modo tambor sin pasar por la animación
  // del anillo.
  React.useEffect(() => {
    if (initialActive == null || count === 0) return;
    const t = clamp(initialActive + 1, 0, last + 1);
    target.current = t;
    turn.current = t;
    setActive(clamp(initialActive, 0, last));
    // Solo debe correr al montar / si cambia explícitamente initialActive.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialActive, count]);

  // Loop de animación principal
  React.useEffect(() => {
    if (!stage.h) return;
    let frame = 0;
    const { ringR, ringScale, drumR, bow } = metrics;

    const draw = () => {
      frame = requestAnimationFrame(draw);
      const gap = target.current - turn.current;
      if (Math.abs(gap) < 0.0005) turn.current = target.current;
      else turn.current += gap * (reduced ? 1 : EASE);

      const t = turn.current;
      const m = clamp(t, 0, 1);
      const pos = Math.max(0, t - 1);

      if (wheelRef.current)
        wheelRef.current.style.transform = `translateZ(${-m * drumR}px)`;

      for (let i = 0; i < count; i++) {
        const d = i - pos;
        const drumDeg = d * STEP;
        const card = cardRefs.current[i];
        if (card) {
          card.style.transform = place(d * (360 / count), drumDeg, ringR, drumR, bow, m);
          card.style.opacity   = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
          card.style.zIndex    = String(Math.round(100 - Math.abs(d) * 2));
        }
        const face = card?.firstElementChild as HTMLElement | null;
        if (face) face.style.transform = `scale(${lerp(ringScale, 1, m)})`;
      }

      if (labelRef.current) labelRef.current.style.opacity = String(1 - m);
      if (titleRef.current) titleRef.current.style.opacity = String(m);

      const near = clamp(Math.round(pos), 0, last);
      setActive(prev => prev === near ? prev : near);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [metrics, stage.h, count, last, reduced]);

  // Autoplay: si pasan AUTOPLAY_IDLE ms sin interacción del usuario, avanza
  // solo un ítem cada AUTOPLAY_STEP ms. Cualquier interacción (arrastre,
  // rueda, teclado, clic) reinicia la espera vía userTo/lastInteraction.
  React.useEffect(() => {
    if (reduced || count <= 1) return;
    let cancelled = false;
    let timer = 0;

    const tick = () => {
      if (cancelled) return;
      const idleFor = Date.now() - lastInteraction.current;
      if (idleFor >= AUTOPLAY_IDLE && drag.current === null) {
        const current = Math.round(target.current);
        // Al llegar al final, vuelve al primer ítem para seguir el ciclo.
        const nextIndex = current + 1 > last + 1 ? 1 : current + 1;
        to(nextIndex);
      }
      timer = window.setTimeout(tick, AUTOPLAY_STEP);
    };

    timer = window.setTimeout(tick, AUTOPLAY_STEP);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [to, last, count, reduced]);

  // Rueda del ratón (nativa para poder cancelarla)
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const next = target.current + e.deltaY / WHEEL_UNITS;
      if (next > 0 && next < last + 1) e.preventDefault();
      userTo(next);
      window.clearTimeout(settling.current);
      settling.current = window.setTimeout(
        () => to(Math.round(target.current)),
        SETTLE,
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(settling.current);
    };
  }, [to, userTo, last]);

  // Título del ítem activo
  const activeItem = items[active];

  return (
    <section
      aria-label={label}
      className={cn(
        "bg-background text-foreground relative h-full min-h-[24rem] w-full overflow-hidden select-none",
        className,
      )}
      {...props}
    >
      {/* Escenario con perspectiva */}
      <div
        ref={stageRef}
        tabIndex={0}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`ww-${active}`}
        className="absolute inset-0 cursor-grab outline-none touch-pan-x active:cursor-grabbing focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-foreground"
        style={{ perspective: `${metrics.depth}px` }}
        onPointerDown={e => {
          lastInteraction.current = Date.now();
          drag.current = e.clientY;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={e => {
          if (drag.current === null) return;
          lastInteraction.current = Date.now();
          to(target.current + (drag.current - e.clientY) / DRAG_UNITS);
          drag.current = e.clientY;
        }}
        onPointerUp={() => {
          drag.current = null;
          if (target.current > 1) to(Math.round(target.current));
        }}
        onKeyDown={e => {
          if      (e.key === "ArrowDown") userTo(Math.round(target.current) + 1);
          else if (e.key === "ArrowUp")   userTo(Math.round(target.current) - 1);
          else return;
          e.preventDefault();
        }}
      >
        {/* Hub de la rueda */}
        <div
          ref={wheelRef}
          className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
        >
          {items.map((item, i) => {
            const isActive = i === active;
            return (
              <Link
                key={`${item.title}-${i}`}
                id={`ww-${i}`}
                role="option"
                aria-selected={isActive}
                href={item.href ?? "#"}
                ref={(node: HTMLAnchorElement | null) => { cardRefs.current[i] = node; }}
                className="group absolute [backface-visibility:hidden]"
                style={{
                  width:      metrics.cardW,
                  height:     metrics.cardH,
                  marginLeft: -metrics.cardW / 2,
                  marginTop:  -metrics.cardH / 2,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  if (!item.href) {
                    // Sin link de destino: un clic en una carta que no está
                    // al frente igual la centra, para poder seguir explorando.
                    e.preventDefault();
                    if (!isActive) userTo(i + 1);
                    return;
                  }
                  // Con link: un solo clic la centra (si hacía falta) y deja
                  // que el <Link> navegue a la vista de detalle de una vez,
                  // esté o no ya al frente.
                  if (!isActive) userTo(i + 1);
                }}
              >
                <span
                  className="relative block size-full overflow-hidden rounded-[10px]"
                  style={{ background: "#161616", boxShadow: "0 32px 64px -24px rgba(0,0,0,0.7)" }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    draggable={false}
                    className="size-full object-cover"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Título central del anillo */}
      <div
        ref={labelRef}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2"
      >
        <span
          className="tracking-tight"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: metrics.cardH * 0.124, color: "#f0ede8" }}
        >
          {label}
        </span>
        <span
          className="uppercase tracking-widest"
          style={{ fontSize: metrics.cardH * 0.04, color: "#6b6b6b" }}
        >
          Rueda para explorar
        </span>
      </div>

      {/* Título del ítem activo (modo tambor) */}
      <div
        ref={titleRef}
        className="pointer-events-none absolute top-1/2 left-[7%] -translate-y-1/2 opacity-0"
      >
        <div
          className="tracking-tight"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: metrics.cardH * 0.124, color: "#f0ede8" }}
        >
          {activeItem?.title}
        </div>
        <div
          className="mt-0.5"
          style={{ fontSize: metrics.cardH * 0.04, color: "#3a3a3a" }}
        >
          {active + 1} / {count}
        </div>
      </div>

      {/* Índice lateral derecho (solo pantallas medianas en adelante) */}
      <ol
        className="absolute top-[7.5%] right-[2.5%] hidden list-none text-right leading-[1.75] sm:block"
        style={{ fontSize: metrics.cardH * 0.04 }}
      >
        {items.map((item, i) => (
          <li key={`idx-${i}`}>
            <button
              type="button"
              onClick={() => userTo(i + 1)}
              className={cn(
                "cursor-pointer bg-none border-none outline-none transition-colors focus-visible:outline-1 focus-visible:outline-foreground",
                i === active
                  ? "font-medium"
                  : "",
              )}
              style={{ color: i === active ? "#f0ede8" : "#3a3a3a", fontFamily: "inherit" }}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ol>

      {/* Indicador de posición (puntitos), siempre visible — clave en mobile */}
      <div
        className="pointer-events-auto absolute inset-x-0 bottom-6 flex items-center justify-center gap-2"
        role="tablist"
        aria-label="Posición en la galería"
      >
        {items.map((_, i) => (
          <button
            key={`dot-${i}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Ir a la obra ${i + 1} de ${count}`}
            onClick={() => userTo(i + 1)}
            className="cursor-pointer rounded-full border-none bg-none p-1 outline-none focus-visible:outline-1 focus-visible:outline-foreground"
          >
            <span
              className="block rounded-full transition-all"
              style={{
                width: i === active ? 16 : 5,
                height: 5,
                background: i === active ? "#f0ede8" : "rgba(240,237,232,0.28)",
              }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

export default WorksWheel;