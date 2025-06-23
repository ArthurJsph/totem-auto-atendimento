CREATE DATABASE IF NOT EXISTS Totem;
USE Totem;

-- Table manager
CREATE TABLE IF NOT EXISTS manager (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'MANAGER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table restaurant
CREATE TABLE IF NOT EXISTS restaurant (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    avatar_image_url TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL,
    manager_id INTEGER REFERENCES manager(id) ON DELETE SET NULL
);

-- Table menu_category
CREATE TABLE IF NOT EXISTS menu_category (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    restaurant_id INTEGER NOT NULL REFERENCES restaurant(id) ON DELETE CASCADE,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL
);

-- Table product
CREATE TABLE IF NOT EXISTS product (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    image_url TEXT NOT NULL,
    ingredients TEXT[],
    restaurant_id INTEGER NOT NULL REFERENCES restaurant(id) ON DELETE CASCADE,
    menu_category_id INTEGER NOT NULL REFERENCES menu_category(id) ON DELETE CASCADE,
    amount INTEGER,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL
);

-- Table orders
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    name TEXT,
    description TEXT,
    price DOUBLE PRECISION,
    total DOUBLE PRECISION NOT NULL,
    status VARCHAR(20) NOT NULL,
    consumption_method VARCHAR(20) NOT NULL,
    restaurant_id INTEGER NOT NULL REFERENCES restaurant(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL,
    payment_id INTEGER REFERENCES payment(id) ON DELETE SET NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Table orders_product
CREATE TABLE IF NOT EXISTS orders_product (
    id SERIAL PRIMARY KEY,
    name TEXT,
    product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    status TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL
);

-- Table payment
CREATE TABLE IF NOT EXISTS payment (
    id SERIAL PRIMARY KEY,
    method VARCHAR(100) NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    status VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255) NOT NULL,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_id INTEGER,
    payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Restaurant
INSERT INTO restaurant (id, name, slug, description, avatar_image_url, cover_image_url, created_at, updated_at, manager_id) VALUES
(1, 'Pizzaria Bella', 'pizzaria-bella', 'As melhores pizzas artesanais.', '/images/bella-avatar.png', '/images/bella-cover.jpg', NOW(), NOW(), 1);

-- Menu Categories (apenas os 4)
INSERT INTO menu_category (id, name, restaurant_id, created_at, updated_at) VALUES
(1, 'Bebidas', 1, NOW(), NOW()),
(2, 'Sobremesas', 1, NOW(), NOW()),
(3, 'Lanches', 1, NOW(), NOW()),
(4, 'Almoço', 1, NOW(), NOW());

-- Products (só categorias 1 a 4)
INSERT INTO product (
  name, description, price, image_url, ingredients, amount, restaurant_id, menu_category_id, created_at, updated_at
) VALUES
('Café Expresso', 'Café puro e encorpado.', 4.50, 'cafe-expresso.jpg', ARRAY['Grãos de café'], 1, 1, 1, NOW(), NOW()),
('Cappuccino Tradicional', 'Café com leite vaporizado e espuma de leite.', 8.00, 'cappuccino.jpg', ARRAY['Café', 'Leite'], 1, 1, 1, NOW(), NOW()),
('Latte Macchiato', 'Leite quente com um toque de café e espuma.', 8.50, 'latte-macchiato.jpg', ARRAY['Leite', 'Café'], 1, 1, 1, NOW(), NOW()),
('Mocha Gelado', 'Bebida gelada de café, chocolate e leite.', 9.50, 'mocha-gelado.jpg', ARRAY['Café', 'Chocolate', 'Leite', 'Gelo'], 1, 1, 1, NOW(), NOW()),
('Chá de Camomila', 'Chá calmante de camomila.', 5.00, 'cha-camomila.jpg', ARRAY['Camomila', 'Água quente'], 1, 1, 1, NOW(), NOW()),
('Torta de Limão', 'Fatia de torta de limão com merengue.', 7.00, 'torta-limao.jpg', ARRAY['Biscoito', 'Limão', 'Leite condensado', 'Merengue'], 1, 1, 2, NOW(), NOW()),
('Cheesecake de Frutas Vermelhas', 'Cheesecake cremoso com calda de frutas vermelhas.', 9.00, 'cheesecake-frutas.jpg', ARRAY['Cream cheese', 'Biscoito', 'Frutas vermelhas'], 1, 1, 2, NOW(), NOW()),
('Brownie com Sorvete', 'Brownie quente com uma bola de sorvete de creme.', 10.00, 'brownie-sorvete.jpg', ARRAY['Chocolate', 'Farinha', 'Sorvete de creme'], 1, 1, 2, NOW(), NOW()),
('Muffin de Blueberry', 'Muffin fofinho com mirtilos frescos.', 5.50, 'muffin-blueberry.jpg', ARRAY['Farinha', 'Mirtilo', 'Ovos'], 1, 1, 2, NOW(), NOW()),
('Cookie com Gotas de Chocolate', 'Cookie crocante com muitas gotas de chocolate.', 4.00, 'cookie-chocolate.jpg', ARRAY['Farinha', 'Chocolate', 'Manteiga'], 1, 1, 2, NOW(), NOW()),
('Pão de Queijo Recheado', 'Pão de queijo com recheio cremoso de requeijão.', 6.00, 'pao-queijo-recheado.jpg', ARRAY['Polvilho', 'Queijo', 'Requeijão'], 1, 1, 3, NOW(), NOW()),
('Mini Pizza de Queijo', 'Pequena pizza individual com queijo mussarela.', 7.00, 'mini-pizza.jpg', ARRAY['Massa de pizza', 'Molho de tomate', 'Queijo mussarela'], 1, 1, 3, NOW(), NOW()),
('Cachorro Quente Gourmet', 'Salsicha especial com molho e batata palha.', 12.00, 'cachorro-quente.jpg', ARRAY['Pão', 'Salsicha', 'Molho', 'Batata palha'], 1, 1, 3, NOW(), NOW()),
('Wrap de Frango com Salada', 'Wrap recheado com frango grelhado e mix de folhas.', 11.00, 'wrap-frango.jpg', ARRAY['Tortilla', 'Frango', 'Alface', 'Tomate'], 1, 1, 3, NOW(), NOW()),
('Salada de Frutas Frescas', 'Mix de frutas da estação picadas.', 8.00, 'salada-frutas.jpg', ARRAY['Morango', 'Manga', 'Uva', 'Maçã'], 1, 1, 4, NOW(), NOW()),
('Iogurte com Granola e Mel', 'Iogurte natural com granola crocante e mel.', 7.50, 'iogurte-granola.jpg', ARRAY['Iogurte natural', 'Granola', 'Mel'], 1, 1, 4, NOW(), NOW()),
('Sopa de Legumes da Horta', 'Sopa caseira com legumes frescos.', 10.00, 'sopa-legumes.jpg', ARRAY['Cenoura', 'Batata', 'Abobrinha', 'Caldo de legumes'], 1, 1, 4, NOW(), NOW()),
('Água de Coco Natural', 'Água de coco fresca e gelada.', 6.00, 'agua-coco.jpg', ARRAY['Água de coco'], 1, 1, 4, NOW(), NOW()),
('Refrigerante Lata', 'Diversos sabores de refrigerante em lata.', 5.00, 'refrigerante-lata.jpg', ARRAY['Refrigerante'], 1, 1, 1, NOW(), NOW()),
('Cerveja Artesanal', 'Seleção de cervejas artesanais locais.', 15.00, 'cerveja-artesanal.jpg', ARRAY['Cerveja'], 1, 1, 1, NOW(), NOW());


-- Orders_Product (exemplos)
INSERT INTO orders_product (name, product_id, order_id, price, quantity, status, created_at, updated_at) VALUES
('Café Expresso', (SELECT id FROM product WHERE name = 'Café Expresso'), 1, 4.50, 2, 'PREPARING', NOW(), NOW()),
('Torta de Limão', (SELECT id FROM product WHERE name = 'Torta de Limão'), 2, 7.00, 3, 'DELIVERED', NOW(), NOW());


CREATE TABLE password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    expiry_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE -- Opcional: Se o usuário for deletado, os tokens associados também serão
);



-- Orders (30 novos pedidos com user_id variando de 1 a 10 e restaurant_id = 1)
INSERT INTO orders (name, description, price, user_id, total, status, consumption_method, restaurant_id, created_at, updated_at) VALUES
('Pedido de Café da Manhã', 'Seleção de itens para o café da manhã', 32.50, 1, 32.50, 'PROCESSING', 'DELIVERY', 1, NOW(), NOW()),
('Almoço Rápido', 'Lanche e bebida para o almoço', 25.00, 2, 25.00, 'PREPARING', 'PICKUP', 1, NOW(), NOW()),
('Doces para o Escritório', 'Variedade de sobremesas para a equipe', 55.00, 3, 55.00, 'PENDING', 'DELIVERY', 1, NOW(), NOW()),
('Lanche da Tarde Saudável', 'Opções leves e nutritivas', 28.00, 4, 28.00, 'DELIVERED', 'ON_SITE', 1, NOW(), NOW()),
('Reunião de Negócios', 'Café e lanches para reunião', 70.00, 5, 70.00, 'COMPLETED', 'DELIVERY', 1, NOW(), NOW()),
('Break Rápido', 'Um café e um salgado', 14.50, 6, 14.50, 'CANCELLED', 'PICKUP', 1, NOW(), NOW()),
('Festa de Aniversário', 'Grandes quantidades de produtos', 120.00, 7, 120.00, 'PENDING', 'DELIVERY', 1, NOW(), NOW()),
('Pedidos Avulsos', 'Itens diversos', 42.00, 8, 42.00, 'PROCESSING', 'ON_SITE', 1, NOW(), NOW()),
('Jantar Leve', 'Sopa e suco', 17.00, 9, 17.00, 'PREPARING', 'DELIVERY', 1, NOW(), NOW()),
('Sobremesa da Noite', 'Brownie e sorvete', 19.50, 10, 19.50, 'DELIVERED', 'PICKUP', 1, NOW(), NOW()),
('Lanche para Crianças', 'Muffin e suco', 16.50, 1, 16.50, 'PENDING', 'ON_SITE', 1, NOW(), NOW()),
('Café Expresso e Torta', 'Combinação clássica', 11.50, 2, 11.50, 'PROCESSING', 'DELIVERY', 1, NOW(), NOW()),
('Salgados Variados', 'Mix de coxinhas e pastéis', 28.00, 3, 28.00, 'PREPARING', 'PICKUP', 1, NOW(), NOW()),
('Bebidas para o Verão', 'Smoothies e sodas', 35.00, 4, 35.00, 'DELIVERED', 'ON_SITE', 1, NOW(), NOW()),
('Café da Tarde Especial', 'Chá e cheesecake', 17.50, 5, 17.50, 'COMPLETED', 'DELIVERY', 1, NOW(), NOW()),
('Pedidos para Evento', 'Grandes quantidades de bebidas', 85.00, 6, 85.00, 'PENDING', 'PICKUP', 1, NOW(), NOW()),
('Relax na Cafeteria', 'Latte e croissant', 18.00, 7, 18.00, 'PROCESSING', 'ON_SITE', 1, NOW(), NOW()),
('Saudável e Rápido', 'Wrap e água de coco', 18.50, 8, 18.50, 'PREPARING', 'DELIVERY', 1, NOW(), NOW()),
('Presente Doce', 'Caixa de brigadeiros', 24.00, 9, 24.00, 'DELIVERED', 'PICKUP', 1, NOW(), NOW()),
('Pós-Treino', 'Iogurte e frutas', 15.50, 10, 15.50, 'PENDING', 'ON_SITE', 1, NOW(), NOW()),
('Café da Manhã Completo', 'Pão de queijo e cappuccino', 14.00, 1, 14.00, 'PROCESSING', 'DELIVERY', 1, NOW(), NOW()),
('Almoço Veggie', 'Sopa de legumes e salada', 22.50, 2, 22.50, 'PREPARING', 'PICKUP', 1, NOW(), NOW()),
('Guloseimas para o Fim de Semana', 'Cookies e refrigerante', 14.00, 3, 14.00, 'DELIVERED', 'ON_SITE', 1, NOW(), NOW()),
('Pedido Corporativo', 'Diversos lanches para equipe', 95.00, 4, 95.00, 'COMPLETED', 'DELIVERY', 1, NOW(), NOW()),
('Primeiro Pedido', 'Experimentando alguns itens', 30.00, 5, 30.00, 'PENDING', 'PICKUP', 1, NOW(), NOW()),
('Pedido Personalizado', 'Itens específicos', 26.00, 6, 26.00, 'PROCESSING', 'ON_SITE', 1, NOW(), NOW()),
('Refeição Rápida', 'Mini pizza e cerveja', 22.00, 7, 22.00, 'PREPARING', 'DELIVERY', 1, NOW(), NOW()),
('Festa Infantil', 'Churros e brigadeiros', 60.00, 8, 60.00, 'DELIVERED', 'PICKUP', 1, NOW(), NOW()),
('Relax com Chá', 'Chá e muffin', 11.50, 9, 11.50, 'PENDING', 'ON_SITE', 1, NOW(), NOW()),
('Último Pedido do Dia', 'Café e cookie', 8.50, 10, 8.50, 'PROCESSING', 'DELIVERY', 1, NOW(), NOW());