import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Servico {
  _id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao?: number;
}

interface Agendamento {
  _id: string;
  cliente: string;
  servico: string;
  data: string;
  hora: string;
  status: 'confirmado' | 'cancelado' | 'concluido';
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inicio' | 'agendamentos' | 'servicos'>('inicio');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    duracao: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const servicesResponse = await fetch('http://localhost:3333/servicos');
      if (servicesResponse.ok) {
        const data = await servicesResponse.json();
        setServicos(data);
      }
      // Mock agendamentos
      setAgendamentos([
        {
          _id: '1',
          cliente: 'Maria Silva',
          servico: 'Corte e Coloração',
          data: new Date().toISOString().split('T')[0],
          hora: '14:00',
          status: 'confirmado'
        },
        {
          _id: '2',
          cliente: 'Ana Costa',
          servico: 'Manicure Gel',
          data: new Date().toISOString().split('T')[0],
          hora: '15:30',
          status: 'confirmado'
        },
        {
          _id: '3',
          cliente: 'João Santos',
          servico: 'Barba Completa',
          data: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          hora: '10:00',
          status: 'confirmado'
        }
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitServico = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nome: formData.nome,
      descricao: formData.descricao,
      preco: parseFloat(formData.preco),
      duracao: formData.duracao ? parseInt(formData.duracao) : undefined,
    };

    try {
      if (editingId) {
        const response = await fetch(`http://localhost:3333/servicos/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          setServicos(servicos.map(s => s._id === editingId ? { ...s, ...payload } : s));
          setEditingId(null);
        }
      } else {
        const response = await fetch('http://localhost:3333/servicos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const newServico = await response.json();
          setServicos([...servicos, newServico]);
        }
      }

      setFormData({ nome: '', descricao: '', preco: '', duracao: '' });
      setShowModal(false);
    } catch (error) {
      console.error('Error submitting service:', error);
    }
  };

  const handleEdit = (servico: Servico) => {
    setFormData({
      nome: servico.nome,
      descricao: servico.descricao,
      preco: servico.preco.toString(),
      duracao: (servico.duracao || '').toString(),
    });
    setEditingId(servico._id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este serviço?')) return;

    try {
      const response = await fetch(`http://localhost:3333/servicos/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setServicos(servicos.filter(s => s._id !== id));
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleCancel = () => {
    setFormData({ nome: '', descricao: '', preco: '', duracao: '' });
    setEditingId(null);
    setShowModal(false);
  };

  const totalAgendamentos = agendamentos.length;
  const agendamentosHoje = agendamentos.filter(a => a.data === new Date().toISOString().split('T')[0]).length;
  const servicosCadastrados = servicos.length;
  const receitaMes = servicos.reduce((sum, s) => sum + s.preco, 0) * 10; // Mock calculation

  return (
    <div className="min-h-screen bg-[#FAF3EE] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#7B2D42] text-[#FAF3EE] flex flex-col shadow-xl z-10">
        <div className="p-8 text-center border-b border-[#FAF3EE]/10">
          <h1 className="text-3xl font-display text-[#C9A96E]">TAISA</h1>
          <p className="text-[10px] tracking-widest uppercase opacity-60">Admin Panel</p>
        </div>
        <nav className="flex-grow p-4 space-y-2 mt-4">
          {[
            { id: 'inicio', label: 'Início', icon: '🏠' },
            { id: 'agendamentos', label: 'Agendamentos', icon: '📅' },
            { id: 'servicos', label: 'Serviços', icon: '💅' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as 'inicio' | 'agendamentos' | 'servicos')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                activeTab === item.id 
                ? 'bg-[#C9A96E] text-[#7B2D42] font-bold shadow-lg' 
                : 'hover:bg-white/10'
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-body">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-[#FAF3EE]/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-900/30 text-red-200 transition-colors font-body"
          >
            <span>🚪</span>
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-display text-[#7B2D42]">
            {activeTab === 'inicio' ? 'Bem-vinda, Taisa' : activeTab === 'agendamentos' ? 'Agendamentos' : 'Gerenciar Serviços'}
          </h2>
          <div className="text-[#7B2D42] font-body text-sm opacity-70">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-[#7B2D42] hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-[#7B2D42]/10 p-3 rounded-xl mr-4">📅</div>
              <div>
                <p className="text-[#7B2D42] font-body text-xs uppercase tracking-wider opacity-60">Agendamentos</p>
                <p className="text-2xl font-bold text-[#7B2D42]">{totalAgendamentos}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-[#C9A96E] hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-[#C9A96E]/10 p-3 rounded-xl mr-4">📆</div>
              <div>
                <p className="text-[#7B2D42] font-body text-xs uppercase tracking-wider opacity-60">Hoje</p>
                <p className="text-2xl font-bold text-[#7B2D42]">{agendamentosHoje}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-[#C9A0A0] hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-[#C9A0A0]/10 p-3 rounded-xl mr-4">💅</div>
              <div>
                <p className="text-[#7B2D42] font-body text-xs uppercase tracking-wider opacity-60">Serviços</p>
                <p className="text-2xl font-bold text-[#7B2D42]">{servicosCadastrados}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-green-500/10 p-3 rounded-xl mr-4">💰</div>
              <div>
                <p className="text-[#7B2D42] font-body text-xs uppercase tracking-wider opacity-60">Receita Estimada</p>
                <p className="text-2xl font-bold text-[#7B2D42]">R$ {receitaMes.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Sections */}
        {(activeTab === 'inicio' || activeTab === 'agendamentos') && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 overflow-hidden">
            <h2 className="text-2xl font-display text-[#7B2D42] mb-6 flex items-center">
              <span className="mr-2">📅</span> Próximos Agendamentos
            </h2>
            {loading ? (
              <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B2D42]"></div></div>
            ) : agendamentos.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[#FAF3EE] text-[#7B2D42]/60 text-sm">
                      <th className="text-left py-4 px-4 font-body font-semibold">Cliente</th>
                      <th className="text-left py-4 px-4 font-body font-semibold">Serviço</th>
                      <th className="text-left py-4 px-4 font-body font-semibold">Data/Hora</th>
                      <th className="text-left py-4 px-4 font-body font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FAF3EE]">
                    {agendamentos
                      .filter(a => activeTab === 'agendamentos' || a.data === new Date().toISOString().split('T')[0])
                      .map((agend) => (
                      <tr key={agend._id} className="hover:bg-[#FAF3EE]/50 transition-colors">
                        <td className="py-4 px-4 font-body font-medium text-[#7B2D42]">{agend.cliente}</td>
                        <td className="py-4 px-4 font-body text-[#7B2D42]">{agend.servico}</td>
                        <td className="py-4 px-4 font-body text-[#7B2D42]">{agend.data.split('-').reverse().join('/')} às {agend.hora}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            agend.status === 'confirmado' ? 'bg-[#C9A96E]/20 text-[#7B2D42]' :
                            agend.status === 'cancelado' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {agend.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-10 text-[#C9A0A0] font-body">Nenhum agendamento encontrado.</p>
            )}
          </div>
        )}

        {activeTab === 'servicos' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display text-[#7B2D42]">Catálogo de Serviços</h2>
              <button
                onClick={() => setShowModal(true)}
                className="bg-[#C9A96E] text-[#FAF3EE] px-5 py-2 rounded-xl hover:bg-[#B8985E] transition-all shadow-lg shadow-[#C9A96E]/30 font-body font-bold flex items-center"
              >
                <span className="mr-2">+</span> Novo Serviço
              </button>
            </div>
            {loading ? (
              <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B2D42]"></div></div>
            ) : servicos.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[#FAF3EE] text-[#7B2D42]/60 text-sm">
                      <th className="text-left py-4 px-4 font-body">Nome</th>
                      <th className="text-left py-4 px-4 font-body">Descrição</th>
                      <th className="text-left py-4 px-4 font-body">Preço</th>
                      <th className="text-left py-4 px-4 font-body">Duração</th>
                      <th className="text-left py-4 px-4 font-body">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FAF3EE]">
                    {servicos.map((servico) => (
                      <tr key={servico._id} className="hover:bg-[#FAF3EE]/50 transition-colors">
                        <td className="py-4 px-4 font-body font-semibold text-[#7B2D42]">{servico.nome}</td>
                        <td className="py-4 px-4 font-body text-xs text-[#7B2D42]/80 max-w-xs truncate">{servico.descricao}</td>
                        <td className="py-4 px-4 font-body font-bold text-[#C9A96E]">R$ {servico.preco.toFixed(2)}</td>
                        <td className="py-4 px-4 font-body text-[#7B2D42]">{servico.duracao || '-'} min</td>
                        <td className="py-4 px-4 flex space-x-2">
                          <button
                            onClick={() => handleEdit(servico)}
                            className="p-2 text-[#C9A96E] hover:bg-[#C9A96E]/10 rounded-lg transition-colors"
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(servico._id)}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-10 text-[#C9A0A0] font-body">Nenhum serviço cadastrado.</p>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#7B2D42]/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#FAF3EE] rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all scale-100">
            <h3 className="text-2xl font-display text-[#7B2D42] mb-6">
              {editingId ? 'Editar Serviço' : 'Novo Serviço'}
            </h3>
            <form onSubmit={handleSubmitServico} className="space-y-4">
              <div className="mb-4">
                <label className="block text-[#7B2D42] font-body font-semibold mb-1">Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border-2 border-[#C9A0A0]/20 rounded-xl focus:outline-none focus:border-[#C9A96E] bg-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-[#7B2D42] font-body font-semibold mb-1">Descrição</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-[#C9A0A0]/20 rounded-xl focus:outline-none focus:border-[#C9A96E] bg-white resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-[#7B2D42] font-body font-semibold mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    name="preco"
                    value={formData.preco}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    className="w-full px-4 py-2 border-2 border-[#C9A0A0]/20 rounded-xl focus:outline-none focus:border-[#C9A96E] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[#7B2D42] font-body font-semibold mb-1">Duração (min)</label>
                  <input
                    type="number"
                    name="duracao"
                    value={formData.duracao}
                    onChange={handleInputChange}
                    step="15"
                    className="w-full px-4 py-2 border-2 border-[#C9A0A0]/20 rounded-xl focus:outline-none focus:border-[#C9A96E] bg-white"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-white text-[#7B2D42] py-3 px-4 rounded-xl border-2 border-[#C9A0A0]/20 hover:bg-[#FAF3EE] transition-all font-body font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#C9A96E] text-[#FAF3EE] py-3 px-4 rounded-xl hover:bg-[#B8985E] shadow-lg shadow-[#C9A96E]/30 transition-all font-body font-bold"
                >
                  {editingId ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;