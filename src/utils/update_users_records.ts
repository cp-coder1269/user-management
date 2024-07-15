const User = require ("src/users/entities/user.entity");

const { getRepository } = require('typeorm');

async function updateUsersAge() {
  const userRepository = getRepository(User);
  const users = await userRepository.find();

  for (const user of users) {
    const age = calculateAge(user.birthdate);
    user.age = age;
    await userRepository.save(user);
  }

  console.log('All users updated with age.');
}

function calculateAge(birthdate) {
  const [day, month, year] = birthdate.split(/[-\/]/).map(part => parseInt(part, 10));
  const birthDateObj = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDifference = today.getMonth() - birthDateObj.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }

  return age;
}

updateUsersAge().catch(error => console.error('Error updating users:', error));
