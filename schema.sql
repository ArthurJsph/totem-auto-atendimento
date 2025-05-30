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

-- Dados fictícios

-- Managers
INSERT INTO manager (name, email, password) VALUES
('Ana Silva', 'ana@delivery.com', 'senha123'),
('Carlos Souza', 'carlos@delivery.com', 'segredo456'),
('Fernanda Lima', 'fernanda@delivery.com', '123456'),
('Rafael Alves', 'rafael@delivery.com', 'abc123'),
('Juliana Rocha', 'juliana@delivery.com', 'senha789');

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

-- Orders (exemplos)
INSERT INTO orders (name, description, price, user_id, total, status, consumption_method, restaurant_id, created_at, updated_at) VALUES
('Pedido 1', 'Pedido de bebidas variadas', 25.00, 1, 25.00, 'PENDING', 'DELIVERY', 1, NOW(), NOW()),
('Pedido 2', 'Sobremesas para festa', 40.00, 2, 40.00, 'DELIVERED', 'PICKUP', 1, NOW(), NOW());

-- Orders_Product (exemplos)
INSERT INTO orders_product (name, product_id, order_id, price, quantity, status, created_at, updated_at) VALUES
('Café Expresso', (SELECT id FROM product WHERE name = 'Café Expresso'), 1, 4.50, 2, 'PREPARING', NOW(), NOW()),
('Torta de Limão', (SELECT id FROM product WHERE name = 'Torta de Limão'), 2, 7.00, 3, 'DELIVERED', NOW(), NOW());
