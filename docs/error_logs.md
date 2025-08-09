Error: ./src/app/page.tsx
Error:   [31m×[0m 'import', and 'export' cannot be used outside of module code
    ╭─[[36;1;4mC:\Users\shaik\Rheo\rheo-app\src\app\page.tsx[0m:36:1]
 [2m33[0m │       console.log('Gates evaluated:', result);
 [2m34[0m │       'use client';
 [2m35[0m │ 
 [2m36[0m │ import { useState, useEffect, useCallback } from "react";
    · [35;1m──────[0m
 [2m37[0m │ import { RheoButton } from "@/components/rheo/RheoButton";
 [2m38[0m │ import { RheoCard } from "@/components/rheo/RheoCard";
 [2m39[0m │ import { DeliverableFactory } from "@/components/rheo/DeliverableFactory";
    ╰────

Caused by:
    Syntax Error
    at tr (webpack-internal:///(pages-dir-browser)/./node_modules/next/dist/compiled/next-devtools/index.js:552:164430)
    at o6 (webpack-internal:///(pages-dir-browser)/./node_modules/next/dist/compiled/next-devtools/index.js:541:62116)
    at iP (webpack-internal:///(pages-dir-browser)/./node_modules/next/dist/compiled/next-devtools/index.js:541:81700)
    at i$ (webpack-internal:///(pages-dir-browser)/./node_modules/next/dist/compiled/next-devtools/index.js:541:92800)
    at sv (webpack-internal:///(pages-dir-browser)/./node_modules/next/dist/compiled/next-devtools/index.js:541:125399)
    at eval (webpack-internal:///(pages-dir-browser)/./node_modules/next/dist/compiled/next-devtools/index.js:541:125244)
    at sm (webpack-internal:///(pages-dir-browser)/./node_modules/next/dist/compiled/next-devtools/index.js:541:125252)
    at sa (webpack-internal:///(pages-dir-browser)/./node_modules/next/dist/compiled/next-devtools/index.js:541:121554)
    at sZ (webpack-internal:///(pages-dir-browser)/./node_modules/next/dist/compiled/next-devtools/index.js:541:143648)
    at MessagePort._ (webpack-internal:///(pages-dir-browser)/./node_modules/next/dist/compiled/next-devtools/index.js:541:196942)