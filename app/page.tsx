/* eslint-disable jsx-a11y/alt-text */
"use client";

import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Image, Loader2, MousePointerSquareDashed } from "lucide-react";
import React, { useState, useTransition } from "react";
import Dropzone, { FileRejection } from "react-dropzone";
import axios from "axios";

const Home = () => {
  const { toast } = useToast();
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const onDropAccepted = (acceptedFiles: File[]) => {
    setIsUploading(true);

    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append("files", file);
    });

    axios
      .post("/xyz", formData, {
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 0;
          const progress = Math.round((progressEvent.loaded * 100) / total);
          setUploadProgress(progress);
        },
      })
      .then(() => {
        toast({
          title: "Upload successful!",
          description: "Your files have been uploaded.",
        });
      })
      .catch((error) => {
        toast({
          title: "Upload failed.",
          description: error.response?.data?.message || "Something went wrong.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsUploading(false);
        setUploadProgress(0);
      });

    setIsDragOver(false);
  };

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [files] = rejectedFiles;
    setIsDragOver(false);

    toast({
      title: `${files.file.type} type is not supported.`,
      description: "Please choose a PNG, JPG, or JPEG image instead",
      variant: "destructive",
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "relative  flex-1 my-16 w-[500px] h-[500px] rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center",
          { "ring-blue-900/25 bg-blue-900/10": isDragOver }
        )}
      >
        <Dropzone
          onDropRejected={onDropRejected}
          onDropAccepted={onDropAccepted}
          accept={{
            "image/png": [".png"],
            "image/jpg": [".jpg"],
            "image/jpeg": [".jpeg"],
          }}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              className="h-full w-full flex-1 flex flex-col items-center justify-center"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragOver ? (
                <MousePointerSquareDashed className="h-6 w-6 text-zinc-500 mb-2" />
              ) : isUploading || isPending ? (
                <Loader2 className="animate-spin h-6 w-6 text-zinc-500 mb-2" />
              ) : (
                <Image className="h-6 w-6 text-zinc-500 mb-2" />
              )}
              <div className="flex flex-col justify-center mb-2 text-sm text-zinc-700">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <p>Uploading...</p>
                    <Progress
                      value={uploadProgress}
                      className="mt-2 w-40 h-2 bg-gray-300"
                    />
                  </div>
                ) : isPending ? (
                  <div className="flex flex-col items-center">
                    <p>Redirecting, Please wait...</p>
                  </div>
                ) : isDragOver ? (
                  <p>
                    <span className="font-semibold">Drop file</span> to upload
                  </p>
                ) : (
                  <p>
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                )}
              </div>
              {isPending ? null : (
                <p className="text-xs text-zinc-500">PNG, JPG, JPEG</p>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
};

export default Home;
