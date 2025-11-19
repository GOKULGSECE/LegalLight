import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  Linking,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export default function NewsScreen() {
  const navigation = useNavigation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const response = await axios.get("http://192.168.56.1:8080/api/news");
      console.log("Fetched news:", response.data);
      setNews(response.data.articles || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Loading latest news...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Latest Legal News</Text>

      <FlatList
        data={news}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => Linking.openURL(item.url)} 
          >
            {item.urlToImage && (
              <Image source={{ uri: item.urlToImage }} style={styles.image} />
            )}
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>
              {item.description || "No description available."}
            </Text>
            <Text style={styles.cardSource}>
              Source: {item.source?.name || "Unknown"} |{" "}
              {new Date(item.publishedAt).toDateString()}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 60 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#1976D2" },
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
  card: {
    backgroundColor: "#E3F2FD",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  image: { width: "100%", height: 180, borderRadius: 10, marginBottom: 10 },
  cardTitle: { fontWeight: "bold", fontSize: 16, color: "#0D47A1" },
  cardDesc: { marginTop: 5, fontSize: 14, color: "#333" },
  cardSource: {
    marginTop: 8,
    fontSize: 12,
    color: "#555",
    fontStyle: "italic",
  },
});
