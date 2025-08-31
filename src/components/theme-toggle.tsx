import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<div className="flex items-center rounded-md border bg-card p-1">
			<button
				onClick={() => setTheme("light")}
				className={cn(
					"inline-flex items-center justify-center rounded-sm px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
					theme === "light"
						? "bg-background text-foreground shadow-sm"
						: "text-muted-foreground hover:bg-muted hover:text-foreground",
				)}
				title="Light mode"
				type="button"
			>
				<Sun className="h-4 w-4" />
				<span className="sr-only">Light mode</span>
			</button>
			<button
				onClick={() => setTheme("dark")}
				className={cn(
					"inline-flex items-center justify-center rounded-sm px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
					theme === "dark"
						? "bg-background text-foreground shadow-sm"
						: "text-muted-foreground hover:bg-muted hover:text-foreground",
				)}
				title="Dark mode"
				type="button"
			>
				<Moon className="h-4 w-4" />
				<span className="sr-only">Dark mode</span>
			</button>
			<button
				onClick={() => setTheme("system")}
				className={cn(
					"inline-flex items-center justify-center rounded-sm px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
					theme === "system"
						? "bg-background text-foreground shadow-sm"
						: "text-muted-foreground hover:bg-muted hover:text-foreground",
				)}
				type="button"
				title="System preference"
			>
				<Monitor className="h-4 w-4" />
				<span className="sr-only">System preference</span>
			</button>
		</div>
	);
}

// Simple toggle button (alternative)
export function SimpleThemeToggle() {
	const { theme, setTheme } = useTheme();

	const toggleTheme = () => {
		if (theme === "light") setTheme("dark");
		else if (theme === "dark") setTheme("system");
		else setTheme("light");
	};

	const getIcon = () => {
		if (theme === "light") return <Sun className="h-4 w-4" />;
		if (theme === "dark") return <Moon className="h-4 w-4" />;
		return <Monitor className="h-4 w-4" />;
	};

	const getLabel = () => {
		if (theme === "light") return "Switch to dark mode";
		if (theme === "dark") return "Switch to system preference";
		return "Switch to light mode";
	};

	return (
		<button
			onClick={toggleTheme}
			type="button"
			className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
			title={getLabel()}
		>
			{getIcon()}
			<span className="sr-only">{getLabel()}</span>
		</button>
	);
}
