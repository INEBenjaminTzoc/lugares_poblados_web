import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id || isNaN(Number(id))) {
        return NextResponse.json({ code: 400, error: "ID inválido" });
    }

    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`
            SELECT ArchivopdfCertificacion AS ArchivoBase64 
            FROM archivos_lug_pob 
            WHERE idarchivos_lug_pob = ${id}
        `);
        const fileBuffer = rows[0].ArchivoBase64;
        const base64 = fileBuffer.toString('base64');

        return NextResponse.json({ code: 200, ArchivoBase64: base64 });
    } catch (error) {
        return NextResponse.json({ code: 500, error });
    }
}