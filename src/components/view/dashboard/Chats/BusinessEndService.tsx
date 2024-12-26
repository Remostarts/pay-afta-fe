import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Star } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  rating: z.number().min(0).max(5),
  feedback: z.string().max(40, 'Feedback must not exceed 40 characters'),
});

type FormValues = z.infer<typeof formSchema>;

function BusinessEndService() {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      feedback: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex-1 text-white">
          End Service
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6 sm:max-w-[425px]">
        <DialogTitle>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-gray-100">
              <div className="size-4 rounded-full bg-gray-300" />
            </div>
            <div>
              <h3 className="text-base font-medium">Lorem ipsum dolor sit amet</h3>
              <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet consectetur.</p>
            </div>
          </div>
        </DialogTitle>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Your Ratings</span>
              <span className="text-sm text-gray-500">{form.watch('rating')}/5</span>
            </div>

            <Controller
              name="rating"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => {
                        field.onChange(field.value === star ? 0 : star);
                      }}
                      className={`flex size-12 items-center justify-center rounded-lg border ${
                        star <= field.value ? 'bg-yellow-50' : 'bg-gray-50'
                      }`}
                    >
                      <Star
                        className={`size-6 ${
                          star <= field.value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          <div className="mt-6">
            <h4 className="mb-2 text-sm font-medium">Lorem ipsum dolor sit amet</h4>
            <Controller
              name="feedback"
              control={form.control}
              render={({ field }) => (
                <>
                  <Textarea
                    {...field}
                    placeholder="Lorem ipsum dolor sit amet consectetur. Sed egestas mattis facilisis fermentum sit viverra non sit arcu. Ornare faucibus sed velit."
                    className="min-h-[100px] resize-none"
                  />
                  <div className="mt-1 flex justify-between">
                    <span className="text-sm text-red-500">
                      {form.formState.errors.feedback?.message}
                    </span>
                    <span className="text-sm text-gray-500">{field.value.length}/40</span>
                  </div>
                </>
              )}
            />
          </div>

          <Button
            type="submit"
            className="mt-4 w-full bg-orange-500 text-white hover:bg-orange-600"
          >
            End Service
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default BusinessEndService;
