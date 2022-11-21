import Loading from 'pages/common/loading';

interface LoadingTableProps {
	width?: number;
	height?: number;
	marginTop?: number;
}
const LoadingTable = ({width, height, marginTop}: LoadingTableProps) => {
	return (
		<tr>
			<td colSpan={23}>
				<Loading width={width} height={height} marginTop={marginTop} />
			</td>
		</tr>
	);
};

export default LoadingTable;
