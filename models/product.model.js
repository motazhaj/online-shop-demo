const db = require("../data/database");

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.category = productData.category;
    this.categoryID = productData.categoryID;
    this.description = productData.description;
    this.price = productData.price;
    this.image = productData.image;
    this.imagePath = `/data/product-images/${productData.image}`;
    this.imageURL = `/data/product-images/${productData.image}`;
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  static async findAll() {
    const products = await db.getDb().collection("products").find().toArray();

    return products.map((productDoc) => {
      return new Product(productDoc);
    });
  }

  async save() {
    const productData = {
      title: this.title,
      category: this.category,
      categoryID: this.categoryID,
      description: this.description,
      price: this.price,
      image: this.image,
    };

    await db.getDb().collection("products").insertOne(productData);
  }
}

module.exports = Product;
