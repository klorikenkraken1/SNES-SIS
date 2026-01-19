
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DBSOURCE = path.join(__dirname, 'backend/db.sqlite');

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) throw err;
});

const email = 'karlbenjaminbughaw@gmail.com';

db.run("UPDATE users SET status = 'dropped' WHERE email = ?", [email], function(err) {
    if (err) {
        console.error("Error updating user:", err);
    } else {
        console.log(`User ${email} status updated to 'dropped'. Changes: ${this.changes}`);
    }
});
