import { create } from 'zustand';

export interface CalculatorInput {
  gross: number;
  childrenCount: number;
  isMarried: boolean;
}

interface CalculatorInputState extends CalculatorInput {
  setGross: (gross: number) => void;
  setChildrenCount: (count: number) => void;
  setIsMarried: (isMarried: boolean) => void;
  reset: () => void;
}

const initialState: CalculatorInput = {
  gross: 0,
  childrenCount: 0,
  isMarried: false,
};

export const useCalculatorInputStore = create<CalculatorInputState>((set) => ({
  ...initialState,

  setGross: (gross) => {
    set({ gross });
  },
  setChildrenCount: (count) => {
    set({ childrenCount: count });
  },
  setIsMarried: (isMarried) => {
    set({ isMarried });
  },
  reset: () => {
    set(initialState);
  },
}));
