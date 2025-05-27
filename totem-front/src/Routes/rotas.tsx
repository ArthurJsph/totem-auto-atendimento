import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/pages/home";
import CafeteriaPayment from "../components/pages/tipopagamento";
import Cardapio from "../components/pages/cardapio";
import Produto from "../components/pages/produto";
import Error from "../components/pages/error";
import Pedido from "../components/pages/pedido";
import Error401 from "../components/pages/unathorized";
import Login from "../autenticacao/login";
import Registrar from "../autenticacao/registrar";
import Layout from "../components/layout/layout";
const Rotas = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/pagamento" element={<CafeteriaPayment />} />
          <Route path="/registrar" element={<Layout><Registrar /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/cardapio" element={<Cardapio />} />
          <Route path="/produto" element={<Layout><Produto /></Layout>} />
          <Route path="/pedido" element={<Layout><Pedido /></Layout>} />
          <Route path="*" element={<Error />} />
          <Route path="/unauthorized" element={<Error401 />} />
        </Routes>
      </Router>
    );
  };
  
  export default Rotas;
