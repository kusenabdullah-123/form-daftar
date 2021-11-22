document.addEventListener("DOMContentLoaded", async () => {
  const dataa = await fetch("http://localhost:5000/anggota", {
    mode: "no-cors",
    method: "GET",
  });
  console.log(dataa.json());
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  document
    .querySelector("form#daftar")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const nama = document.querySelector("input#nama").value;
      const angkatan = document.querySelector("input#angkatan").value;
      const jenis = document.querySelector('input[type="radio"]:checked').value;
      const jurusan = document.querySelector("select#jurusan").value;
      const alasan = document.querySelector("textarea#alasan").value;
      const foto = document.querySelector("input#foto").files[0];
      const image = await getBase64(foto);
      const data = {
        image,
        nama,
        angkatan,
        jenis,
        jurusan,
        alasan,
      };
      const response = await fetch("http://localhost:5000/anggota", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        mode: "no-cors",
        body: JSON.stringify(data),
      });
      console.log(response.json());
    });
});
