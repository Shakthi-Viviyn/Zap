"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios";

export default function Page() {

    const router = useRouter();

    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: ""
    });

    async function handleLogin(){
        let resp = await axios.post(`http://localhost:8000/api/login`, loginInfo);
        if (resp.status === 200){
            router.push("/main");
            return;
        }
        console.log("Failed to create account");
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Login</CardTitle>
                            <CardDescription>
                                Enter your info below to access your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="eg. john@example.com"
                                            value={loginInfo.email}
                                            onChange={(e) => setLoginInfo({...loginInfo, email: e.target.value})}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                        </div>
                                        <Input 
                                            id="password" 
                                            type="password" 
                                            value={loginInfo.password}
                                            onChange={(e) => setLoginInfo({...loginInfo, password: e.target.value})} 
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" onClick={handleLogin}>
                                        Login
                                    </Button>
                                </div>
                                <div className="mt-4 text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <a href="/signup" className="underline underline-offset-4">
                                        Sign up
                                    </a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
