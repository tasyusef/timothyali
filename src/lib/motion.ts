export const ease = { swiss: [0.4, 0, 0.2, 1] as const };
export const duration = { fast: 0.3, normal: 0.6, slow: 0.8, page: 0.4, entrance: 0.7 };
export const transition = {
  fast: { duration: 0.3, ease: ease.swiss },
  normal: { duration: 0.6, ease: ease.swiss },
  slow: { duration: 0.8, ease: ease.swiss },
  page: { duration: 0.4, ease: ease.swiss },
};
