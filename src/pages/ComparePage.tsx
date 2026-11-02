import React from 'react';
import { Navigate } from 'react-router-dom';

// Product comparison is omitted from the application per specifications.
// Any direct visit to /compare redirects to /favourites.
export const ComparePage: React.FC = () => {
  return <Navigate to="/favourites" replace />;
};
