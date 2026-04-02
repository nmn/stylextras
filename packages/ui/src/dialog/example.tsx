"use client";

import { useRef, useState } from "react";
import { Dialog, type DialogSize } from "./index";

const controlRowStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "12px",
  alignItems: "center",
  marginBottom: "16px",
};

export function DialogExample() {
  const [size, setSize] = useState<DialogSize>("md");
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div>
      <div style={controlRowStyle}>
        <label>
          Size{" "}
          <select
            value={size}
            onChange={(event) => setSize(event.target.value as DialogSize)}
          >
            <option value="sm">sm</option>
            <option value="md">md</option>
            <option value="lg">lg</option>
          </select>
        </label>

        <button onClick={() => dialogRef.current?.showModal()} type="button">
          Open modal
        </button>

        <button onClick={() => dialogRef.current?.show()} type="button">
          Open non-modal
        </button>
      </div>

      <Dialog ref={dialogRef} size={size}>
        <h2 style={{ marginTop: 0 }}>Native dialog</h2>
        <p>
          This component styles the platform dialog element instead of wrapping a
          third-party abstraction.
        </p>
        <form method="dialog" style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit">Close</button>
        </form>
      </Dialog>
    </div>
  );
}
