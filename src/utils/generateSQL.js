const fs = require('fs');

// Read the JSON file
fs.readFile('users.json', 'utf8', (err, data) => {
  if (err) {
    console.error('An error occurred while reading the JSON file.');
    return console.error(err);
  }

  // Parse the JSON data
  const users = JSON.parse(data);

  // Generate the SQL insert statements
  let sql = 'INSERT INTO users (name, surname, username, birthdate) VALUES\n';

  users.forEach((user, index) => {
    const escapedName = user.name.replace(/'/g, "''");
    const escapedSurname = user.surname.replace(/'/g, "''");
    const escapedUsername = user.username.replace(/'/g, "''");
    const escapedBirthdate = user.birthdate.replace(/'/g, "''");

    const values = `('${escapedName}', '${escapedSurname}', '${escapedUsername}', '${escapedBirthdate}')`;
    sql += values;
    if (index < users.length - 1) {
      sql += ',\n';
    } else {
      sql += ';\n';
    }
  });

  // Write the SQL to a file
  fs.writeFile('insertUsers.sql', sql, 'utf8', (err) => {
    if (err) {
      console.error('An error occurred while writing SQL to file.');
      return console.error(err);
    }
    console.log('SQL file has been saved.');
  });
});
