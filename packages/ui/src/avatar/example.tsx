"use client";

import { Avatar } from "./index";
import { DemoFrame, DemoRow, DemoStack } from "../example-theme/demo";

export function AvatarSizesDemo() {
  return (
    <DemoFrame
      title="Sizes"
      description="Avatar should show size and fallback differences directly."
      showThemes={false}
    >
      <DemoRow>
        <Avatar fallback="SX" size="sm" />
        <Avatar fallback="SX" size="md" />
        <Avatar fallback="SX" size="lg" />
      </DemoRow>
    </DemoFrame>
  );
}

export function AvatarImageDemo() {
  return (
    <DemoFrame
      title="Image and fallback"
      description="A second frame compares image-backed and fallback avatars."
      showThemes={false}
    >
      <DemoRow>
        <Avatar
          alt="Profile"
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop&crop=faces"
        />
        <Avatar fallback="JP" />
      </DemoRow>
    </DemoFrame>
  );
}

export default function Example() {
  return (
    <DemoStack>
      <AvatarSizesDemo />
      <AvatarImageDemo />
    </DemoStack>
  );
}
