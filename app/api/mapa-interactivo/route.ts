import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { idDepartamento } = await request.json();

    try {
        const [rows] = await pool.execute(`
            SELECT 
                m.id AS CodigoMunicipio, 
                m.nombre AS Municipio, 
                m.estado AS Estado,
                sum(if(cat.idcategoria= '1', 1,0)) AS Ciudades,
                sum(if(cat.idcategoria= '2', 1,0)) AS Pueblos,
                sum(if(cat.idcategoria= '3', 1,0)) AS Residencias,
                sum(if((cat.idcategoria= '4') and (lp.cod_estado in (1,2,6) or (lp.cod_estado=5 and lp.estado = 'Y')), 1,0)) AS Aldeas,
                sum(if(cat.idcategoria= '5', 1,0)) AS Colonias,
                sum(if((cat.idcategoria= '6') and (lp.cod_estado in (1,2,6) or (lp.cod_estado=5 and lp.estado = 'Y')), 1,0)) AS Caserios,
                sum(if(cat.idcategoria= '7', 1,0)) AS Fincas,
                sum(if(cat.idcategoria= '8', 1,0)) AS Condominios,
                sum(if(cat.idcategoria= '9', 1,0)) AS Asentamientos,
                sum(if(cat.idcategoria= '10', 1,0)) AS Cantones,
                sum(if(cat.idcategoria= '11', 1,0)) AS Granjas,
                sum(if(cat.idcategoria= '12', 1,0)) AS Lotificaciones,
                sum(if(cat.idcategoria= '13', 1,0)) AS Otros,
                sum(if(cat.idcategoria= '14', 1,0)) AS Haciendas,
                sum(if(cat.idcategoria= '15', 1,0)) AS Parajes,
                sum(if(cat.idcategoria= '16', 1,0)) AS Labores,
                sum(if(cat.idcategoria= '17', 1,0)) AS Villas,
                sum(if(cat.idcategoria= '18', 1,0)) AS Parcelamientos,
                sum(if(cat.idcategoria= '19', 1,0)) AS Barrios,
                sum(if(cat.idcategoria= '20', 1,0)) AS Comunidades,
                sum(if(cat.idcategoria= '21', 1,0)) AS Rancherias,
                sum(if(cat.idcategoria= '22', 1,0)) AS ComunidadesAgrarias,
                sum(if(cat.idcategoria= '23', 1,0)) AS Microparcelamientos,
                sum(if(cat.idcategoria= '24', 1,0)) AS Guardianias,
                sum(if(cat.idcategoria= '25', 1,0)) AS Sectores,
                sum(if(cat.idcategoria= '26', 1,0)) AS Cabeceras,
                sum(if(cat.idcategoria= '27', 1,0)) AS Municipios,
                sum(if(cat.idcategoria= '28', 1,0)) AS Cooperativas,
                sum(if(cat.idcategoria= '29', 1,0)) AS Zonas,
                (sum(if(cat.idcategoria= '1', 1,0))+sum(if(cat.idcategoria= '2', 1,0))+sum(if(cat.idcategoria= '3', 1,0))+sum(if((cat.idcategoria= '4') and (lp.cod_estado in (1,2,6) or (lp.cod_estado=5 and lp.estado = 'Y')), 1,0))
                +sum(if(cat.idcategoria= '5', 1,0))+sum(if((cat.idcategoria= '6') and (lp.cod_estado in (1,2,6) or (lp.cod_estado=5 and lp.estado = 'Y')), 1,0))+sum(if(cat.idcategoria= '7', 1,0))+sum(if(cat.idcategoria= '8', 1,0))
                +sum(if(cat.idcategoria= '9', 1,0))+sum(if(cat.idcategoria= '10', 1,0))+sum(if(cat.idcategoria= '11', 1,0))+sum(if(cat.idcategoria= '12', 1,0))
                +sum(if(cat.idcategoria= '13', 1,0))+sum(if(cat.idcategoria= '14', 1,0))+sum(if(cat.idcategoria= '15', 1,0))+sum(if(cat.idcategoria= '16', 1,0))
                +sum(if(cat.idcategoria= '17', 1,0))+sum(if(cat.idcategoria= '18', 1,0))+sum(if(cat.idcategoria= '19', 1,0))+sum(if(cat.idcategoria= '20', 1,0))
                +sum(if(cat.idcategoria= '20', 1,0))+sum(if(cat.idcategoria= '21', 1,0))+sum(if(cat.idcategoria= '22', 1,0))+sum(if(cat.idcategoria= '23', 1,0))
                +sum(if(cat.idcategoria= '24', 1,0))+sum(if(cat.idcategoria= '25', 1,0))+sum(if(cat.idcategoria= '26', 1,0))+sum(if(cat.idcategoria= '27', 1,0))
                +sum(if(cat.idcategoria= '28', 1,0))+sum(if(cat.idcategoria= '29', 1,0))) as Total
            FROM departamento d 
            INNER JOIN municipio m ON d.id = m.departamento_id
            INNER JOIN lugar_poblado lp ON m.id = lp.cod_municipio
            INNER JOIN categoria cat ON cat.idcategoria = lp.cod_categoria
            WHERE d.id = ${parseInt(idDepartamento)}
            GROUP BY m.id
        `);

        return NextResponse.json({ code: 200, municipios: rows });
    } catch (error) {
        return NextResponse.json({ code: 500, error })
    }
}