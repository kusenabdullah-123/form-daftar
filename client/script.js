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
const getData = async () => {
  const response = await axios({
    method: "get",
    url: "http://localhost:5000/anggota",
  });
  let htmlCard = "";
  response.data.data.forEach((item) => {
    htmlCard += `
    <div class="card">
    <figure>
      <img src="${item.image}" alt="" />
    </figure>
    <p>Nama : ${item.nama}</p>
    <p>Angkatan : ${item.angkatan}</p>
    <p>Jurusan : ${item.jurusan}</p>
    <p>Jenis Kelamin : ${item.jenis}</p>
    <div class="form-tombol"><button data-id="${item.id}" class="tombol-delete">Delete</button></div>
  </div>`;
  });
  document.querySelector(".container-anggota").innerHTML = htmlCard;
};
document.addEventListener("DOMContentLoaded", async () => {
  getData();

  const postData = async (data) => {
    axios
      .post("http://localhost:5000/anggota", data)
      .then(async (response) => {
        if (response.status == 200) {
          Toast.fire({
            icon: "success",
            title: "Successfully Add Data",
          });
          getData();
        }
      })
      .catch(async (error) => {
        console.log(error);
      });
  };
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
      const baseImg = await getBase64(foto);
      const data = {
        image: baseImg,
        nama,
        angkatan,
        jenis,
        jurusan,
        alasan,
      };
      postData(JSON.stringify(data));
    });
  document.addEventListener("click", async (e) => {
    if (
      e.target.nodeName == "BUTTON" &&
      e.target.className == "tombol-delete"
    ) {
      const id = e.target.dataset.id;
      const r = await fetch("http://localhost:5000/anggota", {
        method: "DELETE",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ id }),
      });
      console.log(r);
      // if (r.status == 200) {
      //   Toast.fire({
      //     icon: "success",
      //     title: "Successfully Delete Data",
      //   });
      //   getData();
      // }
    }
  });
});
