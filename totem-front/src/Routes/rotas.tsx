import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/public/home';
import Produto from '../pages/public/produto';
import Pedido from '../pages/public/pedido';
import CafeteriaPayment from '../pages/public/pagamento';
import Sobre from '../pages/public/sobre';
import Login from '../pages/auth/login';
import Registrar from '../pages/auth/registrar';
import Recuperar from '../pages/auth/recuperar';
import Manager from '../pages/private/manager';
import Admin from '../pages/private/admin';
import Error404 from '../pages/error/404';
import Error401 from '../pages/error/401';
import Layout from '../components/layout/layout';
import RedirectByRole from './redirectByRole';
import PrivateRoute from './PrivateRoute';
import { CartProvider } from '../context/CartContext';
import FAQ from '../pages/public/faq';
import PoliticaPrivacidade from '../pages/public/politicaPrivacidade';
import TermosDeUso from '../pages/public/termosDeUso';
import Blog from '../pages/public/blog';
import RedefinirSenha from '../pages/auth/RedefinirSenha';
import { useAuth } from '../hooks/useAuth'; // Mantemos o useAuth, pois ele é útil para outras rotas

const Rotas = () => {
  const { isLoading, isAuthenticated, authorities } = useAuth(); // Mantemos para outras lógicas de rota

  if (isLoading) {
    return <div>Verificando autenticação...</div>;
  }

  // Se você não precisa mais da lógica de redirecionamento para autenticados na raiz,
  // você pode remover ou simplificar redirectToAuthenticatedHome.
  // No entanto, é comum que rotas como /login e /registrar ainda redirecionem
  // usuários JÁ AUTENTICADOS para sua dashboard.
  const redirectToAuthenticatedDashboard = () => {
    if (authorities.includes('ADMIN')) {
      return <Navigate to="/admin" replace />;
    }
    if (authorities.includes('MANAGER')) {
      return <Navigate to="/manager" replace />;
    }
    // Redirecionamento padrão para clientes ou outros papéis após login.
    return <Navigate to="/home" replace />;
  };

  return (
    <Router>
      <CartProvider>
        <Routes>

          {/* NOVO AJUSTE: Sempre redireciona a URL base para /login.
             A lógica de redirecionamento do usuário AUTENTICADO AGORA ocorre nas ROTAS PÚBLICAS individuais. */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rotas Públicas: Exibe o componente apenas se NÃO autenticado,
             senão redireciona para a dashboard do usuário. */}
          <Route path="/login" element={isAuthenticated ? redirectToAuthenticatedDashboard() : <Login />} />
          <Route path="/registrar" element={isAuthenticated ? redirectToAuthenticatedDashboard() : <Registrar />} />
          <Route path="/recuperar" element={isAuthenticated ? redirectToAuthenticatedDashboard() : <Recuperar />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} /> {/* Esta rota é sempre acessível */}
          
          {/* Rotas Públicas com Layout - Acessíveis a todos */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/produto" element={<Produto />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/pedido" element={<Pedido />} />
            <Route path="/pedido/pagamento" element={<CafeteriaPayment />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/termos-de-uso" element={<TermosDeUso />} />
            <Route path="/blog" element={<Blog />} />
          </Route>

          {/* Rotas Privadas para Manager (e Admin) */}
          <Route element={<Layout />}>
            <Route element={<PrivateRoute allowedRoles={["MANAGER", "ADMIN"]} />}>
              <Route path="/manager" element={<Manager />} />
            </Route>
          </Route>

          {/* Rotas Privadas para Admin */}
          <Route element={<Layout />}>
            <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Route>

          {/* Rotas Especiais/Erro */}
          <Route path="/redirect" element={<RedirectByRole />} />
          <Route path="/unauthorized" element={<Error401 />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </CartProvider>
    </Router>
  );
};

export default Rotas;