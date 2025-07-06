async function hashMoment() {
  const input = document.getElementById('momentInput').value.trim();
  if (!input) return alert("Enter something to hash!");
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashHex = [...new Uint8Array(hashBuffer)]
    .map(b => b.toString(16).padStart(2, '0')).join('');
  document.getElementById('hashOutput').textContent = hashHex;
  return { text: input, hash: hashHex, date: new Date().toISOString() };
}

function saveMoment() {
  hashMoment().then(entry => {
    let moments = JSON.parse(localStorage.getItem("moments") || "[]");
    moments.push(entry);
    localStorage.setItem("moments", JSON.stringify(moments));
    listMoments();
  });
}

function exportMoments() {
  const moments = localStorage.getItem("moments");
  if (!moments) return alert("No saved moments.");
  const blob = new Blob([moments], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "moments.json";
  a.click();
  URL.revokeObjectURL(url);
}

function listMoments() {
  const list = document.getElementById("savedList");
  const moments = JSON.parse(localStorage.getItem("moments") || "[]");
  list.innerHTML = "";
  for (const m of moments.reverse()) {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${m.date}</strong><br>${m.hash}`;
    list.appendChild(li);
  }
}

listMoments();
