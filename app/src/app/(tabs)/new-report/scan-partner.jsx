import { View, Text, TouchableOpacity, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Camera, CheckCircle, Smartphone } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useEffect, useCallback } from "react";
import ProgressSteps from "../../../components/ProgressSteps";
import { sessionService } from "../../../services/session";
import { useAuth } from "../../../utils/auth/useAuth";
import { useSessionStore } from "../../../utils/session/store";

export default function ScanPartnerPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [manualOtp, setManualOtp] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const { auth } = useAuth();
  const { setSession } = useSessionStore();

  // Handle screen focus - remount camera when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Small delay to let the screen render first, then show camera
      const timer = setTimeout(() => {
        setShowCamera(true);
      }, 100);

      return () => {
        clearTimeout(timer);
        setShowCamera(false);
      };
    }, [])
  );

  // Auto-request permission on first load
  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      handleRequestPermission();
    }
  }, [permission]);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    await requestPermission();
    setIsRequesting(false);
  };

  const handleJoinSession = async (otp) => {
    if (!otp) return;
    setIsJoining(true);
    try {
      const response = await sessionService.joinSession(otp, auth?.user?.id || 'TEST');

      setSession({
        sessionId: response.session_id,
        status: response.status, // e.g. 'JOINED'
        role: 'DRIVER_B',
        otp: otp
      });

      setScanned(true); // Show success visual if scanning
      if (response.status === 'JOINED') {
        // Fetch partner details (Driver A) immediately
        try {
          const reconnectResponse = await sessionService.reconnectSession(otp, auth?.user?.id);
          setSession({
            partner: reconnectResponse.partner,
            // Ensure role/status are synced
            role: reconnectResponse.role,
            status: reconnectResponse.status
          });
        } catch (e) {
          console.log("Failed to fetch partner details", e);
        }

        setTimeout(() => {
          router.push("/new-report/partner-verified");
        }, 500);
      }
    } catch (error) {
      Alert.alert("Join Failed", "Invalid OTP or Session expired. Please try again.");
      setScanned(false); // Reset scan state to allow retry
    } finally {
      setIsJoining(false);
    }
  };

  const handleBarCodeScanned = ({ data }) => {
    if (!scanned && !isJoining) {
      setScanned(true);
      // Assuming the QR code contains the OTP directly or a JSON with OTP
      // For simpler robust demo, let's assume the QR code IS the OTP for now,
      // or try to parse it if it looks like JSON.
      let otpToUse = data;
      try {
        const parsed = JSON.parse(data);
        if (parsed.otp) otpToUse = parsed.otp;
      } catch (e) {
        // Not JSON, use raw data
      }

      handleJoinSession(otpToUse);
    }
  };

  if (!permission) {
    return (
      <View style={{ flex: 1, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text style={{ marginTop: 16, color: "#6B7280" }}>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" />

      <View
        style={{
          backgroundColor: "#1E3A8A",
          paddingTop: insets.top + 16,
          paddingBottom: 20,
          paddingHorizontal: 20,
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginBottom: 12 }}
        >
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: "700", color: "#fff" }}>
          Scan Driver's QR Code
        </Text>
      </View>

      <View style={{ backgroundColor: "#1E3A8A" }}>
        <ProgressSteps currentStep={1} />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Camera View */}
        <View style={{ height: 400, overflow: 'hidden' }}>
          {permission.granted ? (
            showCamera && (
              <CameraView
                style={{ flex: 1 }}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              >
                <View
                  style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                >
                  <View
                    style={{
                      width: 250,
                      height: 250,
                      borderWidth: 3,
                      borderColor: scanned ? "#10B981" : "#F97316",
                      borderRadius: 20,
                      backgroundColor: "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {scanned && (
                      <View style={{ backgroundColor: "rgba(16, 185, 129, 0.9)", borderRadius: 50, padding: 16 }}>
                        <CheckCircle color="#fff" size={48} />
                      </View>
                    )}
                  </View>
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: "600",
                      marginTop: 20,
                      textAlign: "center",
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 8,
                    }}
                  >
                    {scanned ? "Processing..." : "Align QR code within the frame"}
                  </Text>
                </View>
              </CameraView>
            )
          ) : (
            <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
              <Camera color="#6B7280" size={64} />
              <Text style={{ color: '#fff', marginTop: 16 }}>Camera Permission Needed</Text>
              <TouchableOpacity onPress={handleRequestPermission} style={{ marginTop: 16, backgroundColor: '#F97316', padding: 12, borderRadius: 8 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Grant Access</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Manual Input Section */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Smartphone color="#1F2937" size={24} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1F2937', marginLeft: 12 }}>
              Or Enter OTP Code
            </Text>
          </View>

          <Text style={{ color: '#6B7280', marginBottom: 16 }}>
            If you can't scan the code, ask the other driver for the 6-character OTP displayed on their screen.
          </Text>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TextInput
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 12,
                padding: 16,
                fontSize: 18,
                textAlign: 'center',
                letterSpacing: 4,
                fontWeight: '600'
              }}
              placeholder="ENTER OTP"
              value={manualOtp}
              onChangeText={(text) => setManualOtp(text.toUpperCase())}
              maxLength={6}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              onPress={() => handleJoinSession(manualOtp)}
              disabled={manualOtp.length < 6 || isJoining}
              style={{
                backgroundColor: manualOtp.length < 6 ? '#9CA3AF' : '#1E3A8A',
                paddingHorizontal: 24,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isJoining ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Join</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

      </ScrollView>
    </View>
  );
}
