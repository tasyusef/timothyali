# PX-44: copy edit

2026-09-22, decision 0124. Timothy accepted the full copy review and its replacement drafts.

Home now names the selected disciplines and makes the existing-team invitation explicit. Jade's lead is repaired and its closing Results/Outcome repetition merged. PARC and xrp.cafe have shorter endings; Sonde's backend list becomes a short explanation of loading and data. Contact's message label and required note cover roles and projects. Toolbox's installer heading is Download; below 420px it uses Jacquard's 43/48 step, because 86px overflowed at 320px.

`before/`, `after/`, and `copy.diff` preserve this pass relative to the pre-existing, uncommitted PX-43 state, including Timothy's newer body-sized study lead. Browser screenshots were inspected in the task; the measured results are in `verification.json`. The fresh preview is http://127.0.0.1:4175/.

Verification: Svelte check 0 errors/warnings, production build, 18-page metadata verification; six edited routes at 1440/390/320 without horizontal overflow. Contact empty-field validation shows the new copy and three invalid fields; no message sent. The new Download heading initially overflowed at 320px and was corrected and rechecked. No runtime errors on the fresh preview. Initial stale module errors belonged to older preview processes; those processes were left intact.

The private résumé and cover-letter sources remain outside this repo. Both résumé tracks, both letters, and the phone-free public résumé were rebuilt and visually inspected as one-page PDFs. Personal facts, education, employers, role titles, dates, and the complete platform-scale sentences were compared with the private baseline and are unchanged. The public file was synced to static/resume and its served bytes verified. Detailed document verification and the private before snapshot live beside the editable sources.

Copy implementation authorized by Timothy; no claim of final visual approval. No commit, push, deployment, or application submission.
