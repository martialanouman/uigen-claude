import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationDisplay } from "../ToolInvocationDisplay";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

// str_replace_editor commands
test("displays 'Creating filename' for create command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("displays 'Editing filename' for str_replace command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "2",
    toolName: "str_replace_editor",
    args: { command: "str_replace", path: "/components/Card.jsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);
  expect(screen.getByText("Editing Card.jsx")).toBeDefined();
});

test("displays 'Adding to filename' for insert command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "3",
    toolName: "str_replace_editor",
    args: { command: "insert", path: "/utils/helpers.js" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);
  expect(screen.getByText("Adding to helpers.js")).toBeDefined();
});

test("displays 'Viewing filename' for view command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "4",
    toolName: "str_replace_editor",
    args: { command: "view", path: "/App.jsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);
  expect(screen.getByText("Viewing App.jsx")).toBeDefined();
});

test("displays 'Undoing edit to filename' for undo_edit command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "5",
    toolName: "str_replace_editor",
    args: { command: "undo_edit", path: "/App.jsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);
  expect(screen.getByText("Undoing edit to App.jsx")).toBeDefined();
});

// file_manager commands
test("displays 'Renaming filename to new_filename' for rename command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "6",
    toolName: "file_manager",
    args: { command: "rename", path: "/old.jsx", new_path: "/new.jsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);
  expect(screen.getByText("Renaming old.jsx to new.jsx")).toBeDefined();
});

test("displays 'Renaming filename to file' when new_path is missing", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "7",
    toolName: "file_manager",
    args: { command: "rename", path: "/old.jsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);
  expect(screen.getByText("Renaming old.jsx to file")).toBeDefined();
});

test("displays 'Deleting filename' for delete command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "8",
    toolName: "file_manager",
    args: { command: "delete", path: "/temp.jsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);
  expect(screen.getByText("Deleting temp.jsx")).toBeDefined();
});

// Unknown tool fallback
test("displays tool name for unknown tools", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "9",
    toolName: "unknown_tool",
    args: {},
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);
  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("displays tool name when command is missing for str_replace_editor", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "10",
    toolName: "str_replace_editor",
    args: {},
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);
  expect(screen.getByText("str_replace_editor")).toBeDefined();
});

// State indicators
test("shows spinner for call state", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "11",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "call",
  };

  const { container } = render(
    <ToolInvocationDisplay toolInvocation={toolInvocation} />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("shows spinner for partial-call state", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "12",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "partial-call",
  };

  const { container } = render(
    <ToolInvocationDisplay toolInvocation={toolInvocation} />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("shows green dot for result state", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "13",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "result",
    result: "Success",
  };

  const { container } = render(
    <ToolInvocationDisplay toolInvocation={toolInvocation} />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

// Filename extraction edge cases
test("handles nested paths correctly", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "14",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/src/components/ui/Button.jsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);
  expect(screen.getByText("Creating Button.jsx")).toBeDefined();
});

test("handles paths without leading slash", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "15",
    toolName: "str_replace_editor",
    args: { command: "create", path: "App.jsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("handles root path", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "16",
    toolName: "str_replace_editor",
    args: { command: "view", path: "/" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);
  expect(screen.getByText("Viewing root")).toBeDefined();
});

test("handles missing path gracefully", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "17",
    toolName: "str_replace_editor",
    args: { command: "create" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);
  expect(screen.getByText("Creating file")).toBeDefined();
});
