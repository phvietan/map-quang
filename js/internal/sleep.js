/**
 * Attempt to sleep for ms miliseconds
 * @param {number} ms
 */
 export async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}
