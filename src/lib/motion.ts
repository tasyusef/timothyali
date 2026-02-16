export const ease = { swiss: [0.4, 0, 0.2, 1] as const };
export const duration = { fast: 0.3, normal: 0.6, slow: 0.8, page: 0.4, entrance: 0.7 };
export const delay = { stagger: 0.1, section: 0.2, hero: 0.25 };
export const spring = { nav: { type: "spring" as const, stiffness: 500, damping: 25, mass: 0.8 } };
export const viewport = { default: { once: true, margin: "-80px" }, card: { once: true, margin: "-100px" } };
export const transition = {
  fast: { duration: 0.3, ease: ease.swiss },
  normal: { duration: 0.6, ease: ease.swiss },
  slow: { duration: 0.8, ease: ease.swiss },
  page: { duration: 0.4, ease: ease.swiss },
  entrance: { duration: 0.7, ease: ease.swiss },
};
