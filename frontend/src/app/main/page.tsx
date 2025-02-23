// 'use client';

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useRouter, useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import ReceiveDialog from "@/components/receiveDialog";
// import SendDialog from "@/components/sendDialog";
// import Image from 'next/image';

// type Wallet = {
//   wallet_id: string;
//   amount: number;
// };

// export default function MainPage() {
//   const [wallets, setWallets] = useState<Wallet[]>([]);
//   const [totalBalance, setTotalBalance] = useState(0);
//   const [username, setUsername] = useState("");
//   const [openDialogName, setOpenDialogName] = useState("");
  
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const username = searchParams.get('username');
//     setUsername(username?.toString() || "User");

//     const fetchWallets = async () => {
//       try {
//         const resp = await axios.get('http://localhost:8000/api/wallets');
//         if (resp.status === 200) {
//           setWallets(resp.data.wallets); 
//           setTotalBalance(resp.data.totalBalance);
//         }
//       } catch (error) {
//         console.error('Error fetching wallets:', error);
//       }
//     };

//     fetchWallets();
//   }, [searchParams]);

//   return (
//     <div className="p-5">
//       {/* Greeting */}
//       <div className="flex flex-col">
//         <h1 className="text-5xl font-bold mt-5">Hi, {username}!</h1>
//       </div>

//       {/* Total Balance Card */}
//       <div className="mt-10 flex justify-center">
//         <Card className="w-96">
//           <CardHeader className="p-0">
//             <CardDescription className="p-3 pb-0">Total Balance</CardDescription>
//           </CardHeader>
//           <CardContent className="flex flex-col p-4">
//             <div className="flex items-center gap-2">
//               <Image src={"/near.webp"} width={30} height={30} alt="N" />
//               <h3 className="text-5xl font-bold">{totalBalance}</h3>
//             </div>
//             <div className="mt-4 flex flex-row gap-2 justify-center">
//               <Button className="w-1/2" onClick={() => setOpenDialogName("Send")}>Send</Button>
//               <Button className="w-1/2" onClick={() => setOpenDialogName("Receive")}>Receive</Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Wallets Section */}
//       <div className="mt-12">
//         <h2 className="text-2xl font-semibold mb-4">Wallets</h2>
//         <div className="flex flex-col gap-5 max-h-[70vh] overflow-y-scroll">
//           {wallets.map((wallet) => (
//             <Card key={wallet.wallet_id} className="p-3 px-5">
//               <CardHeader className="p-0">
//                 <CardDescription>{wallet.wallet_id}</CardDescription>
//               </CardHeader>
//               <CardContent className="flex p-0 justify-end">
//                 <div className="flex flex-row gap-1">
//                   <div className="flex justify-center items-center">
//                     <Image src={"/near.webp"} width={15} height={15} alt="N" />
//                   </div>
//                   <p>{wallet.amount}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>

//       {/* Dialogs */}
//       <Dialog open={openDialogName === "Receive"} onOpenChange={() => setOpenDialogName("")}>
//         <DialogContent className="w-3/4 rounded-lg">
//           <ReceiveDialog />
//         </DialogContent>
//       </Dialog>

//       <Dialog open={openDialogName === "Send"} onOpenChange={() => setOpenDialogName("")}>
//         <DialogContent className="w-3/4 rounded-lg">
//           <SendDialog setOpenDialogName={setOpenDialogName} />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ReceiveDialog from "@/components/receiveDialog";
import SendDialog from "@/components/sendDialog";
import Image from 'next/image';
import FundDialog from '@/components/FundDialog';
import { getAuth } from '../axios-header';

type Wallet = {
  wallet_id: string;
  amount: string;
};

export default function MainPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [username, setUsername] = useState("");
  const [openDialogName, setOpenDialogName] = useState("");
  const [activeWallet, setActiveWallet] = useState<null | Wallet>(null);
  const [initialHandle, setInitialHandle] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const senderUsername = searchParams.get('sender');
    if (senderUsername) {
      setOpenDialogName("Send");
      setInitialHandle(senderUsername);
    }
  }, [searchParams]);

  useEffect(() => {
    
    const username = localStorage.getItem("username");
    setUsername(username || "User");

    // Fetch wallet data from the /api/wallets endpoint
    const fetchWallets = async () => {
      try {
        const resp = await axios.get('http://localhost:8000/api/wallets', {headers: getAuth()});
        if (resp.status === 200) {
          setWallets(resp.data.wallets);  // Assuming response contains an array of wallets
          setTotalBalance(resp.data.totalBalance); // Assuming response contains the total balance
        }
      } catch (error) {
        console.error('Error fetching wallets:', error);
      }
    };

    fetchWallets();
  }, []);

  function handleWalletClick(i : number){
    setActiveWallet(wallets[i]);
    setOpenDialogName("Fund");
  }

  return (
    <div className="p-5">
      {/* Greeting */}
      <div className="flex flex-col">
        <h1 className="text-xl font-bold mt-5">@{username}</h1>
      </div>

      {/* Total Balance Card */}
      <div className="mt-10 flex justify-center">
        <Card className="w-96">
          <CardHeader className="p-0">
            <CardDescription className="text-center">Total Balance</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <div className="flex items-center gap-2">
              <Image src={"/near.webp"} width={30} height={30} alt="N" />
              <h3 className="text-3xl font-bold">{totalBalance}</h3>
            </div>
            <div className="mt-4 flex flex-row gap-2 justify-center">
              <Button className="w-1/2" onClick={() => setOpenDialogName("Send")}>Send</Button>
              <Button className="w-1/2" onClick={() => setOpenDialogName("Receive")}>Receive</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallets Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Wallets</h2>
        <div className="flex flex-col gap-5 max-h-[70vh] overflow-y-scroll">
          {wallets.map((wallet, i) => (
            <Card key={wallet.wallet_id} className="p-3 px-5" onClick={() => handleWalletClick(i)}>
              <CardHeader className="p-0">
                <CardDescription>{wallet.wallet_id}</CardDescription>
              </CardHeader>
              <CardContent className="flex p-0 justify-end">
                <div className="flex flex-row gap-1">
                  <div className="flex justify-center items-center">
                    <Image src={"/near.webp"} width={15} height={15} alt="N" />
                  </div>
                  <p>{wallet.amount}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={openDialogName === "Receive"} onOpenChange={() => setOpenDialogName("")}>
        <DialogContent className="w-3/4 rounded-lg">
          <ReceiveDialog username={username}/>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialogName === "Send"} onOpenChange={() => setOpenDialogName("")}>
        <DialogContent className="w-3/4 rounded-lg">
          <SendDialog setOpenDialogName={setOpenDialogName} initialHandle={initialHandle}/>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialogName === "Fund"} onOpenChange={() => setOpenDialogName("")}>
        <DialogContent className="w-3/4 rounded-lg">
          <FundDialog wallet={activeWallet}/>
        </DialogContent>
      </Dialog>
    </div>
  );
}
