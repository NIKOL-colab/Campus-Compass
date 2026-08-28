const fs = require('fs');

let docxText = `Dr. A.K. Gaikwad
Dr. S. T. Mali
Dr. S. S. Motegaonkar
Dr. D. S. Lal
Dr. R. S. Chaudhari
Mrs. J. N. Changade
Mr. S. B. Gorade
Ms. P. V. Kalokhe
Mrs. K. D. Dhapekar
Dr. Tanmay S. Khambekar
Mrs. N. S. Sane
Dr. S. P. Banne
Dr. S. D. Kurhade
Ms. A. A. Chandragade
Dr. P. R. Mali
Dr. Vinay Ashok Rangari
Dr. Suresh Nama`;

let names = docxText.split('\n').map(n => n.trim()).filter(n => n.length > 0);
let photos = fs.readdirSync('public/images/faculty');

let facultyData = JSON.parse(fs.readFileSync('data/faculty.json', 'utf8'));
let nextId = Math.max(...facultyData.map(f => f.id)) + 1;

names.forEach(name => {
  // Clean name for email
  let nameStr = name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s*/i, '').trim();
  // Remove dots from initials
  nameStr = nameStr.replace(/\./g, '');
  
  let parts = nameStr.split(' ').filter(p => p.length > 0);
  let email = '';
  if (parts.length >= 2) {
    let first = parts[0].toLowerCase();
    let last = parts[parts.length - 1].toLowerCase();
    email = `${first}.${last}@pccoepune.org`;
  } else if (parts.length === 1) {
    email = `${parts[0].toLowerCase()}@pccoepune.org`;
  }

  // Exact matching for photo:
  // Try to find a photo file that starts exactly with the name (ignoring extension)
  let matchedPhoto = photos.find(p => {
    let baseName = p.substring(0, p.lastIndexOf('.'));
    return baseName.toLowerCase() === name.toLowerCase();
  });
  
  let photoPath = matchedPhoto ? `images/faculty/${matchedPhoto}` : '';

  facultyData.push({
    id: nextId++,
    name: name,
    department: 'Civil Engineering',
    subjects: ['Fluid Mechanics', 'Structural Analysis', 'Surveying'],
    cabin: 'Civil Block',
    phone: '+91 00000 00000',
    email: email,
    status: 'in-cabin',
    photo: photoPath,
    timetable: {
      "Monday": [ { "time": "", "subject": "", "room": "" } ],
      "Tuesday": [ { "time": "", "subject": "", "room": "" } ],
      "Wednesday": [ { "time": "", "subject": "", "room": "" } ],
      "Thursday": [ { "time": "", "subject": "", "room": "" } ],
      "Friday": [ { "time": "", "subject": "", "room": "" } ]
    }
  });
});

fs.writeFileSync('data/faculty.json', JSON.stringify(facultyData, null, 2));
console.log('Civil Faculty Added!');
