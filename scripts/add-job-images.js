const fs = require('fs');
const path = require('path');

// Image mappings from Unsplash (free to use)
const jobImages = {
  "toilet-seat-replacement": "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&auto=format&fit=crop",
  "toilet-fill-valve-replacement": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop",
  "toilet-flush-valve-replacement": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop",
  "faucet-replacement-visible-shutoffs": "https://images.unsplash.com/photo-1585313647787-3a1b5ef55b66?w=800&auto=format&fit=crop",
  "vanity-sink-replacement": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop",
  "door-knob-lever-replacement-existing-bore-latch-prep": "https://images.unsplash.com/photo-1631885038374-f30c01a2b3e1?w=800&auto=format&fit=crop",
  "deadbolt-replacement-in-existing-bore": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
  "new-deadbolt-drilling-and-install": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
  "hinge-replacement": "https://images.unsplash.com/photo-1504197885-c73788ef2150?w=800&auto=format&fit=crop",
  "interior-room-painting-standard": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop",
  "accent-wall-painting": "https://images.unsplash.com/photo-1562259929-1dd9e4e7e65d?w=800&auto=format&fit=crop",
  "tv-wall-mount-drywall-studs": "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop",
  "shelves-small-wall-shelving": "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop",
  "mirrors-pictures-artwork-hanging": "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&auto=format&fit=crop",
  "drywall-small-hole-patch-ready-for-paint": "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&auto=format&fit=crop",
  "vinyl-laminate-plank-replacement": "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop",
  "hardwood-spot-repair": "https://images.unsplash.com/photo-1534237886190-ced735ca4b73?w=800&auto=format&fit=crop",
  "curtain-rods-blinds-installation": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
  "window-screen-mesh-replacement": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop",
  "bifold-closet-door-adjustment-repair": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
  "closet-rod-shelf-installation": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
  "outlet-switch-gfci-dimmer-replacement": "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&auto=format&fit=crop",
  "light-fixture-fan-chandelier-swap": "https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?w=800&auto=format&fit=crop",
  "flat-pack-furniture-assembly-standard": "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?w=800&auto=format&fit=crop",
  "cabinet-pulls-knobs-install-or-swap": "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&auto=format&fit=crop",
  "grab-bar-installation-studs": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop",
  "grab-bar-installation-anchors": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop",
  "kitchen-backsplash-tile-repair": "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&auto=format&fit=crop",
  "backsplash-grout-recaulk": "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&auto=format&fit=crop",
  "bathtub-shower-recaulking": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop",
  "shower-head-replacement": "https://images.unsplash.com/photo-1625699340320-9ed0198d6b0f?w=800&auto=format&fit=crop",
  "deck-board-replacement-small": "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&auto=format&fit=crop",
  "fence-picket-board-replacement": "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&auto=format&fit=crop",
  "pressure-washing-driveway": "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&auto=format&fit=crop",
  "gutter-cleaning-single-storey": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
};

const catalogPath = path.join(__dirname, '..', 'src', 'lib', 'service-catalog.ts');
let content = fs.readFileSync(catalogPath, 'utf-8');

let addedCount = 0;

Object.entries(jobImages).forEach(([jobId, imageUrl]) => {
  // Find job entries that have addOns but no imageUrl
  const jobPattern = new RegExp(
    `("id":\\s*"${jobId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}",[\\s\\S]*?"addOns":\\s*\\[[^\\]]*\\])\\n(\\s*)(\\})`,
    'g'
  );
  
  const match = jobPattern.exec(content);
  if (match && !match[0].includes('"imageUrl"')) {
    const replacement = `${match[1]},\n${match[2]}"imageUrl": "${imageUrl}"\n${match[2]}${match[3]}`;
    content = content.replace(match[0], replacement);
    addedCount++;
    console.log(`✓ Added image to: ${jobId}`);
  }
});

fs.writeFileSync(catalogPath, content);
console.log(`\n✅ Total images added: ${addedCount}`);
