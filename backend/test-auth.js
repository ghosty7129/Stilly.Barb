import bcrypt from 'bcrypt';

const password = 'Barb3r@2024!Secure#Admin';
const hash = '$2b$10$lKQn4.BFtzsxNQ28NBzp6eXcghqs4yQmGUNB9nq8iVNEmDPu4jOTa';

console.log('=== BCRYPT TEST ===');
console.log('Password:', password);
console.log('Hash:', hash);
console.log('');

bcrypt.compare(password, hash).then(result => {
  console.log('✓ bcrypt.compare result:', result);
  if (result) {
    console.log('✅ Hash is VALID for this password!');
  } else {
    console.log('❌ Hash is INVALID! Generating correct hash...');
    return bcrypt.hash(password, 10).then(newHash => {
      console.log('New hash:', newHash);
    });
  }
}).catch(err => {
  console.error('Error:', err);
});
