"use client"

import * as React from "react"
import {
  Database,
  House,
  MapPinHouse,
  MapPinned,
  NotebookPen,
  TableProperties,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import INE from "@/public/img/INE.png"

const data = {
  navMain: [
    {
      title: "Departamentos",
      url: "#",
      icon: MapPinned,
      items: [
        {
          title: "Listar Departamentos",
          url: "/inicio/departamentos",
        }
      ],
    },
    {
      title: "Municipios",
      url: "#",
      icon: MapPinHouse,
      items: [
        {
          title: "Listar Municipios",
          url: "/inicio/municipios/listar-municipios",
        },
        {
          title: "Detalle Aldeas, Caserios",
          url: "/inicio/municipios/detalle-aldeas-caserios",
        },
        {
          title: "Detalle Todas las Categorías",
          url: "/inicio/municipios/detalle-todas-categorias",
        },
      ],
    },
    {
      title: "Lugares Poblados",
      url: "#",
      icon: House,
      items: [
        {
          title: "Listar Según Categorías",
          url: "/inicio/lugares-poblados/listar-segun-categorias",
        },
        {
          title: "Listar Según Categorías 2002",
          url: "/inicio/lugares-poblados/listar-segun-categorias-2002",
        },
        {
          title: "Listar Todos los Lugares Poblados 2018",
          url: "/inicio/lugares-poblados/listar-todos-lugares-poblados-2018",
        },
        {
          title: "Listar Aldeas y Caserios Totales",
          url: "/inicio/lugares-poblados/listar-aldeas-caserios-totales",
        },
        {
          title: "Historial de Lugar Poblado",
          url: "/inicio/lugares-poblados/historial-lugares-poblados",
        },
      ],
    },
    {
      title: "Bases de Datos",
      url: "#",
      icon: Database,
      items: [
        {
          title: "Totales 2018 - 2002",
          url: "/inicio/bases-de-datos/totales-2018-2002",
        },
        {
          title: "Totales 2002",
          url: "/inicio/bases-de-datos/totales-2002",
        },
      ],
    },
    {
      title: "Bitácora",
      url: "#",
      icon: NotebookPen,
      items: [
        {
          title: "Listar Bitácora por Usuario",
          url: "/inicio/bitacora/listar-bitacora-usuario",
        },
        {
          title: "Listar Bitácora por Fecha",
          url: "/inicio/bitacora/listar-bitacora-fechas",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Mapa Interactivo",
      url: "/inicio/mapa-interactivo",
      icon: MapPinned,
    },
    {
      title: "Multiples Observaciones",
      url: "/inicio/multiples-observaciones",
      icon: TableProperties,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [usuario, setUsuario] = React.useState<string>("");
  const [tipoUsuario, setTipoUsuario] = React.useState<string>("");

  React.useEffect(() => {
    setUsuario(String(localStorage.getItem('usuario')));
    setTipoUsuario(String(localStorage.getItem('tipo_usuario')));
  }, [])

  const filteredNavMain = 
    tipoUsuario === "DIGITALIZADOR"
      ? [
        {
          title: "Municipios",
          url: "#",
          icon: MapPinHouse,
          items: [
            {
              title: "Listar Municipios",
              url: "/inicio/municipios/listar-municipios",
            },
          ],
        },
        {
          title: "Lugares Poblados",
          url: "#",
          icon: House,
          items: [
            {
              title: "Listar Según Categorías",
              url: "/inicio/lugares-poblados/listar-segun-categorias",
            },
            {
              title: "Listar Según Categorías 2002",
              url: "/inicio/lugares-poblados/listar-segun-categorias-2002",
            },
            {
              title: "Listar Aldeas y Caserios Totales",
              url: "/inicio/lugares-poblados/listar-aldeas-caserios-totales",
            },
          ],
        },
      ]
    : data.navMain;

  const filteredNavSecondary = 
    tipoUsuario === "DIGITALIZADOR"
      ? [
        {
          title: "Multiples Observaciones",
          url: "/inicio/multiples-observaciones",
          icon: TableProperties,
        },
      ]
    : data.navSecondary;

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                  <Image src={INE} alt="INE" className="w-[40px]! h-[36px]!" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Lugares Poblados</span>
                  <span className="truncate text-xs">Sistema Administrativo</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavSecondary items={filteredNavSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{usuario: usuario, tipo_usuario: tipoUsuario}} />
      </SidebarFooter>
    </Sidebar>
  )
}
