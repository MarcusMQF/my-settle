import { View, Text, TouchableOpacity, ScrollView, Modal, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Camera, CheckCircle, ArrowRight, X, Info } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useState, useRef } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import ProgressSteps from "../../../components/ProgressSteps";

export default function CaptureEvidencePage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [viewPhotoUri, setViewPhotoUri] = useState(null);
  const cameraRef = useRef(null);

  const photoGuides = [
    { label: "Car Front", description: "Front view of the vehicle" },
    { label: "Car Back", description: "Rear view of the vehicle" },
    { label: "Left Side", description: "Left side of the vehicle" },
    { label: "Right Side", description: "Right side of the vehicle" },
    { label: "Damage Part", description: "Close-up of damaged area" },
  ];

  const handleStartCamera = () => {
    if (currentPhotoIndex < 5) {
      setShowCamera(true);
    }
  };

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedPhotos([...capturedPhotos, photo.uri]);
      setShowCamera(false);
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const handleContinue = () => {
    router.push("/new-report/scene-details");
  };

  const allPhotosCaptured = capturedPhotos.length === 5;

  if (!permission) {
    return <View />;
  }

  if (!permission.granted && showCamera) {
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
            Capture Evidences
          </Text>
        </View>

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
            We need camera access to capture accident evidences
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            style={{
              backgroundColor: "#F97316",
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
              Grant Permission
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
          Capture Evidence
        </Text>
        <Text style={{ fontSize: 14, color: "#93C5FD", marginTop: 4 }}>
          Step 3: Document the Accident Scene
        </Text>
      </View>

      <ProgressSteps currentStep={3} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 16,
            marginBottom: 20,
            backgroundColor: "#FEF3C7",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <Camera color="#92400E" size={20} />
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#92400E", marginLeft: 8 }}>
              Photo Guidelines
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: "#78350F", lineHeight: 18 }}>
            Take 5 photos as guided. All photos will be auto geotagged & timestamped. Make sure your photos are clear and in focus.
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
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: 16,
            }}
          >
            Photo Checklist ({capturedPhotos.length}/5)
          </Text>

          {photoGuides.map((guide, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                borderBottomWidth: index < 4 ? 1 : 0,
                borderBottomColor: "#E5E7EB",
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor:
                    capturedPhotos.length > index
                      ? "#10B981"
                      : currentPhotoIndex === index
                        ? "#F97316"
                        : "#E5E7EB",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                {capturedPhotos.length > index ? (
                  <CheckCircle color="#fff" size={20} />
                ) : (
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: currentPhotoIndex === index ? "#fff" : "#9CA3AF",
                    }}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#1F2937" }}
                >
                  {guide.label}
                </Text>
                <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                  {guide.description}
                </Text>
              </View>
              {capturedPhotos[index] && (
                <TouchableOpacity onPress={() => setViewPhotoUri(capturedPhotos[index])}>
                  <Image
                    source={{ uri: capturedPhotos[index] }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 8,
                      marginLeft: 12,
                      borderWidth: 1,
                      borderColor: "#E5E7EB",
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {!allPhotosCaptured && currentPhotoIndex < photoGuides.length && (
          <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
            <TouchableOpacity
              onPress={handleStartCamera}
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
              <Camera color="#fff" size={24} />
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "700",
                  marginLeft: 12,
                }}
              >
                Capture: {photoGuides[currentPhotoIndex]?.label}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {allPhotosCaptured && (
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
                Continue to Scene Details
              </Text>
              <ArrowRight color="#fff" size={24} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Camera Modal */}
      <Modal visible={showCamera} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          <StatusBar style="light" />

          <View
            style={{
              paddingTop: insets.top + 16,
              paddingBottom: 16,
              paddingHorizontal: 20,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              zIndex: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 18, fontWeight: "700", color: "#fff" }}
                >
                  {photoGuides[currentPhotoIndex]?.label || "Photo"}
                </Text>
                <Text style={{ fontSize: 14, color: "#93C5FD", marginTop: 2 }}>
                  {photoGuides[currentPhotoIndex]?.description || "Take photo"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowCamera(false)}
                style={{
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X color="#fff" size={24} />
              </TouchableOpacity>
            </View>
          </View>

          <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />

          <View
            style={{
              paddingBottom: insets.bottom + 20,
              paddingTop: 20,
              paddingHorizontal: 20,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
            }}
          >
            <TouchableOpacity
              onPress={handleTakePhoto}
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: "#F97316",
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 4,
                borderColor: "#fff",
              }}
            >
              <Camera color="#fff" size={32} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Image Viewer Modal */}
      <Modal visible={!!viewPhotoUri} transparent={true} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              top: insets.top + 20,
              right: 20,
              zIndex: 10,
              padding: 10,
            }}
            onPress={() => setViewPhotoUri(null)}
          >
            <X color="#fff" size={32} />
          </TouchableOpacity>

          {viewPhotoUri && (
            <Image
              source={{ uri: viewPhotoUri }}
              style={{ width: "100%", height: "80%" }}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

