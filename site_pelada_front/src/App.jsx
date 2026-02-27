import { useEffect, useMemo, useState } from "react";

import logoEsq from "./assets/logo-esq.png";
import logoDir from "./assets/logo-dir.png";

const API_BASE = "https://pelada-abestalhados.onrender.com/api/v1";

const columns = [
  { key: "nome", label: "Nome" },
  { key: "gols", label: "Gols", numeric: true },
  { key: "partidas_jogadas", label: "Jogos", numeric: true },
  { key: "partidas_vencidas", label: "Vitórias", numeric: true },
  { key: "pct_vitorias", label: "% Vitórias", numeric: true },
];

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");
  const [orderBy, setOrderBy] = useState("gols");
  const [orderDir, setOrderDir] = useState("desc");

  const url = useMemo(() => {
    const params = new URLSearchParams();
    params.set("order_by", orderBy);
    params.set("order_dir", orderDir);
    if (q.trim()) params.set("q", q.trim());
    return `${API_BASE}/ranking?${params.toString()}`;
  }, [orderBy, orderDir, q]);

  async function fetchRanking() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRanking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  function onClickHeader(key) {
    if (orderBy === key) {
      setOrderDir(orderDir === "desc" ? "asc" : "desc");
    } else {
      setOrderBy(key);
      setOrderDir(key === "nome" ? "asc" : "desc");
    }
  }

  const orderLabel = columns.find((c) => c.key === orderBy)?.label || orderBy;

  return (
    <div style={pageStyle}>
      <div style={centerWrapStyle}>
        <div style={headerStyle}>
          <img
            src={logoEsq}
            alt="Logo esquerda"
            style={{ height: 135, width: "auto" }}
          />
          <h1 style={titleStyle}>PELADA DOS ABESTALHADOS</h1>
          <img
            src={logoDir}
            alt="Logo direita"
            style={{ height: 200, width: "auto" }}
          />
        </div>

        <div style={searchRowStyle}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar jogador..."
            style={inputStyle}
          />
          <button onClick={fetchRanking} style={buttonStyle}>
            Atualizar
          </button>
        </div>

        {err && <div style={errorStyle}>Erro: {err}</div>}

        {/* ===== TABELA (com scroll horizontal no mobile) ===== */}
        <div style={tableWrapStyle}>
          <div style={tableScrollStyle}>
            <table style={tableStyle} cellPadding="0" cellSpacing="0">
              <thead style={{ background: "#fafafa" }}>
                <tr>
                  <th style={thStyle}>#</th>
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      style={{
                        ...thStyle,
                        cursor: "pointer",
                        textAlign: c.numeric ? "right" : "left",
                      }}
                      onClick={() => onClickHeader(c.key)}
                      title="Clique para ordenar"
                    >
                      {c.label}{" "}
                      {orderBy === c.key ? (
                        <span style={{ fontSize: 12 }}>
                          {orderDir === "desc" ? "▼" : "▲"}
                        </span>
                      ) : null}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td style={tdStyle} colSpan={columns.length + 1}>
                      Carregando...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td style={tdStyle} colSpan={columns.length + 1}>
                      Sem dados.
                    </td>
                  </tr>
                ) : (
                  rows.map((r, i) => (
                    <tr key={r.id} style={{ borderTop: "1px solid #eee" }}>
                      <td style={{ ...tdStyle, color: "#666" }}>{i + 1}</td>
                      <td style={tdStyle}>{r.nome}</td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>{r.gols}</td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        {r.partidas_jogadas}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        {r.partidas_vencidas}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        {Number(r.pct_vitorias).toFixed(2)}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={footerInfoStyle}>
          Ordenando por <b>{orderLabel}</b> (
          {orderDir === "desc" ? "decrescente" : "crescente"})
        </div>
      </div>
    </div>
  );
}

/* ===== Styles ===== */

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 16,
  fontFamily: "system-ui",
  background: "#fff",
};

const centerWrapStyle = {
  width: "100%",
  maxWidth: 900,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const headerStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 18,
  marginBottom: 16,
  flexWrap: "wrap", // ajuda no mobile
};

const titleStyle = {
  textAlign: "center",
  margin: 0,
  fontSize: 44,
  lineHeight: 1.1,
};

const searchRowStyle = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 12,
  marginBottom: 14,
  flexWrap: "wrap", // ajuda no mobile
};

const inputStyle = {
  width: 520,
  maxWidth: "100%",
  padding: 10,
  borderRadius: 10,
  border: "1px solid #ddd",
};

const buttonStyle = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
};

/* wrapper do card */
const tableWrapStyle = {
  width: "100%",
  maxWidth: 700,
  border: "1px solid #eee",
  borderRadius: 12,
  background: "#fff",
};

/* scroll horizontal no mobile */
const tableScrollStyle = {
  width: "100%",
  overflowX: "auto",
  overflowY: "hidden",
  WebkitOverflowScrolling: "touch",
  scrollbarWidth: "thin",
};

/* tabela maior que a tela -> dá pra arrastar */
const tableStyle = {
  width: "100%",
  minWidth: 720, // bem menor agora
  borderCollapse: "collapse",
};

const thStyle = {
  padding: "12px 12px",
  fontWeight: 700,
  fontSize: 14,
  borderBottom: "1px solid #eee",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "12px 12px",
  fontSize: 14,
  whiteSpace: "nowrap",
};

const footerInfoStyle = {
  marginTop: 10,
  color: "#666",
  fontSize: 13,
  textAlign: "center",
};

const errorStyle = {
  padding: 12,
  border: "1px solid #f5c2c7",
  background: "#f8d7da",
  borderRadius: 10,
  marginBottom: 12,
};
