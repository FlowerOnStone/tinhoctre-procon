'use client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

const SearchSchema = z.object({
  name: z.string(),
  orderBy: z.string(),
});

export default function TournamentSearch() {
  const router = useRouter();
  const form = useForm<z.infer<typeof SearchSchema>>({
    resolver: zodResolver(SearchSchema),
    defaultValues: {
      name: '',
      orderBy: '',
    },
  });

  function onSubmit(data: z.infer<typeof SearchSchema>) {
    if (data.name !== '' || data.orderBy !== '') {
      let query = '';
      if (data.name !== '') {
        query += `name=${data.name}`;

        if (data.orderBy !== '') {
          query += `&orderBy=${data.orderBy}`;
        }
      } else if (data.orderBy !== '') {
        query += `orderBy=${data.orderBy}`;
      }
      router.replace(`/tournaments?${query}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Tournament Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Search Tournament" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="orderBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="min-w-36">OrderBy</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="grid w-full justify-items-end">
            <Button type="submit">Search</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
