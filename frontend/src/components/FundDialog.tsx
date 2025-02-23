"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from 'qrcode.react';

import { Copy } from "lucide-react"

export interface Wallet {
    wallet_id: string;
    amount: string;
}

export default function FundDialog({ wallet }: { wallet: Wallet | null }) {

    async function handleCopy(e : React.MouseEvent) {
        e.preventDefault();
        if (wallet === null) return;
        await navigator.clipboard.writeText("hello");
        console.log("Copied to clipboard");
    }

    function handleRedirect(){
        window.open("https://near-faucet.io", "_blank");
    }

    if (wallet === null) {
        return (
            <>
                <div className="flex flex-col items-center space-x-2 py-16 gap-3">
                    <h3>Something went wrong</h3>
                </div>
            </>
        )
    }

    return (
        <>
            <DialogHeader className="flex flex-col items-start">
                <DialogTitle>Fund your account</DialogTitle>
                <DialogDescription className="text-left my-5">
                    You can fund any of your wallets we will manage it for you.
                    But, let's start with this one.
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4">
                <div className="mb-4">
                    <QRCodeSVG value={"https://near-faucet.io"}/>
                </div>
                <Button className="mt-1" onClick={handleRedirect}>Go to Exchange</Button>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="wallet_id" className="sr-only">
                            Wallet ID
                        </Label>
                        <Input
                            id="wallet_id"
                            readOnly
                            value={wallet.wallet_id}
                        />
                    </div>
                    <Button type="submit" size="sm" className="px-3">
                        <span className="sr-only">Copy</span>
                        <Copy onClick={(e) => handleCopy(e)}/>
                    </Button>
                </div>
            </div>
            <DialogFooter className="flex justify-start">
                <DialogClose asChild>
                    <Button className="w-20">Close</Button>
                </DialogClose>
            </DialogFooter>
        </>
    )
}