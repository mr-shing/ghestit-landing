import { useEffect, useState } from 'react';
import { api } from './api';

/** Billing cycle ids, mirroring Company::PLAN_* on the server. */
export type Cycle = 'monthly' | 'yearly';

export type PlanFeature = { key: string; label: string; included: boolean };

export type Plan = {
  type: number;
  label: string;
  /** Annual price in Rial. */
  yearlyRial: number;
  /** One month's price in Rial. */
  monthlyRial: number;
  /** Rial saved over a year by paying annually. */
  yearlySavingRial: number;
  features: PlanFeature[];
};

export type PlansResponse = {
  plans: Plan[];
  /** Months of monthly billing the annual price covers — the «۲ ماه رایگان» claim. */
  freeMonths: number;
  demoDays: number;
};

/**
 * Prices the marketing pages fall back to when the API cannot be reached, so
 * a network blip shows stale numbers rather than an empty pricing table. The
 * server is always the source of truth when it answers.
 */
const FALLBACK: PlansResponse = {
  freeMonths: 2,
  demoDays: 10,
  plans: [
    { type: 2, label: 'پایه', yearlyRial: 120_000_000, monthlyRial: 12_000_000, yearlySavingRial: 24_000_000, features: [] },
    { type: 3, label: 'پلاس', yearlyRial: 180_000_000, monthlyRial: 18_000_000, yearlySavingRial: 36_000_000, features: [] },
    { type: 4, label: 'پرو', yearlyRial: 280_000_000, monthlyRial: 28_000_000, yearlySavingRial: 56_000_000, features: [] },
  ],
};

/** Fetches the settings-driven plan list once per mount. */
export function usePlans() {
  const [data, setData] = useState<PlansResponse>(FALLBACK);
  const [loading, setLoading] = useState(true);
  /** True once real server prices are in hand, as opposed to the fallback. */
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api.get<PlansResponse>('site/plans', undefined, { auth: false })
      .then((res) => {
        if (cancelled || !res?.plans?.length) return;
        setData(res);
        setLive(true);
      })
      .catch(() => { /* keep the fallback prices */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { ...data, loading, live };
}

/** The price of one plan for one cycle, in Rial. */
export function priceOf(plan: Plan, cycle: Cycle): number {
  return cycle === 'monthly' ? plan.monthlyRial : plan.yearlyRial;
}

const fa = (n: number) => new Intl.NumberFormat('fa-IR').format(n);

/**
 * Rial as Persian Toman: round millions read as «۱۲ میلیون تومان», anything
 * else keeps its exact digits so a campaign price is never rounded away.
 */
export function toman(rial: number): string {
  const value = rial / 10;
  return value >= 1_000_000 && value % 1_000_000 === 0
    ? `${fa(value / 1_000_000)} میلیون تومان`
    : `${fa(value)} تومان`;
}

export function cycleSuffix(cycle: Cycle): string {
  return cycle === 'monthly' ? 'در ماه' : 'در سال';
}
