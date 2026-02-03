"use client";

import { Loader2 } from "lucide-react";
import type { ToolInvocation } from "ai";

interface ToolInvocationDisplayProps {
  toolInvocation: ToolInvocation;
}

function extractFilename(path: string | undefined): string {
  if (!path) return "file";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return "root";
  const parts = normalized.split("/");
  return parts[parts.length - 1] || "file";
}

function getToolMessage(toolInvocation: ToolInvocation): string {
  const { toolName, args } = toolInvocation;
  const command = args?.command as string | undefined;
  const path = args?.path as string | undefined;
  const newPath = args?.new_path as string | undefined;

  if (toolName === "str_replace_editor") {
    const filename = extractFilename(path);
    switch (command) {
      case "create":
        return `Creating ${filename}`;
      case "str_replace":
        return `Editing ${filename}`;
      case "insert":
        return `Adding to ${filename}`;
      case "view":
        return `Viewing ${filename}`;
      case "undo_edit":
        return `Undoing edit to ${filename}`;
      default:
        return toolName;
    }
  }

  if (toolName === "file_manager") {
    const filename = extractFilename(path);
    switch (command) {
      case "rename":
        const newFilename = extractFilename(newPath);
        return `Renaming ${filename} to ${newFilename}`;
      case "delete":
        return `Deleting ${filename}`;
      default:
        return toolName;
    }
  }

  return toolName;
}

export function ToolInvocationDisplay({
  toolInvocation,
}: ToolInvocationDisplayProps) {
  const message = getToolMessage(toolInvocation);
  const isComplete =
    toolInvocation.state === "result" && toolInvocation.result !== undefined;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isComplete ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-neutral-700">{message}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{message}</span>
        </>
      )}
    </div>
  );
}
