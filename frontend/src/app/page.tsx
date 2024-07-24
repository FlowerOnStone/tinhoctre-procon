
import Timer from "@/components/timer/timer"

import { TestCaseScreen } from "@/components/testcase/testcasescreen"


export default async function DemoPage() {


  return (
    <div className="container mx-auto py-10">
       <Timer initialTime={300}></Timer>
       <TestCaseScreen></TestCaseScreen>
    </div>
  )
}
