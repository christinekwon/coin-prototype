type MaterialProps = {
	color: string;
};

export default function GlossyMaterial({ color }: MaterialProps) {
	return (
		<meshPhongMaterial
			color={color}
			emissive={"#000000"}
			specular={"#ffffff"}
			shininess={100}
		></meshPhongMaterial>
	);
}
