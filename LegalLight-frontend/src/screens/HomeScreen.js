import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import { askGemini } from "../api/gemini";

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState([]);
  const [chatVisible, setChatVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);

  // Default popular laws
  const defaultLaws = [
    {
      title: "Right to Information Act, 2005",
      desc: "Empowers citizens to request information from public authorities for transparency.",
    },
    {
      title: "Indian Penal Code, 1860",
      desc: "Defines crimes and punishments in India, forming the core criminal law framework.",
    },
    {
      title: "Consumer Protection Act, 2019",
      desc: "Safeguards consumer interests and establishes dispute redressal commissions.",
    },
    {
      title: "IT Act, 2000",
      desc: "Covers cybercrimes, data protection, and electronic commerce regulations.",
    },
  ];

  // 📰 Fetch latest legal news (law & legal practice only)
  const fetchNews = async () => {
    try {
      const response = await axios.get(
        "https://newsapi.org/v2/everything?q=law+legal+court+judgement&apiKey=41423375abf141fba9484d26a2a4a8bd"
      );
      setNews(response.data.articles.slice(0, 5)); // Show top 5 news
    } catch (error) {
      console.error("News fetch error:", error);
    }
  };

  // 🔍 Search function
  const fetchResults = async (text) => {
    if (!text.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.56.1:8080/api/search?query=${text}`
      );
      setResults(response.data);
    } catch (error) {
      console.error("Search Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce effect
  useEffect(() => {
    const delay = setTimeout(() => fetchResults(query), 500);
    return () => clearTimeout(delay);
  }, [query]);

  useEffect(() => {
    fetchNews();
  }, []);

  // 🤖 Chatbot handler
  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { sender: "user", text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setBotTyping(true);

    const aiReply = await askGemini(chatInput);
    const botMsg = { sender: "bot", text: aiReply };
    setChatMessages((prev) => [...prev, botMsg]);
    setBotTyping(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.header}>Legal Light</Text>
        <Text style={styles.subText}>Empowering you with Legal Knowledge</Text>

        {/* Search */}
        <TextInput
          style={styles.input}
          placeholder="Search for laws, rights, or issues..."
          value={query}
          onChangeText={setQuery}
        />

        {loading ? (
          <ActivityIndicator color="#1976D2" style={{ marginTop: 20 }} />
        ) : (
          query.length > 0 && (
            <FlatList
              data={results}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDesc}>{item.description}</Text>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.noResults}>
                  No results found for "{query}"
                </Text>
              }
            />
          )
        )}

        {/* Default Popular Laws */}
        {query.length === 0 && (
          <>
            <Text style={styles.sectionTitle}>📘 Popular Laws</Text>
            {defaultLaws.map((law, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.cardTitle}>{law.title}</Text>
                <Text style={styles.cardDesc}>{law.desc}</Text>
              </View>
            ))}
          </>
        )}

        {/* Latest Legal News */}
        <Text style={styles.sectionTitle}>📰 Latest Legal News</Text>
        {news.length > 0 ? (
          news.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.newsCard}
              onPress={() => Linking.openURL(item.url)}
            >
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsSource}>{item.source.name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <ActivityIndicator color="#2563EB" style={{ marginTop: 10 }} />
        )}
      </ScrollView>

      {/* Floating Chatbot */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => setChatVisible(true)}
      >
        <Text style={styles.chatIcon}>💬</Text>
      </TouchableOpacity>

      {/* Chat Modal */}
      <Modal
        transparent
        visible={chatVisible}
        animationType="slide"
        onRequestClose={() => setChatVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalContainer}
        >
          <View style={styles.chatContainer}>
            <Text style={styles.chatTitle}>AI Legal Chatbot 🤖</Text>

            <FlatList
              data={chatMessages}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageBubble,
                    item.sender === "user"
                      ? styles.userBubble
                      : styles.botBubble,
                  ]}
                >
                  <Text style={styles.messageText}>{item.text}</Text>
                </View>
              )}
            />

            {botTyping && <ActivityIndicator color="#2563EB" />}

            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatInput}
                placeholder="Ask your legal question..."
                value={chatInput}
                onChangeText={setChatInput}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleChatSend}>
                <Text style={styles.sendText}>Send</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setChatVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E3F2FD", padding: 15 },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0D47A1",
    textAlign: "center",
    marginTop: 30,
  },
  subText: {
    textAlign: "center",
    fontSize: 15,
    color: "#555",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0D47A1",
    marginVertical: 15,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    elevation: 3,
  },
  cardTitle: { fontSize: 17, fontWeight: "bold", color: "#1976D2" },
  cardDesc: { color: "#333", marginTop: 5 },
  noResults: { textAlign: "center", marginTop: 10, color: "#666" },
  newsCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
  },
  newsTitle: { fontWeight: "600", fontSize: 15, color: "#111" },
  newsSource: { color: "#777", fontSize: 13 },

  chatButton: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#2563EB",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  chatIcon: { color: "#fff", fontSize: 25 },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  chatContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "70%",
  },
  chatTitle: { fontSize: 18, fontWeight: "bold", color: "#0D47A1", marginBottom: 10 },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  userBubble: { backgroundColor: "#DCF8C6", alignSelf: "flex-end" },
  botBubble: { backgroundColor: "#E0E0E0", alignSelf: "flex-start" },
  messageText: { fontSize: 15 },
  chatInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 10,
  },
  sendButton: {
    backgroundColor: "#2563EB",
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  sendText: { color: "#fff", fontWeight: "600" },
  closeButton: { alignSelf: "center", marginTop: 10 },
  closeText: { color: "#D32F2F", fontWeight: "600" },
});
