export type Step =
  | { type: "compare"; indices: number[] }
  | { type: "swap"; indices: [number, number] }
  | { type: "set"; index: number; value: number }
  | { type: "mark-sorted"; indices: number[] }
  | { type: "pivot"; index: number };

export type StepGenerator = (arr: number[]) => Generator<Step, void, unknown>;
export type PureSort = (arr: number[]) => number[];

export type SortMeta = {
  slug: string;
  name: string;
  shortDescription: string;
  category: "Clássico" | "Eficiente" | "Especial";
  complexity: {
    best: string;
    average: string;
    worst: string;
    space: string;
  };
  stable: boolean;
  inPlace: boolean;
  howItWorks: string;
  pseudocode: string;
  pros: string[];
  cons: string[];
  whenToUse: string;
};

export type SortAlgorithm = {
  meta: SortMeta;
  generator: StepGenerator;
  pure: PureSort;
};