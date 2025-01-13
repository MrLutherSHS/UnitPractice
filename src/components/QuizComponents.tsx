import { Button } from './ui/button';

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
