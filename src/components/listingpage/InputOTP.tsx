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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import getSchema, { schemaType } from "@/lib/input_schemas/verify_purchase";
import { useMutation } from "@tanstack/react-query";
import verifyPurchase from "@/server/mutations/verify_purchase";
import { toast } from "@/components/ui/use-toast";

export function VerifyPurchase({ listingId }: { listingId: number }) {
  const formSchema = getSchema();

  const form = useForm<schemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      listingId,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: verifyPurchase,
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      setOpen(false);
      toast({
        title: "Success",
        description: "Verified successfully!",
      });
    },
  });

  function onSubmit(data: schemaType) {
    mutate(data as any);
  }

  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="text-lg">
          Verify purchase
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify purchase</DialogTitle>
          <DialogDescription>
            Verify transaction of item with seller
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-4"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator className="hidden sm:block" />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Ask the seller for an OTP and enter it here
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                Verify
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
