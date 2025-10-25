package com.example.demo.Service;

import org.springframework.stereotype.Service;
import java.io.*;

@Service
public class LocalLLMService {

    private Process llmProcess;
    private BufferedWriter llmWriter;
    private BufferedReader llmReader;

    public LocalLLMService() {
        try {
            System.out.println("🧠 [Simulated] Initializing Local LLM Service...");

            // Normally, we’d extract the model and executable here:
            // File gptExe = extractResourceToTemp("models/chat.exe", "chat", ".exe");
            // File modelFile = extractResourceToTemp("models/gpt4all-falcon-newbpe-q4_0.gguf", "model", ".gguf");

            File gptExe = new File("models/chat.exe");
            File modelFile = new File("models/gpt4all-falcon-newbpe-q4_0.gguf");
            if (!gptExe.exists() || !modelFile.exists()) {
                System.out.println("⚠️ Model or executable not found — running in MOCK mode.");
            }
            llmProcess = null;
            llmWriter = null;
            llmReader = null;

            System.out.println("✅ Local LLM initialized successfully (mock mode).");

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("❌ Failed to initialize Local LLM (mock mode).");
        }
    }

    private File extractResourceToTemp(String resourcePath, String prefix, String suffix) throws IOException {
        InputStream in = getClass().getClassLoader().getResourceAsStream(resourcePath);
        if (in == null) {
            System.out.println("⚠️ Skipping extraction, resource not found: " + resourcePath);
            return new File(resourcePath);
        }
        File tempFile = File.createTempFile(prefix, suffix);
        tempFile.deleteOnExit();
        try (OutputStream out = new FileOutputStream(tempFile)) {
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
        }
        return tempFile;
    }

    public String generate(String prompt) {
        try {
            if (llmWriter == null || llmProcess == null) {
                return "[MOCK LLM] Generated response for: \"" + prompt + "\"";
            }

            llmWriter.write(prompt + "\n");
            llmWriter.flush();

            StringBuilder response = new StringBuilder();
            String line;
            while ((line = llmReader.readLine()) != null) {
                if (line.contains("###END###")) break;
                response.append(line).append("\n");
            }
            return response.toString().trim();

        } catch (IOException e) {
            return "[MOCK LLM ERROR] " + e.getMessage();
        }
    }

    public void close() {
        try {
            if (llmWriter != null) llmWriter.close();
            if (llmReader != null) llmReader.close();
            if (llmProcess != null) llmProcess.destroy();
            System.out.println("🛑 Local LLM Service closed (mock mode).");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
