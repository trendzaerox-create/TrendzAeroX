

// package com.mydev.ecommerce.category.controller;

// import com.mydev.ecommerce.category.dto.CategoryRequest;
// import com.mydev.ecommerce.category.model.Category;
// import com.mydev.ecommerce.category.repository.CategoryRepository;
// import jakarta.validation.Valid;
// import org.springframework.http.HttpStatus;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.server.ResponseStatusException;

// import java.util.List;

// @RestController
// @RequestMapping("/api/admin/categories")
// public class AdminCategoryController {

//     private final CategoryRepository repo;

//     public AdminCategoryController(CategoryRepository repo) {
//         this.repo = repo;
//     }

//     // ADMIN LIST
//     @GetMapping
//     public List<Category> list() {
//         return repo.findAll();
//     }

//     // ADMIN GET ONE
//     @GetMapping("/{id}")
//     public Category getOne(@PathVariable Long id) {
//         return repo.findById(id)
//                 .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
//     }

//     // CREATE
//     @PostMapping
//     @ResponseStatus(HttpStatus.CREATED)
//     public Category create(@Valid @RequestBody CategoryRequest req) {
//         Category c = new Category();
//         c.setName(req.name().trim());
//         return repo.save(c);
//     }

//     // UPDATE
//     @PutMapping("/{id}")
//     public Category update(@PathVariable Long id, @Valid @RequestBody CategoryRequest req) {
//         Category c = repo.findById(id)
//                 .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

//         c.setName(req.name().trim());
//         return repo.save(c);
//     }

//     // DELETE
//     @DeleteMapping("/{id}")
//     @ResponseStatus(HttpStatus.NO_CONTENT)
//     public void delete(@PathVariable Long id) {
//         Category c = repo.findById(id)
//                 .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
//         repo.delete(c);
//     }
// }














// package com.mydev.ecommerce.category.controller;

// import com.mydev.ecommerce.category.dto.CategoryRequest;
// import com.mydev.ecommerce.category.model.Category;
// import com.mydev.ecommerce.category.repository.CategoryRepository;
// import jakarta.validation.Valid;
// import org.springframework.http.HttpStatus;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.server.ResponseStatusException;

// import java.util.List;

// @RestController
// @RequestMapping("/api/admin/categories")
// public class AdminCategoryController {

//     private final CategoryRepository repo;

//     public AdminCategoryController(CategoryRepository repo) {
//         this.repo = repo;
//     }

//     @GetMapping
//     public List<Category> list() {
//         return repo.findAll();
//     }

//     @GetMapping("/{id}")
//     public Category getOne(@PathVariable Long id) {
//         return repo.findById(id)
//                 .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
//     }

//     @PostMapping
//     @ResponseStatus(HttpStatus.CREATED)
//     public Category create(@Valid @RequestBody CategoryRequest req) {
//         Category c = new Category();
//         c.setName(req.name().trim());

//         if (req.imageUrl() != null && !req.imageUrl().isBlank()) {
//             c.setImageUrl(req.imageUrl().trim());
//         }

//         return repo.save(c);
//     }

//     @PutMapping("/{id}")
//     public Category update(@PathVariable Long id, @Valid @RequestBody CategoryRequest req) {
//         Category c = repo.findById(id)
//                 .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

//         c.setName(req.name().trim());

//         if (req.imageUrl() != null && !req.imageUrl().isBlank()) {
//             c.setImageUrl(req.imageUrl().trim());
//         } else {
//             c.setImageUrl(null);
//         }

//         return repo.save(c);
//     }

//     @DeleteMapping("/{id}")
//     @ResponseStatus(HttpStatus.NO_CONTENT)
//     public void delete(@PathVariable Long id) {
//         Category c = repo.findById(id)
//                 .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

//         repo.delete(c);
//     }
// }









package com.mydev.ecommerce.category.controller;

import com.mydev.ecommerce.category.dto.CategoryRequest;
import com.mydev.ecommerce.category.model.Category;
import com.mydev.ecommerce.category.repository.CategoryRepository;
import com.mydev.ecommerce.common.service.FileStorageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/categories")
public class AdminCategoryController {

    private final CategoryRepository repo;
    private final FileStorageService fileStorageService;

    public AdminCategoryController(
            CategoryRepository repo,
            FileStorageService fileStorageService
    ) {
        this.repo = repo;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    public List<Category> list() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Category getOne(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"
                ));
    }

    @PostMapping("/upload-image")
    public Map<String, String> uploadCategoryImage(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        FileStorageService.UploadResult result =
                fileStorageService.saveCategoryFile(file);

        return Map.of(
                "imageUrl", result.imageUrl()
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Category create(@Valid @RequestBody CategoryRequest req) {
        Category c = new Category();
        c.setName(req.name().trim());

        if (req.imageUrl() != null && !req.imageUrl().isBlank()) {
            c.setImageUrl(req.imageUrl().trim());
        }

        return repo.save(c);
    }

    @PutMapping("/{id}")
    public Category update(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest req
    ) {
        Category c = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"
                ));

        c.setName(req.name().trim());

        if (req.imageUrl() != null && !req.imageUrl().isBlank()) {
            c.setImageUrl(req.imageUrl().trim());
        } else {
            c.setImageUrl(null);
        }

        return repo.save(c);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        Category c = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"
                ));

        repo.delete(c);
    }
}