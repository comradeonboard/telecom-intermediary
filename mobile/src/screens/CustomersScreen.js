import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Modal } from "react-native";

const API = "http://localhost:3001/api";

export default function CustomersScreen({ navigation }) {
  const [customers, setCustomers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company_id: "" });

  useEffect(() => {
    fetch(`${API}/customers`).then((r) => r.json()).then(setCustomers);
  }, []);

  const handleSubmit = () => {
    fetch(`${API}/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, company_id: form.company_id || null }),
    }).then(() => {
      setModalVisible(false);
      setForm({ name: "", email: "", phone: "", company_id: "" });
      fetch(`${API}/customers`).then((r) => r.json()).then(setCustomers);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customers</Text>
      <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.addBtnText}>+ Add Customer</Text>
      </TouchableOpacity>
      <FlatList
        data={customers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowTitle}>{item.name}</Text>
            <Text style={styles.rowSub}>{item.email || "no email"} — {item.company_name || "no company"}</Text>
          </View>
        )}
      />
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Add Customer</Text>
          <TextInput placeholder="Name" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} style={styles.input} />
          <TextInput placeholder="Email" value={form.email} onChangeText={(t) => setForm({ ...form, email: t })} style={styles.input} />
          <TextInput placeholder="Phone" value={form.phone} onChangeText={(t) => setForm({ ...form, phone: t })} style={styles.input} />
          <TextInput placeholder="Company ID" value={form.company_id} onChangeText={(t) => setForm({ ...form, company_id: t })} style={styles.input} />
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
  modal: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "rgba(0,0,0,0.5)" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#fff" },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 6, marginBottom: 8 },
  saveBtn: { backgroundColor: "#1a1a2e", padding: 12, borderRadius: 8, alignItems: "center" },
  saveBtnText: { color: "#fff", fontWeight: "bold" },
  cancelBtn: { textAlign: "center", marginTop: 12, color: "#888" },
});
