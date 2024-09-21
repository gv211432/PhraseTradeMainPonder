
// can be replaced with a more sophisticated logger like winston, bunyan, etc.
export const logger = console;

// can be replaced with a more sophisticated error handling mechanism
export const digestError = async (msg: string, error: Error) => {
  logger.error(msg, error);
};