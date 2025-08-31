import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteNavigation } from "@/components/SiteNavigation";
import type { NavMenuItem } from "@/lib/navigationConfig";

const mockMenuItems: NavMenuItem[] = [
	{
		id: "test1",
		title: "Test Page 1",
		url: "/test1",
		description: "Test description 1",
		keywords: ["test", "page"],
	},
	{
		id: "test2",
		title: "Test Page 2",
		url: "/test2",
		description: "Test description 2",
		keywords: ["test", "page"],
	},
];

describe("SiteNavigation", () => {
	describe("Accessibility", () => {
		it("should have an accessible name for the menu button", () => {
			render(
				<SiteNavigation menuItems={mockMenuItems} title="Test Navigation" />,
			);

			const menuButton = screen.getByRole("button", {
				name: "Open navigation menu",
			});
			expect(menuButton).toBeInTheDocument();
		});

		it("should have proper ARIA attributes for dropdown menu", () => {
			render(
				<SiteNavigation menuItems={mockMenuItems} title="Test Navigation" />,
			);

			const menuButton = screen.getByRole("button", {
				name: "Open navigation menu",
			});

			// Check that button has proper ARIA attributes
			expect(menuButton).toHaveAttribute("aria-haspopup", "menu");
			expect(menuButton).toHaveAttribute("aria-expanded", "false");
		});

		it("should work in compact mode with accessible name", () => {
			render(
				<SiteNavigation
					menuItems={mockMenuItems}
					title="Test Navigation"
					compact={true}
				/>,
			);

			const menuButton = screen.getByRole("button", {
				name: "Open navigation menu",
			});
			expect(menuButton).toBeInTheDocument();
		});
	});
});
