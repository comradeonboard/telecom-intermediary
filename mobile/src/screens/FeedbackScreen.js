import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Modal } from "react-native";

const API = "http://localhost:3001/api";

export default function FeedbackScreen() {
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ customer_id: "", company_id: "", subject: "", message: "" });

  useEffect(() => {
    fetch(`${API}/feedback`).then((r) => r.json()).then(setItems);
  }, []);

  const handleSubmit = () => {
    fetch(`${API}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then(() => {
      setModalVisible(false);
      setForm({ customer_id: "", company_id: "", subject: "", message: "" });
      fetch(`${API}/feedback`).then((r) => r.json()).then(setItems);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedback</Text>
      <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.addBtnText}>+ Add Feedback</Text>
      </TouchableOpacity>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowTitle}>{item.customer_name || "Unknown"} → {item.company_name || "Unknown"}</Text>
            <Text style={styles.rowSub}>{item.subject || "No subject"}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
          </View>
        )}
      />
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Add Feedback</Text>
          <TextInput placeholder="Customer ID" value={form.customer_id} onChangeText={(t) => setForm({ ...form, customer_id: t })} style={styles.input} />
          <TextInput placeholder="Company ID" value={form.company_id} onChangeText={(t) => setForm({ ...form, company_id: t })} style={styles.input} />
          <TextInput placeholder="Subject" value={form.subject} onChangeText={(t) => setForm({ ...form, subject: t })} style={styles.input} />
          <TextInput placeholder="Message" value={form.message} onChangeText={(t) => setForm({ ...form, message: t })} style={styles.input} />
          <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.cancelBtn}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  addBtn: { backgroundColor: "#1a1a2e", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 12 },
  addBtnText: { color: "#fff", fontWeight: "bold" },
  row: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 8 },
  rowTitle: { fontSize: 16, fontWeight: "bold" },
  rowSub: { color: "#888", marginTop: 4 },
  status: { marginTop: 4, fontSize: 12, color: "#666" },
  modal: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "rgba(0,0,0,0.5)" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#fff" },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 6, marginBottom: 8 },
  saveBtn: { backgroundColor: "#1a1a2e", padding: 12, borderRadius: 8, alignItems: "center" },
  saveBtnText: { color: "#fff", fontWeight: "bold" },
  cancelBtn: { textAlign: "center", marginTop: 12, color: "#888" },
});
