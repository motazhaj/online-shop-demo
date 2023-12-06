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

  getUserByEmail() {
    return db.getDb().collection("users").findOne({ email: this.email });
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

  matchPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword)
  }
}

module.exports = User;
