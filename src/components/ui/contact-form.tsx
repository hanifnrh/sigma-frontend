"use client";


import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPaperPlane } from "react-icons/fa";
import * as z from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

// form data validation using zod
const profileFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Nama setidaknya 2 karakter.",
        })
        .max(30, {
            message: "Nama tidak boleh lebih dari 30 karakter.",
        }),

    contact: z
        .string()
        .min(2, {
            message: "Pesan setidaknya 2 karakter",
        })
        .max(500, {
            message: "Pesan tidak boleh lebih dari 500 karakter.",
        }),

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
    contact: "",
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
                throw new Error("Error sending email");
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
        <Form {...form}>
            {/* What to do on submit/ the Form comp wraps the original form */}
            <form onSubmit={form.handleSubmit(submitForm)} className="space-y-5 text-xs sm:text-base">
                {/* Single form field/ Name/ Formfield is self closing */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            {/* Give a lable for the form field */}
                            <FormLabel>Nama</FormLabel>

                            {/* Input field */}
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Tulis nama Anda (bisa dikosongkan)"
                                    autoComplete="true"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Kontak</FormLabel>
                            <FormControl>
                                <Input
                                    type="contact"
                                    placeholder="Tulis kontak Anda (no. telp / email / sosial media)"
                                    autoComplete="true"
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
                            <FormLabel>Umpan balik</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tulis umpan balik Anda"
                                    className="resize-none"
                                    {...field}
                                    autoComplete="true"
                                />
                            </FormControl>
                            <FormDescription>
                                Tuliskan masukan dan umpan balik Anda di sini, kami akan menghubungi Anda jika diperlukan.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit button */}
                <div className="flex justify-center md:justify-start pt-5">
                    <Button className="text-xl p-6" type="submit" variant={'blue'} disabled={loading}>
                        Kirim <FaPaperPlane className="ml-2" />
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ContactForm;