import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Toast } from './components/Toast';

// Views
import { PublicLanding } from './views/PublicLanding';
import { ShopDashboard } from './views/ShopDashboard';
import { RegisterInstrument } from './views/RegisterInstrument';
import { UploadDocuments } from './views/UploadDocuments';
import { RequestVerification } from './views/RequestVerification';
import { TrackStatus } from './views/TrackStatus';
import { InspectorSchedule } from './views/InspectorSchedule';
import { FieldInspection } from './views/FieldInspection';
import { CertificateView } from './views/CertificateView';
import { AdminDashboard } from './views/AdminDashboard';

function AppContent() {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#111827] font-sans antialiased">
      {/* Sleek, Clean Top Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {currentView === 'public-portal' && <PublicLanding />}
        {currentView === 'shop-dashboard' && <ShopDashboard />}
        {currentView === 'register-instrument' && <RegisterInstrument />}
        {currentView === 'upload-documents' && <UploadDocuments />}
        {currentView === 'request-verification' && <RequestVerification />}
        {currentView === 'track-status' && <TrackStatus />}
        {currentView === 'inspector-schedule' && <InspectorSchedule />}
        {currentView === 'field-inspection' && <FieldInspection />}
        {currentView === 'certificate-view' && <CertificateView />}
        {currentView === 'admin-dashboard' && <AdminDashboard />}
      </div>

      {/* Global Notifications Toast */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
