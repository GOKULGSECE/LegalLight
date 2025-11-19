package com.example.demo.Models;

public class DocumentSection {
    private String chapter;
    private String section;
    private String title;
    private String description;

    public DocumentSection() {}

    public DocumentSection(String chapter, String section, String title, String description) {
        this.chapter = chapter;
        this.section = section;
        this.title = title;
        this.description = description;
    }

    public String getChapter() { return chapter; }
    public void setChapter(String chapter) { this.chapter = chapter; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    @Override
    public String toString() {
        return "DocumentSection{" +
                "chapter='" + chapter + '\'' +
                ", section='" + section + '\'' +
                ", title='" + title + '\'' +
                ", description='" + (description == null ? "" : description.substring(0, Math.min(80, description.length()))) + "...'}";
    }
}
