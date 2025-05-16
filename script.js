document.addEventListener('DOMContentLoaded', () => {
  const menuFormulir = document.getElementById('menu-formulir');
  const menuData = document.getElementById('menu-data');
  const sectionFormulir = document.getElementById('section-formulir');
  const sectionData = document.getElementById('section-data');
  const form = document.getElementById('form-presensi');
  const tableBody = document.querySelector('#table-data tbody');

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbxbzUNrZdYXgeCnop_wtvPbrVz1Z6qo7uaUHsw7wkEWA6JWGFo68E_tcAZ3QKAYdmhm_Q/exec';

  function switchPage(page) {
    if (page === 'formulir') {
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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tanggal = document.getElementById('tanggal').value;
    const bulan = document.getElementById('bulan').value;
    const tahun = document.getElementById('tahun').value;
    const nama = document.getElementById('nama').value;
    const kehadiran = document.getElementById('kehadiran').value;
    const jam = new Date().toLocaleTimeString();

    if (!tanggal || !bulan || !tahun || !nama || !kehadiran) {
      alert('Semua kolom wajib diisi!');
      return;
    }

    const data = {
      tanggal: `${tanggal}/${bulan}/${tahun}`,
      nama,
      kehadiran,
      jam
    };

    try {
      const res = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        alert('Data berhasil dikirim!');
        form.reset();
      } else {
        alert('Gagal mengirim data.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mengirim data.');
    }
  });

  async function loadData() {
    tableBody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
    try {
      const res = await fetch(GAS_URL);
      const data = await res.json();
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
    } catch (err) {
      console.error(err);
      tableBody.innerHTML = '<tr><td colspan="4">Gagal memuat data</td></tr>';
    }
  }

  switchPage('formulir');
});
