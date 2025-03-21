import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { fechaInicio, fechaFin } = await request.json();
    
    try {
        const [bitacoraFechas] = await pool.execute<RowDataPacket[]>(`
            SELECT 
                transaccion AS Accion,
                cod_municipio AS CodMupio,
                nombre as Nombre, 
                cod_estado AS CodEstado,
                usuario_c as UsuarioC, 
                usuario_u as UsuarioM,
                horaYfecha_anterior as FechaC, 
                horaYfecha_actual as FechaM
            FROM bitacora 
            WHERE DATE(FechaTransaccion) >= '${fechaInicio}' 
            AND DATE(FechaTransaccion) <= '${fechaFin}'
        `);

        return NextResponse.json({ code: 200, bitacoraFechas });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ code: 500, error });
    }
}

