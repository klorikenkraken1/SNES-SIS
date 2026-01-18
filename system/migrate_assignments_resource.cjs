const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite');

db.serialize(() => {
    console.log("Migrating assignments table for resourceLink...");
    
    // Add resourceLink
    db.run("ALTER TABLE assignments ADD COLUMN resourceLink TEXT", (err) => {
        if (err && !err.message.includes('duplicate column')) console.error(err.message);
        else console.log("Added resourceLink column.");
    });
});

db.close();
