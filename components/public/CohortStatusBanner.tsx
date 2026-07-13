"use client";

import { useEffect, useState } from "react";

type ActiveCohortResponse = {
  data?: {
    isOpen: boolean;
    cohort: {
      id: string;
      name: string;
      applicationWindowClose: string | null;
    } | null;
  };
};

export default function CohortStatusBanner() {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCohortStatus() {
      try {
        const response = await fetch("/api/cohorts/active");
        if (!response.ok) {
          if (isMounted) setIsOpen(false);
          return;
        }
        const payload = (await response.json()) as ActiveCohortResponse;
        if (isMounted) setIsOpen(Boolean(payload.data?.isOpen));
      } catch {
        if (isMounted) setIsOpen(false);
      }
    }

    void loadCohortStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isOpen === null) {
    return (
      <div className="animate-pulse rounded-md bg-surface-secondary p-5 min-h-15" />
    );
  }

  return (
    <div
      className={`rounded-md p-5 text-sm font-medium ${
        isOpen
          ? "bg-status-success text-text-on-light"
          : "bg-status-warning text-text-on-light"
      }`}
    >
      {isOpen
        ? "Applications are now open for the first cohort."
        : "Applications are currently closed. Check back soon."}
    </div>
  );
}
