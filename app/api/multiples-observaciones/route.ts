import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { municipio } = await request.json();

    try {
        const [rows] = await pool.execute(`
            SELECT 
                id AS ID,
                nombre AS LugarPoblado,
                observacion AS Observacion
            FROM lugar_poblado 
            WHERE cod_municipio = ${municipio}
            ORDER BY id DESC;   
        `);

        return NextResponse.json({ code: 200, lugaresPoblados: rows });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ code: 500, error });
    }
}

export async function PUT(request: Request) {
    const { idLugarPoblado, nuevaObservacion } = await request.json();

    try {
        await pool.execute(`
            UPDATE lugar_poblado
            SET observacion = ?
            WHERE id = ?;
        `, [nuevaObservacion, idLugarPoblado]);

        return NextResponse.json({ code: 200, message: "Registro actualizado con éxito." });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ code: 500, error });
    }
}