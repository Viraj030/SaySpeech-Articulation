const fs = require('fs');

// We can require it directly if it's JS, but since it's TS, we can read it and evaluate it, or strip the TS-specific types and import/require it.
// Let's write a simple parser to extract the articulationData object.
const content = fs.readFileSync('data/articulationData.ts', 'utf8');

// Strip imports and type annotations
let jsContent = content
  .replace(/import\s+.*?;/g, '')
  .replace(/: \w+/g, '')
  .replace(/export const/g, 'const');

// Add module.exports at the end
jsContent += '\nmodule.exports = { articulationData, availableSounds };';

// Write to a temp JS file and require it
fs.writeFileSync('scratch/tempData.js', jsContent);

const { articulationData } = require('./tempData');

for (const [sound, positions] of Object.entries(articulationData)) {
  console.log(`Sound: ${sound}`);
  for (const [pos, items] of Object.entries(positions)) {
    if (pos === 'sentence') continue;
    const words = items.map(item => item.word);
    console.log(`  ${pos}: ${words.join(', ')}`);
  }
}
