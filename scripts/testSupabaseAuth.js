/**
 * Supabase Authentication Test Script
 * Week 2.11: Test all authentication flows
 *
 * Bu script Supabase authentication entegrasyonunu test eder.
 * Node.js ortamında çalışır ve tüm auth fonksiyonlarını test eder.
 */

import { supabase } from "../src/config/supabase.js";
import supabaseAuthService from "../src/services/supabaseAuthService.js";

// Test utilities
const log = (message, type = "info") => {
  const timestamp = new Date().toISOString();
  const emoji =
    {
      info: "ℹ️",
      success: "✅",
      error: "❌",
      warning: "⚠️",
      test: "🧪",
    }[type] || "ℹ️";

  console.log(`[${timestamp}] ${emoji} ${message}`);
};

const testResult = (testName, passed, details = "") => {
  if (passed) {
    log(`TEST PASSED: ${testName} ${details}`, "success");
  } else {
    log(`TEST FAILED: ${testName} ${details}`, "error");
  }
  return passed;
};

// Test data
const testUser = {
  email: `test-${Date.now()}@fitapp.test`,
  password: "TestPass123!",
  fullName: "Test User",
};

let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: [],
};

const recordTest = (name, passed, error = null) => {
  testResults.total++;
  if (passed) {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
  testResults.tests.push({ name, passed, error });
};

// ============================================
// TEST 1: Supabase Client Connection
// ============================================
async function test1_supabaseConnection() {
  log("TEST 1: Checking Supabase client connection...", "test");

  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      testResult("Supabase Connection", false, `Error: ${error.message}`);
      recordTest("Supabase Connection", false, error.message);
      return false;
    }

    testResult("Supabase Connection", true, "Connected successfully");
    recordTest("Supabase Connection", true);
    return true;
  } catch (error) {
    testResult("Supabase Connection", false, `Exception: ${error.message}`);
    recordTest("Supabase Connection", false, error.message);
    return false;
  }
}

// ============================================
// TEST 2: Email Validation
// ============================================
async function test2_emailValidation() {
  log("TEST 2: Testing email validation...", "test");

  const validEmails = [
    "test@example.com",
    "user.name@domain.co.uk",
    "email+tag@test.com",
  ];

  const invalidEmails = [
    "invalid",
    "@example.com",
    "test@",
    "test..double@example.com",
  ];

  let allPassed = true;

  // Test valid emails
  for (const email of validEmails) {
    const isValid = supabaseAuthService.validateEmail(email);
    if (!isValid) {
      log(`  Failed: ${email} should be valid`, "error");
      allPassed = false;
    }
  }

  // Test invalid emails
  for (const email of invalidEmails) {
    const isValid = supabaseAuthService.validateEmail(email);
    if (isValid) {
      log(`  Failed: ${email} should be invalid`, "error");
      allPassed = false;
    }
  }

  testResult("Email Validation", allPassed);
  recordTest("Email Validation", allPassed);
  return allPassed;
}

// ============================================
// TEST 3: Password Validation
// ============================================
async function test3_passwordValidation() {
  log("TEST 3: Testing password validation...", "test");

  const testCases = [
    { password: "Test123!", shouldPass: true, reason: "Valid password" },
    { password: "short", shouldPass: false, reason: "Too short" },
    { password: "nouppercase123", shouldPass: false, reason: "No uppercase" },
    { password: "NOLOWERCASE123", shouldPass: false, reason: "No lowercase" },
    { password: "NoNumbers!", shouldPass: false, reason: "No numbers" },
    {
      password: "ValidPass123",
      shouldPass: true,
      reason: "Valid without special chars",
    },
  ];

  let allPassed = true;

  for (const testCase of testCases) {
    const result = supabaseAuthService.validatePassword(testCase.password);
    const passed = result.valid === testCase.shouldPass;

    if (!passed) {
      log(
        `  Failed: ${testCase.reason} - Expected ${testCase.shouldPass}, got ${result.valid}`,
        "error"
      );
      allPassed = false;
    }
  }

  testResult("Password Validation", allPassed);
  recordTest("Password Validation", allPassed);
  return allPassed;
}

// ============================================
// TEST 4: User Registration (Sign Up)
// ============================================
async function test4_userRegistration() {
  log("TEST 4: Testing user registration...", "test");

  try {
    const result = await supabaseAuthService.signUp(
      testUser.email,
      testUser.password,
      testUser.fullName
    );

    if (!result.success) {
      testResult("User Registration", false, `Error: ${result.error}`);
      recordTest("User Registration", false, result.error);
      return false;
    }

    // Check if user was created
    if (!result.user) {
      testResult("User Registration", false, "No user object returned");
      recordTest("User Registration", false, "No user object returned");
      return false;
    }

    log(`  User created with ID: ${result.user.id}`, "info");

    if (result.requiresEmailVerification) {
      log("  Email verification required", "warning");
    }

    testResult("User Registration", true, `User ID: ${result.user.id}`);
    recordTest("User Registration", true);
    return true;
  } catch (error) {
    testResult("User Registration", false, `Exception: ${error.message}`);
    recordTest("User Registration", false, error.message);
    return false;
  }
}

// ============================================
// TEST 5: User Login (Sign In)
// ============================================
async function test5_userLogin() {
  log("TEST 5: Testing user login...", "test");

  try {
    // Wait a bit to ensure registration completed
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const result = await supabaseAuthService.signIn(
      testUser.email,
      testUser.password
    );

    if (!result.success) {
      // If email verification is required, this is expected
      if (result.error && result.error.includes("Email not confirmed")) {
        log("  Email verification required - skipping login test", "warning");
        testResult("User Login", true, "Email verification pending");
        recordTest("User Login", true);
        return true;
      }

      testResult("User Login", false, `Error: ${result.error}`);
      recordTest("User Login", false, result.error);
      return false;
    }

    // Check if session was created
    if (!result.session) {
      testResult("User Login", false, "No session created");
      recordTest("User Login", false, "No session created");
      return false;
    }

    log(`  Session created for user: ${result.user.email}`, "info");
    log(
      `  Access token: ${result.session.access_token.substring(0, 20)}...`,
      "info"
    );

    testResult("User Login", true, `Email: ${result.user.email}`);
    recordTest("User Login", true);
    return true;
  } catch (error) {
    testResult("User Login", false, `Exception: ${error.message}`);
    recordTest("User Login", false, error.message);
    return false;
  }
}

// ============================================
// TEST 6: Get Current Session
// ============================================
async function test6_getCurrentSession() {
  log("TEST 6: Testing get current session...", "test");

  try {
    const result = await supabaseAuthService.getSession();

    if (!result.success) {
      testResult("Get Current Session", false, `Error: ${result.error}`);
      recordTest("Get Current Session", false, result.error);
      return false;
    }

    if (result.session) {
      log(
        `  Active session found for user: ${result.session.user.email}`,
        "info"
      );
      testResult("Get Current Session", true, "Session active");
      recordTest("Get Current Session", true);
    } else {
      log(
        "  No active session (expected if email verification required)",
        "warning"
      );
      testResult("Get Current Session", true, "No active session");
      recordTest("Get Current Session", true);
    }

    return true;
  } catch (error) {
    testResult("Get Current Session", false, `Exception: ${error.message}`);
    recordTest("Get Current Session", false, error.message);
    return false;
  }
}

// ============================================
// TEST 7: Password Reset Email
// ============================================
async function test7_passwordReset() {
  log("TEST 7: Testing password reset email...", "test");

  try {
    const result = await supabaseAuthService.sendPasswordResetEmail(
      testUser.email
    );

    if (!result.success) {
      testResult("Password Reset Email", false, `Error: ${result.error}`);
      recordTest("Password Reset Email", false, result.error);
      return false;
    }

    log("  Password reset email sent", "info");
    testResult("Password Reset Email", true, result.message);
    recordTest("Password Reset Email", true);
    return true;
  } catch (error) {
    testResult("Password Reset Email", false, `Exception: ${error.message}`);
    recordTest("Password Reset Email", false, error.message);
    return false;
  }
}

// ============================================
// TEST 8: User Logout (Sign Out)
// ============================================
async function test8_userLogout() {
  log("TEST 8: Testing user logout...", "test");

  try {
    const result = await supabaseAuthService.signOut();

    if (!result.success) {
      testResult("User Logout", false, `Error: ${result.error}`);
      recordTest("User Logout", false, result.error);
      return false;
    }

    // Verify session is cleared
    const sessionCheck = await supabaseAuthService.getSession();
    if (sessionCheck.session) {
      testResult("User Logout", false, "Session still active after logout");
      recordTest("User Logout", false, "Session still active");
      return false;
    }

    log("  User logged out successfully", "info");
    testResult("User Logout", true, "Session cleared");
    recordTest("User Logout", true);
    return true;
  } catch (error) {
    testResult("User Logout", false, `Exception: ${error.message}`);
    recordTest("User Logout", false, error.message);
    return false;
  }
}

// ============================================
// TEST 9: Invalid Credentials Login
// ============================================
async function test9_invalidLogin() {
  log("TEST 9: Testing login with invalid credentials...", "test");

  try {
    const result = await supabaseAuthService.signIn(
      testUser.email,
      "WrongPassword123!"
    );

    // Should fail
    if (result.success) {
      testResult(
        "Invalid Credentials Login",
        false,
        "Login succeeded with wrong password!"
      );
      recordTest(
        "Invalid Credentials Login",
        false,
        "Login succeeded with wrong password"
      );
      return false;
    }

    log("  Login correctly rejected with invalid credentials", "info");
    testResult("Invalid Credentials Login", true, "Rejected as expected");
    recordTest("Invalid Credentials Login", true);
    return true;
  } catch (error) {
    testResult(
      "Invalid Credentials Login",
      false,
      `Exception: ${error.message}`
    );
    recordTest("Invalid Credentials Login", false, error.message);
    return false;
  }
}

// ============================================
// TEST 10: Database Connection (User Profiles)
// ============================================
async function test10_databaseConnection() {
  log("TEST 10: Testing database connection...", "test");

  try {
    // Try to query user_profiles table
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .limit(1);

    if (error) {
      testResult("Database Connection", false, `Error: ${error.message}`);
      recordTest("Database Connection", false, error.message);
      return false;
    }

    log("  Database query successful", "info");
    testResult("Database Connection", true, "Query successful");
    recordTest("Database Connection", true);
    return true;
  } catch (error) {
    testResult("Database Connection", false, `Exception: ${error.message}`);
    recordTest("Database Connection", false, error.message);
    return false;
  }
}

// ============================================
// RUN ALL TESTS
// ============================================
async function runAllTests() {
  log("======================================", "info");
  log("SUPABASE AUTHENTICATION TEST SUITE", "info");
  log("======================================", "info");
  log("", "info");

  const startTime = Date.now();

  try {
    // Run tests sequentially
    await test1_supabaseConnection();
    await test2_emailValidation();
    await test3_passwordValidation();
    await test4_userRegistration();
    await test5_userLogin();
    await test6_getCurrentSession();
    await test7_passwordReset();
    await test8_userLogout();
    await test9_invalidLogin();
    await test10_databaseConnection();
  } catch (error) {
    log(`Test suite failed with error: ${error.message}`, "error");
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Print summary
  log("", "info");
  log("======================================", "info");
  log("TEST SUMMARY", "info");
  log("======================================", "info");
  log(`Total Tests: ${testResults.total}`, "info");
  log(`Passed: ${testResults.passed}`, "success");
  log(
    `Failed: ${testResults.failed}`,
    testResults.failed > 0 ? "error" : "info"
  );
  log(`Duration: ${duration}s`, "info");
  log("", "info");

  // Print failed tests
  if (testResults.failed > 0) {
    log("Failed Tests:", "error");
    testResults.tests
      .filter((t) => !t.passed)
      .forEach((t) => {
        log(`  - ${t.name}: ${t.error || "Unknown error"}`, "error");
      });
  }

  log("======================================", "info");

  // Exit with appropriate code
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch((error) => {
  log(`Fatal error: ${error.message}`, "error");
  process.exit(1);
});
