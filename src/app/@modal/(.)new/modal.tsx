"use client";

import { type ElementRef, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import MaxWidthDiv from "@/components/MaxWidthDiv";
import { X } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<ElementRef<"dialog">>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
      document.body.classList.add("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  function onDismiss() {
    router.back();
  }

  return createPortal(
    <div className="absolute inset-0 z-30 flex bg-black/80 animate-in fade-in-0">
      <dialog
        ref={dialogRef}
        className="z-30 m-0 flex h-screen w-screen bg-transparent"
        onClose={onDismiss}
      >
        <Toaster />
        <MaxWidthDiv className="items-center justify-center py-4 md:p-8">
          <div
            id="app-modal"
            className="relative flex h-full w-full flex-col overflow-y-auto overflow-x-hidden rounded-lg bg-background p-4 lg:h-5/6 lg:w-5/6"
          >
            <Button
              onClick={() => dialogRef.current?.close()}
              variant="ghost"
              className="absolute right-2 top-2 rounded-full p-2"
            >
              <X color="hsl(var(--muted-foreground))" />
            </Button>
            {children}
          </div>
        </MaxWidthDiv>
      </dialog>
    </div>,
    document.getElementById("modal-root")!
  );
}
