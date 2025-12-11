import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  FileText,
  AlertCircle,
  QrCode,
  Camera,
  Send,
  Search,
  Video,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useLoginStore } from "../../utils/auth/loginStore";

export default function HomePage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isLoggedIn: isAuthenticated, userName, setLoggedIn } = useLoginStore();

  const handleLogin = () => {
    // Simulate MyDigital ID login
    setTimeout(() => {
      setLoggedIn("ALI BIN AHMAD");
    }, 1000);
  };

  const handleStartReport = () => {
    router.push("/new-report");
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Image
            source={require("../../../assets/images/mysettle_icon.png")}
            style={{ width: 250, height: 65, marginLeft: -38 }}
            resizeMode="contain"
          />
        </View>
        <Text style={{ fontSize: 14, color: "#93C5FD"}}>
          Digital Accident Resolution Platform
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Authentication Card */}
        {!isAuthenticated ? (
          <View
            style={{
              margin: 20,
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Image
                source={require("../../../assets/images/myDigitalID_icon.png")}
                style={{ width: 150, height: 150 }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "600",
                  color: "#1F2937",
                  marginTop: 0,
                  textAlign: "center",
                }}
              >
                Secure Authentication Required
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#6B7280",
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                Login with MyDigital ID to access MySettle services
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              style={{
                backgroundColor: "#F97316",
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
                  fontWeight: "600",
                }}
              >
                Login with MyDigital ID
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Welcome Card */}
            <View
              style={{
                margin: 20,
                marginBottom: 12,
                backgroundColor: "#DBEAFE",
                borderRadius: 12,
                padding: 20,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={require("../../../assets/images/verify.png")}
                  style={{ width: 28, height: 28 }}
                  resizeMode="contain"
                />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#1F2937",
                      fontWeight: "700",
                      marginTop: 2,
                    }}
                  >
                    {userName}
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}
                  >
                    NRIC: 050101-01-5555
                  </Text>
                </View>
              </View>
            </View>

            {/* Main Action Card */}
            <View
              style={{
                marginHorizontal: 20,
                marginBottom: 20,
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#1F2937",
                  marginBottom: 12,
                }}
              >
                Quick Actions
              </Text>

              <TouchableOpacity
                onPress={handleStartReport}
                style={{
                  backgroundColor: "#F97316",
                  paddingVertical: 18,
                  paddingHorizontal: 24,
                  borderRadius: 12,
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "700",
                  }}
                >
                  Start New Report
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                Report a minor road accident without visiting a police station
              </Text>
            </View>

            {/* How It Works */}
            <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#1F2937",
                  marginBottom: 16,
                }}
              >
                How mySettle Works
              </Text>

              {/* Step 1 */}
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor: "#DBEAFE",
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <QrCode color="#1E3A8A" size={22} />
                  </View>
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={{ fontSize: 11, color: "#1E3A8A", fontWeight: "600", marginRight: 8 }}>
                        STEP 1
                      </Text>
                    </View>
                    <Text style={{ fontSize: 15, fontWeight: "600", color: "#1F2937", marginTop: 2 }}>
                      Digital Handshake
                    </Text>
                    <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                      Scan QR code to verify both drivers using MyDigital ID
                    </Text>
                  </View>
                </View>
              </View>

              {/* Step 2 */}
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor: "#FEF3C7",
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Camera color="#92400E" size={22} />
                  </View>
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={{ fontSize: 11, color: "#92400E", fontWeight: "600" }}>
                      STEP 2
                    </Text>
                    <Text style={{ fontSize: 15, fontWeight: "600", color: "#1F2937", marginTop: 2 }}>
                      Document Accident
                    </Text>
                    <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                      Capture photos, describe how the accident happened, and provide all relevant details
                    </Text>
                  </View>
                </View>
              </View>

              {/* Step 3 */}
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor: "#D1FAE5",
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Send color="#065F46" size={20} />
                  </View>
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={{ fontSize: 11, color: "#065F46", fontWeight: "600" }}>
                      STEP 3
                    </Text>
                    <Text style={{ fontSize: 15, fontWeight: "600", color: "#1F2937", marginTop: 2 }}>
                      Submit to PDRM
                    </Text>
                    <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                      Digitally sign & submit report directly to Police
                    </Text>
                  </View>
                </View>
              </View>

              {/* Step 4 */}
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor: "#E0E7FF",
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Search color="#4338CA" size={20} />
                  </View>
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={{ fontSize: 11, color: "#4338CA", fontWeight: "600" }}>
                      STEP 4
                    </Text>
                    <Text style={{ fontSize: 15, fontWeight: "600", color: "#1F2937", marginTop: 2 }}>
                      PDRM Review
                    </Text>
                    <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                      Police evaluates report within 24 hours
                    </Text>
                  </View>
                </View>
              </View>

              {/* Step 5 */}
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor: "#DBEAFE",
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FileText color="#1E3A8A" size={20} />
                  </View>
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={{ fontSize: 11, color: "#1E3A8A", fontWeight: "600" }}>
                      STEP 5
                    </Text>
                    <Text style={{ fontSize: 15, fontWeight: "600", color: "#1F2937", marginTop: 2 }}>
                      Receive Final Report
                    </Text>
                    <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                      Official police report sent to you & insurance
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Conflict Resolution Info */}
            <View
              style={{
                marginHorizontal: 20,
                marginBottom: 20,
                backgroundColor: "#FEF2F2",
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: "#FECACA",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <Video color="#991B1B" size={20} />
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#991B1B", marginLeft: 8 }}>
                  Conflict Resolution
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: "#7F1D1D", lineHeight: 18 }}>
                If PDRM detects conflicting statements between parties, a video call will be scheduled for resolution (no need to visit police station).
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
