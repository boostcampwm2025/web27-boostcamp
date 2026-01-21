import { create } from 'zustand';
import type {
  CampaignFormData,
  FormStep,
  CampaignContent,
  BudgetSettings,
  FormErrors,
} from './types';

interface CampaignFormState {
  currentStep: FormStep;
  formData: CampaignFormData;
  errors: FormErrors;

  setStep: (step: FormStep) => void;
  updateCampaignContent: (data: Partial<CampaignContent>) => void;
  updateBudgetSettings: (data: Partial<BudgetSettings>) => void;
  setErrors: (errors: FormErrors) => void;
  resetForm: () => void;
}

const initialFormData: CampaignFormData = {
  campaignContent: {
    title: '',
    content: '',
    url: '',
    tags: [],
    isHighIntent: false,
    imageFile: null,
  },
  budgetSettings: {
    dailyBudget: 0,
    totalBudget: 0,
    maxCpc: 0,
  },
};

export const useCampaignFormStore = create<CampaignFormState>((set) => ({
  currentStep: 1,
  formData: initialFormData,
  errors: {},

  setStep: (step) => set({ currentStep: step }),

  updateCampaignContent: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        campaignContent: {
          ...state.formData.campaignContent,
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
