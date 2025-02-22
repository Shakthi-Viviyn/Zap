"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react";
import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from "next/navigation";
import Link from "next/link";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default function Home() {
  const router = useRouter();
  const [balance, setBalance] = useState(100.4);
  const [wallets, setWallets] = useState([
    {
      "account_id": "nuniqdiuu8198200-12122910je09j",
      "balance": 1
    },
    {
      account_id: "nuniqdiuu8198200-12122910je09j",
      balance: 1.5
    },
    {
      account_id: "nuniqdiuu8198200-12122910je09j",
      balance: 0.5
    },
    {
      account_id: "nuniqdiuu8198200-12122910je09j",
      balance
    },
    {
      "account_id": "nuniqdiuu8198200-12122910je09j",
      "balance": 1
    },
    {
      account_id: "nuniqdiuu8198200-12122910je09j",
      balance: 1.5
    },
    {
      account_id: "nuniqdiuu8198200-12122910je09j",
      balance: 0.5
    },
    {
      account_id: "nuniqdiuu8198200-12122910je09j",
      balance
    },
    {
      "account_id": "nuniqdiuu8198200-12122910je09j",
      "balance": 1
    },
    {
      account_id: "nuniqdiuu8198200-12122910je09j",
      balance: 1.5
    },
    {
      account_id: "nuniqdiuu8198200-12122910je09j",
      balance: 0.5
    },
    {
      account_id: "nuniqdiuu8198200-12122910je09j",
      balance
    }
  ]);

  return (
    <div className="p-5">
      <Dialog>
        <div className="flex flex-row items-center">
          <h4 className="text-md ml-3">@harsh</h4>
          <div className="ml-auto flex flex-row gap-2">
              <DialogTrigger asChild>
              <Link href="/transfer">
                <Button className="w-20" onClick={() => router.push('/transfer')}>Send</Button>
                </Link>
              </DialogTrigger>
              <DialogTrigger asChild>
                <Button className="w-20">Receive</Button>
              </DialogTrigger>
          </div>
        </div>
        <div className="mt-6 ml-3 flex flex-col justify-center gap-1">
          <p>Balance</p>
          <h3 className="text-5xl font-bold">${balance}</h3>
        </div>
        <div className="mt-10 flex flex-col gap-5 max-h-[70vh] overflow-y-scroll">
          { wallets.map((wallet, i) => (
            <Card className="p-3 px-5">
              <CardHeader className="p-0">
                {/* <CardTitle>Card Title</CardTitle> */}
                <CardDescription>dnj001-k......</CardDescription>
              </CardHeader>
              <CardContent className="flex p-0 justify-end">
                <div className="flex flex-row gap-1">
                  <div className="flex justify-center items-center">
                    <Image src={"/near.webp"} width={15} height={15} alt="N"/>
                  </div>
                  <p>{wallet.balance}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <DialogContent className="w-3/4 rounded-lg">
          <DialogHeader className="flex flex-col items-start">
            <DialogTitle>Your QR</DialogTitle>
            <DialogDescription>
              Tell the sender to scan this QR code to send you money
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-x-2">
            <div className="mb-4">
              <QRCodeSVG value="@harsh" />
            </div>
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Handle
              </Label>
              <Input
                id="link"
                defaultValue="@harsh"
                readOnly
              />
            </div>
          </div>
          <DialogFooter className="flex justify-start">
            <DialogClose asChild>
              <Button type="button" className="w-20">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
