import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { createSeed, type Store } from './data';
const STORAGE_KEY = 'lj-demo-v1';
interface DataContext { store: Store; ready: boolean; storageError: string; update: (fn: (current: Store) => Store) => void; source: () => string }
const Context = createContext<DataContext | undefined>(undefined);
export function DataProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>(createSeed);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) { const parsed = JSON.parse(raw); if (Array.isArray(parsed.entities) && Array.isArray(parsed.reports) && Array.isArray(parsed.reviews) && Array.isArray(parsed.log)) setStore(parsed); } }
    catch { setStorageError('No pudimos leer los datos guardados. Podés seguir usando la demostración.'); }
    setReady(true);
  }, []);
  function update(fn: (current: Store) => Store) {
    setStore(current => {
      const next = fn(current);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setStorageError(''); }
      catch { setStorageError('No se pudieron guardar los cambios en este navegador. Conservá tu evidencia y volvé a intentar.'); }
      return next;
    });
  }
  function source() {
    try { const existing = localStorage.getItem('lj-demo-source'); if (existing) return existing; const id = crypto.randomUUID(); localStorage.setItem('lj-demo-source', id); return id; }
    catch { return 'local-source'; }
  }
  return <Context.Provider value={{ store, ready, storageError, update, source }}>{children}</Context.Provider>;
}
export function useData() { const context = useContext(Context); if (!context) throw new Error('Falta el contexto de datos de LJ'); return context; }
