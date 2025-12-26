import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Share2, FileText } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useState } from "react";

export default function PdfViewerPage() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { uri, title } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);

    const handleShare = async () => {
        if (uri) {
            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'application/pdf',
                    dialogTitle: `Share ${title || 'Document'}`,
                    UTI: 'com.adobe.pdf'
                });
            }
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar style="light" />

            {/* Header */}
            <View
                style={{
                    backgroundColor: "#1E3A8A",
                    paddingTop: insets.top + 16,
                    paddingBottom: 16,
                    paddingHorizontal: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ marginRight: 16 }}
                    >
                        <ArrowLeft color="#fff" size={24} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 18, fontWeight: "700", color: "#fff" }} numberOfLines={1}>
                            {title || "Document Viewer"}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity onPress={handleShare}>
                    <Share2 color="#fff" size={22} />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
                {Platform.OS === 'ios' ? (
                    <>
                        <WebView
                            source={{ uri: uri }}
                            style={{ flex: 1 }}
                            onLoadEnd={() => setLoading(false)}
                            originWhitelist={['*']}
                            allowFileAccess={true}
                            allowFileAccessFromFileURLs={true}
                            allowingReadAccessToURL={FileSystem.cacheDirectory}
                        />
                        {loading && (
                            <View style={{ position: "absolute", inset: 0, justifyContent: "center", alignItems: "center" }}>
                                <ActivityIndicator size="large" color="#1E3A8A" />
                            </View>
                        )}
                    </>
                ) : (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                        <View style={{
                            width: 80, height: 80,
                            backgroundColor: '#EFF6FF',
                            borderRadius: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 24
                        }}>
                            <FileText color="#1E3A8A" size={40} />
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 8, textAlign: 'center' }}>
                            Preview Not Available
                        </Text>
                        <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 32 }}>
                            This document format cannot be previewed directly inside the app on this device.
                        </Text>
                        <TouchableOpacity
                            onPress={handleShare}
                            style={{
                                backgroundColor: '#1E3A8A',
                                paddingVertical: 14,
                                paddingHorizontal: 32,
                                borderRadius: 12,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginRight: 8 }}>
                                Open Document
                            </Text>
                            <Share2 color="#fff" size={18} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}
