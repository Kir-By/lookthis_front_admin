import React from "react";

interface Props {
    resetErrorBoundary?: () => void,
    isTable?: boolean;
}

// Component
const SuspenseErrorPage: React.FC<Props> = ({ isTable }) => {

    return (
        isTable ? <tr><td rowSpan={10} colSpan={20} style={{ paddingTop: '30px' }}><ErrorPage /></td></tr> : <ErrorPage />
    )
}

export default SuspenseErrorPage;

const ErrorPage = () => {

    const moveTo = window.location.pathname;
    
    return (
        <div style= {{"width": "100%",  "height": "100%", "textAlign": "center"}}>
            <div style={{"fontSize": "25px", "color": "#996615", 'margin':'20px 20px', 'padding': '20px'}}>
                페이지 오류가 발생했습니다
            </div>
            <button style={{
                'backgroundColor': '#555555',
                'color': '#fff',
                'width': '200px',
                'height': '50px',
                'fontSize': '20px',
                'borderRadius': '3px',
                'marginBottom': '30px'
            }} onClick={() => window.location.replace(moveTo)}>새로고침</button>
        </div>
    )
}