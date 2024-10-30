import React, { useState } from "react";
import ChatContainer from "./components/Chat/ChatContainer";
import LoginForm from "./components/Login/LoginForm";
import { User } from "./types";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  console.log("Current user state:", user);

  return (
      <div className="App">
        {!user ? (
            <LoginForm onLogin={setUser} />
        ) : (
            <ChatContainer username={user.username} />
        )}
      </div>
  );
};

export default App