"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "ContentType": "application/json" },
        body: JSON.stringify({user, password})
      });

      const data = await response.json();

      if (data.code !== 200) {
        toast.error("Error al iniciar sesión");
        return;
      }

      toast.success("Inicio de sesión exitoso");
      localStorage.setItem('usuario', data.userData.usuario);
      localStorage.setItem('tipo_usuario', data.userData.tipo_usuario);

      router.push("/inicio");

    } 
    catch (error: Error | any) 
    {
      toast.error(`Error al iniciar sesión: ${error.message}`)
    }
  }
  
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
        {error && <p className="text-red-600 text-sm text-balance">
          { "Error al inciar sesión: " + error }
        </p>}
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="user">Usuario</Label>
          <Input 
            id="user" 
            type="text" 
            value={user} 
            onChange={(e) => setUser(e.target.value)} 
            required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Contraseña</Label>
          </div>
          <Input 
            id="password" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />
        </div>
        <Button type="submit" className="w-full">Login</Button>
      </div>
    </form>
  )
}
