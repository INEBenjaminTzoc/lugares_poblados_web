import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                u.idusuario AS idUsuario,
                p.nombre AS Nombre, 
                u.tipo_usuario AS Puesto
            FROM usuario u
            INNER JOIN personal p ON p.idpersonal = u.id_personal    
        `);

        return NextResponse.json({ code: 200, usuarios: rows })
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ code: 500, error });
    }
}