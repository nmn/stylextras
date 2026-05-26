import type { ReactNode } from "react";

export type AccessibleNameProps =
  | {
      "aria-label"?: string;
      "aria-labelledby"?: string;
      label: ReactNode;
    }
  | {
      "aria-label": string;
      "aria-labelledby"?: string;
      label?: ReactNode;
    }
  | {
      "aria-label"?: string;
      "aria-labelledby": string;
      label?: ReactNode;
    };

export type AccessibleAriaNameProps =
  | {
      "aria-label": string;
      "aria-labelledby"?: string;
    }
  | {
      "aria-label"?: string;
      "aria-labelledby": string;
    };

export type AccessibleGroupNameProps =
  | {
      "aria-label"?: string;
      "aria-labelledby"?: string;
      legend: ReactNode;
    }
  | {
      "aria-label": string;
      "aria-labelledby"?: string;
      legend?: ReactNode;
    }
  | {
      "aria-label"?: string;
      "aria-labelledby": string;
      legend?: ReactNode;
    };
