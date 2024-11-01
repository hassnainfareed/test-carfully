// import bcrypt from "bcrypt";
var bcrypt = require("bcrypt");

async function getHasValue() {
  const value = await bcrypt.hash("NiA$K@tIp24", 10);
  console.log(value);
}

getHasValue("test");

// old=$2b$10$CWHrX4mg2vd8vCoLhPc2P.HqqyQlGg8t/F6OrMwXtuw98OYrxUMLS
// new=$2b$10$sN.MHjUXS520.kAxHqyWzOGcWXuH/QxyoUPQMUewzyfVkjgXe8XLq

// ALTER USER postgres PASSWORD 'zGt§wdQMbZ&3L9ku';
