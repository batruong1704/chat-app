import React, { useState } from "react";
import ChatContainer from "./components/Chat/ChatContainer";
import LoginForm from "./components/Login/LoginForm";
import { User } from "./types";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <LoginForm onLogin={(userData) => {
          setUser(userData);
          setIsLoggedIn(true);
          console.log(userData);
        }} />
      ) : (
        <ChatContainer 
          username={user?.username || ''} 
          userId={user?.userId || ''}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App