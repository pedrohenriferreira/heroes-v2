import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_KEY = "11f01a579d44c5255bc4fe1ec0fc3792";
const BASE_URL = `https://superheroapi.com/api.php/${API_KEY}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const path = req.url?.replace(/^\/api\/superhero/, '') || '';
    const response = await fetch(`${BASE_URL}${path}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
