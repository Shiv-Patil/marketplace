"use client";

import getSchema, { schemaType } from "@/lib/input_schemas/new_listing";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Check, PlusIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import createNewListing from "@/server/mutations/new_listing";
import { useMutation } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

function ImageUpload({
  setMedia,
}: {
  setMedia: (mediaId: number | undefined) => void;
}) {
  const [mediaUrl, setMediaUrl] = useState<string>();
  const { startUpload, isUploading, permittedFileInfo } = useUploadThing(
    "mediaUploader",
    {
      onClientUploadComplete: (data) => {
        setMediaUrl(data[0].url);
        setMedia(data[0].serverData.mediaId);
      },
      onUploadError: (err) => {
        toast({
          title: "Upload error",
          description: err.message,
          variant: "destructive",
        });
        console.error(err);
      },
    }
  );
  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0].size > 524288)
      return toast({
        title: "Alert",
        description: "Max file upload size is 500KB.",
      });
    startUpload(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });
  return isUploading ? (
    <div className="relative flex aspect-square max-h-60 items-center justify-center rounded-lg border bg-background">
      <Spinner />
    </div>
  ) : mediaUrl ? (
    <div className="relative aspect-square max-h-60 overflow-clip rounded-lg border">
      <Image
        alt="media"
        src={mediaUrl}
        fill={true}
        className="object-contain"
        sizes="(max-width: 768px) 30vw, 300px"
        placeholder="empty"
        priority={true}
      />
      <Check
        className="absolute bottom-2 right-2"
        color="hsl(var(--muted-foreground))"
      />
    </div>
  ) : (
    <div
      {...getRootProps()}
      className="relative flex aspect-square max-h-60 cursor-pointer items-center justify-center rounded-lg border bg-secondary transition-colors hover:bg-transparent"
    >
      {isDragActive ? (
        "Drop to upload"
      ) : (
        <PlusIcon className="h-6 w-6" color="hsl(var(--muted-foreground))" />
      )}
      <input {...getInputProps()} />
    </div>
  );
}

export default function NewPage({ userId }: { userId: string }) {
  const [modalContainer, setModalContainer] = useState(
    document.getElementById("app-modal") || undefined
  );
  const [media, setMedia] = useState<Array<number | undefined>>([
    undefined,
    undefined,
    undefined,
  ]);
  const formSchema = getSchema();
  const form = useForm<schemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      longDescription: "",
      startingPrice: "",
      media: [],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createNewListing,
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Created listing successfully!",
      });
      window.location.href = `user/${userId}`;
    },
  });

  function onSubmit(data: schemaType) {
    mutate(data);
  }

  const getSetter = useCallback((index: number) => {
    return (mediaId: number | undefined) => {
      setMedia((prev) => {
        prev[index] = mediaId;
        const formMedia: any[] = prev.filter((ele) => ele);
        form.setValue("media", formMedia, { shouldValidate: true });
        return prev;
      });
    };
  }, []);

  const mediaErrs = form.formState.errors.media;

  useEffect(() => {
    setModalContainer(document.getElementById("app-modal") || undefined);
  }, []);

  return (
    <div className="flex flex-1 flex-col justify-center">
      <h1 className="pb-6 text-center text-3xl font-light">
        Create a New Listing
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label className="block" htmlFor="images">
              Upload Images
            </label>
            <div
              className="grid grid-cols-3 justify-items-stretch gap-4"
              id="images"
            >
              <ImageUpload setMedia={getSetter(0)} />
              <ImageUpload setMedia={getSetter(1)} />
              <ImageUpload setMedia={getSetter(2)} />
            </div>
            {mediaErrs ? (
              <span className="mt-2 text-sm font-medium text-destructive">
                {mediaErrs.message}
              </span>
            ) : null}
          </div>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input maxLength={50} className="max-w-96" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a title for your listing
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Describe your item in short</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="longDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Long description</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={5} />
                </FormControl>
                <FormDescription>Describe your item in detail</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <FormField
              control={form.control}
              name="startingPrice"
              render={({ field }) => (
                <FormItem className="self-start">
                  <FormLabel>Starting price</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      ₹<Input type="number" step="any" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>Enter a starting price</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                      container={modalContainer}
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) =>
                          date ? field.onChange(date) : undefined
                        }
                        defaultMonth={field.value}
                        disabled={(date) =>
                          date <
                            new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) ||
                          date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The auction will expire on this date
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="self-center" disabled={isPending}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
