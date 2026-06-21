import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import API from "@/services/api";

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState({ appointments: 0, consultants: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, appointmentsRes] = await Promise.all([
        API.get("/api/users/me"),
        API.get("/api/appointments/me"),
      ]);
      const fullName = userRes.data.fullName || "";
      setUserName(fullName.split(" ")[0]); // first name only
      setStats({
        appointments: appointmentsRes.data.length,
        consultants: 0,
      });
    } catch (err) {
      console.log("Erreur home:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>

        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Bienvenue 👋</Text>
          {loading ? (
            <ActivityIndicator color="white" style={{ marginTop: 8 }} />
          ) : (
            <Text style={styles.name}>{userName || "Utilisateur"}</Text>
          )}
          <Text style={styles.subtitle}>Que pouvons-nous faire pour vous aujourd'hui?</Text>
        </View>

        {/* IA Matching — featured */}
        <View style={styles.aiCard}>
          <View style={styles.aiContent}>
            <Text style={styles.aiTitle}>🤖 IA Matching</Text>
            <Text style={styles.aiDesc}>
              Discutez avec notre IA pour trouver le consultant idéal selon vos besoins.
            </Text>
            <TouchableOpacity
              style={styles.aiButton}
              onPress={() => router.push("/(tabs)/ai-matching")}
            >
              <Text style={styles.aiButtonText}>Commencer →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions rapides */}
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(tabs)/consultants")}
          >
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionLabel}>Trouver un consultant</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(tabs)/appointments")}
          >
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionLabel}>Mes rendez-vous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(tabs)/profile")}
          >
            <Text style={styles.actionIcon}>👤</Text>
            <Text style={styles.actionLabel}>Mon profil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(tabs)/ai-matching")}
          >
            <Text style={styles.actionIcon}>🤖</Text>
            <Text style={styles.actionLabel}>IA Matching</Text>
          </TouchableOpacity>
        </View>

        {/* Aperçu */}
        <Text style={styles.sectionTitle}>Aperçu</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.appointments}</Text>
            <Text style={styles.statLabel}>Rendez-vous</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Consultants</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Disciplines</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2563eb" },
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "#2563eb",
    padding: 24,
    paddingBottom: 30,
  },
  greeting: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  name: { color: "white", fontSize: 28, fontWeight: "700", marginTop: 4 },
  subtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    marginTop: 6,
  },
  aiCard: {
    margin: 16,
    backgroundColor: "#1d4ed8",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#1d4ed8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  aiContent: {},
  aiTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  aiDesc: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  aiButton: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  aiButtonText: {
    color: "#1d4ed8",
    fontWeight: "700",
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 12,
  },
  actionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "47%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  actionIcon: { fontSize: 32, marginBottom: 8 },
  actionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  statNumber: { fontSize: 28, fontWeight: "700", color: "#2563eb" },
  statLabel: {
    fontSize: 11,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
});