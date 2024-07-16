"use client"

import React from 'react'
import TestCaseForm from './testcaseform'
import { DataTable } from '../table/generaltable'
import { columnsTestCase, TestCase } from './testcase'

async function getTestCaseData(): Promise<TestCase[]> {
    return [
        {
          id: "1",
          grader: "Grader Alpha",
          ioMethod: "Method A",
          marker: "Marker X",
          outputLimit: "10 MB",
        },
        {
          id: "2",
          grader: "Grader Beta",
          ioMethod: "Method B",
          marker: "Marker Y",
          outputLimit: "15 MB",
        },
        {
          id: "3",
          grader: "Grader Gamma",
          ioMethod: "Method C",
          marker: "Marker Z",
          outputLimit: "12 MB",
        },
        {
          id: "4",
          grader: "Grader Delta",
          ioMethod: "Method D",
          marker: "Marker W",
          outputLimit: "8 MB",
        },
        {
          id: "5",
          grader: "Grader Epsilon",
          ioMethod: "Method E",
          marker: "Marker V",
          outputLimit: "20 MB",
        },
      ];
}

export async function TestCaseScreen() {
    const data = await getTestCaseData()
  return (
    <div>
        <TestCaseForm></TestCaseForm>
        <h1 className="text-3xl mb-4 mt-8 font-bold">Quản lý Test Case</h1>
        <DataTable data={data} columns={columnsTestCase}></DataTable>
    </div>
    
  )
}

