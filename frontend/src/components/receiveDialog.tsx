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

export default function ReceiveDialog() {

    return (
        <>
            <DialogHeader className="flex flex-col items-start">
                <DialogTitle>Your QR</DialogTitle>
                <DialogDescription>
                    Tell the sender to scan this QR code to send you money
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center space-x-2 py-10 gap-3">
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
                    <Button className="w-20">Close</Button>
                </DialogClose>
            </DialogFooter>
        </>
    )
}