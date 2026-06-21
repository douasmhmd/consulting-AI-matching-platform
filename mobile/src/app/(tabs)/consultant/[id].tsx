import { useEffect, useState } from "react";
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import API from "@/services/api";

type Consultant = {
  id: string;
  discipline: string;
  specialties: string[];
  bio: string;
  pricePerSession: number;
  languages: string[];
  rating: number;
  userId: string;
};

const DISCIPLINES: Record<string, string> = {
  PSYCHOLOGY: "Psychologie",
  NUTRITION: "Nutrition",
  BUSINESS: "Business",
  IT: "IT",
  RELATIONSHIP: "Relations",
};

export default function ConsultantDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const availableTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

  const nextDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      label: date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" }),
      value: date.toISOString().split("T")[0],
    };
  });

  useEffect(() => {
    const fetchConsultant = async () => {
      try {
        const res = await API.get(`/api/consultants/${id}`);
        setConsultant(res.data);
      } catch (err) {
        console.log("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultant();
  }, [id]);

  // Replace Alert with router navigation directly
const handleBooking = async () => {
  if (!selectedDate || !selectedTime) return;

  try {
    setBooking(true);
    await API.post("/api/appointments", {
      consultantId: consultant?.id,
      date: selectedDate,
      time: selectedTime,
    });
    // Navigate directly to appointments
    router.replace("/(tabs)/appointments");
  } catch (err: any) {
    console.log("Booking ERROR:", err?.response?.data, err?.message);
  } finally {
    setBooking(false);
  }
};

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!consultant) {
    return (
      <View style={styles.centered}>
        <Text>Consultant introuvable</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>← Retour</Text>
          </TouchableOpacity>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{consultant.discipline[0]}</Text>
          </View>
          <Text style={styles.disciplineTitle}>
            {DISCIPLINES[consultant.discipline]}
          </Text>
          <Text style={styles.price}>{consultant.pricePerSession}€ / séance</Text>
          {consultant.rating > 0 && (
            <Text style={styles.rating}>⭐ {consultant.rating}</Text>
          )}
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <View style={styles.card}>
            <Text style={styles.bio}>{consultant.bio}</Text>
          </View>
        </View>

        {/* Spécialités */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spécialités</Text>
          <View style={styles.card}>
            <View style={styles.tagsRow}>
              {consultant.specialties?.map((s, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Langues */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Langues</Text>
          <View style={styles.card}>
            <Text style={styles.langText}>
              🌍 {consultant.languages?.join(" • ")}
            </Text>
          </View>
        </View>

        {/* Choisir une date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choisir une date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.datesRow}>
              {nextDays.map((day) => (
                <TouchableOpacity
                  key={day.value}
                  style={[
                    styles.dateButton,
                    selectedDate === day.value && styles.dateButtonActive,
                  ]}
                  onPress={() => setSelectedDate(day.value)}
                >
                  <Text style={[
                    styles.dateText,
                    selectedDate === day.value && styles.dateTextActive,
                  ]}>
                    {day.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Choisir un horaire */}
        {selectedDate ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choisir un horaire</Text>
            <View style={styles.timesGrid}>
              {availableTimes.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeButton,
                    selectedTime === time && styles.timeButtonActive,
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[
                    styles.timeText,
                    selectedTime === time && styles.timeTextActive,
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}

        {/* Bouton réservation */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.bookButton,
              (!selectedDate || !selectedTime) && styles.bookButtonDisabled,
              booking && styles.bookButtonDisabled,
            ]}
            onPress={handleBooking}
            disabled={!selectedDate || !selectedTime || booking}
          >
            {booking ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.bookButtonText}>
                📅 Réserver — {selectedDate && selectedTime
                  ? `${selectedDate} à ${selectedTime}`
                  : "Sélectionnez date et horaire"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2563eb" },
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#2563eb",
    padding: 24,
    paddingBottom: 30,
    alignItems: "center",
  },
  backButton: { alignSelf: "flex-start", marginBottom: 16 },
  backText: { color: "rgba(255,255,255,0.8)", fontSize: 16 },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: "700", color: "#2563eb" },
  disciplineTitle: { color: "white", fontSize: 22, fontWeight: "700", marginBottom: 4 },
  price: { color: "rgba(255,255,255,0.9)", fontSize: 16, fontWeight: "600", marginBottom: 4 },
  rating: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  section: { padding: 16, paddingBottom: 0 },
  sectionTitle: {
    fontSize: 13, fontWeight: "700", color: "#999",
    textTransform: "uppercase", marginBottom: 8, letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "white", borderRadius: 16, padding: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  bio: { fontSize: 14, color: "#444", lineHeight: 22 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: "#eff6ff", paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 20,
  },
  tagText: { color: "#2563eb", fontSize: 13, fontWeight: "600" },
  langText: { fontSize: 14, color: "#444" },
  datesRow: { flexDirection: "row", gap: 8, paddingBottom: 4 },
  dateButton: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
    backgroundColor: "white", borderWidth: 1, borderColor: "#ddd",
    marginRight: 8,
  },
  dateButtonActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  dateText: { fontSize: 13, color: "#444", fontWeight: "600" },
  dateTextActive: { color: "white" },
  timesGrid: {
    flexDirection: "row", flexWrap: "wrap", gap: 10,
    backgroundColor: "white", borderRadius: 16, padding: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  timeButton: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10,
    backgroundColor: "#f5f5f5", borderWidth: 1, borderColor: "#ddd",
  },
  timeButtonActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  timeText: { fontSize: 14, color: "#444", fontWeight: "600" },
  timeTextActive: { color: "white" },
  bookButton: {
    backgroundColor: "#2563eb", padding: 16, borderRadius: 16,
    alignItems: "center", marginBottom: 30,
    shadowColor: "#2563eb", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  bookButtonDisabled: { backgroundColor: "#93c5fd" },
  bookButtonText: { color: "white", fontWeight: "700", fontSize: 15 },
});