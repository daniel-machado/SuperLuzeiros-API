module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('classes', [
      // 🔹 Classes Regulares
      { id: '1', name: 'Amigo', type: 'regular', minAge: 10, maxAge: 10, createdAt: new Date() },
      { id: '2', name: 'Companheiro', type: 'regular', minAge: 11, maxAge: 11, createdAt: new Date() },
      { id: '3', name: 'Pesquisador', type: 'regular', minAge: 12, maxAge: 12, createdAt: new Date() },
      { id: '4', name: 'Pioneiro', type: 'regular', minAge: 13, maxAge: 13, createdAt: new Date() },
      { id: '5', name: 'Excursionista', type: 'regular', minAge: 14, maxAge: 14, createdAt: new Date() },
      { id: '6', name: 'Guia', type: 'regular', minAge: 15, maxAge: 15, createdAt: new Date() },

      // 🔹 Classes Avançadas
      { id: '7', name: 'Amigo da Natureza', type: 'advanced', minAge: 10, maxAge: 10, createdAt: new Date() },
      { id: '8', name: 'Companheiro de Excursionismo', type: 'advanced', minAge: 11, maxAge: 11, createdAt: new Date() },
      { id: '9', name: 'Pesquisador de Campo e Bosque', type: 'advanced', minAge: 12, maxAge: 12, createdAt: new Date() },
      { id: '10', name: 'Pioneiro de Novas Fronteiras', type: 'advanced', minAge: 13, maxAge: 13, createdAt: new Date() },
      { id: '11', name: 'Excursionista na Mata', type: 'advanced', minAge: 14, maxAge: 14, createdAt: new Date() },
      { id: '12', name: 'Guia de Exploração', type: 'advanced', minAge: 15, maxAge: 15, createdAt: new Date() },

      // 🔹 Classes de Liderança
      { id: '13', name: 'Líder', type: 'leadership', minAge: 18, maxAge: 18, createdAt: new Date() },
      { id: '14', name: 'Líder Master', type: 'leadership', minAge: 19, maxAge: 19, createdAt: new Date() },
      { id: '15', name: 'Líder Master Avançado', type: 'leadership', minAge: 21, maxAge: 21, createdAt: new Date() },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('classes', null, {});
  },
};
