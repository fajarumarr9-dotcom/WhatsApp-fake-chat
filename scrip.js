let namaPengguna = "";
let sambunganWebSocket;
const alamatServer = "wss://echo.websocket.events";

const layarNama = document.getElementById("layar-nama");
const aplikasi = document.getElementById("aplikasi");
const inputNama = document.getElementById("input-nama");
const tombolMasuk = document.getElementById("tombol-masuk");
const statusTeks = document.getElementById("status");
const isiObrolan = document.getElementById("isi-obrolan");
const formKirim = document.getElementById("form-kirim");
const pesanKirim = document.getElementById("pesan-kirim");

tombolMasuk.addEventListener("click", function() {
    namaPengguna = inputNama.value.trim();
    if (namaPengguna === "") {
        alert("Tolong tulis nama dulu ya!");
        return;
    }
    layarNama.style.display = "none";
    aplikasi.style.display = "flex";
    sambungkanKeServer();
});

inputNama.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        tombolMasuk.click();
    }
});

function sambungkanKeServer() {
    statusTeks.innerText = "Menghubungkan...";
    sambunganWebSocket = new WebSocket(alamatServer);

    sambunganWebSocket.onopen = function() {
        statusTeks.innerText = "Terhubung";
        tambahPesanSistem("Kamu sudah masuk ke ruang obrolan!");
    };

    sambunganWebSocket.onclose = function() {
        statusTeks.innerText = "Terputus";
        tambahPesanSistem("Koneksi terputus, coba muat ulang halaman.");
    };

    sambunganWebSocket.onmessage = function(peristiwa) {
        try {
            const data = JSON.parse(peristiwa.data);
            if (data.nama !== namaPengguna) {
                tambahPesanMasuk(data.nama, data.isi, data.waktu);
            }
        } catch (err) {
            console.log("Pesan sistem:", peristiwa.data);
        }
    };
}

formKirim.addEventListener("submit", function(e) {
    e.preventDefault();
    const teksPesan = pesanKirim.value.trim();
    if (!teksPesan || !sambunganWebSocket || sambunganWebSocket.readyState !== WebSocket.OPEN) return;

    const waktuSekarang = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const dataPesan = {
        nama: namaPengguna,
        isi: teksPesan,
        waktu: waktuSekarang
    };

    sambunganWebSocket.send(JSON.stringify(dataPesan));
    tambahPesanKeluar(teksPesan, waktuSekarang);
    pesanKirim.value = "";
});

function tambahPesanKeluar(isi, waktu) {
    const elemen = document.createElement("div");
    elemen.className = "pesan keluar";
    elemen.innerHTML = `
        <div class="teks-pesan">${isi}</div>
        <div class="waktu-pesan">${waktu}</div>
    `;
    isiObrolan.appendChild(elemen);
    isiObrolan.scrollTop = isiObrolan.scrollHeight;
}

function tambahPesanMasuk(nama, isi, waktu) {
    const elemen = document.createElement("div");
    elemen.className = "pesan masuk";
    elemen.innerHTML = `
        <div class="nama-pengirim">${nama}</div>
        <div class="teks-pesan">${isi}</div>
        <div class="waktu-pesan">${waktu}</div>
    `;
    isiObrolan.appendChild(elemen);
    isiObrolan.scrollTop = isiObrolan.scrollHeight;
}

function tambahPesanSistem(isi) {
    const elemen = document.createElement("div");
    elemen.style.textAlign = "center";
    elemen.style.margin = "8px 0";
    elemen.style.fontSize = "12px";
    elemen.style.color = "#667781";
    elemen.innerText = isi;
    isiObrolan.appendChild(elemen);
    isiObrolan.scrollTop = isiObrolan.scrollHeight;
}
