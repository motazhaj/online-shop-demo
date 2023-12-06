const bcrypt = require("bcryptjs");

const db = require("../data/database");

class User {
  constructor(email, password, name, city, address) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.city = city;
    this.address = address;
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    await db.getDb().collection("users").insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.name,
      city: this.city,
      address: this.address,
    });
  }
}

module.exports = User;
