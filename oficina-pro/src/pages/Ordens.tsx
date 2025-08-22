import React, { useMemo, useState } from "react";
import { ID, Ordem, Veiculo } from "../lib/types";

const uid = () => crypto.randomUUID();

export default function OrdensPage() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [ordens, setOrdens] = useState<Ordem[]>([]);
  const [novoVeiculo, setNovoVeiculo] = useState<{ placa: string; modelo: string }>({ placa: "", modelo: "" });
  const [novaOrdem, setNovaOrdem] = useState<{ veiculoId: ID; descricao: string; status: Ordem["status"] }>({ veiculoId: "", descricao: "", status: "aberta" });

  const veiculoById = useMemo(() => Object.fromEntries(veiculos.map(v => [v.id, v])), [veiculos]);

  const addVeiculo = () => {
    if (!novoVeiculo.placa.trim()) return;
    const id = uid();
    setVeiculos(prev => [...prev, { id, clienteId: "", placa: novoVeiculo.placa.toUpperCase(), modelo: novoVeiculo.modelo }]);
    setNovoVeiculo({ placa: "", modelo: "" });
  };

  const addOrdem = () => {
    if (!novaOrdem.veiculoId || !novaOrdem.descricao.trim()) return;
    setOrdens(prev => [...prev, { id: uid(), veiculoId: novaOrdem.veiculoId, descricao: novaOrdem.descricao, status: novaOrdem.status }]);
    setNovaOrdem({ veiculoId: "", descricao: "", status: "aberta" });
  };
  const delOrdem = (id: ID) => setOrdens(prev => prev.filter(o => o.id !== id));
  const updStatus = (id: ID, status: Ordem["status"]) => setOrdens(prev => prev.map(o => (o.id === id ? { ...o, status } : o)));

  return (
    <section>
      <h2>Ordens de Serviço (placeholder)</h2>

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-title">Cadastrar Veículo (rápido)</div>
        <form className="row" onSubmit={(e) => { e.preventDefault(); addVeiculo(); }}>
          <input placeholder="Placa" value={novoVeiculo.placa} onChange={(e) => setNovoVeiculo(v => ({ ...v, placa: e.currentTarget.value }))} />
          <input placeholder="Modelo" value={novoVeiculo.modelo} onChange={(e) => setNovoVeiculo(v => ({ ...v, modelo: e.currentTarget.value }))} />
          <button type="submit">Adicionar veículo</button>
        </form>
      </div>

      <form className="row" onSubmit={(e) => { e.preventDefault(); addOrdem(); }}>
        <select value={novaOrdem.veiculoId} onChange={(e) => setNovaOrdem(v => ({ ...v, veiculoId: e.currentTarget.value }))}>
          <option value="">Selecione o veículo</option>
          {veiculos.map(v => (
            <option key={v.id} value={v.id}>{v.placa}</option>
          ))}
        </select>
        <input placeholder="Descrição do serviço" value={novaOrdem.descricao} onChange={(e) => setNovaOrdem(v => ({ ...v, descricao: e.currentTarget.value }))} />
        <select value={novaOrdem.status} onChange={(e) => setNovaOrdem(v => ({ ...v, status: e.currentTarget.value as Ordem["status"] }))}>
          <option value="aberta">Aberta</option>
          <option value="em_andamento">Em andamento</option>
          <option value="concluida">Concluída</option>
        </select>
        <button type="submit" disabled={!veiculos.length}>Adicionar</button>
      </form>

      <ul>
        {ordens.map(o => (
          <li key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 6, borderBottom: "1px solid #ddd" }}>
            <div>
              <strong>{veiculoById[o.veiculoId]?.placa || "?"}</strong> — {o.descricao}
              <div style={{ fontSize: 12, color: "#666" }}>Status: {o.status.replace("_", " ")}</div>
            </div>
            <div className="row" style={{ gap: 6 }}>
              <select value={o.status} onChange={(e) => updStatus(o.id, e.currentTarget.value as Ordem["status"]) }>
                <option value="aberta">Aberta</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluida">Concluída</option>
              </select>
              <button onClick={() => delOrdem(o.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
