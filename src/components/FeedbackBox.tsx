import { Check, X } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

const FeedbackBox = ({
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

export default FeedbackBox;
