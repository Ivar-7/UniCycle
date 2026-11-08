export interface ImpactMetric {
  readonly id: string;
  readonly value: string;
  readonly label: string;
  readonly detail: string;
}

export interface FaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export interface AboutOverviewData {
  readonly metrics: readonly ImpactMetric[];
  readonly faqs: readonly FaqItem[];
}
