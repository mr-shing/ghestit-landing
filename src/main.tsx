import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Login from './pages/auth/Login';
import Terms from './pages/Terms';
import Download from './pages/Download';
import AppLayout from './pages/app/AppLayout';
import Installments from './pages/app/Installments';
import Credits from './pages/app/Credits';
import Companies from './pages/app/Companies';
import CreateCompany from './pages/app/CreateCompany';
import Tickets from './pages/app/Tickets';
import TicketDetail from './pages/app/TicketDetail';
import ChangePassword from './pages/app/ChangePassword';
import PaymentResult from './pages/app/PaymentResult';
import Referral from './pages/app/Referral';
import { captureReferralCode } from './lib/referral';

// Park an ?ref= invite before the router rewrites the URL; signup reads it back.
captureReferralCode();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Marketing site */}
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/download" element={<Download />} />
          <Route path="/install" element={<Navigate to="/download" replace />} />

          {/* Ported customer app (auth required) */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="installments" replace />} />
            <Route path="installments" element={<Installments />} />
            <Route path="credits" element={<Credits />} />
            <Route path="companies" element={<Companies />} />
            <Route path="companies/create" element={<CreateCompany />} />
            <Route path="referral" element={<Referral />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="tickets/:id" element={<TicketDetail />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="payment-result" element={<PaymentResult />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
