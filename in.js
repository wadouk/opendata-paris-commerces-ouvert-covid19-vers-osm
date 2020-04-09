const t = require('./coronavirus-commercants-parisiens-livraison-a-domicile.json');

const r = {
  'Alimentation générale et produits de première nécessité': {'shop': 'convenience'}
  , 'Articles médicaux et orthopédiques': {'shop': 'medical_supply'}
  , 'Blanchisserie-teinturerie': {'shop': 'laundry'}
  , 'Boucherie - charcuterie - rôtisserie': {'shop': 'butcher'}
  , 'Boulangerie - pâtisserie': {'shop': 'bakery'}
  , 'Bricolage': {'shop': 'doityourself'}
  , 'Commerce de détail de boissons': {'shop': 'wine'}
  , 'Épicerie fine': {'shop': 'deli'}
  , 'Équipements informatiques': {'shop': 'computer'}
  , 'Fromagerie': {'shop': 'cheese'}
  , 'Pharmacies et parapharmacies': {'amenity': 'pharmacy'}
  , 'Poissonnerie': {'shop': 'seafood'}
  , 'Presse et papeterie': {'shop': 'newsagent'}
  , 'Primeur': {'shop': 'greengrocer'}
  , 'Restaurant ou traiteur': {'shop': 'restaurant'}
};

function toOSMTags (u) {
  const {fields} = u;
  const {precisions, type_de_commerce} = fields;

  return r[type_de_commerce]
}

function toISOTel(tel) {
  return tel ? tel.replace(/0(\d)[ \.](\d{2})[ \.](\d{2})[ \.](\d{2})[ \.](\d{2})/, '+33 $1 $2 $3 $4 $5') : tel
}

const o = {
  type: 'FeatureCollection',
  features: t.map(u => ({
    type: 'Feature',
    geometry: u.fields.geo_shape,
    properties: {
      'contact:email': u.fields.mail,
      name: u.fields.nom_du_commerce,
      'source': u.datasetid,
      'opening_hours:covid19': 'open',
      'note': u.fields.precisions,
      website: u.fields.site_internet,
      'contact:phone': toISOTel(u.fields.telephone),
      'delivery:covid19': true,
      ...toOSMTags(u)
    }
  }))
};

console.log(JSON.stringify(o, null, 2));