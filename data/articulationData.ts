import { ArticulationDataMap } from '@/types/articulation';

const defaultImage = '/images/image2.png'; // Using placeholder for now

export const articulationData: ArticulationDataMap = {
  p: {
    initial: [
      { id: 'p-initial-1', word: 'Pig', image: '/images/pig.jpg', targetSound: 'p', position: 'initial' },
      { id: 'p-initial-2', word: 'Pan', image: defaultImage, targetSound: 'p', position: 'initial' },
      { id: 'p-initial-3', word: 'Pen', image: '/images/pen.jpg', targetSound: 'p', position: 'initial' },
      { id: 'p-initial-4', word: 'Pencil', image: defaultImage, targetSound: 'p', position: 'initial' },
      { id: 'p-initial-5', word: 'Paper', image: defaultImage, targetSound: 'p', position: 'initial' },
      { id: 'p-initial-6', word: 'Pizza', image: defaultImage, targetSound: 'p', position: 'initial' },
      { id: 'p-initial-7', word: 'Popcorn', image: defaultImage, targetSound: 'p', position: 'initial' },
      { id: 'p-initial-8', word: 'Puppy', image: defaultImage, targetSound: 'p', position: 'initial' },
      { id: 'p-initial-9', word: 'Penguin', image: defaultImage, targetSound: 'p', position: 'initial' },
      { id: 'p-initial-10', word: 'Pumpkin', image: defaultImage, targetSound: 'p', position: 'initial' },
    ],
    medial: [
      { id: 'p-medial-1', word: 'Apple', image: defaultImage, targetSound: 'p', position: 'medial' },
      { id: 'p-medial-2', word: 'Happy', image: defaultImage, targetSound: 'p', position: 'medial' },
      { id: 'p-medial-3', word: 'Zipper', image: defaultImage, targetSound: 'p', position: 'medial' },
      { id: 'p-medial-4', word: 'Puppet', image: defaultImage, targetSound: 'p', position: 'medial' },
      { id: 'p-medial-5', word: 'Pepper', image: defaultImage, targetSound: 'p', position: 'medial' },
      { id: 'p-medial-6', word: 'Paper', image: defaultImage, targetSound: 'p', position: 'medial' },
      { id: 'p-medial-7', word: 'Hippo', image: defaultImage, targetSound: 'p', position: 'medial' },
      { id: 'p-medial-8', word: 'Open', image: defaultImage, targetSound: 'p', position: 'medial' },
      { id: 'p-medial-9', word: 'Spider', image: defaultImage, targetSound: 'p', position: 'medial' },
      { id: 'p-medial-10', word: 'Teapot', image: defaultImage, targetSound: 'p', position: 'medial' },
    ],
    final: [
      { id: 'p-final-1', word: 'Cup', image: defaultImage, targetSound: 'p', position: 'final' },
      { id: 'p-final-2', word: 'Soup', image: defaultImage, targetSound: 'p', position: 'final' },
      { id: 'p-final-3', word: 'Mop', image: defaultImage, targetSound: 'p', position: 'final' },
      { id: 'p-final-4', word: 'Top', image: defaultImage, targetSound: 'p', position: 'final' },
      { id: 'p-final-5', word: 'Soap', image: defaultImage, targetSound: 'p', position: 'final' },
      { id: 'p-final-6', word: 'Rope', image: defaultImage, targetSound: 'p', position: 'final' },
      { id: 'p-final-7', word: 'Jump', image: defaultImage, targetSound: 'p', position: 'final' },
      { id: 'p-final-8', word: 'Sheep', image: defaultImage, targetSound: 'p', position: 'final' },
      { id: 'p-final-9', word: 'Sleep', image: defaultImage, targetSound: 'p', position: 'final' },
      { id: 'p-final-10', word: 'Map', image: defaultImage, targetSound: 'p', position: 'final' },
    ],
    sentence: [
      { id: 'p-sentence-1', sentence: 'The pig is pink.', image: defaultImage, targetSound: 'p', position: 'sentence' },
      { id: 'p-sentence-2', sentence: 'Put the pen away.', image: defaultImage, targetSound: 'p', position: 'sentence' },
      { id: 'p-sentence-3', sentence: 'Pop the popcorn.', image: defaultImage, targetSound: 'p', position: 'sentence' },
      { id: 'p-sentence-4', sentence: 'The puppy plays outside.', image: defaultImage, targetSound: 'p', position: 'sentence' },
      { id: 'p-sentence-5', sentence: 'Open the paper bag.', image: defaultImage, targetSound: 'p', position: 'sentence' },
      { id: 'p-sentence-6', sentence: 'The pizza is hot.', image: defaultImage, targetSound: 'p', position: 'sentence' },
      { id: 'p-sentence-7', sentence: 'The apple is sweet.', image: defaultImage, targetSound: 'p', position: 'sentence' },
      { id: 'p-sentence-8', sentence: 'The soup is hot.', image: defaultImage, targetSound: 'p', position: 'sentence' },
      { id: 'p-sentence-9', sentence: 'The sheep can jump.', image: defaultImage, targetSound: 'p', position: 'sentence' },
      { id: 'p-sentence-10', sentence: 'The soap smells nice.', image: defaultImage, targetSound: 'p', position: 'sentence' },
    ],
  },
  // Add placeholders for other sounds to ensure it builds and works
  b: { initial: [], medial: [], final: [], sentence: [] },
  m: { initial: [], medial: [], final: [], sentence: [] },
  ch: { initial: [], medial: [], final: [], sentence: [] },
  d: { initial: [], medial: [], final: [], sentence: [] },
  f: { initial: [], medial: [], final: [], sentence: [] },
  g: { initial: [], medial: [], final: [], sentence: [] },
  h: { initial: [], medial: [], final: [], sentence: [] },
  j: { initial: [], medial: [], final: [], sentence: [] },
  k: { initial: [], medial: [], final: [], sentence: [] },
  l: { initial: [], medial: [], final: [], sentence: [] },
  n: { initial: [], medial: [], final: [], sentence: [] },
  r: { initial: [], medial: [], final: [], sentence: [] },
  s: { initial: [], medial: [], final: [], sentence: [] },
  sh: { initial: [], medial: [], final: [], sentence: [] },
  t: { initial: [], medial: [], final: [], sentence: [] },
  th: { initial: [], medial: [], final: [], sentence: [] },
  v: { initial: [], medial: [], final: [], sentence: [] },
  w: { initial: [], medial: [], final: [], sentence: [] },
  y: { initial: [], medial: [], final: [], sentence: [] },
  z: { initial: [], medial: [], final: [], sentence: [] },
};

export const availableSounds = [
  'p', 'b', 'm', 'ch', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'n', 'r', 's', 'sh', 't', 'th', 'v', 'w', 'y', 'z'
];
