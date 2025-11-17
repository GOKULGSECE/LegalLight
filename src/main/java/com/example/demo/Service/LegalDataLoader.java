package com.example.demo.Service;

import com.example.demo.Models.DocumentSection;
import jakarta.annotation.PostConstruct;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class LegalDataLoader {

    private final List<DocumentSection> allSections = new ArrayList<>();

    @PostConstruct
    public void init() throws Exception {
        System.out.println("Loading JSON files from resources/data...");

        URL folderUrl = getClass().getClassLoader().getResource("data");
        if (folderUrl == null) {
            System.out.println("No data folder found in resources. Create src/main/resources/data and add JSON files.");
            return;
        }

        File folder = new File(folderUrl.toURI());
        File[] files = folder.listFiles((dir, name) -> name.toLowerCase().endsWith(".json"));

        if (files == null || files.length == 0) {
            System.out.println("No JSON files found under resources/data.");
            return;
        }

        Jsonb jsonb = JsonbBuilder.create();

        for (File f : Objects.requireNonNull(files)) {
            System.out.println("Reading: " + f.getName());
            try (FileReader reader = new FileReader(f)) {
                List<DocumentSection> sections = jsonb.fromJson(reader, new ArrayList<DocumentSection>() {}.getClass().getGenericSuperclass());
                allSections.addAll(sections);
            }
        }
        System.out.println("Loaded " + allSections.size() + " sections.");
    }

    public List<DocumentSection> getAllSections() {
        return allSections;
    }
}
