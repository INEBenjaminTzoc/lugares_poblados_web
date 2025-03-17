import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { user, password } = await request.json();

    try {
        const [rows]: any = await pool.execute(`
                SELECT 
                    u.idusuario, 
                    u.clave,
                    u.usuario, 
                    u.id_personal, 
                    u.estado, 
                    u.tipo_usuario,
                    p.nombre AS personal_nombre
                FROM usuario u
                JOIN personal p ON u.id_personal
                WHERE u.usuario = '${user}'
                AND u.estado = 'Activo'
        `);

        const existingUser = rows[0];

        if (!existingUser)
            return NextResponse.json({ code: 404, error: "Usuario no encontrado" });
        
        if (existingUser.clave !== password)
            return NextResponse.json({ code: 401, error: "Credenciales inválidas" });

        return NextResponse.json({ code: 200, userData: existingUser })
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ code: 500, error });
    }

}