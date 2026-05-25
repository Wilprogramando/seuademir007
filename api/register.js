const { Redis } = require("@upstash/redis");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});
const SECRET = process.env.JWT_SECRET || "troque-este-segredo-por-um-valor-longo-e-aleatorio";

function emptyState() {
  return {
    profile: { name: "" },
    etapas: [false, false, false, false, false, false],
    days: {}, goals: {}, reviews: {}, plano: {}, mov: {},
    finance: { entra: "", sai: "", deve: "", guardado: "", fuga: "", ajuste: "", gastos: [], reserva: { meta: "", semanal: "", atual: "" } },
    commitment: { name: "", date: "", signed: false },
  };
}
function validCreds(username, password) {
  if (typeof username !== "string" || typeof password !== "string") return "Dados inválidos.";
  username = username.trim();
  if (username.length < 3 || username.length > 30) return "O usuário deve ter de 3 a 30 caracteres.";
  if (!/^[a-zA-Z0-9._-]+$/.test(username)) return "Use apenas letras, números, ponto, hífen ou underline no usuário.";
  if (password.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
  return null;
}
function makeToken(username) { return jwt.sign({ username }, SECRET, { expiresIn: "30d" }); }
function authUser(req) {
  const h = req.headers.authorization || "";
  const t = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!t) return null;
  try { return jwt.verify(t, SECRET).username; } catch (e) { return null; }
}
function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
}

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });
  try {
    let { username, password } = req.body || {};
    const err = validCreds(username, password);
    if (err) return res.status(400).json({ error: err });
    username = username.trim().toLowerCase();
    const existing = await redis.get("user:" + username);
    if (existing) return res.status(409).json({ error: "Esse usuário já existe. Tente outro ou faça login." });
    const hash = bcrypt.hashSync(password, 10);
    await redis.set("user:" + username, { hash, created: new Date().toISOString() });
    await redis.set("data:" + username, emptyState());
    return res.status(200).json({ token: makeToken(username), username });
  } catch (e) { console.error(e); return res.status(500).json({ error: "Erro no servidor." }); }
};
