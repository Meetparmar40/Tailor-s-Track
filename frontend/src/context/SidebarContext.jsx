import React, { createContext, useContext, useEffect, useState } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(min-width: 768px)').matches
      : true
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(min-width: 768px)');
    const handleChange = (e) => setIsDesktop(e.matches);
    // Initialize and subscribe
    setIsDesktop(mql.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  const toggleSidebar = () => setCollapsed(!collapsed);
  const setSidebarCollapsed = (value) => setCollapsed(value);

  const sidebarWidth = isDesktop ? (collapsed ? 64 : 256) : 0;

  return (
    <SidebarContext.Provider value={{ 
      collapsed, 
      toggleSidebar, 
      setSidebarCollapsed,
      sidebarWidth,
      isDesktop
    }}>
      {children}
    </SidebarContext.Provider>
  );
};
