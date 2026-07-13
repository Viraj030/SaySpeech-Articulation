export interface ArticulationItem {
  id: string;
  word?: string;
  sentence?: string;
  image: string;
  targetSound: string;
  position: 'initial' | 'medial' | 'final' | 'sentence';
}

export interface SoundData {
  initial: ArticulationItem[];
  medial: ArticulationItem[];
  final: ArticulationItem[];
  sentence: ArticulationItem[];
}

export type ArticulationDataMap = Record<string, SoundData>;
