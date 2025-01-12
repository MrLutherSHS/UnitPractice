import { Button } from './ui/button';
import { Input } from './ui/input';

const AnswerForm = ({
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
export default AnswerForm;
