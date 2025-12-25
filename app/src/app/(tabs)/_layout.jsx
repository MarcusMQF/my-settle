import { Tabs } from "expo-router";
import { Home, FileText, Shield } from "lucide-react-native";
import { useAuthStore } from "../../utils/auth/store";

export default function TabLayout() {
  const { auth } = useAuthStore();
  const isLoggedIn = !!auth;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "none",
        sceneStyle: { backgroundColor: '#F9FAFB' },
        lazy: false,
        tabBarStyle: isLoggedIn ? {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderColor: "#E5E7EB",
          paddingTop: 6,
          paddingBottom: 16,
          height: 90,
        } : { display: "none" },
        tabBarActiveTintColor: "#1E3A8A",
        tabBarInactiveTintColor: "#6B7280",
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ color }) => <FileText color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="verify"
        options={{
          title: "Verify",
          tabBarIcon: ({ color }) => <Shield color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="new-report/index"
        options={{
          href: null,
          animation: "none",
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="new-report/scan-partner"
        options={{
          href: null,
          animation: "none",
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="new-report/partner-verified"
        options={{
          href: null,
          animation: "none",
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="new-report/capture-evidence"
        options={{
          href: null,
          animation: "none",
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="new-report/review-sign"
        options={{
          href: null,
          animation: "none",
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="new-report/success"
        options={{
          href: null,
          animation: "none",
          tabBarStyle: { display: "none" },
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Tabs.Screen
        name="new-report/scene-details"
        options={{
          href: null,
          animation: "none",
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="new-report/statement"
        options={{
          href: null,
          animation: "none",
          tabBarStyle: { display: "none" },
        }}
      />

    </Tabs>
  );
}
