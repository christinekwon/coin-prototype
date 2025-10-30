import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Coin from "./components/Objects/Coin";
import clsx from "clsx";

type ColorOption = { title: string; value: string };

const colorOptions: ColorOption[] = [
	{ title: "purple", value: "#4e43f5" },
	{ title: "pink", value: "#ff689f" },
	{ title: "blue", value: "#48baff" },
];

function App() {
	const numCoins: number = 50;
	const [isAnimating, setIsAnimating] = useState<boolean>(false); // tracks if animation is in progress
	const [terminatedCoinCount, setTerminatedCoinCount] = useState<number>(0); // number of coins that have finished animating
	const [activeColor, setActiveColor] = useState<ColorOption>(colorOptions[0]);

	// if all coins have completed animating, reset the animation state
	useEffect(() => {
		if (isAnimating && terminatedCoinCount === numCoins) {
			setIsAnimating(false);
			setTerminatedCoinCount(0);
		}
	}, [terminatedCoinCount]);

	return (
		<div className="App">
			{/* button to trigger animation */}
			<button
				type="button"
				className="btn-main"
				aria-label="Trigger coin animation"
				style={{ "--btn-color": activeColor.value } as React.CSSProperties}
				disabled={isAnimating}
				onClick={() => setIsAnimating(true)}
			>
				click me
			</button>

			{/* buttons to update theme color */}
			{colorOptions.length > 0 && (
				<ul className="color-menu">
					{colorOptions.map((color, i) => (
						<li key={`color-btn-${i}`}>
							<ColorButton
								color={color}
								activeColor={activeColor}
								setActiveColor={setActiveColor}
							/>
						</li>
					))}
				</ul>
			)}

			{/* github link */}
			<a
				target="_blank"
				href="https://github.com/christinekwon/coin-prototype"
				aria-label="External link to Github repository"
				className="github-link"
			>
				&lt;&nbsp;&gt;
			</a>

			{/* canvas where 3D animation happens */}
			<Canvas
				legacy={true}
				camera={{
					fov: 40,
					near: 1,
					far: 1000,
					position: [0, 10, 10],
				}}
			>
				<color attach="background" args={["white"]} />
				{[...Array(numCoins)].map((_, i) => (
					<Coin
						key={`coin-${i}`}
						position={[0, 0, 0]}
						rotation={[0, 0, 0]}
						color={activeColor.value}
						isAnimating={isAnimating}
						setTerminatedCoinCount={setTerminatedCoinCount}
					/>
				))}
				<directionalLight
					color={"#ffffff"}
					position={[0, 10, 10]}
					intensity={3}
				/>
			</Canvas>
		</div>
	);
}

type ColorButtonProps = {
	color: ColorOption;
	activeColor: ColorOption;
	setActiveColor: Function;
};

function ColorButton({ color, activeColor, setActiveColor }: ColorButtonProps) {
	return (
		<button
			type="button"
			className={clsx("btn-color", {
				"is-active": color.title == activeColor.title,
			})}
			style={
				{
					"--btn-color": color.value,
				} as React.CSSProperties
			}
			aria-label={`Switch coins to ${color.title} color`}
			onClick={() => setActiveColor(color)}
		>
			{color.title}
		</button>
	);
}

export default App;
