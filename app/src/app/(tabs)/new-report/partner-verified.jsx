import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CheckCircle, ArrowRight, Info } from "lucide-react-native";
import { useRouter } from "expo-router";
import ProgressSteps from "../../../components/ProgressSteps";

export default function PartnerVerifiedPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleContinue = () => {
    router.push("/new-report/capture-evidence");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar style="light" />

      <View
        style={{
          backgroundColor: "#1E3A8A",
          paddingTop: insets.top + 16,
          paddingBottom: 20,
          paddingHorizontal: 20,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "700", color: "#fff" }}>
          Driver Verified
        </Text>
        <Text style={{ fontSize: 14, color: "#93C5FD", marginTop: 4 }}>
          Step 2: Driver Information
        </Text>
      </View>

      <ProgressSteps currentStep={2} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* MyGDX Verification Notice */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 16,
            marginBottom: 12,
            backgroundColor: "#D1FAE5",
            borderRadius: 10,
            padding: 12,
          }}
        >
          <Text style={{ fontSize: 13, color: "#065F46", fontWeight: "500" }}>
            All information verified through MyGDX (Government Data Exchange). The data is legally binding.
          </Text>
        </View>

        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 20,
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Info color="#1E3A8A" size={24} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#1F2937",
                marginLeft: 12,
              }}
            >
              Driver Information
            </Text>
          </View>

          {[
            { label: "Full Name", value: "AHMAD BIN ALI" },
            { label: "IC Number", value: "920505-14-5678" },
            { label: "Phone Number", value: "+60 12-345 6789" },
            {
              label: "Driving License Validity",
              value: "Valid until 05/05/2027",
            },
            { label: "Car Model", value: "Toyota Vios 2022" },
            {
              label: "Vehicle Registration (Plate Number)",
              value: "WBB 5678 C",
            },
          ].map((item, index) => (
            <View key={index} style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>
                {item.label}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#1F2937",
                    flex: 1,
                  }}
                >
                  {item.value}
                </Text>
                <CheckCircle color="#10B981" size={20} />
              </View>
            </View>
          ))}

          <View
            style={{
              backgroundColor: "#D1FAE5",
              borderRadius: 8,
              padding: 12,
              borderWidth: 1,
              borderColor: "#10B981",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#065F46",
                marginBottom: 4,
              }}
            >
              Road Tax: VALID
            </Text>
            <Text style={{ fontSize: 12, color: "#047857" }}>
              Expiry: 15/08/2026
            </Text>
          </View>
        </View>

        <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={handleContinue}
            style={{
              backgroundColor: "#F97316",
              paddingVertical: 18,
              paddingHorizontal: 24,
              borderRadius: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: "700",
                marginRight: 12,
              }}
            >
              Continue to Photo Capture
            </Text>
            <ArrowRight color="#fff" size={24} />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}
