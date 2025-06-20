const pemasukanRef = firebase.firestore().collection("pemasukan");
const pemasukanList = document.getElementById("pemasukanList");
const totalPemasukanEl = document.getElementById("totalPemasukan");

document.getElementById("pemasukanForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const deskripsi = document.getElementById("deskripsi").value;
  const jumlah = parseInt(document.getElementById("jumlah").value);
  const user = firebase.auth().currentUser;
  if (!user) return alert("User tidak ditemukan");

  const tanggal = new Date();
  const tanggalStr = tanggal.toLocaleDateString("id-ID");

  await pemasukanRef.add({
    deskripsi, jumlah, tanggal: tanggalStr,
    uploader: user.email, timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  e.target.reset();
  loadPemasukan();
});

async function loadPemasukan() {
  pemasukanList.innerHTML = "";
  let total = 0;
  const snapshot = await pemasukanRef.orderBy("timestamp", "desc").get();
  snapshot.forEach(doc => {
    const data = doc.data();
    total += data.jumlah;
    pemasukanList.innerHTML += `
      <tr>
        <td>${data.tanggal}</td>
        <td>${data.deskripsi}</td>
        <td>Rp${data.jumlah.toLocaleString("id-ID")}</td>
        <td>${data.uploader}</td>
        <td><button class="btn btn-danger btn-sm" onclick="hapusPemasukan('${doc.id}')">Hapus</button></td>
      </tr>`;
  });
  totalPemasukanEl.textContent = "Rp" + total.toLocaleString("id-ID");
}

async function hapusPemasukan(id) {
  if (!confirm("Hapus pemasukan ini?")) return;
  await pemasukanRef.doc(id).delete();
  loadPemasukan();
}

firebase.auth().onAuthStateChanged(user => {
  if (user) loadPemasukan();
});
