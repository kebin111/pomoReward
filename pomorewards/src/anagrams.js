export const anagramMap = {
  'eilnst': ['listen', 'silent', 'enlist', 'inlets'],
  'eggloo': ['google', 'gogole'],
  'act': ['cat', 'act', 'tac'],
  'dgo': ['dog', 'god', 'odg'],
  'aet': ['ate', 'eat', 'tea'],
  'aemrs': ['smear', 'reams', 'mares'],
  'aelp': ['leap', 'pale', 'plea', 'peal'],
  'aer': ['are', 'ear', 'era'],
  'aopst': ['stoap', 'atops', 'pasto', 'potas', 'sapto', 'stopa'],
  'eilv': ['evil', 'vile', 'live', 'veil'],
  'acdr': ['card', 'darc', 'arcd'],
  'aoprrt': ['raptor', 'partor'],
  'acelrt': ['claret', 'rectal', 'cartel'],
  'aemnrt': ['matern', 'mental', 'lament'],
  'aeginr': ['regain', 'earing', 'gainer'],
  'aeglst': ['stale', 'least', 'slate', 'steal', 'teals'],
  'aegrst': ['stager', 'grates', 'gaster', 'greats'],
  'acelps': ['places', 'scalep', 'caples'],
  'acdenr': ['dancer', 'craned', 'nacred'],
  'aenrst': ['astern', 'sterna', 'nearest'],
  'aeprst': ['paster', 'reapts', 'tapers', 'spater'],
  'aeilnt': ['entail', 'tenail', 'latine'],
  'adeprs': ['spared', 'drapes', 'spread', 'parsed'],
  'aeprsw': ['sawper', 'reswap', 'wasper'],
  'aceprs': ['recaps', 'spacer', 'scrape', 'capers'],
  'acelst': ['castle', 'cleats', 'eclats'],
  'acehlt': ['lechat', 'chetal', 'lachet'],
  'aehlrt': ['halter', 'lather', 'thaler'],
  'aegrsu': ['sauger', 'argues', 'augers'],
  'acders': ['cedars', 'scared', 'dearcs'],
  'aelrst': ['alerts', 'alters', 'artels', 'estral', 'slater'],
  'acehrt': ['rachet', 'cheatr', 'rechat', 'chater'],
};


export const countMap = Object.fromEntries(
  Object.entries(anagramMap).map(([key, words]) => [key, words.length])
);