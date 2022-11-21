import axios from "../utils/Axios";

const upload = (file, onUploadProgress) => {

    let formData = new FormData();
    formData.append("file", file);
    console.log(formData);

    return axios.post("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
    });
}

const getFiles = () => {
    return axios.get("/files");
}

const FileUploadService = {
    upload,
    getFiles,
};


export default FileUploadService;