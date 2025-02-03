export function cekPantun() {
  const pantun = document.getElementById("pantun-input").value;
  const hasilElement = document.getElementById("hasil");

  // Pisahkan bait menjadi baris-baris
  const baris = pantun.trim().split("\n");
  const totalBaris = 4; // Pantun seharusnya terdiri dari 4 baris

  // Pastikan baris yang kosong ditambahkan untuk pengecekan
  while (baris.length < totalBaris) {
    baris.push("");
  }

  // Array untuk menyimpan pesan hasil
  let hasilPesan = [];
  let pesanKesalahan = [];
  let sukuKataBenar = [];
  let sukuKataSalah = [];
  let rimaBenar = [];
  let rimaSalah = [];

  // Pesan mengenai jumlah baris
  if (baris.filter((b) => b.trim() !== "").length !== totalBaris) {
    pesanKesalahan.push(
      `<span style="color: red;">Perhatikan kembali, pantun kamu baru ${
        baris.filter((b) => b.trim() !== "").length
      } baris. Pantun harus terdiri dari 4 baris. Coba lagi ya!</span>`
    );
  } else {
    hasilPesan.push(
      `<span style="color: green;">Jumlah baris pantun kamu sudah benar, yaitu 4 baris!</span>`
    );
  }

  function hitungSukuKata(baris) {
    const sukuKataEjaan = [];
    const kataArray = baris.split(" ");
    let totalSukuKata = 0;

    // Daftar diftong dalam bahasa Indonesia
    const diftong = ["ai", "au", "ei", "oi", "ui"];

    const warnaiVokal = (kata) => {
      return kata.replace(/[aiueoAIUEO]/g, (match) => {
        return `<span style="color: black; text-decoration: underline; text-decoration-color: black;">${match}</span>`;
      });
    };

    kataArray.forEach((kata) => {
      let sukuKata = 0;
      let i = 0;

      while (i < kata.length) {
        // Jika dua huruf berturut-turut membentuk diftong, lompat ke huruf berikutnya
        if (
          i < kata.length - 1 &&
          diftong.includes(kata.slice(i, i + 2).toLowerCase())
        ) {
          sukuKata++;
          i += 2; // Lewati dua huruf karena ini diftong
        } else if (/[aiueoAIUEO]/.test(kata[i])) {
          sukuKata++;
          i++; // Hitung satu huruf vokal sebagai satu suku kata
        } else {
          i++; // Lewati konsonan
        }
      }

      totalSukuKata += sukuKata;
      sukuKataEjaan.push(warnaiVokal(kata));
    });

    return { total: totalSukuKata, ejaan: sukuKataEjaan.join(" ") };
  }

  function akhirKata(baris) {
    return baris.trim().split(" ").pop().toLowerCase();
  }

  function ambilRima(kata) {
    if (kata.endsWith("ng")) {
      return kata.slice(-3);
    }
    if (/[aiueo]$/.test(kata)) {
      return kata.slice(-1);
    }
    return kata.slice(-2);
  }

  function sorotRima(teks, rima) {
    const posisiRima = teks.lastIndexOf(rima);
    if (posisiRima !== -1) {
      return (
        teks.slice(0, posisiRima) +
        `<span style="color: blue;">` +
        teks.slice(posisiRima) +
        `</span>`
      );
    }
    return teks;
  }

  // Periksa setiap baris
  const rima = baris.map((barisTeks) => ambilRima(akhirKata(barisTeks)));

  // **Cek Suku Kata**
  for (let i = 0; i < totalBaris; i++) {
    const { total, ejaan } = hitungSukuKata(baris[i]);
    if (total < 8 || total > 12) {
      sukuKataSalah.push(
        `<span style="color: red;">Perhatikan kembali, pantun kamu pada baris ${
          i + 1
        } masih salah "${
          baris[i]
        }" terdiri dari (${ejaan}) ${total} suku kata. Pantun harus memiliki 8-12 suku kata.</span><br>`
      );
    } else {
      sukuKataBenar.push(
        `<span style="color: green;">Pantun kamu pada baris ${
          i + 1
        } sudah benar "${
          baris[i]
        }" terdiri dari (${ejaan}) ${total} suku kata.</span><br>`
      );
    }
  }

  // **Cek Rima**
  if (rima[0] !== rima[2]) {
    rimaSalah.push(
      `<span style="color: red;">Perhatikan kembali, rima pantun kamu pada baris 1 "${sorotRima(
        baris[0],
        rima[0]
      )}" dan 3 "${sorotRima(
        baris[2],
        rima[2]
      )}" belum sesuai. Coba lagi ya!</span><br>`
    );
  } else {
    rimaBenar.push(
      `<span style="color: green;">Rima pada baris 1 "${sorotRima(
        baris[0],
        rima[0]
      )}" dan baris 3 "${sorotRima(baris[2], rima[2])}" sudah benar!</span><br>`
    );
  }

  if (rima[1] !== rima[3]) {
    rimaSalah.push(
      `<span style="color: red;">Perhatikan kembali, rima pantun kamu pada baris 2 "${sorotRima(
        baris[1],
        rima[1]
      )}" dan 4 "${sorotRima(
        baris[3],
        rima[3]
      )}" belum sesuai. Coba lagi ya!</span><br>`
    );
  } else {
    rimaBenar.push(
      `<span style="color: green;">Rima pada baris 2 "${sorotRima(
        baris[1],
        rima[1]
      )}" dan baris 4 "${sorotRima(baris[3], rima[3])}" sudah benar!</span><br>`
    );
  }

  // Gabungkan pesan sesuai kategori
  const semuaPesan = `
    <strong>*BARIS</strong><br>
    ${pesanKesalahan.concat(hasilPesan).join("<br>")}<br><br>
    <strong>*SUKU KATA</strong><br>
    ${sukuKataSalah.concat(sukuKataBenar).join("")}<br>
    <strong>*RIMA</strong><br>
    ${rimaSalah.concat(rimaBenar).join("")}<br>
    <strong>Keterangan:</strong><br>
    <div style="display: inline-block; width: 10px; height: 10px; background-color: green; margin-right: 5px;"></div> : <span style="color: green;">sudah sesuai</span><br>
    <div style="display: inline-block; width: 10px; height: 10px; background-color: red; margin-right: 5px;"></div> : <span style="color: red;">masih terdapat kesalahan</span><br>
    <div style="display: inline-block; width: 10px; height: 10px; background-color: black; margin-right: 5px;"></div> : <span style="color: black;">jumlah penggalan suku kata</span><br>
    <div style="display: inline-block; width: 10px; height: 10px; background-color: blue; margin-right: 5px;"></div> : <span style="color: blue;">bunyi akhir rima</span><br>
    `;

  if (
    pesanKesalahan.length > 0 ||
    sukuKataSalah.length > 0 ||
    rimaSalah.length > 0
  ) {
    hasilElement.innerHTML = semuaPesan;
    soundSalah.play();
  } else {
    hasilElement.innerHTML = semuaPesan;
    soundBenar.play();
  }
}
