// Async utility functions for safer async operations

export const safeAsync = async (asyncFn, fallbackValue = null) => {
  try {
    return await asyncFn();
  } catch (error) {
    console.error('Async operation failed:', error);
    return fallbackValue;
  }
};

export const safeAsyncWithLoading = async (asyncFn, setLoading, fallbackValue = null) => {
  try {
    setLoading(true);
    return await asyncFn();
  } catch (error) {
    console.error('Async operation failed:', error);
    return fallbackValue;
  } finally {
    setLoading(false);
  }
};

export const createAsyncHandler = (errorHandler) => {
  return (asyncFn) => {
    return async (...args) => {
      try {
        return await asyncFn(...args);
      } catch (error) {
        if (errorHandler) {
          errorHandler(error);
        } else {
          console.error('Async operation failed:', error);
        }
        return null;
      }
    };
  };
};

export const withTimeout = (asyncFn, timeout = 5000) => {
  return async (...args) => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Operation timed out')), timeout);
    });
    
    try {
      return await Promise.race([asyncFn(...args), timeoutPromise]);
    } catch (error) {
      throw error;
    }
  };
};

export const retryAsync = async (asyncFn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await asyncFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}; 