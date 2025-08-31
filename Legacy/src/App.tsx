import { useState } from "react";
import "./App.css";
import { Card, CardContent } from "@/components/ui/card";
import FileSizeCalculator from "./components/FileSizeCalculator";
import StorageCalculator from "./components/StorageCalculator";
import DataUnitConverter from "./components/UnitConvertor";

const App = () => {
	const [selectedComponent, setSelectedComponent] = useState<string | null>(
		null,
	);

	return (
		<div className="p-2 bg-gradient-to-b from-gray-50 to-gray-100 md:p-4 rounded-2xl">
			<div className="mx-auto max-w-7xl">
				<h1 className="m-4 text-4xl font-bold text-center text-purple-600 md:my-4">
					Calculating sizes 🧮
				</h1>

				{!selectedComponent && (
					<Card className="mx-auto max-w-7xl">
						<CardContent className="p-4">
							<h2 className="mb-4 text-2xl font-semibold text-center text-gray-700">
								Pick your practice mode
							</h2>
							<div className="flex-col space-y-4">
								<button
									onClick={() => setSelectedComponent("converter")}
									className="w-full p-4 text-left text-gray-700 rounded-lg shadow md:p-6 bg-gradient-to-r from-indigo-50 to-purple-50 hover:shadow-md transition-shadow duration-200 hover:from-indigo-100 hover:to-purple-100"
								>
									<p className="text-lg font-bold">Moving between units</p>
									<p className="italic text-gray-400">100KB to MB</p>
								</button>
								<button
									onClick={() => setSelectedComponent("storageCalculator")}
									className="w-full p-4 text-left text-gray-700 rounded-lg shadow md:p-6 bg-gradient-to-r from-indigo-50 to-purple-50 hover:shadow-md transition-shadow duration-200 hover:from-indigo-100 hover:to-purple-100"
								>
									<p className="text-lg font-bold">
										Calculating storage capacity
									</p>
									<p className="italic text-gray-400 ">
										10 files of 20KB in MB
									</p>
								</button>
								<button
									onClick={() => setSelectedComponent("fileSizeCalculator")}
									className="w-full p-4 text-left text-gray-700 rounded-lg shadow md:p-6 bg-gradient-to-r from-indigo-50 to-purple-50 hover:shadow-md transition-shadow duration-200 hover:from-indigo-100 hover:to-purple-100"
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
					<div className="mx-auto max-w-7xl">
						<button
							onClick={() => setSelectedComponent(null)}
							className="px-4 py-2 mb-2 text-sm text-indigo-600 bg-white rounded-lg shadow md:mb-4 hover:shadow-md transition-shadow duration-200 hover:bg-indigo-50"
						>
							← Back to selection
						</button>
						<div>
							{selectedComponent === "converter" && <DataUnitConverter />}
							{selectedComponent === "storageCalculator" && (
								<StorageCalculator />
							)}
							{selectedComponent === "fileSizeCalculator" && (
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
