let soal = []; // Variabel global untuk menyimpan semua soal
let soalSesi = []; // Variabel untuk menyimpan soal acak dalam sesi
let skor = 0;
let soalSekarang = 0;

let tantangan = [];  // Variabel untuk menyimpan tantangan
let tantanganAktif = false; // Menandakan apakah tantangan aktif

// Referensi DOM
const beranda = document.getElementById("beranda");
const sesi = document.getElementById("sesi");
const nilai = document.getElementById("nilai");
const pertanyaanEl = document.getElementById("pertanyaan");
const pilihanBtn = document.querySelectorAll(".option");
const totalSkorEl = document.getElementById("totalSkor");
const rincianBenarEl = document.getElementById("rincianBenar");
const rincianSalahEl = document.getElementById("rincianSalah");

// Fungsi untuk memuat soal dari JSON
async function muatSoal() {
    try {
        const response = await fetch('soal.json');
        soal = await response.json();
    } catch (error) {
        console.error('Gagal memuat soal:', error);
    }
}

// Fungsi untuk memilih lima soal secara acak
function pilihSoalAcak() {
    const soalCopy = [...soal]; // Salin array soal
    soalSesi = []; // Reset soal sesi
    for (let i = 0; i < 2; i++) {
        const indexAcak = Math.floor(Math.random() * soalCopy.length);
        soalSesi.push(soalCopy.splice(indexAcak, 1)[0]);
    }
}

// Mulai Kuis
document.getElementById("startQuiz").addEventListener("click", async () => {
    await muatSoal();
    await muatTantangan();  // Memuat tantangan
    pilihSoalAcak();
    beranda.style.display = "none";
    sesi.style.display = "block";
    tampilkanSoal();
});

// Tampilkan Soal
function tampilkanSoal() {
    const soalAktual = soalSesi[soalSekarang];
    pertanyaanEl.textContent = soalAktual.pertanyaan;
    pilihanBtn.forEach((btn, idx) => {
        btn.textContent = soalAktual.pilihan[idx];
        btn.onclick = () => jawab(idx); // Pastikan indeks yang dipilih benar
    });
}

// Jawab Soal
function jawab(pilihan) {
    const soalAktual = soalSesi[soalSekarang];
    
    // Log untuk debugging
    console.log(`Pilihan yang dipilih: ${pilihan}, Jawaban yang benar: ${soalAktual.jawaban}`);
    
    // Periksa jika pilihan yang dipilih benar atau salah
    if (pilihan === soalAktual.jawaban) {
        skor++; // Tambah skor jika benar
    }
    
    soalSekarang++; // Lanjutkan ke soal berikutnya
    if (soalSekarang < soalSesi.length) {
        tampilkanSoal(); // Tampilkan soal berikutnya
    } else {
        tampilkanNilai(); // Tampilkan nilai akhir
    }
}

// Tampilkan Nilai
function tampilkanNilai() {
    sesi.style.display = "none";
    nilai.style.display = "block";
    totalSkorEl.textContent = `Skor Total: ${skor}`;
    rincianBenarEl.textContent = `Benar: ${skor}`;
    rincianSalahEl.textContent = `Salah: ${soalSesi.length - skor}`;
}

// Memuat tantangan dari file JSON
async function muatTantangan() {
    try {
        const response = await fetch('tantangan.json');
        tantangan = await response.json();
    } catch (error) {
        console.error('Gagal memuat tantangan:', error);
    }
}

// Tombol Tantangan
document.getElementById("challengeBtn").addEventListener("click", () => {
    if (!tantanganAktif) {
        tantanganAktif = true;
        tampilkanTantangan();
    }
});

// Tampilkan Pop-up Tantangan
function tampilkanTantangan() {
    const popUpTantangan = document.createElement("div");
    popUpTantangan.classList.add("popUpTantangan");
    const randomTantangan = tantangan[Math.floor(Math.random() * tantangan.length)];
    popUpTantangan.innerHTML = `
        <div class="popUpContent">
            <p>${randomTantangan.tantangan}</p>
            <button id="okeBtn">OKE AKU SIAP</button>
            <button id="menyerahBtn">HMM AKU MENYERAH</button>
        </div>
    `;
    document.body.appendChild(popUpTantangan);

    // Event Listener untuk tombol "OKE AKU SIAP"
    document.getElementById("okeBtn").addEventListener("click", () => {
        popUpTantangan.innerHTML = `
            <div class="popUpContent">
                <button id="selesaiBtn">SELESAI</button>
                <button id="gagalBtn">AKU GAGAL</button>
            </div>
        `;
        document.getElementById("selesaiBtn").addEventListener("click", () => {
            skor += 0.5; // Tambah skor jika berhasil
            lanjutKeSoalBerikutnya();
        });
        document.getElementById("gagalBtn").addEventListener("click", () => {
            skor -= 0.5; // Kurangi skor jika gagal
            lanjutKeSoalBerikutnya();
        });
    });

    // Event Listener untuk tombol "HMM AKU MENYERAH"
    document.getElementById("menyerahBtn").addEventListener("click", () => {
        lanjutKeSoalBerikutnya();
    });
}

// Lanjut ke soal berikutnya
function lanjutKeSoalBerikutnya() {
    // Hapus pop-up tantangan
    document.querySelector(".popUpTantangan").remove();
    tantanganAktif = false; // Menandakan tantangan selesai
    soalSekarang++; // Lanjut ke soal berikutnya
    if (soalSekarang < soalSesi.length) {
        tampilkanSoal();
    } else {
        tampilkanNilai();
    }
}
