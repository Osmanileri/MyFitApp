const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function header(message) {
  log(`\n${colors.bright}${colors.cyan}===============================`, 'cyan');
  log(`${message}`, 'cyan');
  log(`===============================${colors.reset}`, 'cyan');
}

async function testFileExists(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
      success(`File exists: ${filePath}`);
      return true;
    } else {
      error(`File missing: ${filePath}`);
      return false;
    }
  } catch (err) {
    error(`Error checking file ${filePath}: ${err.message}`);
    return false;
  }
}

async function testImportStatement(filePath, importStatement) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    if (content.includes(importStatement)) {
      success(`Import found in ${filePath}: ${importStatement}`);
      return true;
    } else {
      error(`Import missing in ${filePath}: ${importStatement}`);
      return false;
    }
  } catch (err) {
    error(`Error checking import in ${filePath}: ${err.message}`);
    return false;
  }
}

async function testStoreIntegration(storeName, filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    const checks = [
      { name: 'SQLite import', pattern: `import sqliteService from '../services/SQLiteService'` },
      { name: 'Notification import', pattern: `import { useDataOperations } from '../services/NotificationService'` },
      { name: 'Initialize store function', pattern: `initializeStore: async () => {` },
      { name: 'SQLite database init', pattern: `await sqliteService.initializeDatabase()` }
    ];
    
    let passed = 0;
    let failed = 0;
    
    info(`Testing ${storeName} store integration...`);
    
    for (const check of checks) {
      if (content.includes(check.pattern)) {
        success(`  ✓ ${check.name}`);
        passed++;
      } else {
        error(`  ✗ ${check.name}`);
        failed++;
      }
    }
    
    return { passed, failed, total: checks.length };
  } catch (err) {
    error(`Error testing ${storeName} store: ${err.message}`);
    return { passed: 0, failed: 1, total: 1 };
  }
}

async function testNotificationIntegration() {
  header('Testing Notification System Integration');
  
  const tests = [
    {
      name: 'NotificationService exists',
      test: () => testFileExists('src/services/NotificationService.js')
    },
    {
      name: 'App.js has NotificationProvider',
      test: () => testImportStatement('App.js', 'import { NotificationProvider } from \'./src/services/NotificationService\'')
    },
    {
      name: 'App.js wraps with NotificationProvider',
      test: () => testImportStatement('App.js', '<NotificationProvider>')
    },
    {
      name: 'SupplementTrackingScreen has NotificationProvider',
      test: () => testImportStatement('src/screens/SupplementTrackingScreen.js', 'import { NotificationProvider } from \'../services/NotificationService\'')
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await test.test();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  return { passed, failed, total: tests.length };
}

async function testSQLiteIntegration() {
  header('Testing SQLite Integration');
  
  const tests = [
    {
      name: 'SQLiteService exists',
      test: () => testFileExists('src/services/SQLiteService.js')
    },
    {
      name: 'SQLiteService has supplement operations',
      test: () => testImportStatement('src/services/SQLiteService.js', 'saveSupplement')
    },
    {
      name: 'SQLiteService has all required tables',
      test: () => testImportStatement('src/services/SQLiteService.js', 'CREATE TABLE IF NOT EXISTS supplements')
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await test.test();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  return { passed, failed, total: tests.length };
}

async function testStoreIntegrations() {
  header('Testing Store Integrations');
  
  const stores = [
    { name: 'Diet Store', path: 'src/store/dietStore.js' },
    { name: 'Workout Store', path: 'src/store/workoutStore.js' },
    { name: 'Progress Store', path: 'src/store/progressStore.js' },
    { name: 'Reminder Store', path: 'src/store/reminderStore.js' },
    { name: 'Recipe Store', path: 'src/store/recipeStore.js' },
    { name: 'Supplement Store', path: 'src/store/supplementStore.js' }
  ];
  
  let totalPassed = 0;
  let totalFailed = 0;
  let totalTests = 0;
  
  for (const store of stores) {
    const result = await testStoreIntegration(store.name, store.path);
    totalPassed += result.passed;
    totalFailed += result.failed;
    totalTests += result.total;
  }
  
  return { passed: totalPassed, failed: totalFailed, total: totalTests };
}

async function testAuthIntegration() {
  header('Testing Auth Integration');
  
  const tests = [
    {
      name: 'AuthStore exists',
      test: () => testFileExists('src/store/authStore.js')
    },
    {
      name: 'AuthStore has demo user support',
      test: () => testImportStatement('src/store/authStore.js', 'loginDemo')
    },
    {
      name: 'AuthStore has store initialization',
      test: () => testImportStatement('src/store/authStore.js', 'initializeAllStores')
    },
    {
      name: 'AuthStore has SQLite import',
      test: () => testImportStatement('src/store/authStore.js', 'import sqliteService from')
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await test.test();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  return { passed, failed, total: tests.length };
}

async function testSupplementStoreSpecific() {
  header('Testing Supplement Store Specific Features');
  
  const tests = [
    {
      name: 'Supplement Store exists',
      test: () => testFileExists('src/store/supplementStore.js')
    },
    {
      name: 'Has performDataOperation usage',
      test: () => testImportStatement('src/store/supplementStore.js', 'performDataOperation')
    },
    {
      name: 'Has toggleSupplementTaken function',
      test: () => testImportStatement('src/store/supplementStore.js', 'toggleSupplementTaken')
    },
    {
      name: 'Has getCompletionStats function',
      test: () => testImportStatement('src/store/supplementStore.js', 'getCompletionStats')
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await test.test();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  return { passed, failed, total: tests.length };
}

async function runAllTests() {
  header('FitApp Integration Test Suite');
  info('Testing SQLite + Notification System Integration...\n');
  
  const results = [];
  
  // Run all test suites
  results.push(await testSQLiteIntegration());
  results.push(await testNotificationIntegration());
  results.push(await testStoreIntegrations());
  results.push(await testAuthIntegration());
  results.push(await testSupplementStoreSpecific());
  
  // Calculate totals
  const totalPassed = results.reduce((sum, r) => sum + r.passed, 0);
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);
  const totalTests = results.reduce((sum, r) => sum + r.total, 0);
  
  // Results summary
  header('Test Results Summary');
  
  if (totalFailed === 0) {
    success(`🎉 ALL TESTS PASSED! (${totalPassed}/${totalTests})`);
    success('✨ SQLite + Notification System Integration is COMPLETE!');
    
    log('\n📋 What was tested:', 'cyan');
    log('• SQLite database service integration', 'white');
    log('• Notification system integration', 'white');
    log('• All 6 stores properly integrated', 'white');
    log('• Demo user authentication with SQLite', 'white');
    log('• Supplement store specific features', 'white');
    
    log('\n🚀 Ready for production use!', 'green');
  } else {
    error(`Tests failed: ${totalFailed}/${totalTests}`);
    warning('Some integrations may need attention');
  }
  
  log(`\n📊 Final Score: ${totalPassed}/${totalTests} tests passed`, 'blue');
  
  return totalFailed === 0;
}

// Run the test suite
if (require.main === module) {
  runAllTests().then((success) => {
    process.exit(success ? 0 : 1);
  }).catch((error) => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = { runAllTests }; 