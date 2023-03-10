const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("studentMaster.db", (error) => {
  if (error) {
    console.error(error.message);
  } else {
    console.log("Connected to the database");
  }
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS studentMaster (
    email TEXT PRIMARY KEY ,
    name TEXT,
    mobile INTEGER,
    password TEXT,
    isStudent BOOLEAN

  )
`;

db.run(createTableQuery, (error) => {
  if (error) {
    console.error(error.message);
  } else {
    console.log("Table created successfully");
  }
});

db.close();
