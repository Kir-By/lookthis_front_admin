import axios from "axios";
import { FC, useEffect, useRef, useState } from "react";
import UploadFilesService from "service/FilesUploadService";
import styled from "styled-components";

const ProgressWrap = styled.div`
  display: flex;
  height: 1rem;
  overflow: hidden;
  font-size: 0.75rem;
  background-color: #e9ecef;
  border-radius: 0.25rem;
`;

const Progress = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  background-color: #0d6efd;
  transition: width 0.6s ease;
`;

const FileInput = styled.input`
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  margin-top: 10px;
`;

const UploadBtn = styled.button`
  color: #fff;
  background-color: #157347;
  border-color: #146c43;
  padding: 5px;
  margin-top: 5px;
`;

const FilesUpload: FC<{
  file: any;
  setFile: React.Dispatch<any>;
}> = ({ file, setFile }) => {
  // const [fiels, setFiels] = useState<any>({
  //     selectedFiles: [],
  //     progressInfos: [],
  //     message: [],
  //     fileInfos: [],
  //     error: [],
  // });
  // const { selectedFiles, progressInfos, message, fileInfos, error } = fiels;
  // const progressInfosRef:any = useRef(null);

  // const selectFiles = (e:any) => {

  //     setFiels( (prev:any) => ({
  //         ...prev,
  //         selectedFiles: [...prev.selectedFiles, ...e.target.files],
  //         progressInfos: [...prev.progressInfos, { val: [] }]
  //     }));
  // };

  // const uploadFiles = async () => {

  //     const _progressInfos = selectedFiles.map((selectedFile:any) => ({ percentage: 0, fileName: selectedFile.name }));
  //     progressInfosRef.current = {
  //         val: _progressInfos,
  //     };

  //     const uploadPromises = selectedFiles.map((selectedFile:any, idx:number) => upload(selectedFile, idx));
  //     await Promise.all(uploadPromises)
  //         // .then((res) => UploadFilesService.getFiles())
  //         // .then((fiels:any) => {
  //         //     setFiels((prev:any) => ({
  //         //         ...prev,
  //         //         fileInfos: fiels.data,
  //         //     }))
  //         // });
  // };

  // const upload = (selectedFile:any, idx:number) => {

  //     let _progressInfos = [...progressInfosRef.current.val];

  //     return UploadFilesService.upload(selectedFile, (e:any) => {
  //         _progressInfos[idx].percentage = Math.round((100 * e.loaded) / e.total);
  //         setFiels((prev:any) => ({
  //             ...prev,
  //             progressInfos: _progressInfos,
  //         }));
  //     })
  //     .then((res) => {
  //         setFiels((prev:any) => ({
  //             ...prev,
  //             message: [...message, `Uploaded the file successfully: ${selectedFile.name}`],
  //         }));
  //     })
  //     .catch((err) => {
  //         _progressInfos[idx].percentage = 0;
  //         setFiels((prev:any) => ({
  //             ...prev,
  //             progressInfos: _progressInfos,
  //             message: [...message, `Could not upload the file: ${selectedFile.name}`],
  //             error: [...error, err.response.data],
  //         }));
  //     });
  // };

  // useEffect(() => {

  //     // UploadFilesService.getFiles()
  //     //     .then((response:any) => {
  //     //         setFiels((prev:any) => ({
  //     //             ...prev,
  //     //             fileInfos: response.data,
  //     //         }));
  //     //     });

  // }, []);

  return (
    <div>
      {/* {progressInfos &&
                progressInfos.map((progressInfo:any, index:number) => (
                    <div className="mb-2" key={index} style={{width: '30%'}}>
                        <span>{progressInfo.fileName}</span>
                        <ProgressWrap className="progress">
                            <Progress
                                className="progress-bar progress-bar-info"
                                role="progressbar"
                                aria-valuenow={progressInfo.percentage}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                style={{ width: progressInfo.percentage + "%" }}
                            >
                                {progressInfo.percentage}%
                            </Progress>
                        </ProgressWrap>
                    </div>
                ))} */}
      <div className="row my-3" style={{ width: "40%" }}>
        <div className="col-8" style={{ width: "100%", display: "flex" }}>
          <label className="btn btn-default p-0" style={{ width: "77%" }}>
            <FileInput
              type="file"
              onChange={(e) => setFile((prev: any) => e.target.files)}
              accept="image/*"
            />
          </label>
          {/* <div className="col-4">
            <UploadBtn
              className="btn btn-success btn-sm"
              disabled={!file}
              onClick={() => upload()}
            >
              Upload
            </UploadBtn>
          </div> */}
        </div>
        {/* {selectedFiles &&
                 <div className="row my-3">
                    <ul>
                        {selectedFiles.map( (item, i) => (<p className="file" key={i}>{item.name}<br/></p>) )}
                    </ul>
                </div>
                } */}
      </div>
      {/* {message.length > 0 && (
                <div className="alert alert-secondary" role="alert">
                    <ul>
                        {message.map((item:any, i:number) => {
                            return <li key={i}>{item}</li>;
                        })}
                    </ul>
                </div>
            )} */}
      {/* <div className="card">
                <div className="card-header">List of Files</div>
                <ul className="list-group list-group-flush">
                    {fileInfos &&
                        fileInfos.map((file, index) => (
                            <li className="list-group-item" key={index}>
                                <a href={file.url}>{file.name}</a>
                            </li>
                        ))}
                </ul>
            </div> */}
    </div>
  );
};

export default FilesUpload;
