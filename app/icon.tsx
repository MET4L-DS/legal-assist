import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Legal Assist Logo";
export const size = {
	width: 32,
	height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
	return new ImageResponse(
		// ImageResponse JSX element
		<div
			style={{
				fontSize: 24,
				background: "#0f172a", // Slate 900
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				color: "white",
				borderRadius: "40%",
			}}
		>
			<svg
				width="25"
				height="25"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
				<path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
				<path d="M7 21h10" />
				<path d="M12 3v18" />
				<path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
			</svg>
		</div>,
		// ImageResponse options
		{
			...size,
		},
	);
}
