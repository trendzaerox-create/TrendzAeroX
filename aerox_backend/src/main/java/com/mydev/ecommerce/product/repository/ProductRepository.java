



package com.mydev.ecommerce.product.repository;

import com.mydev.ecommerce.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("""
    SELECT DISTINCT p
    FROM Product p
    LEFT JOIN FETCH p.images
    LEFT JOIN FETCH p.reviews
    WHERE p.active = true 
      AND p.deleted = false
    ORDER BY p.displayOrder ASC, p.id ASC
    """)
    List<Product> findAllWithImages();

    @Query("""
    SELECT DISTINCT p
    FROM Product p
    LEFT JOIN FETCH p.images
    LEFT JOIN FETCH p.reviews
    WHERE p.category.id = :categoryId
      AND p.active = true
      AND p.deleted = false
    ORDER BY p.displayOrder ASC, p.id ASC
    """)
    List<Product> findByCategoryIdWithImages(Long categoryId);

    @Query("""
    SELECT DISTINCT p
    FROM Product p
    LEFT JOIN FETCH p.images
    LEFT JOIN FETCH p.reviews
    WHERE p.id = :id
      AND p.active = true
      AND p.deleted = false
    """)
    Optional<Product> findByIdWithImages(Long id);

    @Query("""
    SELECT DISTINCT p
    FROM Product p
    LEFT JOIN FETCH p.images
    LEFT JOIN FETCH p.reviews
    ORDER BY p.displayOrder ASC, p.id ASC
    """)
    List<Product> findAllAdminWithImages();

    @Query("""
    SELECT DISTINCT p
    FROM Product p
    LEFT JOIN FETCH p.images
    LEFT JOIN FETCH p.reviews
    WHERE p.id = :id
    """)
    Optional<Product> findAdminByIdWithImages(Long id);

    @Query("""
    SELECT COALESCE(MAX(p.displayOrder), 0)
    FROM Product p
    """)
    Integer findMaxDisplayOrder();
}