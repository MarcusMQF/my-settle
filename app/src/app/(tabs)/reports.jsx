import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Video,
  Calendar,
  X,
  Phone,
  MessageSquare,
  ChevronRight,
} from "lucide-react-native";
import { useState } from "react";

export default function ReportsPage() {
  const insets = useSafeAreaInsets();
  const [selectedReport, setSelectedReport] = useState(null);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const mockReports = [
    {
      id: "PDRM/MYSETTLE/2025-003",
      date: "12 Dec 2025",
      location: "Jalan Ampang, KL",
      status: "conflict",
      statusLabel: "Conflict Detected",
      description: "Discrepancy in statements. Video call scheduled.",
      videoCall: {
        scheduled: true,
        date: "15 Dec 2025",
        time: "10:00 AM",
        officer: "Insp. Ahmad bin Hassan",
      },
    },
    {
      id: "PDRM/MYSETTLE/2025-002",
      date: "10 Dec 2025",
      location: "Jalan Bukit Bintang, KL",
      status: "pending",
      statusLabel: "Under Review",
      description: "PDRM is evaluating your report.",
      estimatedCompletion: "13 Dec 2025",
    },
    {
      id: "PDRM/MYSETTLE/2025-001",
      date: "5 Dec 2025",
      location: "Jalan Tun Razak, KL",
      status: "completed",
      statusLabel: "Completed",
      description: "Final report issued by PDRM.",
      finalReport: "POL/KL/2025/12345",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return { bg: "#D1FAE5", text: "#065F46" };
      case "pending":
        return { bg: "#FEF3C7", text: "#92400E" };
      case "conflict":
        return { bg: "#FEE2E2", text: "#991B1B" };
      default:
        return { bg: "#E5E7EB", text: "#6B7280" };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle color="#065F46" size={16} />;
      case "pending":
        return <Clock color="#92400E" size={16} />;
      case "conflict":
        return <AlertTriangle color="#991B1B" size={16} />;
      default:
        return <FileText color="#6B7280" size={16} />;
    }
  };

  const handleJoinVideoCall = () => {
    setShowVideoCallModal(true);
  };

  const handleScheduleCall = () => {
    setShowScheduleModal(true);
  };

  const timeSlots = [
    { date: "Mon, 16 Dec", time: "9:00 AM" },
    { date: "Mon, 16 Dec", time: "2:00 PM" },
    { date: "Tue, 17 Dec", time: "10:00 AM" },
    { date: "Tue, 17 Dec", time: "3:00 PM" },
    { date: "Wed, 18 Dec", time: "11:00 AM" },
  ];

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
        <View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: "#fff",
            }}
          >
            My Reports
          </Text>
          <Text style={{ fontSize: 14, color: "#93C5FD", marginTop: 4 }}>
            Track your accident reports & PDRM responses
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Summary */}
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 20,
            marginTop: 20,
            gap: 12,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#FEF3C7",
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
            }}
          >
            <Clock color="#92400E" size={24} />
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#92400E", marginTop: 4 }}>
              1
            </Text>
            <Text style={{ fontSize: 11, color: "#92400E" }}>Pending</Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "#FEE2E2",
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
            }}
          >
            <AlertTriangle color="#991B1B" size={24} />
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#991B1B", marginTop: 4 }}>
              1
            </Text>
            <Text style={{ fontSize: 11, color: "#991B1B" }}>Action Required</Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "#D1FAE5",
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
            }}
          >
            <CheckCircle color="#065F46" size={24} />
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#065F46", marginTop: 4 }}>
              1
            </Text>
            <Text style={{ fontSize: 11, color: "#065F46" }}>Completed</Text>
          </View>
        </View>

        {/* Reports List */}
        {mockReports.map((report) => {
          const statusColor = getStatusColor(report.status);
          return (
            <View
              key={report.id}
              style={{
                marginHorizontal: 20,
                marginTop: 16,
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <FileText color="#1E3A8A" size={24} />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#1F2937",
                    marginLeft: 12,
                    flex: 1,
                  }}
                >
                  {report.id}
                </Text>
                <View
                  style={{
                    backgroundColor: statusColor.bg,
                    paddingVertical: 4,
                    paddingHorizontal: 12,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {getStatusIcon(report.status)}
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "600",
                      color: statusColor.text,
                      marginLeft: 4,
                    }}
                  >
                    {report.statusLabel}
                  </Text>
                </View>
              </View>

              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 2 }}>
                  {report.date} • {report.location}
                </Text>
                <Text style={{ fontSize: 13, color: "#4B5563", marginTop: 4 }}>
                  {report.description}
                </Text>
              </View>

              {/* Conflict - Video Call Section */}
              {report.status === "conflict" && report.videoCall && (
                <View
                  style={{
                    backgroundColor: "#FEF2F2",
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 8,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                    <Video color="#991B1B" size={18} />
                    <Text style={{ fontSize: 13, fontWeight: "600", color: "#991B1B", marginLeft: 8 }}>
                      Video Call Scheduled
                    </Text>
                  </View>
                  <Text style={{ fontSize: 12, color: "#7F1D1D", marginBottom: 4 }}>
                    {report.videoCall.date} at {report.videoCall.time}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#7F1D1D", marginBottom: 12 }}>
                    Officer: {report.videoCall.officer}
                  </Text>
                  <TouchableOpacity
                    onPress={handleJoinVideoCall}
                    style={{
                      backgroundColor: "#EF4444",
                      paddingVertical: 12,
                      borderRadius: 12,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <Video color="#fff" size={18} />
                    <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600", marginLeft: 8 }}>
                      Join Video Call
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Pending - Estimated Time */}
              {report.status === "pending" && (
                <View
                  style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 8,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Clock color="#92400E" size={18} />
                  <Text style={{ fontSize: 12, color: "#92400E", marginLeft: 8 }}>
                    Expected completion: {report.estimatedCompletion}
                  </Text>
                </View>
              )}

              {/* Completed - Final Report */}
              {report.status === "completed" && (
                <View
                  style={{
                    backgroundColor: "#D1FAE5",
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 8,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View>
                      <Text style={{ fontSize: 12, color: "#065F46", fontWeight: "600" }}>
                        Police Report Number
                      </Text>
                      <Text style={{ fontSize: 14, color: "#047857", fontWeight: "700", marginTop: 2 }}>
                        {report.finalReport}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#10B981",
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 12,
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
                        Download
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginTop: 8 }}>
                <Text style={{ fontSize: 12, color: "#6B7280" }}>View Details</Text>
                <ChevronRight color="#6B7280" size={16} />
              </View>
            </View>
          );
        })}

        {/* Help Section */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 20,
            backgroundColor: "#DBEAFE",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#1E3A8A", marginBottom: 8 }}>
            Need Help?
          </Text>
          <Text style={{ fontSize: 12, color: "#1E40AF", lineHeight: 18, marginBottom: 12 }}>
            If you have questions about your report status or need to reschedule a video call, contact PDRM support.
          </Text>
          <TouchableOpacity
            onPress={handleScheduleCall}
            style={{
              backgroundColor: "#1E3A8A",
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Calendar color="#fff" size={18} />
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600", marginLeft: 8 }}>
              Request Video Call with PDRM
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Video Call Modal */}
      <Modal visible={showVideoCallModal} transparent={true} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#1F2937",
              borderRadius: 16,
              padding: 24,
              width: "90%",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => setShowVideoCallModal(false)}
              style={{ position: "absolute", top: 16, right: 16 }}
            >
              <X color="#fff" size={24} />
            </TouchableOpacity>

            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: "#374151",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Video color="#fff" size={48} />
            </View>

            <Text style={{ fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 4 }}>
              PDRM Video Call
            </Text>
            <Text style={{ fontSize: 14, color: "#9CA3AF", marginBottom: 4 }}>
              Insp. Ahmad bin Hassan
            </Text>
            <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 24 }}>
              Conflict Resolution Session
            </Text>

            <Text style={{ fontSize: 24, fontWeight: "700", color: "#10B981", marginBottom: 24 }}>
              Connecting...
            </Text>

            <View style={{ flexDirection: "row", gap: 20 }}>
              <TouchableOpacity
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: "#374151",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MessageSquare color="#fff" size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowVideoCallModal(false)}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: "#EF4444",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Phone color="#fff" size={24} style={{ transform: [{ rotate: "135deg" }] }} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: "#374151",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Video color="#fff" size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Schedule Call Modal */}
      <Modal visible={showScheduleModal} transparent={true} animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              paddingBottom: insets.bottom + 24,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#1F2937" }}>
                Schedule Video Call
              </Text>
              <TouchableOpacity onPress={() => setShowScheduleModal(false)}>
                <X color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 16 }}>
              Select an available time slot for your video call with PDRM officer:
            </Text>

            {timeSlots.map((slot, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setShowScheduleModal(false)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  backgroundColor: "#F9FAFB",
                  borderRadius: 12,
                  marginBottom: 8,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Calendar color="#1E3A8A" size={20} />
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#1F2937", marginLeft: 12 }}>
                    {slot.date}
                  </Text>
                </View>
                <Text style={{ fontSize: 14, color: "#1E3A8A", fontWeight: "600" }}>
                  {slot.time}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setShowScheduleModal(false)}
              style={{
                backgroundColor: "#1E3A8A",
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                Confirm Booking
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
