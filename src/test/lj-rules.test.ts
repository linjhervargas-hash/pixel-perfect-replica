import { describe, expect, it } from 'vitest';
import { confidence, createSeed, detectType, getResult, moderate, normalize, validDate, validEvidenceCount, mergeEntity } from '@/features/lj/data';
describe('LJ confidence rules',()=>{
 it('0 approved reports means no reports',()=>{expect(confidence(0,0,'sin verificar')).toBe('none');});
 it('1 or 2 approved reports means unconfirmed',()=>{expect(confidence(1,1,'sin verificar')).toBe('warning');expect(confidence(2,2,'sin verificar')).toBe('warning');});
 it('3 independent approved reports means very probable fraud',()=>{expect(confidence(3,3,'sin verificar')).toBe('danger');});
 it('multiple reports from one source do not reach the independent threshold',()=>{expect(confidence(5,1,'sin verificar')).toBe('warning');});
 it('confirmed state counts even without reports',()=>{expect(confidence(0,0,'confirmado')).toBe('danger');});
 it('discarded state overrides approved reports',()=>{expect(confidence(5,5,'descartado')).toBe('none');});
 it('pending reports do not count until approved',()=>{const seed=createSeed();const r=seed.reports.find(r=>r.status==='Pendiente');if(!r)throw new Error('Missing pending fixture');expect(getResult(seed,r.value,r.type).approved).toBe(0);const approved=moderate(seed,r.id,'Aprobar','2026-11-11T18:00:00Z');expect(getResult(approved,r.value,r.type).approved).toBe(1);expect(approved.log.at(-1)?.action).toBe('Aprobar');});
 it('distinct source IDs determine independence',()=>{const seed=createSeed();const entity=seed.entities[0];const singleSource={...seed,reports:seed.reports.map(r=>r.entityId===entity.id?{...r,source:'same-browser'}:r)};expect(getResult(singleSource,entity.original,entity.type).independent).toBe(1);expect(getResult(singleSource,entity.original,entity.type).level).toBe('warning');});
 it('merging duplicate entities moves their reports and logs action',()=>{const seed=createSeed();const r=seed.reports[0];const target=seed.entities[1];const merged=mergeEntity(seed,r.id,target.id);expect(merged.entities.some(e=>e.id===r.entityId)).toBe(false);expect(merged.reports.filter(x=>x.entityId===target.id).length).toBe(7);expect(merged.log).toHaveLength(1);});
});
describe('LJ normalization and report limits',()=>{
 it('normalizes telephone to international + without separators',()=>{expect(normalize('+54 (9) 11 0000-0000','Teléfono')).toBe('+5491100000000');});
 it('normalizes link domain and removes tracking and trailing slash',()=>{expect(normalize('https://WWW.EJEMPLO-ESTAFA.test/?utm_source=demo&fbclid=123','Link')).toBe('ejemplo-estafa.test');});
 it('lowercases users and removes @',()=>{expect(normalize('@Usuario_DEMO','Usuario de Instagram')).toBe('usuario_demo');});
 it('lowercases email',()=>{expect(normalize('AYUDA@Ejemplo.TEST','Email')).toBe('ayuda@ejemplo.test');});
 it('recognizes 22 digits as CBU before phone',()=>{expect(detectType('0000000000000000000000')).toBe('CBU o alias');});
 it('rejects future report dates',()=>{expect(validDate('2026-11-12','2026-11-11')).toBe(false);expect(validDate('2026-11-11','2026-11-11')).toBe(true);});
 it('accepts up to 5 evidence images',()=>{expect(validEvidenceCount(5)).toBe(true);expect(validEvidenceCount(6)).toBe(false);});
 it('seeds exactly 15 fictitious entities and 30 reports',()=>{const seed=createSeed();expect(seed.entities).toHaveLength(15);expect(seed.reports).toHaveLength(30);expect(new Set(seed.reports.map(r=>r.scam)).size).toBe(8);});
});
