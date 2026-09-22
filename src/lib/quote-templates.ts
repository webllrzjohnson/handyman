export type QuoteTemplateItem = {
  jobId: string;
  location: string;
  quantity?: number;
  selectedAddOnIds?: string[];
};

export type QuoteTemplate = {
  id: string;
  name: string;
  description: string;
  items: QuoteTemplateItem[];
};

export const quoteTemplates: QuoteTemplate[] = [
  {
    id: "kitchen-sink-refresh",
    name: "Kitchen sink refresh",
    description: "Faucet work with common under-sink add-ons.",
    items: [
      {
        jobId: "faucet-replacement-visible-shutoffs",
        location: "Kitchen - Sink & Plumbing",
        selectedAddOnIds: ["sink-p-trap", "sink-basket-strainer"],
      },
    ],
  },
  {
    id: "bathroom-quick-refresh",
    name: "Bathroom quick refresh",
    description: "Small bathroom fixes that are often quoted together.",
    items: [
      {
        jobId: "toilet-seat-replacement",
        location: "Bathroom - Toilet",
        selectedAddOnIds: ["toilet-fill-valve"],
      },
      {
        jobId: "bathtub-shower-recaulking",
        location: "Bathroom - Shower & Tub",
      },
      {
        jobId: "shower-head-replacement",
        location: "Bathroom - Shower & Tub",
      },
    ],
  },
  {
    id: "door-tune-up",
    name: "Door tune-up",
    description: "Hardware and latch fixes for a sticky or loose door.",
    items: [
      {
        jobId: "door-knob-lever-replacement-existing-bore-latch-prep",
        location: "Entry / Hallway - Entry Doors & Security",
        selectedAddOnIds: ["door-hinges", "door-strike-plate", "door-stop"],
      },
    ],
  },
  {
    id: "rental-turnover-basics",
    name: "Rental turnover basics",
    description: "Common move-out repairs before a tenant handoff.",
    items: [
      {
        jobId: "drywall-small-hole-patch-ready-for-paint",
        location: "Whole Home - General",
      },
      {
        jobId: "smoke-co-alarm-battery-replacement-only",
        location: "Whole Home - Smoke & CO Safety",
      },
      {
        jobId: "curtain-rods-blinds-installation",
        location: "Bedroom - Walls, Windows, Blinds & Flooring",
      },
    ],
  },
];
