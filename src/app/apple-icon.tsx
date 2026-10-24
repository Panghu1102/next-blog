import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "#c91f16",
					borderRadius: 34,
				}}
			>
				<div
					style={{
						width: 126,
						height: 126,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						borderRadius: "48% 48% 45% 45%",
						background: "#f6b64b",
						border: "7px solid #241c17",
						fontSize: 94,
						lineHeight: 1,
					}}
				>
					🐯
				</div>
			</div>
		),
		size,
	);
}
