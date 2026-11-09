
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 10000;
const HOST = "0.0.0.0";

const DATA_DIR = path.join(__dirname, "data");
const DATA = path.join(DATA_DIR, "store.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial database
function read() {
  if (!fs.existsSync(DATA)) {
    const initialData = {
      products: [
        {
          id: 1,
          name: "Wireless Earbuds",
          category: "Audio",
          price: 899,
          stock: 12,
          image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
          description: "Wireless audio accessory"
        },
        {
          id: 2,
          name: "Fast Charger & Cable",
          category: "Charging",
          price: 499,
          stock: 20,
          image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0",
          description: "Charging accessory"
        },
        {
          id: 3,
          name: "Smart Watch",
          category: "Wearables",
          price: 1499,
          stock: 8,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
          description: "Smart wearable"
        },
        {
          id: 4,
          name: "Mobile Back Cover",
          category: "Accessories",
          price: 199,
          stock: 30,
          image: "https://images.unsplash.com/photo-1601593346740-92561587e2f5",
          description: "Protective mobile cover"
        }
      ],
      orders: [],
      nextProductId: 5,
      nextOrderId: 1
    };

    fs.writeFileSync(DATA, JSON.stringify(initialData, null, 2));
    return initialData;
  }

  return JSON.parse(fs.readFileSync(DATA, "utf8"));
}

function write(data) {
  fs.writeFileSync(DATA, JSON.stringify(data, null, 2));
}

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Shivam Network Server is running"
  });
});

// Home page
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/products", (req, res) => {
  try {
    const data = read();
    res.json(data.products);
  } catch (error) {
    res.status(500).json({ error: "Unable to load products" });
  }
});

// Get single product
app.get("/api/products/:id", (req, res) => {
  const data = read();
  const product = data.products.find(
    p => p.id === Number(req.params.id)
  );

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

// Create order
app.post("/api/orders", (req, res) => {
  try {
    const data = read();
    const { customer, phone, address, items, paymentMethod } = req.body;

    if (!customer || !phone || !address ||
        !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Customer and order details are required"
      });
    }

    const order = {
      id: data.nextOrderId || 1,
      customer,
      phone,
      address,
      items,
      paymentMethod: paymentMethod || "COD",
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    data.orders.push(order);
    data.nextOrderId = order.id + 1;
    write(data);

    res.status(201).json({
      success: true,
      message: "Order created",
      order
    });
  } catch (error) {
    res.status(500).json({ error: "Order creation failed" });
  }
});

// List orders
app.get("/api/orders", (req, res) => {
  try {
    res.json(read().orders);
  } catch (error) {
    res.status(500).json({ error: "Unable to load orders" });
  }
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`Shivam Network running on ${HOST}:${PORT}`);
});
