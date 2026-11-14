import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { useAuthStore } from './store/useAuthStore';
import { useBudgetStore } from './store/UseBudgetStore';
import PlannerPage from './pages/PlannerPage';
import ReviewsPage from './pages/ReviewsPage';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const subscribeToBudget = useBudgetStore((state) => state.subscribeToBudget);

  useEffect(() => {
    let unsubscribeBudget = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      unsubscribeBudget();

      if (currentUser) {
        unsubscribeBudget = subscribeToBudget(currentUser.uid);
      } else {
        useBudgetStore.getState().clearLocalBudget();
      }
    });

    return () => {
      
      unsubscribeAuth();
      unsubscribeBudget();
    };
  }, [setUser, subscribeToBudget]);

  return (
    
    <BrowserRouter>
      <Navbar />
      <AuthModal />
      <Routes>
        <Route path="/" element={<PlannerPage />} />
  <Route path="/resenas" element={<ReviewsPage />} />
  <Route path="*" element={<NotFoundPage />} />
        <Route path="/" element={<PlannerPage />} />
        <Route path="/resenas" element={<ReviewsPage />} />
      </Routes>
    </BrowserRouter>
  );
}