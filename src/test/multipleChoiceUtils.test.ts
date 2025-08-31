import { describe, expect, it } from "vitest";

// Extract and test the utility functions from MultipleChoice.tsx
// These functions are pure and can be tested in isolation

const expandUnit = (unit: string): string => {
	switch (unit) {
		case "bytes":
			return "bytes";
		case "KB":
			return "kilobytes";
		case "MB":
			return "megabytes";
		case "GB":
			return "gigabytes";
		case "TB":
			return "terabytes";
		default:
			return unit;
	}
};

const unitConversions: { [key: string]: number } = {
	bytes: 1,
	KB: 1000,
	MB: 1000 * 1000,
	GB: 1000 * 1000 * 1000,
	TB: 1000 * 1000 * 1000 * 1000,
};

const convertToBytes = (value: number, unit: string): number => {
	return value * unitConversions[unit];
};

const convertFromBytes = (bytes: number, targetUnit: string): number => {
	return bytes / unitConversions[targetUnit];
};

describe("MultipleChoice Utility Functions", () => {
	describe("expandUnit", () => {
		it("should expand abbreviated units to full names", () => {
			expect(expandUnit("bytes")).toBe("bytes");
			expect(expandUnit("KB")).toBe("kilobytes");
			expect(expandUnit("MB")).toBe("megabytes");
			expect(expandUnit("GB")).toBe("gigabytes");
			expect(expandUnit("TB")).toBe("terabytes");
		});

		it("should return unknown units unchanged", () => {
			expect(expandUnit("PB")).toBe("PB");
			expect(expandUnit("unknown")).toBe("unknown");
			expect(expandUnit("")).toBe("");
		});
	});

	describe("convertToBytes", () => {
		it("should convert bytes to bytes (no conversion)", () => {
			expect(convertToBytes(100, "bytes")).toBe(100);
			expect(convertToBytes(0, "bytes")).toBe(0);
			expect(convertToBytes(1, "bytes")).toBe(1);
		});

		it("should convert KB to bytes", () => {
			expect(convertToBytes(1, "KB")).toBe(1000);
			expect(convertToBytes(2.5, "KB")).toBe(2500);
			expect(convertToBytes(0.5, "KB")).toBe(500);
		});

		it("should convert MB to bytes", () => {
			expect(convertToBytes(1, "MB")).toBe(1000000);
			expect(convertToBytes(1.5, "MB")).toBe(1500000);
			expect(convertToBytes(0.001, "MB")).toBe(1000);
		});

		it("should convert GB to bytes", () => {
			expect(convertToBytes(1, "GB")).toBe(1000000000);
			expect(convertToBytes(2, "GB")).toBe(2000000000);
			expect(convertToBytes(0.5, "GB")).toBe(500000000);
		});

		it("should convert TB to bytes", () => {
			expect(convertToBytes(1, "TB")).toBe(1000000000000);
			expect(convertToBytes(2.5, "TB")).toBe(2500000000000);
			expect(convertToBytes(0.001, "TB")).toBe(1000000000);
		});

		it("should handle decimal values correctly", () => {
			expect(convertToBytes(1.5, "KB")).toBe(1500);
			expect(convertToBytes(2.75, "MB")).toBe(2750000);
			expect(convertToBytes(0.25, "GB")).toBe(250000000);
		});
	});

	describe("convertFromBytes", () => {
		it("should convert bytes to bytes (no conversion)", () => {
			expect(convertFromBytes(100, "bytes")).toBe(100);
			expect(convertFromBytes(1000, "bytes")).toBe(1000);
			expect(convertFromBytes(1, "bytes")).toBe(1);
		});

		it("should convert bytes to KB", () => {
			expect(convertFromBytes(1000, "KB")).toBe(1);
			expect(convertFromBytes(2500, "KB")).toBe(2.5);
			expect(convertFromBytes(500, "KB")).toBe(0.5);
		});

		it("should convert bytes to MB", () => {
			expect(convertFromBytes(1000000, "MB")).toBe(1);
			expect(convertFromBytes(1500000, "MB")).toBe(1.5);
			expect(convertFromBytes(500000, "MB")).toBe(0.5);
		});

		it("should convert bytes to GB", () => {
			expect(convertFromBytes(1000000000, "GB")).toBe(1);
			expect(convertFromBytes(2000000000, "GB")).toBe(2);
			expect(convertFromBytes(500000000, "GB")).toBe(0.5);
		});

		it("should convert bytes to TB", () => {
			expect(convertFromBytes(1000000000000, "TB")).toBe(1);
			expect(convertFromBytes(2500000000000, "TB")).toBe(2.5);
			expect(convertFromBytes(500000000000, "TB")).toBe(0.5);
		});

		it("should handle fractional results correctly", () => {
			expect(convertFromBytes(1500, "KB")).toBe(1.5);
			expect(convertFromBytes(750000, "MB")).toBe(0.75);
			expect(convertFromBytes(250000000, "GB")).toBe(0.25);
		});
	});

	describe("Conversion Round-trip Tests", () => {
		it("should maintain accuracy in round-trip conversions", () => {
			// KB round-trip
			const originalKB = 5.5;
			const bytes = convertToBytes(originalKB, "KB");
			const backToKB = convertFromBytes(bytes, "KB");
			expect(backToKB).toBeCloseTo(originalKB, 10);

			// MB round-trip
			const originalMB = 2.75;
			const bytesFromMB = convertToBytes(originalMB, "MB");
			const backToMB = convertFromBytes(bytesFromMB, "MB");
			expect(backToMB).toBeCloseTo(originalMB, 10);

			// GB round-trip
			const originalGB = 1.25;
			const bytesFromGB = convertToBytes(originalGB, "GB");
			const backToGB = convertFromBytes(bytesFromGB, "GB");
			expect(backToGB).toBeCloseTo(originalGB, 10);

			// TB round-trip
			const originalTB = 0.5;
			const bytesFromTB = convertToBytes(originalTB, "TB");
			const backToTB = convertFromBytes(bytesFromTB, "TB");
			expect(backToTB).toBeCloseTo(originalTB, 10);
		});
	});

	describe("Edge Cases", () => {
		it("should handle zero values", () => {
			expect(convertToBytes(0, "KB")).toBe(0);
			expect(convertToBytes(0, "MB")).toBe(0);
			expect(convertToBytes(0, "GB")).toBe(0);
			expect(convertToBytes(0, "TB")).toBe(0);

			expect(convertFromBytes(0, "KB")).toBe(0);
			expect(convertFromBytes(0, "MB")).toBe(0);
			expect(convertFromBytes(0, "GB")).toBe(0);
			expect(convertFromBytes(0, "TB")).toBe(0);
		});

		it("should handle very small values", () => {
			expect(convertToBytes(0.001, "KB")).toBe(1);
			expect(convertToBytes(0.000001, "MB")).toBe(1);
			expect(convertFromBytes(1, "MB")).toBe(0.000001);
			expect(convertFromBytes(1, "GB")).toBe(0.000000001);
		});

		it("should handle very large values", () => {
			const largeTB = 1000;
			const largeBytes = convertToBytes(largeTB, "TB");
			expect(largeBytes).toBe(1000000000000000);

			const backToTB = convertFromBytes(largeBytes, "TB");
			expect(backToTB).toBe(largeTB);
		});
	});

	describe("Unit Conversion Constants", () => {
		it("should have correct conversion factors", () => {
			expect(unitConversions.bytes).toBe(1);
			expect(unitConversions.KB).toBe(1000);
			expect(unitConversions.MB).toBe(1000000);
			expect(unitConversions.GB).toBe(1000000000);
			expect(unitConversions.TB).toBe(1000000000000);
		});

		it("should use decimal (base 10) rather than binary (base 2) conversions", () => {
			// Verify we're using 1000 not 1024
			expect(unitConversions.KB).not.toBe(1024);
			expect(unitConversions.MB).not.toBe(1024 * 1024);
			expect(unitConversions.GB).not.toBe(1024 * 1024 * 1024);
		});
	});
});
