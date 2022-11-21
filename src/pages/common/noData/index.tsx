import { FC } from "react";

interface NoDataProps {
    rowSpan?: number,
    colSpan?: number,
    paddingTop?: number,
    paddingBotton?: number,
    isTable?: boolean,
    showImg?: boolean,
}
const NoData: FC<NoDataProps> = ({ rowSpan = 10, colSpan = 20, paddingTop = 0, paddingBotton = 0, isTable = false, showImg = false }) => {
    return (
        <tr>
            <td
                className=""
                rowSpan={rowSpan}
                colSpan={colSpan}
                style={showImg ? undefined : { fontSize: 25, color: '#555', background: '#fff', paddingTop: `${paddingTop}px`, paddingBottom: `${paddingBotton}px` }} >
                <div style={{ display: 'flex', padding: '50px', flexWrap: 'wrap' }}>
                    <Item url={'https://image.utoimage.com/preview/cp864374/2022/09/202209000321_206.jpg'} />
                    {/* <Item url={'https://image.utoimage.com/preview/cp864374/2022/09/202209000321_206.jpg'} />
                    <Item url={'https://image.utoimage.com/preview/cp864374/2022/09/202209000321_206.jpg'} />
                    <Item url={'https://image.utoimage.com/preview/cp864374/2022/09/202209000321_206.jpg'} />
                    <Item url={'https://image.utoimage.com/preview/cp864374/2022/09/202209000321_206.jpg'} />
                    <Item url={'https://image.utoimage.com/preview/cp864374/2022/09/202209000321_206.jpg'} />
                    <Item url={'https://image.utoimage.com/preview/cp864374/2022/09/202209000321_206.jpg'} />
                    <Item url={'https://image.utoimage.com/preview/cp864374/2022/09/202209000321_206.jpg'} />
                    <Item url={'https://image.utoimage.com/preview/cp864374/2022/09/202209000321_206.jpg'} />
                    <Item url={'https://image.utoimage.com/preview/cp864374/2022/09/202209000321_206.jpg'} />
                    <Item url={'https://image.utoimage.com/preview/cp864374/2022/09/202209000321_206.jpg'} />
                    <Item url={'https://image.utoimage.com/preview/cp864374/2022/09/202209000321_206.jpg'} />
                    <Item url={'https://image.utoimage.com/preview/cp864374/2022/09/202209000321_206.jpg'} />
                    <Item url={'https://image.utoimage.com/preview/cp864374/2022/09/202209000321_206.jpg'} />
                    <Item url={'https://image.utoimage.com/preview/cp864374/2022/09/202209000321_206.jpg'} />
                    <Item url={'https://image.utoimage.com/preview/cp864374/2022/09/202209000321_206.jpg'} /> */}
                </div>
            </td>
        </tr>
    );
}

export default NoData;

const Item: FC<{ url: string }> = ({ url }) => {

    return (
        <div style={{ padding: '20px' }} >
            <img src={url} alt="" />
        </div>
    )
};