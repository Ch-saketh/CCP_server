const prisma = require("../../../config/db"); // Adjust this path to wherever your prisma client is exported

const generateUniqueSlug = async (storeName) => {
  // Convert "Saketh Tech" to "saketh-tech"
  let baseSlug = storeName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  let uniqueSlug = baseSlug;
  let counter = 1;
  let slugExists = true;

  // Keep checking until we find a slug that isn't taken
  while (slugExists) {
    const existingStore = await prisma.store.findUnique({
      where: { storeSlug: uniqueSlug },
    });

    if (existingStore) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    } else {
      slugExists = false;
    }
  }

  return uniqueSlug;
};

module.exports = {
  generateUniqueSlug,
};