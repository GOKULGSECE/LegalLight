package com.example.demo.Service;

import com.example.demo.Models.DocumentSection;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class VectorStore {

    private final List<DocumentSection> sections;
    private final List<List<Double>> embeddings; // Changed to List<Double> for Gemini API
//    private final EmbeddingService embeddingService;

    public VectorStore(List<DocumentSection> sections) {
        this.sections = sections;
//        this.embeddingService = embeddingService;
        this.embeddings = new ArrayList<>();

        // Precompute embeddings for all document sections
        for (DocumentSection doc : sections) {
            try {
//                embeddings.add(embeddingService.getEmbedding(doc.getDescription()));
            } catch (Exception e) {
                throw new RuntimeException("Failed to embed section:");
            }
        }
    }

    public List<DocumentSection> search(String query, int topK) throws Exception {
//        List<Double> queryVec = embeddingService.getEmbedding(query);

        // Use a priority queue to store top-k most similar documents
        PriorityQueue<Map.Entry<Integer, Double>> pq = new PriorityQueue<>(Map.Entry.comparingByValue());

        for (int i = 0; i < embeddings.size(); i++) {
//            double score = embeddingService.cosineSimilarity(queryVec, embeddings.get(i));
//            pq.offer(new AbstractMap.SimpleEntry<>(i, score));
            if (pq.size() > topK) pq.poll();
        }

        // Extract top results in descending order
        List<DocumentSection> result = new ArrayList<>();
        while (!pq.isEmpty()) {
            result.add(sections.get(pq.poll().getKey()));
        }
        Collections.reverse(result);
        return result;
    }
}
