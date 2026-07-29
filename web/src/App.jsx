import { Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import Customers from "./pages/Customers";
import Feedback from "./pages/Feedback";

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/companies"
          element={
            <Layout>
              <Companies />
            </Layout>
          }
        />
        <Route
          path="/customers"
          element={
            <Layout>
              <Customers />
            </Layout>
          }
        />
        <Route
          path="/feedback"
          element={
            <Layout>
              <Feedback />
            </Layout>
          }
        />
      </Routes>
    </ToastProvider>
  );
}

export default App;