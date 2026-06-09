


// package com.mydev.ecommerce.product.dto;

// import java.util.List;

// public record ProductResponse(
//         Long id,
//         String title,
//         String description,
//         Integer priceInr,
//         Integer mrpInr,
//         Integer discountPercent,
//         Integer stock,

//         Integer displayOrder,
//         Long categoryId,
//         String category,

//         List<String> images,
//         List<ProductReviewResponse> reviews,

//         String shortHighlights,
//         String specificationsJson,
//         String featureHighlightsJson,
//         String faqJson,
//         String warrantyInfo,
//         String boxContentsJson,
//         String compatibility,
//         String demoVideoUrl,
//         String pdpBannersJson
// ) {}


















package com.mydev.ecommerce.product.dto;

import java.util.List;

public record ProductResponse(
        Long id,
        String title,
        String description,
        Integer priceInr,
        Integer mrpInr,
        Integer discountPercent,
        Integer stock,

        Integer displayOrder,
        Long categoryId,
        String category,

        List<String> images,

        // /api/products => []
        // /api/products/{id} => full reviews
        List<ProductReviewResponse> reviews,

        // Available in both list and detail APIs
        Double averageRating,
        Long reviewCount,

        String shortHighlights,
        String specificationsJson,
        String featureHighlightsJson,
        String faqJson,
        String warrantyInfo,
        String boxContentsJson,
        String compatibility,
        String demoVideoUrl,
        String pdpBannersJson
) {}