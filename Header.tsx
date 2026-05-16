import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'Início', path: '/' },
    { label: 'Serviços', path: '/servicos' },
    { label: 'Agendamento', path: '/agendamento' },
    { label: 'Contato', path: '/contato' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-[#7B2D42]/95 backdrop-blur-md py-5 px-4 md:px-8 border-b-2 border-[#C9A96E]/30 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col group cursor-pointer transition-transform duration-300 hover:scale-105">
          <span 
            className="text-3xl md:text-4xl font-display font-bold tracking-[0.2em] text-[#C9A96E]"
            style={{ color: '#C9A96E', fontFamily: 'Cormorant Garamond, serif' }}
          >
            TAISA
          </span>
          <span 
            className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#F2D9D9] opacity-80"
            style={{ color: '#F2D9D9', fontFamily: 'Cormorant Garamond, serif' }}
          >
            Ateliê de Beleza
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-10">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="relative text-xs tracking-[0.2em] uppercase font-semibold text-[#F2D9D9] transition-all duration-300 hover:text-[#C9A96E] group"
              style={{ color: '#F2D9D9' }}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C9A96E] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-rosa-claro hover:text-dourado transition-colors duration-300"
          style={{ color: '#F2D9D9' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden mt-4 pb-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="block px-4 py-2 text-sm tracking-wider uppercase font-medium rounded transition-colors duration-300"
              style={{ color: '#F2D9D9' }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(201, 160, 110, 0.1)'
                e.currentTarget.style.color = '#C9A96E'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#F2D9D9'
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}