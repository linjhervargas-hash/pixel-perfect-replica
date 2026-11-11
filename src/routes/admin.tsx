import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  LockKeyhole,
  LogOut,
  Check,
  X,
  ShieldCheck,
  FileImage,
  Clock,
  ArrowLeft,
  Inbox,
  GitMerge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page, EmptyState, ScamBadge } from "@/components/lj/shared";
import { useData } from "@/features/lj/store";
import {
  DEMO_CREDENTIALS,
  SCAM_TYPES,
  moderate,
  mergeEntity,
  type ReportStatus,
} from "@/features/lj/data";
export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Moderación de demostración · LJ" },
      { name: "description", content: "Acceso al panel local de moderación del prototipo LJ." },
      { property: "og:title", content: "Moderación de demostración · LJ" },
      {
        property: "og:description",
        content: "Revisión de reportes y solicitudes en el prototipo local.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Admin,
});
function Admin() {
  const { store, update } = useData();
  const [signedIn, setSignedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState("reportes");
  const [status, setStatus] = useState<ReportStatus>("Pendiente");
  const [scam, setScam] = useState("");
  const [evidenceOnly, setEvidenceOnly] = useState(false);
  const [selected, setSelected] = useState("");
  const [mergeTarget, setMergeTarget] = useState("");
  const [notice, setNotice] = useState("");
  function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (
      f.get("email") === DEMO_CREDENTIALS.email &&
      f.get("password") === DEMO_CREDENTIALS.password
    ) {
      setSignedIn(true);
      setLoginError("");
    } else setLoginError("El email o la contraseña de demostración no coinciden.");
  }
  const report = store.reports.find((r) => r.id === selected);
  const filtered = store.reports
    .filter(
      (r) =>
        r.status === status &&
        (!scam || r.scam === scam) &&
        (!evidenceOnly || r.evidence.length > 0),
    )
    .sort(
      (a, b) =>
        Number(b.evidence.length > 0) - Number(a.evidence.length > 0) ||
        a.createdAt.localeCompare(b.createdAt),
    );
  function action(name: string) {
    if (!report) return;
    update((s) => moderate(s, report.id, name));
    setNotice(`Acción registrada: ${name}.`);
  }
  function reviewAction(id: string, name: "Resuelta" | "Rechazada") {
    update((s) => ({
      ...s,
      reviews: s.reviews.map((r) => (r.id === id ? { ...r, status: name } : r)),
      log: [
        ...s.log,
        {
          id: crypto.randomUUID(),
          targetId: id,
          action: name === "Resuelta" ? "Resolver revisión" : "Rechazar revisión",
          date: new Date().toISOString(),
        },
      ],
    }));
    setNotice("La acción quedó registrada.");
  }
  if (!signedIn)
    return (
      <Page
        title="Acceso de moderación"
        intro="Un espacio para revisar los reportes con cuidado."
        eyebrow="Demostración privada"
      >
        <div className="notice mb-7">
          <LockKeyhole size={21} />
          <p>
            <strong>Acceso simulado, solo para este prototipo.</strong> No protege datos reales.
            Todo queda en este navegador; no uses información sensible.
          </p>
        </div>
        <div className="mb-6 rounded-md border bg-muted p-4 text-sm">
          <p className="font-semibold">Cuenta de demostración</p>
          <p className="mt-2">
            Email: <span className="font-mono">{DEMO_CREDENTIALS.email}</span>
          </p>
          <p>
            Contraseña: <span className="font-mono">{DEMO_CREDENTIALS.password}</span>
          </p>
        </div>
        <form onSubmit={login} className="space-y-5">
          <div className="form-field">
            <label htmlFor="admin-email">Email</label>
            <input id="admin-email" name="email" type="email" autoComplete="username" required />
          </div>
          <div className="form-field">
            <label htmlFor="admin-password">Contraseña de demostración</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {loginError && (
            <p role="alert" className="text-sm text-danger">
              {loginError}
            </p>
          )}
          <Button type="submit">
            <LockKeyhole />
            Ingresar
          </Button>
        </form>
      </Page>
    );
  const approvedWeek = store.log.filter(
    (l) => l.action === "Aprobar" && new Date(l.date).getTime() > Date.now() - 7 * 86400000,
  ).length;
  return (
    <main className="page-main">
      <div className="container-lj">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="eyebrow">Moderación · demostración</span>
            <h1 className="page-title">Cuidar la información también importa</h1>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSignedIn(false);
              setSelected("");
            }}
          >
            <LogOut />
            Salir
          </Button>
        </div>
        <p className="mb-7 text-sm text-muted-foreground">
          Panel local de demostración. Las evidencias y los contactos nunca aparecen en el
          verificador público.
        </p>
        <div className="mb-8 grid grid-cols-3 gap-4 border-y py-6">
          {[
            [store.reports.filter((r) => r.status === "Pendiente").length, "Reportes pendientes"],
            [approvedWeek, "Aprobados esta semana"],
            [store.entities.filter((e) => e.state === "confirmado").length, "Datos confirmados"],
          ].map(([n, label]) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold">{n}</p>
              <p className="mt-1 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
        <div className="mb-6 flex gap-2" role="tablist" aria-label="Vistas de moderación">
          <Button
            variant={tab === "reportes" ? "default" : "outline"}
            role="tab"
            aria-selected={tab === "reportes"}
            onClick={() => {
              setTab("reportes");
              setSelected("");
            }}
          >
            <Inbox />
            Reportes
          </Button>
          <Button
            variant={tab === "revisiones" ? "default" : "outline"}
            role="tab"
            aria-selected={tab === "revisiones"}
            onClick={() => {
              setTab("revisiones");
              setSelected("");
            }}
          >
            <ShieldCheck />
            Solicitudes de revisión
          </Button>
        </div>
        {notice && (
          <p role="status" className="notice mb-5">
            {notice}
          </p>
        )}
        {tab === "reportes" && !report && (
          <>
            <div className="grid items-end gap-4 border-b pb-6 md:grid-cols-3">
              <div className="form-field">
                <label htmlFor="admin-estado">Estado</label>
                <select
                  id="admin-estado"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ReportStatus)}
                >
                  {["Pendiente", "Aprobado", "Rechazado"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="admin-estafa">Tipo de estafa</label>
                <select id="admin-estafa" value={scam} onChange={(e) => setScam(e.target.value)}>
                  <option value="">Todos los tipos</option>
                  {SCAM_TYPES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <label className="flex min-h-12 items-center gap-3">
                <input
                  type="checkbox"
                  checked={evidenceOnly}
                  onChange={(e) => setEvidenceOnly(e.target.checked)}
                />
                Solo con evidencia
              </label>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              Primero los reportes con evidencia; dentro de cada grupo, los más antiguos.
            </p>
            {filtered.length === 0 ? (
              <EmptyState
                title="No hay reportes en esta vista"
                text="Probá con otros filtros. Los nuevos reportes quedan pendientes hasta su revisión."
              />
            ) : (
              filtered.map((r) => (
                <div key={r.id} className="report-row">
                  <div className="min-w-0">
                    <p className="break-all font-semibold">{r.value}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <ScamBadge>{r.scam}</ScamBadge>
                      {r.evidence.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-teal">
                          <FileImage size={13} />
                          {r.evidence.length} imágenes
                        </span>
                      )}
                      {r.demo && (
                        <span className="text-xs text-muted-foreground">Dato ficticio</span>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {r.country} · {new Date(r.createdAt).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelected(r.id);
                      setNotice("");
                    }}
                  >
                    Revisar
                  </Button>
                </div>
              ))
            )}
          </>
        )}
        {tab === "reportes" && report && (
          <section>
            <Button
              variant="ghost"
              onClick={() => {
                setSelected("");
                setMergeTarget("");
                setNotice("");
              }}
            >
              <ArrowLeft />
              Volver a la lista
            </Button>
            <div className="mt-5 border-b pb-6">
              <p className="text-xs font-semibold text-teal">
                {report.status}
                {report.demo ? " · Dato ficticio de demostración" : ""}
              </p>
              <h2 className="mt-2 break-all text-2xl font-bold">{report.value}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {report.type} · {report.scam}
              </p>
              <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-semibold">Canales</dt>
                  <dd className="text-muted-foreground">{report.channels.join(", ")}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Fecha y país</dt>
                  <dd className="text-muted-foreground">
                    {report.date} · {report.country}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Monto aproximado</dt>
                  <dd className="text-muted-foreground">
                    {report.amount ? `${report.amount} ${report.currency}` : "No informado"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Contacto privado</dt>
                  <dd className="break-all text-muted-foreground">
                    {report.email || "No informado"}
                  </dd>
                </div>
              </dl>
              <h3 className="mt-6 text-sm font-semibold">Descripción</h3>
              <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{report.description}</p>
              <h3 className="mt-6 text-sm font-semibold">Evidencias privadas</h3>
              {report.evidence.length ? (
                <div className="mt-3 grid gap-4 sm:grid-cols-3">
                  {report.evidence.map((img, i) => (
                    <a
                      key={i}
                      href={img}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Abrir evidencia ${i + 1}`}
                    >
                      <img
                        src={img}
                        alt={`Evidencia privada ${i + 1}`}
                        className="aspect-square w-full rounded-md border object-contain"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Este reporte no tiene imágenes adjuntas.
                </p>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => action("Aprobar")}>
                <Check />
                Aprobar
              </Button>
              <Button variant="outline" onClick={() => action("Rechazar")}>
                <X />
                Rechazar
              </Button>
              <Button variant="destructive" onClick={() => action("Confirmar dato como estafa")}>
                <ShieldCheck />
                Confirmar dato como estafa
              </Button>
              <Button variant="outline" onClick={() => action("Descartar dato")}>
                Descartar dato
              </Button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="form-field">
                <label htmlFor="fusionar">Fusionar duplicado con otro dato</label>
                <select
                  id="fusionar"
                  value={mergeTarget}
                  onChange={(e) => setMergeTarget(e.target.value)}
                >
                  <option value="">Elegí el dato de destino</option>
                  {store.entities
                    .filter((e) => e.id !== report.entityId)
                    .map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.original} · {e.type}
                      </option>
                    ))}
                </select>
              </div>
              <Button
                variant="outline"
                className="self-end"
                disabled={!mergeTarget}
                onClick={() => {
                  update((s) => mergeEntity(s, report.id, mergeTarget));
                  setMergeTarget("");
                  setNotice("Los reportes se fusionaron en el dato elegido.");
                }}
              >
                <GitMerge />
                Fusionar duplicado
              </Button>
            </div>
            <h3 className="mt-8 border-t pt-6 font-bold">Historial de acciones</h3>
            {store.log.filter((l) => l.targetId === report.id).length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Todavía no hay acciones registradas.
              </p>
            ) : (
              store.log
                .filter((l) => l.targetId === report.id)
                .map((l) => (
                  <p key={l.id} className="mt-3 flex items-center gap-2 text-sm">
                    <Clock size={14} className="text-teal" />
                    {new Date(l.date).toLocaleString("es-AR")} · {l.action}
                  </p>
                ))
            )}
          </section>
        )}
        {tab === "revisiones" &&
          (store.reviews.length === 0 ? (
            <EmptyState
              title="No hay solicitudes de revisión"
              text="Las solicitudes nuevas aparecerán acá."
            />
          ) : (
            store.reviews.map((r) => (
              <section key={r.id} className="border-b py-6">
                <span className="chip">{r.status}</span>
                <h2 className="mt-3 break-all text-xl font-bold">{r.value}</h2>
                <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{r.reason}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Contacto privado: {r.contact || "No informado"} ·{" "}
                  {new Date(r.createdAt).toLocaleDateString("es-AR")}
                </p>
                {r.status === "Pendiente" && (
                  <div className="mt-4 flex gap-3">
                    <Button size="sm" onClick={() => reviewAction(r.id, "Resuelta")}>
                      <Check />
                      Resolver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => reviewAction(r.id, "Rechazada")}
                    >
                      <X />
                      Rechazar
                    </Button>
                  </div>
                )}
                {store.log
                  .filter((l) => l.targetId === r.id)
                  .map((l) => (
                    <p key={l.id} className="mt-3 text-xs text-muted-foreground">
                      {new Date(l.date).toLocaleString("es-AR")} · {l.action}
                    </p>
                  ))}
              </section>
            ))
          ))}
      </div>
    </main>
  );
}
