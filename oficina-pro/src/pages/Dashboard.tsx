import React, { useEffect, useState } from "react";
import { SimpleLineChart } from "../components/charts/SimpleLineChart";
import { SimpleBarChart } from "../components/charts/SimpleBarChart";
import { SimpleDonutChart } from "../components/charts/SimpleDonutChart";
import { getDashboardData } from "../lib/data";
import type { DashboardData } from "../lib/types";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const brl: (n: number) => string = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  useEffect(() => {
    let mounted = true;
    getDashboardData().then((d) => {
      if (mounted) setData(d);
    });
    return () => { mounted = false; };
  }, []);

  if (!data) {
    return (
      <section className="dashboard">
        <div className="metrics">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`metric metric-${i}`}>
              <div className="metric-title">Carregando…</div>
              <div className="metric-row">
                <div className="metric-value">…</div>
                <div className={`metric-delta`}>…</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const metricItems = [
    { title: "OS Abertas", value: data.metrics.osAbertas, delta: "+8.3%", type: "number" as const },
    { title: "OS Concluídas", value: data.metrics.osConcluidas, delta: "+3.1%", type: "number" as const },
    { title: "Faturamento (R$)", value: data.metrics.faturamento, delta: "+12.4%", type: "money" as const },
    { title: "Ticket Médio (R$)", value: data.metrics.ticketMedio, delta: "-1.8%", type: "money" as const },
  ];

  return (
    <section className="dashboard">
      <div className="metrics">
        {metricItems.map((m, i) => (
          <div key={i} className={`metric metric-${i + 1}`}>
            <div className="metric-title">{m.title}</div>
            <div className="metric-row">
              <div className="metric-value">
                {m.type === "money" ? brl(m.value) : m.value.toLocaleString("pt-BR")}
              </div>
              <div className={`metric-delta ${m.delta.startsWith("-") ? "down" : "up"}`}>{m.delta}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="card card-lg">
          <div className="card-head">
            <div className="card-title">OS por Mês</div>
            <div className="card-tabs">
              <button className="tab active">Este ano</button>
              <button className="tab">Ano passado</button>
            </div>
          </div>
          <SimpleLineChart title="" labels={data.osPorMes.labels} values={data.osPorMes.values} lineColor="#111827" width={900} height={200} />
        </div>
        <div className="card">
          <div className="card-title">Serviços mais realizados</div>
          <div className="list-lines">
            {data.topServicos.map((n, i) => (
              <div key={i} className="line-item">
                <span>{n}</span>
                <span className="line-bars">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-title">OS por Status</div>
          <SimpleBarChart title="" labels={data.status.labels} values={data.status.values} barColor="#6366f1" height={260} barWidth={36} gap={20} labelAngle={-45} labelFontSize={10} fitToWidth />
        </div>
        <div className="card">
          <div className="card-title">Origem dos Clientes</div>
          <SimpleDonutChart title="" labels={data.origemClientes.labels} values={data.origemClientes.values} colors={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#9ca3af"]} size={220} radius={80} />
        </div>
      </div>
    </section>
  );
}
