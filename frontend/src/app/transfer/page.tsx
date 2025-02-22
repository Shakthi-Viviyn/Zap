"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function Transfer() {
    const [amount, setAmount] = useState("");

    return ( 
        <div className="flex flex-col min-h-screen p-5">
            {/* Top Section: Back Button */}
            <div className="top-section">
                <Link href="/">
                    <Button variant="outline" size="sm">← Back</Button>
                </Link>
            </div>

            {/* Middle Section: Amount Input */}
            <div className="mid-section flex flex-col items-center justify-center flex-grow">
                <div className="flex items-center border border-gray-300 rounded-lg p-3 w-full max-w-md">
                    <Image src="/near.webp" width={60} height={60} alt="Currency" />
                    <Input
                        type="number"
                        placeholder="100.00"
                        inputMode="numeric"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="border-none h-15 outline-none shadow-none text-4xl ml-2 w-full "
                    />
                </div>
            </div>

            {/* Bottom Section: Next Button */}
            <div className="btm-section">
                <Button className="w-full h-15 py-4 text-lg">Continue</Button>
            </div>
        </div>
    )
}
