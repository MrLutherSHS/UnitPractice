import { describe, expect, it } from "vitest";
import {
	formatNumber,
	roundToPrecision,
	unformatNumber,
} from "@/lib/numberUtils";

describe("Number Utils", () => {
	describe("formatNumber", () => {
		it("should format whole numbers with thousands separators", () => {
			expect(formatNumber(1000)).toBe("1,000");
			expect(formatNumber(1000000)).toBe("1,000,000");
			expect(formatNumber(1234567)).toBe("1,234,567");
		});

		it("should format decimal numbers correctly", () => {
			expect(formatNumber(1000.5)).toBe("1,000.5");
			expect(formatNumber(1234.567)).toBe("1,234.567");
			expect(formatNumber(123456.789)).toBe("123,456.789");
		});

		it("should handle small numbers without commas", () => {
			expect(formatNumber(100)).toBe("100");
			expect(formatNumber(999)).toBe("999");
			expect(formatNumber(0.5)).toBe("0.5");
		});

		it("should handle floating-point precision issues", () => {
			// Test case that would normally cause floating-point precision errors
			const result = formatNumber(0.1 + 0.2);
			expect(result).toBe("0.3");
		});

		it("should handle zero", () => {
			expect(formatNumber(0)).toBe("0");
		});

		it("should handle negative numbers", () => {
			expect(formatNumber(-1000)).toBe("-1,000");
			expect(formatNumber(-1234.56)).toBe("-1,234.56");
		});
	});

	describe("unformatNumber", () => {
		it("should remove commas from formatted numbers", () => {
			expect(unformatNumber("1,000")).toBe("1000");
			expect(unformatNumber("1,000,000")).toBe("1000000");
			expect(unformatNumber("1,234,567.89")).toBe("1234567.89");
		});

		it("should handle strings without commas", () => {
			expect(unformatNumber("100")).toBe("100");
			expect(unformatNumber("0.5")).toBe("0.5");
		});

		it("should handle empty strings", () => {
			expect(unformatNumber("")).toBe("");
		});
	});

	describe("roundToPrecision", () => {
		it("should round to default precision (10 decimal places)", () => {
			const result = roundToPrecision(1.23456789012345);
			expect(result).toBe(1.2345678901);
		});

		it("should round to specified precision", () => {
			expect(roundToPrecision(1.23456789, 2)).toBe(1.23);
			expect(roundToPrecision(1.23456789, 4)).toBe(1.2346);
			expect(roundToPrecision(1.999, 2)).toBe(2);
		});

		it("should handle floating-point precision issues", () => {
			const result = roundToPrecision(0.1 + 0.2);
			expect(result).toBe(0.3);
		});

		it("should handle whole numbers", () => {
			expect(roundToPrecision(5)).toBe(5);
			expect(roundToPrecision(1000)).toBe(1000);
		});

		it("should handle negative numbers", () => {
			expect(roundToPrecision(-1.23456789, 2)).toBe(-1.23);
			expect(roundToPrecision(-1.999, 2)).toBe(-2);
		});

		it("should handle zero", () => {
			expect(roundToPrecision(0)).toBe(0);
		});
	});
});
