import { create } from 'zustand';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useBudgetStore = create((set, get) => ({
  items: [],
  loadingBudget: false,

  // 1. Escuchar cambios en tiempo real desde Firestore para un usuario específico
  subscribeToBudget: (uid) => {
    if (!uid) {
      set({ items: [] });
      return () => {};
    }

    set({ loadingBudget: true });
    const docRef = doc(db, 'presupuestos', uid);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        set({ items: docSnap.data().items || [], loadingBudget: false });
      } else {
        set({ items: [], loadingBudget: false });
      }
    });

    return unsubscribe;
  },

  // 2. Agregar un destino al presupuesto y guardarlo en Firestore
  addItem: async (uid, destino) => {
    if (!uid) return;
    const currentItems = get().items;

    // Evitar duplicados exactos (opcional: podrías sumar cantidad si prefieres)
    if (currentItems.some((item) => item.id === destino.id)) return;

    const updatedItems = [...currentItems, destino];
    
    // Actualización optimista en Zustand + guardado en Firebase
    set({ items: updatedItems });
    await setDoc(doc(db, 'presupuestos', uid), { items: updatedItems }, { merge: true });
  },

  // 3. Eliminar un destino del presupuesto
  removeItem: async (uid, destinoId) => {
    if (!uid) return;
    const updatedItems = get().items.filter((item) => item.id !== destinoId);

    set({ items: updatedItems });
    await setDoc(doc(db, 'presupuestos', uid), { items: updatedItems }, { merge: true });
  },

  // 4. Limpiar el estado local al cerrar sesión
  clearLocalBudget: () => set({ items: [] }),
}));