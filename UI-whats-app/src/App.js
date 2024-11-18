import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './Components/HomePage';
import Status from "./Components/Status/Status";
import StatusView from './Components/Status/StatusView';
import AuthForm from "./Components/Register/AuthForm";

function App() {
    return (
        <Routes future={{ v7_startTransition: true }}>
            <Route path="/" element={<HomePage />} />
            <Route path="/status" element={<Status />} />
            <Route path="/status/:userId" element={<StatusView />} />
            <Route path="/authform" element={<AuthForm />} />
        </Routes>
    );
}

export default App;