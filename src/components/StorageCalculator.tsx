import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ScoreBox from './ScoreBox';
import FeedbackBox from './FeedbackBox';
import AnswerForm from './AnswerForm';
import NewQuestionButton from './NewQuestionButton';

interface Question {
  type: 'fileCount' | 'capacity';
  driveSize?: number;
  driveUnit: string;
  fileSize: number;
  fileUnit: string;
  fileCount?: number;
  answer: number;
  explanation: string[];
}

const StorageCalculator = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState<number>(0);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
    explanation: string[];
  } | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (value === '') {
      setUserAnswer(0);
      return;
    } else {
      setUserAnswer(Number(value));
    }
  };

  const formatNumber = (num: number): string => {
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  // Convert value from one unit to another
  const convertValue = (
    value: number,
    fromUnit: string,
    toUnit: string
  ): number => {
    const unitValues: { [key: string]: number } = {
      bytes: 0,
      kilobytes: 1,
      megabytes: 2,
      gigabytes: 3,
      terabytes: 4,
    };

    const difference = unitValues[fromUnit] - unitValues[toUnit];
    console.log(
      `Converting ${value} from ${fromUnit} to ${toUnit} (diff: ${difference})`
    );
    return value * Math.pow(1000, difference);
  };

  // Helper function to get simple file sizes
  const getSimpleFileSize = (): { size: number; unit: string } => {
    const simpleSizes = [
      { size: 1, unit: 'megabytes' },
      { size: 2, unit: 'megabytes' },
      { size: 2.5, unit: 'megabytes' },
      { size: 5, unit: 'megabytes' },
      { size: 10, unit: 'megabytes' },
      { size: 20, unit: 'megabytes' },
      { size: 25, unit: 'megabytes' },
      { size: 50, unit: 'megabytes' },
      { size: 100, unit: 'megabytes' },
      { size: 200, unit: 'megabytes' },
      { size: 250, unit: 'megabytes' },
      { size: 500, unit: 'megabytes' },
    ];
    return simpleSizes[Math.floor(Math.random() * simpleSizes.length)];
  };

  // Helper function to get simple drive sizes
  const getSimpleDriveSize = (): { size: number; unit: string } => {
    const simpleSizes = [
      { size: 500, unit: 'megabytes' },
      { size: 1, unit: 'gigabytes' },
      { size: 2, unit: 'gigabytes' },
      { size: 4, unit: 'gigabytes' },
      { size: 5, unit: 'gigabytes' },
      { size: 10, unit: 'gigabytes' },
      { size: 20, unit: 'gigabytes' },
      { size: 50, unit: 'gigabytes' },
      { size: 100, unit: 'gigabytes' },
    ];
    return simpleSizes[Math.floor(Math.random() * simpleSizes.length)];
  };

  const generateExplanation = (question: Question): string[] => {
    const steps: string[] = [];
    if (question.type === 'capacity') {
      const totalInFileUnits = question.fileSize * question.fileCount!;
      const finalValue = convertValue(
        totalInFileUnits,
        question.fileUnit,
        question.driveUnit
      );

      steps.push(
        `Step 1: Calculate the total size of all files`,
        `${formatNumber(question.fileCount!)} files × ${formatNumber(question.fileSize)} ${question.fileUnit} = ${formatNumber(totalInFileUnits)} ${question.fileUnit}`,
        `Step 2: Convert to ${question.driveUnit}`,
        `${formatNumber(totalInFileUnits)} ${question.fileUnit} = ${formatNumber(finalValue)} ${question.driveUnit}`
      );
    } else {
      const driveInFileUnits = convertValue(
        question.driveSize!,
        question.driveUnit,
        question.fileUnit
      );

      steps.push(
        `Step 1: Convert drive size to ${question.fileUnit}`,
        `${question.driveSize!} ${question.driveUnit} = ${formatNumber(driveInFileUnits)} ${question.fileUnit}`,
        `Step 2: Divide by file size to get number of files`,
        `${formatNumber(driveInFileUnits)} ${question.fileUnit} ÷ ${question.fileSize} ${question.fileUnit} = ${formatNumber(question.answer)} files`
      );
    }
    return steps;
  };

  const generateQuestion = (): void => {
    setHasSubmitted(false);

    const questionType = Math.random() > 0.5 ? 'fileCount' : 'capacity';
    let question: Question;

    if (questionType === 'fileCount') {
      // Generate "How many files can fit" question
      const drive = getSimpleDriveSize();
      const file = getSimpleFileSize();
      const driveInFileUnits = convertValue(drive.size, drive.unit, file.unit);
      const answer = Math.floor(driveInFileUnits / file.size);

      question = {
        type: 'fileCount',
        driveSize: drive.size,
        driveUnit: drive.unit,
        fileSize: file.size,
        fileUnit: file.unit,
        answer,
        explanation: [],
      };
    } else {
      // Generate "Total size of files" question
      const file = getSimpleFileSize();
      const fileCount = Math.floor(Math.random() * 8 + 2) * 5; // Will generate 10, 15, 20, 25, or 30
      const targetUnit = Math.random() > 0.5 ? 'gigabytes' : file.unit;
      const totalInFileUnits = fileCount * file.size;
      const answer = convertValue(totalInFileUnits, file.unit, targetUnit);

      question = {
        type: 'capacity',
        fileCount,
        driveUnit: targetUnit,
        fileSize: file.size,
        fileUnit: file.unit,
        answer,
        explanation: [],
      };
    }

    question.explanation = generateExplanation(question);
    setCurrentQuestion(question);
    setUserAnswer(NaN);
    setFeedback(null);
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;
    console.log(currentQuestion);
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

  const getQuestionText = (question: Question): string => {
    if (question.type === 'fileCount') {
      return `A user has a ${question.driveSize!} ${question.driveUnit} drive. How many ${question.fileSize} ${question.fileUnit} files can they store on it?`;
    } else {
      return `A user has ${question.fileCount!} files that are each ${question.fileSize} ${question.fileUnit}. What is the total size in ${question.driveUnit}?`;
    }
  };

  const title = '💾 Storage Capacity Calculator';

  return (
    <div className="w-full">
      <div className="p-4">
        <Card className="mx-auto shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg p-8">
            <CardTitle className="flex justify-between items-center">
              <span className="text-4xl font-bold">{title}</span>
            </CardTitle>
            <CardDescription className="text-white text-xl rounded-t-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2"></div>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            {currentQuestion ? (
              <div className="space-y-6">
                <div className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg shadow">
                  {getQuestionText(currentQuestion)}
                </div>

                <AnswerForm
                  handleSubmit={handleSubmit}
                  userAnswer={userAnswer}
                  handleAnswerChange={handleAnswerChange}
                  type="number"
                />

                {feedback && <FeedbackBox feedback={feedback} />}
              </div>
            ) : (
              <div className="text-2xl text-center text-indigo-600">
                Click "New Question" to begin!
              </div>
            )}

            <ScoreBox score={score} />
            <NewQuestionButton generateQuestion={generateQuestion} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StorageCalculator;
