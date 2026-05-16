
// package com.mydev.ecommerce.category.dto;

// import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.Size;

// public record CategoryRequest(
//     @NotBlank(message = "Category name is required")
//     @Size(max = 100, message = "Category name must not exceed 100 characters")
//     String name
// ) {}











package com.mydev.ecommerce.category.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(

        @NotBlank(message = "Category name is required")
        @Size(max = 100, message = "Category name must not exceed 100 characters")
        String name,

        @Size(max = 500, message = "Category image URL must not exceed 500 characters")
        String imageUrl

) {}