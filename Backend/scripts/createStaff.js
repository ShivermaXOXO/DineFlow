require('dotenv').config();
const bcrypt = require('bcrypt');
const Staff = require('../models/Staff');

(async () => {
  const hashedPassword = await bcrypt.hash('shivam123', 10);

  const [updated] = await Staff.update(
    {
      name: 'Shivam',
      email: 'shivam123@test.com',
      password: hashedPassword
    },
    {
      where: { email: 'praveen@test.com' } // 👈 purana email
    }
  );

  if (updated === 0) {
    console.log('❌ Staff not found');
  } else {
    console.log('✅ Staff name, email & password updated');
  }

  process.exit();
})();
