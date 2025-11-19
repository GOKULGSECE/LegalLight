import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";

export default function DocumentCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{item.title}</Text>
      <Text numberOfLines={2} style={styles.summary}>
        {item.summary}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  summary: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
});
