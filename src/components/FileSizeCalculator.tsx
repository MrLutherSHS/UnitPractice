import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, X } from 'lucide-react';
import { Switch } from './ui/switch';

interface Question {
  type: 'sound' | 'image' | 'text' | 'options' | 'bitsFromOptions';
  params: {
    [key: string]: number;
  };
  targetUnit: string;
  answer: number;
  explanation: string[];
}

const FileSizeCalculator = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState<number>(0);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
    explanation: string[];
  } | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const formatNumber = (num: number): string => {
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const convertToUnit = (bits: number, targetUnit: string): number => {
    const conversions: { [key: string]: number } = {
      bits: 1,
      bytes: 8,
      kilobytes: 8 * 1000,
      megabytes: 8 * 1000 * 1000,
    };
    return bits / conversions[targetUnit];
  };

  const generateImageQuestion = (): Question => {
    const width = (Math.floor(Math.random() * 10) + 1) * 2; // 2-20 pixels (even numbers)
    const height = (Math.floor(Math.random() * 10) + 1) * 2; // 2-20 pixels
    const colourDepthOptions = [1, 2, 3, 4, 5, 6, 8];
    const colourDepth =
      colourDepthOptions[Math.floor(Math.random() * colourDepthOptions.length)];
    const targetUnit = ['bits', 'bytes'][Math.floor(Math.random() * 2)];

    const sizeInBits = width * height * colourDepth;
    const answer = convertToUnit(sizeInBits, targetUnit);

    return {
      type: 'image',
      params: { width, height, colorDepth: colourDepth },
      targetUnit,
      answer,
      explanation: [
        `Step 1: Identify the values`,
        `Width: ${width} pixels`,
        `Height: ${height} pixels`,
        `Color depth: ${colourDepth} bits`,
        `Step 2: Multiply width * height * color depth`,
        `${width} * ${height} * ${colourDepth} = ${sizeInBits} bits`,
        targetUnit !== 'bits' ? `Step 3: Convert to ${targetUnit}` : '',
        targetUnit !== 'bits'
          ? `${sizeInBits} bits = ${formatNumber(answer)} ${targetUnit}`
          : '',
      ].filter(Boolean), // Remove empty strings
    };
  };

  const generateSoundQuestion = (): Question => {
    const sampleRates = [20, 40, 60, 80];
    const sampleRate =
      sampleRates[Math.floor(Math.random() * sampleRates.length)];
    const duration = Math.floor(Math.random() * 10) + 1; // 1-10 seconds
    const bitDepth = [2, 4, 8][Math.floor(Math.random() * 3)];
    const targetUnit = ['kilobytes', 'megabytes'][
      Math.floor(Math.random() * 2)
    ];

    const bits = sampleRate * duration * bitDepth;
    const answer = convertToUnit(bits, targetUnit);

    return {
      type: 'sound',
      params: { sampleRate, duration, bitDepth },
      targetUnit,
      answer,
      explanation: [
        `Step 1: Identify the values`,
        `Sample rate: ${sampleRate} Hz`,
        `Duration: ${duration} seconds`,
        `Bit depth: ${bitDepth} bits`,
        `Step 2: Multiply sample rate × duration × bit depth`,
        `${sampleRate} × ${duration} × ${bitDepth} = ${bits} bits`,
        `Step 3: Convert to ${targetUnit}`,
        `${bits} bits = ${formatNumber(answer)} ${targetUnit}`,
      ],
    };
  };

  const generateTextQuestion = (): Question => {
    const charCount = Math.floor(Math.random() * 2990) + 10; // 1000-6000 characters
    const bitsPerChar = 8; // ASCII
    const targetUnit = ['bytes', 'kilobytes'][Math.floor(Math.random() * 2)];

    const bits = charCount * bitsPerChar;
    const answer = convertToUnit(bits, targetUnit);

    return {
      type: 'text',
      params: { charCount, bitsPerChar },
      targetUnit,
      answer,
      explanation: [
        `Step 1: Identify the values`,
        `Number of characters: ${charCount}`,
        `Bits per character (ASCII): ${bitsPerChar}`,
        `Step 2: Multiply number of characters x bits per character`,
        `${charCount} x ${bitsPerChar} = ${bits} bits`,
        `Step 3: Convert to ${targetUnit}`,
        `${bits} bits = ${formatNumber(answer)} ${targetUnit}`,
      ],
    };
  };

  const generateOptionsQuestion = (): Question => {
    const numOfBits = Math.floor(Math.random() * 7) + 1; // 1-8  bits
    const answer = Math.pow(2, numOfBits);

    return {
      type: 'options',
      params: { numOfBits },
      targetUnit: 'bits',
      answer,
      explanation: [
        `Step 1: Identify the values`,
        `Number of bits: ${numOfBits}`,
        `Step 2: Calculate 2 ^ number of bits`,
        `2^${numOfBits} = ${answer} options`,
      ],
    };
  };

  const generateBitsFromOptionsQuestion = (): Question => {
    const numberOfOptions = Math.floor(Math.random() * 255) + 1; // 1-256  options
    const answer = Math.ceil(Math.log(numberOfOptions) / Math.log(2));

    return {
      type: 'bitsFromOptions',
      params: { numberOfOptions },
      targetUnit: 'bits',
      answer,
      explanation: [
        `Step 1: Identify the values`,
        `Number of options: ${numberOfOptions}`,
        `Step 2: Calculate log2(number of options)`,
        `log2(${numberOfOptions}) = ${answer} bits`,
      ],
    };
  };

  const getQuestionText = (question: Question): string => {
    switch (question.type) {
      case 'image':
        return `An image is ${question.params.width} pixels by ${question.params.height} pixels using a colour depth of ${question.params.colorDepth} bits. How large is the file? Give your answer in ${question.targetUnit}.`;
      case 'sound':
        return `A sound file has a sample rate of ${question.params.sampleRate} Hz, duration of ${question.params.duration} seconds, and bit depth of ${question.params.bitDepth} bits. What is the file size in ${question.targetUnit}?`;
      case 'text':
        return `A text file is stored in ASCII. It has ${question.params.charCount} characters. How large is the file in ${question.targetUnit}?`;
      case 'options':
        return `A file uses ${question.params.numOfBits} bits to store each value. How many different options can it represent?`;
      case 'bitsFromOptions':
        return `An image wants to use ${question.params.numberOfOptions} different colours. What's the minimum number of bits to store each pixel?`;
      default:
        return '';
    }
  };

  const generateQuestion = (): void => {
    setHasSubmitted(false);
    const questionTypes = [
      generateImageQuestion,
      generateSoundQuestion,
      generateTextQuestion,
      generateBitsFromOptionsQuestion,
      generateOptionsQuestion,
    ];
    const newQuestion =
      questionTypes[Math.floor(Math.random() * questionTypes.length)]();
    setCurrentQuestion(newQuestion);
    setUserAnswer(NaN);
    setFeedback(null);
    console.log(newQuestion);
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setUserAnswer(value === '' ? 0 : Number(value));
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;
    const isCorrect = Math.abs(userAnswer - currentQuestion.answer) < 0.01;

    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    setFeedback({
      isCorrect,
      message: isCorrect
        ? 'Correct! Well done!'
        : `Incorrect. The correct answer is ${formatNumber(currentQuestion.answer)}`,
      explanation: currentQuestion.explanation,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasSubmitted) return;
    checkAnswer();
    setHasSubmitted(true);
  };

  const getCalculationHint = (): string => {
    if (!currentQuestion) return 'Multiply the numbers';
    switch (currentQuestion.type) {
      case 'image':
        return `Image file size? Multiply colour depth * image height (px) * image width (px).`;
      case 'sound':
        return `Sound file size? Multiply sample rate (Hz) * duration (s) * bit depth`;
      case 'text':
        return `Text file size? Multiply number of characters * bits per character (8 for ASCII)`;
      case 'options':
        return `Number of options? 2 to the power of the number of bits`;
      case 'bitsFromOptions':
        return `Bits needed for options? Log2(number of options) and round up`;
      default:
        return '';
    }
  };

  return (
    <div className="w-full">
      <div className="p-4">
        <Card className="mx-auto shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg p-8">
            <CardTitle className="flex justify-between items-center">
              <span className="text-4xl font-bold">
                📊 File Size Calculator
              </span>
            </CardTitle>
            <CardDescription className="text-white text-xl">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-lg">Show calculation help</span>
                  <Switch checked={showHint} onCheckedChange={setShowHint} />
                </div>
              </div>{' '}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            {showHint && (
              <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 border-none p-6">
                <div className="flex items-center gap-3">
                  <AlertDescription className="text-xl">
                    <div className="font-semibold text-indigo-900">
                      <span className="text-lg"></span>
                      {getCalculationHint()}
                    </div>
                  </AlertDescription>
                </div>
              </Alert>
            )}{' '}
            <div className="text-2xl mb-6 bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
              <span className="font-semibold">Score:</span> {score.correct}/
              {score.total}
              <span className="text-blue-600 ml-2">
                (
                {score.total > 0
                  ? Math.round((score.correct / score.total) * 100)
                  : 0}
                %)
              </span>
            </div>
            {currentQuestion ? (
              <div className="space-y-6">
                <div className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow">
                  {getQuestionText(currentQuestion)}
                </div>

                <form onSubmit={handleSubmit} className="flex gap-4">
                  <Input
                    type="number"
                    step="any"
                    value={userAnswer}
                    onChange={handleAnswerChange}
                    placeholder="Enter your answer"
                    className="flex-1 border-2 border-blue-200 focus:border-blue-500 rounded-lg text-2xl p-6"
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold p-6 text-xl"
                  >
                    Check
                  </Button>
                </form>

                {feedback && (
                  <Alert
                    className={`p-6 ${
                      feedback.isCorrect
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                        : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      {feedback.isCorrect ? (
                        <Check className="h-6 w-6 text-green-600 mt-1" />
                      ) : (
                        <X className="h-6 w-6 text-red-600 mt-1" />
                      )}
                      <AlertDescription className="text-xl">
                        <div
                          className={
                            feedback.isCorrect
                              ? 'text-green-700'
                              : 'text-red-700'
                          }
                        >
                          {feedback.message}
                        </div>
                        {!feedback.isCorrect && (
                          <div className="mt-4 text-gray-700">
                            <div className="font-semibold text-xl text-blue-900">
                              Here's how to solve it:
                            </div>
                            {feedback.explanation.map((step, index) => (
                              <div
                                key={index}
                                className="ml-4 mt-2 text-lg text-blue-700"
                              >
                                {step}
                              </div>
                            ))}
                          </div>
                        )}
                      </AlertDescription>
                    </div>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="text-2xl text-center text-blue-600">
                Click "New Question" to begin!
              </div>
            )}
            <Button
              onClick={generateQuestion}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold text-2xl py-8"
            >
              New Question
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FileSizeCalculator;
