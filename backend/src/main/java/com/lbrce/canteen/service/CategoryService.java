package com.lbrce.canteen.service;

import com.lbrce.canteen.dto.CategoryRequest;
import com.lbrce.canteen.dto.CategoryResponse;
import com.lbrce.canteen.entity.Category;
import com.lbrce.canteen.exception.ConflictException;
import com.lbrce.canteen.exception.NotFoundException;
import com.lbrce.canteen.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final DtoMapper mapper;

    public CategoryService(CategoryRepository categoryRepository, DtoMapper mapper) {
        this.categoryRepository = categoryRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> list() {
        return mapper.toCategories(categoryRepository.findByActiveTrueOrderByDisplayOrderAsc());
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> listAll() {
        return mapper.toCategories(categoryRepository.findAll());
    }

    @Transactional
    public CategoryResponse create(CategoryRequest req) {
        if (categoryRepository.existsByName(req.name())) {
            throw new ConflictException("Category already exists: " + req.name());
        }
        Category c = new Category();
        c.setName(req.name());
        c.setDisplayOrder(req.displayOrder() == null ? 0 : req.displayOrder());
        c.setActive(req.active() == null ? Boolean.TRUE : req.active());
        return mapper.toCategory(categoryRepository.save(c));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest req) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found: " + id));
        c.setName(req.name());
        if (req.displayOrder() != null) c.setDisplayOrder(req.displayOrder());
        if (req.active() != null) c.setActive(req.active());
        return mapper.toCategory(c);
    }

    @Transactional
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new NotFoundException("Category not found: " + id);
        }
        categoryRepository.deleteById(id);
    }
}