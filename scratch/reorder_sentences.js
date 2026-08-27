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

for (const [soundKey, targetOrder] of Object.entries(targetOrders)) {
    console.log(`Processing sound: ${soundKey}`);
    
    // Find the block for the sound
    const soundRegex = new RegExp(`"${soundKey}"\\s*:\\s*\\{([\\s\\S]*?)\\},\\n\\s*"[a-z]+"\\s*:`, 'i');
    let soundMatch = content.match(soundRegex);
    
    if (!soundMatch) {
        // Might be the last one, try matching till end of file or something similar
        const lastSoundRegex = new RegExp(`"${soundKey}"\\s*:\\s*\\{([\\s\\S]*?)\\}\\n\\s*\\}`, 'i');
        soundMatch = content.match(lastSoundRegex);
    }
    
    if (!soundMatch) {
        console.error(`Could not find block for sound ${soundKey}`);
        continue;
    }
    
    const soundBlock = soundMatch[0];
    
    // Find the sentence array within this block
    const sentenceRegex = /"sentence"\s*:\s*\[([\s\S]*?)\]\n\s*}/;
    const sentenceMatch = soundBlock.match(sentenceRegex);
    
    if (!sentenceMatch) {
        // The array might be followed by a comma
        const sentenceRegex2 = /"sentence"\s*:\s*\[([\s\S]*?)\]\n\s*,/;
        const sentenceMatch2 = soundBlock.match(sentenceRegex2);
        
        if (!sentenceMatch2) {
            console.error(`Could not find sentence array for sound ${soundKey}`);
            continue;
        } else {
            console.log("Found with regex2");
        }
    }
    
    // Actually, finding the boundary of the `sentence` array correctly might be easier by just looking for `"sentence": [\n ... \n    ]` or similar.
    // Let's use a simpler approach. Just match individual object blocks `{ ... "position": "sentence" ... }` inside the specific sound.
}
