# Component architecture

- Each public component or compound part renders and styles its actual native element.
- Do not create public unstyled primitive layers or a separate themed wrapper layer.
- Do not write `renderSomething` helpers. Repeated UI belongs in named React subcomponents.
- Forward React 19 refs and extend the underlying native element's props.
- Prefer native uncontrolled browser behavior and progressively enhance it with platform APIs.
- Accordion and Collapsible remain native `<details>/<summary>` components. Hide the browser marker only when the styled trigger includes an explicit directional icon, and keep every item/trigger width stable across its open state.
- Never use `requestAnimationFrame`, `setTimeout`, or similar delays as workarounds for interaction ordering. Treat them as a code smell and use the correct native event boundary, state transition, or platform relationship instead.
- Keep canonical subpath imports and do not add a package barrel.
- Multi-part components expose styled subcomponents instead of special styling props such as `triggerSx`.
- Remove duplicate aliases rather than maintaining compatibility shims during the pre-1.0 redesign.
