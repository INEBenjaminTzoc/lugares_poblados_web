import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { usuario } = await request.json();
    
    try {
        const [bitacoraCreacion] = await pool.execute<RowDataPacket[]>(`
            SELECT 
                nombre as Nombre, 
                cod_municipio as CodMupio, 
                cod_categoria as CodCategoria,
                usuario_c as UsuarioC, 
                usuario_u as UsuarioM, 
                horaYfecha_anterior as FechaC, 
                horaYfecha_actual as FechaM,
                transaccion as Accion, 
                cod_estado as CodEstado, 
                observacion as Observacion,
                FechaTransaccion 
            FROM bitacora 
            WHERE usuario_c = '${usuario}' 
            AND usuario_u <> '${usuario}'
        `);

        const [bitacoraModificacion] = await pool.execute(`
            SELECT 
                nombre as Nombre, 
                cod_municipio as CodMupio, 
                cod_categoria as CodCategoria,
                usuario_c as UsuarioC, 
                usuario_u as UsuarioM, 
                horaYfecha_anterior as FechaC, 
                horaYfecha_actual as FechaM,
                transaccion as Accion, 
                cod_estado as CodEstado, 
                observacion as Observacion 
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

