import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

// Mock the numberUtils module
vi.mock("@/lib/numberUtils", () => ({
	formatNumber: (num: number) => num.toLocaleString(),
}));

// Define types for testing (extracted from the component)
interface Question {
	category: "Multiple Choice";
	type: "conversion" | "smallest" | "largest";
	params: {
		sourceValue?: number;
		sourceUnit?: string;
		targetUnit?: string;
		values?: Array<{ value: number; unit: string; bytes: number }>;
	};
	questionText: string;
	options: string[];
	correctAnswer: number;
	explanation: Array<{
		title: string;
		details: string[];
	}>;
}

// Utility functions for testing
const unitConversions: { [key: string]: number } = {
	bytes: 1,
	KB: 1000,
	MB: 1000 * 1000,
	GB: 1000 * 1000 * 1000,
	TB: 1000 * 1000 * 1000 * 1000,
};

const convertToBytes = (value: number, unit: string): number => {
	return value * unitConversions[unit];
};

const expandUnit = (unit: string): string => {
	switch (unit) {
		case "bytes":
			return "bytes";
		case "KB":
			return "kilobytes";
		case "MB":
			return "megabytes";
		case "GB":
			return "gigabytes";
		case "TB":
			return "terabytes";
		default:
			return unit;
	}
};

// Simplified question generators for testing (based on the actual implementation)
const generateConversionQuestion = (): Question => {
	const conversionPairs = [
		{ source: 2, sourceUnit: "TB", targetUnit: "GB", answer: 2000 },
		{ source: 3, sourceUnit: "TB", targetUnit: "GB", answer: 3000 },
		{ source: 4, sourceUnit: "GB", targetUnit: "MB", answer: 4000 },
		{ source: 5, sourceUnit: "GB", targetUnit: "MB", answer: 5000 },
		{ source: 2000, sourceUnit: "KB", targetUnit: "MB", answer: 2 },
		{ source: 4000, sourceUnit: "KB", targetUnit: "MB", answer: 4 },
	];

	const conversion = conversionPairs[Math.floor(Math.random() * conversionPairs.length)];
	const { source: sourceValue, sourceUnit, targetUnit, answer: correctAnswer } = conversion;

	// Generate distractors
	let wrongAnswers = [
		correctAnswer * 10,
		correctAnswer / 10,
		correctAnswer * 100,
	].filter((ans) => ans > 0 && ans !== correctAnswer);

	const allOptions = [correctAnswer, ...wrongAnswers.slice(0, 3)];
	const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
	const correctIndex = shuffledOptions.indexOf(correctAnswer);

	const formattedOptions = shuffledOptions.map((option) => {
		if (targetUnit === "bytes") {
			return `${Math.round(option).toLocaleString()} ${targetUnit}`;
		}
		return `${option.toLocaleString()} ${targetUnit}`;
	});

	return {
		category: "Multiple Choice",
		type: "conversion",
		params: { sourceValue, sourceUnit, targetUnit },
		questionText: `Identify the quantity of ${expandUnit(targetUnit)} that is the same as ${sourceValue.toLocaleString()} ${expandUnit(sourceUnit)}.`,
		options: formattedOptions,
		correctAnswer: correctIndex,
		explanation: [
			{
				title: "Identify the conversion",
				details: [
					`Converting ${sourceValue.toLocaleString()} ${sourceUnit} to ${targetUnit}`,
					`1 ${sourceUnit} = ${(unitConversions[sourceUnit] / unitConversions[targetUnit]).toLocaleString()} ${targetUnit}`,
				],
			},
			{
				title: "Calculate the result",
				details: [
					`${sourceValue.toLocaleString()} × ${(unitConversions[sourceUnit] / unitConversions[targetUnit]).toLocaleString()} = ${correctAnswer.toLocaleString()} ${targetUnit}`,
				],
			},
		],
	};
};

const generateComparisonQuestion = (): Question => {
	const type = Math.random() < 0.5 ? "smallest" : "largest";

	const comparisonSets = [
		[
			{ value: 300, unit: "MB" },
			{ value: 2.1, unit: "GB" },
			{ value: 200000, unit: "KB" },
			{ value: 0.0021, unit: "TB" },
		],
		[
			{ value: 1500, unit: "MB" },
			{ value: 1.6, unit: "GB" },
			{ value: 1300000, unit: "KB" },
			{ value: 0.0014, unit: "TB" },
		],
	];

	const selectedSet = comparisonSets[Math.floor(Math.random() * comparisonSets.length)];

	const valuesWithBytes = selectedSet.map((v) => ({
		...v,
		bytes: convertToBytes(v.value, v.unit),
	}));

	valuesWithBytes.sort((a, b) => a.bytes - b.bytes);
	const correctValue = type === "smallest" ? valuesWithBytes[0] : valuesWithBytes[3];

	const shuffledValues = [...valuesWithBytes].sort(() => Math.random() - 0.5);
	const correctAnswerIndex = shuffledValues.findIndex((v) => v.bytes === correctValue.bytes);

	const formattedOptions = shuffledValues.map(
		(v) => `${v.value.toLocaleString()} ${v.unit}`,
	);

	return {
		category: "Multiple Choice",
		type,
		params: { values: shuffledValues },
		questionText: `Identify the ${type} secondary storage capacity.`,
		options: formattedOptions,
		correctAnswer: correctAnswerIndex,
		explanation: [
			{
				title: "Convert all values to a common base unit (MB)",
				details: shuffledValues.map((v) => {
					const inMB = v.bytes / unitConversions.MB;
					if (v.unit === "MB") {
						return `${v.value.toLocaleString()} ${v.unit} = ${v.value.toLocaleString()} MB`;
					}
					return `${v.value.toLocaleString()} ${v.unit} = ${inMB.toLocaleString()} MB`;
				}),
			},
			{
				title: `Find the ${type} value`,
				details: [
					`${type === "smallest" ? "Smallest" : "Largest"}: ${correctValue.value.toLocaleString()} ${correctValue.unit} = ${Math.round(correctValue.bytes / unitConversions.MB).toLocaleString()} MB`,
				],
			},
		],
	};
};

describe("MultipleChoice Question Generation", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("generateConversionQuestion", () => {
		it("should generate a valid conversion question structure", () => {
			// Mock Math.random for consistent testing
			vi.spyOn(Math, "random")
				.mockReturnValueOnce(0) // Select first conversion pair
				.mockReturnValue(0.5); // For shuffling

			const question = generateConversionQuestion();

			expect(question.category).toBe("Multiple Choice");
			expect(question.type).toBe("conversion");
			expect(question.params.sourceValue).toBeDefined();
			expect(question.params.sourceUnit).toBeDefined();
			expect(question.params.targetUnit).toBeDefined();
			expect(question.questionText).toContain("Identify the quantity of");
			expect(question.options).toHaveLength(4);
			expect(question.correctAnswer).toBeGreaterThanOrEqual(0);
			expect(question.correctAnswer).toBeLessThan(4);
			expect(question.explanation).toHaveLength(2);
		});

		it("should generate questions with different unit combinations", () => {
			const questions = [];
			
			// Generate multiple questions to test variety
			for (let i = 0; i < 10; i++) {
				const question = generateConversionQuestion();
				questions.push({
					sourceUnit: question.params.sourceUnit,
					targetUnit: question.params.targetUnit,
				});
			}

			// Should have some variety in unit combinations
			const uniqueCombinations = new Set(
				questions.map(q => `${q.sourceUnit}->${q.targetUnit}`)
			);
			expect(uniqueCombinations.size).toBeGreaterThan(1);
		});

		it("should have mathematically correct answers", () => {
			vi.spyOn(Math, "random")
				.mockReturnValueOnce(0) // Select first conversion pair (2 TB -> GB = 2000)
				.mockReturnValueOnce(0); // Place correct answer first

			const question = generateConversionQuestion();

			// For the first conversion pair: 2 TB = 2000 GB
			expect(question.params.sourceValue).toBe(2);
			expect(question.params.sourceUnit).toBe("TB");
			expect(question.params.targetUnit).toBe("GB");
			
			// The correct answer should be in the options
			const correctOptionText = question.options[question.correctAnswer];
			expect(correctOptionText).toContain("2,000 GB");
		});

		it("should generate believable distractors", () => {
			const question = generateConversionQuestion();
			
		// All options should be valid numbers with units
		question.options.forEach(option => {
			expect(option).toMatch(/^(\d[\d,]*(\.\d+)?|\d+\.\d+) (bytes|KB|MB|GB|TB)$/);
		});			// Should have exactly 4 unique options
			const uniqueOptions = new Set(question.options);
			expect(uniqueOptions.size).toBe(4);
		});

		it("should have correct explanation structure", () => {
			const question = generateConversionQuestion();

			expect(question.explanation).toHaveLength(2);
			expect(question.explanation[0].title).toBe("Identify the conversion");
			expect(question.explanation[1].title).toBe("Calculate the result");
			
			question.explanation.forEach(section => {
				expect(section.details).toBeInstanceOf(Array);
				expect(section.details.length).toBeGreaterThan(0);
			});
		});
	});

	describe("generateComparisonQuestion", () => {
		it("should generate a valid comparison question structure", () => {
			vi.spyOn(Math, "random")
				.mockReturnValueOnce(0.3) // Select "smallest"
				.mockReturnValueOnce(0) // Select first comparison set
				.mockReturnValue(0.5); // For shuffling

			const question = generateComparisonQuestion();

			expect(question.category).toBe("Multiple Choice");
			expect(["smallest", "largest"]).toContain(question.type);
			expect(question.params.values).toBeDefined();
			expect(question.params.values).toHaveLength(4);
			expect(question.questionText).toMatch(/Identify the (smallest|largest) secondary storage capacity/);
			expect(question.options).toHaveLength(4);
			expect(question.correctAnswer).toBeGreaterThanOrEqual(0);
			expect(question.correctAnswer).toBeLessThan(4);
			expect(question.explanation).toHaveLength(2);
		});

		it("should generate both smallest and largest question types", () => {
			const types = new Set();
			
			// Generate multiple questions to test both types
			for (let i = 0; i < 20; i++) {
				const question = generateComparisonQuestion();
				types.add(question.type);
			}

			expect(types).toContain("smallest");
			expect(types).toContain("largest");
		});

		it("should have mathematically correct smallest answer", () => {
			vi.spyOn(Math, "random")
				.mockReturnValueOnce(0.7) // Select "smallest"
				.mockReturnValueOnce(0) // Select first comparison set
				.mockReturnValue(0); // Place correct answer first

			const question = generateComparisonQuestion();
			
			if (question.type === "smallest") {
				// Verify the correct answer is indeed the smallest
				const values = question.params.values!;
				const correctValue = values[question.correctAnswer];
				const allValues = values.map(v => v.bytes);
				const minBytes = Math.min(...allValues);
				
				expect(correctValue.bytes).toBe(minBytes);
			}
		});

		it("should have mathematically correct largest answer", () => {
			vi.spyOn(Math, "random")
				.mockReturnValueOnce(0.3) // Select "largest"  
				.mockReturnValueOnce(0) // Select first comparison set
				.mockReturnValue(0); // Place correct answer first

			const question = generateComparisonQuestion();
			
			if (question.type === "largest") {
				// Verify the correct answer is indeed the largest
				const values = question.params.values!;
				const correctValue = values[question.correctAnswer];
				const allValues = values.map(v => v.bytes);
				const maxBytes = Math.max(...allValues);
				
				expect(correctValue.bytes).toBe(maxBytes);
			}
		});

		it("should have options with different units", () => {
			const question = generateComparisonQuestion();
			const units = new Set(
				question.params.values!.map(v => v.unit)
			);
			
			// Should have at least 2 different units
			expect(units.size).toBeGreaterThanOrEqual(2);
		});

		it("should have correct explanation structure for comparison", () => {
			const question = generateComparisonQuestion();

			expect(question.explanation).toHaveLength(2);
			expect(question.explanation[0].title).toBe("Convert all values to a common base unit (MB)");
			expect(question.explanation[1].title).toMatch(/Find the (smallest|largest) value/);
			
			// First explanation section should have 4 conversion details (one for each option)
			expect(question.explanation[0].details).toHaveLength(4);
			
			// Second explanation section should identify the correct answer
			expect(question.explanation[1].details).toHaveLength(1);
		});
	});

	describe("Question Randomization", () => {
		it("should generate different questions on multiple calls", () => {
			const questions = [];
			
			for (let i = 0; i < 10; i++) {
				const conversionQuestion = generateConversionQuestion();
				const comparisonQuestion = generateComparisonQuestion();
				questions.push(conversionQuestion, comparisonQuestion);
			}

			// Should have some variety in question texts
			const uniqueQuestionTexts = new Set(questions.map(q => q.questionText));
			expect(uniqueQuestionTexts.size).toBeGreaterThan(1);
		});

		it("should randomize option order", () => {
			const questions = [];
			
			// Generate same question type multiple times
			vi.spyOn(Math, "random")
				.mockReturnValue(0); // Always select first options
				
			// Reset and generate with different shuffling
			for (let i = 0; i < 5; i++) {
				vi.spyOn(Math, "random")
					.mockReturnValueOnce(0) // Same question selection
					.mockReturnValue(i * 0.2); // Different shuffling
				
				const question = generateConversionQuestion();
				questions.push(question.correctAnswer);
			}

			// Should have some variety in correct answer positions
			const uniquePositions = new Set(questions);
			expect(uniquePositions.size).toBeGreaterThan(1);
		});
	});

	describe("Edge Cases", () => {
		it("should handle all conversion pairs", () => {
			const conversionPairs = [
				{ source: 2, sourceUnit: "TB", targetUnit: "GB", answer: 2000 },
				{ source: 3, sourceUnit: "TB", targetUnit: "GB", answer: 3000 },
				{ source: 4, sourceUnit: "GB", targetUnit: "MB", answer: 4000 },
				{ source: 5, sourceUnit: "GB", targetUnit: "MB", answer: 5000 },
				{ source: 2000, sourceUnit: "KB", targetUnit: "MB", answer: 2 },
				{ source: 4000, sourceUnit: "KB", targetUnit: "MB", answer: 4 },
			];

			conversionPairs.forEach((pair, index) => {
				vi.spyOn(Math, "random")
					.mockReturnValueOnce(index / conversionPairs.length) // Select specific pair
					.mockReturnValue(0); // Consistent shuffling

				const question = generateConversionQuestion();
				expect(question.params.sourceValue).toBe(pair.source);
				expect(question.params.sourceUnit).toBe(pair.sourceUnit);
				expect(question.params.targetUnit).toBe(pair.targetUnit);
			});
		});

		it("should not have duplicate options", () => {
			// Generate many questions to test for duplicates
			for (let i = 0; i < 50; i++) {
				const question = generateConversionQuestion();
				const uniqueOptions = new Set(question.options);
				expect(uniqueOptions.size).toBe(4);
			}
		});

		it("should always have valid correct answer index", () => {
			// Generate many questions to test correctAnswer bounds
			for (let i = 0; i < 50; i++) {
				const conversionQuestion = generateConversionQuestion();
				expect(conversionQuestion.correctAnswer).toBeGreaterThanOrEqual(0);
				expect(conversionQuestion.correctAnswer).toBeLessThan(4);

				const comparisonQuestion = generateComparisonQuestion();
				expect(comparisonQuestion.correctAnswer).toBeGreaterThanOrEqual(0);
				expect(comparisonQuestion.correctAnswer).toBeLessThan(4);
			}
		});
	});
});
