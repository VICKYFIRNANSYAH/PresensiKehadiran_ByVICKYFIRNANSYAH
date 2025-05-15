document.addEventListener('DOMContentLoaded', () => {
  const menuFormulir = document.getElementById('menu-formulir');
  const menuData = document.getElementById('menu-data');
  const sectionFormulir = document.getElementById('section-formulir');
  const sectionData = document.getElementById('section-data');
  const form = document.getElementById('form-presensi');
  const tableBody = document.querySelector('#table-data tbody');

  // Fungsi pindah halaman dengan animasi glowing aktif pindah
  function switchPage(page) {
    if(page === 'formulir') {
      sectionFormulir.style.display = 'block';
      sectionData.style.display = 'none';
      menuFormulir.classList.add('active');
      menuData.classList.remove('active');
    } else {
      sectionFormulir.style.display = 'none';
      sectionData.style.display = 'block';
      menuFormulir.classList.remove('active');
      menuData.classList.add('active');
      loadData();
    }
  }

  menuFormulir.addEventListener('click', () => switchPage('formulir'));
  menuData.addEventListener('click', () => switchPage('data'));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const tanggal = document.getElementById('tanggal').value.trim();
    const bulan = document.getElementById('bulan').value.trim();
    const tahun = document.getElementById('tahun').value.trim();
    const nama = document.getElementById('nama').value.trim();
    const kehadiran = document.getElementById('kehadiran').value;

    if(!tanggal || !bulan || !tahun || !nama || !kehadiran) {
      alert('Semua kolom wajib diisi!');
      return;
    }
    if(tanggal.length !== 2 || bulan.length !== 2 || tahun.length !== 4) {
      alert('Format tanggal harus DD MM YYYY dengan angka lengkap!');
      return;
    }
    const tgl = `${tanggal}/${bulan}/${tahun}`;
    const jam = new Date().toLocaleTimeString();

    const data = {
      tanggal: tgl,
      nama,
      kehadiran,
      jam,
    };

    // Ganti URL ini dengan URL Apps Script kamu
    fetch('https://script.google.com/macros/s/AKfycbzxoHnKYy49_UUGG9LDFIuUJ_I-3F2GipHquuuK5yB0aYpBM0Nh2gXhHiSihaH_6UiOFg/exec', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(res => {
      if(res.success) {
        alert('Data berhasil dikirim!');
        form.reset();
      } else {
        alert('Gagal mengirim data!');
      }
    })
    .catch(err => {
      alert('Error mengirim data');
      console.error(err);
    });
  });

  function loadData() {
    tableBody.innerHTML = '<tr><td colspan="4">Memuat data...</td></tr>';
    fetch('https://script.google.com/macros/s/AKfycbzxoHnKYy49_UUGG9LDFIuUJ_I-3F2GipHquuuK5yB0aYpBM0Nh2gXhHiSihaH_6UiOFg/exec?action=get')
      .then(res => res.json())
      .then(data => {
        if(data.length === 0) {
          tableBody.innerHTML = '<tr><td colspan="4">Belum ada data</td></tr>';
          return;
        }
        tableBody.innerHTML = '';
        data.forEach(row => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${row.tanggal}</td>
            <td>${row.nama}</td>
            <td>${row.kehadiran}</td>
            <td>${row.jam}</td>
          `;
          tableBody.appendChild(tr);
        });
      })
      .catch(() => {
        tableBody.innerHTML = '<tr><td colspan="4">Gagal memuat data</td></tr>';
      });
  }

  // Tampilkan halaman Formulir sebagai default
  switchPage('formulir');
});
