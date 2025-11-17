package com.example.demo.Controller;

import com.example.demo.Models.DocumentSection;
import com.example.demo.Service.KeywordSearchService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@CrossOrigin("*")
public class SearchController {

    private final KeywordSearchService searchService;

    public SearchController(KeywordSearchService searchService) {
        this.searchService = searchService;
    }
    @GetMapping
    public List<DocumentSection> searchGet(@RequestParam String query,
                                           @RequestParam(defaultValue = "100") int topK) {
        return searchService.search(query, topK);
    }
    @PostMapping
    public List<DocumentSection> searchPost(@RequestBody SearchRequest req) {
        return searchService.search(req.getQuery(), req.getTopK() == 0 ? 100 : req.getTopK());
    }

    public static class SearchRequest {
        private String query;
        private int topK;
        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }
        public int getTopK() { return topK; }
        public void setTopK(int topK) { this.topK = topK; }
    }
}
