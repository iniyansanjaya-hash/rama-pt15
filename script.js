// Konfigurasi Kunci Keamanan
const CORRECT_PASSCODE = "1010";
let currentInput = "";

// 1. Fungsi Jam Real-Time Otomatis
function updateClock() {
    const now = new Date();
    
    // Format Jam Menit (Contoh: 15:42)
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    // Update Jam di Lock Screen & Home Screen
    document.getElementById('lock-time').textContent = formattedTime;
    document.getElementById('home-time').textContent = formattedTime;

// 📌 TAMBAHKAN BARIS INI (Agar jam di bar atas ikut berputar otomatis)
if (document.getElementById('top-time')) {
    document.getElementById('top-time').textContent = formattedTime;
}

    // Format Tanggal Indonesia (Contoh: Kamis, 22 Oktober)
    const opsiHari = { weekday: 'long' };
    const opsiTanggal = { day: 'numeric', month: 'long' };
    const namaHari = now.toLocaleDateString('id-ID', opsiHari);
    const namaTanggal = now.toLocaleDateString('id-ID', opsiTanggal);
    
    document.getElementById('lock-date').textContent = `${namaHari}, ${namaTanggal}`;
    document.getElementById('home-date').textContent = `${namaHari}, ${namaTanggal}`;
}

// Jalankan pencatatan waktu setiap 1 detik
setInterval(updateClock, 1000);
updateClock();

// // 2. Transisi Menuju Layar Kode Akses (PIN)
const swipeTrigger = document.getElementById('swipe-trigger');
let touchStartY = 0;
let touchEndY = 0;

// 1. Catat posisi awal jari saat menyentuh layar
swipeTrigger.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

// 2. Catat posisi akhir jari saat dilepas, lalu hitung jarak gesernya
swipeTrigger.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    
    // Jika jarak geser ke atas lebih dari 50 pixel, buka layar PIN
    if (touchStartY - touchEndY > 50) {
        document.getElementById('lock-screen').classList.remove('active');
        document.getElementById('passcode-screen').classList.add('active');
    }
});

// 3. Tetap pertahankan fungsi klik biasa sebagai alternatif (jika dites di laptop/PC)
swipeTrigger.addEventListener('click', () => {
    document.getElementById('lock-screen').classList.remove('active');
    document.getElementById('passcode-screen').classList.add('active');
});

// 2. Sistem Numpad PIN Kunci
function pressKey(num) {
    if (currentInput.length >= 4) return;
    
    currentInput += num;
    updateDots();

    if (currentInput.length === 4) {
        setTimeout(() => {
            if (currentInput === CORRECT_PASSCODE) {
                // Password Benar -> Buka Home Screen
                document.getElementById('passcode-screen').classList.remove('active');
                document.getElementById('home-screen').classList.add('active');
                
                // Animasi Dynamic Island membesar sekilas
                const island = document.getElementById('dynamic-island');
                island.style.width = "140px";
                setTimeout(() => island.style.width = "110px", 400);
            } else {
                // Password Salah -> Efek Guncang Layar
                const screen = document.getElementById('passcode-screen');
                screen.classList.add('shake');
                currentInput = "";
                updateDots();
                setTimeout(() => screen.classList.remove('shake'), 300);
            }
        }, 200);
    }
}

function clearKey() {
    currentInput = currentInput.slice(0, -1);
    updateDots();
}

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index < currentInput.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
  }

// 📌 FUNGSI BATERAI REAL-TIME OTOMATIS
if ('getBattery' in navigator) {
    navigator.getBattery().then(function(battery) {
        // 1. Fungsi untuk memperbarui angka teks baterai
        function updateBatteryStatus() {
            const level = Math.floor(battery.level * 100);
            const batteryElem = document.getElementById('battery-level');
            
            if (batteryElem) {
                batteryElem.textContent = level;
            }
        }

        // Jalankan fungsi saat pertama kali simulator dimuat
        updateBatteryStatus();

        // 2. Pasang pendengar otomatis jika daya baterai berubah di latar belakang
        battery.addEventListener('levelchange', updateBatteryStatus);
    });
} else {
    // Cadangan jika browser laptop/HP jadul tidak mendukung Battery API
    console.log("Battery Status API tidak didukung di browser ini.");
      }
