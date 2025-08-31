import type { HintItem } from "@/components/HintPanel";
import type { LevelInfo } from "@/lib/scoreManager";

/** Configuration interface for GCSE CS practice sites */
export interface SiteConfig {
	/** Unique site identifier for score tracking */
	siteKey: string;
	/** Site title displayed in header */
	title: string;
	/** Site subtitle/description */
	subtitle: string;
	/** Site icon/emoji */
	icon: string;
	/** Scoring configuration */
	scoring: ScoringConfig;
	/** Site-specific hint content for help sections */
	hints?: HintItem[];
}

export interface ScoringConfig {
	/** Custom level system (optional, falls back to duck levels) */
	customLevels?: LevelInfo[];
}

export interface Level {
	emoji: string;
	title: string;
	description: string;
	minPoints: number;
	minAccuracy: number;
}

/** Network Address Practice site configuration */
export const SITE_CONFIG: SiteConfig = {
	siteKey: "data-units",
	title: "Data Units",
	subtitle: "Master the conversion of data units & file sizes",
	icon: "🦆",
	scoring: {
		customLevels: [
			{
				emoji: "🥚",
				title: "Byte Beginner",
				description: "Just cracked into the world of storage!",
				minPoints: 0,
				minAccuracy: 0,
			},
			{
				emoji: "🐣",
				title: "Kilobyte Chick",
				description: "Taking your first waddle through file sizes!",
				minPoints: 5,
				minAccuracy: 0,
			},
			{
				emoji: "🐤",
				title: "Megabyte Mallard",
				description: "Your storage calculations are really taking flight!",
				minPoints: 12,
				minAccuracy: 60,
			},
			{
				emoji: "🦆",
				title: "Gigabyte Goose",
				description: "Swimming smoothly through unit conversions!",
				minPoints: 25,
				minAccuracy: 70,
			},
			{
				emoji: "🦆✨",
				title: "Terabyte Teal",
				description: "Soaring through storage with byte-sized brilliance!",
				minPoints: 50,
				minAccuracy: 80,
			},
			{
				emoji: "🪿👑",
				title: "Petabyte Pond Emperor",
				description:
					"The legendary storage sage - no file size can ruffle your feathers!",
				minPoints: 75,
				minAccuracy: 90,
			},
		],
	},
	hints: [
		{
			title: "IPv4",
			description: "4 decimal numbers (0-255) separated by dots",
			examples: ["Example: 192.168.1.1"],
			color: "blue",
		},
		{
			title: "IPv6",
			description:
				"8 groups of 4 hex digits separated by colons. Groups can be empty or compressed.",
			examples: [
				"Example: 2001:0db8:85a3:0000:0000:8a2e:0370:7334",
				"Compressed: 2001:db8::8a2e:370:7334",
			],
			color: "purple",
		},
		{
			title: "MAC",
			description: "6 pairs of hex digits separated by colons or dashes",
			examples: ["Example: 00:1A:2B:3C:4D:5E or 00-1A-2B-3C-4D-5E"],
			color: "green",
		},
	],
};
