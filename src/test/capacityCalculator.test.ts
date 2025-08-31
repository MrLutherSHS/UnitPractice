import { describe, expect, it } from "vitest";

// Extract the conversion functions from CapacityCalculator.tsx for testing

// Convert value from one unit to another
const convertValue = (
	value: number,
	fromUnit: string,
	toUnit: string,
): number => {
	const unitValues: { [key: string]: number } = {
		bytes: 0,
		kilobytes: 1,
		megabytes: 2,
		gigabytes: 3,
		terabytes: 4,
	};

	const difference = unitValues[fromUnit] - unitValues[toUnit];
	return value * 1000 ** difference;
};

// Calculate how many files can fit on a drive
const calculateFileCount = (
	driveSize: number,
	driveUnit: string,
	fileSize: number,
	fileUnit: string,
): number => {
	const driveInFileUnits = convertValue(driveSize, driveUnit, fileUnit);
	return Math.floor(driveInFileUnits / fileSize);
};

// Calculate total capacity needed for a number of files
const calculateTotalCapacity = (
	fileCount: number,
	fileSize: number,
	fileUnit: string,
	targetUnit: string,
): number => {
	const totalInFileUnits = fileCount * fileSize;
	return convertValue(totalInFileUnits, fileUnit, targetUnit);
};

// Helper function to get the correct unit form (singular/plural)
const getUnitText = (value: number, unit: string): string => {
	if (value === 1) {
		return unit.replace(/s$/, ""); // Remove 's' for singular
	}
	return unit; // Keep plural form
};

// Helper function to get unit in singular form for use as adjectives
const getAdjectiveUnitText = (unit: string): string => {
	return unit.replace(/s$/, ""); // Always singular when used as adjective
};

describe("Capacity Calculator Functions", () => {
	describe("convertValue", () => {
		it("should convert between adjacent units (up)", () => {
			expect(convertValue(1000, "bytes", "kilobytes")).toBe(1);
			expect(convertValue(1000, "kilobytes", "megabytes")).toBe(1);
			expect(convertValue(1000, "megabytes", "gigabytes")).toBe(1);
			expect(convertValue(1000, "gigabytes", "terabytes")).toBe(1);
		});

		it("should convert between adjacent units (down)", () => {
			expect(convertValue(1, "kilobytes", "bytes")).toBe(1000);
			expect(convertValue(1, "megabytes", "kilobytes")).toBe(1000);
			expect(convertValue(1, "gigabytes", "megabytes")).toBe(1000);
			expect(convertValue(1, "terabytes", "gigabytes")).toBe(1000);
		});

		it("should convert across multiple unit levels", () => {
			expect(convertValue(1, "megabytes", "bytes")).toBe(1000000);
			expect(convertValue(1, "gigabytes", "kilobytes")).toBe(1000000);
			expect(convertValue(1, "terabytes", "megabytes")).toBe(1000000);
			expect(convertValue(1000000, "bytes", "megabytes")).toBe(1);
			expect(convertValue(1000000, "kilobytes", "gigabytes")).toBe(1);
		});

		it("should handle same unit conversion", () => {
			expect(convertValue(500, "megabytes", "megabytes")).toBe(500);
			expect(convertValue(1.5, "gigabytes", "gigabytes")).toBe(1.5);
			expect(convertValue(0, "kilobytes", "kilobytes")).toBe(0);
		});

		it("should handle decimal values", () => {
			expect(convertValue(1.5, "megabytes", "kilobytes")).toBe(1500);
			expect(convertValue(2.5, "gigabytes", "megabytes")).toBe(2500);
			expect(convertValue(500, "kilobytes", "megabytes")).toBe(0.5);
		});

		it("should handle zero values", () => {
			expect(convertValue(0, "megabytes", "kilobytes")).toBe(0);
			expect(convertValue(0, "bytes", "gigabytes")).toBe(0);
		});

		it("should handle large conversions", () => {
			expect(convertValue(1, "terabytes", "bytes")).toBe(1000000000000);
			expect(convertValue(1000000000000, "bytes", "terabytes")).toBe(1);
		});
	});

	describe("calculateFileCount", () => {
		it("should calculate how many files fit on a drive (same units)", () => {
			expect(calculateFileCount(1000, "megabytes", 100, "megabytes")).toBe(10);
			expect(calculateFileCount(500, "gigabytes", 50, "gigabytes")).toBe(10);
			expect(calculateFileCount(2, "terabytes", 500, "gigabytes")).toBe(4); // 2TB = 2000GB, 2000/500 = 4
		});

		it("should calculate across different units", () => {
			expect(calculateFileCount(1, "gigabytes", 100, "megabytes")).toBe(10); // 1GB = 1000MB, 1000/100 = 10
			expect(calculateFileCount(2, "gigabytes", 500, "megabytes")).toBe(4); // 2GB = 2000MB, 2000/500 = 4
			expect(calculateFileCount(1000, "megabytes", 1, "gigabytes")).toBe(1); // 1000MB = 1GB, 1/1 = 1
		});

		it("should handle cases where files don't fit evenly", () => {
			expect(calculateFileCount(1000, "megabytes", 300, "megabytes")).toBe(3); // 1000/300 = 3.33, floored to 3
			expect(calculateFileCount(1, "gigabytes", 300, "megabytes")).toBe(3); // 1000/300 = 3.33, floored to 3
			expect(calculateFileCount(500, "megabytes", 600, "megabytes")).toBe(0); // 500/600 = 0.83, floored to 0
		});

		it("should handle exact fits", () => {
			expect(calculateFileCount(1000, "megabytes", 250, "megabytes")).toBe(4); // Exactly 4 files
			expect(calculateFileCount(2, "gigabytes", 500, "megabytes")).toBe(4); // Exactly 4 files
		});

		it("should handle small drives and large files", () => {
			expect(calculateFileCount(500, "megabytes", 1, "gigabytes")).toBe(0); // 500MB < 1GB, so 0 files fit
			expect(calculateFileCount(1, "gigabytes", 2, "gigabytes")).toBe(0); // 1GB < 2GB, so 0 files fit
		});

		it("should handle zero values", () => {
			expect(calculateFileCount(0, "megabytes", 100, "megabytes")).toBe(0);
			// Note: dividing by zero file size would be undefined in real scenarios, so we don't test that
		});
	});

	describe("calculateTotalCapacity", () => {
		it("should calculate total capacity for files (same units)", () => {
			expect(calculateTotalCapacity(10, 100, "megabytes", "megabytes")).toBe(
				1000,
			);
			expect(calculateTotalCapacity(5, 200, "gigabytes", "gigabytes")).toBe(
				1000,
			);
		});

		it("should calculate total capacity across different units", () => {
			expect(calculateTotalCapacity(10, 100, "megabytes", "gigabytes")).toBe(1); // 10 * 100MB = 1000MB = 1GB
			expect(calculateTotalCapacity(5, 200, "megabytes", "gigabytes")).toBe(1); // 5 * 200MB = 1000MB = 1GB
			expect(calculateTotalCapacity(2, 500, "gigabytes", "terabytes")).toBe(1); // 2 * 500GB = 1000GB = 1TB
		});

		it("should handle converting to smaller units", () => {
			expect(calculateTotalCapacity(2, 1, "gigabytes", "megabytes")).toBe(2000); // 2 * 1GB = 2GB = 2000MB
			expect(calculateTotalCapacity(3, 500, "megabytes", "kilobytes")).toBe(
				1500000,
			); // 3 * 500MB = 1500MB = 1,500,000KB
		});

		it("should handle decimal results", () => {
			expect(calculateTotalCapacity(5, 100, "megabytes", "gigabytes")).toBe(
				0.5,
			); // 5 * 100MB = 500MB = 0.5GB
			expect(calculateTotalCapacity(3, 250, "gigabytes", "terabytes")).toBe(
				0.75,
			); // 3 * 250GB = 750GB = 0.75TB
		});

		it("should handle zero files", () => {
			expect(calculateTotalCapacity(0, 100, "megabytes", "gigabytes")).toBe(0);
		});

		it("should handle zero file size", () => {
			expect(calculateTotalCapacity(10, 0, "megabytes", "gigabytes")).toBe(0);
		});

		it("should handle large numbers of files", () => {
			expect(calculateTotalCapacity(1000, 1, "megabytes", "gigabytes")).toBe(1); // 1000 * 1MB = 1000MB = 1GB
			expect(calculateTotalCapacity(10000, 100, "kilobytes", "gigabytes")).toBe(
				1,
			); // 10000 * 100KB = 1,000,000KB = 1GB
		});
	});

	describe("getUnitText", () => {
		it("should return singular form for value of 1", () => {
			expect(getUnitText(1, "megabytes")).toBe("megabyte");
			expect(getUnitText(1, "gigabytes")).toBe("gigabyte");
			expect(getUnitText(1, "kilobytes")).toBe("kilobyte");
			expect(getUnitText(1, "bytes")).toBe("byte");
			expect(getUnitText(1, "terabytes")).toBe("terabyte");
		});

		it("should return plural form for values other than 1", () => {
			expect(getUnitText(0, "megabytes")).toBe("megabytes");
			expect(getUnitText(2, "gigabytes")).toBe("gigabytes");
			expect(getUnitText(100, "kilobytes")).toBe("kilobytes");
			expect(getUnitText(0.5, "bytes")).toBe("bytes");
			expect(getUnitText(1.5, "terabytes")).toBe("terabytes");
		});

		it("should handle decimal values", () => {
			expect(getUnitText(1.1, "megabytes")).toBe("megabytes");
			expect(getUnitText(0.9, "gigabytes")).toBe("gigabytes");
		});

		it("should handle units that don't end in 's'", () => {
			expect(getUnitText(1, "data")).toBe("data"); // Doesn't end in 's', so no change
			expect(getUnitText(2, "data")).toBe("data");
		});
	});

	describe("getAdjectiveUnitText", () => {
		it("should always return singular form for use as adjectives", () => {
			expect(getAdjectiveUnitText("megabytes")).toBe("megabyte");
			expect(getAdjectiveUnitText("gigabytes")).toBe("gigabyte");
			expect(getAdjectiveUnitText("kilobytes")).toBe("kilobyte");
			expect(getAdjectiveUnitText("bytes")).toBe("byte");
			expect(getAdjectiveUnitText("terabytes")).toBe("terabyte");
		});

		it("should handle units that don't end in 's'", () => {
			expect(getAdjectiveUnitText("data")).toBe("data");
		});
	});

	describe("Integration tests - Real world scenarios", () => {
		it("should handle typical USB drive scenario", () => {
			// 8GB USB drive, storing 2MB photos
			const fileCount = calculateFileCount(8, "gigabytes", 2, "megabytes");
			expect(fileCount).toBe(4000); // 8GB = 8000MB, 8000/2 = 4000 photos
		});

		it("should handle hard drive scenario", () => {
			// 1TB hard drive, storing 500MB video files
			const fileCount = calculateFileCount(1, "terabytes", 500, "megabytes");
			expect(fileCount).toBe(2000); // 1TB = 1,000,000MB, 1,000,000/500 = 2000 videos
		});

		it("should handle capacity planning scenario", () => {
			// Need to store 100 documents of 250KB each, what capacity is needed in MB?
			const capacity = calculateTotalCapacity(
				100,
				250,
				"kilobytes",
				"megabytes",
			);
			expect(capacity).toBe(25); // 100 * 250KB = 25,000KB = 25MB
		});

		it("should handle cloud storage scenario", () => {
			// 15GB cloud storage, storing 3MB photos
			const fileCount = calculateFileCount(15, "gigabytes", 3, "megabytes");
			expect(fileCount).toBe(5000); // 15GB = 15,000MB, 15,000/3 = 5000 photos
		});

		it("should handle mobile storage scenario", () => {
			// 64GB phone storage, apps are 50MB each
			const fileCount = calculateFileCount(64, "gigabytes", 50, "megabytes");
			expect(fileCount).toBe(1280); // 64GB = 64,000MB, 64,000/50 = 1280 apps
		});
	});
});
