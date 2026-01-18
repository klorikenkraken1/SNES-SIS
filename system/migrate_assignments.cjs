const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite');

db.serialize(() => {
    console.log("Migrating assignments table...");
    
    // Add dueTime
    db.run("ALTER TABLE assignments ADD COLUMN dueTime TEXT", (err) => {
        if (err && !err.message.includes('duplicate column')) console.error(err.message);
        else console.log("Added dueTime column.");
    });

    // Add allowedFileTypes
    db.run("ALTER TABLE assignments ADD COLUMN allowedFileTypes TEXT", (err) => {
        if (err && !err.message.includes('duplicate column')) console.error(err.message);
        else console.log("Added allowedFileTypes column.");
    });

    // Add isLocked
    db.run("ALTER TABLE assignments ADD COLUMN isLocked BOOLEAN DEFAULT 0", (err) => {
        if (err && !err.message.includes('duplicate column')) console.error(err.message);
        else console.log("Added isLocked column.");
    });
});

db.close();
