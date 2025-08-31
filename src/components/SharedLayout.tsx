import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { QuizButton, ScoreButton, SiteLayout, StatsModal } from "@/components";
import { ScoreManager } from "@/lib/scoreManager";
import { SITE_CONFIG } from "@/lib/siteConfig";

interface SharedLayoutProps {
	children: (
		recordScoreAndUpdate: (isCorrect: boolean, questionType: string) => void,
	) => React.ReactNode;
}

// Mode button data
const MODES = [
	{ label: "Converting Units", path: "/unitconvertor" },
	{ label: "Capacity Calculator", path: "/capacitycalculator" },
	{ label: "File Size Calculator", path: "/filesize" },
];

export function useSharedLayout() {
	const [showStatsModal, setShowStatsModal] = useState(false);
	// Score update trigger to force re-renders when score changes
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_scoreUpdateTrigger, setScoreUpdateTrigger] = useState(0);

	const siteConfig = SITE_CONFIG;

	// Score manager
	const [scoreManager] = useState(
		() => new ScoreManager(siteConfig.siteKey, siteConfig.scoring.customLevels),
	);

	const overallStats = scoreManager.getOverallStats();

	// Function to record score and trigger re-render
	const recordScoreAndUpdate = (isCorrect: boolean, questionType: string) => {
		scoreManager.recordScore(isCorrect, questionType);
		setScoreUpdateTrigger((prev) => prev + 1);
	};

	return {
		showStatsModal,
		setShowStatsModal,
		siteConfig,
		scoreManager,
		overallStats,
		recordScoreAndUpdate,
	};
}

export function SharedLayout({ children }: SharedLayoutProps) {
	const {
		showStatsModal,
		setShowStatsModal,
		siteConfig,
		scoreManager,
		overallStats,
		recordScoreAndUpdate,
	} = useSharedLayout();
	const location = useLocation();

	return (
		<SiteLayout
			title={siteConfig.title}
			subtitle={siteConfig.subtitle}
			titleIcon={siteConfig.icon}
			scoreButton={
				<ScoreButton
					levelEmoji={overallStats.level.emoji}
					levelTitle={overallStats.level.title}
					points={overallStats.totalPoints}
					onClick={() => setShowStatsModal(true)}
				/>
			}
		>
			{/* Mode Switch Buttons */}
			<div className="flex justify-center gap-4 mt-2 mb-8">
				{MODES.map((mode) => (
					<Link key={mode.path} to={mode.path}>
						<QuizButton
							variant="menu"
							className={
								location.pathname === mode.path
									? "text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-lg"
									: ""
							}
						>
							{mode.label}
						</QuizButton>
					</Link>
				))}
			</div>
			{/* Main Body */}
			<div className="max-w-4xl mx-auto">{children(recordScoreAndUpdate)}</div>
			<StatsModal
				isOpen={showStatsModal}
				onClose={() => setShowStatsModal(false)}
				scoreManager={scoreManager}
				title="Your Network Mastery"
			/>
		</SiteLayout>
	);
}
