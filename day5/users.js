const API_URL = "https://jsonplaceholder.typicode.com/users";

const loadBtn = document.querySelector("#load-users");
const statusText = document.querySelector("#status");
const list = document.querySelector("#users-list");
const filterInput = document.querySelector("#filter-input");

let users = [];

function renderUsers(arr) {
  list.innerHTML = "";
  if (arr.length === 0) {
    list.textContent = "No users match your filter.";
    return;
  }
  arr.forEach(user => {
    const li = document.createElement("li");
    li.textContent = `${user.name} — ${user.email} — ${user.address.city} — ${user.company.name}`;
    list.appendChild(li);
  });
}

async function loadUsers() {
  statusText.textContent = "Loading users...";
  loadBtn.disabled = true;
  list.innerHTML = "";

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    users = await response.json();
    renderUsers(users);
    statusText.textContent = `Loaded ${users.length} users.`;
  } catch (error) {
    statusText.textContent = "Could not load users. Please try again.";
    console.error(error);
  } finally {
    loadBtn.disabled = false;
  }
}

loadBtn.addEventListener("click", loadUsers);

filterInput.addEventListener("input", () => {
  const term = filterInput.value.toLowerCase();
  const filtered = users.filter(u => u.name.toLowerCase().includes(term));
  renderUsers(filtered);
});