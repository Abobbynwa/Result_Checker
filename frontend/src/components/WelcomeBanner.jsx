import React from 'react';
import { useAuth } from '../context/AuthContext';

const WelcomeBanner = () => {
  const { user } = useAuth();

  return (
    <div className="banner">
      <h1>👋 Welcome to Abobby International College</h1>
      {user?.name && <p>🔑 Logged in as: {user.name}</p>}
    </div>
  );
};

export default WelcomeBanner;
