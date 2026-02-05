import { test, expect, vi, afterEach, describe } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock heavy dependencies
vi.mock("@/components/preview/PreviewFrame", () => ({
  PreviewFrame: () => <div data-testid="preview-frame">PreviewFrame</div>,
}));
vi.mock("@/components/editor/FileTree", () => ({
  FileTree: () => <div data-testid="file-tree">FileTree</div>,
}));
vi.mock("@/components/editor/CodeEditor", () => ({
  CodeEditor: () => <div data-testid="code-editor">CodeEditor</div>,
}));
vi.mock("@/components/HeaderActions", () => ({
  HeaderActions: () => <div data-testid="header-actions">HeaderActions</div>,
}));
vi.mock("@/lib/contexts/file-system-context", () => ({
  FileSystemProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("@/lib/contexts/chat-context", () => ({
  ChatProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("@/components/chat/ChatInterface", () => ({
  ChatInterface: () => <div>ChatInterface</div>,
}));
vi.mock("@/components/ui/resizable", () => ({
  ResizablePanelGroup: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  ResizablePanel: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  ResizableHandle: () => <div data-testid="resize-handle" />,
}));

import { MainContent } from "@/app/main-content";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("MainContent tab toggle", () => {
  test("renders Preview tab active by default", () => {
    render(<MainContent />);
    expect(screen.getByTestId("preview-frame")).toBeDefined();
    expect(screen.queryByTestId("code-editor")).toBeNull();
    expect(screen.queryByTestId("file-tree")).toBeNull();
  });

  test("clicking Code tab shows code editor and hides preview", async () => {
    const user = userEvent.setup();
    render(<MainContent />);

    expect(screen.getByTestId("preview-frame")).toBeDefined();

    const codeTab = screen.getByRole("tab", { name: "Code" });
    await user.click(codeTab);

    expect(screen.getByTestId("code-editor")).toBeDefined();
    expect(screen.getByTestId("file-tree")).toBeDefined();
    expect(screen.queryByTestId("preview-frame")).toBeNull();
  });

  test("clicking Preview tab after Code tab switches back to preview", async () => {
    const user = userEvent.setup();
    render(<MainContent />);

    const codeTab = screen.getByRole("tab", { name: "Code" });
    await user.click(codeTab);
    expect(screen.getByTestId("code-editor")).toBeDefined();

    const previewTab = screen.getByRole("tab", { name: "Preview" });
    await user.click(previewTab);

    expect(screen.getByTestId("preview-frame")).toBeDefined();
    expect(screen.queryByTestId("code-editor")).toBeNull();
  });

  test("toggling tabs rapidly works correctly", async () => {
    const user = userEvent.setup();
    render(<MainContent />);

    const codeTab = screen.getByRole("tab", { name: "Code" });
    const previewTab = screen.getByRole("tab", { name: "Preview" });

    await user.click(codeTab);
    await user.click(previewTab);
    await user.click(codeTab);

    expect(screen.getByTestId("code-editor")).toBeDefined();
    expect(screen.queryByTestId("preview-frame")).toBeNull();
  });

  test("tab buttons have correct aria-selected states", async () => {
    const user = userEvent.setup();
    render(<MainContent />);

    const previewTab = screen.getByRole("tab", { name: "Preview" });
    const codeTab = screen.getByRole("tab", { name: "Code" });

    expect(previewTab.getAttribute("aria-selected")).toBe("true");
    expect(codeTab.getAttribute("aria-selected")).toBe("false");

    await user.click(codeTab);

    expect(previewTab.getAttribute("aria-selected")).toBe("false");
    expect(codeTab.getAttribute("aria-selected")).toBe("true");
  });

  test("tab switches even when mousedown is prevented (e.g. by resizable panels)", async () => {
    render(<MainContent />);

    const codeTab = screen.getByRole("tab", { name: "Code" });

    // Simulate mousedown being prevented (as react-resizable-panels can do)
    // followed by a click event — the onClick handler should still work
    fireEvent.mouseDown(codeTab, { button: 0, defaultPrevented: true });
    fireEvent.click(codeTab);

    expect(screen.getByTestId("code-editor")).toBeDefined();
    expect(screen.queryByTestId("preview-frame")).toBeNull();
  });

  test("tab buttons have correct data-state attributes", async () => {
    const user = userEvent.setup();
    render(<MainContent />);

    const previewTab = screen.getByRole("tab", { name: "Preview" });
    const codeTab = screen.getByRole("tab", { name: "Code" });

    expect(previewTab.getAttribute("data-state")).toBe("active");
    expect(codeTab.getAttribute("data-state")).toBe("inactive");

    await user.click(codeTab);

    expect(previewTab.getAttribute("data-state")).toBe("inactive");
    expect(codeTab.getAttribute("data-state")).toBe("active");
  });
});
