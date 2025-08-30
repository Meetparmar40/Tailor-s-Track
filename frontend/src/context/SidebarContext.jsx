import React, { createContext, useContext, useState } from 'react';

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

  const toggleSidebar = () => setCollapsed(!collapsed);
  const setSidebarCollapsed = (value) => setCollapsed(value);

  const sidebarWidth = collapsed ? 64 : 256;

  return (
    <SidebarContext.Provider value={{ 
      collapsed, 
      toggleSidebar, 
      setSidebarCollapsed,
      sidebarWidth 
    }}>
      {children}
    </SidebarContext.Provider>
  );
};
