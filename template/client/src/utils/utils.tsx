
/**
 * Remove duplicates from an array
 * @param collection 
 * @returns 
 */
export function removeDuplicates<T>(collection: T[]): T[] {
  const result: T[] = []
  collection.forEach((item) => {
    if (result.indexOf(item) < 0) {
      result.push(item)
    }
  });
  return result;
}