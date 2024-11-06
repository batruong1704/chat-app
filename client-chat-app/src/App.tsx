import React, { useState } from "react";
import ChatApp from "./components/Chat/ChatApp";
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
            <ChatApp
                username={user?.username || ''}
                currentUserId={user?.id || ''}
                onLogout={handleLogout}
            />
        )}
      </div>
  );
};

export default App;