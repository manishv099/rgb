import './app.scss';
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Otp, ForgetPassword, AdminDashboard, AdminStartGame, AdminGameSetup, AdminMain, AdminSignIn, AdminTransaction, Dashboard, Home, Profile, SignIn, SignUp, Transaction, SignInWithPhone, AdminTransactions} from './pages/';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  const [loader, setLoader] = useState(true);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signin_with_phone" element={<SignInWithPhone />} />
          <Route path="/admin/signin" element={<AdminSignIn />} />
          <Route path="/signup" element={<SignUp  setLoader={setLoader} loader={loader} />} />
          <Route path="/forget_password" element={<ForgetPassword setLoader={setLoader} loader={loader} />} />
          <Route path="/otp_verification" element={<Otp />} />
          <Route path="/dashboard" element={<Dashboard setLoader={setLoader} loader={loader} />} />
          <Route path="/profile" element={<Profile setLoader={setLoader} loader={loader} />} />
          <Route path="/transaction" element={<Transaction setLoader={setLoader} loader={loader} />} />

          <Route path="/admin/dashboard" element={<AdminDashboard setLoader={setLoader} loader={loader} />} />
          <Route path="/admin/game" element={<AdminStartGame setLoader={setLoader} loader={loader} />} />
          <Route path="/admin/transaction_request" element={<AdminTransaction setLoader={setLoader} loader={loader} />} />
          <Route path="/admin/transactions" element={<AdminTransactions setLoader={setLoader} loader={loader} />} />
          <Route path="/admin/game_setup" element={<AdminGameSetup setLoader={setLoader} loader={loader} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
