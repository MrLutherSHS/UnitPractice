import { Check, X } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const FeedbackBox = ({
	feedback,
}: {
	feedback: { isCorrect: boolean; message: string; explanation: string[] };
}) => {
	return (
		<Alert
			className={`p-6 ${
				feedback.isCorrect
					? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
					: "bg-gradient-to-r from-red-50 to-pink-50 border-red-200"
			}`}
		>
			<div className="flex items-center justify-center gap-3">
				{feedback.isCorrect ? (
					<Check className="w-6 h-6 mt-1 text-green-600" />
				) : (
					<X className="w-6 h-6 mt-1 text-red-600" />
				)}
				<AlertDescription className="text-xl">
					<div
						className={feedback.isCorrect ? "text-green-700" : "text-red-700"}
					>
						{feedback.message}
					</div>
					{!feedback.isCorrect && (
						<div className="mt-4 text-gray-700">
							<div className="text-xl font-semibold text-blue-900">
								Here's how to solve it:
							</div>
							{feedback.explanation.map((step, index) => (
								<div key={index} className="mt-2 ml-4 text-lg text-blue-700">
									{step}
								</div>
							))}
						</div>
					)}
				</AlertDescription>
			</div>
		</Alert>
	);
};

export const AnswerForm = ({
	handleSubmit,
	userAnswer,
	generateQuestion,
	handleAnswerChange,
	hasSubmitted,
	type,
}: {
	handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	userAnswer: string | number;
	generateQuestion: () => void;
	handleAnswerChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	hasSubmitted: boolean;
	type: string;
}) => {
	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col items-center md:flex-row gap-4"
		>
			<Input
				type={type}
				step="any"
				value={userAnswer}
				onChange={handleAnswerChange}
				placeholder="Enter your answer"
				className="flex-1 p-4 border-2 border-blue-200 rounded-lg h-14 focus:border-blue-500 "
			/>
			{hasSubmitted ? (
				<NewQuestionButton generateQuestion={generateQuestion} />
			) : (
				<Button
					type="submit"
					className="w-full text-xl font-semibold text-white bg-blue-600 h-14 md:w-64 md:text-2xl hover:bg-blue-700"
				>
					Check
				</Button>
			)}
		</form>
	);
};

export const ScoreBox = ({
	score,
}: {
	score: { correct: number; total: number };
}) => {
	return (
		<div className="p-2 mb-6 text-lg rounded-lg md:text-2xl bg-gradient-to-r from-indigo-100 to-purple-100 md:p-4">
			<span className="font-semibold">Score:</span> {score.correct}/
			{score.total}
			<span className="ml-2 text-indigo-600">
				({score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}
				%)
			</span>
		</div>
	);
};

export const NewQuestionButton = ({
	generateQuestion,
}: {
	generateQuestion: () => void;
}) => {
	return (
		<Button
			onClick={generateQuestion}
			className="w-full text-xl font-semibold text-white bg-blue-600 h-14 md:w-64 md:text-2xl hover:bg-blue-700"
		>
			New Question
		</Button>
	);
};
