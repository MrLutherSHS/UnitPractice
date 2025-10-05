import { Link, useLocation } from "@tanstack/react-router";
import { QuizButton } from "./QuizButton";

type QuizMode = {
  label: string;
  path: string;
  emoji: string;
};

// Mode button data
const QUIZ_MODES: QuizMode[] = [
	{ label: "Units", path: "/unitconverter", emoji: "" },
	{ label: "Capacity", path: "/capacitycalculator", emoji: "" },
	{ label: "File Size", path: "/filesize", emoji: "" },
	{ label: "Multiple Choice", path: "/multiplechoice", emoji: "" },
];


export const ModeMenu = () => {
	const location = useLocation();

	return (
		<div className="flex flex-row justify-center gap-2 px-4 mt-2 mb-4 sm:gap-4">
			{QUIZ_MODES.map((mode) => (
				<Link key={mode.path} to={mode.path} className="flex-1 sm:flex-none">
					<QuizButton
						variant="menu"
						className={`w-full sm:w-auto text-sm sm:text-base p-3 sm:p-6 ${
							location.pathname === mode.path
								? "text-action-button-text bg-action-button-bg hover:bg-action-button-bg-hover hover:shadow-lg"
								: ""
						}`}
					>
						{mode.emoji} {mode.label}
					</QuizButton>
				</Link>
			))}
		</div>
	);
};
