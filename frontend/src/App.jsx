import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ContestProvider } from "./context/ContestContext";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Home from "./Pages/Home/Home.jsx";
import AdminPanel from "./Pages/AdminPanel/AdminPanel.jsx";

function App() {
  return (
    <ContestProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </ContestProvider>
  );
}

export default App;
