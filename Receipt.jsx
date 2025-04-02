import { Card } from "@/components/ui/card"

export default function Component() {
  return (
    <Card className="max-w-4xl mx-auto p-6 print:p-0 print:shadow-none">
      <div className="border rounded-lg p-4 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-muted rounded-full" />
            <div className="text-lg font-semibold leading-tight">
              DTU INNOVATION AND INCUBATION FOUNDATION DTU DELHI-42
              <div className="font-medium text-base">LEAVE AND LICENSE CUM RENT RECEIPT</div>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="font-medium">RECIEPT No. 112/23</div>
            <div>DATE: 10.09.2023</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-2 gap-4 border-b pb-4">
          <div className="space-y-2">
            <div className="font-semibold">STARTUP/FOUNDER NAME:</div>
            <div className="space-y-1">
              <div>AMAN VIRMANI</div>
              <div>XOID TECHNOLOGIES PVT. LTD.</div>
              <div>DELHI</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="font-semibold">SPACE ALLOTED:</div>
            <div className="space-y-1">
              <div>ROOM NO. 811 B,</div>
              <div>BUILDING NO. AB-4, FLOOR NO. 8</div>
              <div>CO-WORKING SPACE, INCUBATION CENTRE</div>
              <div>DTU-IIF DTU DELHI-110042</div>
            </div>
          </div>
        </div>

        {/* Amount Section */}
        <div className="grid grid-cols-1 gap-2 border-b pb-4">
          <div className="grid grid-cols-3 border-b">
            <div className="font-semibold p-2">AMOUNT</div>
            <div className="col-span-2 p-2 font-bold">RS.16000/-</div>
          </div>
          <div className="grid grid-cols-3 border-b">
            <div className="font-semibold p-2">AMOUNT IN WORDS</div>
            <div className="col-span-2 p-2">RUPPEES: SIXTEEN THOUSAND ONLY</div>
          </div>
          <div className="grid grid-cols-3 border-b">
            <div className="font-semibold p-2">RENT FOR PROPERTY</div>
            <div className="col-span-2 p-2">ROOM NO. 811 B</div>
          </div>
        </div>

        {/* Rental Period */}
        <div className="grid grid-cols-4 gap-2 border-b pb-4">
          <div className="font-semibold">RENTAL PERIOD</div>
          <div className="text-center">FROM<br />SEPT. 01, 2023</div>
          <div className="text-center">TO<br />SEPT. 30, 2023</div>
          <div></div>
        </div>

        {/* Payment Method */}
        <div className="grid grid-cols-4 gap-2 border-b pb-4">
          <div className="font-semibold">PAYMENT BY</div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" /> Cash
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" /> Credit Card
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" /> E PAYMENT
          </div>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="text-center">
            <div>AMAN VIRMANI</div>
            <div className="font-semibold mt-2">PAID BY</div>
          </div>
          <div className="text-center">
            <div>RECEIVED BY DTU-IIF</div>
            <div className="font-semibold mt-2">RECEIVED BY</div>
          </div>
          <div className="text-center">
            <div>INCUBATION MANAGER</div>
            <div className="font-semibold mt-2">AUTHORIZED BY</div>
          </div>
        </div>

        <div className="text-center text-sm italic pt-4">
          THANK YOU FOR YOUR BUSINESS
        </div>
      </div>
    </Card>
  )
}