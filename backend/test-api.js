const http = require('http');
require('./server');


// Helper to make JSON HTTP requests
function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting TaskFlow Backend Verification Tests ---');

  const baseHeaders = { 'Content-Type': 'application/json' };
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'Password123!';

  // 1. Test Health Check
  console.log('1. Testing /api/health...');
  const healthRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET',
  });
  console.log('Health Check Response:', healthRes.status, healthRes.body);
  if (healthRes.status !== 200) throw new Error('Health check failed');

  // 2. Test User Registration
  console.log('2. Testing /api/auth/register...');
  const registerRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: baseHeaders,
    },
    {
      name: 'Alex Developer',
      email: testEmail,
      password: testPassword,
    }
  );
  console.log('Register Response Status:', registerRes.status);
  console.log('User created:', registerRes.body.user);
  if (registerRes.status !== 201 || !registerRes.body.token) {
    throw new Error('User registration failed: ' + JSON.stringify(registerRes.body));
  }
  const token = registerRes.body.token;

  const authHeaders = {
    ...baseHeaders,
    Authorization: `Bearer ${token}`,
  };

  // 3. Test User Login
  console.log('3. Testing /api/auth/login...');
  const loginRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: baseHeaders,
    },
    {
      email: testEmail,
      password: testPassword,
    }
  );
  console.log('Login Response Status:', loginRes.status);
  if (loginRes.status !== 200 || !loginRes.body.token) {
    throw new Error('User login failed: ' + JSON.stringify(loginRes.body));
  }

  // 4. Test GET /api/auth/me
  console.log('4. Testing /api/auth/me...');
  const meRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: authHeaders,
  });
  console.log('GET /me Response:', meRes.status, meRes.body.user.name);
  if (meRes.status !== 200) throw new Error('Get me failed');

  // 5. Test Creating Tasks
  console.log('5. Testing POST /api/tasks (Creating tasks)...');
  const task1Res = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/tasks',
      method: 'POST',
      headers: authHeaders,
    },
    {
      title: 'Build Authentication System',
      description: 'Implement JWT and bcrypt authentication in TaskFlow',
      status: 'In Progress',
      priority: 'High',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
    }
  );
  console.log('Task 1 created:', task1Res.body.task?.title, 'ID:', task1Res.body.task?._id);
  const task1Id = task1Res.body.task._id;

  const task2Res = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/tasks',
      method: 'POST',
      headers: authHeaders,
    },
    {
      title: 'Design Dashboard UI',
      description: 'Create responsive metrics cards and task list',
      status: 'Pending',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 172800000).toISOString(),
    }
  );
  console.log('Task 2 created:', task2Res.body.task?.title);

  const task3Res = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/tasks',
      method: 'POST',
      headers: authHeaders,
    },
    {
      title: 'Set up Vite and Tailwind',
      description: 'Configure CSS variables and build pipeline',
      status: 'Completed',
      priority: 'Low',
    }
  );
  console.log('Task 3 created:', task3Res.body.task?.title);

  // 6. Test GET /api/tasks (all tasks)
  console.log('6. Testing GET /api/tasks...');
  const tasksRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/tasks',
    method: 'GET',
    headers: authHeaders,
  });
  console.log('Total tasks fetched:', tasksRes.body.count);
  if (tasksRes.body.count !== 3) throw new Error('Expected 3 tasks, got ' + tasksRes.body.count);

  // 7. Test GET /api/tasks/stats
  console.log('7. Testing GET /api/tasks/stats...');
  const statsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/tasks/stats',
    method: 'GET',
    headers: authHeaders,
  });
  console.log('Task Stats:', statsRes.body.stats);
  if (
    statsRes.body.stats.total !== 3 ||
    statsRes.body.stats.completed !== 1 ||
    statsRes.body.stats.inProgress !== 1 ||
    statsRes.body.stats.pending !== 1
  ) {
    throw new Error('Stats calculation mismatch');
  }

  // 8. Test PUT /api/tasks/:id (Update task)
  console.log('8. Testing PUT /api/tasks/:id...');
  const updateRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/tasks/${task1Id}`,
      method: 'PUT',
      headers: authHeaders,
    },
    {
      status: 'Completed',
      title: 'Build Authentication System (Done)',
    }
  );
  console.log('Updated Task status:', updateRes.body.task?.status);
  if (updateRes.body.task?.status !== 'Completed') throw new Error('Task update failed');

  // 9. Test Security: Another user cannot access task
  console.log('9. Testing Security: Another user isolation...');
  const user2Res = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: baseHeaders,
    },
    {
      name: 'Bob Other',
      email: `other_${Date.now()}@example.com`,
      password: 'Password123!',
    }
  );
  const user2Token = user2Res.body.token;
  const user2Headers = { ...baseHeaders, Authorization: `Bearer ${user2Token}` };

  const unauthorizedAccess = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/tasks/${task1Id}`,
    method: 'GET',
    headers: user2Headers,
  });
  console.log('Unauthorized Access Status (expecting 403):', unauthorizedAccess.status);
  if (unauthorizedAccess.status !== 403) {
    throw new Error('Security violation: Other user was able to access task!');
  }

  const user2Tasks = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/tasks',
    method: 'GET',
    headers: user2Headers,
  });
  console.log('User 2 task count (expecting 0):', user2Tasks.body.count);
  if (user2Tasks.body.count !== 0) {
    throw new Error('User 2 saw tasks that belong to user 1!');
  }

  // 10. Test DELETE /api/tasks/:id
  console.log('10. Testing DELETE /api/tasks/:id...');
  const deleteRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/tasks/${task1Id}`,
    method: 'DELETE',
    headers: authHeaders,
  });
  console.log('Delete Response:', deleteRes.status, deleteRes.body.message);
  if (deleteRes.status !== 200) throw new Error('Task delete failed');

  console.log('--- ALL BACKEND INTEGRATION TESTS PASSED SUCCESSFULLY! ---');
  process.exit(0);
}

// Wait for server to start, then execute tests
setTimeout(() => {
  runTests().catch((err) => {
    console.error('TEST SUITE FAILED:', err);
    process.exit(1);
  });
}, 2500);
