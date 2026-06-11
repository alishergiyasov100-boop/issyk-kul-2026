// Cloudflare Worker для альбома Иссык-Куль 2026.
// Привязка R2: BUCKET. Переменная: SECRET.

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const path = url.pathname;
    const cors = {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, POST, DELETE, OPTIONS",
      "access-control-allow-headers": "Content-Type, X-Auth",
    };

    if (req.method === "OPTIONS") return new Response(null, { headers: cors });

    // GET /media/* — публично (картинку нужно отдавать тегам <img>)
    const isPublicGet = req.method === "GET" && path.startsWith("/media/");
    if (!isPublicGet) {
      if (req.headers.get("X-Auth") !== env.SECRET) {
        return new Response("unauthorized", { status: 401, headers: cors });
      }
    }

    if (req.method === "GET" && path === "/api/state") {
      const obj = await env.BUCKET.get("_state.json");
      if (!obj) {
        return new Response(JSON.stringify({ cats: [] }), {
          headers: { ...cors, "content-type": "application/json" },
        });
      }
      return new Response(obj.body, {
        headers: { ...cors, "content-type": "application/json" },
      });
    }

    if (req.method === "POST" && path === "/api/state") {
      const body = await req.text();
      await env.BUCKET.put("_state.json", body, {
        httpMetadata: { contentType: "application/json" },
      });
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...cors, "content-type": "application/json" },
      });
    }

    if (req.method === "POST" && path === "/api/upload") {
      const fd = await req.formData();
      const file = fd.get("file");
      if (!file || typeof file === "string") {
        return new Response("no file", { status: 400, headers: cors });
      }
      const name = file.name || "blob";
      const ext = (name.split(".").pop() || "bin").toLowerCase();
      const key = `media/${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${ext}`;
      await env.BUCKET.put(key, file.stream(), {
        httpMetadata: { contentType: file.type || "application/octet-stream" },
      });
      return new Response(
        JSON.stringify({ key, type: file.type, size: file.size }),
        { headers: { ...cors, "content-type": "application/json" } },
      );
    }

    if (req.method === "GET" && path.startsWith("/media/")) {
      const key = path.slice(1);
      const obj = await env.BUCKET.get(key);
      if (!obj) return new Response("not found", { status: 404, headers: cors });
      const headers = new Headers(cors);
      obj.writeHttpMetadata(headers);
      headers.set("etag", obj.httpEtag);
      headers.set("cache-control", "public, max-age=31536000, immutable");
      return new Response(obj.body, { headers });
    }

    if (req.method === "DELETE" && path.startsWith("/media/")) {
      const key = path.slice(1);
      await env.BUCKET.delete(key);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...cors, "content-type": "application/json" },
      });
    }

    return new Response("not found", { status: 404, headers: cors });
  },
};
