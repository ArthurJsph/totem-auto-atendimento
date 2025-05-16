package com.doistemposcafe.totem.repository;

import com.doistemposcafe.totem.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
public Restaurant findByName(String name);
}
