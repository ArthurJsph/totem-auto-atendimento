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
// import RedirectByRole from './redirectByRole'; // Não precisaremos mais deste se a lógica for incorporada
import PrivateRoute from './PrivateRoute';
import { CartProvider } from '../context/CartContext';
import FAQ from '../pages/public/faq';
import PoliticaPrivacidade from '../pages/public/politicaPrivacidade';
import TermosDeUso from '../pages/public/termosDeUso';
import Blog from '../pages/public/blog';
import RedefinirSenha from '../pages/auth/RedefinirSenha';
import { useAuth } from '../hooks/useAuth';
import MyAccount from '../pages/private/myAccout';

const Rotas = () => {
    const { isLoading, isAuthenticated, authorities } = useAuth();

    // Enquanto o status de autenticação está sendo verificado, exibe um loader.
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen text-xl">Verificando autenticação...</div>;
    }

    // Função para determinar o redirecionamento pós-autenticação.
    // Esta é a lógica central para onde um usuário autenticado deve ir se tentar acessar
    // uma rota de autenticação (como /login) ou a rota raiz.
    const getAuthenticatedDashboardPath = () => {
        if (authorities.includes('ADMIN')) {
            return "/admin";
        }
        if (authorities.includes('MANAGER')) {
            return "/manager";
        }
        // Para 'CLIENT' ou qualquer outro usuário autenticado sem role específica para dashboard,
        // redireciona para a home.
        return "/home";
    };

    return (
        <Router>
            <CartProvider>
                <Routes>
                
                    <Route
                        path="/"
                        element={isAuthenticated ? <Navigate to={getAuthenticatedDashboardPath()} replace /> : <Navigate to="/login" replace />}
                    />

                    <Route path="/login" element={isAuthenticated ? <Navigate to={getAuthenticatedDashboardPath()} replace /> : <Login />} />
                    <Route path="/registrar" element={isAuthenticated ? <Navigate to={getAuthenticatedDashboardPath()} replace /> : <Registrar />} />
                    <Route path="/recuperar" element={isAuthenticated ? <Navigate to={getAuthenticatedDashboardPath()} replace /> : <Recuperar />} />
                    <Route path="/redefinir-senha" element={<RedefinirSenha />} /> {/* Esta rota é sempre acessível, não precisa de guardas aqui */}

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

                    <Route element={<Layout />}>
                        
                        <Route element={<PrivateRoute allowedRoles={["ADMIN", "MANAGER", "CLIENT"]} />}>
                            <Route path="/my-account" element={<MyAccount />} />
                        </Route>

                       
                        <Route element={<PrivateRoute allowedRoles={["MANAGER", "ADMIN"]} />}>
                            <Route path="/manager" element={<Manager />} />
                        </Route>

                        
                        <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
                            <Route path="/admin" element={<Admin />} />
                        </Route>
                    </Route>

                    <Route path="/unauthorized" element={<Error401 />} />
                    <Route path="*" element={<Error404 />} /> 

                </Routes>
            </CartProvider>
        </Router>
    );
};

export default Rotas;