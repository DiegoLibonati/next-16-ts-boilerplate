import { createElement } from "react";

import type { AnchorHTMLAttributes, ReactNode } from "react";

import { mockMswServer } from "@tests/__mocks__/mswServer.mock";

import "@testing-library/jest-dom";

const trackedMessageChannels = new Set<MessageChannel>();
const OriginalMessageChannel = globalThis.MessageChannel;
class TrackedMessageChannel extends OriginalMessageChannel {
  constructor() {
    super();
    trackedMessageChannels.add(this);
  }
}

globalThis.MessageChannel = TrackedMessageChannel;

jest.mock("next/link", () => ({
  __esModule: true,
  default: (
    props: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }
  ): ReturnType<typeof createElement> => {
    const { href, children, ...rest } = props;
    return createElement("a", { href, ...rest }, children);
  },
}));

beforeAll((): void => {
  mockMswServer.listen({ onUnhandledRequest: "bypass" });
});

afterEach((): void => {
  mockMswServer.resetHandlers();
});

afterAll((): void => {
  mockMswServer.close();

  trackedMessageChannels.forEach((channel): void => {
    channel.port1.close();
    channel.port2.close();
  });
  trackedMessageChannels.clear();
});
