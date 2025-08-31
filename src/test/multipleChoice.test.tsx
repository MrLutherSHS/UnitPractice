import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MultipleChoice } from "@/components/MultipleChoice";

// Mock the numberUtils module
vi.mock("@/lib/numberUtils", () => ({
	formatNumber: (num: number) => num.toLocaleString(),
	type: {} as any,
}));

describe("MultipleChoice Component", () => {
	let mockOnScoreUpdate: ReturnType<typeof vi.fn>;
	let mathRandomSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		mockOnScoreUpdate = vi.fn();
		// Create a spy on Math.random
		mathRandomSpy = vi.spyOn(Math, "random");
	});

	afterEach(() => {
		vi.clearAllMocks();
		mathRandomSpy.mockRestore();
	});

	describe("Component Rendering", () => {
		it("renders the component with initial welcome screen", () => {
			render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />);
			
			expect(screen.getByText("Multiple Choice Storage Conversions")).toBeInTheDocument();
			expect(screen.getByText("Start Practicing")).toBeInTheDocument();
		});

		it("generates and displays a question when Start Practicing is clicked", async () => {
			// Mock Math.random to return predictable values for question generation
			mathRandomSpy
				.mockReturnValueOnce(0) // Select first question type (conversion)
				.mockReturnValueOnce(0) // Select first conversion pair
				.mockReturnValue(0.5); // For shuffling options

			render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />);
			
			const startButton = screen.getByText("Start Practicing");
			fireEvent.click(startButton);

			await waitFor(() => {
				expect(screen.queryByText("Start Practicing")).not.toBeInTheDocument();
			});

			// Should display question text and options
			const questionElements = screen.getAllByText(/kilobytes|megabytes|gigabytes|terabytes/i);
			expect(questionElements.length).toBeGreaterThan(0);
		});

		it("displays multiple choice options", async () => {
			mathRandomSpy
				.mockReturnValueOnce(0) // Select conversion question
				.mockReturnValueOnce(0) // Select first conversion pair
				.mockReturnValue(0.5); // For option shuffling

			render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />);
			
			const startButton = screen.getByText("Start Practicing");
			fireEvent.click(startButton);

			await waitFor(() => {
				const buttons = screen.getAllByRole("button");
				// Should have 4 option buttons (excluding start/next buttons)
				const optionButtons = buttons.filter(btn => 
					btn.textContent?.includes("GB") || 
					btn.textContent?.includes("MB") || 
					btn.textContent?.includes("KB") || 
					btn.textContent?.includes("TB") ||
					btn.textContent?.includes("bytes")
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
			
			const startButton = screen.getByText("Start Practicing");
			fireEvent.click(startButton);

			await waitFor(() => {
				// Should contain conversion question text
				expect(screen.getByText(/Identify the quantity of.*that is the same as/i)).toBeInTheDocument();
			});
		});

		it("generates comparison questions (smallest/largest)", async () => {
			mathRandomSpy
				.mockReturnValueOnce(0.9) // Select comparison question type
				.mockReturnValueOnce(0.3) // Select comparison type (smallest/largest)
				.mockReturnValueOnce(0) // Select first comparison set
				.mockReturnValue(0.5);

			render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />);
			
			const startButton = screen.getByText("Start Practicing");
			fireEvent.click(startButton);

			await waitFor(() => {
				// Should contain comparison question text
				expect(screen.getByText(/Identify the (smallest|largest) secondary storage capacity/i)).toBeInTheDocument();
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
			
			const startButton = screen.getByText("Start Practicing");
			fireEvent.click(startButton);

			await waitFor(() => {
				const optionButtons = screen.getAllByRole("button").filter(btn => 
					btn.textContent?.includes("GB") || 
					btn.textContent?.includes("MB") || 
					btn.textContent?.includes("KB") || 
					btn.textContent?.includes("TB") ||
					btn.textContent?.includes("bytes")
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
			
			const startButton = screen.getByText("Start Practicing");
			fireEvent.click(startButton);

			await waitFor(() => {
				const optionButtons = screen.getAllByRole("button").filter(btn => 
					btn.textContent?.includes("GB") || 
					btn.textContent?.includes("MB") || 
					btn.textContent?.includes("KB") || 
					btn.textContent?.includes("TB") ||
					btn.textContent?.includes("bytes")
				);
				
				fireEvent.click(optionButtons[0]);
			});

			// Should show feedback
			await waitFor(() => {
				expect(
					screen.getByText("Correct!") || screen.getByText("Incorrect")
				).toBeInTheDocument();
			});
		});

		it("disables options after submission", async () => {
			mathRandomSpy
				.mockReturnValueOnce(0)
				.mockReturnValueOnce(0)
				.mockReturnValue(0.5);

			render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />);
			
			const startButton = screen.getByText("Start Practicing");
			fireEvent.click(startButton);

			await waitFor(async () => {
				const optionButtons = screen.getAllByRole("button").filter(btn => 
					btn.textContent?.includes("GB") || 
					btn.textContent?.includes("MB") || 
					btn.textContent?.includes("KB") || 
					btn.textContent?.includes("TB") ||
					btn.textContent?.includes("bytes")
				);
				
				fireEvent.click(optionButtons[0]);
				
				// Wait for submission to process
				await waitFor(() => {
					expect(mockOnScoreUpdate).toHaveBeenCalled();
				});

				// Try clicking another option - should not call onScoreUpdate again
				const initialCallCount = mockOnScoreUpdate.mock.calls.length;
				fireEvent.click(optionButtons[1]);
				
				// Should not have additional calls
				expect(mockOnScoreUpdate).toHaveBeenCalledTimes(initialCallCount);
			});
		});

		it("shows next question button after submission", async () => {
			mathRandomSpy
				.mockReturnValueOnce(0)
				.mockReturnValueOnce(0)
				.mockReturnValue(0.5);

			render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />);
			
			const startButton = screen.getByText("Start Practicing");
			fireEvent.click(startButton);

			await waitFor(() => {
				const optionButtons = screen.getAllByRole("button").filter(btn => 
					btn.textContent?.includes("GB") || 
					btn.textContent?.includes("MB") || 
					btn.textContent?.includes("KB") || 
					btn.textContent?.includes("TB") ||
					btn.textContent?.includes("bytes")
				);
				
				fireEvent.click(optionButtons[0]);
			});

			await waitFor(() => {
				expect(screen.getByText("Next Question")).toBeInTheDocument();
			});
		});
	});

	describe("Keyboard Navigation", () => {
		it("handles Enter key to generate next question after submission", async () => {
			mathRandomSpy
				.mockReturnValueOnce(0)
				.mockReturnValueOnce(0)
				.mockReturnValue(0.5);

			render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />);
			
			const startButton = screen.getByText("Start Practicing");
			fireEvent.click(startButton);

			await waitFor(() => {
				const optionButtons = screen.getAllByRole("button").filter(btn => 
					btn.textContent?.includes("GB") || 
					btn.textContent?.includes("MB") || 
					btn.textContent?.includes("KB") || 
					btn.textContent?.includes("TB") ||
					btn.textContent?.includes("bytes")
				);
				
				fireEvent.click(optionButtons[0]);
			});

			await waitFor(() => {
				expect(screen.getByText("Next Question")).toBeInTheDocument();
			});

			// Mock new question generation
			mathRandomSpy
				.mockReturnValueOnce(0.9) // Different question type
				.mockReturnValueOnce(0)
				.mockReturnValue(0.7);

			// Press Enter key
			fireEvent.keyDown(document, { key: "Enter" });

			// Should generate new question
			await waitFor(() => {
				expect(mockOnScoreUpdate).toHaveBeenCalledTimes(1); // Only one call from previous answer
			});
		});
	});

	describe("Score Updates", () => {
		it("calls onScoreUpdate with correct parameters for correct answer", async () => {
			mathRandomSpy
				.mockReturnValueOnce(0) // Select conversion question
				.mockReturnValueOnce(0) // Select first conversion pair
				.mockReturnValueOnce(0); // Place correct answer first in shuffled options

			render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />);
			
			const startButton = screen.getByText("Start Practicing");
			fireEvent.click(startButton);

			await waitFor(() => {
				const optionButtons = screen.getAllByRole("button").filter(btn => 
					btn.textContent?.includes("GB") || 
					btn.textContent?.includes("MB") || 
					btn.textContent?.includes("KB") || 
					btn.textContent?.includes("TB") ||
					btn.textContent?.includes("bytes")
				);
				
				// Click the first option (which should be correct due to our mock)
				fireEvent.click(optionButtons[0]);
			});

			await waitFor(() => {
				expect(mockOnScoreUpdate).toHaveBeenCalledWith(
					true, // isCorrect
					"Multiple Choice" // questionType
				);
			});
		});

		it("calls onScoreUpdate with correct parameters for incorrect answer", async () => {
			mathRandomSpy
				.mockReturnValueOnce(0) // Select conversion question
				.mockReturnValueOnce(0) // Select first conversion pair
				.mockReturnValueOnce(0.9); // Place correct answer last in shuffled options

			render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />);
			
			const startButton = screen.getByText("Start Practicing");
			fireEvent.click(startButton);

			await waitFor(() => {
				const optionButtons = screen.getAllByRole("button").filter(btn => 
					btn.textContent?.includes("GB") || 
					btn.textContent?.includes("MB") || 
					btn.textContent?.includes("KB") || 
					btn.textContent?.includes("TB") ||
					btn.textContent?.includes("bytes")
				);
				
				// Click the first option (which should be incorrect due to our mock)
				fireEvent.click(optionButtons[0]);
			});

			await waitFor(() => {
				expect(mockOnScoreUpdate).toHaveBeenCalledWith(
					false, // isCorrect
					"Multiple Choice" // questionType
				);
			});
		});
	});

	describe("Explanation Display", () => {
		it("shows explanation after answer submission", async () => {
			mathRandomSpy
				.mockReturnValueOnce(0)
				.mockReturnValueOnce(0)
				.mockReturnValue(0.5);

			render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />);
			
			const startButton = screen.getByText("Start Practicing");
			fireEvent.click(startButton);

			await waitFor(() => {
				const optionButtons = screen.getAllByRole("button").filter(btn => 
					btn.textContent?.includes("GB") || 
					btn.textContent?.includes("MB") || 
					btn.textContent?.includes("KB") || 
					btn.textContent?.includes("TB") ||
					btn.textContent?.includes("bytes")
				);
				
				fireEvent.click(optionButtons[0]);
			});

			await waitFor(() => {
				expect(screen.getByText("Step-by-step explanation:")).toBeInTheDocument();
			});
		});

		it("shows conversion explanation for conversion questions", async () => {
			mathRandomSpy
				.mockReturnValueOnce(0) // Select conversion question
				.mockReturnValueOnce(0)
				.mockReturnValue(0.5);

			render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />);
			
			const startButton = screen.getByText("Start Practicing");
			fireEvent.click(startButton);

			await waitFor(() => {
				const optionButtons = screen.getAllByRole("button").filter(btn => 
					btn.textContent?.includes("GB") || 
					btn.textContent?.includes("MB") || 
					btn.textContent?.includes("KB") || 
					btn.textContent?.includes("TB") ||
					btn.textContent?.includes("bytes")
				);
				
				fireEvent.click(optionButtons[0]);
			});

			await waitFor(() => {
				expect(screen.getByText(/Identify the conversion/i)).toBeInTheDocument();
				expect(screen.getByText(/Calculate the result/i)).toBeInTheDocument();
			});
		});

		it("shows comparison explanation for comparison questions", async () => {
			mathRandomSpy
				.mockReturnValueOnce(0.9) // Select comparison question
				.mockReturnValueOnce(0.3)
				.mockReturnValueOnce(0)
				.mockReturnValue(0.5);

			render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />);
			
			const startButton = screen.getByText("Start Practicing");
			fireEvent.click(startButton);

			await waitFor(() => {
				const optionButtons = screen.getAllByRole("button").filter(btn => 
					btn.textContent?.includes("GB") || 
					btn.textContent?.includes("MB") || 
					btn.textContent?.includes("KB") || 
					btn.textContent?.includes("TB") ||
					btn.textContent?.includes("bytes")
				);
				
				fireEvent.click(optionButtons[0]);
			});

			await waitFor(() => {
				expect(screen.getByText(/Convert all values to a common base unit/i)).toBeInTheDocument();
				expect(screen.getByText(/Find the (smallest|largest) value/i)).toBeInTheDocument();
			});
		});
	});

	describe("Accessibility", () => {
		it("has proper ARIA labels and structure", async () => {
			render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />);
			
			// Check for main heading
			expect(screen.getByRole("main")).toBeInTheDocument();
			
			const startButton = screen.getByText("Start Practicing");
			fireEvent.click(startButton);

			await waitFor(() => {
				// Should have buttons for options
				const buttons = screen.getAllByRole("button");
				expect(buttons.length).toBeGreaterThan(0);
			});
		});

		it("has live region for feedback announcements", async () => {
			render(<MultipleChoice onScoreUpdate={mockOnScoreUpdate} />);
			
			// Check for live region (aria-live)
			const liveRegions = document.querySelectorAll("[aria-live]");
			expect(liveRegions.length).toBeGreaterThan(0);
		});
	});
});
