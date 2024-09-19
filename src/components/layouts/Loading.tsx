// ---- React ----
import { useRef } from 'react';
// ---- KumaUI ----
import { css } from '@kuma-ui/core';

export default function Loading() {
  // -------- useRef --------
  const backScreenRef = useRef(null);
  const loadingRef = useRef(null);

  return (
    <div
      ref={backScreenRef}
      className={css`
        display: grid;
        place-items: center;
        position: absolute;
        inset: 0;
        background: #49b482;
        color: #fff;
      `}
    >
      <p ref={loadingRef}>Loading</p>
    </div>
  );
}
