const API_BASE = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(response.status, `API error: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export interface SearchResult {
  id: string;
  name: string;
  type: string;
  document?: string;
  sources: string[];
  score: number;
}

export interface SearchResponse {
  items: SearchResult[];
  total: number;
  page: number;
  size: number;
}

export interface EntityDetail {
  id: string;
  name: string;
  type: string;
  document?: string;
  properties: Record<string, unknown>;
  sources: string[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  properties: Record<string, unknown>;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: string;
  properties: Record<string, unknown>;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function searchEntities(
  query: string,
  type?: string,
  page = 1,
  size = 20,
): Promise<SearchResponse> {
  const params = new URLSearchParams({ q: query, page: String(page), size: String(size) });
  if (type && type !== "all") {
    params.set("type", type);
  }
  return apiFetch<SearchResponse>(`/api/v1/search?${params}`);
}

export function getEntity(id: string): Promise<EntityDetail> {
  return apiFetch<EntityDetail>(`/api/v1/entity/${encodeURIComponent(id)}`);
}

export function getGraphData(
  entityId: string,
  depth = 1,
  types?: string[],
): Promise<GraphData> {
  const params = new URLSearchParams({ depth: String(depth) });
  if (types?.length) {
    params.set("types", types.join(","));
  }
  return apiFetch<GraphData>(`/api/v1/graph/${encodeURIComponent(entityId)}?${params}`);
}
