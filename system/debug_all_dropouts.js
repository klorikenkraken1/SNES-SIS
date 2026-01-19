
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DBSOURCE = path.join(__dirname, 'backend/db.sqlite');

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) throw err;
});

db.all('SELECT * FROM dropout_requests', [], (err, rows) => {
    if (err) console.error(err);
    else console.log(rows);
});
