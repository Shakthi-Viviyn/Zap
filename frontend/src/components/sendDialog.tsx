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
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
  

export default function SendDialog({ setOpenDialogName } : { setOpenDialogName: any }) {

    const [sendAmount, setSendAmount] = useState<number | null>(null);
    const [handle, setHandle] = useState<string>("");

    const [sendFlowPage, setSendFlowPage] = useState(1);

    function handleConfirm(){
        setOpenDialogName("");
    }

    if (sendFlowPage == 1) {
        return (
            <>
                <DialogHeader className="flex flex-col items-start gap-2">
                    <DialogTitle>Send Tokens</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center space-x-2">
                <div className="mid-section flex flex-col items-center justify-center flex-grow py-10 gap-10">
                    <div className="flex items-center border border-gray-300 rounded-lg p-1 w-full max-w-md text-base shadow-sm">
                        <p className="ml-2 text-lg text-slate-400">@</p>
                        <Input type="text" className="border-none outline-none shadow-none text-xl" value={handle} onChange={(e) => setHandle(e.target.value)}/>
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-lg p-1 w-full max-w-md text-base shadow-sm">
                        <Image src="/near.webp" width={30} height={30} alt="Currency" />
                        <Input
                            type="number"
                            placeholder="0.00"
                            inputMode="numeric"
                            value={sendAmount?.toLocaleString()}
                            onChange={(e) => setSendAmount(parseFloat(e.target.value))}
                            className="border-none outline-none shadow-none text-xl ml-2"
                        />
                    </div>
                </div>
                </div>
                <DialogFooter className="flex justify-start">
                    <Button type="button" className="" onClick={() => setSendFlowPage(2)}>
                        Continue
                    </Button>
                </DialogFooter>
            </>
        )
    }

    if (sendFlowPage == 2){
        return (
            <>
                <div>
                    <Card className="mt-7 mb-5">
                        <CardHeader>
                            <CardTitle className="text-xl">Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Token: 2.5</p>
                            <p>Reciever: @harsh</p>
                            <p className="mt-3">Gas Fee: 0.01</p>
                            <p className="mt-1 text-xs">Note: We need to split one of your wallets</p>
                        </CardContent>
                    </Card>
                </div>
                <DialogFooter className="flex flex-row gap-2">
                    <DialogClose asChild>
                        <Button type="button" className="w-full" variant={"outline"}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="button" className="w-full" onClick={handleConfirm}>
                        Confirm
                    </Button>
                </DialogFooter>
            </>
        )
    } 
}