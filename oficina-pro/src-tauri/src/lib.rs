// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::error::Error;
use tauri::Manager; // for app.path()
use uuid::Uuid;
use chrono::Datelike; // bring month0() into scope

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// ====== DB helpers ======
fn db_path(app: &tauri::AppHandle) -> Result<PathBuf, Box<dyn Error>> {
    let mut dir = app
        .path()
        .app_data_dir()?;
    fs::create_dir_all(&dir)?;
    dir.push("oficina.db");
    Ok(dir)
}

fn with_conn<F, T>(app: &tauri::AppHandle, f: F) -> Result<T, Box<dyn Error>>
where
    F: FnOnce(&rusqlite::Connection) -> rusqlite::Result<T>,
{
    let path = db_path(app)?;
    let conn = rusqlite::Connection::open(path)?;
    // Ensure FKs
    conn.execute("PRAGMA foreign_keys = ON;", [])?;
    Ok(f(&conn)?)
}

fn init_db(app: &tauri::AppHandle) -> Result<(), Box<dyn Error>> {
    with_conn(app, |conn| {
        conn.execute_batch(
            r#"
            CREATE TABLE IF NOT EXISTS clients (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              phone TEXT,
              email TEXT,
              address TEXT,
              cpf_cnpj TEXT,
              created_at TEXT DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS vehicles (
              id TEXT PRIMARY KEY,
              client_id TEXT NOT NULL,
              brand TEXT,
              model TEXT,
              year INTEGER,
              plate TEXT,
              vin TEXT,
              color TEXT,
              mileage INTEGER,
              FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE
            );
            CREATE INDEX IF NOT EXISTS idx_vehicles_client ON vehicles(client_id);
            CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate);

            CREATE TABLE IF NOT EXISTS products (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              description TEXT,
              sku TEXT,
              cost_price REAL DEFAULT 0,
              sale_price REAL DEFAULT 0,
              stock_qty INTEGER DEFAULT 0,
              min_stock INTEGER DEFAULT 0
            );
            CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
            CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

            CREATE TABLE IF NOT EXISTS services (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              description TEXT,
              estimated_time_minutes INTEGER DEFAULT 0,
              price REAL DEFAULT 0,
              category TEXT
            );
            CREATE INDEX IF NOT EXISTS idx_services_name ON services(name);

            CREATE TABLE IF NOT EXISTS orders (
              id TEXT PRIMARY KEY,
              client_id TEXT NOT NULL,
              vehicle_id TEXT NOT NULL,
              status TEXT NOT NULL,
              created_at TEXT DEFAULT (datetime('now')),
              closed_at TEXT,
              notes TEXT,
              FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE RESTRICT,
              FOREIGN KEY(vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT
            );
            CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
            CREATE INDEX IF NOT EXISTS idx_orders_client ON orders(client_id);

            CREATE TABLE IF NOT EXISTS order_service_items (
              id TEXT PRIMARY KEY,
              order_id TEXT NOT NULL,
              service_id TEXT NOT NULL,
              quantity INTEGER NOT NULL DEFAULT 1,
              unit_price REAL NOT NULL DEFAULT 0,
              total REAL NOT NULL DEFAULT 0,
              FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
              FOREIGN KEY(service_id) REFERENCES services(id) ON DELETE RESTRICT
            );
            CREATE INDEX IF NOT EXISTS idx_order_service_order ON order_service_items(order_id);

            CREATE TABLE IF NOT EXISTS order_product_items (
              id TEXT PRIMARY KEY,
              order_id TEXT NOT NULL,
              product_id TEXT NOT NULL,
              quantity INTEGER NOT NULL DEFAULT 1,
              unit_price REAL NOT NULL DEFAULT 0,
              total REAL NOT NULL DEFAULT 0,
              FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
              FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE RESTRICT
            );
            CREATE INDEX IF NOT EXISTS idx_order_product_order ON order_product_items(order_id);
            "#,
        )
    })
}

// ====== Clients API ======
#[derive(Serialize, Deserialize)]
struct Client {
    id: String,
    name: String,
    phone: Option<String>,
    email: Option<String>,
    address: Option<String>,
    cpf_cnpj: Option<String>,
    created_at: Option<String>,
}

#[derive(Deserialize)]
struct ClientInput {
    name: String,
    phone: Option<String>,
    email: Option<String>,
    address: Option<String>,
    cpf_cnpj: Option<String>,
}

#[tauri::command]
fn clients_list(app: tauri::AppHandle, q: Option<String>, limit: Option<u32>, offset: Option<u32>) -> Result<Vec<Client>, String> {
    with_conn(&app, |conn| {
        let mut sql = "SELECT id,name,phone,email,address,cpf_cnpj,created_at FROM clients".to_string();
        if let Some(query) = q.as_ref().filter(|s| !s.is_empty()) {
            sql.push_str(" WHERE name LIKE ?1 OR phone LIKE ?2 OR email LIKE ?3 OR cpf_cnpj LIKE ?4");
            sql.push_str(" ORDER BY created_at DESC");
            if let Some(l) = limit { sql.push_str(&format!(" LIMIT {}", l)); }
            if let Some(o) = offset { sql.push_str(&format!(" OFFSET {}", o)); }
            let pat = format!("%{}%", query);
            let mut stmt = conn.prepare(&sql)?;
            let rows = stmt.query_map(rusqlite::params![pat, pat, pat, pat], |row| {
                Ok(Client {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    phone: row.get(2).ok(),
                    email: row.get(3).ok(),
                    address: row.get(4).ok(),
                    cpf_cnpj: row.get(5).ok(),
                    created_at: row.get(6).ok(),
                })
            })?;
            let mut out = Vec::new();
            for r in rows { out.push(r?); }
            Ok(out)
        } else {
            sql.push_str(" ORDER BY created_at DESC");
            if let Some(l) = limit { sql.push_str(&format!(" LIMIT {}", l)); }
            if let Some(o) = offset { sql.push_str(&format!(" OFFSET {}", o)); }
            let mut stmt = conn.prepare(&sql)?;
            let rows = stmt.query_map([], |row| {
                Ok(Client {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    phone: row.get(2).ok(),
                    email: row.get(3).ok(),
                    address: row.get(4).ok(),
                    cpf_cnpj: row.get(5).ok(),
                    created_at: row.get(6).ok(),
                })
            })?;
            let mut out = Vec::new();
            for r in rows { out.push(r?); }
            Ok(out)
        }
    })
    .map_err(|e| e.to_string())
}

#[tauri::command]
fn clients_create(app: tauri::AppHandle, data: ClientInput) -> Result<Client, String> {
    let id = Uuid::new_v4().to_string();
    with_conn(&app, |conn| {
        conn.execute(
            "INSERT INTO clients (id,name,phone,email,address,cpf_cnpj) VALUES (?,?,?,?,?,?)",
            rusqlite::params![id, data.name, data.phone, data.email, data.address, data.cpf_cnpj],
        )?;
        Ok(())
    })
    .map_err(|e| e.to_string())?;
    clients_get(app, id)
}

#[tauri::command]
fn clients_get(app: tauri::AppHandle, id: String) -> Result<Client, String> {
    with_conn(&app, |conn| {
        let mut stmt = conn.prepare("SELECT id,name,phone,email,address,cpf_cnpj,created_at FROM clients WHERE id=?1")?;
        let c = stmt.query_row([id], |row| {
            Ok(Client {
                id: row.get(0)?,
                name: row.get(1)?,
                phone: row.get(2).ok(),
                email: row.get(3).ok(),
                address: row.get(4).ok(),
                cpf_cnpj: row.get(5).ok(),
                created_at: row.get(6).ok(),
            })
        })?;
        Ok(c)
    })
    .map_err(|e| e.to_string())
}

#[tauri::command]
fn clients_update(app: tauri::AppHandle, id: String, data: ClientInput) -> Result<Client, String> {
    with_conn(&app, |conn| {
        conn.execute(
            "UPDATE clients SET name=?, phone=?, email=?, address=?, cpf_cnpj=? WHERE id=?",
            rusqlite::params![data.name, data.phone, data.email, data.address, data.cpf_cnpj, id],
        )?;
        Ok(())
    })
    .map_err(|e| e.to_string())?;
    clients_get(app, id)
}

#[tauri::command]
fn clients_delete(app: tauri::AppHandle, id: String) -> Result<(), String> {
    with_conn(&app, |conn| {
        conn.execute("DELETE FROM clients WHERE id=?1", [id])?;
        Ok(())
    })
    .map_err(|e| e.to_string())
}

// ====== Dashboard summary API ======
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ChartOut {
    labels: Vec<String>,
    values: Vec<i64>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct MetricsOut {
    os_abertas: i64,
    os_concluidas: i64,
    faturamento: f64,
    ticket_medio: f64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct DashboardOut {
    metrics: MetricsOut,
    os_por_mes: ChartOut,
    status: ChartOut,
    origem_clientes: ChartOut,
    top_servicos: Vec<String>,
}

#[tauri::command]
fn dashboard_summary(app: tauri::AppHandle) -> Result<DashboardOut, String> {
    with_conn(&app, |conn| {
        // OS abertas (aberta / em_andamento / aguardando_pecas)
        let os_abertas: i64 = conn.query_row(
            "SELECT COUNT(*) FROM orders WHERE status IN ('aberta','em_andamento','aguardando_pecas')",
            [],
            |row| row.get(0),
        ).unwrap_or(0);

        // OS concluidas
        let os_concluidas: i64 = conn.query_row(
            "SELECT COUNT(*) FROM orders WHERE status = 'concluida'",
            [],
            |row| row.get(0),
        ).unwrap_or(0);

        // Faturamento: soma dos itens de servico + produtos
        let serv_total: f64 = conn.query_row(
            "SELECT IFNULL(SUM(total),0) FROM order_service_items",
            [],
            |row| row.get(0),
        ).unwrap_or(0.0);
        let prod_total: f64 = conn.query_row(
            "SELECT IFNULL(SUM(total),0) FROM order_product_items",
            [],
            |row| row.get(0),
        ).unwrap_or(0.0);
        let faturamento = serv_total + prod_total;

        // Ticket médio (evitar divisao por zero)
        let total_os: i64 = conn.query_row(
            "SELECT COUNT(*) FROM orders",
            [],
            |row| row.get(0),
        ).unwrap_or(0);
        let ticket_medio = if total_os > 0 { faturamento / (total_os as f64) } else { 0.0 };

        // OS por mes (ultimos 6 meses)
        let mut stmt = conn.prepare(
            "SELECT strftime('%m', created_at) AS m, COUNT(*)
             FROM orders
             WHERE date(created_at) >= date('now','-5 months')
             GROUP BY m
             ORDER BY m"
        )?;
        let mut month_counts: Vec<(String, i64)> = Vec::new();
        let rows = stmt.query_map([], |row| {
            let m: String = row.get(0)?;
            let c: i64 = row.get(1)?;
            Ok((m, c))
        })?;
        for r in rows { month_counts.push(r?); }
        let all_months = vec!["01","02","03","04","05","06","07","08","09","10","11","12"]; // labels fixos
        let pt_labels = vec!["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]; // nomes
        let mut labels = Vec::new();
        let mut values = Vec::new();
        // Pega os ultimos 6 meses baseados em mes atual
        let now = chrono::Local::now();
        for i in (0..6).rev() {
            let dt = now - chrono::Duration::days(30 * i as i64);
            let m_idx = (dt.month0()) as usize; // 0..11
            let mon_num = format!("{:02}", m_idx + 1);
            labels.push(pt_labels[m_idx].to_string());
            let v = month_counts.iter().find(|(mm, _)| *mm == mon_num).map(|(_, c)| *c).unwrap_or(0);
            values.push(v);
        }
        let os_por_mes = ChartOut { labels, values };

        // Status breakdown
        let mut stmt = conn.prepare(
            "SELECT status, COUNT(*) FROM orders GROUP BY status ORDER BY status"
        )?;
        let mut st_labels: Vec<String> = Vec::new();
        let mut st_values: Vec<i64> = Vec::new();
        let rows = stmt.query_map([], |row| {
            let s: String = row.get(0)?;
            let c: i64 = row.get(1)?;
            Ok((s, c))
        })?;
        for r in rows {
            let (s, c) = r?;
            st_labels.push(s);
            st_values.push(c);
        }
        let status = ChartOut { labels: st_labels, values: st_values };

        // Origem dos clientes (stub - sem coluna dedicada)
        let origem_clientes = ChartOut {
            labels: vec!["Indicação".into(), "Google".into(), "Redes Sociais".into(), "Passantes".into(), "Outros".into()],
            values: vec![38, 24, 18, 12, 8],
        };

        // Top serviços por quantidade executada
        let mut stmt = conn.prepare(
            "SELECT s.name, SUM(osi.quantity) AS qty
             FROM order_service_items osi
             JOIN services s ON s.id = osi.service_id
             GROUP BY osi.service_id
             ORDER BY qty DESC
             LIMIT 6"
        )?;
        let mut top_servicos: Vec<String> = Vec::new();
        let rows = stmt.query_map([], |row| {
            let name: String = row.get(0)?;
            Ok(name)
        })?;
        for r in rows { top_servicos.push(r?); }
        if top_servicos.is_empty() {
            top_servicos = vec![
                "Troca de óleo".into(),
                "Revisão".into(),
                "Alinhamento/balanceamento".into(),
                "Freios".into(),
                "Suspensão".into(),
                "Elétrica".into(),
            ];
        }

        Ok(DashboardOut {
            metrics: MetricsOut { os_abertas, os_concluidas, faturamento, ticket_medio },
            os_por_mes,
            status,
            origem_clientes,
            top_servicos,
        })
    })
    .map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            init_db(&app.handle())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            clients_list,
            clients_create,
            clients_get,
            clients_update,
            clients_delete,
            dashboard_summary
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
