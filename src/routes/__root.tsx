import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Footer } from "@/components";
// import { ThemeToggle } from "@/components/theme-toggle";
// import { ThemeProvider } from "@/contexts/theme-provider";

export const Route = createRootRoute({
	component: () => (
		// <ThemeProvider defaultTheme="system" storageKey="ui-theme">
		// <ThemeToggle />
		<>
			<div className="flex flex-col items-center justify-center min-h-screen p-5 bg-gradient-to-br from-indigo-400 to-purple-600">
				<div className="w-full max-w-6xl overflow-hidden bg-white shadow-2xl rounded-xl">
					<main className="p-0">
						<Outlet />
					</main>
					<Footer />
				</div>
			</div>
			<TanStackRouterDevtools />
		</>
		// </ThemeProvider>
	),
});
