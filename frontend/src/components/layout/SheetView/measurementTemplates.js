export const CLOTH_TYPES = {
  PANT: "pant",
  SHIRT: "shirt",
  SUIT: "suit",
  KURTA: "kurta",
  SALVAAR: "salvaar",
  BLOUSE: "blouse",
  OTHER: "other",
};

export const MEASUREMENT_TEMPLATES = {
  [CLOTH_TYPES.PANT]: [
    { key: "waist", label: "Waist" },
    { key: "length", label: "Length" },
    { key: "hip", label: "Hip" },
    { key: "thigh", label: "Thigh" },
    { key: "knee", label: "Knee" },
    { key: "bottom", label: "Bottom/Hem" },
    { key: "crotch", label: "Crotch/Rise" },
  ],
  [CLOTH_TYPES.SHIRT]: [
    { key: "length", label: "Length" },
    { key: "shoulder", label: "Shoulder" },
    { key: "sleeve", label: "Sleeve Length" },
    { key: "chest", label: "Chest" },
    { key: "waist", label: "Waist/Stomach" },
    { key: "neck", label: "Neck/Collar" },
    { key: "cuff", label: "Cuff" },
  ],
  [CLOTH_TYPES.SUIT]: [
    { key: "coat_length", label: "Coat Length" },
    { key: "shoulder", label: "Shoulder" },
    { key: "sleeve", label: "Sleeve" },
    { key: "chest", label: "Chest" },
    { key: "waist", label: "Coat Waist" },
    { key: "pant_waist", label: "Trouser Waist" },
    { key: "pant_length", label: "Trouser Length" },
    { key: "crotch", label: "Crotch" },
  ],
  [CLOTH_TYPES.KURTA]: [
    { key: "length", label: "Length" },
    { key: "chest", label: "Chest" },
    { key: "shoulder", label: "Shoulder" },
    { key: "sleeve", label: "Sleeve" },
    { key: "neck", label: "Neck" },
    { key: "side_chaak", label: "Side/Chaak" },
  ],
  [CLOTH_TYPES.SALVAAR]: [
    { key: "length", label: "Length" },
    { key: "waist", label: "Waist/Belt" },
    { key: "hip", label: "Hip" },
    { key: "poncha", label: "Poncha/Bottom" },
  ],
  [CLOTH_TYPES.OTHER]: [
    { key: "notes", label: "Description/Notes" }
  ]
};