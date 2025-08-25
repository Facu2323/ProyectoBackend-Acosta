const socket = io();

// Agregar producto
document.getElementById("productForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  socket.emit("newProduct", data);
  e.target.reset();
});

// Eliminar producto
document.getElementById("deleteForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = e.target.id.value;
  socket.emit("deleteProduct", id);
  e.target.reset();
});

// Actualizar lista en tiempo real
socket.on("updateProducts", (products) => {
  const list = document.getElementById("product-list");
  list.innerHTML = "";
  products.forEach((p) => {
    list.innerHTML += `<li><strong>${p.title}</strong> - $${p.price}</li>`;
  });
});

