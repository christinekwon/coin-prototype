import { useGLTF, Tube } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { Mesh, Vector3, CubicBezierCurve3, BufferGeometry } from "three";
import GlossyMaterial from "../Materials/GlossyMaterial";

type CoinProps = ThreeElements["mesh"] & {
	position: number[];
	rotation: number[];
	color: string;
	isAnimating: boolean;
	setTerminatedCoinCount: Function;
};

const scale: number = 0.2;

export default function Coin({
	position,
	rotation,
	color,
	isAnimating,
	setTerminatedCoinCount,
}: CoinProps) {
	const { nodes }: any = useGLTF("models/coin.glb");

	const coinRef = useRef<Mesh>(null!);

	const [isCoinAnimating, setIsCoinAnimating] = useState<boolean>(false); // track animation state of single coin
	const [splinePointPos, setSplinePointPos] = useState<number>(0); // coin's position on it's path
	const [curve, setCurve] = useState<CubicBezierCurve3>(null!); // coin's path
	const [speed, setSpeed] = useState<number>(0); // speed of coin position animation
	const [yRot, setYRot] = useState<number>(0); // amount of y axis rotation per frame

	useEffect(() => {
		setIsCoinAnimating(isAnimating);

		// regenerate variables on new animation trigger
		if (isAnimating) {
			setCurve(new CubicBezierCurve3(...getCurveVectors()));
			setSpeed(Math.random() / 50 + 0.005);
			setYRot(Math.random() / 5);
		} else {
			coinRef.current.position.set(position[0], position[1], position[2]);
		}
	}, [isAnimating]);

	// animate the position & rotation of the coin
	useFrame(() => {
		if (isCoinAnimating) {
			if (splinePointPos < 1) {
				const splinePoint = curve.getPoint(splinePointPos);
				coinRef.current.position.x = splinePoint.x;
				coinRef.current.position.y = splinePoint.y;
				coinRef.current.position.z = splinePoint.z;
				setSplinePointPos(splinePointPos + speed);
				coinRef.current.rotation.y += yRot;
			} else {
				resetCoinProperties();
			}
		}
	});

	function resetCoinProperties() {
		setIsCoinAnimating(false);
		setSplinePointPos(0);
		setTerminatedCoinCount((count: number) => count + 1);
	}

	// generate a randomized vector curve for the coin to travel along
	function getCurveVectors(): Vector3[] {
		const vectors = [new Vector3(0, 0, 0)];

		let x = Math.random() * 2 - 1;
		let z = Math.random() * 4;

		vectors.push(new Vector3(x, 7, z));
		vectors.push(new Vector3((x += x > 0 ? 2 : -2), 5, (z += z > 0 ? 2 : -2)));
		vectors.push(new Vector3((x += x > 0 ? 2 : -2), -5, (z += z > 0 ? 2 : -2)));

		return vectors;
	}

	return (
		<>
			{/* <Tube args={[curve, 200, 0.05, 8, false]}>
				<GlossyMaterial color={color} />
			</Tube> */}
			<mesh
				ref={coinRef}
				geometry={nodes.Coin.geometry}
				position={position}
				rotation={rotation}
				scale={[scale, scale, scale]}
				visible={isAnimating}
			>
				<GlossyMaterial color={color || "#4e43f5"} />
			</mesh>
		</>
	);
}
