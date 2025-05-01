"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ButtonKirim from "./buttons/button-kirim";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

// form data validation using zod
const profileFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Name must be at least 2 characters.",
        })
        .max(30, {
            message: "Name must not be longer than 30 characters.",
        }),

    phone: z
        .string()
        .min(10, { message: "Phone number must be at least 10 digits." })
        .max(15, { message: "Phone number must not exceed 15 digits." })
        .regex(/^\+?[0-9]+$/, { message: "Invalid phone number format." }),

    message: z.string().max(160).min(4),

    urls: z
        .array(
            z.object({
                value: z.string().url({ message: "Please enter a valid URL." }),
            })
        )
        .optional(),
});

// types for form values
type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API. Default values for the form fields.
const defaultValues: Partial<ProfileFormValues> = {
    name: "",
    phone: "",
    message: "",
};

// handle file upload


// ---------------------------------------------------------

const ContactForm = () => {
    // Function for when to check if the form is valid
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: "onChange",
    });

    // testing use state
    const [loading, setLoading] = useState(false);

    // function to submit the form
    const submitForm = async (data: ProfileFormValues) => {
        toast({
            title: "Hold on!",
        });

        setLoading(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Error sending phone");
            }

            const responseData = await response.json();
            // Handle response data as needed

            // Add toast here
            toast({
                variant: "default",
                title: "Message sent!",
                description: "We'll get back to you soon.",
            });

            // set loading to false
            setLoading(false);

            // reset the form
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Message not sent!",
                description: "We'll fix the problem ASAP.",
            });
            // Handle error as needed
        }
    };

    function setFile(arg0: File): void {
        throw new Error("Function not implemented.");
    }

    return (
        <div id="contact">
            <Form {...form}>
                {/* What to do on submit/ the Form comp wraps the original form */}
                <div className="w-full">
                    <div className="grid grid-cols-1 gap-3 mx-auto">
                        <div
                            className={cn(
                                "group relative p-8 rounded-xl overflow-hidden transition-all duration-300",
                                "hover:-translate-y-0.5 will-change-transform",
                                "col-span-1",
                                "md:col-span-2",
                            )}
                        >
                            <form onSubmit={form.handleSubmit(submitForm)} className="space-y-5 pt-6 text-xs sm:text-base text-zinc-500 body">
                                {/* Single form field/ Name/ Formfield is self closing */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            {/* Give a lable for the form field */}
                                            <FormLabel className="text-zinc-900">Nama</FormLabel>

                                            {/* Input field */}
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Tulis nama Anda"
                                                    autoComplete="true"
                                                    className="bg-white font-semibold"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-zinc-900">No. Telp</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="phone"
                                                    placeholder="Tulis nomor telepon Anda"
                                                    autoComplete="true"
                                                    className="bg-white font-semibold"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-zinc-900">Pesan</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tulis saran dan masukan"
                                                    className="resize-none bg-white font-semibold"
                                                    {...field}
                                                    autoComplete="true"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Submit button */}
                                <ButtonKirim type="submit" disabled={loading} />

                            </form>
                        </div>
                    </div>

                </div>
            </Form >
        </div>
    );
};

export default ContactForm;