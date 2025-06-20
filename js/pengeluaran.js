const db = firebase.firestore();
const storage = firebase.storage();
const pengeluaranRef = db.collection("pengeluaran");
const pengeluaranList = document.getElementById("pengeluaranList");
const totalPengeluaranEl = document.getElementById("totalPengeluaran");

document.getElementById("pengeluaranForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const deskripsi = document.getElementById("deskripsi").value;
  const jumlah = parseInt(document.getElementById("jumlah").value);
  const bukti = document.getElementById("bukti").files[0];

  const user = firebase.auth().currentUser;
  if (!user) return alert("User tidak ditemukan");

  const tanggal = new Date();
  const tanggalStr = tanggal.toLocaleDateString("id-ID");

  const buktiRef = storage.ref("pengeluaran/" + Date.now() + "_" + bukti.name);
  await buktiRef.put(bukti);
  const buktiUrl = await buktiRef.getDownloadURL();

  await pengeluaranRef.add({
    deskripsi, jumlah, tanggal: tanggalStr,
    uploader: user.email, buktiUrl, timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  e.target.reset();
  loadPengeluaran();
});

async function loadPengeluaran() {
  pengeluaranList.innerHTML = "";
  let total = 0;
  const snapshot = await pengeluaranRef.orderBy("timestamp", "desc").get();
  snapshot.forEach(doc => {
    const data = doc.data();
    total += data.jumlah;

    pengeluaranList.innerHTML += `
      <tr>
        <td>${data.tanggal}</td>
        <td>${data.deskripsi}</td>
        <td>Rp${data.jumlah.toLocaleString("id-ID")}</td>
        <td>${data.uploader}</td>
        <td><a href="${data.buktiUrl}" target="_blank">Lihat</a></td>
        <td><button class="btn btn-danger btn-sm" onclick="hapusPengeluaran('${doc.id}', '${data.buktiUrl}')">Hapus</button></td>
      </tr>`;
  });
  totalPengeluaranEl.textContent = "Rp" + total.toLocaleString("id-ID");
}

async function hapusPengeluaran(id, url) {
  if (!confirm("Hapus pengeluaran ini?")) return;
  await pengeluaranRef.doc(id).delete();
  await storage.refFromURL(url).delete();
  loadPengeluaran();
}

firebase.auth().onAuthStateChanged(user => {
  if (user) loadPengeluaran();
});
