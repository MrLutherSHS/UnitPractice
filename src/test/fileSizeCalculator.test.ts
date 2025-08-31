import { describe, expect, it } from "vitest";

// Extract the conversion functions from FileSizeCalculator.tsx for testing

const convertToUnit = (bits: number, targetUnit: string): number => {
	const conversions: { [key: string]: number } = {
		bits: 1,
		bytes: 8,
		kilobytes: 8 * 1000,
	};
	return bits / conversions[targetUnit];
};

// Image file size calculation
const calculateImageSize = (
	width: number,
	height: number,
	colourDepth: number,
): number => {
	return width * height * colourDepth;
};

// Sound file size calculation
const calculateSoundSize = (
	sampleRate: number,
	duration: number,
	bitDepth: number,
): number => {
	return sampleRate * duration * bitDepth;
};

// Text file size calculation
const calculateTextSize = (
	charCount: number,
	bitsPerChar: number = 8,
): number => {
	return charCount * bitsPerChar;
};

describe("File Size Calculator Functions", () => {
	describe("convertToUnit", () => {
		it("should convert bits to bits (no conversion)", () => {
			expect(convertToUnit(8, "bits")).toBe(8);
			expect(convertToUnit(16, "bits")).toBe(16);
			expect(convertToUnit(1000, "bits")).toBe(1000);
		});

		it("should convert bits to bytes", () => {
			expect(convertToUnit(8, "bytes")).toBe(1);
			expect(convertToUnit(16, "bytes")).toBe(2);
			expect(convertToUnit(800, "bytes")).toBe(100);
			expect(convertToUnit(4, "bytes")).toBe(0.5);
		});

		it("should convert bits to kilobytes", () => {
			expect(convertToUnit(8000, "kilobytes")).toBe(1);
			expect(convertToUnit(16000, "kilobytes")).toBe(2);
			expect(convertToUnit(4000, "kilobytes")).toBe(0.5);
		});

		it("should handle decimal results", () => {
			expect(convertToUnit(12, "bytes")).toBe(1.5);
			expect(convertToUnit(12000, "kilobytes")).toBe(1.5);
		});

		it("should handle zero", () => {
			expect(convertToUnit(0, "bits")).toBe(0);
			expect(convertToUnit(0, "bytes")).toBe(0);
			expect(convertToUnit(0, "kilobytes")).toBe(0);
		});
	});

	describe("calculateImageSize", () => {
		it("should calculate image size correctly", () => {
			expect(calculateImageSize(10, 10, 8)).toBe(800); // 10x10 pixels, 8-bit color
			expect(calculateImageSize(20, 30, 4)).toBe(2400); // 20x30 pixels, 4-bit color
			expect(calculateImageSize(100, 50, 1)).toBe(5000); // 100x50 pixels, 1-bit color
		});

		it("should handle small images", () => {
			expect(calculateImageSize(1, 1, 1)).toBe(1);
			expect(calculateImageSize(2, 2, 2)).toBe(8);
		});

		it("should handle various color depths", () => {
			expect(calculateImageSize(10, 10, 1)).toBe(100); // 1-bit (monochrome)
			expect(calculateImageSize(10, 10, 2)).toBe(200); // 2-bit
			expect(calculateImageSize(10, 10, 4)).toBe(400); // 4-bit
			expect(calculateImageSize(10, 10, 8)).toBe(800); // 8-bit
		});

		it("should handle rectangular images", () => {
			expect(calculateImageSize(16, 9, 8)).toBe(1152); // 16:9 aspect ratio
			expect(calculateImageSize(4, 3, 8)).toBe(96); // 4:3 aspect ratio
		});

		it("should handle zero dimensions", () => {
			expect(calculateImageSize(0, 10, 8)).toBe(0);
			expect(calculateImageSize(10, 0, 8)).toBe(0);
			expect(calculateImageSize(0, 0, 8)).toBe(0);
		});
	});

	describe("calculateSoundSize", () => {
		it("should calculate sound file size correctly", () => {
			expect(calculateSoundSize(40, 5, 8)).toBe(1600); // 40Hz, 5 seconds, 8-bit
			expect(calculateSoundSize(100, 2, 4)).toBe(800); // 100Hz, 2 seconds, 4-bit
			expect(calculateSoundSize(20, 10, 2)).toBe(400); // 20Hz, 10 seconds, 2-bit
		});

		it("should handle various sample rates", () => {
			expect(calculateSoundSize(20, 1, 8)).toBe(160); // Low sample rate
			expect(calculateSoundSize(80, 1, 8)).toBe(640); // High sample rate
		});

		it("should handle various durations", () => {
			expect(calculateSoundSize(40, 1, 8)).toBe(320); // 1 second
			expect(calculateSoundSize(40, 30, 8)).toBe(9600); // 30 seconds
		});

		it("should handle various bit depths", () => {
			expect(calculateSoundSize(40, 5, 2)).toBe(400); // 2-bit
			expect(calculateSoundSize(40, 5, 4)).toBe(800); // 4-bit
			expect(calculateSoundSize(40, 5, 8)).toBe(1600); // 8-bit
		});

		it("should handle zero values", () => {
			expect(calculateSoundSize(0, 5, 8)).toBe(0);
			expect(calculateSoundSize(40, 0, 8)).toBe(0);
			expect(calculateSoundSize(40, 5, 0)).toBe(0);
		});

		it("should handle decimal values", () => {
			expect(calculateSoundSize(40, 2.5, 8)).toBe(800); // 2.5 seconds
			expect(calculateSoundSize(50.5, 2, 8)).toBe(808); // 50.5Hz (though unlikely in practice)
		});
	});

	describe("calculateTextSize", () => {
		it("should calculate text file size correctly with default ASCII", () => {
			expect(calculateTextSize(100)).toBe(800); // 100 chars * 8 bits = 800 bits
			expect(calculateTextSize(1000)).toBe(8000); // 1000 chars * 8 bits = 8000 bits
			expect(calculateTextSize(5000)).toBe(40000); // 5000 chars * 8 bits = 40000 bits
		});

		it("should calculate text file size with custom bits per character", () => {
			expect(calculateTextSize(100, 16)).toBe(1600); // Unicode 16-bit
			expect(calculateTextSize(100, 4)).toBe(400); // 4-bit encoding
			expect(calculateTextSize(100, 1)).toBe(100); // 1-bit encoding
		});

		it("should handle zero characters", () => {
			expect(calculateTextSize(0)).toBe(0);
			expect(calculateTextSize(0, 16)).toBe(0);
		});

		it("should handle single character", () => {
			expect(calculateTextSize(1)).toBe(8);
			expect(calculateTextSize(1, 16)).toBe(16);
		});

		it("should handle large text files", () => {
			expect(calculateTextSize(10000)).toBe(80000);
			expect(calculateTextSize(100000)).toBe(800000);
		});

		it("should handle zero bits per character", () => {
			expect(calculateTextSize(100, 0)).toBe(0);
		});
	});

	describe("Integration tests - Full file size calculations", () => {
		it("should calculate complete image file sizes in different units", () => {
			const imageBits = calculateImageSize(20, 20, 8); // 3200 bits
			expect(convertToUnit(imageBits, "bytes")).toBe(400); // 3200 / 8 = 400 bytes
			expect(convertToUnit(imageBits, "kilobytes")).toBe(0.4); // 3200 / 8000 = 0.4 KB
		});

		it("should calculate complete sound file sizes in different units", () => {
			const soundBits = calculateSoundSize(40, 10, 8); // 3200 bits
			expect(convertToUnit(soundBits, "bytes")).toBe(400); // 3200 / 8 = 400 bytes
			expect(convertToUnit(soundBits, "kilobytes")).toBe(0.4); // 3200 / 8000 = 0.4 KB
		});

		it("should calculate complete text file sizes in different units", () => {
			const textBits = calculateTextSize(1000, 8); // 8000 bits
			expect(convertToUnit(textBits, "bytes")).toBe(1000); // 8000 / 8 = 1000 bytes
			expect(convertToUnit(textBits, "kilobytes")).toBe(1); // 8000 / 8000 = 1 KB
		});

		it("should handle realistic file size scenarios", () => {
			// A small 100x100 pixel image with 8-bit color depth
			const smallImage = calculateImageSize(100, 100, 8); // 80,000 bits
			expect(convertToUnit(smallImage, "bytes")).toBe(10000); // 10 KB worth of bytes
			expect(convertToUnit(smallImage, "kilobytes")).toBe(10); // 10 KB

			// A 5-second audio clip at 44.1kHz equivalent simplified to 44Hz, 16-bit would be 44*5*16 but using 8-bit for simplicity
			const audioClip = calculateSoundSize(44, 5, 8); // 1760 bits
			expect(convertToUnit(audioClip, "bytes")).toBe(220); // 220 bytes
			expect(convertToUnit(audioClip, "kilobytes")).toBe(0.22); // 0.22 KB

			// A 10,000 character text document
			const textDoc = calculateTextSize(10000, 8); // 80,000 bits
			expect(convertToUnit(textDoc, "bytes")).toBe(10000); // 10,000 bytes
			expect(convertToUnit(textDoc, "kilobytes")).toBe(10); // 10 KB
		});
	});
});
