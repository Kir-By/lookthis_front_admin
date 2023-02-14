import { ReactNode, FC, ChangeEventHandler, useCallback } from "react";

interface IInfoInput {
    title?: string;
    placeholder: string;
    inputName: string;
    inputValue: any;
    setFn: (state: Record<string, string>) => void;
    readonly?: boolean;
    children?: ReactNode;
}
const InfoInput: FC<IInfoInput> = ({ title, placeholder, inputName, inputValue, setFn, readonly, children }) => {
    const handleInput: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
        const key = e.target.name;
        const value = e.target.value;
        setFn({ [key]: value });
    }, [setFn]);

    return (
        <div className="title-wrap">
            <p className="sort-state">{title}</p>
            <p className="title">
                <input
                    className="storeInfo"
                    placeholder={placeholder}
                    name={inputName}
                    value={inputValue}
                    readOnly={readonly}
                    onChange={handleInput}
                />
            </p>
            {children}
        </div>
    );
}

export default InfoInput;