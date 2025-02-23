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

export default function Page() {

    const router = useRouter();

    const [accountInfo, setAccountInfo] = useState({
        email: "",
        password: ""
    });

    function handleAccountCreate(){
        console.log("Create Account");
        router.push("/");
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
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            
                                            value={accountInfo.email}
                                            onChange={(e) => setAccountInfo({...accountInfo, email: e.target.value})}
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
