import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("accessToken")?.value;
    const role = req.cookies.get("role")?.value;

    if (!accessToken) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (req.nextUrl.pathname === "/" && role) {
        const redirectPath = role === "pemilik" ? "/pemilik/dashboard" : "/staf/dashboard";
        return NextResponse.redirect(new URL(redirectPath, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/pemilik/dashboard", "/staf/dashboard"],
};
