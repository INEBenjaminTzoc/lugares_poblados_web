import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { usuario } = await request.json();
    
    try {
        const [bitacoraCreacion] = await pool.execute<RowDataPacket[]>(`
            SELECT 
                transaccion as Accion, 
                cod_municipio as CodMupio, 
                nombre as Nombre, 
                cod_estado as CodEstado, 
                usuario_c as UsuarioC, 
                usuario_u as UsuarioM, 
                horaYfecha_anterior as FechaC, 
                horaYfecha_actual as FechaM
            FROM bitacora 
            WHERE usuario_c = '${usuario}' 
            AND usuario_u <> '${usuario}'
        `);

        const [bitacoraModificacion] = await pool.execute(`
            SELECT 
                transaccion as Accion, 
                cod_municipio as CodMupio, 
                nombre as Nombre, 
                cod_estado as CodEstado, 
                usuario_c as UsuarioC, 
                usuario_u as UsuarioM, 
                horaYfecha_anterior as FechaC, 
                horaYfecha_actual as FechaM
                FROM bitacora 
                WHERE usuario_c <> '${usuario}' 
                AND usuario_u = '${usuario}'
        `);

        return NextResponse.json({ code: 200, bitacoraCreacion, bitacoraModificacion });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ code: 500, error });
    }
}

