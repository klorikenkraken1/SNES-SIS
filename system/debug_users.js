import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('db.sqlite');

console.log('--- TABLE INFO ---');
db.all('PRAGMA table_info(users)', [], (err, rows) => {
    if (err) console.error(err);
    else console.table(rows);
    
    console.log('\n--- USERS DATA ---');
    db.all('SELECT * FROM users LIMIT 1', [], (err, rows) => {
        if (err) console.error(err);
        else console.log(rows);
    });
});
