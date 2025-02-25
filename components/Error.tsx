"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return <Toaster position="bottom-right" theme="light" richColors />;
}

import { toast } from "sonner";

const Error = (title: string, message: string) => {
  toast.error(title, {
    description: message,
  });
};

export default Error;
