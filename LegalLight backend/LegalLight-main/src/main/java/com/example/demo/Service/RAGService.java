package com.example.demo.Service;

import com.example.demo.Models.DocumentSection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class RAGService {
    @Autowired
    private final VectorStore vectorStore;
//    private final LocalLLMService llmService;

    public RAGService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
//        this.llmService = llmService;
    }

    public String answerQuery(String query) throws Exception {
        List<DocumentSection> topSections = vectorStore.search(query, 5);

        StringBuilder context = new StringBuilder();
        for (DocumentSection sec : topSections) {
            context.append("Section: ").append(sec.getTitle()).append("\n")
                    .append(sec.getDescription()).append("\n\n");
        }

        String prompt = """
        You are a legal expert. Use the following law sections to answer the question.

        Context:
        %s

        Question: %s
        """.formatted(context.toString(), query);

//        return llmService.generate(prompt);
        return "";
    }

}
