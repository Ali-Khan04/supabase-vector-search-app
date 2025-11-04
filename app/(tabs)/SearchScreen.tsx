import React, { useState } from "react";
import { View, TextInput, Button, FlatList, Text, ActivityIndicator } from "react-native";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/embed`;

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ text: query, mode: "search" }),
      });

      const data = await res.json();
      setResults(data || []);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f9fafb" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
         Semantic Employee Search
      </Text>

      <TextInput
        placeholder="e.g. Find engineers in New York"
        value={query}
        onChangeText={setQuery}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 8,
          marginBottom: 10,
        }}
      />

      <Button title={loading ? "Searching..." : "Search"} onPress={handleSearch} disabled={loading} />

      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

      <FlatList
        data={results}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              marginBottom: 10,
              backgroundColor: "#fff",
              borderRadius: 8,
              elevation: 1,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {item.full_name}
            </Text>
            <Text>{item.job_title}</Text>
            <Text>{item.department}</Text>
            {item.similarity && (
              <Text style={{ color: "gray" }}>
                Similarity: {(item.similarity * 100).toFixed(1)}%
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
}