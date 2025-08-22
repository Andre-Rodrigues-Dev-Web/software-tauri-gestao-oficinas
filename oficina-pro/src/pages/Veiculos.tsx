import React, { useEffect, useMemo, useState } from "react";
import { Cliente, ID, Veiculo } from "../lib/types";
import { invoke } from "@tauri-apps/api/core";

const uid = () => crypto.randomUUID();

export default function VeiculosPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [novoVeiculo, setNovoVeiculo] = useState<{ clienteId: ID; placa: string; modelo: string }>({ clienteId: "", placa: "", modelo: "" });

  useEffect(() => {
    (async () => {
      try {
        const rows = await invoke<{ id: string; name: string }[]>("clients_list", { q: "", limit: 200, offset: 0 });
        setClientes(rows.map(r => ({ id: r.id, nome: r.name })) as Cliente[]);
      } catch {}
    })();
  }, []);

  const clienteById = useMemo(() => Object.fromEntries(clientes.map(c => [c.id, c])), [clientes]);

  const addVeiculo = () => {
    if (!novoVeiculo.clienteId || !novoVeiculo.placa.trim()) return;
    setVeiculos(prev => [...prev, { id: uid(), clienteId: novoVeiculo.clienteId, placa: novoVeiculo.placa.toUpperCase(), modelo: novoVeiculo.modelo }]);
    setNovoVeiculo({ clienteId: "", placa: "", modelo: "" });
  };
  const delVeiculo = (id: ID) => setVeiculos(prev => prev.filter(v => v.id !== id));

  return (
    <section>
      <h2>Veículos (placeholder)</h2>
      <form className="row" onSubmit={(e) => { e.preventDefault(); addVeiculo(); }}>
        <select
          value={novoVeiculo.clienteId}
          onChange={(e) => setNovoVeiculo(v => ({ ...v, clienteId: e.currentTarget.value }))}
        >
          <option value="">Selecione o cliente</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
        <input placeholder="Placa" value={novoVeiculo.placa} onChange={(e) => setNovoVeiculo(v => ({ ...v, placa: e.currentTarget.value }))} />
        <input placeholder="Modelo" value={novoVeiculo.modelo} onChange={(e) => setNovoVeiculo(v => ({ ...v, modelo: e.currentTarget.value }))} />
        <button type="submit" disabled={!clientes.length}>Adicionar</button>
      </form>

      <ul>
        {veiculos.map((v) => (
          <li key={v.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 6, borderBottom: "1px solid #ddd" }}>
            <div>
              <strong>{v.placa}</strong> — {v.modelo || "(sem modelo)"}
              <div style={{ fontSize: 12, color: "#666" }}>Cliente: {clienteById[v.clienteId]?.nome || "-"}</div>
            </div>
            <button onClick={() => delVeiculo(v.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
