// 替换成你部署后的 Worker URL
const API_BASE = "https://my-site-api.你的子域.workers.dev";

async function loadUsers() {
  const res = await fetch(`${API_BASE}/api/users`);
  const users = await res.json();
  document.getElementById("result").textContent = JSON.stringify(users, null, 2);
}

async function addUser(name) {
  const res = await fetch(`${API_BASE}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
}
