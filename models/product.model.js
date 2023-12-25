const db = require("../data/database");

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.category = productData.category;
    this.description = productData.description;
    this.price = productData.price;
    this.image = productData.image;
    this.imagePath = `/data/product-images/${productData.image}`;
    this.imageURL = `/products/assets/images/${productData.image}`;
  }

  async save() {
    const productData = {
      title: this.title,
      category: this.category,
      description: this.description,
      price: this.price,
      image: this.image,
      imagePath: this.imagePath,
      imageURL: this.imageURL,
    };
    
    await db.getDb().collection("products").insertOne(productData);
  }
}

module.exports = Product;
