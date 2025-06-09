import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const produtos = [
  {
    id: 1,
    nome: "Café Expresso",
    descricao: "Café expresso encorpado e aromático.",
    preco: 6.5,
    imagem: "src/assets/cafe-expresso.jpg",
  },
  {
    id: 2,
    nome: "Cappuccino",
    descricao: "Café com leite vaporizado e espuma cremosa.",
    preco: 8.0,
    imagem: "src/assets/cappuccino.jpg",
  },
  {
    id: 3,
    nome: "Pão de Queijo Recheado",
    descricao: "Tradicional pão de queijo recheado.",
    preco: 4.0,
    imagem: "src/assets/pao-queijo-recheado.jpg",
  },
  {
    id: 4,
    nome: "Cheesecake de Frutas",
    descricao: "Cheesecake com cobertura de Frutas.",
    preco: 7.0,
    imagem: "src/assets/cheesecake-frutas.jpg",
  },
  {
    id: 5,
    nome: "Mocha Gelado",
    descricao: "Café com chocolate e leite vaporizado.",
    preco: 9.0,
    imagem: "src/assets/mocha-gelado.jpg",
  },
  {
    id: 6,
    nome: "Wrap de Frango",
    descricao: "Wrap recheado com frango.",
    preco: 5.5,
    imagem: "src/assets/wrap-frango.jpg",
  },
  {
    id: 7,
    nome: "Latte macchiato",
    descricao: "Café espresso com leite vaporizado.",
    preco: 7.5,
    imagem: "src/assets/latte-macchiato.jpg",
  },
  {
    id: 8,
    nome: "Torta de Limão",
    descricao: "Torta de limão com merengue.",
    preco: 8.5,
    imagem: "src/assets/torta-limao.jpg",
  },
  {
    id: 9,
    nome: "Muffin de Blueberry",
    descricao: "Delicioso Maffuin de blueberry.",
    preco: 6.0,
    imagem: "src/assets/muffin-blueberry.jpg",
  },
];

const Produto = () => {
  const [showForm, setShowForm] = useState(false);
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    descricao: "",
    preco: "",
    imagem: "",
    categoria: "",
  });
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNovoProduto({ ...novoProduto, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNovoProduto({ ...novoProduto, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "image/png") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNovoProduto((prev) => ({ ...prev, imagem: reader.result as string }));
        setImagemPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setNovoProduto((prev) => ({ ...prev, imagem: "" }));
      setImagemPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Produto cadastrado:\n" + JSON.stringify(novoProduto, null, 2));
    setShowForm(false);
    setNovoProduto({ nome: "", descricao: "", preco: "", imagem: "", categoria: "" });
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          className={`px-3 py-1 rounded ${viewMode === "grid" ? "bg-red-700 text-white" : "bg-white text-gray-700 border"}`}
          onClick={() => setViewMode("grid")}
        >
          Grade
        </button>
        <button
          className={`px-3 py-1 rounded ${viewMode === "list" ? "bg-red-700 text-white" : "bg-white text-gray-700 border"}`}
          onClick={() => setViewMode("list")}
        >
          Lista
        </button>
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <div className="flex items-center bg-white rounded-full shadow px-3 py-1">
          <input
            type="text"
            placeholder="Pesquisar produto..."
            className="outline-none bg-transparent px-2 py-1 text-gray-700"
          />
          <button className="ml-2 text-red-700 hover:text-red-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </button>
        </div>
        <button
          className="flex items-center bg-red-700 text-white px-4 py-2 rounded-full shadow hover:bg-red-800 transition-colors"
          onClick={() => setShowForm(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Produto
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Cadastrar Novo Produto</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="nome"
                placeholder="Nome do produto"
                value={novoProduto.nome}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
              <textarea
                name="descricao"
                placeholder="Descrição"
                value={novoProduto.descricao}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="number"
                name="preco"
                placeholder="Preço"
                value={novoProduto.preco}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                min="0"
                step="0.01"
              />
              <input
                type="file"
                accept="image/png"
                onChange={handleImageChange}
                className="w-full border rounded px-3 py-2"
              />
              <select
                name="categoria"
                value={novoProduto.categoria}
                onChange={handleSelectChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Selecione a categoria</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Lanches">Lanches</option>
                <option value="Sobremesas">Sobremesas</option>
                <option value="Almoço">Almoço</option>
              </select>
              {imagemPreview && (
                <img
                  src={imagemPreview}
                  alt="Pré-visualização"
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )}
              <button
                type="submit"
                className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800 transition"
              >
                Salvar Produto
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="container mx-auto pt-24 pb-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Produtos</h1>
        <div className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
            : "flex flex-col gap-6"
        }>
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className={
                viewMode === "grid"
                  ? "bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                  : "bg-white rounded-lg shadow-md overflow-hidden flex cursor-pointer"
              }
              onClick={() => navigate(`/produtos/${produto.id}`)}
            >
              <img
                src={produto.imagem}
                alt={produto.nome}
                className={viewMode === "grid" ? "w-full h-48 object-cover" : "w-48 h-48 object-cover"}
              />
              <div className="p-4 flex flex-col justify-center">
                <h2 className="text-xl font-semibold">{produto.nome}</h2>
                <p className="text-gray-600 text-sm mt-1">{produto.descricao}</p>
                <p className="text-green-700 font-bold mt-2">R$ {produto.preco.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Produto;