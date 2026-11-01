export default {
  async fetch(request, env) {
    // 统一 CORS 头
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // 生产环境建议换成你的 github.io 域名
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 处理预检请求
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // 示例：GET /api/users
    if (url.pathname === "/api/users" && request.method === "GET") {
      try {
        const { results } = await env.DB.prepare(
          "SELECT id, name FROM users LIMIT 20"
        ).run(); // D1 Worker Binding API [citation:1][citation:8]

        return new Response(JSON.stringify(results), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    // 示例：POST /api/users
    if (url.pathname === "/api/users" && request.method === "POST") {
      try {
        const { name } = await request.json();
        if (!name) {
          return new Response(JSON.stringify({ error: "name 必填" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        const result = await env.DB.prepare(
          "INSERT INTO users (name) VALUES (?)"
        ).bind(name).run();

        return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
};
