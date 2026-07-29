import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import Customers from "./pages/Customers";
import Feedback from "./pages/Feedback";

function App() {
  return (
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
  );
}

export default App;