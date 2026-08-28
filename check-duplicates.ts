import { serviceJobs } from './src/lib/service-catalog';

const names = serviceJobs.map(j => j.name);
const grouped: Record<string, string[]> = {};

serviceJobs.forEach(j => {
  if (!grouped[j.name]) grouped[j.name] = [];
  grouped[j.name].push(j.id);
});

console.log('Checking for duplicate job names...\n');

let foundDuplicates = false;
Object.entries(grouped).forEach(([name, ids]) => {
  if (ids.length > 1) {
    foundDuplicates = true;
    console.log(`DUPLICATE: "${name}"`);
    ids.forEach(id => console.log(`  - ${id}`));
    console.log('');
  }
});

if (!foundDuplicates) {
  console.log('✓ No duplicate job names found');
}

console.log(`\nTotal jobs: ${serviceJobs.length}`);
