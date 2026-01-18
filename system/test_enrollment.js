import fs from 'fs';
import { Blob } from 'buffer';

async function test() {
    const form = new FormData();
    form.append('fullName', 'Test Student');
    form.append('email', 'test@test.com');
    form.append('targetGrade', 'Grade 1');
    form.append('previousSchool', 'Old School');
    
    // Create a dummy file
    fs.writeFileSync('dummy.pdf', 'test content');
    
    const file = new Blob(['test content'], { type: 'application/pdf' });
    form.append('sf9', file, 'dummy.pdf');

    try {
        const res = await fetch('http://localhost:3001/api/enrollment', {
            method: 'POST',
            body: form
        });
        
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Body:', text);
    } catch (e) {
        console.error(e);
    }
}

test();