import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Video, ArrowRight, Info, Upload, CheckCircle, X } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import ProgressSteps from "../../../components/ProgressSteps";

import { useSessionStore } from "../../../utils/session/store";

export default function StatementPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { draft, updateDraft } = useSessionStore();

  const [statement, setStatement] = useState(draft.description || "");
  const [whoWrong, setWhoWrong] = useState(draft.at_fault_driver || "");
  const [why, setWhy] = useState(draft.reason || "");
  const [dashcamVideo, setDashcamVideo] = useState(null);

  const handleUploadVideo = () => {
    // Mock video upload - in real app would use expo-document-picker or expo-image-picker
    setDashcamVideo({
      name: "dashcam_footage.mp4",
      size: "24.5 MB",
      duration: "0:32",
    });
  };

  const handleRemoveVideo = () => {
    setDashcamVideo(null);
  };

  const handleContinue = () => {
    updateDraft({
      description: statement,
      at_fault_driver: whoWrong,
      reason: why
    });
    router.push("/new-report/review-sign");
  };

  const isFormComplete = statement.trim() && whoWrong.trim() && why.trim();

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar style="dark" />

      <View
        style={{
          backgroundColor: "#1E3A8A",
          paddingTop: insets.top + 16,
          paddingBottom: 20,
          paddingHorizontal: 20,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "700", color: "#fff" }}>
          Your Statement
        </Text>
        <Text style={{ fontSize: 14, color: "#93C5FD", marginTop: 4 }}>
          Step 5: Tell Us What Happened
        </Text>
      </View>

      <ProgressSteps currentStep={5} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            margin: 20,
            backgroundColor: "#FEF3C7",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <Info color="#92400E" size={20} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#92400E",
                marginLeft: 8,
              }}
            >
              Instructions
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: "#78350F", lineHeight: 20 }}>
            Describe the accident in your own words. Be honest and detailed.
            This statement will be part of the legal record.
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
          {/* What Happened */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#1F2937",
                marginBottom: 8,
              }}
            >
              Tell us what happened in your words <Text style={{ color: "#EF4444" }}>*</Text>
            </Text>
            <TextInput
              value={statement}
              onChangeText={setStatement}
              placeholder="Describe the accident in detail..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              style={{
                borderWidth: 1,
                borderColor: statement ? "#10B981" : "#D1D5DB",
                borderRadius: 8,
                padding: 14,
                fontSize: 16,
                color: "#1F2937",
                backgroundColor: "#F9FAFB",
                minHeight: 120,
              }}
            />
            <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
              {statement.length} characters
            </Text>
          </View>

          {/* Who Was Wrong */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#1F2937",
                marginBottom: 8,
              }}
            >
              Who was wrong? <Text style={{ color: "#EF4444" }}>*</Text>
            </Text>
            <TextInput
              value={whoWrong}
              onChangeText={setWhoWrong}
              placeholder="E.g., The other driver, Both parties, Myself"
              placeholderTextColor="#9CA3AF"
              style={{
                borderWidth: 1,
                borderColor: whoWrong ? "#10B981" : "#D1D5DB",
                borderRadius: 8,
                padding: 14,
                fontSize: 16,
                color: "#1F2937",
                backgroundColor: "#F9FAFB",
              }}
            />
          </View>

          {/* Why */}
          <View style={{ marginBottom: 0 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#1F2937",
                marginBottom: 8,
              }}
            >
              Give the reason why? <Text style={{ color: "#EF4444" }}>*</Text>
            </Text>
            <TextInput
              value={why}
              onChangeText={setWhy}
              placeholder="Explain..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{
                borderWidth: 1,
                borderColor: why ? "#10B981" : "#D1D5DB",
                borderRadius: 8,
                padding: 14,
                fontSize: 16,
                color: "#1F2937",
                backgroundColor: "#F9FAFB",
                minHeight: 100,
              }}
            />
            <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
              {why.length} characters
            </Text>
          </View>
        </View>

        {/* Dashcam Video Upload - Optional */}
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
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <Video color="#1E3A8A" size={24} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#1F2937" }}>
                Dashcam Footage
              </Text>
            </View>
          </View>

          {!dashcamVideo ? (
            <TouchableOpacity
              onPress={handleUploadVideo}
              style={{
                borderWidth: 2,
                borderColor: "#E5E7EB",
                borderStyle: "dashed",
                borderRadius: 12,
                paddingVertical: 24,
                paddingHorizontal: 16,
                alignItems: "center",
                backgroundColor: "#F9FAFB",
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: "#DBEAFE",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Upload color="#1E3A8A" size={28} />
              </View>
              <Text style={{ fontSize: 15, fontWeight: "600", color: "#1F2937", marginBottom: 4 }}>
                Upload Dashcam Video
              </Text>
              <Text style={{ fontSize: 13, color: "#6B7280", textAlign: "center" }}>
                Add video evidence to strengthen your report
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                backgroundColor: "#D1FAE5",
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: "#10B981",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    backgroundColor: "#10B981",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Video color="#fff" size={24} />
                </View>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <CheckCircle color="#10B981" size={16} />
                    <Text style={{ fontSize: 14, fontWeight: "600", color: "#065F46", marginLeft: 6 }}>
                      Video Uploaded
                    </Text>
                  </View>
                  <Text style={{ fontSize: 13, color: "#047857", marginTop: 4 }}>
                    {dashcamVideo.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                    {dashcamVideo.size} • Duration: {dashcamVideo.duration}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleRemoveVideo}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "#FEE2E2",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X color="#EF4444" size={18} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!isFormComplete}
            style={{
              backgroundColor: isFormComplete ? "#F97316" : "#D1D5DB",
              paddingVertical: 18,
              paddingHorizontal: 24,
              borderRadius: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              opacity: isFormComplete ? 1 : 0.5,
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
              Continue to Review & Sign
            </Text>
            <ArrowRight color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
