
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DBSOURCE = path.join(__dirname, 'backend/db.sqlite');

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    }
});

const appId = 'app-1768788754033'; // The ID from the error log

db.get('SELECT * FROM enrollment_applications WHERE id = ?', [appId], (err, app) => {
    if (err) {
        console.error("Error fetching app:", err);
        return;
    }
    if (!app) {
        console.log("Application not found:", appId);
        return;
    }
    console.log("Enrollment Application:", app);

    db.get('SELECT * FROM users WHERE email = ?', [app.email], (err, user) => {
        if (err) {
            console.error("Error fetching user:", err);
            return;
        }
        if (!user) {
            console.log("No user found with email:", app.email);
        } else {
            console.log("Existing User found:", user);
            console.log("User Status:", user.status);
        }
    });
});
