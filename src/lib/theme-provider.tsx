"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    // State to track if the component has mounted on the client side
    const [mounted, setMounted] = React.useState(false);

    // Use useEffect to set 'mounted' state to true after the first render
    React.useEffect(() => {
        setMounted(true); // This will only run on the client-side
    }, []);

    // If the component is not mounted yet, render nothing to prevent hydration issues
    if (!mounted) return <>{children}</>;

    // Once mounted, render the NextThemesProvider with the children
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
