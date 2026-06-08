



// package com.mydev.ecommerce.product.service;

// import com.mydev.ecommerce.product.dto.ProductResponse;
// import com.mydev.ecommerce.product.dto.ProductReviewResponse;
// import com.mydev.ecommerce.product.model.Product;
// import com.mydev.ecommerce.product.repository.ProductRepository;
// import jakarta.persistence.EntityNotFoundException;
// import org.springframework.stereotype.Service;

// import java.util.Comparator;
// import java.util.List;
// import java.util.stream.Collectors;

// @Service
// public class ProductService {

//     private final ProductRepository repo;

//     public ProductService(ProductRepository repo) {
//         this.repo = repo;
//     }

//     public List<ProductResponse> getProducts(Long categoryId) {
//         List<Product> products;

//         if (categoryId != null) {
//             products = repo.findByCategoryIdWithImages(categoryId);
//         } else {
//             products = repo.findAllWithImages();
//         }

//         return products.stream()
//                 .sorted(
//                         Comparator
//                                 .comparing(
//                                         Product::getDisplayOrder,
//                                         Comparator.nullsLast(Integer::compareTo)
//                                 )
//                                 .thenComparing(Product::getId)
//                 )
//                 .map(this::mapToDTO)
//                 .toList();
//     }

//     public ProductResponse getProduct(Long id) {
//         Product p = repo.findByIdWithImages(id)
//                 .orElseThrow(() -> new EntityNotFoundException("Product not found"));

//         return mapToDTO(p);
//     }

//     private ProductResponse mapToDTO(Product p) {
//         List<String> images = p.getImages()
//                 .stream()
//                 .map(i -> i.getImageUrl())
//                 .collect(Collectors.toList());

//         List<ProductReviewResponse> reviews = p.getReviews()
//                 .stream()
//                 .map(r -> new ProductReviewResponse(
//                         r.getId(),
//                         r.getReviewerName(),
//                         r.getRating(),
//                         r.getReviewText(),
//                         r.isFeatured()
//                 ))
//                 .toList();

//         return new ProductResponse(
//                 p.getId(),
//                 p.getTitle(),
//                 p.getDescription(),
//                 p.getPriceInr(),
//                 p.getMrpInr(),
//                 p.getDiscountPercent(),
//                 p.getStock(),

//                 p.getDisplayOrder(),
//                 p.getCategory() != null ? p.getCategory().getId() : null,
//                 p.getCategory() != null ? p.getCategory().getName() : null,

//                 images,
//                 reviews,
//                 p.getShortHighlights(),
//                 p.getSpecificationsJson(),
//                 p.getFeatureHighlightsJson(),
//                 p.getFaqJson(),
//                 p.getWarrantyInfo(),
//                 p.getBoxContentsJson(),
//                 p.getCompatibility(),
//                 p.getDemoVideoUrl(),
//                 p.getPdpBannersJson()
//         );
//     }
// }









































package com.mydev.ecommerce.product.service;

import com.mydev.ecommerce.product.dto.ProductResponse;
import com.mydev.ecommerce.product.dto.ProductReviewResponse;
import com.mydev.ecommerce.product.model.Product;
import com.mydev.ecommerce.product.model.ProductReview;
import com.mydev.ecommerce.product.repository.ProductRepository;
import com.mydev.ecommerce.product.repository.ProductReviewRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository repo;
    private final ProductReviewRepository reviewRepo;

    public ProductService(ProductRepository repo, ProductReviewRepository reviewRepo) {
        this.repo = repo;
        this.reviewRepo = reviewRepo;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getProducts(Long categoryId, int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);

        Pageable pageable = PageRequest.of(safePage, safeSize);

        List<Long> ids = categoryId != null
                ? repo.findActiveProductIdsByCategoryId(categoryId, pageable)
                : repo.findActiveProductIds(pageable);

        if (ids.isEmpty()) {
            return List.of();
        }

        List<Product> products = repo.findProductsWithImagesByIds(ids);

        return products.stream()
                .sorted(
                        Comparator
                                .comparing(
                                        Product::getDisplayOrder,
                                        Comparator.nullsLast(Integer::compareTo)
                                )
                                .thenComparing(Product::getId)
                )
                .map(product -> mapToDTO(product, false))
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getProduct(Long id) {
        Product product = repo.findActiveByIdWithImages(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        return mapToDTO(product, true);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAdminProducts(int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);

        Pageable pageable = PageRequest.of(safePage, safeSize);

        List<Long> ids = repo.findAdminProductIds(pageable);

        if (ids.isEmpty()) {
            return List.of();
        }

        List<Product> products = repo.findProductsWithImagesByIds(ids);

        return products.stream()
                .sorted(
                        Comparator
                                .comparing(
                                        Product::getDisplayOrder,
                                        Comparator.nullsLast(Integer::compareTo)
                                )
                                .thenComparing(Product::getId)
                )
                .map(product -> mapToDTO(product, false))
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getAdminProduct(Long id) {
        Product product = repo.findAdminByIdWithImages(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        return mapToDTO(product, true);
    }

    private ProductResponse mapToDTO(Product product, boolean includeReviews) {
        List<String> images = product.getImages()
                .stream()
                .map(image -> image.getImageUrl())
                .collect(Collectors.toList());

        List<ProductReviewResponse> reviews = List.of();

        if (includeReviews) {
            List<ProductReview> productReviews =
                    reviewRepo.findByProductIdOrderByIdDesc(product.getId());

            reviews = productReviews.stream()
                    .map(review -> new ProductReviewResponse(
                            review.getId(),
                            review.getReviewerName(),
                            review.getRating(),
                            review.getReviewText(),
                            review.isFeatured()
                    ))
                    .toList();
        }

        return new ProductResponse(
                product.getId(),
                product.getTitle(),
                product.getDescription(),
                product.getPriceInr(),
                product.getMrpInr(),
                product.getDiscountPercent(),
                product.getStock(),

                product.getDisplayOrder(),
                product.getCategory() != null ? product.getCategory().getId() : null,
                product.getCategory() != null ? product.getCategory().getName() : null,

                images,
                reviews,

                product.getShortHighlights(),
                product.getSpecificationsJson(),
                product.getFeatureHighlightsJson(),
                product.getFaqJson(),
                product.getWarrantyInfo(),
                product.getBoxContentsJson(),
                product.getCompatibility(),
                product.getDemoVideoUrl(),
                product.getPdpBannersJson()
        );
    }
}