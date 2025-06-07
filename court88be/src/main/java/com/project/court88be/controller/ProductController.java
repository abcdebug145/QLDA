package com.project.court88be.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.court88be.dto.ApiResponse;
import com.project.court88be.dto.ProductRequest;
import com.project.court88be.dto.ProductResponse;
import com.project.court88be.service.FileStorageService;
import com.project.court88be.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    private final FileStorageService fileStorageService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public ApiResponse<List<ProductResponse>> getAllProducts() {
        return ApiResponse.<List<ProductResponse>>builder()
                .success(true)
                .message("Lấy danh sách sản phẩm thành công")
                .data(productService.getAllProducts())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProductById(@PathVariable String id) {
        return ApiResponse.<ProductResponse>builder()
                .success(true)
                .message("Lấy thông tin sản phẩm thành công")
                .data(productService.getProductById(id))
                .build();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ProductResponse> createProduct(
            @RequestPart("product") String productJson,
            @RequestPart(value = "image", required = false) MultipartFile image) throws Exception {
        ProductRequest request = objectMapper.readValue(productJson, ProductRequest.class);
        if (image != null && !image.isEmpty()) {
            String imagePath = fileStorageService.saveFile(image);
            request.setImage(imagePath);
        }
        return ApiResponse.<ProductResponse>builder()
                .success(true)
                .message("Tạo sản phẩm thành công")
                .data(productService.createProduct(request))
                .build();
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ProductResponse> updateProduct(
            @PathVariable String id,
            @RequestPart("product") String productJson,
            @RequestPart(value = "image", required = false) MultipartFile image) throws Exception {
        ProductRequest request = objectMapper.readValue(productJson, ProductRequest.class);
        if (image != null && !image.isEmpty()) {
            // Xóa ảnh cũ nếu có
            ProductResponse oldProduct = productService.getProductById(id);
            if (oldProduct.getImage() != null) {
                fileStorageService.deleteFile(oldProduct.getImage());
            }
            // Lưu ảnh mới
            String imagePath = fileStorageService.saveFile(image);
            request.setImage(imagePath);
        }
        return ApiResponse.<ProductResponse>builder()
                .success(true)
                .message("Cập nhật sản phẩm thành công")
                .data(productService.updateProduct(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable String id) {
        // Xóa ảnh nếu có
        ProductResponse product = productService.getProductById(id);
        if (product.getImage() != null) {
            fileStorageService.deleteFile(product.getImage());
        }
        productService.deleteProduct(id);
        return ApiResponse.<Void>builder()
                .success(true)
                .message("Xóa sản phẩm thành công")
                .build();
    }
} 