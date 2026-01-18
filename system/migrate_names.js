import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.sqlite');

const db = new sqlite3.Database(dbPath);

const splitName = (fullName) => {
    if (!fullName) return { firstName: '', middleName: '', lastName: '', extension: '' };
    
    const parts = fullName.trim().split(/\s+/);
    let extension = '';
    let lastName = '';
    let middleName = '';
    let firstName = '';

    // Check for extension
    const extensions = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V'];
    if (parts.length > 1 && extensions.includes(parts[parts.length - 1])) {
        extension = parts.pop();
    }

    if (parts.length > 0) {
        lastName = parts.pop();
    }

    if (parts.length > 0) {
        firstName = parts.join(' ');
        // Simple heuristic: if first name part has multiple words, we assume the last one *might* be middle, 
        // but often in PH context "Juan Dela Cruz", "Dela Cruz" is last name.
        // Or "Maria Clara", "Clara" is last.
        // "Rose Marie Santos" -> First: Rose Marie, Last: Santos.
        // It's ambiguous. We will put everything remaining in First Name and leave Middle empty for manual correction,
        // OR try to pop one for middle if > 1 word remaining.
        // Let's stick to: Last word = Last Name. Rest = First Name. Middle Name = Empty (User to update).
    }

    return { firstName, middleName, lastName, extension };
};

db.serialize(() => {
    console.log("Starting Name Migration...");

    // 1. Update USERS table
    console.log("Migrating Users...");
    
    // Add columns if not exist
    const userColumns = ['firstName', 'middleName', 'lastName', 'extension'];
    userColumns.forEach(col => {
        db.run(`ALTER TABLE users ADD COLUMN ${col} TEXT`, (err) => {
            // Ignore error if column exists
        });
    });

    db.all("SELECT id, name FROM users", (err, rows) => {
        if (err) {
            console.error("Error reading users:", err);
            return;
        }
        
        const stmt = db.prepare("UPDATE users SET firstName = ?, middleName = ?, lastName = ?, extension = ? WHERE id = ?");
        
        rows.forEach(row => {
            const { firstName, middleName, lastName, extension } = splitName(row.name);
            stmt.run(firstName, middleName, lastName, extension, row.id);
        });
        
        stmt.finalize(() => console.log(`Processed ${rows.length} users.`));
    });

    // 2. Update ENROLLMENT_APPLICATIONS table
    console.log("Migrating Enrollment Applications...");
    
    const appColumns = ['firstName', 'middleName', 'lastName', 'extension'];
    appColumns.forEach(col => {
        db.run(`ALTER TABLE enrollment_applications ADD COLUMN ${col} TEXT`, (err) => {
            // Ignore error
        });
    });

    db.all("SELECT id, fullName FROM enrollment_applications", (err, rows) => {
        if (err) {
            console.error("Error reading applications:", err);
            return;
        }
        
        const stmt = db.prepare("UPDATE enrollment_applications SET firstName = ?, middleName = ?, lastName = ?, extension = ? WHERE id = ?");
        
        rows.forEach(row => {
            const { firstName, middleName, lastName, extension } = splitName(row.fullName);
            stmt.run(firstName, middleName, lastName, extension, row.id);
        });
        
        stmt.finalize(() => console.log(`Processed ${rows.length} applications.`));
    });
});
