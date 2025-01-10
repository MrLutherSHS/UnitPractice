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
import { Check, X, ArrowRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface Question {
  finalValue: number;
  fromUnit: string;
  toUnit: string;
  answer: number;
  explanation: string[];
}

const DataUnitConverter = () => {
  const units = [
    'bits',
    'bytes',
    'kilobytes',
    'megabytes',
    'gigabytes',
    'terabytes',
    'petabytes',
  ];

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [displayAnswer, setDisplayAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
    explanation: string[];
  } | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showConversionPath, setShowConversionPath] = useState<boolean>(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);

  const formatNumber = (num: number): string => {
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const unformatNumber = (str: string): string => {
    return str.replace(/,/g, '');
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = unformatNumber(e.target.value);
    if (value === '') {
      setUserAnswer('');
      setDisplayAnswer('');
      return;
    }

    // Only allow numeric input
    if (/^\d*\.?\d*$/.test(value)) {
      setUserAnswer(value);
      // Format display value with commas
      if (!value.endsWith('.') && !value.endsWith('0')) {
        setDisplayAnswer(formatNumber(Number(value)));
      } else {
        // Bug - If the number ends in 0, there are no commas eg 1000
        setDisplayAnswer(value); // Retain the trailing decimal point and trailing zeros
      }
    }
  };

  const getUnitColor = (unit: string): string => {
    const colors: Record<string, string> = {
      bits: 'bg-purple-100 text-purple-900',
      bytes: 'bg-blue-100 text-blue-900',
      kilobytes: 'bg-cyan-100 text-cyan-900',
      megabytes: 'bg-teal-100 text-teal-900',
      gigabytes: 'bg-green-100 text-green-900',
      terabytes: 'bg-amber-100 text-amber-900',
      petabytes: 'bg-orange-100 text-orange-900',
    };
    return colors[unit] || 'bg-gray-100';
  };

  const getConversionPath = (fromUnit: string, toUnit: string): string[] => {
    const fromIndex = units.indexOf(fromUnit as (typeof units)[number]);
    const toIndex = units.indexOf(toUnit as (typeof units)[number]);
    const path: string[] = [];

    if (fromUnit === 'bits' && toUnit !== 'bits') {
      path.push('bits', 'bytes');
      let currentIndex = 1;
      while (currentIndex < toIndex) {
        path.push(units[currentIndex + 1]);
        currentIndex++;
      }
    } else if (toUnit === 'bits' && fromUnit !== 'bits') {
      let currentIndex = fromIndex;
      while (currentIndex > 1) {
        path.push(units[currentIndex]);
        currentIndex--;
      }
      path.push('bytes', 'bits');
    } else {
      const step = fromIndex < toIndex ? 1 : -1;
      for (let i = fromIndex; i !== toIndex + step; i += step) {
        path.push(units[i]);
      }
    }

    return path;
  };

  const ConversionPathVisual: React.FC<{
    fromUnit: string;
    toUnit: string;
  }> = ({ fromUnit, toUnit }) => {
    const path = getConversionPath(fromUnit, toUnit);

    return (
      <div className="flex flex-wrap items-center gap-2 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-inner">
        {path.map((unit, index) => (
          <React.Fragment key={unit}>
            <div
              className={`px-3 py-1 rounded-md shadow-sm ${getUnitColor(unit)}`}
            >
              {unit}
            </div>
            {index < path.length - 1 && (
              <ArrowRight className="h-4 w-4 text-indigo-400" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const getStepsBetweenUnits = (fromUnit: string, toUnit: string): number => {
    const fromIndex = units.indexOf(fromUnit as (typeof units)[number]);
    const toIndex = units.indexOf(toUnit as (typeof units)[number]);
    return Math.abs(toIndex - fromIndex);
  };

  const generateExplanation = (
    value: number,
    fromUnit: string,
    toUnit: string
  ) => {
    const fromIndex = units.indexOf(fromUnit as (typeof units)[number]);
    const toIndex = units.indexOf(toUnit as (typeof units)[number]);
    const steps = [];
    let nextStep = 1;
    let workingFromIndex = fromIndex;
    let workingValue = value;

    if (workingFromIndex < toIndex) {
      while (workingFromIndex < toIndex) {
        let step = `Step ${nextStep}. Convert ${formatNumber(workingValue)} ${units[workingFromIndex]} to ${units[workingFromIndex + 1]} : `;
        // Bits to bytes - divide by 8, otherwise divide by 1000
        if (workingFromIndex === 0) {
          step += ` ${formatNumber(workingValue)} / 8 = ${formatNumber(workingValue / 8)} ${units[workingFromIndex + 1]}`;
          workingValue = workingValue / 8;
        } else {
          step += ` ${formatNumber(workingValue)} / 1,000 = ${formatNumber(workingValue / 1000)} ${units[workingFromIndex + 1]}`;
          workingValue = workingValue / 1000;
        }
        steps.push(step);
        nextStep++;
        workingFromIndex++;
      }
    } else {
      while (workingFromIndex > toIndex) {
        let step = `Step ${nextStep}. Convert ${formatNumber(workingValue)} ${units[workingFromIndex]} to ${units[workingFromIndex - 1]} : `;
        // Bits to bytes - times by 8, otherwise divide by 1000
        if (workingFromIndex === 1) {
          step += ` ${formatNumber(workingValue)} * 8 = ${formatNumber(workingValue * 8)} ${units[workingFromIndex - 1]}`;
          workingValue = workingValue * 8;
        } else {
          step += ` ${formatNumber(workingValue)} * 1,000 = ${formatNumber(workingValue * 1000)} ${units[workingFromIndex - 1]}`;
          workingValue = workingValue * 1000;
        }
        steps.push(step);
        nextStep++;
        workingFromIndex--;
      }
    }

    // if (fromUnit === 'bits' && toUnit !== 'bits') {
    //   steps.push(
    //     `${nextStep}. Convert ${formatNumber(value)} bits to bytes: ${formatNumber(value)} ÷ 8 = ${formatNumber(value / 8)} bytes`
    //   );
    //   workingValue = value / 8;
    //   let workingFromIndex = fromIndex;
    //   fromUnit = 'bytes';
    // }

    // if (fromUnit === 'bits' && toUnit !== 'bits') {
    //   steps.push(
    //     `1. Convert ${formatNumber(value)} bits to bytes: ${formatNumber(value)} ÷ 8 = ${formatNumber(value / 8)} bytes`
    //   );
    //   workingValue = value / 8;
    //   fromUnit = 'bytes';
    // }

    // if (toUnit === 'bits' && fromUnit !== 'bits') {
    //   const bytesValue = workingValue * getMultiplier(fromUnit);
    //   steps.push(
    //     `1. Convert ${formatNumber(value)} ${fromUnit} to bytes: ${formatNumber(value)} × ${formatNumber(getMultiplier(fromUnit))} = ${formatNumber(bytesValue)} bytes`
    //   );
    //   steps.push(
    //     `2. Convert ${formatNumber(bytesValue)} bytes to bits: ${formatNumber(bytesValue)} × 8 = ${formatNumber(bytesValue * 8)} bits`
    //   );
    //   return steps;
    // }

    // if (fromUnit !== toUnit) {
    //   const multiplier = getMultiplier(fromUnit);
    //   const divider = getMultiplier(toUnit);
    //   const bytesValue = workingValue * multiplier;
    //   steps.push(
    //     `1. Convert ${formatNumber(value)} ${fromUnit} to bytes: ${formatNumber(value)} × ${formatNumber(multiplier)} = ${formatNumber(bytesValue)} bytes`
    //   );
    //   steps.push(
    //     `2. Convert ${formatNumber(bytesValue)} bytes to ${toUnit}: ${formatNumber(bytesValue)} ÷ ${formatNumber(divider)} = ${formatNumber(answer)} ${toUnit}`
    //   );
    // }

    return steps;
  };

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

  const generateQuestion = (): void => {
    setDisplayAnswer('');
    let fromUnit: string, toUnit: string;
    const maxSteps = isAdvancedMode ? 3 : 1;

    do {
      fromUnit = units[Math.floor(Math.random() * (units.length - 1))];
      toUnit = units[Math.floor(Math.random() * units.length)];
    } while (
      fromUnit === toUnit ||
      getStepsBetweenUnits(fromUnit, toUnit) > maxSteps
    );

    // Max value for bits and bytes is 300 - simpler maths for students when */ 8
    const ceiling = fromUnit === 'bits' || fromUnit === 'bytes' ? 300 : 999;

    const stepCount = getStepsBetweenUnits(fromUnit, toUnit);
    const maxValue = Math.max(10, Math.floor(ceiling / stepCount));
    const initValue = Math.floor(Math.random() * maxValue) + 1;
    // I want to make sure the value is a multiple of 8 if converting from bits
    const finalValue =
      fromUnit === 'bits' ? Math.ceil(initValue / 8) * 8 : initValue;

    const answer = calculateAnswer(finalValue, fromUnit, toUnit);

    const question: Question = {
      finalValue,
      fromUnit,
      toUnit,
      answer,
      explanation: generateExplanation(finalValue, fromUnit, toUnit),
    };

    setCurrentQuestion(question);
    setUserAnswer('');
    setFeedback(null);
  };

  const calculateAnswer = (value: number, fromUnit: string, toUnit: string) => {
    let valueInBytes;
    if (fromUnit === 'bits') {
      valueInBytes = value / 8;
    } else {
      valueInBytes = value * getMultiplier(fromUnit);
    }

    if (toUnit === 'bits') {
      return valueInBytes * 8;
    } else {
      return valueInBytes / getMultiplier(toUnit);
    }
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;

    const userNum = parseFloat(unformatNumber(userAnswer));
    const isCorrect = Math.abs(userNum - currentQuestion.answer) < 0.001;

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

  return (
    <div className="scale-133 md:scale-150 lg:scale-150 transform origin-center ">
      <div className="p-6 w-fit ">
        <Card className="max-w-6xl mx-auto shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="flex justify-between items-center">
              <span className="text-2xl font-bold">
                Data Unit Conversion Practice 🦆
              </span>
            </CardTitle>
            <CardDescription className="text-white rounded-t-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Show unit order</span>
                  <Switch checked={showHint} onCheckedChange={setShowHint} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Show conversion path</span>
                  <Switch
                    checked={showConversionPath}
                    onCheckedChange={setShowConversionPath}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Advanced mode</span>
                  <Switch
                    checked={isAdvancedMode}
                    onCheckedChange={(checked) => {
                      setIsAdvancedMode(checked);
                      setScore({ correct: 0, total: 0 });
                    }}
                  />
                </div>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {showHint && (
              <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 border-none">
                <div className="flex items-center gap-2">
                  <AlertDescription>
                    <div className="font-semibold text-indigo-900">
                      Units in order (smallest to largest):
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {units.map((unit, index) => (
                        <React.Fragment key={unit}>
                          <span
                            className={`px-2 py-1 rounded ${getUnitColor(unit)}`}
                          >
                            {unit}
                          </span>
                          {index < units.length - 1 && (
                            <ArrowRight className="h-4 w-4 text-indigo-400" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </AlertDescription>
                </div>
              </Alert>
            )}

            <div className="text-lg mb-4 bg-gradient-to-r from-indigo-100 to-purple-100 p-3 rounded-lg">
              <span className="font-semibold">Score:</span> {score.correct}/
              {score.total}
              <span className="text-indigo-600 ml-2">
                (
                {score.total > 0
                  ? Math.round((score.correct / score.total) * 100)
                  : 0}
                %)
              </span>
            </div>

            {currentQuestion ? (
              <div className="space-y-4">
                <div className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-lg shadow">
                  Convert {formatNumber(currentQuestion.finalValue)}{' '}
                  {currentQuestion.fromUnit} to {currentQuestion.toUnit}
                </div>

                {showConversionPath && (
                  <ConversionPathVisual
                    fromUnit={currentQuestion.fromUnit}
                    toUnit={currentQuestion.toUnit}
                  />
                )}

                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={displayAnswer}
                    onChange={handleAnswerChange}
                    placeholder="Enter your answer"
                    className="flex-1 border-2 border-indigo-200 focus:border-indigo-500 rounded-lg"
                    onSubmit={checkAnswer}
                  />
                  <Button
                    onClick={checkAnswer}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-6"
                  >
                    Check
                  </Button>{' '}
                </div>

                {feedback && (
                  <Alert
                    className={
                      feedback.isCorrect
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                        : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
                    }
                  >
                    <div className="flex items-center gap-2">
                      {feedback.isCorrect ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <X className="h-5 w-5 text-red-600" />
                      )}
                      <AlertDescription>
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
                          <div className="mt-2 text-gray-700">
                            <div className="font-semibold text-indigo-900">
                              Here's how to solve it:
                            </div>
                            {feedback.explanation.map((step, index) => (
                              <div
                                key={index}
                                className="ml-2 mt-1 text-indigo-700"
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
              <div className="text-center text-indigo-600">
                Click "New Question" to begin!
              </div>
            )}

            <Button
              onClick={generateQuestion}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold text-lg py-6"
            >
              New Question
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataUnitConverter;
