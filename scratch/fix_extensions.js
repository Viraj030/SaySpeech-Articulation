const fs = require('fs');
const path = require('path');

const tsFilePath = 'C:\\Users\\DELL\\Desktop\\Projects\\SaySpeech-Articulation\\data\\articulationData.ts';
const publicDir = 'C:\\Users\\DELL\\Desktop\\Projects\\SaySpeech-Articulation\\public';

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

let fixedCount = 0;
const extensions = ['.png', '.jpg', '.jpeg', '.webp'];

for (const sound in articulationData) {
  for (const pos in articulationData[sound]) {
    const items = articulationData[sound][pos];
    for (const item of items) {
      if (item.image) {
        // e.g. /images/PPT Images/P-Sound/p-initial-sound/Pig.jpg
        let imagePath = decodeURIComponent(item.image);
        let absolutePath = path.join(publicDir, imagePath);
        
        if (!fs.existsSync(absolutePath)) {
          // File doesn't exist, let's try other extensions
          const ext = path.extname(absolutePath);
          const baseNoExt = absolutePath.substring(0, absolutePath.length - ext.length);
          
          let found = false;
          for (const newExt of extensions) {
            if (fs.existsSync(baseNoExt + newExt)) {
              // Found the correct extension
              const newImagePath = imagePath.substring(0, imagePath.length - ext.length) + newExt;
              // Do NOT encodeURI, keep the string exactly with spaces as it was
              item.image = newImagePath;
              found = true;
              fixedCount++;
              console.log(`Fixed: ${imagePath} -> ${newImagePath}`);
              break;
            }
          }
          if (!found) {
            // silent ignore
          }
        }
      }
    }
  }
}

if (fixedCount > 0) {
  const newDataString = JSON.stringify(articulationData, null, 2);
  const newFileContent = beforeData + newDataString + afterData;
  fs.writeFileSync(tsFilePath, newFileContent, 'utf8');
  console.log(`Fixed ${fixedCount} image extensions in articulationData.ts`);
} else {
  console.log(`No missing files found, or no fixes applied.`);
}
