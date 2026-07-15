import { UiTestHarness } from "@/components/catalog/UiTestHarness";

export default function UiTestPage() {
  return (
    <>
      <title>UI verification | StyleXtras</title>
      <UiTestHarness />
    </>
  );
}

export const getConfig = async () => ({ render: "static" as const });
