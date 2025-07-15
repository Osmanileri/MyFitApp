/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {number} [age]
 * @property {number} [weight]
 * @property {number} [height]
 * @property {'male'|'female'} [gender]
 * @property {'sedentary'|'light'|'moderate'|'active'|'very_active'} [activityLevel]
 * @property {'lose'|'maintain'|'gain'} [goal]
 * @property {number} [dailyCalorieGoal]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} AuthState
 * @property {User|null} user
 * @property {boolean} isAuthenticated
 * @property {boolean} isLoading
 * @property {string|null} error
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterData
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} confirmPassword
 */

// Export empty object for imports (JavaScript modules need something to export)
export default {}; 