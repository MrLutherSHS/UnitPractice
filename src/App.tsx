import { useState } from 'react';
import './App.css';
import StorageCalculator from './components/StorageCalculator';
import DataUnitConverter from './components/UnitConvertor';
import { Card, CardContent } from '@/components/ui/card';
import FileSizeCalculator from './components/FileSizeCalculator';

const App = () => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 p-2 md:p-4 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center m-4 md:my-4 text-purple-600">
          Calculating sizes 🧮
        </h1>

        {!selectedComponent && (
          <Card className="max-w-7xl mx-auto">
            <CardContent className="p-4">
              <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">
                Pick your practice mode
              </h2>
              <div className="flex-col space-y-4">
                <button
                  onClick={() => setSelectedComponent('converter')}
                  className="w-full p-4 md:p-6 text-left bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow hover:shadow-md transition-shadow duration-200 text-gray-700 hover:from-indigo-100 hover:to-purple-100"
                >
                  <p className="text-lg font-bold">Moving between units</p>
                  <p className="italic text-gray-400">100KB to MB</p>
                </button>
                <button
                  onClick={() => setSelectedComponent('storageCalculator')}
                  className="w-full p-4 md:p-6 text-left bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow hover:shadow-md transition-shadow duration-200 text-gray-700 hover:from-indigo-100 hover:to-purple-100"
                >
                  <p className="text-lg font-bold">
                    Calculating storage capacity
                  </p>
                  <p className="italic  text-gray-400">
                    10 files of 20KB in MB
                  </p>
                </button>
                <button
                  onClick={() => setSelectedComponent('fileSizeCalculator')}
                  className="w-full p-4 md:p-6 text-left bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow hover:shadow-md transition-shadow duration-200 text-gray-700 hover:from-indigo-100 hover:to-purple-100"
                >
                  <p className="text-lg font-bold">Calculating file sizes</p>
                  <p className="italic text-gray-400">
                    300 character text file in KB
                  </p>
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedComponent && (
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => setSelectedComponent(null)}
              className="mb-2 md:mb-4 px-4 py-2 text-sm bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 text-indigo-600 hover:bg-indigo-50"
            >
              ← Back to selection
            </button>
            <div>
              {selectedComponent === 'converter' && <DataUnitConverter />}
              {selectedComponent === 'storageCalculator' && (
                <StorageCalculator />
              )}
              {selectedComponent === 'fileSizeCalculator' && (
                <FileSizeCalculator />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
