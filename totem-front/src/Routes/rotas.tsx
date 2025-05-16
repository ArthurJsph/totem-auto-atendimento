import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/pages/home";
import CafeteriaPayment from "../components/pages/tipopagamento";
import Cardapio from "../components/pages/cardapio";
import Produto from "../components/pages/produto";
import Error from "../components/pages/error";
import Pedido from "../components/pages/pedido";
const Rotas = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pagamento" element={<CafeteriaPayment />} />
          <Route path="/cardapio" element={<Cardapio />} />
          <Route path="/produto" element={<Produto />} />
          <Route path="/pedido" element={<Pedido />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    );
  };
  
  export default Rotas;
