import { RouterLinkFixture } from "@/components/catalog/RouterLinkFixture";

export default function RouterLinksTestPage() {
  return (
    <>
      <title>Router link verification | StyleXtras</title>
      <RouterLinkFixture />
    </>
  );
}

export const getConfig = async () => ({ render: "static" as const });
