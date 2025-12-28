"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
import type { InventoryItem } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(2, { message: 'نام کالا باید حداقل ۲ حرف باشد.' }),
  quantity: z.coerce
    .number()
    .int()
    .positive({ message: 'تعداد باید یک عدد مثبت باشد.' }),
  supplier: z
    .string()
    .min(2, { message: 'نام تامین‌کننده باید حداقل ۲ حرف باشد.' }),
});

type StockInFormValues = z.infer<typeof formSchema>;

interface StockInDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onStockIn: (item: Omit<InventoryItem, 'id'>) => void;
}

export function StockInDialog({
  isOpen,
  onOpenChange,
  onStockIn,
}: StockInDialogProps) {
  const form = useForm<StockInFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      quantity: 1,
      supplier: '',
    },
  });

  const onSubmit = (values: StockInFormValues) => {
    onStockIn(values);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ثبت ورودی کالا</DialogTitle>
          <DialogDescription>
            اطلاعات کالای ورودی به انبار را وارد کنید.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام کالا</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: ماوس بی‌سیم" {...field} />
                  </FormControl>
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
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تامین‌کننده</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: تامین کننده الف" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">ثبت</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
