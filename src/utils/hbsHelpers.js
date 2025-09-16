export const hbsHelpers = {
  // Multiplica dos números (precio * cantidad)
  multiply: (a, b) => a * b,

  // Suma los totales de un array de productos
  cartTotal: (products) => {
    if (!products || !products.length) return 0;
    return products.reduce((sum, p) => sum + p.product.price * p.quantity, 0);
  },

  // Formatear número a moneda local
  formatCurrency: (value) => `$${value.toFixed(2)}`,

  // Verifica si hay página anterior
  hasPrev: (hasPrev) => hasPrev ? true : false,

  // Verifica si hay página siguiente
  hasNext: (hasNext) => hasNext ? true : false,
};
