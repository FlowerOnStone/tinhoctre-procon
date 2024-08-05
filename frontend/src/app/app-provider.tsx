'use client';

import { UserType } from '@/schema/user';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AppContext = createContext<{
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}>({
  user: null,
  setUser: () => {},
});
export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};
export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserType | null>(null);
  const setUser = useCallback(
    (user: UserType | null) => {
      setUserState(user);
      localStorage.setItem('user', JSON.stringify(user));
    },
    [setUserState]
  );

  useEffect(() => {
    const _user = localStorage.getItem('user');
    setUserState(_user ? JSON.parse(_user) : null);
  }, [setUserState]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
