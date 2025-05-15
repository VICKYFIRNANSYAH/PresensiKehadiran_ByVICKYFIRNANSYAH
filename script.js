document.addEventListener('DOMContentLoaded', () => {
  const menuFormulir = document.getElementById('menu-formulir');
  const menuData = document.getElementById('menu-data');
  const sectionFormulir = document.getElementById('section-formulir');
  const sectionData = document.getElementById('section-data');
  const form = document.getElementById('form-presensi');
  const tableBody = document.querySelector('#table-data tbody');

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

    const tanggal = document.getElementById('tanggal').value.trim();
    const bulan = document.getElementById('bulan').value.trim();
    const tahun = document.getElementById('tahun').value.trim();
    const nama = document.getElementById('nama').value.trim();
    const kehadiran = document.getElementById('kehadiran').value;

    if (!tanggal || !bulan || !tahun || !nama || !kehadiran) {
      alert('Semua kolom wajib diisi!');
      return;
    }
    if (tanggal.length !== 2 || bulan.length !== 2 || tahun.length !== 4) {
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

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbyZ6rbDUaPjDQ3CYa7xj2gtpFmYzxsTwGYPIj_RWjdk3UJUmOdLH60tI4FOsUt5bvgrAg/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        alert('Data berhasil dikirim!');
        form.reset();
      } else {
        alert('Gagal mengirim data dari server');
      }
    } catch (error) {
      alert('Error mengirim data. Cek console untuk detail.');
      console.error('Fetch error:', error);
    }
  });

  async function loadData() {
    tableBody.innerHTML = '<tr><td colspan="4">Memuat data...</td></tr>';

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbyZ6rbDUaPjDQ3CYa7xj2gtpFmYzxsTwGYPIj_RWjdk3UJUmOdLH60tI4FOsUt5bvgrAg/exec?action=get');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (!data.length) {
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
    } catch (error) {
      tableBody.innerHTML = '<tr><td colspan="4">Gagal memuat data</td></tr>';
      console.error('Load data error:', error);
    }
  }

  switchPage('formulir');
});
