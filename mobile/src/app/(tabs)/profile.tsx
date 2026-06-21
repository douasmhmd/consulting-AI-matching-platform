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
import API, { tokenStorage } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

type User = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phone?: string;
  city?: string;
  language?: string;
  createdAt?: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/api/users/me");
        setUser(res.data);
      } catch (err) {
        console.log("Erreur profil:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await tokenStorage.removeToken();
    setIsAuthenticated(false);
    router.replace("/(auth)/login");
  };

  const getInitials = () => {
    if (!user?.fullName) return "?";
    const parts = user.fullName.split(" ");
    return parts.map((p) => p[0]).join("").toUpperCase().slice(0, 2);
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      CLIENT: "Client",
      CONSULTANT: "Consultant",
      ADMIN: "Administrateur",
    };
    return labels[role] || role;
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
      <ScrollView style={styles.container}>

        {/* En-tête */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          <Text style={styles.name}>{user?.fullName || "Utilisateur"}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{getRoleLabel(user?.role || "")}</Text>
          </View>
        </View>

        {/* Informations personnelles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          <View style={styles.infoCard}>
            <InfoRow icon="📧" label="Email" value={user?.email || "-"} />
            <View style={styles.divider} />
            <InfoRow icon="📱" label="Téléphone" value={user?.phone || "-"} />
            <View style={styles.divider} />
            <InfoRow icon="🏙️" label="Ville" value={user?.city || "-"} />
            <View style={styles.divider} />
            <InfoRow icon="🌍" label="Langue" value={user?.language || "-"} />
            <View style={styles.divider} />
            <InfoRow
              icon="📅"
              label="Membre depuis"
              value={
                user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
                      month: "long",
                      year: "numeric",
                    })
                  : "-"
              }
            />
          </View>
        </View>

        {/* Compte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mon compte</Text>
          <View style={styles.infoCard}>
            <TouchableOpacity style={styles.actionRow}>
              <Text style={styles.actionIcon}>✏️</Text>
              <Text style={styles.actionLabel}>Modifier le profil</Text>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.actionRow}>
              <Text style={styles.actionIcon}>🔒</Text>
              <Text style={styles.actionLabel}>Changer le mot de passe</Text>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.actionRow}>
              <Text style={styles.actionIcon}>🔔</Text>
              <Text style={styles.actionLabel}>Notifications</Text>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Déconnexion */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>🚪  Se déconnecter</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2563eb" },
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#2563eb",
    paddingBottom: 30,
    alignItems: "center",
    paddingTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: "700", color: "#2563eb" },
  name: { color: "white", fontSize: 22, fontWeight: "700", marginBottom: 8 },
  roleBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleText: { color: "white", fontSize: 12, fontWeight: "600" },
  section: { padding: 16, paddingBottom: 0 },
  sectionTitle: {
    fontSize: 13, fontWeight: "700", color: "#999",
    textTransform: "uppercase", marginBottom: 8, letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: "white", borderRadius: 16, overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  infoRow: { flexDirection: "row", alignItems: "center", padding: 16 },
  infoIcon: { fontSize: 20, marginRight: 12 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, color: "#999", marginBottom: 2 },
  infoValue: { fontSize: 15, color: "#1a1a1a", fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#f0f0f0", marginLeft: 48 },
  actionRow: { flexDirection: "row", alignItems: "center", padding: 16 },
  actionIcon: { fontSize: 20, marginRight: 12 },
  actionLabel: { flex: 1, fontSize: 15, color: "#1a1a1a", fontWeight: "500" },
  actionArrow: { fontSize: 20, color: "#ccc" },
  logoutButton: {
    backgroundColor: "white", borderRadius: 16, padding: 16,
    alignItems: "center", marginBottom: 30,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  logoutText: { color: "#dc2626", fontWeight: "700", fontSize: 16 },
});