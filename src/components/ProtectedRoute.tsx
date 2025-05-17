// 
// import React from 'react';
// import { Navigate } from 'react-router-dom';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// export default function ProtectedRoute({ children }: ProtectedRouteProps) {
//   // TODO: Replace with actual authentication check
//   const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

//   if (!isAuthenticated) {
//     return <Navigate to="/auth" replace />;
//   }

//   return <>{children}</>;
// } 
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import { motion } from "framer-motion";
import { auth } from "./ui/firebase";

export default function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
      >
        Loading...
      </motion.div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return children;
}