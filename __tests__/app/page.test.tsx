import { render, screen } from "@testing-library/react";

import { getSession } from "@/server/helpers/get_session.helper";

import HomePage from "@/app/page";

import { mockSession } from "@tests/__mocks__/session.mock";

const mockPush = jest.fn();
const mockRefresh = jest.fn();

jest.mock("@/server/helpers/get_session.helper", () => ({
  getSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: (): { push: jest.Mock; refresh: jest.Mock } => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

const renderPage = async (): Promise<void> => {
  const ui = await HomePage();
  render(ui);
};

describe("page", () => {
  describe("when the user is logged in", () => {
    beforeEach(() => {
      jest.mocked(getSession).mockResolvedValue(mockSession);
    });

    it("should render the app heading", async () => {
      await renderPage();
      expect(
        screen.getByRole("heading", { name: "Next.js 16 MongoDB Boilerplate" })
      ).toBeInTheDocument();
    });

    it("should render the About navigation link", async () => {
      await renderPage();
      expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    });

    it("should render the Users navigation link", async () => {
      await renderPage();
      expect(screen.getByRole("link", { name: "Users" })).toHaveAttribute("href", "/users");
    });

    it("should render the Products navigation link", async () => {
      await renderPage();
      expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute("href", "/products");
    });

    it("should render the Context Demo navigation link", async () => {
      await renderPage();
      expect(screen.getByRole("link", { name: "Context Demo" })).toHaveAttribute(
        "href",
        "/context-demo"
      );
    });

    it("should render the logout button", async () => {
      await renderPage();
      expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
    });

    it("should not render the login link", async () => {
      await renderPage();
      expect(screen.queryByRole("link", { name: "Login to access" })).not.toBeInTheDocument();
    });
  });

  describe("when the user is not logged in", () => {
    beforeEach(() => {
      jest.mocked(getSession).mockResolvedValue(null);
    });

    it("should render the app heading", async () => {
      await renderPage();
      expect(
        screen.getByRole("heading", { name: "Next.js 16 MongoDB Boilerplate" })
      ).toBeInTheDocument();
    });

    it("should not render navigation links", async () => {
      await renderPage();
      expect(screen.queryByRole("link", { name: "About" })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: "Users" })).not.toBeInTheDocument();
    });

    it("should render disabled text for navigation items", async () => {
      await renderPage();
      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByText("Users")).toBeInTheDocument();
      expect(screen.getByText("Products")).toBeInTheDocument();
      expect(screen.getByText("Context Demo")).toBeInTheDocument();
    });

    it("should render the login link", async () => {
      await renderPage();
      expect(screen.getByRole("link", { name: "Login to access" })).toHaveAttribute(
        "href",
        "/login"
      );
    });

    it("should not render the logout button", async () => {
      await renderPage();
      expect(screen.queryByRole("button", { name: "Logout" })).not.toBeInTheDocument();
    });
  });
});
