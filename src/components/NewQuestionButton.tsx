import { Button } from './ui/button';

const NewQuestionButton = ({
  generateQuestion,
}: {
  generateQuestion: () => void;
}) => {
  return (
    <Button
      onClick={generateQuestion}
      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold text-2xl py-8"
    >
      New Question
    </Button>
  );
};
export default NewQuestionButton;
