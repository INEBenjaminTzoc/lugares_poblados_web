import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    let role = request.cookies.get('user_role');

    if (request.nextUrl.pathname.includes('/inicio')) {
        if (!role)
            return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/auth/login')) {
        if (role) {
            return NextResponse.redirect(new URL('/inicio', request.url));
        }
    }
    
    if (request.nextUrl.pathname.includes('inicio/departamentos')) {
        if (role) {
            const user = role;
            if (user.value === 'DIGITALIZADOR')
                return NextResponse.redirect(new URL('/inicio/municipios/listar-municipios', request.url))
        }
    }
    
    return NextResponse.next();
}