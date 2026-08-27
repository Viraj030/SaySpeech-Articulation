const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

function extractPptxText(filename) {
  const zip = new AdmZip(filename);
  const zipEntries = zip.getEntries();
  
  const slideEntries = zipEntries.filter(entry => entry.entryName.match(/^ppt\/slides\/slide\d+\.xml$/));
  
  slideEntries.sort((a, b) => {
    const numA = parseInt(a.entryName.match(/\d+/)[0]);
    const numB = parseInt(b.entryName.match(/\d+/)[0]);
    return numA - numB;
  });

  const allSlides = [];
  slideEntries.forEach(entry => {
    const xmlContent = entry.getData().toString('utf8');
    const textMatches = xmlContent.match(/<a:t[^>]*>([^<]*)<\/a:t>/g);
    const slideText = [];
    if (textMatches) {
      textMatches.forEach(match => {
        const text = match.replace(/<a:t[^>]*>/, '').replace(/<\/a:t>/, '').trim();
        if (text) {
          slideText.push(text);
        }
      });
    }
    allSlides.push(slideText);
  });
  return allSlides;
}

function parseSlidesToMap(slides) {
  const data = {};
  let currentSound = null;
  let currentPos = null;

  const validPositions = ['initial', 'medial', 'final', 'sentence'];
  
  for (const slide of slides) {
    const fullText = slide.join(' ').toLowerCase();
    
    // Check if it's a section header slide
    let foundHeader = false;
    
    // Patterns like "p initial sound", "CV words", etc.
    const headerMatch = fullText.match(/^([a-z]+|cv|cvcv|vc|multisyllabic)\s+(initial|medial|final|sentence)\s+sound$/i) ||
                        fullText.match(/^([a-z]+|cv|cvcv|vc|multisyllabic)\s+words$/i);
                        
    if (headerMatch) {
      let sound = headerMatch[1].toLowerCase();
      // map multisyllabic to Multisyllabic, cv to CV, etc.
      if (sound === 'cv') sound = 'CV';
      if (sound === 'cvcv') sound = 'CVCV';
      if (sound === 'vc') sound = 'VC';
      if (sound === 'multisyllabic') sound = 'Multisyllabic';
      
      let pos = headerMatch[2] ? headerMatch[2].toLowerCase() : 'initial'; // Default to initial for CV etc
      
      currentSound = sound;
      currentPos = pos;
      
      if (!data[currentSound]) data[currentSound] = {};
      if (!data[currentSound][currentPos]) data[currentSound][currentPos] = [];
      
      foundHeader = true;
    } else {
      // It might be a word slide
      if (currentSound && currentPos && slide.length > 0) {
        // usually the word is the first or second text item, let's just take the first meaningful one
        // Skip slides that are clearly not words (like "Apply to all", "10 images per category")
        if (fullText.includes("apply to all") || fullText.includes("images per category")) {
          continue;
        }
        
        // Grab the largest text item on the slide, or just combine them
        const word = slide.join(' ').trim();
        if (word.length > 0 && word.length < 30) { // arbitrary length to avoid paragraphs
          data[currentSound][currentPos].push(word);
        }
      }
    }
  }
  return data;
}

const file1 = 'C:\\Users\\DELL\\Desktop\\Projects\\SaySpeech-Articulation\\public\\Matka articulation.pptx';
const file2 = 'C:\\Users\\DELL\\Desktop\\Projects\\SaySpeech-Articulation\\public\\Matka game part 2.pptx';

const slides1 = extractPptxText(file1);
const slides2 = extractPptxText(file2);

const map1 = parseSlidesToMap(slides1);
const map2 = parseSlidesToMap(slides2);

// Merge maps
const combinedMap = { ...map1 };
for (const sound in map2) {
  if (!combinedMap[sound]) {
    combinedMap[sound] = map2[sound];
  } else {
    for (const pos in map2[sound]) {
      if (!combinedMap[sound][pos]) {
        combinedMap[sound][pos] = map2[sound][pos];
      } else {
        combinedMap[sound][pos] = combinedMap[sound][pos].concat(map2[sound][pos]);
      }
    }
  }
}

fs.writeFileSync('C:\\Users\\DELL\\Desktop\\Projects\\SaySpeech-Articulation\\scratch\\parsed_pptx.json', JSON.stringify(combinedMap, null, 2));
console.log('Done mapping.');
