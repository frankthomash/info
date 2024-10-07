/**
 * Creates an error message object.
 * @param {string} type - The type of the error.
 * @param {number} errorCode - The error code associated with the error.
 * @param {string | object} error - A descriptive error message or object.
 * @returns {ErrorMessage} An object containing the error details.
 */

// Define the return type for the function
interface ErrorMessage {
  type: string;
  errorCode: number;
  error: string | object;
}

function createErrorMessage(type: string, errorCode: number, error: string | object): ErrorMessage {
  return { type: `${type}:status`, errorCode, error };
}

// Export using ES module syntax
export { createErrorMessage };
