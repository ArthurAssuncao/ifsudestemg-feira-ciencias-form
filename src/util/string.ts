const ignorePrepositionsList = [
  "de",
  "do",
  "da",
  "dos",
  "das",
  "a",
  "o",
  "e",
  "em",
  "na",
  "no",
  "nos",
  "nas",
  "ao",
  "aos",
  "aos",
  "ao",
  "à",
  "às",
  "às",
  "ào",
  "àos",
  "àos",
  "ào",
  "as",
  "as",
  "os",
  "os",
  "os",
  "a",
  "o",
  "e",
  "em",
  "na",
  "no",
  "nos",
  "nas",
  "ao",
  "aos",
  "aos",
  "ao",
  "à",
  "às",
  "às",
  "ào",
  "àos",
  "àos",
  "ào",
  "as",
  "as",
  "os",
  "os",
  "os",
];

export function toTitleCase(
  str: string,
  ignorePrepositions: boolean = false
): string {
  if (!str) {
    return "";
  }
  return str
    .toLowerCase() // Convert the entire string to lowercase first
    .split(" ") // Split the string into an array of words
    .map(function (word: string) {
      // Capitalize the first letter of each word and lowercase the rest
      if (ignorePrepositions && ignorePrepositionsList.includes(word)) {
        return word.toLocaleLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
    })
    .join(" "); // Join the words back into a single string with spaces
}
