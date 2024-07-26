'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function Tab() {
  return (
    <Tabs defaultValue="problem 1">
      <TabsList className="w-full flex justify-start" style={{ height: 50, borderRadius: 0 }}>
        <TabsTrigger
          value="problem 1"
          className="truncate justify-center"
          style={{ minWidth: 200, height: 40, borderRadius: 0 }}
        >
          Problem 1
        </TabsTrigger>
        <TabsTrigger
          value="problem 2"
          className=" truncate justify-center"
          style={{ minWidth: 200, height: 40, borderRadius: 0 }}
        >
          Problem 2
        </TabsTrigger>
      </TabsList>
      <TabsContent value="problem 1"></TabsContent>
      <TabsContent value="problem 2">
        {/* For content of problem. */}

        <div>Problem 2</div>
      </TabsContent>
    </Tabs>
  );
}
