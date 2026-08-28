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
    id: "any-room",
    name: "Any Room",
    icon: "🏠",
    areas: [
      {
        id: "doors",
        name: "Doors & Hardware",
        jobIds: [
          "door-knob-lever-replacement-existing-bore-latch-prep",
          "deadbolt-installation-existing-door-prep",
          "door-hinge-replacement-repair-existing-mortise",
          "door-closer-installation-standard",
          "interior-door-replacement-prehung",
          "screen-door-installation-standard-frame",
        ],
      },
      {
        id: "windows",
        name: "Windows & Screens",
        jobIds: [
          "window-screen-replacement-remove-rescreen-reinstall",
          "window-screen-frame-replacement-standard-aluminum",
          "screen-door-mesh-replacement",
          "sliding-screen-door-roller-replacement",
          "window-caulking-exterior-single-window",
        ],
      },
      {
        id: "walls-mounting",
        name: "Walls & Mounting",
        jobIds: [
          "tv-wall-mount-installation-drywall-studs",
          "shelf-bracket-installation-drywall-studs",
          "curtain-rod-installation-standard-wall-mount",
          "picture-hanging-mirror-mounting",
        ],
      },
      {
        id: "lighting-electrical",
        name: "Lighting & Electrical (Referral)",
        jobIds: [
          "light-fixture-replacement-simple-swap-licensed",
          "ceiling-fan-installation-existing-box-licensed",
          "outlet-switch-replacement-licensed",
        ],
      },
    ],
  },
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
          "p-trap-replacement-visible",
          "minor-sink-unplugging-hand-snake",
          "garbage-disposal-replacement-existing-mount-licensed",
        ],
      },
      {
        id: "kitchen-cabinets",
        name: "Cabinets & Hardware",
        jobIds: [
          "cabinet-door-hinge-adjustment-repair",
          "cabinet-handle-knob-replacement",
        ],
      },
      {
        id: "kitchen-appliances",
        name: "Appliances (Referral)",
        jobIds: [
          "range-hood-filter-cleaning-replacement",
          "fridge-water-line-connection-licensed",
        ],
      },
    ],
  },
  {
    id: "bathroom",
    name: "Bathroom",
    icon: "🚽",
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
        ],
      },
      {
        id: "bathroom-sink",
        name: "Sink & Vanity",
        jobIds: [
          "vanity-sink-replacement",
          "faucet-replacement-visible-shutoffs",
          "pop-up-po-plug-replacement",
          "p-trap-replacement-visible",
        ],
      },
      {
        id: "shower-tub",
        name: "Shower & Tub",
        jobIds: [
          "shower-head-replacement",
          "shower-faucet-handle-replacement-trim-only",
          "bathtub-drain-stopper-replacement",
          "caulking-bathtub-shower-surround",
        ],
      },
    ],
  },
  {
    id: "bedroom-living",
    name: "Bedroom / Living Room",
    icon: "🛏️",
    areas: [
      {
        id: "doors-hardware",
        name: "Doors & Hardware",
        jobIds: [
          "door-knob-lever-replacement-existing-bore-latch-prep",
          "deadbolt-installation-existing-door-prep",
          "door-hinge-replacement-repair-existing-mortise",
          "door-closer-installation-standard",
          "interior-door-replacement-prehung",
        ],
      },
      {
        id: "closet",
        name: "Closet",
        jobIds: [
          "bifold-closet-door-adjustment-repair",
          "sliding-closet-door-roller-track-repair",
          "closet-rod-shelf-installation",
        ],
      },
      {
        id: "windows-blinds",
        name: "Windows & Blinds",
        jobIds: [
          "window-screen-replacement-remove-rescreen-reinstall",
          "curtain-rod-installation-standard-wall-mount",
          "blind-installation-standard-bracket-mount",
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
          "deadbolt-installation-existing-door-prep",
          "door-closer-installation-standard",
          "door-weather-stripping-replacement",
          "door-sweep-installation",
          "screen-door-installation-standard-frame",
        ],
      },
      {
        id: "exterior-maintenance",
        name: "Exterior Maintenance",
        jobIds: [
          "window-caulking-exterior-single-window",
          "gutter-cleaning-standard-single-story",
          "dryer-vent-cleaning-standard-ground-floor",
        ],
      },
    ],
  },
  {
    id: "maintenance",
    name: "General Maintenance",
    icon: "🔧",
    areas: [
      {
        id: "filters-hvac",
        name: "Filters & HVAC",
        jobIds: [
          "furnace-filter-replacement-standard-size",
          "furnace-humidifier-filter-replacement",
          "range-hood-filter-cleaning-replacement",
          "dryer-vent-cleaning-standard-ground-floor",
        ],
      },
      {
        id: "smoke-co",
        name: "Safety Devices",
        jobIds: [
          "smoke-alarm-battery-replacement",
          "smoke-co-alarm-replacement-battery-powered",
          "smoke-co-alarm-hardwired-replacement-licensed",
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
