"use client";

import { useState } from 'react';
import {
  Bot,
  Package,
  PackageMinus,
  PackagePlus,
  Warehouse,
} from 'lucide-react';

import type { InventoryItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StockInDialog } from '@/app/components/stock-in-dialog';
import { StockOutDialog } from '@/app/components/stock-out-dialog';
import { AiChatPanel } from '@/app/components/ai-chat-panel';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';

const initialInventory: InventoryItem[] = [
  { id: 'item-1', name: 'لپ تاپ ۱۵ اینچ', quantity: 25, supplier: 'تامین کننده الف' },
  { id: 'item-2', name: 'ماوس بی‌سیم', quantity: 150, supplier: 'تامین کننده ب' },
  { id: 'item-3', name: 'کیبورد مکانیکی', quantity: 75, supplier: 'تامین کننده الف' },
  { id: 'item-4', name: 'مانیتور ۲۷ اینچ', quantity: 40, supplier: 'تامین کننده ج' },
  { id: 'item-5', name: 'هارد اکسترنال ۱ ترابایت', quantity: 60, supplier: 'تامین کننده ب' },
];

export default function Home() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [showInventory, setShowInventory] = useState(true);
  const [isStockInOpen, setStockInOpen] = useState(false);
  const [isStockOutOpen, setStockOutOpen] = useState(false);
  const [isAiChatOpen, setAiChatOpen] = useState(false);
  const { toast } = useToast();

  const handleStockIn = (newItem: Omit<InventoryItem, 'id'>) => {
    setInventory((prev) => {
      const existingItem = prev.find((item) => item.name === newItem.name && item.supplier === newItem.supplier);
      if (existingItem) {
        return prev.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [
        ...prev,
        { ...newItem, id: `item-${Date.now()}-${Math.random()}` },
      ];
    });
    toast({
      title: 'موفقیت‌آمیز',
      description: `کالای '${newItem.name}' با موفقیت به انبار اضافه شد.`,
    });
  };

  const handleStockOut = (
    itemId: string,
    quantity: number,
    recipient: string
  ) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: item.quantity - quantity }
          : item
      )
    );
     toast({
      title: 'موفقیت‌آمیز',
      description: `${quantity} عدد کالا با موفقیت از انبار خارج شد.`,
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6 text-primary" />
          <span className="text-xl">StockPilot</span>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ورودی انبار</CardTitle>
              <PackagePlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => setStockInOpen(true)}
              >
                ثبت ورودی
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">خروجی انبار</CardTitle>
              <PackageMinus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => setStockOutOpen(true)}
              >
                ثبت خروجی
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">موجودی انبار</CardTitle>
              <Warehouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowInventory(!showInventory)}
              >
                {showInventory ? 'مخفی کردن' : 'نمایش'} موجودی
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">چت با ایجنت</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setAiChatOpen(true)}
              >
                شروع چت
              </Button>
            </CardContent>
          </Card>
        </div>
        <AnimatePresence>
          {showInventory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>خلاصه موجودی</CardTitle>
                  <CardDescription>
                    لیست فعلی کالاهای موجود در انبار.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>نام کالا</TableHead>
                        <TableHead>تامین‌کننده</TableHead>
                        <TableHead className="text-center">تعداد</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventory.length > 0 ? (
                        inventory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              {item.name}
                            </TableCell>
                            <TableCell>{item.supplier}</TableCell>
                            <TableCell className="text-center">
                              {item.quantity}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="h-24 text-center"
                          >
                            هیچ کالایی یافت نشد.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <StockInDialog
        isOpen={isStockInOpen}
        onOpenChange={setStockInOpen}
        onStockIn={handleStockIn}
      />
      <StockOutDialog
        isOpen={isStockOutOpen}
        onOpenChange={setStockOutOpen}
        onStockOut={handleStockOut}
        inventory={inventory}
      />
      <AiChatPanel isOpen={isAiChatOpen} onOpenChange={setAiChatOpen} />
    </div>
  );
}
