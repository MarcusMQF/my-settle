import { View, Text, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { QrCode, Camera, ArrowLeft, X, RefreshCw, Shield } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { useCameraPermissions } from "expo-camera";
import ProgressSteps from "../../../components/ProgressSteps";
import { sessionService } from "../../../services/session";
import { useAuth } from "../../../utils/auth/useAuth";
import { useSessionStore } from "../../../utils/session/store";

export default function NewReportPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showQRModal, setShowQRModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [isRequestingCamera, setIsRequestingCamera] = useState(false);

  const { auth } = useAuth();
  const { setSession, otp, qrImage, sessionId, status } = useSessionStore();

  // Polling to check if partner has joined
  useEffect(() => {
    let interval;
    if (sessionId && status === 'CREATED' && otp) {
      interval = setInterval(async () => {
        try {
          // Poll using reconnect endpoint to check status
          const response = await sessionService.reconnectSession(otp, auth?.user?.id);
          if (response.status === 'HANDSHAKE' && response.partner) {
            setSession({
              status: 'HANDSHAKE',
              partner: response.partner,
              // Ensure role is preserved or updated
              role: response.role
            });
            clearInterval(interval);
            setShowQRModal(false);
            router.push("/new-report/partner-verified");
          }
        } catch (error) {
          console.log("Polling error:", error);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [sessionId, status, otp]);

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const response = await sessionService.createSession(auth?.user?.id || 'TEST');

      // Response format: { session_id, otp, qr_image } - assuming qr_image is base64 string
      setSession({
        sessionId: response.session_id,
        otp: response.otp,
        qrImage: response.qr_image, // If backend returns base64, prepend 'data:image/png;base64,' if not already
        role: 'DRIVER_A',
        status: 'CREATED'
      });

    } catch (error) {
      console.error("Failed to create session:", error);
      alert("Failed to generate session. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateQR = () => {
    setShowQRModal(true);
    generateQRCode();
  };

  const handleRegenerateQR = () => {
    generateQRCode();
  };

  const handleScanPartner = async () => {
    if (permission?.granted) {
      router.push("/new-report/scan-partner");
      return;
    }

    // Request camera permission
    setIsRequestingCamera(true);
    const result = await requestPermission();
    setIsRequestingCamera(false);

    // Navigate regardless of result - scan page will handle denied permission
    router.push("/new-report/scan-partner");
  };

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
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginBottom: 12 }}
        >
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#fff",
          }}
        >
          New Accident Report
        </Text>
        <Text style={{ fontSize: 14, color: "#93C5FD", marginTop: 4 }}>
          Step 1: Digital Handshake
        </Text>
      </View>

      {/* Progress Steps */}
      <ProgressSteps currentStep={1} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Instructions */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 16,
            marginBottom: 12,
            backgroundColor: "#FEF3C7",
            borderRadius: 10,
            padding: 12,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: "#92400E",
              marginBottom: 4,
            }}
          >
            How to proceed:
          </Text>
          <Text style={{ fontSize: 12, color: "#78350F", lineHeight: 18 }}>
            • One driver generates QR code, the other scans{"\n"}
            • Both parties verified via MyDigital ID
          </Text>
        </View>

        {/* Action Buttons Card */}
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
              fontSize: 18,
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Connect with Other Driver
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: "#6B7280",
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            Choose one option to establish digital handshake
          </Text>

          {/* Generate QR Code Button */}
          <TouchableOpacity
            onPress={handleGenerateQR}
            style={{
              backgroundColor: "#1E3A8A",
              paddingVertical: 18,
              paddingHorizontal: 24,
              borderRadius: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <QrCode color="#fff" size={24} />
            <Text
              style={{
                color: "#fff",
                fontSize: 17,
                fontWeight: "700",
                marginLeft: 12,
              }}
            >
              Generate My QR Code
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: "#E5E7EB" }} />
            <Text style={{ marginHorizontal: 16, color: "#9CA3AF", fontSize: 13 }}>OR</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "#E5E7EB" }} />
          </View>

          {/* Scan QR Code Button */}
          <TouchableOpacity
            onPress={handleScanPartner}
            disabled={isRequestingCamera}
            style={{
              backgroundColor: "#F97316",
              paddingVertical: 18,
              paddingHorizontal: 24,
              borderRadius: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              opacity: isRequestingCamera ? 0.7 : 1,
            }}
          >
            {isRequestingCamera ? (
              <ActivityIndicator color="#fff" size={24} />
            ) : (
              <Camera color="#fff" size={24} />
            )}
            <Text
              style={{
                color: "#fff",
                fontSize: 17,
                fontWeight: "700",
                marginLeft: 12,
              }}
            >
              {isRequestingCamera ? "Requesting Camera..." : "Scan Driver's QR Code"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 20,
            backgroundColor: "#DBEAFE",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <Shield color="#1E3A8A" size={20} />
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#1E3A8A", marginLeft: 8 }}>
              Secure Connection
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: "#1E40AF", lineHeight: 18 }}>
            Each QR code is uniquely generated and expires after use. Your identity is verified through MyDigital ID and protected under PDPA 2010.
          </Text>
        </View>
      </ScrollView>

      {/* QR Code Modal */}
      <Modal visible={showQRModal} transparent={true} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 24,
              width: "100%",
              maxWidth: 340,
              alignItems: "center",
            }}
          >
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setShowQRModal(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                padding: 4,
              }}
            >
              <X color="#6B7280" size={24} />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#1F2937",
                marginBottom: 8,
                marginTop: 8,
              }}
            >
              Your QR Code
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "#6B7280",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Show this to the other driver to scan
            </Text>

            {/* Verified Badge */}
            <Text style={{ fontSize: 13, color: "#10B981", fontWeight: "600", marginBottom: 12 }}>
              ✓ Verified via MyDigital ID
            </Text>

            {/* QR Code Display */}
            <View
              style={{
                width: 220,
                height: 220,
                backgroundColor: "#fff",
                borderWidth: 3,
                borderColor: "#1E3A8A",
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              {isGenerating ? (
                <View style={{ alignItems: "center" }}>
                  <RefreshCw color="#1E3A8A" size={48} />
                  <Text style={{ color: "#1E3A8A", marginTop: 12, fontSize: 14 }}>
                    Generating...
                  </Text>
                </View>
              ) : (qrImage && qrImage.length > 50) ? (
                <Image
                  source={{ uri: `data:image/png;base64,${qrImage}` }}
                  style={{ width: 220, height: 220 }}
                  resizeMode="contain"
                />
              ) : (
                <QrCode color="#1E3A8A" size={180} />
              )}
            </View>

            {/* Bottom Section - Same Width */}
            <View style={{ width: 220, alignItems: "center" }}>
              {/* Session Details */}
              <View style={{ marginBottom: 16, alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: "#9CA3AF" }}>OTP Code</Text>
                <Text style={{ fontSize: 24, fontWeight: "800", color: "#1E3A8A", letterSpacing: 2 }}>
                  {otp || '--- ---'}
                </Text>
              </View>

              <Text style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center" }}>
                Session ID
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "500",
                  color: "#6B7280",
                  textAlign: "center",
                  marginTop: 2,
                  marginBottom: 12,
                }}
              >
                {sessionId || "Generating..."}
              </Text>

              {/* Regenerate Button */}
              <TouchableOpacity
                onPress={handleRegenerateQR}
                disabled={isGenerating}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  backgroundColor: "#fff",
                  opacity: isGenerating ? 0.5 : 1,
                }}
              >
                <RefreshCw color="#9CA3AF" size={16} />
                <Text style={{ color: "#6B7280", marginLeft: 6, fontSize: 13, fontWeight: "500" }}>
                  Generate New Code
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
