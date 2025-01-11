import { useState } from 'react';
import './App.css';
import StorageCalculator from './components/StorageCalculator';
import DataUnitConverter from './components/UnitConvertor';
import { Card, CardContent } from '@/components/ui/card';

const App = () => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          Mr Luther's File Challenges
        </h1>

        {!selectedComponent && (
          <Card className="max-w-lg mx-auto">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl text-center mb-4 text-gray-700">
                What would you like to practice?
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedComponent('converter')}
                  className="w-full p-4 text-left bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow hover:shadow-md transition-shadow duration-200 text-gray-700 hover:from-indigo-100 hover:to-purple-100"
                >
                  Moving between units
                </button>
                <button
                  onClick={() => setSelectedComponent('calculator')}
                  className="w-full p-4 text-left bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow hover:shadow-md transition-shadow duration-200 text-gray-700 hover:from-indigo-100 hover:to-purple-100"
                >
                  Calculating storage capacity
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedComponent && (
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => setSelectedComponent(null)}
              className="mb-4 px-4 py-2 text-sm bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 text-indigo-600 hover:bg-indigo-50"
            >
              ← Back to selection
            </button>
            <div className="mt-4">
              {selectedComponent === 'converter' && <DataUnitConverter />}
              {selectedComponent === 'calculator' && <StorageCalculator />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
