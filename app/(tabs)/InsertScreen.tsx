import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert, ScrollView, ActivityIndicator } from "react-native";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/embed`;

export default function InsertScreen() {
  const [employee, setEmployee] = useState({
    full_name: "",
    job_title: "",
    department: "",
    business_unit: "",
    country: "",
    city: "",
    bonus: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setEmployee((prev) => ({ ...prev, [key]: value }));
  };

  const handleInsert = async () => {
    if (!employee.full_name.trim()) {
      return Alert.alert("Error", "Full name is required!");
    }

    setLoading(true);
    try {
      const text = `${employee.full_name} is a ${employee.job_title} in the ${employee.department} department at the ${employee.business_unit} unit located in ${employee.city}, ${employee.country}. Bonus: ${
        employee.bonus || "N/A"
      }`;

      const res = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ text, mode: "insert" }),
      });

      const data = await res.json();
      
      Alert.alert("Success", "Employee added and embedded successfully!");

      
      setEmployee({
        full_name: "",
        job_title: "",
        department: "",
        business_unit: "",
        country: "",
        city: "",
        bonus: "",
      });
    } catch (error) {
      console.error(" Insert failed:", error);
        Alert.alert("Error", "Failed to add employee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "#f9fafb" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Add New Employee
      </Text>

      {[
        { key: "full_name", label: "Full Name" },
        { key: "job_title", label: "Job Title" },
        { key: "department", label: "Department" },
        { key: "business_unit", label: "Business Unit" },
        { key: "country", label: "Country" },
        { key: "city", label: "City" },
        { key: "bonus", label: "Bonus" },
      ].map(({ key, label }) => (
        <TextInput
          key={key}
          placeholder={label}
          value={employee[key]}
          onChangeText={(val) => handleChange(key, val)}
          style={styles.input}
        />
      ))}

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 10 }} />
      ) : (
        <Button title="Save Employee" onPress={handleInsert} />
      )}
    </ScrollView>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
};
