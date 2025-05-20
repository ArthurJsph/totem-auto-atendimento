package com.doistemposcafe.totem.controller;

import com.doistemposcafe.totem.dto.Input.RestaurantInputDTO;
import com.doistemposcafe.totem.dto.Output.RestaurantOutputDTO;
import com.doistemposcafe.totem.dto.mapper.RestaurantMapper;
import com.doistemposcafe.totem.model.Restaurant;
import com.doistemposcafe.totem.service.RestaurantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final RestaurantMapper restaurantMapper;

    public RestaurantController(RestaurantService restaurantService,
                                RestaurantMapper restaurantMapper) {
        this.restaurantService = restaurantService;
        this.restaurantMapper = restaurantMapper;
    }

    @GetMapping("/list")
    public ResponseEntity<List<RestaurantOutputDTO>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getRestaurants());
    }

    @GetMapping("/list/{id}")
    public ResponseEntity<RestaurantOutputDTO> getRestaurantById(@PathVariable Long id) {
        RestaurantOutputDTO restaurant = restaurantService.getRestaurantById(id);
        return restaurant != null ? ResponseEntity.ok(restaurant) : ResponseEntity.notFound().build();
    }

    @PostMapping("/save")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RestaurantOutputDTO> saveRestaurant(@RequestBody RestaurantInputDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(restaurantService.saveRestaurant(dto));
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RestaurantOutputDTO> updateRestaurant(@PathVariable Long id, @RequestBody RestaurantInputDTO dto) {
        return ResponseEntity.ok(restaurantService.updateRestaurant(dto, id));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long id) {
        boolean deleted = restaurantService.deleteRestaurant(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
