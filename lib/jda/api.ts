/**
 * JDA Kimyo sayt API'si bilan ishlash uchun mijoz.
 *
 * Token expo-secure-store'da saqlanadi (webda localStorage) va har
 * so'rovda "Authorization: Bearer <token>" sarlavhasida yuboriladi.
 */
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { JDA_API_URL, JDA_TOKEN_KEY, JDA_USER_KEY } from "./config";

// Mobil tarmoq sekin bo'lishi mumkin, lekin cheksiz kutib turmaslik kerak
const REQUEST_TIMEOUT_MS = 15000;

export type JdaUser = {
  id: string;
  userId: string;
  username: string;
  fullName: string | null;
  email?: string | null;
  avatar: string | null;
  role: string;
  university?: string | null;
  level_points: number;
  experience?: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak?: number;
};

export type QuizStats = {
  total: number;
  average: number;
  best: number;
  bestQuizName: string | null;
};

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  fullName: string | null;
  avatar: string | null;
  weeklyStars: number;
  isMe: boolean;
};

export type RecentQuiz = {
  id: string;
  quizName: string;
  percentage: number;
  completedAt: string;
};

export type HomeData = {
  success: true;
  user: JdaUser & { weeklyStars: number; stars: number };
  quizStats: QuizStats;
  leaderboard: {
    top: LeaderboardEntry[];
    myRank: number | null;
    myWeeklyStars: number;
  };
  recentQuizzes: RecentQuiz[];
};

/** Server qaytargan xatoni ushlab qolish uchun */
export class JdaApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "JdaApiError";
    this.status = status;
  }
}

// ─── Token saqlash ──────────────────────────────────────────────

const isWeb = Platform.OS === "web";

async function storageGet(key: string): Promise<string | null> {
  try {
    if (isWeb) {
      return typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    }
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function storageSet(key: string, value: string): Promise<void> {
  try {
    if (isWeb) {
      if (typeof window !== "undefined") window.localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.warn("[JDA] Saqlab bo'lmadi:", error);
  }
}

async function storageRemove(key: string): Promise<void> {
  try {
    if (isWeb) {
      if (typeof window !== "undefined") window.localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  } catch {
    // e'tiborsiz
  }
}

export const getToken = () => storageGet(JDA_TOKEN_KEY);
export const setToken = (token: string) => storageSet(JDA_TOKEN_KEY, token);
export const clearToken = () => storageRemove(JDA_TOKEN_KEY);

export async function getCachedUser(): Promise<JdaUser | null> {
  const raw = await storageGet(JDA_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as JdaUser;
  } catch {
    return null;
  }
}

export const setCachedUser = (user: JdaUser) => storageSet(JDA_USER_KEY, JSON.stringify(user));
export const clearCachedUser = () => storageRemove(JDA_USER_KEY);

// ─── So'rov yuborish ────────────────────────────────────────────

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const { method = "GET", body, auth = true } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${JDA_API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new JdaApiError(
        data?.error || `So'rov bajarilmadi (${response.status})`,
        response.status,
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof JdaApiError) throw error;
    if ((error as Error).name === "AbortError") {
      throw new JdaApiError("Server javob bermadi. Internetni tekshiring.", 0);
    }
    throw new JdaApiError("Tarmoqqa ulanib bo'lmadi. Internetni tekshiring.", 0);
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Endpointlar ────────────────────────────────────────────────

export async function login(loginId: string, password: string) {
  const data = await request<{
    success: true;
    token: string;
    user: JdaUser;
  }>("/api/mobile/auth/login", {
    method: "POST",
    body: { login: loginId, password },
    auth: false,
  });

  await setToken(data.token);
  await setCachedUser(data.user);
  return data.user;
}

export async function fetchMe() {
  const data = await request<{ success: true; user: JdaUser }>("/api/mobile/auth/me");
  await setCachedUser(data.user);
  return data.user;
}

export function fetchHome() {
  return request<HomeData>("/api/mobile/home");
}

export async function logout() {
  await clearToken();
  await clearCachedUser();
}

// ─── Dolzarb mavzular (sayt forumi) ─────────────────────────────

export type ForumAuthor = {
  id: string;
  userId: string;
  username: string;
  fullName: string | null;
  avatar: string | null;
  role: string;
};

export type ForumPost = {
  id: string;
  articleId: string | null;
  title: string | null;
  content: string;
  parentId: string | null;
  isPinned: boolean;
  status: string;
  createdAt: string;
  author: ForumAuthor;
  likes: number;
  replyCount: number;
  likedByMe: boolean;
};

export type ForumFeed = {
  success: true;
  sort: string;
  total: number;
  hasMore: boolean;
  posts: ForumPost[];
  signedIn: boolean;
};

/**
 * Saytdagi "Dolzarb mavzular" lentasi.
 *
 * Tartib va sahifalash server tomonda (lib/forum.js) — veb bilan aynan
 * bir xil mantiq. "dolzarb" — vaqt bilan susayadigan ball bo'yicha.
 */
export function fetchForum(params?: {
  sort?: "dolzarb" | "yangi" | "ommabop";
  limit?: number;
  offset?: number;
}) {
  const q = new URLSearchParams();
  if (params?.sort) q.set("sort", params.sort);
  if (params?.limit) q.set("limit", String(params.limit));
  if (params?.offset) q.set("offset", String(params.offset));

  const qs = q.toString();
  return request<ForumFeed>(`/api/mobile/forum${qs ? `?${qs}` : ""}`);
}

// ─── Quiz ───────────────────────────────────────────────────────

export type QuizCategory = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  questionCount: number;
  bestPercentage: number | null;
};

export type QuizQuestion = {
  id: string;
  category: string;
  question: string;
  options: string[];
  /** To'g'ri variant indeksi — natija ilovada hisoblanadi */
  correct: number;
  explanation: string | null;
  difficulty: string;
};

export type QuizSubmitResult = {
  success: true;
  quizResult: { percentage: number; score: number; totalQuestions: number };
  xpGained: number;
  missionCompleted: boolean;
  missionMessage: string | null;
};

export function fetchQuizCategories() {
  return request<{ success: true; categories: QuizCategory[]; total: number }>(
    "/api/mobile/quiz/categories",
  );
}

export function fetchQuizQuestions(category: string, limit = 20) {
  return request<{
    success: true;
    category: { slug: string; name: string; icon: string };
    total: number;
    questions: QuizQuestion[];
  }>(`/api/mobile/quiz/questions?category=${encodeURIComponent(category)}&limit=${limit}`);
}

export function submitQuiz(payload: {
  category: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
}) {
  return request<QuizSubmitResult>("/api/mobile/quiz/submit", {
    method: "POST",
    body: payload,
  });
}

// ─── Reaksiyalar ────────────────────────────────────────────────

export type ReactionListItem = {
  id: string;
  equation: string;
  name: string | null;
  category: string;
  reactionType: string | null;
  temperature: string | null;
  catalyst: string | null;
  scale: string | null;
  isVerified: boolean;
};

export type ReactionIntermediate = { formula?: string; name?: string; note?: string };
export type ReactionSolvent = { name?: string; efficiency?: string; note?: string };
export type ReactionRateFactor = { factor?: string; effect?: string };

export type ReactionDetail = ReactionListItem & {
  description: string | null;
  pressure: string | null;
  environment: string | null;
  mechanism: string | null;
  intermediates: ReactionIntermediate[] | null;
  solvents: ReactionSolvent[] | null;
  bestSolvent: string | null;
  solventEffect: string | null;
  scaleNote: string | null;
  rateFactors: ReactionRateFactor[] | null;
  techniques: string[] | null;
  equipment: string[] | null;
  hazards: string[] | null;
  observations: string | null;
  yieldInfo: string | null;
  source: string | null;
  sourceUrl: string | null;
};

export type ReactionsResponse = {
  success: true;
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
  query: string | null;
  categories: { name: string; count: number }[];
  reactions: ReactionListItem[];
};

export function fetchReactions(params: {
  q?: string;
  category?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.category && params.category !== "all") search.set("category", params.category);
  if (params.limit) search.set("limit", String(params.limit));
  if (params.offset) search.set("offset", String(params.offset));

  const qs = search.toString();
  return request<ReactionsResponse>(`/api/mobile/reactions${qs ? `?${qs}` : ""}`);
}

export function fetchReaction(id: string) {
  return request<{ success: true; reaction: ReactionDetail }>(
    `/api/mobile/reactions/${encodeURIComponent(id)}`,
  );
}
