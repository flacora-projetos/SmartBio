import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from '@/pages/Landing';
import { Login } from '@/pages/auth/Login';
import { Signup } from '@/pages/auth/Signup';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { Overview } from '@/pages/dashboard/Overview';
import { Onboarding } from '@/pages/dashboard/Onboarding';
import { Offers } from '@/pages/dashboard/Offers';
import { Quiz } from '@/pages/dashboard/Quiz';
import { Preview } from '@/pages/dashboard/Preview';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Dashboard Routes */}
        <Route path="/app" element={<Overview />} />
        <Route path="/app/onboarding" element={<Onboarding />} />
        <Route path="/app/offers" element={<Offers />} />
        <Route path="/app/quiz" element={<Quiz />} />
        <Route path="/app/preview" element={<Preview />} />
        
        {/* Public Slug */}
        <Route path="/s/:slug" element={<div>Página pública da SmartBio em breve</div>} />
      </Routes>
    </BrowserRouter>
  );
}
