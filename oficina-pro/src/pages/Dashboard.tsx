import React from "react";
import { SimpleLineChart } from "../components/charts/SimpleLineChart";
import { SimpleBarChart } from "../components/charts/SimpleBarChart";
import { SimpleDonutChart } from "../components/charts/SimpleDonutChart";

export default function Dashboard() {
  const salesLabels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"]; // placeholder labels
  return (
    <section className="dashboard">
      <div className="metrics">
        {[
          { title: "Views", value: 7265, delta: "+11.01%" },
          { title: "Visits", value: 3671, delta: "-0.03%" },
          { title: "New Users", value: 156, delta: "+15.03%" },
          { title: "Active Users", value: 2318, delta: "+6.08%" },
        ].map((m, i) => (
          <div key={i} className={`metric metric-${i + 1}`}>
            <div className="metric-title">{m.title}</div>
            <div className="metric-row">
              <div className="metric-value">{m.value.toLocaleString()}</div>
              <div className={`metric-delta ${m.delta.startsWith("-") ? "down" : "up"}`}>{m.delta}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="card card-lg">
          <div className="card-head">
            <div className="card-title">Total Users</div>
            <div className="card-tabs">
              <button className="tab active">This year</button>
              <button className="tab">Last year</button>
            </div>
          </div>
          <SimpleLineChart title="" labels={salesLabels} values={[8, 12, 10, 18, 22, 24]} lineColor="#111827" />
        </div>
        <div className="card">
          <div className="card-title">Traffic by Website</div>
          <div className="list-lines">
            {["Google", "YouTube", "Instagram", "Pinterest", "Facebook", "Twitter"].map((n, i) => (
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
          <div className="card-title">Traffic by Device</div>
          <SimpleBarChart title="" labels={["Linux", "Mac", "iOS", "Windows", "Android", "Other"]} values={[12, 18, 26, 28, 11, 9]} barColor="#6366f1" />
        </div>
        <div className="card">
          <div className="card-title">Traffic by Location</div>
          <SimpleDonutChart title="" labels={["United States", "Canada", "Mexico", "Other"]} values={[52, 23, 14, 11]} colors={["#3b82f6", "#10b981", "#f59e0b", "#9ca3af"]} />
        </div>
      </div>
    </section>
  );
}
