import { ArrowRight } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
	type ExplanationSection,
	formatNumber,
	roundToPrecision,
} from "@/lib/numberUtils";
import { useQuizInteraction } from "@/lib/quizHooks";

interface Question {
	category: "Converting Units";
	finalValue: number;
	fromUnit: string;
	toUnit: string;
	answer: number;
	explanation: ExplanationSection[];
}

const ConversionPathVisual = ({
	fromUnit,
	toUnit,
}: {
	fromUnit: string;
	toUnit: string;
}) => {
	const path = getConversionPath(fromUnit, toUnit);

	return (
		<div className="flex flex-wrap items-center gap-2 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-inner">
			{path.map((unit, index) => (
				<span key={unit}>
					<div
						className={`px-3 py-1 rounded-md shadow-sm ${getUnitColor(unit)}`}
					>
						{unit}
					</div>
					{index < path.length - 1 && (
						<ArrowRight className="h-4 w-4 text-indigo-400" />
					)}
				</span>
			))}
		</div>
	);
};

// Utility constants and functions moved outside component
const units = [
	"bits",
	"bytes",
	"kilobytes",
	"megabytes",
	"gigabytes",
	"terabytes",
	"petabytes",
];

const getUnitColor = (unit: string): string => {
	const colors: Record<string, string> = {
		bits: "bg-purple-100 text-purple-900",
		bytes: "bg-blue-100 text-blue-900",
		kilobytes: "bg-cyan-100 text-cyan-900",
		megabytes: "bg-teal-100 text-teal-900",
		gigabytes: "bg-green-100 text-green-900",
		terabytes: "bg-amber-100 text-amber-900",
		petabytes: "bg-orange-100 text-orange-900",
	};
	return colors[unit] || "bg-gray-100";
};

const getConversionPath = (fromUnit: string, toUnit: string): string[] => {
	const fromIndex = units.indexOf(fromUnit as (typeof units)[number]);
	const toIndex = units.indexOf(toUnit as (typeof units)[number]);
	const path: string[] = [];

	if (fromUnit === "bits" && toUnit !== "bits") {
		path.push("bits", "bytes");
		let currentIndex = 1;
		while (currentIndex < toIndex) {
			path.push(units[currentIndex + 1]);
			currentIndex++;
		}
	} else if (toUnit === "bits" && fromUnit !== "bits") {
		let currentIndex = fromIndex;
		while (currentIndex > 1) {
			path.push(units[currentIndex]);
			currentIndex--;
		}
		path.push("bytes", "bits");
	} else {
		const step = fromIndex < toIndex ? 1 : -1;
		for (let i = fromIndex; i !== toIndex + step; i += step) {
			path.push(units[i]);
		}
	}

	return path;
};

const getStepsBetweenUnits = (fromUnit: string, toUnit: string): number => {
	const fromIndex = units.indexOf(fromUnit as (typeof units)[number]);
	const toIndex = units.indexOf(toUnit as (typeof units)[number]);
	return Math.abs(toIndex - fromIndex);
};

const getMultiplier = (unit: string): number => {
	const multipliers: Record<string, number> = {
		bytes: 1,
		kilobytes: 1000,
		megabytes: 1000000,
		gigabytes: 1000000000,
		terabytes: 1000000000000,
		petabytes: 1000000000000000,
	};
	return multipliers[unit];
};

const calculateAnswer = (value: number, fromUnit: string, toUnit: string) => {
	let valueInBytes: number;
	if (fromUnit === "bits") {
		valueInBytes = value / 8;
	} else {
		valueInBytes = value * getMultiplier(fromUnit);
	}

	if (toUnit === "bits") {
		return valueInBytes * 8;
	} else {
		return valueInBytes / getMultiplier(toUnit);
	}
};

const generateExplanation = (
	value: number,
	fromUnit: string,
	toUnit: string,
): ExplanationSection[] => {
	const fromIndex = units.indexOf(fromUnit as (typeof units)[number]);
	const toIndex = units.indexOf(toUnit as (typeof units)[number]);
	const explanation: ExplanationSection[] = [];

	// Add identification step
	explanation.push({
		title: "Identify the conversion",
		details: [
			`Starting value: ${formatNumber(value)} ${fromUnit}`,
			`Target unit: ${toUnit}`,
		],
	});

	const steps: string[] = [];
	let workingFromIndex = fromIndex;
	let workingValue = value;

	if (workingFromIndex < toIndex) {
		while (workingFromIndex < toIndex) {
			let step = `Convert ${formatNumber(workingValue)} ${units[workingFromIndex]} to ${units[workingFromIndex + 1]}`;
			// Bits to bytes - divide by 8, otherwise divide by 1000
			if (workingFromIndex === 0) {
				workingValue = roundToPrecision(workingValue / 8);
				step += ` → ${formatNumber(workingValue * 8)} ÷ 8 = ${formatNumber(workingValue)} ${units[workingFromIndex + 1]}`;
			} else {
				workingValue = roundToPrecision(workingValue / 1000);
				step += ` → ${formatNumber(workingValue * 1000)} ÷ 1,000 = ${formatNumber(workingValue)} ${units[workingFromIndex + 1]}`;
			}
			steps.push(step);
			workingFromIndex++;
		}
	} else {
		while (workingFromIndex > toIndex) {
			let step = `Convert ${formatNumber(workingValue)} ${units[workingFromIndex]} to ${units[workingFromIndex - 1]}`;
			// Bytes to bits - multiply by 8, otherwise multiply by 1000
			if (workingFromIndex === 1) {
				workingValue = roundToPrecision(workingValue * 8);
				step += ` → ${formatNumber(workingValue / 8)} × 8 = ${formatNumber(workingValue)} ${units[workingFromIndex - 1]}`;
			} else {
				workingValue = roundToPrecision(workingValue * 1000);
				step += ` → ${formatNumber(workingValue / 1000)} × 1,000 = ${formatNumber(workingValue)} ${units[workingFromIndex - 1]}`;
			}
			steps.push(step);
			workingFromIndex--;
		}
	}

	explanation.push({
		title: "Step-by-step conversion",
		details: steps,
	});

	return explanation;
};

// Main question generator function
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
	isAdvancedMode: boolean = false,
): void => {
	setHasSubmitted(false);
	let fromUnit: string, toUnit: string;
	const maxSteps = isAdvancedMode ? 3 : 1;

	do {
		fromUnit = units[Math.floor(Math.random() * (units.length - 1))];
		toUnit = units[Math.floor(Math.random() * units.length)];
	} while (
		fromUnit === toUnit ||
		getStepsBetweenUnits(fromUnit, toUnit) > maxSteps
	);

	// Max value for bits and bytes is 300 - simpler maths for students when */ 8
	const ceiling = fromUnit === "bits" || fromUnit === "bytes" ? 300 : 999;

	const stepCount = getStepsBetweenUnits(fromUnit, toUnit);
	const maxValue = Math.max(10, Math.floor(ceiling / stepCount));
	const initValue = Math.floor(Math.random() * maxValue) + 1;
	// I want to make sure the value is a multiple of 8 if converting from bits
	const finalValue =
		fromUnit === "bits" ? Math.ceil(initValue / 8) * 8 : initValue;

	const answer = calculateAnswer(finalValue, fromUnit, toUnit);

	const newQuestion: Question = {
		category: "Converting Units",
		finalValue,
		fromUnit,
		toUnit,
		answer,
		explanation: generateExplanation(finalValue, fromUnit, toUnit),
	};

	setCurrentQuestion(newQuestion);
	setUserAnswer("");
	setFeedback(null);
};

interface UnitConvertorProps {
	onScoreUpdate: (isCorrect: boolean, questionType: string) => void;
}

export function UnitConvertor({ onScoreUpdate }: UnitConvertorProps) {
	const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
	const [userAnswer, setUserAnswer] = useState<string>("");
	const [feedback, setFeedback] = useState<{
		isCorrect: boolean;
		message: string;
		explanation: ExplanationSection[];
	} | null>(null);
	const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
	const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);
	const [showUnitsOrder, setShowUnitsOrder] = useState<boolean>(false);
	const [showConversionPath, setShowConversionPath] = useState<boolean>(false);

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
	const convertorTitleId = useId();
	const currentQuestionId = useId();
	const answerInputId = useId();
	const calculationHintId = useId();
	const conversionHintId = useId();
	const hintTitleId = useId();
	const conversionHintTitleId = useId();
	const feedbackMessageId = useId();
	const welcomeMessageId = useId();

	useEffect(() => {
		generateQuestion(
			setHasSubmitted,
			setCurrentQuestion,
			setUserAnswer,
			setFeedback,
			isAdvancedMode,
		);
	}, [isAdvancedMode]); // Safe empty dependency - generateQuestion is pure and state setters are stable

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
						isAdvancedMode,
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
	}, [hasSubmitted, currentQuestion, isAdvancedMode]);

	const getQuestionText = (question: Question): string => {
		return `Convert ${formatNumber(question.finalValue)} ${question.fromUnit} to ${question.toUnit}`;
	};

	return (
		<main className="w-full" aria-labelledby={convertorTitleId}>
			<h1 id={convertorTitleId} className="sr-only">
				Unit Convertor
			</h1>
			<div className="p-4">
				<Card className="mx-auto shadow-xl py-0 bg-white/80 backdrop-blur">
					<CardContent className="space-y-6 p-8">
						{/* Live region for screen reader announcements */}
						<div aria-live="polite" aria-atomic="true" className="sr-only">
							{feedback?.message}
						</div>

						{/* Settings Section */}
						<div className="mb-6">
							<div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200">
								<div className="flex items-center justify-between gap-4">
									{/* Units Order Hint */}
									<div className="flex items-center gap-2">
										<span className="text-lg">📋</span>
										<span className="font-semibold text-gray-800 text-sm whitespace-nowrap">
											Units Order
										</span>
										<Switch
											checked={showUnitsOrder}
											onCheckedChange={setShowUnitsOrder}
											className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-blue-600"
										/>
									</div>

									{/* Conversion Path Hint */}
									<div className="flex items-center gap-2">
										<span className="text-lg">🗺️</span>
										<span className="font-semibold text-gray-800 text-sm whitespace-nowrap">
											Conversion Path
										</span>
										<Switch
											checked={showConversionPath}
											onCheckedChange={setShowConversionPath}
											className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-blue-600"
										/>
									</div>

									{/* Advanced Mode */}
									<div className="flex items-center gap-2">
										<span className="text-lg">⚙️</span>
										<span className="font-semibold text-gray-800 text-sm whitespace-nowrap">
											Advanced Mode
										</span>
										<Switch
											checked={isAdvancedMode}
											onCheckedChange={(checked) => {
												setIsAdvancedMode(checked);
												// Generate new question with the new mode
												generateQuestion(
													setHasSubmitted,
													setCurrentQuestion,
													setUserAnswer,
													setFeedback,
													checked,
												);
											}}
											className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-blue-600"
										/>
									</div>
								</div>
							</div>
						</div>

						{currentQuestion ? (
							<section aria-labelledby={currentQuestionId}>
								<h2
									id={currentQuestionId}
									className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg shadow"
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
											aria-describedby={`${calculationHintId} ${conversionHintId}`}
											aria-invalid={
												feedback && !feedback.isCorrect ? "true" : "false"
											}
											className="text-2xl p-6 text-center font-bold border-2 border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 rounded-xl shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-indigo-50"
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
												<div className="space-y-4 w-full">
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
															<span className="text-2xl mr-3">
																{feedback.isCorrect ? "🎉" : "❌"}
															</span>
															<span>
																{feedback.isCorrect
																	? "Excellent work!"
																	: "Not quite right"}
															</span>
														</div>
														{!feedback.isCorrect && (
															<div className="mt-2 text-red-700 font-semibold">
																The correct answer is{" "}
																<span className="text-red-900 bg-red-200 px-2 py-1 rounded">
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
																	isAdvancedMode,
																);
																// Focus management - return focus to input after new question loads
																setTimeout(() => {
																	if (inputRef.current) {
																		inputRef.current.focus();
																	}
																}, 100);
															}}
															aria-label="Generate next question"
															className="px-8 py-3 font-semibold rounded-lg transition-all duration-200 shadow-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:shadow-xl transform hover:-translate-y-1"
														>
															<span className="mr-2">🎯</span>
															Next Question
														</button>
													</div>

													{/* Explanation Section */}
													<div className="space-y-4">
														<h3 className="font-bold text-indigo-900 text-lg mb-3 flex items-center">
															<span className="mr-2">📚</span>
															Step-by-step explanation:
														</h3>
														{feedback.explanation.map(
															(section, sectionIndex) => (
																<div
																	key={section.title}
																	className="bg-white bg-opacity-50 p-4 rounded-lg border border-gray-200"
																>
																	<h4 className="font-bold text-indigo-900 text-base mb-2 flex items-center">
																		<span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0">
																			{sectionIndex + 1}
																		</span>
																		{section.title}
																	</h4>
																	<ul className="ml-9 space-y-1">
																		{section.details.map((detail) => (
																			<li
																				key={detail}
																				className="text-gray-800"
																			>
																				<span className="text-indigo-600 mr-2">
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

								{/* First Hint Section - Units Order */}
								{showUnitsOrder && (
									<section
										id={calculationHintId}
										aria-labelledby={hintTitleId}
										className="mt-6"
									>
										<h3
											id={hintTitleId}
											className="text-blue-800 font-semibold flex items-center mb-3"
										>
											<span className="mr-2 text-lg">�</span>
											Units in order (smallest to largest)
										</h3>
										<div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-purple-400 rounded-r-lg shadow-inner">
											<div className="flex flex-wrap items-center gap-2">
												{units.map((unit, index) => (
													<span key={unit}>
														<span
															className={`px-2 py-1 rounded text-sm ${getUnitColor(unit)}`}
														>
															{unit}
														</span>
														{index < units.length - 1 && (
															<ArrowRight className="h-4 w-4 text-purple-400" />
														)}
													</span>
												))}
											</div>
										</div>
									</section>
								)}

								{/* Second Hint Section - Conversion Path */}
								{showConversionPath && (
									<section
										id={conversionHintId}
										aria-labelledby={conversionHintTitleId}
										className="mt-6"
									>
										<h3
											id={conversionHintTitleId}
											className="text-purple-800 font-semibold flex items-center mb-3"
										>
											<span className="mr-2 text-lg">🗺️</span>
											Path for this conversion
										</h3>
										<div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-400 rounded-r-lg shadow-inner">
											<ConversionPathVisual
												fromUnit={currentQuestion.fromUnit}
												toUnit={currentQuestion.toUnit}
											/>
										</div>
									</section>
								)}
							</section>
						) : (
							<section
								className="text-center py-12"
								aria-labelledby={welcomeMessageId}
							>
								<div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-xl border border-indigo-200 shadow-lg">
									<div className="text-6xl mb-4">🔄</div>
									<h2
										id={welcomeMessageId}
										className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4"
									>
										Unit Convertor
									</h2>
									<p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
										Practice converting between different units of digital
										storage. Master bits, bytes, kilobytes, and beyond!
									</p>
									<button
										type="button"
										onClick={() => {
											generateQuestion(
												setHasSubmitted,
												setCurrentQuestion,
												setUserAnswer,
												setFeedback,
												isAdvancedMode,
											);
										}}
										className="px-8 py-3 font-semibold rounded-lg transition-all duration-200 shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white hover:shadow-xl transform hover:-translate-y-1"
									>
										<span className="mr-2">🚀</span>
										Start Converting
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
