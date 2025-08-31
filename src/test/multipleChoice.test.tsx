import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MultipleChoice } from "@/components/MultipleChoice";

// Mock the numberUtils module
vi.mock("@/lib/numberUtils", () => ({
	formatNumber: vi.fn((value: number) => value.toLocaleString()),
}));

// Mock the quizHooks module
vi.mock("@/lib/quizHooks", () => ({
	useQuizAriaIds: vi.fn(() => ({
		questionId: "test-question-id",
		optionGroupId: "test-option-group-id",
	})),
}));

describe("MultipleChoice Component", () => {
	let mockOnScoreUpdate: ReturnType<typeof vi.fn>;
	let mathRandomSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		mockOnScoreUpdate = vi.fn();
		mathRandomSpy = vi.spyOn(Math, "random");
		vi.clearAllMocks();
	});

	describe("Component Rendering", () => {
		it("renders without crashing", () => {
			expect(() =>
				render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />),
			).not.toThrow();
		});

		it("displays multiple choice options immediately", async () => {
			mathRandomSpy
				.mockReturnValueOnce(0) // Select conversion question
				.mockReturnValueOnce(0) // Select first conversion pair
				.mockReturnValue(0.5); // For option shuffling

			render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />);

			await waitFor(() => {
				const buttons = screen.getAllByRole("button");
				// Should have 4 option buttons
				const optionButtons = buttons.filter(
					(btn) =>
						btn.textContent?.includes("GB") ||
						btn.textContent?.includes("MB") ||
						btn.textContent?.includes("KB") ||
						btn.textContent?.includes("TB") ||
						btn.textContent?.includes("bytes"),
				);
				expect(optionButtons).toHaveLength(4);
			});
		});
	});

	describe("Question Types", () => {
		it("generates conversion questions with correct structure", async () => {
			mathRandomSpy
				.mockReturnValueOnce(0) // Select conversion question type
				.mockReturnValueOnce(0) // Select first conversion pair
				.mockReturnValue(0.5);

			render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />);

			await waitFor(() => {
				// Should contain conversion question text
				expect(
					screen.getByText(/Identify the quantity of.*that is the same as/i),
				).toBeInTheDocument();
			});
		});

		it("generates comparison questions (smallest/largest)", async () => {
			mathRandomSpy
				.mockReturnValueOnce(0.9) // Select comparison question type
				.mockReturnValueOnce(0.3) // Select comparison type (smallest/largest)
				.mockReturnValueOnce(0) // Select first comparison set
				.mockReturnValue(0.5);

			render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />);

			await waitFor(() => {
				// Should contain comparison question text
				expect(
					screen.getByText(
						/Identify the (smallest|largest) secondary storage capacity/i,
					),
				).toBeInTheDocument();
			});
		});
	});

	describe("User Interactions", () => {
		it("handles option selection and submission", async () => {
			mathRandomSpy
				.mockReturnValueOnce(0) // Select conversion question
				.mockReturnValueOnce(0) // Select first conversion pair
				.mockReturnValue(0.5);

			render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />);

			await waitFor(() => {
				const optionButtons = screen
					.getAllByRole("button")
					.filter(
						(btn) =>
							btn.textContent?.includes("GB") ||
							btn.textContent?.includes("MB") ||
							btn.textContent?.includes("KB") ||
							btn.textContent?.includes("TB") ||
							btn.textContent?.includes("bytes"),
					);
				expect(optionButtons.length).toBeGreaterThan(0);

				// Click the first option
				fireEvent.click(optionButtons[0]);
			});

			// Should call onScoreUpdate
			await waitFor(() => {
				expect(mockOnScoreUpdate).toHaveBeenCalledTimes(1);
			});
		});

		it("shows feedback after answer submission", async () => {
			mathRandomSpy
				.mockReturnValueOnce(0)
				.mockReturnValueOnce(0)
				.mockReturnValue(0.5);

			render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />);

			await waitFor(() => {
				const optionButtons = screen
					.getAllByRole("button")
					.filter(
						(btn) =>
							btn.textContent?.includes("GB") ||
							btn.textContent?.includes("MB") ||
							btn.textContent?.includes("KB") ||
							btn.textContent?.includes("TB") ||
							btn.textContent?.includes("bytes"),
					);

				fireEvent.click(optionButtons[0]);
			});

			// Should show feedback
			await waitFor(() => {
				expect(
					screen.getByText("Correct!") || screen.getByText("Incorrect"),
				).toBeInTheDocument();
			});
		});

		it("shows next question button after submission", async () => {
			mathRandomSpy
				.mockReturnValueOnce(0)
				.mockReturnValueOnce(0)
				.mockReturnValue(0.5);

			render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />);

			await waitFor(() => {
				const optionButtons = screen
					.getAllByRole("button")
					.filter(
						(btn) =>
							btn.textContent?.includes("GB") ||
							btn.textContent?.includes("MB") ||
							btn.textContent?.includes("KB") ||
							btn.textContent?.includes("TB") ||
							btn.textContent?.includes("bytes"),
					);

				fireEvent.click(optionButtons[0]);
			});

			await waitFor(() => {
				expect(screen.getByText("Next Question")).toBeInTheDocument();
			});
		});
	});

	describe("Accessibility", () => {
		it("has proper ARIA labels and structure", async () => {
			mathRandomSpy
				.mockReturnValueOnce(0.5) // Select comparison question for better accessibility test
				.mockReturnValueOnce(0.3)
				.mockReturnValueOnce(0)
				.mockReturnValue(0.5);

			render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />);

			// Check for main landmarks
			expect(screen.getByRole("main")).toBeInTheDocument();

			await waitFor(() => {
				// Check for radiogroup
				expect(screen.getByRole("radiogroup")).toBeInTheDocument();

				// Check for fieldset/legend structure (multiple groups are expected: fieldset and details)
				const groups = screen.getAllByRole("group");
				expect(groups).toHaveLength(2); // fieldset and details both have group role

				// Check for proper heading structure
				expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
				expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
			});
		});
	});
});
