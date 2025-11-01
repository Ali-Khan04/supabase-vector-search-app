import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
  <Tabs>
  <Tabs.Screen name="SearchScreen" options={{ title: "Search" }} />
  <Tabs.Screen name="InsertScreen" options={{ title: "Add Employee" }} />
</Tabs>

  );
}
