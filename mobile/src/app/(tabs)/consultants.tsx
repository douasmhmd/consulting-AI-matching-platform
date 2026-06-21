import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import API from "@/services/api";

type Consultant = {
  id: string;
  discipline: string;
  specialties: string[];
  bio: string;
  pricePerSession: number;
  languages: string[];
  rating: number;
  status: string;
  userId: string;
};

const DISCIPLINES = [
  { key: "PSYCHOLOGY", label: "Psychologie" },
  { key: "NUTRITION", label: "Nutrition" },
  { key: "BUSINESS", label: "Business" },
  { key: "IT", label: "IT" },
  { key: "RELATIONSHIP", label: "Relations" },
];

export default function ConsultantsScreen() {
  const router = useRouter();
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [filtered, setFiltered] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("PSYCHOLOGY");

  useEffect(() => {
    fetchConsultants(selectedDiscipline);
  }, [selectedDiscipline]);

  const fetchConsultants = async (discipline: string) => {
    try {
      setLoading(true);
      const res = await API.get(`/api/consultants?discipline=${discipline}`);
      setConsultants(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.log("Erreur consultants:", err);
      setConsultants([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    const results = consultants.filter(
      (c) =>
        c.specialties?.some((s) =>
          s.toLowerCase().includes(text.toLowerCase())
        ) || c.bio?.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(results);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>Consultants</Text>
          <Text style={styles.subtitle}>{filtered.length} disponible(s)</Text>

          {/* Filtres discipline */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.disciplineContainer}
          >
            {DISCIPLINES.map((d) => (
              <TouchableOpacity
                key={d.key}
                style={[
                  styles.disciplineButton,
                  selectedDiscipline === d.key && styles.disciplineButtonActive,
                ]}
                onPress={() => setSelectedDiscipline(d.key)}
              >
                <Text
                  style={[
                    styles.disciplineText,
                    selectedDiscipline === d.key && styles.disciplineTextActive,
                  ]}
                >
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recherche */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍  Rechercher par spécialité..."
            value={search}
            onChangeText={handleSearch}
          />
        </View>

        {/* Liste */}
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyText}>Aucun consultant disponible</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            {filtered.map((consultant) => (
              <TouchableOpacity
                key={consultant.id}
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/consultant/[id]",
                    params: { id: consultant.id },
                  })
                }
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {consultant.discipline[0]}
                  </Text>
                </View>
                <View style={styles.info}>
                  <View style={styles.nameRow}>
                    <Text style={styles.discipline}>
                      {DISCIPLINES.find((d) => d.key === consultant.discipline)?.label}
                    </Text>
                    <Text style={styles.price}>
                      {consultant.pricePerSession}€/séance
                    </Text>
                  </View>
                  <Text style={styles.bio} numberOfLines={2}>
                    {consultant.bio}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.meta}>
                      🏷️ {consultant.specialties?.slice(0, 2).join(", ")}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.meta}>
                      🌍 {consultant.languages?.join(", ")}
                    </Text>
                    {consultant.rating > 0 && (
                      <Text style={styles.meta}>⭐ {consultant.rating}</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2563eb" },
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#2563eb",
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  title: { color: "white", fontSize: 24, fontWeight: "700" },
  subtitle: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4, marginBottom: 16 },
  disciplineContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
  },
  disciplineButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginRight: 10,
  },
  disciplineButtonActive: {
    backgroundColor: "white",
  },
  disciplineText: {
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
    fontSize: 14,
  },
  disciplineTextActive: {
    color: "#2563eb",
    fontWeight: "700",
  },
  searchContainer: {
    padding: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
  },
  list: { padding: 16 },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  avatarText: { color: "#2563eb", fontWeight: "700", fontSize: 20 },
  info: { flex: 1 },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  discipline: { fontSize: 16, fontWeight: "700", color: "#1a1a1a" },
  price: { fontSize: 13, fontWeight: "600", color: "#2563eb" },
  bio: { fontSize: 13, color: "#666", marginBottom: 6 },
  metaRow: { flexDirection: "row", gap: 12, marginBottom: 2 },
  meta: { fontSize: 12, color: "#888" },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: "#999" },
});