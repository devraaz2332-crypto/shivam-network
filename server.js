function read() {
  if (!fs.existsSync(DATA)) {
    const initialData = {
      products: [
        {id: 1, name: 'Wireless Earbuds', category: 'Audio', price: 899, stock: 12, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df'},
        {id: 2, name: 'Fast Charger & Cable', category: 'Charging', price: 499, stock: 20, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0'},
        {id: 3, name: 'Smart Watch', category: 'Wearables', price: 1499, stock: 8, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'},
        {id: 4, name: 'Mobile Back Cover', category: 'Accessories', price: 199, stock: 30, image: 'https://images.unsplash.com/photo-1601593346740-92561587e2f5'}
      ],
      orders: []
    };
    fs.writeFileSync(DATA, JSON.stringify(initialData, null, 2));
  }
  return JSON.parse(fs.readFileSync(DATA, 'utf8'));
}

function write(d) {
  fs.writeFileSync(DATA, JSON.stringify(d, null, 2));
}
