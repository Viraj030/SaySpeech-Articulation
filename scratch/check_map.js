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
    
    const headerRegex = /([a-z]+|cv|cvcv|vc|multisyllabic)\s+(initial|medial|final)\s+sound/i;
    let headerMatch = fullText.match(headerRegex);
    if (headerMatch) {
      currentSound = headerMatch[1].toLowerCase();
      isSentenceSection = false;
      continue;
    }

    const sentenceRegex = /([a-z]+)?\s*sentences?/i;
    let sentenceMatch = fullText.match(sentenceRegex);
    if (sentenceMatch && slide.length <= 2) { 
        if (sentenceMatch[1]) {
            currentSound = sentenceMatch[1].toLowerCase();
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
fs.writeFileSync('C:\\Users\\DELL\\Desktop\\Projects\\SaySpeech-Articulation\\scratch\\sentences_map.json', JSON.stringify(combinedMap, null, 2));
console.log('done');
