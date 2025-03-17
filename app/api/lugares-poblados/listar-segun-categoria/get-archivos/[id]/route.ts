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
				P.id AS ID_LugarPoblado,
				P.nombre AS Lugar_Poblado,
				D.id AS ID_Departamento,
				D.nombre AS Departamento,
				M.id AS ID_Municipio,
				M.nombre AS Municipio,
				AL.idarchivos_lug_pob AS ID_Archivo,
				AL.tipo_archivo AS Tipo_Archivo,
				AL.numero AS Numero,
				AL.fecha AS Fecha,
				AL.observaciones AS Observacion
			FROM archivos_lug_pob AL
			JOIN lugar_poblado P ON AL.id_lug_pob = P.id
			JOIN municipio M ON P.cod_municipio = M.id
            JOIN departamento D ON M.departamento_id = D.id
			WHERE AL.id_lug_pob =${id}
        `);

        return NextResponse.json({ code: 200, archivosDisponibles: rows });
    } catch (error) {
        return NextResponse.json({ code: 500, error })
    }
}