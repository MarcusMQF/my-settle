import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CheckCircle, FileText, Home, Clock } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function SuccessPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleViewReports = () => {
    router.push("/reports");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#10B981",
          paddingTop: insets.top + 16,
          paddingBottom: 20,
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#fff",
          }}
        >
          Report Submitted
        </Text>
        <Text style={{ fontSize: 14, color: "#D1FAE5", marginTop: 4 }}>
          Digitally Signed & Sent to PDRM
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Banner */}
        <View
          style={{
            margin: 20,
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
          <Image
            source={require("../../../../assets/images/file_sent.png")}
            style={{
              width: 96,
              height: 96,
              marginBottom: 20,
            }}
            resizeMode="contain"
          />

          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#1F2937",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Submitted to PDRM
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: "#6B7280",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            Your accident report has been digitally signed and submitted to the Royal Malaysia Police for review
          </Text>

          {/* Reference Number */}
          <View
            style={{
              backgroundColor: "#F9FAFB",
              borderRadius: 8,
              padding: 16,
              width: "100%",
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#6B7280",
                textAlign: "center",
                marginBottom: 4,
              }}
            >
              Reference Number
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#1E3A8A",
                textAlign: "center",
              }}
            >
              PDRM/MYSETTLE/2025-001
            </Text>
          </View>
        </View>

        {/* Status Timeline */}
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
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: 20,
            }}
          >
            Report Status
          </Text>

          {/* Timeline Container */}
          <View style={{ position: "relative", paddingLeft: 44 }}>
            {/* Vertical Line - Continuous */}
            <View
              style={{
                position: "absolute",
                left: 15,
                top: 16,
                bottom: 16,
                width: 3,
                backgroundColor: "#E5E7EB",
                borderRadius: 2,
              }}
            />
            {/* Green portion of line (completed) */}
            <View
              style={{
                position: "absolute",
                left: 15,
                top: 16,
                height: 72,
                width: 3,
                backgroundColor: "#10B981",
                borderRadius: 2,
              }}
            />

            {/* Step 1 - Completed */}
            <View style={{ position: "relative", marginBottom: 24 }}>
              <View
                style={{
                  position: "absolute",
                  left: -44,
                  top: 0,
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: "#10B981",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 3,
                  borderColor: "#D1FAE5",
                }}
              >
                <CheckCircle color="#fff" size={18} />
              </View>
              <View style={{ paddingTop: 2 }}>
                <Text style={{ fontSize: 15, fontWeight: "700", color: "#1F2937" }}>
                  Report Submitted
                </Text>
                <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 3, lineHeight: 18 }}>
                  Your report has been digitally signed and submitted
                </Text>
                <Text style={{ fontSize: 12, color: "#10B981", fontWeight: "600", marginTop: 6 }}>
                  ✓ Completed just now
                </Text>
              </View>
            </View>

            {/* Step 2 - In Progress */}
            <View style={{ position: "relative", marginBottom: 24 }}>
              <View
                style={{
                  position: "absolute",
                  left: -44,
                  top: 0,
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: "#F97316",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 3,
                  borderColor: "#FED7AA",
                }}
              >
                <Clock color="#fff" size={16} />
              </View>
              <View style={{ paddingTop: 2 }}>
                <Text style={{ fontSize: 15, fontWeight: "700", color: "#1F2937" }}>
                  PDRM Review
                </Text>
                <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 3, lineHeight: 18 }}>
                  Police is evaluating your report
                </Text>
                <Text style={{ fontSize: 12, color: "#F97316", fontWeight: "600", marginTop: 6 }}>
                  ● In progress • Est. within 24 hours
                </Text>
              </View>
            </View>

            {/* Step 3 - Pending */}
            <View style={{ position: "relative" }}>
              <View
                style={{
                  position: "absolute",
                  left: -44,
                  top: 0,
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: "#F3F4F6",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 3,
                  borderColor: "#E5E7EB",
                }}
              >
                <FileText color="#9CA3AF" size={16} />
              </View>
              <View style={{ paddingTop: 2 }}>
                <Text style={{ fontSize: 15, fontWeight: "600", color: "#9CA3AF" }}>
                  Final Report Issued
                </Text>
                <Text style={{ fontSize: 13, color: "#9CA3AF", marginTop: 3, lineHeight: 18 }}>
                  Official police report will be sent to you
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* What Happens Next */}
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
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: 16,
            }}
          >
            What Happens Next?
          </Text>

          {/* Step 1 */}
          <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 14 }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: "#DBEAFE",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#1E3A8A" }}>1</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#1F2937" }}>
                PDRM Review
              </Text>
              <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
                Police will review your report within 24 hours
              </Text>
            </View>
          </View>

          {/* Step 2 */}
          <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 14 }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: "#D1FAE5",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#059669" }}>2</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#1F2937" }}>
                Agreement Check
              </Text>
              <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
                If both parties agree, final report will be issued
              </Text>
            </View>
          </View>

          {/* Step 3 */}
          <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 14 }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: "#FEF3C7",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#92400E" }}>3</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#1F2937" }}>
                Conflict Resolution
              </Text>
              <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
                If there's a conflict, PDRM may schedule a video call
              </Text>
            </View>
          </View>

          {/* Step 4 */}
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: "#E0E7FF",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#4338CA" }}>4</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#1F2937" }}>
                Stay Updated
              </Text>
              <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
                You'll receive notifications on report status updates
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={handleViewReports}
            style={{
              backgroundColor: "#1E3A8A",
              paddingVertical: 18,
              paddingHorizontal: 24,
              borderRadius: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <FileText color="#fff" size={24} />
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: "700",
                marginLeft: 12,
              }}
            >
              Track Report Status
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleGoHome}
            style={{
              backgroundColor: "#fff",
              paddingVertical: 18,
              paddingHorizontal: 24,
              borderRadius: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <Home color="#1E3A8A" size={24} />
            <Text
              style={{
                color: "#1E3A8A",
                fontSize: 18,
                fontWeight: "700",
                marginLeft: 12,
              }}
            >
              Return to Home
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
