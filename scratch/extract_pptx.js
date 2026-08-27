const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure adm-zip is available
try {
  require.resolve('adm-zip');
} catch (e) {
  console.log('Installing adm-zip...');
  execSync('npm install adm-zip --no-save', { stdio: 'inherit' });
}

const AdmZip = require('adm-zip');

function extractPptxText(filename) {
  console.log(`\n=== ${path.basename(filename)} ===`);
  const zip = new AdmZip(filename);
  const zipEntries = zip.getEntries();
  
  // Find slide XML files
  const slideEntries = zipEntries.filter(entry => entry.entryName.match(/^ppt\/slides\/slide\d+\.xml$/));
  
  // Sort slides by number
  slideEntries.sort((a, b) => {
    const numA = parseInt(a.entryName.match(/\d+/)[0]);
    const numB = parseInt(b.entryName.match(/\d+/)[0]);
    return numA - numB;
  });

  slideEntries.forEach((entry, index) => {
    const xmlContent = entry.getData().toString('utf8');
    // Extract text from <a:t> tags
    const textMatches = xmlContent.match(/<a:t[^>]*>([^<]*)<\/a:t>/g);
    if (textMatches) {
      console.log(`\nSlide ${index + 1}:`);
      textMatches.forEach(match => {
        const text = match.replace(/<a:t[^>]*>/, '').replace(/<\/a:t>/, '').trim();
        if (text) {
          console.log(`  - ${text}`);
        }
      });
    }
  });
}

const file1 = 'C:\\Users\\DELL\\Desktop\\Projects\\SaySpeech-Articulation\\public\\Matka articulation.pptx';
const file2 = 'C:\\Users\\DELL\\Desktop\\Projects\\SaySpeech-Articulation\\public\\Matka game part 2.pptx';

try {
  extractPptxText(file1);
  extractPptxText(file2);
} catch (err) {
  console.error("Error reading pptx files:", err);
}
