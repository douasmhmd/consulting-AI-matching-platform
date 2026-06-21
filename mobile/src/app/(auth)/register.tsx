import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";
import API from "@/services/api";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"CLIENT" | "CONSULTANT">("CLIENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    setError("Veuillez remplir tous les champs obligatoires");
    return;
  }
  if (password !== confirmPassword) {
    setError("Les mots de passe ne correspondent pas");
    return;
  }
  if (password.length < 6) {
    setError("Le mot de passe doit contenir au moins 6 caractères");
    return;
  }

  try {
    setLoading(true);
    setError("");

    console.log("Step 1: Création Firebase...");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Step 1 ✅:", userCredential.user.email);

    console.log("Step 2: Récupération token...");
    const firebaseToken = await userCredential.user.getIdToken();
    console.log("Step 2 ✅ token length:", firebaseToken.length);

    console.log("Step 3: Envoi à Spring Boot...");
    await API.post("/api/auth/register", {
      firebaseToken,
      fullName: `${firstName} ${lastName}`,
      phone,
      role,
      language: "fr",
      city: "",
    });
    console.log("Step 3 ✅ Done!");

    router.replace("/(auth)/login");
  } catch (err: any) {
    console.log("REGISTER ERROR code:", err?.code);
    console.log("REGISTER ERROR message:", err?.message);
    console.log("REGISTER ERROR response:", err?.response?.data);
    const message =
      err?.code === "auth/email-already-in-use" ? "Un compte existe déjà avec cet email" :
      err?.code === "auth/weak-password" ? "Mot de passe trop faible" :
      err?.response?.data?.message ||
      "Erreur lors de l'inscription";
    setError(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.headerContainer}>
            <Text style={styles.logo}>🤝</Text>
            <Text style={styles.appName}>Consulting AI</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez notre plateforme</Text>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            ) : null}

            <Text style={styles.label}>Je suis</Text>
            <View style={styles.roleRow}>
              <TouchableOpacity
                style={[styles.roleButton, role === "CLIENT" && styles.roleButtonActive]}
                onPress={() => setRole("CLIENT")}
              >
                <Text style={styles.roleIcon}>🧑‍💼</Text>
                <Text style={[styles.roleText, role === "CLIENT" && styles.roleTextActive]}>
                  Client
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, role === "CONSULTANT" && styles.roleButtonActive]}
                onPress={() => setRole("CONSULTANT")}
              >
                <Text style={styles.roleIcon}>👨‍🏫</Text>
                <Text style={[styles.roleText, role === "CONSULTANT" && styles.roleTextActive]}>
                  Consultant
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Prénom <Text style={styles.required}>*</Text></Text>
            <TextInput
              placeholder="Jean"
              value={firstName}
              onChangeText={(text) => { setFirstName(text); setError(""); }}
              style={styles.input}
            />

            <Text style={styles.label}>Nom <Text style={styles.required}>*</Text></Text>
            <TextInput
              placeholder="Dupont"
              value={lastName}
              onChangeText={(text) => { setLastName(text); setError(""); }}
              style={styles.input}
            />

            <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
            <TextInput
              placeholder="vous@exemple.com"
              value={email}
              onChangeText={(text) => { setEmail(text); setError(""); }}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              placeholder="+212 6 12 34 56 78"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
            />

            <Text style={styles.label}>Mot de passe <Text style={styles.required}>*</Text></Text>
            <TextInput
              placeholder="••••••••"
              value={password}
              secureTextEntry
              onChangeText={(text) => { setPassword(text); setError(""); }}
              style={styles.input}
            />

            <Text style={styles.label}>Confirmer le mot de passe <Text style={styles.required}>*</Text></Text>
            <TextInput
              placeholder="••••••••"
              value={confirmPassword}
              secureTextEntry
              onChangeText={(text) => { setConfirmPassword(text); setError(""); }}
              style={styles.input}
            />

            <TouchableOpacity
              onPress={handleRegister}
              style={[styles.button, loading && styles.buttonDisabled]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>S'inscrire</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
              <Text style={styles.loginText}>
                Déjà un compte ?{" "}
                <Text style={styles.loginLink}>Se connecter</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2563eb" },
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scroll: { padding: 20, paddingBottom: 40 },
  headerContainer: { alignItems: "center", marginVertical: 24 },
  logo: { fontSize: 40, marginBottom: 6 },
  appName: { fontSize: 22, fontWeight: "700", color: "#1a1a1a" },
  card: {
    backgroundColor: "white", borderRadius: 16, padding: 24,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  title: { fontSize: 26, fontWeight: "700", color: "#1a1a1a", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 24 },
  errorBox: {
    backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fecaca",
    borderRadius: 8, padding: 10, marginBottom: 16,
  },
  errorText: { color: "#dc2626", fontSize: 13 },
  label: { fontSize: 13, fontWeight: "600", color: "#333", marginBottom: 6 },
  required: { color: "#dc2626" },
  input: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 10,
    padding: 12, fontSize: 15, marginBottom: 16, backgroundColor: "#fafafa",
  },
  roleRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  roleButton: {
    flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 12,
    padding: 14, alignItems: "center", backgroundColor: "#fafafa",
  },
  roleButtonActive: { borderColor: "#2563eb", backgroundColor: "#eff6ff" },
  roleIcon: { fontSize: 24, marginBottom: 4 },
  roleText: { fontSize: 14, fontWeight: "600", color: "#666" },
  roleTextActive: { color: "#2563eb" },
  button: {
    backgroundColor: "#2563eb", padding: 14, borderRadius: 10,
    alignItems: "center", marginTop: 4, marginBottom: 16,
  },
  buttonDisabled: { backgroundColor: "#93c5fd" },
  buttonText: { color: "white", fontWeight: "700", fontSize: 16 },
  loginText: { textAlign: "center", color: "#666", fontSize: 13 },
  loginLink: { color: "#2563eb", fontWeight: "600" },
});