


// package com.mydev.ecommerce.product.controller;

// import com.mydev.ecommerce.product.dto.ProductResponse;
// import com.mydev.ecommerce.product.service.ProductService;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/products")
// public class ProductController {

//     private final ProductService service;

//     public ProductController(ProductService service) {
//         this.service = service;
//     }

//     @GetMapping
//     public List<ProductResponse> list(
//             @RequestParam(required = false) Long categoryId
//     ) {
//         return service.getProducts(categoryId);
//     }

//     @GetMapping("/{id}")
//     public ProductResponse one(@PathVariable Long id) {
//         return service.getProduct(id);
//     }
// }













package com.mydev.ecommerce.product.controller;

import com.mydev.ecommerce.product.dto.ProductResponse;
import com.mydev.ecommerce.product.dto.ProductReviewRequest;
import com.mydev.ecommerce.product.model.Product;
import com.mydev.ecommerce.product.model.ProductReview;
import com.mydev.ecommerce.product.repository.ProductRepository;
import com.mydev.ecommerce.product.repository.ProductReviewRepository;
import com.mydev.ecommerce.product.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;
    private final ProductRepository productRepo;
    private final ProductReviewRepository reviewRepo;

    public ProductController(
            ProductService service,
            ProductRepository productRepo,
            ProductReviewRepository reviewRepo
    ) {
        this.service = service;
        this.productRepo = productRepo;
        this.reviewRepo = reviewRepo;
    }

    @GetMapping
    public List<ProductResponse> list(
            @RequestParam(required = false) Long categoryId
    ) {
        return service.getProducts(categoryId);
    }

    @GetMapping("/{id}")
    public ProductResponse one(@PathVariable Long id) {
        return service.getProduct(id);
    }

    @PostMapping("/{id}/reviews")
    @Transactional
    public ProductReview addCustomerReview(
            @PathVariable Long id,
            @Valid @RequestBody ProductReviewRequest req
    ) {
        Product product = productRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        ProductReview review = new ProductReview();
        review.setProduct(product);
        review.setReviewerName(req.reviewerName());
        review.setRating(req.rating());
        review.setReviewText(req.reviewText());
        review.setFeatured(false);

        return reviewRepo.save(review);
    }
}