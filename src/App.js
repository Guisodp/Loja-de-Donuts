import React, { useState, useEffect } from 'react';
import './App.css';

const donuts = [
  {
    id: 1,
    nome: 'Donut Chocolate',
    descricao: 'Donut coberto com chocolate derretido e granulado',
    preco: 8.90,
    imagem: '/images/about-image.png'
  },
  {
    id: 2,
    nome: 'Donut Morango',
    descricao: 'Donut com cobertura de morango e confetes',
    preco: 9.90,
    imagem: '/images/about-image.png'
  },
  {
    id: 3,
    nome: 'Donut Caramelo',
    descricao: 'Donut com cobertura de caramelo e nozes',
    preco: 10.90,
    imagem: '/images/about-image.png'
  },
  {
    id: 4,
    nome: 'Donut Nutella',
    descricao: 'Donut recheado com Nutella e coberto com chocolate',
    preco: 11.90,
    imagem: '/images/about-image.png'
  },
  {
    id: 5,
    nome: 'Donut Brigadeiro',
    descricao: 'Donut com cobertura de brigadeiro e granulado',
    preco: 9.90,
    imagem: '/images/about-image.png'
  },
  {
    id: 6,
    nome: 'Donut Morango Branco',
    descricao: 'Donut com cobertura de chocolate branco e morangos',
    preco: 10.90,
    imagem: '/images/about-image.png'
  },
  {
    id: 7,
    nome: 'Donut Cookies',
    descricao: 'Donut com cobertura de chocolate e pedaços de cookie',
    preco: 11.90,
    imagem: '/images/about-image.png'
  },
  {
    id: 8,
    nome: 'Donut Caramelo Salgado',
    descricao: 'Donut com cobertura de caramelo salgado e amêndoas',
    preco: 12.90,
    imagem: '/images/about-image.png'
  }
];

function App() {
  const [carrinho, setCarrinho] = useState(() => {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  });
  const [logado, setLogado] = useState(() => {
    return localStorage.getItem('logado') === 'true';
  });
  const [carregando, setCarregando] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [erro, setErro] = useState('');
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
  const [mostrarSobre, setMostrarSobre] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [animacao, setAnimacao] = useState('');
  const [animacaoCarrinho, setAnimacaoCarrinho] = useState(false);
  const [fechandoCarrinho, setFechandoCarrinho] = useState(false);
  const [itensRemovendo, setItensRemovendo] = useState([]);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const donutsPorPagina = 4;

  useEffect(() => {
    const usuariosSalvos = localStorage.getItem('usuarios');
    if (usuariosSalvos) {
      setUsuarios(JSON.parse(usuariosSalvos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }, [carrinho]);

  useEffect(() => {
    localStorage.setItem('logado', logado);
  }, [logado]);

  const salvarUsuarios = (novosUsuarios) => {
    localStorage.setItem('usuarios', JSON.stringify(novosUsuarios));
    setUsuarios(novosUsuarios);
  };

  const fazerRegistro = (e) => {
    e.preventDefault();
    setErro('');

    if (usuarios.some(u => u.email === email)) {
      setErro('Este email já está cadastrado');
      return;
    }

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!nomeCompleto.trim()) {
      setErro('Por favor, insira seu nome completo');
      return;
    }

    if (!dataNascimento) {
      setErro('Por favor, insira sua data de nascimento');
      return;
    }

    try {
      const novoUsuario = { 
        email, 
        senha, 
        nomeCompleto, 
        dataNascimento 
      };
      const novosUsuarios = [...usuarios, novoUsuario];
      salvarUsuarios(novosUsuarios);
      setMostrarRegistro(false);
      setErro('Registro realizado com sucesso! Faça login para continuar.');
      setEmail('');
      setSenha('');
      setNomeCompleto('');
      setDataNascimento('');
      
      // Salvar dados do usuário após registro
      localStorage.setItem('usuarioAtual', JSON.stringify({
        nome: nomeCompleto,
        email: email
      }));
    } catch (error) {
      setErro('Erro ao salvar o registro. Tente novamente.');
      console.error('Erro no registro:', error);
    }
  };

  const fazerLogin = (e) => {
    e.preventDefault();
    setErro('');

    try {
      const usuario = usuarios.find(u => u.email === email && u.senha === senha);
      
      if (usuario) {
        setCarregando(true);
        setLogado(true);
        setErro('');
        setMostrarRegistro(false);
        
        setTimeout(() => {
          setCarregando(false);
        }, 5000);
      } else {
        setErro('Email ou senha incorretos');
      }
    } catch (error) {
      setErro('Erro ao fazer login. Tente novamente.');
      console.error('Erro no login:', error);
    }
  };

  const fazerLogout = () => {
    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
      setLogado(false);
      setEmail('');
      setSenha('');
      setCarrinho([]);
      localStorage.removeItem('usuarioAtual');
      localStorage.removeItem('carrinho');
      localStorage.removeItem('logado');
      localStorage.removeItem('usuarios');
    }, 5000);
  };

  const adicionarAoCarrinho = (donut) => {
    const novoCarrinho = [...carrinho, donut];
    setCarrinho(novoCarrinho);
    localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
  };

  const removerDoCarrinho = (id) => {
    setItensRemovendo([...itensRemovendo, id]);
    setTimeout(() => {
      setCarrinho(carrinho.filter(item => item.id !== id));
      setItensRemovendo(itensRemovendo.filter(itemId => itemId !== id));
    }, 300);
  };

  const totalCarrinho = carrinho.reduce((total, item) => total + item.preco, 0);

  const calcularTotal = () => {
    return totalCarrinho;
  };

  const donutsVisiveis = donuts.slice(
    (paginaAtual - 1) * donutsPorPagina,
    paginaAtual * donutsPorPagina
  );

  const totalPaginas = Math.ceil(donuts.length / donutsPorPagina);

  const proximaPagina = () => {
    if (paginaAtual < totalPaginas) {
      setAnimacao('slide-left');
      setTimeout(() => {
        setPaginaAtual(paginaAtual + 1);
        setAnimacao('slide-in-right');
      }, 1000);
    }
  };

  const paginaAnterior = () => {
    if (paginaAtual > 1) {
      setAnimacao('slide-right');
      setTimeout(() => {
        setPaginaAtual(paginaAtual - 1);
        setAnimacao('slide-in-left');
      }, 1000);
    }
  };

  const abrirCarrinho = () => {
    setFechandoCarrinho(false);
    setMostrarCarrinho(true);
  };

  const fecharCarrinho = () => {
    setFechandoCarrinho(true);
    setTimeout(() => {
      setMostrarCarrinho(false);
    }, 500);
  };

  const renderHeaderButtons = () => {
    if (logado) {
      return (
        <>
          <button className="cart-btn" onClick={abrirCarrinho}>
            🛒 Carrinho ({carrinho.length})
          </button>
          <button className="logout-btn" onClick={fazerLogout}>
            Sair
          </button>
        </>
      );
    }
    return null;
  };

  if (!logado) {
    return (
      <div className="App">
        <header className="header">
          <div className="header-left">
            <img src="/images/Logo.svg" alt="Logo" className="header-logo" />
            <h1>Donut Delícias</h1>
          </div>
          <div className="header-right">
            {renderHeaderButtons()}
          </div>
        </header>

        <div className="login-container">
          <img src="/images/Logo.svg" alt="Logo Donut Delícias" className="login-logo" />
          <div className="login-box">
            <h2>{mostrarRegistro ? 'Criar Conta' : 'Login'}</h2>
            {erro && <div className={`mensagem ${erro.includes('sucesso') ? 'sucesso' : 'erro'}`}>{erro}</div>}
            <form className="login-form" onSubmit={mostrarRegistro ? fazerRegistro : fazerLogin}>
              {mostrarRegistro && (
                <>
                  <div className="form-group">
                    <label>Nome Completo</label>
                    <input
                      type="text"
                      value={nomeCompleto}
                      onChange={(e) => setNomeCompleto(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Data de Nascimento</label>
                    <input
                      type="date"
                      value={dataNascimento}
                      onChange={(e) => setDataNascimento(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Senha</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Senha"
                />
              </div>
              <button type="submit" className="login-form button">
                {mostrarRegistro ? 'Criar Conta' : 'Entrar'}
              </button>
            </form>
            <button 
              className="alternar-form"
              onClick={() => {
                setMostrarRegistro(!mostrarRegistro);
                setErro('');
              }}
            >
              {mostrarRegistro ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Registre-se'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {carregando && (
        <div className="loading-container">
          <img src="/images/Logo.svg" alt="Donut Carregando" className="loading-donut" />
          <div className="loading-text">Carregando...</div>
        </div>
      )}
      {!carregando && logado && (
        <div className="main-content">
          <header className="header">
            <div className="header-left">
              <img src="/images/Logo.svg" alt="Logo" className="header-logo" />
              <h1>Donut Delícias</h1>
            </div>
            <div className="header-right">
              {renderHeaderButtons()}
            </div>
          </header>

          <div className="banner">
            <div className="banner-content">
              <img src="/images/home-banner-image.png" alt="Donut Delícias" />
              <h2>Bem-vindo à Donut Delícias</h2>
              <p>Os melhores donuts artesanais da cidade!</p>
            </div>
          </div>

          <section className="donuts-section">
            <h2>Nossos Donuts</h2>
            <div className="donuts-container">
              <div className={`donuts-grid ${animacao}`} key={paginaAtual}>
                {donutsVisiveis.map(donut => (
                  <div key={donut.id} className="donut-card">
                    <img src={donut.imagem} alt={donut.nome} />
                    <h3>{donut.nome}</h3>
                    <p>{donut.descricao}</p>
                    <div className="preco">R$ {donut.preco.toFixed(2)}</div>
                    <button onClick={() => adicionarAoCarrinho(donut)}>
                      Adicionar ao Carrinho
                    </button>
                  </div>
                ))}
              </div>
              <div className="paginacao">
                <button 
                  className="btn-pagina" 
                  onClick={paginaAnterior}
                  disabled={paginaAtual === 1}
                >
                  ←
                </button>
                <div className="pagina-indicador">
                  Página {paginaAtual} de {totalPaginas}
                </div>
                <button 
                  className="btn-pagina" 
                  onClick={proximaPagina}
                  disabled={paginaAtual === totalPaginas}
                >
                  →
                </button>
              </div>
            </div>
          </section>

          {mostrarCarrinho && (
            <div className={`modal ${fechandoCarrinho ? 'fechando' : ''}`}>
              <div className={`modal-content ${fechandoCarrinho ? 'fechando' : ''}`}>
                <button className="close-btn" onClick={fecharCarrinho}>
                  ✕
                </button>
                <h2>Carrinho</h2>
                {carrinho.length === 0 ? (
                  <p>Seu carrinho está vazio</p>
                ) : (
                  <>
                    {carrinho.map(item => (
                      <div 
                        key={item.id} 
                        className={`carrinho-item ${itensRemovendo.includes(item.id) ? 'removendo' : ''}`}
                      >
                        <div>
                          <h3>{item.nome}</h3>
                          <p>R$ {item.preco.toFixed(2)}</p>
                        </div>
                        <button onClick={() => removerDoCarrinho(item.id)}>
                          ✕
                        </button>
                      </div>
                    ))}
                    <div className="carrinho-total">
                      <h3>Total: R$ {calcularTotal().toFixed(2)}</h3>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
