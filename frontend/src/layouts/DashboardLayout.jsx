import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';

const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />
      <div className="main-content">
        <Header onToggleMobile={() => setMobileSidebarOpen(true)} />
        <main className="page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
