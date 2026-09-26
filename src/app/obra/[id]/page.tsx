// Vista de detalle de una obra: /obra/{slug}.
//
// Server Component (sin "use client") a propósito: generateMetadata corre
// en el servidor y es lo que hace que, al compartir este link, se vea la
// imagen y el título de la obra en redes/WhatsApp/etc. en vez de una tarjeta
// genérica del sitio.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GALLERY_ITEMS } from "@/data/gallery-items";

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return GALLERY_ITEMS.map((item) => ({ id: item.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const item = GALLERY_ITEMS.find((i) => i.slug === params.id);
  if (!item) return {};

  return {
    title: `${item.title} — Galería Visual`,
    description: item.description,
    openGraph: {
      title: item.title,
      description: item.description,
      images: [{ url: item.image }],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.description,
      images: [item.image],
    },
  };
}

export default function ObraPage({ params }: Props) {
  const index = GALLERY_ITEMS.findIndex((i) => i.slug === params.id);
  if (index === -1) notFound();

  const item = GALLERY_ITEMS[index];
  const prev = GALLERY_ITEMS[(index - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length];
  const next = GALLERY_ITEMS[(index + 1) % GALLERY_ITEMS.length];

  return (
    <main className="min-h-screen w-full" style={{ background: "#0a0a0a", color: "#f0ede8" }}>
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-14 sm:px-10">
        {/* Volver a la rueda, dejándola ya centrada en esta misma obra */}
        <Link
          href={`/?item=${item.slug}`}
          className="w-fit text-[11px] uppercase tracking-widest transition-colors"
          style={{ color: "#6b6b6b" }}
        >
          ← Volver a la galería
        </Link>

        <div
          className="overflow-hidden rounded-lg"
          style={{ boxShadow: "0 32px 64px -24px rgba(0,0,0,0.7)", background: "#161616" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.title} className="w-full object-cover" />
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[11px] uppercase tracking-widest" style={{ color: "#6b6b6b" }}>
            {index + 1} / {GALLERY_ITEMS.length}
          </span>
          <h1
            className="text-3xl tracking-tight sm:text-4xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {item.title}
          </h1>
          <p className="max-w-2xl text-[15px] leading-relaxed" style={{ color: "#9a9a9a" }}>
            {item.description}
          </p>
        </div>

        <nav
          className="flex items-center justify-between border-t pt-6 text-sm"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <Link href={`/obra/${prev.slug}`} className="transition-colors" style={{ color: "#6b6b6b" }}>
            ← {prev.title}
          </Link>
          <Link href={`/obra/${next.slug}`} className="transition-colors" style={{ color: "#6b6b6b" }}>
            {next.title} →
          </Link>
        </nav>
      </div>
    </main>
  );
}
