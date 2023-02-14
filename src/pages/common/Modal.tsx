import { FC, ReactNode } from "react";
import styled from "styled-components"

const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.6);
`;

const InnerWrapper = styled.div<{backgroundColor: string}>`
    font-size: 16px;
    font-family: 'Noto Sans KR',sans-serif;
    width: 30%;
    margin: 5px;
    padding: 0% 2% 0% 0%;
    display: flex;
    justify-content: normal;
    flex-direction: column;
    background-color: ${props => props.backgroundColor}; //#d3e8ff; //#ffa3a3;
    border: 5px solid ${props => props.backgroundColor}; //#ffa3a3;
    border-radius: 10px;
    min-width: 790px;
`

const ModalHeader = styled.div`
    width: 100%;
    padding: 10px 35px 0px 25px;
    margin: 5px 5px -20px 5px;
    display: flex;
    justify-content: center;
`;

const ModalContentWrapper = styled.div`
    width: 100%;
    padding: 0px 35px 25px 25px;
    margin: 5px;
    display: flex;
    align-items: center;
`;

const ModalContent = styled.div`
    width: 100%;
    padding: 0px 35px 25px 25px;
    margin: 5px;
    display: flex;
    justify-content: center;
    flex-direction: column;
`;

const ModalBottomWrapper = styled.div`
    width: 100%;
    padding: 0px 35px 0px 25px;
    margin: 5px;
    display: flex;
    justify-content: center;
    flex-direction: end;
`;

const CloseButtonWrapper = styled.div`
    width: 102%;
    display: flex;
    justify-content: end;
    padding: 5px;
    margin: 5px;
    margin-bottom: -50px;
    z-index: 10;
`;

const CloseButton = styled.button<{backgroundColor: string}>`
    display: flex;
    justify-content: end;
    cursor: pointer;
    font-size: 16px;
    font-family: 'Noto Sans KR',sans-serif;
    height: 40px;
    color: #333;
    background-color: ${props => props.backgroundColor};
    border-color: #ccc;
    border-radius: 4px;
    border: 1px solid transparent;
    padding: 6px;
    margin-left: 5px;
`

interface ModalProps {
    header?: ReactNode,
    content?: ReactNode,
    button?: ReactNode,
    backgroundColor?: string,
    handleIsPop: (isPop: boolean) => void,
};
const Modal:FC<ModalProps> = ({
    header,
    content,
    button,
    backgroundColor = "#fff",
    handleIsPop
}) => {

    return ( 
        <ModalWrapper>
            <InnerWrapper backgroundColor={backgroundColor}>
                <CloseButtonWrapper>
                    <CloseButton backgroundColor={backgroundColor} onClick={() => handleIsPop(false)}>X</CloseButton>
                </CloseButtonWrapper>
                <ModalHeader>
                    {header}
                </ModalHeader>
                <ModalContentWrapper>
                    <ModalContent>
                        {content}
                    </ModalContent>
                </ModalContentWrapper>
                <ModalBottomWrapper>
                    {button}
                </ModalBottomWrapper>
            </InnerWrapper>
        </ModalWrapper>
     );
}
 
export default Modal;