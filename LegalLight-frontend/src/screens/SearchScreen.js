import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export default function SearchScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Function to fetch results
  const fetchResults = async (text) => {
    if (!text.trim()) {
      setResults([]); // Clear results if query is empty
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

  // ✅ Debounce effect to fetch after 500ms of typing pause
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchResults(query);
    }, 500); // waits for 500ms

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <View style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Search Issues</Text>

      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={query}
        onChangeText={setQuery}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1976D2" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title || "No title"}</Text>
              <Text style={styles.cardDesc}>{item.description || "No description"}</Text>
            </View>
          )}
          ListEmptyComponent={
            query.length > 0 && !loading ? (
              <Text style={styles.noResults}>No results found for "{query}"</Text>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 60 },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 10,
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
  },
  backText: {
    fontSize: 16,
    color: "#1976D2",
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#90CAF9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#E3F2FD",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  cardTitle: { fontWeight: "bold", fontSize: 16, color: "#0D47A1" },
  cardDesc: { marginTop: 5, fontSize: 14, color: "#333" },
  noResults: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
    fontSize: 14,
  },
});
