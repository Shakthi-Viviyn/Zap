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
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page() {

    const router = useRouter();

    const [accountInfo, setAccountInfo] = useState({
        username: "",
        password: ""
    });

    async function handleAccountCreate(){
        
        let resp = await axios.post(`http://localhost:8000/api/create-user`, accountInfo);
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
                            <CardTitle className="text-2xl">Create Account</CardTitle>
                            <CardDescription>
                                Enter your email below to create an account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="eg. JohnDoe12"
                                            
                                            value={accountInfo.username}
                                            onChange={(e) => setAccountInfo({...accountInfo, username: e.target.value})}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                        </div>
                                        <Input 
                                            id="password" 
                                            type="password" 
                                            
                                            value={accountInfo.password}
                                            onChange={(e) => setAccountInfo({...accountInfo, password: e.target.value})}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" onClick={handleAccountCreate}>
                                        Create Account
                                    </Button>
                                </div>
                                <div className="mt-4 text-center text-sm">
                                    Already have an account?{" "}
                                    <a href="/login" className="underline underline-offset-4">
                                        Login
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
