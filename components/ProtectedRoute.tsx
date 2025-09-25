import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Allow access if user is not anonymous
  if (currentUser && !currentUser.isAnonymous) {
    return <>{children}</>;
  }
  
  // Redirect anonymous users to login page
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;