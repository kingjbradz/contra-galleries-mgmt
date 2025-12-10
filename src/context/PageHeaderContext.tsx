"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
// --- TYPE DEFINITIONS ---

// 1. The shape of the state object (PageHeader)
interface PageHeaderState {
  title: string;
}

// 2. The shape of the context value that will be exposed to consumers
interface PageHeaderContextValue {
  pageHeader: PageHeaderState;
  setPageHeader: React.Dispatch<React.SetStateAction<PageHeaderState>>;
}

// Initialize the context with a type of PageHeaderContextValue or undefined
// We use 'undefined' because the context value is only available once it's wrapped
const PageHeaderContext = createContext<PageHeaderContextValue | undefined>(undefined);

// --- PROVIDER COMPONENT ---

interface PageHeaderProviderProps {
  children: ReactNode;
}

export const PageHeaderProvider: React.FC<PageHeaderProviderProps> = ({ children }) => {
  const [pageHeader, setPageHeader] = useState<PageHeaderState>({
    title: '',
  });

  // The context value matches the PageHeaderContextValue interface
  const contextValue: PageHeaderContextValue = {
    pageHeader,
    setPageHeader,
  };

  return (
    <PageHeaderContext.Provider value={contextValue}>
      {children}
    </PageHeaderContext.Provider>
  );
};

// --- CUSTOM HOOK ---

export const usePageHeader = (): PageHeaderContextValue => {
  const context = useContext(PageHeaderContext);

  if (context === undefined) {
    // TypeScript will now correctly flag if the hook is used outside the Provider
    throw new Error('usePageHeader must be used within a PageHeaderProvider');
  }

  return context;
};