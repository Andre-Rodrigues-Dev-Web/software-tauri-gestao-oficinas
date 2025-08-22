import React, { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Cliente, ID } from "../lib/types";

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [qClientes, setQClientes] = useState("");
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [erroClientes, setErroClientes] = useState<string | null>(null);

  const [formCliente, setFormCliente] = useState<{ id?: ID; nome: string; telefone?: string; email?: string; endereco?: string; cpfCnpj?: string }>({ nome: "" });
  const isEdit = !!formCliente.id;

  async function carregarClientes(q?: string) {
    setLoadingClientes(true);
    setErroClientes(null);
    try {
      const rows = await invoke<{
        id: string; name: string; phone?: string; email?: string; address?: string; cpf_cnpj?: string; created_at?: string;
      }[]>("clients_list", { q: q ?? qClientes, limit: 200, offset: 0 });
      const mapped: Cliente[] = rows.map(r => ({
        id: r.id,
        nome: r.name,
        telefone: r.phone,
        email: r.email,
        endereco: r.address,
        cpfCnpj: r.cpf_cnpj,
        created_at: r.created_at,
      }));
      setClientes(mapped);
    } catch (e: any) {
      setErroClientes(String(e));
    } finally {
      setLoadingClientes(false);
    }
  }

  async function salvarCliente() {
    if (!formCliente.nome.trim()) return;
    try {
      if (isEdit && formCliente.id) {
        await invoke("clients_update", {
          id: formCliente.id,
          data: {
            name: formCliente.nome,
            phone: formCliente.telefone || null,
            email: formCliente.email || null,
            address: formCliente.endereco || null,
            cpf_cnpj: formCliente.cpfCnpj || null,
          },
        });
      } else {
        await invoke("clients_create", {
          data: {
            name: formCliente.nome,
            phone: formCliente.telefone || null,
            email: formCliente.email || null,
            address: formCliente.endereco || null,
            cpf_cnpj: formCliente.cpfCnpj || null,
          },
        });
      }
      setFormCliente({ nome: "" });
      await carregarClientes();
    } catch (e) {
      alert(`Erro ao salvar cliente: ${e}`);
    }
  }

  function editarCliente(c: Cliente) {
    setFormCliente({
      id: c.id,
      nome: c.nome,
      telefone: c.telefone,
      email: c.email,
      endereco: c.endereco,
      cpfCnpj: c.cpfCnpj,
    });
  }

  async function excluirCliente(id: ID) {
    if (!confirm("Excluir cliente e dados relacionados?")) return;
    try {
      await invoke("clients_delete", { id });
      await carregarClientes();
    } catch (e) {
      alert(`Erro ao excluir: ${e}`);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <section>
      <h2>Clientes</h2>
      <form className="row" onSubmit={(e) => { e.preventDefault(); carregarClientes(qClientes); }}>
        <input placeholder="Buscar clientes (nome, telefone, e-mail, CPF/CNPJ)" value={qClientes} onChange={e => setQClientes(e.currentTarget.value)} />
        <button type="submit">Buscar</button>
        <button type="button" onClick={() => { setQClientes(""); carregarClientes(""); }}>Limpar</button>
      </form>

      <h3 style={{ marginTop: 16 }}>{isEdit ? "Editar Cliente" : "Novo Cliente"}</h3>
      <form className="row" onSubmit={(e) => { e.preventDefault(); salvarCliente(); }}>
        <input placeholder="Nome" value={formCliente.nome} onChange={e => setFormCliente(v => ({ ...v, nome: e.currentTarget.value }))} />
        <input placeholder="Telefone" value={formCliente.telefone || ""} onChange={e => setFormCliente(v => ({ ...v, telefone: e.currentTarget.value }))} />
        <input placeholder="E-mail" value={formCliente.email || ""} onChange={e => setFormCliente(v => ({ ...v, email: e.currentTarget.value }))} />
        <input placeholder="Endereço" value={formCliente.endereco || ""} onChange={e => setFormCliente(v => ({ ...v, endereco: e.currentTarget.value }))} />
        <input placeholder="CPF/CNPJ" value={formCliente.cpfCnpj || ""} onChange={e => setFormCliente(v => ({ ...v, cpfCnpj: e.currentTarget.value }))} />
        <button type="submit">{isEdit ? "Salvar" : "Adicionar"}</button>
        {isEdit && <button type="button" onClick={() => setFormCliente({ nome: "" })}>Cancelar</button>}
      </form>

      {loadingClientes && <p>Carregando...</p>}
      {erroClientes && <p style={{ color: "red" }}>{erroClientes}</p>}

      <ul>
        {clientes.map((c) => (
          <li key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 6, borderBottom: "1px solid #ddd" }}>
            <div style={{ textAlign: "left" }}>
              <strong>{c.nome}</strong>
              <div style={{ fontSize: 12, color: "#666" }}>{c.telefone || "-"} {c.email ? ` • ${c.email}` : ""}</div>
              <div style={{ fontSize: 12 }}>{c.endereco || "-"} {c.cpfCnpj ? ` • ${c.cpfCnpj}` : ""}</div>
            </div>
            <div className="row" style={{ gap: 6 }}>
              <button onClick={() => editarCliente(c)}>Editar</button>
              <button onClick={() => excluirCliente(c.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
