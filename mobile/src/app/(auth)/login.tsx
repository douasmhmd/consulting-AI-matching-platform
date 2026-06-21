import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";
import API, { tokenStorage } from "@/services/api";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Step 1: Login with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Step 2: Get Firebase ID token
      const firebaseToken = await userCredential.user.getIdToken();

      // Step 3: Send to Spring Boot
      const res = await API.post("/api/auth/login", { firebaseToken });

      // Step 4: Save JWT token
      await tokenStorage.setToken(res.data.token);

      setIsAuthenticated(true);
      
      router.replace("/");
    } catch (err: any) {
      const message =
        err?.code === "auth/invalid-credential" ? "Email ou mot de passe invalide" :
        err?.code === "auth/user-not-found" ? "Aucun compte trouvé" :
        err?.code === "auth/wrong-password" ? "Mot de passe incorrect" :
        err?.response?.data?.message ||
        "Erreur de connexion";
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
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🤝</Text>
          <Text style={styles.appName}>Consulting AI</Text>
          <Text style={styles.appTagline}>Trouvez le consultant idéal</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Bienvenue</Text>
          <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="vous@exemple.com"
            value={email}
            onChangeText={(text) => { setEmail(text); setError(""); }}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            placeholder="••••••••"
            value={password}
            secureTextEntry
            onChangeText={(text) => { setPassword(text); setError(""); }}
            style={styles.input}
          />

          <TouchableOpacity
            onPress={handleLogin}
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.registerText}>
              Pas encore de compte ?{" "}
              <Text style={styles.registerLink}>S'inscrire</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2563eb" },
  container: { flex: 1, backgroundColor: "#f5f5f5", justifyContent: "center", padding: 20 },
  logoContainer: { alignItems: "center", marginBottom: 24 },
  logo: { fontSize: 48, marginBottom: 8 },
  appName: { fontSize: 24, fontWeight: "700", color: "#1a1a1a", marginBottom: 4 },
  appTagline: { fontSize: 14, color: "#666" },
  card: {
    backgroundColor: "white", borderRadius: 16, padding: 24,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  title: { fontSize: 28, fontWeight: "700", color: "#1a1a1a", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 24 },
  label: { fontSize: 13, fontWeight: "600", color: "#333", marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 10,
    padding: 12, fontSize: 15, marginBottom: 16, backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#2563eb", padding: 14, borderRadius: 10,
    alignItems: "center", marginTop: 4, marginBottom: 16,
  },
  buttonDisabled: { backgroundColor: "#93c5fd" },
  buttonText: { color: "white", fontWeight: "700", fontSize: 16 },
  errorBox: {
    backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fecaca",
    borderRadius: 8, padding: 10, marginBottom: 16,
  },
  errorText: { color: "#dc2626", fontSize: 13 },
  registerText: { textAlign: "center", color: "#666", fontSize: 13 },
  registerLink: { color: "#2563eb", fontWeight: "600" },
});