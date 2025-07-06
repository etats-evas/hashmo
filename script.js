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
    moments.push(entry); // {text, hash, date}
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
    li.innerHTML = `
      <strong>${m.date}</strong><br>
      <em>${m.text}</em><br>
      <code>${m.hash}</code><br>
      <button onclick="verifyMoment('${m.text}', '${m.hash}', this)">🔍 Verify</button>
      <span class="verify-status"></span>
    `;
    list.appendChild(li);
  }
}

async function verifyMoment(text, originalHash, btn) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const newHash = [...new Uint8Array(hashBuffer)].map(b => b.toString(16).padStart(2, '0')).join('');
  const status = btn.nextElementSibling;
  if (newHash === originalHash) {
    status.textContent = "✅ Valid";
    status.style.color = "green";
  } else {
    status.textContent = "❌ Tampered";
    status.style.color = "red";
  }
}

listMoments();
