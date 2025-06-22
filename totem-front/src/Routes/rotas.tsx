import { BrowserRouter as Router, Routes, Route,  Navigate } from 'react-router-dom';
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
import PublicRoute from './PublicRoute';
import { CartProvider } from '../context/CartContext';
import FAQ from '../pages/public/faq';
import PoliticaPrivacidade from '../pages/public/politicaPrivacidade';
import TermosDeUso from '../pages/public/termosDeUso';
import Blog from '../pages/public/blog';


const Rotas = () => {
  return (
    <Router>
      <CartProvider>
        <Routes>

          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route element={<Layout />}>
            <Route index element={<Home />} /> 
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
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/registrar" element={<Registrar />} />
              <Route path="/recuperar" element={<Recuperar />} />
            </Route>
          </Route>

          <Route element={<Layout />}>
            <Route element={<PrivateRoute allowedRoles={["MANAGER", "ADMIN"]} />}>
              <Route path="/manager" element={<Manager />} />
            </Route>
          </Route>

          <Route element={<Layout />}>
            <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Route>

          <Route path="/redirect" element={<RedirectByRole />} />
          <Route path="/unauthorized" element={<Error401 />} />
          <Route path="*" element={<Error404 />} /> 
        </Routes>
      </CartProvider>
    </Router>
  );
};

export default Rotas;