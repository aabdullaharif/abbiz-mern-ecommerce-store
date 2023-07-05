import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Commen/Header";
import {
  Home,
  Auth,
  RegisterPage,
  ForgotPassword,
  ResetPassword,
  Admin,
} from "./layouts";
import Message from "./components/Commen/Message";
import PrivateRoute from "./components/Commen/PrivateRoute";

const App = () => {
  return (
    <>
      <Router>
        <Header />
        <ToastContainer />
        <main>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/password/reset/:id" element={<ResetPassword />} />
            <Route
              path="/message"
              element={<Message message="Please Check Your Inbox" />}
            />

            {/* Private Routes */}
            <Route path="" element={<PrivateRoute />}>
              <Route path="/admin/dashboard" exact element={<Admin />} />
            </Route>
          </Routes>
        </main>
      </Router>
    </>
  );
};

export default App;
