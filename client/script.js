document.addEventListener("DOMContentLoaded", async () => {
  const postData = async (data) => {
    axios
      .post("http://localhost:5000/anggota", data)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
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
      const data = new FormData();
      data.append("foto", foto);
      data.append("nama", nama);
      data.append("angkatan", angkatan);
      data.append("jenis", jenis);
      data.append("jurusan", jurusan);
      data.append("alasan", alasan);
      postData(data);
    });
});
