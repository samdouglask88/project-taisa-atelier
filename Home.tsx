import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface Servico {
  _id: string
  nome: string
  descricao: string
  preco: number
}

export default function Home() {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServicos()
  }, [])

  const fetchServicos = async () => {
    try {
      const response = await fetch('http://localhost:3333/servicos')
      if (response.ok) {
        const data = await response.json()
        setServicos(data.slice(0, 3)) // Show only first 3 services
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
      `}</style>
      {/* Hero Section */}
      <section 
        className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #7B2D42 0%, #C9A0A0 100%)',
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: '#C9A96E' }}></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10" style={{ backgroundColor: '#E8D5A3' }}></div>

        <div className="relative z-10 text-center px-4 md:px-8 max-w-4xl">
          <p 
            className="text-sm md:text-base tracking-[0.3em] mb-4 uppercase"
            style={{ color: '#E8D5A3' }}
          >
            Bem-vinda ao
          </p>
          <h1 
            className="text-5xl md:text-8xl font-bold mb-6 leading-tight animate-fade-in"
            style={{ color: '#FAF3EE', fontFamily: 'Cormorant Garamond, serif' }}
          >
            TAISA
            <br />
            <span className="text-3xl md:text-5xl font-light italic" style={{ color: '#E8D5A3' }}>
              Ateliê de Beleza
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl mb-10 italic tracking-widest opacity-90"
            style={{ color: '#F2D9D9', fontFamily: 'Cormorant Garamond, serif' }}
          >
            A Alma da sua Beleza
          </p>

          <p className="text-base md:text-lg mb-8 leading-relaxed" style={{ color: '#FAF3EE' }}>
            Bem-vinda a um espaço de transformação e autocuidado, onde luxo, sofisticação e elegância se encontram.
          </p>

          <Link
            to="/agendamento"
            className="inline-block px-8 py-4 rounded-lg font-semibold tracking-wider uppercase transition-all duration-300 hover:shadow-lg hover:scale-105"
            style={{
              backgroundColor: '#C9A96E',
              color: '#7B2D42',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E8D5A3'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#C9A96E'
            }}
          >
            Agendar Agora
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p 
            className="text-sm tracking-[0.3em] mb-4 uppercase"
            style={{ color: '#C9A96E' }}
          >
            Descubra
          </p>
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: '#7B2D42', fontFamily: 'Cormorant Garamond, serif' }}
          >
            Nossos Serviços
          </h2>
          <div 
            className="h-1 w-20 mx-auto"
            style={{ backgroundColor: '#C9A96E' }}
          ></div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p style={{ color: '#C9A0A0' }}>Carregando serviços...</p>
          </div>
        ) : servicos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {servicos.map((servico) => (
              <div
                key={servico._id}
                className="group rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                style={{ backgroundColor: '#FAF3EE' }}
              >
                <div 
                  className="h-32 relative overflow-hidden"
                  style={{ backgroundColor: '#F2D9D9' }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div 
                      className="text-5xl font-light"
                      style={{ color: '#C9A96E', opacity: 0.5 }}
                    >
                      ✨
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 
                    className="text-xl font-semibold mb-3 group-hover:text-dourado transition-colors duration-300"
                    style={{ color: '#7B2D42', fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {servico.nome}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#8B7B7B' }}>
                    {servico.descricao}
                  </p>
                  <div className="flex justify-between items-center">
                    <span 
                      className="text-lg font-bold"
                      style={{ color: '#C9A96E' }}
                    >
                      R$ {servico.preco.toFixed(2)}
                    </span>
                    <Link
                      to="/agendamento"
                      className="text-sm font-semibold px-4 py-2 rounded transition-all duration-300 hover:shadow-md"
                      style={{ backgroundColor: '#C9A96E', color: '#7B2D42' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#E8D5A3'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#C9A96E'
                      }}
                    >
                      Agendar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p style={{ color: '#C9A0A0' }}>Nenhum serviço disponível no momento.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/servicos"
            className="inline-block px-6 py-3 rounded-lg font-semibold tracking-wider uppercase transition-all duration-300"
            style={{
              backgroundColor: '#F2D9D9',
              color: '#7B2D42',
              border: '2px solid #C9A96E'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#C9A96E'
              e.currentTarget.style.color = '#7B2D42'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F2D9D9'
              e.currentTarget.style.color = '#7B2D42'
            }}
          >
            Ver Todos os Serviços
          </Link>
        </div>
      </section>

      {/* Highlight Section */}
      <section 
        className="py-20 px-4 md:px-8"
        style={{ backgroundColor: '#F2D9D9' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p 
            className="text-4xl md:text-5xl font-light mb-4 italic"
            style={{ color: '#7B2D42', fontFamily: 'Cormorant Garamond, serif' }}
          >
            A Alma da sua Beleza
          </p>
          <div 
            className="h-1 w-24 mx-auto mb-8"
            style={{ backgroundColor: '#C9A96E' }}
          ></div>
          <p className="text-lg leading-relaxed" style={{ color: '#8B7B7B' }}>
            Em cada procedimento, buscamos realçar sua beleza natural e elevar sua autoconfiança. 
            Nossa equipe de profissionais especializados está comprometida em oferecer a melhor experiência 
            em um ambiente elegante e acolhedor.
          </p>
        </div>
      </section>
    </div>
  )
}
