import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiClipboard, FiCalendar, FiBox, FiDollarSign, FiUsers as FiUsersIcon, FiPackage, FiTool, FiTruck, FiShoppingCart, FiUser, FiSettings, FiDatabase, FiBarChart2 } from "react-icons/fi";
import { FaCar } from "react-icons/fa";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">AutoPro</div>
      <div className="nav-group">
        <div className="nav-heading">Operações</div>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><FiHome className="nav-icon" /><span>Dashboard</span></NavLink>
        <NavLink to="/ordens" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><FiClipboard className="nav-icon" /><span>Ordens de Serviço</span></NavLink>
        <NavLink to="/agenda" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><FiCalendar className="nav-icon" /><span>Agenda</span></NavLink>
        <NavLink to="/estoque" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><FiBox className="nav-icon" /><span>Estoque</span></NavLink>
        <NavLink to="/financeiro" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><FiDollarSign className="nav-icon" /><span>Financeiro</span></NavLink>
      </div>
      <div className="nav-group">
        <div className="nav-heading">Cadastros</div>
        <NavLink to="/clientes" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><FiUsersIcon className="nav-icon" /><span>Clientes</span></NavLink>
        <NavLink to="/veiculos" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><FaCar className="nav-icon" /><span>Veículos</span></NavLink>
        <NavLink to="/produtos" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><FiPackage className="nav-icon" /><span>Produtos</span></NavLink>
        <NavLink to="/servicos" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><FiTool className="nav-icon" /><span>Serviços</span></NavLink>
        <NavLink to="/fornecedores" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><FiTruck className="nav-icon" /><span>Fornecedores</span></NavLink>
      </div>
      <div className="nav-group">
        <div className="nav-heading">Administração</div>
        <NavLink to="/compras" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><FiShoppingCart className="nav-icon" /><span>Compras</span></NavLink>
        <NavLink to="/usuarios" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><FiUser className="nav-icon" /><span>Usuários</span></NavLink>
        <NavLink to="/configuracoes" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><FiSettings className="nav-icon" /><span>Configurações</span></NavLink>
        <NavLink to="/backup" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><FiDatabase className="nav-icon" /><span>Backup</span></NavLink>
      </div>
      <div className="nav-group">
        <div className="nav-heading">Relatórios</div>
        <NavLink to="/relatorios" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><FiBarChart2 className="nav-icon" /><span>Relatórios</span></NavLink>
      </div>
    </aside>
  );
}
