import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./app/Layout";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Veiculos from "./pages/Veiculos";
import Ordens from "./pages/Ordens";
import Produtos from "./pages/Produtos";
import Servicos from "./pages/Servicos";
import Fornecedores from "./pages/Fornecedores";
import Estoque from "./pages/Estoque";
import Compras from "./pages/Compras";
import Financeiro from "./pages/Financeiro";
import Agenda from "./pages/Agenda";
import Relatorios from "./pages/Relatorios";
import Usuarios from "./pages/Usuarios";
import Configuracoes from "./pages/Configuracoes";
import Backup from "./pages/Backup";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="veiculos" element={<Veiculos />} />
        <Route path="ordens" element={<Ordens />} />
        <Route path="produtos" element={<Produtos />} />
        <Route path="servicos" element={<Servicos />} />
        <Route path="fornecedores" element={<Fornecedores />} />
        <Route path="estoque" element={<Estoque />} />
        <Route path="compras" element={<Compras />} />
        <Route path="financeiro" element={<Financeiro />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="configuracoes" element={<Configuracoes />} />
        <Route path="backup" element={<Backup />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
