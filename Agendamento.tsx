import { useState, useEffect } from 'react'

interface Servico {
  _id: string
  nome: string
  descricao: string
  preco: number
  duracao?: number
}

interface FormData {
  step: number
  servico: string
  data: string
  hora: string
  nome: string
  email: string
  telefone: string
  observacoes: string
}

const AVAILABLE_HOURS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
]

export default function Agendamento() {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    step: 1,
    servico: '',
    data: '',
    hora: '',
    nome: '',
    email: '',
    telefone: '',
    observacoes: '',
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetchServicos()
  }, [])

  const fetchServicos = async () => {
    try {
      const response = await fetch('http://localhost:3333/servicos')
      if (response.ok) {
        const data = await response.json()
        setServicos(data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNextStep = () => {
    if (formData.step < 4) {
      setFormData(prev => ({ ...prev, step: prev.step + 1 }))
    }
  }

  const handlePrevStep = () => {
    if (formData.step > 1) {
      setFormData(prev => ({ ...prev, step: prev.step - 1 }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('http://localhost:3333/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
      }
    } catch (error) {
      console.error('Erro ao realizar agendamento:', error)
    }

    setTimeout(() => {
      setFormData({
        step: 1,
        servico: '',
        data: '',
        hora: '',
        nome: '',
        email: '',
        telefone: '',
        observacoes: '',
      })
      setSubmitted(false)
    }, 3000)
  }

  const selectedService = servicos.find(s => s._id === formData.servico)
  const today = new Date().toISOString().split('T')[0]

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 overflow-hidden">
        <style>{`
          @keyframes reveal {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-reveal { animation: reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #C9A96E; border-radius: 10px; }
        `}</style>
        <div className="text-center animate-reveal">
          <div className="mb-8 animate-scale-in flex flex-col items-center">
            <div className="w-24 h-24 bg-[#C9A96E] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#C9A96E]/40 border-4 border-white">
              <span className="text-4xl text-[#7B2D42]">✓</span>
            </div>
            <h2 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: '#7B2D42', fontFamily: 'Cormorant Garamond, serif' }}
            >
              Agendamento Realizado!
            </h2>
            <p className="text-xl mb-4 italic" style={{ color: '#8B7B7B' }}>
              Agradecemos por escolher a Taisa Ateliê de Beleza.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 px-4 md:px-8 bg-[#FAF3EE]/50 min-h-screen">
      <style>{`
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-step-in { animation: slideRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
      `}</style>
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-reveal">
          <p className="text-[#C9A96E] uppercase tracking-[0.5em] text-xs font-black mb-3 drop-shadow-sm">Experiência Exclusiva</p>
          <h1 
            className="text-5xl md:text-7xl font-bold mb-4"
            style={{ color: '#7B2D42', fontFamily: 'Cormorant Garamond, serif' }}
          >
            Agende seu Atendimento
          </h1>
          <div className="h-1 w-24 bg-[#C9A96E] mx-auto rounded-full opacity-40 shadow-sm"></div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="flex justify-between mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex-1 text-center relative group">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto font-bold text-base mb-3 transition-all duration-500 z-10 relative ${
                    formData.step >= step ? 'shadow-md' : ''
                  }`}
                  style={{
                    backgroundColor: formData.step >= step ? '#C9A96E' : '#F2D9D9',
                    color: formData.step >= step ? '#7B2D42' : '#C9A0A0',
                  }}
                >
                  {step}
                </div>
                <p className={`text-[10px] uppercase tracking-widest font-bold transition-colors duration-300 ${formData.step >= step ? 'text-[#7B2D42]' : 'text-[#C9A0A0]'}`}>
                  {['Serviço', 'Data/Hora', 'Dados', 'Confirmação'][step - 1]}
                </p>
              </div>
            ))}
          </div>
          <div className="w-full h-0.5 bg-[#F2D9D9] rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-700 ease-out"
              style={{
                width: `${(formData.step - 1) * 33.33 + 33.33}%`,
                backgroundColor: '#C9A96E'
              }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-10 bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-[#7B2D42]/10 border border-[#F2D9D9] transition-all duration-500">
          {/* Step 1: Service Selection */}
          {formData.step === 1 && (
            <div className="space-y-8 animate-step-in">
              <h2 
                className="text-3xl font-bold text-center"
                style={{ color: '#7B2D42', fontFamily: 'Cormorant Garamond, serif' }}
              >
                O que deseja realizar hoje?
              </h2>

              {loading ? (
                <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C9A96E]"></div></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {servicos.map((servico) => (
                    <label
                      key={servico._id}
                      className="flex items-center p-6 rounded-3xl cursor-pointer transition-all duration-500 hover:shadow-2xl border-2 group relative overflow-hidden active:scale-[0.98]"
                      style={{
                        backgroundColor: formData.servico === servico._id ? '#FAF3EE' : 'white',
                        borderColor: formData.servico === servico._id ? '#C9A96E' : '#F2D9D9/50'
                      }}
                    >
                      <input
                        type="radio"
                        name="servico"
                        value={servico._id}
                        checked={formData.servico === servico._id}
                        onChange={handleInputChange}
                        className="w-5 h-5 mr-4 cursor-pointer"
                      />
                      <div className="flex-grow">
                        <p className="font-bold text-lg mb-1" style={{ color: '#7B2D42' }}>
                          {servico.nome}
                        </p>
                        <p className="text-sm" style={{ color: '#8B7B7B' }}>
                          {servico.descricao}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold" style={{ color: '#C9A96E' }}>
                          R$ {servico.preco.toFixed(2)}
                        </p>
                        {servico.duracao && (
                          <p className="text-xs" style={{ color: '#C9A0A0' }}>
                            {servico.duracao} min
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Date and Time */}
          {formData.step === 2 && (
            <div className="space-y-8 animate-step-in">
              <h2 
                className="text-3xl font-bold text-center"
                style={{ color: '#7B2D42', fontFamily: 'Cormorant Garamond, serif' }}
              >
                Selecione sua Preferência
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-4 text-[#7B2D42]/60">
                    1. Escolha o dia
                  </label>
                  <input
                    type="date"
                    name="data"
                    value={formData.data}
                    onChange={handleInputChange}
                    min={today}
                    required
                    className="w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none bg-white border-[#FAF3EE] focus:border-[#C9A96E] text-[#7B2D42] font-semibold shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-4 text-[#7B2D42]/60">
                    2. Escolha o horário
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {AVAILABLE_HOURS.map((hour) => (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, hora: hour }))}
                        className={`py-3 rounded-xl text-sm font-bold transition-all duration-300 border-2 ${
                          formData.hora === hour ? 'bg-[#C9A96E] border-[#C9A96E] text-[#7B2D42] shadow-lg scale-105' 
                          : 'bg-white border-[#FAF3EE] text-[#8B7B7B] hover:border-[#C9A96E]/30'
                        }`}
                      >
                        {hour}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Client Data */}
          {formData.step === 3 && (
            <div className="space-y-8 animate-step-in">
              <h2 
                className="text-3xl font-bold text-center"
                style={{ color: '#7B2D42', fontFamily: 'Cormorant Garamond, serif' }}
              >
                Informações de Contato
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2 text-[#7B2D42]">Nome</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-[#FAF3EE] focus:border-[#C9A96E] outline-none transition-all focus:bg-white bg-[#FAF3EE]/30 shadow-inner"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2 text-[#7B2D42]">WhatsApp</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-[#FAF3EE] focus:border-[#C9A96E] outline-none transition-all focus:bg-white bg-[#FAF3EE]/30 shadow-inner"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2 text-[#7B2D42]">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-[#FAF3EE] focus:border-[#C9A96E] outline-none transition-all focus:bg-white bg-[#FAF3EE]/30 shadow-inner"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {formData.step === 4 && (
            <div className="space-y-8 animate-step-in text-center">
              <h2 
                className="text-3xl font-bold"
                style={{ color: '#7B2D42', fontFamily: 'Cormorant Garamond, serif' }}
              >
                Tudo pronto para você brilhar
              </h2>

              <div className="bg-[#FAF3EE] p-10 rounded-[2.5rem] space-y-6 max-w-md mx-auto border border-[#C9A96E]/20 shadow-xl">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] font-bold mb-2">Serviço</p>
                  <p className="text-2xl font-bold text-[#7B2D42]">{selectedService?.nome}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] font-bold mb-2">Data</p>
                    <p className="font-bold text-[#7B2D42]">{new Date(formData.data).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] font-bold mb-2">Hora</p>
                    <p className="font-bold text-[#7B2D42]">{formData.hora}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col md:flex-row gap-6 pt-10">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={formData.step === 1}
              className="flex-1 py-5 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all duration-300 border-2 border-[#FAF3EE] text-[#C9A0A0] hover:text-[#7B2D42] disabled:opacity-0 disabled:cursor-default"
            >
              ← Voltar
            </button>

            {formData.step === 4 ? (
              <button
                type="submit"
                className="flex-[2] py-5 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all duration-500 hover:scale-[1.03] active:scale-95 shadow-lg shadow-[#C9A96E]/30 bg-[#C9A96E] text-[#7B2D42] hover:bg-[#E8D5A3] cursor-pointer"
              >
                Finalizar Agendamento
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={
                  (formData.step === 1 && !formData.servico) ||
                  (formData.step === 2 && (!formData.data || !formData.hora)) ||
                  (formData.step === 3 && (!formData.nome || !formData.email || !formData.telefone))
                }
                className="flex-[2] py-5 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all duration-500 hover:scale-[1.03] active:scale-95 shadow-lg shadow-[#C9A96E]/30 bg-[#7B2D42] text-[#FAF3EE] hover:bg-[#913D54] disabled:opacity-30 disabled:hover:scale-100 cursor-pointer"
              >
                Próximo →
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
