# LJ data boundary and hosted connection

This delivery is deliberately browser-local, as requested. `DataProvider` hydrates persisted demo data after mount, while `data.ts` owns normalization, independent-source counting, approval rules and moderation transforms. No real server authentication or database security is implemented; demo access must never protect sensitive data.

## Replacement adapter

Replace provider persistence with authenticated hosted queries/mutations without moving the confidence rules into UI components. Public queries must return explicit public DTOs, never the full Store or Report objects. Only return normalized/original reported identifier, type, approved count, independent count, state, last report date and scam categories. Pending reports and reporter information are never public.

## Proposed table contract (not provisioned)

- `entidades`: id, tipo, valor_original, valor_normalizado, total_reportes_aprobados, reportes_independientes, estado, ultimo_reporte, created_at, demo. Unique canonical identity using type family plus normalized value.
- `reportes`: id, entidad_id, tipo_estafa, canales, fecha_hecho, pais, descripcion, monto, moneda, fuente_id, estado, created_at, demo. Independent sources require a stronger production strategy than browser IDs; those can be reset or forged.
- `evidencias`: id, reporte_id, private_storage_path, mime_type, created_at. Store private files, never public URLs or inline data URLs.
- `contactos_reportantes`: id, reporte_id, email, created_at. Private contact data separated from reports.
- `revisiones`: id, dato, motivo, contacto_optional, estado, created_at, resolved_at.
- `moderacion_log`: id, actor_admin_id, target_id, action, timestamp, old_state, new_state. Append-only and server-authored.

## Security requirements before real use

Public visitors may read only public entity fields and submit a pending report/review. They cannot set approved status, write counts, read reports or evidence, access contact data or write moderation history. Public submissions need server validation, abuse prevention, upload type/size checks, and an idempotency strategy. Counts and statuses are updated transactionally by verified administrator actions only.

Moderation requires real sign-in and a server-verified administrator role. Evidence, reporter contacts, report details and review contacts are restricted to administrators. Use private storage with short-lived administrator-authorized image access. Do not rely on route hiding or the demo password.

Connect Lovable Cloud, provision tables and explicit row-level policies, configure real administrator authorization and private file storage, replace the local adapter, then verify anonymous submission and authenticated moderation end-to-end. Review the legal drafts and retention policy before public launch. No hosted service was enabled for this prototype.
