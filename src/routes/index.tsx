import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  LockKeyhole,
  Users,
  BriefcaseBusiness,
  HeartHandshake,
  TrendingUp,
  CircleCheck,
  Search,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/lj/shared";
import protection from "@/assets/protection.jpg";
import { useData } from "@/features/lj/store";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LJ · Verificá antes de responder" },
      {
        name: "description",
        content:
          "Consultá datos reportados por la comunidad, reportá una estafa de forma anónima y encontrá orientación clara.",
      },
      { property: "og:title", content: "LJ · Verificá antes de responder" },
      {
        property: "og:description",
        content: "Una comunidad para prevenir estafas digitales y cuidarnos entre todos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});
function Home() {
  const { store } = useData();
  const cards = [
    {
      title: "Trabajo por tareas",
      text: "Te ofrecen pagos por tareas simples. Después, te piden depositar dinero.",
      slug: "trabajo-por-tareas",
      Icon: BriefcaseBusiness,
      tone: "bg-teal-soft text-teal",
    },
    {
      title: "Falsa recuperación de fondos",
      text: "Prometen recuperar lo que perdiste, pero primero te cobran por adelantado.",
      slug: "recuperacion",
      Icon: HeartHandshake,
      tone: "bg-warning-soft text-warning",
    },
    {
      title: "Inversión o cripto",
      text: "Ganancias rápidas y garantizadas que esconden un riesgo muy real.",
      slug: "prevencion",
      Icon: TrendingUp,
      tone: "bg-secondary text-primary",
    },
  ];
  return (
    <main>
      <section className="home-hero">
        <img
          src={protection}
          className="hero-image"
          alt="Escudo de protección con un teléfono y un candado"
          width={1536}
          height={768}
        />
        <div className="container-lj">
          <div className="hero-copy">
            <span className="eyebrow">
              <ShieldCheck size={14} />
              Juntos, un paso adelante de las estafas
            </span>
            <h1 className="hero-title">
              Verificá antes
              <br />
              de responder<span className="text-teal">.</span>
            </h1>
            <p className="hero-subtitle">
              Consultá si un número, link o usuario ya fue reportado como estafa.
            </p>
            <div className="mt-7 max-w-[690px]">
              <SearchBox />
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <LockKeyhole size={13} />
              Tu consulta es privada. No necesitás una cuenta.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link to="/reportar">
                  <ShieldCheck />
                  Reportar una estafa
                  <ArrowUpRight />
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/guias/$slug" params={{ slug: "me-estafaron" }}>
                  Me estafaron, qué hago
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="safety-strip">
        <div className="container-lj grid gap-4 text-xs text-muted-foreground md:grid-cols-3">
          <div className="flex items-center justify-center gap-2">
            <Users size={17} className="text-teal" />
            Una comunidad que se cuida
          </div>
          <div className="flex items-center justify-center gap-2">
            <LockKeyhole size={16} className="text-teal" />
            Reportes anónimos, sin registro
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck size={17} className="text-teal" />
            Gratis. Sin cobros ni promesas.
          </div>
        </div>
      </section>
      <section className="container-lj py-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="section-title">Estafas más comunes</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Conocer las señales es el primer paso para cuidarte.
            </p>
          </div>
          <Link
            to="/guias"
            className="hidden items-center gap-2 text-sm font-semibold text-primary sm:flex"
          >
            Ver todas las guías
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map((c) => (
            <Link to="/guias/$slug" params={{ slug: c.slug }} key={c.title} className="scam-card">
              <div className={`icon-tile ${c.tone}`}>
                <c.Icon size={23} strokeWidth={1.7} />
              </div>
              <h3 className="mt-5 text-base font-bold">{c.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{c.text}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-primary">
                Conocé las señales
                <ArrowRight size={14} />
              </span>
              <ArrowUpRight size={17} className="absolute top-7 right-6 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>
      <section className="container-lj border-t py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="lg:w-[29%]">
            <span className="eyebrow">Simple y entre todos</span>
            <h2 className="section-title mt-2">Cómo funciona</h2>
          </div>
          <div className="grid flex-1 gap-7 md:grid-cols-3">
            {[
              {
                title: "Pegás el dato",
                text: "Un número, link o usuario que te genere dudas.",
                Icon: Search,
              },
              {
                title: "Consultás los reportes",
                text: "Te mostramos qué reportó la comunidad.",
                Icon: FileCheck2,
              },
              {
                title: "Ayudás a otros",
                text: "Si te pasó algo, tu reporte hace la diferencia.",
                Icon: Users,
              },
            ].map((s, i) => (
              <div key={s.title} className="flex items-start gap-3">
                <span className="step-number">{i + 1}</span>
                <div>
                  <h3 className="text-sm font-bold">{s.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="stat-band py-7">
        <div className="container-lj grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="font-display text-2xl font-extrabold">{store.reports.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Reportes de la comunidad</p>
          </div>
          <div className="border-x">
            <p className="font-display text-2xl font-extrabold">{store.entities.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Datos registrados</p>
          </div>
          <div>
            <p className="font-display text-2xl font-extrabold">
              {store.queries.toLocaleString("es-AR")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Consultas realizadas</p>
          </div>
        </div>
        <p className="mt-4 flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
          <CircleCheck size={11} />
          Datos ficticios de demostración
        </p>
      </section>
    </main>
  );
}
