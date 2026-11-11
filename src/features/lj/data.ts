export const SAFETY_MESSAGE = 'LJ nunca cobra ni te pide contraseñas. Ninguna entidad seria cobra por adelantado para recuperar dinero.';
export const CONFIDENCE_THRESHOLDS = { unconfirmedMin: 1, probableMin: 3 };
export const DATA_TYPES = ['Teléfono', 'Link', 'Usuario de Instagram', 'Usuario de Telegram', 'Número de WhatsApp', 'Email', 'Billetera cripto', 'CBU o alias', 'Mensaje de texto', 'Otro'];
export const SCAM_TYPES = ['Oferta de trabajo por tareas', 'Recuperación de fondos', 'Inversión o cripto', 'Romance', 'Link falso (phishing)', 'Compra o venta falsa', 'Se hicieron pasar por un banco o familiar', 'Otra'];
export const CHANNELS = ['Instagram', 'WhatsApp', 'Telegram', 'Llamada', 'SMS', 'Email', 'Facebook', 'LinkedIn', 'Sitio web', 'Otro'];
export const COUNTRIES = ['Argentina', 'Uruguay', 'Chile', 'Bolivia', 'Brasil', 'Colombia', 'Costa Rica', 'Cuba', 'Ecuador', 'El Salvador', 'España', 'Estados Unidos', 'Guatemala', 'Honduras', 'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 'Puerto Rico', 'República Dominicana', 'Venezuela', 'Otro'];
export type EntityState = 'sin verificar' | 'confirmado' | 'descartado';
export type ReportStatus = 'Pendiente' | 'Aprobado' | 'Rechazado';
export type Level = 'none' | 'warning' | 'danger';
export interface Entity { id: string; type: string; original: string; normalized: string; state: EntityState; demo: boolean }
export interface Report { id: string; entityId: string; type: string; value: string; scam: string; channels: string[]; date: string; country: string; description: string; evidence: string[]; amount?: string; currency?: string; email?: string; source: string; status: ReportStatus; createdAt: string; demo: boolean }
export interface Review { id: string; value: string; reason: string; contact: string; status: 'Pendiente' | 'Resuelta' | 'Rechazada'; createdAt: string }
export interface ModerationLog { id: string; targetId: string; action: string; date: string }
export interface Store { entities: Entity[]; reports: Report[]; reviews: Review[]; log: ModerationLog[]; queries: number }
export function detectType(value: string): string | undefined {
  const v = value.trim();
  if (/^\d{22}$/.test(v)) return 'CBU o alias';
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Email';
  if (v.startsWith('@') && /^@[\w.]+$/.test(v)) return 'Usuario de Instagram';
  if (/^(https?:\/\/|www\.)/i.test(v) || /^[\w-]+\.[a-z]{2,}(\/\S*)?$/i.test(v)) return 'Link';
  if (/^\+?[\d\s()-]{8,}$/.test(v) && v.replace(/\D/g, '').length >= 8) return 'Teléfono';
  if (/^[a-zA-Z0-9]{26,120}$/.test(v)) return 'Billetera cripto';
  if (/^[a-zA-Z][\w]*\.[\w.]+$/.test(v)) return 'CBU o alias';
  return undefined;
}
export function normalize(value: string, type: string): string {
  const v = value.trim();
  if (['Teléfono', 'Número de WhatsApp'].includes(type)) return '+' + v.replace(/\D/g, '');
  if (type === 'Link') {
    try {
      const url = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
      url.hostname = url.hostname.toLowerCase().replace(/^www\./, '');
      [...url.searchParams.keys()].forEach(k => { if (/^(utm_|fbclid|gclid|ref$)/i.test(k)) url.searchParams.delete(k); });
      return url.hostname + url.pathname.replace(/\/+$/, '') + url.search;
    } catch { return v.toLowerCase().replace(/^www\./, '').replace(/\/$/, ''); }
  }
  if (type.includes('Usuario')) return v.toLowerCase().replace(/^@/, '');
  if (['Email', 'CBU o alias'].includes(type)) return v.toLowerCase();
  return v;
}
export function confidence(approvedCount: number, independentCount: number, state: EntityState): Level {
  if (state === 'descartado') return 'none';
  if (state === 'confirmado' || independentCount >= CONFIDENCE_THRESHOLDS.probableMin) return 'danger';
  return approvedCount >= CONFIDENCE_THRESHOLDS.unconfirmedMin ? 'warning' : 'none';
}
export function getResult(store: Store, value: string, type: string) {
  const normalized = normalize(value, type);
  const entity = store.entities.find(e => e.normalized === normalized && (e.type === type || (e.type.includes('Usuario') && type.includes('Usuario')) || (['Teléfono', 'Número de WhatsApp'].includes(e.type) && ['Teléfono', 'Número de WhatsApp'].includes(type))));
  const approved = entity ? store.reports.filter(r => r.entityId === entity.id && r.status === 'Aprobado') : [];
  const independent = new Set(approved.map(r => r.source)).size;
  return { entity, normalized, approved: approved.length, independent, level: confidence(approved.length, independent, entity?.state ?? 'sin verificar'), scams: [...new Set(approved.map(r => r.scam))], lastReport: approved.map(r => r.date).sort().at(-1) };
}
export function validDate(date: string, today: string) { return /^\d{4}-\d{2}-\d{2}$/.test(date) && date <= today && !Number.isNaN(Date.parse(date)); }
export function validEvidenceCount(count: number) { return count <= 5; }
export function createSeed(): Store {
  const values = ['+54 9 11 0000-0000', 'ejemplo-estafa.test', '@tareas_demo_lj', 'ayuda@recuperacion.test', 'inversion-demo.test', '@romance_demo_lj', '+54 9 11 0000-0001', '0000000000000000000000', '0x0000000000000000000000000000000000000000', 'banco-falso.test', '@ventas_demo_lj', 'premios@ejemplo.test', 'alias.demo.lj', '@soporte_demo_lj', '+54 9 11 0000-0002'];
  const types = ['Teléfono', 'Link', 'Usuario de Instagram', 'Email', 'Link', 'Usuario de Telegram', 'Número de WhatsApp', 'CBU o alias', 'Billetera cripto', 'Link', 'Usuario de Instagram', 'Email', 'CBU o alias', 'Usuario de Telegram', 'Teléfono'];
  const entities: Entity[] = values.map((original, i) => ({ id: `demo-e-${i}`, original, normalized: normalize(original, types[i]), type: types[i], state: i === 9 ? 'confirmado' : i === 14 ? 'descartado' : 'sin verificar', demo: true }));
  const distribution = [4, 3, 3, 2, 4, 1, 2, 1, 3, 1, 2, 1, 1, 1, 1];
  let n = 0;
  const reports: Report[] = entities.flatMap((entity, i) => Array.from({ length: distribution[i] }, (_, j) => {
    n++;
    return { id: `demo-r-${n}`, entityId: entity.id, type: entity.type, value: entity.original, scam: SCAM_TYPES[i % SCAM_TYPES.length], channels: [CHANNELS[i % CHANNELS.length]], date: `2026-11-${String(Math.max(1, 10 - j)).padStart(2, '0')}`, country: 'Argentina', description: 'Reporte ficticio de demostración. Me contactaron con una propuesta que pedía un pago por adelantado. Guardé los mensajes y corté el contacto.', evidence: [], source: `demo-source-${n}`, status: i >= 12 ? 'Pendiente' : 'Aprobado', createdAt: `2026-11-${String(Math.max(1, 10 - j)).padStart(2, '0')}T12:00:00Z`, demo: true };
  }));
  return { entities, reports, reviews: [{ id: 'demo-review', value: '+54 9 11 0000-0002', reason: 'Solicitud ficticia: este dato de demostración fue marcado por error.', contact: '', status: 'Pendiente', createdAt: '2026-11-09T12:00:00Z' }], log: [], queries: 1284 };
}
export const DEMO_CREDENTIALS = { email: 'admin@lj.demo', password: 'LJ-demo-2026' };
export function moderate(store: Store, reportId: string, action: string, date = new Date().toISOString()): Store {
  const report = store.reports.find(r => r.id === reportId);
  if (!report) return store;
  const status = action === 'Aprobar' ? 'Aprobado' : action === 'Rechazar' ? 'Rechazado' : undefined;
  const state = action === 'Confirmar dato como estafa' ? 'confirmado' : action === 'Descartar dato' ? 'descartado' : undefined;
  return { ...store, reports: store.reports.map(r => r.id === reportId && status ? { ...r, status } : r), entities: store.entities.map(e => e.id === report.entityId && state ? { ...e, state } : e), log: [...store.log, { id: crypto.randomUUID(), targetId: reportId, action, date }] };
}
export function mergeEntity(store: Store, reportId: string, targetId: string): Store {
  const report = store.reports.find(r => r.id === reportId);
  const target = store.entities.find(e => e.id === targetId);
  if (!report || !target || targetId === report.entityId) return store;
  const originId = report.entityId;
  return { ...store, entities: store.entities.filter(e => e.id !== originId), reports: store.reports.map(r => r.entityId === originId ? { ...r, entityId: targetId } : r), log: [...store.log, { id: crypto.randomUUID(), targetId: reportId, action: `Fusionar duplicado con ${target.original}`, date: new Date().toISOString() }] };
}
