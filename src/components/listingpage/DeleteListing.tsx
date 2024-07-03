"use client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import deleteListing from "@/server/mutations/delete_listing";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
export default function DeleteListingButton({
  listingId,
}: {
  listingId: number;
}) {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteListing,
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit() {
    mutate({ listingId });
    router.push("/");
  }

  return (
    <Button variant="destructive" className="text-lg" onClick={() => onSubmit()}>Delete listing</Button>
  );
}
