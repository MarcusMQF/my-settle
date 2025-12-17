import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Shield, Camera, AlertTriangle } from "lucide-react-native";
import { useState } from "react";

export default function VerifyPage() {
  const insets = useSafeAreaInsets();
  const [verificationResult, setVerificationResult] = useState(null);

  const handleScan = () => {
    // Simulate scanning - randomly show authorized or unauthorized
    setTimeout(() => {
      const isAuthorized = Math.random() > 0.5;
      setVerificationResult(isAuthorized ? "authorized" : "unauthorized");
    }, 2000);
  };

  const handleReset = () => {
    setVerificationResult(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#1E3A8A",
          paddingTop: insets.top + 20,
          paddingBottom: 24,
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: "#fff",
          }}
        >
          Verify Service
        </Text>
        <Text style={{ fontSize: 14, color: "#93C5FD", marginTop: 4 }}>
          Verify tow truck and service providers
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {!verificationResult ? (
          <>
            {/* Instructions */}
            <View
              style={{
                margin: 20,
                backgroundColor: "#FEF3C7",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#92400E",
                  marginBottom: 8,
                }}
              >
                How to Verify:
              </Text>
              <Text style={{ fontSize: 13, color: "#78350F", lineHeight: 20 }}>
                1. Ask the service provider for their ID{"\n"}
                2. Scan the QR code or ID number{"\n"}
                3. Check if they are authorized panel providers
              </Text>
            </View>

            {/* Scan Button */}
            <View
              style={{
                marginHorizontal: 20,
                marginBottom: 20,
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 32,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
                alignItems: "center",
              }}
            >
              <Shield color="#1E3A8A" size={80} />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#1F2937",
                  marginTop: 20,
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                Verify Service Provider
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#6B7280",
                  marginBottom: 24,
                  textAlign: "center",
                }}
              >
                Scan to verify if the provider is authorized
              </Text>

              <TouchableOpacity
                onPress={handleScan}
                style={{
                  backgroundColor: "#F97316",
                  paddingVertical: 16,
                  paddingHorizontal: 32,
                  borderRadius: 12,
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Camera color="#fff" size={24} />
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "700",
                    marginLeft: 12,
                  }}
                >
                  Scan Provider ID
                </Text>
              </TouchableOpacity>
            </View>

            {/* Info */}
            <View
              style={{
                marginHorizontal: 20,
                backgroundColor: "#DBEAFE",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <Text style={{ fontSize: 12, color: "#1E3A8A", lineHeight: 18 }}>
                ℹ️ Only use authorized panel service providers to ensure your
                insurance claim is processed smoothly. Unauthorized providers
                may void your coverage.
              </Text>
            </View>
          </>
        ) : (
          <>
            {/* Verification Result */}
            {verificationResult === "authorized" ? (
              <View
                style={{
                  margin: 20,
                  backgroundColor: "#10B981",
                  borderRadius: 12,
                  padding: 40,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                  }}
                >
                  <Shield color="#fff" size={80} />
                </View>

                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "700",
                    color: "#fff",
                    textAlign: "center",
                    marginBottom: 12,
                  }}
                >
                  AUTHORIZED PROVIDER
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    color: "#D1FAE5",
                    textAlign: "center",
                    marginBottom: 24,
                  }}
                >
                  XYZ Towing Services Sdn Bhd
                </Text>

                <View
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: 8,
                    padding: 16,
                    width: "100%",
                  }}
                >
                  <Text
                    style={{ fontSize: 12, color: "#065F46", marginBottom: 8 }}
                  >
                    <Text style={{ fontWeight: "700" }}>License:</Text>{" "}
                    TOW-2025-12345
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: "#065F46", marginBottom: 8 }}
                  >
                    <Text style={{ fontWeight: "700" }}>Valid Until:</Text>{" "}
                    31/12/2025
                  </Text>
                  <Text style={{ fontSize: 12, color: "#065F46" }}>
                    <Text style={{ fontWeight: "700" }}>Coverage:</Text>{" "}
                    Nationwide
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={{
                  margin: 20,
                  backgroundColor: "#EF4444",
                  borderRadius: 12,
                  padding: 40,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                  }}
                >
                  <AlertTriangle color="#fff" size={80} />
                </View>

                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "700",
                    color: "#fff",
                    textAlign: "center",
                    marginBottom: 12,
                  }}
                >
                  WARNING
                </Text>

                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#fff",
                    textAlign: "center",
                    marginBottom: 16,
                  }}
                >
                  Unauthorized Provider
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    color: "#FEE2E2",
                    textAlign: "center",
                  }}
                >
                  This service provider is not in our authorized panel. Using
                  unauthorized providers may void your insurance coverage.
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
              <TouchableOpacity
                onPress={handleReset}
                style={{
                  backgroundColor: "#1E3A8A",
                  paddingVertical: 16,
                  paddingHorizontal: 24,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "700",
                  }}
                >
                  Scan Another Provider
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
