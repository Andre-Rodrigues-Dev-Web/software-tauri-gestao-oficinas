import type { DashboardData } from "./types";

let invokeFn: ((cmd: string, args?: Record<string, unknown>) => Promise<any>) | null = null;
try {
  // Tauri v2 invoke
  // Lazy require to avoid build-time issues in non-tauri contexts
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  invokeFn = require("@tauri-apps/api/core").invoke as typeof invokeFn;
} catch (_) {
  invokeFn = null;
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function getMock(): Promise<DashboardData> {
  await delay(150);
  return {
    metrics: {
      osAbertas: 12,
      osConcluidas: 34,
      faturamento: 45230,
      ticketMedio: 375,
    },
    osPorMes: {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      values: [18, 22, 19, 25, 28, 30],
    },
    status: {
      labels: ["Aberta", "Em andamento", "Aguard. peças", "Concluída", "Cancelada"],
      values: [12, 7, 3, 34, 1],
    },
    origemClientes: {
      labels: ["Indicação", "Google", "Redes Sociais", "Passantes", "Outros"],
      values: [38, 24, 18, 12, 8],
    },
    topServicos: [
      "Troca de óleo",
      "Revisão",
      "Alinhamento/balanceamento",
      "Freios",
      "Suspensão",
      "Elétrica",
    ],
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  if (invokeFn) {
    try {
      const res = await invokeFn("dashboard_summary");
      // Map snake_case from Rust if needed to our TS shape
      const map: DashboardData = {
        metrics: {
          osAbertas: Number(res.metrics?.osAbertas ?? res.metrics?.os_abertas ?? 0),
          osConcluidas: Number(res.metrics?.osConcluidas ?? res.metrics?.os_concluidas ?? 0),
          faturamento: Number(res.metrics?.faturamento ?? 0),
          ticketMedio: Number(res.metrics?.ticketMedio ?? res.metrics?.ticket_medio ?? 0),
        },
        osPorMes: {
          labels: (res.osPorMes?.labels ?? res.os_por_mes?.labels ?? []).map(String),
          values: (res.osPorMes?.values ?? res.os_por_mes?.values ?? []).map((n: any) => Number(n)),
        },
        status: {
          labels: (res.status?.labels ?? []).map(String),
          values: (res.status?.values ?? []).map((n: any) => Number(n)),
        },
        origemClientes: {
          labels: (res.origemClientes?.labels ?? res.origem_clientes?.labels ?? []).map(String),
          values: (res.origemClientes?.values ?? res.origem_clientes?.values ?? []).map((n: any) => Number(n)),
        },
        topServicos: (res.topServicos ?? res.top_servicos ?? []).map(String),
      };
      return map;
    } catch (e) {
      // Fallback to mock
      return getMock();
    }
  }
  return getMock();
}
