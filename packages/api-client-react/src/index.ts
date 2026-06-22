import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
} from "@tanstack/react-query";

const API_BASE =
  (typeof import.meta !== "undefined" &&
    (import.meta as { env?: Record<string, string> }).env?.VITE_API_BASE) ||
  "";

type QueryConfig<TData> = {
  query?: Pick<UseQueryOptions<TData, Error, TData, QueryKey>, "queryKey" | "refetchInterval" | "retry">;
};

function getToken(): string {
  if (typeof window === "undefined") return "";
  let token = window.localStorage.getItem("ardalink.jwt") ?? "";
  if (!token) {
    // Allow ?token=xxx on initial load (demo + link sharing)
    const url = new URL(window.location.href);
    const fromQuery = url.searchParams.get("token");
    const fromHash = window.location.hash.replace(/^#/, "");
    const hashToken = new URLSearchParams(fromHash).get("token");
    token = fromQuery || hashToken || "";
    if (token) {
      window.localStorage.setItem("ardalink.jwt", token);
      const tenant = url.searchParams.get("tenant") ||
        new URLSearchParams(fromHash).get("tenant") || "";
      if (tenant) {
        window.localStorage.setItem("ardalink.tenant", tenant);
      }
    }
  }
  return token;
}

export function getTenant(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("ardalink.tenant") ?? "";
}

async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("authorization", `Bearer ${token}`);
  if (!headers.has("content-type") && init.body) {
    headers.set("content-type", "application/json");
  }
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${text}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

// ---- Types ----------------------------------------------------------------

export type Quadrant = "NE" | "NW" | "SE" | "SW" | "C";
export type ActionTag =
  | "no_action"
  | "advised_relocate"
  | "advised_supplement"
  | "advised_water_access";

export interface GroundTruthReport {
  id: number;
  createdAt: string;
  phone: string;
  month: string;
  reportedQuadrant: Quadrant;
  reportedLocation: string;
  actionTag: ActionTag;
  bcsScore: number;
  bcsConfidence: string;
  bcsSpecies: string;
  bcsFlagFollowup: boolean;
  offtakeRate: string;
  mortalityRate: string;
  milkProduction: string;
  waterTrekkingDistance: string;
  waterPointName: string;
  waterPointStatus: string;
  supplementaryFeeding: string;
  ndviVsBaselinePercent: number;
  rainfall30dayMm: number;
  indicatorsCollected: number;
  dataCompletenessPercent: number;
  trustScore: number;
  trustFlags: string[];
  userFeedback?: string | null;
}

export interface QuadrantSummary {
  quadrant: Quadrant;
  reportCount: number;
  bcsAvg: number;
  ndviAvg: number;
}

export interface GroundTruthSummary {
  totalReports: number;
  avgBcs: number;
  byQuadrant: QuadrantSummary[];
}

export interface StatusResponse {
  is_running: boolean;
  last_run_at: string | null;
  last_run_status: string | null;
  last_run_summary?: Record<string, unknown>;
}

export interface ForecastResponse {
  forecastHorizonDays: number;
  ndviProjection: { date: string; ndvi: number }[];
  rainfallProjection: { date: string; mm: number }[];
  riskLevel: "low" | "moderate" | "high" | "severe";
  recommendations: string[];
  generatedAt: string;
}

export interface Pastoralist {
  id: number;
  name: string;
  phone: string;
  location?: string;
  cattle: number;
  goats: number;
  camels: number;
  alertsEnabled: boolean;
  alertsSent: number;
  createdAt: string;
}

export interface CreatePastoralistInput {
  name: string;
  phone: string;
  location?: string;
  cattle: number;
  goats: number;
  camels: number;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  locale?: string;
}

export interface ChatResponse {
  reply: string;
  citations?: { source: string; snippet: string }[];
}

export interface TriggerCheckInput {
  dryRun?: boolean;
  forceAlert?: boolean;
}

export interface TriggerCheckResponse {
  ok: boolean;
  message?: string;
}

// ---- Query key helpers ---------------------------------------------------

export const getStatus = async (): Promise<StatusResponse> =>
  apiFetch<StatusResponse>("/api/status");

export const getGetStatusQueryKey = () => ["status"] as const;

export const getForecast = async (): Promise<ForecastResponse> =>
  apiFetch<ForecastResponse>("/api/forecast");

export const getGetForecastQueryKey = () => ["forecast"] as const;

export const listPastoralists = async (): Promise<Pastoralist[]> =>
  apiFetch<Pastoralist[]>("/api/pastoralists");

export const getListPastoralistsQueryKey = () => ["pastoralists", "list"] as const;

export const listGroundTruthRecent = async (
  params: { limit?: number } = {},
): Promise<GroundTruthReport[]> =>
  apiFetch<GroundTruthReport[]>(
    `/api/ground-truth/recent?limit=${params.limit ?? 20}`,
  );

export const getListGroundTruthRecentQueryKey = (params: { limit?: number } = {}) =>
  ["ground-truth", "recent", params.limit ?? 20] as const;

export const getGroundTruthSummary = async (): Promise<GroundTruthSummary> =>
  apiFetch<GroundTruthSummary>("/api/ground-truth/summary");

export const getGetGroundTruthSummaryQueryKey = () =>
  ["ground-truth", "summary"] as const;

// ---- Hooks ----------------------------------------------------------------

export function useGetStatus(config: QueryConfig<StatusResponse> = {}) {
  return useQuery<StatusResponse, Error>({
    queryKey: getGetStatusQueryKey(),
    queryFn: getStatus,
    ...config.query,
  });
}

export function useGetForecast(config: QueryConfig<ForecastResponse> = {}) {
  return useQuery<ForecastResponse, Error>({
    queryKey: getGetForecastQueryKey(),
    queryFn: getForecast,
    ...config.query,
  });
}

export function useListPastoralists(
  config: QueryConfig<Pastoralist[]> = {},
) {
  return useQuery<Pastoralist[], Error>({
    queryKey: getListPastoralistsQueryKey(),
    queryFn: listPastoralists,
    ...config.query,
  });
}

export function useCreatePastoralist(
  options?: UseMutationOptions<
    Pastoralist,
    Error,
    CreatePastoralistInput
  >,
) {
  return useMutation<Pastoralist, Error, CreatePastoralistInput>({
    mutationFn: (data) =>
      apiFetch<Pastoralist>("/api/pastoralists", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...options,
  });
}

export function useDeletePastoralist() {
  return useMutation<{ ok: true }, Error, { id: number }>({
    mutationFn: ({ id }) =>
      apiFetch<{ ok: true }>(`/api/pastoralists/${id}`, { method: "DELETE" }),
  });
}

export function useListGroundTruthRecent(
  params: { limit?: number } = {},
  config: QueryConfig<GroundTruthReport[]> = {},
) {
  return useQuery<GroundTruthReport[], Error>({
    queryKey: getListGroundTruthRecentQueryKey(params),
    queryFn: () => listGroundTruthRecent(params),
    ...config.query,
  });
}

export function useGetGroundTruthSummary(
  config: QueryConfig<GroundTruthSummary> = {},
) {
  return useQuery<GroundTruthSummary, Error>({
    queryKey: getGetGroundTruthSummaryQueryKey(),
    queryFn: getGroundTruthSummary,
    ...config.query,
  });
}

export function useTriggerCheck(
  options?: UseMutationOptions<
    TriggerCheckResponse,
    Error,
    TriggerCheckInput
  >,
) {
  return useMutation<TriggerCheckResponse, Error, TriggerCheckInput>({
    mutationFn: (data) =>
      apiFetch<TriggerCheckResponse>("/api/trigger-check", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...options,
  });
}

export function useChatWithLand(
  options?: UseMutationOptions<ChatResponse, Error, ChatRequest>,
) {
  return useMutation<ChatResponse, Error, ChatRequest>({
    mutationFn: (data) =>
      apiFetch<ChatResponse>("/api/chat", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...options,
  });
}

export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("ardalink.jwt", token);
  }
}

export function clearToken(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("ardalink.jwt");
  }
}