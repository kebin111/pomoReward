export const anagramMap = {
    'eilnst': ['listen', 'silent', 'enlist', 'inlets'],
    'eggloo': ['google', 'gogole'],
    'act': ['cat', 'act', 'tac'],
    'dgo': ['dog', 'god', 'odg'],
}


export const countMap = Object.fromEntries(
  Object.entries(anagramMap).map(([key, words]) => [key, words.length])
);