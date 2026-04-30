const testLogin = async () => {
  const username = 'barber_admin';
  const password = 'Barb3r@2024!Secure#Admin';

  console.log('=== TESTING LOGIN ENDPOINT ===');
  console.log('Endpoint: http://localhost:5000/api/auth/login');
  console.log('Username:', username);
  console.log('Password:', password);
  console.log('');

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response body:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('✅ Login successful!');
    } else {
      console.log('❌ Login failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Error connecting to backend:', error.message);
    console.log('Make sure the backend is running on port 5000');
  }
};

testLogin();
