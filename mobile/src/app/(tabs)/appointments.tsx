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
import API from "@/services/api";

type Appointment = {
  id: string;
  clientId: string;
  consultantId: string;
  consultantName: string;
  dateTime: string | null;
  date: string;
  time: string;
  durationMinutes: number;
  status: string;
  mode: string | null;
  clientNote: string | null;
  consultantNote: string | null;
  createdAt: string;
};

const STATUS_MAP: Record<string, "upcoming" | "completed" | "cancelled"> = {
  PENDING: "upcoming",
  CONFIRMED: "upcoming",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

const STATUS_LABELS: Record<string, string> = {
  upcoming: "À venir",
  completed: "Terminé",
  cancelled: "Annulé",
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  upcoming: { bg: "#dbeafe", text: "#1d4ed8" },
  completed: { bg: "#dcfce7", text: "#15803d" },
  cancelled: { bg: "#fee2e2", text: "#dc2626" },
};

const DISCIPLINES: Record<string, string> = {
  PSYCHOLOGY: "Psychologie",
  NUTRITION: "Nutrition",
  BUSINESS: "Business",
  IT: "IT",
  RELATIONSHIP: "Relations",
};

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/api/appointments/me");
      setAppointments(res.data);
    } catch (err) {
      console.log("Erreur rendez-vous:", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const getMappedStatus = (status: string) => STATUS_MAP[status] || "upcoming";

  const filtered = appointments.filter(
    (a) => getMappedStatus(a.status) === activeTab
  );

  const formatDate = (appointment: Appointment) => {
    const dateStr = appointment.date || appointment.createdAt;
    if (!dateStr) return "Date non définie";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      weekday: "short", month: "short", day: "numeric",
    });
  };

  const handleCancel = async (id: string) => {
    try {
      await API.put(`/api/appointments/${id}/status`, { status: "CANCELLED" });
      fetchAppointments();
    } catch (err) {
      console.log("Erreur annulation:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>Rendez-vous</Text>
          <Text style={styles.subtitle}>{appointments.length} au total</Text>
        </View>

        {/* Onglets */}
        <View style={styles.tabsRow}>
          {(["upcoming", "completed", "cancelled"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {STATUS_LABELS[tab]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Liste */}
        <ScrollView contentContainerStyle={styles.list}>
          {filtered.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>
                Aucun rendez-vous {STATUS_LABELS[activeTab].toLowerCase()}
              </Text>
            </View>
          ) : (
            filtered.map((appointment) => {
              const mappedStatus = getMappedStatus(appointment.status);
              const colors = STATUS_COLORS[mappedStatus];
              const displayName = appointment.consultantName
                ? DISCIPLINES[appointment.consultantName] || appointment.consultantName
                : "Consultant";

              return (
                <View key={appointment.id} style={styles.card}>
                  <View style={[styles.colorBar, { backgroundColor: colors.bg }]} />
                  <View style={styles.cardContent}>

                    <View style={styles.cardHeader}>
                      <Text style={styles.consultantName}>{displayName}</Text>
                      <View style={[styles.badge, { backgroundColor: colors.bg }]}>
                        <Text style={[styles.badgeText, { color: colors.text }]}>
                          {appointment.status}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.timeRow}>
                      <Text style={styles.timeText}>
                        📅 {formatDate(appointment)}
                      </Text>
                      {appointment.time && (
                        <Text style={styles.timeText}>🕐 {appointment.time}</Text>
                      )}
                    </View>

                    {appointment.durationMinutes > 0 && (
                      <Text style={styles.duration}>
                        ⏱ {appointment.durationMinutes} min
                      </Text>
                    )}

                    {mappedStatus === "upcoming" && (
                      <View style={styles.actionsRow}>
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={() => handleCancel(appointment.id)}
                        >
                          <Text style={styles.cancelText}>Annuler</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.joinButton}>
                          <Text style={styles.joinText}>Rejoindre</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2563eb" },
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { backgroundColor: "#2563eb", padding: 24, paddingBottom: 20 },
  title: { color: "white", fontSize: 24, fontWeight: "700" },
  subtitle: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 },
  tabsRow: {
    flexDirection: "row", backgroundColor: "white",
    borderBottomWidth: 1, borderBottomColor: "#f0f0f0",
  },
  tab: {
    flex: 1, paddingVertical: 14, alignItems: "center",
    borderBottomWidth: 2, borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: "#2563eb" },
  tabText: { fontSize: 13, fontWeight: "600", color: "#999" },
  tabTextActive: { color: "#2563eb" },
  list: { padding: 16 },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: "#999" },
  card: {
    backgroundColor: "white", borderRadius: 16, marginBottom: 12,
    flexDirection: "row", overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  colorBar: { width: 6 },
  cardContent: { flex: 1, padding: 16 },
  cardHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 4,
  },
  consultantName: { fontSize: 16, fontWeight: "700", color: "#1a1a1a", flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: "600" },
  timeRow: { flexDirection: "row", gap: 16, marginBottom: 8 },
  timeText: { fontSize: 13, color: "#555" },
  duration: { fontSize: 12, color: "#888", marginBottom: 8 },
  actionsRow: { flexDirection: "row", gap: 8, marginTop: 4 },
  cancelButton: {
    flex: 1, paddingVertical: 8, borderRadius: 8,
    borderWidth: 1, borderColor: "#dc2626", alignItems: "center",
  },
  cancelText: { color: "#dc2626", fontWeight: "600", fontSize: 13 },
  joinButton: {
    flex: 1, paddingVertical: 8, borderRadius: 8,
    backgroundColor: "#2563eb", alignItems: "center",
  },
  joinText: { color: "white", fontWeight: "600", fontSize: 13 },
});