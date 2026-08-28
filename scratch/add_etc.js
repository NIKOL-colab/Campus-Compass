const fs = require('fs');

let docxText = `Dr. A. B. Patil
Dr. Kishor Kinage
Dr. N. B. Chopade
Dr. S. U. Bhandari
Dr. M. T. Kolte
Dr. S. L. Tade
Dr. A. R. Suryawanshi
Dr. V. K. Harpale
Dr. P. K. Rajani
Dr. Varsha S Bendre
Dr. D. S. Khurge
Dr. Suwarna Shete
Dr. A. S. Pawar
Dr. P. A. Jog
Dr. A. A. Shrivastav
Dr. Swati P. Jagtap
Dr. P. R. Sonawane
Dr. A. S. Shinde
Dr. S. D. Nagarale
Dr. K. B. Kotangale
Dr. M. M. Narkhede
Dr. S. V. Patil
Dr. G. R. Rahate
Dr. U. R. Shirode
Dr. P. V. Sontakke
Dr. S. A. Patil
Dr. Rashmi Vishal Patil
Dr. Prasad N. Maldhure
Dr. A. S. Gaadhe
Mrs. V. A. Kulkarni
Mrs. S. U. Deoghare
Mrs. S. P. Kadam
Mrs. S. M. Dhavale
Dr. M. S. Bhandarkar
Mrs. S. Y. Sawant
Mr. S. S. Ayane
Mrs. A. V. Bhamare
Dr. Sonal I. Shirke
Mrs. Vaishali Nilesh Patil
Mrs. Kalpana S. Patil`;

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
    department: 'Electronics and Telecommunication Engineering',
    subjects: ['Signals and Systems', 'Digital Logic', 'Microcontrollers'],
    cabin: 'E&TC Block',
    phone: '+91 00000 00000',
    email: email,
    status: 'in-cabin',
    photo: photoPath,
    timetable: {}
  });
});

fs.writeFileSync('data/faculty.json', JSON.stringify(facultyData, null, 2));
console.log('E&TC Faculty Added!');
