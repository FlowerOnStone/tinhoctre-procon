import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import React from 'react';

export default function TournamentsPage() {
  const data = [
    {
      id: 1,
      name: 'Tournament 1',
      description: 'This is the first tournament',
      date: '2021-01-01',
    },
    {
      id: 2,
      name: 'Tournament 2',
      description: 'This is the second tournament',
      date: '2021-01-02',
    },
    {
      id: 3,
      name: 'Tournament 3',
      description: 'This is the third tournament',
      date: '2021-01-03',
    },
  ];

  return (
    <div className="flex w-full gap-10">
      <div className="flex-[7] flex flex-col gap-5">
        {data.map((tournament) => (
          <Link key={tournament.id} href={`/tournaments/${tournament.id}`}>
            <Card>
              <CardHeader>
                <CardTitle>{tournament.name}</CardTitle>
                <CardDescription>{tournament.date}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
      <div className="flex-[3]">
        <Card>
          <CardHeader>
            <CardTitle>Tournament Search</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Name of tournament" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="orderBy">Order by</Label>
                  <Select>
                    <SelectTrigger id="orderBy">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="grid w-full justify-items-end">
            <Button>Search</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
