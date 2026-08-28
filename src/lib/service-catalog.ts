export type TradeStatus = "handyman_ok" | "caution" | "licensed_required" | "do_not_accept";
export type PricingMode = "informal_floor" | "solo_freelancer" | "insured_company";
export type Confidence = "low" | "medium" | "high";

export type PriceBand = { low: number; target: number; high: number };
export type AddOn = { id: string; label: string; price: number };

export type ServiceJob = {
  id: string;
  category: string;
  name: string;
  pricingUnit: string;
  unitLabel: string;
  includedQuantity: number;
  defaultQuantity: number;
  additionalUnitPrice: number;
  pricing: Record<PricingMode, PriceBand>;
  materialAllowance: number;
  tradeStatus: TradeStatus;
  confidence: Confidence;
  sourceConfidence: string;
  included: string[];
  notIncluded: string[];
  stopConditions: string;
  sources: string[];
  addOns: AddOn[];
};

export const pricingModes: Array<{ id: PricingMode; label: string; note: string; minimumVisit: number }> = [
  { id: "informal_floor", label: "Informal floor", note: "Classifieds, teaser ads, low platform intro rates. Context only, not the recommended quote.", minimumVisit: 100 },
  { id: "solo_freelancer", label: "Solo freelancer", note: "Recommended default for Louie: capable Toronto freelancer with tools, prep, and basic professionalism.", minimumVisit: 140 },
  { id: "insured_company", label: "Company comparison", note: "Formal company or specialist pricing with higher overhead. Use as comparison.", minimumVisit: 175 },
];

export const conditionAdjustments = [
  { id: "easy", label: "Easy", amount: -20, note: "Clear photos, simple access, no prep surprises." },
  { id: "normal", label: "Normal", amount: 0, note: "Typical Toronto small-job conditions." },
  { id: "difficult", label: "Difficult", amount: 50, note: "Extra prep, awkward access, seized parts, or slower work." },
  { id: "unknown", label: "Unknown", amount: 35, note: "Use until photos confirm exact scope." },
];

export const travelOptions = [
  { id: "nearby", label: "Nearby or bundled", amount: 0, note: "Very close, or combined with other work." },
  { id: "normal", label: "Normal Toronto travel", amount: 30, note: "Regular drive/transit time and travel friction." },
  { id: "far", label: "Far or difficult travel", amount: 60, note: "Longer distance, awkward route, or hard schedule." },
];

export const parkingOptions = [
  { id: "none", label: "No parking", amount: 0 },
  { id: "estimate", label: "Parking estimate", amount: 20 },
  { id: "downtown", label: "Downtown parking", amount: 35 },
];

export const accessOptions = [
  { id: "easy", label: "House or easy access", amount: 0, note: "No concierge/elevator/loading delay." },
  { id: "condo", label: "Condo/elevator/security", amount: 40, note: "Adds time for parking, concierge, elevator, and setup." },
  { id: "difficult", label: "Difficult access", amount: 75, note: "Use when access uncertainty can eat the schedule." },
];

export const materialOptions = [
  { id: "client", label: "Client supplies materials", defaultMarkupPercent: 0, defaultPickupFee: 0, note: "Adds no parts cost. Labour and expenses only." },
  { id: "stock", label: "I supply from stock", defaultMarkupPercent: 25, defaultPickupFee: 0, note: "Use for parts or consumables you already have." },
  { id: "standard-pickup", label: "I buy standard parts", defaultMarkupPercent: 25, defaultPickupFee: 40, note: "Default: material cost + 25% markup + $40 shopping/pickup fee." },
  { id: "special-order", label: "Special-order or matching parts", defaultMarkupPercent: 30, defaultPickupFee: 75, note: "Use when matching, returns, or multiple stores are likely." },
];

export const urgencyOptions = [
  { id: "scheduled", label: "Scheduled", type: "flat", amount: 0 },
  { id: "same-day", label: "Same day", type: "flat", amount: 75 },
  { id: "evening-weekend", label: "Evening or weekend", type: "percent", amount: 0.3 },
] as const;

const sameFixtureAddOnGroups = {
  toilet: [
    { id: "toilet-supply-line", label: "Replace toilet supply line", price: 35 },
    { id: "toilet-fill-valve", label: "Replace fill valve", price: 60 },
    { id: "toilet-flush-valve", label: "Replace flush valve", price: 90 },
    { id: "toilet-handle-flapper", label: "Replace flush handle, chain, or flapper", price: 45 },
    { id: "toilet-seat", label: "Replace toilet seat", price: 55 },
    { id: "toilet-tank-bolts", label: "Replace corroded tank bolts/gasket", price: 50 },
  ],
  sink: [
    { id: "sink-supply-lines", label: "Replace faucet supply lines", price: 40 },
    { id: "sink-faucet", label: "Replace faucet while under-sink area is open", price: 100 },
    { id: "sink-pop-up-po-plug", label: "Replace pop-up drain / PO plug", price: 75 },
    { id: "sink-basket-strainer", label: "Replace kitchen basket strainer", price: 90 },
    { id: "sink-p-trap", label: "Replace P-trap", price: 75 },
    { id: "sink-minor-snake", label: "Minor sink snake while trap is off", price: 75 },
    { id: "sink-caulk", label: "Remove and redo sink caulk/silicone", price: 50 },
  ],
  interiorDoor: [
    { id: "door-knob-lock", label: "Replace knob, lever, or lockset", price: 65 },
    { id: "door-hinges", label: "Replace or repair door hinges (set of 3)", price: 65 },
    { id: "door-strike-plate", label: "Adjust or replace strike plate", price: 35 },
    { id: "door-stop", label: "Install or replace door stop", price: 25 },
    { id: "door-latch-adjustment", label: "Adjust door latch alignment", price: 30 },
  ],
  exteriorDoor: [
    { id: "door-weather-strip", label: "Replace door weather stripping", price: 55 },
    { id: "door-sweep", label: "Install or replace door sweep", price: 40 },
    { id: "door-peephole", label: "Install peephole / door viewer", price: 55 },
    { id: "door-guard", label: "Install chain lock or swing-bar guard", price: 55 },
  ],
  closetDoor: [
    { id: "closet-pivots", label: "Replace bifold pivot and guide hardware", price: 55 },
    { id: "closet-track", label: "Replace standard closet-door track", price: 85 },
    { id: "closet-rollers", label: "Replace sliding-door rollers", price: 65 },
    { id: "closet-pull", label: "Install or replace closet-door pull", price: 30 },
  ],
  windowScreen: [
    { id: "screen-spline", label: "Replace screen spline", price: 30 },
    { id: "screen-corners", label: "Replace screen-frame corners", price: 45 },
    { id: "screen-pet-mesh", label: "Upgrade to pet-resistant mesh", price: 35 },
  ],
} satisfies Record<string, AddOn[]>;

const sameFixtureGroupsByJobId: Record<string, Array<keyof typeof sameFixtureAddOnGroups>> = {
  "toilet-seat-replacement": ["toilet"],
  "toilet-bowl-replacement-reset": ["toilet"],
  "toilet-tank-replacement": ["toilet"],
  "toilet-fill-valve-replacement": ["toilet"],
  "toilet-flush-valve-replacement": ["toilet"],
  "toilet-handle-chain-flapper-repair": ["toilet"],
  "vanity-sink-replacement": ["sink"],
  "faucet-replacement-visible-shutoffs": ["sink"],
  "pop-up-po-plug-replacement": ["sink"],
  "basket-strainer-replacement": ["sink"],
  "p-trap-replacement-visible": ["sink"],
  "faucet-aerator-replacement-cleaning": ["sink"],
  "minor-sink-unplugging-hand-snake": ["sink"],
  "door-knob-lever-replacement-existing-bore-latch-prep": ["interiorDoor"],
  "deadbolt-replacement-in-existing-bore": ["interiorDoor", "exteriorDoor"],
  "new-deadbolt-drilling-and-install": ["interiorDoor", "exteriorDoor"],
  "hinge-replacement": ["interiorDoor"],
  "hinge-screw-repair-long-screws-plug-stripped-holes": ["interiorDoor"],
  "strike-latch-adjustment-for-door-that-will-not-latch": ["interiorDoor"],
  "door-stopper-install-or-replacement": ["interiorDoor"],
  "door-closer-adjustment-or-replacement": ["interiorDoor", "exteriorDoor"],
  "door-sweep-and-weatherstrip-replacement": ["exteriorDoor"],
  "peephole-door-viewer-install": ["exteriorDoor"],
  "chain-lock-or-swing-bar-door-guard-install": ["exteriorDoor"],
  "smart-lock-install-setup-existing-compatible-bore": ["interiorDoor", "exteriorDoor"],
  "bifold-closet-door-adjustment-repair": ["closetDoor"],
  "sliding-closet-door-roller-track-repair": ["closetDoor"],
  "window-screen-mesh-replacement": ["windowScreen"],
  "screen-spline-replacement-re-tension": ["windowScreen"],
  "screen-frame-corner-repair": ["windowScreen"],
};

const equivalentAddOnsByPrimaryJobId: Record<string, string[]> = {
  "toilet-seat-replacement": ["toilet-seat"],
  "toilet-bowl-replacement-reset": ["toilet-seat", "toilet-supply-line"],
  "toilet-tank-replacement": ["toilet-supply-line"],
  "toilet-fill-valve-replacement": ["toilet-fill-valve", "toilet-supply-line"],
  "toilet-flush-valve-replacement": ["toilet-flush-valve", "toilet-fill-valve", "toilet-tank-bolts"],
  "toilet-handle-chain-flapper-repair": ["toilet-handle-flapper"],
  "vanity-sink-replacement": ["sink-faucet", "sink-caulk"],
  "faucet-replacement-visible-shutoffs": ["sink-faucet", "sink-supply-lines"],
  "pop-up-po-plug-replacement": ["sink-pop-up-po-plug"],
  "basket-strainer-replacement": ["sink-basket-strainer"],
  "p-trap-replacement-visible": ["sink-p-trap"],
  "minor-sink-unplugging-hand-snake": ["sink-minor-snake", "sink-p-trap"],
  "door-knob-lever-replacement-existing-bore-latch-prep": ["door-knob-lock"],
  "door-hinge-replacement-repair-existing-mortise": ["door-hinges"],
  "hinge-replacement": ["door-hinges"],
  "strike-latch-adjustment-for-door-that-will-not-latch": ["door-strike-plate", "door-latch-adjustment"],
  "door-stopper-install-or-replacement": ["door-stop"],
  "door-sweep-and-weatherstrip-replacement": ["door-weather-strip", "door-sweep"],
  "peephole-door-viewer-install": ["door-peephole"],
  "chain-lock-or-swing-bar-door-guard-install": ["door-guard"],
  "bifold-closet-door-adjustment-repair": ["closet-pivots"],
  "sliding-closet-door-roller-track-repair": ["closet-rollers"],
  "window-screen-mesh-replacement": ["screen-spline"],
  "screen-spline-replacement-re-tension": ["screen-spline"],
  "screen-frame-corner-repair": ["screen-corners"],
  "door-weather-stripping-replacement": ["door-weather-strip"],
};

export function getSameFixtureAddOns(job: ServiceJob): AddOn[] {
  const excluded = new Set(equivalentAddOnsByPrimaryJobId[job.id] ?? []);
  const addOns = [...job.addOns];

  for (const group of sameFixtureGroupsByJobId[job.id] ?? []) {
    addOns.push(...sameFixtureAddOnGroups[group]);
  }

  const seen = new Set<string>();
  return addOns.filter((item) => {
    if (excluded.has(item.id) || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export const serviceJobs: ServiceJob[] = [
  {
    "id": "door-knob-lever-replacement-existing-bore-latch-prep",
    "category": "Doors, locks, and hardware",
    "name": "Door knob/lever replacement, existing bore/latch prep",
    "pricingUnit": "per knob/lever set, labour only, customer supplies hardware",
    "unitLabel": "door/item",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 48,
    "pricing": {
      "informal_floor": {
        "low": 46,
        "target": 77,
        "high": 120
      },
      "solo_freelancer": {
        "low": 70,
        "target": 110,
        "high": 160
      },
      "insured_company": {
        "low": 150,
        "target": 200,
        "high": 250
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "medium",
    "included": [
      "$90-$150 first set",
      "$35-$60 each additional same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if exterior security door is damaged, bore/backset is non-standard, latch mortise needs major routing, multipoint/mortise lock, access-control wiring, or condo/fire-door approval is required.",
    "sources": [
      "https://www.taskrabbit.ca/cost-guides/general-handyman",
      "https://buildman.ca/handyman-cost-toronto.html",
      "https://taskpin.co/services/door_repair",
      "https://www.homestars.com/handyman-services/locksmith-pros/toronto"
    ],
    "addOns": []
  },
  {
    "id": "deadbolt-replacement-in-existing-bore",
    "category": "Doors, locks, and hardware",
    "name": "Deadbolt replacement in existing bore",
    "pricingUnit": "per deadbolt, existing standard 2-1/8 in bore and aligned strike, labour only",
    "unitLabel": "door/item",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 75,
    "pricing": {
      "informal_floor": {
        "low": 65,
        "target": 98,
        "high": 150
      },
      "solo_freelancer": {
        "low": 100,
        "target": 140,
        "high": 200
      },
      "insured_company": {
        "low": 150,
        "target": 275,
        "high": 400
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "high",
    "sourceConfidence": "medium-high",
    "included": [
      "$120-$175 first deadbolt",
      "$60-$90 each additional same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if rekeying/master keying, high-security restricted cylinder, break-in damage, steel/commercial/fire door, strike reinforcement beyond long screws, or poor door alignment prevents smooth throw.",
    "sources": [
      "https://www.homestars.com/handyman-services/locksmith-pros/toronto",
      "https://ontariodoorrepair.ca/residential-door-repair-cost-toronto-2026",
      "https://matrixlocksmith.ca/locksmith-price-list-toronto/",
      "https://247gtalocksmith.com/blog/cost-of-changing-door-locks"
    ],
    "addOns": []
  },
  {
    "id": "new-deadbolt-drilling-and-install",
    "category": "Doors, locks, and hardware",
    "name": "New deadbolt drilling and install",
    "pricingUnit": "per new deadbolt opening, includes drilling/cross-bore/edge bore/strike mortise labour only",
    "unitLabel": "door/item",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 125,
    "pricing": {
      "informal_floor": {
        "low": 98,
        "target": 140,
        "high": 225
      },
      "solo_freelancer": {
        "low": 150,
        "target": 200,
        "high": 300
      },
      "insured_company": {
        "low": 200,
        "target": 350,
        "high": 500
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "caution",
    "confidence": "medium",
    "sourceConfidence": "medium",
    "included": [
      "$175-$250 first deadbolt",
      "$100-$150 each additional same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if metal/steel or fibreglass door needs specialty bits, door has glass close to bore, mortise/multipoint hardware, condo/fire-rated exterior door, high-security lock warranty requirement, or drilling accuracy/security liability is beyond comfort.",
    "sources": [
      "https://247gtalocksmith.com/blog/cost-of-changing-door-locks",
      "https://premiumlocksmith.ca/deadbolt-installation-in-toronto",
      "https://torontoconstructionnetwork.com/construction-brain/how-much-should-i-budget-for-deadbolt-lock-install-in-toront-3fb672",
      "https://www.homestars.com/handyman-services/locksmith-pros/toronto"
    ],
    "addOns": []
  },
  {
    "id": "hinge-replacement",
    "category": "Doors, locks, and hardware",
    "name": "Hinge replacement",
    "pricingUnit": "per door, replace standard residential hinge set, labour only",
    "unitLabel": "door/item",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 90,
    "pricing": {
      "informal_floor": {
        "low": 65,
        "target": 105,
        "high": 165
      },
      "solo_freelancer": {
        "low": 100,
        "target": 150,
        "high": 220
      },
      "insured_company": {
        "low": 150,
        "target": 250,
        "high": 350
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "high",
    "sourceConfidence": "medium-high",
    "included": [
      "$120-$180 first door",
      "$70-$110 each additional door same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if door is very heavy, exterior/security/fire-rated, frame is split/rotted, hinge mortises need relocation, two-person handling is needed, or door/frame is out of square beyond hinge adjustment.",
    "sources": [
      "https://taskpin.co/services/door_repair",
      "https://ontariodoorrepair.ca/residential-door-repair-cost-toronto-2026",
      "https://www.taskrabbit.ca/locations/toronto/door-repair",
      "https://www.taskrabbit.ca/cost-guides/general-handyman"
    ],
    "addOns": []
  },
  {
    "id": "hinge-screw-repair-long-screws-plug-stripped-holes",
    "category": "Doors, locks, and hardware",
    "name": "Hinge screw repair, long screws, plug stripped holes",
    "pricingUnit": "per door for minor sag/loose-hinge repair, no full frame repair",
    "unitLabel": "door/item",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 45,
    "pricing": {
      "informal_floor": {
        "low": 46,
        "target": 77,
        "high": 128
      },
      "solo_freelancer": {
        "low": 70,
        "target": 110,
        "high": 170
      },
      "insured_company": {
        "low": 120,
        "target": 185,
        "high": 250
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "medium",
    "included": [
      "$80-$140 first door",
      "$30-$60 each additional door same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if jamb is cracked/rotted, screws will not bite into structure, hinge leaf is bent/cracked, door still sags after repair, or security/exterior door needs reinforcement plates.",
    "sources": [
      "https://www.taskrabbit.ca/cost-guides/general-handyman",
      "https://ontariodoorrepair.ca/residential-door-repair-cost-toronto-2026",
      "https://taskpin.co/services/door_repair",
      "https://www.mrhandyman.com/blog/how-to-fix-a-loose-door-latch-so-your-door-doesn"
    ],
    "addOns": []
  },
  {
    "id": "strike-latch-adjustment-for-door-that-will-not-latch",
    "category": "Doors, locks, and hardware",
    "name": "Strike/latch adjustment for door that will not latch",
    "pricingUnit": "per door, minor strike tab/file/chisel/hinge tweak only",
    "unitLabel": "door/item",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 55,
    "pricing": {
      "informal_floor": {
        "low": 52,
        "target": 84,
        "high": 135
      },
      "solo_freelancer": {
        "low": 80,
        "target": 120,
        "high": 180
      },
      "insured_company": {
        "low": 120,
        "target": 185,
        "high": 250
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "high",
    "sourceConfidence": "medium-high",
    "included": [
      "$90-$150 first door",
      "$40-$70 each additional door same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if deadbolt will not throw because frame/door has shifted badly, door needs planing, frame repair, lock replacement, security strike reinforcement, or exterior door cannot be left secure.",
    "sources": [
      "https://www.taskrabbit.ca/cost-guides/general-handyman",
      "https://ontariodoorrepair.ca/residential-door-repair-cost-toronto-2026",
      "https://taskpin.co/services/door_repair",
      "https://www.mrhandyman.com/blog/how-to-fix-a-loose-door-latch-so-your-door-doesn"
    ],
    "addOns": []
  },
  {
    "id": "door-stopper-install-or-replacement",
    "category": "Doors, locks, and hardware",
    "name": "Door stopper install or replacement",
    "pricingUnit": "per simple wall/baseboard/hinge-pin stopper, hardware extra",
    "unitLabel": "door/item",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 30,
    "pricing": {
      "informal_floor": {
        "low": 39,
        "target": 63,
        "high": 105
      },
      "solo_freelancer": {
        "low": 60,
        "target": 90,
        "high": 140
      },
      "insured_company": {
        "low": 150,
        "target": 202,
        "high": 255
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "low",
    "sourceConfidence": "low (weak direct local evidence; priced from Toronto handyman minimums and small-task batching)",
    "included": [
      "$70-$120 first stopper or bundle minimum",
      "$20-$40 each additional same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if wall has hidden services, tile/glass/stone drilling is required, fire door clearances are affected, or customer expects patch/paint of prior impact damage included.",
    "sources": [
      "https://www.taskrabbit.ca/cost-guides/general-handyman",
      "https://buildman.ca/handyman-cost-toronto.html",
      "https://www.homestars.com/handyman-services/handyman-pros/toronto",
      "https://www.kijiji.ca/b-gta-greater-toronto-area/handyman-services/k0l1700272"
    ],
    "addOns": []
  },
  {
    "id": "door-closer-adjustment-or-replacement",
    "category": "Doors, locks, and hardware",
    "name": "Door closer adjustment or replacement",
    "pricingUnit": "per closer; adjustment only or surface/storm/residential closer replacement, parts extra unless stated",
    "unitLabel": "door/item",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 110,
    "pricing": {
      "informal_floor": {
        "low": 58,
        "target": 105,
        "high": 225
      },
      "solo_freelancer": {
        "low": 90,
        "target": 150,
        "high": 300
      },
      "insured_company": {
        "low": 180,
        "target": 415,
        "high": 650
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "caution",
    "confidence": "medium",
    "sourceConfidence": "medium",
    "included": [
      "$100-$160 adjustment; $150-$300 replacement first closer",
      "$70-$150 each additional closer same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop and refer if fire-rated exit, commercial storefront, accessibility opening-force compliance, leaking hydraulic body, concealed/floor closer, panic hardware, access control, or door will not self-close/latch safely.",
    "sources": [
      "https://www.ontariodoorrepair.ca/commercial-door-closer-replacement/",
      "https://www.ontariodoorrepair.ca/commercial-door-repair-cost-toronto-2026-guide/",
      "https://taskpin.co/services/door_repair",
      "https://www.homestars.com/handyman-services/locksmith-pros/toronto"
    ],
    "addOns": []
  },
  {
    "id": "door-sweep-and-weatherstrip-replacement",
    "category": "Doors, locks, and hardware",
    "name": "Door sweep and weatherstrip replacement",
    "pricingUnit": "per exterior door, head/jamb weatherstrip plus sweep where needed, materials extra unless stated",
    "unitLabel": "door/item",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 80,
    "pricing": {
      "informal_floor": {
        "low": 65,
        "target": 112,
        "high": 210
      },
      "solo_freelancer": {
        "low": 100,
        "target": 160,
        "high": 280
      },
      "insured_company": {
        "low": 150,
        "target": 235,
        "high": 320
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "high",
    "sourceConfidence": "medium-high",
    "included": [
      "$120-$200 first door labour; common all-in $150-$320",
      "$60-$100 each additional door same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if threshold/frame is rotted, door requires planing or rehanging, custom kerf/threshold parts are unavailable, water intrusion needs exterior envelope repair, or condo/fire door rating is affected.",
    "sources": [
      "https://renohouse.ca/services/handyman/weather-stripping-door-window",
      "https://ontariodoorrepair.ca/residential-door-repair-cost-toronto-2026",
      "https://taskpin.co/services/door_repair",
      "https://www.taskrabbit.ca/cost-guides/general-handyman"
    ],
    "addOns": []
  },
  {
    "id": "peephole-door-viewer-install",
    "category": "Doors, locks, and hardware",
    "name": "Peephole/door viewer install",
    "pricingUnit": "per door viewer, standard wood/metal residential door, hardware extra",
    "unitLabel": "door/item",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 40,
    "pricing": {
      "informal_floor": {
        "low": 46,
        "target": 70,
        "high": 120
      },
      "solo_freelancer": {
        "low": 70,
        "target": 100,
        "high": 160
      },
      "insured_company": {
        "low": 150,
        "target": 188,
        "high": 225
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "low",
    "sourceConfidence": "low (weak local evidence; direct peephole pricing mostly non-local, anchored to Toronto handyman minimums)",
    "included": [
      "$80-$130 first peephole",
      "$30-$50 each additional same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if fire-rated condo entry approval is required, door is steel/fibreglass with insulation/glass near hole, viewer height must meet accessibility/property rules, or mistake would void door warranty.",
    "sources": [
      "https://www.taskrabbit.ca/cost-guides/general-handyman",
      "https://buildman.ca/handyman-cost-toronto.html",
      "https://www.countbricks.com/post/peephole-installation-cost",
      "https://www.reddit.com/r/Home/comments/1898ne3/is_a_peephole_worth_installing_on_front_and_side/"
    ],
    "addOns": []
  },
  {
    "id": "chain-lock-or-swing-bar-door-guard-install",
    "category": "Doors, locks, and hardware",
    "name": "Chain lock or swing-bar door guard install",
    "pricingUnit": "per surface-mounted security guard, hardware extra",
    "unitLabel": "door/item",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 40,
    "pricing": {
      "informal_floor": {
        "low": 46,
        "target": 70,
        "high": 120
      },
      "solo_freelancer": {
        "low": 70,
        "target": 100,
        "high": 160
      },
      "insured_company": {
        "low": 150,
        "target": 200,
        "high": 250
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "low",
    "sourceConfidence": "low (weak direct local evidence; Kijiji shows local hardware/requests but little fixed labour pricing)",
    "included": [
      "$80-$130 first guard",
      "$30-$50 each additional same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if customer expects forced-entry security rating, door/jamb is weak, condo/fire-door rules prohibit added hardware, screws cannot anchor into solid material, or child-safety/accessibility concerns are present.",
    "sources": [
      "https://www.kijiji.ca/b-gta-greater-toronto-area/door-lock/k0l1700272",
      "https://www.taskrabbit.ca/cost-guides/general-handyman",
      "https://buildman.ca/handyman-cost-toronto.html",
      "https://www.homestars.com/handyman-services/locksmith-pros/toronto"
    ],
    "addOns": []
  },
  {
    "id": "smart-lock-install-setup-existing-compatible-bore",
    "category": "Doors, locks, and hardware",
    "name": "Smart lock install/setup, existing compatible bore",
    "pricingUnit": "per customer-supplied smart lock, mechanical fit plus basic app/code setup",
    "unitLabel": "door/item",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 120,
    "pricing": {
      "informal_floor": {
        "low": 84,
        "target": 126,
        "high": 225
      },
      "solo_freelancer": {
        "low": 130,
        "target": 180,
        "high": 300
      },
      "insured_company": {
        "low": 150,
        "target": 300,
        "high": 450
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "caution",
    "confidence": "high",
    "sourceConfidence": "medium-high",
    "included": [
      "$150-$250 first smart lock",
      "$90-$150 each additional same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop/refer if no existing deadbolt hole, mortise/multipoint lock, steel/fire-rated/condo exterior door, access-control wiring, hub/network troubleshooting beyond pairing, poor latch alignment causing motor strain, warranty requires locksmith install, or customer wants security certification.",
    "sources": [
      "https://prosfix.ca/locations/toronto/smart-lock-installation",
      "https://matrixlocksmith.ca/locksmith-price-list-toronto/",
      "https://770locksmith.ca/smart-lock-installation",
      "https://renohouse.ca/blog/smart-lock-installation-guide-toronto",
      "https://www.homestars.com/handyman-services/locksmith-pros"
    ],
    "addOns": []
  },
  {
    "id": "bifold-closet-door-adjustment-repair",
    "category": "Doors, locks, and hardware",
    "name": "Bifold closet door adjustment and repair",
    "pricingUnit": "per closet opening, includes both doors",
    "unitLabel": "opening",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 85,
    "pricing": {
      "informal_floor": { "low": 80, "target": 120, "high": 180 },
      "solo_freelancer": { "low": 120, "target": 175, "high": 250 },
      "insured_company": { "low": 180, "target": 275, "high": 400 }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "Based on 2026 Toronto GTA handyman pricing and closet door service providers",
    "included": ["Realign door panels", "Adjust pivot brackets", "Lubricate hinges", "Tighten hardware"],
    "notIncluded": ["Door replacement", "Track replacement", "Major structural repairs", "Frame modifications"],
    "stopConditions": "Stop if doors are severely warped, frame is damaged, track is broken, or full door replacement is needed.",
    "sources": ["https://www.homestars.com/handyman-services/handyman-pros/toronto", "https://renohouse.ca/services/doors-windows/closet-doors"],
    "addOns": []
  },
  {
    "id": "sliding-closet-door-roller-track-repair",
    "category": "Doors, locks, and hardware",
    "name": "Sliding closet door roller and track repair",
    "pricingUnit": "per closet opening, cleaning track and replacing worn rollers",
    "unitLabel": "opening",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 90,
    "pricing": {
      "informal_floor": { "low": 85, "target": 130, "high": 200 },
      "solo_freelancer": { "low": 130, "target": 190, "high": 280 },
      "insured_company": { "low": 200, "target": 310, "high": 450 }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "Based on 2026 Toronto sliding door repair pricing",
    "included": ["Deep clean tracks", "Replace worn rollers", "Realign doors", "Adjust guide brackets"],
    "notIncluded": ["Mirror panel replacement", "Track replacement", "Door replacement", "Frame repairs"],
    "stopConditions": "Stop if track is bent/broken, mirror panels are cracked, frame needs reinforcement, or doors need full replacement.",
    "sources": ["https://mrdoorrepair.ca/services/residential/sliding-closet-doors-repair-supply-and-installation/", "https://renohouse.ca/services/doors-windows/sliding-door-repair"],
    "addOns": []
  },
  {
    "id": "closet-rod-shelf-installation",
    "category": "Mounting and hanging",
    "name": "Closet rod and shelf installation",
    "pricingUnit": "per rod/shelf set, includes brackets and mounting",
    "unitLabel": "set",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 70,
    "pricing": {
      "informal_floor": { "low": 70, "target": 110, "high": 160 },
      "solo_freelancer": { "low": 110, "target": 165, "high": 240 },
      "insured_company": { "low": 170, "target": 260, "high": 380 }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "Based on 2026 Toronto shelving and closet organizer installation pricing",
    "included": ["Mount brackets to studs", "Install rod or shelf", "Level and secure", "Basic configuration"],
    "notIncluded": ["Custom closet systems", "Wire shelving systems", "Built-in organizers", "Rod/shelf materials"],
    "stopConditions": "Stop if wall reinforcement needed, custom closet system installation, or structural changes required.",
    "sources": ["https://www.homestars.com/handyman-services/handyman-pros/toronto"],
    "addOns": []
  },
  {
    "id": "window-screen-mesh-replacement",
    "category": "Screens and windows",
    "name": "Window screen mesh replacement",
    "pricingUnit": "per window screen; bundle after minimum visit",
    "unitLabel": "screen",
    "includedQuantity": 3,
    "defaultQuantity": 1,
    "additionalUnitPrice": 45,
    "pricing": {
      "informal_floor": {
        "low": 30,
        "target": 50,
        "high": 75
      },
      "solo_freelancer": {
        "low": 30,
        "target": 50,
        "high": 85
      },
      "insured_company": {
        "low": 25,
        "target": 160,
        "high": 295
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "medium",
    "included": [
      "$85-$150 first visit/minimum or first 1-3 screens",
      "$25-$65 per additional standard screen"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if frame is bent/corroded, upper-floor exterior access, specialty/pet/no-see-um mesh not stocked, or client expects new full frame.",
    "sources": [
      "https://screenexpress.ca/faq",
      "https://windowfixgta.ca/pricing",
      "https://revitalizewindowsanddoors.com/cost-to-repair-window-screen-mesh-in-the-gta/",
      "https://www.reddit.com/r/handyman/comments/1jzcie3/pricing_for_window_screen_replacement/ (weak sentiment)"
    ],
    "addOns": []
  },
  {
    "id": "screen-door-mesh-repair-replacement",
    "category": "Screens and windows",
    "name": "Screen door mesh repair/replacement",
    "pricingUnit": "per sliding/storm screen door re-mesh",
    "unitLabel": "screen door",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 125,
    "pricing": {
      "informal_floor": {
        "low": 65,
        "target": 94,
        "high": 135
      },
      "solo_freelancer": {
        "low": 100,
        "target": 135,
        "high": 180
      },
      "insured_company": {
        "low": 80,
        "target": 288,
        "high": 495
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "medium",
    "included": [
      "$125-$180 first door",
      "$100-$150 per additional door same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if screen door frame is bent, corroded, out of square, retractable/custom system, pet mesh upgrade not stocked, or door must be removed from unsafe balcony access.",
    "sources": [
      "https://renohouse.ca/toronto/screen-door-repair",
      "https://screenexpress.ca/faq",
      "https://revitalizewindowsanddoors.com/how-much-does-it-cost-to-replace-mesh-on-a-sliding-screen-door",
      "Kijiji/Facebook search snippet for Meshmen $135/door (weak)"
    ],
    "addOns": []
  },
  {
    "id": "screen-spline-replacement-re-tension",
    "category": "Screens and windows",
    "name": "Screen spline replacement / re-tension",
    "pricingUnit": "per screen when mesh is reusable",
    "unitLabel": "screen",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 18,
    "pricing": {
      "informal_floor": {
        "low": 30,
        "target": 52,
        "high": 90
      },
      "solo_freelancer": {
        "low": 40,
        "target": 75,
        "high": 120
      },
      "insured_company": {
        "low": 45,
        "target": 65,
        "high": 85
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "low",
    "sourceConfidence": "low",
    "included": [
      "$75-$120 minimum visit",
      "$10-$25 per additional screen if simple"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if mesh is brittle/torn, spline channel damaged, frame corners loose, or client expects invisible patching instead of full re-screen.",
    "sources": [
      "https://screenexpress.ca/faq",
      "https://windowfixgta.ca/pricing",
      "https://revitalizewindowsanddoors.com/cost-to-repair-window-screen-mesh-in-the-gta/"
    ],
    "addOns": []
  },
  {
    "id": "screen-frame-corner-repair",
    "category": "Screens and windows",
    "name": "Screen frame corner repair",
    "pricingUnit": "per window screen frame/corner repair",
    "unitLabel": "screen",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 38,
    "pricing": {
      "informal_floor": {
        "low": 30,
        "target": 52,
        "high": 90
      },
      "solo_freelancer": {
        "low": 40,
        "target": 75,
        "high": 120
      },
      "insured_company": {
        "low": 65,
        "target": 92,
        "high": 120
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "low",
    "sourceConfidence": "low-medium",
    "included": [
      "$65-$120 first screen",
      "$25-$50 per additional screen/corner set"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if aluminum rails are bent/kinked, frame is non-standard or missing, colour match is required, or new custom fabrication is needed.",
    "sources": [
      "https://screenexpress.ca/faq",
      "https://windowfixgta.ca/pricing",
      "https://revitalizewindowsanddoors.com/how-much-does-it-cost-to-replace-a-window-screen-in-the-gta/"
    ],
    "addOns": []
  },
  {
    "id": "patio-screen-door-roller-wheel-replacement",
    "category": "Screens and windows",
    "name": "Patio screen door roller/wheel replacement",
    "pricingUnit": "per sliding screen door, rollers adjusted/replaced",
    "unitLabel": "screen door",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 55,
    "pricing": {
      "informal_floor": {
        "low": 49,
        "target": 84,
        "high": 135
      },
      "solo_freelancer": {
        "low": 75,
        "target": 120,
        "high": 180
      },
      "insured_company": {
        "low": 80,
        "target": 190,
        "high": 300
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "medium",
    "included": [
      "$95-$150 first door plus parts",
      "$35-$75 per additional screen door/roller set same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if it is the heavy glass patio door not the screen, track is bent, door must be lifted by two people, balcony access unsafe, or replacement roller type is unavailable.",
    "sources": [
      "https://screenexpress.ca/faq",
      "https://renohouse.ca/toronto/screen-door-repair",
      "https://screendoors.ca/sliding-screen-doors/",
      "https://revitalizewindowsanddoors.com/sliding-patio-door-roller-replacement-cost-guide"
    ],
    "addOns": []
  },
  {
    "id": "screen-door-handle-latch",
    "category": "Screens and windows",
    "name": "Screen door handle/latch",
    "pricingUnit": "per screen/storm/sliding screen door handle or latch",
    "unitLabel": "screen door",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 52,
    "pricing": {
      "informal_floor": {
        "low": 42,
        "target": 77,
        "high": 128
      },
      "solo_freelancer": {
        "low": 65,
        "target": 110,
        "high": 170
      },
      "insured_company": {
        "low": 50,
        "target": 125,
        "high": 200
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "medium",
    "included": [
      "$90-$140 first door plus parts",
      "$35-$70 per additional latch same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if keyed/security lock, patio glass-door lock, frame is cracked, strike plate cannot align, or condo/security requirements require locksmith/door specialist.",
    "sources": [
      "https://renohouse.ca/toronto/screen-door-repair",
      "https://screendoors.ca/sliding-screen-doors/",
      "https://windowfixgta.ca/pricing",
      "https://enlivedoors.ca/sliding-door-repair"
    ],
    "addOns": []
  },
  {
    "id": "screen-storm-door-closer",
    "category": "Screens and windows",
    "name": "Screen/storm door closer",
    "pricingUnit": "per surface-mounted closer replacement/adjustment",
    "unitLabel": "door/item",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 58,
    "pricing": {
      "informal_floor": {
        "low": 46,
        "target": 80,
        "high": 131
      },
      "solo_freelancer": {
        "low": 70,
        "target": 115,
        "high": 175
      },
      "insured_company": {
        "low": 95,
        "target": 148,
        "high": 200
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "low",
    "sourceConfidence": "low",
    "included": [
      "$95-$150 first closer plus parts",
      "$40-$75 per additional closer same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if door/frame is warped, closer mount is stripped beyond simple repair, glass storm insert risk, commercial closer, or life-safety/fire-rated door.",
    "sources": [
      "https://windowfixgta.ca/pricing",
      "https://renohouse.ca/toronto/screen-door-repair",
      "https://www.taskrabbit.com/services/handyman"
    ],
    "addOns": []
  },
  {
    "id": "window-crank-operator-replacement",
    "category": "Screens and windows",
    "name": "Window crank/operator replacement",
    "pricingUnit": "per casement/awning window crank/operator",
    "unitLabel": "window",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 100,
    "pricing": {
      "informal_floor": {
        "low": 55,
        "target": 91,
        "high": 165
      },
      "solo_freelancer": {
        "low": 85,
        "target": 130,
        "high": 220
      },
      "insured_company": {
        "low": 75,
        "target": 385,
        "high": 695
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "caution",
    "confidence": "high",
    "sourceConfidence": "medium-high",
    "included": [
      "$110-$175 first crank plus parts if not included",
      "$75-$125 per additional crank same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if sash will not close due to hinge/track/frame failure, hardware is discontinued, rotten wood/stripped mounting, upper exterior access, glass/seal failure, or egress/security concern.",
    "sources": [
      "https://windowfixgta.ca/pricing",
      "https://revitalizewindowsanddoors.com/how-much-does-it-cost-to-replace-my-window-crank-operator/",
      "https://homestars.com/companies/206616-fix-n-go-glass-screen-repairs (weak review: $250 for 3 cranks)"
    ],
    "addOns": []
  },
  {
    "id": "window-lock-latch-replacement",
    "category": "Screens and windows",
    "name": "Window lock/latch replacement",
    "pricingUnit": "per window lock/latch/hardware item",
    "unitLabel": "window",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 70,
    "pricing": {
      "informal_floor": {
        "low": 49,
        "target": 80,
        "high": 135
      },
      "solo_freelancer": {
        "low": 75,
        "target": 115,
        "high": 180
      },
      "insured_company": {
        "low": 75,
        "target": 162,
        "high": 250
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "caution",
    "confidence": "medium",
    "sourceConfidence": "medium",
    "included": [
      "$95-$150 first lock plus parts",
      "$50-$90 per additional lock same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if keyed security lock, broken glass, egress window issue, child-safety/legal requirement, frame damage, or exact matching hardware cannot be sourced.",
    "sources": [
      "https://windowfixgta.ca/pricing",
      "https://www.dw-locksmiths.com/window-repair?area=toronto",
      "https://icarusservices.ca/service/windows/repairs/lock/",
      "https://windowfixgta.ca/blog/window-repair-vs-replacement-what-gta-homeowners-are-actually-paying-in-2026 (search snippet)"
    ],
    "addOns": []
  },
  {
    "id": "curtain-rods-blinds-installation",
    "category": "Mounting and hanging",
    "name": "Curtain rods / blinds installation",
    "pricingUnit": "per window/opening; one rod or blind set",
    "unitLabel": "window/opening",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 70,
    "pricing": {
      "informal_floor": {
        "low": 32,
        "target": 56,
        "high": 94
      },
      "solo_freelancer": {
        "low": 50,
        "target": 80,
        "high": 125
      },
      "insured_company": {
        "low": 60,
        "target": 105,
        "high": 150
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "high",
    "sourceConfidence": "high",
    "included": [
      "$100-$150 first window/minimum",
      "$50-$90 per additional window; lower if identical and pre-measured"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if drilling into concrete ceiling, tile/stone, unknown wiring/plumbing, high ladder, motorized hardwired blinds, or custom cutting/fabrication.",
    "sources": [
      "https://www.taskrabbit.ca/locations/toronto/blinds-installation",
      "https://urbantasker.com/blog/how-much-does-handyman-cost-in-greater-toronto-area-gta-ontario-canada",
      "https://jan-handyman.com/interior-installation/curtain-blind-installation/",
      "https://homestars.com/handyman-services/price-guides/handyman-services-cost-toronto"
    ],
    "addOns": []
  },
  {
    "id": "shelves-small-wall-shelving",
    "category": "Mounting and hanging",
    "name": "Shelves / small wall shelving",
    "pricingUnit": "per shelf or small bracketed unit",
    "unitLabel": "shelf",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 80,
    "pricing": {
      "informal_floor": {
        "low": 39,
        "target": 66,
        "high": 112
      },
      "solo_freelancer": {
        "low": 60,
        "target": 95,
        "high": 150
      },
      "insured_company": {
        "low": 100,
        "target": 125,
        "high": 150
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "high",
    "sourceConfidence": "high",
    "included": [
      "$110-$160 first shelf/minimum",
      "$60-$100 per additional shelf same wall/visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if hidden services suspected, masonry/condo concrete needs special anchors, heavy load rating not provided, floating shelf hardware is poor, or cabinet/structural support is required.",
    "sources": [
      "https://urbantasker.com/blog/how-much-does-handyman-cost-in-greater-toronto-area-gta-ontario-canada",
      "https://taskpin.co/services/wall_hanging_and_mounting",
      "https://www.taskrabbit.com/blog/how-much-does-it-cost-to-hire-a-tasker/",
      "https://buildman.ca/tv-wall-mounting.html"
    ],
    "addOns": []
  },
  {
    "id": "mirrors-pictures-artwork-hanging",
    "category": "Mounting and hanging",
    "name": "Mirrors / pictures / artwork hanging",
    "pricingUnit": "per item; gallery wall priced as batch",
    "unitLabel": "item",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 52,
    "pricing": {
      "informal_floor": {
        "low": 30,
        "target": 56,
        "high": 112
      },
      "solo_freelancer": {
        "low": 40,
        "target": 80,
        "high": 150
      },
      "insured_company": {
        "low": 80,
        "target": 100,
        "high": 120
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "high",
    "sourceConfidence": "high",
    "included": [
      "$90-$140 first item/minimum",
      "$30-$75 per additional light item; $80-$150 heavy/large"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if item is very heavy/frameless glass, no rated hanging hardware, plaster/brick/concrete complexity, stairwell/height risk, or two-person lift required.",
    "sources": [
      "https://taskpin.co/services/wall_hanging_and_mounting",
      "https://urbantasker.com/blog/how-much-does-handyman-cost-in-greater-toronto-area-gta-ontario-canada",
      "https://www.taskrabbit.com/blog/how-much-does-it-cost-to-hire-a-tasker/",
      "https://www.taskrabbit.ca/locations/toronto/blinds-installation"
    ],
    "addOns": []
  },
  {
    "id": "coat-hooks-towel-bars-small-holders",
    "category": "Mounting and hanging",
    "name": "Coat hooks / towel bars / small holders",
    "pricingUnit": "per small wall-mounted item",
    "unitLabel": "item",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 40,
    "pricing": {
      "informal_floor": {
        "low": 30,
        "target": 50,
        "high": 75
      },
      "solo_freelancer": {
        "low": 35,
        "target": 55,
        "high": 90
      },
      "insured_company": {
        "low": 100,
        "target": 150,
        "high": 200
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "medium",
    "included": [
      "$85-$120 minimum/first item",
      "$25-$55 per additional item same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if tile/stone drilling without proper bit, shower waterproofing risk, heated towel bar/electrical, hollow door weak substrate, grab-bar/safety-critical use, or commercial/washroom code issue.",
    "sources": [
      "https://urbantasker.com/blog/how-much-does-handyman-cost-in-greater-toronto-area-gta-ontario-canada",
      "https://www.taskrabbit.com/services/mounting",
      "https://www.taskrabbit.com/services/handyman",
      "https://buildman.ca/tv-wall-mounting.html"
    ],
    "addOns": []
  },
  {
    "id": "cabinet-pulls-knobs-install-or-swap",
    "category": "Cabinets",
    "name": "Cabinet pulls/knobs install or swap",
    "pricingUnit": "per visit; first 6-10 pulls if holes match, materials extra",
    "unitLabel": "pull/knob",
    "includedQuantity": 8,
    "defaultQuantity": 1,
    "additionalUnitPrice": 11,
    "pricing": {
      "informal_floor": {
        "low": 58,
        "target": 105,
        "high": 188
      },
      "solo_freelancer": {
        "low": 90,
        "target": 150,
        "high": 250
      },
      "insured_company": {
        "low": 150,
        "target": 275,
        "high": 400
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "medium; good general Toronto handyman evidence, cabinet-specific evidence is mostly non-local/national plus local guide snippets",
    "included": [
      "$120-$180",
      "$5-$12 each matching-hole pull/knob; $10-$20 each if measuring/drilling new holes"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop/requote for misaligned old holes, damaged doors, custom jigs, stone/metal panels, expensive/high-gloss cabinetry, refacing/repair beyond hardware, or client-supplied hardware that does not fit.",
    "sources": [
      "https://www.homestars.com/handyman-services/price-guides/handyman-services-cost-toronto",
      "https://www.taskrabbit.ca/cost-guides/general-handyman",
      "https://buildman.ca/handyman-cost-toronto.html",
      "https://www.homeguide.com/costs/cost-to-install-cabinet-hardware",
      "Kijiji search snippets: Toronto handyman ads around $30-$50/hr"
    ],
    "addOns": []
  },
  {
    "id": "cabinet-hinge-replacement-adjustment-including-soft-clos",
    "category": "Cabinets",
    "name": "Cabinet hinge replacement/adjustment, including soft-close hinge swaps",
    "pricingUnit": "per visit; first 2-4 doors/hinges, parts extra",
    "unitLabel": "door/hinge set",
    "includedQuantity": 3,
    "defaultQuantity": 1,
    "additionalUnitPrice": 25,
    "pricing": {
      "informal_floor": {
        "low": 65,
        "target": 122,
        "high": 225
      },
      "solo_freelancer": {
        "low": 100,
        "target": 175,
        "high": 300
      },
      "insured_company": {
        "low": 150,
        "target": 275,
        "high": 400
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "low",
    "sourceConfidence": "medium-low; pricing inferred from Toronto minimums and non-local cabinet repair/hardware data",
    "included": [
      "$130-$200",
      "$15-$35 per door/hinge set when same cup/bore pattern; $40-$75 per problem door needing drilling or repair"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop/requote if hinge holes are stripped beyond plug-and-screw repair, doors are warped, cabinet boxes are loose, new concealed-hinge boring is required, or alignment needs structural cabinet repair.",
    "sources": [
      "https://www.homestars.com/handyman-services/price-guides/handyman-services-cost-toronto",
      "https://www.taskrabbit.ca/cost-guides/general-handyman",
      "https://buildman.ca/handyman-cost-toronto.html",
      "https://www.homeguide.com/costs/cost-to-install-cabinet-hardware",
      "TaskRabbit Toronto page snippets list cabinet repairs/hinge reinstall as common handyman work"
    ],
    "addOns": []
  },
  {
    "id": "toilet-seat-replacement",
    "category": "Bathroom small repairs",
    "name": "Toilet seat replacement",
    "pricingUnit": "per toilet seat; seat supplied by client or billed separately",
    "unitLabel": "item",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 38,
    "pricing": {
      "informal_floor": {
        "low": 39,
        "target": 70,
        "high": 112
      },
      "solo_freelancer": {
        "low": 60,
        "target": 100,
        "high": 150
      },
      "insured_company": {
        "low": 100,
        "target": 150,
        "high": 200
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "high",
    "sourceConfidence": "medium-high; direct Toronto toilet-seat price plus Toronto handyman minimums",
    "included": [
      "$75-$125 standalone; $50-$100 when bundled or already on site",
      "$25-$50 per additional toilet seat in same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop/requote if bolts are seized/corroded and risk cracking porcelain, toilet is loose/leaking, seat is bidet/electrical/plumbed, shutoff valve leaks, or porcelain is cracked.",
    "sources": [
      "https://renohouse.ca/blog/toilet-installation-repair-guide",
      "https://www.homestars.com/handyman-services/price-guides/handyman-services-cost-toronto",
      "https://www.taskrabbit.ca/cost-guides/general-handyman",
      "https://buildman.ca/handyman-cost-toronto.html"
    ],
    "addOns": []
  },
  {
    "id": "smoke-co-alarm-battery-replacement-only",
    "category": "Filters and maintenance",
    "name": "Smoke/CO alarm battery replacement only",
    "pricingUnit": "per visit; first 1-3 alarms if accessible, batteries extra",
    "unitLabel": "alarm",
    "includedQuantity": 3,
    "defaultQuantity": 1,
    "additionalUnitPrice": 15,
    "pricing": {
      "informal_floor": {
        "low": 32,
        "target": 70,
        "high": 112
      },
      "solo_freelancer": {
        "low": 50,
        "target": 100,
        "high": 150
      },
      "insured_company": {
        "low": 120,
        "target": 185,
        "high": 250
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "medium; official safety scope is strong, exact battery-only pricing is inferred from Toronto minimums",
    "included": [
      "$75-$125 standalone; $40-$75 if bundled with other small jobs",
      "$10-$20 per additional alarm battery; add ladder/access premium if needed"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop if alarm is hardwired and requires disconnecting wiring, alarm is expired over 10 years, alarm fails test after battery, CO alarm is sounding, fire alarm system is building/common element, ceiling is unsafe/high, or rental/condo rules require landlord/building-approved contractor.",
    "sources": [
      "https://www.toronto.ca/community-people/public-safety-alerts/safety-tips-prevention/safety-equipment-devices/smoke-alarms/",
      "https://www.homestars.com/handyman-services/price-guides/handyman-services-cost-toronto",
      "https://www.taskrabbit.ca/cost-guides/general-handyman",
      "https://buildman.ca/handyman-cost-toronto.html",
      "https://esasafe.com/consumer-protection/hire-licensed/"
    ],
    "addOns": []
  },
  {
    "id": "battery-only-smoke-co-alarm-replacement-like-for-like-no",
    "category": "Filters and maintenance",
    "name": "Battery-only smoke/CO alarm replacement, like-for-like no wiring",
    "pricingUnit": "per visit; first alarm installed/tested, alarm unit extra",
    "unitLabel": "alarm",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 32,
    "pricing": {
      "informal_floor": {
        "low": 49,
        "target": 88,
        "high": 150
      },
      "solo_freelancer": {
        "low": 75,
        "target": 125,
        "high": 200
      },
      "insured_company": {
        "low": 120,
        "target": 185,
        "high": 250
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "medium; battery-only labour inferred from minimums, hardwired comparison has direct local electrician source",
    "included": [
      "$90-$150",
      "$20-$45 per additional battery-only alarm in same visit; hardware/materials extra"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Only battery-operated, no wiring. Stop/refer if hardwired, interconnected, new wiring/location, low-voltage/fire alarm panel, condo common system, alarm placement/code audit dispute, or device is not CSA/ULC-listed/current.",
    "sources": [
      "https://www.toronto.ca/community-people/public-safety-alerts/safety-tips-prevention/safety-equipment-devices/smoke-alarms/",
      "https://www.koljibroselectrical.ca/smoke-detector-installation-toronto",
      "https://esasafe.com/consumer-protection/hire-licensed/",
      "https://www.homestars.com/handyman-services/price-guides/handyman-services-cost-toronto",
      "https://www.taskrabbit.ca/cost-guides/general-handyman"
    ],
    "addOns": []
  },
  {
    "id": "thermostat-battery-replacement-only",
    "category": "Filters and maintenance",
    "name": "Thermostat battery replacement only",
    "pricingUnit": "per thermostat; no wiring or diagnosis",
    "unitLabel": "thermostat",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 15,
    "pricing": {
      "informal_floor": {
        "low": 32,
        "target": 63,
        "high": 112
      },
      "solo_freelancer": {
        "low": 50,
        "target": 90,
        "high": 150
      },
      "insured_company": {
        "low": 100,
        "target": 140,
        "high": 180
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "low",
    "sourceConfidence": "medium-low; battery-only price inferred from Toronto minimums; thermostat wiring/install comparison is stronger",
    "included": [
      "$75-$125 standalone; $30-$60 when bundled",
      "$10-$20 per additional thermostat; batteries extra"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop/refer if thermostat remains blank, heat/cool/fan does not operate after batteries, wires are loose/damaged, C-wire/common wire needed, smart thermostat install/setup requested, furnace/AC fault appears, or any 120V electrical/gas/HVAC service is involved.",
    "sources": [
      "https://lloydhvac.com/hvac-contractor/thermostat-installation/",
      "https://esasafe.com/doing-electrical-work/",
      "https://www.homestars.com/handyman-services/price-guides/handyman-services-cost-toronto",
      "https://www.taskrabbit.ca/cost-guides/general-handyman",
      "https://buildman.ca/handyman-cost-toronto.html"
    ],
    "addOns": []
  },
  {
    "id": "furnace-filter-replacement-accessible-return-filter-slot",
    "category": "Filters and maintenance",
    "name": "Furnace filter replacement, accessible return/filter slot only",
    "pricingUnit": "per visit; first furnace/air-handler filter, filter extra",
    "unitLabel": "filter",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 18,
    "pricing": {
      "informal_floor": {
        "low": 39,
        "target": 70,
        "high": 112
      },
      "solo_freelancer": {
        "low": 60,
        "target": 100,
        "high": 150
      },
      "insured_company": {
        "low": 150,
        "target": 200,
        "high": 250
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "caution",
    "confidence": "medium",
    "sourceConfidence": "medium; filter-only pricing inferred from minimums, safety boundaries strong",
    "included": [
      "$75-$125 standalone; $40-$75 bundled",
      "$10-$25 per additional filter/return if same visit; add cost of filter"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Handyman scope is filter-only. Stop/refer for gas smell, CO alarm, burner/ignition/venting issues, furnace panels requiring service access, oil supply-line filters, electrical controls, airflow diagnosis, short-cycling, no heat/no AC, or filter fit/MERV concerns that need HVAC static-pressure judgment.",
    "sources": [
      "https://www.ontario.ca/laws/regulation/010215",
      "https://www.homestars.com/handyman-services/price-guides/handyman-services-cost-toronto",
      "https://www.taskrabbit.ca/cost-guides/general-handyman",
      "https://urbantasker.com/handyman/toronto",
      "https://getabetterquote.com/guides/furnace-filter-replacement-frequency-ontario/"
    ],
    "addOns": []
  },
  {
    "id": "condo-fan-coil-filter-replacement",
    "category": "Filters and maintenance",
    "name": "Condo fan coil filter replacement",
    "pricingUnit": "per fan-coil unit; filter supplied separately unless stocked",
    "unitLabel": "filter",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 38,
    "pricing": {
      "informal_floor": {
        "low": 49,
        "target": 88,
        "high": 150
      },
      "solo_freelancer": {
        "low": 75,
        "target": 125,
        "high": 200
      },
      "insured_company": {
        "low": 180,
        "target": 215,
        "high": 250
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "caution",
    "confidence": "high",
    "sourceConfidence": "medium-high for company maintenance; medium-low for freelancer-only filter swap",
    "included": [
      "$90-$150 first unit",
      "$25-$50 per extra fan-coil filter/unit in same suite; Friendly Filter snippet shows extra fan-coil units at $25/filter"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Check condo rules first. Stop/refer if unit leaks, has mold, clogged drain pan, actuator/valve/motor issue, electrical control issue, hydronic loop issue, requires coil cleaning beyond wipe/vacuum, building-approved contractor required, or access panel removal risks damage.",
    "sources": [
      "https://friendlyfilter.ca/",
      "https://www.condohvacpros.ca/services/condo-heating-systems",
      "https://www.hometradestandards.com/services/condo-hvac-maintenance-repair/",
      "https://www.homestars.com/handyman-services/price-guides/handyman-services-cost-toronto",
      "https://www.taskrabbit.ca/cost-guides/general-handyman"
    ],
    "addOns": []
  },
  {
    "id": "ac-return-air-filter-replacement",
    "category": "Filters and maintenance",
    "name": "AC/return air filter replacement",
    "pricingUnit": "per visit; first filter/grille, filter extra",
    "unitLabel": "filter",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 18,
    "pricing": {
      "informal_floor": {
        "low": 39,
        "target": 70,
        "high": 112
      },
      "solo_freelancer": {
        "low": 60,
        "target": 100,
        "high": 150
      },
      "insured_company": {
        "low": 150,
        "target": 200,
        "high": 250
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "medium; exact filter-only pricing inferred from Toronto minimums and maintenance guides",
    "included": [
      "$75-$125 standalone; $40-$75 bundled",
      "$10-$25 per extra return/filter in same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Filter/grille only. Stop/refer for no cooling, refrigerant, coil cleaning, condensate drain work, electrical connections, blower issues, frozen coil, high-MERV/static-pressure concerns, rooftop/outdoor AC work, or shared condo/building systems.",
    "sources": [
      "https://thandymanservices.ca/seasonal-maintenance-filter-changes-toronto",
      "https://www.taskrabbit.ca/cost-guides/general-handyman",
      "https://www.homestars.com/handyman-services/price-guides/handyman-services-cost-toronto",
      "https://urbantasker.com/handyman/toronto",
      "https://buildman.ca/handyman-cost-toronto.html"
    ],
    "addOns": []
  },
  {
    "id": "range-hood-grease-charcoal-filter-clean-or-replacement",
    "category": "Filters and maintenance",
    "name": "Range hood grease/charcoal filter clean or replacement",
    "pricingUnit": "per range hood; removable filters only, parts extra",
    "unitLabel": "filter",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 22,
    "pricing": {
      "informal_floor": {
        "low": 49,
        "target": 84,
        "high": 135
      },
      "solo_freelancer": {
        "low": 75,
        "target": 120,
        "high": 180
      },
      "insured_company": {
        "low": 120,
        "target": 170,
        "high": 220
      }
    },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "medium; range-hood repair source is local, filter-only labour inferred from minimums",
    "included": [
      "$90-$140",
      "$15-$30 per additional removable filter or charcoal insert in same visit"
    ],
    "notIncluded": [
      "Parts and materials unless stated",
      "Parking, travel, difficult access, hidden damage, or work outside the listed scope"
    ],
    "stopConditions": "Stop/refer for fan motor, switches, wiring, light socket beyond bulb, duct alterations, hood removal, commercial hood/fire suppression, grease fire damage, inaccessible heavy hood, or gas-cooktop clearance/venting issues needing appliance/HVAC/electrical pro.",
    "sources": [
      "https://appliancealliance.ca/range-hood-repair/",
      "https://www.homestars.com/handyman-services/price-guides/handyman-services-cost-toronto",
      "https://www.taskrabbit.ca/cost-guides/general-handyman",
      "https://buildman.ca/handyman-cost-toronto.html",
      "https://esasafe.com/doing-electrical-work/"
    ],
    "addOns": []
  },
  {
    "id": "hardwired-smoke-co-alarm-replacement",
    "category": "Referral and licensed work",
    "name": "Hardwired smoke/CO alarm replacement",
    "pricingUnit": "referral only, hardwired or interconnected alarm",
    "unitLabel": "alarm",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 0,
    "pricing": {
      "informal_floor": { "low": 0, "target": 0, "high": 0 },
      "solo_freelancer": { "low": 0, "target": 0, "high": 0 },
      "insured_company": { "low": 150, "target": 225, "high": 350 }
    },
    "materialAllowance": 0,
    "tradeStatus": "licensed_required",
    "confidence": "high",
    "sourceConfidence": "Official ESA and fire-safety guidance is strong. Pricing is referral planning only.",
    "included": ["Referral guidance only", "Do not disconnect or reconnect hardwired alarms as handyman work"],
    "notIncluded": ["Electrical wiring", "Interconnected alarm work", "Fire alarm system work"],
    "stopConditions": "Refer if alarm is hardwired, interconnected, part of a condo/building fire alarm system, or requires any wiring, new location, or code decision.",
    "sources": ["https://esasafe.com/consumer-protection/hire-licensed/", "https://www.toronto.ca/community-people/public-safety-alerts/safety-tips-prevention/safety-equipment-devices/smoke-alarms/"],
    "addOns": []
  },
  {
    "id": "outlet-switch-gfci-dimmer-replacement",
    "category": "Referral and licensed work",
    "name": "Outlet, switch, GFCI, or dimmer replacement",
    "pricingUnit": "referral only, paid residential electrical work",
    "unitLabel": "device",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 0,
    "pricing": {
      "informal_floor": { "low": 0, "target": 0, "high": 0 },
      "solo_freelancer": { "low": 0, "target": 0, "high": 0 },
      "insured_company": { "low": 150, "target": 250, "high": 450 }
    },
    "materialAllowance": 0,
    "tradeStatus": "licensed_required",
    "confidence": "high",
    "sourceConfidence": "Official ESA rule. Keep as blocked quote so Louie does not accidentally accept wiring work.",
    "included": ["Referral guidance only"],
    "notIncluded": ["Opening devices", "Troubleshooting circuits", "Replacing wired fixtures or controls"],
    "stopConditions": "Any paid work touching house wiring, outlets, switches, GFCIs, dimmers, fixtures, panels, breakers, circuits, or hardwired devices should go to an ESA Licensed Electrical Contractor.",
    "sources": ["https://esasafe.com/consumer-protection/hire-licensed/", "https://esasafe.com/doing-electrical-work/"],
    "addOns": []
  },
  {
    "id": "gas-fuel-appliance-work",
    "category": "Referral and licensed work",
    "name": "Gas or fuel appliance work",
    "pricingUnit": "do not accept, TSSA certified technician required",
    "unitLabel": "job",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 0,
    "pricing": {
      "informal_floor": { "low": 0, "target": 0, "high": 0 },
      "solo_freelancer": { "low": 0, "target": 0, "high": 0 },
      "insured_company": { "low": 180, "target": 300, "high": 600 }
    },
    "materialAllowance": 0,
    "tradeStatus": "do_not_accept",
    "confidence": "high",
    "sourceConfidence": "Official TSSA certification boundary. Pricing is referral context only.",
    "included": ["Referral guidance only"],
    "notIncluded": ["Gas line work", "Burner, ignition, combustion, venting, or appliance service"],
    "stopConditions": "Do not accept gas smell, gas line, burner, ignition, combustion, venting, furnace service, fireplace service, water heater, or any fuel-fired appliance work without proper TSSA certification.",
    "sources": ["https://www.tssa.org/fuels-industry-professional", "https://www.ontario.ca/laws/regulation/010215"],
    "addOns": []
  },
  {
    "id": "building-fire-alarm-system-device",
    "category": "Referral and licensed work",
    "name": "Building fire alarm system device",
    "pricingUnit": "do not accept, life-safety system referral",
    "unitLabel": "device",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 0,
    "pricing": {
      "informal_floor": { "low": 0, "target": 0, "high": 0 },
      "solo_freelancer": { "low": 0, "target": 0, "high": 0 },
      "insured_company": { "low": 200, "target": 400, "high": 800 }
    },
    "materialAllowance": 0,
    "tradeStatus": "do_not_accept",
    "confidence": "high",
    "sourceConfidence": "Fire and life-safety systems should be handled by approved specialists.",
    "included": ["Referral guidance only"],
    "notIncluded": ["Testing, replacing, bypassing, silencing, wiring, or moving fire alarm devices"],
    "stopConditions": "Do not touch devices tied to building fire panels, condo common systems, monitored systems, sprinklers, elevators, magnetic hold-opens, or fire-rated assemblies.",
    "sources": ["https://www.toronto.ca/community-people/public-safety-alerts/safety-tips-prevention/safety-equipment-devices/smoke-alarms/"],
    "addOns": []
  },
  {
    "id": "toilet-bowl-replacement-reset",
    "category": "Plumbing fixtures and drains",
    "name": "Toilet bowl replacement or full toilet reset",
    "pricingUnit": "per toilet, labour only, toilet/wax ring/supply parts extra",
    "unitLabel": "toilet",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 175,
    "pricing": { "informal_floor": { "low": 150, "target": 225, "high": 300 }, "solo_freelancer": { "low": 250, "target": 325, "high": 450 }, "insured_company": { "low": 300, "target": 500, "high": 800 } },
    "materialAllowance": 0,
    "tradeStatus": "caution",
    "confidence": "medium",
    "sourceConfidence": "Toronto source OddJob lists $250-$400 labour only for toilet replacement. Plumber comparisons commonly $200-$500+ labour and $400-$800+ all-in.",
    "included": ["Remove old toilet or bowl", "Set replacement with new wax/seal", "Reconnect supply and test for leaks"],
    "notIncluded": ["Supplying toilet", "Flange repair", "Subfloor repair", "Drain relocation", "Disposal unless added"],
    "stopConditions": "Stop if flange is broken, floor is soft, shutoff leaks, drain is offset or damaged, toilet is wall-hung/pressure-assisted/macerating, condo rules require licensed plumber, or active leak damage is found.",
    "sources": ["https://oddjob.ca/how-much-does-a-handyman-charge-to-replace-a-toilet", "https://deltaplumbersinc.com/toilet-replacement-plumbing-service", "https://www.homedepot.com/services/c/cost-install-toilet/55af3b94a", "https://www.angi.com/articles/how-much-does-toilet-installation-cost.htm"],
    "addOns": [{ "id": "haul-away", "label": "Remove/dispose old toilet", "price": 75 }, { "id": "supply-line", "label": "Replace supply line", "price": 35 }, { "id": "stuck-bolts", "label": "Corroded or seized bolts", "price": 50 }]
  },
  {
    "id": "toilet-tank-replacement",
    "category": "Plumbing fixtures and drains",
    "name": "Toilet tank replacement",
    "pricingUnit": "per compatible tank, labour only, tank/parts extra",
    "unitLabel": "tank",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 90,
    "pricing": { "informal_floor": { "low": 100, "target": 140, "high": 180 }, "solo_freelancer": { "low": 150, "target": 200, "high": 275 }, "insured_company": { "low": 200, "target": 300, "high": 450 } },
    "materialAllowance": 0,
    "tradeStatus": "caution",
    "confidence": "medium",
    "sourceConfidence": "Specific tank-only Toronto pricing is weak, inferred from toilet repair/replacement and plumber visit pricing.",
    "included": ["Remove compatible tank", "Install replacement tank/gasket/bolts", "Reconnect and leak test"],
    "notIncluded": ["Supplying tank", "Bowl replacement", "Flange/floor work", "Non-compatible tank troubleshooting"],
    "stopConditions": "Stop if tank does not match bowl, porcelain is cracked, bolts are seized, shutoff leaks, toilet rocks, or replacement requires full toilet replacement.",
    "sources": ["https://oddjob.ca/how-much-does-a-handyman-charge-to-replace-a-toilet", "https://priorityplumbing.ca/plumbing/toilet-services", "https://modernize.com/plumbing/toilet-repair-cost"],
    "addOns": [{ "id": "supply-line", "label": "Replace supply line", "price": 35 }, { "id": "new-fill-flush", "label": "Install new fill/flush valve while tank is off", "price": 60 }]
  },
  {
    "id": "toilet-fill-valve-replacement",
    "category": "Plumbing fixtures and drains",
    "name": "Toilet fill valve replacement",
    "pricingUnit": "per toilet tank fill valve, part extra unless entered under materials",
    "unitLabel": "valve",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 45,
    "pricing": { "informal_floor": { "low": 70, "target": 95, "high": 125 }, "solo_freelancer": { "low": 110, "target": 140, "high": 190 }, "insured_company": { "low": 150, "target": 225, "high": 325 } },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "Exact Toronto fill valve pricing is limited. Anchored to Toronto small visit minimums and toilet repair source ranges.",
    "included": ["Replace fill valve", "Adjust water level", "Leak test"],
    "notIncluded": ["Shutoff valve replacement", "Tank replacement", "Supply line unless added", "Toilet removal"],
    "stopConditions": "Stop if shutoff valve will not close or leaks, supply nut is seized, tank porcelain is cracked, water damage is present, or toilet needs broader plumbing work.",
    "sources": ["https://priorityplumbing.ca/plumbing/toilet-services", "https://modernize.com/plumbing/toilet-repair-cost", "https://www.homestars.com/handyman-services/price-guides/handyman-services-cost-toronto"],
    "addOns": [{ "id": "flapper", "label": "Replace flapper too", "price": 25 }, { "id": "supply-line", "label": "Replace supply line", "price": 35 }]
  },
  {
    "id": "toilet-flush-valve-replacement",
    "category": "Plumbing fixtures and drains",
    "name": "Toilet flush valve replacement",
    "pricingUnit": "per toilet tank flush valve, tank may need removal, part extra",
    "unitLabel": "valve",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 75,
    "pricing": { "informal_floor": { "low": 90, "target": 125, "high": 160 }, "solo_freelancer": { "low": 150, "target": 200, "high": 275 }, "insured_company": { "low": 200, "target": 300, "high": 450 } },
    "materialAllowance": 0,
    "tradeStatus": "caution",
    "confidence": "medium",
    "sourceConfidence": "Specific Toronto flush valve pricing is limited. Higher than fill valve because tank removal may be needed.",
    "included": ["Replace flush valve", "Replace tank-to-bowl seal where applicable", "Leak test"],
    "notIncluded": ["Toilet reset", "Broken tank bolts", "Tank/bowl replacement", "Flange/floor work"],
    "stopConditions": "Stop if tank bolts are badly corroded, porcelain is cracked, tank is incompatible, shutoff leaks, or tank removal risks breaking the toilet.",
    "sources": ["https://priorityplumbing.ca/plumbing/toilet-services", "https://modernize.com/plumbing/toilet-repair-cost", "https://www.homestars.com/handyman-services/price-guides/handyman-services-cost-toronto"],
    "addOns": [{ "id": "new-fill-valve", "label": "Replace fill valve while open", "price": 60 }, { "id": "corroded-bolts", "label": "Corroded tank bolts", "price": 50 }]
  },
  {
    "id": "toilet-handle-chain-flapper-repair",
    "category": "Plumbing fixtures and drains",
    "name": "Toilet handle, chain, or flapper replacement",
    "pricingUnit": "per toilet, simple tank part repair, parts extra",
    "unitLabel": "toilet",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 30,
    "pricing": { "informal_floor": { "low": 50, "target": 75, "high": 100 }, "solo_freelancer": { "low": 85, "target": 110, "high": 150 }, "insured_company": { "low": 120, "target": 175, "high": 250 } },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "Simple toilet tank repair pricing inferred from Toronto small-job minimums and general toilet repair ranges.",
    "included": ["Replace handle, chain, or flapper", "Adjust flush action", "Basic leak/running test"],
    "notIncluded": ["Fill valve", "Flush valve", "Shutoff/supply repair", "Toilet removal"],
    "stopConditions": "Stop if repair does not solve running/flush issue, tank parts are non-standard, shutoff leaks, or toilet needs fill/flush valve replacement.",
    "sources": ["https://modernize.com/plumbing/toilet-repair-cost", "https://priorityplumbing.ca/plumbing/toilet-services", "https://buildman.ca/handyman-cost-toronto.html"],
    "addOns": []
  },
  {
    "id": "toilet-floor-flange-repair-replacement",
    "category": "Referral and licensed work",
    "name": "Toilet floor flange repair or replacement",
    "pricingUnit": "referral only, depends on pipe/floor condition",
    "unitLabel": "flange",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 0,
    "pricing": { "informal_floor": { "low": 0, "target": 0, "high": 0 }, "solo_freelancer": { "low": 0, "target": 0, "high": 0 }, "insured_company": { "low": 250, "target": 450, "high": 900 } },
    "materialAllowance": 0,
    "tradeStatus": "do_not_accept",
    "confidence": "medium",
    "sourceConfidence": "Flange replacement can involve drain pipe, subfloor, leaks, and concealed damage. Use referral pricing only.",
    "included": ["Referral guidance only"],
    "notIncluded": ["Drain pipe repair", "Subfloor repair", "Toilet reset", "Leak damage"],
    "stopConditions": "Do not accept if flange is cracked, loose, too low/high, corroded, connected to damaged pipe, or floor/subfloor is soft. Refer to plumber and possibly flooring repair.",
    "sources": ["https://www.angi.com/articles/how-much-does-toilet-installation-cost.htm", "https://cityrooter.ca/plumber-cost"],
    "addOns": []
  },
  {
    "id": "vanity-sink-replacement",
    "category": "Plumbing fixtures and drains",
    "name": "Vanity sink replacement, same size and rough-in",
    "pricingUnit": "per vanity sink, labour only, sink/faucet/drain parts extra",
    "unitLabel": "sink",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 175,
    "pricing": { "informal_floor": { "low": 150, "target": 225, "high": 300 }, "solo_freelancer": { "low": 250, "target": 350, "high": 500 }, "insured_company": { "low": 375, "target": 560, "high": 745 } },
    "materialAllowance": 0,
    "tradeStatus": "caution",
    "confidence": "medium",
    "sourceConfidence": "Sink install comparison from Toronto plumber and Home Depot ranges. Handyman scope only for same-size visible replacement.",
    "included": ["Remove old drop-in/vanity sink", "Install same-size replacement", "Reconnect visible drain and faucet if compatible"],
    "notIncluded": ["Countertop cutting", "Vanity replacement", "Moving plumbing", "Stone cutting", "Hidden leaks"],
    "stopConditions": "Stop if sink size does not match, countertop cutting is required, supply/drain locations need changes, shutoffs leak, drain piping is corroded, or concealed plumbing work is needed.",
    "sources": ["https://cityrooter.ca/plumber-cost", "https://www.homedepot.com/services/c/cost-install-sink/482125d2a", "https://www.thumbtack.com/p/sink-repair-cost"],
    "addOns": [{ "id": "remove-old-caulk", "label": "Remove old silicone/caulk", "price": 50 }, { "id": "connect-faucet", "label": "Install faucet with sink", "price": 100 }]
  },
  {
    "id": "faucet-replacement-visible-shutoffs",
    "category": "Plumbing fixtures and drains",
    "name": "Bathroom or kitchen faucet replacement, visible shutoffs",
    "pricingUnit": "per faucet, customer supplies faucet unless material cost is entered",
    "unitLabel": "faucet",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 125,
    "pricing": { "informal_floor": { "low": 125, "target": 175, "high": 225 }, "solo_freelancer": { "low": 175, "target": 250, "high": 350 }, "insured_company": { "low": 245, "target": 375, "high": 550 } },
    "materialAllowance": 0,
    "tradeStatus": "caution",
    "confidence": "medium",
    "sourceConfidence": "Toronto plumber source lists faucet install from $245. Freelancer target is lower but requires working shutoffs and visible connections.",
    "included": ["Remove old faucet", "Install compatible faucet", "Reconnect visible supply lines", "Leak test"],
    "notIncluded": ["Replacing shutoff valves", "Moving lines", "Drain reconfiguration", "Countertop drilling"],
    "stopConditions": "Confirm shutoffs work before starting. Stop if valves leak, lines are corroded, faucet holes do not match, water lines need alteration, or access is too tight/risky.",
    "sources": ["https://cityrooter.ca/plumber-cost", "https://www.thumbtack.com/p/sink-repair-cost", "https://www.homestars.com/handyman-services/price-guides/handyman-services-cost-toronto"],
    "addOns": [{ "id": "new-supply-lines", "label": "Replace supply lines", "price": 40 }, { "id": "seized-hardware", "label": "Seized/corroded hardware", "price": 75 }]
  },
  {
    "id": "pop-up-po-plug-replacement",
    "category": "Plumbing fixtures and drains",
    "name": "Pop-up drain / PO plug replacement",
    "pricingUnit": "per bathroom sink pop-up drain assembly, part extra",
    "unitLabel": "drain",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 60,
    "pricing": { "informal_floor": { "low": 80, "target": 110, "high": 150 }, "solo_freelancer": { "low": 125, "target": 175, "high": 250 }, "insured_company": { "low": 175, "target": 275, "high": 400 } },
    "materialAllowance": 0,
    "tradeStatus": "caution",
    "confidence": "medium",
    "sourceConfidence": "Specific Toronto PO plug pricing is limited. Inferred from sink/faucet repair ranges and small plumbing visit minimums.",
    "included": ["Remove old pop-up/PO plug", "Install compatible replacement", "Reconnect visible tailpiece/P-trap", "Leak test"],
    "notIncluded": ["Faucet replacement", "Corroded drain piping", "Wall drain repair", "Vanity replacement"],
    "stopConditions": "Stop if nut is seized, sink is cracked, drain body is corroded into place, P-trap/wall arm is rotten, or leak continues from concealed plumbing.",
    "sources": ["https://www.thumbtack.com/p/sink-repair-cost", "https://cityrooter.ca/plumber-cost", "https://www.homestars.com/handyman-services/price-guides/handyman-services-cost-toronto"],
    "addOns": []
  },
  {
    "id": "basket-strainer-replacement",
    "category": "Plumbing fixtures and drains",
    "name": "Kitchen sink basket strainer replacement",
    "pricingUnit": "per basket strainer, part extra",
    "unitLabel": "strainer",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 80,
    "pricing": { "informal_floor": { "low": 100, "target": 140, "high": 190 }, "solo_freelancer": { "low": 150, "target": 225, "high": 325 }, "insured_company": { "low": 225, "target": 325, "high": 500 } },
    "materialAllowance": 0,
    "tradeStatus": "caution",
    "confidence": "medium",
    "sourceConfidence": "Direct local basket strainer pricing is weak. Plumber and user-market comparisons suggest $200+ is common when billed professionally.",
    "included": ["Remove old basket strainer", "Install compatible strainer", "Reconnect visible drain and leak test"],
    "notIncluded": ["Garburator", "Dishwasher drain changes", "Corroded plumbing", "Sink removal"],
    "stopConditions": "Stop if locknut is seized, sink is thin/rusted, garburator is attached, drain pipes are corroded, double-sink layout needs reconfiguration, or wall drain has issues.",
    "sources": ["https://www.thumbtack.com/p/sink-repair-cost", "https://cityrooter.ca/plumber-cost", "Reddit user quote snippet for basket strainer, weak non-local sentiment"],
    "addOns": [{ "id": "dual-bowl", "label": "Double-bowl drain complexity", "price": 75 }]
  },
  {
    "id": "p-trap-replacement-visible",
    "category": "Plumbing fixtures and drains",
    "name": "P-trap replacement under sink, visible piping",
    "pricingUnit": "per sink P-trap, parts extra",
    "unitLabel": "trap",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 65,
    "pricing": { "informal_floor": { "low": 80, "target": 120, "high": 160 }, "solo_freelancer": { "low": 125, "target": 175, "high": 250 }, "insured_company": { "low": 200, "target": 300, "high": 450 } },
    "materialAllowance": 0,
    "tradeStatus": "caution",
    "confidence": "medium",
    "sourceConfidence": "Inferred from sink repair, drain cabling, and Toronto plumber small-job pricing.",
    "included": ["Replace accessible P-trap", "Reconnect visible tubular drain", "Leak test"],
    "notIncluded": ["Wall drain repair", "ABS/copper alterations", "Concealed plumbing", "Drain snaking unless added"],
    "stopConditions": "Stop if wall arm is corroded, pipe breaks, drain pitch/layout is wrong, trap is glued ABS/copper beyond simple slip-joint replacement, or clog persists after replacement.",
    "sources": ["https://www.thumbtack.com/p/sink-repair-cost", "https://cityrooter.ca/plumber-cost", "https://plumberdrainrepairs.com/blog/drain-snaking-toronto"],
    "addOns": []
  },
  {
    "id": "faucet-aerator-replacement-cleaning",
    "category": "Plumbing fixtures and drains",
    "name": "Faucet aerator cleaning or replacement",
    "pricingUnit": "per faucet aerator, simple removal/replacement, part extra",
    "unitLabel": "aerator",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 15,
    "pricing": { "informal_floor": { "low": 40, "target": 60, "high": 90 }, "solo_freelancer": { "low": 75, "target": 95, "high": 125 }, "insured_company": { "low": 100, "target": 150, "high": 225 } },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "Tiny standalone task, pricing driven by minimum visit or bundle. Use as add-on whenever possible.",
    "included": ["Remove/clean or replace aerator", "Check flow after replacement"],
    "notIncluded": ["Faucet cartridge", "Supply line work", "Whole faucet replacement", "Low pressure diagnosis"],
    "stopConditions": "Stop if aerator is seized, threads strip, faucet body is corroded, low flow remains after cleaning, or broader plumbing diagnosis is needed.",
    "sources": ["https://www.homestars.com/handyman-services/price-guides/handyman-services-cost-toronto", "https://buildman.ca/handyman-cost-toronto.html"],
    "addOns": []
  },
  {
    "id": "minor-sink-unplugging-hand-snake",
    "category": "Plumbing fixtures and drains",
    "name": "Minor sink unplugging with hand snake or trap cleanout",
    "pricingUnit": "per sink, minor clog only, no main drain or machine auger",
    "unitLabel": "sink",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 75,
    "pricing": { "informal_floor": { "low": 90, "target": 125, "high": 175 }, "solo_freelancer": { "low": 125, "target": 175, "high": 250 }, "insured_company": { "low": 199, "target": 250, "high": 350 } },
    "materialAllowance": 0,
    "tradeStatus": "caution",
    "confidence": "high",
    "sourceConfidence": "Toronto drain snaking sources show basic drain snaking commonly around $99-$250+, kitchen sinks often higher. Freelancer scope should stay minor only.",
    "included": ["Clear simple sink clog through trap or small hand snake", "Basic flow test", "Clean work area"],
    "notIncluded": ["Main drain", "Hydro jetting", "Camera inspection", "Recurring clogs", "Machine auger", "Pipe repair"],
    "stopConditions": "Stop if multiple fixtures are slow, water backs up elsewhere, main line is suspected, trap or pipe is corroded, clog does not clear quickly, chemical drain cleaner was used, or machine drain equipment is needed.",
    "sources": ["https://plumberdrainrepairs.com/blog/drain-snaking-toronto", "https://properplumbinggta.com/blog/cost-to-unclog-drain-toronto", "https://cityrooter.ca/plumber-cost", "https://plumberdrainrepairs.com/blog/drain-cleaning-cost-toronto"],
    "addOns": [{ "id": "replace-p-trap", "label": "Replace trap after cleanout", "price": 75 }]
  },
  {
    "id": "tv-wall-mount-drywall-studs",
    "category": "Mounting and hanging",
    "name": "TV wall mounting on drywall with wood studs",
    "pricingUnit": "per TV up to 65 in, client-supplied compatible bracket",
    "unitLabel": "TV",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 100,
    "pricing": { "informal_floor": { "low": 75, "target": 110, "high": 150 }, "solo_freelancer": { "low": 100, "target": 175, "high": 250 }, "insured_company": { "low": 175, "target": 250, "high": 350 } },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "high",
    "sourceConfidence": "Multiple 2026 Toronto sources place standard TV mounting around $100-$250.",
    "included": ["Locate wood studs", "Level and install compatible bracket", "Hang TV", "Basic external cable tidy"],
    "notIncluded": ["Bracket", "In-wall power or electrical work", "Brick, concrete, stone, fireplace, or metal studs", "TV over 65 in or two-person lift"],
    "stopConditions": "Stop if stud layout is unsuitable, wall condition is unsafe, concealed wiring/plumbing risk is detected, bracket is incompatible, or the TV requires a two-person lift.",
    "sources": ["https://renohouse.ca/blog/handyman-prices-list-toronto", "https://urbantasker.com/blog/how-much-does-handyman-cost-in-greater-toronto-area-gta-ontario-canada", "https://www.getahomepro.co/blog/handyman-cost-toronto-ontario"],
    "addOns": [{ "id": "tv-soundbar", "label": "Mount soundbar below TV", "price": 60 }, { "id": "tv-surface-raceway", "label": "Install paintable surface cable raceway", "price": 45 }]
  },
  {
    "id": "drywall-small-hole-patch-ready-for-paint",
    "category": "Walls and finishes",
    "name": "Small drywall hole patch, ready for paint",
    "pricingUnit": "per small patch up to about 6 in; return visit or drying time may apply",
    "unitLabel": "patch",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 65,
    "pricing": { "informal_floor": { "low": 75, "target": 100, "high": 150 }, "solo_freelancer": { "low": 125, "target": 175, "high": 250 }, "insured_company": { "low": 200, "target": 300, "high": 450 } },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "high",
    "sourceConfidence": "2026 Toronto guides consistently list small drywall patching around $75-$250 before extensive painting or texture matching.",
    "included": ["Square and back patch where needed", "Tape and compound", "Sand ready for primer/paint", "Basic cleanup"],
    "notIncluded": ["Painting", "Texture matching", "Water-damage remediation", "Ceiling work", "Large or multiple damaged areas"],
    "stopConditions": "Stop if moisture, mould, active leakage, asbestos risk, extensive cracking, loose plaster, or structural movement is suspected.",
    "sources": ["https://renohouse.ca/blog/handyman-prices-list-toronto", "https://www.getahomepro.co/blog/handyman-cost-toronto-ontario", "https://www.amaximumconstruction.com/handyman-charges/"],
    "addOns": [{ "id": "drywall-prime", "label": "Spot-prime completed patch", "price": 40 }, { "id": "drywall-paint-touchup", "label": "Paint touch-up with client-supplied matching paint", "price": 65 }]
  },
  {
    "id": "bathtub-shower-recaulking",
    "category": "Bathroom small repairs",
    "name": "Bathtub or shower surround re-caulking",
    "pricingUnit": "per standard tub or shower surround",
    "unitLabel": "surround",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 100,
    "pricing": { "informal_floor": { "low": 75, "target": 110, "high": 150 }, "solo_freelancer": { "low": 125, "target": 175, "high": 250 }, "insured_company": { "low": 250, "target": 400, "high": 600 } },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "high",
    "sourceConfidence": "Toronto 2026 market guides show basic bathroom caulking near $75-$250, while premium companies quote substantially more.",
    "included": ["Remove accessible old silicone", "Clean and dry joint", "Apply bathroom-rated silicone", "Tool bead and clean up"],
    "notIncluded": ["Grout repair", "Mould remediation", "Leak investigation", "Shower-door removal", "Tile or substrate repair"],
    "stopConditions": "Stop if the wall is soft, tile is loose, mould extends behind finishes, active leakage exists, or the joint is too wide for caulk alone.",
    "sources": ["https://renohouse.ca/blog/handyman-prices-list-toronto", "https://urbantasker.com/blog/how-much-does-handyman-cost-in-greater-toronto-area-gta-ontario-canada", "https://www.fix-it-friend.com/toronto-handyman-services2"],
    "addOns": [{ "id": "caulk-glass-joints", "label": "Re-caulk accessible glass-shower joints", "price": 85 }]
  },
  {
    "id": "shower-head-replacement",
    "category": "Bathroom small repairs",
    "name": "Shower head replacement on existing arm",
    "pricingUnit": "per compatible shower head, client supplies fixture",
    "unitLabel": "shower head",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 35,
    "pricing": { "informal_floor": { "low": 40, "target": 60, "high": 90 }, "solo_freelancer": { "low": 75, "target": 100, "high": 150 }, "insured_company": { "low": 125, "target": 175, "high": 250 } },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "Toronto guides place simple shower-head and supply-line work around $50-$100 before visit minimums.",
    "included": ["Remove existing shower head", "Seal threaded connection", "Install compatible replacement", "Leak and spray test"],
    "notIncluded": ["Valve or cartridge work", "Shower arm replacement inside wall", "New plumbing", "Tile opening"],
    "stopConditions": "Stop if the shower arm turns in the wall, threads are damaged, concealed leakage is suspected, or valve/plumbing work is required.",
    "sources": ["https://renohouse.ca/blog/handyman-home-maintenance-guide-toronto", "https://www.fix-it-friend.com/toronto-handyman-services2"],
    "addOns": []
  },
  {
    "id": "interior-door-slab-install-existing-frame",
    "category": "Doors, locks, and hardware",
    "name": "Interior door slab installation in existing frame",
    "pricingUnit": "per standard interior slab; door and hardware supplied by client",
    "unitLabel": "door",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 175,
    "pricing": { "informal_floor": { "low": 150, "target": 200, "high": 300 }, "solo_freelancer": { "low": 225, "target": 350, "high": 500 }, "insured_company": { "low": 450, "target": 700, "high": 1100 } },
    "materialAllowance": 0,
    "tradeStatus": "caution",
    "confidence": "medium",
    "sourceConfidence": "2026 GTA guides generally place interior door installation around $150-$500; fitting and preparation cause wide variation.",
    "included": ["Measure existing opening", "Transfer and mortise standard hinges", "Bore standard latch set if required", "Fit, hang, and adjust slab"],
    "notIncluded": ["Prehung frame replacement", "Frame or casing repair", "Painting", "Non-standard, glass, fire-rated, or exterior doors"],
    "stopConditions": "Stop if the frame is twisted or damaged, opening is non-standard, major planing is required, door is fire-rated, or structural/frame replacement is needed.",
    "sources": ["https://renohouse.ca/blog/handyman-home-maintenance-guide-toronto", "https://urbantasker.com/blog/how-much-does-handyman-cost-in-greater-toronto-area-gta-ontario-canada"],
    "addOns": []
  },
  {
    "id": "flat-pack-furniture-assembly-standard",
    "category": "Assembly",
    "name": "Standard flat-pack furniture assembly",
    "pricingUnit": "per small-to-medium item; complexity confirmed from model/photos",
    "unitLabel": "item",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 75,
    "pricing": { "informal_floor": { "low": 60, "target": 90, "high": 140 }, "solo_freelancer": { "low": 100, "target": 160, "high": 250 }, "insured_company": { "low": 175, "target": 275, "high": 425 } },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "high",
    "sourceConfidence": "Toronto 2026 sources place common flat-pack assembly around $75-$250 depending on item and complexity.",
    "included": ["Inventory packaged parts", "Assemble one standard item", "Level and basic adjustment", "Attach included anti-tip hardware where safe"],
    "notIncluded": ["Large wardrobes", "Murphy beds", "Missing hardware", "Disposal of packaging", "Wall modification"],
    "stopConditions": "Stop if parts are missing/damaged, instructions are unavailable, anchoring surface is unsafe, or assembly requires a second person or specialist installation.",
    "sources": ["https://renohouse.ca/blog/handyman-prices-list-toronto", "https://www.getahomepro.co/blog/handyman-cost-toronto-ontario"],
    "addOns": [{ "id": "assembly-packaging", "label": "Break down and bag packaging", "price": 35 }]
  },
  {
    "id": "baseboard-trim-minor-repair",
    "category": "Walls and finishes",
    "name": "Minor baseboard or trim repair",
    "pricingUnit": "per room or localized repair area",
    "unitLabel": "area",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 80,
    "pricing": { "informal_floor": { "low": 75, "target": 110, "high": 175 }, "solo_freelancer": { "low": 125, "target": 190, "high": 275 }, "insured_company": { "low": 225, "target": 350, "high": 500 } },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "Toronto 2026 guides commonly place localized trim/baseboard repair near $100-$220.",
    "included": ["Reattach loose trim", "Fill small nail holes and gaps", "Apply paintable caulk", "Basic cleanup"],
    "notIncluded": ["Replacement trim", "Painting", "Rot or water damage", "Whole-room installation", "Complex mitres"],
    "stopConditions": "Stop if trim is rotten, matching profile is unavailable, wall damage is extensive, or flooring/water damage must be repaired first.",
    "sources": ["https://renohouse.ca/blog/handyman-prices-list-toronto", "https://www.getahomepro.co/blog/handyman-cost-toronto-ontario"],
    "addOns": [{ "id": "trim-touchup", "label": "Paint touch-up with client-supplied matching paint", "price": 65 }]
  },
  {
    "id": "gutter-cleaning-single-storey",
    "category": "Exterior maintenance",
    "name": "Single-storey gutter cleaning",
    "pricingUnit": "per small bungalow/standard single-storey home, safe ladder access",
    "unitLabel": "home",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 0,
    "pricing": { "informal_floor": { "low": 100, "target": 140, "high": 200 }, "solo_freelancer": { "low": 150, "target": 225, "high": 300 }, "insured_company": { "low": 225, "target": 350, "high": 500 } },
    "materialAllowance": 0,
    "tradeStatus": "caution",
    "confidence": "high",
    "sourceConfidence": "Multiple 2026 GTA sources place single-storey gutter cleaning around $100-$300.",
    "included": ["Remove loose gutter debris", "Bag debris", "Check accessible downspout flow", "Ground cleanup"],
    "notIncluded": ["Two-storey or roof access", "Gutter repair", "Guards", "Frozen gutters", "Blocked underground drains"],
    "stopConditions": "Do not proceed in unsafe weather, near electrical hazards, on unstable ground, above one storey, or where ladder setup and fall protection are inadequate.",
    "sources": ["https://renohouse.ca/blog/handyman-prices-list-toronto", "https://www.getahomepro.co/blog/handyman-cost-toronto-ontario", "https://urbantasker.com/blog/how-much-does-handyman-cost-in-greater-toronto-area-gta-ontario-canada"],
    "addOns": []
  },
  {
    "id": "dryer-vent-cleaning-accessible",
    "category": "Filters and maintenance",
    "name": "Accessible dryer vent cleaning",
    "pricingUnit": "per short, accessible ground-floor vent run",
    "unitLabel": "vent",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 75,
    "pricing": { "informal_floor": { "low": 90, "target": 125, "high": 175 }, "solo_freelancer": { "low": 140, "target": 200, "high": 300 }, "insured_company": { "low": 225, "target": 325, "high": 475 } },
    "materialAllowance": 0,
    "tradeStatus": "caution",
    "confidence": "medium",
    "sourceConfidence": "Priced from Toronto/GTA minimum visits and common vent-cleaning service ranges; long or rooftop runs require specialist quoting.",
    "included": ["Disconnect accessible dryer", "Brush/vacuum short accessible duct", "Clean exterior termination if ground-accessible", "Reconnect and airflow check"],
    "notIncluded": ["Roof access", "Long concealed runs", "Bird-nest removal", "Duct replacement", "Gas dryer disconnection"],
    "stopConditions": "Stop for gas-appliance disconnection, inaccessible or rooftop terminations, crushed/failed duct, pest nesting, or a run that specialist rotary equipment must service.",
    "sources": ["https://renohouse.ca/blog/handyman-home-maintenance-guide-toronto", "https://www.homestars.com/handyman-services/handyman-pros/toronto"],
    "addOns": []
  },
  {
    "id": "interior-room-painting-standard",
    "category": "Painting",
    "name": "Interior room painting (walls and ceiling)",
    "pricingUnit": "per standard room (10x12 to 12x14), 8ft ceiling, 2 coats",
    "unitLabel": "room",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 0,
    "pricing": { "informal_floor": { "low": 250, "target": 350, "high": 500 }, "solo_freelancer": { "low": 400, "target": 550, "high": 750 }, "insured_company": { "low": 550, "target": 750, "high": 950 } },
    "materialAllowance": 80,
    "tradeStatus": "handyman_ok",
    "confidence": "high",
    "sourceConfidence": "Multiple 2026 GTA sources place single room interior painting at $300-$900, with $400-$600 most common for standard bedroom.",
    "included": ["Light furniture moving", "Surface prep and cleaning", "Fill small nail holes", "Mask trim and outlets", "Two coats walls and ceiling", "Basic cleanup"],
    "notIncluded": ["Heavy furniture moving", "Primer coat if needed", "Extensive patching", "Trim/door painting", "Wallpaper removal", "High or vaulted ceilings", "Paint supply"],
    "stopConditions": "Stop if extensive wall damage exists, wallpaper must be removed, mold is present, ceiling exceeds 10ft, or surface prep exceeds standard nail-hole filling.",
    "sources": ["https://urbantasker.com/blog/how-much-do-painting-services-cost-in-toronto-and-gta-in-specific", "https://www.homepainterspro.ca/blogs/cost-to-paint-a-house-toronto/"],
    "addOns": [
      { "id": "paint-primer", "label": "Apply primer coat", "price": 85 },
      { "id": "paint-trim-door", "label": "Paint trim and door in same room", "price": 120 }
    ]
  },
  {
    "id": "accent-wall-painting",
    "category": "Painting",
    "name": "Accent wall painting (single wall)",
    "pricingUnit": "per standard accent wall, existing paint condition good",
    "unitLabel": "wall",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 0,
    "pricing": { "informal_floor": { "low": 150, "target": 220, "high": 320 }, "solo_freelancer": { "low": 250, "target": 350, "high": 500 }, "insured_company": { "low": 380, "target": 550, "high": 750 } },
    "materialAllowance": 35,
    "tradeStatus": "handyman_ok",
    "confidence": "high",
    "sourceConfidence": "2026 GTA sources place accent wall painting at $200-$400 for standard walls.",
    "included": ["Mask adjacent walls and trim", "Two coats on accent wall", "Basic cleanup"],
    "notIncluded": ["Primer", "Extensive patching", "Textured finishes", "Paint supply"],
    "stopConditions": "Stop if wall requires extensive prep, texture matching is needed, or existing finish is incompatible with new paint.",
    "sources": ["https://www.homepainterspro.ca/blogs/cost-to-paint-a-house-toronto/"],
    "addOns": []
  },
  {
    "id": "grab-bar-installation-studs",
    "category": "Safety and accessibility",
    "name": "Grab bar installation (into studs)",
    "pricingUnit": "per bar, standard drywall with accessible studs",
    "unitLabel": "bar",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 80,
    "pricing": { "informal_floor": { "low": 100, "target": 140, "high": 200 }, "solo_freelancer": { "low": 160, "target": 225, "high": 325 }, "insured_company": { "low": 250, "target": 375, "high": 525 } },
    "materialAllowance": 60,
    "tradeStatus": "handyman_ok",
    "confidence": "high",
    "sourceConfidence": "2026 Toronto sources place grab bar installation into studs at $165-$340 including bar and labour.",
    "included": ["Locate studs", "Level and mark position", "Drill pilot holes", "Install bar with lag screws into studs", "Test and verify secure mount"],
    "notIncluded": ["Tile drilling", "Blocking installation", "Drywall opening and patching", "Multiple-bar layout consultation", "Bar supply"],
    "stopConditions": "Stop if no studs are accessible at desired location, tile drilling is required, or blocking must be installed behind drywall.",
    "sources": ["https://goodcompanyhome.com/grab-bar-installation-cost-toronto/", "https://renohouse.ca/blog/grab-bar-installation-toronto-bathroom"],
    "addOns": []
  },
  {
    "id": "grab-bar-installation-anchors",
    "category": "Safety and accessibility",
    "name": "Grab bar installation (anchors required)",
    "pricingUnit": "per bar, no studs available, requires specialty anchors",
    "unitLabel": "bar",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 110,
    "pricing": { "informal_floor": { "low": 160, "target": 225, "high": 325 }, "solo_freelancer": { "low": 250, "target": 375, "high": 525 }, "insured_company": { "low": 375, "target": 550, "high": 775 } },
    "materialAllowance": 90,
    "tradeStatus": "caution",
    "confidence": "medium",
    "sourceConfidence": "2026 Toronto sources place no-stud anchor installations at $255-$520 including hardware and labour.",
    "included": ["Mark and level position", "Install specialty toggle or SecureMount anchors", "Mount bar securely", "Load test and verify"],
    "notIncluded": ["Blocking installation behind drywall", "Tile drilling", "Structural backup if wall cannot support load", "Bar supply"],
    "stopConditions": "Stop if wall structure cannot safely support grab bar load, blocking installation is required, or tile/stone surface needs drilling.",
    "sources": ["https://goodcompanyhome.com/grab-bar-installation-cost-toronto/", "https://renohouse.ca/blog/grab-bar-installation-toronto-bathroom"],
    "addOns": []
  },
  {
    "id": "vinyl-laminate-plank-replacement",
    "category": "Flooring",
    "name": "Vinyl or laminate plank replacement (1-5 planks)",
    "pricingUnit": "per small section near wall or accessible area, matching material available",
    "unitLabel": "section",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 0,
    "pricing": { "informal_floor": { "low": 120, "target": 180, "high": 280 }, "solo_freelancer": { "low": 200, "target": 300, "high": 450 }, "insured_company": { "low": 325, "target": 500, "high": 725 } },
    "materialAllowance": 25,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "2026 GTA sources place simple plank replacement at $150-$350 including minimum call-out.",
    "included": ["Remove damaged planks", "Prepare edges", "Install replacement planks", "Blend seams"],
    "notIncluded": ["Mid-room access requiring extensive disassembly", "Subfloor repair", "Transition strip replacement", "Material supply if not provided"],
    "stopConditions": "Stop if subfloor is damaged, extensive disassembly is required, matching material is unavailable, or water damage is present.",
    "sources": ["https://nedesestimating.com/cost-to-repair-vinyl-plank-flooring/", "https://renohouse.ca/services/flooring/floor-repair"],
    "addOns": [
      { "id": "floor-transition", "label": "Replace or adjust transition strip", "price": 65 }
    ]
  },
  {
    "id": "hardwood-spot-repair",
    "category": "Flooring",
    "name": "Hardwood board spot repair (1-4 boards)",
    "pricingUnit": "per small damaged section, matching wood available",
    "unitLabel": "section",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 0,
    "pricing": { "informal_floor": { "low": 180, "target": 275, "high": 425 }, "solo_freelancer": { "low": 300, "target": 450, "high": 650 }, "insured_company": { "low": 475, "target": 700, "high": 1000 } },
    "materialAllowance": 40,
    "tradeStatus": "caution",
    "confidence": "medium",
    "sourceConfidence": "2026 GTA sources place spot hardwood repair at $250-$600 for small areas including stain blend.",
    "included": ["Remove damaged boards", "Fit and install replacement boards", "Stain blend to match existing", "Apply protective finish"],
    "notIncluded": ["Full room refinishing", "Subfloor repair", "Complex inlay patterns", "Material supply if not provided"],
    "stopConditions": "Stop if subfloor damage exists, matching material is unavailable, extensive refinishing is needed, or water damage is widespread.",
    "sources": ["https://renohouse.ca/services/flooring/floor-repair"],
    "addOns": []
  },
  {
    "id": "kitchen-backsplash-tile-repair",
    "category": "Tile work",
    "name": "Kitchen backsplash tile repair (1-3 tiles)",
    "pricingUnit": "per small repair area, matching tile available",
    "unitLabel": "area",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 0,
    "pricing": { "informal_floor": { "low": 110, "target": 165, "high": 250 }, "solo_freelancer": { "low": 175, "target": 270, "high": 400 }, "insured_company": { "low": 300, "target": 450, "high": 650 } },
    "materialAllowance": 20,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "Priced from minimum service calls and tile repair ranges in 2026 GTA market.",
    "included": ["Remove damaged tile(s)", "Clean substrate", "Install replacement tile(s)", "Grout and seal"],
    "notIncluded": ["Full backsplash replacement", "Electrical work around outlets", "Extensive water damage repair", "Material supply if not provided"],
    "stopConditions": "Stop if matching tile is unavailable, substrate damage is extensive, electrical work is needed, or mold is present.",
    "sources": ["https://primetiling.ca/pricing-guide"],
    "addOns": []
  },
  {
    "id": "backsplash-grout-recaulk",
    "category": "Tile work",
    "name": "Backsplash or countertop grout and caulk refresh",
    "pricingUnit": "per standard kitchen backsplash area or countertop perimeter",
    "unitLabel": "area",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 0,
    "pricing": { "informal_floor": { "low": 85, "target": 135, "high": 200 }, "solo_freelancer": { "low": 140, "target": 210, "high": 325 }, "insured_company": { "low": 225, "target": 350, "high": 500 } },
    "materialAllowance": 25,
    "tradeStatus": "handyman_ok",
    "confidence": "high",
    "sourceConfidence": "2026 GTA sources place kitchen/bathroom caulking refresh at $100-$250.",
    "included": ["Remove old cracked caulk", "Clean joints", "Apply new caulk or grout sealer", "Smooth and finish"],
    "notIncluded": ["Full tile re-grouting", "Extensive mold remediation", "Tile repair or replacement"],
    "stopConditions": "Stop if mold is extensive, tiles are loose or damaged, or substrate prep is needed.",
    "sources": ["https://urbantasker.com/blog/how-much-does-handyman-cost-in-greater-toronto-area-gta-ontario-canada"],
    "addOns": []
  },
  {
    "id": "deck-board-replacement-small",
    "category": "Exterior maintenance",
    "name": "Deck board replacement (3-6 boards)",
    "pricingUnit": "per small section, standard pressure-treated or cedar",
    "unitLabel": "section",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 0,
    "pricing": { "informal_floor": { "low": 160, "target": 240, "high": 375 }, "solo_freelancer": { "low": 250, "target": 375, "high": 550 }, "insured_company": { "low": 400, "target": 600, "high": 850 } },
    "materialAllowance": 45,
    "tradeStatus": "handyman_ok",
    "confidence": "high",
    "sourceConfidence": "2026 GTA sources place small deck board replacement at $200-$500 for materials and labour.",
    "included": ["Remove damaged boards", "Inspect and sister joists if minor sagging", "Install new boards", "Match fastener pattern"],
    "notIncluded": ["Full deck resurfacing", "Structural joist replacement", "Railing work", "Staining or sealing", "Material supply if not provided"],
    "stopConditions": "Stop if joists are rotten or damaged, structural issues exist, railing must be disassembled, or code compliance is required.",
    "sources": ["https://meandmyvan.com/how-much-does-deck-repair-cost-in-the-gta-in-2026/", "https://renohouse.ca/services/exterior/deck-repair"],
    "addOns": [
      { "id": "deck-stain", "label": "Apply stain or sealer to repaired area", "price": 75 }
    ]
  },
  {
    "id": "fence-picket-board-replacement",
    "category": "Exterior maintenance",
    "name": "Fence picket or board replacement (3-6 pieces)",
    "pricingUnit": "per small section, standard wood fence",
    "unitLabel": "section",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 0,
    "pricing": { "informal_floor": { "low": 120, "target": 185, "high": 300 }, "solo_freelancer": { "low": 200, "target": 300, "high": 450 }, "insured_company": { "low": 325, "target": 500, "high": 725 } },
    "materialAllowance": 30,
    "tradeStatus": "handyman_ok",
    "confidence": "high",
    "sourceConfidence": "2026 Toronto sources place minor picket replacement at $150-$400.",
    "included": ["Remove damaged pickets/boards", "Cut and install replacements", "Match existing fastener pattern", "Basic leveling"],
    "notIncluded": ["Post repair or replacement", "Structural work", "Full panel replacement", "Staining or painting", "Material supply if not provided"],
    "stopConditions": "Stop if posts are damaged or leaning, rails need replacement, structural issues exist, or extensive rot is present.",
    "sources": ["https://handymantorontodowntown.ca/2026/07/28/fence-repair-costs-what-you-should-expect-to-pay-in-2026/", "https://homeguide.com/costs/fence-repair-cost"],
    "addOns": []
  },
  {
    "id": "fence-post-repair-replacement",
    "category": "Exterior maintenance",
    "name": "Fence post repair or replacement (single post)",
    "pricingUnit": "per post, includes concrete footing",
    "unitLabel": "post",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 0,
    "pricing": { "informal_floor": { "low": 200, "target": 300, "high": 450 }, "solo_freelancer": { "low": 325, "target": 475, "high": 675 }, "insured_company": { "low": 500, "target": 725, "high": 1000 } },
    "materialAllowance": 55,
    "tradeStatus": "caution",
    "confidence": "medium",
    "sourceConfidence": "2026 Toronto sources place single post replacement at $250-$600 including concrete.",
    "included": ["Remove damaged post", "Dig out old concrete footing", "Set new post at proper depth", "Pour concrete and brace", "Reconnect fence sections"],
    "notIncluded": ["Multiple posts", "Underground obstacle removal", "Extensive panel repair", "Property line verification", "Material supply if not provided"],
    "stopConditions": "Stop if underground utilities are present, property line is disputed, extensive structural work is needed, or site access is poor.",
    "sources": ["https://handymantorontodowntown.ca/2026/07/28/fence-repair-costs-what-you-should-expect-to-pay-in-2026/", "https://homeguide.com/costs/fence-repair-cost"],
    "addOns": []
  },
  {
    "id": "deck-railing-tightening-repair",
    "category": "Exterior maintenance",
    "name": "Deck railing tightening and minor repair",
    "pricingUnit": "per standard deck section, minor adjustments only",
    "unitLabel": "section",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 0,
    "pricing": { "informal_floor": { "low": 110, "target": 170, "high": 275 }, "solo_freelancer": { "low": 175, "target": 275, "high": 425 }, "insured_company": { "low": 300, "target": 450, "high": 650 } },
    "materialAllowance": 20,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "2026 GTA sources place minor railing repair at $150-$400.",
    "included": ["Tighten loose posts and rails", "Reset wobbly balusters", "Replace a few missing screws or fasteners", "Basic leveling"],
    "notIncluded": ["Full railing replacement", "Rotted post replacement", "Code upgrade to current standards", "Structural work"],
    "stopConditions": "Stop if posts are rotten, structural integrity is compromised, code compliance upgrades are required, or extensive replacement is needed.",
    "sources": ["https://renohouse.ca/services/exterior/deck-repair"],
    "addOns": []
  },
  {
    "id": "pressure-washing-driveway",
    "category": "Exterior maintenance",
    "name": "Pressure washing driveway or walkway",
    "pricingUnit": "per standard residential driveway or walkway",
    "unitLabel": "area",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 0,
    "pricing": { "informal_floor": { "low": 120, "target": 185, "high": 300 }, "solo_freelancer": { "low": 200, "target": 300, "high": 450 }, "insured_company": { "low": 325, "target": 500, "high": 725 } },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "2026 GTA sources place driveway pressure washing at $200-$500 for standard residential.",
    "included": ["Pressure wash surface", "Basic debris removal", "Rinse and cleanup"],
    "notIncluded": ["Sealing", "Stain removal", "Structural repair", "Extensive oil stain treatment"],
    "stopConditions": "Stop if surface is severely damaged, water access is unavailable, or environmental restrictions apply.",
    "sources": ["https://urbantasker.com/blog/how-much-does-handyman-cost-in-greater-toronto-area-gta-ontario-canada"],
    "addOns": []
  },
  {
    "id": "pressure-washing-deck",
    "category": "Exterior maintenance",
    "name": "Pressure washing deck or patio",
    "pricingUnit": "per standard deck or patio surface",
    "unitLabel": "area",
    "includedQuantity": 1,
    "defaultQuantity": 1,
    "additionalUnitPrice": 0,
    "pricing": { "informal_floor": { "low": 100, "target": 160, "high": 275 }, "solo_freelancer": { "low": 175, "target": 275, "high": 425 }, "insured_company": { "low": 300, "target": 450, "high": 650 } },
    "materialAllowance": 0,
    "tradeStatus": "handyman_ok",
    "confidence": "medium",
    "sourceConfidence": "2026 GTA sources place deck pressure washing at $150-$400.",
    "included": ["Pressure wash deck surface", "Clean between boards", "Basic debris removal"],
    "notIncluded": ["Staining or sealing", "Railing cleaning", "Structural repair", "Brightening treatment"],
    "stopConditions": "Stop if wood is too soft or damaged, water access is unavailable, or client wants brightening/restoration (specialist service).",
    "sources": ["https://urbantasker.com/blog/how-much-does-handyman-cost-in-greater-toronto-area-gta-ontario-canada"],
    "addOns": [
      { "id": "deck-brightener", "label": "Apply deck brightening treatment after wash", "price": 85 }
    ]
  }
];

export const categories = Array.from(new Set(serviceJobs.map((job) => job.category)));
