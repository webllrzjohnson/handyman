// New room-based category structure
export type RoomCategory = {
  id: string;
  name: string;
  icon: string;
  areas: Area[];
};

export type Area = {
  id: string;
  name: string;
  jobIds: string[];
};

export const roomCategories: RoomCategory[] = [
  {
    id: "kitchen",
    name: "Kitchen",
    icon: "🍳",
    areas: [
      {
        id: "kitchen-sink-plumbing",
        name: "Sink & Plumbing",
        jobIds: [
          "faucet-replacement-visible-shutoffs",
          "faucet-aerator-replacement-cleaning",
          "basket-strainer-replacement",
          "pop-up-po-plug-replacement",
          "p-trap-replacement-visible",
          "minor-sink-unplugging-hand-snake",
        ],
      },
      {
        id: "kitchen-cabinets",
        name: "Cabinets & Hardware",
        jobIds: [
          "cabinet-pulls-knobs-install-or-swap",
          "cabinet-hinge-replacement-adjustment-including-soft-clos",
        ],
      },
      {
        id: "kitchen-walls-mounting",
        name: "Walls & Mounting",
        jobIds: [
          "shelves-small-wall-shelving",
          "coat-hooks-towel-bars-small-holders",
          "drywall-small-hole-patch-ready-for-paint",
          "baseboard-trim-minor-repair",
          "interior-room-painting-standard",
          "accent-wall-painting",
        ],
      },
      {
        id: "kitchen-backsplash",
        name: "Backsplash & Tile",
        jobIds: [
          "kitchen-backsplash-tile-repair",
          "backsplash-grout-recaulk",
        ],
      },
      {
        id: "kitchen-flooring",
        name: "Flooring",
        jobIds: [
          "vinyl-laminate-plank-replacement",
          "hardwood-spot-repair",
        ],
      },
      {
        id: "kitchen-appliances",
        name: "Appliances & Filters",
        jobIds: [
          "range-hood-grease-charcoal-filter-clean-or-replacement",
          "gas-fuel-appliance-work",
        ],
      },
    ],
  },
  {
    id: "bathroom",
    name: "Bathroom",
    icon: "🚿",
    areas: [
      {
        id: "toilet",
        name: "Toilet",
        jobIds: [
          "toilet-seat-replacement",
          "toilet-fill-valve-replacement",
          "toilet-flush-valve-replacement",
          "toilet-handle-chain-flapper-repair",
          "toilet-tank-replacement",
          "toilet-bowl-replacement-reset",
          "toilet-floor-flange-repair-replacement",
        ],
      },
      {
        id: "bathroom-sink",
        name: "Sink & Vanity",
        jobIds: [
          "vanity-sink-replacement",
          "faucet-replacement-visible-shutoffs",
          "faucet-aerator-replacement-cleaning",
          "pop-up-po-plug-replacement",
          "p-trap-replacement-visible",
          "minor-sink-unplugging-hand-snake",
          "backsplash-grout-recaulk",
        ],
      },
      {
        id: "shower-tub",
        name: "Shower & Tub",
        jobIds: [
          "bathtub-shower-recaulking",
          "shower-head-replacement",
        ],
      },
      {
        id: "bathroom-accessories",
        name: "Accessories & Walls",
        jobIds: [
          "coat-hooks-towel-bars-small-holders",
          "mirrors-pictures-artwork-hanging",
          "shelves-small-wall-shelving",
          "drywall-small-hole-patch-ready-for-paint",
          "grab-bar-installation-studs",
          "grab-bar-installation-anchors",
          "interior-room-painting-standard",
        ],
      },
      {
        id: "bathroom-flooring",
        name: "Flooring",
        jobIds: [
          "vinyl-laminate-plank-replacement",
        ],
      },
    ],
  },
  {
    id: "bedroom",
    name: "Bedroom",
    icon: "🛏️",
    areas: [
      {
        id: "bedroom-doors",
        name: "Doors & Hardware",
        jobIds: [
          "door-knob-lever-replacement-existing-bore-latch-prep",
          "hinge-replacement",
          "hinge-screw-repair-long-screws-plug-stripped-holes",
          "strike-latch-adjustment-for-door-that-will-not-latch",
          "door-stopper-install-or-replacement",
          "interior-door-slab-install-existing-frame",
        ],
      },
      {
        id: "bedroom-closet",
        name: "Closet",
        jobIds: [
          "bifold-closet-door-adjustment-repair",
          "sliding-closet-door-roller-track-repair",
          "closet-rod-shelf-installation",
        ],
      },
      {
        id: "bedroom-walls-windows-flooring",
        name: "Walls, Windows, Blinds & Flooring",
        jobIds: [
          "curtain-rods-blinds-installation",
          "mirrors-pictures-artwork-hanging",
          "shelves-small-wall-shelving",
          "drywall-small-hole-patch-ready-for-paint",
          "baseboard-trim-minor-repair",
          "window-crank-operator-replacement",
          "window-lock-latch-replacement",
          "interior-room-painting-standard",
          "accent-wall-painting",
          "vinyl-laminate-plank-replacement",
          "hardwood-spot-repair",
        ],
      },
      {
        id: "bedroom-furniture",
        name: "Furniture Assembly",
        jobIds: [
          "flat-pack-furniture-assembly-standard",
        ],
      },
    ],
  },
  {
    id: "living-room",
    name: "Living Room",
    icon: "🛋️",
    areas: [
      {
        id: "living-room-mounting",
        name: "TV, Shelves & Artwork",
        jobIds: [
          "tv-wall-mount-drywall-studs",
          "shelves-small-wall-shelving",
          "mirrors-pictures-artwork-hanging",
          "curtain-rods-blinds-installation",
        ],
      },
      {
        id: "living-room-doors",
        name: "Doors & Hardware",
        jobIds: [
          "door-knob-lever-replacement-existing-bore-latch-prep",
          "hinge-replacement",
          "hinge-screw-repair-long-screws-plug-stripped-holes",
          "strike-latch-adjustment-for-door-that-will-not-latch",
          "door-stopper-install-or-replacement",
          "interior-door-slab-install-existing-frame",
        ],
      },
      {
        id: "living-room-walls-windows-flooring",
        name: "Walls, Windows & Flooring",
        jobIds: [
          "drywall-small-hole-patch-ready-for-paint",
          "baseboard-trim-minor-repair",
          "window-crank-operator-replacement",
          "window-lock-latch-replacement",
          "window-screen-mesh-replacement",
          "interior-room-painting-standard",
          "accent-wall-painting",
          "vinyl-laminate-plank-replacement",
          "hardwood-spot-repair",
        ],
      },
      {
        id: "living-room-furniture",
        name: "Furniture Assembly",
        jobIds: [
          "flat-pack-furniture-assembly-standard",
        ],
      },
    ],
  },
  {
    id: "entry-hallway",
    name: "Entry / Hallway",
    icon: "🚪",
    areas: [
      {
        id: "entry-doors",
        name: "Entry Doors & Security",
        jobIds: [
          "door-knob-lever-replacement-existing-bore-latch-prep",
          "deadbolt-replacement-in-existing-bore",
          "new-deadbolt-drilling-and-install",
          "smart-lock-install-setup-existing-compatible-bore",
          "strike-latch-adjustment-for-door-that-will-not-latch",
          "door-closer-adjustment-or-replacement",
          "door-sweep-and-weatherstrip-replacement",
          "peephole-door-viewer-install",
          "chain-lock-or-swing-bar-door-guard-install",
        ],
      },
      {
        id: "entry-storage-walls",
        name: "Storage & Walls",
        jobIds: [
          "coat-hooks-towel-bars-small-holders",
          "shelves-small-wall-shelving",
          "mirrors-pictures-artwork-hanging",
          "drywall-small-hole-patch-ready-for-paint",
          "baseboard-trim-minor-repair",
        ],
      },
      {
        id: "entry-safety",
        name: "Safety Devices",
        jobIds: [
          "smoke-co-alarm-battery-replacement-only",
          "battery-only-smoke-co-alarm-replacement-like-for-like-no",
          "hardwired-smoke-co-alarm-replacement",
        ],
      },
    ],
  },
  {
    id: "laundry-utility",
    name: "Laundry / Utility",
    icon: "🧺",
    areas: [
      {
        id: "laundry-vents-filters",
        name: "Vents & Filters",
        jobIds: [
          "dryer-vent-cleaning-accessible",
          "furnace-filter-replacement-accessible-return-filter-slot",
          "condo-fan-coil-filter-replacement",
          "ac-return-air-filter-replacement",
        ],
      },
      {
        id: "laundry-sink",
        name: "Laundry Sink",
        jobIds: [
          "faucet-replacement-visible-shutoffs",
          "faucet-aerator-replacement-cleaning",
          "p-trap-replacement-visible",
          "minor-sink-unplugging-hand-snake",
        ],
      },
      {
        id: "utility-safety",
        name: "Safety Devices",
        jobIds: [
          "smoke-co-alarm-battery-replacement-only",
          "battery-only-smoke-co-alarm-replacement-like-for-like-no",
          "thermostat-battery-replacement-only",
          "hardwired-smoke-co-alarm-replacement",
          "building-fire-alarm-system-device",
        ],
      },
    ],
  },
  {
    id: "exterior",
    name: "Exterior",
    icon: "🏡",
    areas: [
      {
        id: "exterior-doors",
        name: "Exterior Doors",
        jobIds: [
          "door-knob-lever-replacement-existing-bore-latch-prep",
          "deadbolt-replacement-in-existing-bore",
          "new-deadbolt-drilling-and-install",
          "smart-lock-install-setup-existing-compatible-bore",
          "door-closer-adjustment-or-replacement",
          "door-sweep-and-weatherstrip-replacement",
          "peephole-door-viewer-install",
          "chain-lock-or-swing-bar-door-guard-install",
          "screen-storm-door-closer",
          "screen-door-handle-latch",
        ],
      },
      {
        id: "exterior-deck-fence",
        name: "Deck, Fence & Patio",
        jobIds: [
          "deck-board-replacement-small",
          "fence-picket-board-replacement",
          "fence-post-repair-replacement",
          "deck-railing-tightening-repair",
        ],
      },
      {
        id: "exterior-cleaning",
        name: "Pressure Washing & Cleaning",
        jobIds: [
          "pressure-washing-driveway",
          "pressure-washing-deck",
          "gutter-cleaning-single-storey",
        ],
      },
      {
        id: "exterior-screens-windows",
        name: "Screens & Window Hardware",
        jobIds: [
          "window-screen-mesh-replacement",
          "screen-door-mesh-repair-replacement",
          "screen-spline-replacement-re-tension",
          "screen-frame-corner-repair",
          "patio-screen-door-roller-wheel-replacement",
          "screen-door-handle-latch",
          "window-crank-operator-replacement",
          "window-lock-latch-replacement",
        ],
      },
      {
        id: "exterior-seasonal",
        name: "Seasonal Maintenance",
        jobIds: [
          "dryer-vent-cleaning-accessible",
        ],
      },
    ],
  },
  {
    id: "whole-home",
    name: "Whole Home",
    icon: "🏠",
    areas: [
      {
        id: "whole-home-filters",
        name: "Filters & Routine Maintenance",
        jobIds: [
          "furnace-filter-replacement-accessible-return-filter-slot",
          "condo-fan-coil-filter-replacement",
          "ac-return-air-filter-replacement",
          "range-hood-grease-charcoal-filter-clean-or-replacement",
          "thermostat-battery-replacement-only",
        ],
      },
      {
        id: "whole-home-safety",
        name: "Smoke & CO Safety",
        jobIds: [
          "smoke-co-alarm-battery-replacement-only",
          "battery-only-smoke-co-alarm-replacement-like-for-like-no",
          "hardwired-smoke-co-alarm-replacement",
          "building-fire-alarm-system-device",
        ],
      },
      {
        id: "whole-home-referrals",
        name: "Licensed Trade Referrals",
        jobIds: [
          "outlet-switch-gfci-dimmer-replacement",
          "hardwired-smoke-co-alarm-replacement",
          "gas-fuel-appliance-work",
          "building-fire-alarm-system-device",
        ],
      },
    ],
  },
];

// Helper function to get all job IDs from room categories
export function getAllRoomJobIds(): string[] {
  const ids = new Set<string>();
  roomCategories.forEach((room) => {
    room.areas.forEach((area) => {
      area.jobIds.forEach((id) => ids.add(id));
    });
  });
  return Array.from(ids);
}

export function getRoomJobIds(roomId: string, areaId: string | null = null): string[] {
  if (roomId === "all") return getAllRoomJobIds();

  const room = roomCategories.find((item) => item.id === roomId);
  if (!room) return [];
  if (!areaId) return Array.from(new Set(room.areas.flatMap((area) => area.jobIds)));

  return room.areas.find((area) => area.id === areaId)?.jobIds ?? [];
}

// Helper to find room and area for a job
export function findJobLocation(jobId: string): { room: RoomCategory; area: Area } | null {
  for (const room of roomCategories) {
    for (const area of room.areas) {
      if (area.jobIds.includes(jobId)) {
        return { room, area };
      }
    }
  }
  return null;
}
