require('dotenv').config();
const bcrypt = require('bcrypt');
const Staff = require('../models/Staff');

(async () => {
  const hashed = await bcrypt.hash('counter123', 10);

  await Staff.create({
    name: 'Rohit Counter',
    email: 'counter@test.com',
    password: hashed,
    role: 'counter',
    hotelId: 6755   
  });

  console.log('Counter user created successfully');
  process.exit();
})();
