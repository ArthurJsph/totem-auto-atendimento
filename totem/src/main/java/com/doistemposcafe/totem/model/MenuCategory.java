package com.doistemposcafe.totem.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "menu_category")
public class MenuCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;

    // Belongs to a restaurant
    @ManyToOne
    private Restaurant restaurant;

    // Has many products
    @OneToMany(mappedBy = "menuCategory", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Product> products = new ArrayList<>();


}

//CREATE TABLE IF NOT EXISTS "menu_category" (
//    "id" TEXT NOT NULL PRIMARY KEY,
//    "name" TEXT NOT NULL,
//    "restaurant_id" INTEGER NOT NULL,
//    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
//    "updated_at" TIMESTAMP(3) NOT NULL,
//    CONSTRAINT "menu_category_restaurant_fkey" FOREIGN KEY ("restaurant_id")
//        REFERENCES "restaurant" ("id") ON DELETE CASCADE
//);
