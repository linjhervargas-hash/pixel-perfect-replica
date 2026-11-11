import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, Info } from "lucide-react";
import { Page, Confirmation } from "@/components/lj/shared";
import { Button } from "@/components/ui/button";
import { useData } from "@/features/lj/store";
export const Route = createFileRoute("/revision")({
  head: () => ({
    meta: [
      { title: "Pedir revisión de un dato · LJ" },
      {
        name: "description",
        content: "Solicitá la revisión de un dato que creés que fue marcado por error.",
      },
      { property: "og:title", content: "Pedir revisión de un dato · LJ" },
      {
        property: "og:description",
        content: "Cada solicitud se revisa con cuidado y sin publicar tu contacto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReviewPage,
});
function ReviewPage() {
  const { update } = useData();
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const value = String(f.get("value") || "").trim(),
      reason = String(f.get("reason") || "").trim(),
      contact = String(f.get("contact") || "").trim();
    if (!value || !reason) {
      setError("Completá el dato y el motivo de tu solicitud.");
      return;
    }
    update((s) => ({
      ...s,
      reviews: [
        ...s.reviews,
        {
          id: crypto.randomUUID(),
          value,
          reason,
          contact,
          status: "Pendiente",
          createdAt: new Date().toISOString(),
        },
      ],
    }));
    setDone(true);
  }
  return (
    <Page
      title="Pedir revisión de un dato"
      intro="Si creés que un dato fue marcado por error, podés pedirnos que lo revisemos."
      eyebrow="Una comunidad justa"
    >
      {done ? (
        <Confirmation
          title="Revisaremos tu solicitud."
          text="Gracias por ayudarnos a mantener la información de LJ clara y responsable."
        />
      ) : (
        <>
          <div className="notice mb-7">
            <Info size={19} />
            <p>
              Revisamos los reportes y la información disponible. Tu contacto es opcional y nunca se
              publica. En esta demostración la solicitud queda en este navegador.
            </p>
          </div>
          <form onSubmit={submit} className="space-y-6">
            <div className="form-field">
              <label htmlFor="revision-dato">Dato a revisar</label>
              <input
                id="revision-dato"
                name="value"
                required
                maxLength={250}
                placeholder="Teléfono, link, usuario u otro dato"
              />
            </div>
            <div className="form-field">
              <label htmlFor="revision-motivo">Motivo</label>
              <textarea
                id="revision-motivo"
                name="reason"
                required
                maxLength={1000}
                rows={5}
                placeholder="Contanos por qué debería revisarse"
              />
              <p className="field-help">No escribas DNI, claves ni datos de tus cuentas.</p>
            </div>
            <div className="form-field">
              <label htmlFor="revision-contacto">Contacto (opcional)</label>
              <input
                id="revision-contacto"
                name="contact"
                type="email"
                placeholder="tu@email.com"
              />
              <p className="field-help">Nunca se muestra públicamente.</p>
            </div>
            {error && (
              <p role="alert" className="text-danger">
                {error}
              </p>
            )}
            <Button type="submit">
              Enviar solicitud
              <ArrowRight />
            </Button>
          </form>
        </>
      )}
    </Page>
  );
}
