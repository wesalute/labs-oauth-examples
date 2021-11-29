// Healthcheck endpoint (/api/healthz)
export default function handler(req, res) {
  res.status(200).json({ "status": "ok" })
}
