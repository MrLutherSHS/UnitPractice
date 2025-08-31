import { Link, useLocation } from "@tanstack/react-router";
import { QuizButton } from "./QuizButton";

// Mode button data
const MODES = [
	{ label: "Units", path: "/unitconverter" },
	{ label: "Capacity", path: "/capacitycalculator" },
	{ label: "File Size", path: "/filesize" },
];

export const ModeMenu = () => {
	const location = useLocation();

	return (
		<div className="flex flex-row justify-center gap-2 px-4 mt-2 mb-4 sm:gap-4">
			{MODES.map((mode) => (
				<Link key={mode.path} to={mode.path} className="flex-1 sm:flex-none">
					<QuizButton
						variant="menu"
						className={`w-full sm:w-auto text-sm sm:text-base px-3 sm:px-6 py-3 sm:py-6 ${
							location.pathname === mode.path
								? "text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-lg"
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
