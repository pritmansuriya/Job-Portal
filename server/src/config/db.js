const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
  try {
    const dnsServers = process.env.DNS_SERVERS
      ? process.env.DNS_SERVERS.split(",").map((server) => server.trim())
      : ["1.1.1.1", "8.8.8.8"];

    dns.setServers(dnsServers);
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully!");
    console.log(`Database Host: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed!");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;