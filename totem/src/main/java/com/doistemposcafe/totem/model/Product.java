package com.doistemposcafe.totem.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "product")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String description;
    private double price;
    @Column(name = "image_url")
    private String imageUrl;
    private String[] ingredients;
    private Integer amount;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;

    // Belongs to a restaurant
    @ManyToOne
    private Restaurant restaurant;

    // Belongs to a menu category
    @ManyToOne
    private MenuCategory menuCategory;

    // One product can have many order items
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();
}
