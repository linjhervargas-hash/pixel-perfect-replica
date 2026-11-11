import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  TriangleAlert,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { Page } from "@/components/lj/shared";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre LJ · Una comunidad que se cuida" },
      {
        name: "description",
        content:
          "Conocé cómo funciona LJ, sus niveles de confianza y su compromiso con el anonimato.",
      },
      { property: "og:title", content: "Sobre LJ · Una comunidad que se cuida" },
      {
        property: "og:description",
        content: "Prevención comunitaria, información clara y ningún cobro.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});
function About() {
  return (
    <Page
      title="LJ: cuidarnos entre todos"
      intro="Una plataforma comunitaria para prevenir estafas digitales y acompañar a quienes ya fueron estafados."
      eyebrow="Sobre LJ"
    >
      <div className="notice">
        <Users size={23} />
        <p>
          Compartir una experiencia puede evitar que otra persona pase por lo mismo. Sin culpas, sin
          vergüenza y sin tener que crear una cuenta.
        </p>
      </div>
      <section className="mt-8">
        <h2 className="section-title">Por qué existe LJ</h2>
        <p className="mt-4 text-muted-foreground">
          LJ nace de las estafas de “trabajo por tareas”, donde pagan al inicio y después piden
          depósitos, y de la falsa “recuperación de fondos”, donde alguien promete recuperar dinero
          y cobra por adelantado.
        </p>
      </section>
      <section className="mt-8 border-t pt-7">
        <h2 className="text-xl font-bold">Cómo funciona</h2>
        <p className="mt-4 text-muted-foreground">
          Pegás un dato, consultás los reportes aprobados de la comunidad y, si te pasó algo, podés
          reportarlo de forma anónima. Un nuevo reporte queda pendiente y no modifica los resultados
          hasta que moderación lo aprueba.
        </p>
      </section>
      <section className="mt-8 border-t pt-7">
        <h2 className="text-xl font-bold">Qué significan los resultados</h2>
        <div className="mt-5 space-y-5">
          {[
            {
              Icon: CheckCircle2,
              title: "Sin reportes",
              text: "No hay reportes aprobados o el dato fue descartado por moderación. No significa que sea seguro.",
              tone: "text-success",
            },
            {
              Icon: TriangleAlert,
              title: "Reportado, sin confirmar",
              text: "Hay uno o dos reportes aprobados, o todavía no hay tres fuentes independientes. Conviene actuar con cuidado.",
              tone: "text-warning",
            },
            {
              Icon: ShieldAlert,
              title: "Muy probable estafa",
              text: "Hay tres o más reportes aprobados de fuentes independientes, o moderación confirmó el dato. No respondas ni hagas pagos.",
              tone: "text-danger",
            },
          ].map((s) => (
            <div key={s.title} className="flex gap-3">
              <s.Icon size={23} className={`mt-1 shrink-0 ${s.tone}`} />
              <div>
                <h3 className="font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-8 border-t pt-7">
        <h2 className="text-xl font-bold">Lo que hacemos. Y lo que no.</h2>
        <p className="mt-4 text-muted-foreground">
          LJ orienta, reúne reportes y ayuda a detectar señales. No cobra, no vende datos, no
          recupera dinero y no pide contraseñas. No reemplaza a tu banco, a la policía ni al
          asesoramiento profesional.
        </p>
      </section>
      <section className="mt-8 border-t pt-7">
        <h2 className="text-xl font-bold">Privacidad y anonimato</h2>
        <p className="mt-4 text-muted-foreground">
          Nunca mostramos quién reportó. El email opcional, los contactos y las evidencias son
          privados. Los resultados públicos muestran solamente el dato reportado, las categorías de
          estafa, la cantidad de reportes y la fecha del último reporte.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Este prototipo usa datos ficticios y almacenamiento local. Su acceso de moderación es una
          simulación, no una protección real para datos sensibles.
        </p>
      </section>
      <Button asChild className="mt-8">
        <Link to="/verificar">
          <ShieldCheck />
          Verificar un dato
          <ArrowRight />
        </Link>
      </Button>
    </Page>
  );
}
