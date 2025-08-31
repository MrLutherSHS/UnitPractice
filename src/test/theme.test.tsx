import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SimpleThemeToggle, ThemeToggle } from "@/components/theme-toggle";
import { ThemeProvider } from "@/contexts/theme-provider";

// Mock localStorage
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	clear: vi.fn(),
};
vi.stubGlobal("localStorage", localStorageMock);

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

function renderWithTheme(component: React.ReactElement) {
	return render(
		<ThemeProvider defaultTheme="light">{component}</ThemeProvider>,
	);
}

describe("ThemeToggle", () => {
	it("renders all theme options", () => {
		renderWithTheme(<ThemeToggle />);

		expect(screen.getByTitle("Light mode")).toBeInTheDocument();
		expect(screen.getByTitle("Dark mode")).toBeInTheDocument();
		expect(screen.getByTitle("System preference")).toBeInTheDocument();
	});

	it("allows switching between themes", async () => {
		const user = userEvent.setup();
		renderWithTheme(<ThemeToggle />);

		await user.click(screen.getByTitle("Dark mode"));
		expect(localStorageMock.setItem).toHaveBeenCalledWith("ui-theme", "dark");

		await user.click(screen.getByTitle("System preference"));
		expect(localStorageMock.setItem).toHaveBeenCalledWith("ui-theme", "system");
	});
});

describe("SimpleThemeToggle", () => {
	it("renders theme toggle button", () => {
		renderWithTheme(<SimpleThemeToggle />);

		expect(screen.getByTitle("Switch to dark mode")).toBeInTheDocument();
	});

	it("cycles through theme options when clicked", async () => {
		const user = userEvent.setup();
		renderWithTheme(<SimpleThemeToggle />);

		const button = screen.getByTitle("Switch to dark mode");
		await user.click(button);

		expect(localStorageMock.setItem).toHaveBeenCalledWith("ui-theme", "dark");
	});
});
