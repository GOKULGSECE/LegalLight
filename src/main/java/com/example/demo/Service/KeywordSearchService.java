package com.example.demo.Service;

import com.example.demo.Models.DocumentSection;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class KeywordSearchService {

    private final LegalDataLoader loader;

    public KeywordSearchService(LegalDataLoader loader) {
        this.loader = loader;
    }

    /**
     * Search the loaded documents and return top matches.
     * Ranking rules:
     *  - exact section number match => highest priority
     *  - title contains query => high
     *  - description contains query => medium
     *  - otherwise not returned
     */
    public List<DocumentSection> search(String query, int topK) {
        if (query == null || query.isBlank()) return Collections.emptyList();
        String q = query.trim().toLowerCase();

        List<ScoredSection> scored = new ArrayList<>();
        for (DocumentSection s : loader.getAllSections()) {
            double score = 0.0;
            String sec = s.getSection() == null ? "" : s.getSection().toLowerCase();
            if (!sec.isEmpty() && (q.equals(sec) || q.endsWith(" " + sec) || q.contains("section " + sec))) {
                score += 50.0;
            }
            String title = s.getTitle() == null ? "" : s.getTitle().toLowerCase();
            if (!title.isEmpty() && title.contains(q)) score += 20.0;

            String desc = s.getDescription() == null ? "" : s.getDescription().toLowerCase();
            if (!desc.isEmpty() && desc.contains(q)) score += 10.0;
            for (String token : q.split("\\s+")) {
                if (!token.isBlank()) {
                    if (!title.isEmpty() && title.contains(token)) score += 1.0;
                    if (!desc.isEmpty() && desc.contains(token)) score += 0.5;
                }
            }

            if (score > 0) scored.add(new ScoredSection(s, score));
        }
        return scored.stream()
                .sorted(Comparator.comparingDouble(ScoredSection::getScore).reversed())
                .limit(topK)
                .map(ScoredSection::getSection)
                .collect(Collectors.toList());
    }

    private static class ScoredSection {
        private final DocumentSection section;
        private final double score;
        public ScoredSection(DocumentSection s, double score) { this.section = s; this.score = score; }
        public DocumentSection getSection() { return section; }
        public double getScore() { return score; }
    }
}
