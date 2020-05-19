const t = require('./coronavirus-commercants-parisiens-livraison-a-domicile.json');
const enrich = require('./enrich.json');

const r = {
  'Alimentation générale et produits de première nécessité': {'shop': 'convenience;supermarket'}
  , 'Articles médicaux et orthopédiques': {'shop': 'medical_supply'}
  , 'Blanchisserie-teinturerie': {'shop': 'laundry'}
  , 'Boucherie - charcuterie - rôtisserie': {'shop': 'butcher'}
  , 'Boulangerie - pâtisserie': {'shop': 'bakery;pastry'}
  , 'Bricolage': {'shop': 'doityourself'}
  , 'Commerce de détail de boissons': {'shop': 'wine'}
  , 'Épicerie fine': {'shop': 'deli'}
  , 'Équipements informatiques': {'shop': 'computer'}
  , 'Fromagerie': {'shop': 'cheese'}
  , 'Pharmacies et parapharmacies': {'amenity': 'pharmacy'}
  , 'Poissonnerie': {'shop': 'seafood'}
  , 'Presse et papeterie': {'shop': 'newsagent'}
  , 'Primeur': {'shop': 'greengrocer;farm'}
  , 'Restaurant ou traiteur': {'amenity': 'restaurant;fast_food', "craft" : "caterer"}
};

function toOSMTags (u) {
  const {fields} = u;
  const {precisions, type_de_commerce} = fields;

  return r[type_de_commerce];
}

function toISOTel (tel) {
  return tel ? tel.replace(/0(\d)[ \.](\d{2})[ \.](\d{2})[ \.](\d{2})[ \.](\d{2})/, '+33 $1$2$3$4$5') : tel;
}

function toProperties (u, e) {
  const c = e.filter(e2 => e2.mail === u.fields['mail'])[0]

  if (c) {
    return
  }

  let newVar = {
    'contact:email': u.fields.mail,
    name: u.fields.nom_du_commerce,
    'opening_hours:covid19': 'open',
    'delivery:covid19': 'yes',
    'note': u.fields.precisions,
    website: u.fields.site_internet,
    'contact:phone': toISOTel(u.fields.telephone),
    ...toOSMTags(u),
  };
  return newVar;
}

function filterEmptyTags(o) {
  return o ? Object.entries(o)
    .filter(([k, v]) => Boolean(v) || k === 'mail')
    .reduce((o2, [k, v]) => {
      o2[k] = k === 'contact:phone'? toISOTel(v) : v
      return o2
  }, {}) : {}

}

const o = {
  type: 'FeatureCollection',
  features: t.map(u => ({
    type: 'Feature',
    id: u.recordid,
    geometry: u.fields.geo_shape,
    properties: toProperties(u, enrich)
  }))
};

console.log(JSON.stringify(o, null, 2));