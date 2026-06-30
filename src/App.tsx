import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from '@/pages/Landing';
import { Login } from '@/pages/auth/Login';
import { Signup } from '@/pages/auth/Signup';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { Overview } from '@/pages/dashboard/Overview';

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
        {/* Placeholders for other routes */}
        <Route path="/app/onboarding" element={<Overview />} />
        <Route path="/app/preview" element={<Overview />} />
        
        {/* Public Slug */}
        <Route path="/s/:slug" element={<div>Página pública da SmartBio em breve</div>} />
      </Routes>
    </BrowserRouter>
  );
}
