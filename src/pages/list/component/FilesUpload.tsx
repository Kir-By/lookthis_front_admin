import { ChangeEventHandler, FC, useCallback } from "react";
import styled from "styled-components";

// Hook
import { FlyerInfo } from "hooks/useFlyerInfo";

const FileInput = styled.input`
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  margin-top: 10px;
`;

const FilesUpload: FC<{
  file: any;
  handleFlyerInfo: (state: Partial<FlyerInfo>) => void
}> = ({ file, handleFlyerInfo }) => {

  const handleFile: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    const fileList = e.target.files

    if (!!fileList && fileList.length > 0) handleFlyerInfo({ file: fileList[0] })

  }, [handleFlyerInfo])

  return (
    <div>
      <div className="row my-3" style={{ width: "40%" }}>
        <div className="col-8" style={{ width: "100%", display: "flex" }}>
          <label className="btn btn-default p-0" style={{ width: "77%" }}>
            <FileInput
              type="file"
              onChange={handleFile}
              accept="image/*"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilesUpload;
