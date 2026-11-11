import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/features/lj/legal";
export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { title: "Términos de uso · LJ" },
      {
        name: "description",
        content: "Condiciones de uso de LJ. Borrador pendiente de revisión legal.",
      },
      { property: "og:title", content: "Términos de uso · LJ" },
      {
        property: "og:description",
        content: "Condiciones de uso de LJ. Borrador pendiente de revisión legal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <LegalPage privacy={false} />,
});
