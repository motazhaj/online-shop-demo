const db = require("../data/database");

class Category {
  constructor(title) {
    this.title = title.toLowerCase();
  }

  getCategoryByName() {
    return db.getDb().collection("categories").findOne({ title: this.title });
  }

  async saveCategory() {
    await db.getDb().collection("categories").insertOne({
      title: this.title,
    });
  }
}

module.exports = Category