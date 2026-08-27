const fs = require('fs');
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

function parseSlidesForSentences(slides) {
  const sentenceMap = {};
  let currentSound = null;
  let isSentenceSection = false;

  for (const slide of slides) {
    let fullText = slide.join(' ').toLowerCase();
    
    // Check if the slide is a header for initial/medial/final to update currentSound
    const headerRegex = /([a-z]+|cv|cvcv|vc|multisyllabic)\s+(initial|medial|final)\s+sound/i;
    let headerMatch = fullText.match(headerRegex);
    if (headerMatch) {
      currentSound = headerMatch[1].toLowerCase();
      if (currentSound === 'cv') currentSound = 'CV';
      if (currentSound === 'cvcv') currentSound = 'CVCV';
      if (currentSound === 'vc') currentSound = 'VC';
      if (currentSound === 'multisyllabic') currentSound = 'Multisyllabic';
      isSentenceSection = false;
      continue;
    }

    // Check if the slide is a sentence header (e.g. "p sentences" or "sentences")
    const sentenceRegex = /([a-z]+)?\s*sentences?/i;
    let sentenceMatch = fullText.match(sentenceRegex);
    if (sentenceMatch && slide.length <= 2) { 
        // a slide that is just a header for sentences
        if (sentenceMatch[1]) {
            currentSound = sentenceMatch[1].toLowerCase();
            if (currentSound === 'cv') currentSound = 'CV';
            if (currentSound === 'cvcv') currentSound = 'CVCV';
            if (currentSound === 'vc') currentSound = 'VC';
            if (currentSound === 'multisyllabic') currentSound = 'Multisyllabic';
        }
        isSentenceSection = true;
        
        if (!sentenceMap[currentSound]) sentenceMap[currentSound] = [];
        continue;
    }

    if (isSentenceSection && currentSound && slide.length > 0) {
      if (fullText.includes("apply to all") || fullText.includes("images per category")) {
        continue;
      }
      const sentence = slide.join(' ').trim();
      if (sentence.length > 0) {
        if (!sentenceMap[currentSound]) sentenceMap[currentSound] = [];
        sentenceMap[currentSound].push(sentence.toLowerCase());
      }
    }
  }
  return sentenceMap;
}

const file1 = 'C:\\Users\\DELL\\Desktop\\Projects\\SaySpeech-Articulation\\public\\Matka articulation.pptx';
const file2 = 'C:\\Users\\DELL\\Desktop\\Projects\\SaySpeech-Articulation\\public\\Matka game part 2.pptx';
const map1 = parseSlidesForSentences(extractPptxText(file1));
const map2 = parseSlidesForSentences(extractPptxText(file2));

const combinedMap = { ...map1 };
for (const sound in map2) {
  if (!combinedMap[sound]) {
    combinedMap[sound] = map2[sound];
  } else {
    combinedMap[sound] = combinedMap[sound].concat(map2[sound]);
  }
}

const tsFilePath = 'C:\\Users\\DELL\\Desktop\\Projects\\SaySpeech-Articulation\\data\\articulationData.ts';
let tsContent = fs.readFileSync(tsFilePath, 'utf8');

const startMarker = 'export const articulationData: ArticulationDataMap = {';
const startIndex = tsContent.indexOf(startMarker);
const beforeData = tsContent.substring(0, startIndex + startMarker.length - 1);

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

let articulationData;
try {
  articulationData = new Function(`return ${jsonString}`)();
} catch (e) {
  console.error("Failed to parse the articulationData object:", e);
  process.exit(1);
}

for (const sound in articulationData) {
  // Skip p and b as requested
  if (sound === 'p' || sound === 'b') continue;
  
  if (articulationData[sound]['sentence'] && combinedMap[sound]) {
    const items = articulationData[sound]['sentence'];
    const orderList = combinedMap[sound];
    
    if (items.length > 0) {
      items.sort((a, b) => {
        const sentA = a.sentence ? a.sentence.toLowerCase() : '';
        const sentB = b.sentence ? b.sentence.toLowerCase() : '';
        
        let indexA = orderList.findIndex(s => s.includes(sentA) || sentA.includes(s));
        let indexB = orderList.findIndex(s => s.includes(sentB) || sentB.includes(s));
        
        if (indexA === -1) indexA = 999;
        if (indexB === -1) indexB = 999;
        
        return indexA - indexB;
      });
    }
  }
}

const newDataString = JSON.stringify(articulationData, null, 2);
const newFileContent = beforeData + newDataString + afterData;

fs.writeFileSync(tsFilePath, newFileContent, 'utf8');
console.log('Successfully sorted sentences in articulationData.ts');
