// A damped spring, ported from charmbracelet/harmonica (spring.go, MIT,
// itself after Ryan Juckett's closed-form damped springs). A value chases a target: each frame
// its position and velocity are advanced exactly for the frame's length, so the motion is the
// same at any frame rate. `omega` is the speed (angular frequency); `zeta` the damping ratio:
// under 1 it overshoots and settles, 1 arrives as fast as it can without overshooting, over 1 creeps.
export type Spring = { update: (pos: number, vel: number, target: number) => [number, number] };

export function spring(dt: number, omega: number, zeta: number): Spring {
  omega = Math.max(0, omega); zeta = Math.max(0, zeta);
  let pp = 1, pv = 0, vp = 0, vv = 1;
  const eps = Number.EPSILON;
  if (omega >= eps) {
    if (zeta > 1 + eps) { // over-damped
      const za = -omega * zeta, zb = omega * Math.sqrt(zeta * zeta - 1), z1 = za - zb, z2 = za + zb;
      const e1 = Math.exp(z1 * dt), e2 = Math.exp(z2 * dt), inv = 1 / (2 * zb);
      const e1o = e1 * inv, e2o = e2 * inv, z1e1o = z1 * e1o, z2e2o = z2 * e2o;
      pp = e1o * z2 - z2e2o + e2; pv = -e1o + e2o; vp = (z1e1o - z2e2o + e2) * z2; vv = -z1e1o + z2e2o;
    } else if (zeta < 1 - eps) { // under-damped
      const oz = omega * zeta, alpha = omega * Math.sqrt(1 - zeta * zeta);
      const ex = Math.exp(-oz * dt), c = Math.cos(alpha * dt), s = Math.sin(alpha * dt);
      const exSin = ex * s, exCos = ex * c, exOzSinA = (ex * oz * s) / alpha;
      pp = exCos + exOzSinA; pv = exSin / alpha; vp = -exSin * alpha - oz * exOzSinA; vv = exCos - exOzSinA;
    } else { // critically damped
      const ex = Math.exp(-omega * dt), tEx = dt * ex, tExW = tEx * omega;
      pp = tExW + ex; pv = tEx; vp = -omega * tExW; vv = -tExW + ex;
    }
  }
  return { update: (pos, vel, target) => { const x = pos - target; return [x * pp + vel * pv + target, x * vp + vel * vv]; } };
}
