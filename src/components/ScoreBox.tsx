const ScoreBox = ({ score }) => {
  return (
    <div className="text-2xl mb-6 bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-lg">
      <span className="font-semibold">Score:</span> {score.correct}/
      {score.total}
      <span className="text-indigo-600 ml-2">
        ({score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}
        %)
      </span>
    </div>
  );
};

export default ScoreBox;
