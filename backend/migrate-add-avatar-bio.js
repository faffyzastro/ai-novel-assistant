const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../database/ai-novel.sqlite');

db.serialize(() => {
  db.run("ALTER TABLE users ADD COLUMN avatar TEXT", err => {
    if (err && !/duplicate column|already exists/i.test(err.message)) {
      console.error("Error adding avatar column:", err.message);
    } else {
      console.log("avatar column added or already exists.");
    }
  });
  db.run("ALTER TABLE users ADD COLUMN bio TEXT", err => {
    if (err && !/duplicate column|already exists/i.test(err.message)) {
      console.error("Error adding bio column:", err.message);
    } else {
      console.log("bio column added or already exists.");
    }
  });
});

db.close(); 