"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react";
import Image from 'next/image'
import { useRouter } from "next/navigation";

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
import ReceiveDialog from "@/components/receiveDialog";
import SendDialog from "@/components/sendDialog";


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

  const [openDialogName, setOpenDialogName] = useState("");

  return (
    <div className="p-5">
        <div className="flex flex-row items-center">
          <h4 className="text-md ml-3">@harsh</h4>
          <div className="ml-auto flex flex-row gap-2">
                <Button className="w-20" onClick={() => setOpenDialogName("Send")}>Send</Button>
                <Button className="w-20" onClick={() => setOpenDialogName("Receive")}>Receive</Button>
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
        <Dialog open={openDialogName === "Receive"} onOpenChange={() => setOpenDialogName("")}>
          <DialogContent className="w-3/4 rounded-lg">
            <ReceiveDialog />
          </DialogContent>
        </Dialog>
        <Dialog open={openDialogName === "Send"} onOpenChange={() => setOpenDialogName("")}>
          <DialogContent className="w-3/4 rounded-lg">
            <SendDialog setOpenDialogName={setOpenDialogName}/>
          </DialogContent>
        </Dialog>
    </div>
  )
}