import React from "react";
import { NavLink } from "react-router-dom";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">Oficina Pro</div>
      <div className="nav-group">
        <div className="nav-heading">Operações</div>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>Dashboard</NavLink>
        <NavLink to="/ordens" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>Ordens de Serviço</NavLink>
        <NavLink to="/agenda" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>Agenda</NavLink>
        <NavLink to="/estoque" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>Estoque</NavLink>
        <NavLink to="/financeiro" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>Financeiro</NavLink>
      </div>
      <div className="nav-group">
        <div className="nav-heading">Cadastros</div>
        <NavLink to="/clientes" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>Clientes</NavLink>
        <NavLink to="/veiculos" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>Veículos</NavLink>
        <NavLink to="/produtos" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>Produtos</NavLink>
        <NavLink to="/servicos" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>Serviços</NavLink>
        <NavLink to="/fornecedores" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>Fornecedores</NavLink>
      </div>
      <div className="nav-group">
        <div className="nav-heading">Administração</div>
        <NavLink to="/compras" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>Compras</NavLink>
        <NavLink to="/usuarios" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>Usuários</NavLink>
        <NavLink to="/configuracoes" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>Configurações</NavLink>
        <NavLink to="/backup" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>Backup</NavLink>
      </div>
      <div className="nav-group">
        <div className="nav-heading">Relatórios</div>
        <NavLink to="/relatorios" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>Relatórios</NavLink>
      </div>
    </aside>
  );
}
