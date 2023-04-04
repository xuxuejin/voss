import React, { FC, useRef, ChangeEvent } from 'react'
import axios from 'axios'
import Button from '../Button/button'

export interface UploadProps {
    action: string;
    onProgress?: (percentage: number, file: File) => void;
    onSuccess?: (data: any, file: File) => void;
    onError?: (err: any, file: File) => void;
}

const Upload: FC<UploadProps> = (props) => {
    const {
        action,
        onProgress,
        onSuccess,
        onError
    } = props
    const fileInput = useRef<HTMLInputElement>(null)

    const handleClick = () => {
        if(fileInput.current) {
            fileInput.current.click()
        }
    }

    const uploadFiles = (files: FileList) => {
        // FileList 是 Array like， 先转成数组
        let postFiles = Array.from(files)
        postFiles.forEach(file => {
            const formData = new FormData()
            formData.append(file.name, file)
            axios.post(action, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (e) => {
                    if(e.total) {
                        let percentage = Math.round((e.loaded*100)/e.total) || 0

                        if(percentage < 100) {
                            if(onProgress) {
                                onProgress(percentage, file)
                            }
                        }
                    }
                } 
            }).then(resp => {
                if(onSuccess) {
                    onSuccess(resp.data, file)
                }
            }).catch((err) => {
                if(onError) {
                    onError(err, file)
                }
            })
        })


    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement> ) => {
        const files = e.target.files

        if(!files) return

        uploadFiles(files)

        if(fileInput.current) {
            fileInput.current.value = ''
        }
    }

    return (
        <div className="voss-upload">
            <Button btnType='primary' onClick={handleClick}>Upload File</Button>
            <input 
                className='voss-file-input'
                type="file" 
                ref={fileInput} 
                style={{display: 'none'}}
                onChange={handleFileChange}
             />
        </div>
    )
}

export default Upload