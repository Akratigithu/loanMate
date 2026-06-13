"use client";

import { useCallback, useState } from "react";
import { File, FileImage, Upload, X, CheckCircle2, Loader2 } from "lucide-react";
import type { UploadedDocument } from "@/lib/types";

const initialDocs: UploadedDocument[] = [
  {
    id: "1",
    name: "GST_Certificate.pdf",
    type: "PDF",
    size: "245 KB",
    status: "verified",
  },
  {
    id: "2",
    name: "Bank_Statement_Jan-Jun.pdf",
    type: "PDF",
    size: "1.2 MB",
    status: "processing",
  },
];

export function DocumentPanel() {
  const [documents, setDocuments] = useState<UploadedDocument[]>(initialDocs);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files?.length) return;
    const newDocs: UploadedDocument[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      type: file.type.includes("pdf")
        ? "PDF"
        : file.type.includes("png")
          ? "PNG"
          : "JPG",
      size: `${(file.size / 1024).toFixed(0)} KB`,
      status: "uploaded" as const,
    }));
    setDocuments((prev) => [...prev, ...newDocs]);
  }, []);

  const removeDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const statusIcon = (status: UploadedDocument["status"]) => {
    if (status === "verified")
      return <CheckCircle2 className="h-4 w-4 text-brand-500" />;
    if (status === "processing")
      return <Loader2 className="h-4 w-4 animate-spin text-amber-500" />;
    return <File className="h-4 w-4 text-muted" />;
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 transition-colors ${
          dragOver
            ? "border-brand-400 bg-brand-50"
            : "border-slate-200 bg-slate-50/50"
        }`}
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100">
          <Upload className="h-5 w-5 text-brand-600" />
        </div>
        <p className="text-sm font-medium text-foreground">
          Drag & drop documents here
        </p>
        <p className="mt-1 text-xs text-muted">PDF, JPG, PNG up to 10 MB</p>
        <label className="mt-4 cursor-pointer rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
          Browse files
          <input
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Uploaded ({documents.length})
        </p>
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-white p-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
              {doc.type === "PDF" ? (
                <File className="h-4 w-4 text-red-500" />
              ) : (
                <FileImage className="h-4 w-4 text-blue-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {doc.name}
              </p>
              <p className="text-xs text-muted">
                {doc.type} · {doc.size}
              </p>
            </div>
            {statusIcon(doc.status)}
            <button
              type="button"
              onClick={() => removeDoc(doc.id)}
              className="rounded-lg p-1 text-muted hover:bg-slate-100 hover:text-foreground"
              aria-label={`Remove ${doc.name}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
