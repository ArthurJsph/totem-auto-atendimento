
import { useParams, useNavigate } from "react-router-dom";
import { produtos } from "./produto"; // ou de onde vier sua lista
// Simule o usuário logado
const user = { role: "admin" };

const ProdutoDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const produto = produtos.find((p) => p.id === Number(id));

  if (!produto) return <div className="p-8">Produto não encontrado.</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <img src={produto.imagem} alt={produto.nome} className="w-full h-64 object-cover rounded mb-4" />
        <h2 className="text-2xl font-bold mb-2">{produto.nome}</h2>
        <p className="text-gray-700 mb-2">{produto.descricao}</p>
        <p className="text-green-700 font-bold mb-4">R$ {produto.preco.toFixed(2)}</p>
        {/* Botões só para admin/manager */}
        {(user.role === "admin" || user.role === "manager") && (
          <div className="flex gap-4">
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              onClick={() => alert("Editar produto")}
            >
              Editar
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => alert("Excluir produto")}
            >
              Excluir
            </button>
          </div>
        )}
        <button
          className="mt-6 text-gray-600 underline"
          onClick={() => navigate(-1)}
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default ProdutoDetalhe;