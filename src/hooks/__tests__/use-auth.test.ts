import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAuth } from "../use-auth";
import * as actions from "@/actions";
import * as anonWorkTracker from "@/lib/anon-work-tracker";
import * as getProjectsAction from "@/actions/get-projects";
import * as createProjectAction from "@/actions/create-project";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock actions
vi.mock("@/actions", () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock("@/lib/anon-work-tracker", () => ({
  getAnonWorkData: vi.fn(),
  clearAnonWork: vi.fn(),
}));

vi.mock("@/actions/get-projects", () => ({
  getProjects: vi.fn(),
}));

vi.mock("@/actions/create-project", () => ({
  createProject: vi.fn(),
}));

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    test("isLoading is initially false", () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.isLoading).toBe(false);
    });

    test("returns signIn and signUp functions", () => {
      const { result } = renderHook(() => useAuth());
      expect(typeof result.current.signIn).toBe("function");
      expect(typeof result.current.signUp).toBe("function");
    });
  });

  describe("signIn", () => {
    test("sets isLoading to true during sign in", async () => {
      let resolveSignIn: (value: any) => void;
      const signInPromise = new Promise((resolve) => {
        resolveSignIn = resolve;
      });

      vi.mocked(actions.signIn).mockReturnValue(signInPromise as any);
      vi.mocked(anonWorkTracker.getAnonWorkData).mockReturnValue(null);
      vi.mocked(getProjectsAction.getProjects).mockResolvedValue([]);
      vi.mocked(createProjectAction.createProject).mockResolvedValue({
        id: "new-project",
        name: "New Design",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user-1",
        messages: "[]",
        data: "{}",
      });

      const { result } = renderHook(() => useAuth());

      let signInResultPromise: Promise<any>;
      act(() => {
        signInResultPromise = result.current.signIn("test@example.com", "password123");
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolveSignIn!({ success: true });
        await signInResultPromise;
      });

      expect(result.current.isLoading).toBe(false);
    });

    test("returns success result on successful sign in", async () => {
      vi.mocked(actions.signIn).mockResolvedValue({ success: true });
      vi.mocked(anonWorkTracker.getAnonWorkData).mockReturnValue(null);
      vi.mocked(getProjectsAction.getProjects).mockResolvedValue([]);
      vi.mocked(createProjectAction.createProject).mockResolvedValue({
        id: "new-project",
        name: "New Design",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user-1",
        messages: "[]",
        data: "{}",
      });

      const { result } = renderHook(() => useAuth());

      let signInResult: any;
      await act(async () => {
        signInResult = await result.current.signIn("test@example.com", "password123");
      });

      expect(signInResult).toEqual({ success: true });
    });

    test("returns error result on failed sign in", async () => {
      vi.mocked(actions.signIn).mockResolvedValue({
        success: false,
        error: "Invalid credentials",
      });

      const { result } = renderHook(() => useAuth());

      let signInResult: any;
      await act(async () => {
        signInResult = await result.current.signIn("test@example.com", "wrongpassword");
      });

      expect(signInResult).toEqual({ success: false, error: "Invalid credentials" });
      expect(mockPush).not.toHaveBeenCalled();
    });

    test("does not call handlePostSignIn on failed sign in", async () => {
      vi.mocked(actions.signIn).mockResolvedValue({
        success: false,
        error: "Invalid credentials",
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "wrongpassword");
      });

      expect(anonWorkTracker.getAnonWorkData).not.toHaveBeenCalled();
      expect(getProjectsAction.getProjects).not.toHaveBeenCalled();
      expect(createProjectAction.createProject).not.toHaveBeenCalled();
    });

    test("resets isLoading to false even when sign in fails", async () => {
      vi.mocked(actions.signIn).mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        try {
          await result.current.signIn("test@example.com", "password123");
        } catch {
          // Expected to throw
        }
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("signUp", () => {
    test("sets isLoading to true during sign up", async () => {
      let resolveSignUp: (value: any) => void;
      const signUpPromise = new Promise((resolve) => {
        resolveSignUp = resolve;
      });

      vi.mocked(actions.signUp).mockReturnValue(signUpPromise as any);
      vi.mocked(anonWorkTracker.getAnonWorkData).mockReturnValue(null);
      vi.mocked(getProjectsAction.getProjects).mockResolvedValue([]);
      vi.mocked(createProjectAction.createProject).mockResolvedValue({
        id: "new-project",
        name: "New Design",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user-1",
        messages: "[]",
        data: "{}",
      });

      const { result } = renderHook(() => useAuth());

      let signUpResultPromise: Promise<any>;
      act(() => {
        signUpResultPromise = result.current.signUp("test@example.com", "password123");
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolveSignUp!({ success: true });
        await signUpResultPromise;
      });

      expect(result.current.isLoading).toBe(false);
    });

    test("returns success result on successful sign up", async () => {
      vi.mocked(actions.signUp).mockResolvedValue({ success: true });
      vi.mocked(anonWorkTracker.getAnonWorkData).mockReturnValue(null);
      vi.mocked(getProjectsAction.getProjects).mockResolvedValue([]);
      vi.mocked(createProjectAction.createProject).mockResolvedValue({
        id: "new-project",
        name: "New Design",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user-1",
        messages: "[]",
        data: "{}",
      });

      const { result } = renderHook(() => useAuth());

      let signUpResult: any;
      await act(async () => {
        signUpResult = await result.current.signUp("test@example.com", "password123");
      });

      expect(signUpResult).toEqual({ success: true });
    });

    test("returns error result on failed sign up", async () => {
      vi.mocked(actions.signUp).mockResolvedValue({
        success: false,
        error: "Email already registered",
      });

      const { result } = renderHook(() => useAuth());

      let signUpResult: any;
      await act(async () => {
        signUpResult = await result.current.signUp("test@example.com", "password123");
      });

      expect(signUpResult).toEqual({ success: false, error: "Email already registered" });
      expect(mockPush).not.toHaveBeenCalled();
    });

    test("does not call handlePostSignIn on failed sign up", async () => {
      vi.mocked(actions.signUp).mockResolvedValue({
        success: false,
        error: "Email already registered",
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("test@example.com", "password123");
      });

      expect(anonWorkTracker.getAnonWorkData).not.toHaveBeenCalled();
      expect(getProjectsAction.getProjects).not.toHaveBeenCalled();
      expect(createProjectAction.createProject).not.toHaveBeenCalled();
    });

    test("resets isLoading to false even when sign up fails", async () => {
      vi.mocked(actions.signUp).mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        try {
          await result.current.signUp("test@example.com", "password123");
        } catch {
          // Expected to throw
        }
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("handlePostSignIn - anonymous work migration", () => {
    test("creates project from anonymous work and redirects", async () => {
      const anonMessages = [{ role: "user", content: "Hello" }];
      const anonFileSystemData = { "/App.jsx": { type: "file", content: "export default () => <div />" } };

      vi.mocked(actions.signIn).mockResolvedValue({ success: true });
      vi.mocked(anonWorkTracker.getAnonWorkData).mockReturnValue({
        messages: anonMessages,
        fileSystemData: anonFileSystemData,
      });
      vi.mocked(createProjectAction.createProject).mockResolvedValue({
        id: "migrated-project-123",
        name: "Design from 10:30:00 AM",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user-1",
        messages: JSON.stringify(anonMessages),
        data: JSON.stringify(anonFileSystemData),
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      expect(createProjectAction.createProject).toHaveBeenCalledWith({
        name: expect.stringMatching(/^Design from /),
        messages: anonMessages,
        data: anonFileSystemData,
      });
      expect(anonWorkTracker.clearAnonWork).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/migrated-project-123");
    });

    test("does not migrate anonymous work with empty messages", async () => {
      vi.mocked(actions.signIn).mockResolvedValue({ success: true });
      vi.mocked(anonWorkTracker.getAnonWorkData).mockReturnValue({
        messages: [],
        fileSystemData: {},
      });
      vi.mocked(getProjectsAction.getProjects).mockResolvedValue([]);
      vi.mocked(createProjectAction.createProject).mockResolvedValue({
        id: "new-project",
        name: "New Design",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user-1",
        messages: "[]",
        data: "{}",
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      expect(anonWorkTracker.clearAnonWork).not.toHaveBeenCalled();
      expect(getProjectsAction.getProjects).toHaveBeenCalled();
    });
  });

  describe("handlePostSignIn - existing projects", () => {
    test("redirects to most recent project when user has projects", async () => {
      const existingProjects = [
        { id: "project-1", name: "Recent Project", createdAt: new Date(), updatedAt: new Date() },
        { id: "project-2", name: "Older Project", createdAt: new Date(), updatedAt: new Date() },
      ];

      vi.mocked(actions.signIn).mockResolvedValue({ success: true });
      vi.mocked(anonWorkTracker.getAnonWorkData).mockReturnValue(null);
      vi.mocked(getProjectsAction.getProjects).mockResolvedValue(existingProjects);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      expect(mockPush).toHaveBeenCalledWith("/project-1");
      expect(createProjectAction.createProject).not.toHaveBeenCalled();
    });
  });

  describe("handlePostSignIn - new user", () => {
    test("creates new project for user with no existing projects", async () => {
      vi.mocked(actions.signIn).mockResolvedValue({ success: true });
      vi.mocked(anonWorkTracker.getAnonWorkData).mockReturnValue(null);
      vi.mocked(getProjectsAction.getProjects).mockResolvedValue([]);
      vi.mocked(createProjectAction.createProject).mockResolvedValue({
        id: "brand-new-project",
        name: "New Design #12345",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user-1",
        messages: "[]",
        data: "{}",
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      expect(createProjectAction.createProject).toHaveBeenCalledWith({
        name: expect.stringMatching(/^New Design #\d+$/),
        messages: [],
        data: {},
      });
      expect(mockPush).toHaveBeenCalledWith("/brand-new-project");
    });
  });

  describe("handlePostSignIn via signUp", () => {
    test("handles post-sign-in flow after successful sign up", async () => {
      const existingProjects = [
        { id: "signup-project", name: "My Project", createdAt: new Date(), updatedAt: new Date() },
      ];

      vi.mocked(actions.signUp).mockResolvedValue({ success: true });
      vi.mocked(anonWorkTracker.getAnonWorkData).mockReturnValue(null);
      vi.mocked(getProjectsAction.getProjects).mockResolvedValue(existingProjects);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("newuser@example.com", "password123");
      });

      expect(mockPush).toHaveBeenCalledWith("/signup-project");
    });

    test("migrates anonymous work after successful sign up", async () => {
      const anonMessages = [{ role: "assistant", content: "Generated component" }];
      const anonData = { "/Button.jsx": { type: "file", content: "<button>Click</button>" } };

      vi.mocked(actions.signUp).mockResolvedValue({ success: true });
      vi.mocked(anonWorkTracker.getAnonWorkData).mockReturnValue({
        messages: anonMessages,
        fileSystemData: anonData,
      });
      vi.mocked(createProjectAction.createProject).mockResolvedValue({
        id: "migrated-signup-project",
        name: "Design from signup",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user-1",
        messages: JSON.stringify(anonMessages),
        data: JSON.stringify(anonData),
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("newuser@example.com", "password123");
      });

      expect(anonWorkTracker.clearAnonWork).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/migrated-signup-project");
    });
  });

  describe("edge cases", () => {
    test("handles null return from getAnonWorkData", async () => {
      vi.mocked(actions.signIn).mockResolvedValue({ success: true });
      vi.mocked(anonWorkTracker.getAnonWorkData).mockReturnValue(null);
      vi.mocked(getProjectsAction.getProjects).mockResolvedValue([]);
      vi.mocked(createProjectAction.createProject).mockResolvedValue({
        id: "new-project",
        name: "New Design",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user-1",
        messages: "[]",
        data: "{}",
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      expect(getProjectsAction.getProjects).toHaveBeenCalled();
    });

    test("isLoading reflects the most recent request completion", async () => {
      let resolveFirst: (value: any) => void;

      vi.mocked(actions.signIn).mockReturnValueOnce(
        new Promise((resolve) => {
          resolveFirst = resolve;
        }) as any
      );

      vi.mocked(anonWorkTracker.getAnonWorkData).mockReturnValue(null);
      vi.mocked(getProjectsAction.getProjects).mockResolvedValue([
        { id: "project-1", name: "Project", createdAt: new Date(), updatedAt: new Date() },
      ]);

      const { result } = renderHook(() => useAuth());

      let firstPromise: Promise<any>;

      act(() => {
        firstPromise = result.current.signIn("first@example.com", "password1");
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolveFirst!({ success: true });
        await firstPromise;
      });

      expect(result.current.isLoading).toBe(false);
    });
  });
});
