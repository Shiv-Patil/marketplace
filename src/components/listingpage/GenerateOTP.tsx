"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import generateOTP from "@/server/mutations/generate_otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";

export function GenerateOTP({ listingId }: { listingId: number }) {
  const { mutate, isPending } = useMutation({
    mutationFn: generateOTP,
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: (generated) => {
      setOtp(generated);
    },
  });

  function generate() {
    mutate({ listingId });
  }

  const [otp, setOtp] = useState<string>();
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={() => setOtp(undefined)}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-lg">
          Verify sale
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify sale</DialogTitle>
          <DialogDescription>
            Verify transaction of item with bidder
          </DialogDescription>
        </DialogHeader>
        <div className="justify-centergap-4 flex h-full flex-col items-center">
          {otp ? (
            <div className="flex flex-col items-center gap-4">
              <InputOTP
                maxLength={6}
                disabled={true}
                value={otp}
                containerClassName="has-[:disabled]:opacity-100"
                className="select-none disabled:cursor-default"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">
              Click the button below to generate an OTP.
              <br />
              Generated OTP will be valid for 5 minutes
            </span>
          )}
        </div>
        <DialogFooter>
          <div className="flex w-full items-end justify-between">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button
                  onMouseEnter={() => setOpen(true)}
                  onMouseLeave={() => setOpen(false)}
                >
                  <Info
                    className="h-5 w-5"
                    color="hsl(var(--muted-foreground))"
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[19.5rem] text-center text-xs text-muted-foreground">
                After completing transaction, share this OTP with the highest
                bidder to mark this item as sold.
              </PopoverContent>
            </Popover>
            <Button onClick={generate} disabled={isPending}>
              Generate OTP
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
