import { createFileRoute } from "@tanstack/react-router";
import { SharedLayout } from "@/components/SharedLayout";
import { UnitConvertor } from "@/components/UnitConvertor";

export const Route = createFileRoute("/unitconvertor")({
	component: UnitConvertorPage,
});

function UnitConvertorPage() {
	return (
		<SharedLayout>
			{(recordScoreAndUpdate) => (
				<UnitConvertor onScoreUpdate={recordScoreAndUpdate} />
			)}
		</SharedLayout>
	);
}
