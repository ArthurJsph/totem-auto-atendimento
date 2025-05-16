package com.doistemposcafe.totem.repository;

import com.doistemposcafe.totem.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
public Product findByName(String name);
}
