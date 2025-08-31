import { describe, expect, it } from "vitest";

// We need to extract the conversion functions from the component for testing
// These are the core conversion functions from UnitConvertor.tsx

const units = [
	"bits",
	"bytes",
	"kilobytes",
	"megabytes",
	"gigabytes",
	"terabytes",
	"petabytes",
];

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

const calculateAnswer = (value: number, fromUnit: string, toUnit: string): number => {
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

const getStepsBetweenUnits = (fromUnit: string, toUnit: string): number => {
	const fromIndex = units.indexOf(fromUnit as (typeof units)[number]);
	const toIndex = units.indexOf(toUnit as (typeof units)[number]);
	return Math.abs(toIndex - fromIndex);
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

describe("Unit Convertor Functions", () => {
	describe("getMultiplier", () => {
		it("should return correct multipliers for each unit", () => {
			expect(getMultiplier("bytes")).toBe(1);
			expect(getMultiplier("kilobytes")).toBe(1000);
			expect(getMultiplier("megabytes")).toBe(1000000);
			expect(getMultiplier("gigabytes")).toBe(1000000000);
			expect(getMultiplier("terabytes")).toBe(1000000000000);
			expect(getMultiplier("petabytes")).toBe(1000000000000000);
		});

		it("should return undefined for invalid units", () => {
			expect(getMultiplier("invalid")).toBeUndefined();
			expect(getMultiplier("bits")).toBeUndefined(); // bits is not in multipliers
		});
	});

	describe("calculateAnswer", () => {
		describe("bits conversions", () => {
			it("should convert bits to bytes correctly", () => {
				expect(calculateAnswer(8, "bits", "bytes")).toBe(1);
				expect(calculateAnswer(16, "bits", "bytes")).toBe(2);
				expect(calculateAnswer(800, "bits", "bytes")).toBe(100);
			});

			it("should convert bits to larger units correctly", () => {
				expect(calculateAnswer(8000, "bits", "kilobytes")).toBe(1);
				expect(calculateAnswer(8000000, "bits", "megabytes")).toBe(1);
			});

			it("should convert bytes to bits correctly", () => {
				expect(calculateAnswer(1, "bytes", "bits")).toBe(8);
				expect(calculateAnswer(2, "bytes", "bits")).toBe(16);
				expect(calculateAnswer(100, "bytes", "bits")).toBe(800);
			});
		});

		describe("standard unit conversions", () => {
			it("should convert bytes to kilobytes", () => {
				expect(calculateAnswer(1000, "bytes", "kilobytes")).toBe(1);
				expect(calculateAnswer(2000, "bytes", "kilobytes")).toBe(2);
				expect(calculateAnswer(500, "bytes", "kilobytes")).toBe(0.5);
			});

			it("should convert kilobytes to megabytes", () => {
				expect(calculateAnswer(1000, "kilobytes", "megabytes")).toBe(1);
				expect(calculateAnswer(2000, "kilobytes", "megabytes")).toBe(2);
				expect(calculateAnswer(500, "kilobytes", "megabytes")).toBe(0.5);
			});

			it("should convert megabytes to gigabytes", () => {
				expect(calculateAnswer(1000, "megabytes", "gigabytes")).toBe(1);
				expect(calculateAnswer(2000, "megabytes", "gigabytes")).toBe(2);
				expect(calculateAnswer(500, "megabytes", "gigabytes")).toBe(0.5);
			});

			it("should convert gigabytes to terabytes", () => {
				expect(calculateAnswer(1000, "gigabytes", "terabytes")).toBe(1);
				expect(calculateAnswer(2000, "gigabytes", "terabytes")).toBe(2);
				expect(calculateAnswer(500, "gigabytes", "terabytes")).toBe(0.5);
			});

			it("should convert larger to smaller units", () => {
				expect(calculateAnswer(1, "kilobytes", "bytes")).toBe(1000);
				expect(calculateAnswer(1, "megabytes", "kilobytes")).toBe(1000);
				expect(calculateAnswer(1, "gigabytes", "megabytes")).toBe(1000);
				expect(calculateAnswer(1, "terabytes", "gigabytes")).toBe(1000);
			});
		});

		describe("multi-step conversions", () => {
		it("should convert across multiple units", () => {
			expect(calculateAnswer(1, "megabytes", "bytes")).toBe(1000000);
			expect(calculateAnswer(1, "gigabytes", "kilobytes")).toBe(1000000);
			expect(calculateAnswer(1000000, "bytes", "gigabytes")).toBe(0.001); // 1 million bytes = 0.001 GB
		});			it("should handle decimal results", () => {
				expect(calculateAnswer(500, "megabytes", "gigabytes")).toBe(0.5);
				expect(calculateAnswer(1500, "kilobytes", "megabytes")).toBe(1.5);
			});
		});

		describe("same unit conversions", () => {
			it("should return same value for identical units", () => {
				expect(calculateAnswer(100, "bytes", "bytes")).toBe(100);
				expect(calculateAnswer(50, "kilobytes", "kilobytes")).toBe(50);
				expect(calculateAnswer(1.5, "megabytes", "megabytes")).toBe(1.5);
			});
		});
	});

	describe("getStepsBetweenUnits", () => {
		it("should calculate correct steps between adjacent units", () => {
			expect(getStepsBetweenUnits("bytes", "kilobytes")).toBe(1);
			expect(getStepsBetweenUnits("kilobytes", "megabytes")).toBe(1);
			expect(getStepsBetweenUnits("megabytes", "gigabytes")).toBe(1);
		});

		it("should calculate correct steps between non-adjacent units", () => {
			expect(getStepsBetweenUnits("bytes", "megabytes")).toBe(2);
			expect(getStepsBetweenUnits("kilobytes", "gigabytes")).toBe(2);
			expect(getStepsBetweenUnits("bytes", "gigabytes")).toBe(3);
		});

		it("should work in reverse order", () => {
			expect(getStepsBetweenUnits("megabytes", "bytes")).toBe(2);
			expect(getStepsBetweenUnits("gigabytes", "kilobytes")).toBe(2);
		});

		it("should return 0 for same units", () => {
			expect(getStepsBetweenUnits("bytes", "bytes")).toBe(0);
			expect(getStepsBetweenUnits("megabytes", "megabytes")).toBe(0);
		});

		it("should handle bits conversions", () => {
			expect(getStepsBetweenUnits("bits", "bytes")).toBe(1);
			expect(getStepsBetweenUnits("bits", "kilobytes")).toBe(2);
			expect(getStepsBetweenUnits("bytes", "bits")).toBe(1);
		});
	});

	describe("getConversionPath", () => {
		it("should create correct path for adjacent units", () => {
			expect(getConversionPath("bytes", "kilobytes")).toEqual(["bytes", "kilobytes"]);
			expect(getConversionPath("kilobytes", "megabytes")).toEqual(["kilobytes", "megabytes"]);
		});

		it("should create correct path for multi-step conversions", () => {
			expect(getConversionPath("bytes", "megabytes")).toEqual(["bytes", "kilobytes", "megabytes"]);
			expect(getConversionPath("kilobytes", "gigabytes")).toEqual(["kilobytes", "megabytes", "gigabytes"]);
		});

		it("should create correct path for reverse conversions", () => {
			expect(getConversionPath("megabytes", "bytes")).toEqual(["megabytes", "kilobytes", "bytes"]);
			expect(getConversionPath("gigabytes", "kilobytes")).toEqual(["gigabytes", "megabytes", "kilobytes"]);
		});

		it("should handle bits to other units", () => {
			expect(getConversionPath("bits", "bytes")).toEqual(["bits", "bytes"]);
			expect(getConversionPath("bits", "kilobytes")).toEqual(["bits", "bytes", "kilobytes"]);
			expect(getConversionPath("bits", "megabytes")).toEqual(["bits", "bytes", "kilobytes", "megabytes"]);
		});

		it("should handle other units to bits", () => {
			expect(getConversionPath("bytes", "bits")).toEqual(["bytes", "bits"]);
			expect(getConversionPath("kilobytes", "bits")).toEqual(["kilobytes", "bytes", "bits"]);
			expect(getConversionPath("megabytes", "bits")).toEqual(["megabytes", "kilobytes", "bytes", "bits"]);
		});

		it("should handle same unit", () => {
			expect(getConversionPath("bytes", "bytes")).toEqual(["bytes"]);
			expect(getConversionPath("megabytes", "megabytes")).toEqual(["megabytes"]);
		});
	});
});
