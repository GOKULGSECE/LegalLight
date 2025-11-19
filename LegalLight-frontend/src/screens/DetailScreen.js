import React from "react";
import { SafeAreaView, Text, ScrollView, StyleSheet } from "react-native";

export default function DetailScreen({ route }) {
  const { section } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{section.title}</Text>
      <ScrollView>
        <Text style={styles.content}>{section.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  content: { fontSize: 16, lineHeight: 22 },
});
