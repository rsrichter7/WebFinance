// ─── Categorie configuratie ───
// Koppelt categorienamen aan icoon-key en T-token kleursleutels.
// Gebruik: T[config.colorKey] en T[config.softKey] in componenten.

export const CATEGORY_CONFIG = {
  'Wonen':                  { icon: 'home',    colorKey: 'blue',   softKey: 'blueSoft'   },
  'Vervoer':                { icon: 'car',     colorKey: 'teal',   softKey: 'tealSoft'   },
  'Dagelijks leven':        { icon: 'coffee',  colorKey: 'amber',  softKey: 'amberSoft'  },
  'Abonnementen & Telecom': { icon: 'wifi',    colorKey: 'violet', softKey: 'violetSoft' },
  'Vrije tijd':             { icon: 'target',  colorKey: 'red',    softKey: 'redSoft'    },
  'Financieel':             { icon: 'coin',    colorKey: 'green',  softKey: 'greenSoft'  },
  'Overig':                 { icon: 'grip',    colorKey: 'ink3',   softKey: 'rule'       },
}
