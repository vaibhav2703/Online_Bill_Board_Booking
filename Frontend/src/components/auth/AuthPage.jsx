import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import Registration from './Registration';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
  } 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {isLogin ? (
        <LoginForm onToggleMode={toggleMode} />
      ) : (
        <Registration onRegisterSuccess={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default AuthPage;
