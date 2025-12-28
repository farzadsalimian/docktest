"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { InventoryItem } from '@/lib/types';

const formSchema = z.object({
  itemId: z.string().min(1, { message: 'لطفا یک کالا را انتخاب کنید.' }),
  quantity: z.coerce
    .number()
    .int()
    .positive({ message: 'تعداد باید یک عدد مثبت باشد.' }),
  recipient: z
    .string()
    .min(2, { message: 'نام گیرنده باید حداقل ۲ حرف باشد.' }),
});

type StockOutFormValues = z.infer<typeof formSchema>;

interface StockOutDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onStockOut: (itemId: string, quantity: number, recipient: string) => void;
  inventory: InventoryItem[];
}

export function StockOutDialog({
  isOpen,
  onOpenChange,
  onStockOut,
  inventory,
}: StockOutDialogProps) {
  const form = useForm<StockOutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemId: '',
      quantity: 1,
      recipient: '',
    },
  });

  const selectedItemId = form.watch('itemId');

  useEffect(() => {
    form.reset({
      itemId: '',
      quantity: 1,
      recipient: '',
    });
  }, [isOpen, form]);

  const onSubmit = (values: StockOutFormValues) => {
    const selectedItem = inventory.find((item) => item.id === values.itemId);
    if (selectedItem && selectedItem.quantity < values.quantity) {
      form.setError('quantity', {
        type: 'manual',
        message: `موجودی کافی نیست. موجودی فعلی: ${selectedItem.quantity}`,
      });
      return;
    }
    onStockOut(values.itemId, values.quantity, values.recipient);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ثبت خروجی کالا</DialogTitle>
          <DialogDescription>
            اطلاعات کالای خروجی از انبار را وارد کنید.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="itemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام کالا</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    dir="rtl"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="یک کالا را انتخاب کنید" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {inventory.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} (موجودی: {item.quantity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تعداد</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>گیرنده</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: مشتری الف" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={!selectedItemId}>ثبت</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
