import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Servicos from './pages/Servicos'
import Agendamento from './pages/Agendamento'
import Contato from './pages/Contato'
import Admin from './pages/Admin'
import Login from './pages/Login'

function AppContent() {
  const location = useLocation();
  const isAdminOrLoginRoute = location.pathname === '/admin' || location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF3EE] text-gray-900 selection:bg-[#C9A96E]/30" style={{ fontFamily: 'Lato, sans-serif' }}>
      {!isAdminOrLoginRoute && <Header />}
      <main className={`flex-grow ${!isAdminOrLoginRoute ? 'pt-24' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/agendamento" element={<Agendamento />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          } />
        </Routes>
      </main>
      {!isAdminOrLoginRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}