import { View, Text } from "react-native";
import { Check } from "lucide-react-native";

export default function ProgressSteps({ currentStep, totalSteps = 6 }) {
  const steps = [
    { number: 1, label: "Scan QR" },
    { number: 2, label: "Verified" },
    { number: 3, label: "Evidence" },
    { number: 4, label: "Details" },
    { number: 5, label: "Statement" },
    { number: 6, label: "Submit" },
  ];

  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 16, backgroundColor: "#fff" }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {steps.map((step, index) => (
          <View
            key={step.number}
            style={{ flex: 1, alignItems: "center", position: "relative" }}
          >
            {/* Connector Line */}
            {index > 0 && (
              <View
                style={{
                  position: "absolute",
                  left: "-50%",
                  right: "50%",
                  top: 14,
                  height: 3,
                  backgroundColor:
                    currentStep > step.number ? "#10B981" : "#E5E7EB",
                  borderRadius: 2,
                }}
              />
            )}

            {/* Step Circle */}
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor:
                  currentStep > step.number
                    ? "#10B981"
                    : currentStep === step.number
                      ? "#F97316"
                      : "#E5E7EB",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 6,
                zIndex: 1,
              }}
            >
              {currentStep > step.number ? (
                <Check color="#fff" size={14} />
              ) : (
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    color: currentStep === step.number ? "#fff" : "#9CA3AF",
                  }}
                >
                  {step.number}
                </Text>
              )}
            </View>

            {/* Step Label */}
            <Text
              style={{
                fontSize: 9,
                fontWeight: currentStep === step.number ? "700" : "500",
                color: currentStep >= step.number ? "#1F2937" : "#9CA3AF",
                textAlign: "center",
              }}
            >
              {step.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
