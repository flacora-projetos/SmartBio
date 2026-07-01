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
import { Leads } from '@/pages/dashboard/Leads';
import { Analytics } from '@/pages/dashboard/Analytics';
import { SmartBioPage } from '@/pages/public/SmartBioPage';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Dashboard Routes */}
          <Route path="/app" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
          <Route path="/app/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/app/offers" element={<ProtectedRoute><Offers /></ProtectedRoute>} />
          <Route path="/app/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/app/preview" element={<ProtectedRoute><Preview /></ProtectedRoute>} />
          <Route path="/app/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
          <Route path="/app/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          
          {/* Public Slug */}
          <Route path="/s/:slug" element={<SmartBioPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
