const express = require('express');
const redis = require('redis');

const app = express();

const client = redis.createClient();
const port = 1245;

const listProducts = [
  {
    itemId: 1, itemName: 'Suitcase 250', price: 50, stock: 4
  },
  {
    itemId: 2, itemName: 'Suitcase 450', price: 100, stock: 10
  },
  {
    itemId: 3, itemName: 'Suitcase 650', price: 350, stock: 2
  },
  {
    itemId: 4, itemName: 'Suitcase 1050', price: 550, stock: 5
  }
];

const getItemById = (id) => {
  return listProducts.find((product) => product.itemId === id);
};

const reserveStockById = (itemId, stock) => {
  client.set(`item.${itemId}`, stock);
};

const getCurrentReservedStockById = async (itemId) => {
  return new Promise((resolve, reject) => {
    client.get(`item.${itemId}`, (err, reply) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });
};

app.get('/list_products', (req, res) => {
    res.json(listProducts);
});

app.get('/list_products/:itemId', async function (req, res) {
  const itemId = req.params.itemId;
  const item = getItemById(parseInt(itemId));

  if (item) {
    const stock = await getCurrentReservedStockById(itemId);
    const resItem = {
      itemId: item.itemId,
      itemName: item.itemName,
      price: item.price,
      initialAvailableQuantity: item.initialAvailableQuantity,
      currentQuantity: stock !== null ? parseInt(stock) : item.initialAvailableQuantity
    };
    res.json(resItem);
  } else {
    res.json({ status: 'Product not found' });
  }
});

app.get('/reserve_product/:itemId', async function (req, res) {
  const itemId = parseInt(req.params.itemId);
  const item = getItemById(itemId);

  let currentStock = await getCurrentReservedStockById(itemId);

  if (currentStock !== null) {
    currentStock = parseInt(currentStock);
    if (currentStock > 0) {
      reserveStockById(itemId, currentStock - 1);
      res.json({ status: 'Reservation confirmed', itemId });
    } else {
      res.json({ status: 'Not enough stock available', itemId });
    }
  } else {
    reserveStockById(itemId, item.initialAvailableQuantity - 1);
    res.json({ status: 'Reservation confirmed', itemId });
  }
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
