import { create } from 'zustand';
import type {
  CampaignFormData,
  FormStep,
  CampaignContent,
  BudgetSettings,
  FormErrors,
  CampaignFormMode,
} from './types';

interface CampaignFormState {
  mode: CampaignFormMode;
  currentStep: FormStep;
  formData: CampaignFormData;
  errors: FormErrors;
  balance: number | null;
  initialTotalBudget: number | null;

  setMode: (mode: CampaignFormMode) => void;
  setStep: (step: FormStep) => void;
  updateCampaignContent: (data: Partial<CampaignContent>) => void;
  updateBudgetSettings: (data: Partial<BudgetSettings>) => void;
  setErrors: (errors: FormErrors) => void;
  setBalance: (balance: number | null) => void;
  setFormData: (data: CampaignFormData) => void;
  setInitialTotalBudget: (budget: number | null) => void;
  resetForm: () => void;
}

const initialFormData: CampaignFormData = {
  campaignContent: {
    title: '',
    content: '',
    url: '',
    tags: [],
    isHighIntent: false,
    image: null,
  },
  budgetSettings: {
    dailyBudget: 0,
    totalBudget: 0,
    maxCpc: 0,
    startDate: '',
    endDate: '',
  },
};

export const useCampaignFormStore = create<CampaignFormState>((set) => ({
  mode: 'create',
  currentStep: 1,
  formData: initialFormData,
  errors: {},
  balance: null,
  initialTotalBudget: null,

  setMode: (mode) => set({ mode }),

  setStep: (step) => set({ currentStep: step }),

  setBalance: (balance) => set({ balance }),

  setFormData: (data) => set({ formData: data }),

  setInitialTotalBudget: (budget) => set({ initialTotalBudget: budget }),

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
      mode: 'create',
      currentStep: 1,
      formData: initialFormData,
      errors: {},
      balance: null,
      initialTotalBudget: null,
    }),
}));
