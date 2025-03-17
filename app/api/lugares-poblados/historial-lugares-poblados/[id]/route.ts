import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id || isNaN(Number(id))) {
        return NextResponse.json({ code: 400, error: "ID inválido" });
    }

    try {
        const [rows] = await pool.execute(`
            SELECT
                transaccion AS Accion,
                cod_categoria AS CodCategoria,
                cod_estado AS CodEstado,
                cod_municipio AS CodMupio,
                horaYfecha_actual AS FechaC,
                horaYfecha_anterior AS FechaM,
                nombre AS Nombre,
                observacion AS Observacion,
                usuario_c AS UsuarioC,
                usuario_u AS UsuarioM
            FROM bitacora
            WHERE id = ${parseInt(id)}
        `);

        return NextResponse.json({ code: 200, historial: rows });
    } catch (error) {
        return NextResponse.json({ code: 500, error })
    }
}