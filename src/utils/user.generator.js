const fs = require('fs');
const faker = require('faker');

// Function to generate a random date in dd/mm/yyyy format
function generateRandomDate() {
  const start = new Date(1970, 0, 1);
  const end = new Date(2000, 11, 31);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Generate 1000 users
const users = [];
for (let i = 0; i < 1000; i++) {
  const user = {
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    username: faker.internet.userName(),
    birthdate: generateRandomDate()
  };
  users.push(user);
}

// Convert the users array to a JSON string
const jsonContent = JSON.stringify(users, null, 2);

// Write the JSON string to a file
fs.writeFile('users.json', jsonContent, 'utf8', (err) => {
  if (err) {
    console.error('An error occurred while writing JSON Object to File.');
    return console.error(err);
  }
  console.log('JSON file has been saved.');
});
