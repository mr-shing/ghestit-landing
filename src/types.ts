export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  originalPriceNum: number;
  period: string;
  isPopular?: boolean;
  link?: string;
  features: PlanFeature[];
  smsCountText: string;
  buttonText: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface CalculatorState {
  amount: number;
  downPayment: number;
  installments: number;
  interestRate: number;
  delayDays: number;
  delayRate: number;
}

export interface InstallmentDetail {
  index: number;
  amount: number;
  date: string;
  status: 'pending' | 'paid' | 'delayed';
  penalty: number;
}

export interface CalculatorResult {
  installmentAmount: number;
  totalInterest: number;
  totalWithInterest: number;
  penaltyPerDay: number;
  totalPenalty: number;
  installments: InstallmentDetail[];
}

export interface ContactFormData {
  name: string;
  businessName: string;
  phone: string;
  email: string;
  description: string;
}
