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
import axios from "axios";
  

export default function SendDialog({ setOpenDialogName, initialHandle } : { setOpenDialogName: any, initialHandle: string }) {

    const [sendAmount, setSendAmount] = useState<number | null>(null);
    const [receiver, setReceiver] = useState<string>(initialHandle);
    const [sendFlowPage, setSendFlowPage] = useState(1);
    const senderUsername = localStorage.getItem('username');
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [willPayFee, setWillPayFee] = useState<boolean>(false);

    const handleInitiateTransaction = async () => {
        if (senderUsername && receiver && sendAmount) {
            try {
                const response = await axios.post('http://localhost:8000/api/initiateTransaction', {
                    senderUsername,     
                    receiverUsername: receiver,
                    amount: sendAmount,  
                });

                if (response.status === 200) {
                    const { will_pay_fee, transaction_id } = response.data;
                    setTransactionId(transactionId); // Store transaction ID
                    console.log('Transaction initiated:', transactionId);
                    setTransactionId(transaction_id);
                    setWillPayFee(will_pay_fee);
                    setSendFlowPage(2); // Move to the confirmation page
                } else {
                    console.error('Error initiating transaction:', response.data);
                }
            } catch (error) {
                console.error('Error initiating transaction:', error);
            }
        } else {
            console.error('Missing required fields.');
        }
    };

    const handleConfirm = async () => {
        if (transactionId && senderUsername) {
            try {
                const response = await axios.post('http://localhost:8000/api/commitTransaction', {
                    transactionId,
                    senderUsername,
                });

                if (response.status === 200) {
                    // Handle successful commit here, e.g., show success message
                    console.log('Transaction committed successfully:', response.data);
                } else {
                    console.error('Error committing transaction:', response.data);
                }
            } catch (error) {
                console.error('Error committing transaction:', error);
            }
        } else {
            console.error('Missing transaction ID or sender username.');
        }

        setOpenDialogName(""); // Close the dialog after transaction attempt
    };

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
                        <Input type="text" className="border-none outline-none shadow-none text-xl" value={receiver} onChange={(e) => setReceiver(e.target.value)}/>
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
                    <Button type="button" className="" onClick={handleInitiateTransaction}>
                        Continue
                    </Button>
                </DialogFooter>
            </>
        )
    }

    if (sendFlowPage === 2) {
        return (
            <>
                <div>
                    <Card className="mt-7 mb-5">
                        <CardHeader>
                            <CardTitle className="text-xl">Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Token: {sendAmount}</p>
                            <p>Receiver: {receiver}</p>
                            {
                                willPayFee && (
                                    <p className="mt-5 text-xs">Note: The actual transferred amount may differ due to transaction fees.</p>
                                )
                            }
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
        );
    } 
}