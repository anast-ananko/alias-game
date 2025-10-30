import type { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../hooks';

interface AuthRouteProps {
  children: ReactNode;
}

const AuthRoute: FC<AuthRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation(); 

  const restrictedPaths = ['/', '/sign-in', '/sign-up'];

  if (
    !isLoading &&
    isAuthenticated &&
    restrictedPaths.includes(location.pathname)
  ) {
    return <Navigate to="/main" replace />;
  }

  return <>{children}</>;
};

export default AuthRoute;
