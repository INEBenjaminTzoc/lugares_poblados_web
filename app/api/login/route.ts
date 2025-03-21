import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { serialize } from "cookie";
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
    const { user, password } = await request.json();

    try {
        const [rows]: any = await pool.execute(`
            SELECT 
                u.idusuario as ID, 
                u.usuario as Usuario, 
                u.clave as Clave, 
                u.estado as Estado,
                p.nombre as Nombre, 
                u.tipo_usuario as Tipo 
            FROM usuario u 
            INNER JOIN personal p ON p.idpersonal = u.id_personal 
            WHERE usuario = '${user}' LIMIT 1;
        `);

        const existingUser = rows[0];

        const isValidPassword = await bcrypt.compare(password, existingUser.Clave);

        if (!existingUser)
            return NextResponse.json({ code: 404, error: "Usuario no encontrado" });
        
        if (!isValidPassword)
            return NextResponse.json({ code: 401, error: "Credenciales inválidas" });

        const cookie = serialize("user_role", existingUser.Tipo, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/"
        });

        const response = NextResponse.json({ code: 200, userData: existingUser });
        response.headers.set("Set-Cookie", cookie);

        return response;
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ code: 500, error });
    }

}