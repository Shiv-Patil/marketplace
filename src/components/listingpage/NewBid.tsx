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
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toDecimal } from "dinero.js";
import getSchema, { schemaType } from "@/lib/input_schemas/new_bid";
import { useMutation } from "@tanstack/react-query";
import placeBid from "@/server/mutations/place_bid";
import { toast } from "@/components/ui/use-toast";

export function NewBidButton({
  listingId,
  currentPrice,
}: {
  listingId: number;
  currentPrice: string;
}) {
  const { formSchema, minPriceDinero } = getSchema(currentPrice);

  const form = useForm<schemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bid: Number(toDecimal(minPriceDinero)).toString(),
      listingId,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: placeBid,
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
        description: "Placed bid successfully!",
      });
    },
  });

  function onSubmit(data: schemaType) {
    mutate(data);
  }

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-lg">
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
                    <Input type="number" step="any" {...field} />
                  </FormControl>
                  <FormDescription>Enter the offer amount</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
