import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types/types';
import { socket } from '../socket';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (userData: User, accessToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData: User, accessToken: string) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', accessToken);
  };

  const logout = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const roomId = localStorage.getItem('currentRoomId'); 

    if (socket.connected && roomId && user?._id) {
      socket.emit('room:leave', { roomId, userId: user._id });
    }

    socket.disconnect();

    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentRoomId');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
