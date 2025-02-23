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

export default function ReceiveDialog({ username }: { username: string }) {

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
                    <QRCodeSVG value={`${window.location.href.split('?')[0]}?sender=${username}`} />
                </div>
                <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">
                        Handle
                    </Label>
                    <Input
                        id="link"
                        defaultValue="@harsh"
                        readOnly
                        value={`@${username}`}
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