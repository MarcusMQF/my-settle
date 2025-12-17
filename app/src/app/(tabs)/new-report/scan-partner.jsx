import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Camera, CheckCircle } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useEffect, useCallback } from "react";
import ProgressSteps from "../../../components/ProgressSteps";

export default function ScanPartnerPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

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

  const handleBarCodeScanned = ({ data }) => {
    if (!scanned) {
      setScanned(true);
      // Show success feedback before navigating
      setTimeout(() => {
        router.push("/new-report/partner-verified");
      }, 500);
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

  if (!permission.granted) {
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
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginBottom: 12 }}
          >
            <ArrowLeft color="#fff" size={24} />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: "700", color: "#fff" }}>
            Scan Partner's QR Code
          </Text>
        </View>

        <ProgressSteps currentStep={1} />

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Camera color="#1E3A8A" size={80} />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1F2937",
              marginTop: 20,
              textAlign: "center",
            }}
          >
            Camera Permission Required
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#6B7280",
              marginTop: 8,
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            We need camera access to scan the other driver's QR code
          </Text>
          <TouchableOpacity
            onPress={handleRequestPermission}
            disabled={isRequesting}
            style={{
              backgroundColor: "#F97316",
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: 12,
              marginBottom: 16,
              opacity: isRequesting ? 0.7 : 1,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {isRequesting && (
              <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
            )}
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
              {isRequesting ? "Requesting..." : "Grant Camera Access"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/new-report/partner-verified")}
            style={{
              backgroundColor: "#1E3A8A",
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
              Skip (Mock Scan)
            </Text>
          </TouchableOpacity>
        </View>
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

      <View style={{ flex: 1 }}>
        {showCamera && (
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          >
            <View
              style={{ flex: 0.8, alignItems: "center", justifyContent: "center" }}
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
                {scanned ? "QR Code Scanned!" : "Align QR code within the frame"}
              </Text>
            </View>
          </CameraView>
        )}
      </View>

      {/* Mock Scan Button */}
      <View
        style={{
          position: "absolute",
          bottom: 100,
          left: 20,
          right: 20,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => router.push("/new-report/partner-verified")}
          style={{
            backgroundColor: "#F97316",
            paddingVertical: 18,
            width: 250,
            borderRadius: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
            Scan QR Code
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
