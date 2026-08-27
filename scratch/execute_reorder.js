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

  for (const slide of slides) {
    const fullText = slide.join(' ').toLowerCase();
    
    // Patterns
    const headerMatch = fullText.match(/^([a-z]+|cv|cvcv|vc|multisyllabic)\s+(initial|medial|final|sentence)\s+sound$/i) ||
                        fullText.match(/^([a-z]+|cv|cvcv|vc|multisyllabic)\s+words?$/i) ||
                        fullText.match(/^(cv|cvcv|vc|multisyllabic)$/i);
                        
    if (headerMatch) {
      let sound = headerMatch[1].toLowerCase();
      if (sound === 'cv') sound = 'CV';
      if (sound === 'cvcv') sound = 'CVCV';
      if (sound === 'vc') sound = 'VC';
      if (sound === 'multisyllabic') sound = 'Multisyllabic';
      
      let pos = headerMatch[2] ? headerMatch[2].toLowerCase() : 'initial';
      
      currentSound = sound;
      currentPos = pos;
      
      if (!data[currentSound]) data[currentSound] = {};
      if (!data[currentSound][currentPos]) data[currentSound][currentPos] = [];
    } else {
      if (currentSound && currentPos && slide.length > 0) {
        if (fullText.includes("apply to all") || fullText.includes("images per category")) {
          continue;
        }
        
        const word = slide.join(' ').trim();
        if (word.length > 0 && word.length < 30) {
          data[currentSound][currentPos].push(word.toLowerCase());
        }
      }
    }
  }
  return data;
}

// 1. Build PPTX Order Map
const file1 = 'C:\\Users\\DELL\\Desktop\\Projects\\SaySpeech-Articulation\\public\\Matka articulation.pptx';
const file2 = 'C:\\Users\\DELL\\Desktop\\Projects\\SaySpeech-Articulation\\public\\Matka game part 2.pptx';
const map1 = parseSlidesToMap(extractPptxText(file1));
const map2 = parseSlidesToMap(extractPptxText(file2));

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

// 2. Read and Parse articulationData.ts
const tsFilePath = 'C:\\Users\\DELL\\Desktop\\Projects\\SaySpeech-Articulation\\data\\articulationData.ts';
let tsContent = fs.readFileSync(tsFilePath, 'utf8');

const startMarker = 'export const articulationData: ArticulationDataMap = {';
const startIndex = tsContent.indexOf(startMarker);
const beforeData = tsContent.substring(0, startIndex + startMarker.length - 1); // Up to the '{'

// Find the end of the articulationData object
let bracketCount = 0;
let endIndex = -1;
for (let i = startIndex + startMarker.length - 1; i < tsContent.length; i++) {
  if (tsContent[i] === '{') bracketCount++;
  if (tsContent[i] === '}') {
    bracketCount--;
    if (bracketCount === 0) {
      endIndex = i;
      break;
    }
  }
}

const jsonString = tsContent.substring(startIndex + startMarker.length - 1, endIndex + 1);
const afterData = tsContent.substring(endIndex + 1);

// We evaluate the JSON string safely. It's technically JS, but it conforms well to JSON.
let articulationData;
try {
  // It might have trailing commas or quotes that JSON.parse doesn't like, so let's use eval or new Function
  articulationData = new Function(`return ${jsonString}`)();
} catch (e) {
  console.error("Failed to parse the articulationData object:", e);
  process.exit(1);
}

// 3. Reorder the arrays in articulationData
for (const sound in articulationData) {
  for (const pos in articulationData[sound]) {
    const items = articulationData[sound][pos];
    if (items.length > 0 && combinedMap[sound] && combinedMap[sound][pos]) {
      const orderList = combinedMap[sound][pos];
      
      // Sort `items` based on the index in `orderList`
      items.sort((a, b) => {
        const wordA = a.word.toLowerCase();
        const wordB = b.word.toLowerCase();
        
        let indexA = orderList.indexOf(wordA);
        let indexB = orderList.indexOf(wordB);
        
        // If not found exactly, try partial match since PPTX might have typos
        if (indexA === -1) indexA = orderList.findIndex(w => w.includes(wordA) || wordA.includes(w));
        if (indexB === -1) indexB = orderList.findIndex(w => w.includes(wordB) || wordB.includes(w));
        
        // Put unmapped items at the end
        if (indexA === -1) indexA = 999;
        if (indexB === -1) indexB = 999;
        
        return indexA - indexB;
      });
    }
  }
}

// 4. Update availableSounds array
const targetSoundsOrder = ["p","b","m","ch","d","f","g","h","j","k","l","n","r","s","sh","t","th","v","y","z","CV","VC","CVCV","Multisyllabic"];

let updatedAfterData = afterData;
const soundsArrayRegex = /export const availableSounds\s*=\s*\[(.*?)\];/s;
updatedAfterData = updatedAfterData.replace(soundsArrayRegex, `export const availableSounds = ${JSON.stringify(targetSoundsOrder)};`);

// 5. Serialize and write back
const newDataString = JSON.stringify(articulationData, null, 2);
const newFileContent = beforeData + newDataString + updatedAfterData;

fs.writeFileSync(tsFilePath, newFileContent, 'utf8');
console.log('Successfully updated articulationData.ts');
