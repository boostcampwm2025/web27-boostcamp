import { create } from 'zustand';
import type {
  CampaignFormData,
  FormStep,
  AdContent,
  BudgetSettings,
  FormErrors,
} from './types';

interface CampaignFormState {
  currentStep: FormStep;
  formData: CampaignFormData;
  errors: FormErrors;

  setStep: (step: FormStep) => void;
  updateAdContent: (data: Partial<AdContent>) => void;
  updateBudgetSettings: (data: Partial<BudgetSettings>) => void;
  setErrors: (errors: FormErrors) => void;
  resetForm: () => void;
}

const initialFormData: CampaignFormData = {
  adContent: {
    title: '',
    url: '',
    tags: [],
    isHighIntent: false,
  },
  budgetSettings: {
    dailyBudget: 0,
    totalBudget: 0,
    maxCpc: 0,
  },
};

export const useCampaignForm = create<CampaignFormState>((set) => ({
  currentStep: 1,
  formData: initialFormData,
  errors: {},

  setStep: (step) => set({ currentStep: step }),

  updateAdContent: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        adContent: {
          ...state.formData.adContent,
          ...data,
        },
      },
    })),

  updateBudgetSettings: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        budgetSettings: {
          ...state.formData.budgetSettings,
          ...data,
        },
      },
    })),

  setErrors: (errors) => set({ errors }),

  resetForm: () =>
    set({
      currentStep: 1,
      formData: initialFormData,
      errors: {},
    }),
}));
