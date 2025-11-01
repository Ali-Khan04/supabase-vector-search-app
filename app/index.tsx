import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function IndexScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome </Text>
      <Text style={styles.subtitle}>
        Explore the employee database by searching or
        adding new ones with AI-generated embeddings.
      </Text>
<View style={{flexDirection:"column",gap:20}}> 
  <Pressable
        style={styles.button}
       onPress={() => router.push("/(tabs)/SearchScreen")}
      >
        <Text style={styles.buttonText}>Search Employee</Text>
      </Pressable>
       <Pressable
        style={styles.button}
        onPress={() => router.push("/(tabs)/InsertScreen")}
      >
        <Text style={styles.buttonText}>Add Employee</Text>
      </Pressable></View>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FB",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E1E1E",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
