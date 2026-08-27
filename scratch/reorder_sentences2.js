const fs = require('fs');

const dataFile = 'data/articulationData.ts';
let content = fs.readFileSync(dataFile, 'utf8');

const targetOrders = {
    "d": [
        "The dog is barking",
        "The duck is swimming",
        "Please close the door",
        "The baby hugged the doll",
        "He played the drum loudly",
        "Dad climbed the ladder",
        "A spider is on the wall",
        "I made my bed this morning",
        "The apple is red",
        "We walked along the road"
    ],
    "h": [
        "The boy is wearing a blue hat",
        "We live in a small house near the park",
        "The horse ran across the field",
        "Wash your hands before eating",
        "Dad used a hammer to fix the chair",
        "The doctor works at the hospital",
        "She brushed her long hair before school",
        "My grandmother gave me a spoon of honey",
        "The helicopter flew over the city",
        "Please behave nicely when guests visit"
    ],
    "l": [
        "The lion is sleeping under the tree",
        "A green leaf fell from the tree",
        "She squeezed a lemon into the juice",
        "Please switch on the lamp",
        "The boy is climbing the ladder",
        "We ate lunch together at school",
        "Grandma made sweet lassi for everyone",
        "We borrowed a book from the library",
        "Lock the door before you leave",
        "The lizard is sitting on the wall"
    ],
    "r": [
        "Riya eats rice with dal every afternoon",
        "The rabbit is hiding under the bush",
        "My father drives a rickshaw to work",
        "The parrot is sitting on the mango tree",
        "Mother made carrot salad for lunch",
        "I keep my eraser inside my pencil box",
        "Our car is parked outside the house",
        "The doctor checked my throat carefully",
        "The farmer is working in the field",
        "We saw a bright star in the night sky"
    ],
    "n": [
        "The nurse checked my temperature",
        "The bird built a nest in the tree",
        "I peeled a banana for my snack",
        "The candle is on the table",
        "My father has a lot of money in his wallet",
        "The sun is shining brightly today",
        "The train arrived at the station on time",
        "The lion slept under the tree",
        "We saw a green parrot in the garden",
        "The balloon floated up into the sky"
    ],
    "th": [
        "Thank you for helping me with my homework",
        "My brother and I went to the theatre on Sunday",
        "Father checked the thermometer before giving me medicine",
        "I brush my teeth every morning and night",
        "We celebrated my birthday with family and friends",
        "Please wash your hands in the bathroom before dinner",
        "The children played on the ground near the earth mound after the rain",
        "My mother packed healthy food for school",
        "We travelled to North India during our summer holidays",
        "I carried both my school bag and my lunch box"
    ],
    "v": [
        "The van stopped outside the school",
        "We bought fresh vegetables from the market",
        "Our village celebrates every festival together",
        "The river flows behind the temple",
        "My father is a careful driver",
        "We watched a movie after dinner",
        "The doctor checked my fever",
        "The wave reached our feet at the beach",
        "I wear gloves while riding my scooter",
        "I live with my family in India"
    ],
    "y": [
        "Yes, I finished my homework before dinner",
        "The yellow bus arrived at the school gate",
        "We eat yogurt with our lunch every day",
        "The onion is used to make vegetable curry",
        "My brother uses the computer after school",
        "The Indian flag was flying proudly",
        "The little boy flew his new toy in the park",
        "I keep my house key in my school bag",
        "The monkey climbed the tree to eat a mango",
        "We celebrated my sister's birthday with cake and balloons"
    ],
    "z": [
        "We saw a zebra at the zoo",
        "Please zip your school bag",
        "My cousin loves listening to music",
        "It is easy to solve this puzzle",
        "We visit our grandparents every Sunday",
        "The frozen peas are in the freezer",
        "This quiz is about Indian festivals",
        "The bees are flying around the flowers",
        "The boys are playing cricket in the park",
        "I packed bananas, eggs, and mangoes for our picnic"
    ]
};

function normalizeSentence(s) {
    return s.replace(/[.,!?]$/, '').trim().toLowerCase();
}

let modifiedContent = content;

for (const [soundKey, targetOrder] of Object.entries(targetOrders)) {
    console.log(`Processing sound: ${soundKey}`);
    
    // Find the starting index of the sound block
    const soundStartRegex = new RegExp(`"${soundKey}"\\s*:\\s*\\{`, 'i');
    const soundStartMatch = modifiedContent.match(soundStartRegex);
    if (!soundStartMatch) {
        console.error(`Could not find start for sound ${soundKey}`);
        continue;
    }
    
    const startIndex = soundStartMatch.index;
    // Find the next sound block start or the end of the file to limit our search
    let nextIndex = modifiedContent.length;
    for (const key of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'th', 'ch', 'sh', 'zh']) {
        if (key === soundKey) continue;
        const nextSoundRegex = new RegExp(`\\n\\s*"${key}"\\s*:\\s*\\{`, 'i');
        const match = modifiedContent.substring(startIndex + 1).match(nextSoundRegex);
        if (match && startIndex + 1 + match.index < nextIndex) {
            nextIndex = startIndex + 1 + match.index;
        }
    }
    
    let block = modifiedContent.substring(startIndex, nextIndex);
    
    const sentenceArrStartRegex = /"sentence"\s*:\s*\[/;
    const sentenceArrStartMatch = block.match(sentenceArrStartRegex);
    
    if (!sentenceArrStartMatch) {
        console.error(`Could not find sentence array for sound ${soundKey}`);
        continue;
    }
    
    const arrStartIdx = sentenceArrStartMatch.index + sentenceArrStartMatch[0].length;
    let bracketCount = 1;
    let arrEndIdx = arrStartIdx;
    
    while (bracketCount > 0 && arrEndIdx < block.length) {
        if (block[arrEndIdx] === '[') bracketCount++;
        else if (block[arrEndIdx] === ']') bracketCount--;
        arrEndIdx++;
    }
    
    if (bracketCount !== 0) {
        console.error(`Could not find end of sentence array for sound ${soundKey}`);
        continue;
    }
    
    const arrayContent = block.substring(arrStartIdx, arrEndIdx - 1);
    
    // Now extract individual objects from arrayContent
    const objects = [];
    let objBracketCount = 0;
    let objStartIdx = -1;
    let inString = false;
    let escape = false;
    
    for (let i = 0; i < arrayContent.length; i++) {
        const char = arrayContent[i];
        
        if (char === '"' && !escape) {
            inString = !inString;
        }
        if (char === '\\' && !escape) {
            escape = true;
        } else {
            escape = false;
        }
        
        if (!inString) {
            if (char === '{') {
                if (objBracketCount === 0) objStartIdx = i;
                objBracketCount++;
            } else if (char === '}') {
                objBracketCount--;
                if (objBracketCount === 0) {
                    objects.push(arrayContent.substring(objStartIdx, i + 1));
                }
            }
        }
    }
    
    // Parse each object to find its sentence
    const parsedObjects = objects.map(objStr => {
        const sentenceMatch = objStr.match(/"sentence"\s*:\s*"([^"]+)"/);
        const sentence = sentenceMatch ? sentenceMatch[1] : '';
        return { str: objStr, sentence: sentence };
    });
    
    // Sort the parsed objects based on targetOrder
    parsedObjects.sort((a, b) => {
        const normA = normalizeSentence(a.sentence);
        const normB = normalizeSentence(b.sentence);
        
        const indexA = targetOrder.findIndex(t => normalizeSentence(t) === normA);
        const indexB = targetOrder.findIndex(t => normalizeSentence(t) === normB);
        
        if (indexA === -1) console.warn(`Warning: Sentence not found in target order: "${a.sentence}" in sound ${soundKey}`);
        if (indexB === -1) console.warn(`Warning: Sentence not found in target order: "${b.sentence}" in sound ${soundKey}`);
        
        const iA = indexA !== -1 ? indexA : 999;
        const iB = indexB !== -1 ? indexB : 999;
        
        return iA - iB;
    });
    
    const newArrayContent = '\n' + parsedObjects.map(o => '      ' + o.str).join(',\n') + '\n    ';
    
    const newBlock = block.substring(0, arrStartIdx) + newArrayContent + block.substring(arrEndIdx - 1);
    modifiedContent = modifiedContent.substring(0, startIndex) + newBlock + modifiedContent.substring(nextIndex);
}

fs.writeFileSync(dataFile, modifiedContent, 'utf8');
console.log("Done updating articulationData.ts");
