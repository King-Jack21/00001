import fetch from "node-fetch";
import FormData from "form-data";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const formData = new FormData();

    // ambil data binary file
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // tmpfiles.org auto-deteksi tipe file
    formData.append("file", buffer, "upload.bin");

    const uploadRes = await fetch("https://tmpfiles.org/api/v1/upload", {
      method: "POST",
      body: formData
    });

    const data = await uploadRes.json();
    res.status(200).json({ url: data.data.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
      }
