import { View, Text, TouchableOpacity, ScrollView, Modal, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { FileText, Fingerprint, MapPin, Calendar, Clock, Car, User, Camera, CheckCircle, Shield } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import ProgressSteps from "../../../components/ProgressSteps";

export default function ReviewSignPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showBiometric, setShowBiometric] = useState(false);

  // Mock photo data - in real app would come from state/context
  const capturedPhotos = [
    { id: 1, label: "Front View", uri: "https://via.placeholder.com/150/1E3A8A/FFFFFF?text=Front" },
    { id: 2, label: "Rear View", uri: "https://via.placeholder.com/150/1E3A8A/FFFFFF?text=Rear" },
    { id: 3, label: "Left Side", uri: "https://via.placeholder.com/150/1E3A8A/FFFFFF?text=Left" },
    { id: 4, label: "Right Side", uri: "https://via.placeholder.com/150/1E3A8A/FFFFFF?text=Right" },
    { id: 5, label: "Damage", uri: "https://via.placeholder.com/150/1E3A8A/FFFFFF?text=Damage" },
  ];

  const handleSign = () => {
    setShowBiometric(true);
    setTimeout(() => {
      setShowBiometric(false);
      router.replace("/new-report/success");
    }, 2500);
  };

  const referenceNumber = `MS-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#1E3A8A",
          paddingTop: insets.top + 16,
          paddingBottom: 20,
          paddingHorizontal: 20,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "700", color: "#fff" }}>
          Review & Sign
        </Text>
        <Text style={{ fontSize: 14, color: "#93C5FD", marginTop: 4 }}>
          Step 6: Final Review
        </Text>
      </View>

      <ProgressSteps currentStep={6} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Document Header */}
        <View
          style={{
            margin: 20,
            marginBottom: 0,
            backgroundColor: "#1E3A8A",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            padding: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Shield color="#fff" size={28} />
              <View style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 12, color: "#93C5FD", fontWeight: "500" }}>
                  OFFICIAL DOCUMENT
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "700", color: "#fff" }}>
                  Agreed Statement of Facts
                </Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.2)" }}>
            <Text style={{ fontSize: 11, color: "#93C5FD" }}>Reference Number</Text>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff", marginTop: 2 }}>{referenceNumber}</Text>
          </View>
        </View>

        {/* Main Document Body */}
        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: "#fff",
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          {/* Incident Details Section */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#1E3A8A", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Incident Details
            </Text>
            
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#DBEAFE", alignItems: "center", justifyContent: "center" }}>
                <Calendar color="#1E3A8A" size={22} />
              </View>
              <View style={{ marginLeft: 14, flex: 1 }}>
                <Text style={{ fontSize: 12, color: "#6B7280" }}>Date & Time</Text>
                <Text style={{ fontSize: 15, fontWeight: "700", color: "#1F2937", marginTop: 2 }}>
                  {new Date().toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })}, {new Date().toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#DBEAFE", alignItems: "center", justifyContent: "center" }}>
                <MapPin color="#1E3A8A" size={22} />
              </View>
              <View style={{ marginLeft: 14, flex: 1 }}>
                <Text style={{ fontSize: 12, color: "#6B7280" }}>Location</Text>
                <Text style={{ fontSize: 15, fontWeight: "700", color: "#1F2937", marginTop: 2 }}>
                  Jalan Tun Razak, Kuala Lumpur
                </Text>
                <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 1 }}>3.1569° N, 101.7123° E</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#FEF3C7", alignItems: "center", justifyContent: "center" }}>
                <Car color="#92400E" size={22} />
              </View>
              <View style={{ marginLeft: 14, flex: 1 }}>
                <Text style={{ fontSize: 12, color: "#6B7280" }}>Incident Type</Text>
                <Text style={{ fontSize: 15, fontWeight: "700", color: "#1F2937", marginTop: 2 }}>
                  Rear-End Collision
                </Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: "#E5E7EB", marginBottom: 20 }} />

          {/* Parties Section */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#1E3A8A", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Parties Involved
            </Text>

            {/* Party A */}
            <View style={{ backgroundColor: "#F0FDF4", borderRadius: 10, padding: 14, marginBottom: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#10B981", alignItems: "center", justifyContent: "center" }}>
                  <User color="#fff" size={16} />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontSize: 11, color: "#059669", fontWeight: "600" }}>PARTY A (YOU)</Text>
                  <Text style={{ fontSize: 15, fontWeight: "700", color: "#1F2937" }}>ALI BIN AHMAD</Text>
                </View>
                <View style={{ marginLeft: "auto", flexDirection: "row", alignItems: "center", backgroundColor: "#D1FAE5", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                  <CheckCircle color="#10B981" size={12} />
                  <Text style={{ fontSize: 10, color: "#059669", fontWeight: "600", marginLeft: 4 }}>VERIFIED</Text>
                </View>
              </View>
              <View style={{ marginLeft: 42 }}>
                <Text style={{ fontSize: 12, color: "#6B7280" }}>NRIC: 050101-01-5555</Text>
                <Text style={{ fontSize: 12, color: "#6B7280" }}>Vehicle: WAA 1234 A (Toyota Vios 2022)</Text>
              </View>
            </View>

            {/* Party B */}
            <View style={{ backgroundColor: "#EFF6FF", borderRadius: 10, padding: 14 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#3B82F6", alignItems: "center", justifyContent: "center" }}>
                  <User color="#fff" size={16} />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontSize: 11, color: "#2563EB", fontWeight: "600" }}>PARTY B (OTHER DRIVER)</Text>
                  <Text style={{ fontSize: 15, fontWeight: "700", color: "#1F2937" }}>MOHD RIZAL BIN ISMAIL</Text>
                </View>
                <View style={{ marginLeft: "auto", flexDirection: "row", alignItems: "center", backgroundColor: "#DBEAFE", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                  <CheckCircle color="#3B82F6" size={12} />
                  <Text style={{ fontSize: 10, color: "#2563EB", fontWeight: "600", marginLeft: 4 }}>VERIFIED</Text>
                </View>
              </View>
              <View style={{ marginLeft: 42 }}>
                <Text style={{ fontSize: 12, color: "#6B7280" }}>NRIC: 920505-14-5678</Text>
                <Text style={{ fontSize: 12, color: "#6B7280" }}>Vehicle: WBB 5678 C (Honda City 2023)</Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: "#E5E7EB", marginBottom: 20 }} />

          {/* Photo Evidence Section */}
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#1E3A8A", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Photo Evidence
              </Text>
              <View style={{ marginLeft: 8, backgroundColor: "#DBEAFE", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
                <Text style={{ fontSize: 11, fontWeight: "600", color: "#1E3A8A" }}>{capturedPhotos.length} Photos</Text>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
              {capturedPhotos.map((photo, index) => (
                <View key={photo.id} style={{ marginHorizontal: 4 }}>
                  <View
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      backgroundColor: "#E5E7EB",
                      overflow: "hidden",
                      borderWidth: 2,
                      borderColor: "#D1D5DB",
                    }}
                  >
                    <View style={{ flex: 1, backgroundColor: "#1E3A8A", alignItems: "center", justifyContent: "center" }}>
                      <Camera color="#fff" size={28} />
                      <Text style={{ color: "#93C5FD", fontSize: 10, marginTop: 4 }}>Photo {index + 1}</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 10, color: "#6B7280", textAlign: "center", marginTop: 4 }}>{photo.label}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12, backgroundColor: "#F3F4F6", padding: 10, borderRadius: 8 }}>
              <CheckCircle color="#10B981" size={14} />
              <Text style={{ fontSize: 11, color: "#6B7280", marginLeft: 6 }}>
                All photos are geotagged & timestamped
              </Text>
            </View>
          </View>
        </View>

        {/* Legal Agreement */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 16,
            marginBottom: 20,
            backgroundColor: "#FEF3C7",
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: "#FCD34D",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <FileText color="#92400E" size={20} />
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#92400E", marginLeft: 8 }}>
              Legal Declaration
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: "#78350F", lineHeight: 20 }}>
            By signing this document, I hereby declare that:
          </Text>
          <View style={{ marginTop: 8 }}>
            <View style={{ flexDirection: "row", marginBottom: 6 }}>
              <Text style={{ fontSize: 12, color: "#78350F" }}>•</Text>
              <Text style={{ fontSize: 12, color: "#78350F", marginLeft: 8, flex: 1 }}>
                All information provided is true and accurate to the best of my knowledge
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginBottom: 6 }}>
              <Text style={{ fontSize: 12, color: "#78350F" }}>•</Text>
              <Text style={{ fontSize: 12, color: "#78350F", marginLeft: 8, flex: 1 }}>
                This statement is legally binding under the Digital Signature Act 1997
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginBottom: 6 }}>
              <Text style={{ fontSize: 12, color: "#78350F" }}>•</Text>
              <Text style={{ fontSize: 12, color: "#78350F", marginLeft: 8, flex: 1 }}>
                A copy will be submitted to PDRM and relevant insurance providers
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 12, color: "#78350F" }}>•</Text>
              <Text style={{ fontSize: 12, color: "#78350F", marginLeft: 8, flex: 1 }}>
                False statements may result in legal action under Malaysian law
              </Text>
            </View>
          </View>
        </View>

        {/* Sign Button */}
        <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={handleSign}
            style={{
              backgroundColor: "#10B981",
              paddingVertical: 18,
              paddingHorizontal: 24,
              borderRadius: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              shadowColor: "#10B981",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginLeft: 0 }}>
              Submit Report
            </Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 11, color: "#6B7280", textAlign: "center", marginTop: 10 }}>
            Your digital signature will be verified via MyDigital ID
          </Text>
        </View>
      </ScrollView>

      {/* Biometric Modal */}
      <Modal visible={showBiometric} transparent={true} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 32,
              alignItems: "center",
              width: 300,
            }}
          >
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#DBEAFE", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Fingerprint color="#1E3A8A" size={48} />
            </View>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#1F2937", textAlign: "center" }}>
              MyDigital ID
            </Text>
            <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 8, textAlign: "center" }}>
              Verifying your digital signature...
            </Text>
            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#1E3A8A", marginHorizontal: 4 }} />
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#93C5FD", marginHorizontal: 4 }} />
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#93C5FD", marginHorizontal: 4 }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
