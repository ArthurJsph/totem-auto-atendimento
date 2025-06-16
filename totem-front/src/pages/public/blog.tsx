// src/pages/Blog.tsx
import React from 'react';
import { Link } from 'react-router-dom';

// Dados fictícios para os posts do blog
const blogPosts = [
  {
    id: 1,
    title: "A História por Trás dos Nossos Grãos de Café",
    summary: "Descubra a jornada fascinante do café, desde as fazendas de origem até a sua xícara.",
    date: "10 de Junho de 2025",
    imageUrl: "https://via.placeholder.com/600x400?text=Grãos+de+Café", // Substitua por imagem real
    link: "/blog/historia-graos" // Exemplo de link para um post individual (você precisaria criar a página)
  },
  {
    id: 2,
    title: "Dicas para o Café Perfeito em Casa",
    summary: "Aprenda truques simples para preparar um café delicioso usando métodos caseiros.",
    date: "05 de Junho de 2025",
    imageUrl: "https://via.placeholder.com/600x400?text=Café+em+Casa", // Substitua por imagem real
    link: "/blog/cafe-em-casa"
  },
  {
    id: 3,
    title: "Novidades no Cardápio: Conheça Nossos Lanches Artesanais!",
    summary: "Apresentamos nossas novas opções de lanches feitos com ingredientes frescos e selecionados.",
    date: "28 de Maio de 2025",
    imageUrl: "https://via.placeholder.com/600x400?text=Lanches+Novos", // Substitua por imagem real
    link: "/blog/novos-lanches"
  }
];

const Blog: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">Nosso Blog</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {blogPosts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{post.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{post.date}</p>
              <p className="text-gray-700 text-base mb-4">{post.summary}</p>
              {/* No contexto de faculdade, este link pode ir para uma página vazia ou para a própria página do blog */}
              <Link to={post.link} className="text-red-700 hover:underline font-medium">
                Leia Mais
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;