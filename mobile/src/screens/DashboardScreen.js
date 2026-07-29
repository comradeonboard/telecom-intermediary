import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";

const API = "http://localhost:3001/api";

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState({ companies: 0, customers: 0, feedback: 0 });

  useEffect(() => {
    fetch(`${API}/companies`)
      .then((r) => r.json())
      .then((c) => setStats((s) => ({ ...s, companies: c.length })));
    fetch(`${API}/customers`)
      .then((r) => r.json())
      .then((c) => setStats((s) => ({ ...s, customers: c.length })));
    fetch(`${API}/feedback`)
      .then((r) => r.json())
      .then((c) => setStats((s) => ({ ...s, feedback: c.length })));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TelLink Dashboard</Text>
      {["companies", "customers", "feedback"].map((key) => (
        <TouchableOpacity
          key={key}
          style={styles.card}
          onPress={() => navigation.navigate(key.charAt(0).toUpperCase() + key.slice(1))}
        >
          <Text style={styles.cardTitle}>{key}</Text>
          <Text style={styles.cardValue}>{stats[key]}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 8, marginBottom: 12, elevation: 1 },
  cardTitle: { fontSize: 16, color: "#888" },
  cardValue: { fontSize: 32, fontWeight: "bold", color: "#1a1a2e" },
});
