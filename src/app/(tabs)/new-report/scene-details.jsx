import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ArrowRight, MapPin, ChevronDown, Info, Clock, Minus, Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import ProgressSteps from "../../../components/ProgressSteps";

export default function SceneDetailsPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [weather, setWeather] = useState("");
  const [roadSurface, setRoadSurface] = useState("");
  const [location, setLocation] = useState("");
  const [roadType, setRoadType] = useState("");
  const [accidentDay, setAccidentDay] = useState("");
  const [accidentMonth, setAccidentMonth] = useState("");
  const [accidentYear, setAccidentYear] = useState("");
  const [accidentHour, setAccidentHour] = useState("");
  const [accidentMinute, setAccidentMinute] = useState("");
  const [accidentPeriod, setAccidentPeriod] = useState("AM");
  const [showWeatherDropdown, setShowWeatherDropdown] = useState(false);
  const [showSurfaceDropdown, setShowSurfaceDropdown] = useState(false);
  const [showRoadTypeDropdown, setShowRoadTypeDropdown] = useState(false);
  const [showDayDropdown, setShowDayDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showHourDropdown, setShowHourDropdown] = useState(false);

  const weatherOptions = ["Sunny", "Rainy", "Cloudy", "Foggy", "Stormy"];
  const roadSurfaceOptions = ["Dry", "Wet", "Icy", "Muddy", "Oily"];
  const roadTypeOptions = [
    "Highway",
    "Junction",
    "Roundabout",
    "Residential",
    "Rural Road",
  ];
  const dayOptions = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
  const monthOptions = [
    { value: "01", label: "Jan" },
    { value: "02", label: "Feb" },
    { value: "03", label: "Mar" },
    { value: "04", label: "Apr" },
    { value: "05", label: "May" },
    { value: "06", label: "Jun" },
    { value: "07", label: "Jul" },
    { value: "08", label: "Aug" },
    { value: "09", label: "Sep" },
    { value: "10", label: "Oct" },
    { value: "11", label: "Nov" },
    { value: "12", label: "Dec" },
  ];
  const yearOptions = ["2025", "2024"];
  const hourOptions = ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];

  const incrementMinute = () => {
    const current = parseInt(accidentMinute || "0", 10);
    const next = current >= 59 ? 0 : current + 1;
    setAccidentMinute(String(next).padStart(2, "0"));
  };

  const decrementMinute = () => {
    const current = parseInt(accidentMinute || "0", 10);
    const prev = current <= 0 ? 59 : current - 1;
    setAccidentMinute(String(prev).padStart(2, "0"));
  };

  const handleMinuteChange = (text) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, "");
    if (numericValue === "") {
      setAccidentMinute("");
    } else {
      const num = parseInt(numericValue, 10);
      if (num >= 0 && num <= 59) {
        setAccidentMinute(String(num).padStart(2, "0"));
      }
    }
  };

  const handleContinue = () => {
    router.push("/new-report/statement");
  };

  const isFormComplete = weather && roadSurface && location && roadType && accidentDay && accidentMonth && accidentYear && accidentHour && accidentMinute;

  const currentLocation = { lat: 3.1569, lng: 101.7123 };

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
          Environment & Scene
        </Text>
        <Text style={{ fontSize: 14, color: "#93C5FD", marginTop: 4 }}>
          Step 4: Scene Details
        </Text>
      </View>

      <ProgressSteps currentStep={4} />

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
            <Info color="#92400E" size={20} />
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#92400E", marginLeft: 8 }}>
              Scene Information
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: "#78350F", lineHeight: 18 }}>
            Provide details about environment and road conditions during the accident.
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
          {/* Weather */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#1F2937",
                marginBottom: 8,
              }}
            >
              Weather Condition <Text style={{ color: "#EF4444" }}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowWeatherDropdown(!showWeatherDropdown)}
              style={{
                borderWidth: 1,
                borderColor: "#D1D5DB",
                borderRadius: 8,
                padding: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#F9FAFB",
              }}
            >
              <Text
                style={{ fontSize: 16, color: weather ? "#1F2937" : "#9CA3AF" }}
              >
                {weather || "Select weather condition"}
              </Text>
              <ChevronDown color="#6B7280" size={20} />
            </TouchableOpacity>
            {showWeatherDropdown && (
              <View
                style={{
                  marginTop: 8,
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  overflow: "hidden",
                }}
              >
                {weatherOptions.map((option, index) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      setWeather(option);
                      setShowWeatherDropdown(false);
                    }}
                    style={{
                      padding: 14,
                      borderBottomWidth:
                        index < weatherOptions.length - 1 ? 1 : 0,
                      borderBottomColor: "#E5E7EB",
                    }}
                  >
                    <Text style={{ fontSize: 16, color: "#1F2937" }}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Date of Accident */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#1F2937",
                marginBottom: 8,
              }}
            >
              Date of Accident <Text style={{ color: "#EF4444" }}>*</Text>
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              {/* Day */}
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowDayDropdown(!showDayDropdown);
                    setShowMonthDropdown(false);
                    setShowYearDropdown(false);
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    borderRadius: 8,
                    padding: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <Text style={{ fontSize: 16, color: accidentDay ? "#1F2937" : "#9CA3AF" }}>
                    {accidentDay || "Day"}
                  </Text>
                  <ChevronDown color="#6B7280" size={20} />
                </TouchableOpacity>
                {showDayDropdown && (
                  <View
                    style={{
                      position: "absolute",
                      top: 56,
                      left: 0,
                      right: 0,
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#D1D5DB",
                      maxHeight: 200,
                      zIndex: 100,
                    }}
                  >
                    <ScrollView nestedScrollEnabled>
                      {dayOptions.map((option, index) => (
                        <TouchableOpacity
                          key={option}
                          onPress={() => {
                            setAccidentDay(option);
                            setShowDayDropdown(false);
                          }}
                          style={{
                            padding: 14,
                            borderBottomWidth: index < dayOptions.length - 1 ? 1 : 0,
                            borderBottomColor: "#E5E7EB",
                          }}
                        >
                          <Text style={{ fontSize: 16, color: "#1F2937" }}>{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Month */}
              <View style={{ flex: 1.2 }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowMonthDropdown(!showMonthDropdown);
                    setShowDayDropdown(false);
                    setShowYearDropdown(false);
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    borderRadius: 8,
                    padding: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <Text style={{ fontSize: 16, color: accidentMonth ? "#1F2937" : "#9CA3AF" }}>
                    {accidentMonth ? monthOptions.find(m => m.value === accidentMonth)?.label : "Month"}
                  </Text>
                  <ChevronDown color="#6B7280" size={20} />
                </TouchableOpacity>
                {showMonthDropdown && (
                  <View
                    style={{
                      position: "absolute",
                      top: 56,
                      left: 0,
                      right: 0,
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#D1D5DB",
                      maxHeight: 200,
                      zIndex: 100,
                    }}
                  >
                    <ScrollView nestedScrollEnabled>
                      {monthOptions.map((option, index) => (
                        <TouchableOpacity
                          key={option.value}
                          onPress={() => {
                            setAccidentMonth(option.value);
                            setShowMonthDropdown(false);
                          }}
                          style={{
                            padding: 14,
                            borderBottomWidth: index < monthOptions.length - 1 ? 1 : 0,
                            borderBottomColor: "#E5E7EB",
                          }}
                        >
                          <Text style={{ fontSize: 16, color: "#1F2937" }}>{option.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Year */}
              <View style={{ flex: 1.2 }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowYearDropdown(!showYearDropdown);
                    setShowDayDropdown(false);
                    setShowMonthDropdown(false);
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    borderRadius: 8,
                    padding: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <Text style={{ fontSize: 16, color: accidentYear ? "#1F2937" : "#9CA3AF" }}>
                    {accidentYear || "Year"}
                  </Text>
                  <ChevronDown color="#6B7280" size={20} />
                </TouchableOpacity>
                {showYearDropdown && (
                  <View
                    style={{
                      position: "absolute",
                      top: 56,
                      left: 0,
                      right: 0,
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#D1D5DB",
                      zIndex: 100,
                    }}
                  >
                    {yearOptions.map((option, index) => (
                      <TouchableOpacity
                        key={option}
                        onPress={() => {
                          setAccidentYear(option);
                          setShowYearDropdown(false);
                        }}
                        style={{
                          padding: 14,
                          borderBottomWidth: index < yearOptions.length - 1 ? 1 : 0,
                          borderBottomColor: "#E5E7EB",
                        }}
                      >
                        <Text style={{ fontSize: 16, color: "#1F2937" }}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Time of Accident */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#1F2937",
                marginBottom: 8,
              }}
            >
              Time of Accident <Text style={{ color: "#EF4444" }}>*</Text>
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              {/* Hour */}
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowHourDropdown(!showHourDropdown);
                    setShowMinuteDropdown(false);
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    borderRadius: 8,
                    padding: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <Text style={{ fontSize: 16, color: accidentHour ? "#1F2937" : "#9CA3AF" }}>
                    {accidentHour || "Hour"}
                  </Text>
                  <ChevronDown color="#6B7280" size={20} />
                </TouchableOpacity>
                {showHourDropdown && (
                  <View
                    style={{
                      position: "absolute",
                      top: 56,
                      left: 0,
                      right: 0,
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#D1D5DB",
                      maxHeight: 200,
                      zIndex: 100,
                    }}
                  >
                    <ScrollView nestedScrollEnabled>
                      {hourOptions.map((option, index) => (
                        <TouchableOpacity
                          key={option}
                          onPress={() => {
                            setAccidentHour(option);
                            setShowHourDropdown(false);
                          }}
                          style={{
                            padding: 14,
                            borderBottomWidth: index < hourOptions.length - 1 ? 1 : 0,
                            borderBottomColor: "#E5E7EB",
                          }}
                        >
                          <Text style={{ fontSize: 16, color: "#1F2937" }}>{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <Text style={{ fontSize: 20, fontWeight: "600", color: "#6B7280" }}>:</Text>

              {/* Minute with +/- buttons */}
              <View style={{ flex: 1.2, flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={decrementMinute}
                  style={{
                    width: 40,
                    height: 48,
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    borderRadius: 8,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <Minus color="#6B7280" size={18} />
                </TouchableOpacity>
                <TextInput
                  value={accidentMinute}
                  onChangeText={handleMinuteChange}
                  placeholder="00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  maxLength={2}
                  style={{
                    flex: 1,
                    height: 48,
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: "#D1D5DB",
                    textAlign: "center",
                    fontSize: 16,
                    color: "#1F2937",
                    backgroundColor: "#F9FAFB",
                  }}
                />
                <TouchableOpacity
                  onPress={incrementMinute}
                  style={{
                    width: 40,
                    height: 48,
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    borderRadius: 8,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <Plus color="#6B7280" size={18} />
                </TouchableOpacity>
              </View>

              {/* AM/PM Toggle */}
              <View style={{ flexDirection: "row", borderRadius: 8, overflow: "hidden", borderWidth: 1, borderColor: "#D1D5DB" }}>
                <TouchableOpacity
                  onPress={() => setAccidentPeriod("AM")}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    backgroundColor: accidentPeriod === "AM" ? "#1E3A8A" : "#F9FAFB",
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: "600", color: accidentPeriod === "AM" ? "#fff" : "#6B7280" }}>
                    AM
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setAccidentPeriod("PM")}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    backgroundColor: accidentPeriod === "PM" ? "#1E3A8A" : "#F9FAFB",
                    borderLeftWidth: 1,
                    borderLeftColor: "#D1D5DB",
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: "600", color: accidentPeriod === "PM" ? "#fff" : "#6B7280" }}>
                    PM
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Road Surface */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#1F2937",
                marginBottom: 8,
              }}
            >
              Road Surface <Text style={{ color: "#EF4444" }}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowSurfaceDropdown(!showSurfaceDropdown)}
              style={{
                borderWidth: 1,
                borderColor: "#D1D5DB",
                borderRadius: 8,
                padding: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#F9FAFB",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: roadSurface ? "#1F2937" : "#9CA3AF",
                }}
              >
                {roadSurface || "Select road surface"}
              </Text>
              <ChevronDown color="#6B7280" size={20} />
            </TouchableOpacity>
            {showSurfaceDropdown && (
              <View
                style={{
                  marginTop: 8,
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  overflow: "hidden",
                }}
              >
                {roadSurfaceOptions.map((option, index) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      setRoadSurface(option);
                      setShowSurfaceDropdown(false);
                    }}
                    style={{
                      padding: 14,
                      borderBottomWidth:
                        index < roadSurfaceOptions.length - 1 ? 1 : 0,
                      borderBottomColor: "#E5E7EB",
                    }}
                  >
                    <Text style={{ fontSize: 16, color: "#1F2937" }}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Road Type */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#1F2937",
                marginBottom: 8,
              }}
            >
              Road Type <Text style={{ color: "#EF4444" }}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowRoadTypeDropdown(!showRoadTypeDropdown)}
              style={{
                borderWidth: 1,
                borderColor: "#D1D5DB",
                borderRadius: 8,
                padding: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#F9FAFB",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: roadType ? "#1F2937" : "#9CA3AF",
                }}
              >
                {roadType || "Select road type"}
              </Text>
              <ChevronDown color="#6B7280" size={20} />
            </TouchableOpacity>
            {showRoadTypeDropdown && (
              <View
                style={{
                  marginTop: 8,
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  overflow: "hidden",
                }}
              >
                {roadTypeOptions.map((option, index) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      setRoadType(option);
                      setShowRoadTypeDropdown(false);
                    }}
                    style={{
                      padding: 14,
                      borderBottomWidth:
                        index < roadTypeOptions.length - 1 ? 1 : 0,
                      borderBottomColor: "#E5E7EB",
                    }}
                  >
                    <Text style={{ fontSize: 16, color: "#1F2937" }}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Location */}
          <View style={{ marginBottom: 0 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#1F2937",
                marginBottom: 8,
              }}
            >
              Location <Text style={{ color: "#EF4444" }}>*</Text>
            </Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Enter accident location"
              placeholderTextColor="#9CA3AF"
              style={{
                borderWidth: 1,
                borderColor: "#D1D5DB",
                borderRadius: 8,
                padding: 14,
                fontSize: 16,
                color: "#1F2937",
                backgroundColor: "#F9FAFB",
              }}
            />
          </View>
        </View>

        {/* Current Location - Google Map Mock */}
        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 20,
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 16,
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
            <MapPin color="#1E3A8A" size={20} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#1F2937",
                marginLeft: 8,
              }}
            >
              Current Location
            </Text>
          </View>

          {/* Mock Google Map View */}
          <View
            style={{
              width: "100%",
              height: 220,
              borderRadius: 12,
              backgroundColor: "#E8F0FE",
              overflow: "hidden",
              position: "relative",
              borderWidth: 1,
              borderColor: "#D1D5DB",
            }}
          >
            <Image
              source={require("../../../../assets/images/mock_map.png")}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />

            {/* Google Logo */}
            <View
              style={{
                position: "absolute",
                bottom: 8,
                left: 8,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 2,
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: "700", color: "#5F6368" }}>
                Google
              </Text>
            </View>

            {/* Zoom Controls */}
            <View
              style={{
                position: "absolute",
                right: 8,
                bottom: 40,
                backgroundColor: "#fff",
                borderRadius: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <TouchableOpacity
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: "#E5E7EB",
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#5F6368" }}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#5F6368" }}>−</Text>
              </TouchableOpacity>
            </View>

            {/* Map Type Toggle */}
            <View
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "#fff",
                borderRadius: 4,
                paddingHorizontal: 8,
                paddingVertical: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: "600", color: "#5F6368" }}>
                Satellite
              </Text>
            </View>
          </View>

          {/* Coordinates Display */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
              backgroundColor: "#F3F4F6",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <MapPin color="#EA4335" size={16} />
            <Text style={{ fontSize: 12, color: "#374151", marginLeft: 8, flex: 1 }}>
              {currentLocation.lat}° N, {currentLocation.lng}° E
            </Text>
            <Text style={{ fontSize: 11, color: "#6B7280" }}>GPS Active</Text>
          </View>
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
              Continue to Statement
            </Text>
            <ArrowRight color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
