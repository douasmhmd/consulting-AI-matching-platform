import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import API from "@/services/api";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Interview = {
  id: string;
  messages: Message[];
  status: string;
  report: string | null;
  recommendedDiscipline: string | null;
};

type MatchedConsultant = {
  id: string;
  discipline: string;
  bio: string;
  pricePerSession: number;
  specialties: string[];
  languages: string[];
  score: number;
};

const DISCIPLINES: Record<string, string> = {
  PSYCHOLOGY: "Psychologie",
  NUTRITION: "Nutrition",
  BUSINESS: "Business",
  IT: "IT",
  RELATIONSHIP: "Relations",
};

export default function AiMatchingScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(true);
  const [matches, setMatches] = useState<MatchedConsultant[]>([]);
  const [showMatches, setShowMatches] = useState(false);

  useEffect(() => {
    startInterview();
  }, []);

  useEffect(() => {
  if (messages.length > 0) {
    const timer = setTimeout(() => {
      try {
        scrollRef.current?.scrollToEnd({ animated: true });
      } catch (e) {}
    }, 200);
    return () => clearTimeout(timer);
  }
}, [messages]);

  const startInterview = async () => {
    try {
      setStarting(true);
      const res = await API.post("/api/ai/interviews");
      setInterview(res.data);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.log("Erreur démarrage:", err);
    } finally {
      setStarting(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !interview || loading) return;
    const text = input.trim();
    setInput("");
    setLoading(true);
    try {
      const res = await API.post(`/api/ai/interviews/${interview.id}/messages`, {
        message: text,
      });
      setInterview(res.data);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.log("Erreur message:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    if (!interview || loading) return;
    setLoading(true);
    try {
      const res = await API.post(`/api/ai/interviews/${interview.id}/report`);
      setInterview(res.data);
      setMessages(res.data.messages || []);
      await getMatching(res.data.id);
    } catch (err) {
      console.log("Erreur rapport:", err);
    } finally {
      setLoading(false);
    }
  };

  const getMatching = async (interviewId: string) => {
  try {
    const res = await API.get(`/api/ai/interviews/${interviewId}/matching`);
    console.log("Matching response:", JSON.stringify(res.data));
    const consultants = res.data.consultants || res.data.recommendedConsultants || [];
    console.log("Consultants:", consultants);
    setMatches(consultants);
    setShowMatches(true);
  } catch (err: any) {
    console.log("Erreur matching:", err?.response?.data, err?.message);
  }
};

  if (starting) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Démarrage de l'entretien IA...</Text>
      </View>
    );
  }

  if (showMatches) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>✨ Consultants recommandés</Text>
            <Text style={styles.headerSubtitle}>
              Basé sur votre entretien avec l'IA
            </Text>
          </View>
          <ScrollView contentContainerStyle={styles.matchList}>
            {matches.length === 0 ? (
              <View style={styles.centered}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyText}>Aucun consultant trouvé</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => router.push("/(tabs)/consultants")}
                >
                  <Text style={styles.retryText}>Voir tous les consultants</Text>
                </TouchableOpacity>
              </View>
            ) : (
              matches.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.matchCard}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/consultant/[id]",
                      params: { id: c.id },
                    })
                  }
                >
                  <View style={styles.matchHeader}>
                    <View style={styles.matchAvatar}>
                      <Text style={styles.matchAvatarText}>
                        {c.discipline[0]}
                      </Text>
                    </View>
                    <View style={styles.matchInfo}>
                      <Text style={styles.matchDiscipline}>
                        {DISCIPLINES[c.discipline] || c.discipline}
                      </Text>
                      <Text style={styles.matchPrice}>
                        {c.pricePerSession}€/séance
                      </Text>
                    </View>
                    {c.score && (
                      <View style={styles.scoreBadge}>
                        <Text style={styles.scoreText}>
                          {Math.round(c.score * 100)}%
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.matchBio} numberOfLines={2}>
                    {c.bio}
                  </Text>
                  <View style={styles.matchTags}>
                    {c.specialties?.slice(0, 2).map((s, i) => (
                      <View key={i} style={styles.tag}>
                        <Text style={styles.tagText}>{s}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              ))
            )}
            <TouchableOpacity
              style={styles.restartButton}
              onPress={() => {
                setShowMatches(false);
                setInterview(null);
                setMessages([]);
                startInterview();
              }}
            >
              <Text style={styles.restartText}>🔄 Nouvel entretien</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🤖 Assistant IA</Text>
          <Text style={styles.headerSubtitle}>
            Décrivez vos besoins pour trouver le consultant idéal
          </Text>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.messageScroll}
          contentContainerStyle={styles.messageList}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                msg.role === "user" ? styles.userBubble : styles.aiBubble,
              ]}
            >
              {msg.role === "assistant" && (
                <Text style={styles.aiLabel}>🤖 Assistant</Text>
              )}
              <Text
                style={[
                  styles.messageText,
                  msg.role === "user" ? styles.userText : styles.aiText,
                ]}
              >
                {msg.content}
              </Text>
            </View>
          ))}

          {loading && (
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <Text style={styles.aiLabel}>🤖 Assistant</Text>
              <ActivityIndicator size="small" color="#2563eb" />
            </View>
          )}
        </ScrollView>

        {/* Bouton rapport */}
        {messages.length >= 6 && interview && !loading && (
          <TouchableOpacity
            style={styles.reportButton}
            onPress={generateReport}
          >
            <Text style={styles.reportButtonText}>
              ✨ Générer le rapport et trouver mes consultants
            </Text>
          </TouchableOpacity>
        )}

        {/* Input */}
        {interview && (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Écrivez votre message..."
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!input.trim() || loading) && styles.sendButtonDisabled,
              ]}
              onPress={sendMessage}
              disabled={!input.trim() || loading}
            >
              <Text style={styles.sendButtonText}>→</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2563eb" },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    flexDirection: "column",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: { marginTop: 16, color: "#666", fontSize: 15 },
  header: { backgroundColor: "#2563eb", padding: 20, paddingBottom: 16 },
  headerTitle: { color: "white", fontSize: 20, fontWeight: "700" },
  headerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    marginTop: 4,
  },
  messageScroll: { flex: 1 },
  messageList: { padding: 16, paddingBottom: 16 },
  messageBubble: {
    maxWidth: "80%",
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: "#2563eb",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  aiLabel: {
    fontSize: 11,
    color: "#2563eb",
    fontWeight: "700",
    marginBottom: 6,
  },
  messageText: { fontSize: 14, lineHeight: 20 },
  userText: { color: "white" },
  aiText: { color: "#1a1a1a" },
  reportButton: {
    margin: 12,
    marginBottom: 0,
    backgroundColor: "#059669",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    flexShrink: 0,
  },
  reportButtonText: { color: "white", fontWeight: "700", fontSize: 14 },
  inputRow: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 8,
    alignItems: "flex-end",
    flexShrink: 0,
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: { backgroundColor: "#93c5fd" },
  sendButtonText: { color: "white", fontSize: 20, fontWeight: "700" },
  matchList: { padding: 16 },
  matchCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  matchHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  matchAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  matchAvatarText: { color: "white", fontWeight: "700", fontSize: 18 },
  matchInfo: { flex: 1 },
  matchDiscipline: { fontSize: 16, fontWeight: "700", color: "#1a1a1a" },
  matchPrice: { fontSize: 13, color: "#2563eb", fontWeight: "600", marginTop: 2 },
  scoreBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  scoreText: { color: "#15803d", fontWeight: "700", fontSize: 13 },
  matchBio: { fontSize: 13, color: "#666", marginBottom: 10, lineHeight: 18 },
  matchTags: { flexDirection: "row", gap: 8 },
  tag: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: { color: "#2563eb", fontSize: 12, fontWeight: "600" },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: "#999", marginBottom: 20 },
  retryButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: { color: "white", fontWeight: "700" },
  restartButton: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  restartText: { color: "#666", fontWeight: "600", fontSize: 15 },
});