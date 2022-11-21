import { FC } from "react";
import styled, { keyframes } from "styled-components";

const rotation = keyframes`
    from{
        transform: rotate(0deg);
    }

    to{
        transform: rotate(360deg);
    }

`;

interface SpinnerProps {
    width:number, 
    height:number,
    marginTop: number,
};
const Spinner = styled.div<SpinnerProps>`
	height: ${({width}) => width}px;
	width: ${({height}) => height}px;
	border: 3px solid #f1658a; // #f8049c
	border-radius: 50%;
	border-top: none;
	border-right: none;
	margin: 16px auto;
	animation: ${rotation} 2s linear infinite;
    margin-top: ${({marginTop}) => marginTop}px;
`;

interface LoadingProps {
    width?: number, 
    height?: number,
    marginTop?: number,
    isTable?: boolean,
};
const Loading: FC<LoadingProps> = ({ width = 200, height = 200, marginTop = 50, isTable = false }) => {

    return (
        isTable ? <tr><td className="no-data" rowSpan={10} colSpan={20} style={{ background: '#fff' }}><Spinner width={width} height={height} marginTop={marginTop} /></td></tr>
        : <Spinner width={width} height={height} marginTop={marginTop} />
    );
}

export default Loading;