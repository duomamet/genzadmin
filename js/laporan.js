const dbLaporan = firebase.firestore();
const pemasukanRefLaporan = dbLaporan.collection("pemasukan");
const pengeluaranRefLaporan = dbLaporan.collection("pengeluaran");
const saldoAkhirEl = document.getElementById("saldoAkhir");

async function loadLaporan() {
  let totalPemasukan = 0;
  let totalPengeluaran = 0;

  const pemasukanSnapshot = await pemasukanRefLaporan.get();
  pemasukanSnapshot.forEach(doc => totalPemasukan += doc.data().jumlah);

  const pengeluaranSnapshot = await pengeluaranRefLaporan.get();
  pengeluaranSnapshot.forEach(doc => totalPengeluaran += doc.data().jumlah);

  const saldo = totalPemasukan - totalPengeluaran;
  saldoAkhirEl.textContent = "Rp" + saldo.toLocaleString("id-ID");

  const ctx = document.getElementById("chartLaporan").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Pemasukan", "Pengeluaran"],
      datasets: [{
        label: "Jumlah",
        data: [totalPemasukan, totalPengeluaran],
        backgroundColor: ["#28a745", "#dc3545"]
      }]
    }
  });
}

firebase.auth().onAuthStateChanged(user => {
  if (user) loadLaporan();
});
