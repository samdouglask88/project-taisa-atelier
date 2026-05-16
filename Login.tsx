import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && senha.trim()) {
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/admin');
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7B2D42] to-[#C9A0A0] selection:bg-[#C9A96E]/30">
      <div className="bg-[#FAF3EE] p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] max-w-md w-full mx-4 transform transition-all hover:scale-[1.01]">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display text-[#C9A96E] mb-1 tracking-wider">TAISA</h1>
          <h2 className="text-sm font-body uppercase tracking-[0.3em] text-[#7B2D42] opacity-80">Ateliê de Beleza</h2>
          <div className="h-px w-16 bg-[#C9A96E] mx-auto mt-4"></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="mb-4">
            <label htmlFor="email" className="block text-[#7B2D42] font-body font-semibold mb-1.5 ml-1">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#C9A0A0]/30 rounded-xl focus:outline-none focus:border-[#C9A96E] focus:ring-4 focus:ring-[#C9A96E]/10 transition-all bg-white/50"
              placeholder="seu@email.com"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="senha" className="block text-[#7B2D42] font-body font-semibold mb-1.5 ml-1">Senha</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#C9A0A0]/30 rounded-xl focus:outline-none focus:border-[#C9A96E] focus:ring-4 focus:ring-[#C9A96E]/10 transition-all bg-white/50"
              placeholder="Sua senha"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#C9A96E] text-[#FAF3EE] font-body font-bold py-3 px-4 rounded-xl hover:bg-[#B8985E] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-[#C9A96E]/20 mt-4"
          >
            Entrar
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="#" className="text-[#C9A0A0] text-sm hover:text-[#7B2D42] transition-colors duration-300 font-body">Esqueci minha senha</a>
        </div>
      </div>
    </div>
  );
};

export default Login;