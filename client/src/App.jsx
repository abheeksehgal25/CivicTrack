import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginRegister from './pages/LoginRegister';
import ReportIssuePage from './pages/ReportIssuePage';
import MyIssuesPage from './pages/MyIssuesPage';
import IssueDetailPage from './pages/IssueDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginRegister />} />
            <Route path="/report" element={<ReportIssuePage />} />
            <Route path="/my-issues" element={<MyIssuesPage />} />
            <Route path="/issue/:id" element={<IssueDetailPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
