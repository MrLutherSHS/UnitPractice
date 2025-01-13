import { Button } from './ui/button';

import { Input } from './ui/input';

import { Check, X } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export const FeedbackBox = ({
  feedback,
}: {
  feedback: { isCorrect: boolean; message: string; explanation: string[] };
}) => {
  return (
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
            className={feedback.isCorrect ? 'text-green-700' : 'text-red-700'}
          >
            {feedback.message}
          </div>
          {!feedback.isCorrect && (
            <div className="mt-4 text-gray-700">
              <div className="font-semibold text-xl text-blue-900">
                Here's how to solve it:
              </div>
              {feedback.explanation.map((step, index) => (
                <div key={index} className="ml-4 mt-2 text-lg text-blue-700">
                  {step}
                </div>
              ))}
            </div>
          )}
        </AlertDescription>
      </div>
    </Alert>
  );
};

export const AnswerForm = ({
  handleSubmit,
  userAnswer,
  handleAnswerChange,
  type,
}: {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  userAnswer: string | number;
  handleAnswerChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
}) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
      <Input
        type={type}
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
  );
};

export const ScoreBox = ({
  score,
}: {
  score: { correct: number; total: number };
}) => {
  return (
    <div className="text-lg md:text-2xl mb-6 bg-gradient-to-r from-indigo-100 to-purple-100 p-2 md:p-4 rounded-lg">
      <span className="font-semibold">Score:</span> {score.correct}/
      {score.total}
      <span className="text-indigo-600 ml-2">
        ({score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}
        %)
      </span>
    </div>
  );
};

export const NewQuestionButton = ({
  generateQuestion,
}: {
  generateQuestion: () => void;
}) => {
  return (
    <Button
      onClick={generateQuestion}
      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold text-lg py-4 md:text-2xl md:py-8"
    >
      New Question
    </Button>
  );
};
