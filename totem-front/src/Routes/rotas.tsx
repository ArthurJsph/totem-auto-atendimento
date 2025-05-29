import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../pages/public/home";
import CafeteriaPayment from "../pages/public/tipopagamento";
import Cardapio from "../pages/public/cardapio";
import Produto from "../pages/public/produto";
import Error404 from "../pages/error/404";
import Pedido from "../pages/public/pedido";
import Error401 from "../pages/error/401";
import Login from "../pages/auth/login";
import Registrar from "../pages/auth/registrar";
import Layout from "../components/layout/layout";
import Recuperar from "../pages/auth/recuperar";
import Sobre from "../pages/public/sobre";
const Rotas = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/sobre" element={<Layout><Sobre /></Layout>}/>
          <Route path="/pagamento" element={<CafeteriaPayment />} />
          <Route path="/registrar" element={<Layout><Registrar /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/produto" element={<Produto />} />
          <Route path="/cardapio" element={<Cardapio />} />
          <Route path="/pedido" element={<Layout><Pedido /></Layout>} />
          <Route path="*" element={<Error404 />} />
          <Route path="/unauthorized" element={<Error401 />} />
          <Route path="/recuperar" element={<Layout><Recuperar /></Layout>} />
        </Routes>
      </Router>
    );
  };
  
  export default Rotas;
