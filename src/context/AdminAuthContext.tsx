import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  adminLogin,
  adminVerifySession,
  adminGetStatus,
  removeStoredToken,
  AdminStatus,
  getStoredToken,
} from '../services/adminApi';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  adminStatus: AdminStatus | null;
  login: (password: string) => Promise<{ success: boolean; error?: string; lockoutSeconds?: number }>;
  logout: () => void;
  refreshStatus: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [adminStatus, setAdminStatus] = useState<AdminStatus | null>(null);

  const refreshStatus = async () => {
    const status = await adminGetStatus();
    setAdminStatus(status);
  };

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      setIsLoading(true);
      const token = getStoredToken();
      if (!token) {
        if (mounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
        return;
      }

      const valid = await adminVerifySession();
      if (mounted) {
        setIsAuthenticated(valid);
        if (!valid) {
          removeStoredToken();
        }
        setIsLoading(false);
      }
    }

    checkAuth();
    refreshStatus();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (password: string) => {
    const res = await adminLogin(password);
    if (res.success) {
      setIsAuthenticated(true);
      await refreshStatus();
    }
    return res;
  };

  const logout = () => {
    removeStoredToken();
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        adminStatus,
        login,
        logout,
        refreshStatus,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth(): AdminAuthContextType {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
