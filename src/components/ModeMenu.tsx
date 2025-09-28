import { Link, useLocation } from "@tanstack/react-router";
import { QuizButton } from "./QuizButton";

// Mode button data
const MODES = [
	{ label: "Units", path: "/unitconverter" },
	{ label: "Capacity", path: "/capacitycalculator" },
	{ label: "File Size", path: "/filesize" },
	{ label: "Multiple Choice", path: "/multiplechoice" },
];

export const ModeMenu = () => {
	const location = useLocation();

	return (
		<div className="flex flex-row justify-center px-4 mt-2 mb-4 gap-2 sm:gap-4">
			{MODES.map((mode) => (
				<Link key={mode.path} to={mode.path} className="flex-1 sm:flex-none">
					<QuizButton
						variant="menu"
						className={`w-full sm:w-auto text-sm sm:text-base p-3 sm:p-6 ${
							location.pathname === mode.path
								? "text-white bg-green-600  hover:bg-green-700 hover:shadow-lg"
								: ""
						}`}
					>
						{mode.label}
					</QuizButton>
				</Link>
			))}
		</div>
	);
};
