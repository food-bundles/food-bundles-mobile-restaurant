import type { CreditScore, CreditTier, DataConsent, DataConsentSource } from '@/mocks/types';

const BASE_LIMIT_RWF = 60_000;

const SOURCE_CONTRIBUTION: Record<DataConsentSource, number> = {
  eucl: 25_000,
  rra: 50_000,
  vubaVuba: 30_000,
  kayko: 20_000,
  creditBureau: 15_000,
  foodbundles: 10_000,
};

const SOURCE_WEIGHT: Record<DataConsentSource, number> = {
  rra: 0.35,
  vubaVuba: 0.2,
  kayko: 0.15,
  eucl: 0.1,
  creditBureau: 0.1,
  foodbundles: 0.1,
};

/** Maps a computed limit to its qualification tier, per the 60k/120k/180k thresholds. */
function limitToTier(limitRwf: number): CreditTier {
  if (limitRwf >= 180_000) return 'A';
  if (limitRwf >= 120_000) return 'B';
  if (limitRwf >= 60_000) return 'C';
  return 'D';
}

/**
 * Computes a mock qualification score from the restaurant's granted data-consent
 * sources. Mirrors the KYC white paper's category weighting at a simplified,
 * client-side level — the real composite model and its live data sources run
 * server-side and are out of scope for this mocked client.
 */
export function computeScore(consentList: DataConsent[]): CreditScore {
  const grantedSources = new Set(consentList.filter((c) => c.granted).map((c) => c.source));
  const scoreBreakdown = (Object.keys(SOURCE_CONTRIBUTION) as DataConsentSource[])
    .filter((source) => source === 'foodbundles' || grantedSources.has(source))
    .map((source) => ({
      source,
      weight: SOURCE_WEIGHT[source],
      contribution: SOURCE_CONTRIBUTION[source],
    }));

  const limitRwf = BASE_LIMIT_RWF + scoreBreakdown.reduce((sum, entry) => sum + entry.contribution, 0);

  return { tier: limitToTier(limitRwf), limitRwf, scoreBreakdown };
}
