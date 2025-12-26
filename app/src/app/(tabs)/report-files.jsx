import { View, Text, ScrollView, TouchableOpacity, Image, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, FileText, MoreVertical } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';

// Import local PDF assets
// Note: We need to use require, but we can't really "view" them inside the app easily without native modules.
// However, standard request is to try. For Expo Go, best bet is standard Share or Linking if we can get a URI.
// Or just show the UI as requested. "user can click to view pdf on app".
// We will try to open it using Linking which usually opens system viewer.

const repotPolis = require("../../../assets/pdfs/repot_polis_driver_a.pdf");
const rajahKasar = require("../../../assets/pdfs/rajah_kasar_driver_a.pdf");
const keputusan = require("../../../assets/pdfs/keputusan_driver_a.pdf");

export default function ReportFilesPage() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { reportId } = useLocalSearchParams();

    const files = [
        { name: "Repot Polis", file: repotPolis, description: "Official Police Report Details" },
        { name: "Rajah Kasar", file: rajahKasar, description: "Rough Sketch of Accident" },
        { name: "Keputusan", file: keputusan, description: "Investigation Decision Result" },
    ];

    const handleOpenPdf = async (item) => {
        try {
            const asset = Asset.fromModule(item.file);
            await asset.downloadAsync();

            if (asset.localUri) {
                router.push({
                    pathname: "/(tabs)/pdf-viewer",
                    params: { uri: asset.localUri, title: item.name }
                });
            }
        } catch (error) {
            console.error("Error opening PDF:", error);
            alert("Failed to open PDF document.");
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
            <StatusBar style="light" />

            {/* App Bar / Header - Matches App Design */}
            <View
                style={{
                    backgroundColor: "#1E3A8A",
                    paddingTop: insets.top + 16,
                    paddingBottom: 24,
                    paddingHorizontal: 20,
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        marginRight: 16
                    }}
                >
                    <ArrowLeft color="#fff" size={24} />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: "700", color: "#fff" }}>
                        Report Documents
                    </Text>
                    <Text style={{ fontSize: 12, color: "#93C5FD", marginTop: 2 }}>
                        {reportId || "PDRM/MYSETTLE/2025-001"}
                    </Text>
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20 }}
            >
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 16 }}>
                    Files (3)
                </Text>

                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
                    {files.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleOpenPdf(item)}
                            style={{
                                width: "48%", // 2 items per row with gap
                                backgroundColor: "#fff",
                                borderRadius: 12,
                                marginBottom: 16,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 3,
                                overflow: "hidden",
                                borderWidth: 1,
                                borderColor: "#E5E7EB"
                            }}
                        >
                            {/* Preview Area - Google Drive Style */}
                            <View
                                style={{
                                    height: 120,
                                    backgroundColor: "#F3F4F6",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#E5E7EB"
                                }}
                            >
                                <FileText color="#DC2626" size={48} />
                            </View>

                            {/* Details Area */}
                            <View style={{ padding: 12 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Text
                                        numberOfLines={1}
                                        style={{ fontSize: 14, fontWeight: "600", color: "#1F2937", flex: 1, marginRight: 4 }}
                                    >
                                        {item.name}
                                    </Text>
                                    <MoreVertical color="#9CA3AF" size={16} />
                                </View>
                                <Text
                                    numberOfLines={1}
                                    style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}
                                >
                                    {item.description}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
