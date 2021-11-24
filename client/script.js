document.addEventListener("DOMContentLoaded", async () => {
  const getData = async () => {
    const response = await axios.get("http://localhost:5000/anggota");
    console.log(response.data.data);
    let htmlCard = "";
    response.data.data.forEach((item) => {
      htmlCard += `
      <div class="card">
      <figure>
        <img src="data:${item.tipe};base64, ${item.foto}" alt="" />
      </figure>
      <p>Nama : ${item.nama}</p>
      <p>Angkatan : ${item.angkatan}</p>
      <p>Jurusan : ${item.jurusan}</p>
      <p>Jenis Kelamin : ${item.jenis}</p>
    </div>`;
    });
    document.querySelector(".container-anggota").innerHTML = htmlCard;
  };
  getData();
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const postData = async (data) => {
    axios
      .post("http://localhost:5000/anggota", data)
      .then(function (response) {
        if (response.status == 200) {
          Toast.fire({
            icon: "success",
            title: "Successfully Add Data",
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const deleteData = async (id) => {
    const res = await axios.delete(`http://localhost:5000/anggota?id=${id}`);
    console.log(res);
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
