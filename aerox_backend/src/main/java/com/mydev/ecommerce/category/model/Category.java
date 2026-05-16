// package com.mydev.ecommerce.category.model;

// import jakarta.persistence.*;
// import lombok.Getter;
// import lombok.Setter;

// @Entity
// @Table(name="categories")
// @Getter @Setter
// public class Category {
//   @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
//   private Long id;

//   @Column(nullable=false, unique=true, length=120)
//   private String name;
// }














package com.mydev.ecommerce.category.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "categories")
@Getter
@Setter
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String name;

    @Column(name = "image_url", length = 500)
    private String imageUrl;
}