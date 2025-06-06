import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CourtBooking from "./pages/CourtBooking";
import BadmintonShop from "./pages/BadmintonShop";
import Management from "./pages/Management";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OrderPage from "./pages/OrderPage";
import ProfilePage from "./pages/ProfilePage";
import ApproveOrderPage from "./pages/ApproveOrderPage";
import ShiftRegPage from "./pages/ShiftRegPage";
import TimekeepingPage from "./pages/TimekeepingPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<CourtBooking />} />
        <Route path="/accessories" element={<BadmintonShop />} />
        <Route path="/management" element={<Management />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/approve-order" element={<ApproveOrderPage />} />
        <Route path="/shift" element={<ShiftRegPage />} />  
        <Route path="/timekeeping" element={<TimekeepingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
