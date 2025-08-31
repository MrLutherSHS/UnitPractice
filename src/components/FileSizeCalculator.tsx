import { useEffect, useId, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { type ExplanationSection, formatNumber } from "@/lib/numberUtils";
import { useQuizInteraction } from "@/lib/quizHooks";

interface Question {
	category: "File Size Calculator";
	type: "sound" | "image" | "text" | "options" | "bitsFromOptions";
	params: {
		[key: string]: number;
	};
	targetUnit: string;
	answer: number;
	explanation: ExplanationSection[];
}

const convertToUnit = (bits: number, targetUnit: string): number => {
	const conversions: { [key: string]: number } = {
		bits: 1,
		bytes: 8,
		kilobytes: 8 * 1000,
	};
	return bits / conversions[targetUnit];
};

// Generator functions moved outside component
const generateImageQuestion = (): Question => {
	const width = (Math.floor(Math.random() * 10) + 1) * 2; // 2-20 pixels (even numbers)
	const height = (Math.floor(Math.random() * 10) + 1) * 2; // 2-20 pixels
	const colourDepthOptions = [1, 2, 3, 4, 5, 6, 8];
	const colourDepth =
		colourDepthOptions[Math.floor(Math.random() * colourDepthOptions.length)];
	const targetUnit = ["bits", "bytes"][Math.floor(Math.random() * 2)];

	const sizeInBits = width * height * colourDepth;
	const answer = convertToUnit(sizeInBits, targetUnit);

	return {
		category: "File Size Calculator",
		type: "image",
		params: { width, height, colourDepth },
		targetUnit,
		answer,
		explanation: [
			{
				title: "Identify the values",
				details: [
					`Width: ${width} pixels`,
					`Height: ${height} pixels`,
					`Color depth: ${colourDepth} bits`,
				],
			},
			{
				title: "Multiply width × height × color depth",
				details: [
					`${width} × ${height} × ${colourDepth} = ${formatNumber(sizeInBits)} bits`,
				],
			},
			...(targetUnit !== "bits"
				? [
						{
							title: `Convert to ${targetUnit}`,
							details: [
								`${formatNumber(sizeInBits)} bits = ${formatNumber(answer)} ${targetUnit}`,
							],
						},
					]
				: []),
		],
	};
};

const generateSoundQuestion = (): Question => {
	const sampleRates = [20, 40, 60, 80];
	const sampleRate =
		sampleRates[Math.floor(Math.random() * sampleRates.length)];
	const duration = Math.floor(Math.random() * 10) + 1; // 1-10 seconds
	const bitDepth = [2, 4, 8][Math.floor(Math.random() * 3)];
	const targetUnit = ["bytes", "kilobytes"][Math.floor(Math.random() * 2)];

	const bits = sampleRate * duration * bitDepth;
	const answer = convertToUnit(bits, targetUnit);

	return {
		category: "File Size Calculator",
		type: "sound",
		params: { sampleRate, duration, bitDepth },
		targetUnit,
		answer,
		explanation: [
			{
				title: "Identify the values",
				details: [
					`Sample rate: ${sampleRate} Hz`,
					`Duration: ${duration} seconds`,
					`Bit depth: ${bitDepth} bits`,
				],
			},
			{
				title: "Multiply sample rate × duration × bit depth",
				details: [
					`${sampleRate} × ${duration} × ${bitDepth} = ${formatNumber(bits)} bits`,
				],
			},
			{
				title: `Convert to ${targetUnit}`,
				details: [
					`${formatNumber(bits)} bits = ${formatNumber(answer)} ${targetUnit}`,
				],
			},
		],
	};
};

const generateTextQuestion = (): Question => {
	const charCount = (Math.floor(Math.random() * 51) + 10) * 100; // 1000-6000 in steps of 100
	const bitsPerChar = 8; // ASCII
	const targetUnit = ["bytes", "kilobytes"][Math.floor(Math.random() * 2)];

	const bits = charCount * bitsPerChar;
	const answer = convertToUnit(bits, targetUnit);

	return {
		category: "File Size Calculator",
		type: "text",
		params: { charCount, bitsPerChar },
		targetUnit,
		answer,
		explanation: [
			{
				title: "Identify the values",
				details: [
					`Number of characters: ${charCount}`,
					`Bits per character (ASCII): ${bitsPerChar}`,
				],
			},
			{
				title: "Multiply number of characters × bits per character",
				details: [`${charCount} × ${bitsPerChar} = ${formatNumber(bits)} bits`],
			},
			{
				title: `Convert to ${targetUnit}`,
				details: [
					`${formatNumber(bits)} bits = ${formatNumber(answer)} ${targetUnit}`,
				],
			},
		],
	};
};

const generateOptionsQuestion = (): Question => {
	const numOfBits = Math.floor(Math.random() * 7) + 1; // 1-8  bits
	const answer = 2 ** numOfBits;

	return {
		category: "File Size Calculator",
		type: "options",
		params: { numOfBits },
		targetUnit: "bits",
		answer,
		explanation: [
			{
				title: "Identify the values",
				details: [`Number of bits: ${numOfBits}`],
			},
			{
				title: "Calculate 2 ^ number of bits",
				details: [`2^${numOfBits} = ${answer} options`],
			},
		],
	};
};

const generateBitsFromOptionsQuestion = (): Question => {
	const numberOfOptions = Math.floor(Math.random() * 255) + 1; // 1-256  options
	const answer = Math.ceil(Math.log(numberOfOptions) / Math.log(2));

	return {
		category: "File Size Calculator",
		type: "bitsFromOptions",
		params: { numberOfOptions },
		targetUnit: "bits",
		answer,
		explanation: [
			{
				title: "Identify the values",
				details: [`Number of options: ${numberOfOptions}`],
			},
			{
				title: "Use trial and error - which power of 2 is it less than?",
				details: [
					`2^1 = 2, 2^2 = 4, 2^3 = 8, 2^4 = 16, 2^5 = 32, 2^6 = 64, 2^7 = 128, 2^8 = 256...`,
					`Answer: ${answer} bits`,
				],
			},
			{
				title: "The Maths: Calculate log2(number of options)",
				details: [`log2(${numberOfOptions}) = ${answer} bits`],
			},
		],
	};
};

// Main question generator function - also moved outside since it's pure
const generateQuestion = (
	setHasSubmitted: (value: boolean) => void,
	setCurrentQuestion: (question: Question | null) => void,
	setUserAnswer: (answer: string) => void,
	setFeedback: (
		feedback: {
			isCorrect: boolean;
			message: string;
			explanation: ExplanationSection[];
		} | null,
	) => void,
): void => {
	setHasSubmitted(false);
	const questionTypes = [
		generateImageQuestion,
		generateSoundQuestion,
		generateTextQuestion,
		generateBitsFromOptionsQuestion,
		generateOptionsQuestion,
	];
	const newQuestion =
		questionTypes[Math.floor(Math.random() * questionTypes.length)]();
	setCurrentQuestion(newQuestion);
	setUserAnswer("");
	setFeedback(null);
};

interface FileSizeCalculatorProps {
	onScoreUpdate: (isCorrect: boolean, questionType: string) => void;
}

export function FileSizeCalculator({ onScoreUpdate }: FileSizeCalculatorProps) {
	const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
	const [userAnswer, setUserAnswer] = useState<string>("");
	const [feedback, setFeedback] = useState<{
		isCorrect: boolean;
		message: string;
		explanation: ExplanationSection[];
	} | null>(null);
	const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

	const { handleAnswerChange, handleSubmit, inputRef } = useQuizInteraction(
		currentQuestion,
		userAnswer,
		setUserAnswer,
		hasSubmitted,
		setHasSubmitted,
		setFeedback,
		onScoreUpdate,
	);

	// Generate unique IDs for accessibility
	const calculatorTitleId = useId();
	const currentQuestionId = useId();
	const answerInputId = useId();
	const calculationHintId = useId();
	const hintTitleId = useId();
	const feedbackMessageId = useId();
	const welcomeMessageId = useId();

	useEffect(() => {
		generateQuestion(
			setHasSubmitted,
			setCurrentQuestion,
			setUserAnswer,
			setFeedback,
		);
	}, []); // Safe empty dependency - generateQuestion is pure and state setters are stable

	// Global keyboard listener for Enter key when hasSubmitted is true
	// biome-ignore lint/correctness/useExhaustiveDependencies: inputRef.current is stable and doesn't need to be in dependencies
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Enter" && hasSubmitted && currentQuestion) {
				// Don't trigger if focus is in the input (let form submission handle it)
				if (document.activeElement !== inputRef.current) {
					generateQuestion(
						setHasSubmitted,
						setCurrentQuestion,
						setUserAnswer,
						setFeedback,
					);
					// Focus management - return focus to input after new question loads
					setTimeout(() => {
						if (inputRef.current) {
							inputRef.current.focus();
						}
					}, 100);
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [hasSubmitted, currentQuestion]);

	const getQuestionText = (question: Question): string => {
		switch (question.type) {
			case "image":
				return `An image is ${question.params.width} pixels by ${question.params.height} pixels using a colour depth of ${question.params.colourDepth} bits. How large is the file? Give your answer in ${question.targetUnit}.`;
			case "sound":
				return `A sound file has a sample rate of ${question.params.sampleRate} Hz, duration of ${question.params.duration} seconds, and bit depth of ${question.params.bitDepth} bits. What is the file size in ${question.targetUnit}?`;
			case "text":
				return `A text file is stored in ASCII. It has ${question.params.charCount} characters. How large is the file in ${question.targetUnit}?`;
			case "options":
				return `A file uses ${question.params.numOfBits} bits to store each value. How many different options can it represent?`;
			case "bitsFromOptions":
				return `An image wants to use ${question.params.numberOfOptions} different colours. What's the minimum number of bits to store each pixel?`;
			default:
				return "";
		}
	};

	const getCalculationHint = (): string => {
		if (!currentQuestion) return "Multiply the numbers";
		switch (currentQuestion.type) {
			case "image":
				return `📷 - colour depth * image height (px) * image width (px).`;
			case "sound":
				return `🔊 - sample rate (Hz) * duration (s) * bit depth`;
			case "text":
				return `🔤 - number of characters * bits per character (8 for ASCII)`;
			case "options":
				return `Number of options? 2 to the power of the number of bits`;
			case "bitsFromOptions":
				return `Bits needed for options? Log2(number of options) and round up`;
			default:
				return "";
		}
	};

	return (
		<main className="w-full" aria-labelledby={calculatorTitleId}>
			<h1 id={calculatorTitleId} className="sr-only">
				File Size Calculator
			</h1>
			<div className="p-2 sm:p-4">
				<Card className="py-0 mx-auto shadow-xl bg-white/80 backdrop-blur">
					<CardContent className="p-4 space-y-4 sm:p-6 lg:p-8 sm:space-y-6">
						{/* Live region for screen reader announcements */}
						<div aria-live="polite" aria-atomic="true" className="sr-only">
							{feedback?.message}
						</div>

						{currentQuestion ? (
							<section aria-labelledby={currentQuestionId}>
								<h2
									id={currentQuestionId}
									className="p-6 text-lg font-semibold text-white rounded-lg shadow bg-gradient-to-r from-indigo-600 to-purple-600"
								>
									{getQuestionText(currentQuestion)}
								</h2>
								<form onSubmit={handleSubmit} className="mt-6">
									<div className="space-y-2">
										<label htmlFor={answerInputId} className="sr-only">
											Your answer for: {getQuestionText(currentQuestion)}
										</label>
										<Input
											id={answerInputId}
											ref={inputRef}
											type="text"
											inputMode="numeric"
											value={
												userAnswer
													? (userAnswer.includes(".") &&
															userAnswer.endsWith(".")) ||
														userAnswer.endsWith("0")
														? userAnswer
														: formatNumber(Number(userAnswer))
													: ""
											}
											onChange={handleAnswerChange}
											placeholder="Enter your answer and press Enter"
											disabled={hasSubmitted}
											aria-describedby={calculationHintId}
											aria-invalid={
												feedback && !feedback.isCorrect ? "true" : "false"
											}
											className="p-6 text-lg font-bold text-center transition-all duration-200 border-2 border-indigo-200 shadow-lg sm:text-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 rounded-xl bg-gradient-to-r from-white to-indigo-50"
										/>
									</div>
								</form>

								{feedback && (
									<div className="mt-6">
										<Alert
											id={feedbackMessageId}
											aria-live="polite"
											className={`border-2 shadow-lg ${
												feedback.isCorrect
													? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-green-100"
													: "bg-gradient-to-r from-red-50 to-pink-50 border-red-300 shadow-red-100"
											}`}
										>
											<AlertDescription>
												<div className="w-full space-y-4">
													{/* Result Header */}
													<div
														className={`p-4 rounded-lg ${
															feedback.isCorrect
																? "bg-gradient-to-r from-green-100 to-emerald-100"
																: "bg-gradient-to-r from-red-100 to-pink-100"
														}`}
													>
														<div
															className={`flex items-center text-xl font-bold ${
																feedback.isCorrect
																	? "text-green-800"
																	: "text-red-800"
															}`}
														>
															<span className="mr-3 text-2xl">
																{feedback.isCorrect ? "🎉" : "❌"}
															</span>
															<span>
																{feedback.isCorrect
																	? "Excellent work!"
																	: "Not quite right"}
															</span>
														</div>
														{!feedback.isCorrect && (
															<div className="mt-2 font-semibold text-red-700">
																The correct answer is{" "}
																<span className="px-2 py-1 text-red-900 bg-red-200 rounded">
																	{formatNumber(currentQuestion.answer)}
																</span>
															</div>
														)}
													</div>

													{/* Next Question Button */}
													<div className="flex justify-center pt-2">
														<button
															type="button"
															onClick={() => {
																generateQuestion(
																	setHasSubmitted,
																	setCurrentQuestion,
																	setUserAnswer,
																	setFeedback,
																);
																// Focus management - return focus to input after new question loads
																setTimeout(() => {
																	if (inputRef.current) {
																		inputRef.current.focus();
																	}
																}, 100);
															}}
															aria-label="Generate next question"
															className="px-8 py-3 font-semibold text-white transition-all duration-200 transform rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-xl hover:-translate-y-1"
														>
															<span className="mr-2">🎯</span>
															Next Question
														</button>
													</div>

													{/* Explanation Section */}
													<div className="space-y-4">
														<h3 className="flex items-center mb-3 text-lg font-bold text-indigo-900">
															<span className="mr-2">📚</span>
															Step-by-step explanation:
														</h3>
														{feedback.explanation.map(
															(section, sectionIndex) => (
																<div
																	key={section.title}
																	className="p-4 bg-white bg-opacity-50 border border-gray-200 rounded-lg"
																>
																	<h4 className="flex items-center mb-2 text-base font-bold text-indigo-900">
																		<span className="flex items-center justify-center flex-shrink-0 w-6 h-6 mr-3 text-sm font-semibold text-indigo-800 bg-indigo-100 rounded-full">
																			{sectionIndex + 1}
																		</span>
																		{section.title}
																	</h4>
																	<ul className="space-y-1 ml-9">
																		{section.details.map((detail) => (
																			<li
																				key={detail}
																				className="text-gray-800"
																			>
																				<span className="mr-2 text-indigo-600">
																					•
																				</span>
																				{detail}
																			</li>
																		))}
																	</ul>
																</div>
															),
														)}
													</div>
												</div>
											</AlertDescription>
										</Alert>
									</div>
								)}

								<details className="mt-6 group">
									<summary className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 shadow-sm hover:shadow-md list-none [&::-webkit-details-marker]:hidden">
										<span className="flex items-center font-semibold text-blue-800">
											<span className="mr-2 text-lg">💡</span>
											Get calculation help
											<span className="ml-auto transition-transform duration-200 group-open:rotate-180">
												▼
											</span>
										</span>
									</summary>
									<section id={calculationHintId} aria-labelledby={hintTitleId}>
										<h3 id={hintTitleId} className="sr-only">
											Calculation Hint
										</h3>
										<div className="p-4 mt-3 border-l-4 border-blue-400 rounded-r-lg shadow-inner bg-gradient-to-r from-blue-50 to-indigo-50">
											<div className="text-sm font-light text-blue-800">
												{getCalculationHint()}
											</div>
										</div>
									</section>
								</details>
							</section>
						) : (
							<section
								className="py-12 text-center"
								aria-labelledby={welcomeMessageId}
							>
								<div className="p-8 border border-indigo-200 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
									<div className="mb-4 text-6xl">🧮</div>
									<h2
										id={welcomeMessageId}
										className="mb-4 text-2xl font-bold text-transparent md:text-3xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text"
									>
										File Size Calculator
									</h2>
									<p className="max-w-md mx-auto mb-6 text-lg text-gray-600">
										Practice calculating file sizes for images, sounds, and text
										files. Master the fundamentals of digital storage!
									</p>
									<button
										type="button"
										onClick={() => {
											generateQuestion(
												setHasSubmitted,
												setCurrentQuestion,
												setUserAnswer,
												setFeedback,
											);
										}}
										className="px-8 py-3 font-semibold text-white transition-all duration-200 transform rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl hover:-translate-y-1"
									>
										<span className="mr-2">🚀</span>
										Start Practicing
									</button>
								</div>
							</section>
						)}
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
