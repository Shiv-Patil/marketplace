"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { getIncrement } from "@/lib/utils";
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
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  bid: z.coerce
    .number()
    .min(21, `Amount must be greater than or equal to ${21 + getIncrement(21)}`)
    .max(69, "Amount must be less than or equal to 69"),
});

export function NewBidButton({
  currentPrice,
  disabled,
}: {
  currentPrice: string;
  disabled: boolean;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bid: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-lg text-foreground"
          disabled={disabled}
        >
          Make an offer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Bid</DialogTitle>
          <DialogDescription>Make an offer for this listing</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="bid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bid</FormLabel>
                  <FormControl>
                    <Input type="number" step={50} placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>Enter the offer amount</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
