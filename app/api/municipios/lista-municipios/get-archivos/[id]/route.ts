import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id || isNaN(Number(id))) {
        return NextResponse.json({ code: 400, error: "ID inválido" });
    }

    try {
        const [rows] = await pool.execute(`
            SELECT 
                D.id AS ID_Departamento,
                D.nombre AS Departamento,
                AM.id_mupio AS ID_Municipio,
                M.nombre AS Municipio,
                AM.idarchivos_mupio AS ID_Archivo,
                AM.tipo_archivo AS Tipo_Archivo, 
                AM.numero AS Numero, 
                AM.fecha AS Fecha,
                AM.observaciones AS Observacion
            FROM archivos_municipio AM
            JOIN municipio M ON AM.id_mupio = M.id
            JOIN departamento D ON M.departamento_id = D.id
            WHERE AM.id_mupio = ${parseInt(id)}
        `);

        return NextResponse.json({ code: 200, archivosDisponibles: rows });
    }
    catch (error) 
    {
        return NextResponse.json({ code: 500, error });
    }
}