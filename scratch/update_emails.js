const fs = require('fs');
let data = JSON.parse(fs.readFileSync('data/faculty.json'));

data.forEach(f => {
  let nameStr = f.name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s*/i, '').trim();
  let parts = nameStr.split(' ').filter(p => p.length > 0);
  
  if (parts.length >= 2) {
    let first = parts[0].toLowerCase();
    let last = parts[parts.length - 1].toLowerCase();
    f.email = `${first}.${last}@pccoepune.org`;
  } else if (parts.length === 1) {
    f.email = `${parts[0].toLowerCase()}@pccoepune.org`;
  }
});

fs.writeFileSync('data/faculty.json', JSON.stringify(data, null, 2));
console.log('Emails updated!');
